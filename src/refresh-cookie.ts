/**
 * Cookie 刷新脚本
 * 通过发送一个测试请求来触发 Cookie 自动更新
 * 用于 cronjob 定时执行
 */

import { searchJDGoods } from './index';

async function refreshCookie() {
  console.log('=== Cookie 刷新任务开始 ===');
  console.log('执行时间:', new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));

  try {
    // 发送一个简单的搜索请求来触发 Cookie 更新
    const result = await searchJDGoods({
      keyWord: '100198609685',
      pageSize: 1  // 只获取1条结果，减少响应数据
    });

    if (result.code === 200) {
      console.log('✅ Cookie 刷新成功');
      console.log('📊 响应状态: 正常');
    } else {
      console.log('⚠️  Cookie 刷新完成，但返回异常状态码:', result.code);
      console.log('📋 错误信息:', result.message);
    }
  } catch (error) {
    console.error('❌ Cookie 刷新失败:', error instanceof Error ? error.message : String(error));
    process.exit(1);  // 失败时返回非零退出码
  }

  console.log('=== Cookie 刷新任务完成 ===\n');
}

// 执行刷新任务
refreshCookie();
