import { hash, verify } from "@node-rs/argon2";
import { ORPCError } from "@orpc/contract";
import {
	type GoogleCallbackDTO,
	IdentityType,
	type LoginEmailDTO,
	type LoginPasswordDTO,
	type RegisterPasswordDTO,
	type RegisterPasswordlessDTO,
	Role,
	type Session,
	type ValidateMagicLinkDTO,
} from "@taxi/contracts";
import { config } from "../../config";
import { CacheService } from "../../lib/cache";
import { GoogleAuthService } from "../../lib/google";
import { Logger } from "../../lib/logger";
import { magicLinksUseCases } from "../magic-links";
import { usersUseCases } from "../users/users.use-cases";
import { identitiesUseCases } from "./identities.use-cases";
import { sessionsUseCases } from "./sessions.use-cases";

const logger = new Logger("AuthUseCases");

const googleAuth = new GoogleAuthService({
	cache: new CacheService("google-oauth-cache"),
	clientId: config.GOOGLE_CLIENT_ID,
	clientSecret: config.GOOGLE_CLIENT_SECRET,
	callbackUrl: config.GOOGLE_CALLBACK_URL,
	scopes: ["email", "profile"],
});

const loginPassword = async (input: LoginPasswordDTO): Promise<Session> => {
	try {
		const email = input.email.toLowerCase();
		const identity = await identitiesUseCases.findByProviderId(email, "password");
		logger.debug("Found identity:", identity?.id);
		if (!identity) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "Invalid email or password",
			});
		}

		const passwordHash = identity?.passwordHash ?? (await hash("dummy"));
		const valid = await verify(passwordHash, input.password);

		if (!valid) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "Invalid email or password",
			});
		}

		return await sessionsUseCases.createSession(identity.userId);
	} catch (error) {
		// Log the error for debugging purposes
		logger.error("Error during loginPassword:", error);
		// Rethrow a generic unauthorized error to avoid leaking information
		throw new ORPCError("UNAUTHORIZED", {
			message: "Invalid email or password",
		});
	}
};

const loginEmail = async (input: LoginEmailDTO): Promise<void> => {
	// Validate redirect URL against trusted origins to prevent open redirect attacks
	validateRedirectUrl(input.redirectUrl);

	// Normalize email to lowercase for consistent lookup
	const email = input.email.toLowerCase();

	const identity = await identitiesUseCases.findByProviderId(email, IdentityType.EMAIL);

	// Silent failure: Don't reveal if email exists (prevents email enumeration)
	// Return success but only send magic link if identity exists
	if (identity) {
		await magicLinksUseCases.sendMagicLink(identity, input.redirectUrl);
	}
	// If identity doesn't exist, silently succeed without sending email
};

export async function validateMagicLink(input: ValidateMagicLinkDTO): Promise<Session> {
	const magicLink = await magicLinksUseCases.getMagicLink(input.token);
	if (!magicLink) {
		throw new ORPCError("UNAUTHORIZED", {
			message: "Neplatný nebo vypršel magic link",
		});
	}

	// Fix: Find identity by ID, not by providerId
	const identity = await identitiesUseCases.findById(magicLink.identityId);
	if (!identity) {
		throw new ORPCError("UNAUTHORIZED", { message: "Neplatný magic link" });
	}

	// Update last login timestamp
	await usersUseCases.updateLastLoginAt(identity.userId);

	return await sessionsUseCases.createSession(identity.userId);
}

const registerPassword = async (input: RegisterPasswordDTO): Promise<Session> => {
	// Normalize email to lowercase to prevent duplicate accounts with different casing
	const email = input.email.toLowerCase();

	const isUserExists = await usersUseCases.findByEmail(email);
	if (isUserExists) {
		throw new ORPCError("CONFLICT", { message: "Uživatel již existuje" });
	}

	// Hash password after checking if user exists to avoid expensive operation for duplicates
	const passwordHash = await hash(input.password);
	const name = `${input.firstName} ${input.lastName}`;

	const user = await usersUseCases.create({
		email,
		firstName: input.firstName,
		lastName: input.lastName,
		phone: input.phone || "",
		role: Role.USER,
		note: "",
		name,
		company: "",
		street: "",
		city: "",
		zip: "",
		country: "",
		ic: "",
		dic: "",
	});

	await identitiesUseCases.create({
		userId: user.id,
		provider: IdentityType.PASSWORD,
		providerId: email,
		passwordHash,
	});

	// Update last login timestamp (first login)
	await usersUseCases.updateLastLoginAt(user.id);
	return await sessionsUseCases.createSession(user.id);
};

