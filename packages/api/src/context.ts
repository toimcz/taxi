import type { ResponseHeadersPluginContext } from "@orpc/server/plugins";

export type AppContext = ResponseHeadersPluginContext & {
	sessionId?: string;
};
