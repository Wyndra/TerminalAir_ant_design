import { request } from '@umijs/max';

// 定义凭证数据类型
export interface CredentialsItem {
    id: number;
    uuid: string;
    name: string;
    tags: string;
    fingerprint: string;
    status: number;
    publicKey: string;
    connectId: number;
    createTime: string;
}

// 定义API响应类型
export interface CredentialsResponse {
    timestamp: number;
    status: number;
    message: string;
    data: {
        current: number;
        pageSize: number;
        total: number;
        result: CredentialsItem[];
    };
}

/** 获取凭证列表 GET /api/credentials */
export async function getCredentialsList(params: any) {
    return request<CredentialsResponse>('/api/credentials', {
        method: 'GET',
        params: {
            ...params,
        }
    });
}