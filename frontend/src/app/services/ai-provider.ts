export type AiProvider = "deepseek" | "openai" | "qwen" | "custom";

export interface AiProviderConfig {
  provider: AiProvider;
  baseUrl: string;
  endpoint: string;
  model: string;
  apiKey: string;
}

const PROVIDER_DEFAULTS: Record<Exclude<AiProvider, "custom">, { baseUrl: string; endpoint: string; model: string }> = {
  deepseek: {
    baseUrl: "https://api.deepseek.com",
    endpoint: "chat/completions",
    model: "deepseek-chat"
  },
  openai: {
    baseUrl: "https://api.openai.com/v1",
    endpoint: "chat/completions",
    model: "gpt-4o-mini"
  },
  qwen: {
    baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    endpoint: "chat/completions",
    model: "qwen-plus"
  }
};

function asProvider(value: string | undefined): AiProvider {
  if (value === "openai" || value === "qwen" || value === "custom") {
    return value;
  }
  return "deepseek";
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

export function getAiProviderConfig(): AiProviderConfig {
  const provider = asProvider(import.meta.env.VITE_AI_PROVIDER as string | undefined);
  const apiKey = (import.meta.env.VITE_AI_API_KEY as string | undefined) ?? "";

  if (provider === "custom") {
    const customBase = (import.meta.env.VITE_AI_API_URL as string | undefined) ?? "";
    const customEndpoint = (import.meta.env.VITE_AI_API_ENDPOINT as string | undefined) ?? "chat/completions";
    const customModel = (import.meta.env.VITE_AI_MODEL as string | undefined) ?? "";
    return {
      provider,
      baseUrl: trimTrailingSlash(customBase),
      endpoint: customEndpoint.replace(/^\/+/, ""),
      model: customModel,
      apiKey
    };
  }

  const defaults = PROVIDER_DEFAULTS[provider];
  return {
    provider,
    baseUrl: trimTrailingSlash(((import.meta.env.VITE_AI_API_URL as string | undefined) ?? defaults.baseUrl)),
    endpoint: ((import.meta.env.VITE_AI_API_ENDPOINT as string | undefined) ?? defaults.endpoint).replace(/^\/+/, ""),
    model: (import.meta.env.VITE_AI_MODEL as string | undefined) ?? defaults.model,
    apiKey
  };
}
