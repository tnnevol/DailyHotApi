#!/usr/bin/env node

import { DingTalkRobot } from '@tnnevol/robot-ding';
import https from 'https';
import { URL } from 'url';

async function getHotNews(platform, token) {
  return new Promise((resolve, reject) => {
    const apiUrl = new URL(`https://newsapi.tnnevol.cn/${platform}`);
    apiUrl.searchParams.append('token', token);
    apiUrl.searchParams.append('limit', '5');

    https.get(apiUrl.toString(), {
      headers: {
        'User-Agent': 'DailyHotApi-Client/1.0'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function pushToDingTalk() {
  try {
    // 从环境变量获取配置
    const webhookUrl = process.env.DINGTALK_WEBHOOK_URL;
    const secret = process.env.DINGTALK_SECRET;
    
    if (!webhookUrl) {
      console.error('❌ DINGTALK_WEBHOOK_URL 环境变量未设置');
      process.exit(1);
    }

    // 创建机器人实例
    const robot = new DingTalkRobot({
      webhook: webhookUrl,
      secret: secret,
    });

    // 从命令行参数获取消息数据
    const platform = process.argv[2] || 'baidu';
    const apiToken = process.env.API_TOKEN;
    
    if (!apiToken) {
      console.error('❌ API_TOKEN 环境变量未设置');
      process.exit(1);
    }

    // 获取新闻数据
    const data = await getHotNews(platform, apiToken);

    if (data.code !== 200 || !data.data || data.data.length === 0) {
      console.error(`❌ 获取 ${platform} 数据失败`);
      console.error('Response data:', JSON.stringify(data));
      process.exit(1);
    }

    // 准备feedCard消息数据
    const feedItems = data.data.slice(0, 4).map((item, index) => ({
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
  } catch (error) {
    console.error('❌ 发送钉钉消息失败:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  pushToDingTalk();
}

export default pushToDingTalk;