/**
 * Cloudflare Workers 专用应用入口
 * 使用静态路由注册，移除 Node.js 专用依赖
 * 
 * 环境变量说明：
 * - 通过 Hono Bindings 类型支持 env 注入
 * - env 来源：wrangler.toml [vars] 或 wrangler secret put
 * - 需要配置的环境变量：API_TOKEN, ALLOWED_DOMAIN, ALLOWED_HOST
 */

import { Hono } from 'hono';
import registry, { type WorkersEnv } from './workers-registry.js';

// 创建带 Bindings 类型的 Hono 应用
const app = new Hono<{ Bindings: WorkersEnv }>();

// 主路由
app.route('/', registry);

// 错误处理
app.onError((err, c) => {
  console.error(`❌ [ERROR] ${err?.message}`);
  return c.json({ 
    code: 500, 
    message: err?.message || 'Internal Server Error' 
  }, 500);
});

// 404 处理
app.notFound((c) => {
  return c.json({ 
    code: 404, 
    message: 'Not Found' 
  }, 404);
});

export default app;
