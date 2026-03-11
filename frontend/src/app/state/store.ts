export interface ProfileState {
  domain: string;
  goalLevel: string;
}

export interface AssessmentState {
  score: number;
  level: string;
}

export interface PlanState {
  version: number;
  focusWords: string[];
}

export interface SessionState {
  mastered: string[];
  missed: string[];
}

export interface AppState {
  profile: ProfileState | null;
  assessment: AssessmentState | null;
  plan: PlanState | null;
  session: SessionState | null;
}

const state: AppState = {
  profile: null,
  assessment: null,
  plan: null,
  session: null
};

export function getState(): AppState {
  return state;
}

export function patchState(next: Partial<AppState>): AppState {
  Object.assign(state, next);
  return state;
}

export function resetState(): AppState {
  state.profile = null;
  state.assessment = null;
  state.plan = null;
  state.session = null;
  return state;
}
