type Props = {
    id: string;
    name: string;
    value: string;
    placeholder?: string;
    minDate?: Date;
    class?: string;
    reset?: boolean;
    focus?: boolean;
    setDate?: (v: string) => void;
};
declare const Datepicker: import("svelte").Component<Props, {}, "value">;
type Datepicker = ReturnType<typeof Datepicker>;
export default Datepicker;
//# sourceMappingURL=Datepicker.svelte.d.ts.map