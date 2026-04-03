import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Hono } from 'hono';
import { authMiddleware } from '../../src/middleware/auth.js';

describe('Auth Middleware', () => {
  let app: Hono;

  beforeEach(() => {
    app = new Hono();
  });

  describe('API_TOKEN 未配置', () => {
    it('应返回 500 错误', async () => {
      // 模拟未配置 API_TOKEN 的环境
      const originalEnv = process.env.API_TOKEN;
      delete process.env.API_TOKEN;

      app.use('/protected', authMiddleware);
      app.get('/protected', (c) => c.json({ code: 200, message: 'success' }));

      const res = await app.request('/protected');
      
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body).toEqual({
        code: 500,
        message: 'Server configuration error: API_TOKEN not set',
      });

      // 恢复环境变量
      if (originalEnv) {
        process.env.API_TOKEN = originalEnv;
      }
    });
  });

  describe('API_TOKEN 已配置', () => {
    const testToken = 'test-token-123';

    beforeEach(() => {
      process.env.API_TOKEN = testToken;
    });

    it('无 token 参数时应返回 401', async () => {
      app.use('/protected', authMiddleware);
      app.get('/protected', (c) => c.json({ code: 200, message: 'success' }));

      const res = await app.request('/protected');
      
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body).toEqual({
        code: 401,
        message: 'Unauthorized: Invalid or missing token',
      });
    });

    it('错误 token 应返回 401', async () => {
      app.use('/protected', authMiddleware);
      app.get('/protected', (c) => c.json({ code: 200, message: 'success' }));

      const res = await app.request('/protected?token=wrong-token');
      
      expect(res.status).toBe(401);
      const body = await res.json();
      expect(body).toEqual({
        code: 401,
        message: 'Unauthorized: Invalid or missing token',
      });
    });

    it('正确 token 应放行请求', async () => {
      app.use('/protected', authMiddleware);
      app.get('/protected', (c) => c.json({ code: 200, message: 'success' }));

      const res = await app.request(`/protected?token=${testToken}`);
      
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toEqual({
        code: 200,
        message: 'success',
      });
    });
  });
});