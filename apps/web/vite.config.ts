import fs from "node:fs";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		proxy: {
			"/api": {
				target: "https://localhost:4000",
				changeOrigin: true,
				secure: true,
			},
		},
		...(process.env.NODE_ENV === "production"
			? {}
			: {
					https: {
						key: fs.readFileSync("../../cert/localhost-key.pem"),
						cert: fs.readFileSync("../../cert/localhost.pem"),
					},
				}),
	},
});
