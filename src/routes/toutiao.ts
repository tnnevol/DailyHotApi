import type { RouterData, ListContext, Options, RouterResType, ListItem } from "../types.js";
import axios from "axios";
import logger from "../utils/logger.js";

export const handleRoute = async (c: ListContext, noCache: boolean) => {
  const listData = await getList({}, noCache);
  const routeData: RouterData = {
    name: "toutiao",
    title: "今日头条",
    type: "热榜",
    description: "你关心的，才是头条",
    params: {},
    link: "https://www.toutiao.com/hot-event/hot-board/",
    total: listData.data?.length || 0,
    ...listData,
  };
  return routeData;
};

// 今日头条响应类型
interface ToutiaoItem {
  Title?: string;
  Url?: string;
  HotValue?: number;
}

interface ToutiaoResponse {
  data?: ToutiaoItem[];
}

const getList = async (options: Options, noCache: boolean): Promise<RouterResType> => {
  const url = "https://www.toutiao.com/hot-event/hot-board/?origin=toutiao_pc";
  
  try {
    const response = await axios.get<ToutiaoResponse>(url, {
      timeout: 10000,
      httpsAgent: false,
      headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json, text/javascript, */*; q=0.01",
      },
    });

    const items = response.data?.data || [];
    
    if (!items || items.length === 0) {
      logger.warn('今日头条热榜接口返回空数据');
      return {
        fromCache: false,
        updateTime: new Date().toISOString(),
        data: [],
      };
    }

    logger.info(`今日头条热榜获取成功，共 ${items.length} 条`);

    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: items
        .filter((item) => item.Title && item.Url)
        .map((item, index) => {
          const listItem: ListItem = {
            id: index + 1,
            title: item.Title || "",
            desc: "",
            cover: undefined,
            hot: Number(item.HotValue) || 0,
            timestamp: undefined,
            url: item.Url || "",
            mobileUrl: item.Url || "",
          };
          return listItem;
        }),
    };
  } catch (error: any) {
    logger.error(`今日头条热榜获取失败：${error.message || error}`);
    
    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: [],
      message: `今日头条热榜接口暂时不可用：${error.message || '未知错误'}`,
    };
  }
};
