/**
 * Cloudflare Workers KV 缓存适配器
 * 使用 Workers KV 替代 Redis + Node-cache
 */

import type { KVNamespace } from '@cloudflare/workers-types';

interface CacheData {
  updateTime: string;
  data: unknown;
}

// Workers KV 绑定（在 wrangler.toml 中配置）
declare global {
  var CACHE_KV: KVNamespace | undefined;
}

/**
 * 从 KV 缓存获取数据
 * @param key 缓存键
 * @param kvNamespace KV 命名空间（可选，默认使用全局绑定）
 * @returns 缓存数据
 */
export const getCache = async (
  key: string,
  kvNamespace?: KVNamespace
): Promise<CacheData | undefined> => {
  const kv = kvNamespace || globalThis.CACHE_KV;
  
  if (!kv) {
    console.warn('⚠️ KV 命名空间未绑定，跳过缓存读取');
    return undefined;
  }

  try {
    const cached = await kv.get(key, 'text');
    if (cached) {
      return JSON.parse(cached);
    }
    return undefined;
  } catch (error) {
    console.error('❌ [KV] 读取缓存失败:', error instanceof Error ? error.message : error);
    return undefined;
  }
};

/**
 * 将数据写入 KV 缓存
 * @param key 缓存键
 * @param value 缓存值
 * @param ttl 缓存过期时间（秒）
 * @param kvNamespace KV 命名空间（可选）
 * @returns 是否写入成功
 */
export const setCache = async (
  key: string,
  value: CacheData,
  ttl: number = 3600,
  kvNamespace?: KVNamespace
): Promise<boolean> => {
  const kv = kvNamespace || globalThis.CACHE_KV;

  if (!kv) {
    console.warn('⚠️ KV 命名空间未绑定，跳过缓存写入');
    return false;
  }

  try {
    await kv.put(key, JSON.stringify(value), { expirationTtl: ttl });
    console.log(`💾 [KV] ${key} 已缓存，TTL: ${ttl}s`);
    return true;
  } catch (error) {
    console.error('❌ [KV] 写入缓存失败:', error instanceof Error ? error.message : error);
    return false;
  }
};

/**
 * 从 KV 缓存删除数据
 * @param key 缓存键
 * @param kvNamespace KV 命名空间（可选）
 * @returns 是否删除成功
 */
export const delCache = async (key: string, kvNamespace?: KVNamespace): Promise<boolean> => {
  const kv = kvNamespace || globalThis.CACHE_KV;

  if (!kv) {
    console.warn('⚠️ KV 命名空间未绑定，跳过缓存删除');
    return false;
  }

  try {
    await kv.delete(key);
    console.log(`🗑️ [KV] ${key} 已删除`);
    return true;
  } catch (error) {
    console.error('❌ [KV] 删除缓存失败:', error instanceof Error ? error.message : error);
    return false;
  }
};
