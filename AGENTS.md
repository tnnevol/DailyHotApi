# AGENTS.md - DailyHotApi 项目开发规范

## 项目定位

- **名称**: DailyHotApi (今日热榜)
- **功能**: 聚合各大平台热门数据的 API 服务
- **技术栈**: Node.js 20+ / TypeScript / Hono
- **部署**: Docker / Node.js 直跑
- **项目路径**: `~/.openclaw/project-codes/DailyHotApi`

---

## 团队分工

| 角色        | 职责                                               | 权限                                        |
| ----------- | -------------------------------------------------- | ------------------------------------------- |
| **海** 🌊   | 需求整理、Issue 管理、进度监控、完成确认、部署审批 | 创建 Issue、检查进度、确认完成、审批 push   |
| **小钱** 💻 | 熟悉项目、代码开发、Bug 修复、功能实现、关闭 Issue | 领取 Issue、本地 commit、开发实现、申请关闭 |

---

## 开发流程

### 1. 需求接收

```
叶子提需求 → 海整理拆解 → 创建 GitHub Issue → 派发小钱
```

### 2. 领取任务

```
小钱领取 Issue → 先熟悉项目结构和代码 → 确认理解需求
```

### 3. 开发执行

```
创建 feature 分支 → 开发实现 → 本地测试 → git commit
```

### 4. 完成确认

```
小钱提交完成 → 海检查代码和测试结果 → 确认通过 → 关闭 Issue
```

---

## Issue 管理规范

### 优先级标签

- `critical` - 阻塞性问题（24h 内解决）
- `bug` - 功能缺陷（48h 内解决）
- `enhancement` - 功能优化（按排期）

### Issue 状态流转

```
Open → In Progress → Review → Closed
```

### Issue 模板

```markdown
## [优先级] 类型：描述

**背景**:
**任务清单**:

- [ ] 任务 1
- [ ] 任务 2
      **验收标准**:
      **截止时间**:
```

---

## Git 规范

### 分支策略

- `main` - 生产分支（受保护）
- `dev` - 开发分支
- `feature/*` - 功能分支

### 提交规范

```
feat: 新增功能
fix: 修复 bug
docs: 文档更新
refactor: 重构
chore: 构建/配置
```

### 权限控制

- ✅ AI 可执行：`git add`, `git commit` (本地)
- ✅ AI 可关闭：Issue 关闭（需海确认）
- ❌ AI 禁止：`git push` (必须人工审批)

---

## TODO.md 管理

**位置**: 项目根目录 `TODO.md`

**状态分类**:

- `⏳ 待办` - 未开始
- `🔄 进行中` - 开发中
- `✅ 已完成` - 已确认
- `⛔ 已取消` - 不再需要

---

## 审批流程

### 必须审批的操作

- Git push 到远程
- 部署上线
- 修改公开文档

### 审批格式

```
📋 **执行计划**
**目标**: xxx
**负责人**: xxx
**步骤**: 1... 2... 3...
**风险**: xxx
请确认后执行。
```

---

## 验收标准

### 代码质量

- [ ] ESLint 无报错
- [ ] Prettier 格式化通过
- [ ] TypeScript 编译通过

### 功能验收

- [ ] 新增 API 响应时间 < 500ms
- [ ] 缓存命中率 > 80%
- [ ] 单元测试覆盖率 > 70%

### 文档要求

- [ ] README.md 更新
- [ ] API 文档补充

---

## 配置文件规范

### 环境变量文件

| 文件           | 用途                   | 是否提交    |
| -------------- | ---------------------- | ----------- |
| `.env`         | 禁止使用               | ❌ 禁止     |
| `.env.local`   | 本地开发配置（真实值） | ❌ 禁止提交 |
| `.env.example` | 示例模板（占位符）     | ✅ 可提交   |
| `.env`         | 通用配置（无敏感信息） | ✅ 可提交   |

### 敏感信息规范

- ❌ **禁止在可提交文件中出现**:
  - Token / API Key
  - 密码
  - 真实 IP 地址（192.168.x.x, 10.x.x.x）
- ✅ **使用占位符**:
  - `<YOUR_TOKEN>`
  - `<YOUR_PASSWORD>`
  - `localhost:5005`

### .gitignore 配置

```
.env.local
*.secret
*.credentials
```

---

## 沟通机制

### 进度汇报

- 小钱领取 Issue 后先熟悉项目
- 开发中遇阻塞立即上报海
- 开发完成后提交海确认

### 完成汇报格式

```
✅ **任务完成**
**Issue**: #xx
**改了什么**: xxx
**为什么改**: xxx
**下一步**: xxx
```

### 确认流程

```
小钱提交完成 → 海检查代码 → 确认通过 → 关闭 Issue
```

---

## 💡 Skills 技能管理

### 目录结构

```
skills/
├── hono/              # Hono 技能（符号链接）
│   └── SKILL.md
└── .agents/skills/    # 实际技能存储位置
```

### 技能安装（pnpm install 后执行）

```bash
# 安装依赖
pnpm install

# 安装技能（自动创建符号链接）
npx skills experimental_install -y
```

### 技能管理

**符号链接机制**:

- `skills/` 目录中的技能以**符号链接**形式存在
- 实际文件存储在 `.agents/skills/` 目录
- 避免重复，便于共享和更新

**手动管理**:

```bash
# 查看技能列表
ls -la skills/

# 查看技能详情
cat skills/<skill-name>/SKILL.md

# 添加技能
cd .agents/skills/
git clone <skill-repo-url> <skill-name>
cd ../skills/
ln -s ../.agents/skills/<skill-name> <skill-name>

# 移除技能
rm <skill-name>
```

### SKILL.md 格式

```markdown
---
name: <skill-name>
description: <技能描述>
---

# <Skill Name> Skill

技能详细说明...
```

### Git 忽略

- ✅ `skills/` 目录已添加到 `.gitignore`（不提交）
- ❌ `skills-lock.json` 已从 `.gitignore` 中移除（需要提交）

---

_最后更新：2026-04-01_
