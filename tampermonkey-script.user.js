// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-11-23
// @description  try to take over the world!
// @author       You
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Monitor] Started - Filtering for unionSearchGoods and unionPromoteLinkService');

    const originalFetch = window.fetch;
    const originalXHR = window.XMLHttpRequest;
    const SERVER_URL = 'https://chairman.piupiupiu.cc/api/capture-params';

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

    // Intercept Fetch API
    window.fetch = function(...args) {
        const [url, options = {}] = args;

        // Check if we should log this request
        if (!shouldLog(url)) {
            return originalFetch.apply(this, args);
        }

        console.log('\n========== FETCH REQUEST ==========');
        console.log('URL:', url);
        console.log('Method:', options.method || 'GET');

        if (options.headers) {
            console.log('Headers:', options.headers);
        }

        // Send params to server
        sendToServer(url, options.method || 'GET', options.headers, options.body);

        if (options.body) {
            console.log('Body:', options.body);
            try {
                const bodyData = JSON.parse(options.body);
                console.log('Body (Parsed):', bodyData);
            } catch (e) {
                try {
                    const params = new URLSearchParams(options.body);
                    const paramsObj = Object.fromEntries(params.entries());
                    console.log('Body (URLSearchParams):', paramsObj);
                } catch (e2) {
                    // Plain text body
                }
            }
        }

        try {
            const urlObj = new URL(url, window.location.origin);
            if (urlObj.search) {
                const params = Object.fromEntries(urlObj.searchParams.entries());
                console.log('URL Params:', params);
            }
        } catch (e) {
            // Invalid URL
        }

        console.log('===================================\n');

        return originalFetch.apply(this, args).then(response => {
            const clonedResponse = response.clone();

            console.log('\n========== FETCH RESPONSE ==========');
            console.log('URL:', url);
            console.log('Status:', response.status, response.statusText);
            console.log('Headers:', Object.fromEntries(response.headers.entries()));

            clonedResponse.text().then(text => {
                try {
                    const data = JSON.parse(text);
                    console.log('Response Body:', data);
                } catch (e) {
                    console.log('Response Body (Text):', text.substring(0, 500));
                }
            }).catch(err => {
                console.log('Cannot read response body:', err);
            });

            console.log('===================================\n');

            return response;
        }).catch(error => {
            console.error('Fetch Error:', url, error);
            throw error;
        });
    };

    // Intercept XMLHttpRequest
    window.XMLHttpRequest = function() {
        const xhr = new originalXHR();
        const originalOpen = xhr.open;
        const originalSend = xhr.send;
        const originalSetRequestHeader = xhr.setRequestHeader;

        let method, url;
        const headers = {};
        let shouldLogThis = false;

        xhr.open = function(m, u, ...args) {
            method = m;
            url = u;
            shouldLogThis = shouldLog(url);

            if (shouldLogThis) {
                console.log('\n========== XHR REQUEST ==========');
                console.log('URL:', url);
                console.log('Method:', method);
            }
            return originalOpen.apply(this, [m, u, ...args]);
        };

        xhr.setRequestHeader = function(name, value) {
            headers[name] = value;
            return originalSetRequestHeader.apply(this, arguments);
        };

        xhr.send = function(body) {
            if (shouldLogThis) {
                console.log('Headers:', headers);

                // Send params to server
                sendToServer(url, method, headers, body);

                if (body) {
                    console.log('Body:', body);
                    try {
                        const bodyData = JSON.parse(body);
                        console.log('Body (Parsed):', bodyData);
                    } catch (e) {
                        try {
                            const params = new URLSearchParams(body);
                            const paramsObj = Object.fromEntries(params.entries());
                            console.log('Body (URLSearchParams):', paramsObj);
                        } catch (e2) {
                            // Plain text
                        }
                    }
                }

                try {
                    const urlObj = new URL(url, window.location.origin);
                    if (urlObj.search) {
                        const params = Object.fromEntries(urlObj.searchParams.entries());
                        console.log('URL Params:', params);
                    }
                } catch (e) {
                    // Invalid URL
                }

                console.log('===================================\n');
            }

            xhr.addEventListener('load', function() {
                if (shouldLogThis) {
                    console.log('\n========== XHR RESPONSE ==========');
                    console.log('URL:', url);
                    console.log('Status:', xhr.status, xhr.statusText);
                    console.log('Response Headers:', xhr.getAllResponseHeaders());

                    try {
                        const data = JSON.parse(xhr.responseText);
                        console.log('Response Body:', data);
                    } catch (e) {
                        console.log('Response Body (Text):', xhr.responseText.substring(0, 500));
                    }

                    console.log('===================================\n');
                }
            });

            xhr.addEventListener('error', function() {
                if (shouldLogThis) {
                    console.error('XHR Error:', url);
                }
            });

            return originalSend.apply(this, arguments);
        };

        return xhr;
    };

    window.XMLHttpRequest.prototype = originalXHR.prototype;

})();
