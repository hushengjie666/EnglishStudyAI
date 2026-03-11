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

async function waitForLessonAnswersReady(root: HTMLDivElement): Promise<void> {
  for (let i = 0; i < 50; i += 1) {
    if (root.querySelectorAll(".lesson-answer").length > 0) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 20));
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

describe("US2 adaptive flow integration", () => {
  it("updates plan version after session submission", async () => {
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

    const startSession = root.querySelector<HTMLButtonElement>("#start-session");
    if (!startSession) throw new Error("session start not found");
    startSession.click();
    await waitForLessonAnswersReady(root);

    const answers = root.querySelectorAll<HTMLTextAreaElement>(".lesson-answer");
    if (answers.length === 0) throw new Error("lesson answers missing");
    answers.forEach((answer, index) => {
      answer.value = index % 2 === 0 ? "I can explain this word in a project meeting." : "";
    });

    const submitSession = root.querySelector<HTMLButtonElement>("#submit-session");
    if (!submitSession) throw new Error("session submit not found");
    submitSession.click();

    expect(root.querySelector('[data-testid="plan-page"]')).toBeTruthy();
    expect(root.textContent).toContain("版本：2");
  });
});
