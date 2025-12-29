import { oc } from "@orpc/contract";
import { object, string } from "valibot";

const error = object({
	message: string(),
});

export const Errors = {
	BAD_REQUEST: error,
	UNAUTHORIZED: error,
	FORBIDDEN: error,
	NOT_FOUND: error,
	CONFLICT: error,
	INTERNAL_SERVER_ERROR: error,
};

export const contract = oc.errors(Errors);
