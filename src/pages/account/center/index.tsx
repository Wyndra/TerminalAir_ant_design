import { PageContainer, ProCard } from "@ant-design/pro-components";
import React, { useEffect, useState } from 'react';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload, Avatar, Row, Col, Typography, Space } from 'antd';
import {avatar, uploadAvatar} from '@/services/user'
import {currentUser} from '@/services/ant-design-pro/api'
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
// 定义用户信息类型
interface UserProfile {
    nickname: string;
    email: string;
    phone: string;
    avatarUrl?: string;
    [key: string]: any; // 允许其他属性
  }
  
const Main: React.FC = () => {
  // 模拟用户数据
  const [userData, setUserData] = useState<UserProfile>({
    nickname: '',
    email: '',
    phone: '',
    avatarUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
const fetchUserInfo=async ()=>{
    try{
        setAvatarLoading(true);
        const profileResponse =await currentUser();
        if(profileResponse.data){
            setUserData(prev=>({
                ...prev,
                ...profileResponse.data
            }))
        }
    }catch(error){
        message.error('获取用户信息失败');
    }finally{
        setAvatarLoading(false);
    }
}
    useEffect(() => {
    fetchUserInfo(); // 组件加载时调用数据获取函数
  }, []);
const [isEditing,setIsEditing]=useState(false);
const [editingUserData, setEditingUserData] = useState<UserProfile>({...userData});
const handleEditClick =()=>{
    setEditingUserData({...userData});
    setIsEditing(true);
}
const handleSaveClick=()=>{
    setUserData(editingUserData)
    setIsEditing(false)
    message.success("个人信息修改成功")
}
const handleCancelClick=()=>{
    setIsEditing(false)
}
  return (
    <PageContainer 
      header={{ title: '个人中心' }}
      content="管理您的个人信息和账户设置"
    >
      <ProCard 
        bordered 
        style={{ maxWidth: 600, margin: '0 auto' }}
        title="个人信息"
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
                {isEditing?(
                    <input value={editingUserData.nickname}
                ></input>):(<Text>{userData.nickname}</Text>)}
              </div>
              <div>
              <Text strong style={{ display: 'inline-block', width: 80 }}>邮箱：</Text>
                {isEditing?(<input value={editingUserData.email}></input>):(<Text>{userData.email}</Text>)}
              </div>
              <div>
              <Text strong style={{ display: 'inline-block', width: 80 }}>手机号：</Text>
                {isEditing?(<input value={editingUserData.phone}></input>):(<Text>{userData.phone}</Text>)}
              </div>
              <div style={{marginTop:8}}>
                {isEditing?(
              <Space>
                <Button type="primary" onClick={handleSaveClick}>保存</Button>
                <Button onClick={handleCancelClick}>取消</Button>
              </Space>):
              <Button type="link" style={{ paddingLeft: 0, marginTop: 8 }} onClick={handleEditClick}>
                编辑个人信息
              </Button>}
              </div>
            </Space>
          </Col>
        </Row>
      </ProCard>
    </PageContainer>
  );
}

export default Main;