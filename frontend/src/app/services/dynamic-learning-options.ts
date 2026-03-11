import { requestAi } from "./ai-client";
import { getAiProviderConfig } from "./ai-provider";
import { loadState, saveState } from "./local-storage";
import { DEFAULT_GOAL_LEVELS, DEFAULT_POPULAR_DOMAINS, type GoalLevelOption } from "../state/learning-options";

interface DynamicOptionsResult {
  domains: string[];
  goalLevels: GoalLevelOption[];
  source: "ai" | "fallback" | "cache";
}

interface DynamicGoalLevelsResult {
  goalLevels: GoalLevelOption[];
  source: "ai" | "fallback" | "cache";
}

export interface DynamicDomainGoalBundleResult {
  domains: string[];
  domainGoals: Record<string, GoalLevelOption[]>;
  source: "ai" | "fallback" | "cache";
}

interface ChatMessage {
  role: "system" | "user";
  content: string;
}

interface ChatCompletionResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

interface RawAiPayload {
  domains?: unknown;
  goalLevels?: unknown;
  domainGoals?: unknown;
}

interface CachedDynamicOptions {
  domains: string[];
  goalLevels: GoalLevelOption[];
  updatedAt: number;
}

const CACHE_KEY = "dynamic-learning-options";
const BUNDLE_CACHE_KEY = "dynamic-learning-options:bundle";
const CACHE_TTL_MS = 30 * 60 * 1000;

function sanitizeDomain(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeGoalId(label: string, index: number): string {
  const text = label
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  if (text.length > 0) {
    return text;
  }
  return `GOAL_${index + 1}`;
}

function normalizeDomains(input: unknown): string[] {
  if (!Array.isArray(input)) {
    return [...DEFAULT_POPULAR_DOMAINS];
  }

  const dedup = new Set<string>();
  for (const item of input) {
    if (typeof item !== "string") {
      continue;
    }

    const normalized = sanitizeDomain(item);
    if (normalized) {
      dedup.add(normalized);
    }
    if (dedup.size >= 8) {
      break;
    }
  }

  return dedup.size > 0 ? [...dedup] : [...DEFAULT_POPULAR_DOMAINS];
}

function normalizeGoalLevels(input: unknown): GoalLevelOption[] {
  if (!Array.isArray(input)) {
    return [...DEFAULT_GOAL_LEVELS];
  }

  const dedup = new Map<string, GoalLevelOption>();
  for (const [idx, item] of input.entries()) {
    if (typeof item === "string") {
      const label = item.trim();
      if (!label) {
        continue;
      }
      const id = normalizeGoalId(label, idx);
      dedup.set(id, { id, label });
    } else if (item && typeof item === "object") {
      const maybeLabel = "label" in item ? String((item as { label?: unknown }).label ?? "").trim() : "";
      const maybeId = "id" in item ? String((item as { id?: unknown }).id ?? "").trim() : "";
      if (!maybeLabel) {
        continue;
      }
      const id = maybeId || normalizeGoalId(maybeLabel, idx);
      dedup.set(id, { id, label: maybeLabel });
    }

    if (dedup.size >= 6) {
      break;
    }
  }

  return dedup.size > 0 ? [...dedup.values()] : [...DEFAULT_GOAL_LEVELS];
}

function extractJsonBlock(content: string): string {
  const codeBlock = content.match(/```json\s*([\s\S]*?)\s*```/i);
  if (codeBlock && codeBlock[1]) {
    return codeBlock[1];
  }

  const firstBrace = content.indexOf("{");
  const lastBrace = content.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return content.slice(firstBrace, lastBrace + 1);
  }
  return content;
}

function getContentFromResponse(response: ChatCompletionResponse): string {
  return response.choices?.[0]?.message?.content?.trim() ?? "";
}

function normalizeCacheKeyPart(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "");
}

