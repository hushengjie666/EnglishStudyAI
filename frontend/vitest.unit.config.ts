import { defineConfig } from "vitest/config";

export default defineConfig({
  server: {
    fs: {
      allow: [".."]
    }
  },
  test: {
    environment: "jsdom",
    include: ["../tests/unit/**/*.test.ts"],
    coverage: {
      enabled: false
    }
  }
});
