import type { Snippet } from "svelte";
type Props = {
    show: boolean;
    class?: string;
    onClose?: () => void;
    children: Snippet;
};
declare const Modal: import("svelte").Component<Props, {}, "show">;
type Modal = ReturnType<typeof Modal>;
export default Modal;
//# sourceMappingURL=Modal.svelte.d.ts.map