import "dotenv/config";
import { join } from "node:path";
import { cors } from "@elysiajs/cors";
import { auth } from "@taxi/auth";
import { logger } from "@taxi/logger";
import { Elysia } from "elysia";
import { apiHandler } from "src/api/handler";

// Get absolute path to cert directory (project root)
const certPath = join(import.meta.dir, "../../../cert");
const certFile = join(certPath, "localhost.pem");
const keyFile = join(certPath, "localhost-key.pem");

// Verify certificates exist
try {
	const certExists = await Bun.file(certFile).exists();
	const keyExists = await Bun.file(keyFile).exists();
	if (!(certExists && keyExists)) {
		logger.warn(
			`⚠️  Certificate files not found at ${certPath}. Server will not use HTTPS.`,
		);
	}
} catch (error) {
	logger.warn(
		`⚠️  Could not verify certificates: ${error}. Server will not use HTTPS.`,
	);
}

const app = new Elysia({
	serve: {
		tls: {
			cert: Bun.file(certFile),
			key: Bun.file(keyFile),
		},
	},
})
	.use(
		cors({
			origin: process.env.CORS_ORIGIN || "",
			methods: ["GET", "POST", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization"],
			credentials: true,
		}),
	)
	.mount(auth.handler)
	.use(apiHandler)
	.get("/", () => "OK")
	.listen(4000, ({ hostname, port }) => {
		logger.info(`Server is running on https://${hostname}:${port}`);
	});

export type App = typeof app;
