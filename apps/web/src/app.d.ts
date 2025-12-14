// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Session } from "@taxi/contracts/sessions/session";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: Session["session"] | null;
			user: Session["user"] | null;
			isAuthenticated: boolean;
		}
		interface PageData {
			isAuthenticated: boolean;
			machineId: string;
		}
		// interface PageState {}
		// interface Platform {}
	}
	namespace svelteHTML {
		interface HTMLAttributes {
			onclickoutside?: (event: CustomEvent) => void;
			ontextchange?: (event: CustomEvent) => void;
			onlongpress?: (event: CustomEvent) => void;
		}
	}
}
