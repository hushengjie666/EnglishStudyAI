export function requireText(value: string, fieldName: string): string | null {
  if (!value.trim()) {
    return `${fieldName} is required.`;
  }

  return null;
}

export function minArrayLength<T>(values: T[], min: number, fieldName: string): string | null {
  if (values.length < min) {
    return `${fieldName} must contain at least ${min} item(s).`;
  }

  return null;
}
