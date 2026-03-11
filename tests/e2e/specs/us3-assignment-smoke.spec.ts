import { expect, test } from "../../../frontend/node_modules/@playwright/test/index.js";
import { mkdir, writeFile } from "node:fs/promises";

test("US3 assignment lifecycle", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });

  await page.goto("/");
  await page.locator("#enter-workspace").click();
  const firstGoalValue = await page.locator("#goal-level option").nth(1).getAttribute("value");
  await page.selectOption("#goal-level", firstGoalValue ?? "");
  await page.locator("#go-assessment").click();
  const quizItems = page.locator("fieldset.quiz-item");
  const quizCount = await quizItems.count();
  for (let i = 0; i < quizCount; i += 1) {
    await quizItems.nth(i).locator('input[type="radio"]').first().check();
  }
  await page.locator("#submit-assessment").click();

  await page.locator("#request-assignment").click();
  await expect(page.getByTestId("assignment-page")).toBeVisible();

  const inputs = page.locator(".assignment-answer");
  const count = await inputs.count();
  for (let i = 0; i < count; i += 1) {
    await inputs.nth(i).fill(`answer-${i + 1}`);
  }

  await page.locator("#submit-assignment").click();
  await expect(page.getByTestId("plan-page")).toBeVisible();
  await expect(page.locator("#assignment-result")).toContainText("得分");

  await page.screenshot({ path: "tests/e2e/artifacts/screenshots/us3-assignment.png", fullPage: true });
  await mkdir("tests/e2e/artifacts/console", { recursive: true });
  await writeFile("tests/e2e/artifacts/console/us3-assignment-console.json", JSON.stringify(errors, null, 2), "utf8");

  expect(errors).toEqual([]);
});
