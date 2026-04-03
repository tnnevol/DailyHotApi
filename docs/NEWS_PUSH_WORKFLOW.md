# 新闻推送工作流程文档

## 概述

本项目实现了每日新闻热榜的自动推送功能，通过 GitHub Actions 定时任务获取各平台热榜数据，并通过钉钉机器人推送到指定群组。

## 架构设计

### 当前架构

```
GitHub Actions (定时触发) 
    ↓
获取环境变量 (DINGTALK_WEBHOOK_URL, DINGTALK_SECRET, API_TOKEN, PLATFORMS)
    ↓
调用 dingtalk-sender 脚本一次
    ↓
脚本内部执行：
    ├── 从环境变量读取平台列表
    ├── 批量获取各平台数据（单次请求）
    ├── 合并所有数据
    └── 一次发送到钉钉
    ↓
输出汇总统计
```

### 业务逻辑集中化

- **Workflow 层**：仅负责调度
  - 定时触发
  - 平台列表管理
  - 统计汇总
  
- **脚本层**：负责完整业务流程
  - API 数据获取（单一请求）
  - 数据格式转换
  - 钉钉消息构建
  - 推送结果处理
  - 详细日志输出

---

## 配置要求

### GitHub Secrets 清单

需要在 GitHub 仓库的 Secrets 中配置以下变量：

| Secret 名称 | 说明 | 必需 |
|-------------|------|------|
| `DINGTALK_WEBHOOK_URL` | 钉钉机器人 Webhook 地址 | ✅ |
| `DINGTALK_SECRET` | 钉钉机器人签名密钥 | ❌ |
| `API_TOKEN` | DailyHotApi 访问令牌 | ✅ |
| `API_BASE_URL` | API 服务地址 | ✅ |
| `DEFAULT_IMAGE_URL` | 默认图片地址 | ✅ |
| `PLATFORMS` | 推送平台列表（逗号分隔） | ✅ |

### Cloudflare Workers 部署 Secrets

如需 Cloudflare Workers 自动部署，还需配置：

| Secret 名称 | 说明 | 必需 |
|-------------|------|------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API Token | Workers ✅ |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账户 ID | Workers ✅ |
| `KV_NAMESPACE_ID` | KV 命名空间 ID | Workers ✅ |

---

## Workflow 文件说明

### 1. 新闻推送 Workflow

**文件**：`.github/workflows/daily-hot-push.yml`

**触发方式**：
- 定时触发：每天北京时间 8:00（UTC 0:00）
- 手动触发：支持通过 GitHub Actions 界面手动运行

**主要步骤**：
1. 检出代码
2. 安装 pnpm 和依赖
3. 构建 dingtalk-sender 包
4. 执行推送脚本
5. 输出统计结果

### 2. Cloudflare Workers 部署 Workflow

**文件**：`.github/workflows/deploy-cloudflare.yml`

**触发方式**：
- 推送到 `main` 分支自动触发
- 手动触发

**主要步骤**：
1. 检出代码
2. 安装依赖和 Wrangler
3. 验证必需的 Secrets
4. 生成 `wrangler.toml`（从环境变量注入 KV Namespace ID）
5. 类型检查
6. 部署到 Cloudflare Workers

---

## 支持的平台列表

| 平台名称 | 调用名 | 说明 |
|----------|--------|------|
| 百度 | `baidu` | 百度热搜榜 |
| 微博 | `weibo` | 微博热搜榜 |
| 知乎 | `zhihu` | 知乎热榜 |
| 抖音 | `douyin` | 抖音热点榜 |
| 哔哩哔哩 | `bilibili` | 哔哩哔哩热门榜 |
| 快手 | `kuaishou` | 快手热点榜 |
| 今日头条 | `toutiao` | 今日头条热榜 |
| 百度贴吧 | `tieba` | 百度贴吧热议榜 |
| 少数派 | `sspai` | 少数派热榜 |
| 豆瓣 | `douban` | 豆瓣热榜 |
| 豆瓣电影 | `douban-movie` | 豆瓣电影新片榜 |
| 豆瓣小组 | `douban-group` | 豆瓣讨论小组 |
| 虎扑 | `hupu` | 虎扑步行街热帖 |
| 掘金 | `juejin` | 掘金热榜 |
| V2EX | `v2ex` | V2EX 主题榜 |
| GitHub | `github` | GitHub 趋势 |
| Hacker News | `hackernews` | Hacker News 热榜 |
| 36氪 | `36kr` | 36氪热榜 |
| IT之家 | `ithome` | IT之家热榜 |
| ... | ... | 更多平台见 README.md |

> ⚠️ **注意**：钉钉机器人有频率限制，建议单次推送不要超过 15 条消息。当前配置每次推送 N 个平台，每个平台 4 条。

---

## 脚本说明

### dingtalk-sender 包

位于 `packages/dingtalk-sender/` 目录：

**核心文件**：
- `src/send-cli.ts` - 核心推送逻辑
- `src/index.ts` - 命令行入口

**主要功能**：
- `getHotNews(platform, token, limit)` - 获取指定平台热榜数据
- `batchSendFeedCard(platforms, token)` - 批量获取并合并推送

**可用命令**：
```bash
# 构建推送包
pnpm run build:sender

# 运行推送脚本
pnpm run start:sender
```

---

## 日志输出示例

### Workflow 日志

```
🔍 准备推送 6 个平台

🔍 获取：baidu
  ✅ 成功，推送 百度热搜 到钉钉
  平台：baidu，条数：4

🔍 获取：weibo
  ✅ 成功，推送 微博 到钉钉
  平台：weibo，条数：4

===== 合并推送 =====
合并 24 条消息到钉钉
✅ 钉钉批量推送成功

===== 汇总 =====
成功推送平台数：6 / 6
总计推送条数：24
✅ 钉钉批量推送成功
```

---

## 最佳实践

### 1. 业务逻辑分离

- Workflow 只负责调度和环境管理
- 脚本负责具体业务逻辑
- 避免在 workflow 中重复请求数据

### 2. 错误处理

- 环境变量验证：脚本启动时检查必需变量
- API 错误：通过返回值传递错误信息
- 推送失败：记录详细错误并继续处理其他平台

### 3. 安全考虑

- 敏感信息通过 GitHub Secrets 传递
- 不在日志中输出 Token 或 Secret
- `.env.local` 禁止提交到 Git

---

## 维护说明

### 常见问题排查

**推送失败**：
1. 检查 `DINGTALK_WEBHOOK_URL` 是否正确
2. 检查 `API_TOKEN` 是否有效
3. 检查 `API_BASE_URL` 是否可访问

**数据为空**：
1. 检查对应平台接口是否正常
2. 查看 API 服务日志

**Workers 部署失败**：
1. 检查 `CLOUDFLARE_API_TOKEN` 权限
2. 检查 `CLOUDFLARE_ACCOUNT_ID` 是否正确
3. 检查 KV Namespace 是否已创建

### 扩展平台

如需增加新的推送平台：
1. 在 DailyHotApi 中添加对应平台的 API 接口
2. 在 GitHub Secrets 的 `PLATFORMS` 中添加平台名称
3. 测试推送功能

---

## 技术栈

- **Workflow**: GitHub Actions
- **运行时**: Node.js 20+ / Cloudflare Workers
- **脚本语言**: TypeScript
- **推送包**: @tnnevol/robot-ding
- **构建工具**: pnpm / unbuild
- **API 客户端**: axios

---

**最后更新**: 2026-04-03
**维护者**: DailyHotApi Team