import type { Context, Next } from "hono";
import type { WorkersEnv } from "../workers-registry.js";

/**
 * Token 验证中间件
 * 验证 URL 参数中的 token 是否匹配环境变量 API_TOKEN
 * 
 * 环境变量读取优先级：
 * 1. Workers c.env.API_TOKEN (通过 wrangler.toml vars 或 wrangler secret 注入)
 * 2. Node.js process.env.API_TOKEN (仅本地 Node.js 环境)
 */
export const authMiddleware = async (c: Context<{ Bindings: WorkersEnv }>, next: Next) => {
  // 尝试从多种来源获取 API_TOKEN
  // 1. Workers env 参数 (c.env) - 标准方式
  // 2. Node.js process.env (仅本地开发)
  const API_TOKEN = c.env?.API_TOKEN || (typeof process !== 'undefined' && process.env?.API_TOKEN);

  // 如果没有配置 API_TOKEN，跳过验证
  if (!API_TOKEN) {
    console.warn("⚠️ API_TOKEN 未配置，跳过权限验证");
    return await next();
  }

  // 从 URL 参数获取 token
  const token = c.req.query("token");

  // 验证 token
  if (!token || token !== API_TOKEN) {
    console.warn(`❌ 无效 token 请求：${c.req.path} (token: ${token || "missing"})`);
    return c.json(
      {
        code: 401,
        message: "Unauthorized: Invalid or missing token",
      },
      401,
    );
  }

  console.debug(`✅ Token 验证通过：${c.req.path}`);
  return await next();
};
