export interface WeaknessAnalysis {
  weaknessTags: string[];
  weaknessCount: number;
}

export function extractWeaknessTags(missedWords: string[]): WeaknessAnalysis {
  const normalized = missedWords
    .map((word) => word.trim().toLowerCase())
    .filter((word) => word.length > 0);

  const unique = Array.from(new Set(normalized));
  return {
    weaknessTags: unique,
    weaknessCount: unique.length
  };
}
