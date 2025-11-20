import express, { Request, Response } from 'express';
import { getShortUrlForProduct, searchJDGoods, getPromotionLink } from './index';

const app = express();
const port = process.env.PORT || 4000;

// 解析 JSON 请求体
app.use(express.json());

/**
 * GET /api/short-url?keyword=商品关键词
 * 获取商品的推广短链接（完整流程：搜索+生成短链接）
 */
app.get('/api/short-url', async (req: Request, res: Response) => {
  try {
    const { keyword } = req.query;

    if (!keyword || typeof keyword !== 'string') {
      return res.status(400).json({
        success: false,
        message: '请提供 keyword 参数'
      });
    }

    const result = await getShortUrlForProduct(keyword);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: '未找到商品'
      });
    }

    res.json({
      success: true,
      data: result.data,
      message: result.message
    });
  } catch (error) {
    console.error('获取短链接失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * POST /api/search
 * 搜索京东商品
 * Body: { "keyWord": "商品关键词", "pageNo": 1, "pageSize": 60 }
 */
app.post('/api/search', async (req: Request, res: Response) => {
  try {
    const { keyWord, pageNo, pageSize } = req.body;

    if (!keyWord) {
      return res.status(400).json({
        success: false,
        message: '请提供 keyWord 参数'
      });
    }

    const result = await searchJDGoods({
      keyWord,
      pageNo: pageNo || 1,
      pageSize: pageSize || 60
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('搜索商品失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * POST /api/promotion-link
 * 获取推广链接
 * Body: { "materialId": "商品ID", "planId": "计划ID", "requestId": "请求ID(可选)" }
 */
app.post('/api/promotion-link', async (req: Request, res: Response) => {
  try {
    const { materialId, planId, requestId } = req.body;

    if (!materialId || !planId) {
      return res.status(400).json({
        success: false,
        message: '请提供 materialId 和 planId 参数'
      });
    }

    const result = await getPromotionLink({
      materialId,
      planId,
      requestId
    });

    res.json({
      success: true,
      data: result.data,
      message: result.message
    });
  } catch (error) {
    console.error('获取推广链接失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * GET /health
 * 健康检查接口
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`京东短链接服务已启动`);
  console.log(`监听端口: ${port}`);
  console.log(`\n可用接口:`);
  console.log(`  GET  /api/short-url?keyword=商品关键词`);
  console.log(`  POST /api/search`);
  console.log(`  POST /api/promotion-link`);
  console.log(`  GET  /health`);
});

export default app;
