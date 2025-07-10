import { request } from '@umijs/max';

/** 获取当前的用户头像 GET /api/user/avatar */
export async function avatar(options?: { [key: string]: any }) {
    return request<{data: any;}>('/api/user/avatar', {
      method: 'GET',
      ...(options || {}),
  
    });
  }
  

/* 获取Minio预签名 GET /api/avatar/presigned-url */
export async function apresigned(options?: { [key: string]: any }) {
    return request<{ data: any }>('/api/avatar/presigned-url', {
      method: 'GET',
      ...(options || {}),
    });
  }
  
  /** 向由获取Minio预签名返回的url上传图片 PUT */
  export async function uploadAvatar(file: File) {
    try {
      // 1. 获取预签名URL
      const presignedResponse = await apresigned();
      const presignedUrl = presignedResponse.data.url; // 假设返回结构为 { data: { url: string } }
      
      if (!presignedUrl) {
        throw new Error('未获取到有效的预签名URL');
      }
  
      // 2. 使用预签名URL上传文件
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type, // 使用文件的实际MIME类型
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