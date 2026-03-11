# PROJECT STRUCTURE

```text
.
├── frontend/                  # 前端应用源码与本地运行脚本
│   ├── src/
│   │   ├── app/               # 业务流程、服务、状态
│   │   ├── components/        # 复用组件
│   │   └── pages/             # 页面模板
│   ├── scripts/               # smoke 启动脚本
│   └── package.json
├── tests/                     # unit / integration / e2e 与验收证据
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── scripts/quality/           # 质量门禁与自动修复脚本
├── specs/001-personalized-english-ai/
│   ├── spec.md
│   ├── plan.md
│   ├── tasks.md
│   ├── contracts/
│   └── checklists/
├── DELIVERY_SUMMARY.md        # 最终交付总结
├── RELEASE_CHECKLIST.md       # 发布前检查报告
├── README.md                  # 项目说明
└── PR_DESCRIPTION.md          # PR 提交说明
```

## 主要目录用途
- `frontend/`: 应用实现主体
- `tests/`: 自动化测试与截图/console证据
- `scripts/quality/`: 验证与自动修复流程入口
- `specs/001-.../`: 需求->计划->任务->验收全链路文档
