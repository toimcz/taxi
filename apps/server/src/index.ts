import "dotenv/config";
import { join } from "node:path";
import { cors } from "@elysiajs/cors";
import { logger } from "@taxi/logger";
import { Elysia } from "elysia";
import { apiHandler } from "src/api/handler";
import { config } from "src/common/config/config";

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
			origin: ({ headers }) => {
				const origin = headers.get("origin");
				if (!origin) return true; // Allow same-origin requests
				return config.TRUSTED_ORIGINS.includes(origin);
			},
			methods: ["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"],
			allowedHeaders: [
				"Content-Type",
				"Authorization",
				"X-Requested-With",
				"Accept",
			],
			credentials: true,
		}),
	)
	.use(apiHandler)
	.get("/", () => "OK")
	.listen(config.PORT, ({ hostname, port }) => {
		logger.info(`Server is running on https://${hostname}:${port}`);
	});

export type App = typeof app;
