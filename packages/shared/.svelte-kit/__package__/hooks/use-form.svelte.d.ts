import type { SubmitFunction } from "@sveltejs/kit";
import { type BaseIssue, type BaseSchema } from "valibot";
type Schema = BaseSchema<unknown, unknown, BaseIssue<unknown>>;
export type FormProps<TData extends Record<string, unknown> = Record<string, unknown>> = {
    onSuccess: (data: TData) => void | Promise<void>;
    onError: (message: string) => void | Promise<void>;
};
export declare class FormBase<T extends Schema | undefined, TData extends Record<string, unknown> = Record<string, unknown>> {
    #private;
    private readonly schema;
    private readonly props;
    get processing(): boolean;
    get issues(): (Readonly<Partial<Record<T extends BaseSchema<unknown, unknown, BaseIssue<unknown>> | import("valibot", { with: { "resolution-mode": "require" } }).BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>> ? import("valibot", { with: { "resolution-mode": "require" } }).IssueDotPath<T> : string, [string, ...string[]]>>> extends infer T_1 ? { [TKey in keyof T_1]: T_1[TKey]; } : never) | undefined;
    constructor(schema: T, props: FormProps<TData>);
    submit: SubmitFunction;
}
export declare function useForm<T extends Schema | undefined, TData extends Record<string, unknown> = Record<string, unknown>>(schema: T, props: FormProps<TData>): FormBase<T, TData>;
export declare function useFormWithKey<T extends Schema, TData extends Record<string, unknown> = Record<string, unknown>>(schema: T, props: FormProps<TData>, key: symbol): FormBase<T, TData>;
export declare function getForm<T extends Schema, TData extends Record<string, unknown> = Record<string, unknown>>(key: symbol): FormBase<T, TData>;
export {};
//# sourceMappingURL=use-form.svelte.d.ts.map