/**
 * 试点路由注册（静态注册）
 * 仅注册 baidu / weibo / zhihu 三个接口用于 Cloudflare Workers 验证
 * 
 * 配置读取说明：
 * - Workers 环境：通过 Hono Bindings 类型支持 env 注入
 * - 环境变量来源：wrangler.toml [vars] 或 wrangler secret put
 * - 当前试点阶段：CORS 配置使用默认值，API_TOKEN 通过 authMiddleware 从 c.env 读取
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import { trimTrailingSlash } from 'hono/trailing-slash';
import { authMiddleware } from './middleware/auth.js';
import { handleRoute as baiduRoute } from './routes/baidu.js';
import { handleRoute as weiboRoute } from './routes/weibo.js';
import { handleRoute as zhihuRoute } from './routes/zhihu.js';
import { getCache, setCache } from './adapters/workers-kv-cache.js';
import type { KVNamespace } from '@cloudflare/workers-types';

// Workers 环境变量类型定义
export type WorkersEnv = {
  ALLOWED_DOMAIN?: string;
  ALLOWED_HOST?: string;
  API_TOKEN?: string;
  CACHE_KV?: KVNamespace;
};

const registry = new Hono<{ Bindings: WorkersEnv }>();

// 压缩响应 - 临时禁用，wrangler dev 压缩响应有兼容性问题
// 生产环境部署时再启用
// registry.use(compress());

// prettyJSON
registry.use(prettyJSON());

// 尾部斜杠重定向
registry.use(trimTrailingSlash());

// Token 验证中间件（仅对 /api 路由生效）
registry.use('/api/*', authMiddleware);

// CORS - 试点阶段使用默认配置
// 后续可通过 c.env.ALLOWED_DOMAIN / c.env.ALLOWED_HOST 从 wrangler.toml 注入
registry.use(
  '*',
  cors({
    origin: (origin) => {
      // 试点阶段：使用默认值
      // 完整实现：const ALLOWED_DOMAIN = c.env.ALLOWED_DOMAIN || '*'
      const ALLOWED_DOMAIN = '*';
      const ALLOWED_HOST = 'tnnevol.cn';
      const isSame = ALLOWED_HOST && origin.endsWith(ALLOWED_HOST);
      return isSame ? origin : ALLOWED_DOMAIN;
    },
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    credentials: true,
  })
);

// 公开接口（无需鉴权）
registry.get('/health', (c) => c.json({ status: 'healthy', version: '2.0.8-workers-pilot' }));
registry.get('/all', (c) => c.json({ 
  code: 200, 
  count: 3, 
  routes: ['baidu', 'weibo', 'zhihu'] 
}));

// 全局应用 Token 鉴权中间件（仅保护 API 路由）
registry.use('/health', async (c, next) => await next());
registry.use('/all', async (c, next) => await next());
registry.use('/*', authMiddleware);

// 注册试点路由
registry.get('/baidu', async (c) => {
  const noCache = c.req.query('cache') === 'false';
  const limit = c.req.query('limit');
  const rssEnabled = c.req.query('rss') === 'true';
  
  // 使用 KV 缓存
  const cacheKey = `baidu_data_${noCache ? 'nocache' : 'cached'}`;
  let listData;
  
  if (!noCache) {
    // 尝试从缓存获取
    listData = await getCache(cacheKey, c.env.CACHE_KV);
  }
  
  if (!listData) {
    // 缓存未命中，获取新数据
    listData = await baiduRoute(c, noCache);
    
    // 存入缓存（缓存1小时）
    if (!noCache) {
      await setCache(cacheKey, listData, 3600, c.env.CACHE_KV);
    }
  }
  
  if (limit && listData?.data?.length > parseInt(limit)) {
    listData.total = parseInt(limit);
    listData.data = listData.data.slice(0, parseInt(limit));
  }
  
  return c.json({ code: 200, ...listData });
});

registry.get('/weibo', async (c) => {
  const noCache = c.req.query('cache') === 'false';
  const limit = c.req.query('limit');
  const rssEnabled = c.req.query('rss') === 'true';
  
  // 使用 KV 缓存
  const cacheKey = `weibo_data_${noCache ? 'nocache' : 'cached'}`;
  let listData;
  
  if (!noCache) {
    // 尝试从缓存获取
    listData = await getCache(cacheKey, c.env.CACHE_KV);
  }
  
  if (!listData) {
    // 缓存未命中，获取新数据
    listData = await weiboRoute(c, noCache);
    
    // 存入缓存（缓存1小时）
    if (!noCache) {
      await setCache(cacheKey, listData, 3600, c.env.CACHE_KV);
    }
  }
  
  if (limit && listData?.data?.length > parseInt(limit)) {
    listData.total = parseInt(limit);
    listData.data = listData.data.slice(0, parseInt(limit));
  }
  
  return c.json({ code: 200, ...listData });
});

registry.get('/zhihu', async (c) => {
  const noCache = c.req.query('cache') === 'false';
  const limit = c.req.query('limit');
  const rssEnabled = c.req.query('rss') === 'true';
  
  // 使用 KV 缓存
  const cacheKey = `zhihu_data_${noCache ? 'nocache' : 'cached'}`;
  let listData;
  
  if (!noCache) {
    // 尝试从缓存获取
    listData = await getCache(cacheKey, c.env.CACHE_KV);
  }
  
  if (!listData) {
    // 缓存未命中，获取新数据
    listData = await zhihuRoute(c, noCache);
    
    // 存入缓存（缓存1小时）
    if (!noCache) {
      await setCache(cacheKey, listData, 3600, c.env.CACHE_KV);
    }
  }
  
  if (limit && listData?.data?.length > parseInt(limit)) {
    listData.total = parseInt(limit);
    listData.data = listData.data.slice(0, parseInt(limit));
  }
  
  return c.json({ code: 200, ...listData });
});

// 请求方式错误
registry.all('*', (c) => c.json({ code: 405, message: 'Method Not Allowed' }, 405));

export default registry;
