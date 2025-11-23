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
    pageNo,
    pageSize
  } = params;

  // 从 ParamsManager 获取保存的请求参数
  const savedParams = paramsManager.getParams('unionSearchGoods');

  if (!savedParams) {
    throw new Error('未找到 unionSearchGoods 的请求参数，请先在浏览器中执行一次搜索');
  }

  try {
    // 使用保存的 URL（完全不修改）
    let url = savedParams.url;

    // 如果有 body，解析并只替换 keyWord
    if (savedParams.body) {
      try {
        // 从 URL 中提取原始 body 参数
        const urlObj = new URL(url);
        const bodyParam = urlObj.searchParams.get('body');

        if (bodyParam) {
          // 解码 body
          const bodyData = JSON.parse(decodeURIComponent(bodyParam));

          // 只替换我们需要修改的字段
          if (bodyData.param) {
            bodyData.param.keyWord = keyWord;
            if (pageNo !== undefined) {
              bodyData.page = bodyData.page || {};
              bodyData.page.pageNo = pageNo;
            }
            if (pageSize !== undefined) {
              bodyData.page = bodyData.page || {};
              bodyData.page.pageSize = pageSize;
            }
          }

          // 重新编码并替换 URL 中的 body 参数
          const newBodyEncoded = encodeURIComponent(JSON.stringify(bodyData));
          urlObj.searchParams.set('body', newBodyEncoded);
          url = urlObj.toString();
        }
      } catch (e) {
        console.error('解析 body 失败，使用原始 URL:', e);
      }
    }

    const response = await fetch(url, {
      headers: savedParams.headers,
      method: savedParams.method || 'GET'
    });

    const data = await response.json();

    // 调试日志
    console.log('🔍 searchJDGoods 响应:', JSON.stringify(data, null, 2));

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
    // 使用保存的 URL（完全不修改）
    const url = savedParams.url;

    // 解析原始 body
    let bodyString = savedParams.body || '';

    try {
      // 提取 body 参数
      const bodyMatch = bodyString.match(/body=([^&]*)/);
      if (bodyMatch) {
        const bodyData = JSON.parse(decodeURIComponent(bodyMatch[1]));

        // 只替换我们需要修改的字段
        if (bodyData.param) {
          bodyData.param.materialId = Number(materialId);
          bodyData.param.planId = Number(planId);
          bodyData.param.wareUrl = `http://item.jd.com/${materialId}.html`;
          if (requestId) {
            bodyData.param.requestId = requestId;
          }
        }

        // 重新编码
        bodyString = `body=${encodeURIComponent(JSON.stringify(bodyData))}`;
      }
    } catch (e) {
      console.error('解析 body 失败，使用原始 body:', e);
    }

    const response = await fetch(url, {
      headers: savedParams.headers,
      method: savedParams.method || 'POST',
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

  console.log('🔍 搜索结果结构:', {
    hasResult: !!searchResult.result,
    hasData: !!searchResult.result?.data,
    dataLength: searchResult.result?.data?.length,
    code: searchResult.code,
    message: searchResult.message
  });

  if (!searchResult.result || !searchResult.result.data || searchResult.result.data.length === 0) {
    console.error('❌ 完整搜索结果:', JSON.stringify(searchResult, null, 2));
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
