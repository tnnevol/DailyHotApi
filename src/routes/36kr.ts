import type { RouterData, ListContext, Options, RouterResType, ListItem } from "../types.js";
import axios from "axios";
import logger from "../utils/logger.js";

export const handleRoute = async (c: ListContext, noCache: boolean) => {
  const listData = await getList({}, noCache);
  const routeData: RouterData = {
    name: "36kr",
    title: "36 氪",
    type: "热榜",
    description: "科技创业、商业资讯",
    params: {},
    link: "https://www.36kr.com/",
    total: listData.data?.length || 0,
    ...listData,
  };
  return routeData;
};

// 36 氪响应类型
interface KrMaterial {
  widgetTitle?: string;
}

interface KrItem {
  itemId?: string;
  templateMaterial?: KrMaterial;
}

interface KrData {
  hotRankList?: KrItem[];
}

interface KrResponse {
  data?: KrData;
}

const getList = async (options: Options, noCache: boolean): Promise<RouterResType> => {
  const url = "https://gateway.36kr.com/api/mis/nav/home/nav/rank/hot";

  try {
    const timestamp = Date.now();
    const response = await axios.post<KrResponse>(
      url,
      {
        partner_id: "wap",
        param: {
          siteId: 1,
          platformId: 2,
        },
        timestamp: timestamp,
      },
      {
        timeout: 10000,
        httpsAgent: false,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36",
        },
      },
    );

    const hotRankList = response.data?.data?.hotRankList || [];

    if (!hotRankList || hotRankList.length === 0) {
      logger.warn("36 氪热榜接口返回空数据");
      return {
        fromCache: false,
        updateTime: new Date().toISOString(),
        data: [],
      };
    }

    logger.info(`36 氪热榜获取成功，共 ${hotRankList.length} 条`);

    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: hotRankList
        .filter((item) => item.itemId && item.templateMaterial?.widgetTitle)
        .map((item, index) => {
          const itemId = item.itemId || "";
          const title = item.templateMaterial?.widgetTitle || "";
          const articleUrl = `https://www.36kr.com/p/${itemId}`;

          const listItem: ListItem = {
            id: itemId,
            title: title,
            desc: "",
            cover: undefined,
            hot: undefined,
            timestamp: undefined,
            url: articleUrl,
            mobileUrl: articleUrl,
          };
          return listItem;
        }),
    };
  } catch (error: any) {
    logger.error(`36 氪热榜获取失败：${error.message || error}`);

    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: [],
      message: `36 氪热榜接口暂时不可用：${error.message || "未知错误"}`,
    };
  }
};
