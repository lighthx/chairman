# Cookie 更新指南

## 问题说明

由于浏览器安全限制，JavaScript 无法访问 **httpOnly cookies**（如 `pin`, `thor`, `__jdc`, `pinId` 等关键认证cookie）。这导致油猴脚本只能捕获部分cookie，可能导致 API 调用失败并返回"未登录"错误。

## 解决方案：手动更新完整 Cookie

### 步骤 1：从浏览器开发者工具复制完整 Cookie

1. 打开京东联盟网站：https://union.jd.com/
2. 按 `F12` 打开开发者工具
3. 切换到 **Network（网络）** 标签
4. 在搜索框中搜索任意商品，触发 `unionSearchGoods` 请求
5. 在网络请求列表中找到包含 `unionSearchGoods` 的请求
6. 点击该请求，在右侧面板中找到 **Headers（请求头）** 部分
7. 找到 `cookie:` 行，右键点击 -> **Copy value（复制值）**

示例：
```
cookie: flash=2_xxx; __jda=xxx; __jdv=xxx; shshshfpa=xxx; 3AB9D23F7A4B3CSS=xxx; __jdu=xxx; areaId=1; ipLoc-djd=1-72-2799-0; PCSYCityID=CN_110000_110100_0; pin=xxx; pinId=xxx; thor=xxx; __jdc=xxx; _tp=xxx; _pst=xxx; unick=xxx; ...
```

### 步骤 2：使用 API 更新 Cookie

使用以下命令将完整的 cookie 发送到服务器：

```bash
curl -X POST http://localhost:4000/api/update-cookie \
  -H "Content-Type: application/json" \
  -d '{
    "functionId": "unionSearchGoods",
    "cookie": "这里粘贴你复制的完整cookie"
  }'
```

或者使用生产环境地址：

```bash
curl -X POST https://chairman.piupiupiu.cc/api/update-cookie \
  -H "Content-Type: application/json" \
  -d '{
    "functionId": "unionSearchGoods",
    "cookie": "flash=2_xxx; __jda=xxx; pin=xxx; thor=xxx; ..."
  }'
```

### 步骤 3：同样更新 `unionPromoteLinkService` 的 Cookie

重复上述步骤，但这次：
1. 在京东联盟点击"获取推广链接"按钮
2. 在网络请求中找到 `unionPromoteLinkService` 请求
3. 复制其 cookie
4. 使用相同的 API，但 `functionId` 改为 `unionPromoteLinkService`：

```bash
curl -X POST http://localhost:4000/api/update-cookie \
  -H "Content-Type: application/json" \
  -d '{
    "functionId": "unionPromoteLinkService",
    "cookie": "这里粘贴unionPromoteLinkService的cookie"
  }'
```

### 步骤 4：验证 Cookie 已更新

```bash
# 查看当前保存的参数
curl http://localhost:4000/api/params

# 检查 cookie 长度是否增加
curl http://localhost:4000/api/params | jq '.unionSearchGoods.headers.cookie' -r | wc -c
```

正常情况下，完整的 cookie 长度应该在 **2000-5000 字符** 之间。

### 步骤 5：测试 API 调用

```bash
# 测试搜索商品
curl "http://localhost:4000/api/short-url?keyword=100198609685"
```

如果返回正常结果（不是"未登录"错误），说明 cookie 更新成功！

## 注意事项

1. **Cookie 会过期**：京东的 cookie 通常在几小时到几天后过期，过期后需要重新更新
2. **定期更新**：建议每天或在 API 失败时重新复制并更新 cookie
3. **安全性**：不要将包含完整 cookie 的 `.api-params.json` 文件提交到 git（已添加到 .gitignore）
4. **两个 functionId 都要更新**：`unionSearchGoods` 和 `unionPromoteLinkService` 可能使用不同的 cookie

## 自动化脚本（可选）

你也可以创建一个 shell 脚本来快速更新 cookie：

```bash
#!/bin/bash
# update-cookie.sh

echo "请粘贴从浏览器复制的完整 cookie，然后按 Enter："
read COOKIE

curl -X POST http://localhost:4000/api/update-cookie \
  -H "Content-Type: application/json" \
  -d "{\"functionId\": \"unionSearchGoods\", \"cookie\": \"$COOKIE\"}"

echo ""
echo "Cookie 已更新！"
```

使用方法：
```bash
chmod +x update-cookie.sh
./update-cookie.sh
```

## 为什么不能自动获取 httpOnly Cookie？

浏览器的 **httpOnly** flag 是一个安全特性，防止 JavaScript 访问这些 cookie，从而避免 XSS 攻击窃取会话。即使是 Tampermonkey 脚本也无法绕过这个限制，这是浏览器的底层安全机制。

唯一能访问完整 cookie 的方法是：
1. 浏览器扩展（需要 `webRequest` 权限）
2. 浏览器开发者工具（手动复制）
3. 代理服务器（拦截真实HTTP请求）

目前我们采用方案 2（手动复制），这是最简单且安全的方法。
