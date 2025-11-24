# 京东短链接生成器

一个基于 TypeScript + Express 的京东联盟推广短链接生成工具。

## ✨ 特性

- 🚀 **Express API 接口**：RESTful API，易于集成
- 🔄 **完全动态参数捕获**：通过 Chrome 扩展自动捕获所有请求参数（包括 httpOnly cookies）
- 🔐 **自动 Cookie 同步**：无需手动更新，浏览器 cookie 自动同步到服务器
- 📦 **TypeScript 类型安全**：完整的类型定义
- 🎯 **简单易用**：一个 API 调用即可获取短链接

## 🔄 Chrome 扩展 + 动态参数捕获

本项目采用 **Chrome 扩展 + Express 服务器** 架构，实现完全自动化的参数管理。

### 工作原理

```
浏览器访问京东联盟 → Chrome扩展拦截API请求 → 提取完整headers(含httpOnly cookies) → 发送到服务器 → 保存到.api-params.json → API调用时自动使用最新参数
```

### 关键优势

- ✅ **捕获 httpOnly cookies**（`thor`、`flash`、`pin`、`__jdc` 等 JavaScript 无法访问的认证 cookie）
- ✅ **完全自动化**（无需手动复制参数，浏览器操作后自动同步）
- ✅ **实时更新**（每次浏览器请求自动更新服务器参数）
- ✅ **持久化存储**（保存到 `.api-params.json`，服务重启后仍可用）
- ✅ **零维护成本**（Cookie 过期？只需在浏览器重新登录，扩展自动捕获）

### 快速开始

1. **安装 Chrome 扩展**（详见 [chrome-extension/README.md](chrome-extension/README.md)）
2. **访问京东联盟并操作**（搜索商品、生成推广链接）
3. **扩展自动捕获参数**并发送到服务器
4. **立即调用 API**，无需任何配置

---

## 📦 安装

### 1. 安装服务器

```bash
# 克隆项目
git clone <your-repo-url>
cd jd_short_url_generator

# 安装依赖
npm install

# 构建项目
npm run build
```

### 2. 安装 Chrome 扩展

详细步骤请参考：[chrome-extension/README.md](chrome-extension/README.md)

**快速安装**：
1. 打开 Chrome，访问 `chrome://extensions/`
2. 开启右上角的"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 `chrome-extension` 文件夹
5. 扩展安装完成！

## 🚀 使用

### 启动服务

```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm run build
npm start
```

服务将在 `http://localhost:4000` 启动（可通过 `PORT` 环境变量修改）

### 捕获参数

1. 确保 Chrome 扩展已安装并启用
2. 访问 https://union.jd.com/
3. 执行以下任一操作：
   - 搜索商品（触发 `unionSearchGoods`）
   - 点击"生成推广链接"（触发 `unionPromoteLinkService`）
4. 扩展会自动捕获参数并发送到服务器

验证参数已保存：
```bash
curl http://localhost:4000/api/params
```

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

### Chrome 扩展配置

编辑 [chrome-extension/background.js](chrome-extension/background.js) 第 3 行修改服务器地址：

```javascript
const SERVER_URL = 'https://chairman.piupiupiu.cc/api/capture-params';
// 本地开发可改为：'http://localhost:4000/api/capture-params'
```

修改后需要在 `chrome://extensions/` 页面点击扩展的刷新按钮。

### 环境变量

```bash
# 设置端口（默认 4000）
PORT=8080 npm run dev
```

### Cookie 过期处理

**不再需要手动更新 Cookie！**

当 Cookie 过期时：
1. 在浏览器重新登录京东联盟
2. 执行一次搜索或生成推广链接操作
3. Chrome 扩展会自动捕获最新的 cookie 并更新到服务器
4. 无需修改任何代码或配置文件

---

## 📁 项目结构

```
jd_short_url_generator/
├── src/
│   ├── index.ts           # 核心功能：搜索商品、获取短链接
│   ├── server.ts          # Express API 服务器
│   ├── params-manager.ts  # 参数管理和持久化
│   └── types.ts           # TypeScript 类型定义
├── chrome-extension/      # Chrome 扩展（替代油猴脚本）
│   ├── manifest.json      # 扩展配置
│   ├── background.js      # 后台脚本（拦截请求）
│   ├── README.md          # 扩展安装和使用说明
│   └── ICONS.md           # 图标说明
├── dist/                  # 编译输出目录
├── .api-params.json       # 自动生成的参数缓存（不提交到 git）
├── tampermonkey-script.user.js  # 油猴脚本（已废弃，建议使用 Chrome 扩展）
├── API.md                 # API 完整文档
├── SETUP.md               # 详细设置指南
├── COOKIE_UPDATE_GUIDE.md # Cookie 更新指南（手动方式，不推荐）
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

`.api-params.json` 包含完整的账号认证信息，**请勿公开或提交到版本控制**：

- `pin` - 用户名
- `thor`、`flash` - httpOnly 认证 cookie
- `__jdc`、`__jda` - 设备和会话标识
- 所有 Cookie 和 token

**已添加到 `.gitignore`，请勿删除该规则！**

### Chrome 扩展权限

扩展需要以下权限：
- `webRequest`: 拦截并读取 HTTP 请求头
- `webNavigation`: 监控页面导航
- `host_permissions`: 仅访问 `*.jd.com` 和 `api.m.jd.com`

扩展**不会**收集或上传任何与京东联盟无关的数据。

### Cookie 自动更新

使用 Chrome 扩展后，所有参数（包括 httpOnly cookies）都会自动从浏览器同步：

| 参数类型 | 过期时间 | 自动更新 |
|---------|---------|---------|
| httpOnly cookies (`thor`, `flash`) | 数小时到数天 | ✅ 自动（扩展） |
| `h5st` | 5-10分钟 | ✅ 自动（扩展） |
| `x-api-eid-token` | 1-24小时 | ✅ 自动（扩展） |
| `pin`, `unick` | 永久 | ✅ 自动（扩展） |

**无需任何手动维护！**

---

## ⚠️ 注意事项

1. **使用 Chrome 扩展（推荐）**
   - Chrome 扩展可以捕获 httpOnly cookies，无需手动维护
   - 油猴脚本已废弃（无法访问 httpOnly cookies）
   - 建议所有用户迁移到 Chrome 扩展

2. **账号登录状态**
   - 确保在浏览器中保持京东联盟的登录状态
   - 如果登录过期，在浏览器重新登录后，扩展会自动捕获新的认证信息

3. **请求频率限制**
   - 建议每个商品查询间隔 1-2 秒
   - 避免频繁请求导致被封禁

4. **仅供学习使用**
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
