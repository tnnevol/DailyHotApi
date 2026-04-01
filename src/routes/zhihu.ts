import type { RouterData, ListContext, Options, RouterResType, ListItem } from "../types.js";
import axios from "axios";
import logger from "../utils/logger.js";

export const handleRoute = async (c: ListContext, noCache: boolean) => {
  const listData = await getList({}, noCache);
  const routeData: RouterData = {
    name: "zhihu",
    title: "知乎",
    type: "热榜",
    description: "有问题，就会有答案",
    params: {},
    link: "https://www.zhihu.com/hot",
    total: listData.data?.length || 0,
    ...listData,
  };
  return routeData;
};

// 知乎热榜响应类型
interface ZhihuQuestion {
  id?: number;
  title?: string;
  url?: string;
}

interface ZhihuTarget {
  question?: ZhihuQuestion;
  excerpt?: string;
}

interface ZhihuItem {
  target?: ZhihuTarget;
}

interface ZhihuResponse {
  data?: ZhihuItem[];
}

const getList = async (options: Options, noCache: boolean): Promise<RouterResType> => {
  const url = "https://www.zhihu.com/api/v3/explore/guest/feeds?limit=30&ws_qiangzhisafe=0";
  
  try {
    const response = await axios.get<ZhihuResponse>(url, {
      timeout: 10000,
      httpsAgent: false,
      headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://www.zhihu.com",
      },
    });

    const items = response.data?.data || [];
    
    if (!items || items.length === 0) {
      logger.warn('知乎热榜接口返回空数据');
      return {
        fromCache: false,
        updateTime: new Date().toISOString(),
        data: [],
      };
    }

    logger.info(`知乎热榜获取成功，共 ${items.length} 条`);

    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: items
        .filter((item) => item.target?.question?.title)
        .map((item, index) => {
          const question = item.target!.question!;
          const title = question.title || "";
          const questionId = question.id || index;
          
          const listItem: ListItem = {
            id: questionId,
            title: title,
            desc: item.target?.excerpt || "",
            cover: undefined,
            hot: undefined,
            timestamp: undefined,
            url: `https://www.zhihu.com/question/${questionId}`,
            mobileUrl: `https://www.zhihu.com/question/${questionId}`,
          };
          return listItem;
        }),
    };
  } catch (error: any) {
    logger.error(`知乎热榜获取失败：${error.message || error}`);
    
    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: [],
      message: `知乎热榜接口暂时不可用：${error.message || '未知错误'}`,
    };
  }
};
