import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message as msg, notification } from 'antd';

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
// 与后端约定的响应数据格式
// interface ResponseStructure {
//   success: boolean;
//   data: any;
//   errorCode?: number;
//   errorMessage?: string;
//   showType?: ErrorShowType;
// }

interface ResponseStructure {
  timestamp: number;
  status: number;
  message: string;
  data: any;
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      // 解构响应数据
      const { timestamp, status, message, data } = res as unknown as ResponseStructure;
      if (status !== 200) {
        const error: any = new Error(message);
        error.name = 'BizError';
        error.info = { timestamp, status, message, data };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        // 如果这个 error.info 存在，说明是业务错误
        if (errorInfo) {
          const { message, status } = errorInfo;
          msg.error(`${status}: ${message}`);
        }
      } else {
        // 发送请求时出了点问题
        msg.error('Request error, please retry.');
      }
      localStorage.removeItem('token'); // 清除 token
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
      // const url = config?.url?.concat('?token = 123');
      config.headers = {
        ...config.headers,
        // 判断token是否存在，如果不在则不带
        ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {})
      }
      return { ...config };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response as unknown as ResponseStructure;

      
      data?.data.result?.map((item: any) => {
        item.tags = item.tags + ',测试标签';  
      });
      
      if (data?.status === 500) {
        msg.error('请求失败！');
      }
      if (data?.status === 401){
        // 401状态码可能是用户没有权限或者 token过期
        msg.error('未授权，请重新登录！');
        localStorage.removeItem('token');
      }
      return response;
    },
  ],
};
