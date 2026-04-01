import type { RouterData, ListContext, Options, RouterResType, ListItem } from "../types.js";
import axios from "axios";
import logger from "../utils/logger.js";

export const handleRoute = async (c: ListContext, noCache: boolean) => {
  const listData = await getList({}, noCache);
  const routeData: RouterData = {
    name: "eastmoney",
    title: "东方财富",
    type: "快讯",
    description: "财经资讯第一门户",
    params: {},
    link: "https://kuaixun.eastmoney.com/",
    total: listData.data?.length || 0,
    ...listData,
  };
  return routeData;
};

// 东方财富响应类型
interface EastMoneyItem {
  title?: string;
  summary?: string;
  showTime?: string;
  code?: string;
}

interface EastMoneyData {
  fastNewsList?: EastMoneyItem[];
}

interface EastMoneyResponse {
  code?: string;
  data?: EastMoneyData;
}

const getList = async (options: Options, noCache: boolean): Promise<RouterResType> => {
  const timestamp = Date.now();
  const url = `https://np-weblist.eastmoney.com/comm/web/getFastNewsList?client=web&biz=web_724&fastColumn=102&pageSize=50&req_trace=${timestamp}`;
  
  try {
    const response = await axios.get<EastMoneyResponse>(url, {
      timeout: 10000,
      httpsAgent: false,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Referer': 'https://kuaixun.eastmoney.com/',
        'Origin': 'https://kuaixun.eastmoney.com',
      },
    });

    const fastNewsList = response.data?.data?.fastNewsList || [];
    
    if (!fastNewsList || fastNewsList.length === 0) {
      logger.warn('东方财富快讯接口返回空数据');
      return {
        fromCache: false,
        updateTime: new Date().toISOString(),
        data: [],
      };
    }

    logger.info(`东方财富快讯获取成功，共 ${fastNewsList.length} 条`);

    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: fastNewsList
        .filter((item) => item.title)
        .slice(0, 20)
        .map((item, index) => {
          const code = item.code || "";
          const url = code ? `https://finance.eastmoney.com/a/${code}` : "https://kuaixun.eastmoney.com/";
          
          const listItem: ListItem = {
            id: index + 1,
            title: item.title || "",
            desc: item.summary || "",
            cover: undefined,
            hot: 1000 - index,
            timestamp: undefined,
            url: url,
            mobileUrl: url,
          };
          return listItem;
        }),
    };
  } catch (error: any) {
    logger.error(`东方财富快讯获取失败：${error.message || error}`);
    
    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: [],
      message: `东方财富快讯接口暂时不可用：${error.message || '未知错误'}`,
    };
  }
};
