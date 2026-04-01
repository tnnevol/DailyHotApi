import type { RouterData, ListContext, Options, RouterResType, ListItem } from "../types.js";
import axios from "axios";
import logger from "../utils/logger.js";

export const handleRoute = async (c: ListContext, noCache: boolean) => {
  const listData = await getList({}, noCache);
  const routeData: RouterData = {
    name: "tencent",
    title: "腾讯网",
    type: "热榜",
    description: "腾讯新闻，事实派",
    params: {},
    link: "https://news.qq.com/",
    total: listData.data?.length || 0,
    ...listData,
  };
  return routeData;
};

const getList = async (options: Options, noCache: boolean): Promise<RouterResType> => {
  const url = "https://i.news.qq.com/gw/event/pc_hot_ranking_list?ids_hash=&offset=0&page_size=51&appver=15.5_qqnews_7.1.60&rank_id=hot";
  
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      httpsAgent: false,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0 Safari/537.36 AppleWebKit/537.36 (KHTML, like Gecko)",
        "Referer": "https://news.qq.com/",
      },
    });

    const newsList = response.data?.idlist?.[0]?.newslist?.slice(1) || [];
    
    if (newsList.length === 0) {
      return {
        fromCache: false,
        updateTime: new Date().toISOString(),
        data: [],
      };
    }

    logger.info(`腾讯网热榜获取成功，共 ${newsList.length} 条`);

    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: newsList.map((item: any, index: number) => ({
        id: index + 1,
        title: item.title || "",
        desc: item.abstract || "",
        cover: undefined,
        hot: undefined,
        timestamp: undefined,
        url: item.url || "",
        mobileUrl: item.url || "",
      })),
    };
  } catch (error: any) {
    logger.error(`腾讯网热榜获取失败：${error.message || error}`);
    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: [],
      message: `腾讯网热榜接口暂时不可用：${error.message || '未知错误'}`,
    };
  }
};
