type Props = {
    id: string;
    label: string;
    name: string;
    value?: string;
    placeholder?: string;
    error?: string[] | undefined;
    setValue?: (v: string) => void;
};
declare const InputTime: import("svelte").Component<Props, {}, "value">;
type InputTime = ReturnType<typeof InputTime>;
export default InputTime;
//# sourceMappingURL=InputTime.svelte.d.ts.map