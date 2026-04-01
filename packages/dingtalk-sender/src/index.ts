import DingTalkSender from './send-cli';

async function main(): Promise<void> {
  try {
    // 从环境变量获取配置
    const webhookUrl = process.env.DINGTALK_WEBHOOK_URL;
    const secret = process.env.DINGTALK_SECRET || '';
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
    const sender = new DingTalkSender({ webhookUrl, secret });
    const success = await sender.sendFeedCard(platform, apiToken);

    if (success) {
      console.log(`✅ ${platform} 平台钉钉推送成功`);
      process.exit(0);
    } else {
      console.error(`❌ ${platform} 平台钉钉推送失败`);
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
