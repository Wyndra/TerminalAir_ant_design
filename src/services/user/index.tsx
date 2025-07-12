import { request } from '@umijs/max';

// 定义用户信息类型
export interface UserProfile {
  nickname: string;
  email?: string;
  phone?: string;
  avatar?: string;
  [key: string]: any; // 允许其他属性
}

/* 获取当前用户信息 GET /api/user */
export async function currentUser(options?: { [key: string]: any }) {
  return request<{
    data: UserProfile;
  }>('/api/user', {
    method: 'GET',
    ...(options || {}),
  });
}

/* 获取当前用户头像 GET /api/user/avatar */
export async function avatar(options?: { [key: string]: any }) {
  return request<{ data: string }>('/api/user/avatar', {
    method: 'GET',
    ...(options || {}),
  });
}

/* 修改个人信息 PUT /api/user */
export async function updateUserInfo(
  data: Partial<UserProfile>,
  options?: { [key: string]: any }
) {
  return request<{ success: boolean; message: string }>('/api/user', {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

/* 获取Minio预签名 GET /api/avatar/presigned-url */
export async function apresigned(options?: { [key: string]: any }) {
  return request<{ data: {
    filePath: any; url: string 
} }>('/api/avatar/presigned-url', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 向由获取Minio预签名返回的url上传图片 PUT */
export async function uploadAvatar(file: File) {
  try {
    // 1. 获取预签名URL
    const presignedResponse = await apresigned();
    const presignedUrl = presignedResponse.data.url;
    
    if (!presignedUrl) {
      throw new Error('未获取到有效的预签名URL');
    }

    // 2. 使用预签名URL上传文件
    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(file.name)}"`,
      },
      body: file,
    });

    // 3. 处理上传结果
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`上传失败: ${uploadResponse.status} - ${errorText}`);
    }

    return {
      success: true,
      status: uploadResponse.status,
      message: '头像上传成功',
    };
  } catch (error) {
    console.error('上传头像出错:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : '未知错误',
    };
  }
}
