export declare class SessionStorage<T> {
    #private;
    constructor(key: string, initial?: T);
    get current(): any;
    set current(value: any);
}
export declare const session: <T>(key: string, initial?: T) => SessionStorage<T>;
//# sourceMappingURL=session.svelte.d.ts.map