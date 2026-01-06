import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import htmlPurge from "vite-plugin-html-purgecss";
import { createHtmlPlugin } from "vite-plugin-html";

export default defineConfig({
  build: {
    outDir: "build",
    sourcemap: true,
    rollupOptions: {
      input: {
        app: "index.html",
      },
    },
  },
  plugins: [
    react(),
    // htmlPurge(),
    createHtmlPlugin({
      entry: "src/index.js",
      template: "index.html",
      inject: {
        data: {
          title: "index",
          injectScript: `<script src="./inject.js"></script>`,
        },
      },
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/tests/setup.ts",
  },
});
