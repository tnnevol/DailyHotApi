/**
 * Workers 路由注册工具
 * 动态注册所有平台路由，支持 KV 缓存
 */

import type { Context } from 'hono';
import { getCache, setCache } from '../adapters/workers-kv-cache.js';
import type { KVNamespace } from '@cloudflare/workers-types';

// 平台配置类型
type PlatformConfig = {
  name: string;
  importPath: () => Promise<{ handleRoute: (c: Context, noCache: boolean) => Promise<any> }>;
};

// 动态导入所有路由
const routeModules = import.meta.glob('../routes/*.ts');

// 获取所有平台名称
export function getAllPlatformNames(): string[] {
  return Object.keys(routeModules)
    .map(path => {
      const match = path.match(/\/routes\/(.+)\.ts$/);
      return match ? match[1] : null;
    })
    .filter((name): name is string => name !== null);
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
    const module = await routeModules[`../routes/${platform}.ts`]();
    listData = await module.handleRoute(c, noCache);
    
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