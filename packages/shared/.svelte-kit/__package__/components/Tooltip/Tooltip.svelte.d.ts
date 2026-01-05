import type { Snippet } from "svelte";
type Props = {
    content: string;
    children: Snippet;
    placement?: "top" | "bottom" | "left" | "right";
};
declare const Tooltip: import("svelte").Component<Props, {}, "">;
type Tooltip = ReturnType<typeof Tooltip>;
export default Tooltip;
//# sourceMappingURL=Tooltip.svelte.d.ts.map