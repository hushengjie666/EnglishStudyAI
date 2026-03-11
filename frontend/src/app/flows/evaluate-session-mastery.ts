import { requestAi } from "../services/ai-client";
import { getAiProviderConfig } from "../services/ai-provider";
import type { ReviewBand, WordEvaluation } from "../services/adaptive-learning";
import type { SessionLesson } from "./generate-session-lessons";

export interface SessionMasteryResult {
  masteredWords: string[];
  missedWords: string[];
  diagnosis: string;
  evaluations: WordEvaluation[];
}

function normalizeWord(word: string): string {
  return word.trim().toLowerCase();
}

function uniqueWords(words: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const word of words) {
    const trimmed = word.trim();
    if (!trimmed) {
      continue;
    }
    const key = normalizeWord(trimmed);
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(trimmed);
  }
  return result;
}

function scoreByHeuristic(lesson: SessionLesson, answer: string): number {
  const text = answer.trim().toLowerCase();
  if (text.length < 4) {
    return 0;
  }

  let score = 0;
  const firstToken = lesson.word.toLowerCase().split(/\s+/)[0] || lesson.word.toLowerCase();
  if (text.includes(firstToken)) {
    score += 1;
  }
  if (text.length >= 12) {
    score += 1;
  }
  if (text.length >= 24) {
    score += 1;
  }
  const chineseChars = lesson.meaning.replace(/[^\u4e00-\u9fff]/g, "");
  if (chineseChars.length >= 2 && text.includes(chineseChars.slice(0, 2))) {
    score += 1;
  }
  if (/[.!?。！？]/.test(text)) {
    score += 1;
  }
  return Math.max(0, Math.min(5, score));
}

function scoreToBand(score: number): ReviewBand {
  if (score >= 4) {
    return "mastered";
  }
  if (score >= 2) {
    return "review";
  }
  return "relearn";
}

export function evaluateSessionMasteryHeuristic(
  lessons: SessionLesson[],
  answers: Record<string, string>
): SessionMasteryResult {
  const mastered: string[] = [];
  const missed: string[] = [];
  const evaluations: WordEvaluation[] = [];

  for (const lesson of lessons) {
    const answer = answers[lesson.id] ?? "";
    const score = scoreByHeuristic(lesson, answer);
    const band = scoreToBand(score);
    if (band === "mastered") {
      mastered.push(lesson.word);
    } else {
      missed.push(lesson.word);
    }
    evaluations.push({
      word: lesson.word,
      score,
      band
    });
  }

  return {
    masteredWords: uniqueWords(mastered),
    missedWords: uniqueWords(missed),
    diagnosis:
      missed.length > 0
        ? `系统判定需复习 ${missed.length} 个词，建议优先复习：${uniqueWords(missed).slice(0, 3).join("、")}。`
        : "系统判定本轮词汇掌握较好，可进入下一轮学习。",
    evaluations
  };
}

export async function evaluateSessionMasteryWithAi(
  domain: string,
  lessons: SessionLesson[],
  answers: Record<string, string>
): Promise<SessionMasteryResult> {
  const fallback = evaluateSessionMasteryHeuristic(lessons, answers);
  const config = getAiProviderConfig();
  if (!config.apiKey || !config.baseUrl || !config.endpoint || !config.model) {
    return fallback;
  }

  try {
    const payload = lessons.map((lesson) => ({
      id: lesson.id,
      word: lesson.word,
      meaning: lesson.meaning,
      checkpoint: lesson.checkpoint,
      answer: answers[lesson.id] ?? ""
    }));

    const response = await requestAi<
      {
        model: string;
        temperature: number;
        response_format?: { type: "json_object" };
        messages: Array<{ role: "system" | "user"; content: string }>;
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
            content: "你是英语教学评估助手。根据学生作答判断单词是否掌握，并给出简短诊断。只输出 JSON。"
          },
          {
            role: "user",
            content:
              `学习领域：${domain}。请评估以下词汇作答：${JSON.stringify(payload)}。` +
              '返回 JSON：{"results":[{"word":"","score":0,"status":"mastered|review|relearn"}],"diagnosis":""}'
          }
        ]
      },
      retries: 0,
      timeoutMs: 8000,
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
    const parsed = JSON.parse(jsonText) as {
      results?: Array<{ word?: string; mastered?: boolean; score?: number; status?: string }>;
      diagnosis?: string;
    };

    const evaluations: WordEvaluation[] = (parsed.results ?? [])
      .map((item) => {
        const word = String(item.word ?? "").trim();
        if (!word) {
          return null;
        }
        const rawScore = Number.isFinite(item.score) ? Number(item.score) : item.mastered ? 4 : 1;
        const score = Math.max(0, Math.min(5, Math.round(rawScore)));
        const maybeStatus = String(item.status ?? "").trim().toLowerCase();
        const band: ReviewBand =
          maybeStatus === "mastered" || maybeStatus === "review" || maybeStatus === "relearn"
            ? maybeStatus
            : item.mastered
              ? "mastered"
              : scoreToBand(score);
        return { word, score, band };
      })
      .filter((item): item is WordEvaluation => Boolean(item));

    const mastered = uniqueWords(evaluations.filter((item) => item.band === "mastered").map((item) => item.word));
    const missed = uniqueWords(evaluations.filter((item) => item.band !== "mastered").map((item) => item.word));

    if (mastered.length + missed.length === 0) {
      return fallback;
    }

    return {
      masteredWords: mastered,
      missedWords: missed,
      diagnosis: parsed.diagnosis?.trim() || fallback.diagnosis,
      evaluations
    };
  } catch {
    return fallback;
  }
}
