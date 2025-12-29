import { config } from "../../config";
import { CacheService } from "../../lib/cache";
import { Logger } from "../../lib/logger";

/**
 * Google Places Autocomplete API response types
 */
export interface AutocompleteSuggestion {
	placePrediction: {
		placeId: string;
		text: {
			text: string;
		};
		structuredFormat: {
			mainText: {
				text: string;
			};
			secondaryText: {
				text: string;
			};
		};
		types: string[];
	};
}

export interface AutocompleteResponse {
	suggestions?: AutocompleteSuggestion[];
	error?: {
		code: number;
		message: string;
		status: string;
	};
}

/**
 * Service for handling Google Places Autocomplete API requests
 * with caching, request deduplication, and proper error handling.
 */
export class PlacesAutocompleteService {
	readonly #logger = new Logger("PlacesAutocompleteService");
	readonly #cache = new CacheService("places:autocomplete");

	// Request deduplication: Store in-flight requests
	readonly #pendingRequests = new Map<string, Promise<AutocompleteSuggestion[]>>();

	// Configuration
	readonly #cachePrefix = "places:autocomplete:";
	readonly #cacheTTL = 3600; // 1 hour in seconds
	readonly #requestTimeout = 5000; // 5 seconds
	readonly #googleApiUrl = "https://places.googleapis.com/v1/places:autocomplete";

	// Primary types filter (empty = all types)
	// Can be configured to restrict to specific place types
	readonly #includedPrimaryTypes: string[] = [];

	// Supported region codes for autocomplete
	readonly #includedRegionCodes = [
		"cz", // Czech Republic
		"sk", // Slovakia
		"pl", // Poland
		"hu", // Hungary
		"at", // Austria
		"de", // Germany
		"ch", // Switzerland
		"it", // Italy
		"ro", // Romania
		"fr", // France
		"es", // Spain
		"si", // Slovenia
		"hr", // Croatia
		"be", // Belgium
		"nl", // Netherlands
	] as const;

	/**
	 * Fetches autocomplete suggestions for a given query
	 * @param query - The search query
	 * @param sessionToken - Google Places API session token for billing optimization
	 * @returns Array of autocomplete suggestions
	 */
	async autocomplete(query: string, sessionToken: string): Promise<AutocompleteSuggestion[]> {
		// Input validation
		if (!query?.trim() || !sessionToken?.trim()) {
			throw new Error("Query and session token are required");
		}

		const trimmedQuery = query.trim();
		const cacheKey = this.#getCacheKey(trimmedQuery);

		// Try cache first
		try {
			const cached = await this.#getFromCache(cacheKey);
			if (cached) {
				this.#logger.debug(`Cache hit for query: "${trimmedQuery.substring(0, 50)}"`);
				return cached;
			}
		} catch (error) {
			// Log cache error but continue with API request
			this.#logger.warn("Cache read error:", error);
		}

		// Check for in-flight request (deduplication)
		const pending = this.#pendingRequests.get(cacheKey);
		if (pending) {
			this.#logger.debug(`Deduplicating request for query: "${trimmedQuery.substring(0, 50)}"`);
			return await pending;
		}

		// Create new request
		const requestPromise = this.#fetchFromGoogle(trimmedQuery, sessionToken);

		// Store in pending requests for deduplication
		this.#pendingRequests.set(cacheKey, requestPromise);

		try {
			const suggestions = await requestPromise;

			// Cache the result (fire and forget)
			this.#setCache(cacheKey, suggestions).catch((error) => {
				this.#logger.warn("Cache write error:", error);
			});

			return suggestions;
		} finally {
			// Clean up pending request
			this.#pendingRequests.delete(cacheKey);
		}
	}

	/**
	 * Fetches data from Google Places API with timeout
	 */
	async #fetchFromGoogle(query: string, sessionToken: string): Promise<AutocompleteSuggestion[]> {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.#requestTimeout);

		try {
			this.#logger.debug(`Fetching from Google API for query: "${query}"`);

			const response = await fetch(this.#googleApiUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Goog-Api-Key": config.GOOGLE_API_KEY,
					"X-Goog-FieldMask": "*",
				},
				body: JSON.stringify({
					input: query,
					sessionToken,
					includedPrimaryTypes: this.#includedPrimaryTypes,
					languageCode: "cs",
					includedRegionCodes: this.#includedRegionCodes,
				}),
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				this.#logger.error(`Google API HTTP error: ${response.status} ${response.statusText}`);

				// Handle rate limiting
				if (response.status === 429) {
					throw new Error("Rate limit exceeded. Please try again later.");
				}

				// Handle auth errors
				if (response.status === 401 || response.status === 403) {
					this.#logger.error("Google API authentication error");
					throw new Error("Places service temporarily unavailable");
				}

				throw new Error(`Failed to fetch places: ${response.status}`);
			}

			const data = (await response.json()) as AutocompleteResponse;

			// Check for API-level errors
			if (data.error) {
				this.#logger.error("Google API error:", {
					code: data.error.code,
					message: data.error.message,
					status: data.error.status,
				});
				throw new Error(`Google API error: ${data.error.message}`);
			}

			// Return empty array if no suggestions
			if (!data.suggestions || data.suggestions.length === 0) {
				this.#logger.debug(`No suggestions found for query: "${query}"`);
				return [];
			}

			this.#logger.debug(`Found ${data.suggestions.length} suggestions for query: "${query}"`);
			return data.suggestions;
		} catch (error) {
			clearTimeout(timeoutId);

			// Handle abort (timeout)
			if (error instanceof Error && error.name === "AbortError") {
				this.#logger.error(`Request timeout after ${this.#requestTimeout}ms for query: "${query}"`);
				throw new Error("Request timeout. Please try again.");
			}

			// Re-throw known errors
			if (error instanceof Error) {
				throw error;
			}

			// Log and wrap unknown errors
			this.#logger.error("Unexpected error fetching places:", error);
			throw new Error("Failed to fetch place suggestions");
		}
	}

	/**
	 * Gets cached suggestions from Redis
	 */
	async #getFromCache(cacheKey: string): Promise<AutocompleteSuggestion[] | null> {
		const cached = await this.#cache.get<AutocompleteSuggestion[]>(cacheKey);
		if (!cached) return null;

		try {
			return cached;
		} catch (error) {
			this.#logger.warn("Failed to parse cached data:", error);
			// Delete corrupted cache entry
			await this.#cache.del(cacheKey).catch(() => {});
			return null;
		}
	}

	/**
	 * Stores suggestions in Redis cache
	 */
	async #setCache(cacheKey: string, suggestions: AutocompleteSuggestion[]): Promise<void> {
		await this.#cache.set(cacheKey, suggestions, this.#cacheTTL);
	}

	/**
	 * Generates cache key from query
	 */
	#getCacheKey(query: string): string {
		// Normalize query for consistent caching
		const normalized = query.toLowerCase().trim();
		return `${this.#cachePrefix}${normalized}`;
	}

	/**
	 * Clears all cached autocomplete data (useful for testing/maintenance)
	 */
	async clearCache(): Promise<void> {
		try {
			const pattern = `${this.#cachePrefix}*`;
			await this.#cache.deleteByPattern(pattern);
			this.#logger.info("Cleared autocomplete cache");
		} catch (error) {
			this.#logger.error("Failed to clear cache:", error);
			throw new Error("Failed to clear cache");
		}
	}
}
