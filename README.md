# EnglishStudyAI

## 项目简介
EnglishStudyAI 是一个面向职场人群的英语学习 Web 应用，强调“领域词汇学习 + 动态个性化计划 + 课后作业反馈”。

## 技术栈
- Vite
- TypeScript（strict）
- Vanilla HTML/CSS/TS
- Vitest（unit / integration）
- Playwright（smoke）
- PowerShell（质量门禁脚本）

## 安装步骤
```bash
cd frontend
npm install
```

## 启动方式
```bash
cd frontend
npm run dev
```

## 测试方式
```bash
cd frontend
npm run lint
npm run build
npm run test:unit
npm run test:integration
npm run test:smoke
```

发布前推荐一键检查：
```powershell
powershell -ExecutionPolicy Bypass -File scripts/quality/clean-install-check.ps1
```

## 目录结构说明
```text
frontend/
  src/
    app/          # 业务流程、服务、状态管理
    components/   # 可复用 UI 组件
    pages/        # 页面模板
  scripts/        # 本地 smoke 启动脚本
  package.json

tests/
  unit/           # 单元测试
  integration/    # 集成测试
  e2e/            # Playwright 用例与验收证据

scripts/quality/  # lint/test/smoke/自动修复/失败报告脚本
specs/001-.../    # 需求、计划、任务与交付清单
```

## 核心功能介绍
- 学习领域与目标等级选择
- 短测后生成初始学习计划
- 学习会话后动态更新计划（薄弱点驱动）
- 课堂作业生成、提交、评分反馈
- 关键数据刷新后保持

## 环境变量配置
在 `frontend/.env` 中配置：
```env
VITE_AI_PROVIDER=deepseek
VITE_AI_API_URL=https://api.deepseek.com
VITE_AI_API_ENDPOINT=chat/completions
VITE_AI_MODEL=deepseek-chat
VITE_AI_API_KEY=<your-api-key>
```

可选 provider：
- `deepseek`（默认）
- `openai`
- `qwen`
- `custom`（完全自定义 URL / endpoint / model）

切换 provider 时，通常只需要修改 `VITE_AI_PROVIDER` 与 `VITE_AI_MODEL`；若使用兼容 OpenAI 协议的服务，可按需覆盖 `VITE_AI_API_URL` 与 `VITE_AI_API_ENDPOINT`。

## 常见问题
1. `npm run test:smoke` 失败（浏览器未安装）
- 运行：`cd frontend && npx playwright install chromium`

2. `npm ci` 报 EPERM 文件锁（Windows）
- 关闭占用 Node 进程后重试，或直接运行：
- `powershell -ExecutionPolicy Bypass -File scripts/quality/clean-install-check.ps1`

3. 找不到截图/console 证据
- 查看 `tests/e2e/artifacts/` 目录

## 已知限制
- 暂不支持社交功能
- 暂不支持管理员后台
- 暂不支持多语言
- AI 接口仍依赖环境变量配置，当前未接后端代理层
