import type { FullAutoFill } from "svelte/elements";
type Props = {
    id: string;
    label: string;
    name: string;
    city: string;
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    autocomplete?: FullAutoFill | null | undefined;
    error?: string[] | undefined;
    setValue?: (v: string) => void;
};
declare const InputPlace: import("svelte").Component<Props, {}, "value">;
type InputPlace = ReturnType<typeof InputPlace>;
export default InputPlace;
//# sourceMappingURL=InputPlace.svelte.d.ts.map