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

describe("US3 assignment flow integration", () => {
  it("generates assignment and returns result feedback", async () => {
    Object.assign(import.meta.env, { VITE_AI_API_KEY: "" });
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

    const start = root.querySelector<HTMLButtonElement>("#go-assessment");
    if (!start) throw new Error("assessment start not found");
    start.click();

    answerAssessmentQuiz(root);

    const submitAssessment = root.querySelector<HTMLButtonElement>("#submit-assessment");
    if (!submitAssessment) throw new Error("assessment submit not found");
    submitAssessment.click();

    const request = root.querySelector<HTMLButtonElement>("#request-assignment");
    if (!request) throw new Error("assignment request not found");
    request.click();

    const answerInputs = root.querySelectorAll<HTMLInputElement>(".assignment-answer");
    answerInputs.forEach((input, idx) => {
      input.value = idx % 2 === 0 ? "answer" : "";
    });

    const submitAssignment = root.querySelector<HTMLButtonElement>("#submit-assignment");
    if (!submitAssignment) throw new Error("assignment submit not found");
    submitAssignment.click();

    expect(root.querySelector('[data-testid="plan-page"]')).toBeTruthy();
    expect(root.textContent).toContain("得分：");
  });
});
