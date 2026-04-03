/**
 * DingTalk Sender 入口文件
 * 
 * 架构说明：
 * - 本脚本负责从环境变量读取配置并调用批量推送
 * - 每个平台只请求一次 DailyHotApi API
 * - 所有平台数据合并后一次性推送到钉钉群
 * 
 * 推送流程：
 * GitHub Actions → 安装依赖 → 调用本脚本 → 获取数据 → 合并推送
 * 
 * API 请求次数：platforms.length（每个平台 1 次）
 * 钉钉推送次数：1（所有平台合并后）
 */

import DingTalkSender from './send-cli';

async function main(): Promise<void> {
  try {
    // 从环境变量获取配置
    const webhookUrl = process.env.DINGTALK_WEBHOOK_URL;
    const secret = process.env.DINGTALK_SECRET || '';
    const apiToken = process.env.API_TOKEN;
    const apiBaseUrl = process.env.API_BASE_URL;
    const defaultImageUrl = process.env.DEFAULT_IMAGE_URL;
    // 从环境变量获取平台列表（逗号分隔）
    const platformsStr = process.env.PLATFORMS || 'baidu,weibo,zhihu,douyin,bilibili,sspai';
    const platforms = platformsStr.split(',').map(p => p.trim()).filter(p => p);

    if (!webhookUrl) {
      console.error('❌ DINGTALK_WEBHOOK_URL 环境变量未设置');
      process.exit(1);
    }

    if (!apiToken) {
      console.error('❌ API_TOKEN 环境变量未设置');
      process.exit(1);
    }

    if (!apiBaseUrl) {
      console.error('❌ API_BASE_URL 环境变量未设置');
      process.exit(1);
    }

    if (!defaultImageUrl) {
      console.error('❌ DEFAULT_IMAGE_URL 环境变量未设置');
      process.exit(1);
    }

    if (platforms.length === 0) {
      console.error('❌ PLATFORMS 环境变量未设置或为空');
      process.exit(1);
    }

    // 创建推送实例
    const sender = new DingTalkSender({ webhookUrl, secret });

    // 批量获取所有平台数据并合并
    console.log(`🔍 准备推送 ${platforms.length} 个平台`);
    const allFeedItems: Array<{ platform: string; items: any[] }> = [];
    const successCount = await sender.batchSendFeedCard(platforms, apiToken, allFeedItems);

    // 统计推送结果
    let totalItems = 0;
    allFeedItems.forEach(({ items }) => {
      totalItems += items.length;
    });

    console.log('');
    console.log('===== 汇总 =====');
    console.log(`成功推送平台数：${successCount} / ${platforms.length}`);
    console.log(`总计推送条数：${totalItems}`);

    if (successCount > 0) {
      console.log('✅ 钉钉批量推送成功');
      process.exit(0);
    } else {
      console.error('❌ 钉钉批量推送失败');
      process.exit(1);
    }
  } catch (error: any) {
    console.error('❌ 推送过程发生错误:', error.message);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("❌ 推送过程发生错误:", error);
  process.exit(1);
});
