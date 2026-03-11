import type { GoalLevelOption } from "../app/state/learning-options";

function toDomainLabel(domain: string): string {
  const normalized = domain.trim().toLowerCase();
  const exact: Record<string, string> = {
    social: "社交",
    finance: "财务",
    travel: "旅游",
    it: "信息技术",
    ai: "人工智能",
    marketing: "市场营销",
    management: "管理",
    sales: "销售",
    engineering: "工程",
    healthcare: "医疗健康",
    education: "教育",
    legal: "法务",
    hr: "人力资源",
    operation: "运营",
    operations: "运营",
    product: "产品",
    customerservice: "客户服务",
    consulting: "咨询",
    logistics: "物流",
    ecommerce: "电子商务",
    media: "传媒",
    design: "设计",
    manufacturing: "制造业",
    realestate: "房地产"
  };

  const hasNonAscii = Array.from(domain).some((char) => char.charCodeAt(0) > 127);
  if (hasNonAscii) {
    return domain;
  }

  const collapsed = normalized.replace(/[\s_-]+/g, "");
  if (exact[collapsed]) {
    return exact[collapsed];
  }

  const tokenMap: Record<string, string> = {
    social: "社交",
    finance: "财务",
    travel: "旅游",
    marketing: "营销",
    management: "管理",
    sales: "销售",
    engineer: "工程",
    engineering: "工程",
    health: "健康",
    healthcare: "医疗",
    education: "教育",
    legal: "法务",
    law: "法律",
    hr: "人力",
    human: "人力",
    resources: "资源",
    operation: "运营",
    operations: "运营",
    product: "产品",
    customer: "客户",
    service: "服务",
    consulting: "咨询",
    logistics: "物流",
    e: "电商",
    commerce: "商务",
    media: "传媒",
    design: "设计",
    manufacture: "制造",
    manufacturing: "制造",
    real: "房地产",
    estate: "地产",
    ai: "人工智能",
    it: "信息技术",
    technology: "技术",
    tech: "技术"
  };

  const tokens = normalized
    .split(/[\s/_-]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
  const translated = tokens.map((token) => tokenMap[token]).filter((value) => Boolean(value));

  if (translated.length > 0) {
    return translated.join("");
  }

  return domain;
}

export function renderHomePage(
  selectedDomain: string,
  customDomain: string,
  goalLevel: string,
  domains: readonly string[],
  goalLevels: ReadonlyArray<GoalLevelOption>,
  goalSource: "智能" | "缓存" | "兜底",
  optionsLoading: boolean,
  errorMessage: string
): string {
  const domainOptions = domains.map(
    (domain) => `<option value="${domain}" ${domain === selectedDomain ? "selected" : ""}>${toDomainLabel(domain)}</option>`
  ).join("");

  const goalOptions = goalLevels.map(
    (goal) => `<option value="${goal.id}" ${goal.id === goalLevel ? "selected" : ""}>${goal.label}</option>`
  ).join("");

  return `
    <section class="panel" data-testid="home-page">
      <h2>开始学习</h2>
      <label>学习领域
        <select id="domain-select">${domainOptions}</select>
      </label>
      <label>自定义领域
        <input id="custom-domain" value="${customDomain}" placeholder="请输入想学习的领域" />
      </label>
      <label>目标等级
        <select id="goal-level">
          <option value="">请选择目标等级</option>
          ${goalOptions}
        </select>
      </label>
      <button id="go-assessment" type="button">开始短测</button>
      ${optionsLoading ? '<p class="hint" id="options-loading">智能系统正在生成学习领域和目标等级，请稍候...</p>' : ""}
      <p class="hint" id="goal-source">目标等级来源：${goalSource}</p>
      <p class="error">${errorMessage}</p>
    </section>
  `;
}
