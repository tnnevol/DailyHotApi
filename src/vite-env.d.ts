/// <reference types="vite/client" />

/**
 * Vite import.meta.glob 类型扩展
 * 用于 Workers 路由动态导入
 */
interface ImportMetaGlob {
  glob(pattern: string): Record<string, () => Promise<{ handleRoute: (c: any, noCache: boolean) => Promise<any> }>>;
}

interface ImportMeta extends ImportMetaGlob {}