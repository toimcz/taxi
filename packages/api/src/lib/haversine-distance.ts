/**
 * Coordinate types for haversine distance calculation
 */
type CoordinateObject = {
	latitude?: number;
	lat?: number;
	longitude?: number;
	lng?: number;
	lon?: number;
};

type CoordinateArray = [number, number]; // [longitude, latitude]

type Coordinate = CoordinateObject | CoordinateArray;

const atan2 = Math.atan2;
const cos = Math.cos;
const sin = Math.sin;
const sqrt = Math.sqrt;
const PI = Math.PI;

// equatorial mean radius of Earth (in meters)
const R = 6378137;

/**
 * Squares a number
 *
 * @param {number} x - The number to square
 * @returns {number} The squared value
 */
function squared(x: number): number {
	return x * x;
}

/**
 * Converts degrees to radians
 *
 * @param {number} x - The value in degrees
 * @returns {number} The value in radians
 */
function toRad(x: number): number {
	return (x * PI) / 180.0;
}

/**
 * Calculates the haversine of an angle
 *
 * @param {number} x - The angle in radians
 * @returns {number} The haversine value
 */
function hav(x: number): number {
	return squared(sin(x / 2));
}

/**
 * Calculates the haversine distance between two coordinates
 *
 * @param {Coordinate} a - First coordinate (array [lng, lat] or object with lat/lng properties)
 * @param {Coordinate} b - Second coordinate (array [lng, lat] or object with lat/lng properties)
 * @returns {number} Distance in meters
 * @throws {Error} If coordinates are invalid or missing required properties
 * @example
 * // Using coordinate objects
 * const distance = haversine(
 *   { latitude: 40.7128, longitude: -74.0060 },
 *   { lat: 34.0522, lng: -118.2437 }
 * );
 *
 * // Using coordinate arrays [longitude, latitude]
 * const distance = haversine(
 *   [-74.0060, 40.7128],
 *   [-118.2437, 34.0522]
 * );
 */
function haversine(a: Coordinate, b: Coordinate): number {
	const aLatValue = Array.isArray(a) ? a[1] : (a.latitude ?? a.lat);
	const bLatValue = Array.isArray(b) ? b[1] : (b.latitude ?? b.lat);
	const aLngValue = Array.isArray(a) ? a[0] : (a.longitude ?? a.lng ?? a.lon);
	const bLngValue = Array.isArray(b) ? b[0] : (b.longitude ?? b.lng ?? b.lon);

	if (
		aLatValue === undefined ||
		bLatValue === undefined ||
		aLngValue === undefined ||
		bLngValue === undefined
	) {
		throw new Error("Invalid coordinates: latitude and longitude values are required");
	}

	const aLat = toRad(aLatValue);
	const bLat = toRad(bLatValue);
	const aLng = toRad(aLngValue);
	const bLng = toRad(bLngValue);

	const ht = hav(bLat - aLat) + cos(aLat) * cos(bLat) * hav(bLng - aLng);
	return 2 * R * atan2(sqrt(ht), sqrt(1 - ht));
}

export { haversine, type Coordinate, type CoordinateArray, type CoordinateObject };
