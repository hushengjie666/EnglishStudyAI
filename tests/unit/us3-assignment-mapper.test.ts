import { describe, expect, it } from "vitest";
import { mapAssignmentPayload } from "../../frontend/src/app/flows/generate-assignment";

describe("US3 assignment mapper", () => {
  it("maps knowledge points to assignment questions", () => {
    const questions = mapAssignmentPayload({
      knowledgePoints: ["cloud", "latency", "ledger"],
      goalLevel: "READING"
    });

    expect(questions).toHaveLength(3);
    expect(questions[0].prompt).toContain("cloud");
  });
});
