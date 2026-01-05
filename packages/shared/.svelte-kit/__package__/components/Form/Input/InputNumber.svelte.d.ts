type Props = {
    id: string;
    label: string;
    name: string;
    value?: number | string;
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
    disabled?: boolean;
    error?: string[] | undefined;
    setValue?: (v: number) => void;
};
declare const InputNumber: import("svelte").Component<Props, {}, "value">;
type InputNumber = ReturnType<typeof InputNumber>;
export default InputNumber;
//# sourceMappingURL=InputNumber.svelte.d.ts.map