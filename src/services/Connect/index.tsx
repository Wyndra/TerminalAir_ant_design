import { request } from '@umijs/max';

// 定义单个连接项的类型
export interface ConnectItem {
  id: number;
  uuid: string;
  host: string;
  port: string;
  username: string;
  password?: string;
  name: string;
  method: string;
  credentialUUID: string;
  credential: object;
  user_id: number;
}

// 定义连接列表接口响应类型
export interface ConnectListResponse {
  timestamp: number;
  status: number;
  message: string;
  data: ConnectItem[];
}

// 定义创建连接响应类型
export interface CreateConnectResponse {
  timestamp: number;
  status: number;
  message: string;
  data: ConnectItem;
}

/**
 * 获取连接列表 GET /api/connection
 * @param options 请求选项
 * @returns 连接列表响应
 */
export async function currentConnectList(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any }
): Promise<ConnectListResponse> {
  return request<ConnectListResponse>('/api/connection', {
    method: 'GET',
    params: {
      page: params.current,
      size: params.pageSize,
    },
    ...(options || {}),
  });
}

/**
 * 创建连接 POST /api/connection
 * @param data 连接数据
 * @param options 请求选项
 * @returns 创建连接响应
 */
export async function createConnection(
  data: Omit<ConnectItem, 'id' | 'user_id' | 'credential' | 'uuid'>,
  options?: { [key: string]: any }
): Promise<CreateConnectResponse> {
  return request<CreateConnectResponse>('/api/connection', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}