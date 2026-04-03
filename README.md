<div align="center">
<img alt="logo" height="120" src="./public/favicon.png" width="120"/>
<h2>今日热榜</h2>
<p>一个聚合热门数据的 API 接口</p>
<br />
<img src="https://img.shields.io/github/last-commit/tnnevol/DailyHotApi" alt="last commit"/>
 <img src="https://img.shields.io/github/languages/code-size/tnnevol/DailyHotApi" alt="code size"/>
<img src="https://github.com/tnnevol/DailyHotApi/actions/workflows/npm.yml/badge.svg" alt="Publish npm package"/>
<img src="https://github.com/tnnevol/DailyHotApi/actions/workflows/deploy-cloudflare.yml/badge.svg" alt="Deploy to Cloudflare Workers"/>
</div>

## 🏗️ 项目架构

- **框架**: Hono (高性能Web框架)
- **语言**: TypeScript (提供类型安全保障)
- **运行时**: Node.js 20+
- **包管理**: pnpm
- **API设计**: RESTful API + RSS输出模式
- **中间件**: CORS、压缩、认证、日志等

## 🔐 安全特性

- **API鉴权**: Token验证机制保护API端点
- **输入验证**: 所有API参数经过验证和清理
- **速率限制**: 防止滥用和过载
- **安全头**: 实施安全HTTP头

## 🙏 致谢

本项目基于以下开源项目二次开发：

