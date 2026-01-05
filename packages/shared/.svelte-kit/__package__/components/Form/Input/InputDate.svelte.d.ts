type Props = {
    id: string;
    label: string;
    name: string;
    value?: string;
    placeholder?: string;
    error?: string[] | undefined;
    setValue?: (date: string) => void;
};
declare const InputDate: import("svelte").Component<Props, {}, "value">;
type InputDate = ReturnType<typeof InputDate>;
export default InputDate;
//# sourceMappingURL=InputDate.svelte.d.ts.map