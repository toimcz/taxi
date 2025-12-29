import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import slugify from "slugify";
import { config } from "../../config";
import { ImagesService } from "../images/images.service";
import { Logger } from "../logger";

const imagesService = new ImagesService();

/**
 * Service for handling file storage operations with DigitalOcean Spaces
 * Provides image upload, transformation, and storage functionality
 */
export class DigitalOceanStorageService {
	private readonly logger = new Logger("DigitalOceanStorageService");
	private readonly s3: S3Client;

	/** Base URL for accessing stored images */
	private readonly baseUrl: string;

	constructor() {
		this.s3 = new S3Client({
			endpoint: config.DO_ENDPOINT,
			forcePathStyle: false,
			region: "fra1",
			credentials: {
				accessKeyId: config.DO_KEY,
				secretAccessKey: config.DO_SECRET,
			},
		});

		this.baseUrl = config.DO_URL;
	}

	/**
	 * Upload a buffer to DigitalOcean Spaces
	 *
	 * @param buffer - Image buffer to upload
	 * @param path - Storage path for the file
	 * @param format - Image format (webp, png, jpg)
	 * @returns Promise<string> - The public URL of the uploaded file
	 * @throws {Error} When upload fails
	 *
	 * @example
	 * ```typescript
	 * const url = await storageService.upload(buffer, 'img/cars/car-123.webp', 'webp');
	 * ```
	 */
	async upload(buffer: Buffer, path: string, format: "webp" | "png" | "jpg"): Promise<string> {
		try {
			this.validateUploadParams(buffer, path, format);

			const command = new PutObjectCommand({
				Bucket: config.DO_BUCKET,
				Key: path,
				Body: buffer,
				ACL: "public-read",
				ContentType: `image/${format}`,
				CacheControl: "public, max-age=31536000", // Cache for 1 year
				ContentDisposition: "inline", // Display in browser instead of download
			});

			await this.s3.send(command);

			const publicUrl = `${this.baseUrl}/${path}`;
			this.logger.info(`Successfully uploaded image to: ${publicUrl}`);

			return publicUrl;
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			this.logger.error(
				`Failed to upload image to path: ${path} | Error: ${err.message} | Stack: ${err.stack}`,
			);
			throw new Error(`Upload failed: ${err.message}`);
		}
	}

	/**
	 * Store and optimize any image
	 *
	 * @param file - Image file buffer
	 * @param name - Original filename for processing
	 * @returns Promise<string> - The public URL of the stored image
	 * @throws {Error} When file validation fails
	 * @throws {Error} When processing or upload fails
	 *
	 * @example
	 * ```typescript
	 * const imageUrl = await storageService.storeAnyImage(fileBuffer, 'my-image.jpg');
	 * ```
	 */
	async storeAnyImage(file: Buffer, name: string): Promise<string> {
		try {
			this.validateImageInput(file, name);

			const buffer = await imagesService.transform(
				{
					file,
					name,
				},
				"webp",
			);

			const filename = this.generateFilename(name, "webp");
			const path = `img/${filename}`;

			return await this.upload(buffer, path, "webp");
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			this.logger.error(
				`Failed to store any image: ${name} | Error: ${err.message} | Stack: ${err.stack}`,
			);
			throw new Error(`Any image storage failed: ${err.message}`);
		}
	}

	/**
	 * Store and optimize a car image
	 *
	 * @param file - Image file buffer
	 * @param name - Original filename for processing
	 * @returns Promise<string> - The public URL of the stored image
	 * @throws {Error} When file validation fails
	 * @throws {Error} When processing or upload fails
	 *
	 * @example
	 * ```typescript
	 * const imageUrl = await storageService.storeCarImage(fileBuffer, 'my-car.jpg');
	 * ```
	 */
	async storeCarImage(file: Buffer, name: string): Promise<string> {
		try {
			this.validateImageInput(file, name);

			const buffer = await imagesService.transform(
				{
					file,
					name,
					width: 1000,
					height: 600,
				},
				"webp",
			);

			const filename = this.generateFilename(name, "webp");
			const path = `img/cars/${filename}`;

			return await this.upload(buffer, path, "webp");
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			this.logger.error(
				`Failed to store car image: ${name} | Error: ${err.message} | Stack: ${err.stack}`,
			);
			throw new Error(`Car image storage failed: ${err.message}`);
		}
	}

