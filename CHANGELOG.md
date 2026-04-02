# CHANGELOG.md

本文件用于简短记录项目每次已经落地的功能点、修复点和重要行为变化。

## 2026-04-02

### Added
- 新增 Cloudflare Workers 试点入口：`workers-adapter.ts`
- 新增 Workers 专用应用与试点路由注册：`src/workers-app.ts`、`src/workers-registry.ts`
- 新增 Workers 适配器层：日志、配置、KV 缓存适配器
- 新增 `docs/WORKERS_PILOT.md`，记录 Workers 试点迁移与本地验证方式
- 新增项目内本地任务编排与巡检机制（需求文档、状态文件、review log）
- 新增推送架构说明文档，明确 Daily Hot News Push 的实际执行路径

### Changed
- `src/middleware/auth.ts` 支持 Workers `env` 与本地环境双模式读取
- `src/routes/baidu.ts`、`src/routes/weibo.ts`、`src/routes/zhihu.ts` 为 Workers 试点移除对原 logger 的直接依赖
- `package.json` 增加 Workers 相关脚本与类型支持
- `TODO.md` 增加本地需求编排区块、测试约束、会话回复约束与任务边界说明
- 明确 `Daily Hot News Push` 继续运行在 GitHub Actions 中，不迁移运行位置

### Fixed
- 修正 Workers 入口误接 Node 版 app 的问题
- 修正 Workers 试点路由注册的导入路径问题
- 收敛试点汇报口径，区分“已实现 / 已验证 / 未验证”
- 澄清推送架构“重复请求”误解，确认当前批量推送链路正确

### Notes
- Workers 试点当前已完成本地验证：`/baidu`、`/weibo`、`/zhihu`
- `001-workers-pilot` 已完成归档
- `002-push-architecture` 已完成归档
- `Issue #1` 已按当前确认视为完成
- `packages/dingtalk-sender` 作为 pnpm monorepo 附属项目，非必要不改
- Cloudflare 生产部署、KV 缓存与自动部署仍待后续验证

## 2026-04-01

### Added
- 新增每日 8:00 新闻热榜自动推送 workflow 与相关修复
- 新增首批、第二批、第三批热榜接口移植成果
- 新增项目开发规范文档：`AGENTS.md`

### Changed
- 优化新闻推送 workflow，消除重复请求路径中的误解
- 统一 GitHub Secrets 管理方式

### Fixed
- 修复钉钉推送脚本异常
- 替换百度热搜接口实现

### Notes
- 截至 2026-04-01，已完成 22 个平台接口移植
- 推送功能已完成开发，后续重点转向配置、测试与部署验证
