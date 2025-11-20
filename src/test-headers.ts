import fetch from 'node-fetch';

/**
 * 测试脚本：检查京东 API 响应头中是否包含新的 Cookie
 */
async function testResponseHeaders() {
  console.log('=== 测试京东 API 响应头 ===\n');

  // 测试搜索商品接口
  const bodyData = {
    "funName": "search",
    "page": {
      "pageNo": 1,
      "pageSize": 10
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
      "keyWord": "100198609685",
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

  try {
    console.log('📡 发送请求到 unionSearchGoods...\n');

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

    console.log('✅ 响应状态:', response.status, response.statusText);
    console.log('\n=== 📋 响应头 (Response Headers) ===\n');

    // 打印所有响应头
    response.headers.forEach((value, name) => {
      console.log(`${name}: ${value}`);
    });

    // 特别检查 Set-Cookie 头
    console.log('\n=== 🍪 Set-Cookie 头（服务器要求设置的新 Cookie）===\n');
    const setCookieHeaders = response.headers.raw()['set-cookie'];
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      console.log('✅ 发现 Set-Cookie 头！服务器返回了新的 Cookie：\n');
      setCookieHeaders.forEach((cookie, index) => {
        console.log(`Cookie ${index + 1}:`);
        console.log(cookie);
        console.log('---');

        // 解析 Cookie 名称和值
        const cookieParts = cookie.split(';')[0].split('=');
        const cookieName = cookieParts[0];
        const cookieValue = cookieParts[1];
        console.log(`  名称: ${cookieName}`);
        console.log(`  值: ${cookieValue}`);

        // 检查过期时间
        const expiresMatch = cookie.match(/expires=([^;]+)/i);
        if (expiresMatch) {
          console.log(`  过期时间: ${expiresMatch[1]}`);
        }

        // 检查 Max-Age
        const maxAgeMatch = cookie.match(/max-age=(\d+)/i);
        if (maxAgeMatch) {
          const seconds = parseInt(maxAgeMatch[1]);
          const hours = (seconds / 3600).toFixed(2);
          const days = (seconds / 86400).toFixed(2);
          console.log(`  最大存活时间: ${seconds} 秒 (${hours} 小时 / ${days} 天)`);
        }
        console.log('');
      });
    } else {
      console.log('❌ 未发现 Set-Cookie 头');
      console.log('服务器没有返回新的 Cookie 来更新');
    }

    // 获取响应体
    const data = await response.json();
    console.log('\n=== 📦 响应体信息 ===\n');
    console.log('响应码:', data.code);
    console.log('消息:', data.message);
    console.log('是否成功:', data.code === 200 ? '✅ 成功' : '❌ 失败');

  } catch (error) {
    console.error('❌ 请求失败:', error);
  }
}

// 运行测试
testResponseHeaders();
