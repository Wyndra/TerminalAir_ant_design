import { PageContainer, ProCard } from "@ant-design/pro-components";
import React from 'react';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload, Avatar, Row, Col, Typography, Space } from 'antd';

const { Text, Title } = Typography;

const props: UploadProps = {
  name: 'file',
  accept: 'image/*',
  showUploadList: false,
  maxCount: 1,
  beforeUpload: file => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) message.error('只能上传图片文件');
    return isImage;
  },
  onChange(info) {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 上传成功`);
      // 这里可以添加图片预览逻辑
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  },
};

const Main: React.FC = () => {
  // 模拟用户数据
  const userData = {
    nickname: '用户昵称',
    address: '北京市朝阳区',
    phone: '138****1234',
    avatarUrl: '', // 实际应用中这里应该是图片URL
  };

  return (
    <PageContainer>
      <ProCard 
        bordered 
        style={{ maxWidth: 600, margin: '0 auto' }}
      >
        <Row gutter={24} align="middle">
          <Col>
            <Space direction="vertical" align="center">
              {/* 头像区域 */}
              {userData.avatarUrl ? (
                <Avatar 
                  size={128} 
                  src={userData.avatarUrl} 
                  className="avatar-upload"
                />
              ) : (
                <Avatar 
                  size={128} 
                  icon={<UserOutlined />} 
                  className="avatar-placeholder"
                />
              )}
              
              <Upload {...props}>
                <Button 
                  type="primary" 
                  icon={<UploadOutlined />}
                  style={{ marginTop: 16 }}
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
            {/* 用户信息区域 */}
            <Space direction="vertical">
              <div>
                <Text strong style={{ display: 'inline-block', width: 80 }}>昵称：</Text>
                <Text>{userData.nickname}</Text>
              </div>
              <div>
                <Text strong style={{ display: 'inline-block', width: 80 }}>地址：</Text>
                <Text>{userData.address}</Text>
              </div>
              <div>
                <Text strong style={{ display: 'inline-block', width: 80 }}>手机号：</Text>
                <Text>{userData.phone}</Text>
              </div>
              
              <Button type="link" style={{ paddingLeft: 0, marginTop: 8 }}>
                编辑个人信息
              </Button>
            </Space>
          </Col>
        </Row>
      </ProCard>
    </PageContainer>
  );
}

export default Main;