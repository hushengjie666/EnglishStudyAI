import type { UpdatedPlan } from "../flows/update-plan-from-session";

export interface PlanHistoryEntry {
  version: number;
  summary: string;
  adjustmentReason: string;
}

const history: PlanHistoryEntry[] = [];

export function addPlanHistory(plan: UpdatedPlan): PlanHistoryEntry[] {
  history.push({
    version: plan.version,
    summary: plan.summary,
    adjustmentReason: plan.adjustmentReason
  });

  return [...history];
}

export function getPlanHistory(): PlanHistoryEntry[] {
  return [...history];
}

export function clearPlanHistory(): void {
  history.length = 0;
}
