# DailyHotApi - TODO.md

## 🎯 本地需求编排（不提交）

### 当前派发任务
- [x] `001-workers-pilot` - Workers 试点迁移 ✅ 已完成 (2026-04-02)
- [x] `002-push-architecture` - 推送架构验证文档 ✅ 已完成 (2026-04-02)
- [ ] 当前无新派发任务，等待下一条需求

### 串行规则
- 当前任务未通过验收前，不派发新的需求
- 验收不通过：先更新需求文档与 TODO，再让小钱继续
- 验收通过：先归档需求、更新 TODO 和相关文档，再派发下一条

### 本地测试约束
- 后续 Cloudflare 相关本地测试统一优先使用 `dev:local`
- `.env.local` 仅用于本地测试，不得把其中真实内容写入业务代码、文档、示例配置或可提交文件
- 如需写配置说明，统一使用占位符，不记录真实值

### 会话回复约束
- 小钱关于 `DailyHotApi` 的任务汇报，默认固定回复到本项目主会话，不要回复到 `agent:main:main`
- 本项目主会话固定为：`agent:main:dingtalk-connector:group:cid/em5kfq3ba5piezf5sxs6q==:0424692867782971`
- 除非海明确指定其他会话，否则一律回到上述项目主会话

## ⏳ 待推进

### Cloudflare Workers 正式部署链路

**当前状态**: 本地试点已完成，正式部署链路未验证

**待推进事项**:
- [ ] `wrangler deploy` 验证
- [ ] KV 缓存功能验证
- [ ] GitHub Actions 自动部署验证
- [ ] 生产环境稳定性验证

**说明**:
- 当前仅完成本地 `wrangler dev` 与 3 个试点接口验证
- 正式部署、自动化部署和缓存能力仍是后续阶段任务

## ✅ 已完成

### Issue #1: 每日 8:00 新闻热榜自动推送 🔴 critical
- [x] 创建 GitHub Actions workflow 文件
- [x] 优化为统一 Secrets 管理
- [x] 修复钉钉推送脚本异常
- [x] 优化 workflow，消除重复请求路径误解
- [x] Git commit 完成
- [x] 需求确认完成
- 说明：该项已按最新确认视为完成

### Issue #2: 推送架构验证文档 🟡 normal
- [x] 架构分析完成
- [x] 确认当前推送架构不存在重复请求问题
- [x] 补充架构说明文档
- [x] 本地 commit 完成
- 约束：`packages/dingtalk-sender` 是 pnpm monorepo 附属项目；对 `Daily Hot News Push` workflow，无必要任务不要改动它；推送仍运行在 GitHub Actions 中，不迁移运行位置

### 项目里程碑
- [x] **001-workers-pilot - Cloudflare Workers 试点迁移** (2026-04-02)
  - 完成 Workers 入口、路由注册、环境变量配置
  - 验证 3 个试点接口（baidu/weibo/zhihu）正常工作
  - 清理临时验证产物，完善文档
  - 归档文件：`.project-spec/done/001-workers-pilot.md`
- [x] **002-push-architecture - 推送架构验证文档** (2026-04-02)
  - 代码分析确认当前架构不存在重复请求问题
  - 补充架构说明，防止后续误解
  - 归档文件：`.project-spec/done/002-push-architecture.md`
- [x] 项目初始化 (2026-03-31)
- [x] AGENTS.md 创建 (2026-03-31)
- [x] 百度热搜接口替换 (2026-04-01)
- [x] 首批 6 平台接口移植完成 (2026-04-01)
- [x] 第二批 6 平台接口移植完成 (2026-04-01)
- [x] 第三批 10 平台接口移植完成 (2026-04-01)

**总计**: 22 个平台全部移植完成！🎉

---

_最后更新：2026-04-02 16:17_
