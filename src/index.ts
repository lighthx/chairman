import fetch from 'node-fetch';
import ParamsManager from './params-manager';

// 使用 ParamsManager 管理所有参数
const paramsManager = new ParamsManager();

export interface SearchGoodsParams {
  keyWord: string;  // 关键词,例如: "100198609685"
  pageNo?: number;
  pageSize?: number;
}

/**
 * 搜索京东联盟商品
 */
export async function searchJDGoods(params: SearchGoodsParams): Promise<any> {
  const {
    keyWord,
    pageNo = 1,
    pageSize = 60
  } = params;

  // 从 ParamsManager 获取保存的请求参数
  const savedParams = paramsManager.getParams('unionSearchGoods');

  if (!savedParams) {
    throw new Error('未找到 unionSearchGoods 的请求参数，请先在浏览器中执行一次搜索');
  }

  try {
    // 构建请求body
    const bodyData = {
      "funName": "search",
      "page": {
        "pageNo": pageNo,
        "pageSize": pageSize
      },
      "param": {
        "bonusIds": null,
        "category1": null,
        "category2": null,
        "category3": null,
        "deliveryType": null,
        "fromCommission": null,
        "toCommission": null,
        "fromPrice": null,
        "toPrice": null,
        "hasCoupon": null,
        "isHot": null,
        "isNeedPreSale": null,
        "isPinGou": null,
        "isZY": null,
        "isCare": null,
        "lock": null,
        "orientationFlag": null,
        "sort": null,
        "sortName": null,
        "keyWord": keyWord,
        "searchType": "st2",
        "keywordType": "kt0",
        "hasSimRecommend": 1,
        "requestScene": 0,
        "requestExtFields": ["shopInfo", "orientations"],
        "source": 20310
      },
      "clientPageId": "jingfen_pc"
    };

    // 使用保存的 URL 和 headers
    let url = savedParams.url;

    // 更新 body 参数
    const encodedBody = encodeURIComponent(JSON.stringify(bodyData));
    url = url.replace(/body=[^&]*/, `body=${encodedBody}`);

    const response = await fetch(url, {
      headers: savedParams.headers,
      method: savedParams.method || 'GET'
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

export interface GetPromotionLinkParams {
  materialId: string | number;  // 商品ID (skuId)
  planId: string | number;      // 计划ID
  requestId?: string;            // 请求ID (可选)
}

/**
 * 获取推广链接
 */
export async function getPromotionLink(params: GetPromotionLinkParams): Promise<any> {
  const {
    materialId,
    planId,
    requestId = ""
  } = params;

  // 从 ParamsManager 获取保存的请求参数
  const savedParams = paramsManager.getParams('unionPromoteLinkService');

  if (!savedParams) {
    throw new Error('未找到 unionPromoteLinkService 的请求参数，请先在浏览器中执行一次获取推广链接');
  }

  try {
    // 构建请求body
    const bodyData = {
      "funName": "getCode",
      "param": {
        "materialId": Number(materialId),
        "materialType": 1,
        "needAutoVerifyPlan": null,
        "planId": Number(planId),
        "promotionType": 15,
        "receiveType": "cps",
        "wareUrl": `http://item.jd.com/${materialId}.html`,
        "isSmartGraphics": 0,
        "requestId": requestId,
        "command": 1,
        "ext1": "618%7Cpc%7C"
      },
      "clientPageId": "jingfen_pc"
    };

    const bodyString = `body=${encodeURIComponent(JSON.stringify(bodyData))}`;

    // 使用保存的 URL
    const url = savedParams.url;

    const response = await fetch(url, {
      headers: {
        ...savedParams.headers,
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      body: bodyString
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * 完整流程：搜索商品并获取第一个商品的推广短链接
 */
export async function getShortUrlForProduct(keyWord: string): Promise<any> {
  // 1. 搜索商品
  const searchResult = await searchJDGoods({ keyWord, pageSize: 1 });

  if (!searchResult.result || !searchResult.result.data || searchResult.result.data.length === 0) {
    throw new Error('未找到相关商品');
  }

  const firstProduct = searchResult.result.data[0];

  // 2. 获取推广链接
  const promotionResult = await getPromotionLink({
    materialId: firstProduct.skuId,
    planId: firstProduct.planId,
    requestId: searchResult.result.requestId
  });

  return promotionResult;
}

// 如果直接运行此文件，执行测试
if (require.main === module) {
  (async () => {
    try {
      console.log('开始测试...');
      const result = await getShortUrlForProduct('100198609685');
      console.log('✅ 获取成功:');
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('❌ 测试失败:', error);
    }
  })();
}
