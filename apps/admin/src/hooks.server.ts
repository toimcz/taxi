import type { HandleValidationError } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import { Logger } from "@taxi/utils";
import { dev } from "$app/environment";
import { authHandler } from "./lib/handlers/auth.handler";

export const handle = sequence(authHandler);

export const handleError = async ({ error, event }) => {
	console.error("Error occurred during request:", {
		error,
		method: event.request.method,
		url: event.request.url,
	});

	return {
		message: "An unexpected error occurred.",
	};
};

export const handleValidationError: HandleValidationError = ({ issues }) => {
	console.error("Validation errors:", issues);
	return {
		message: "Invalid request data.",
		code: "VALIDATION_ERROR",
		details: issues.map((issue) => ({
			path: issue.path,
			message: issue.message,
		})),
	};
};

export const handleFetch = async ({ request, fetch }) => {
	const start = Date.now();
	const logger = new Logger("handleFetchHook", dev);
	const response = await fetch(request);
	logger.debug(`${request.method} ${response.status} ${request.url} ${Date.now() - start}ms`);
	return response;
};
