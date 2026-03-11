import { requestAi } from "../services/ai-client";
import { getAiProviderConfig } from "../services/ai-provider";

export interface SessionLesson {
  id: string;
  word: string;
  meaning: string;
  memoryTip: string;
  exampleEn: string;
  exampleZh: string;
  checkpoint: string;
}

interface SessionLessonInput {
  domain: string;
  goalLevel: string;
  focusWords: string[];
}

function normalizeLessons(input: unknown, fallbackWords: string[]): SessionLesson[] {
  if (!Array.isArray(input)) {
    return buildFallbackLessons(fallbackWords);
  }

  const lessons: SessionLesson[] = [];
  for (const [index, item] of input.entries()) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const keyword = "keyword" in item ? String((item as { keyword?: unknown }).keyword ?? "").trim() : "";
    const word = "word" in item ? String((item as { word?: unknown }).word ?? "").trim() : keyword;
    const meaning = "meaning" in item ? String((item as { meaning?: unknown }).meaning ?? "").trim() : "";
    const memoryTip = "memoryTip" in item ? String((item as { memoryTip?: unknown }).memoryTip ?? "").trim() : "";
    const exampleEn = "exampleEn" in item ? String((item as { exampleEn?: unknown }).exampleEn ?? "").trim() : "";
    const exampleZh = "exampleZh" in item ? String((item as { exampleZh?: unknown }).exampleZh ?? "").trim() : "";
    const example = "example" in item ? String((item as { example?: unknown }).example ?? "").trim() : "";
    const checkpoint = "checkpoint" in item ? String((item as { checkpoint?: unknown }).checkpoint ?? "").trim() : "";

    if (!word) {
      continue;
    }

    lessons.push({
      id: `lesson-${index + 1}`,
      word,
      meaning: meaning || "请结合上下文理解该词含义",
      memoryTip: memoryTip || "先把词放进一个熟悉场景里，再复述一遍。",
      exampleEn: exampleEn || example || `Please use "${word}" in your work conversation.`,
      exampleZh: exampleZh || `请在工作场景中使用“${word}”完成一句表达。`,
      checkpoint: checkpoint || `请用 10 秒解释 "${word}" 并造句。`
    });
  }

  return lessons.length > 0 ? lessons.slice(0, 8) : buildFallbackLessons(fallbackWords);
}

function buildFallbackLessons(focusWords: string[]): SessionLesson[] {
  const words = focusWords.slice(0, 8);
  if (words.length === 0) {
    words.push("核心词汇");
  }

  return words.map((word, index) => ({
    id: `lesson-${index + 1}`,
    word,
    meaning: "请结合当前领域语境理解该词义。",
    memoryTip: `记忆法：把“${word}”和你今天的一项真实工作任务绑定，复述 3 次。`,
    exampleEn: `I will use "${word}" clearly in today's meeting.`,
    exampleZh: `我会在今天的会议中准确使用“${word}”。`,
    checkpoint: `回忆检查：不用看提示，说出“${word}”的含义并造句。`
  }));
}

export async function generateSessionLessons(input: SessionLessonInput): Promise<SessionLesson[]> {
  const fallback = buildFallbackLessons(input.focusWords);
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
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "你是英语教研老师。请输出可操作、易记忆的微课 JSON。"
          },
          {
            role: "user",
            content:
              `学习领域：${input.domain}；目标等级：${input.goalLevel}；本节重点：${input.focusWords.join("、")}。` +
              '请返回 JSON：{"lessons":[{"word":"","meaning":"","memoryTip":"","exampleEn":"","exampleZh":"","checkpoint":""}]}' +
              "，数量 5-8 条。word 必须是英文单词或短语；其余字段用中文，exampleEn 用英文完整句。"
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

    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");
    const jsonText = start >= 0 && end > start ? content.slice(start, end + 1) : content;
    const parsed = JSON.parse(jsonText) as { lessons?: unknown };
    return normalizeLessons(parsed.lessons, input.focusWords);
  } catch {
    return fallback;
  }
}
