import type { RouterData, ListContext, Options, RouterResType, ListItem } from "../types.js";
import axios from "axios";


export const handleRoute = async (c: ListContext, noCache: boolean) => {
  const listData = await getList({}, noCache);
  const routeData: RouterData = {
    name: "sspai",
    title: "少数派",
    type: "热门文章",
    description: "高效工作，品质生活",
    params: {},
    link: "https://sspai.com/",
    total: listData.data?.length || 0,
    ...listData,
  };
  return routeData;
};

// 少数派响应类型
interface SspaiItem {
  id?: number;
  title?: string;
  summary?: string;
  author?: {
    nickname?: string;
  };
  released_time?: number;
}

interface SspaiResponse {
  data?: SspaiItem[];
}

const getList = async (options: Options, noCache: boolean): Promise<RouterResType> => {
  const url = "https://sspai.com/api/v1/article/index/page/get?limit=20&offset=0&created_at=0";

  try {
    const response = await axios.get<SspaiResponse>(url, {
      timeout: 10000,
      httpsAgent: false,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://sspai.com/",
      },
    });

    const items = response.data?.data || [];

    if (!items || items.length === 0) {
      return {
        fromCache: false,
        updateTime: new Date().toISOString(),
        data: [],
      };
    }


    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: items
        .filter((item) => item.id && item.title)
        .map((item, index) => {
          const articleId = item.id || 0;
          const articleUrl = `https://sspai.com/post/${articleId}`;

          const listItem: ListItem = {
            id: articleId,
            title: item.title || "",
            desc: item.summary || "",
            cover: undefined,
            hot: undefined,
            timestamp: item.released_time || undefined,
            url: articleUrl,
            mobileUrl: articleUrl,
          };
          return listItem;
        }),
    };
  } catch (error: any) {

    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: [],
      message: `少数派接口暂时不可用：${error.message || "未知错误"}`,
    };
  }
};
