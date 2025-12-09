import type { FullAutoFill } from "svelte/elements";
type Props = {
    id: string;
    label: string;
    value?: string;
    placeholder?: string;
    name: string;
    autocomplete?: FullAutoFill | null | undefined;
    error?: string[] | undefined;
    setValue?: (v: string) => void;
};
declare const InputPassword: import("svelte").Component<Props, {}, "value">;
type InputPassword = ReturnType<typeof InputPassword>;
export default InputPassword;
//# sourceMappingURL=InputPassword.svelte.d.ts.map