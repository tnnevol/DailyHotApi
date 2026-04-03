/**
 * Workers 路由静态注册
 * 
 * 由于 Cloudflare Workers 不支持 import.meta.glob，
 * 使用静态导入方式注册所有平台路由
 */

// 导出所有平台路由
export { handleRoute as baidu } from './routes/baidu.js';
export { handleRoute as weibo } from './routes/weibo.js';
export { handleRoute as zhihu } from './routes/zhihu.js';
export { handleRoute as douyin } from './routes/douyin.js';
export { handleRoute as bilibili } from './routes/bilibili.js';
export { handleRoute as kuaishou } from './routes/kuaishou.js';
export { handleRoute as toutiao } from './routes/toutiao.js';
export { handleRoute as tieba } from './routes/tieba.js';
export { handleRoute as zhihuDaily } from './routes/zhihu-daily.js';

// 技术平台
export { handleRoute as github } from './routes/github.js';
export { handleRoute as githubTrending } from './routes/github-trending.js';
export { handleRoute as hackernews } from './routes/hackernews.js';
export { handleRoute as stackoverflow } from './routes/stackoverflow.js';
export { handleRoute as v2ex } from './routes/v2ex.js';
export { handleRoute as juejin } from './routes/juejin.js';
export { handleRoute as csdn } from './routes/csdn.js';
export { handleRoute as poJie } from './routes/52pojie.js';
export { handleRoute as linuxdo } from './routes/linuxdo.js';
export { handleRoute as nodeseek } from './routes/nodeseek.js';
export { handleRoute as hellogithub } from './routes/hellogithub.js';

// 资讯平台
export { handleRoute as kr36 } from './routes/36kr.js';
export { handleRoute as huxiu } from './routes/huxiu.js';
export { handleRoute as ifanr } from './routes/ifanr.js';
export { handleRoute as geekpark } from './routes/geekpark.js';
export { handleRoute as sspai } from './routes/sspai.js';
export { handleRoute as ithome } from './routes/ithome.js';
export { handleRoute as ithomeXijiayi } from './routes/ithome-xijiayi.js';
export { handleRoute as thepaper } from './routes/thepaper.js';
export { handleRoute as tencent } from './routes/tencent.js';
export { handleRoute as qqNews } from './routes/qq-news.js';
export { handleRoute as sina } from './routes/sina.js';
export { handleRoute as sinaNews } from './routes/sina-news.js';
export { handleRoute as sinaFinance } from './routes/sina-finance.js';
export { handleRoute as neteaseNews } from './routes/netease-news.js';
export { handleRoute as nytimes } from './routes/nytimes.js';
export { handleRoute as cls } from './routes/cls.js';
export { handleRoute as eastmoney } from './routes/eastmoney.js';
export { handleRoute as xueqiu } from './routes/xueqiu.js';

// 生活娱乐平台
export { handleRoute as douban } from './routes/douban.js';
export { handleRoute as doubanMovie } from './routes/douban-movie.js';
export { handleRoute as doubanGroup } from './routes/douban-group.js';
export { handleRoute as hupu } from './routes/hupu.js';
export { handleRoute as coolapk } from './routes/coolapk.js';
export { handleRoute as acfun } from './routes/acfun.js';
export { handleRoute as lol } from './routes/lol.js';
export { handleRoute as miyoushe } from './routes/miyoushe.js';
export { handleRoute as genshin } from './routes/genshin.js';
export { handleRoute as starrail } from './routes/starrail.js';
export { handleRoute as honkai } from './routes/honkai.js';
export { handleRoute as weixin } from './routes/weixin.js';
export { handleRoute as weread } from './routes/weread.js';
export { handleRoute as jianshu } from './routes/jianshu.js';
export { handleRoute as guokr } from './routes/guokr.js';
export { handleRoute as smzdm } from './routes/smzdm.js';
export { handleRoute as dgtle } from './routes/dgtle.js';
export { handleRoute as gameres } from './routes/gameres.js';
export { handleRoute as yystv } from './routes/yystv.js';
export { handleRoute as ngabbs } from './routes/ngabbs.js';
export { handleRoute as newsmth } from './routes/newsmth.js';
export { handleRoute as hostloc } from './routes/hostloc.js';
export { handleRoute as producthunt } from './routes/producthunt.js';
export { handleRoute as ct51 } from './routes/51cto.js';

// 特殊平台
export { handleRoute as weatheralarm } from './routes/weatheralarm.js';
export { handleRoute as earthquake } from './routes/earthquake.js';
export { handleRoute as history } from './routes/history.js';

// 平台名称列表
export const platformNames = [
  'baidu', 'weibo', 'zhihu', 'douyin', 'bilibili', 'kuaishou', 'toutiao', 'tieba', 'zhihu-daily',
  'github', 'github-trending', 'hackernews', 'stackoverflow', 'v2ex', 'juejin', 'csdn', '52pojie', 'linuxdo', 'nodeseek', 'hellogithub',
  '36kr', 'huxiu', 'ifanr', 'geekpark', 'sspai', 'ithome', 'ithome-xijiayi', 'thepaper', 'tencent', 'qq-news', 'sina', 'sina-news', 'sina-finance', 'netease-news', 'nytimes', 'cls', 'eastmoney', 'xueqiu',
  'douban', 'douban-movie', 'douban-group', 'hupu', 'coolapk', 'acfun', 'lol', 'miyoushe', 'genshin', 'starrail', 'honkai', 'weixin', 'weread', 'jianshu', 'guokr', 'smzdm', 'dgtle', 'gameres', 'yystv', 'ngabbs', 'newsmth', 'hostloc', 'producthunt', '51cto',
  'weatheralarm', 'earthquake', 'history'
] as const;

export type PlatformName = typeof platformNames[number];