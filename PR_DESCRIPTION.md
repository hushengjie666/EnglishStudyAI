# PR Description

## PR 标题
feat: complete EnglishStudyAI with AI-driven adaptive learning flow

## 变更摘要
- 完成英语学习 AI Web 应用核心流程开发
- 打通首页设置、词汇短测、学习计划、学习课程、课堂作业主链路
- 引入 AI 驱动的动态领域/目标生成、学习计划生成、课程内容生成与掌握判断
- 增强自适应学习机制，支持系统自动判定掌握情况与间隔复习
- 完善中文化 UI、加载反馈、持久化体验与测试验证链路

## 实现功能
- 学习领域与目标等级由 AI 动态生成，并支持缓存与兜底
- 1-2 分钟词汇短测，自动评分并生成学习计划
- 学习计划由 AI 生成，并结合用户表现动态更新
- 学习课程内容由 AI 生成，包含词义、记忆法、示例、回忆检查
- 系统自动判断用户是否掌握，无需手动标记已掌握或未掌握
- 基于薄弱点与到期复习词自动调整后续学习内容
- 支持课堂作业生成、提交与反馈
- 关键状态本地持久化，刷新后不丢失
- 除学习内容外，所有面向用户的 UI 默认中文化

## 关键修改
- 重构前端主流程与页面状态管理
- 新增 AI 提供商配置与可替换调用层，支持后续切换 DeepSeek、Qwen、GPT
- 新增自适应学习引擎与间隔复习机制
- 优化学习页加载态与作答保留体验
- 新增并完善 unit、integration、Playwright smoke tests
- 补充交付文档、发布检查文档与项目说明文档

## 测试结果
- lint: PASS
- unit test: PASS
- integration test: PASS
- Playwright smoke test: PASS

## 风险说明
- GitHub 默认分支当前仍为 `001-personalized-english-ai`，建议切换为 `main`
- 线上 AI 接口稳定性仍受外部网络和供应商响应影响
- 部分词汇中文释义当前仍使用本地映射兜底，后续可继续扩展 AI 与缓存覆盖率
