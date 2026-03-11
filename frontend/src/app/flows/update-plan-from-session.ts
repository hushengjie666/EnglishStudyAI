import type { GeneratedPlan } from "./generate-initial-plan";
import { extractWeaknessTags } from "../services/weakness-analyzer";

export interface SessionInput {
  masteredWords: string[];
  missedWords: string[];
  recommendedFocusWords?: string[];
  adaptiveSummary?: string;
}

export interface UpdatedPlan extends GeneratedPlan {
  version: number;
  adjustmentReason: string;
  weaknessTags: string[];
}

export function updatePlanFromSession(currentPlan: GeneratedPlan, session: SessionInput, currentVersion: number): UpdatedPlan {
  const analysis = extractWeaknessTags(session.missedWords);
  const boostedFocus = session.recommendedFocusWords && session.recommendedFocusWords.length > 0
    ? session.recommendedFocusWords.slice(0, 8)
    : [...analysis.weaknessTags, ...currentPlan.focusWords].slice(0, 8);
  const weaknessReason = analysis.weaknessCount > 0
    ? `已根据薄弱词动态调整：${analysis.weaknessTags.join(", ")}`
    : "未发现明显薄弱项，建议保持当前学习节奏。";

  return {
    ...currentPlan,
    version: currentVersion + 1,
    focusWords: boostedFocus,
    adjustmentReason: session.adaptiveSummary ? `${weaknessReason} ${session.adaptiveSummary}` : weaknessReason,
    weaknessTags: analysis.weaknessTags
  };
}
