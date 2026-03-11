import { expect, test } from "../../../frontend/node_modules/@playwright/test/index.js";
import { mkdir, writeFile } from "node:fs/promises";

test("US1 homepage interaction to assessment", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });

  await page.goto("/");
  await page.locator("#enter-workspace").click();
  await expect(page.getByTestId("home-page")).toBeVisible();

  const firstGoalValue = await page.locator("#goal-level option").nth(1).getAttribute("value");
  await page.selectOption("#goal-level", firstGoalValue ?? "");
  await page.locator("#go-assessment").click();
  await expect(page.getByTestId("assessment-page")).toBeVisible();

  await page.screenshot({ path: "tests/e2e/artifacts/screenshots/us1-homepage.png", fullPage: true });
  await mkdir("tests/e2e/artifacts/console", { recursive: true });
  await writeFile("tests/e2e/artifacts/console/us1-home-console.json", JSON.stringify(errors, null, 2), "utf8");

  expect(errors).toEqual([]);
});
