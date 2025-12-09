import { nameCase } from "@foundernest/namecase";
import slugify from "slugify";

/**
 * Regex that matches Unicode combining diacritic marks (NFD).
 * Used to strip accents after `String.prototype.normalize('NFD')`.
 */
const DIACRITICS_REGEX = /[\u0300-\u036f]/g;

/**
 * String/text utilities tailored for Czech locale needs.
 */
export const text = {
	/**
	 * Removes accents/diacritics from a string safely.
	 * Falls back to original input if normalization fails.
	 *
	 * @param str Input string possibly containing diacritics (e.g., "Č, Ř, Š").
	 * @returns String without diacritic marks.
	 * @example
	 * text.removeAccents('Český název') // 'Cesky nazev'
	 */
	removeAccents: (str: string): string => {
		try {
			return str.normalize("NFD").replace(DIACRITICS_REGEX, "");
		} catch {
			return str;
		}
	},

	/**
	 * Generates a URL-friendly slug.
	 * - Normalizes and strips diacritics
	 * - Lowercases, trims, and uses strict filtering
	 *
	 * @param str Input string to slugify.
	 * @returns Slugified string (e.g., 'český název' => 'cesky-nazev').
	 * @example
	 * text.slug('  Český Název! ') // 'cesky-nazev'
	 */
	slug: (str: string): string => {
		try {
			const normalized = str.normalize("NFD").replace(DIACRITICS_REGEX, "");
			return slugify(normalized, { lower: true, strict: true, trim: true });
		} catch {
			return str;
		}
	},

	/**
	 * Capitalizes the first character of a string.
	 * Returns the original value for empty strings.
	 *
	 * @param str Input string.
	 * @returns String with the first character uppercased.
	 * @example
	 * text.capitalize('taxi') // 'Taxi'
	 */
	capitalize: (str: string): string => {
		if (!str) return str;
		return str.charAt(0).toUpperCase() + str.slice(1);
	},

	/**
	 * Formats a name (person/brand) to proper case.
	 * Uses `@foundernest/namecase` under the hood.
	 *
	 * @param str Name string.
	 * @returns Properly cased and trimmed name.
	 * @example
	 * text.name('jAn noVák') // 'Jan Novák'
	 */
	name: (str: string): string => nameCase(str).trim(),

	/**
	 * Formats duration in seconds to Czech text using hours/minutes, or seconds for < 60s.
	 * Abbreviations with `type='short'` (e.g., 'hod', 'min', 's').
	 *
	 * @param seconds Total duration in seconds.
	 * @param type 'short' for abbreviations, 'long' for full words (default: 'long').
	 * @returns Human-readable duration, e.g., '2 hodiny 5 minut' or '45 s'.
	 * @example
	 * text.duration(3600) // '1 hodina'
	 * text.duration(125 * 60) // '2 hodiny 5 minut'
	 * text.duration(45, 'short') // '45 s'
	 */
	duration(seconds: number, type: "short" | "long" = "long") {
		const short = type === "short";
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const min = minutes % 60;
		const sec = Math.floor(seconds % 60);

		const parts: string[] = [];
		if (hours > 0) parts.push(`${hours} ${hoursText(hours, short)}`);
		if (min > 0) parts.push(`${min} ${minutesText(min, short)}`);
		if (parts.length === 0) parts.push(`${sec} ${secondsText(sec, short)}`);
		return parts.join(" ");
	},

	/**
	 * Formats a price as Czech Koruna (CZK) for the 'cs-CZ' locale.
	 * The `decimals` argument controls both minimum and maximum fraction digits.
	 *
	 * @param price Numeric amount.
	 * @param decimals Number of fraction digits (default 0).
	 * @returns Localized currency string.
	 * @example
	 * text.price(199) // '199 Kč'
	 * text.price(199.5, 2) // '199,50 Kč'
	 */
	price: (price: number, decimals = 0): string =>
		price.toLocaleString("cs-CZ", {
			style: "currency",
			currency: "CZK",
			minimumFractionDigits: decimals,
			maximumFractionDigits: decimals,
		}),
};

/**
 * Returns Czech hour unit with correct pluralization.
 * Short form always returns 'hod'.
 *
 * @internal
 * @param hours Number of hours.
 * @param short When true, returns the short abbreviation.
 */
function hoursText(hours: number, short = false): string {
	if (short) return "hod";
	if (hours === 1) return "hodina";
	if (
		hours % 10 >= 2 &&
		hours % 10 <= 4 &&
		(hours % 100 < 12 || hours % 100 > 14)
	)
		return "hodiny";
	return "hodin";
}

/**
 * Returns Czech minute unit with correct pluralization.
 * Short form always returns 'min'.
 *
 * @internal
 * @param minutes Number of minutes.
 * @param short When true, returns the short abbreviation.
 */
function minutesText(minutes: number, short = false): string {
	if (short) return "min";
	if (minutes === 1) return "minuta";
	if (
		minutes % 10 >= 2 &&
		minutes % 10 <= 4 &&
		(minutes % 100 < 12 || minutes % 100 > 14)
	)
		return "minuty";
	return "minut";
}

/**
 * Returns Czech second unit with correct pluralization.
 * Short form always returns 's'.
 *
 * @internal
 * @param seconds Number of seconds.
 * @param short When true, returns the short abbreviation.
 */
function secondsText(seconds: number, short = false): string {
	if (short) return "s";
	if (seconds === 1) return "sekunda";
	if (
		seconds % 10 >= 2 &&
		seconds % 10 <= 4 &&
		(seconds % 100 < 12 || seconds % 100 > 14)
	)
		return "sekundy";
	return "sekund";
}
