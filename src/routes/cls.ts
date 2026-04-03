import type { RouterData, ListContext, Options, RouterResType, ListItem } from "../types.js";
import axios from "axios";


export const handleRoute = async (c: ListContext, noCache: boolean) => {
  const listData = await getList({}, noCache);
  const routeData: RouterData = {
    name: "cls",
    title: "财联社",
    type: "电报",
    description: "快速、准确、权威的财经资讯",
    params: {},
    link: "https://www.cls.cn/",
    total: listData.data?.length || 0,
    ...listData,
  };
  return routeData;
};

// 财联社响应类型
interface CLSArticle {
  title?: string;
  jump_url?: string;
  brief?: string;
}

interface CLSColumn {
  title?: string;
  article_list?: CLSArticle;
  brief?: string;
}

interface CLSData {
  column_list?: CLSColumn[];
}

interface CLSResponse {
  errno?: number;
  data?: CLSData;
}

const getList = async (options: Options, noCache: boolean): Promise<RouterResType> => {
  const url =
    "https://www.cls.cn/featured/v1/column/list?app=CailianpressWeb&os=web&sv=8.4.6&sign=9f8797a1f4de66c2370f7a03990d2737";

  try {
    const response = await axios.get<CLSResponse>(url, {
      timeout: 10000,
      httpsAgent: false,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        Referer: "https://www.cls.cn/",
        Origin: "https://www.cls.cn",
      },
    });

    const columnList = response.data?.data?.column_list || [];

    if (!columnList || columnList.length === 0) {
      return {
        fromCache: false,
        updateTime: new Date().toISOString(),
        data: [],
      };
    }


    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: columnList.slice(0, 20).map((column, index) => {
        const title = column.title || "";
        const article = column.article_list;

        let displayTitle = title;
        let content = column.brief || "";
        let url = "https://www.cls.cn/telegraph";

        if (article?.title) {
          displayTitle = `[${title}] ${article.title}`;
          content = article.brief || article.title;
        }

        const listItem: ListItem = {
          id: index + 1,
          title: displayTitle,
          desc: content.substring(0, 200),
          cover: undefined,
          hot: 1000 - index,
          timestamp: undefined,
          url: url,
          mobileUrl: url,
        };
        return listItem;
      }),
    };
  } catch (error: any) {

    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: [],
      message: `财联社电报接口暂时不可用：${error.message || "未知错误"}`,
    };
  }
};
