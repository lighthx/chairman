# 京东短链接生成 API 文档

## 启动服务

```bash
# 开发模式（使用 ts-node）
npm run dev

# 生产模式（需要先构建）
npm run build
npm start
```

服务默认运行在 `http://localhost:3000`

## API 接口

### 1. 获取商品推广短链接（推荐使用）

**接口地址**: `GET /api/short-url`

**描述**: 一键获取商品的推广短链接（自动完成搜索+生成链接）

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 是 | 商品关键词或商品ID |

**请求示例**:
```bash
curl "http://localhost:3000/api/short-url?keyword=100198609685"
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "itemId": "3nWccNKjpUKD9jnpQmXSUPkD_3cvPnSpPtpJ3Ta7YuY",
    "jCommandCode": "14:/科大讯飞AI录音笔Magic...",
    "jShortCommand": "！HC7Ge9ADUhtMh46D！ MU5104 ",
    "longCode": "https://union-click.jd.com/jdc?e=618%7Cpc%7C...",
    "rqCode": "http://storage.jd.com/ads.union.master.public/...",
    "shortCode": "https://u.jd.com/W6O6tdF"
  },
  "message": "success"
}
```

**重要字段说明**:
- `shortCode`: 推广短链接（这是最常用的）
- `longCode`: 完整的推广链接
- `jShortCommand`: 京东口令（短版）
- `jCommandCode`: 京东口令（完整版）

---

### 2. 搜索京东商品

**接口地址**: `POST /api/search`

**描述**: 搜索京东联盟商品

**请求参数**:
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| keyWord | string | 是 | - | 商品关键词或商品ID |
| pageNo | number | 否 | 1 | 页码 |
| pageSize | number | 否 | 60 | 每页数量 |

**请求示例**:
```bash
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "keyWord": "100198609685",
    "pageNo": 1,
    "pageSize": 10
  }'
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "code": 200,
    "result": {
      "skuPage": {
        "result": [
          {
            "skuId": 100198609685,
            "skuName": "科大讯飞AI录音笔Magic...",
            "planId": 3806201523,
            "price": 1999.00,
            ...
          }
        ]
      },
      "requestId": "10106524215-115510-1763619048294"
    }
  }
}
```

---

### 3. 获取推广链接

**接口地址**: `POST /api/promotion-link`

**描述**: 根据商品ID和计划ID生成推广链接（需要先通过搜索接口获取这些参数）

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| materialId | string/number | 是 | 商品ID（从搜索结果的 skuId 获取） |
| planId | string/number | 是 | 计划ID（从搜索结果的 planId 获取） |
| requestId | string | 否 | 请求ID（从搜索结果的 requestId 获取） |

**请求示例**:
```bash
curl -X POST http://localhost:3000/api/promotion-link \
  -H "Content-Type: application/json" \
  -d '{
    "materialId": 100198609685,
    "planId": 3806201523,
    "requestId": "10106524215-115510-1763619048294"
  }'
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "shortCode": "https://u.jd.com/W6O6tdF",
    "longCode": "https://union-click.jd.com/jdc?e=618%7Cpc%7C...",
    ...
  },
  "message": "success"
}
```

---

### 4. 健康检查

**接口地址**: `GET /health`

**描述**: 检查服务是否正常运行

**请求示例**:
```bash
curl http://localhost:3000/health
```

**响应示例**:
```json
{
  "status": "ok",
  "timestamp": "2025-11-20T06:47:58.813Z"
}
```

---

## 错误响应

当请求失败时，返回格式如下：

```json
{
  "success": false,
  "message": "错误信息",
  "error": "详细错误（仅开发环境）"
}
```

常见错误码：
- `400`: 请求参数错误
- `404`: 未找到商品
- `500`: 服务器内部错误

---

## 环境变量

可以通过环境变量配置端口：

```bash
PORT=8080 npm run dev
```

---

## 使用示例（JavaScript/TypeScript）

```javascript
// 获取短链接
async function getShortUrl(keyword) {
  const response = await fetch(`http://localhost:3000/api/short-url?keyword=${keyword}`);
  const data = await response.json();

  if (data.success) {
    console.log('短链接:', data.data.shortCode);
    return data.data.shortCode;
  } else {
    console.error('获取失败:', data.message);
  }
}

// 调用示例
getShortUrl('100198609685');
```

---

## 注意事项

1. 所有 API 请求需要有效的京东联盟 Cookie 和认证信息（已在代码中配置）
2. Cookie 可能会过期，需要定期更新 [src/index.ts](src/index.ts) 中的 cookie 值
3. 推荐使用 `/api/short-url` 接口，它会自动完成完整流程
4. 短链接格式为 `https://u.jd.com/xxxxx`，可直接用于推广
