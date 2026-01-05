import type { FullAutoFill } from "svelte/elements";
type Props = {
    id: string;
    label: string;
    name: string;
    value?: string;
    placeholder?: string;
    autocomplete?: FullAutoFill | null | undefined;
    error?: string[] | undefined;
    setValue?: (v: string) => void;
};
declare const InputPhone: import("svelte").Component<Props, {}, "value">;
type InputPhone = ReturnType<typeof InputPhone>;
export default InputPhone;
//# sourceMappingURL=InputPhone.svelte.d.ts.map