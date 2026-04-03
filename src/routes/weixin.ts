import type { RouterData, ListContext, Options, RouterResType, ListItem } from "../types.js";
import axios from "axios";
import { load } from "cheerio";


export const handleRoute = async (c: ListContext, noCache: boolean) => {
  const listData = await getList({}, noCache);
  const routeData: RouterData = {
    name: "weixin",
    title: "微信",
    type: "热门",
    description: "再小的个体，也有自己的品牌",
    params: {},
    link: "https://k.weixin.qq.com/",
    total: listData.data?.length || 0,
    ...listData,
  };
  return routeData;
};

const getList = async (options: Options, noCache: boolean): Promise<RouterResType> => {
  // 微信看一看热门页面
  const url = "https://k.weixin.qq.com/";

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      httpsAgent: false,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        Referer: "https://k.weixin.qq.com/",
      },
    });

    const html = response.data;
    const $ = load(html);

    // 查找文章列表（根据实际 HTML 结构调整）
    const articles = $(".article-item, .doc-item, .item");
    const items: ListItem[] = [];

    articles.each((_, element) => {
      const titleElem = $(element).find("h3, .title");
      if (!titleElem.length) return;

      const title = titleElem.text().trim();

      // 获取链接
      let link = $(element).find("a").attr("href") || "";
      if (!link) {
        const articleId = $(element).attr("data-id") || $(element).attr("id");
        link = articleId ? `https://k.weixin.qq.com/article?id=${articleId}` : url;
      }

      // 获取来源
      const sourceElem = $(element).find(".account, .source");
      const source = sourceElem.text().trim() || "";

      // 获取摘要
      const descElem = $(element).find(".desc, .summary, p");
      const desc = descElem.text().trim() || "";

      items.push({
        id: items.length + 1,
        title: title,
        desc: source ? `来源：${source}` : desc.substring(0, 50),
        cover: undefined,
        hot: undefined,
        timestamp: undefined,
        url: link,
        mobileUrl: link,
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
      data: items.slice(0, 20), // 限制返回前 20 条
    };
  } catch (error: any) {

    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: [],
      message: `微信热门接口暂时不可用：${error.message || "未知错误"}（微信需要 Selenium 浏览器环境，建议使用替代方案）`,
    };
  }
};
