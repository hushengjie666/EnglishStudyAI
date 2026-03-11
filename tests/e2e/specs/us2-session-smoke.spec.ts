import { expect, test } from "../../../frontend/node_modules/@playwright/test/index.js";
import { mkdir, writeFile } from "node:fs/promises";

test("US2 learning session submission", async ({ page }) => {
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
  await page.locator("#start-session").click();

  await expect(page.getByTestId("session-page")).toBeVisible();
  await expect.poll(async () => await page.locator(".lesson-answer").count(), { timeout: 20000 }).toBeGreaterThan(0);
  const lessonAnswers = page.locator(".lesson-answer");
  const lessonCount = await lessonAnswers.count();
  for (let i = 0; i < lessonCount; i += 1) {
    await lessonAnswers.nth(i).fill("I can explain this word with a work example.");
  }
  await page.locator("#submit-session").click();

  await expect(page.getByTestId("plan-page")).toBeVisible({ timeout: 30000 });
  await expect(page.locator("#plan-version")).toContainText("2", { timeout: 30000 });

  await page.screenshot({ path: "tests/e2e/artifacts/screenshots/us2-session.png", fullPage: true });
  await mkdir("tests/e2e/artifacts/console", { recursive: true });
  await writeFile("tests/e2e/artifacts/console/us2-session-console.json", JSON.stringify(errors, null, 2), "utf8");

  expect(errors).toEqual([]);
});
