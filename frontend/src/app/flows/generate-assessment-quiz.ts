export interface AssessmentQuestion {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
}

interface VocabularyItem {
  word: string;
  meaning: string;
}

const DEFAULT_WORDS: VocabularyItem[] = [
  { word: "deadline", meaning: "截止日期" },
  { word: "proposal", meaning: "提案" },
  { word: "budget", meaning: "预算" },
  { word: "stakeholder", meaning: "利益相关方" },
  { word: "meeting agenda", meaning: "会议议程" },
  { word: "follow-up", meaning: "后续跟进" },
  { word: "milestone", meaning: "里程碑" },
  { word: "deliverable", meaning: "可交付成果" }
];

const DOMAIN_VOCAB: Record<string, VocabularyItem[]> = {
  ai: [
    { word: "model training", meaning: "模型训练" },
    { word: "inference", meaning: "推理" },
    { word: "fine-tuning", meaning: "微调" },
    { word: "dataset", meaning: "数据集" },
    { word: "prompt", meaning: "提示词" },
    { word: "token", meaning: "文本切分单元" },
    { word: "latency", meaning: "响应延迟" },
    { word: "embedding", meaning: "向量表示" }
  ],
  it: [
    { word: "deployment", meaning: "部署" },
    { word: "bug fix", meaning: "缺陷修复" },
    { word: "version control", meaning: "版本控制" },
    { word: "code review", meaning: "代码评审" },
    { word: "API integration", meaning: "接口集成" },
    { word: "downtime", meaning: "停机时间" },
    { word: "rollback", meaning: "回滚" },
    { word: "scalability", meaning: "可扩展性" }
  ],
  finance: [
    { word: "cash flow", meaning: "现金流" },
    { word: "balance sheet", meaning: "资产负债表" },
    { word: "profit margin", meaning: "利润率" },
    { word: "liability", meaning: "负债" },
    { word: "equity", meaning: "权益" },
    { word: "audit", meaning: "审计" },
    { word: "invoice", meaning: "发票" },
    { word: "forecast", meaning: "预测" }
  ],
  travel: [
    { word: "boarding pass", meaning: "登机牌" },
    { word: "itinerary", meaning: "行程单" },
    { word: "customs declaration", meaning: "报关申报" },
    { word: "check-in counter", meaning: "值机柜台" },
    { word: "departure gate", meaning: "登机口" },
    { word: "reservation", meaning: "预订" },
    { word: "single room", meaning: "单人间" },
    { word: "connecting flight", meaning: "中转航班" }
  ],
  social: [
    { word: "small talk", meaning: "寒暄闲聊" },
    { word: "networking", meaning: "建立人脉" },
    { word: "introduce oneself", meaning: "做自我介绍" },
    { word: "ice breaker", meaning: "破冰话题" },
    { word: "body language", meaning: "肢体语言" },
    { word: "keep in touch", meaning: "保持联系" },
    { word: "social cue", meaning: "社交暗示" },
    { word: "conversation starter", meaning: "开场话题" }
  ]
};

function normalizeDomain(domain: string): string {
  return domain.trim().toLowerCase();
}

function pickVocabulary(domain: string): VocabularyItem[] {
  const normalized = normalizeDomain(domain);

  if (normalized.includes("ai")) {
    return DOMAIN_VOCAB.ai;
  }
  if (normalized.includes("it") || normalized.includes("tech") || normalized.includes("software")) {
    return DOMAIN_VOCAB.it;
  }
  if (normalized.includes("finance")) {
    return DOMAIN_VOCAB.finance;
  }
  if (normalized.includes("travel")) {
    return DOMAIN_VOCAB.travel;
  }
  if (normalized.includes("social")) {
    return DOMAIN_VOCAB.social;
  }

  return DEFAULT_WORDS;
}

function buildOptions(correctMeaning: string, pool: string[], index: number): { options: string[]; answerIndex: number } {
  const distractors = pool.filter((item) => item !== correctMeaning).slice(index % 3, (index % 3) + 3);
  const base = [correctMeaning, ...distractors];
  const unique = Array.from(new Set(base)).slice(0, 4);

  while (unique.length < 4) {
    unique.push(`干扰项${unique.length + 1}`);
  }

  const rotated = [...unique.slice(1), unique[0]];
  const answerIndex = rotated.indexOf(correctMeaning);
  return { options: rotated, answerIndex };
}

export function generateAssessmentQuiz(domain: string): AssessmentQuestion[] {
  const vocabulary = pickVocabulary(domain).slice(0, 6);
  const meaningPool = pickVocabulary(domain).map((item) => item.meaning);

  return vocabulary.map((item, index) => {
    const optionData = buildOptions(item.meaning, meaningPool, index);
    return {
      id: `q${index + 1}`,
      prompt: `请选择 "${item.word}" 的最准确中文含义`,
      options: optionData.options,
      answerIndex: optionData.answerIndex
    };
  });
}

export function scoreAssessmentQuiz(questions: AssessmentQuestion[], answers: number[]): number {
  const total = Math.max(questions.length, 1);
  const correct = questions.reduce((count, question, index) => {
    return count + (answers[index] === question.answerIndex ? 1 : 0);
  }, 0);
  return Math.round((correct / total) * 100);
}
