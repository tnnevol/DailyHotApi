import axios from 'axios';

// 使用动态导入加载模块以避免ESM导入问题
async function getRobotDing() {
  const { default: RobotDing } = await import('@tnnevol/robot-ding');
  return RobotDing;
}

class DingTalkPusher {
  private robot: any; // 使用 any 类型避免类型冲突

  constructor(webhookUrl, secret) {
    if (!webhookUrl) {
      throw new Error('DINGTALK_WEBHOOK_URL 环境变量未设置');
    }

    // 在构造函数中使用动态导入创建机器人实例
    // 在类外部定义一个静态方法来创建实例
    this.webhookUrl = webhookUrl;
    this.secret = secret;
  }
}

// 静态方法用于创建带机器人的实例
DingTalkPusher.create = async function(webhookUrl, secret) {
  const { default: RobotDing } = await import('@tnnevol/robot-ding');
  const instance = new DingTalkPusher(webhookUrl, secret);
  instance.robot = new RobotDing({
    webhook: webhookUrl,
    secret: secret,
  });
  return instance;
}

  async getHotNews(platform, token, limit = 5) {
    const apiUrl = `https://newsapi.tnnevol.cn/${platform}?token=${token}&limit=${limit}`;
    
    try {
      const response = await axios.get(apiUrl);
      return response.data;
    } catch (error) {
      console.error(`获取 ${platform} 数据失败:`, error.message);
      throw error;
    }
  }

  async pushFeedCard(platform, token) {
    try {
      // 获取新闻数据
      const data = await this.getHotNews(platform, token);

      if (data.code !== 200 || !data.data || data.data.length === 0) {
        console.error(`❌ 获取 ${platform} 数据失败`);
        console.error('Response data:', JSON.stringify(data));
        return false;
      }

      // 机器人实例已在构造函数中创建
      const robot = this.robot;

      // 准备feedCard消息数据
      const feedItems = data.data.slice(0, 4).map((item) => ({
        title: item.title.substring(0, 25) + (item.title.length > 25 ? '...' : ''), // 限制标题长度并添加省略号
        messageURL: item.url || '#',
        picURL: item.cover || 'https://cdn.jsdelivr.net/gh/tnnevol/DailyHotApi@main/public/favicon.png', // 使用默认图片
      }));

      // 构建feedCard消息
      const message = {
        msgtype: 'feedCard',
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
    } catch (error) {
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

async function main() {
  try {
    // 从环境变量获取配置
    const webhookUrl = process.env.DINGTALK_WEBHOOK_URL;
    const secret = process.env.DINGTALK_SECRET;
    const apiToken = process.env.API_TOKEN;
    
    if (!webhookUrl) {
      console.error('❌ DINGTALK_WEBHOOK_URL 环境变量未设置');
      process.exit(1);
    }
    
    if (!apiToken) {
      console.error('❌ API_TOKEN 环境变量未设置');
      process.exit(1);
    }

    // 从命令行参数获取平台名称
    const platform = process.argv[2] || 'baidu';

    // 创建推送实例并发送消息
    const pusher = await DingTalkPusher.create(webhookUrl, secret);
    const success = await pusher.pushFeedCard(platform, apiToken);

    if (success) {
      console.log(`✅ ${platform} 平台钉钉推送成功`);
      process.exit(0);
    } else {
      console.error(`❌ ${platform} 平台钉钉推送失败`);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ 推送过程发生错误:', error.message);
    process.exit(1);
  }
}

// 检查是否直接运行此脚本
const path = await import('path');
const currentFile = path.basename(new URL(import.meta.url).pathname);
const scriptFile = path.basename(process.argv[1]);

if (currentFile && scriptFile && currentFile.includes('dingtalk-push.mjs') && scriptFile.includes('dingtalk-push.mjs')) {
  main().catch(error => {
    console.error('❌ 推送过程发生错误:', error);
    process.exit(1);
  });
}

export default DingTalkPusher;