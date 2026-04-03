/**
 * Workers 路由注册工具
 * 静态注册所有平台路由，支持 KV 缓存
 */

import type { Context } from 'hono';
import { getCache, setCache } from '../adapters/workers-kv-cache.js';
import type { KVNamespace } from '@cloudflare/workers-types';
import * as routes from '../workers-routes.js';

// 平台名称到导出名称的映射
const platformToExport: Record<string, string> = {
  'zhihu-daily': 'zhihuDaily',
  'github-trending': 'githubTrending',
  '52pojie': 'poJie',
  'ithome-xijiayi': 'ithomeXijiayi',
  '36kr': 'kr36',
  'qq-news': 'qqNews',
  'sina-news': 'sinaNews',
  'sina-finance': 'sinaFinance',
  'netease-news': 'neteaseNews',
  'douban-movie': 'doubanMovie',
  'douban-group': 'doubanGroup',
  '51cto': 'ct51',
};

// 获取所有平台名称
export function getAllPlatformNames(): string[] {
  return [...routes.platformNames];
}

// 创建路由处理函数
export async function createRouteHandler(
  platform: string,
  c: Context,
  noCache: boolean,
  cacheKV?: KVNamespace
) {
  const limit = c.req.query('limit');
  const cacheKey = `${platform}_data_${noCache ? 'nocache' : 'cached'}`;
  
  let listData;
  
  // 尝试从缓存获取
  if (!noCache && cacheKV) {
    listData = await getCache(cacheKey, cacheKV);
  }
  
  // 缓存未命中，获取新数据
  if (!listData) {
    // 获取对应的导出名称
    const exportName = platformToExport[platform] || platform;
    const handleRoute = (routes as Record<string, any>)[exportName];
    
    if (!handleRoute) {
      throw new Error(`Platform ${platform} not found`);
    }
    
    listData = await handleRoute(c, noCache);
    
    // 存入缓存（缓存1小时）
    if (!noCache && cacheKV) {
      await setCache(cacheKey, listData, 3600, cacheKV);
    }
  }
  
  // 应用 limit 参数
  if (limit && listData?.data?.length > parseInt(limit)) {
    listData.total = parseInt(limit);
    listData.data = listData.data.slice(0, parseInt(limit));
  }
  
  return listData;
}