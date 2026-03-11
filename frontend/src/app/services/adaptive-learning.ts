import { loadState, saveState } from "./local-storage";

const LEARNING_STATE_KEY = "adaptive-learning-state-v1";
const REVIEW_DUE_WINDOW_MS = 24 * 60 * 60 * 1000;

export type ReviewBand = "mastered" | "review" | "relearn";

export interface WordEvaluation {
  word: string;
  score: number;
  band: ReviewBand;
}

export interface WordLearningState {
  word: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  lapseCount: number;
  dueAt: number;
  lastScore: number;
  updatedAt: number;
}

export interface AdaptiveReviewSnapshot {
  dueNowWords: string[];
  recommendedFocusWords: string[];
  reviewSummary: string;
}

type LearningStateMap = Record<string, WordLearningState>;

function normalizeWord(value: string): string {
  return value.trim().toLowerCase();
}

function sanitizeScore(score: number): number {
  if (!Number.isFinite(score)) {
    return 0;
  }
  return Math.max(0, Math.min(5, Math.round(score)));
}

function dedupeWords(words: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const word of words) {
    const normalized = normalizeWord(word);
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    result.push(normalized);
  }
  return result;
}

function baselineState(word: string, now: number): WordLearningState {
  return {
    word,
    easeFactor: 2.5,
    intervalDays: 1,
    repetitions: 0,
    lapseCount: 0,
    dueAt: now,
    lastScore: 0,
    updatedAt: now
  };
}

function updateBySm2(previous: WordLearningState, quality: number, now: number): WordLearningState {
  const score = sanitizeScore(quality);
  const next = { ...previous };
  next.lastScore = score;
  next.updatedAt = now;

  if (score >= 3) {
    if (next.repetitions === 0) {
      next.intervalDays = 1;
    } else if (next.repetitions === 1) {
      next.intervalDays = 3;
    } else {
      next.intervalDays = Math.max(1, Math.round(next.intervalDays * next.easeFactor));
    }
    next.repetitions += 1;
    const delta = 0.1 - (5 - score) * (0.08 + (5 - score) * 0.02);
    next.easeFactor = Math.max(1.3, next.easeFactor + delta);
  } else {
    next.repetitions = 0;
    next.intervalDays = 1;
    next.easeFactor = Math.max(1.3, next.easeFactor - 0.2);
    next.lapseCount += 1;
  }

  next.dueAt = now + next.intervalDays * 24 * 60 * 60 * 1000;
  return next;
}

function toSortedStates(map: LearningStateMap): WordLearningState[] {
  return Object.values(map).sort((a, b) => a.dueAt - b.dueAt);
}

export function loadAdaptiveLearningState(): LearningStateMap {
  const raw = loadState<LearningStateMap>(LEARNING_STATE_KEY);
  if (!raw || typeof raw !== "object") {
    return {};
  }

  const output: LearningStateMap = {};
  for (const [key, state] of Object.entries(raw)) {
    if (!state || typeof state !== "object") {
      continue;
    }
    const word = normalizeWord(key || String((state as { word?: unknown }).word ?? ""));
    if (!word) {
      continue;
    }
    const numeric = state as Partial<WordLearningState>;
    output[word] = {
      word,
      easeFactor: Number.isFinite(numeric.easeFactor) ? Number(numeric.easeFactor) : 2.5,
      intervalDays: Number.isFinite(numeric.intervalDays) ? Math.max(1, Number(numeric.intervalDays)) : 1,
      repetitions: Number.isFinite(numeric.repetitions) ? Math.max(0, Number(numeric.repetitions)) : 0,
      lapseCount: Number.isFinite(numeric.lapseCount) ? Math.max(0, Number(numeric.lapseCount)) : 0,
      dueAt: Number.isFinite(numeric.dueAt) ? Number(numeric.dueAt) : Date.now(),
      lastScore: Number.isFinite(numeric.lastScore) ? sanitizeScore(Number(numeric.lastScore)) : 0,
      updatedAt: Number.isFinite(numeric.updatedAt) ? Number(numeric.updatedAt) : Date.now()
    };
  }
  return output;
}

export function saveAdaptiveLearningState(state: LearningStateMap): void {
  saveState(LEARNING_STATE_KEY, state);
}

export function applyAdaptiveLearning(
  evaluations: WordEvaluation[],
  currentFocusWords: string[],
  now = Date.now()
): AdaptiveReviewSnapshot {
  const state = loadAdaptiveLearningState();
  for (const item of evaluations) {
    const word = normalizeWord(item.word);
    if (!word) {
      continue;
    }
    const previous = state[word] ?? baselineState(word, now);
    const bandAdjustedScore = item.band === "relearn" ? Math.min(item.score, 2) : item.band === "review" ? Math.min(item.score, 3) : item.score;
    state[word] = updateBySm2(previous, bandAdjustedScore, now);
  }

  saveAdaptiveLearningState(state);

  const dueStates = toSortedStates(state).filter((item) => item.dueAt <= now + REVIEW_DUE_WINDOW_MS);
  const dueNowWords = dueStates.map((item) => item.word);
  const currentWords = dedupeWords(currentFocusWords);
  const weakWords = toSortedStates(state)
    .filter((item) => item.lapseCount > 0)
    .sort((a, b) => b.lapseCount - a.lapseCount || a.dueAt - b.dueAt)
    .map((item) => item.word);
  const recommendedFocusWords = dedupeWords([...dueNowWords, ...weakWords, ...currentWords]).slice(0, 8);

  const summary =
    dueNowWords.length > 0
      ? `系统已自动加入 ${dueNowWords.length} 个到期复习词，优先巩固：${dueNowWords.slice(0, 3).join("、")}。`
      : "系统未发现到期复习词，下一轮将自动加入新词并保持少量回顾。";

  return {
    dueNowWords,
    recommendedFocusWords,
    reviewSummary: summary
  };
}

export function getRecommendedSessionFocusWords(baseFocusWords: string[], now = Date.now()): string[] {
  const state = loadAdaptiveLearningState();
  const dueWords = toSortedStates(state)
    .filter((item) => item.dueAt <= now + REVIEW_DUE_WINDOW_MS)
    .map((item) => item.word);
  return dedupeWords([...dueWords, ...baseFocusWords]).slice(0, 8);
}

export const adaptiveLearningInternal = {
  normalizeWord,
  dedupeWords,
  updateBySm2
};
