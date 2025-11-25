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
  } = params;

  // 从 ParamsManager 获取保存的请求参数
  const savedParams = paramsManager.getParams('unionSearchGoods');

  if (!savedParams) {
    throw new Error('未找到 unionSearchGoods 的请求参数，请先在浏览器中执行一次搜索');
  }

  try {
    // 调试：打印保存的 headers
    console.log('📋 保存的 headers:', JSON.stringify(savedParams.headers, null, 2));

    // 使用保存的 URL（完全不修改）
    let url = savedParams.url;
    console.log('🚀 保存的 url:', url);
    console.log('🚀 savedParams', savedParams);
    // 如果有 body，解析并只替换 keyWord
 
      console.log('🚀 保存的 body:', savedParams.body);
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
          }
          console.log('🚀 替换后的 body:', JSON.stringify(bodyData, null, 2));
          // 重新编码并替换 URL 中的 body 参数
          // 注意：urlObj.searchParams.set() 会自动进行 URL 编码，所以传入原始 JSON 字符串即可
          urlObj.searchParams.set('body', JSON.stringify(bodyData));
          url = urlObj.toString();
        }
        console.log('🚀 替换前:', savedParams.url);
        console.log('🚀 替换后的 url:', url);
      } catch (e) {
        console.error('解析 body 失败，使用原始 URL:', e);
      }
    

    console.log('🚀 发送请求到:', url.substring(0, 100) + '...');
    console.log('📤 请求 headers 中是否有 cookie:', !!savedParams.headers?.cookie);
    console.log('🍪 Cookie 长度:', savedParams.headers?.cookie?.length || 0);

    const response = await fetch(url, {
      headers: savedParams.headers,
      method: savedParams.method || 'GET'
    });

    // 先获取文本响应，检查是否是 JSON
    const responseText = await response.text();

    // 尝试解析 JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('✅ searchJDGoods 成功, code:', data.code || 'N/A');
    } catch (parseError) {
      console.error('❌ JSON 解析失败！');
      console.error('📡 响应状态:', response.status, response.statusText);
      console.error('📄 Content-Type:', response.headers.get('content-type'));
      console.error('📝 响应内容:', responseText);
      throw new Error(`API 返回非 JSON 数据。状态码: ${response.status}。响应前200字符: ${responseText.substring(0, 200)}`);
    }

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

    // 先获取文本响应，检查是否是 JSON
    const responseText = await response.text();

    // 尝试解析 JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('✅ getPromotionLink 成功, code:', data.code || 'N/A');
    } catch (parseError) {
      console.error('❌ JSON 解析失败！');
      console.error('📡 响应状态:', response.status, response.statusText);
      console.error('📄 Content-Type:', response.headers.get('content-type'));
      console.error('📝 响应内容:', responseText);
      throw new Error(`API 返回非 JSON 数据。状态码: ${response.status}。响应前200字符: ${responseText.substring(0, 200)}`);
    }

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

  if (!searchResult.result || !searchResult.result.skuPage || !searchResult.result.skuPage.result || searchResult.result.skuPage.result.length === 0) {
    console.error('❌ 未找到商品。code:', searchResult.code, 'message:', searchResult.message);
    throw new Error(`未找到相关商品。API 返回: code=${searchResult.code}, message=${searchResult.message}`);
  }

  console.log('✅ 搜索到', searchResult.result.skuPage.result.length, '个商品');

  const firstProduct = searchResult.result.skuPage.result[0];

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
