import { createConnection, currentConnectList } from "@/services/Connect";
import { EyeInvisibleOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import {ModalForm,PageContainer,ProBreadcrumb,ProCard,ProColumns,ProFormText,ProFormSegmented,ProTable,ProForm,ActionType} from "@ant-design/pro-components";
import { Button, Form, Tag, Space, message } from "antd";
import React, { useRef, useState } from "react";
import { AddConnectRequest, ConnectItem } from "@/services/Connect";

const ConnectList: React.FC = () => {
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();

  const authMethods = [
    { label: "密码认证", value: "0" },
    { label: "凭证认证", value: "1" },
  ];

  const columns: ProColumns<ConnectItem>[] = [
    {
      dataIndex: "index",
      valueType: "indexBorder",
      width: 60,
    },
    {
      title: "名称",
      dataIndex: "name",
    },
    {
      title: "主机",
      dataIndex: "host",
    },
    {
      title: "端口",
      dataIndex: "port",
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "密码",
      dataIndex: "password",
      valueType: "password",
      width: 300,
    },
    {
      title: "认证方式",
      dataIndex: "method",
      render: (_, record) => {
        const label = record.method === "0" ? "密码认证" : "凭证认证";
        const color = record.method === "0" ? "blue" : "green";
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "凭证UUID",
      dataIndex: "credentialUUID",
      ellipsis: true,
      render: (text, record) => (record.method === "1" ? text : "-"),
    },
    {
      title: "操作",
      key: "action",
      render: () => (
        <Space>
          <a>编辑</a>
          <a style={{ color: "red" }}>删除</a>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{ title: false }}
      pageHeaderRender={() => (
        <ProCard style={{ marginBottom: 16, borderRadius: 8 }}>
          <ProBreadcrumb />
        </ProCard>
      )}
    >
      <ProCard style={{ borderRadius: 8, boxShadow: "0 1px 2px 0 rgba(0,0,0,0.03)" }}>
        <ProTable<ConnectItem>
          actionRef={actionRef}
          columns={columns}
          rowKey="id"
          search={false}
          headerTitle="连接列表"
          request={async (params = {}) => {
            const current = params.current ?? 1;
            const pageSize = params.pageSize ?? 10;

            try {
              const response = await currentConnectList({ current, pageSize });
              return {
                data: response.data || [],
                success: response.status === 200,
                total: response.data?.length || 0,
              };
            } catch (error) {
              console.error("获取连接列表失败:", error);
              return {
                data: [],
                success: false,
                total: 0,
              };
            }
          }}
          toolBarRender={() => [
            <ModalForm<AddConnectRequest>
              key="create-connection"
              title="新建连接"
              trigger={
                <Button type="primary">
                  <PlusOutlined />
                  创建连接
                </Button>
              }
              form={form}
              width={550}
              autoFocusFirstInput
              modalProps={{
                destroyOnClose: true,
                onCancel: () => form.resetFields(),
              }}
              submitTimeout={2000}
              onFinish={async (values) => {
                try {
                  const response = await createConnection(values);
                  if (response.status === 200) {
                    message.success("连接创建成功");
                    actionRef.current?.reload();
                    form.resetFields();
                    return true;
                  } else {
                    throw new Error(response.message || "创建连接失败");
                  }
                } catch (error) {
                  console.error("创建连接失败:", error);
                  const errorMessage =
                    error instanceof Error ? error.message : "创建连接失败";
                  message.error(errorMessage);
                  return false;
                }
              }}
              onValuesChange={(changedValues) => {
                if ("method" in changedValues) {
                  form.setFieldsValue({
                    password: undefined,
                    credentialUUID: undefined,
                  });
                }
              }}
            >
              <ProFormText
                name="name"
                label="连接名称"
                placeholder="请输入连接名称"
                rules={[{ required: true, message: "请输入连接名称" }]}
              />
              <ProForm.Group>
                <ProFormText
                  name="host"
                  label="主机地址"
                  placeholder="例如：192.168.1.100"
                  rules={[{ required: true, message: "请输入主机地址" }]}
                  width="md"
                />
                <ProFormText
                  name="port"
                  label="端口"
                  placeholder="默认22"
                  initialValue="22"
                  rules={[{ required: true, message: "请输入端口号" }]}
                  width="sm"
                />
              </ProForm.Group>
              <ProFormText
                name="username"
                label="用户名"
                placeholder="请输入登录用户名"
                rules={[{ required: true, message: "请输入用户名" }]}
              />
              <ProFormSegmented
                name="method"
                label="认证方式"
                disabled
                rules={[{ required: true, message: "请选择认证方式" }]}
                fieldProps={{ options: authMethods }}
              />
              <Form.Item noStyle shouldUpdate>
                {({ getFieldValue }) => {
                  return getFieldValue("method") === "0" ? (
                    <ProFormText.Password
                      name="password"
                      label="密码"
                      placeholder="请输入密码"
                      rules={[{ required: true, message: "请输入密码" }]}
                    />
                  ) : (
                    <ProFormText
                      name="credentialUUID"
                      label="凭证UUID"
                      placeholder="请输入凭证UUID"
                      rules={[{ required: true, message: "请输入凭证UUID" }]}
                    />
                  );
                }}
              </Form.Item>
            </ModalForm>,
          ]}
        />
      </ProCard>
    </PageContainer>
  );
};

export default ConnectList;
