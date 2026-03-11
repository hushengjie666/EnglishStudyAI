import { describe, expect, it } from "vitest";
import { updatePlanFromSession } from "../../frontend/src/app/flows/update-plan-from-session";

describe("US2 adaptive plan update", () => {
  it("increments version and injects weakness words", () => {
    const updated = updatePlanFromSession(
      {
        level: "Intermediate",
        summary: "base",
        focusWords: ["ai-term-1", "ai-term-2"]
      },
      {
        masteredWords: ["ai-term-1"],
        missedWords: ["Latency", "Ledger"]
      },
      1
    );

    expect(updated.version).toBe(2);
    expect(updated.focusWords[0]).toBe("latency");
    expect(updated.adjustmentReason).toContain("latency");
  });
});
