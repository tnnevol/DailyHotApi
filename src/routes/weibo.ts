import type { RouterData, ListContext, Options, RouterResType, ListItem } from "../types.js";
import axios from "axios";
import logger from "../utils/logger.js";

export const handleRoute = async (c: ListContext, noCache: boolean) => {
  const listData = await getList({}, noCache);
  const routeData: RouterData = {
    name: "weibo",
    title: "微博",
    type: "热搜榜",
    description: "实时热点，每分钟更新一次",
    params: {},
    link: "https://s.weibo.com/top/summary/",
    total: listData.data?.length || 0,
    ...listData,
  };
  return routeData;
};

// 微博热搜响应类型
interface WeiboItem {
  mid?: string;
  word?: string;
  word_scheme?: string;
  onboard_time?: number;
  note?: string;
  icon?: string;
}

interface WeiboResponse {
  data?: {
    realtime: WeiboItem[];
  };
}

const getList = async (options: Options, noCache: boolean): Promise<RouterResType> => {
  const url = "https://weibo.com/ajax/side/hotSearch";

  try {
    const response = await axios.get<WeiboResponse>(url, {
      timeout: 10000,
      httpsAgent: false,
      headers: {
        accept: "application/json, text/javascript, */*; q=0.01",
        host: "weibo.com",
        Referer: "https://weibo.com",
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const realtime = response.data?.data?.realtime || [];

    if (!realtime || realtime.length === 0) {
      logger.warn("微博热搜接口返回空数据");
      return {
        fromCache: false,
        updateTime: new Date().toISOString(),
        data: [],
      };
    }

    logger.info(`微博热搜获取成功，共 ${realtime.length} 条`);

    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: realtime
        .filter((item) => item.word)
        .map((item, index) => {
          const title = item.word || item.word_scheme || `热搜${index + 1}`;
          const listItem: ListItem = {
            id: item.mid || `weibo-${index}`,
            title: title,
            desc: item.word_scheme || `#${title}#`,
            cover: undefined,
            hot: undefined,
            timestamp: item.onboard_time ? Math.floor(item.onboard_time / 1000) : undefined,
            url: `https://s.weibo.com/weibo?q=${encodeURIComponent(title)}`,
            mobileUrl: `https://s.weibo.com/weibo?q=${encodeURIComponent(title)}`,
          };
          return listItem;
        }),
    };
  } catch (error: any) {
    logger.error(`微博热搜获取失败：${error.message || error}`);

    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: [],
      message: `微博热搜接口暂时不可用：${error.message || "未知错误"}`,
    };
  }
};
