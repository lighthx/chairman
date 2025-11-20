/**
 * Cookie 管理器
 * 用于自动更新从服务器返回的 Cookie（如 sdtoken）
 * 并持久化到文件，支持重启后恢复
 */

import * as fs from 'fs';
import * as path from 'path';

interface CookieStore {
  [key: string]: string;
}

interface CookieCache {
  cookies: CookieStore;
  lastUpdate: number;
}

class CookieManager {
  private cookies: CookieStore = {};
  private baseCookie: string;
  private cacheFile: string;

  constructor(initialCookie: string, cacheFile: string = '.cookie-cache.json') {
    this.baseCookie = initialCookie;
    this.cacheFile = path.resolve(cacheFile);

    // 尝试从文件加载缓存的 Cookie
    this.loadFromCache() || this.parseCookies(initialCookie);
  }

  /**
   * 从缓存文件加载 Cookie
   */
  private loadFromCache(): boolean {
    try {
      if (fs.existsSync(this.cacheFile)) {
        const cacheData = fs.readFileSync(this.cacheFile, 'utf-8');
        const cache: CookieCache = JSON.parse(cacheData);

        // 检查缓存是否在 24 小时内
        const cacheAge = Date.now() - cache.lastUpdate;
        const maxAge = 24 * 60 * 60 * 1000; // 24 小时

        if (cacheAge < maxAge) {
          this.cookies = cache.cookies;
          console.log(`✅ 从缓存文件加载 Cookie（${(cacheAge / 1000 / 60).toFixed(0)} 分钟前更新）`);
          return true;
        } else {
          console.log(`⚠️  缓存文件已过期（${(cacheAge / 1000 / 60 / 60).toFixed(1)} 小时前）`);
        }
      }
    } catch (error) {
      console.log('⚠️  加载缓存文件失败，使用初始 Cookie');
    }
    return false;
  }

  /**
   * 保存 Cookie 到缓存文件
   */
  private saveToCache(): void {
    try {
      const cache: CookieCache = {
        cookies: this.cookies,
        lastUpdate: Date.now()
      };
      fs.writeFileSync(this.cacheFile, JSON.stringify(cache, null, 2), 'utf-8');
    } catch (error) {
      console.error('⚠️  保存缓存文件失败:', error);
    }
  }

  /**
   * 解析 Cookie 字符串为对象
   */
  private parseCookies(cookieString: string): void {
    const pairs = cookieString.split(';').map(pair => pair.trim());
    pairs.forEach(pair => {
      const [key, ...valueParts] = pair.split('=');
      const value = valueParts.join('='); // 处理值中可能包含 = 的情况
      if (key && value !== undefined) {
        this.cookies[key] = value;
      }
    });

    // 首次解析后保存到缓存
    this.saveToCache();
  }

  /**
   * 更新单个 Cookie 项
   */
  updateCookie(key: string, value: string): void {
    this.cookies[key] = value;
    console.log(`🔄 Cookie 已更新: ${key} = ${value.substring(0, 50)}...`);

    // 每次更新后保存到缓存文件
    this.saveToCache();
  }

  /**
   * 从响应头中提取并更新 sdtoken
   */
  updateFromResponseHeaders(headers: any): boolean {
    const sdtokenHeader = headers.get('x-rp-sdtoken');

    if (sdtokenHeader) {
      const parts = sdtokenHeader.split(';');
      if (parts.length >= 3 && parts[0] === 'set') {
        const expirySeconds = parseInt(parts[1]);
        const newSdtoken = parts[2];

        this.updateCookie('sdtoken', newSdtoken);

        return true;
      }
    }

    return false;
  }

  /**
   * 获取完整的 Cookie 字符串
   */
  getCookieString(): string {
    return Object.entries(this.cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ');
  }

  /**
   * 获取特定的 Cookie 值
   */
  getCookie(key: string): string | undefined {
    return this.cookies[key];
  }

  /**
   * 检查 Cookie 是否存在
   */
  hasCookie(key: string): boolean {
    return key in this.cookies;
  }

  /**
   * 重置为初始 Cookie
   */
  reset(): void {
    this.cookies = {};
    this.parseCookies(this.baseCookie);
    console.log('🔄 Cookie 已重置为初始状态');
  }

  /**
   * 打印当前 Cookie 状态（调试用）
   */
  debug(): void {
    console.log('=== Cookie 管理器状态 ===');
    console.log('Cookie 总数:', Object.keys(this.cookies).length);
    console.log('重要 Cookie:');
    ['sdtoken', 'token', 'pin', 'pinId'].forEach(key => {
      const value = this.cookies[key];
      if (value) {
        const displayValue = value.length > 50 ? value.substring(0, 50) + '...' : value;
        console.log(`  ${key}: ${displayValue}`);
      }
    });
  }
}

export default CookieManager;
