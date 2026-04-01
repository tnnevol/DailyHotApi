import type { RouterData, ListContext, Options, RouterResType, ListItem } from "../types.js";
import axios from "axios";
import logger from "../utils/logger.js";

export const handleRoute = async (c: ListContext, noCache: boolean) => {
  const listData = await getList({}, noCache);
  const routeData: RouterData = {
    name: "sina-finance",
    title: "新浪财经",
    type: "7x24",
    description: "全球财经资讯，7x24 小时滚动更新",
    params: {},
    link: "https://finance.sina.com.cn/",
    total: listData.data?.length || 0,
    ...listData,
  };
  return routeData;
};

// 新浪财经响应类型
interface SinaFeedItem {
  rich_text?: string;
  docurl?: string;
  ext?: string;
}

interface SinaFeedData {
  list?: SinaFeedItem[];
}

interface SinaFeedResponse {
  result?: {
    status?: {
      code?: number;
    };
    data?: {
      feed?: SinaFeedData;
    };
  };
}

const getList = async (options: Options, noCache: boolean): Promise<RouterResType> => {
  const url =
    "https://zhibo.sina.com.cn/api/zhibo/feed?page=1&page_size=20&zhibo_id=152&tag_id=0&dire=f&dpc=1&pagesize=20";

  try {
    const response = await axios.get<SinaFeedResponse>(url, {
      timeout: 10000,
      httpsAgent: false,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        Referer: "https://finance.sina.com.cn/",
        Origin: "https://finance.sina.com.cn",
      },
    });

    const feedList = response.data?.result?.data?.feed?.list || [];

    if (!feedList || feedList.length === 0) {
      logger.warn("新浪财经直播接口返回空数据");
      return {
        fromCache: false,
        updateTime: new Date().toISOString(),
        data: [],
      };
    }

    logger.info(`新浪财经直播获取成功，共 ${feedList.length} 条`);

    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: feedList
        .filter((item) => item.rich_text)
        .map((item, index) => {
          let docUrl = item.docurl || "";

          // 解析 ext 字段中的 docurl
          if (item.ext) {
            try {
              const extData = JSON.parse(item.ext);
              if (extData.docurl) {
                docUrl = extData.docurl;
              }
            } catch (e) {
              // 解析失败，使用原来的 docurl
            }
          }

          const listItem: ListItem = {
            id: index + 1,
            title: item.rich_text || "",
            desc: "",
            cover: undefined,
            hot: undefined,
            timestamp: undefined,
            url: docUrl,
            mobileUrl: docUrl,
          };
          return listItem;
        }),
    };
  } catch (error: any) {
    logger.error(`新浪财经直播获取失败：${error.message || error}`);

    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: [],
      message: `新浪财经直播接口暂时不可用：${error.message || "未知错误"}`,
    };
  }
};
