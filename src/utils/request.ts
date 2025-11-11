import Taro from '@tarojs/taro';

// 请求方法类型
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// 请求配置接口
export interface RequestConfig {
  method?: RequestMethod;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  showError?: boolean;
}

// 响应接口
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number;
}

// 请求错误类
export class RequestError extends Error {
  public status?: number;
  public code?: number;

  constructor(message: string, status?: number, code?: number) {
    super(message);
    this.name = 'RequestError';
    this.status = status;
    this.code = code;
  }
}

// 创建请求URL
const createURL = (endpoint: string): string => {
  const baseURL = 'http://192.168.0.100:3000/api';
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseURL}${cleanEndpoint}`;
};

// 主请求函数
export const request = async <T = any>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> => {
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = 10000,
  } = config;

  const url = createURL(endpoint);

  // 自动加 token
  let token = '';
  try {
    token = Taro.getStorageSync('userToken') || '';
  } catch {}

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // 如果有 token，添加到 headers
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    // 使用 Taro.request 替代 fetch，并用 Promise 包装
    const response = await new Promise<Taro.request.SuccessCallbackResult>((resolve, reject) => {
      const requestTask = Taro.request({
        url,
        method: method as any,
        header: requestHeaders,
        data: body && method !== 'GET' ? body : undefined,
        timeout,
        success: (res) => {
          resolve(res);
        },
        fail: (err) => {
          reject(new RequestError(err.errMsg || '网络请求失败'));
        },
      });

      // 如果设置了超时，添加超时处理
      if (timeout > 0) {
        setTimeout(() => {
          requestTask.abort();
          reject(new RequestError('请求超时'));
        }, timeout);
      }
    });

    // 检查 HTTP 状态码
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return {
        success: true,
        data: response.data as T,
        code: response.statusCode,
      };
    } else {
      const errorMessage = (response.data as any)?.message || `HTTP ${response.statusCode}`;
      throw new RequestError(errorMessage, response.statusCode);
    }
  } catch (error) {
    if (error instanceof RequestError) {
      throw error;
    }
    
    // 网络错误或其他错误
    const errorMessage = error instanceof Error ? error.message : '网络请求失败';
    throw new RequestError(errorMessage);
  }
};

// 便捷方法
export const get = <T = any>(endpoint: string, config?: Omit<RequestConfig, 'method'>) =>
  request<T>(endpoint, { ...config, method: 'GET' });

export const post = <T = any>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>) =>
  request<T>(endpoint, { ...config, method: 'POST', body });

export const put = <T = any>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>) =>
  request<T>(endpoint, { ...config, method: 'PUT', body });

export const del = <T = any>(endpoint: string, config?: Omit<RequestConfig, 'method'>) =>
  request<T>(endpoint, { ...config, method: 'DELETE' });

export const patch = <T = any>(endpoint: string, body?: any, config?: Omit<RequestConfig, 'method' | 'body'>) =>
  request<T>(endpoint, { ...config, method: 'PATCH', body }); 