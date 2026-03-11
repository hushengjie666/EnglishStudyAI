import type { AssessmentQuestion } from "../app/flows/generate-assessment-quiz";

export function renderAssessmentPage(questions: AssessmentQuestion[], errorMessage: string): string {
  const rows = questions
    .map((question) => {
      const options = question.options
        .map(
          (option, idx) => `
            <label class="quiz-option">
              <input type="radio" name="assessment-${question.id}" value="${idx}" />
              <span>${option}</span>
            </label>
          `
        )
        .join("");

      return `
        <fieldset class="quiz-item">
          <legend>${question.prompt}</legend>
          ${options}
        </fieldset>
      `;
    })
    .join("");

  return `
    <section class="panel" data-testid="assessment-page">
      <h2>词汇短测</h2>
      <p class="hint">请在 1-2 分钟内完成以下题目，提交后系统会自动评分。</p>
      ${rows}
      <button id="submit-assessment" type="button">提交测评并生成学习计划</button>
      <p class="error">${errorMessage}</p>
    </section>
  `;
}
