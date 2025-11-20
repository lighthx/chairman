# Cookie 自动刷新 Cronjob 配置指南

## 概述

为了保持 Cookie 始终有效，建议配置定时任务每小时自动刷新一次。刷新脚本会发送一个测试请求来触发 `sdtoken` 的自动更新，并保存到缓存文件。

## 🚀 快速开始

### 1. 测试刷新脚本

首先确认刷新脚本可以正常运行：

```bash
npm run refresh
```

预期输出：
```
=== Cookie 刷新任务开始 ===
执行时间: 2025/11/20 14:30:45
✅ 从缓存文件加载 Cookie（15 分钟前更新）
🔄 Cookie 已更新: sdtoken = AAbEsBpEIOVjqTAKCQtvQu17...
⏰ 新 sdtoken 将在 30 分钟后过期
💾 已保存到 .cookie-cache.json
✅ Cookie 刷新成功
📊 响应状态: 正常
=== Cookie 刷新任务完成 ===
```

### 2. 配置 Crontab（推荐）

#### macOS / Linux

编辑 crontab：

```bash
crontab -e
```

添加以下内容（**请修改路径为你的实际项目路径**）：

```bash
# 每小时的第0分钟执行 Cookie 刷新
0 * * * * cd /Users/huaxin/my_projects/jd_short_url_generator && /usr/local/bin/npm run refresh >> logs/cookie-refresh.log 2>&1
```

**重要说明**：
- `cd /path/to/project` - 替换为你的项目实际路径
- `/usr/local/bin/npm` - npm 的完整路径（可通过 `which npm` 查看）
- `logs/cookie-refresh.log` - 日志文件路径（需要先创建 logs 目录）

#### 创建日志目录

```bash
mkdir -p logs
```

#### 验证 Crontab

查看已配置的定时任务：

```bash
crontab -l
```

#### Crontab 时间格式说明

```
* * * * * 命令
│ │ │ │ │
│ │ │ │ └─ 星期几 (0-7, 0和7都代表周日)
│ │ │ └─── 月份 (1-12)
│ │ └───── 日期 (1-31)
│ └─────── 小时 (0-23)
└───────── 分钟 (0-59)
```

**常用示例**：

```bash
# 每小时执行一次（推荐）
0 * * * * command

# 每30分钟执行一次
0,30 * * * * command

# 每天凌晨2点执行
0 2 * * * command

# 每周一早上9点执行
0 9 * * 1 command

# 每隔2小时执行一次
0 */2 * * * command
```

### 3. 配置 PM2（生产环境推荐）

如果你使用 PM2 管理 Node.js 应用，可以使用 PM2 的 cron 功能：

#### 安装 PM2

```bash
npm install -g pm2
```

#### 创建 PM2 配置文件

创建 `ecosystem.config.js`：

```javascript
module.exports = {
  apps: [
    {
      name: 'jd-short-url-api',
      script: 'dist/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'cookie-refresh',
      script: 'npm',
      args: 'run refresh',
      autorestart: false,
      cron_restart: '0 * * * *', // 每小时执行
      watch: false
    }
  ]
};
```

#### 启动服务

```bash
# 构建项目
npm run build

# 启动 API 服务和定时任务
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs cookie-refresh

# 设置开机自启
pm2 startup
pm2 save
```

### 4. 使用 Node-Cron（适合开发环境）

如果想在应用内部集成定时任务，可以使用 `node-cron`：

#### 安装依赖

```bash
npm install node-cron
npm install --save-dev @types/node-cron
```

#### 修改 server.ts

在 [src/server.ts](src/server.ts) 中添加：