function getDomainProfile(domain: string): { prefix: string; focusA: string; focusB: string } {
  const key = normalizeCacheKeyPart(domain);
  if (key.includes("finance") || key.includes("财务")) {
    return { prefix: "财务英语", focusA: "报表术语", focusB: "数据解读" };
  }
  if (key.includes("travel") || key.includes("旅游")) {
    return { prefix: "旅游英语", focusA: "出行问答", focusB: "场景对话" };
  }
  if (key.includes("social") || key.includes("社交")) {
    return { prefix: "社交英语", focusA: "寒暄表达", focusB: "观点交流" };
  }
  if (key.includes("it") || key.includes("software") || key.includes("tech") || key.includes("技术")) {
    return { prefix: "IT英语", focusA: "技术词汇", focusB: "技术说明" };
  }
  if (key.includes("ai") || key.includes("人工智能")) {
    return { prefix: "AI英语", focusA: "模型术语", focusB: "方案讲解" };
  }
  return { prefix: `${domain}英语`, focusA: "核心词汇", focusB: "场景表达" };
}

function buildFallbackGoalLevelsByDomain(domain: string): GoalLevelOption[] {
  const profile = getDomainProfile(domain);
  return [
    { id: "DOMAIN_READING", label: `${profile.prefix}：看懂${profile.focusA}文章` },
    { id: "DOMAIN_LISTENING", label: `${profile.prefix}：听懂${profile.focusA}讲解` },
    { id: "DOMAIN_SPEAKING", label: `${profile.prefix}：能进行${profile.focusB}` },
    { id: "DOMAIN_WORK", label: `${profile.prefix}：可用于真实工作沟通` },
    { id: "DOMAIN_EXPERT", label: `${profile.prefix}：专业级表达与复盘` }
  ];
}

function normalizeDomainGoals(input: unknown, domains: string[]): Record<string, GoalLevelOption[]> {
  const result: Record<string, GoalLevelOption[]> = {};
  for (const domain of domains) {
    result[domain] = buildFallbackGoalLevelsByDomain(domain);
  }

  if (!Array.isArray(input)) {
    return result;
  }

  for (const item of input) {
    if (!item || typeof item !== "object") {
      continue;
    }

    const rawDomain = "domain" in item ? String((item as { domain?: unknown }).domain ?? "").trim() : "";
    const rawGoals = "goalLevels" in item ? (item as { goalLevels?: unknown }).goalLevels : undefined;
    if (!rawDomain) {
      continue;
    }

    const matched = domains.find((domain) => domain.toLowerCase() === rawDomain.toLowerCase()) ?? rawDomain;
    result[matched] = normalizeGoalLevels(rawGoals);
  }

  return result;
}

function loadCachedDynamicOptions(): CachedDynamicOptions | null {
  const cached = loadState<CachedDynamicOptions>(CACHE_KEY);
  if (!cached) {
    return null;
  }

  if (!Array.isArray(cached.domains) || !Array.isArray(cached.goalLevels) || typeof cached.updatedAt !== "number") {
    return null;
  }

  if (Date.now() - cached.updatedAt > CACHE_TTL_MS) {
    return null;
  }

  return {
    domains: normalizeDomains(cached.domains),
    goalLevels: normalizeGoalLevels(cached.goalLevels),
    updatedAt: cached.updatedAt
  };
}

function saveCachedDynamicOptions(domains: string[], goalLevels: GoalLevelOption[]): void {
  saveState(CACHE_KEY, {
    domains,
    goalLevels,
    updatedAt: Date.now()
  } satisfies CachedDynamicOptions);
}

function loadCachedDomainGoalBundle(): DynamicDomainGoalBundleResult | null {
  const cached = loadState<{ domains: string[]; domainGoals: Record<string, GoalLevelOption[]>; updatedAt: number }>(BUNDLE_CACHE_KEY);
  if (!cached || !Array.isArray(cached.domains) || typeof cached.updatedAt !== "number" || !cached.domainGoals) {
    return null;
  }

  if (Date.now() - cached.updatedAt > CACHE_TTL_MS) {
    return null;
  }

  const domains = normalizeDomains(cached.domains);
  const domainGoals = normalizeDomainGoals(Object.entries(cached.domainGoals).map(([domain, goalLevels]) => ({ domain, goalLevels })), domains);

  return {
    domains,
    domainGoals,
    source: "cache"
  };
}

function saveCachedDomainGoalBundle(bundle: { domains: string[]; domainGoals: Record<string, GoalLevelOption[]> }): void {
  saveState(BUNDLE_CACHE_KEY, {
    domains: bundle.domains,
    domainGoals: bundle.domainGoals,
    updatedAt: Date.now()
  });
}

