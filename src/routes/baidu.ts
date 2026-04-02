import type { RouterData, ListContext, Options, RouterResType, ListItem } from "../types.js";
import axios from "axios";

export const handleRoute = async (c: ListContext, noCache: boolean) => {
  const listData = await getList({}, noCache);
  const routeData: RouterData = {
    name: "baidu",
    title: "百度热搜",
    type: "热搜榜",
    description: "百度热搜，实时热点事件",
    params: {},
    link: "https://top.baidu.com/board?tab=realtime",
    total: listData.data?.length || 0,
    ...listData,
  };
  return routeData;
};

// 百度热搜 API 响应类型
interface BaiduHotItem {
  word: string;
  url: string;
  desc: string;
  hotScore: number;
  img?: string;
}

interface BaiduHotResponse {
  data: {
    cards: Array<{
      content: Array<{
        content: BaiduHotItem[];
      }>;
    }>;
  };
}

const getList = async (options: Options, noCache: boolean): Promise<RouterResType> => {
  const url = "https://top.baidu.com/api/board?platform=wise&tab=realtime";

  try {
    const response = await axios.get<BaiduHotResponse>(url, {
      timeout: 10000,
      httpsAgent: false, // 禁用 HTTPS 验证
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.183 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "Accept-Language": "zh-CN,zh;q=0.9",
      },
    });

    const cards = response.data?.data?.cards;
    if (!cards || cards.length === 0) {
      return {
        fromCache: false,
        updateTime: new Date().toISOString(),
        data: [],
      };
    }

    const contents = cards[0]?.content?.[0]?.content || [];
    if (!contents || contents.length === 0) {
      return {
        fromCache: false,
        updateTime: new Date().toISOString(),
        data: [],
      };
    }

    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: contents
        .filter((item) => item && item.word && item.url)
        .map((item, index) => ({
          id: index + 1,
          title: item.word,
          desc: item.desc || "",
          cover: item.img?.replace(/http:/, "https:"),
          hot: item.hotScore || 0,
          timestamp: undefined,
          url: item.url.replace("m.", "www."),
          mobileUrl: item.url,
        })),
    };
  } catch (error: any) {
    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: [],
      message: `百度热搜接口暂时不可用：${error.message || "未知错误"}`,
    };
  }
};
