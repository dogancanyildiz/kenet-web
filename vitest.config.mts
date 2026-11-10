import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    // Base environment stays "node": most test files check source and config
    // and never touch the DOM. A file that renders a component opts into
    // jsdom with a "// @vitest-environment jsdom" comment on its first line.
    environment: "node",
    include: [
      "src/**/*.test.ts",
      "src/**/*.test.tsx",
      "tests/**/*.test.ts",
      "tests/**/*.test.tsx",
    ],
    setupFiles: ["./tests/setup/vitest.setup.ts"],
    watch: false,
    env: {
      NEXT_PUBLIC_SITE_URL: "https://kenet.app",
    },
    server: {
      deps: {
        // next-intl's navigation entry imports next/navigation without a file
        // extension; let Vite transform the package instead of Node's ESM
        // resolver rejecting it.
        inline: ["next-intl"],
      },
    },
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    coverage: {
      provider: "v8",
      include: ["src/**"],
      exclude: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    },
  },
});
