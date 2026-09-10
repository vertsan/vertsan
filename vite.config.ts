import netlify from "@netlify/vite-plugin-tanstack-start";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { createLogger, defineConfig } from "vite";

const isIgnorableAbortError = (msg: string): boolean =>
	/AbortError/.test(msg) && /This operation was aborted/.test(msg);

const baseLogger = createLogger("info");
const customLogger = {
	...baseLogger,
	error: (msg: string, options?: Record<string, unknown>) => {
		if (isIgnorableAbortError(msg)) return;
		baseLogger.error(msg, options);
	},
};

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	assetsInclude: ["**/*.glb"],
	customLogger,
	ssr: { noExternal: ["gsap"] },
	server: {
		watch: {
			ignored: (path) =>
				/[\\/]public[\\/][\w\-. ]+ \(\d+\)\.[\w]+$/i.test(path),
		},
	},
	plugins: [
		devtools({ removeDevtoolsOnBuild: false }),
		netlify(),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
	],
});

export default config;
