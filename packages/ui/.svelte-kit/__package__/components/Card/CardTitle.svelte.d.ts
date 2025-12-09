import type { Snippet } from "svelte";
import type { SvelteHTMLElements } from "svelte/elements";
type Props = {
    tag: keyof SvelteHTMLElements;
    class?: string;
    children: Snippet;
};
declare const CardTitle: import("svelte").Component<Props, {}, "">;
type CardTitle = ReturnType<typeof CardTitle>;
export default CardTitle;
//# sourceMappingURL=CardTitle.svelte.d.ts.map