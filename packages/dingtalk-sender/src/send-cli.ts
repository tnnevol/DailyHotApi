import axios from 'axios';
import RobotDing from '@tnnevol/robot-ding';

interface NewsItem {
  id: string;
  title: string;
  desc?: string;
  cover?: string;
  hot?: number;
  timestamp?: number;
  url: string;
  mobileUrl: string;
}

interface ApiResponse {
  code: number;
  data?: NewsItem[];
  title?: string;
  total?: number;
}

interface FeedCardItem {
  title: string;
  messageURL: string;
  picURL: string;
}

interface DingTalkSenderConfig {
  webhookUrl: string;
  secret: string;
}

class DingTalkSender {
  private webhookUrl: string;
  private secret: string;

  constructor(config: DingTalkSenderConfig) {
    if (!config.webhookUrl) {
      throw new Error('webhookUrl is required');
    }

    this.webhookUrl = config.webhookUrl;
    this.secret = config.secret;
  }

  async getHotNews(platform: string, token: string, limit: number = 5): Promise<ApiResponse> {
    const apiUrl = `https://newsapi.tnnevol.cn/${platform}?token=${token}&limit=${limit}`;

    try {
      const response = await axios.get<ApiResponse>(apiUrl);
      return response.data;
    } catch (error: any) {
      console.error(`获取 ${platform} 数据失败:`, error.message);
      throw error;
    }
  }

  async sendFeedCard(platform: string, token: string): Promise<{ success: boolean; items?: any[] }> {
    try {
      // 获取新闻数据
      const data = await this.getHotNews(platform, token);

      if (data.code !== 200 || !data.data || data.data.length === 0) {
        console.error(`❌ 获取 ${platform} 数据失败`);
        console.error('Response data:', JSON.stringify(data));
        return { success: false };
      }

      // 创建机器人实例
      const robot = new RobotDing({
        webhook: this.webhookUrl,
        secret: this.secret,
      });

      // 准备feedCard消息数据
      const feedItems = data.data.slice(0, 4).map((item) => ({
        title: item.title.substring(0, 25) + (item.title.length > 25 ? "..." : ""), // 限制标题长度并添加省略号
        messageURL: item.url || "#",
        picURL:
          item.cover ||
          item.mobileUrl ||
          "https://files.codelife.cc/wallpaper/wallspic/20250624b3hmgl.jpeg?x-oss-process=image/resize,limit_0,m_fill,w_1920,h_1080/quality,Q_93/format,webp", // 使用默认图片
      }));

      // 发送消息 - 使用正确的feedCard格式
      const result = await robot.sendDing({
        links: feedItems
      }, 'feedCard');

      console.log('✅ 钉钉消息发送成功');
      console.log('Platform:', platform);
      console.log('Items sent:', feedItems.length);
      console.log('Response:', result);

      return { success: true, items: feedItems };
    } catch (error: any) {
      console.error('❌ 发送钉钉消息失败:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      return { success: false };
    }
  }

  async batchSendFeedCard(
    platforms: string[],
    token: string,
    allFeedItems: Array<{ platform: string; items: any[] }> = []
  ): Promise<number> {
    const robot = new RobotDing({
      webhook: this.webhookUrl,
      secret: this.secret,
    });

    let successCount = 0;

    for (const platform of platforms) {
      console.log('');
      console.log(`🔍 获取：${platform}`);
      
      try {
        // 获取新闻数据
        const data = await this.getHotNews(platform, token);

        if (data.code !== 200 || !data.data || data.data.length === 0) {
          console.error(`❌ 获取 ${platform} 数据失败`);
          console.error('Response data:', JSON.stringify(data));
          continue;
        }

        // 准备feedCard消息数据
        const feedItems = data.data.slice(0, 4).map((item) => ({
          title: item.title.substring(0, 25) + (item.title.length > 25 ? "..." : ""),
          messageURL: item.url || "#",
          picURL: item.cover || item.mobileUrl || "",
        }));

        // 保存到汇总数组
        allFeedItems.push({ platform, items: feedItems });
        successCount++;

        console.log(`  ✅ 成功，推送 ${data.title || platform} 到钉钉`);
      } catch (error: any) {
        console.error(`  ❌ 获取数据失败: ${error.message}`);
      }
    }

    // 合并所有平台的数据，一次性发送
    if (allFeedItems.length > 0) {
      const allItems: { title: string; messageURL: string; picURL: string }[] = [];
      for (const { items } of allFeedItems) {
        allItems.push(...items);
      }

      console.log('');
      console.log('===== 合并推送 =====');
      console.log(`合并 ${allItems.length} 条消息到钉钉`);

      try {
        // 发送合并后的消息
        const result = await robot.sendDing({
          links: allItems
        }, 'feedCard');

        console.log('✅ 钉钉批量推送成功');
        console.log('Total items:', allItems.length);
        console.log('Response:', result);
      } catch (error: any) {
        console.error('❌ 批量发送失败:', error.message);
      }
    }

    return successCount;
  }
}

export default DingTalkSender;
export { DingTalkSender, type NewsItem, type ApiResponse, type FeedCardItem };
