/**
 * Cloudflare Workers 适配器
 * 作为 Workers 环境的入口文件，导出标准的 fetch 处理器
 * 注意：必须导入 Workers 专用 app，不能导入 Node 版 app
 */

import app from './src/workers-app.js';

// 导出 Cloudflare Workers 标准格式
export default {
  fetch: app.fetch,
};
