import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/tests/setup.ts",
    },
    resolve: {
        conditions: ["node", "import", "module", "browser", "default"],
    },
    server: {
        deps: {
            inline: ["@exodus/bytes", "html-encoding-sniffer"],
        },
    },
});
