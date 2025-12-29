import slugify from "slugify";

function slug(text: string): string {
	return slugify(text.replaceAll("|", "-"), { lower: true, strict: true });
}

function capitalize(text: string): string {
	return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Removes diacritics from a string.
 * @param text - The string to remove diacritics from.
 * @returns The string without diacritics.
 */
function removeDiacritics(text: string): string {
	return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function hoursText(hours: number, short = false): string {
	switch (hours) {
		case 1:
			return short ? "hod" : "hodina";
		case 2:
		case 3:
		case 4:
			return short ? "hod" : "hodiny";
		default:
			return short ? "hod" : "hodin";
	}
}

function minutesText(minutes: number, short = false): string {
	switch (minutes) {
		case 1:
			return short ? "min" : "minuta";
		case 2:
		case 3:
		case 4:
			return short ? "min" : "minuty";
		default:
			return short ? "min" : "minut";
	}
}

function duration(seconds: number, type: "short" | "long" = "long") {
	const short = type === "short";
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const min = minutes % 60;

	let duration = hours > 0 ? `${String(hours)} ${hoursText(hours, short)}` : "";
	duration += min > 0 ? ` ${String(min)} ${minutesText(min, short)}` : "";
	return duration.trim();
}

export const text = {
	slug,
	capitalize,
	duration,
	removeDiacritics,
};
