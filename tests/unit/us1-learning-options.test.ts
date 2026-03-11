import { describe, expect, it } from "vitest";
import { isValidGoalLevel, resolveDomain } from "../../frontend/src/app/state/learning-options";

describe("US1 learning options", () => {
  it("resolves custom domain over selected domain", () => {
    expect(resolveDomain("AI", "Finance")).toBe("Finance");
    expect(resolveDomain("AI", "")).toBe("AI");
  });

  it("validates goal levels", () => {
    expect(isValidGoalLevel("READING")).toBe(true);
    expect(isValidGoalLevel("INVALID")).toBe(false);
  });
});
