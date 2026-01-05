import type { FullAutoFill } from "svelte/elements";
type Props = {
    id: string;
    label: string;
    name: string;
    value?: string;
    placeholder?: string;
    autocomplete?: FullAutoFill | null | undefined;
    error?: string[] | undefined;
    setValue?: (value: string) => void;
};
declare const InputEmail: import("svelte").Component<Props, {}, "value">;
type InputEmail = ReturnType<typeof InputEmail>;
export default InputEmail;
//# sourceMappingURL=InputEmail.svelte.d.ts.map