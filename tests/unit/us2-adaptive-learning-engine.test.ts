import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  adaptiveLearningInternal,
  applyAdaptiveLearning,
  getRecommendedSessionFocusWords
} from "../../frontend/src/app/services/adaptive-learning";

describe("US2 adaptive learning engine", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-10T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("uses spaced-repetition style interval growth for high score", () => {
    const now = Date.now();
    const base = {
      word: "latency",
      easeFactor: 2.5,
      intervalDays: 1,
      repetitions: 2,
      lapseCount: 0,
      dueAt: now,
      lastScore: 3,
      updatedAt: now
    };
    const updated = adaptiveLearningInternal.updateBySm2(base, 5, now);
    expect(updated.repetitions).toBe(3);
    expect(updated.intervalDays).toBeGreaterThanOrEqual(2);
    expect(updated.easeFactor).toBeGreaterThanOrEqual(2.5);
  });

  it("pushes low quality answers into relearn track", () => {
    const result = applyAdaptiveLearning(
      [{ word: "ledger", score: 1, band: "relearn" }],
      ["pipeline", "ledger"]
    );
    expect(result.recommendedFocusWords[0]).toBe("ledger");
    expect(result.reviewSummary).toContain("自动");
  });

  it("prioritizes due words for next session", () => {
    applyAdaptiveLearning(
      [
        { word: "cloud", score: 1, band: "relearn" },
        { word: "model", score: 4, band: "mastered" }
      ],
      ["pipeline"]
    );
    const nextFocus = getRecommendedSessionFocusWords(["latency"]);
    expect(nextFocus).toContain("cloud");
    expect(nextFocus[0]).toBe("cloud");
  });
});
