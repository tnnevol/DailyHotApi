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

---

## 📝 开发日志

### 2026-04-01 - 首批接口移植（6 个平台）

**任务**: 将 hot_news 项目的爬虫接口移植到 DailyHotApi

**完成平台**:
1. **百度** - `top.baidu.com/api/board` ✅
2. **微博** - `weibo.com/ajax/side/hotSearch` ✅
3. **知乎** - `zhihu.com/api/v3/explore/guest/feeds` ✅
4. **抖音** - `douyin.com/aweme/v1/web/hot/search/list` ✅
5. **B 站** - 已有更完善版本（带分区支持）⏭️
6. **少数派** - `sspai.com/api/v1/article/index/page/get` ✅

**测试结果** (本地):
```
微博热搜获取成功，共 51 条 ✅
知乎热榜获取成功，共 30 条 ✅
抖音热榜获取成功，共 51 条 ✅
少数派获取成功，共 10 条 ✅
```

**Git 提交**:
- 分支：dev
- Commit 1: `7b7d9c3` - 百度接口替换
- Commit 2: `41b9d26` - 微博/知乎/抖音/少数派移植
- 文件：`src/routes/*.ts`

**技术要点**:
- Python → TypeScript 转换
- 统一使用 axios + httpsAgent: false
- 响应格式符合 DailyHotApi 规范
- 添加错误处理和日志记录

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

*最后更新：2026-03-31*