- **DailyHotApi** by [imsyy](https://github.com/tnnevol/DailyHotApi) - 提供基础框架和 API 设计
- **hot_news** by [orz-ai](https://github.com/orz-ai/hot_news) - 提供爬虫接口和数据处理逻辑

感谢原项目作者的开源贡献和灵感！

---

## 🚩 特性

- 极快响应，便于开发
- 支持 RSS 模式和 JSON 模式
- 支持多种部署方式
- 简明的路由目录，便于新增

## 👀 示例

> 这里是使用该 API 的示例站点  
> 示例站点可能由于访问量或者长久未维护而访问异常  
> 若您也使用了本 API 搭建了网站，欢迎提交您的站点链接

- [今日热榜 - https://newapi.wouqian.cn](https://newapi.wouqian.cn)

## 📊 接口总览

<details>
<summary>查看全部接口</summary>

> 示例站点运行于海外服务器，部分国内站点可能存在访问异常，请以实际情况为准

| **站点**         | **类别**     | **调用名称**   | **状态**                                                                                                                                                              |
| ---------------- | ------------ | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 哔哩哔哩         | 热门榜       | bilibili       | ![https://newapi.wouqian.cn/bilibili](https://img.shields.io/website.svg?label=bilibili&url=https://newapi.wouqian.cn/bilibili&cacheSeconds=7200)                   |
| AcFun            | 排行榜       | acfun          | ![https://newapi.wouqian.cn/acfun](https://img.shields.io/website.svg?label=acfun&url=https://newapi.wouqian.cn/acfun&cacheSeconds=7200)                            |
| 微博             | 热搜榜       | weibo          | ![https://newapi.wouqian.cn/weibo](https://img.shields.io/website.svg?label=weibo&url=https://newapi.wouqian.cn/weibo&cacheSeconds=7200)                            |
| 知乎             | 热榜         | zhihu          | ![https://newapi.wouqian.cn/zhihu](https://img.shields.io/website.svg?label=zhihu&url=https://newapi.wouqian.cn/zhihu&cacheSeconds=7200)                            |
| 知乎日报         | 推荐榜       | zhihu-daily    | ![https://newapi.wouqian.cn/zhihu-daily](https://img.shields.io/website.svg?label=zhihu-daily&url=https://newapi.wouqian.cn/zhihu-daily&cacheSeconds=7200)          |
| 百度             | 热搜榜       | baidu          | ![https://newapi.wouqian.cn/baidu](https://img.shields.io/website.svg?label=baidu&url=https://newapi.wouqian.cn/baidu&cacheSeconds=7200)                            |
| 抖音             | 热点榜       | douyin         | ![https://newapi.wouqian.cn/douyin](https://img.shields.io/website.svg?label=douyin&url=https://newapi.wouqian.cn/douyin&cacheSeconds=7200)                         |
| 快手             | 热点榜       | kuaishou       | ![https://newapi.wouqian.cn/kuaishou](https://img.shields.io/website.svg?label=kuaishou&url=https://newapi.wouqian.cn/kuaishou&cacheSeconds=7200)                   |
| 豆瓣电影         | 新片榜       | douban-movie   | ![https://newapi.wouqian.cn/douban-movie](https://img.shields.io/website.svg?label=douban-movie&url=https://newapi.wouqian.cn/douban-movie&cacheSeconds=7200)       |
| 豆瓣讨论小组     | 讨论精选     | douban-group   | ![https://newapi.wouqian.cn/douban-group](https://img.shields.io/website.svg?label=douban-group&url=https://newapi.wouqian.cn/douban-group&cacheSeconds=7200)       |
| 百度贴吧         | 热议榜       | tieba          | ![https://newapi.wouqian.cn/tieba](https://img.shields.io/website.svg?label=tieba&url=https://newapi.wouqian.cn/tieba&cacheSeconds=7200)                            |
| 少数派           | 热榜         | sspai          | ![https://newapi.wouqian.cn/sspai](https://img.shields.io/website.svg?label=sspai&url=https://newapi.wouqian.cn/sspai&cacheSeconds=7200)                            |
| IT之家           | 热榜         | ithome         | ![https://newapi.wouqian.cn/ithome](https://img.shields.io/website.svg?label=ithome&url=https://newapi.wouqian.cn/ithome&cacheSeconds=7200)                         |
| IT之家「喜加一」 | 最新动态     | ithome-xijiayi | ![https://newapi.wouqian.cn/ithome-xijiayi](https://img.shields.io/website.svg?label=ithome-xijiayi&url=https://newapi.wouqian.cn/ithome-xijiayi&cacheSeconds=7200) |
| 简书             | 热门推荐     | jianshu        | ![https://newapi.wouqian.cn/jianshu](https://img.shields.io/website.svg?label=jianshu&url=https://newapi.wouqian.cn/jianshu&cacheSeconds=7200)                      |
| 果壳             | 热门文章     | guokr          | ![https://newapi.wouqian.cn/guokr](https://img.shields.io/website.svg?label=guokr&url=https://newapi.wouqian.cn/guokr&cacheSeconds=7200)                            |
| 澎湃新闻         | 热榜         | thepaper       | ![https://newapi.wouqian.cn/thepaper](https://img.shields.io/website.svg?label=thepaper&url=https://newapi.wouqian.cn/thepaper&cacheSeconds=7200)                   |
| 今日头条         | 热榜         | toutiao        | ![https://newapi.wouqian.cn/toutiao](https://img.shields.io/website.svg?label=toutiao&url=https://newapi.wouqian.cn/toutiao&cacheSeconds=7200)                      |
| 36 氪            | 热榜         | 36kr           | ![https://newapi.wouqian.cn/36kr](https://img.shields.io/website.svg?label=36kr&url=https://newapi.wouqian.cn/36kr&cacheSeconds=7200)                               |
| 51CTO            | 推荐榜       | 51cto          | ![https://newapi.wouqian.cn/51cto](https://img.shields.io/website.svg?label=51cto&url=https://newapi.wouqian.cn/51cto&cacheSeconds=7200)                            |
| CSDN             | 排行榜       | csdn           | ![https://newapi.wouqian.cn/csdn](https://img.shields.io/website.svg?label=csdn&url=https://newapi.wouqian.cn/csdn&cacheSeconds=7200)                               |
| NodeSeek         | 最新动态     | nodeseek       | ![https://newapi.wouqian.cn/nodeseek](https://img.shields.io/website.svg?label=nodeseek&url=https://newapi.wouqian.cn/nodeseek&cacheSeconds=7200)                   |
| 稀土掘金         | 热榜         | juejin         | ![https://newapi.wouqian.cn/juejin](https://img.shields.io/website.svg?label=juejin&url=https://newapi.wouqian.cn/juejin&cacheSeconds=7200)                         |
| 腾讯新闻         | 热点榜       | qq-news        | ![https://newapi.wouqian.cn/qq-news](https://img.shields.io/website.svg?label=qq-news&url=https://newapi.wouqian.cn/qq-news&cacheSeconds=7200)                      |
| 新浪网           | 热榜         | sina           | ![https://newapi.wouqian.cn/sina](https://img.shields.io/website.svg?label=sina&url=https://newapi.wouqian.cn/sina&cacheSeconds=7200)                               |
| 新浪新闻         | 热点榜       | sina-news      | ![https://newapi.wouqian.cn/sina-news](https://img.shields.io/website.svg?label=sina-news&url=https://newapi.wouqian.cn/sina-news&cacheSeconds=7200)                |
| 网易新闻         | 热点榜       | netease-news   | ![https://newapi.wouqian.cn/netease-news](https://img.shields.io/website.svg?label=netease-news&url=https://newapi.wouqian.cn/netease-news&cacheSeconds=7200)       |
| 吾爱破解         | 榜单         | 52pojie        | ![https://newapi.wouqian.cn/52pojie](https://img.shields.io/website.svg?label=52pojie&url=https://newapi.wouqian.cn/52pojie&cacheSeconds=7200)                      |
| 全球主机交流     | 榜单         | hostloc        | ![https://newapi.wouqian.cn/hostloc](https://img.shields.io/website.svg?label=hostloc&url=https://newapi.wouqian.cn/hostloc&cacheSeconds=7200)                      |
| 虎嗅             | 24小时       | huxiu          | ![https://newapi.wouqian.cn/huxiu](https://img.shields.io/website.svg?label=huxiu&url=https://newapi.wouqian.cn/huxiu&cacheSeconds=7200)                            |
| 酷安             | 热榜         | coolapk        | ![https://newapi.wouqian.cn/coolapk](https://img.shields.io/website.svg?label=coolapk&url=https://newapi.wouqian.cn/coolapk&cacheSeconds=7200)                      |
| 虎扑             | 步行街热帖   | hupu           | ![https://newapi.wouqian.cn/hupu](https://img.shields.io/website.svg?label=hupu&url=https://newapi.wouqian.cn/hupu&cacheSeconds=7200)                               |
| 爱范儿           | 快讯         | ifanr          | ![https://newapi.wouqian.cn/ifanr](https://img.shields.io/website.svg?label=ifanr&url=https://newapi.wouqian.cn/ifanr&cacheSeconds=7200)                            |
| 英雄联盟         | 更新公告     | lol            | ![https://newapi.wouqian.cn/lol](https://img.shields.io/website.svg?label=lol&url=https://newapi.wouqian.cn/lol&cacheSeconds=7200)                                  |
| 米游社           | 最新消息     | miyoushe       | ![https://newapi.wouqian.cn/miyoushe](https://img.shields.io/website.svg?label=miyoushe&url=https://newapi.wouqian.cn/miyoushe&cacheSeconds=7200)                   |
| 原神             | 最新消息     | genshin        | ![https://newapi.wouqian.cn/genshin](https://img.shields.io/website.svg?label=genshin&url=https://newapi.wouqian.cn/genshin&cacheSeconds=7200)                      |
| 崩坏3            | 最新动态     | honkai         | ![https://newapi.wouqian.cn/honkai](https://img.shields.io/website.svg?label=honkai&url=https://newapi.wouqian.cn/honkai&cacheSeconds=7200)                         |
| 崩坏：星穹铁道   | 最新动态     | starrail       | ![https://newapi.wouqian.cn/starrail](https://img.shields.io/website.svg?label=starrail&url=https://newapi.wouqian.cn/starrail&cacheSeconds=7200)                   |
| 微信读书         | 飙升榜       | weread         | ![https://newapi.wouqian.cn/weread](https://img.shields.io/website.svg?label=weread&url=https://newapi.wouqian.cn/weread&cacheSeconds=7200)                         |
| NGA              | 热帖         | ngabbs         | ![https://newapi.wouqian.cn/ngabbs](https://img.shields.io/website.svg?label=ngabbs&url=https://newapi.wouqian.cn/ngabbs&cacheSeconds=7200)                         |
| V2EX             | 主题榜       | v2ex           | ![https://newapi.wouqian.cn/v2ex](https://img.shields.io/website.svg?label=v2ex&url=https://newapi.wouqian.cn/v2ex&cacheSeconds=7200)                               |
| HelloGitHub      | Trending     | hellogithub    | ![https://newapi.wouqian.cn/hellogithub](https://img.shields.io/website.svg?label=hellogithub&url=https://newapi.wouqian.cn/hellogithub&cacheSeconds=7200)          |
| 中央气象台       | 全国气象预警 | weatheralarm   | ![https://newapi.wouqian.cn/weatheralarm](https://img.shields.io/website.svg?label=weatheralarm&url=https://newapi.wouqian.cn/weatheralarm&cacheSeconds=7200)       |
| 中国地震台       | 地震速报     | earthquake     | ![https://newapi.wouqian.cn/earthquake](https://img.shields.io/website.svg?label=earthquake&url=https://newapi.wouqian.cn/earthquake&cacheSeconds=7200)             |
| 历史上的今天     | 月-日        | history        | ![https://newapi.wouqian.cn/history](https://img.shields.io/website.svg?label=history&url=https://newapi.wouqian.cn/history&cacheSeconds=7200)                      |

</details>

## ⚙️ 使用

### 🔐 API 鉴权

**默认所有 API 接口需要 Token 验证**（`/health` 和 `/all` 除外）

**传递 Token**:

```bash
# 方式 1: URL 参数（推荐）
curl "http://localhost:6688/baidu?token=YOUR_API_TOKEN"

# 方式 2: HTTP Header
curl -H "Authorization: Bearer YOUR_API_TOKEN" "http://localhost:6688/baidu"
```

**配置 Token**:

```bash
# .env.local（本地配置，禁止提交）
API_TOKEN=your-secret-token-here

# .env.development（开发配置，可提交占位符）
API_TOKEN=<YOUR_API_TOKEN>
```

**错误响应**:

```json
{
  "code": 401,
  "message": "Unauthorized: Invalid or missing token"
}
```

---

### 开发环境

**本地开发（推荐）**:

```bash
# 使用 .env.local 本地配置启动（实时重载）
npm run dev:local

# 使用 .env.local 本地配置启动（带缓存）
npm run dev:cache:local
```

**开发环境测试**:

```bash
# 使用 .env.development 开发配置启动
npm run dev

# 使用 .env.development 开发配置启动（带缓存）
npm run dev:cache
```

**生产环境**:

```bash
# 编译项目
npm run build

# 启动服务（使用 .env.development 配置）
npm run start

# 启动服务（使用 .env.local 配置）
npm run start:local
```

**环境配置说明**:

- `.env.local` - 本地个人配置（真实 Token，**禁止提交**）
- `.env.development` - 开发环境配置（占位符，**可提交**）
- 详见 [开发指南](./docs/DEVELOPMENT.md)

---

本项目支持 `Node.js` 调用，可在安装完成后调用 `serveHotApi` 来开启服务器

> 该方式无法使用部分需要 Puppeteer 环境的接口

```bash
pnpm add dailyhot-api
```

```js
import serveHotApi from "dailyhot-api";

/**
 * 启动服务器
 * @param {Number} [port] - 端口号
 * @returns {Promise<void>}
 */
serveHotApi(3000);
```

## ⚙️ 部署

本项目支持多种部署方式，可根据需求选择：

### Cloudflare Workers 部署（推荐）

本项目已适配 Cloudflare Workers 运行环境，支持边缘部署：

**优势**：
- 全球边缘节点，低延迟响应
- 内置 KV 缓存，减少源站请求
- 免费额度充足，适合中小规模使用

**部署步骤**：

1. 安装 Wrangler CLI：
```bash
npm install -g wrangler
```

2. 登录 Cloudflare：
```bash
wrangler login
```

3. 配置环境变量（在 Cloudflare Dashboard 或通过 wrangler secret）：
```bash
wrangler secret put API_TOKEN
wrangler secret put CLOUDFLARE_API_TOKEN
wrangler secret put CLOUDFLARE_ACCOUNT_ID
wrangler secret put KV_NAMESPACE_ID
```

4. 部署：
```bash
npm run workers:deploy
```

**GitHub Actions 自动部署**：

项目已配置 `.github/workflows/deploy-cloudflare.yml`，推送到 `main` 分支会自动触发部署。

**所需 Secrets**：
- `CLOUDFLARE_API_TOKEN` - Cloudflare API Token
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare 账户 ID
- `KV_NAMESPACE_ID` - KV 命名空间 ID
- `API_TOKEN` - API 访问令牌

---

### GitHub Actions 部署

本项目支持通过 GitHub Actions 进行自动化部署和定时推送：

**1. 钉钉新闻推送**

每天早上 8:00（北京时间）自动推送热门新闻到钉钉群：

**配置步骤**：
1. 创建钉钉自定义机器人，获取 Webhook URL 和 Secret
2. 在 GitHub 仓库 Settings → Secrets 中配置：
   - `DINGTALK_WEBHOOK_URL` - 钉钉机器人 Webhook 地址
   - `DINGTALK_SECRET` - 钉钉机器人密钥（可选）
   - `API_TOKEN` - API 访问令牌
   - `API_BASE_URL` - API 服务地址
   - `DEFAULT_IMAGE_URL` - 默认图片地址
   - `PLATFORMS` - 平台列表（逗号分隔，如 `baidu,weibo,zhihu`）

**推送架构**：
- Workflow 层：负责调度和环境管理
- 脚本层：负责业务逻辑（数据获取、格式转换、消息推送）

详见 [新闻推送工作流程文档](./docs/NEWS_PUSH_WORKFLOW.md)。

---

### 手动部署

最直接的方式，适合自有服务器部署：

**安装**：
```bash
git clone https://github.com/tnnevol/DailyHotApi.git
cd DailyHotApi
pnpm install
```

**配置**：
```bash
# 复制配置文件
cp .env.example .env.local
# 编辑 .env.local 填入真实配置
```

**开发模式**：
```bash
pnpm run dev:local
```

**生产模式**：
```bash
pnpm run build
pnpm run start:local
```

**PM2 守护进程**：
```bash
npm i pm2 -g
pm2 start dist/index.js --name dailyhot-api
```

---

### 环境变量清单

| 变量名 | 说明 | 必需 | 默认值 |
|--------|------|------|--------|
| `API_TOKEN` | API 访问令牌 | ✅ | - |
| `API_BASE_URL` | API 服务地址 | ✅ | - |
| `DEFAULT_IMAGE_URL` | 默认图片地址 | ✅ | - |
| `DINGTALK_WEBHOOK_URL` | 钉钉机器人 Webhook | ✅ | - |
| `DINGTALK_SECRET` | 钉钉机器人密钥 | ❌ | - |
| `PLATFORMS` | 推送平台列表 | ✅ | - |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API Token | Workers | - |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账户 ID | Workers | - |
| `KV_NAMESPACE_ID` | KV 命名空间 ID | Workers | - |
| `ALLOWED_DOMAIN` | CORS 允许域名 | ❌ | `*` |
| `ALLOWED_HOST` | 允许的主机 | ❌ | `tnnevol.cn` |

## ⚠️ 须知

- 本项目为了避免频繁请求官方数据，默认对数据做了缓存处理，默认为 `60` 分钟，如需更改，请自行修改配置
- 本项目部分接口使用了 **页面爬虫**，若违反对应页面的相关规则，请 **及时通知我去除该接口**

## 📢 免责声明

- 本项目提供的 `API` 仅供开发者进行技术研究和开发测试使用。使用该 `API` 获取的信息仅供参考，不代表本项目对信息的准确性、可靠性、合法性、完整性作出任何承诺或保证。本项目不对任何因使用该 `API` 获取信息而导致的任何直接或间接损失负责。本项目保留随时更改 `API` 接口地址、接口协议、接口参数及其他相关内容的权利。本项目对使用者使用 `API` 的行为不承担任何直接或间接的法律责任
- 本项目并未与相关信息提供方建立任何关联或合作关系，获取的信息均来自公开渠道，如因使用该 `API` 获取信息而产生的任何法律责任，由使用者自行承担
- 本项目对使用 `API` 获取的信息进行了最大限度的筛选和整理，但不保证信息的准确性和完整性。使用 `API` 获取信息时，请务必自行核实信息的真实性和可靠性，谨慎处理相关事项
- 本项目保留对 `API` 的随时更改、停用、限制使用等措施的权利。任何因使用本 `API` 产生的损失，本项目不负担任何赔偿和责任

## 😘 鸣谢

特此感谢为本项目提供支持与灵感的项目

- [RSSHub](https://github.com/DIYgod/RSSHub)

## ⭐ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=tnnevol/DailyHotApi&type=Date)](https://star-history.com/#tnnevol/DailyHotApi&Date)
