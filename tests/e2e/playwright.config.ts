import { defineConfig } from "../../frontend/node_modules/@playwright/test/index.js";

export default defineConfig({
  testDir: "./specs",
  timeout: 30000,
  use: {
    baseURL: "http://127.0.0.1:4173",
    screenshot: "only-on-failure",
    trace: "retain-on-failure"
  },
  reporter: [["list"], ["html", { outputFolder: "../tests/e2e/artifacts/reports/playwright-report" }]]
});
