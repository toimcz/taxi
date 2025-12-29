type Props = {
    id: string;
    label: string;
    name: string;
    checked?: boolean;
    disabled?: boolean;
    error?: string[] | undefined;
    setValue?: (value: boolean) => void;
};
declare const InputSwitch: import("svelte").Component<Props, {}, "checked">;
type InputSwitch = ReturnType<typeof InputSwitch>;
export default InputSwitch;
//# sourceMappingURL=InputSwitch.svelte.d.ts.map