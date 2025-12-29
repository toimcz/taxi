import * as arctic from "arctic";
import { type InferInput, object, string } from "valibot";
import type { CacheService } from "../cache";
import { Logger } from "../logger";

export const GoogleAuthState = object({
	redirectUrl: string(),
	codeVerifier: string(),
});

export type GoogleAuthState = InferInput<typeof GoogleAuthState>;

interface GoogleOAuthConfig {
	cache: CacheService;
	clientId: string;
	clientSecret: string;
	callbackUrl: string;
	scopes: string[];
}

export interface GoogleUserInfo {
	id: string;
	email: string;
	verified_email: boolean;
	name: string;
	given_name: string;
	family_name: string;
	picture?: string;
}

interface GoogleCallbackResponse {
	user: GoogleUserInfo;
	accessToken: string;
	refreshToken: string | null;
	accessTokenExpiresAt: Date | null;
	idToken: string | null;
	redirectUrl: string;
}

export class GoogleAuthService {
	private readonly logger = new Logger("GoogleAuthService");
	private readonly cache: CacheService;
	private readonly google: arctic.Google;
	private readonly scopes: string[];
	private readonly GOOGLE_OAUTH_STATE_CACHE_KEY = "google_oauth_state";
	private readonly GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

	constructor(config: GoogleOAuthConfig) {
		this.cache = config.cache;
		this.google = new arctic.Google(config.clientId, config.clientSecret, config.callbackUrl);
		this.scopes = config.scopes;
		this.logger.info("GoogleAuthService initialized");
	}

	async generateAuthorizationURL(redirectUrl: string): Promise<string> {
		const state = arctic.generateState();
		const codeVerifier = arctic.generateCodeVerifier();

		// uložíme do redis: state -> { next, codeVerifier } jako JSON (TTL 10 min)
		const key = `${this.GOOGLE_OAUTH_STATE_CACHE_KEY}:${state}`;
		const authState: GoogleAuthState = {
			redirectUrl,
			codeVerifier,
		};
		await this.cache.set(key, authState, 10 * 60);

		const authorizationURL = this.google.createAuthorizationURL(state, codeVerifier, this.scopes);

		// add prompt to the authorization URL
		authorizationURL.searchParams.set("prompt", "select_account");
		// Request offline access to get refresh token
		authorizationURL.searchParams.set("access_type", "offline");

		return authorizationURL.toString();
	}

	/**
	 * Fetches user information from Google using the access token
	 */
	private async getGoogleUserInfo(accessToken: string) {
		const response = await fetch(this.GOOGLE_USERINFO_URL, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		});

		if (!response.ok) {
			throw new Error("Failed to fetch user info from Google");
		}

		return (await response.json()) as {
			id: string;
			email: string;
			verified_email: boolean;
			name: string;
			given_name: string;
			family_name: string;
			picture?: string;
		};
	}

	async callback(code: string, state: string): Promise<GoogleCallbackResponse> {
		const stateData = await this.cache.get<GoogleAuthState>(
			`${this.GOOGLE_OAUTH_STATE_CACHE_KEY}:${state}`,
		);
		if (!stateData) {
			throw new Error("Invalid state");
		}

		const tokens = await this.google.validateAuthorizationCode(code, stateData.codeVerifier);

		const accessToken = tokens.accessToken();
		let refreshToken: string | null = null;
		try {
			refreshToken = tokens.refreshToken() ?? null;
		} catch {
			refreshToken = null;
		}
		const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
		let idToken: string | null = null;
		try {
			idToken = tokens.idToken() ?? null;
		} catch {
			idToken = null;
		}
		if (!accessToken || !accessTokenExpiresAt) {
			throw new Error("Invalid access token or access token expires at");
		}
		const googleUser = await this.getGoogleUserInfo(accessToken);
		return {
			user: googleUser,
			accessToken,
			refreshToken,
			accessTokenExpiresAt,
			idToken,
			redirectUrl: stateData.redirectUrl,
		};
	}
}