function loadCachedGoalLevelsByDomain(domain: string): GoalLevelOption[] | null {
  const key = `${CACHE_KEY}:goals:${normalizeCacheKeyPart(domain)}`;
  const cached = loadState<{ goalLevels: GoalLevelOption[]; updatedAt: number }>(key);
  if (!cached || typeof cached.updatedAt !== "number" || !Array.isArray(cached.goalLevels)) {
    return null;
  }

  if (Date.now() - cached.updatedAt > CACHE_TTL_MS) {
    return null;
  }

  return normalizeGoalLevels(cached.goalLevels);
}

function saveCachedGoalLevelsByDomain(domain: string, goalLevels: GoalLevelOption[]): void {
  const key = `${CACHE_KEY}:goals:${normalizeCacheKeyPart(domain)}`;
  saveState(key, {
    goalLevels,
    updatedAt: Date.now()
  });
}

async function requestGoalLevelsFromAi(domain: string): Promise<GoalLevelOption[]> {
  const config = getAiProviderConfig();
  if (!config.apiKey || !config.baseUrl || !config.endpoint || !config.model) {
    return [...DEFAULT_GOAL_LEVELS];
  }

  const messages: ChatMessage[] = [
    {
      role: "system",
      content: "你是英语学习课程设计助手。请只输出 JSON，不要输出解释。JSON 必须包含 goalLevels 字段。"
    },
    {
      role: "user",
      content:
        `为英语学习领域“${domain}”生成目标等级。请返回 JSON：{"goalLevels":[{"id":"READING","label":"看懂文章"}]}。` +
        "要求 4-6 个等级，id 用大写英文下划线，label 用中文且描述清晰递进。"
    }
  ];

  const response = await requestAi<
    { model: string; messages: ChatMessage[]; temperature: number; response_format?: { type: "json_object" } },
    ChatCompletionResponse
  >({
    endpoint: config.endpoint,
    payload: {
      model: config.model,
      messages,
      temperature: 0.3,
      response_format: { type: "json_object" }
    },
    retries: 1,
    timeoutMs: 12000,
    baseUrl: config.baseUrl,
    apiKey: config.apiKey
  });

  const content = getContentFromResponse(response.data);
  if (!content) {
    throw new Error("AI returned empty content");
  }

  const parsed = JSON.parse(extractJsonBlock(content)) as RawAiPayload;
  return normalizeGoalLevels(parsed.goalLevels);
}

async function requestDomainGoalBundleFromAi(): Promise<DynamicDomainGoalBundleResult> {
  const config = getAiProviderConfig();
  if (!config.apiKey || !config.baseUrl || !config.endpoint || !config.model) {
    throw new Error("AI config incomplete");
  }

  const messages: ChatMessage[] = [
    {
      role: "system",
      content: "你是英语学习课程设计助手。请只输出 JSON，不要输出解释。"
    },
    {
      role: "user",
      content:
        "为中国职场人士生成英语学习初始化数据。返回 JSON 字段：domains 和 domainGoals。" +
        "domains 是 5-8 个热门领域字符串数组。" +
        "domainGoals 是数组，每项格式为 {\"domain\":\"IT\",\"goalLevels\":[{\"id\":\"READING\",\"label\":\"看懂文章\"}] }。" +
        "每个 domain 提供 4-6 个目标等级，id 用大写英文下划线，label 用中文。"
    }
  ];

  const response = await requestAi<
    { model: string; messages: ChatMessage[]; temperature: number; response_format?: { type: "json_object" } },
    ChatCompletionResponse
  >({
    endpoint: config.endpoint,
    payload: {
      model: config.model,
      messages,
      temperature: 0.3,
      response_format: { type: "json_object" }
    },
    retries: 1,
    timeoutMs: 12000,
    baseUrl: config.baseUrl,
    apiKey: config.apiKey
  });

  const content = getContentFromResponse(response.data);
  if (!content) {
    throw new Error("AI returned empty content");
  }

  const parsed = JSON.parse(extractJsonBlock(content)) as RawAiPayload;
  const domains = normalizeDomains(parsed.domains);
  const domainGoals = normalizeDomainGoals(parsed.domainGoals, domains);
  return {
    domains,
    domainGoals,
    source: "ai"
  };
}

