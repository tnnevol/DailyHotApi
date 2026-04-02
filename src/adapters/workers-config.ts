/**
 * Cloudflare Workers 配置适配器
 * 从 Cloudflare Workers env 参数获取配置，替代 dotenv + process.env
 */

export type WorkersConfig = {
  PORT: number;
  DISALLOW_ROBOT: boolean;
  CACHE_TTL: number;
  REQUEST_TIMEOUT: number;
  ALLOWED_DOMAIN: string;
  ALLOWED_HOST: string;
  USE_LOG_FILE: boolean;
  RSS_MODE: boolean;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
  REDIS_DB: number;
  ZHIHU_COOKIE: string;
  FILTER_WEIBO_ADVERTISEMENT: boolean;
  API_TOKEN?: string;
};

// 默认配置
const defaultConfig: WorkersConfig = {
  PORT: 8787, // Workers 默认端口
  DISALLOW_ROBOT: true,
  CACHE_TTL: 3600,
  REQUEST_TIMEOUT: 6000,
  ALLOWED_DOMAIN: '*',
  ALLOWED_HOST: 'tnnevol.cn',
  USE_LOG_FILE: false, // Workers 不支持文件写入
  RSS_MODE: false,
  REDIS_HOST: '', // Workers 环境不使用 Redis
  REDIS_PORT: 0,
  REDIS_PASSWORD: '',
  REDIS_DB: 0,
  ZHIHU_COOKIE: '',
  FILTER_WEIBO_ADVERTISEMENT: false,
  API_TOKEN: undefined,
};

/**
 * 从 Workers env 获取配置
 * @param env Cloudflare Workers 环境变量
 * @returns 配置对象
 */
export const getConfig = (env?: Record<string, string | undefined>): WorkersConfig => {
  if (!env) {
    return defaultConfig;
  }

  const getNumericEnv = (key: string, defaultValue: number): number => {
    const value = env[key];
    if (value === undefined) return defaultValue;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
  };

  const getBooleanEnv = (key: string, defaultValue: boolean): boolean => {
    const value = env[key];
    if (value === undefined) return defaultValue;
    return value.toLowerCase() === 'true';
  };

  const getStringEnv = (key: string, defaultValue: string): string => {
    return env[key] ?? defaultValue;
  };

  return {
    PORT: getNumericEnv('PORT', 8787),
    DISALLOW_ROBOT: getBooleanEnv('DISALLOW_ROBOT', true),
    CACHE_TTL: getNumericEnv('CACHE_TTL', 3600),
    REQUEST_TIMEOUT: getNumericEnv('REQUEST_TIMEOUT', 6000),
    ALLOWED_DOMAIN: getStringEnv('ALLOWED_DOMAIN', '*'),
    ALLOWED_HOST: getStringEnv('ALLOWED_HOST', 'tnnevol.cn'),
    USE_LOG_FILE: false, // Workers 不支持
    RSS_MODE: getBooleanEnv('RSS_MODE', false),
    REDIS_HOST: '', // Workers 环境不使用
    REDIS_PORT: 0,
    REDIS_PASSWORD: '',
    REDIS_DB: 0,
    ZHIHU_COOKIE: getStringEnv('ZHIHU_COOKIE', ''),
    FILTER_WEIBO_ADVERTISEMENT: getBooleanEnv('FILTER_WEIBO_ADVERTISEMENT', false),
    API_TOKEN: env['API_TOKEN'],
  };
};

// 导出默认配置（用于无 env 场景）
export const config = defaultConfig;
