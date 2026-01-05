/**
 * String/text utilities tailored for Czech locale needs.
 */
export declare const text: {
    /**
     * Removes accents/diacritics from a string safely.
     * Falls back to original input if normalization fails.
     *
     * @param str Input string possibly containing diacritics (e.g., "Č, Ř, Š").
     * @returns String without diacritic marks.
     * @example
     * text.removeAccents('Český název') // 'Cesky nazev'
     */
    removeAccents: (str: string) => string;
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
    slug: (str: string) => string;
    /**
     * Capitalizes the first character of a string.
     * Returns the original value for empty strings.
     *
     * @param str Input string.
     * @returns String with the first character uppercased.
     * @example
     * text.capitalize('taxi') // 'Taxi'
     */
    capitalize: (str: string) => string;
    /**
     * Formats a name (person/brand) to proper case.
     * Uses `@foundernest/namecase` under the hood.
     *
     * @param str Name string.
     * @returns Properly cased and trimmed name.
     * @example
     * text.name('jAn noVák') // 'Jan Novák'
     */
    name: (str: string) => string;
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
    duration(seconds: number, type?: "short" | "long"): string;
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
    price: (price: number, decimals?: number) => string;
};
//# sourceMappingURL=text.d.ts.map