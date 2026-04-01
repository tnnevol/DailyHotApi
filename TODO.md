# DailyHotApi - TODO.md

## ⏳ 待办

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

**当前状态**: ✅ 已完成开发，等待配置和测试

**进度**:

- [x] 创建 GitHub Actions workflow 文件 (2026-04-01 00:47)
- [x] 优化为统一 Secrets 管理 (2026-04-01 01:20)
- [x] Git commit 完成 (commit: 58cf5d1)
- [ ] ⏳ 配置 GitHub Secrets (需要海操作)
- [ ] ⏳ 手动触发测试
- [ ] ⏳ 验证定时任务

**GitHub Secrets 配置指引** (3 个):

```
Settings → Secrets and variables → Actions → New repository secret

WEBHOOK_BASE=https://openclaw.tnnevol.cn
WEBHOOK_TOKEN=dailyhot-webhook-2026
DINGTALK_GROUP_ID=cid/Em5KFq3Ba5pIeZf5SxS6Q==
```

**下一步**: 海配置 Secrets → 手动测试 workflow → 验证推送效果

**负责人**: 小钱

## ✅ 已完成

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

## 📝 开发日志

### 2026-04-01 - 第三批接口移植（10 个平台）

**任务**: 将 hot_news 项目剩余爬虫接口移植到 DailyHotApi

**完成平台**:

**🔴 高优先级 (2 个)**:

1. **今日头条** - `toutiao.com/hot-event/hot-board` ✅
2. **微信** - `k.weixin.qq.com` ✅ (HTML 解析简化版)

**🟡 中优先级 - 财经类 (4 个)**: 3. **雪球** - `xueqiu.com/hot_event/list.json` ✅ (简化版) 4. **东方财富** - `np-weblist.eastmoney.com` ✅ 5. **财联社** - `cls.cn/featured/v1/column/list` ✅ 6. **新浪财经** - `zhibo.sina.com.cn` ✅

**🟢 低优先级 - 技术社区 (5 个)**: 7. **腾讯网** - `i.news.qq.com` ✅ 8. **GitHub Trending** - `api.github.com` ✅ 9. **Hacker News** - `news.ycombinator.com` ✅ (HTML 解析) 10. **Stack Overflow** - `api.stackexchange.com` ✅ 11. **V2EX** - `v2ex.com/api/topics/hot.json` ✅

**测试结果** (部分接口需要复杂认证，使用简化版本):

```
今日头条热榜获取成功，共 50 条 ✅
财联社电报获取成功，共 10 条 ✅
新浪财经直播获取成功，共 20 条 ✅
```

**Git 提交**:

- 分支：dev
- Commit: `8f2520d`
- 文件：11 个路由文件

**技术要点**:

- 今日头条/财联社/新浪财经：API 直接调用成功
- 雪球/东方财富：API 需要复杂认证，使用简化版本
- 微信/Hacker News：HTML 解析（需要 cheerio）
- GitHub/Stack Overflow/V2EX：使用官方开放 API

---

## 📅 每日推送任务

**目标**: 每天 8:00 自动推送新闻热榜到钉钉群

**状态**: ⏳ 待开发

**任务拆解**:

1. 配置 OpenClaw Webhook
2. 创建 GitHub Actions workflow
3. 测试推送功能
4. 验证定时触发

**负责人**: 小钱  
**优先级**: 🔴 critical

---

_最后更新：2026-03-31_
