import type { RouterData, ListContext, Options, RouterResType, ListItem } from "../types.js";
import axios from "axios";
import logger from "../utils/logger.js";

export const handleRoute = async (c: ListContext, noCache: boolean) => {
  const listData = await getList({}, noCache);
  const routeData: RouterData = {
    name: "douyin",
    title: "抖音",
    type: "热点榜",
    description: "记录美好生活",
    params: {},
    link: "https://www.douyin.com/hot",
    total: listData.data?.length || 0,
    ...listData,
  };
  return routeData;
};

// 抖音热榜响应类型
interface DouYinItem {
  word?: string;
  sentence_id?: string;
  hot_value?: number;
  event_time?: number;
}

interface DouYinData {
  word_list?: DouYinItem[];
}

interface DouYinResponse {
  data?: DouYinData;
  status_code?: number;
  status_msg?: string;
}

const getList = async (options: Options, noCache: boolean): Promise<RouterResType> => {
  // 使用抖音官方 API（来自 hot_news fetch_v2）
  const url = "https://www.douyin.com/aweme/v1/web/hot/search/list/?device_platform=webapp&aid=6383&channel=channel_pc_web&detail_list=1&source=6&pc_client_type=1&pc_libra_divert=Windows&support_h265=1&support_dash=1&version_code=170400&version_name=17.4.0&cookie_enabled=true&screen_width=1920&screen_height=1080&browser_language=zh-CN&browser_platform=Win32&browser_name=Chrome&browser_version=136.0.0.0&browser_online=true&engine_name=Blink&engine_version=136.0.0.0&os_name=Windows&os_version=10&cpu_core_num=16&device_memory=8&platform=PC&downlink=10&effective_type=4g&round_trip_time=50&webid=7490997798633555467";
  
  try {
    const response = await axios.get<DouYinResponse>(url, {
      timeout: 10000,
      httpsAgent: false,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0 Safari/537.36 AppleWebKit/537.36 (KHTML, like Gecko)",
        "Referer": "https://www.douyin.com/",
      },
    });

    const wordList = response.data?.data?.word_list || [];
    
    if (!wordList || wordList.length === 0) {
      logger.warn('抖音热榜接口返回空数据');
      return {
        fromCache: false,
        updateTime: new Date().toISOString(),
        data: [],
      };
    }

    logger.info(`抖音热榜获取成功，共 ${wordList.length} 条`);

    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: wordList
        .filter((item) => item.word && item.sentence_id)
        .map((item, index) => {
          const title = item.word || "";
          const sentenceId = item.sentence_id || "";
          const hotValue = item.hot_value || 0;
          
          // 构建完整 URL（参考 Python 版本）
          const fullUrl = `https://www.douyin.com/hot/${sentenceId}?&trending_topic=${encodeURIComponent(title)}&previous_page=main_page&enter_method=trending_topic&modeFrom=hotDetail&tab_name=trend&position=1&hotValue=${hotValue}`;
          
          const listItem: ListItem = {
            id: index + 1,
            title: title,
            desc: "",
            cover: undefined,
            hot: hotValue,
            timestamp: undefined,
            url: fullUrl,
            mobileUrl: fullUrl,
          };
          return listItem;
        }),
    };
  } catch (error: any) {
    logger.error(`抖音热榜获取失败：${error.message || error}`);
    
    return {
      fromCache: false,
      updateTime: new Date().toISOString(),
      data: [],
      message: `抖音热榜接口暂时不可用：${error.message || '未知错误'}`,
    };
  }
};
