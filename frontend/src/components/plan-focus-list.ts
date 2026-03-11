const WORD_CN_MAP: Record<string, string> = {
  software: "软件",
  hardware: "硬件",
  network: "网络",
  database: "数据库",
  algorithm: "算法",
  programming: "编程",
  security: "安全",
  "cloud computing": "云计算",
  deployment: "部署",
  "api integration": "接口集成",
  debugging: "调试",
  "version release": "版本发布",
  scalability: "可扩展性",
  latency: "延迟",
  ledger: "总账",
  "model training": "模型训练",
  inference: "推理",
  dataset: "数据集",
  proposal: "提案",
  deadline: "截止日期",
  "meeting agenda": "会议议程",
  "follow-up": "跟进"
};

function toWordMeaning(word: string): string {
  const normalized = word.trim().toLowerCase();
  return WORD_CN_MAP[normalized] ?? "词义学习中";
}

export function renderPlanFocusList(words: string[], weaknessTags: string[]): string {
  const items = words.map((word) => {
    const isWeak = weaknessTags.includes(word.toLowerCase());
    return `<li class="focus-item${isWeak ? " focus-item-weak" : ""}">
      <span class="focus-word-en">${word}</span>
      <span class="focus-word-zh">（${toWordMeaning(word)}）</span>
    </li>`;
  });

  return `
    <p class="hint" id="focus-words-title">本轮学习词汇（英文词 + 中文释义）</p>
    <ul id="focus-words">${items.join("")}</ul>
  `;
}
