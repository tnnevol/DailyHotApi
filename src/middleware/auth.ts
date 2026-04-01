import type { Context, Next } from "hono";
import logger from "../utils/logger.js";

/**
 * Token 验证中间件
 * 验证 URL 参数中的 token 是否匹配环境变量 API_TOKEN
 */
export const authMiddleware = async (c: Context, next: Next) => {
  // 从 process.env 读取 API_TOKEN（dotenv 已加载）
  const API_TOKEN = process.env.API_TOKEN;

  // 如果没有配置 API_TOKEN，跳过验证
  if (!API_TOKEN) {
    logger.warn("⚠️ API_TOKEN 未配置，跳过权限验证");
    return await next();
  }

  // 从 URL 参数获取 token
  const token = c.req.query("token");

  // 验证 token
  if (!token || token !== API_TOKEN) {
    logger.warn(`❌ 无效 token 请求：${c.req.path} (token: ${token || "missing"})`);
    return c.json(
      {
        code: 401,
        message: "Unauthorized: Invalid or missing token",
      },
      401
    );
  }

  logger.debug(`✅ Token 验证通过：${c.req.path}`);
  return await next();
};
