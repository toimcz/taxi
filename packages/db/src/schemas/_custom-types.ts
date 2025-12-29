import { nameCase } from "@foundernest/namecase";
import { sql } from "drizzle-orm";
import { customType, timestamp, uuid } from "drizzle-orm/pg-core";

// Performance optimization: Pre-compile regex patterns
const PHONE_CLEANUP_REGEX = /[^\d+]/g;
const PLUS_CLEANUP_REGEX = /\+/g;
const WHITESPACE_NORMALIZE_REGEX = /\s+/g;
const LEADING_PLUS_REGEX = /^\+/;

// Validation constants
const MIN_PHONE_DIGITS = 7;
const MAX_PHONE_DIGITS = 15;
const MAX_NAME_LENGTH = 100;
const DECIMAL_PLACES = 2;

export const primaryUUID = (name: string) =>
	uuid(name).primaryKey().default(sql`uuid_generate_v7()`);

export const defaultColumns = {
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.notNull()
		.$onUpdate(() => new Date()),
} as const;

export const phone = customType<{ data: string }>({
	dataType() {
		return "varchar(20)";
	},
	toDriver(value) {
		if (!value || typeof value !== "string") {
			return "";
		}

		const trimmed = value.trim();
		if (!trimmed) {
			return "";
		}

		// Normalize phone number: keep only digits and leading +
		const normalized = trimmed.replace(PHONE_CLEANUP_REGEX, "");

		// Ensure + is only at the beginning
		const cleaned = normalized.replace(PLUS_CLEANUP_REGEX, (match, offset) =>
			offset === 0 ? match : "",
		);

		// Basic validation: phone numbers should be 7-15 digits (E.164 standard)
		const digitCount = cleaned.replace(LEADING_PLUS_REGEX, "").length;
		if (digitCount < MIN_PHONE_DIGITS || digitCount > MAX_PHONE_DIGITS) {
			return "";
		}

		return cleaned;
	},
	fromDriver(value): string {
		return (value as string) || "";
	},
});

export const name = customType<{ data: string }>({
	dataType() {
		return "varchar(100)";
	},
	toDriver(value) {
		if (!value || typeof value !== "string") {
			return "";
		}

		const trimmed = value.trim();
		if (!trimmed) {
			return "";
		}

		// Remove excessive whitespace and normalize
		const normalized = trimmed.replace(WHITESPACE_NORMALIZE_REGEX, " ");

		// Validate length (names shouldn't be too long)
		if (normalized.length > MAX_NAME_LENGTH) {
			return "";
		}

		try {
			return nameCase(normalized);
		} catch {
			// Fallback if nameCase fails
			return normalized;
		}
	},
	fromDriver(value): string {
		return (value as string) || "";
	},
});

export const amount = customType<{ data: number }>({
	dataType() {
		return "integer";
	},
	toDriver(value) {
		if (value == null || typeof value !== "number" || !Number.isFinite(value)) {
			return 0;
		}
		// Use precise decimal arithmetic to avoid floating-point issues
		// Convert to string, multiply by 100, then parse to avoid precision loss
		const stringValue = value.toFixed(DECIMAL_PLACES);
		const cents = Math.round(Number.parseFloat(stringValue) * 100);
		return cents;
	},
	fromDriver(value) {
		const numValue = Number(value);
		if (!Number.isFinite(numValue)) {
			return 0;
		}
		// Convert cents back to dollars with proper precision
		return Math.round(numValue) / 100;
	},
});

export const polygon = customType<{ data: string | null }>({
	dataType() {
		return "geometry(MultiPolygon, 4326)";
	},
	toDriver(value) {
		if (!value || typeof value !== "string") {
			return null;
		}
		const trimmed = value.trim();
		return trimmed || null;
	},
	fromDriver(value): string | null {
		if (!value) {
			return null;
		}
		return value as string;
	},
});

export const koeficient = customType<{ data: number }>({
	dataType() {
		return "numeric(5,2)";
	},
	toDriver(value) {
		if (value == null || typeof value !== "number" || !Number.isFinite(value)) {
			return 1.0; // Default to 1.00
		}
		// Round to 2 decimal places to match numeric(5,2) precision
		return Math.round(value * 100) / 100;
	},
	fromDriver(value) {
		const numValue = Number(value);
		return Number.isFinite(numValue) ? numValue : 1.0;
	},
});
