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
- [x] 配置协议/Host/端口自定义环境变量 (2026-04-01 00:48)
- [x] Git commit 完成 (commit: 07d8657)
- [ ] ⏳ 配置 GitHub Secrets (需要海操作)
- [ ] ⏳ 手动触发测试
- [ ] ⏳ 验证定时任务

**GitHub Secrets 配置指引**:
```
Settings → Secrets and variables → Actions → New repository secret

WEBHOOK_PROTOCOL=https
WEBHOOK_HOST=<你的域名或 IP>
WEBHOOK_PORT=18789
```

**下一步**: 海配置 Secrets → 手动测试 workflow → 验证推送效果

**负责人**: 小钱

## ✅ 已完成

- [x] 项目初始化 (2026-03-31)
- [x] AGENTS.md 创建 (2026-03-31)

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
