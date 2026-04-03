# DailyHotApi - Cloudflare Workers 试点迁移文档

## 📋 试点范围

本次试点仅迁移以下 3 个接口到 Cloudflare Workers：
- `/baidu` - 百度热搜 ✅ 已验证
- `/weibo` - 微博热搜 ✅ 已验证  
- `/zhihu` - 知乎热榜 ✅ 已验证

## 🎯 试点目标

1. ✅ 验证 DailyHotApi 能以最小改造方式运行在 Cloudflare Workers
2. ✅ 跑通 Workers 入口、基础缓存、基础日志、基础部署链路
3. ✅ 为后续全量迁移积累经验

## 📁 新增文件

### 核心文件
- `workers-adapter.ts` - Workers 入口文件
- `src/workers-app.ts` - Workers 专用应用
- `src/workers-registry.ts` - 试点路由静态注册
- `wrangler.toml` - Cloudflare Workers 配置文件

### 适配器
- `src/adapters/workers-logger.ts` - Workers 日志适配器
- `src/adapters/workers-config.ts` - Workers 配置适配器
- `src/adapters/workers-kv-cache.ts` - Workers KV 缓存适配器

### 部署配置
- `.github/workflows/deploy-cloudflare.yml` - Cloudflare 部署工作流

## 🔧 修改文件

### 路由文件
- `src/routes/baidu.ts` - 移除 logger 依赖
- `src/routes/weibo.ts` - 移除 logger 依赖
- `src/routes/zhihu.ts` - 移除 logger 依赖

### 中间件
- `src/middleware/auth.ts` - 支持 Workers env 参数

### 配置
- `package.json` - 添加 Workers 相关脚本和类型

## 🚀 本地验证

### 前置条件

1. 安装 Wrangler CLI:
```bash
npm install -g wrangler
```

2. 登录 Cloudflare:
```bash
wrangler login
```

3. 安装项目依赖:
```bash
pnpm install
```

### 本地开发

```bash
# 启动 Workers 本地开发服务器
pnpm workers:dev

# 或使用 wrangler 直接启动
wrangler dev workers-adapter.ts --local --port 8787 --ip 127.0.0.1
```

访问 `http://localhost:8787` 测试接口:
- `http://localhost:8787/health` - 健康检查 ✅ 已验证
- `http://localhost:8787/all` - 路由列表 ✅ 已验证
- `http://localhost:8787/baidu?token=YOUR_TOKEN` - 百度热搜 ✅ 已验证
- `http://localhost:8787/weibo?token=YOUR_TOKEN` - 微博热搜 ✅ 已验证
- `http://localhost:8787/zhihu?token=YOUR_TOKEN` - 知乎热榜 ✅ 已验证

### 验证结果 (2026-04-02)

✅ **所有试点接口验证通过**:
- `/health` - 返回 `{"status":"healthy","version":"2.0.8-workers-pilot"}`
- `/baidu` - 返回 51 条百度热搜数据
- `/weibo` - 返回 52 条微博热搜数据
- `/zhihu` - 返回 30 条知乎热榜数据

## 🔐 环境变量配置

### 本地开发 (.env.local)

```bash
API_TOKEN=your-secret-token-here
ALLOWED_DOMAIN=*
ALLOWED_HOST=tnnevol.cn
```

### Cloudflare Workers（production 单环境）

当前部署链路仅支持 **production**，并由 GitHub Actions 在运行时生成 `wrangler.toml`。
仓库内的 `wrangler.toml` 仅作本地示例模板，不包含真实生产 KV ID。

**GitHub Actions 注入方式**:
- `CLOUDFLARE_API_TOKEN` -> GitHub Secrets
- `CLOUDFLARE_ACCOUNT_ID` -> GitHub Secrets
- `KV_NAMESPACE_ID` -> GitHub Secrets（用于写入生成的 `wrangler.toml`）

### 环境变量/密钥说明

