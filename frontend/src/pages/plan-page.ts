import { renderPlanFocusList } from "../components/plan-focus-list";

export function renderPlanPage(
  summary: string,
  level: string,
  focusWords: string[],
  planVersion: number,
  adjustmentReason: string,
  weaknessTags: string[]
): string {
  const focusList = renderPlanFocusList(focusWords, weaknessTags);

  return `
    <section class="panel" data-testid="plan-page">
      <h2>学习计划</h2>
      <p id="plan-summary">${summary}</p>
      <p id="plan-level">等级：${level}</p>
      <p id="plan-version">版本：${planVersion}</p>
      <p class="hint" id="plan-version-note">版本号表示计划迭代次数：第 1 版是初始计划，每次学习记录后会自动升级到下一版。</p>
      <p id="plan-adjustment">${adjustmentReason}</p>
      ${focusList}
      <div class="row-actions">
        <button id="start-session" type="button">开始学习记录</button>
        <button id="reset-flow" type="button">重新开始</button>
      </div>
    </section>
  `;
}
