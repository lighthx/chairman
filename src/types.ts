/**
 * 京东联盟媒体列表项
 */
export interface MediaItem {
  id?: string;
  name?: string;
  [key: string]: any;
}

/**
 * 京东联盟API响应数据部分
 */
export interface JDMediaListData {
  hasNext: boolean;
  listType: number;
  pageNo: number;
  pageSize: number;
  result: MediaItem[];
  total: number;
}

/**
 * 京东联盟API完整响应结构
 */
export interface JDMediaListResponse {
  code: number;
  data: JDMediaListData;
  hasNext: boolean;
  message: string;
  totalNum: number;
}

/**
 * 请求参数接口
 */
export interface FetchMediaListParams {
  mediaType?: number | string;  // 媒体类型，例如: 15 或 "100198609685"
  pageNo?: number;              // 页码
  pageSize?: number;            // 每页数量
  status?: number;              // 状态
}
