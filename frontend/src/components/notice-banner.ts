export type NoticeType = "error" | "success" | "info";

export function renderNotice(message: string, type: NoticeType = "info"): string {
  return `
    <div class="notice notice-${type}" role="status" aria-live="polite">
      ${message}
    </div>
  `;
}
