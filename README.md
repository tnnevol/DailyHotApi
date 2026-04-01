<div align="center">
<img alt="logo" height="120" src="./public/favicon.png" width="120"/>
<h2>今日热榜</h2>
<p>一个聚合热门数据的 API 接口</p>
<br />
<img src="https://img.shields.io/github/last-commit/tnnevol/DailyHotApi" alt="last commit"/>
 <img src="https://img.shields.io/github/languages/code-size/tnnevol/DailyHotApi" alt="code size"/>
<img src="https://github.com/tnnevol/DailyHotApi/actions/workflows/docker.yml/badge.svg" alt="Publish Docker image"/>
<img src="https://github.com/tnnevol/DailyHotApi/actions/workflows/npm.yml/badge.svg" alt="Publish npm package"/>
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

- [今日热榜 - https://newsapi.tnnevol.cn](https://newsapi.tnnevol.cn)

## 📊 接口总览

<details>
<summary>查看全部接口</summary>

> 示例站点运行于海外服务器，部分国内站点可能存在访问异常，请以实际情况为准

| **站点**         | **类别**     | **调用名称**   | **状态**                                                                                                                                                              |
| ---------------- | ------------ | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 哔哩哔哩         | 热门榜       | bilibili       | ![https://newsapi.tnnevol.cn/bilibili](https://img.shields.io/website.svg?label=bilibili&url=https://newsapi.tnnevol.cn/bilibili&cacheSeconds=7200)                   |
| AcFun            | 排行榜       | acfun          | ![https://newsapi.tnnevol.cn/acfun](https://img.shields.io/website.svg?label=acfun&url=https://newsapi.tnnevol.cn/acfun&cacheSeconds=7200)                            |
| 微博             | 热搜榜       | weibo          | ![https://newsapi.tnnevol.cn/weibo](https://img.shields.io/website.svg?label=weibo&url=https://newsapi.tnnevol.cn/weibo&cacheSeconds=7200)                            |
| 知乎             | 热榜         | zhihu          | ![https://newsapi.tnnevol.cn/zhihu](https://img.shields.io/website.svg?label=zhihu&url=https://newsapi.tnnevol.cn/zhihu&cacheSeconds=7200)                            |
| 知乎日报         | 推荐榜       | zhihu-daily    | ![https://newsapi.tnnevol.cn/zhihu-daily](https://img.shields.io/website.svg?label=zhihu-daily&url=https://newsapi.tnnevol.cn/zhihu-daily&cacheSeconds=7200)          |
| 百度             | 热搜榜       | baidu          | ![https://newsapi.tnnevol.cn/baidu](https://img.shields.io/website.svg?label=baidu&url=https://newsapi.tnnevol.cn/baidu&cacheSeconds=7200)                            |
| 抖音             | 热点榜       | douyin         | ![https://newsapi.tnnevol.cn/douyin](https://img.shields.io/website.svg?label=douyin&url=https://newsapi.tnnevol.cn/douyin&cacheSeconds=7200)                         |
| 快手             | 热点榜       | kuaishou       | ![https://newsapi.tnnevol.cn/kuaishou](https://img.shields.io/website.svg?label=kuaishou&url=https://newsapi.tnnevol.cn/kuaishou&cacheSeconds=7200)                   |
| 豆瓣电影         | 新片榜       | douban-movie   | ![https://newsapi.tnnevol.cn/douban-movie](https://img.shields.io/website.svg?label=douban-movie&url=https://newsapi.tnnevol.cn/douban-movie&cacheSeconds=7200)       |
| 豆瓣讨论小组     | 讨论精选     | douban-group   | ![https://newsapi.tnnevol.cn/douban-group](https://img.shields.io/website.svg?label=douban-group&url=https://newsapi.tnnevol.cn/douban-group&cacheSeconds=7200)       |
| 百度贴吧         | 热议榜       | tieba          | ![https://newsapi.tnnevol.cn/tieba](https://img.shields.io/website.svg?label=tieba&url=https://newsapi.tnnevol.cn/tieba&cacheSeconds=7200)                            |
| 少数派           | 热榜         | sspai          | ![https://newsapi.tnnevol.cn/sspai](https://img.shields.io/website.svg?label=sspai&url=https://newsapi.tnnevol.cn/sspai&cacheSeconds=7200)                            |
| IT之家           | 热榜         | ithome         | ![https://newsapi.tnnevol.cn/ithome](https://img.shields.io/website.svg?label=ithome&url=https://newsapi.tnnevol.cn/ithome&cacheSeconds=7200)                         |
| IT之家「喜加一」 | 最新动态     | ithome-xijiayi | ![https://newsapi.tnnevol.cn/ithome-xijiayi](https://img.shields.io/website.svg?label=ithome-xijiayi&url=https://newsapi.tnnevol.cn/ithome-xijiayi&cacheSeconds=7200) |
| 简书             | 热门推荐     | jianshu        | ![https://newsapi.tnnevol.cn/jianshu](https://img.shields.io/website.svg?label=jianshu&url=https://newsapi.tnnevol.cn/jianshu&cacheSeconds=7200)                      |
| 果壳             | 热门文章     | guokr          | ![https://newsapi.tnnevol.cn/guokr](https://img.shields.io/website.svg?label=guokr&url=https://newsapi.tnnevol.cn/guokr&cacheSeconds=7200)                            |
| 澎湃新闻         | 热榜         | thepaper       | ![https://newsapi.tnnevol.cn/thepaper](https://img.shields.io/website.svg?label=thepaper&url=https://newsapi.tnnevol.cn/thepaper&cacheSeconds=7200)                   |
| 今日头条         | 热榜         | toutiao        | ![https://newsapi.tnnevol.cn/toutiao](https://img.shields.io/website.svg?label=toutiao&url=https://newsapi.tnnevol.cn/toutiao&cacheSeconds=7200)                      |
| 36 氪            | 热榜         | 36kr           | ![https://newsapi.tnnevol.cn/36kr](https://img.shields.io/website.svg?label=36kr&url=https://newsapi.tnnevol.cn/36kr&cacheSeconds=7200)                               |
| 51CTO            | 推荐榜       | 51cto          | ![https://newsapi.tnnevol.cn/51cto](https://img.shields.io/website.svg?label=51cto&url=https://newsapi.tnnevol.cn/51cto&cacheSeconds=7200)                            |
| CSDN             | 排行榜       | csdn           | ![https://newsapi.tnnevol.cn/csdn](https://img.shields.io/website.svg?label=csdn&url=https://newsapi.tnnevol.cn/csdn&cacheSeconds=7200)                               |
| NodeSeek         | 最新动态     | nodeseek       | ![https://newsapi.tnnevol.cn/nodeseek](https://img.shields.io/website.svg?label=nodeseek&url=https://newsapi.tnnevol.cn/nodeseek&cacheSeconds=7200)                   |
| 稀土掘金         | 热榜         | juejin         | ![https://newsapi.tnnevol.cn/juejin](https://img.shields.io/website.svg?label=juejin&url=https://newsapi.tnnevol.cn/juejin&cacheSeconds=7200)                         |
| 腾讯新闻         | 热点榜       | qq-news        | ![https://newsapi.tnnevol.cn/qq-news](https://img.shields.io/website.svg?label=qq-news&url=https://newsapi.tnnevol.cn/qq-news&cacheSeconds=7200)                      |
| 新浪网           | 热榜         | sina           | ![https://newsapi.tnnevol.cn/sina](https://img.shields.io/website.svg?label=sina&url=https://newsapi.tnnevol.cn/sina&cacheSeconds=7200)                               |
| 新浪新闻         | 热点榜       | sina-news      | ![https://newsapi.tnnevol.cn/sina-news](https://img.shields.io/website.svg?label=sina-news&url=https://newsapi.tnnevol.cn/sina-news&cacheSeconds=7200)                |
| 网易新闻         | 热点榜       | netease-news   | ![https://newsapi.tnnevol.cn/netease-news](https://img.shields.io/website.svg?label=netease-news&url=https://newsapi.tnnevol.cn/netease-news&cacheSeconds=7200)       |
| 吾爱破解         | 榜单         | 52pojie        | ![https://newsapi.tnnevol.cn/52pojie](https://img.shields.io/website.svg?label=52pojie&url=https://newsapi.tnnevol.cn/52pojie&cacheSeconds=7200)                      |
| 全球主机交流     | 榜单         | hostloc        | ![https://newsapi.tnnevol.cn/hostloc](https://img.shields.io/website.svg?label=hostloc&url=https://newsapi.tnnevol.cn/hostloc&cacheSeconds=7200)                      |
| 虎嗅             | 24小时       | huxiu          | ![https://newsapi.tnnevol.cn/huxiu](https://img.shields.io/website.svg?label=huxiu&url=https://newsapi.tnnevol.cn/huxiu&cacheSeconds=7200)                            |
| 酷安             | 热榜         | coolapk        | ![https://newsapi.tnnevol.cn/coolapk](https://img.shields.io/website.svg?label=coolapk&url=https://newsapi.tnnevol.cn/coolapk&cacheSeconds=7200)                      |
| 虎扑             | 步行街热帖   | hupu           | ![https://newsapi.tnnevol.cn/hupu](https://img.shields.io/website.svg?label=hupu&url=https://newsapi.tnnevol.cn/hupu&cacheSeconds=7200)                               |
| 爱范儿           | 快讯         | ifanr          | ![https://newsapi.tnnevol.cn/ifanr](https://img.shields.io/website.svg?label=ifanr&url=https://newsapi.tnnevol.cn/ifanr&cacheSeconds=7200)                            |
| 英雄联盟         | 更新公告     | lol            | ![https://newsapi.tnnevol.cn/lol](https://img.shields.io/website.svg?label=lol&url=https://newsapi.tnnevol.cn/lol&cacheSeconds=7200)                                  |
| 米游社           | 最新消息     | miyoushe       | ![https://newsapi.tnnevol.cn/miyoushe](https://img.shields.io/website.svg?label=miyoushe&url=https://newsapi.tnnevol.cn/miyoushe&cacheSeconds=7200)                   |
| 原神             | 最新消息     | genshin        | ![https://newsapi.tnnevol.cn/genshin](https://img.shields.io/website.svg?label=genshin&url=https://newsapi.tnnevol.cn/genshin&cacheSeconds=7200)                      |
| 崩坏3            | 最新动态     | honkai         | ![https://newsapi.tnnevol.cn/honkai](https://img.shields.io/website.svg?label=honkai&url=https://newsapi.tnnevol.cn/honkai&cacheSeconds=7200)                         |
| 崩坏：星穹铁道   | 最新动态     | starrail       | ![https://newsapi.tnnevol.cn/starrail](https://img.shields.io/website.svg?label=starrail&url=https://newsapi.tnnevol.cn/starrail&cacheSeconds=7200)                   |
| 微信读书         | 飙升榜       | weread         | ![https://newsapi.tnnevol.cn/weread](https://img.shields.io/website.svg?label=weread&url=https://newsapi.tnnevol.cn/weread&cacheSeconds=7200)                         |
| NGA              | 热帖         | ngabbs         | ![https://newsapi.tnnevol.cn/ngabbs](https://img.shields.io/website.svg?label=ngabbs&url=https://newsapi.tnnevol.cn/ngabbs&cacheSeconds=7200)                         |
| V2EX             | 主题榜       | v2ex           | ![https://newsapi.tnnevol.cn/v2ex](https://img.shields.io/website.svg?label=v2ex&url=https://newsapi.tnnevol.cn/v2ex&cacheSeconds=7200)                               |
| HelloGitHub      | Trending     | hellogithub    | ![https://newsapi.tnnevol.cn/hellogithub](https://img.shields.io/website.svg?label=hellogithub&url=https://newsapi.tnnevol.cn/hellogithub&cacheSeconds=7200)          |
| 中央气象台       | 全国气象预警 | weatheralarm   | ![https://newsapi.tnnevol.cn/weatheralarm](https://img.shields.io/website.svg?label=weatheralarm&url=https://newsapi.tnnevol.cn/weatheralarm&cacheSeconds=7200)       |
| 中国地震台       | 地震速报     | earthquake     | ![https://newsapi.tnnevol.cn/earthquake](https://img.shields.io/website.svg?label=earthquake&url=https://newsapi.tnnevol.cn/earthquake&cacheSeconds=7200)             |
| 历史上的今天     | 月-日        | history        | ![https://newsapi.tnnevol.cn/history](https://img.shields.io/website.svg?label=history&url=https://newsapi.tnnevol.cn/history&cacheSeconds=7200)                      |

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

具体使用说明可参考 [我的博客](https://halo.tnnevol.cn/posts/2024/0408)，下方仅讲解基础操作：

## 🤖 自动推送

本项目支持自动推送热门新闻到钉丁群：

- **推送方式**: GitHub Actions 定时任务
- **推送内容**: 每日热门新闻排行榜
- **推送格式**: 钉钉 feedCard 类型消息
- **推送时间**: 每天早上 8:00 (北京时间)
- **依赖包**: [@tnnevol/robot-ding](https://www.npmjs.com/package/@tnnevol/robot-ding)

### 配置钉钉推送

1. 创建钉钉自定义机器人
2. 获取 Webhook URL 和 Secret
3. 在 GitHub 仓库的 Secrets 中配置：
   - `DINGTALK_WEBHOOK_URL`: 钉钉机器人 Webhook 地址
   - `DINGTALK_SECRET`: 钉钉机器人密钥（可选）
   - `API_TOKEN`: API 访问令牌

### 工作流程架构

推送工作流程采用合理的业务逻辑分离设计：

- **Workflow 层**：负责调度和环境管理（定时触发、环境变量、平台列表、统计汇总）
- **脚本层**：负责具体业务逻辑（API 数据获取、数据格式转换、钉钉消息构建、推送结果处理、详细日志输出）

**优化方向**：当前架构中 workflow 和脚本层都存在数据获取逻辑，建议将数据获取统一到脚本层，避免重复请求，提高效率。详情请参阅 [新闻推送工作流程文档](./docs/NEWS_PUSH_WORKFLOW.md)。

### Docker 部署

> 安装及配置 Docker 将不在此处说明，请自行解决

#### 本地构建

```bash
# 构建
docker build -t dailyhot-api .

# 运行
docker run --restart always -p 6688:6688 -d dailyhot-api
# 或使用 Docker Compose
docker-compose up -d
```

#### 在线部署

```bash
# 拉取
docker pull tnnevol/DailyHotApi:latest

# 运行
docker run tnnevol/DailyHotApi:latest
```

### 手动部署

最直接的方式，您可以按照以下步骤将 `DailyHotApi` 部署在您的电脑、服务器或者其他任何地方

#### 安装

```bash
git clone https://github.com/tnnevol/DailyHotApi.git
cd DailyHotApi
```

然后再执行安装依赖

```bash
npm install
```

复制 `/.env.example` 文件并重命名为 `/.env` 并修改配置

#### 开发

```bash
npm run dev
```

成功启动后程序会在控制台输出可访问的地址

#### 编译运行

```bash
npm run build
npm run start
```

### pm2 部署

```bash
npm i pm2 -g
sh ./deploy.sh
```

成功启动后程序会在控制台输出可访问的地址

### Vercel 部署

本项目支持通过 `Vercel` 进行一键部署，点击下方按钮或前往 [项目仓库](https://github.com/tnnevol/DailyHotApi-Vercel) 进行手动部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/imsyys-projects/clone?repository-url=https%3A%2F%2Fgithub.com%2Fimsyy%2FDailyHotApi-Vercel)

### Railway 部署

本项目支持使用 [Railway](https://railway.app/) 一键部署，请先将本项目 fork 到您的仓库中，即可使用一键部署。

### Zeabur 部署

本项目支持使用 [Zeabur](https://zeabur.com/) 一键部署，请先将本项目 fork 到您的仓库中，即可使用一键部署。

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
