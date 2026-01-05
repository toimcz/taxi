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
    rows?: number;
    setValue?: (value: string) => void;
};
declare const InputTextarea: import("svelte").Component<Props, {}, "value">;
type InputTextarea = ReturnType<typeof InputTextarea>;
export default InputTextarea;
//# sourceMappingURL=InputTextarea.svelte.d.ts.map