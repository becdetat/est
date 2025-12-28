import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()] as any,
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: "./src/tests/setup.ts",
        deps: {
            inline: ["@exodus/bytes", "html-encoding-sniffer"],
        },
    },
    resolve: {
        conditions: ["node", "import", "module", "browser", "default"],
    },
});
