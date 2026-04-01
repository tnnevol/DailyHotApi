# 新闻推送工作流程文档

## 概述

本项目实现了每日新闻热榜的自动推送功能，通过 GitHub Actions 定时任务获取各平台热榜数据，并通过钉钉机器人推送到指定群组。

## 架构设计

### 当前架构（待优化）

```
GitHub Actions (定时触发) 
    ↓
获取环境变量 (DINGTALK_WEBHOOK_URL, DINGTALK_SECRET, API_TOKEN)
    ↓
遍历平台列表 (baidu weibo zhihu douyin bilibili sspai)
    ↓
对每个平台执行以下操作：
    ├── 获取 API 数据 (curl 请求)  ← 重复请求问题
    ├── 检查响应状态
    ├── 构建钉钉 feedCard 消息
    ├── 调用钉钉推送脚本 (pnpm run start:sender $platform)  ← 又一次请求
    └── 记录推送结果
    ↓
输出汇总统计
```

### 优化后架构（已实现）

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

优化后的架构将业务逻辑完全集中在脚本层：

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

## 配置要求

### GitHub Secrets

需要在 GitHub 仓库的 Secrets 中配置以下变量：

| Secret 名称 | 说明 | 示例 |
|-------------|------|------|
| `DINGTALK_WEBHOOK_URL` | 钉钉机器人 Webhook 地址 | `https://oapi.dingtalk.com/robot/send?access_token=xxx` |
| `DINGTALK_SECRET` | 钉钉机器人签名密钥 | `SECxxx` |
| `API_TOKEN` | DailyHotApi 访问令牌 | `your-api-token` |

### workflow 环境变量（PLATFORMS）

`PLATFORMS` 环境变量在 workflow 中自动配置，定义需要推送的平台列表（逗号分隔）：

```yaml
env:
  PLATFORMS: "baidu,weibo,zhihu,douyin,bilibili,sspai"
```

支持的平台列表：

| 平台名称 | 说明 |
|----------|------|
| `baidu` | 百度热搜榜 |
| `weibo` | 微博热搜榜 |
| `zhihu` | 知乎热榜 |
| `douyin` | 抖音热点榜 |
| `bilibili` | 哔哩哔哩热门榜 |
| `sspai` | 少数派热榜 |
| `kuaishou` | 快手热点榜 |
| `douban-movie` | 豆瓣电影新片榜 |
| `douban-group` | 豆瓣讨论小组 |
| `tieba` | 百度贴吧热议榜 |
| `ithome` | IT之家热榜 |
| `jianshu` | 简书热门推荐 |
| `guokr` | 果壳热门文章 |
| `thepaper` | 澎湃新闻热榜 |
| `toutiao` | 今日头条热榜 |
| `36kr` | 36氪热榜 |
| `51cto` | 51CTO 推荐榜 |
| `csdn` | CSDN 排行榜 |
| `nodeseek` | NodeSeek 最新动态 |
| `juejin` | 掘金热榜 |
| `qq-news` | 腾讯新闻热点榜 |
| `sina` | 新浪网热榜 |
| `netease-news` | 网易新闻热点榜 |
| `52pojie` | 吾爱破解榜单 |
| `hostloc` | 全球主机交流榜单 |
| `huxiu` | 虎嗅 24小时 |
| `coolapk` | 酷安热榜 |
| `hupu` | 虎扑步行街热帖 |
| `ifanr` | 爱范儿快讯 |
| `miyoushe` | 米游社最新消息 |
| `genshin` | 原神最新消息 |
| `starrail` | 星穹铁道最新动态 |
| `weread` | 微信读书飙升榜 |
| `ngabbs` | NGA 热帖 |
| `v2ex` | V2EX 主题榜 |
| `hellogithub` | HelloGitHub Trending |
| `weatheralarm` | 中央气象台预警 |
| `earthquake` | 中国地震台速报 |
| `history` | 历史上的今天 |

**注意**：钉钉机器人有频率限制，建议单次推送不要超过 15 条消息。当前配置每次推送 6 个平台，每个平台 4 条，共 24 条。

### 推送平台列表

当前支持的推送平台（在 workflow 中循环处理）：

```bash
PLATFORMS="baidu weibo zhihu douyin bilibili sspai"
```

## 脚本说明

### 钉钉推送脚本

位于 `packages/dingtalk-sender/` 目录，包含以下核心功能：

#### 1. `src/send-cli.ts` - 核心推送逻辑

- `getHotNews(platform, token, limit)` - 获取指定平台热榜数据
- `sendFeedCard(platform, token)` - 发送钉钉 feedCard 消息
- 错误处理和日志输出

#### 2. `src/index.ts` - 命令行入口

- 解析命令行参数
- 读取环境变量
- 调用推送逻辑
- 退出码处理

#### 3. `run.mjs` - Node.js 运行入口

#### 4. 构建脚本

- `pnpm run build:sender` - 构建推送包
- `pnpm run start:sender [platform]` - 运行推送脚本

## 工作流程文件

### `daily-hot-push.yml`

位于 `.github/workflows/daily-hot-push.yml`，包含以下主要步骤：

1. **环境准备**：检出代码、安装 pnpm、设置 Node.js 环境
2. **依赖安装**：安装项目依赖
3. **推送执行**：
   - 构建钉钉推送包
   - 遍历平台列表
   - 对每个平台调用推送脚本
   - 统计推送结果

## 日志输出

### Workflow 日志

```
🔍 获取：baidu 并推送至钉钉
  状态码：200
  数据条数：50
  ✅ 成功，推送 百度热搜榜 到钉钉
  ✅ 钉钉推送成功
```

### 脚本日志

```
✅ 钉钉消息发送成功
Platform: baidu
Items sent: 4
Response: { ... }
```

## 最佳实践

### 1. 业务逻辑分离原则

- Workflow 只负责调度和基础检查
- 具体的数据获取、格式转换、推送逻辑由专用脚本处理
- 详细的错误日志和调试信息在脚本层输出

### 2. 错误处理

- API 请求失败时返回错误码
- 推送失败时记录详细错误信息
- 工作流层面统计成功/失败数量

### 3. 安全考虑

- 敏感信息通过环境变量传递
- 不在日志中输出敏感信息
- 使用钉钉机器人安全设置

## 定时配置

当前定时任务配置：
- **时间**：每天北京时间 8:00（UTC 0:00）
- **Cron 表达式**：`0 0 * * *`
- **支持手动触发**：可通过 GitHub Actions 界面手动运行

## 维护说明

### 常见问题排查

1. **推送失败**：
   - 检查 `DINGTALK_WEBHOOK_URL` 和 `API_TOKEN` 是否正确
   - 查看钉钉机器人是否被禁用
   - 检查 API 服务是否正常

2. **数据为空**：
   - 检查对应平台接口是否正常
   - 查看 API 服务日志

3. **推送频率限制**：
   - 钉钉机器人有频率限制
   - 当前设计为每平台单独推送，避免频率超限

### 扩展平台

如需增加新的推送平台：

1. 在 DailyHotApi 中添加对应平台的 API 接口
2. 在 workflow 的 `PLATFORMS` 变量中添加平台名称
3. 测试推送功能

## 技术栈

- **Workflow**: GitHub Actions
- **脚本语言**: TypeScript/Node.js
- **推送包**: @tnnevol/robot-ding
- **构建工具**: pnpm/unbuild
- **API 客户端**: axios

---

**最后更新**: 2026-04-01
**维护者**: DailyHotApi Team