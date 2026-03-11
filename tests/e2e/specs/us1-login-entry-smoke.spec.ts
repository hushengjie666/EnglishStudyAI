import { expect, test } from "../../../frontend/node_modules/@playwright/test/index.js";
import { mkdir, writeFile } from "node:fs/promises";

test("US1 login-entry state navigation", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });

  await page.goto("/");
  await expect(page.getByTestId("entry-page")).toBeVisible();
  await page.locator("#enter-workspace").click();
  await expect(page.getByTestId("home-page")).toBeVisible();

  await page.screenshot({ path: "tests/e2e/artifacts/screenshots/us1-entry.png", fullPage: true });
  await mkdir("tests/e2e/artifacts/console", { recursive: true });
  await writeFile("tests/e2e/artifacts/console/us1-entry-console.json", JSON.stringify(errors, null, 2), "utf8");

  expect(errors).toEqual([]);
});
