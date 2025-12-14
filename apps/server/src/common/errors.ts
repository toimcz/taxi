export class ConflictError extends Error {
	status: number;

	constructor(message = "Conflict") {
		super(message);
		this.name = "ConflictError";
		this.status = 409;

		// Fix pro stack trace u custom errorů
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, ConflictError);
		}
	}
}

export class BadRequestError extends Error {
	status: number;

	constructor(message = "Bad Request") {
		super(message);
		this.name = "BadRequestError";
		this.status = 400;
	}
}

export class UnauthorizedError extends Error {
	status: number;

	constructor(message = "Unauthorized") {
		super(message);
		this.name = "UnauthorizedError";
		this.status = 401;
	}
}

export class InternalServerError extends Error {
	status: number;

	constructor(message = "Internal Server Error") {
		super(message);
		this.name = "InternalServerError";
		this.status = 500;
	}
}
