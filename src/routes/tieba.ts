import type { RouterData, ListContext, Options, RouterResType, ListItem } from "../types.js";
import axios from "axios";

export const handleRoute = async (c: ListContext, noCache: boolean) => {
  const listData = await getList({}, noCache);
  const routeData: RouterData = {
    name: "tieba",
    title: "百度贴吧",
    type: "热议榜",
    description: "全球最大中文社区",
    params: {},
    link: "http://tieba.baidu.com/hottopic/browse/topicList",
    total: listData.data?.length || 0,
    ...listData,
  };
  return routeData;
};

// 贴吧响应类型
interface TieBaTopic {
  topic_name?: string;
  topic_url?: string;
  topic_desc?: string;
}

interface TieBaData {
  bang_topic?: {
    topic_list?: TieBaTopic[];
  };
}

interface TieBaResponse {
  data?: TieBaData;
}

const getList = async (options: Options, noCache: boolean): Promise<RouterResType> => {
  const url = "http://tieba.baidu.com/hottopic/browse/topicList";

  try {
    const response = await axios.get<TieBaResponse>(url, {
      timeout: 10000,
      httpsAgent: false,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json, text/javascript, */*; q=0.01",
      },
    });

    const topicList = response.data?.data?.bang_topic?.topic_list || [];

    if (!topicList || topicList.length === 0) {
      return {
        fromCache: false,
        updateTime: new Date().toISOString(),
        data: [],
      };
    }

    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: topicList
        .filter((item) => item.topic_name)
        .map((item, index) => {
          let url = item.topic_url || "";
          if (url && !url.startsWith("http")) {
            url = `http://tieba.baidu.com${url}`;
          }

          const listItem: ListItem = {
            id: index + 1,
            title: item.topic_name || "",
            desc: item.topic_desc || "",
            cover: undefined,
            hot: undefined,
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
      message: `贴吧热议榜接口暂时不可用：${error.message || "未知错误"}`,
    };
  }
};
