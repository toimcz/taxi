import { join } from "node:path";
import { OpenAPIGenerator } from "@orpc/openapi";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { onError } from "@orpc/server";
import { unsign } from "@orpc/server/helpers";
import { CORSPlugin, ResponseHeadersPlugin } from "@orpc/server/plugins";
import { experimental_ValibotToJsonSchemaConverter as ValibotToJsonSchemaConverter } from "@orpc/valibot";
import { router } from "@taxi/api";
import { contracts } from "@taxi/contracts";
import { config } from "./config";

const certPath = join(import.meta.dir, "../../../cert");
const certFile = join(certPath, "localhost.pem");
const keyFile = join(certPath, "localhost-key.pem");

/*
const handler = new RPCHandler(router, {
	plugins: [
		new CORSPlugin(),
		new CompressionPlugin(),
		new SimpleCsrfProtectionHandlerPlugin(),
		new BodyLimitPlugin({
			maxBodySize: 1024 * 1024 * 100, // 100MB
		}),
	],
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});
*/

function getSessionIdFromCookie(request: Request): string | undefined {
	const cookie = request.headers.get("Cookie");
	if (!cookie) return undefined;
	const sessionIdCookieName = config.AUTH_COOKIE;
	const match = cookie.match(new RegExp(`${sessionIdCookieName}=([^;]+)`));
	return match ? match[1] : undefined;
}

const handler = new OpenAPIHandler(router, {
	plugins: [
		new CORSPlugin({
			origin: config.TRUSTED_ORIGINS,
			credentials: true,
			exposeHeaders: ["Content-Disposition", "Set-Cookie"],
		}),
		new ResponseHeadersPlugin(),
	],
	interceptors: [
		onError((error) => {
			console.error(JSON.stringify(error, null, 2));
		}),
	],
});

const openApiGenerator = new OpenAPIGenerator({
	schemaConverters: [new ValibotToJsonSchemaConverter()],
});

const spec = await openApiGenerator.generate(contracts, {
	info: {
		title: "My App",
		version: "0.0.0",
	},
	servers: [{ url: "/api" }],
});

const app = Bun.serve({
	development: true,
	port: 4000,
	tls: {
		cert: Bun.file(certFile),
		key: Bun.file(keyFile),
	},
	async fetch(request: Request) {
		const start = Date.now();

		if (
			config.NODE_ENV !== "production" &&
			request.method === "GET" &&
			request.url.endsWith("/api/spec.json")
		) {
			return new Response(JSON.stringify(spec), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		}
		const { matched, response } = await handler.handle(request, {
			prefix: "/api",
			context: {
				sessionId: await unsign(getSessionIdFromCookie(request), config.AUTH_SECRET),
			}, // Provide initial context if needed
		});

		if (matched) {
			const duration = Date.now() - start;
			response.headers.set("X-Response-Time-ms", duration.toString());
			console.log(`${response.status} ${request.method} ${duration}ms | ${request.url}`);

			return response;
		}

		if (request.method === "GET" && request.url.endsWith("/openapi")) {
			const html = `
        <!doctype html>
        <html>
          <head>
            <title>My Client</title>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" type="image/svg+xml" href="https://orpc.dev/icon.svg" />
          </head>
          <body>
            <div id="app"></div>

            <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
            <script>
              Scalar.createApiReference('#app', {
                url: '/api/spec.json',
              })
            </script>
          </body>
        </html>
      `;
			return new Response(html, { status: 200, headers: { "Content-Type": "text/html" } });
		}

		if (request.method === "GET" && request.url.endsWith("/api")) {
			return new Response("API Server is running", { status: 200 });
		}

		return new Response("Not found", { status: 404 });
	},
});

console.log(`Server running at ${app.url}`);

export type Router = typeof router;
