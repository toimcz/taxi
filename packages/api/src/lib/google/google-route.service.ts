import { CacheService } from "../cache";
import { Logger } from "../logger";

/**
 * Response type from Google Routes API v2
 */
interface GoogleRouteResponse {
	routes: Array<{
		distanceMeters?: number;
		duration?: string;
	}>;
}

/**
 * Geographic coordinate point
 */
export interface Point {
	lat: number;
	lng: number;
}

/**
 * Route calculation result
 */
export interface RouteResult {
	distance: number; // Distance in kilometers
	duration: number; // Duration in seconds
}

/**
 * Google Routes Service
 * Calculates routes between two geographic points using Google Routes API v2.
 * Features: retry logic, timeout handling, coordinate validation.
 * Note: Caching is handled by DistancesService using database storage.
 */
export class GoogleRouteService {
	private readonly URL = "https://routes.googleapis.com/directions/v2:computeRoutes";
	private readonly apiKey: string;
	private readonly logger: Logger;
	private readonly cache: CacheService;
	private readonly TIMEOUT_MS = 10000; // 10 seconds timeout
	private readonly MAX_RETRIES = 3;
	private readonly RETRY_DELAY_MS = 1000;
	private readonly CACHE_TTL = 10; // 10 seconds cache TTL

	constructor(apiKey: string) {
		if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length === 0) {
			throw new Error("Google API key is required and must be a non-empty string");
		}
		this.apiKey = apiKey;
		this.logger = new Logger("GoogleRouteService");
		this.cache = new CacheService("google_routes");
	}

	/**
	 * Calculate route between two geographic points
	 * @param from Starting point coordinates
	 * @param to Destination point coordinates
	 * @returns Route distance in kilometers and duration in seconds
	 */
	async get(from: Point, to: Point): Promise<RouteResult> {
		try {
			// Validate input coordinates
			this.validateCoordinates(from, "from");
			this.validateCoordinates(to, "to");

			// Early return for same coordinates with higher precision
			if (this.areSameCoordinates(from, to)) {
				this.logger.debug("Same coordinates provided, returning zero distance and duration");
				return {
					distance: 0,
					duration: 0,
				};
			}

			// Generate cache key from coordinates
			const cacheKey = this.generateCacheKey(from, to);

			// Check cache first
			try {
				const cached = await this.cache.get<RouteResult>(cacheKey);
				if (cached) {
					this.logger.debug("Cache hit for route", { from, to });
					return cached;
				}
			} catch (cacheError) {
				this.logger.warn("Cache read failed, continuing with API request", {
					error: cacheError instanceof Error ? cacheError.message : String(cacheError),
				});
			}

			// Fetch route data
			const response = await this.fetchRouteWithRetry(from, to);
			const result = this.parseRouteResponse(response);

			// Cache the result
			try {
				await this.cache.set(cacheKey, result, this.CACHE_TTL);
				this.logger.debug("Cached route result", { from, to });
			} catch (cacheError) {
				this.logger.warn("Failed to cache route result", {
					error: cacheError instanceof Error ? cacheError.message : String(cacheError),
				});
			}

			return result;
		} catch (error) {
			this.logger.error("Failed to get route", {
				from,
				to,
				error: error instanceof Error ? error.message : "Unknown error",
			});
			throw error;
		}
	}

	private validateCoordinates(point: Point, pointName: string): void {
		if (Number.isNaN(point.lat) || Number.isNaN(point.lng)) {
			throw new Error(`Invalid ${pointName} coordinates`);
		}
	}

	private areSameCoordinates(from: Point, to: Point): boolean {
		// Use a reasonable epsilon for floating point comparison (about 1 meter precision)
		const epsilon = 1e-6;
		const latDiff = Math.abs(from.lat - to.lat);
		const lngDiff = Math.abs(from.lng - to.lng);

		// Consider points the same if they're within ~1 meter of each other
		return latDiff < epsilon && lngDiff < epsilon;
	}

	private async fetchRouteWithRetry(from: Point, to: Point): Promise<GoogleRouteResponse> {
		let lastError: Error | null = null;

		for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
			try {
				const response = await this.fetchRoute(from, to);

				if (attempt > 1) {
					this.logger.info(`Route fetch succeeded on attempt ${attempt}`);
				}

				return response;
			} catch (error: unknown) {
				lastError = error instanceof Error ? error : new Error(String(error));

				if (attempt === this.MAX_RETRIES) {
					break;
				}

				this.logger.warn(`Route fetch attempt ${attempt} failed, retrying...`, {
					error: error instanceof Error ? error.message : "Unknown error",
					attempt,
					nextRetryDelay: this.RETRY_DELAY_MS * attempt,
				});

				// Exponential backoff
				await this.delay(this.RETRY_DELAY_MS * attempt);
			}
		}

		this.logger.error("Failed to fetch route after all retries", {
			maxRetries: this.MAX_RETRIES,
			error: lastError?.message,
		});

		throw lastError ?? new Error("Failed to fetch route after all retries");
	}

	private async fetchRoute(from: Point, to: Point): Promise<GoogleRouteResponse> {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

		try {
			const requestBody = {
				origin: {
					location: {
						latLng: {
							latitude: from.lat,
							longitude: from.lng,
						},
					},
				},
				destination: {
					location: {
						latLng: {
							latitude: to.lat,
							longitude: to.lng,
						},
					},
				},
				languageCode: "cs-CZ",
				travelMode: "DRIVE",
				routingPreference: "TRAFFIC_UNAWARE",
				computeAlternativeRoutes: false,
				routeModifiers: {
					avoidTolls: false,
					avoidHighways: false,
					avoidFerries: true,
				},
				units: "METRIC",
			};

			this.logger.debug("Fetching route from Google Routes API", {
				from,
				to,
			});

			const response = await fetch(this.URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Goog-Api-Key": this.apiKey,
					"X-Goog-FieldMask": "routes.duration,routes.distanceMeters",
				},
				body: JSON.stringify(requestBody),
				signal: controller.signal,
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				const errorText = await response.text().catch(() => "Unknown error");
				this.logger.error("Google Routes API error", {
					status: response.status,
					statusText: response.statusText,
					errorText,
				});

				throw new Error(`Google Routes API error: ${response.status} ${response.statusText}`);
			}

			const data = (await response.json()) as GoogleRouteResponse;

			if (!data.routes || data.routes.length === 0) {
				this.logger.error("No routes found in Google Routes API response", {
					from,
					to,
				});
				throw new Error("No routes found for the given coordinates");
			}

			this.logger.debug("Successfully fetched route", {
				distance: data.routes[0]?.distanceMeters,
				duration: data.routes[0]?.duration,
			});

			return data;
		} catch (error: unknown) {
			clearTimeout(timeoutId);

			// Handle fetch errors
			if (error instanceof Error) {
				if (error.name === "AbortError") {
					throw new Error(`Request timeout after ${this.TIMEOUT_MS}ms`);
				}

				// Re-throw with context
				throw error;
			}

			// Re-throw non-Error objects as-is
			throw error;
		}
	}

	private parseRouteResponse(data: GoogleRouteResponse): RouteResult {
		const route = data.routes[0];

		if (!route) {
			throw new Error("No route data in response");
		}

		const { distanceMeters, duration: durationString } = route;

		// Parse distance (convert meters to kilometers)
		const distance = distanceMeters !== undefined ? Math.round(distanceMeters / 1000) : 0;

		// Parse duration
		const duration = this.parseDuration(durationString);

		return { distance, duration };
	}

	/**
	 * Parse duration string from Google API
	 * Supports format: "3600s" (most common) and complex format "1h 30m 45s"
	 */
	private parseDuration(durationString: string | undefined): number {
		if (!durationString) {
			return 0;
		}

		// Handle simple seconds format "3600s" (most common)
		const simpleSecondsMatch = durationString.match(/^(\d+)s$/);
		if (simpleSecondsMatch?.[1]) {
			const seconds = Number.parseInt(simpleSecondsMatch[1], 10);
			return Number.isNaN(seconds) ? 0 : seconds;
		}

		// Handle complex format "1h 30m 45s" (rare)
		let totalSeconds = 0;

		// Extract hours
		const hoursMatch = durationString.match(/(\d+)h/);
		if (hoursMatch?.[1]) {
			totalSeconds += Number.parseInt(hoursMatch[1], 10) * 3600;
		}

		// Extract minutes
		const minutesMatch = durationString.match(/(\d+)m/);
		if (minutesMatch?.[1]) {
			totalSeconds += Number.parseInt(minutesMatch[1], 10) * 60;
		}

		// Extract seconds
		const secondsMatch = durationString.match(/(\d+)s/);
		if (secondsMatch?.[1]) {
			totalSeconds += Number.parseInt(secondsMatch[1], 10);
		}

		return totalSeconds;
	}

	private delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * Generate a cache key from two coordinate points
	 * Uses rounded coordinates to allow for small variations in the same route
	 */
	private generateCacheKey(from: Point, to: Point): string {
		// Round coordinates to 6 decimal places (~0.1 meter precision)
		// This allows caching of routes that are very close to each other
		const round = (n: number) => Math.round(n * 1_000_000) / 1_000_000;
		return `route:${round(from.lat)},${round(from.lng)}:${round(to.lat)},${round(to.lng)}`;
	}
}
