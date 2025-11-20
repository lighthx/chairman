# 京东短链接生成器

一个基于 TypeScript + Express 的京东联盟推广短链接生成工具。

## ✨ 特性

- 🚀 **Express API 接口**：RESTful API，易于集成
- 🔄 **自动 Cookie 更新**：自动更新 `sdtoken`，延长使用时间
- 📦 **TypeScript 类型安全**：完整的类型定义
- 🎯 **简单易用**：一个 API 调用即可获取短链接

## 🔄 自动 Cookie 更新与持久化

项目已实现自动 Cookie 更新和文件持久化功能！

### 工作原理

```
发送请求 → 服务器返回 x-rp-sdtoken → 自动更新 sdtoken → 保存到文件 → 下次启动自动加载
```

### 实际效果

**首次运行或缓存过期**：
```bash
🔄 Cookie 已更新: sdtoken = AAbEsBpEIOVjqTAKCQtvQu17...
⏰ 新 sdtoken 将在 30 分钟后过期
💾 已保存到 .cookie-cache.json
```

**重启服务后**：
```bash
✅ 从缓存文件加载 Cookie（15 分钟前更新）
```

### 好处

- ✅ **自动更新 `sdtoken`**（每次请求自动延长30分钟）
- ✅ **持久化存储**（重启服务后自动恢复）
- ✅ **缓存有效期**（24小时内有效，超时自动使用初始Cookie）
- ✅ **提高稳定性**（减少认证失败）
- ✅ **降低维护成本**（服务重启无需重新配置）

---

## 📦 安装

```bash
# 克隆项目
git clone <your-repo-url>
cd jd_short_url_generator

# 安装依赖
npm install

# 构建项目
npm run build
```

## 🚀 使用

### 启动服务

```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm run build
npm start
```

服务将在 `http://localhost:3000` 启动（可通过 `PORT` 环境变量修改）

### API 调用示例

#### 1. 获取推广短链接（推荐）

```bash
curl "http://localhost:3000/api/short-url?keyword=100198609685"
```

响应：
```json
{
  "success": true,
  "data": {
    "shortCode": "https://u.jd.com/WrO4nLi",
    "longCode": "https://union-click.jd.com/jdc?e=...",
    "jShortCommand": "￥C89KE4MdkGbLlp0T￥ ZH9112 ",
    "itemId": "3nWccNKjpUKSdOxDgmRwv0T8_3cvPnSpPtpJ3Ta7YuY"
  },
  "message": "success"
}
```

#### 2. 搜索商品

```bash
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "keyWord": "100198609685",
    "pageNo": 1,
    "pageSize": 10
  }'
```

#### 3. 获取推广链接

```bash
curl -X POST http://localhost:3000/api/promotion-link \
  -H "Content-Type: application/json" \
  -d '{
    "materialId": 100198609685,
    "planId": 3806201523
  }'
```

完整 API 文档请参考 [API.md](API.md)

---

## ⚙️ 配置

### 更新 Cookie 和认证参数

当 Cookie 过期或首次使用时，需要从浏览器获取最新参数：

1. 打开浏览器，登录京东联盟
2. 打开开发者工具（F12）→ Network 标签
3. 刷新页面，找到 `unionSearchGoods` 或类似请求
4. 复制请求的 Cookie 和 URL 参数
5. 更新 [src/index.ts](src/index.ts) 中的配置：

```typescript
// 更新初始 Cookie
const INITIAL_COOKIE = "你的完整Cookie字符串";

// 更新 URL 参数（如 h5st, x-api-eid-token 等）
const response = await fetch(`https://api.m.jd.com/api?...&h5st=新的h5st值&...`);
```

### 环境变量

```bash
# 设置端口（默认 3000）
PORT=8080 npm run dev
```

---

## 📁 项目结构

```
jd_short_url_generator/
├── src/
│   ├── index.ts           # 核心功能：搜索商品、获取短链接
│   ├── server.ts          # Express API 服务器
│   ├── cookie-manager.ts  # Cookie 自动更新管理器
│   ├── types.ts           # TypeScript 类型定义
│   └── test-headers.ts    # 响应头测试工具
├── dist/                  # 编译输出目录
├── API.md                 # API 完整文档
├── SECURITY.md            # 安全参数分析文档
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛠️ 开发

### 可用脚本

```bash
npm run dev      # 开发模式（启动 Express 服务器）
npm run test     # 测试模式（直接执行 index.ts）
npm run build    # 构建 TypeScript → JavaScript
npm start        # 生产模式（运行编译后的代码）
npm run clean    # 清理编译输出
npm run rebuild  # 清理 + 重新构建
```

### 导出的函数

项目可以作为库使用：

```typescript
import {
  getShortUrlForProduct,  // 完整流程：搜索 + 生成短链接
  searchJDGoods,          // 仅搜索商品
  getPromotionLink        // 仅生成推广链接
} from './index';

// 使用示例
const result = await getShortUrlForProduct("100198609685");
console.log(result.data.shortCode); // https://u.jd.com/WrO4nLi
```

---

## 🔒 安全说明

### 敏感信息

以下参数包含账号敏感信息，**请勿公开**：

- `pin` - 用户名
- `token` - 登录令牌
- `sdtoken` - 会话令牌
- `uuid` - 设备标识
- Cookie 中的所有内容

### Cookie 过期时间

| 参数 | 过期时间 | 自动更新 |
|------|---------|---------|
| `sdtoken` | 30分钟 | ✅ 自动 |
| `h5st` | 5-10分钟 | ❌ 需手动 |
| `x-api-eid-token` | 1-24小时 | ❌ 需手动 |
| `token` | 7-30天 | ❌ 需手动 |
| `pin`, `uuid` | 永久 | ❌ 不需要 |

详细分析请参考 [SECURITY.md](SECURITY.md)

---

## ⚠️ 注意事项

1. **Cookie 会过期**
   - `sdtoken` 会自动更新（30分钟有效期）
   - `h5st` 需要每 1-2 小时手动更新
   - 长期 token 需要定期更新（几天到几周）

2. **请求频率限制**
   - 建议每个商品查询间隔 1-2 秒
   - 避免频繁请求导致被封禁

3. **仅供学习使用**
   - 本项目仅供学习和研究
   - 生产环境建议使用京东联盟官方 API

---

## 📝 许可证

ISC

---

## 🙏 致谢

- [京东联盟](https://union.jd.com/) - API 提供方
- [node-fetch](https://github.com/node-fetch/node-fetch) - HTTP 请求库
- [Express](https://expressjs.com/) - Web 框架
