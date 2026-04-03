import type { RouterData, ListContext, Options, RouterResType, ListItem } from "../types.js";
import axios from "axios";


export const handleRoute = async (c: ListContext, noCache: boolean) => {
  const listData = await getList({}, noCache);
  const routeData: RouterData = {
    name: "juejin",
    title: "稀土掘金",
    type: "热榜",
    description: "帮助开发者成长的技术社区",
    params: {},
    link: "https://juejin.cn/hot/articles",
    total: listData.data?.length || 0,
    ...listData,
  };
  return routeData;
};

// 掘金响应类型
interface JueJinArticle {
  content?: {
    content_id?: string;
    title?: string;
  };
}

interface JueJinData {
  [key: string]: JueJinArticle;
}

interface JueJinResponse {
  data?: JueJinData[];
}

const getList = async (options: Options, noCache: boolean): Promise<RouterResType> => {
  const url = "https://api.juejin.cn/content_api/v1/content/article_rank?category_id=1&type=hot";

  try {
    const response = await axios.get<JueJinResponse>(url, {
      timeout: 10000,
      httpsAgent: false,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json, text/javascript, */*; q=0.01",
        Origin: "https://juejin.cn",
        Referer: "https://juejin.cn/",
      },
    });

    const dataList = response.data?.data || [];

    if (!dataList || dataList.length === 0) {
      return {
        fromCache: false,
        updateTime: new Date().toISOString(),
        data: [],
      };
    }


    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: dataList
        .filter((item: any) => item.content?.title)
        .map((item: any, index: number) => {
          const articleId = (item.content as any)?.content_id || "";
          const title = (item.content as any)?.title || "";
          const articleUrl = `https://juejin.cn/post/${articleId}`;

          const listItem: ListItem = {
            id: articleId,
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

    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: [],
      message: `掘金热榜接口暂时不可用：${error.message || "未知错误"}`,
    };
  }
};
