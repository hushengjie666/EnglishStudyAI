export interface GoalLevelOption {
  id: string;
  label: string;
}

export const DEFAULT_POPULAR_DOMAINS = ["Social", "Finance", "Travel", "IT", "AI"] as const;

export const DEFAULT_GOAL_LEVELS: ReadonlyArray<GoalLevelOption> = [
  { id: "READING", label: "看懂文章" },
  { id: "LISTEN_SPEAK", label: "能听能说" },
  { id: "FLUENT", label: "流畅交流" },
  { id: "EXPERT", label: "专家级别" }
] as const;

export type GoalLevelId = string;

export function isValidGoalLevel(value: string, goalLevels: ReadonlyArray<GoalLevelOption> = DEFAULT_GOAL_LEVELS): value is GoalLevelId {
  return goalLevels.some((goal) => goal.id === value);
}

export function resolveDomain(selected: string, custom: string): string {
  return custom.trim() || selected.trim();
}
