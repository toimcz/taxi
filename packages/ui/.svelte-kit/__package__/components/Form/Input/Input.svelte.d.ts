import type { Snippet } from "svelte";
type Props = {
    id: string;
    label: string;
    children: Snippet;
    error?: string[] | undefined;
};
declare const Input: import("svelte").Component<Props, {}, "">;
type Input = ReturnType<typeof Input>;
export default Input;
//# sourceMappingURL=Input.svelte.d.ts.map