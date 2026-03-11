import { describe, expect, it } from "vitest";
import { generateAssessmentQuiz, scoreAssessmentQuiz } from "../../frontend/src/app/flows/generate-assessment-quiz";

describe("US1 assessment quiz", () => {
  it("generates 6 multiple-choice questions", () => {
    const questions = generateAssessmentQuiz("AI");
    expect(questions).toHaveLength(6);
    questions.forEach((question) => {
      expect(question.options).toHaveLength(4);
      expect(question.answerIndex).toBeGreaterThanOrEqual(0);
      expect(question.answerIndex).toBeLessThan(4);
    });
  });

  it("scores quiz based on selected answers", () => {
    const questions = generateAssessmentQuiz("Finance");
    const answers = questions.map((question) => question.answerIndex);
    expect(scoreAssessmentQuiz(questions, answers)).toBe(100);
  });
});
