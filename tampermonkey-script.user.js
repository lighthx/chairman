// ==UserScript==
// @name         JD Union API Capturer
// @namespace    http://tampermonkey.net/
// @version      2025-11-23
// @description  Capture JD Union API requests with full cookies
// @author       You
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Monitor] Started - Capturing full cookies from real requests');

    const originalFetch = window.fetch;
    const originalXHR = window.XMLHttpRequest;
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    const SERVER_URL = 'https://chairman.piupiupiu.cc/api/capture-params';

    // 存储最近捕获的完整 cookie
    let capturedCookies = {
        unionSearchGoods: null,
        unionPromoteLinkService: null
    };

    // Helper function to check if URL should be logged
    function shouldLog(url) {
        if (!url) return false;
        return url.includes('functionId=unionSearchGoods') ||
               url.includes('functionId=unionPromoteLinkService');
    }

    // Helper function to extract functionId from URL
    function extractFunctionId(url) {
        const match = url.match(/functionId=([^&]+)/);
        return match ? match[1] : null;
    }

    // 使用 performance API 获取真实请求的 headers（包括 cookie）
    function getCookieFromPerformance(url) {
        try {
            const entries = performance.getEntriesByType('resource');
            // 查找最近匹配的请求
            for (let i = entries.length - 1; i >= 0; i--) {
                const entry = entries[i];
                if (entry.name && entry.name.includes(url.split('?')[0])) {
                    // 找到了，但 Performance API 也不提供 cookie...
                    return null;
                }
            }
        } catch (e) {
            console.warn('Performance API 失败:', e);
        }
        return null;
    }

    // 通过发送一个同源请求来获取当前域的完整 cookie
    function getAllCookiesViaRequest(targetDomain, callback) {
        const xhr = new originalXHR();
        const testUrl = `https://${targetDomain}/`;

        xhr.open('GET', testUrl, true);

        // 监听 readystatechange 来获取响应头
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 2) { // HEADERS_RECEIVED
                // 尝试从响应中读取（但这也不行，因为浏览器不会返回请求的 cookie）
                const cookieHeader = xhr.getResponseHeader('Set-Cookie');
                console.log('Set-Cookie from response:', cookieHeader);
            }
        };

        xhr.onerror = function() {
            callback(null);
        };

        xhr.onload = function() {
            callback(null);
        };

        // 不实际发送，只是为了触发
        // xhr.send();
        callback(null);
    }

    // Helper function to send params to server
    function sendToServer(url, method, headers, body) {
        const functionId = extractFunctionId(url);
        if (!functionId) return;

        // Convert headers to plain object
        const headersObj = {};
        if (headers instanceof Headers) {
            headers.forEach((value, key) => {
                headersObj[key] = value;
            });
        } else if (typeof headers === 'object') {
            Object.assign(headersObj, headers);
        }

        // 确保包含所有关键的浏览器 headers
        if (!headersObj['accept']) {
            headersObj['accept'] = 'application/json, text/plain, */*';
        }
        if (!headersObj['accept-language']) {
            headersObj['accept-language'] = navigator.language || 'en,zh-CN;q=0.9,zh;q=0.8';
        }
        if (!headersObj['origin']) {
            headersObj['origin'] = 'https://union.jd.com';
        }
        if (!headersObj['referer']) {
            headersObj['referer'] = 'https://union.jd.com/';
        }
        if (!headersObj['user-agent']) {
            headersObj['user-agent'] = navigator.userAgent;
        }
        if (!headersObj['priority']) {
            headersObj['priority'] = 'u=1, i';
        }
        if (!headersObj['sec-ch-ua']) {
            headersObj['sec-ch-ua'] = '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"';
        }
        if (!headersObj['sec-ch-ua-mobile']) {
            headersObj['sec-ch-ua-mobile'] = '?0';
        }
        if (!headersObj['sec-ch-ua-platform']) {
            headersObj['sec-ch-ua-platform'] = '"macOS"';
        }
        if (!headersObj['sec-fetch-dest']) {
            headersObj['sec-fetch-dest'] = 'empty';
        }
        if (!headersObj['sec-fetch-mode']) {
            headersObj['sec-fetch-mode'] = 'cors';
        }
        if (!headersObj['sec-fetch-site']) {
            headersObj['sec-fetch-site'] = 'same-site';
        }
        if (!headersObj['x-referer-page']) {
            headersObj['x-referer-page'] = 'https://union.jd.com/proManager/index';
        }
        if (!headersObj['x-rp-client']) {
            headersObj['x-rp-client'] = 'h5_1.0.0';
        }

        // Cookie 处理：合并 document.cookie 和硬编码的缺失字段
        let cookieMap = {};

        // 首先解析 document.cookie 到 map
        if (document.cookie) {
            document.cookie.split('; ').forEach(item => {
                const [key, ...valueParts] = item.split('=');
                cookieMap[key] = valueParts.join('=');
            });
        }

        // 硬编码缺失的关键 cookie 字段（从浏览器请求中复制）- 强制覆盖
        const hardcodedCookies = {
            'b_dw': '2525',
            'jcap_dvzw_fp': 'UDhmtPG4427CnoZXcxL0qfgn2HM-SA9ENACwP6wLhcSBxZam_b7k6HjL_Jaf9T58UrppRsJ1YqDi8pAyfsJzwQ==',
            'b_dh': '1187',
            'b_dpr': '2',
            'b_webp': '1',
            'b_avif': '1',
            'light_key': 'AASBKE7rOxgWQziEhC_QY6yaWmlOw32XRPUVZ8zUKaUMyhJ62fseKxygVxwQ8qQd9Rf5LOiF',
            '_pst': '%E8%80%81%E7%90%A6',
            'thor': 'B8CBF9DE9B97D38188F7B3C7CF8819650FEC811F1487064B2FEDA359CF45E785205EE6DB4666A0353657D3440182B091D9D8854C6348B5C31DDB0084519EC8B591C56426DC89241E27C1D498E12434F6F771EAB055CAAAA685691A39CFE4C4BA398D5BF20DD74840F8AEB821F30C5F2510A9223466AD6059733C7CE8861A280F',
            'flash': '3_KnndIFSCIGMVggP-JT2wutn7KFUf3KeNYrADFd8DfpqVfIwVawlN1LB6tfp1Lyk9mwdz4RPZJ5R-wg5iLaOcbbZSCQRC6eMYwn2rbCcTV05aK32aNDdJ4xye_XpYo2KLWTTTO_RqINbpVzMOyjeHXsR5nmD1StZgZrLgZBBV'
        };

        // 强制覆盖硬编码的 cookies
        Object.assign(cookieMap, hardcodedCookies);

        // 转回 cookie 字符串
        const finalCookie = Object.entries(cookieMap)
            .map(([key, value]) => `${key}=${value}`)
            .join('; ');

        headersObj['cookie'] = finalCookie;
        console.log('🍪 最终 cookie 长度:', finalCookie.length);
        console.log('🍪 强制添加了硬编码字段:', Object.keys(hardcodedCookies).join(', '));

        const payload = {
            url,
            method,
            headers: headersObj,
            body: body || undefined,
            functionId
        };

        // Send to server (don't block the main request)
        fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(res => res.json())
          .then(data => {
              console.log(`✅ 参数已发送到服务器: ${functionId}`, data);
          })
          .catch(err => {
              console.warn('⚠️  发送参数到服务器失败:', err.message);
          });
    }

    // 拦截 XHR 来捕获完整 cookie（通过复制真实请求）
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this._method = method;
        this._url = url;

        // 如果是我们关心的请求，尝试提取 cookie
        if (shouldLog(url)) {
            const functionId = extractFunctionId(url);
            console.log(`\n========== XHR REQUEST (${functionId}) ==========`);
            console.log('URL:', url);
            console.log('Method:', method);

            // 尝试通过创建一个同源请求来"窃取" cookie
            // 但这个方法也不行，因为无法访问请求中的 cookie header
        }

        return originalOpen.apply(this, [method, url, ...args]);
    };

    XMLHttpRequest.prototype.send = function(body) {
        const url = this._url;
        const method = this._method;

        if (shouldLog(url)) {
            const functionId = extractFunctionId(url);

            // 收集所有通过 setRequestHeader 设置的 headers
            const capturedHeaders = this._capturedHeaders || {};

            console.log('Headers:', capturedHeaders);
            console.log('Body:', body);

            // 发送到服务器
            sendToServer(url, method, capturedHeaders, body);

            console.log('===================================\n');
        }

        return originalSend.apply(this, arguments);
    };

    // 拦截 setRequestHeader 来收集 headers
    const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function(name, value) {
        if (!this._capturedHeaders) {
            this._capturedHeaders = {};
        }
        this._capturedHeaders[name] = value;
        return originalSetRequestHeader.apply(this, arguments);
    };

    // Intercept Fetch API
    window.fetch = function(...args) {
        const [url, options = {}] = args;

        // Check if we should log this request
        if (!shouldLog(url)) {
            return originalFetch.apply(this, args);
        }

        const functionId = extractFunctionId(url);
        console.log(`\n========== FETCH REQUEST (${functionId}) ==========`);
        console.log('URL:', url);
        console.log('Method:', options.method || 'GET');

        if (options.headers) {
            console.log('Headers:', options.headers);
        }

        if (options.body) {
            console.log('Body:', options.body);
        }

        // Send params to server
        sendToServer(url, options.method || 'GET', options.headers, options.body);

        console.log('===================================\n');

        return originalFetch.apply(this, args);
    };

    // 提示用户：由于浏览器安全限制，无法通过 JavaScript 获取 httpOnly cookies
    console.warn(`
⚠️  重要提示：
由于浏览器安全限制，JavaScript 无法访问 httpOnly cookies（如 pin, thor, __jdc 等）。

建议的解决方案：
1. 使用浏览器开发者工具手动复制完整的 cookie
2. 或者使用浏览器扩展（需要额外的权限）来捕获请求
3. 或者让用户在服务器上直接使用浏览器的 cookie jar

当前脚本只能捕获非 httpOnly 的 cookies。
    `);

})();
