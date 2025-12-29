import { error } from "@sveltejs/kit";
import { DO_URL } from "$env/static/private";
import type { RequestHandler } from "./$types";

// Allowed image extensions and their MIME types
const ALLOWED_EXTENSIONS = {
	jpg: "image/jpeg",
	jpeg: "image/jpeg",
	png: "image/png",
	webp: "image/webp",
	gif: "image/gif",
	svg: "image/svg+xml",
	avif: "image/avif",
} as const;

function sanitizePath(pathname: string): string {
	// Remove leading slash and normalize path
	const cleanPath = pathname.replace(/^\/+/, "");

	// Prevent path traversal attacks
	if (cleanPath.includes("..") || cleanPath.includes("//")) {
		throw new Error("Invalid path");
	}

	return cleanPath;
}

function getContentType(filename: string): string {
	const extension = filename.split(".").pop()?.toLowerCase();
	if (!extension || !(extension in ALLOWED_EXTENSIONS)) {
		throw new Error("Unsupported file type");
	}
	return ALLOWED_EXTENSIONS[extension as keyof typeof ALLOWED_EXTENSIONS];
}

export const GET: RequestHandler = async ({ url }) => {
	try {
		// Validate locals.config exists
		if (!DO_URL) {
			console.error("DigitalOcean configuration missing");
			throw error(500, "Server configuration error");
		}

		// Sanitize and validate the path
		const sanitizedPath = sanitizePath(url.pathname);
		const filename = sanitizedPath.split("/").pop() || "";

		// Validate file extension
		getContentType(filename); // Just validate, don't use the result

		// Construct the DigitalOcean URL
		const doUrl = `${DO_URL}/${sanitizedPath}`;

		// Redirect directly to DigitalOcean
		// This is more efficient as it doesn't proxy the image data through your server
		return new Response(null, {
			status: 302,
			headers: {
				Location: doUrl,
				"Cache-Control": "public, max-age=300", // Cache redirect for 5 minutes
				"X-Content-Type-Options": "nosniff",
			},
		});
	} catch (err: unknown) {
		// Handle known errors (SvelteKit errors have status property)
		if (err && typeof err === "object" && "status" in err) {
			throw err;
		}

		// Log unexpected errors
		console.error("Unexpected error in image handler:", err);

		// Return generic error for security
		throw error(500, "Internal server error");
	}
};
