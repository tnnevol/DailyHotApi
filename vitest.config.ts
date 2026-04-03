import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';
import path from 'path';

// 加载 .env.local 环境变量
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts'],
    testTimeout: 30000, // 30 秒超时
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});