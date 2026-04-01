import type { RouterData, ListContext, Options, RouterResType, ListItem } from "../types.js";
import axios from "axios";
import logger from "../utils/logger.js";

export const handleRoute = async (c: ListContext, noCache: boolean) => {
  const listData = await getList({}, noCache);
  const routeData: RouterData = {
    name: "v2ex",
    title: "V2EX",
    type: "主题榜",
    description: "创意工作者的社区",
    params: {},
    link: "https://www.v2ex.com/?tab=hot",
    total: listData.data?.length || 0,
    ...listData,
  };
  return routeData;
};

const getList = async (options: Options, noCache: boolean): Promise<RouterResType> => {
  const url = "https://www.v2ex.com/api/topics/hot.json";

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      httpsAgent: false,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
        Referer: "https://www.v2ex.com/",
      },
    });

    const items = response.data || [];

    if (items.length === 0) {
      return {
        fromCache: false,
        updateTime: new Date().toISOString(),
        data: [],
      };
    }

    logger.info(`V2EX 主题榜获取成功，共 ${items.length} 条`);

    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: items.map((item: any, index: number) => ({
        id: item.id || index + 1,
        title: item.title || "",
        desc: item.content?.substring(0, 200) || "",
        cover: item.member?.avatar_normal || undefined,
        hot: item.replies || 0,
        timestamp: undefined,
        url: item.url || "",
        mobileUrl: item.url || "",
      })),
    };
  } catch (error: any) {
    logger.error(`V2EX 主题榜获取失败：${error.message || error}`);
    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: [],
      message: `V2EX 接口暂时不可用：${error.message || "未知错误"}`,
    };
  }
};
