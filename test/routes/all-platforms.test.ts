import { createPlatformTests } from '../utils/platform-test';

/**
 * DailyHotApi 全平台测试
 * 
 * 测试命令：
 * - pnpm test:run          运行所有测试
 * - pnpm test:run -- --grep "baidu"  只测试 baidu
 * - pnpm test:run -- --grep "weibo|zhihu"  测试多个平台
 * 
 * 测试环境：dev:local (.env.local)
 */

// ============ 热门平台 (P0) ============
createPlatformTests('baidu');
createPlatformTests('weibo');
createPlatformTests('zhihu');
createPlatformTests('douyin');
createPlatformTests('bilibili');
createPlatformTests('kuaishou');
createPlatformTests('toutiao');
createPlatformTests('tieba');

// ============ 技术平台 (P1) ============
createPlatformTests('github');
createPlatformTests('github-trending');
createPlatformTests('hackernews');
createPlatformTests('stackoverflow');
createPlatformTests('v2ex');
createPlatformTests('juejin');
createPlatformTests('csdn');
createPlatformTests('52pojie');
createPlatformTests('linuxdo');
createPlatformTests('nodeseek');
createPlatformTests('hellogithub');

// ============ 资讯平台 (P1) ============
createPlatformTests('36kr');
createPlatformTests('huxiu');
createPlatformTests('ifanr');
createPlatformTests('geekpark');
createPlatformTests('sspai');
createPlatformTests('ithome');
createPlatformTests('ithome-xijiayi');
createPlatformTests('thepaper');
createPlatformTests('tencent');
createPlatformTests('qq-news');
createPlatformTests('sina');
createPlatformTests('sina-news');
createPlatformTests('sina-finance');
createPlatformTests('netease-news');
createPlatformTests('nytimes');
createPlatformTests('cls');
createPlatformTests('eastmoney');
createPlatformTests('xueqiu');

// ============ 生活娱乐平台 (P1) ============
createPlatformTests('douban', { requireData: false });
createPlatformTests('douban-movie');
createPlatformTests('douban-group');
createPlatformTests('hupu');
createPlatformTests('coolapk');
createPlatformTests('acfun');
createPlatformTests('lol');
createPlatformTests('miyoushe');
createPlatformTests('genshin');
createPlatformTests('starrail');
createPlatformTests('honkai');
createPlatformTests('weixin');
createPlatformTests('weread');
createPlatformTests('jianshu');
createPlatformTests('guokr');
createPlatformTests('smzdm');
createPlatformTests('dgtle');
createPlatformTests('gameres');
createPlatformTests('yystv');
createPlatformTests('ngabbs');
createPlatformTests('newsmth');
createPlatformTests('hostloc');
createPlatformTests('producthunt');
createPlatformTests('51cto');

// ============ 特殊平台 (P2) ============
createPlatformTests('weatheralarm', { requireData: false });
createPlatformTests('earthquake', { requireData: false });
createPlatformTests('history', { requireData: false });
createPlatformTests('zhihu-daily', { requireData: false });