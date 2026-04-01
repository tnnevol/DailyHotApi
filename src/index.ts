import { serve } from "@hono/node-server";
import dotenv from "dotenv";
import { config } from "./config.js";
import logger from "./utils/logger.js";
import app from "./app.js";

// 加载环境变量（优先读取 .env.local）
dotenv.config({ path: ".env.local" });
logger.info(`🔐 API_TOKEN 配置状态：${process.env.API_TOKEN ? "✅ 已配置" : "❌ 未配置"}`);

// 启动服务器
const serveHotApi: (port?: number) => void = (port: number = config.PORT) => {
  try {
    const apiServer = serve({
      fetch: app.fetch,
      port,
    });
    logger.info(`🔥 DailyHot API successfully runs on port ${port}`);
    logger.info(`🔗 Local: 👉 http://localhost:${port}`);
    return apiServer;
  } catch (error) {
    logger.error(error);
  }
};

if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "docker") {
  serveHotApi(config.PORT);
}

export default serveHotApi;
