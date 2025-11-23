# 京东短链接生成器 - 设置指南

## 🎯 项目概述

这是一个基于 TypeScript 的京东联盟短链接生成服务，通过油猴脚本自动捕获浏览器请求参数，实现完全动态的 API 调用。

## 📂 项目结构

```
jd_short_url_generator/
├── src/
│   ├── index.ts              # 核心业务逻辑（搜索商品、获取推广链接）
│   ├── server.ts             # Express API 服务器
│   ├── params-manager.ts     # 参数管理和持久化
│   └── types.ts              # TypeScript 类型定义
├── tampermonkey-script.user.js  # 油猴脚本（浏览器端）
├── .api-params.json          # 自动生成的参数缓存文件（不提交到 git）
├── package.json
├── tsconfig.json
└── .gitignore
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动服务器

```bash
# 开发模式（自动重启）
npm run dev

# 或者先编译再运行
npm run build
npm start
```

服务器默认运行在 `http://localhost:4000`

### 3. 安装油猴脚本

1. 安装 Tampermonkey 浏览器扩展
2. 创建新脚本，复制 `tampermonkey-script.user.js` 的内容
3. 保存并启用脚本

### 4. 捕获参数

1. 访问京东联盟网站：https://union.jd.com/
2. 执行以下操作（油猴脚本会自动捕获）：
   - 搜索任意商品（触发 `unionSearchGoods`）
   - 点击"生成推广链接"（触发 `unionPromoteLinkService`）

3. 参数会自动发送到服务器并保存到 `.api-params.json`

### 5. 验证参数已保存

```bash
curl http://localhost:4000/api/params
```

或访问 `http://localhost:4000/api/params` 查看保存的参数。

## 📡 API 接口

### 1. 获取短链接（完整流程）

```bash
GET /api/short-url?keyword=商品关键词
```

示例：
```bash
curl "http://localhost:4000/api/short-url?keyword=100198609685"
```

### 2. 搜索商品

```bash
POST /api/search
Content-Type: application/json

{
  "keyWord": "100198609685",
  "pageNo": 1,
  "pageSize": 60
}
```

### 3. 获取推广链接

```bash
POST /api/promotion-link
Content-Type: application/json

{
  "materialId": "10086172888128",
  "planId": "202100195",
  "requestId": "optional"
}
```

### 4. 接收油猴脚本参数（内部使用）

```bash
POST /api/capture-params
Content-Type: application/json

{
  "url": "完整请求 URL",
  "method": "GET/POST",
  "headers": { ... },
  "body": "请求体",
  "functionId": "unionSearchGoods 或 unionPromoteLinkService"
}
```

### 5. 查看当前参数

```bash
# 查看所有参数
GET /api/params

# 查看特定 API 的参数
GET /api/params?functionId=unionSearchGoods
```

### 6. 健康检查

```bash
GET /health
```

## 🔧 配置

### 服务器端口

通过环境变量 `PORT` 设置：

```bash
PORT=3000 npm run dev
```

### 油猴脚本服务器地址

编辑 `tampermonkey-script.user.js`，修改 `SERVER_URL`：

```javascript
const SERVER_URL = 'https://chairman.piupiupiu.cc/api/capture-params';
```

## 🛠️ 工作原理

### 参数捕获流程

1. **浏览器端**（油猴脚本）
   - 拦截所有包含 `functionId=unionSearchGoods` 或 `functionId=unionPromoteLinkService` 的请求
   - 提取完整的 URL、headers（包括 cookie）、body
   - 发送到服务器的 `/api/capture-params` 接口

2. **服务器端**
   - 接收参数并保存到 `ParamsManager`
   - 持久化到 `.api-params.json` 文件
   - 后续 API 调用直接从文件读取参数

3. **API 调用**
   - 从 `ParamsManager` 加载保存的参数
   - 使用真实的 URL、headers、cookie 发起请求
   - 只需修改业务参数（如 keyWord、materialId）

### 关键优势

- ✅ **完全动态**：所有参数从浏览器实时捕获，无需手动复制
- ✅ **自动更新**：Cookie、token 等会随浏览器自动更新
- ✅ **持久化**：参数保存在文件中，服务重启后仍可用
- ✅ **无需维护**：h5st、sdtoken 等复杂参数完全自动处理

## 📝 重要文件说明

### `.api-params.json`

自动生成的参数缓存文件，包含：

```json
{
  "unionSearchGoods": {
    "url": "https://api.m.jd.com/api?functionId=unionSearchGoods&...",
    "method": "GET",
    "headers": {
      "cookie": "...",
      "user-agent": "...",
      ...
    },
    "body": "...",
    "timestamp": "2025-11-23T14:00:00.000Z"
  },
  "unionPromoteLinkService": {
    ...
  },
  "lastUpdate": "2025-11-23T14:00:00.000Z"
}
```

⚠️ **注意**：此文件包含敏感信息（cookie、token），已加入 `.gitignore`，请勿提交到版本控制。

## 🔐 安全注意事项

1. **不要提交敏感文件**
   - `.api-params.json` 包含完整的 cookie 和 token
   - 已添加到 `.gitignore`

2. **CORS 配置**
   - 当前允许所有来源（`Access-Control-Allow-Origin: *`）
   - 生产环境建议限制为特定域名

3. **参数有效期**
   - Cookie 和 token 有过期时间
   - 过期后需在浏览器重新操作以更新参数

## 🐛 故障排查

### 问题：API 返回错误或参数未找到

**解决方法**：
1. 确认服务器正在运行
2. 访问 `/api/params` 检查参数是否已保存
3. 如果没有参数，在浏览器中重新执行搜索和生成推广链接操作

### 问题：油猴脚本没有发送参数

**解决方法**：
1. 检查浏览器控制台是否有错误
2. 确认脚本已启用（Tampermonkey 图标显示数字 1）
3. 确认正在访问 `*.jd.com` 域名
4. 检查 `SERVER_URL` 配置是否正确

### 问题：请求失败或返回异常

**解决方法**：
1. 参数可能已过期，在浏览器重新操作
2. 检查 `.api-params.json` 中的 timestamp
3. 清空 `.api-params.json` 并重新捕获参数

## 📚 开发命令

```bash
# 启动开发服务器（自动重启）
npm run dev

# 编译 TypeScript
npm run build

# 运行编译后的代码
npm start

# 测试核心功能
npm test

# 清理编译输出
npm run clean

# 重新编译
npm run rebuild
```

## 🌐 部署到生产环境

### 1. 构建项目

```bash
npm run build
```

### 2. 配置环境变量

```bash
export PORT=4000
export NODE_ENV=production
```

### 3. 使用 PM2 运行（推荐）

```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm2 start dist/server.js --name jd-short-url

# 查看状态
pm2 status

# 查看日志
pm2 logs jd-short-url

# 设置开机自启
pm2 startup
pm2 save
```

### 4. 更新油猴脚本

将 `SERVER_URL` 改为生产环境地址：

```javascript
const SERVER_URL = 'https://chairman.piupiupiu.cc/api/capture-params';
```

## 📖 技术栈

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **HTTP Client**: node-fetch v2
- **Browser Script**: Tampermonkey (User Script)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

ISC
