// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace svelteHTML {
		interface HTMLAttributes {
			onclickoutside?: (event: CustomEvent) => void;
			ontextchange?: (event: CustomEvent) => void;
			onlongpress?: (event: CustomEvent) => void;
		}
	}
}

export {};
