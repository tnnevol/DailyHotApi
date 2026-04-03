import type { RouterData, ListContext, Options, RouterResType, ListItem } from "../types.js";
import axios from "axios";
import { load } from "cheerio";


export const handleRoute = async (c: ListContext, noCache: boolean) => {
  const listData = await getList({}, noCache);
  const routeData: RouterData = {
    name: "hupu",
    title: "虎扑",
    type: "步行街热帖",
    description: "直男聚集地，热门话题讨论",
    params: {},
    link: "https://bbs.hupu.com/all-gambia",
    total: listData.data?.length || 0,
    ...listData,
  };
  return routeData;
};

const getList = async (options: Options, noCache: boolean): Promise<RouterResType> => {
  const url = "https://bbs.hupu.com/all-gambia";

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

    const postList = $("div.t-info");
    const items: ListItem[] = [];

    postList.each((_, element) => {
      const titleElem = $(element).find("span.t-title");
      const linkElem = $(element).find("a");

      if (!titleElem.length || !linkElem.length) return;

      const title = titleElem.text().trim();
      let href = linkElem.attr("href") || "";
      const url = href.startsWith("/") ? `https://bbs.hupu.com${href}` : href;

      const infoElem = $(element).find("span.t-replies");
      const info = infoElem.text().trim() || "";

      items.push({
        id: items.length + 1,
        title: title,
        desc: info,
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
      data: items,
    };
  } catch (error: any) {

    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: [],
      message: `虎扑热帖接口暂时不可用：${error.message || "未知错误"}`,
    };
  }
};
