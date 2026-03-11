import { describe, expect, it } from "vitest";
import { evaluateAssignment } from "../../frontend/src/components/assignment-result-card";

describe("US3 assignment feedback", () => {
  it("returns score and feedback", () => {
    const result = evaluateAssignment(5, 4);
    expect(result.score).toBe(80);
    expect(result.feedback).toContain("掌握优秀");
  });
});
