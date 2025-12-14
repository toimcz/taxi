import { cache } from "@taxi/cache";
import type {
	LoginEmailInput,
	LoginPasswordInput,
	RegisterPasswordInput,
	RegisterPasswordlessInput,
} from "@taxi/contracts/auth/auth.input";
import { IdentityType } from "@taxi/contracts/common";
import type { Session } from "@taxi/contracts/sessions/session";

import { GoogleAuthService } from "src/api/auth/google-auth.service";
import { IdentitiesService } from "src/api/auth/identities.service";
import { MagicLinksService } from "src/api/magic-links/magic-links.service";
import { SessionsService } from "src/api/sessions/sessions.service";
import { UsersService } from "src/api/users/users.service";
import { config } from "src/common/config/config";
import { ConflictError } from "src/common/errors";

interface IAuthService {
	getSession(sessionId: string): Promise<Session | null>;
	logout(sessionId: string): Promise<void>;
	loginPassword(input: LoginPasswordInput): Promise<Session>;
	loginEmail(input: LoginEmailInput): Promise<void>;
	validateMagicLink(token: string): Promise<Session>;
	registerPassword(input: RegisterPasswordInput): Promise<Session>;
	registerPasswordless(input: RegisterPasswordlessInput): Promise<void>;
	generateGoogleAuthorizationURL(redirectUrl: string): Promise<string>;
	callbackGoogle(
		code: string,
		codeVerifier: string,
		state: string,
	): Promise<{
		session: Session;
		redirectUrl: string;
	}>;
}

export class AuthService implements IAuthService {
	static #instance: AuthService;

	private constructor(
		private readonly googleAuthService: GoogleAuthService,
		private readonly usersService: UsersService,
		private readonly identitiesService: IdentitiesService,
		private readonly sessionsService: SessionsService,
		private readonly magicLinksService: MagicLinksService,
	) {}

	static get instance(): AuthService {
		if (!AuthService.#instance) {
			const googleAuthService = new GoogleAuthService({
				cache,
				clientId: config.GOOGLE_CLIENT_ID,
				clientSecret: config.GOOGLE_CLIENT_SECRET,
				callbackUrl: config.GOOGLE_CALLBACK_URL,
				scopes: config.GOOGLE_SCOPE.split(","),
			});
			AuthService.#instance = new AuthService(
				googleAuthService,
				UsersService.instance,
				IdentitiesService.instance,
				SessionsService.instance,
				MagicLinksService.instance,
			);
		}
		return AuthService.#instance;
	}

	async getSession(sessionId: string): Promise<Session | null> {
		return await this.sessionsService.getSession(sessionId);
	}

	async logout(sessionId: string): Promise<void> {
		await this.sessionsService.deleteSession(sessionId);
	}

	async loginPassword(input: LoginPasswordInput): Promise<Session> {
		const identity = await this.identitiesService.findByProviderId(
			input.email,
			IdentityType.PASSWORD,
		);
		if (!identity || !identity.passwordHash) {
			throw new Error("Invalid email or password");
		}

		const valid = await Bun.password.verify(
			input.password,
			identity.passwordHash,
		);
		if (!valid) {
			throw new Error("Invalid email or password");
		}

		return await this.sessionsService.createSession(identity.userId);
	}

	async loginEmail(input: LoginEmailInput): Promise<void> {
		const identity = await this.identitiesService.findByProviderId(
			input.email,
			IdentityType.EMAIL,
		);
		if (!identity) {
			throw new Error("Invalid email");
		}

		await this.magicLinksService.sendMagicLink(identity, input.redirectUrl);
	}

	async validateMagicLink(token: string): Promise<Session> {
		const magicLink = await this.magicLinksService.getMagicLink(token);
		if (!magicLink) {
			throw new Error("Invalid magic link");
		}
		const identity = await this.identitiesService.findByProviderId(
			magicLink.identityId,
			IdentityType.EMAIL,
		);
		if (!identity) {
			throw new Error("Invalid magic link");
		}
		return await this.sessionsService.createSession(identity.userId);
	}

	async registerPassword(input: RegisterPasswordInput): Promise<Session> {
		const isUserExists = await this.usersService.findByEmail(input.email);
		if (isUserExists) {
			throw new ConflictError("User already exists");
		}
		const passwordHash = await Bun.password.hash(input.password);
		const name = `${input.firstName} ${input.lastName}`;
		const user = await this.usersService.create({
			email: input.email,
			name,
			firstName: input.firstName,
			lastName: input.lastName,
			phone: input.phone,
			billingDetails: {
				name,
				company: "",
				street: "",
				city: "",
				zip: "",
				country: "",
				ic: "",
				dic: "",
			},
		});
		await this.identitiesService.create({
			userId: user.id,
			provider: IdentityType.PASSWORD,
			providerId: user.email,
			passwordHash,
		});
		return await this.sessionsService.createSession(user.id);
	}

	async registerPasswordless(input: RegisterPasswordlessInput): Promise<void> {
		const isUserExists = await this.usersService.findByEmail(input.email);
		if (isUserExists) {
			throw new ConflictError("User already exists");
		}
		const name = `${input.firstName} ${input.lastName}`;
		const user = await this.usersService.create({
			email: input.email,
			name,
			firstName: input.firstName,
			lastName: input.lastName,
			phone: input.phone,
			billingDetails: {
				name,
				company: "",
				street: "",
				city: "",
				zip: "",
				country: "",
				ic: "",
				dic: "",
			},
		});
		const identity = await this.identitiesService.create({
			userId: user.id,
			provider: IdentityType.EMAIL,
			providerId: user.email.toLowerCase(),
		});
		await this.magicLinksService.sendMagicLink(identity, input.redirectUrl);
	}

	async generateGoogleAuthorizationURL(redirectUrl: string): Promise<string> {
		return this.googleAuthService.generateAuthorizationURL(redirectUrl);
	}

	async callbackGoogle(code: string, state: string) {
		const data = await this.googleAuthService.callback(code, state);
		let user = await this.usersService.findByEmail(data.user.email);
		let identity = await this.identitiesService.findByProviderId(
			data.user.id,
			IdentityType.GOOGLE,
		);
		if (!user) {
			user = await this.usersService.createFromGoogleUser(data.user);
		}
		if (!identity) {
			identity = await this.identitiesService.create({
				userId: user.id,
				provider: IdentityType.GOOGLE,
				providerId: data.user.id,
				accessToken: data.accessToken,
				refreshToken: data.refreshToken,
				idToken: data.idToken,
			});
		} else {
			await this.identitiesService.update(identity.id, {
				accessToken: data.accessToken,
				refreshToken: data.refreshToken,
				idToken: data.idToken,
				accessTokenExpiresAt: data.accessTokenExpiresAt,
				updatedAt: new Date(),
			});
		}
		if (!user || !identity) {
			throw new Error("Failed to create user or identity");
		}
		const session = await this.sessionsService.createSession(user.id);
		return {
			session,
			redirectUrl: data.redirectUrl,
		};
	}
}
