import { PageContainer, ProBreadcrumb, ProCard, ProFormText } from "@ant-design/pro-components";
import React, { useEffect, useState } from 'react';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import {
  Button, message, Upload, Avatar, Row, Col, Typography, Space, Input,
} from 'antd';
import { updateUserInfo, apresigned } from '@/services/user';
import { currentUser } from '@/services/ant-design-pro/api';

const { Text } = Typography;

interface UserProfile {
  nickname: string;
  email?: string;
  phone?: string;
  avatar?: string;
  [key: string]: any;
}

const Main: React.FC = () => {
  const [userData, setUserData] = useState<UserProfile>({
    nickname: '',
    email: '',
    phone: '',
    avatar: '',
  });

  const [editingData, setEditingData] = useState<UserProfile>({ ...userData });
  const [isEditing, setIsEditing] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const profileResponse = await currentUser();
      if (profileResponse?.data) {
        setUserData(profileResponse.data);
        setEditingData(profileResponse.data);
      }
    } catch (error) {
      message.error('获取用户信息失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleSaveClick = async () => {
    try {
      setLoading(true);
      const { nickname, email} = editingData; 
      const res = await updateUserInfo({ nickname, email});

      if (res?.success) {
        setUserData(editingData);
        setIsEditing(false);
        message.success('个人信息修改成功');
      } else {
        message.error(res?.message || '修改失败');
      }
    } catch (err) {
      console.error(err);
      message.error('修改失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    setEditingData(userData);
    setIsEditing(false);
  };

  const uploadProps: UploadProps = {
    name: 'file',
    accept: 'image/*',
    showUploadList: true,
    maxCount: 1,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isImage) {
        message.error('只能上传图片文件');
        return false;
      }
      if (!isLt2M) {
        message.error('图片大小不能超过2MB');
        return false;
      }
      return true;
    },
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        setAvatarLoading(true);
        const f = file as File;
        const presignedRes = await apresigned();
        const url = presignedRes?.data?.url;
        const filePath = presignedRes?.data?.filePath;
        if (!url) throw new Error('获取头像上传地址失败');

        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': f.type,
            'Content-Disposition': `attachment; filename="${encodeURIComponent(f.name)}"`,
          },
          body: f,
        });

        if (!response.ok) throw new Error('上传失败: ' + response.statusText);
        const objectUrl = url.split('?')[0];
        await updateUserInfo({ avatar: filePath });
        
        setUserData(prev => ({
          ...prev!,
          avatar: filePath // 使用返回的文件路径
        }));

        message.success('头像上传成功');
        onSuccess?.({}, f);
      } catch (error) {
        console.error(error);
        message.error('头像上传失败');
        onError?.(error as any);
      } finally {
        setAvatarLoading(false);
      }
    },
  };

  return (
    <PageContainer
    header={{ title: false }}
    pageHeaderRender={() => {
        return <ProCard
            style={{
                marginBottom: 16,
                borderRadius: 8
            }}>
            <ProBreadcrumb />
        </ProCard>;
    }}
    >
      <ProCard
        bordered
        title="个人信息"
        loading={loading || avatarLoading}
      >
        <Row gutter={24} align="middle">
          <Col>
            <Space direction="vertical" align="center">
              {userData.avatar ? (
                <Avatar size={128} src={userData.avatar} />
              ) : (
                <Avatar size={128} icon={<UserOutlined />} />
              )}

              <Upload {...uploadProps}>
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  style={{ marginTop: 16 }}
                  loading={avatarLoading}
                >
                  更换头像
                </Button>
              </Upload>

              <Text type="secondary" style={{ fontSize: 12, marginTop: 4 }}>
                支持 JPG/PNG 格式，大小不超过 2MB
              </Text>
            </Space>
          </Col>

          <Col flex="auto">
            <Space direction="vertical" size="middle">
              <div>
                <ProFormText
                label="昵称"
                name="nickname"
                initialValue={userData.nickname}
                fieldProps={{
                  disabled: !isEditing,
                  value:isEditing? editingData.nickname :userData.nickname,
                  onChange: e=>setEditingData({...editingData,nickname:e.target.value})
                }}/>
              </div>
              <div>
                <ProFormText
                label="邮箱"
                name="email"
                width={240}
                initialValue={userData.email}
                fieldProps={{
                  disabled: !isEditing,
                  value:isEditing? editingData.email :userData.email,
                  onChange: e=>setEditingData({...editingData,email:e.target.value})
                }}/>
              </div>
             

              <div>
                <Text strong style={{ width: 80, display: 'inline-block' }}>手机号：</Text>
                <Text>{userData.phone || '-'}</Text>
              </div>

              <div style={{ marginTop: 8 }}>
                {isEditing ? (
                  <Space>
                    <Button type="primary" onClick={handleSaveClick} loading={loading}>
                      保存
                    </Button>
                    <Button onClick={handleCancelClick} disabled={loading}>
                      取消
                    </Button>
                  </Space>
                ) : (
                  <Button type="link" onClick={() => setIsEditing(true)}>
                    编辑个人信息
                  </Button>
                )}
              </div>
            </Space>
          </Col>
        </Row>
      </ProCard>
    </PageContainer>
  );
};

export default Main;
