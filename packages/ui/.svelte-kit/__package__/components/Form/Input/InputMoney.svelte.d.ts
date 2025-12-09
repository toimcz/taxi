type Props = {
    id: string;
    label: string;
    name: string;
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    placeholder?: string;
    disabled?: boolean;
    error?: string[] | undefined;
    setValue?: (value: number) => void;
};
declare const InputMoney: import("svelte").Component<Props, {}, "value">;
type InputMoney = ReturnType<typeof InputMoney>;
export default InputMoney;
//# sourceMappingURL=InputMoney.svelte.d.ts.map