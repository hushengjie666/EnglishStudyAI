export const ERROR_PROMPTS = {
  MISSING_DOMAIN: "请选择学习领域，或输入自定义领域。",
  MISSING_GOAL: "请选择学习目标等级。",
  INVALID_SCORE: "请输入 0 到 100 之间的测评分数。",
  MISSING_ASSESSMENT: "测评题目暂未准备完成，请返回重试。",
  MISSING_ASSESSMENT_ANSWER: "请完成所有测评题后再提交。",
  EMPTY_SESSION: "请至少填写一个已掌握或未掌握单词。",
  MISSING_ASSIGNMENT: "请先生成课堂作业，再提交答案。"
} as const;
