import type { SessionLesson } from "../app/flows/generate-session-lessons";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function renderSessionPage(
  lessons: SessionLesson[],
  answers: Record<string, string>,
  diagnosis: string,
  loading: boolean,
  evaluating: boolean,
  errorMessage: string
): string {
  const cards = lessons
    .map(
      (lesson) => `
      <article class="lesson-card">
        <h3>${lesson.word}</h3>
        <p><strong>词义：</strong>${lesson.meaning}</p>
        <p><strong>记忆法：</strong>${lesson.memoryTip}</p>
        <p><strong>示例（英文）：</strong>${lesson.exampleEn}</p>
        <p><strong>示例（中文）：</strong>${lesson.exampleZh}</p>
        <p><strong>回忆检查：</strong>${lesson.checkpoint}</p>
        <label>你的回答（系统将自动判断是否掌握）
          <textarea class="lesson-answer" data-lesson-id="${lesson.id}" rows="2" placeholder="输入你对该词的解释或造句">${escapeHtml(answers[lesson.id] ?? "")}</textarea>
        </label>
      </article>
    `
    )
    .join("");

  return `
    <section class="panel" data-testid="session-page">
      <h2>学习记录与课堂微课</h2>
      <p class="hint">围绕本轮重点词，先看记忆法与示例，再用自己的话作答。系统会自动判断是否掌握并安排复习。</p>
      ${
        loading
          ? `<div class="loading-block" id="session-loading" role="status" aria-live="polite">
              <span class="loading-spinner" aria-hidden="true"></span>
              <div>
                <p class="loading-title">正在准备本节学习内容</p>
                <p class="hint">系统正在生成词汇、记忆法与练习检查点，请稍候...</p>
              </div>
            </div>`
          : ""
      }
      ${
        evaluating
          ? `<div class="loading-block" id="session-evaluating" role="status" aria-live="polite">
              <span class="loading-spinner" aria-hidden="true"></span>
              <div>
                <p class="loading-title">正在判定掌握情况</p>
                <p class="hint">系统正在分析你的作答并更新下一轮学习计划...</p>
              </div>
            </div>`
          : ""
      }
      <section class="lesson-grid" data-testid="lesson-grid">${cards}</section>
      ${diagnosis ? `<p class="hint" id="session-diagnosis">${diagnosis}</p>` : ""}
      <button id="submit-session" type="button" ${loading || evaluating ? "disabled" : ""}>智能判定并更新学习计划</button>
      <p class="error">${errorMessage}</p>
    </section>
  `;
}
