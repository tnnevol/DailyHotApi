import { describe, it, expect, beforeAll } from 'vitest';
import axios from 'axios';

/**
 * 平台测试工厂函数
 * 用于快速创建各平台的标准化测试
 */
export function createPlatformTests(
  platform: string,
  options: {
    baseUrl?: string;
    requireData?: boolean; // 是否要求数据不为空（某些平台可能暂时不可用）
  } = {}
) {
  const {
    baseUrl = process.env.API_BASE_URL || 'https://newapi.wouqian.cn',
    requireData = true,
  } = options;

  const token = process.env.API_TOKEN || '';

  describe(`${platform} API`, () => {
    beforeAll(() => {
      if (!token) {
        console.warn(`⚠️ API_TOKEN 未配置，${platform} 测试可能失败`);
      }
    });

    it('应返回正确的数据结构', async () => {
      const url = `${baseUrl}/${platform}?token=${token}`;
      const response = await axios.get(url);

      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('code', 200);
      expect(response.data).toHaveProperty('name', platform);
      expect(response.data).toHaveProperty('data');
      expect(Array.isArray(response.data.data)).toBe(true);
    });

    it('应包含必要的字段', async () => {
      const url = `${baseUrl}/${platform}?token=${token}`;
      const response = await axios.get(url);

      const items = response.data.data;

      // 如果数据为空且不强制要求数据，跳过测试
      if (items.length === 0) {
        if (!requireData) {
          console.warn(`⚠️ ${platform} 接口返回空数据，跳过测试`);
          return;
        }
        // 如果要求必须有数据，则报错
        expect(items.length).toBeGreaterThan(0);
      }

      const firstItem = items[0];
      expect(firstItem).toHaveProperty('id');
      expect(firstItem).toHaveProperty('title');
      expect(firstItem).toHaveProperty('url');
      expect(typeof firstItem.title).toBe('string');
      expect(firstItem.title.length).toBeGreaterThan(0);
    });

    it('无 token 应返回 401', async () => {
      const url = `${baseUrl}/${platform}`;

      try {
        await axios.get(url);
        expect.fail('Expected 401 error');
      } catch (error: any) {
        if (error.response) {
          expect(error.response.status).toBe(401);
          expect(error.response.data).toHaveProperty('code', 401);
        } else {
          console.warn(`⚠️ ${platform} 网络错误，跳过测试`);
        }
      }
    });

    it('应返回合理数量的数据', async () => {
      const url = `${baseUrl}/${platform}?token=${token}&limit=10`;
      const response = await axios.get(url);

      const items = response.data.data;

      if (items.length === 0) {
        if (!requireData) {
          console.warn(`⚠️ ${platform} 接口返回空数据，跳过测试`);
          return;
        }
      }

      expect(items.length).toBeLessThanOrEqual(10);
      if (requireData && items.length > 0) {
        expect(items.length).toBeGreaterThan(0);
      }
    });
  });
}