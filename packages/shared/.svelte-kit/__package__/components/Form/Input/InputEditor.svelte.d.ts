type Props = {
    id: string;
    label: string;
    name: string;
    class?: string;
    content?: string;
    placeholder?: string;
    error?: string[] | undefined;
    setValue?: (value: string) => void;
};
declare const InputEditor: import("svelte").Component<Props, {}, "content">;
type InputEditor = ReturnType<typeof InputEditor>;
export default InputEditor;
//# sourceMappingURL=InputEditor.svelte.d.ts.map