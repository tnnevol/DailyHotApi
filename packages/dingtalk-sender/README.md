# DingTalk Sender - 钉钉新闻推送包

> DailyHotApi 新闻推送专用包，负责从 DailyHotApi 获取热榜数据并推送到钉钉群

## 📦 安装

本包作为 DailyHotApi 项目的子包，通过 pnpm workspace 管理：

```bash
pnpm install
```

## 🚀 使用

### 环境变量

推送前需要配置以下环境变量：

| 变量名 | 说明 | 是否必需 |
|--------|------|----------|
| `DINGTALK_WEBHOOK_URL` | 钉钉机器人 Webhook 地址 | ✅ 是 |
| `DINGTALK_SECRET` | 钉钉机器人签名密钥 | ❌ 否 |
| `API_TOKEN` | DailyHotApi 访问令牌 | ✅ 是 |
| `PLATFORMS` | 平台列表（逗号分隔） | ✅ 是 |
| `API_BASE_URL` | DailyHotApi 服务地址 | ✅ 是 |
| `DEFAULT_IMAGE_URL` | 默认图片地址 | ✅ 是 |

### 命令

```bash
# 构建推送包
pnpm run build:sender

# 运行推送
pnpm run start:sender
```

## 🏗️ 架构说明

### 推送流程

```
GitHub Actions (每天 8:00)
    ↓
    ├─ 安装项目依赖
    ↓
    └─ 调用 pnpm run start:sender
            ↓
            └─ DingTalkSender.batchSendFeedCard()
                    ↓
                    ├─ 遍历平台列表 (baidu, weibo, zhihu, ...)
                    ↓       ↓
                    │       └─ 每个平台请求一次 DailyHotApi API
                    ↓
                    └─ 合并所有平台数据
                            ↓
                            └─ 一次性推送到钉钉群
```

### API 请求次数

**重要**: 本推送包采用批量推送模式，确保每个平台每天只发起一次 API 请求。

**示例**:
- 如果配置了 10 个平台 → 发起 10 次 API 请求 → 合并后推送 1 次钉钉消息
- **不会**为每个平台单独推送钉钉消息
- **不会**重复请求同一个平台的 API

### 代码结构

```
packages/dingtalk-sender/
├── src/
│   ├── index.ts          # 入口文件，负责读取环境变量并调用批量推送
│   └── send-cli.ts       # 核心推送逻辑
│       ├── DingTalkSender      # 推送类
│       ├── getHotNews()        # 获取单个平台数据（每个平台调用 1 次）
│       ├── batchSendFeedCard() # 批量推送（主入口）
│       └── sendDingToRobot()   # 发送钉钉消息（只调用 1 次）
├── package.json
└── README.md
```

### 关键方法说明

#### `batchSendFeedCard(platforms, token, allFeedItems)`

**职责**: 批量获取所有平台数据并合并推送

**执行流程**:
1. 遍历 `platforms` 数组
2. 对每个平台调用 `getHotNews()` 获取数据
3. 将数据添加到 `allFeedItems` 数组
4. 遍历完成后，调用 `sendDingToRobot()` 一次性推送所有数据

**API 请求次数**: `platforms.length` 次

**钉钉推送次数**: 1 次

#### `getHotNews(platform, token, limit)`

**职责**: 从 DailyHotApi 获取单个平台的热榜数据

**API 端点**: `https://newsapi.tnnevol.cn/{platform}?token={token}&limit={limit}`

**请求次数**: 每个平台调用 1 次

#### `sendDingToRobot(items)`

**职责**: 将合并后的所有平台数据推送到钉钉群

**推送次数**: 1 次（所有平台合并后）

## 📊 推送日志示例

```
🔍 准备推送 10 个平台

🔍 获取：baidu
  ✅ 成功，推送 百度热搜 到钉钉
  平台：baidu，条数：4

🔍 获取：weibo
  ✅ 成功，推送 微博 到钉钉
  平台：weibo，条数：4

...（其他平台）

===== 合并推送 =====
合并 40 条消息到钉钉
平台数量：10

✅ 钉钉批量推送成功
```

## 🔧 开发

### 本地测试

1. 创建 `.env.local` 文件：

```bash
DINGTALK_WEBHOOK_URL=https://oapi.dingtalk.com/robot/send?access_token=xxx
DINGTALK_SECRET=SECxxx
API_TOKEN=your-api-token
PLATFORMS=baidu,weibo,zhihu
```

2. 运行测试：

```bash
pnpm run start:sender
```

### 构建

```bash
pnpm run build
```

## 📝 注意事项

1. **API 限流**: DailyHotApi 可能有请求频率限制，建议合理配置推送时间
2. **钉钉消息长度**: 钉钉 feedCard 消息有长度限制，建议每个平台推送 4 条以内
3. **错误处理**: 单个平台请求失败不影响其他平台推送
4. **环境变量**: 确保所有必需的环境变量已正确配置

## 📄 License

MIT
