import sharp from "sharp";
import { Logger } from "../logger";

/**
 * Input configuration for image transformation
 */
export interface ImageInput {
	/** Image file buffer */
	file: Buffer;
	/** Original filename for logging purposes */
	name: string;
	/** Target height in pixels (optional) */
	height?: number;
	/** Target width in pixels (optional) */
	width?: number;
}

/**
 * Supported image output formats
 */
export type ImageFormat = "jpg" | "png" | "webp";

/**
 * Service for image processing and transformation using Sharp library
 * Provides optimized image resizing and format conversion with error handling
 */
export class ImagesService {
	/** Maximum allowed image dimensions for security */
	private readonly MAX_DIMENSION = 4096;
	/** Maximum file size in bytes (50MB) */
	private readonly MAX_FILE_SIZE = 50 * 1024 * 1024;

	/**
	 * Transform an image with resizing and format conversion
	 *
	 * @param input - Image input configuration
	 * @param returnFormat - Target output format
	 * @returns Promise<Buffer> - Processed image buffer
	 * @throws {Error} When input validation fails
	 * @throws {Error} When image processing fails
	 *
	 * @example
	 * ```typescript
	 * const result = await imageService.transform(
	 *   { file: buffer, name: 'image.jpg', width: 800, height: 600 },
	 *   'webp'
	 * );
	 * ```
	 */
	async transform(input: ImageInput, returnFormat: ImageFormat): Promise<Buffer> {
		const logger = new Logger("ImagesService");
		try {
			this.validateInput(input, returnFormat);

			const image = sharp(input.file);

			// Get original metadata for validation and logging
			const metadata = await image.metadata();
			this.validateImageMetadata(metadata, input.name);

			// Apply resizing if dimensions are specified
			if (input.width || input.height) {
				image.resize(input.width, input.height, {
					fit: "inside",
					withoutEnlargement: true,
					fastShrinkOnLoad: true,
					// Only add background for WebP when converting from formats with transparency
					...(returnFormat === "webp" && (metadata.hasAlpha || metadata.channels === 4)
						? { background: { r: 255, g: 255, b: 255, alpha: 1 } }
						: {}),
				});
			}

			const processedImage = await this.format(image, returnFormat);
			const result = await processedImage.toBuffer();

			logger.info(
				`Successfully processed image: ${input.name} (${metadata.width}x${metadata.height}) -> ${returnFormat}`,
			);

			return result;
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			logger.error(
				`Failed to process image: ${input.name} | Error: ${err.message} | Stack: ${err.stack}`,
			);
			throw new Error(`Image processing failed: ${err.message}`);
		}
	}

	/**
	 * Apply format-specific optimizations to the image
	 *
	 * @param image - Sharp image instance
	 * @param returnFormat - Target format
	 * @returns Promise<sharp.Sharp> - Configured Sharp instance
	 */
	private async format(image: sharp.Sharp, returnFormat: ImageFormat): Promise<sharp.Sharp> {
		switch (returnFormat) {
			case "jpg":
				return image.jpeg({
					quality: 85, // Balanced quality/size ratio
					progressive: true, // Progressive loading
					optimizeScans: true,
					trellisQuantisation: true,
					overshootDeringing: true,
					optimizeCoding: true,
				});
			case "png":
				return image.png({
					compressionLevel: 6, // Balanced compression/speed
					progressive: true,
					palette: true, // Use palette when beneficial
				});
			case "webp":
				return image.webp({
					quality: 85, // Balanced quality/size
					effort: 4, // Balanced encoding effort
					smartSubsample: true,
					nearLossless: false, // Use lossy for better compression
				});
			default:
				// TypeScript should catch this, but adding runtime safety
				throw new Error(`Unsupported format: ${returnFormat}`);
		}
	}

	/**
	 * Validate input parameters
	 *
	 * @param input - Image input to validate
	 * @param returnFormat - Format to validate
	 * @throws {Error} When validation fails
	 */
	private validateInput(input: ImageInput, returnFormat: ImageFormat): void {
		if (!input.file || !Buffer.isBuffer(input.file)) {
			throw new Error("Invalid file buffer provided");
		}

		if (input.file.length === 0) {
			throw new Error("Empty file buffer provided");
		}

		if (input.file.length > this.MAX_FILE_SIZE) {
			throw new Error(`File size exceeds maximum allowed size of ${this.MAX_FILE_SIZE} bytes`);
		}

		if (!input.name || typeof input.name !== "string") {
			throw new Error("Invalid filename provided");
		}

		if (input.width !== undefined && (input.width <= 0 || input.width > this.MAX_DIMENSION)) {
			throw new Error(`Width must be between 1 and ${this.MAX_DIMENSION} pixels`);
		}

		if (input.height !== undefined && (input.height <= 0 || input.height > this.MAX_DIMENSION)) {
			throw new Error(`Height must be between 1 and ${this.MAX_DIMENSION} pixels`);
		}

		const validFormats: ImageFormat[] = ["jpg", "png", "webp"];
		if (!validFormats.includes(returnFormat)) {
			throw new Error(`Invalid format. Supported formats: ${validFormats.join(", ")}`);
		}
	}

	/**
	 * Validate image metadata
	 *
	 * @param metadata - Sharp metadata object
	 * @param filename - Original filename for error reporting
	 * @throws {Error} When image is invalid
	 */
	private validateImageMetadata(metadata: sharp.Metadata, filename: string): void {
		if (!metadata.width || !metadata.height) {
			throw new Error(`Invalid image file: ${filename}`);
		}

		if (metadata.width > this.MAX_DIMENSION || metadata.height > this.MAX_DIMENSION) {
			throw new Error(
				`Image dimensions (${metadata.width}x${metadata.height}) exceed maximum allowed size of ${this.MAX_DIMENSION}x${this.MAX_DIMENSION}`,
			);
		}
	}
}