	/**
	 * Store and optimize a post image
	 *
	 * @param file - Image file buffer
	 * @param name - Original filename for processing
	 * @returns Promise<string> - The public URL of the stored image
	 * @throws {Error} When file validation fails
	 * @throws {Error} When processing or upload fails
	 *
	 * @example
	 * ```typescript
	 * const imageUrl = await storageService.storePostImage(fileBuffer, 'blog-post.jpg');
	 * ```
	 */
	async storePostImage(file: Buffer, name: string): Promise<string> {
		try {
			this.validateImageInput(file, name);

			const buffer = await imagesService.transform(
				{
					file,
					name,
					width: 1600,
					height: 1200,
				},
				"webp",
			);

			const filename = this.generateFilename(name, "webp");
			const path = `img/posts/${filename}`;

			return await this.upload(buffer, path, "webp");
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			this.logger.error(
				`Failed to store post image: ${name} | Error: ${err.message} | Stack: ${err.stack}`,
			);
			throw new Error(`Post image storage failed: ${err.message}`);
		}
	}

	/**
	 * Store and optimize a service image
	 *
	 * @param file - Image file buffer
	 * @param name - Original filename for processing
	 * @returns Promise<string> - The public URL of the stored image
	 * @throws {Error} When file validation fails
	 * @throws {Error} When processing or upload fails
	 *
	 * @example
	 * ```typescript
	 * const imageUrl = await storageService.storeServiceImage(fileBuffer, 'service.jpg');
	 * ```
	 */
	async storeServiceImage(file: File, name: string): Promise<string> {
		try {
			const b = Buffer.from(await file.arrayBuffer());
			this.validateImageInput(b, name);

			const buffer = await imagesService.transform(
				{
					file: b,
					name,
					width: 1000,
					height: 600,
				},
				"webp",
			);

			const filename = this.generateFilename(name, "webp");
			const path = `img/services/${filename}`;

			return await this.upload(buffer, path, "webp");
		} catch (error) {
			const err = error instanceof Error ? error : new Error(String(error));
			this.logger.error(
				`Failed to store service image: ${name} | Error: ${err.message} | Stack: ${err.stack}`,
			);
			throw new Error(`Service image storage failed: ${err.message}`);
		}
	}

	/**
	 * Validate upload parameters
	 *
	 * @param buffer - Buffer to validate
	 * @param path - Path to validate
	 * @param format - Format to validate
	 * @throws {Error} When validation fails
	 */
	private validateUploadParams(buffer: Buffer, path: string, format: string): void {
		if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
			throw new Error("Invalid or empty buffer provided");
		}

		if (!path || typeof path !== "string" || path.trim().length === 0) {
			throw new Error("Invalid path provided");
		}

		const validFormats = ["webp", "png", "jpg"];
		if (!validFormats.includes(format)) {
			throw new Error(`Invalid format. Supported formats: ${validFormats.join(", ")}`);
		}

		// Validate path doesn't contain dangerous characters
		if (path.includes("..") || path.includes("//")) {
			throw new Error("Invalid path: contains dangerous characters");
		}
	}

	/**
	 * Validate image input parameters
	 *
	 * @param file - File buffer to validate
	 * @param name - Filename to validate
	 * @throws {Error} When validation fails
	 */
	private validateImageInput(file: Buffer, name: string): void {
		if (!Buffer.isBuffer(file) || file.length === 0) {
			throw new Error("Invalid or empty file buffer provided");
		}

		if (!name || typeof name !== "string" || name.trim().length === 0) {
			throw new Error("Invalid filename provided");
		}

		// Basic file size check (10MB limit)
		const maxSize = 10 * 1024 * 1024;
		if (file.length > maxSize) {
			throw new Error(`File size exceeds maximum allowed size of ${maxSize} bytes`);
		}
	}

	/**
	 * Generate a unique filename with timestamp
	 *
	 * @param originalName - Original filename
	 * @param extension - File extension
	 * @returns string - Generated filename
	 */
	private generateFilename(originalName: string, extension: string): string {
		const slugifiedName = slugify(originalName, { lower: true, strict: true });
		const timestamp = Date.now();
		return `${slugifiedName}-${timestamp}.${extension}`;
	}
}
