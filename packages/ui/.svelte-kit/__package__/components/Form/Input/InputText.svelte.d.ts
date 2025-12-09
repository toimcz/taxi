import type { FullAutoFill } from "svelte/elements";
type Props = {
    id: string;
    label: string;
    name: string;
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    autocomplete?: FullAutoFill | null | undefined;
    error?: string[] | undefined;
    setValue?: (value: string) => void;
};
declare const InputText: import("svelte").Component<Props, {}, "value">;
type InputText = ReturnType<typeof InputText>;
export default InputText;
//# sourceMappingURL=InputText.svelte.d.ts.map