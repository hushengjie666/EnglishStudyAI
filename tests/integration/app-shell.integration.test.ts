import { describe, expect, it } from "vitest";
import { renderApp } from "../../frontend/src/main";

describe("app shell integration", () => {
  it("renders homepage shell", () => {
    const target = document.createElement("div");
    target.id = "app";

    renderApp(target);

    expect(target.querySelector('[data-testid="app-shell"]')).toBeTruthy();
    expect(target.textContent).toContain("EnglishStudyAI");
  });
});
