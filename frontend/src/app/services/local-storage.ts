const DEFAULT_NAMESPACE = "english-study-ai";

export function saveState(key: string, value: unknown, namespace = DEFAULT_NAMESPACE): void {
  localStorage.setItem(`${namespace}:${key}`, JSON.stringify(value));
}

export function loadState<T>(key: string, namespace = DEFAULT_NAMESPACE): T | null {
  const raw = localStorage.getItem(`${namespace}:${key}`);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function removeState(key: string, namespace = DEFAULT_NAMESPACE): void {
  localStorage.removeItem(`${namespace}:${key}`);
}
