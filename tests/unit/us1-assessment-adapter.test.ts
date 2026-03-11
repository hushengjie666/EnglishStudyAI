import { describe, expect, it } from "vitest";
import { buildInitialPlan, estimateLevelFromScore } from "../../frontend/src/app/flows/generate-initial-plan";

describe("US1 assessment adapter", () => {
  it("maps score to level", () => {
    expect(estimateLevelFromScore(90)).toBe("进阶");
    expect(estimateLevelFromScore(70)).toBe("提升");
    expect(estimateLevelFromScore(30)).toBe("基础");
  });

  it("builds a deterministic plan", () => {
    const result = buildInitialPlan({
      domain: "AI",
      goalLevel: "READING",
      score: 88
    });

    expect(result.level).toBe("进阶");
    expect(result.focusWords.length).toBe(5);
    expect(result.summary).toContain("AI");
  });
});
