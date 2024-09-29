import {defineConfig} from "astro/config";

export default defineConfig({
	outDir: "../dist",
	site: "https://nat2.trybioluna.com/",
	output: "static",
	build: {
		inlineStylesheets: "always",
		assets: "_custom",
		redirects: false,
	},
	server: {
		host: true,
		port: 4321,
	},
	vite: {
		build: {
			rollupOptions: {
				input: {
					checkout: "src/assets/scripts/checkout.js",
				},
			},
		},
	},
});
