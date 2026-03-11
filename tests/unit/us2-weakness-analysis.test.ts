import { describe, expect, it } from "vitest";
import { extractWeaknessTags } from "../../frontend/src/app/services/weakness-analyzer";

describe("US2 weakness analysis", () => {
  it("extracts unique normalized tags", () => {
    const result = extractWeaknessTags(["Cloud", " cloud ", "Latency", ""]);
    expect(result.weaknessTags).toEqual(["cloud", "latency"]);
    expect(result.weaknessCount).toBe(2);
  });
});
