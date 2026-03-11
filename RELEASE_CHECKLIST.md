# RELEASE CHECKLIST

## 检查结果总览

| 检查项 | 状态 | 结论 |
|---|---|---|
| 1. 未完成 task | PASS | `tasks.md` 无未勾选项 |
| 2. TODO / FIXME / DEBUG 标记 | PASS | 未扫描到相关标记 |
| 3. console.log 或调试代码 | PASS | 未扫描到 `console.log` 与 `debugger` |
| 4. mock 数据或临时逻辑 | PASS | 运行代码未发现 mock/临时分支 |
| 5. 未使用依赖 | WARN | `depcheck` 报 `@playwright/test` 未使用（深路径导入导致） |
| 6. 未使用文件 | PASS | 已清理 Vite 模板遗留文件 |
| 7. 环境变量是否完整 | PASS | `.env.example` 包含必需变量 |
| 8. 测试命令是否可复现 | PASS | lint/unit/integration/smoke 全通过 |
| 9. 从零安装并启动 | PASS | `npm ci` + build + tests 已通过 |
| 10. 潜在发布风险 | WARN | Windows 下 `npm ci` 可能受 node 进程锁文件影响，已提供规避脚本 |

## 详细检查

### 1) 未完成 task
- 结果：PASS
- 证据：`specs/001-personalized-english-ai/tasks.md` 全部为 `[X]`

### 2) TODO / FIXME / DEBUG
- 结果：PASS
- 命令：`rg -n "TODO|FIXME|DEBUG" -S .`

### 3) console.log / debugger
- 结果：PASS
- 命令：`rg -n "console\.log\(|debugger\b" -S frontend tests scripts`

### 4) mock/临时逻辑
- 结果：PASS
- 说明：代码路径未检测到临时逻辑；研究文档中的“mock”仅为方案讨论

### 5) 未使用依赖
- 结果：WARN
- 命令：`cd frontend && npx depcheck`
- 输出：`Unused devDependencies: @playwright/test`
- 备注：目前 e2e 使用深路径导入，建议后续改为标准模块导入并调整配置目录

### 6) 未使用文件
- 结果：PASS
- 说明：已移除 `frontend/src/counter.ts`、`frontend/src/typescript.svg`、`frontend/public/vite.svg`

### 7) 环境变量完整性
- 结果：PASS
- 说明：`.env.example` 包含 `VITE_AI_API_URL`、`VITE_AI_API_KEY`

### 8) 测试命令可复现
- 结果：PASS
- 证据：
  - `cd frontend && npm run lint` PASS
  - `cd frontend && npm run test:unit` PASS
  - `cd frontend && npm run test:integration` PASS
  - `cd frontend && npm run test:smoke` PASS

### 9) 从零安装并启动
- 结果：PASS
- 路径：`cd frontend && npm ci` 后 `npm run build` PASS

### 10) 潜在发布风险
- 结果：WARN
- 风险：Windows 可能出现 `npm ci` 文件锁（esbuild/rollup 二进制）
- 缓解：使用 `scripts/quality/clean-install-check.ps1` 先清理 node 进程再执行安装验证

## 发布结论
- **可以发布（带 2 项可接受 WARN）**。
- 建议在 CI 中执行 `scripts/quality/clean-install-check.ps1` 以提高稳定性。
