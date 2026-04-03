import type { RouterData, ListContext, Options, RouterResType, ListItem } from "../types.js";
import axios from "axios";


export const handleRoute = async (c: ListContext, noCache: boolean) => {
  const listData = await getList({}, noCache);
  const routeData: RouterData = {
    name: "xueqiu",
    title: "雪球",
    type: "热门",
    description: "聪明的投资者都在这里",
    params: {},
    link: "https://xueqiu.com/hot_event",
    total: listData.data?.length || 0,
    ...listData,
  };
  return routeData;
};

// 雪球响应类型
interface XueqiuItem {
  id?: number;
  tag?: string;
  content?: string;
  status_count?: number;
  hot?: number;
}

interface XueqiuResponse {
  list?: XueqiuItem[];
}

const getList = async (options: Options, noCache: boolean): Promise<RouterResType> => {
  const url = "https://xueqiu.com/hot_event/list.json?count=10";

  try {
    const response = await axios.get<XueqiuResponse>(url, {
      timeout: 10000,
      httpsAgent: false,
      headers: {
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        Referer: "https://xueqiu.com/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    const list = response.data?.list || [];

    if (!list || list.length === 0) {
      return {
        fromCache: false,
        updateTime: new Date().toISOString(),
        data: [],
      };
    }


    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: list
        .filter((item) => item.tag)
        .map((item, index) => {
          let tag = item.tag || "";
          if (tag.startsWith("#") && tag.endsWith("#")) {
            tag = tag.slice(1, -1);
          }

          const listItem: ListItem = {
            id: item.id || index + 1,
            title: tag,
            desc: item.content?.substring(0, 200) || "",
            cover: undefined,
            hot: item.hot || item.status_count || 0,
            timestamp: undefined,
            url: "https://xueqiu.com/",
            mobileUrl: "https://xueqiu.com/",
          };
          return listItem;
        }),
    };
  } catch (error: any) {

    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: [],
      message: `雪球热门接口暂时不可用：${error.message || "未知错误"}`,
    };
  }
};
