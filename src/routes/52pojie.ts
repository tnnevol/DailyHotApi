import type { RouterData, ListContext, Options, RouterResType, ListItem } from "../types.js";
import axios from "axios";
import { load } from "cheerio";
import logger from "../utils/logger.js";

export const handleRoute = async (c: ListContext, noCache: boolean) => {
  const listData = await getList({}, noCache);
  const routeData: RouterData = {
    name: "52pojie",
    title: "吾爱破解",
    type: "热榜",
    description: "技术、软件、安全论坛",
    params: {},
    link: "https://www.52pojie.cn/forum.php?mod=guide&view=hot",
    total: listData.data?.length || 0,
    ...listData,
  };
  return routeData;
};

const getList = async (options: Options, noCache: boolean): Promise<RouterResType> => {
  const url = "https://www.52pojie.cn/forum.php?mod=guide&view=hot";
  
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      httpsAgent: false,
      headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      },
    });

    // 设置 GBK 编码（吾爱破解使用 GBK）
    const html = response.data;
    const $ = load(html, { decodeEntities: false });
    
    const hotThreads = $('tbody[id^="normalthread_"]');
    const items: ListItem[] = [];
    
    hotThreads.each((_, element) => {
      const titleElem = $(element).find('a.xst');
      if (!titleElem.length) return;
      
      const title = titleElem.text().trim();
      const href = titleElem.attr('href') || "";
      const url = href.startsWith('/') ? `https://www.52pojie.cn/${href}` : href;
      
      const infoElem = $(element).find('td.by');
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
      logger.warn('吾爱破解热榜接口返回空数据');
      return {
        fromCache: false,
        updateTime: new Date().toISOString(),
        data: [],
      };
    }

    logger.info(`吾爱破解热榜获取成功，共 ${items.length} 条`);

    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: items,
    };
  } catch (error: any) {
    logger.error(`吾爱破解热榜获取失败：${error.message || error}`);
    
    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: [],
      message: `吾爱破解热榜接口暂时不可用：${error.message || '未知错误'}`,
    };
  }
};
