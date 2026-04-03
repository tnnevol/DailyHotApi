import type { RouterData, ListContext, Options, RouterResType, ListItem } from "../types.js";
import axios from "axios";
import { load } from "cheerio";


export const handleRoute = async (c: ListContext, noCache: boolean) => {
  const listData = await getList({}, noCache);
  const routeData: RouterData = {
    name: "hackernews",
    title: "Hacker News",
    type: "热门",
    description: "News about hacking and startups",
    params: {},
    link: "https://news.ycombinator.com/",
    total: listData.data?.length || 0,
    ...listData,
  };
  return routeData;
};

const getList = async (options: Options, noCache: boolean): Promise<RouterResType> => {
  const url = "https://news.ycombinator.com/";

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      httpsAgent: false,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      },
    });

    const html = response.data;
    const $ = load(html);

    const items: ListItem[] = [];

    $("tr.athing").each((_, element) => {
      const titleElem = $(element).find(".titleline a");
      if (!titleElem.length) return;

      const title = titleElem.text().trim();
      const url = titleElem.attr("href") || "";

      items.push({
        id: items.length + 1,
        title: title,
        desc: "",
        cover: undefined,
        hot: undefined,
        timestamp: undefined,
        url: url,
        mobileUrl: url,
      });
    });

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
      data: items.slice(0, 30),
    };
  } catch (error: any) {
    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: [],
      message: `Hacker News 接口暂时不可用：${error.message || "未知错误"}`,
    };
  }
};
