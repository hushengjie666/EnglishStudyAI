import { loadState, saveState } from "../services/local-storage";

export interface PersistedCoreState {
  route: "entry" | "home" | "assessment" | "session" | "assignment" | "plan";
  selectedDomain: string;
  customDomain: string;
  goalLevel: string;
  assessmentScore: number;
  planSummary: string;
  planLevel: string;
  focusWords: string[];
}

const STATE_KEY = "mvp-core";

export function persistCoreState(state: PersistedCoreState): void {
  saveState(STATE_KEY, state);
}

export function restoreCoreState(): PersistedCoreState | null {
  return loadState<PersistedCoreState>(STATE_KEY);
}
