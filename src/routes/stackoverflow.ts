import type { RouterData, ListContext, Options, RouterResType, ListItem } from "../types.js";
import axios from "axios";


export const handleRoute = async (c: ListContext, noCache: boolean) => {
  const listData = await getList({}, noCache);
  const routeData: RouterData = {
    name: "stackoverflow",
    title: "Stack Overflow",
    type: "热门问题",
    description: "Where Developers Learn & Share",
    params: {},
    link: "https://stackoverflow.com/questions?tab=Hot",
    total: listData.data?.length || 0,
    ...listData,
  };
  return routeData;
};

const getList = async (options: Options, noCache: boolean): Promise<RouterResType> => {
  const url =
    "https://api.stackexchange.com/2.3/questions/hot?order=desc&sort=hot&site=stackoverflow";

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      httpsAgent: false,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
    });

    const items = response.data?.items || [];

    if (items.length === 0) {
      return {
        fromCache: false,
        updateTime: new Date().toISOString(),
        data: [],
      };
    }


    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: items.map((item: any, index: number) => ({
        id: item.question_id || index + 1,
        title: item.title || "",
        desc: "",
        cover: undefined,
        hot: item.score || 0,
        timestamp: item.creation_date ? item.creation_date * 1000 : undefined,
        url: item.link || "",
        mobileUrl: item.link || "",
      })),
    };
  } catch (error: any) {
    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: [],
      message: `Stack Overflow 接口暂时不可用：${error.message || "未知错误"}`,
    };
  }
};
