import type { AssignmentQuestion } from "../app/flows/generate-assignment";

export function renderAssignmentPage(questions: AssignmentQuestion[], errorMessage: string): string {
  const rows = questions
    .map(
      (q) => `
      <label>${q.prompt}
        <input class="assignment-answer" data-question-id="${q.id}" />
      </label>
    `
    )
    .join("");

  return `
    <section class="panel" data-testid="assignment-page">
      <h2>课堂作业</h2>
      ${rows}
      <div class="row-actions">
        <button id="submit-assignment" type="button">提交作业</button>
        <button id="back-to-plan" type="button">返回学习计划</button>
      </div>
      <p class="error">${errorMessage}</p>
    </section>
  `;
}
