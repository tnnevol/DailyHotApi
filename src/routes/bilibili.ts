import type { RouterData, ListContext, Options, RouterResType, ListItem } from "../types.js";
import axios from "axios";

export const handleRoute = async (c: ListContext, noCache: boolean) => {
  const listData = await getList({}, noCache);
  const routeData: RouterData = {
    name: "bilibili",
    title: "哔哩哔哩",
    type: "热门榜",
    description: "你所热爱的，就是你的生活",
    params: {},
    link: "https://www.bilibili.com/popular/",
    total: listData.data?.length || 0,
    ...listData,
  };
  return routeData;
};

// B 站热门 API 响应类型
interface BiliItem {
  bvid: string;
  title: string;
  desc: string;
  pic?: string;
  owner?: { name: string };
  pubdate: number;
  stat?: { view: number };
  short_link_v2?: string;
}

interface BiliResponse {
  code: number;
  data?: {
    list: BiliItem[];
  };
  message?: string;
}

const getList = async (options: Options, noCache: boolean): Promise<RouterResType> => {
  const url = "https://api.bilibili.com/x/web-interface/popular";

  try {
    const response = await axios.get<BiliResponse>(url, {
      timeout: 10000,
      httpsAgent: false,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Referer: "https://www.bilibili.com/",
      },
    });

    const data = response.data;
    if (data.code !== 0) {
      return {
        fromCache: false,
        updateTime: new Date().toISOString(),
        data: [],
        message: `B 站 API 错误：${data.message || "未知错误"}`,
      };
    }

    const list = data.data?.list || [];
    if (!list || list.length === 0) {
      return {
        fromCache: false,
        updateTime: new Date().toISOString(),
        data: [],
      };
    }

    const currentTimestamp = Date.now();

    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: list
        .filter((item) => item && item.title && item.bvid)
        .map((item, index) => ({
          id: index + 1,
          title: item.title,
          desc: item.desc || "",
          cover: item.pic ? `https:${item.pic}` : undefined,
          hot: item.stat?.view || 0,
          timestamp: item.pubdate * 1000 || currentTimestamp,
          url: `https://www.bilibili.com/video/${item.bvid}`,
          mobileUrl: item.short_link_v2 || `https://www.bilibili.com/video/${item.bvid}`,
        })),
    };
  } catch (error: any) {
    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: [],
      message: `B 站获取失败：${error.message || "未知错误"}`,
    };
  }
};
