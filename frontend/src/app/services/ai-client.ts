export interface AiRequest<TInput> {
  endpoint: string;
  payload: TInput;
  retries?: number;
  timeoutMs?: number;
  baseUrl?: string;
  apiKey?: string;
}

export interface AiResponse<TOutput> {
  data: TOutput;
  status: number;
}

function timeoutPromise<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("AI request timeout")), timeoutMs);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export async function requestAi<TInput, TOutput>(req: AiRequest<TInput>): Promise<AiResponse<TOutput>> {
  const retries = req.retries ?? 1;
  const timeoutMs = req.timeoutMs ?? 15000;
  const baseUrl = (req.baseUrl ?? (import.meta.env.VITE_AI_API_URL as string | undefined) ?? "").replace(/\/+$/, "");
  const apiKey = req.apiKey ?? (import.meta.env.VITE_AI_API_KEY as string | undefined) ?? "";
  const endpoint = req.endpoint.replace(/^\/+/, "");

  let attempt = 0;
  while (attempt <= retries) {
    try {
      const response = await timeoutPromise(
        fetch(`${baseUrl}/${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`
          },
          body: JSON.stringify(req.payload)
        }),
        timeoutMs
      );

      const data = (await response.json()) as TOutput;
      return { data, status: response.status };
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
    }

    attempt += 1;
  }

  throw new Error("AI request failed");
}