export async function loadDynamicDomainGoalBundle(): Promise<DynamicDomainGoalBundleResult> {
  const cached = loadCachedDomainGoalBundle();
  if (cached) {
    return cached;
  }

  try {
    const bundle = await requestDomainGoalBundleFromAi();
    saveCachedDomainGoalBundle({
      domains: bundle.domains,
      domainGoals: bundle.domainGoals
    });
    return bundle;
  } catch {
    const domains = [...DEFAULT_POPULAR_DOMAINS];
    const domainGoals: Record<string, GoalLevelOption[]> = {};
    for (const domain of domains) {
      domainGoals[domain] = buildFallbackGoalLevelsByDomain(domain);
    }
    return {
      domains,
      domainGoals,
      source: "fallback"
    };
  }
}

export async function loadDynamicLearningOptions(): Promise<DynamicOptionsResult> {
  const cached = loadCachedDynamicOptions();
  if (cached) {
    return {
      domains: cached.domains,
      goalLevels: cached.goalLevels,
      source: "cache"
    };
  }

  const config = getAiProviderConfig();
  if (!config.apiKey || !config.baseUrl || !config.endpoint || !config.model) {
    return {
      domains: [...DEFAULT_POPULAR_DOMAINS],
      goalLevels: [...DEFAULT_GOAL_LEVELS],
      source: "fallback"
    };
  }

  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        "你是英语学习课程设计助手。请只输出 JSON，不要输出解释。JSON 必须包含 domains 和 goalLevels 两个字段。"
    },
    {
      role: "user",
      content:
        "为中国职场人士生成学习选项。domains 提供 5-8 个热门英语学习领域（字符串数组）。goalLevels 提供 4-6 个目标等级，格式为对象数组：[{\"id\":\"READING\",\"label\":\"看懂文章\"}]。id 用大写英文下划线。"
    }
  ];

  try {
    const response = await requestAi<
      { model: string; messages: ChatMessage[]; temperature: number; response_format?: { type: "json_object" } },
      ChatCompletionResponse
    >({
      endpoint: config.endpoint,
      payload: {
        model: config.model,
        messages,
        temperature: 0.3,
        response_format: { type: "json_object" }
      },
      retries: 1,
      timeoutMs: 12000,
      baseUrl: config.baseUrl,
      apiKey: config.apiKey
    });

    const content = getContentFromResponse(response.data);
    if (!content) {
      throw new Error("AI returned empty content");
    }

    const parsed = JSON.parse(extractJsonBlock(content)) as RawAiPayload;
    const domains = normalizeDomains(parsed.domains);
    const goalLevels = normalizeGoalLevels(parsed.goalLevels);
    saveCachedDynamicOptions(domains, goalLevels);

    return {
      domains,
      goalLevels,
      source: "ai"
    };
  } catch {
    return {
      domains: [...DEFAULT_POPULAR_DOMAINS],
      goalLevels: [...DEFAULT_GOAL_LEVELS],
      source: "fallback"
    };
  }
}

export async function loadDynamicGoalLevelsByDomain(domain: string): Promise<DynamicGoalLevelsResult> {
  const normalizedDomain = sanitizeDomain(domain);
  if (!normalizedDomain) {
    return {
      goalLevels: [...DEFAULT_GOAL_LEVELS],
      source: "fallback"
    };
  }

  const cached = loadCachedGoalLevelsByDomain(normalizedDomain);
  if (cached) {
    return {
      goalLevels: cached,
      source: "cache"
    };
  }

  try {
    const goalLevels = await requestGoalLevelsFromAi(normalizedDomain);
    saveCachedGoalLevelsByDomain(normalizedDomain, goalLevels);
    return {
      goalLevels,
      source: "ai"
    };
  } catch {
    return {
      goalLevels: buildFallbackGoalLevelsByDomain(normalizedDomain),
      source: "fallback"
    };
  }
}

export const dynamicLearningOptionsInternal = {
  normalizeDomains,
  normalizeGoalLevels,
  normalizeCacheKeyPart,
  buildFallbackGoalLevelsByDomain,
  normalizeDomainGoals
};
