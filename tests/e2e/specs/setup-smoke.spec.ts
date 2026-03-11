import { expect, test } from "../../../frontend/node_modules/@playwright/test/index.js";
import { mkdir, writeFile } from "node:fs/promises";

test("homepage first screen is accessible and interactive", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "EnglishStudyAI" })).toBeVisible();
  await expect(page.locator("#enter-workspace")).toBeVisible();

  await page.screenshot({ path: "tests/e2e/artifacts/screenshots/setup-home.png", fullPage: true });
  await mkdir("tests/e2e/artifacts/console", { recursive: true });
  await writeFile("tests/e2e/artifacts/console/setup-console.json", JSON.stringify(errors, null, 2), "utf8");

  expect(errors).toEqual([]);
});
