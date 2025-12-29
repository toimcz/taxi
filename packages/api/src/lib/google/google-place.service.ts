import { CacheService } from "../cache";
import { Logger } from "../logger";

interface GooglePlaceResponse {
	status: string;
	result: {
		place_id: string;
		name: string;
		types: string[];
		address_components: {
			types: string[];
			long_name: string;
		}[];
		geometry: {
			location: {
				lat: number;
				lng: number;
			};
		};
	};
}

export interface GooglePlace {
	placeId: string;
	name: string;
	street: string;
	city: string;
	country: string;
	type: string;
	lat: number;
	lng: number;
	label: string;
	zip: string;
}

export type GoogleGeoCodeResponse = {
	status: string;
	results: {
		place_id: string;
	}[];
};

export class GooglePlaceService {
	private readonly logger = new Logger("GooglePlaceService");
	private readonly cache: CacheService;
	private readonly GOOGLE_URL = "https://maps.googleapis.com/maps/api";
	private readonly apiKey: string;
	private readonly TYPES =
		"locality,route,street_address,street_number,point_of_interest,lodging,airport,bus_station,train_station,zoo";
	private readonly TIMEOUT_MS = 10000; // 10 seconds timeout
	private readonly MAX_RETRIES = 3;
	private readonly RETRY_DELAY_MS = 1000;
	private readonly CACHE_TTL = 86400; // 24 hours in seconds

	// Request deduplication map to prevent duplicate concurrent requests
	private readonly pendingRequests = new Map<string, Promise<GooglePlace | null>>();

