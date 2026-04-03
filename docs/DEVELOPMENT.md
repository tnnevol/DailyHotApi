# DailyHotApi - 开发指南

> 本文档说明如何在不同环境下开发和调试 DailyHotApi 项目

---

## 📋 目录

- [环境配置](#环境配置)
- [Node.js 开发环境](#nodejs-开发环境)
- [Cloudflare Workers 开发环境](#cloudflare-workers-开发环境)
- [调试技巧](#调试技巧)
- [常见问题](#常见问题)

---

## 🔧 环境配置

### 环境文件说明

项目使用 `.env.local` 作为本地配置文件：

| 文件         | 用途             | 是否提交    |
| ------------ | ---------------- | ----------- |
| `.env.local` | 本地个人配置     | ❌ 禁止提交 |

### .env.local 配置示例

```bash
# 服务端口
PORT=6688

# API 鉴权 Token（必需）
API_TOKEN=<YOUR_API_TOKEN>

# 允许的域名
ALLOWED_DOMAIN="*"
ALLOWED_HOST="tnnevol.cn"

# Cloudflare Workers 配置（用于 Workers 部署）
CLOUDFLARE_API_TOKEN=<YOUR_CLOUDFLARE_API_TOKEN>
CLOUDFLARE_ACCOUNT_ID=<YOUR_ACCOUNT_ID>
KV_NAMESPACE_ID=<YOUR_KV_NAMESPACE_ID>

# 钉钉推送配置（可选）
DINGTALK_WEBHOOK_URL=<YOUR_WEBHOOK_URL>
DINGTALK_SECRET=<YOUR_SECRET>

# 推送服务配置
API_BASE_URL=https://newapi.wouqian.cn
DEFAULT_IMAGE_URL=<YOUR_DEFAULT_IMAGE_URL>
```

> ⚠️ **安全提醒**：`.env.local` 包含敏感信息，**禁止提交到 Git 仓库**。

---

## 🚀 Node.js 开发环境

### 前置要求

- Node.js 20+
- pnpm（推荐）

### 安装依赖

```bash
pnpm install
```

### 开发脚本

```bash
# 启动开发服务器（实时重载）
pnpm run dev:local

# 编译项目
pnpm run build

# 启动生产服务
pnpm run start:local
```

### 可用脚本

| 命令              | 说明                        |
| ----------------- | --------------------------- |
| `dev:local`       | 开发模式（实时重载）        |
| `build`           | 编译 TypeScript             |
| `start:local`     | 启动编译后的服务            |
| `build:sender`    | 构建 dingtalk-sender 包     |
| `start:sender`    | 运行钉钉推送脚本            |

---

## ☁️ Cloudflare Workers 开发环境

### 前置要求

- Wrangler CLI（`npm install -g wrangler`）
- Cloudflare 账户

### 登录认证

```bash
wrangler login
```

### 本地开发

```bash
# 启动 Workers 本地开发服务器
pnpm run workers:dev
```

本地开发服务器会在 `http://localhost:8787` 启动，支持热重载。

### 类型检查

```bash
# Workers 类型检查
pnpm run workers:typecheck
```

### 部署

```bash
# 部署到 Cloudflare Workers
pnpm run workers:deploy
```

### Wrangler 常用命令

```bash
# 查看部署状态
wrangler deployments list

# 查看实时日志
wrangler tail

# 查看 KV 数据
wrangler kv:key list --namespace-id=<YOUR_NAMESPACE_ID>

# 设置 Secret
wrangler secret put API_TOKEN
```

### 项目结构

```
├── workers-adapter.ts    # Workers 入口适配器
├── src/
│   ├── workers-app.ts       # Workers Hono 应用
│   ├── workers-registry.ts  # Workers 路由注册
│   └── adapters/
│       ├── workers-config.ts    # 配置适配器
│       ├── workers-kv-cache.ts  # KV 缓存适配器
│       └── workers-logger.ts    # 日志适配器
└── wrangler.toml         # Workers 配置（自动生成）
```

---

## 🐛 调试技巧

### 1. 禁用缓存

```bash
# 添加 ?cache=false 参数
curl "http://localhost:6688/weibo?cache=false"
```

### 2. 查看环境变量

```bash
# 验证配置是否正确加载
node -e "require('dotenv').config(); console.log(process.env.API_TOKEN)"
```

### 3. Workers 日志

```bash
# 查看实时日志
wrangler tail

# 或通过 Cloudflare Dashboard 查看
```

### 4. 本地调试 Workers

```bash
# 启动本地开发
pnpm run workers:dev

# 另一个终端测试
curl "http://localhost:8787/baidu?token=<YOUR_TOKEN>"
```

---

## ❓ 常见问题

### Q1: 应该使用 Node.js 还是 Workers 开发？

**A**: 根据部署目标选择：
- **Node.js**：自有服务器部署、传统部署方式
- **Workers**：边缘部署、Cloudflare 部署

### Q2: Workers 本地开发如何配置环境变量？

**A**: 创建 `.dev.vars` 文件（类似 `.env.local`）：

```bash
# .dev.vars
API_TOKEN=<YOUR_API_TOKEN>
```

> `.dev.vars` 同样禁止提交。

### Q3: 如何添加新的路由？

**A**: 
1. 在 `src/routes/` 创建路由文件
2. 确保不使用 Node.js 专用模块（如 `fs`, `path`）
3. 在 `workers-registry.ts` 中注册路由

### Q4: .env.local 被误提交了怎么办？

**A**:
1. 立即从 Git 历史中删除
2. 将 `.env.local` 添加到 `.gitignore`
3. **立即轮换所有泄露的 Token/密码**

### Q5: Workers 部署失败怎么办？

**A**: 检查以下配置：
1. `CLOUDFLARE_API_TOKEN` 权限是否正确
2. `CLOUDFLARE_ACCOUNT_ID` 是否正确
3. KV Namespace 是否已创建

---

## 📚 相关文档

- [部署指南](./DEPLOYMENT.md) - 生产环境部署
- [API 文档](./API.md) - 接口使用说明
- [新闻推送工作流程](./NEWS_PUSH_WORKFLOW.md) - 推送功能说明

---

**最后更新**: 2026-04-03 | **维护者**: DailyHotApi Team