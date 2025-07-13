import { currentConnectList } from "@/services/Connect";
import { EyeInvisibleOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { ModalForm, PageContainer, ProBreadcrumb, ProCard, ProColumns, ProForm, ProFormText, ProFormSelect,ProTable } from "@ant-design/pro-components";
import { Button, Form, Tag, Space, message } from "antd";
import React, { useState } from "react";


interface ConnectItem {
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

interface ConnectListResponse {
  timestamp: number;
  status: number;
  message: string;
  data: ConnectItem[];
}

const ConnectList: React.FC = () => {
    const [form] = Form.useForm()
    const [visible, setVisible] = useState(false);
    const columns: ProColumns<ConnectItem>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: '名称',
            dataIndex: 'name',
        },
        {
            title: '主机',
            dataIndex: 'host',
        },
        {
            title: '端口',
            dataIndex: 'port',
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '密码',
            dataIndex: 'password',
            render: (text, record) => {
              
              
              return (
                <Space>
                  <Button 
                    type="text" 
                    icon={visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    onClick={() => setVisible(!visible)}
                  />
                  {visible?(
                    <span>{text}</span>
                  ) : (
                    <span>{text ? '•'.repeat(3) : ''}</span>
                  )}
                </Space>
              );
            }
          },
        {
            title: '认证方式',
            dataIndex: 'method',
            render: (_, record) => (
                <Tag color={record.method === 'password' ? 'blue' : 'green'}>
                    {record.method}
                </Tag>
            ),
        },
        {
            title: '凭证UUID',
            dataIndex: 'credentialUUID',
            ellipsis: true,
        },
        {
            title: '操作',
            key: 'action',
            render: () => (
                <Space>
                    <a>编辑</a>
                    <a style={{ color: 'red' }}>删除</a>
                </Space>
            ),
        },
    ];
    
    return (
        <PageContainer
            header={{ title: false }}
            pageHeaderRender={() => {
                return (
                    <ProCard style={{ marginBottom: 16, borderRadius: 8 }}>
                        <ProBreadcrumb />
                    </ProCard>
                );
            }}
        >
            <ProCard style={{ borderRadius: 8, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
                <ProTable<ConnectItem>
                    columns={columns}
                    rowKey="id"
                    search={false}
                    headerTitle="连接列表"
                    request={async (params) => {
                        try {
                            const response: ConnectListResponse = await currentConnectList({
                                current: params.current,
                                pageSize: params.pageSize,
                            });
                            
                            // 根据接口结构返回数据
                            return {
                                data: response.data || [],
                                success: response.status === 200,
                                total: response.data?.length || 0,
                            };
                        } catch (error) {
                            console.error('获取连接列表失败:', error);
                            return {
                                data: [],
                                success: false,
                                total: 0,
                            };
                        }
                    }}
                    
                />
            </ProCard>
        </PageContainer>
    );
}

export default ConnectList;