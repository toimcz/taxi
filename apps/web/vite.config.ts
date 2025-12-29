import fs from "node:fs";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const apiUrl =
		env.VITE_API_URL ??
		env.PUBLIC_API_URL ??
		process.env.VITE_API_URL ??
		process.env.PUBLIC_API_URL ??
		"https://localhost:4000";
	const isProduction = (env.NODE_ENV ?? process.env.NODE_ENV ?? mode) === "production";
	return {
		plugins: [tailwindcss(), sveltekit()],
		server: {
			proxy: {
				"/api": {
					target: apiUrl,
					changeOrigin: true,
					secure: isProduction,
				},
			},
			...(env.NODE_ENV === "production"
				? {}
				: {
						https: {
							key: fs.readFileSync("../../cert/localhost-key.pem"),
							cert: fs.readFileSync("../../cert/localhost.pem"),
						},
					}),
		},
	};
});
