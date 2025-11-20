import fetch from 'node-fetch';

export interface SearchGoodsParams {
  keyWord: string;  // 关键词,例如: "100198609685"
  pageNo?: number;
  pageSize?: number;
}

/**
 * 搜索京东联盟商品
 * @param params 请求参数
 * @param params.keyWord 关键词,例如: "100198609685"
 * @param params.pageNo 页码,默认1
 * @param params.pageSize 每页数量,默认60
 */
export async function searchJDGoods(params: SearchGoodsParams): Promise<any> {
  const {
    keyWord,
    pageNo = 1,
    pageSize = 60
  } = params;

  try {
    // 构建请求body - 完全按照原始请求的结构
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

    const encodedBody = encodeURIComponent(JSON.stringify(bodyData));

    const response = await fetch(`https://api.m.jd.com/api?functionId=unionSearchGoods&appid=unionpc&_=1763619048061&loginType=3&uuid=16930457925042119771904&x-api-eid-token=jdd03EBSUEPAM437GW4LD7TMLOPBHP3GSZBNGEXN47OOQC5O7GBYW67545BCYMHPVFMA3OL2IH2BRJJRJDK3U67DNXQQDBEAAAAM2T7HGELQAAAAADRVVVIXEONOETMX&h5st=20251120141052072;g9tw6a63ahdhddt5;586ae;tk03wa5a81bdf18npRFzgR1pPjCZWmBAAivSn6z0eVjQC0nLFM0m9BiBhGnz33IyfmOa4UA1pNgSyavgMHBCE3uKjDeI;91a5790289cc5e05459e5ca77067dde1c24e01061a0448460db4034dde650b9a;5.2;1763619048072;eVxhk4BZsRaI9AbI5crVrd7UqQKT6YfZnZfF7YfZB5hWxdeZnZ-G_U7ZBh-f1ZPV-ILVwVeIvVOUrVeUAIOVuJbTpZuVsBOI-AOJsdOV_YfZnZfFbwrI-MrE-hfZXx-ZxZLIqReTpNrJqFuJ_IrUqd_I_AOJtJOU8ILVvVrU7c7ZB5_Zuc7EzcrJ-hfZXx-ZxZfZnZfUsY7ZBh-f1ZvVzZ_WsJqK8wLH7kMU5YfZnZ-E-hfZXx-Z3U7VYYdU-sfP-h-T-trG9oLJvYfZB5hW-xLItoLP_cLO-h-T-JbF-hfZXxPCBh-f-57Q-h-T-VOVsY7ZBhfZB5hWvh-T-dOVsY7ZBhfZB5hWtdeZnZfVwN6J-hfZBh-f1BOWB5_ZvdOE-YfZBhfZXx-Zpg8JvlsR8g8HXYfZnZPGyQ7GAY6ZBhfZB5hWxh-T-BOE-YfZBhfZXxfVB5_ZqN6J-hfZBh-f1h_VB5_ZrN6J-hfZBh-f1heZnZPUsY7ZBhfZB5hWxh-T-ROE-YfZBhfZXxPVtdeZnZvVsY7ZBhfZB5hW-N_WwpfV-h-T-dOE-YfZBhfZXxfVB5_Z2E6ZBhfZB5hWsh-T-VaG-hfZBh-f1heZnZfG-hfZBh-f1heZnZfIqYfZBhfZX1aZnZfIzMbEpM7ZBh-f1taZB5BZ7foogfZn-h-T-ZeF-hfZBh-fmg-T-haF-hfZXx-ZqlMUwlcVwhfLBVsOBVLJUgfG8Q6GYgvT5UqGtoLH_cLO-h-T-dLEuYfZB5xD;3f733b9034d32947fb6a3f9193fcb2c628f0ea7a9a5743ccd53209d024a90397;eVxh989Gy8bE_oLE7wPD9k7J1RLHxgKJ&body=${encodedBody}`, {
      headers: {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en,zh-CN;q=0.9,zh;q=0.8,en-CN;q=0.7",
        "origin": "https://union.jd.com",
        "priority": "u=1, i",
        "referer": "https://union.jd.com/",
        "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
        "x-referer-page": "https://union.jd.com/overview",
        "x-rp-client": "h5_1.0.0",
        "cookie": "shshshfpa=0b9a3d89-e45d-d09a-6f80-f42ec50a6a43-1637476035; shshshfpx=0b9a3d89-e45d-d09a-6f80-f42ec50a6a43-1637476035; b_dw=2525; jcap_dvzw_fp=UDhmtPG4427CnoZXcxL0qfgn2HM-SA9ENACwP6wLhcSBxZam_b7k6HjL_Jaf9T58UrppRsJ1YqDi8pAyfsJzwQ==; __jdu=16930457925042119771904; b_dh=1187; b_dpr=2; b_webp=1; b_avif=1; TrackID=18PrBDeQ4sc1BIHLggKW0Jaa5V6onTRoehNlq6PscUzZqkDkws4-iOPU8jKnuRlCIpO2DnH0zS-e1PymoHERcfniY7FcC91e3tiCkqAcJceI5RxB7P6IBdrlngVUTU7YW; __jdv=76161171|direct|-|none|-|1762438990571; areaId=4; ipLoc-djd=4-50950-50957-0; jsavif=1; thor=B8CBF9DE9B97D38188F7B3C7CF88196542AD52EC914B7A801C2FB3E47CAA528C67D30932DD53A3D7640A540A1CDF785900A5EE8A4B745CADF2CC5A069DDAC87E1588B927EF8BE29A080FBE0DE8BE68666A0EA38A5099B6136FCACF851B419360AE13DA8CF36F2DCD01E16700819F5CAB36D9CE1C00FB703D9D74D2002B80025D; light_key=AASBKE7rOxgWQziEhC_QY6yaWmlOw32XRPUVZ8zUKaUMyhJ62fseKxygVxwQ8qQd9Rf5LOiF; pinId=v66OMquyWfo; pin=%E8%80%81%E7%90%A6; unick=%E8%80%81%E7%90%A6_CQ; ceshi3.com=201; _tp=06tk1rLtrzMZYfuIvi6vR%2FRlu0B1JC98JNtjDNnKQTs%3D; _pst=%E8%80%81%E7%90%A6; 3AB9D23F7A4B3C9B=EBSUEPAM437GW4LD7TMLOPBHP3GSZBNGEXN47OOQC5O7GBYW67545BCYMHPVFMA3OL2IH2BRJJRJDK3U67DNXQQDBE; 3AB9D23F7A4B3CSS=jdd03EBSUEPAM437GW4LD7TMLOPBHP3GSZBNGEXN47OOQC5O7GBYW67545BCYMHPVFMA3OL2IH2BRJJRJDK3U67DNXQQDBEAAAAM2T7IGVYYAAAAADHGF54Y2G67EKIX; token=6b9ab92578ab9890bf6b5c72996cf411,3,979787; shshshfpb=BApXWgYDZnP9AbJOZFho-Lt1JnVl-zNuZB3UGZxpX9xJ1IJl-JcOOwl-z3W7fZMMqI_B54BRprMRVRIYx7qpc498uZQrm_jabQeB5D2o; __jda=209449046.16930457925042119771904.1693045792.1763380068.1763616541.192; __jdc=209449046; flash=3_msei74wFj_xiv7gE1toMO8PGpkg7StsEowJBTuvMcbF2Wvdops7TXxqIlWa5ZivvHauBJ40HudfLx7NTAxFlSaLnkKViVaN5ePHJhtszTIvAdCv8rmA1AgfM-paZ0cyEVXKwlPWTaFTfORs9z6Va4W6V1HQsINtVwUSqm0Ph; sdtoken=AAbEsBpEIOVjqTAKCQtvQu17xN-6j7JNUmARYpUx8QtGPngYmvvTfn4m_2P9AATRmNYefTaTrS-yOYV_OOxfJZckVjxtzMJ1QBITAE5YtFYbBLnvAcDVVtuP0nC-C9qmWAkXKL2emMjIBydZQxeoFv18n9r3Qt3DHZDo1gDmdQB88vexBFM4FsZTEw; __jdb=209449046.23.16930457925042119771904|192.1763616541"
      },
      method: "GET"
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
 * @param params 请求参数
 * @param params.materialId 商品ID (从搜索结果的 skuId 获取)
 * @param params.planId 计划ID (从搜索结果的 planId 获取)
 * @param params.requestId 请求ID (从搜索结果的 requestId 获取，可选)
 */
export async function getPromotionLink(params: GetPromotionLinkParams): Promise<any> {
  const {
    materialId,
    planId,
    requestId = ""
  } = params;

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

    const response = await fetch(`https://api.m.jd.com/api?functionId=unionPromoteLinkService&appid=unionpc&_=1763619508173&loginType=3&uuid=16930457925042119771904&x-api-eid-token=jdd03EBSUEPAM437GW4LD7TMLOPBHP3GSZBNGEXN47OOQC5O7GBYW67545BCYMHPVFMA3OL2IH2BRJJRJDK3U67DNXQQDBEAAAAM2T7HGELQAAAAADRVVVIXEONOETMX&h5st=20251120141832176;g9tw6a63ahdhddt5;586ae;tk03wa5a81bdf18npRFzgR1pPjCZWmBAAivSn6z0eVjQC0nLFM0m9BiBhGnz33IyfmOa4UA1pNgSyavgMHBCE3uKjDeI;2bacd26f8ed8cee521494054c23c8fb58d5ff9b44962da2a5d576843b77096ff;5.2;1763619508176;eVxhk4BZsRaI9AbI5crVrd7UqQKT6YfZnZfF7YfZB5hWxdeZnZ-G_U7ZBh-f1ZPV-ILVwVeIvVOUrVeUAIOVuJbTpZuVsBOI-AOJsdOV_YfZnZfFbwrI-MrE-hfZXx-ZxZLIqReTpNrJqFuJ_IrUqd_I_AOJtJOU8ILVvVrU7c7ZB5_Zuc7EzcrJ-hfZXx-ZxZfZnZfUsY7ZBh-f1ZvVzZ_WsJqK8wLH7kMU5YfZnZ-E-hfZXx-Zq59VLY7NKY7O-h-T-trG9oLJvYfZB5hW-xLItoLP_cLO-h-T-JbF-hfZXxPCBh-f-57Q-h-T-VOVsY7ZBhfZB5hWvh-T-dOVsY7ZBhfZB5hWtdeZnZfVwN6J-hfZBh-f1BOWB5_ZvdOE-YfZBhfZXx-ZQA7UvdtEt9eTrYfZnZPGyQ7GAY6ZBhfZB5hWxh-T-BOE-YfZBhfZXxfVB5_ZqN6J-hfZBh-f1Z_VB5_ZrN6J-hfZBh-f1heZnZPUsY7ZBhfZB5hWxh-T-ROE-YfZBhfZXxPVtdeZnZvVsY7ZBhfZB5hW-N_WwpfV-h-T-dOE-YfZBhfZXxfVB5_Z2E6ZBhfZB5hWsh-T-VaG-hfZBh-f1heZnZfG-hfZBh-f1heZnZfIqYfZBhfZX1aZnZfIzMbEpM7ZBh-f1taZB5BZ7foogfZn-h-T-ZeF-hfZBh-fmg-T-haF-hfZXx-ZqlMUwlcVwhfLBVsOBVLJUgfG8Q6GYgvT5UqGtoLH_cLO-h-T-dLEuYfZB5xD;c1cc3cdbf1f755c930037aa2805f3722811728366160f1c7c538c6320ec0645f;eVxh989Gy8bE_oLE7wPD9k7J1RLHxgKJ`, {
      headers: {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en,zh-CN;q=0.9,zh;q=0.8,en-CN;q=0.7",
        "content-type": "application/x-www-form-urlencoded",
        "origin": "https://union.jd.com",
        "priority": "u=1, i",
        "referer": "https://union.jd.com/",
        "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
        "x-referer-page": "https://union.jd.com/overview",
        "x-rp-client": "h5_1.0.0",
        "cookie": "shshshfpa=0b9a3d89-e45d-d09a-6f80-f42ec50a6a43-1637476035; shshshfpx=0b9a3d89-e45d-d09a-6f80-f42ec50a6a43-1637476035; b_dw=2525; jcap_dvzw_fp=UDhmtPG4427CnoZXcxL0qfgn2HM-SA9ENACwP6wLhcSBxZam_b7k6HjL_Jaf9T58UrppRsJ1YqDi8pAyfsJzwQ==; __jdu=16930457925042119771904; b_dh=1187; b_dpr=2; b_webp=1; b_avif=1; TrackID=18PrBDeQ4sc1BIHLggKW0Jaa5V6onTRoehNlq6PscUzZqkDkws4-iOPU8jKnuRlCIpO2DnH0zS-e1PymoHERcfniY7FcC91e3tiCkqAcJceI5RxB7P6IBdrlngVUTU7YW; __jdv=76161171|direct|-|none|-|1762438990571; areaId=4; ipLoc-djd=4-50950-50957-0; jsavif=1; thor=B8CBF9DE9B97D38188F7B3C7CF88196542AD52EC914B7A801C2FB3E47CAA528C67D30932DD53A3D7640A540A1CDF785900A5EE8A4B745CADF2CC5A069DDAC87E1588B927EF8BE29A080FBE0DE8BE68666A0EA38A5099B6136FCACF851B419360AE13DA8CF36F2DCD01E16700819F5CAB36D9CE1C00FB703D9D74D2002B80025D; light_key=AASBKE7rOxgWQziEhC_QY6yaWmlOw32XRPUVZ8zUKaUMyhJ62fseKxygVxwQ8qQd9Rf5LOiF; pinId=v66OMquyWfo; pin=%E8%80%81%E7%90%A6; unick=%E8%80%81%E7%90%A6_CQ; ceshi3.com=201; _tp=06tk1rLtrzMZYfuIvi6vR%2FRlu0B1JC98JNtjDNnKQTs%3D; _pst=%E8%80%81%E7%90%A6; 3AB9D23F7A4B3CSS=jdd03EBSUEPAM437GW4LD7TMLOPBHP3GSZBNGEXN47OOQC5O7GBYW67545BCYMHPVFMA3OL2IH2BRJJRJDK3U67DNXQQDBEAAAAM2T7TWNOQAAAAACW24CGFCKHMJT4X; cn=2; mail_times=4%2C1%2C1763619334272; PCSYCityID=CN_500000_500100_0; umc_count=1; flash=3_b1Hgf9eUDdJSgE7nwe1TXutmhCdAFnbF4OuzZCjt9JmdPHaJBSwk9NAGw1GKBmRBaEABoGIiQ_4Zw6vdsJmHfWcoHnFUzrXXn11CnuIBvDA5KJOciF6_GyC1XvUyjZuHwv0cqkqg9v0lU0TIl0tcd5lOE2yVmpf1sO_dRHJO; shshshfpb=BApXWegzvnP9AbJOZFho-Lt1JnVl-zNuZB3UGZxpX9xJ1IJl-JcOOwl-z3W7fZMMqI_B54BRprMRVRIYx7qpc498uZQrm_jabQcbtFZs; 3AB9D23F7A4B3C9B=EBSUEPAM437GW4LD7TMLOPBHP3GSZBNGEXN47OOQC5O7GBYW67545BCYMHPVFMA3OL2IH2BRJJRJDK3U67DNXQQDBE; sdtoken=AAbEsBpEIOVjqTAKCQtvQu17UqwKqyxzEP7X_UwNwOpTCYhM-dsef8vDHHqCwxpUyY7ZasyIx-y4gyzwvXRjz8m-SJbDRCGhw0n0WDv4WshaMvzRnnSuuNDSszXt0l2Bm8OWN8boJoQJNHVzyVgOTo6ytYvzleBQVKPGeuD2BWDk3HxxqNUeZt6fHQ; __jda=143920055.16930457925042119771904.1693045792.1763380068.1763616541.192; __jdb=143920055.28.16930457925042119771904|192.1763616541; __jdc=143920055"
      },
      method: "POST",
      body: bodyString
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * 完整流程：先搜索商品，再获取推广短链接
 * @param keyWord 商品关键词或商品ID
 * @returns 返回推广链接信息，包含短链接等
 */
export async function getShortUrlForProduct(keyWord: string) {
  const searchResult = await searchJDGoods({ keyWord });

  if (searchResult.code === 200 && searchResult.result?.skuPage?.result?.length > 0) {
    const firstProduct = searchResult.result.skuPage.result[0];

    const promotionResult = await getPromotionLink({
      materialId: firstProduct.skuId,
      planId: firstProduct.planId,
      requestId: searchResult.result.requestId
    });

    return promotionResult;
  } else {
    return null;
  }
}


// 当文件作为主模块运行时，执行示例
if (require.main === module) {
  // 调用示例 - 完整流程
  getShortUrlForProduct("100198609685").then(result => {
    console.log('推广链接获取成功:');
    console.log(JSON.stringify(result, null, 2));
  }).catch(error => {
    console.error('获取失败:', error);
  });

  // 单独调用示例
  // 1. 只搜索商品
  // searchJDGoods({ keyWord: "100198609685" });

  // 2. 如果已知 skuId 和 planId，直接获取推广链接
  // getPromotionLink({
  //   materialId: 100198609685,
  //   planId: 3806201523,
  //   requestId: "10106524215-115510-1763619048294"
  // });
}
