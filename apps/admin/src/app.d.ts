// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { Session } from "@taxi/contracts";

declare global {
	namespace App {
		interface Error {
			message: string;
			cause?: unknown;
		}
		interface Locals {
			session: Session["session"] | null;
			user: Session["user"] | null;
		}
		interface PageData {
			session: Session["session"] | null;
			user: Session["user"] | null;
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
