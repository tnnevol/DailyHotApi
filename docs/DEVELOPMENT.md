# DailyHotApi - 开发指南

> 本文档说明如何在不同环境下开发和调试 DailyHotApi 项目

---

## 📋 目录

- [环境配置](#环境配置)
- [开发脚本](#开发脚本)
- [环境切换](#环境切换)
- [调试技巧](#调试技巧)
- [常见问题](#常见问题)

---

## 🔧 环境配置

### 环境文件说明

项目支持多种环境配置文件，使用 `dotenv-cli` 管理：

| 文件               | 用途             | 是否提交    | 示例                           |
| ------------------ | ---------------- | ----------- | ------------------------------ |
| `.env.local`       | **本地个人配置** | ❌ 禁止提交 | 真实 API Token、本地数据库密码 |
| `.env.development` | **开发环境配置** | ✅ 可提交   | 占位符、公开测试地址           |
| `.env.production`  | **生产环境配置** | ❌ 禁止提交 | 生产环境 Token、正式数据库     |

### .env.local 示例

```bash
# 服务端口
PORT=6688

# 允许的域名
ALLOWED_DOMAIN="*"

# Redis 配置（本地真实配置）
REDIS_HOST="127.0.0.1"
REDIS_PORT=6379
REDIS_PASSWORD="your_real_password"

# 第三方 API Token（真实值，禁止提交）
ZHIHU_COOKIE="your_real_cookie"
WEBHOOK_TOKEN="your_real_token"
```

### .env.development 示例

```bash
# 服务端口
PORT=6688

# 允许的域名
ALLOWED_DOMAIN="*"

# Redis 配置（开发环境占位符）
REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_PASSWORD=""

# 第三方 API Token（占位符，可提交）
ZHIHU_COOKIE="<YOUR_ZHIHU_COOKIE>"
WEBHOOK_TOKEN="<YOUR_WEBHOOK_TOKEN>"
```

---

## 🚀 开发脚本

### 本地开发（推荐）

```bash
# 使用 .env.local 配置启动开发服务器（实时重载）
npm run dev:local

# 使用 .env.local 配置启动开发服务器（带缓存）
npm run dev:cache:local
```

**适用场景**:

- ✅ 日常开发调试
- ✅ 使用本地真实配置测试
- ✅ 连接本地数据库/Redis

### 开发环境

```bash
# 使用 .env.development 配置启动开发服务器（实时重载）
npm run dev

# 使用 .env.development 配置启动开发服务器（带缓存）
npm run dev:cache
```

**适用场景**:

- ✅ 测试开发环境配置
- ✅ 验证占位符配置是否正常工作
- ✅ CI/CD 流水线测试

### 生产环境

```bash
# 编译项目
npm run build

# 使用 .env.development 配置启动服务
npm run start

# 使用 .env.local 配置启动服务
npm run start:local
```

**适用场景**:

- ✅ 生产部署前测试
- ✅ 性能测试
- ✅ 验证编译后的代码

---

## 🔄 环境切换

### dev:local vs dev 的区别

| 特性         | `dev:local`     | `dev`              |
| ------------ | --------------- | ------------------ |
| **配置文件** | `.env.local`    | `.env.development` |
| **用途**     | 个人本地开发    | 开发环境测试       |
| **配置内容** | 真实 Token/密码 | 占位符/公开配置    |
| **是否提交** | ❌ 禁止提交     | ✅ 可提交          |
| **推荐使用** | ✅ 日常开发     | 环境验证           |

### 切换流程

**从开发环境切换到本地环境**:

```bash
# 1. 停止当前运行的服务（Ctrl+C）

# 2. 启动本地环境
npm run dev:local

# 3. 验证配置
curl http://localhost:6688/health
```

**对比调试**:

```bash
# 终端 1：启动本地环境
npm run dev:local

# 终端 2：启动开发环境（需要不同端口）
PORT=6689 npm run dev

# 对比两个环境的响应差异
curl http://localhost:6688/weibo
curl http://localhost:6689/weibo
```

---

## 🐛 调试技巧

### 1. 日志级别设置

在环境文件中设置日志级别：

```bash
# .env.local
LOG_LEVEL=debug  # 本地开发使用 debug 级别
```

```bash
# .env.development
LOG_LEVEL=info   # 开发环境使用 info 级别
```

### 2. 禁用缓存调试

```bash
# 使用 dev:cache 测试缓存效果
npm run dev:cache

# 禁用缓存（添加 ?cache=false 参数）
curl "http://localhost:6688/weibo?cache=false"
```

### 3. 环境变量验证

```bash
# 在代码中添加调试输出
console.log('PORT:', process.env.PORT);
console.log('REDIS_HOST:', process.env.REDIS_HOST);
```

### 4. 使用不同端口对比

```bash
# 本地环境（端口 6688）
npm run dev:local

# 开发环境（端口 6689）
PORT=6689 npm run dev

# 同时访问两个接口对比
curl http://localhost:6688/baidu
curl http://localhost:6689/baidu
```

---

## ❓ 常见问题

### Q1: 应该使用哪个命令开发？

**A**: 日常开发优先使用 `npm run dev:local`，原因：

- ✅ 使用本地真实配置
- ✅ 连接本地数据库/Redis
- ✅ 方便调试和测试

### Q2: 什么时候使用 `npm run dev`？

**A**: 以下情况使用开发环境：

- 验证 `.env.development` 配置是否正确
- 测试占位符配置
- CI/CD 流水线测试
- 准备提交代码前的验证

### Q3: 如何添加新的环境配置？

**A**:

1. 创建新的环境文件（如 `.env.test`）
2. 添加对应的 scripts 命令：
   ```json
   "dev:test": "dotenv -e .env.test -- tsx watch src/index.ts"
   ```
3. 在文档中说明用途

### Q4: .env.local 被误提交了怎么办？

**A**:

1. 立即从 Git 历史中删除：
   ```bash
   git rm --cached .env.local
   git commit -m "remove .env.local from tracking"
   ```
2. 将 `.env.local` 添加到 `.gitignore`
3. 旋转泄露的 Token/密码

### Q5: 如何在不同环境间快速切换？

**A**: 使用别名（添加到 `~/.bashrc` 或 `~/.zshrc`）：

```bash
alias dev-local="npm run dev:local"
alias dev-env="npm run dev"
alias start-local="npm run start:local"
```

---

## 📚 相关文档

- [部署指南](./DEPLOYMENT.md) - 生产环境部署
- [API 文档](./API.md) - 接口使用说明
- [贡献指南](./CONTRIBUTING.md) - 代码贡献规范

---

**最后更新**: 2026-04-01 | **维护者**: DailyHotApi Team
