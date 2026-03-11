import { describe, expect, it } from "vitest";
import { performance } from "node:perf_hooks";
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

describe("core flow time budget", () => {
  it("completes entry->plan flow under 3 minutes", async () => {
    Object.assign(import.meta.env, { VITE_AI_API_KEY: "" });
    const start = performance.now();

    const root = document.createElement("div");
    root.id = "app";
    bootstrapApp(root);

    const enter = root.querySelector<HTMLButtonElement>("#enter-workspace");
    if (!enter) throw new Error("entry button not found");
    enter.click();
    await waitForHomeOptionsReady(root);

    const goal = root.querySelector<HTMLSelectElement>("#goal-level");
    if (!goal) throw new Error("goal select not found");
    goal.value = goal.options[1]?.value ?? "";
    goal.dispatchEvent(new Event("change", { bubbles: true }));

    const startAssessment = root.querySelector<HTMLButtonElement>("#go-assessment");
    if (!startAssessment) throw new Error("assessment button not found");
    startAssessment.click();

    answerAssessmentQuiz(root);

    const submit = root.querySelector<HTMLButtonElement>("#submit-assessment");
    if (!submit) throw new Error("submit assessment button not found");
    submit.click();

    const end = performance.now();
    expect(end - start).toBeLessThan(180000);
    expect(root.querySelector('[data-testid="plan-page"]')).toBeTruthy();
  });
});
