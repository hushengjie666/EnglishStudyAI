import { describe, expect, it } from "vitest";
import { bootstrapApp } from "../../frontend/src/main";

async function waitForHomeOptionsReady(root: HTMLDivElement): Promise<void> {
  for (let i = 0; i < 20; i += 1) {
    const loadingHint = root.querySelector("#options-loading");
    if (!loadingHint) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}

function answerAssessmentQuiz(root: HTMLDivElement): void {
  const questions = root.querySelectorAll("fieldset.quiz-item");
  if (questions.length === 0) {
    throw new Error("assessment quiz not found");
  }

  questions.forEach((question) => {
    const firstOption = question.querySelector<HTMLInputElement>('input[type="radio"]');
    if (!firstOption) {
      throw new Error("assessment option not found");
    }
    firstOption.checked = true;
    firstOption.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

describe("US1 core flow integration", () => {
  it("navigates from home to assessment to plan", async () => {
    Object.assign(import.meta.env, { VITE_AI_API_KEY: "" });
    const root = document.createElement("div");
    root.id = "app";
    bootstrapApp(root);

    const enter = root.querySelector<HTMLButtonElement>("#enter-workspace");
    if (!enter) {
      throw new Error("entry button not found");
    }
    enter.click();
    await waitForHomeOptionsReady(root);

    const goal = root.querySelector<HTMLSelectElement>("#goal-level");
    if (!goal) {
      throw new Error("goal level not found");
    }
    goal.value = goal.options[1]?.value ?? "";
    goal.dispatchEvent(new Event("change", { bubbles: true }));

    const start = root.querySelector<HTMLButtonElement>("#go-assessment");
    if (!start) {
      throw new Error("start assessment button not found");
    }
    start.click();

    expect(root.querySelector('[data-testid="assessment-page"]')).toBeTruthy();

    answerAssessmentQuiz(root);

    const submit = root.querySelector<HTMLButtonElement>("#submit-assessment");
    if (!submit) {
      throw new Error("submit button not found");
    }
    submit.click();

    expect(root.querySelector('[data-testid="plan-page"]')).toBeTruthy();
    expect(root.textContent).toContain("学习计划");
  });
});