| 名称 | 用途 | 来源 | 是否敏感 |
|------|------|------|----------|
| `CLOUDFLARE_API_TOKEN` | Wrangler 部署认证 | GitHub Secrets | ✅ 是 |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账户标识 | GitHub Secrets | ✅ 是 |
| `KV_NAMESPACE_ID` | 生产环境 KV 命名空间 ID | GitHub Secrets | ✅ 是 |
| `ALLOWED_DOMAIN` | CORS 允许域名 | workflow 生成的 wrangler.toml | ❌ 否 |
| `ALLOWED_HOST` | CORS 允许主机 | workflow 生成的 wrangler.toml | ❌ 否 |

> 后续若新增环境（如 staging），再扩展 workflow 生成逻辑；当前不做多环境预留实现。

## 📦 部署

### 手动部署（production）

```bash
# 部署到 production 环境
pnpm workers:deploy --env production
```

### GitHub Actions 自动部署

当前仅支持 production 单环境：
- 推送到 `main` 分支时自动部署
- 或手动 `workflow_dispatch` 触发部署

需要在 GitHub Secrets 中配置:
- `CLOUDFLARE_API_TOKEN` - Cloudflare API 令牌
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare 账户 ID
- `KV_NAMESPACE_ID` - 生产 KV 命名空间 ID

## 🗂️ KV 缓存配置（production）

当前仅 production 单环境：

1. 创建 KV 命名空间:
```bash
wrangler kv namespace create "DAILYHOT_CACHE_PROD"
```

2. 将返回的 namespace id 配置到 GitHub Secrets:
- `KV_NAMESPACE_ID`

3. workflow 在运行时生成 `wrangler.toml` 并注入该 ID。

## ⚠️ 注意事项

### 本次试点已验证:
- ✅ Workers 入口和路由注册
- ✅ 3 个试点接口（baidu/weibo/zhihu）正常返回数据
- ✅ Token 鉴权中间件工作正常
- ✅ CORS 配置正常
- ✅ wrangler dev 本地开发环境

### 本次试点不包含:
- ❌ 全量接口迁移（仅试点 3 个接口）
- ❌ 静态资源服务（首页、favicon 等）
- ❌ KV 缓存（代码已实现，未测试）
- ❌ 文件日志（使用 console.log）
- ❌ RSS 功能（可后续添加）
- ❌ 生产环境部署验证

### 已知限制:
1. Workers 不支持文件系统访问
2. Workers 不支持 Node.js 内置模块
3. Workers 有 CPU 时间和内存限制
4. Workers 不支持长时间运行的任务
5. compress 中间件在 wrangler dev 本地环境有兼容性问题（已临时禁用）

### 配置说明:
- CORS 配置当前使用默认值（ALLOWED_DOMAIN='*', ALLOWED_HOST='tnnevol.cn'）
- 完整实现需要通过 wrangler.toml vars 或 wrangler secret 注入环境变量
- API_TOKEN 必须通过 wrangler secret put 设置（敏感配置）

## 🐛 故障排查

### 本地开发常见问题

**问题**: `wrangler dev` 启动失败
```bash
# 检查 wrangler 版本
wrangler --version

# 重新登录
wrangler logout
wrangler login
```

**问题**: 类型错误
```bash
# 运行类型检查
pnpm workers:typecheck
```

### 部署常见问题

**问题**: 部署失败，提示认证错误
```bash
# 检查 Secrets 配置
wrangler secret list --env production
```

**问题**: KV 绑定错误
```bash
# 检查 KV 命名空间
wrangler kv:namespace list
```

## 📊 下一步计划

1. ✅ 完成试点迁移（当前阶段）
2. ⏳ 本地验证通过
3. ⏳ 部署到 Cloudflare 测试环境
4. ⏳ 验证接口功能正常
5. ⏳ 性能测试和优化
6. ⏳ 全量接口迁移规划

---

最后更新：2026-04-02 | 试点版本：v2.0.8-workers-pilot
