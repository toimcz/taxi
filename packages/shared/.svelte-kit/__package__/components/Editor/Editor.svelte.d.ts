import "quill/dist/quill.snow.css";
type Props = {
    class?: string;
    content: string;
    name: string;
    placeholder?: string;
    setContent?: (content: string) => void;
};
declare const Editor: import("svelte").Component<Props, {}, "content">;
type Editor = ReturnType<typeof Editor>;
export default Editor;
//# sourceMappingURL=Editor.svelte.d.ts.map