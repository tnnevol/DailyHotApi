import type { RouterData, ListContext, Options, RouterResType, ListItem } from "../types.js";
import axios from "axios";
import { load } from "cheerio";
import logger from "../utils/logger.js";

export const handleRoute = async (c: ListContext, noCache: boolean) => {
  const listData = await getList({}, noCache);
  const routeData: RouterData = {
    name: "douban",
    title: "豆瓣",
    type: "讨论精选",
    description: "书影音、文化、讨论",
    params: {},
    link: "https://www.douban.com/group/explore",
    total: listData.data?.length || 0,
    ...listData,
  };
  return routeData;
};

const getList = async (options: Options, noCache: boolean): Promise<RouterResType> => {
  const url = "https://www.douban.com/group/explore";

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      httpsAgent: false,
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        host: "www.douban.com",
        referer: "https://www.douban.com/group/explore",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    const html = response.data;
    const $ = load(html);

    const topicList = $("div.channel-item");
    const items: ListItem[] = [];

    topicList.each((_, element) => {
      const titleElem = $(element).find("h3 a");
      if (!titleElem.length) return;

      const title = titleElem.text().trim();
      const url = titleElem.attr("href") || "";

      const descElem = $(element).find("div.content");
      const desc = descElem.text().trim() || "";

      items.push({
        id: items.length + 1,
        title: title,
        desc: desc,
        cover: undefined,
        hot: undefined,
        timestamp: undefined,
        url: url,
        mobileUrl: url,
      });
    });

    if (items.length === 0) {
      logger.warn("豆瓣讨论接口返回空数据");
      return {
        fromCache: false,
        updateTime: new Date().toISOString(),
        data: [],
      };
    }

    logger.info(`豆瓣讨论获取成功，共 ${items.length} 条`);

    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: items,
    };
  } catch (error: any) {
    logger.error(`豆瓣讨论获取失败：${error.message || error}`);

    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: [],
      message: `豆瓣讨论接口暂时不可用：${error.message || "未知错误"}`,
    };
  }
};
