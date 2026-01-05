type Props = {
    apiKey: string;
    from: {
        lat: number;
        lng: number;
    };
    to: {
        lat: number;
        lng: number;
    };
};
declare const GoogleMap: import("svelte").Component<Props, {}, "">;
type GoogleMap = ReturnType<typeof GoogleMap>;
export default GoogleMap;
//# sourceMappingURL=GoogleMap.svelte.d.ts.map