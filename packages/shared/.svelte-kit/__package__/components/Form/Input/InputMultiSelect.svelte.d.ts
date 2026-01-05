type Props = {
    id: string;
    label: string;
    name: string;
    options: {
        label: string;
        value: string;
    }[];
    value: string[];
    error?: string[] | undefined;
    setValue?: (value: string[]) => void;
};
declare const InputMultiSelect: import("svelte").Component<Props, {}, "value">;
type InputMultiSelect = ReturnType<typeof InputMultiSelect>;
export default InputMultiSelect;
//# sourceMappingURL=InputMultiSelect.svelte.d.ts.map