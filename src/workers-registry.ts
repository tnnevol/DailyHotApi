/**
 * Workers 路由注册（全平台）
 * 动态注册所有平台路由，支持 KV 缓存
 * 
 * 配置读取说明：
 * - Workers 环境：通过 Hono Bindings 类型支持 env 注入
 * - 环境变量来源：wrangler.toml [vars] 或 wrangler secret put
 * - CORS 配置使用默认值，API_TOKEN 通过 authMiddleware 从 c.env 读取
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import { trimTrailingSlash } from 'hono/trailing-slash';
import { authMiddleware } from './middleware/auth.js';
import { getAllPlatformNames, createRouteHandler } from './utils/workers-route-helper.js';
import type { KVNamespace } from '@cloudflare/workers-types';

// Workers 环境变量类型定义
export type WorkersEnv = {
  ALLOWED_DOMAIN?: string;
  ALLOWED_HOST?: string;
  API_TOKEN?: string;
  CACHE_KV?: KVNamespace;
};

const registry = new Hono<{ Bindings: WorkersEnv }>();

// prettyJSON
registry.use(prettyJSON());

// 尾部斜杠重定向
registry.use(trimTrailingSlash());

// CORS 配置
registry.use(
  '*',
  cors({
    origin: (origin) => {
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
registry.get('/health', (c) => c.json({ status: 'healthy', version: '2.1.0-workers' }));

// 获取所有平台列表
const allPlatforms = getAllPlatformNames();

registry.get('/all', (c) => c.json({ 
  code: 200, 
  count: allPlatforms.length, 
  routes: allPlatforms 
}));

// 全局应用 Token 鉴权中间件
registry.use('/health', async (c, next) => await next());
registry.use('/all', async (c, next) => await next());
registry.use('/*', authMiddleware);

// 动态注册所有平台路由
allPlatforms.forEach((platform) => {
  registry.get(`/${platform}`, async (c) => {
    const noCache = c.req.query('cache') === 'false';
    
    try {
      const listData = await createRouteHandler(platform, c, noCache, c.env.CACHE_KV);
      return c.json({ code: 200, ...listData });
    } catch (error: any) {
      return c.json({ 
        code: 500, 
        message: `${platform} 接口错误: ${error.message || '未知错误'}` 
      }, 500);
    }
  });
});

// 请求方式错误
registry.all('*', (c) => c.json({ code: 405, message: 'Method Not Allowed' }, 405));

export default registry;