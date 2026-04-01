import type { RouterData, ListContext, Options, RouterResType, ListItem } from "../types.js";
import axios from "axios";
import logger from "../utils/logger.js";

export const handleRoute = async (c: ListContext, noCache: boolean) => {
  const listData = await getList({}, noCache);
  const routeData: RouterData = {
    name: "github-trending",
    title: "GitHub Trending",
    type: "趋势榜",
    description: "Discover the best new projects on GitHub",
    params: {},
    link: "https://github.com/trending",
    total: listData.data?.length || 0,
    ...listData,
  };
  return routeData;
};

const getList = async (options: Options, noCache: boolean): Promise<RouterResType> => {
  const url = "https://api.github.com/search/repositories?q=stars:%3E1&sort=stars&per_page=25";

  try {
    const response = await axios.get(url, {
      timeout: 10000,
      httpsAgent: false,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0 Safari/537.36 AppleWebKit/537.36 (KHTML, like Gecko)",
        Accept: "application/vnd.github.v3+json",
        Referer: "https://github.com/",
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

    logger.info(`GitHub Trending 获取成功，共 ${items.length} 条`);

    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: items.map((item: any, index: number) => ({
        id: item.id || index + 1,
        title: item.full_name || "",
        desc: item.description || "",
        cover: undefined,
        hot: item.stargazers_count || 0,
        timestamp: undefined,
        url: item.html_url || "",
        mobileUrl: item.html_url || "",
      })),
    };
  } catch (error: any) {
    logger.error(`GitHub Trending 获取失败：${error.message || error}`);
    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: [],
      message: `GitHub Trending 接口暂时不可用：${error.message || "未知错误"}`,
    };
  }
};