const registerPasswordless = async (input: RegisterPasswordlessDTO): Promise<void> => {
	// Validate redirect URL against trusted origins to prevent open redirect attacks
	validateRedirectUrl(input.redirectUrl);

	// Normalize email to lowercase to prevent duplicate accounts with different casing
	const email = input.email.toLowerCase();

	const isUserExists = await usersUseCases.findByEmail(email);
	if (isUserExists) {
		throw new ORPCError("CONFLICT", { message: "Uživatel již existuje" });
	}

	const name = `${input.firstName} ${input.lastName}`;
	const user = await usersUseCases.create({
		email,
		firstName: input.firstName,
		lastName: input.lastName,
		phone: input.phone || "",
		role: Role.USER,
		note: "",
		name,
		company: "",
		street: "",
		city: "",
		zip: "",
		country: "",
		ic: "",
		dic: "",
	});

	const identity = await identitiesUseCases.create({
		userId: user.id,
		provider: IdentityType.EMAIL,
		providerId: email,
	});

	await magicLinksUseCases.sendMagicLink(identity, input.redirectUrl);
};

const loginGoogle = (redirectUrl: string): Promise<string> => {
	// Validate redirect URL against trusted origins to prevent open redirect attacks
	validateRedirectUrl(redirectUrl);

	return googleAuth.generateAuthorizationURL(redirectUrl);
};

export const googleCallback = async (input: GoogleCallbackDTO) => {
	const data = await googleAuth.callback(input.code, input.state);

	// Normalize email to lowercase for consistent lookup
	const email = data.user.email.toLowerCase();

	let user = await usersUseCases.findByEmail(email);
	let identity = await identitiesUseCases.findByProviderId(data.user.id, IdentityType.GOOGLE);

	// Create user if doesn't exist
	if (!user) {
		user = await usersUseCases.createFromGoogleUser(data.user);
	}

	// Create or update identity
	if (!identity) {
		identity = await identitiesUseCases.create({
			userId: user.id,
			provider: IdentityType.GOOGLE,
			providerId: data.user.id,
			accessToken: data.accessToken,
			refreshToken: data.refreshToken,
			idToken: data.idToken,
			accessTokenExpiresAt: data.accessTokenExpiresAt,
		});
	} else {
		identity = await identitiesUseCases.update(identity.id, {
			accessToken: data.accessToken,
			refreshToken: data.refreshToken,
			idToken: data.idToken,
			accessTokenExpiresAt: data.accessTokenExpiresAt,
			updatedAt: new Date(),
		});
	}

	// Update last login timestamp
	await usersUseCases.updateLastLoginAt(user.id);

	const session = await sessionsUseCases.createSession(user.id);

	return {
		session,
		redirectUrl: data.redirectUrl,
	};
};

const me = async (sessionId: string): Promise<Session | null> => {
	return await sessionsUseCases.getSession(sessionId);
};

const logout = async (sessionId: string): Promise<void> => {
	await sessionsUseCases.deleteSession(sessionId);
};

export const authUseCases = {
	loginPassword,
	loginEmail,
	validateMagicLink,
	registerPassword,
	registerPasswordless,
	loginGoogle,
	googleCallback,
	me,
	logout,
};

/**
 * Validates redirect URL against trusted origins to prevent open redirect attacks
 * @throws Error if redirect URL is not in the trusted origins list
 */
function validateRedirectUrl(redirectUrl: string): void {
	try {
		const url = new URL(redirectUrl);
		const isAllowed = config.TRUSTED_ORIGINS.some((origin) => url.origin === origin);

		if (!isAllowed) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "Neplatná redirect URL: nepatří do trusted origins",
			});
		}
	} catch (error) {
		if (error instanceof TypeError) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "Neplatný formát redirect URL",
			});
		}
		throw error;
	}
}
