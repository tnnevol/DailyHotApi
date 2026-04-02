# DailyHotApi - TODO.md

## 🎯 本地需求编排（不提交）

### 当前派发任务
- [ ] **无** - 等待新需求派发
  - 上一个任务：`002-push-architecture` ✅ 已完成归档 (2026-04-02)

### 串行规则
- 当前任务未通过验收前，不派发新的 Workers 需求
- 验收不通过：先更新需求文档与 TODO，再让小钱继续
- 验收通过：先归档需求、更新 TODO 和相关文档，再派发下一条

### 本地测试约束
- 后续 Cloudflare 相关本地测试统一优先使用 `dev:local`
- `.env.local` 仅用于本地测试，不得把其中真实内容写入业务代码、文档、示例配置或可提交文件
- 如需写配置说明，统一使用占位符，不记录真实值

## ⏳ 待办

### Issue #2: 优化新闻推送架构，消除重复请求 🔴 critical

**背景**: 当前架构中 workflow 和 dingtalk-sender 都分别请求了新闻数据，造成重复请求

**任务清单**:

- [ ] 修改 GitHub Actions workflow 文件，移除数据获取逻辑
- [ ] 优化 dingtalk-sender 脚本，承担完整业务流程（数据获取+推送）
- [ ] 测试优化后的推送流程
- [ ] 验证 API 调用次数减少

**验收标准**:

- [ ] 每个平台只发起一次 API 请求
- [ ] 推送功能正常工作
- [ ] 错误处理机制完善
- [ ] 日志输出清晰

**需求约束**:

- `packages/dingtalk-sender` 是 pnpm monorepo 中的附属项目
- 对于 `Daily Hot News Push` workflow，无必要的任务不要改动 `packages/dingtalk-sender`
- `Daily Hot News Push` 仍然运行在 GitHub Actions 中，不需要迁移运行位置
- 若只是验证当前推送架构是否正确，优先补充说明文档，不要为了“看起来更完整”而额外改动附属项目

**负责人**: 小钱  
**截止时间**: 2026-04-03

### Issue #1: 每日 8:00 新闻热榜自动推送 🔴 critical

**背景**: 需要实现每天 8:00 自动推送新闻热榜到钉钉群

**任务清单**:

- [ ] 创建 GitHub Actions workflow 文件 (.github/workflows/daily-hot.yml)
- [ ] 配置定时任务 (每天 8:00 UTC+8)
- [ ] 调用 DailyHotApi 获取热榜数据
- [ ] 格式化消息内容
- [ ] 推送钉钉群

**验收标准**:

- [ ] 每天 8:00 自动触发
- [ ] 推送内容包含 TOP5 热榜
- [ ] 消息格式简洁易读
- [ ] 失败时有错误日志

**参考**:

- OpenClaw Webhook: POST /hooks/agent
- Webhook Token: `dailyhot-webhook-2026`
- 钉钉群: `cid/Em5KFq3Ba5pIeZf5SxS6Q==`

**负责人**: 小钱  
**截止时间**: 2026-04-02

## 🔄 进行中

### Issue #1: 每日 8:00 新闻热榜自动推送 🔴 critical

**当前状态**: ✅ 已完成开发和修复，等待配置和测试

**进度**:

- [x] 创建 GitHub Actions workflow 文件 (2026-04-01 00:47)
- [x] 优化为统一 Secrets 管理 (2026-04-01 01:20)
- [x] 修复钉钉推送脚本异常 (2026-04-01 20:00)
- [x] 优化 workflow，消除重复请求 (2026-04-01 20:05)
- [x] Git commit 完成 (commit: 58cf5d1)
- [ ] ⏳ 配置 GitHub Secrets (需要海操作)
- [ ] ⏳ 手动触发测试
- [ ] ⏳ 验证定时任务

**GitHub Secrets 配置指引** (3 个):

```
Settings → Secrets and variables → Actions → New repository secret

DINGTALK_WEBHOOK_URL=钉钉机器人 Webhook 地址
DINGTALK_SECRET=钉钉机器人密钥（可选）
API_TOKEN=DailyHotApi 访问令牌
```

**下一步**: 海配置 Secrets → 手动测试 workflow → 验证推送效果

**负责人**: 小钱

## ✅ 已完成

- [x] **002-push-architecture - 推送架构验证文档** (2026-04-02)
  - 代码分析确认当前架构已正确，不存在重复请求问题
  - 新增 `packages/dingtalk-sender/README.md` 记录架构验证结果
  - 在 `packages/dingtalk-sender/src/index.ts` 与 `packages/dingtalk-sender/src/send-cli.ts` 增加注释
  - 本地提交：`d761d3a`
  - 归档文件：`.project-spec/done/002-push-architecture.md`
- [x] **001-workers-pilot - Cloudflare Workers 试点迁移** (2026-04-02)
  - 完成 Workers 入口、路由注册、环境变量配置
  - 验证 3 个试点接口（baidu/weibo/zhihu）正常工作
  - 清理临时验证产物，完善文档
  - 归档文件：`.project-spec/done/001-workers-pilot.md`
- [x] 项目初始化 (2026-03-31)
- [x] AGENTS.md 创建 (2026-03-31)
- [x] **百度热搜接口替换** (2026-04-01 02:08)
  - 从 hot_news 项目移植爬虫逻辑
  - 使用百度官方 API 替代第三方接口
  - 代码已提交到 dev 分支 (commit: 7b7d9c3)
- [x] **首批 6 平台接口移植完成** (2026-04-01 02:19)
  - ✅ 百度 (baidu) - 已完成
  - ✅ 微博 (weibo) - 已完成
  - ✅ 知乎 (zhihu) - 已完成
  - ✅ 抖音 (douyin) - 已完成
  - ✅ B 站 (bilibili) - 已有更完善版本
  - ✅ 少数派 (sspai) - 已完成
  - 代码已提交到 dev 分支 (commit: 41b9d26)
- [x] **第二批 6 平台接口移植完成** (2026-04-01 03:09)
  - ✅ 虎扑 (hupu) - 已完成
  - ✅ 豆瓣 (douban) - 已完成
  - ✅ 贴吧 (tieba) - 已完成
  - ✅ 掘金 (juejin) - 已完成
  - ✅ 36 氪 (36kr) - 已完成
  - ✅ 吾爱破解 (52pojie) - 已完成
  - 代码已提交到 dev 分支 (commit: 7bdfc94)
- [x] **第三批 10 平台接口移植完成** (2026-04-01 03:45)
  - 🔴 高优先级：今日头条 ✅ / 微信 ✅ (简化版)
  - 🟡 中优先级：雪球 ✅ / 东方财富 ✅ / 财联社 ✅ / 新浪财经 ✅
  - 🟢 低优先级：腾讯网 ✅ / GitHub Trending ✅ / Hacker News ✅ / Stack Overflow ✅ / V2EX ✅
  - 代码已提交到 dev 分支 (commit: 8f2520d)

**总计**: 22 个平台全部移植完成！🎉

---

_最后更新：2026-04-02_
