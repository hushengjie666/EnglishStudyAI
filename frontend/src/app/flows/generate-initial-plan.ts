import type { GoalLevelId } from "../state/learning-options";
import { requestAi } from "../services/ai-client";
import { getAiProviderConfig } from "../services/ai-provider";

export interface InitialPlanInput {
  domain: string;
  goalLevel: GoalLevelId;
  score: number;
}

export interface GeneratedPlan {
  level: string;
  focusWords: string[];
  summary: string;
}

export function estimateLevelFromScore(score: number): string {
  if (score >= 85) {
    return "进阶";
  }
  if (score >= 60) {
    return "提升";
  }
  return "基础";
}

function goalLevelLabel(goalLevel: string): string {
  const labels: Record<string, string> = {
    READING: "看懂文章",
    LISTEN_SPEAK: "能听能说",
    FLUENT: "流畅交流",
    EXPERT: "专家级别"
  };
  return labels[goalLevel] ?? goalLevel;
}

function domainFocusVocabulary(domain: string): string[] {
  const key = domain.trim().toLowerCase();

  if (key.includes("ai")) {
    return ["model training", "inference", "prompt design", "dataset", "latency"];
  }
  if (key.includes("it") || key.includes("tech")) {
    return ["deployment", "API integration", "debugging", "version release", "scalability"];
  }
  if (key.includes("finance")) {
    return ["cash flow", "profit margin", "budget control", "balance sheet", "liability"];
  }
  if (key.includes("travel")) {
    return ["itinerary", "check-in", "reservation", "boarding pass", "connecting flight"];
  }
  if (key.includes("social")) {
    return ["small talk", "networking", "introduce oneself", "keep in touch", "body language"];
  }

  return ["deadline", "proposal", "meeting agenda", "follow-up", "deliverable"];
}

function normalizePlanOutput(raw: Partial<GeneratedPlan>, fallback: GeneratedPlan): GeneratedPlan {
  const summary = typeof raw.summary === "string" && raw.summary.trim() ? raw.summary.trim() : fallback.summary;
  const level = typeof raw.level === "string" && raw.level.trim() ? raw.level.trim() : fallback.level;
  const focusWords = Array.isArray(raw.focusWords)
    ? raw.focusWords.map((item) => String(item).trim()).filter((item) => item.length > 0).slice(0, 8)
    : fallback.focusWords;

  return {
    summary,
    level,
    focusWords: focusWords.length > 0 ? focusWords : fallback.focusWords
  };
}

export function buildInitialPlan(input: InitialPlanInput): GeneratedPlan {
  const level = estimateLevelFromScore(input.score);
  const goalLabel = goalLevelLabel(input.goalLevel);
  const focusWords = domainFocusVocabulary(input.domain);

  return {
    level,
    focusWords,
    summary: `${input.domain} 领域目标为“${goalLabel}”，当前建议从${level}阶段开始，按“输入-练习-复盘”三段式推进。`
  };
}

export async function buildInitialPlanWithAi(input: InitialPlanInput): Promise<GeneratedPlan> {
  const fallback = buildInitialPlan(input);
  const config = getAiProviderConfig();
  if (!config.apiKey || !config.baseUrl || !config.endpoint || !config.model) {
    return fallback;
  }

  try {
    const response = await requestAi<
      {
        model: string;
        messages: Array<{ role: "system" | "user"; content: string }>;
        temperature: number;
        response_format?: { type: "json_object" };
      },
      { choices?: Array<{ message?: { content?: string } }> }
    >({
      endpoint: config.endpoint,
      payload: {
        model: config.model,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "你是英语学习教研专家。请输出严谨、可执行、中文化的词汇学习计划 JSON。"
          },
          {
            role: "user",
            content:
              `学习领域：${input.domain}；目标等级：${goalLevelLabel(input.goalLevel)}；测评分数：${input.score}。` +
              '请返回 JSON：{"level":"基础/提升/进阶","summary":"...","focusWords":["..."]}。' +
              "focusWords 要 5-8 个，必须是与该领域相关的英文单词或短语，不要返回占位符。"
          }
        ]
      },
      retries: 1,
      timeoutMs: 12000,
      baseUrl: config.baseUrl,
      apiKey: config.apiKey
    });

    const content = response.data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      return fallback;
    }

    const jsonStart = content.indexOf("{");
    const jsonEnd = content.lastIndexOf("}");
    const jsonText = jsonStart >= 0 && jsonEnd > jsonStart ? content.slice(jsonStart, jsonEnd + 1) : content;
    const parsed = JSON.parse(jsonText) as Partial<GeneratedPlan>;
    return normalizePlanOutput(parsed, fallback);
  } catch {
    return fallback;
  }
}