```typescript
import cron from 'node-cron';
import { searchJDGoods } from './index';

// ... 现有代码 ...

// 添加定时任务：每小时执行一次 Cookie 刷新
cron.schedule('0 * * * *', async () => {
  console.log('=== 定时任务: Cookie 刷新开始 ===');
  console.log('执行时间:', new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));

  try {
    const result = await searchJDGoods({
      keyWord: '100198609685',
      pageSize: 1
    });

    if (result.code === 200) {
      console.log('✅ Cookie 自动刷新成功');
    } else {
      console.log('⚠️  Cookie 刷新返回异常:', result.code);
    }
  } catch (error) {
    console.error('❌ Cookie 自动刷新失败:', error);
  }

  console.log('=== 定时任务: Cookie 刷新完成 ===\n');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('Cookie 自动刷新任务已启动（每小时执行一次）');
});
```

## 📊 监控和日志

### 查看 Crontab 日志

```bash
# 实时查看日志
tail -f logs/cookie-refresh.log

# 查看最近的日志
tail -n 50 logs/cookie-refresh.log

# 搜索失败的记录
grep "❌" logs/cookie-refresh.log
```

### 日志轮转（可选）

为了防止日志文件过大，可以配置日志轮转：

创建 `/etc/logrotate.d/jd-cookie-refresh`：

```
/Users/huaxin/my_projects/jd_short_url_generator/logs/cookie-refresh.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
}
```

## 🔧 故障排查

### 问题 1: Crontab 没有执行

**可能原因**：
- cron 服务未启动
- 路径不正确
- npm 命令找不到

**解决方法**：

```bash
# 1. 确认 cron 服务运行中
sudo systemctl status cron  # Linux
# macOS 的 cron 默认启动，无需检查

# 2. 使用绝对路径
which npm  # 查看 npm 完整路径
which node # 查看 node 完整路径

# 3. 在 crontab 中添加 PATH
PATH=/usr/local/bin:/usr/bin:/bin
0 * * * * cd /path/to/project && npm run refresh >> logs/cookie-refresh.log 2>&1
```

### 问题 2: 权限错误

```bash
# 确保日志目录有写权限
chmod 755 logs
chmod 644 logs/cookie-refresh.log
```

### 问题 3: Cookie 刷新失败

**检查步骤**：

1. 手动运行测试：
```bash
npm run refresh
```

2. 检查 Cookie 是否过期：
```bash
cat .cookie-cache.json
```

3. 查看缓存文件更新时间：
```bash
ls -lh .cookie-cache.json
```

4. 如果 Cookie 确实过期，需要从浏览器重新获取：
   - 参考 [README.md](README.md) 的配置章节
   - 更新 `src/index.ts` 中的 `INITIAL_COOKIE`

## ⚙️ 高级配置

### 调整刷新频率

根据实际使用情况，可以调整刷新频率：

```bash
# 每30分钟刷新（更频繁，更保险）
0,30 * * * * cd /path/to/project && npm run refresh >> logs/cookie-refresh.log 2>&1

# 每2小时刷新（测试表明 Cookie 可用3+小时）
0 */2 * * * cd /path/to/project && npm run refresh >> logs/cookie-refresh.log 2>&1
```

### 添加告警通知

修改 [src/refresh-cookie.ts](src/refresh-cookie.ts) 添加失败通知：

```typescript
// 失败时发送邮件或调用 webhook
if (result.code !== 200) {
  // 示例：调用钉钉 webhook
  await fetch('https://oapi.dingtalk.com/robot/send?access_token=xxx', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      msgtype: 'text',
      text: { content: `⚠️ Cookie 刷新失败: ${result.message}` }
    })
  });
}
```

## 📝 总结

**推荐配置方案**：

1. **开发环境**：使用 `node-cron`（集成在应用内）
2. **生产环境**：使用 PM2 + cron（稳定可靠）
3. **简单场景**：使用系统 crontab（轻量级）

**刷新频率建议**：
- 保守方案：每30分钟刷新一次
- 均衡方案：每小时刷新一次（推荐）
- 宽松方案：每2小时刷新一次（根据测试，Cookie 可用3+小时）

**监控重点**：
- 定期检查日志文件，确保刷新任务正常执行
- 关注失败率，如果频繁失败可能需要更新长期 Cookie
- 监控 `.cookie-cache.json` 的更新时间
