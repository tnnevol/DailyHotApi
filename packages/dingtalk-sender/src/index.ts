import axios from 'axios';
import { default as RobotDing } from '@tnnevol/robot-ding';

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
  secret?: string;
}

class DingTalkSender {
  private webhookUrl: string;
  private secret?: string;

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

  async sendFeedCard(platform: string, token: string): Promise<boolean> {
    try {
      // 获取新闻数据
      const data = await this.getHotNews(platform, token);

      if (data.code !== 200 || !data.data || data.data.length === 0) {
        console.error(`❌ 获取 ${platform} 数据失败`);
        console.error('Response data:', JSON.stringify(data));
        return false;
      }

      // 创建机器人实例
      const robot = new RobotDing({
        webhook: this.webhookUrl,
        secret: this.secret,
      });

      // 准备feedCard消息数据
      const feedItems = data.data.slice(0, 4).map((item) => ({
        title: item.title.substring(0, 25) + (item.title.length > 25 ? '...' : ''), // 限制标题长度并添加省略号
        messageURL: item.url || '#',
        picURL: item.cover || 'https://cdn.jsdelivr.net/gh/tnnevol/DailyHotApi@main/public/favicon.png', // 使用默认图片
      }));

      // 构建feedCard消息
      const message = {
        msgtype: 'feedCard' as const,
        feedCard: {
          links: feedItems
        }
      };

      // 发送消息
      const result = await robot.send(message);
      
      console.log('✅ 钉钉消息发送成功');
      console.log('Platform:', platform);
      console.log('Items sent:', feedItems.length);
      console.log('Response:', result);

      return true;
    } catch (error: any) {
      console.error('❌ 发送钉钉消息失败:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      return false;
    }
  }
}

export default DingTalkSender;
export { DingTalkSender, type NewsItem, type ApiResponse, type FeedCardItem };