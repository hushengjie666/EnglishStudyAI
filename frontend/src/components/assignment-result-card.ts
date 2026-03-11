export interface AssignmentResult {
  total: number;
  correct: number;
  score: number;
  feedback: string;
}

export function evaluateAssignment(total: number, correct: number): AssignmentResult {
  const safeTotal = Math.max(total, 1);
  const score = Math.round((correct / safeTotal) * 100);

  return {
    total,
    correct,
    score,
    feedback: score >= 80 ? "掌握优秀，继续巩固即可。" : score >= 60 ? "进步明显，建议继续练习薄弱词。" : "当前薄弱词较多，建议复习后再测一次。"
  };
}
