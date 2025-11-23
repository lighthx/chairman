import * as fs from 'fs';
import * as path from 'path';

interface RequestParams {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: string;
  timestamp: string;
}

interface StoredParams {
  unionSearchGoods?: RequestParams;
  unionPromoteLinkService?: RequestParams;
  lastUpdate: string;
}

class ParamsManager {
  private paramsFile: string;
  private params: StoredParams;

  constructor(paramsFile: string = '.api-params.json') {
    this.paramsFile = path.resolve(process.cwd(), paramsFile);
    this.params = this.loadFromFile();
  }

  private loadFromFile(): StoredParams {
    try {
      if (fs.existsSync(this.paramsFile)) {
        const data = fs.readFileSync(this.paramsFile, 'utf-8');
        const params = JSON.parse(data);
        console.log('✅ 从文件加载 API 参数');
        return params;
      }
    } catch (error) {
      console.error('⚠️  加载 API 参数失败:', error);
    }

    return {
      lastUpdate: new Date().toISOString()
    };
  }

  private saveToFile(): void {
    try {
      const data = JSON.stringify(this.params, null, 2);
      fs.writeFileSync(this.paramsFile, data, 'utf-8');
      console.log('💾 API 参数已保存到文件');
    } catch (error) {
      console.error('❌ 保存 API 参数失败:', error);
    }
  }

  public saveParams(functionId: string, requestData: RequestParams): void {
    if (functionId === 'unionSearchGoods') {
      this.params.unionSearchGoods = requestData;
      console.log('📝 更新 unionSearchGoods 参数');
    } else if (functionId === 'unionPromoteLinkService') {
      this.params.unionPromoteLinkService = requestData;
      console.log('📝 更新 unionPromoteLinkService 参数');
    }

    this.params.lastUpdate = new Date().toISOString();
    this.saveToFile();
  }

  public getParams(functionId: string): RequestParams | undefined {
    if (functionId === 'unionSearchGoods') {
      return this.params.unionSearchGoods;
    } else if (functionId === 'unionPromoteLinkService') {
      return this.params.unionPromoteLinkService;
    }
    return undefined;
  }

  public getAllParams(): StoredParams {
    return this.params;
  }

  public getCookie(): string {
    // 优先从 unionSearchGoods 获取 cookie
    const searchParams = this.params.unionSearchGoods;
    if (searchParams && searchParams.headers && searchParams.headers.cookie) {
      return searchParams.headers.cookie;
    }

    // 其次从 unionPromoteLinkService 获取
    const linkParams = this.params.unionPromoteLinkService;
    if (linkParams && linkParams.headers && linkParams.headers.cookie) {
      return linkParams.headers.cookie;
    }

    return '';
  }

  public getHeader(functionId: string, headerName: string): string {
    const params = this.getParams(functionId);
    if (params && params.headers) {
      return params.headers[headerName.toLowerCase()] || '';
    }
    return '';
  }
}

export default ParamsManager;
