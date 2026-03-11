import { describe, expect, it } from "vitest";
import { dynamicLearningOptionsInternal } from "../../frontend/src/app/services/dynamic-learning-options";

describe("US1 dynamic learning options", () => {
  it("normalizes AI domains and removes invalid values", () => {
    const domains = dynamicLearningOptionsInternal.normalizeDomains([" IT ", "", "AI", "IT", 1, null]);
    expect(domains).toEqual(["IT", "AI"]);
  });

  it("normalizes goal levels from mixed payload format", () => {
    const goals = dynamicLearningOptionsInternal.normalizeGoalLevels([
      "看懂文章",
      { id: "FLUENT", label: "流畅交流" },
      { label: "能听能说" },
      { id: "", label: "" }
    ]);
    expect(goals[0]?.label).toBe("看懂文章");
    expect(goals[1]?.id).toBe("FLUENT");
    expect(goals.some((item) => item.label === "能听能说")).toBe(true);
  });

  it("builds different fallback goal levels by domain", () => {
    const finance = dynamicLearningOptionsInternal.buildFallbackGoalLevelsByDomain("Finance");
    const travel = dynamicLearningOptionsInternal.buildFallbackGoalLevelsByDomain("Travel");
    expect(finance[0]?.label).not.toBe(travel[0]?.label);
    expect(finance[0]?.label).toContain("财务英语");
    expect(travel[0]?.label).toContain("旅游英语");
  });
});
