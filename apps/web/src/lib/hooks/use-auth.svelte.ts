import {
	GoogleLoginInput,
	LoginEmailInput,
	LoginPasswordInput,
	RegisterPasswordInput,
	RegisterPasswordlessInput,
} from "@taxi/contracts/auth/auth.input";
import { getContext, hasContext, setContext } from "svelte";
import {
	type BaseIssue,
	type BaseSchema,
	type FlatErrors,
	flatten,
	safeParse,
} from "valibot";
import { invalidateAll } from "$app/navigation";
import { PUBLIC_APP_URL } from "$env/static/public";
import { type ToastStore, useToastStore } from "$lib/stores";

export type AuthProps = {
	onSuccess: (toast: ToastStore) => void | Promise<void>;
	onError: (toast: ToastStore, error?: string) => void | Promise<void>;
};

class GoogleLogin {
	public readonly toast = useToastStore();
	#processing = $state(false);
	#issues = $state<FlatErrors<typeof GoogleLoginInput>["nested"]>();

	get processing() {
		return this.#processing;
	}

	get issues() {
		return this.#issues;
	}

	constructor(
		private readonly url: string,
		private readonly props: AuthProps,
	) {}

	submit = async (e: Event) => {
		e.preventDefault();
		this.#processing = true;
		this.#issues = undefined;
		try {
			const body: Record<string, unknown> = { redirectUrl: PUBLIC_APP_URL };
			const validated = safeParse(GoogleLoginInput, body);
			if (!validated.success) {
				this.#issues = flatten(validated.issues).nested as FlatErrors<
					typeof GoogleLoginInput
				>["nested"];
				return;
			}

			// GET request should use query parameters, not body
			const url = new URL(this.url, window.location.origin);
			url.searchParams.set("redirectUrl", PUBLIC_APP_URL);

			const response = await fetch(url.toString(), {
				method: "GET",
			});

			if (response.ok) {
				const data = (await response.json()) as { authorizationURL: string };
				window.location.href = data.authorizationURL;
			} else {
				let errorMessage = response.statusText;
				try {
					const errorData = await response.json();
					errorMessage = errorData.message || errorMessage;
				} catch {
					// Response is not JSON, use statusText
				}
				await this.props.onError(this.toast, errorMessage);
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Nastala neočekávaná chyba";
			await this.props.onError(this.toast, errorMessage);
		} finally {
			this.#processing = false;
		}
	};
}

export class AuthBase<
	T extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | undefined,
> {
	public readonly toast = useToastStore();
	#processing = $state(false);
	#issues = $state<FlatErrors<T>["nested"]>();

	get processing() {
		return this.#processing;
	}

	get issues() {
		return this.#issues;
	}

	constructor(
		private readonly url: string,
		private readonly schema: T,
		private readonly props: AuthProps,
	) {}

	submit = async (e: Event) => {
		e.preventDefault();
		this.#processing = true;
		this.#issues = undefined;
		try {
			let body: Record<string, unknown> = {};
			if (this.schema) {
				const target = e.target as HTMLFormElement;
				const formData = new FormData(target);
				console.log("formData", formData);
				body = Object.fromEntries(formData.entries());
				const validated = safeParse(this.schema, body);
				if (!validated.success) {
					this.#issues = flatten(validated.issues)
						.nested as FlatErrors<T>["nested"];
					return;
				}
			}

			const headers: HeadersInit = {};
			if (this.schema) {
				headers["Content-Type"] = "application/json";
			}

			const response = await fetch(this.url, {
				method: "POST",
				headers,
				body: this.schema ? JSON.stringify(body) : undefined,
			});

			const data = await response.json();
			console.log("data", data);

			if (response.ok) {
				await invalidateAll();
				await this.props.onSuccess(this.toast);
			} else {
				let errorMessage = response.statusText;
				try {
					errorMessage = data.message || errorMessage;
				} catch {
					// Response is not JSON, use statusText
				}
				await this.props.onError(this.toast, errorMessage);
			}
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Nastala neočekávaná chyba";
			await this.props.onError(this.toast, errorMessage);
		} finally {
			this.#processing = false;
		}
	};
}

export class UserRegisterPassword extends AuthBase<
	typeof RegisterPasswordInput
> {
	constructor(props: AuthProps) {
		super("/api/auth/register/password", RegisterPasswordInput, props);
	}
}

export class UserRegisterPasswordless extends AuthBase<
	typeof RegisterPasswordlessInput
> {
	constructor(props: AuthProps) {
		super("/api/auth/register/passwordless", RegisterPasswordlessInput, props);
	}
}

export class UserLoginPassword extends AuthBase<typeof LoginPasswordInput> {
	constructor(props: AuthProps) {
		super("/api/auth/login/password", LoginPasswordInput, props);
	}
}

export class UserLoginEmail extends AuthBase<typeof LoginEmailInput> {
	constructor(props: AuthProps) {
		super("/api/auth/login/email", LoginEmailInput, props);
	}
}

export class UserLogout extends AuthBase<undefined> {
	constructor(props: AuthProps) {
		super("/api/auth/logout", undefined, props);
	}
}

const LOGIN_PASSWORD_KEY = Symbol("loginPassword");
const LOGIN_EMAIL_KEY = Symbol("loginEmail");
const GOOGLE_LOGIN_KEY = Symbol("googleLogin");
const REGISTER_PASSWORD_KEY = Symbol("registerPassword");
const REGISTER_PASSWORDLESS_KEY = Symbol("registerPasswordless");
const LOGOUT_KEY = Symbol("logout");

export const useLoginPassword = ({ onSuccess, onError }: AuthProps) => {
	if (!hasContext(LOGIN_PASSWORD_KEY)) {
		setContext(
			LOGIN_PASSWORD_KEY,
			new UserLoginPassword({ onSuccess, onError }),
		);
	}
	return getContext<UserLoginPassword>(LOGIN_PASSWORD_KEY);
};

export const useLoginEmail = ({ onSuccess, onError }: AuthProps) => {
	if (!hasContext(LOGIN_EMAIL_KEY)) {
		setContext(LOGIN_EMAIL_KEY, new UserLoginEmail({ onSuccess, onError }));
	}
	return getContext<UserLoginEmail>(LOGIN_EMAIL_KEY);
};

export const useRegisterPassword = ({ onSuccess, onError }: AuthProps) => {
	if (!hasContext(REGISTER_PASSWORD_KEY)) {
		setContext(
			REGISTER_PASSWORD_KEY,
			new UserRegisterPassword({ onSuccess, onError }),
		);
	}
	return getContext<UserRegisterPassword>(REGISTER_PASSWORD_KEY);
};

export const useRegisterPasswordless = ({ onSuccess, onError }: AuthProps) => {
	if (!hasContext(REGISTER_PASSWORDLESS_KEY)) {
		setContext(
			REGISTER_PASSWORDLESS_KEY,
			new UserRegisterPasswordless({ onSuccess, onError }),
		);
	}
	return getContext<UserRegisterPasswordless>(REGISTER_PASSWORDLESS_KEY);
};

export const useLogout = ({ onSuccess, onError }: AuthProps) => {
	if (!hasContext(LOGOUT_KEY)) {
		setContext(LOGOUT_KEY, new UserLogout({ onSuccess, onError }));
	}
	return getContext<UserLogout>(LOGOUT_KEY);
};

export const useGoogleLogin = ({ onSuccess, onError }: AuthProps) => {
	if (!hasContext(GOOGLE_LOGIN_KEY)) {
		setContext(
			GOOGLE_LOGIN_KEY,
			new GoogleLogin("/api/auth/google", { onSuccess, onError }),
		);
	}
	return getContext<GoogleLogin>(GOOGLE_LOGIN_KEY);
};