	constructor(apiKey: string) {
		if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length === 0) {
			throw new Error("Google API key is required and must be a non-empty string");
		}
		this.apiKey = apiKey;
		this.cache = new CacheService("google_places");
		this.logger.info("GooglePlaceService initialized");
	}

	async getByPlaceId(placeId: string): Promise<GooglePlace> {
		if (!placeId || typeof placeId !== "string" || placeId.trim().length === 0) {
			this.logger.error("Invalid place ID provided", { placeId });
			throw new Error("Place ID is required and must be a non-empty string");
		}

		const trimmedPlaceId = placeId.trim();
		const cacheKey = `place_id:${trimmedPlaceId}`;

		// Check cache first
		try {
			const cached = await this.cache.get<GooglePlace>(cacheKey);
			if (cached) {
				this.logger.debug("Cache hit for place ID", {
					placeId: trimmedPlaceId,
				});
				return cached;
			}
		} catch (cacheError) {
			this.logger.warn("Cache read failed, continuing with API request", {
				error: cacheError instanceof Error ? cacheError.message : String(cacheError),
			});
		}

		// Check for pending request (deduplication)
		const pendingRequest = this.pendingRequests.get(cacheKey);
		if (pendingRequest) {
			this.logger.debug("Returning pending request for place ID", {
				placeId: trimmedPlaceId,
			});
			return (await pendingRequest) as GooglePlace;
		}

		// Create new request
		const request = this.fetchPlaceById(trimmedPlaceId, cacheKey);
		this.pendingRequests.set(cacheKey, request);

		try {
			const result = await request;
			return result as GooglePlace;
		} finally {
			this.pendingRequests.delete(cacheKey);
		}
	}

	private async fetchPlaceById(placeId: string, cacheKey: string): Promise<GooglePlace> {
		try {
			this.logger.debug("Fetching place from Google API", { placeId });

			const url = new URL(`${this.GOOGLE_URL}/place/details/json`);
			url.searchParams.append("place_id", placeId);
			url.searchParams.append("language", "cs");
			url.searchParams.append(
				"fields",
				"place_id,name,geometry,formatted_address,types,address_components",
			);
			url.searchParams.append("key", this.apiKey);

			const data = await this.fetchWithRetry<GooglePlaceResponse>(url.href);

			if (data.status !== "OK") {
				this.logger.error("Google Place API returned non-OK status", {
					placeId,
					status: data.status,
				});
				throw new Error(`Google Place API error: ${data.status}`);
			}

			if (!data.result) {
				this.logger.error("No result in Google Place API response", {
					placeId,
				});
				throw new Error("No result found in Google Place API response");
			}

			const place = this.serialize(data.result);

			// Cache the result
			try {
				await this.cache.set(cacheKey, place, this.CACHE_TTL);
				this.logger.debug("Cached place data", { placeId });
			} catch (cacheError) {
				this.logger.warn("Failed to cache place data", {
					error: cacheError instanceof Error ? cacheError.message : String(cacheError),
				});
			}

			return place;
		} catch (error) {
			this.logger.error("Failed to fetch place by ID", {
				placeId,
				error: error instanceof Error ? error.message : String(error),
				stack: error instanceof Error ? error.stack : undefined,
			});
			throw error;
		}
	}

	async getPlaceByName(input: string): Promise<GooglePlace | null> {
		if (!input || typeof input !== "string" || input.trim().length === 0) {
			this.logger.error("Invalid input provided", { input });
			throw new Error("Input is required and must be a non-empty string");
		}

		const trimmedInput = input.trim();
		const cacheKey = `geocode:${trimmedInput.toLowerCase()}`;

		// Check cache first
		try {
			const cached = await this.cache.get<GooglePlace | null>(cacheKey);
			if (cached !== null) {
				this.logger.debug("Cache hit for geocode", { input: trimmedInput });
				return cached;
			}
		} catch (cacheError) {
			this.logger.warn("Cache read failed, continuing with API request", {
				error: cacheError instanceof Error ? cacheError.message : String(cacheError),
			});
		}

		// Check for pending request (deduplication)
		const pendingRequest = this.pendingRequests.get(cacheKey);
		if (pendingRequest) {
			this.logger.debug("Returning pending request for geocode", {
				input: trimmedInput,
			});
			return await pendingRequest;
		}

		// Create new request
		const request = this.fetchPlaceByName(trimmedInput, cacheKey);
		this.pendingRequests.set(cacheKey, request);

		try {
			return await request;
		} finally {
			this.pendingRequests.delete(cacheKey);
		}
	}

	private async fetchPlaceByName(input: string, cacheKey: string): Promise<GooglePlace | null> {
		try {
			this.logger.debug("Geocoding address", { input });

			const url = new URL(`${this.GOOGLE_URL}/geocode/json`);
			url.searchParams.append("address", input);
			url.searchParams.append("types", this.TYPES);
			url.searchParams.append("language", "cs");
			url.searchParams.append("key", this.apiKey);

			const data = await this.fetchWithRetry<GoogleGeoCodeResponse>(url.href);

			if (data.status === "ZERO_RESULTS") {
				this.logger.debug("No results found for input", { input });
				// Cache null result to prevent repeated API calls for invalid addresses
				try {
					await this.cache.set(cacheKey, null, this.CACHE_TTL);
				} catch (cacheError) {
					this.logger.warn("Failed to cache null result", {
						error: cacheError instanceof Error ? cacheError.message : String(cacheError),
					});
				}
				return null;
			}

			if (data.status !== "OK") {
				this.logger.error("Google Geocoding API returned non-OK status", {
					input,
					status: data.status,
				});
				throw new Error(`Google Geocoding API error: ${data.status}`);
			}

			if (!data.results || data.results.length === 0) {
				this.logger.debug("No results in geocoding response", { input });
				return null;
			}

			const placeId = data.results[0]?.place_id;
			if (!placeId) {
				this.logger.error("No place ID found in geocoding results", { input });
				throw new Error("No place ID found in geocoding results");
			}

			const place = await this.getByPlaceId(placeId);

			// Cache the result (getByPlaceId already caches by place_id, this caches by name)
			try {
				await this.cache.set(cacheKey, place, this.CACHE_TTL);
				this.logger.debug("Cached geocode result", { input });
			} catch (cacheError) {
				this.logger.warn("Failed to cache geocode result", {
					error: cacheError instanceof Error ? cacheError.message : String(cacheError),
				});
			}

			return place;
		} catch (error) {
			this.logger.error("Failed to get place by name", {
				input,
				error: error instanceof Error ? error.message : String(error),
				stack: error instanceof Error ? error.stack : undefined,
			});
			throw error;
		}
	}

	private async fetchWithRetry<T>(url: string): Promise<T> {
		let lastError: Error | null = null;

		for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
			try {
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

				try {
					const response = await fetch(url, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
						signal: controller.signal,
					});

					clearTimeout(timeoutId);

					if (!response.ok) {
						const errorText = await response.text();
						const errorMsg = `HTTP ${response.status} ${response.statusText}: ${errorText}`;
						this.logger.error("Google API request failed", {
							status: response.status,
							statusText: response.statusText,
							error: errorText,
						});
						throw new Error(errorMsg);
					}

					const data = (await response.json()) as T;

					if (attempt > 1) {
						this.logger.info("Request succeeded after retry", { attempt });
					}

					return data;
				} catch (fetchError) {
					clearTimeout(timeoutId);
					throw fetchError;
				}
			} catch (error) {
				lastError = error instanceof Error ? error : new Error(String(error));

				if (attempt < this.MAX_RETRIES) {
					const delay = this.RETRY_DELAY_MS * attempt;
					this.logger.warn("Request failed, retrying...", {
						attempt,
						maxRetries: this.MAX_RETRIES,
						delay,
						error: lastError.message,
						isTimeout: lastError.name === "AbortError",
					});
					await this.delay(delay);
				} else {
					this.logger.error("All retries exhausted", {
						attempts: this.MAX_RETRIES,
						error: lastError.message,
					});
				}
			}
		}

		throw lastError ?? new Error("All retries failed");
	}

	private delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	private serialize(result: GooglePlaceResponse["result"]): GooglePlace {
		// Validate required fields
		if (!result.place_id) {
			this.logger.error("Missing place_id in result");
			throw new Error("Invalid Google Place response: missing place_id");
		}

		if (!result.name) {
			this.logger.error("Missing name in result", { placeId: result.place_id });
			throw new Error("Invalid Google Place response: missing name");
		}

		if (!result.geometry?.location) {
			this.logger.error("Missing geometry.location in result", {
				placeId: result.place_id,
			});
			throw new Error("Invalid Google Place response: missing geometry");
		}

		if (!result.address_components || result.address_components.length === 0) {
			this.logger.error("Missing address_components in result", {
				placeId: result.place_id,
			});
			throw new Error("Invalid Google Place response: missing address components");
		}

		const { address_components, types, geometry } = result;
		const placeId = result.place_id;
		const { name } = result;
		const street = this.getStreet(address_components);
		const city = this.getCity(address_components);
		const country = this.getCountry(address_components);
		const type = this.getType(types || []);
		const { lat, lng } = geometry.location;
		const label = this.getLabel(name, street, city, country);
		const zip = this.getPostal(address_components);

		return {
			placeId,
			name,
			street,
			city,
			country,
			type,
			lat: Number(lat),
			lng: Number(lng),
			label,
			zip,
		};
	}

	private getCity(address_components: GooglePlaceResponse["result"]["address_components"]): string {
		const cityTypes = [
			"locality", // Primary city name
			"administrative_area_level_2", // County/District (used as city in some countries)
			"sublocality_level_1", // Boroughs or districts in large cities
			"administrative_area_level_1", // State/Region (last resort)
		];

		// Maintain priority order by checking each type in sequence
		for (const type of cityTypes) {
			const component = address_components.find((comp) => comp.types.includes(type));
			if (component?.long_name) {
				return this.parseCity(component.long_name);
			}
		}

		this.logger.error("City not found in address components", {
			availableTypes: address_components.flatMap((c) => c.types),
		});
		throw new Error("City not found in address components");
	}

	private getType(types: GooglePlaceResponse["result"]["types"]): string {
		const typeMap: Record<string, string> = {
			locality: "city",
			street_address: "street",
			lodging: "hotel",
			train_station: "train_station",
			bus_station: "bus_station",
			airport: "airport",
		};

		for (const [googleType, mappedType] of Object.entries(typeMap)) {
			if (types.includes(googleType)) {
				return mappedType;
			}
		}

		return types[0] || "";
	}

	private getStreet(
		address_components: GooglePlaceResponse["result"]["address_components"],
	): string {
		let street = "";
		let number = "";

		for (const component of address_components) {
			if (component.types.includes("route")) {
				street = component.long_name;
			}
			if (component.types.includes("street_number")) {
				number = component.long_name;
			}
		}

		if (!street || !number) {
			return street;
		}

		return `${street} ${number}`.trim();
	}

	private getCountry(
		address_components: GooglePlaceResponse["result"]["address_components"],
	): string {
		for (const component of address_components) {
			if (component.types.includes("country") && component.long_name) {
				return component.long_name;
			}
		}

		this.logger.error("Country not found in address components", {
			availableTypes: address_components.flatMap((c) => c.types),
		});
		throw new Error("Country not found in address components");
	}

	private getPostal(
		address_components: GooglePlaceResponse["result"]["address_components"],
	): string {
		for (const component of address_components) {
			if (component.types.includes("postal_code")) {
				return component.long_name;
			}
		}

		return "";
	}

	private getLabel(name: string, street: string, city: string, country: string): string {
		const search = [name, street, city, country];
		return [...new Set(search.filter((s) => s !== ""))].join(", ");
	}

	private parseCity(city: string): string {
		const cleanedCity = city.replaceAll(/\d+/g, "").trim();

		// Handle special cases
		const cityMappings: Record<string, string> = {
			"Hlavní město Praha": "Praha",
		};

		return cityMappings[cleanedCity] || cleanedCity;
	}
}
