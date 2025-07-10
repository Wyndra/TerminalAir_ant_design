import { getCredentialsList, CredentialsItem } from "@/services/credentials";
import { PlusOutlined } from "@ant-design/icons";
import { ModalForm, PageContainer, ProBreadcrumb, ProCard, ProColumns, ProForm, ProFormText, ProTable } from "@ant-design/pro-components";
import { Button, Form, message, Tag } from "antd";

const Credentials: React.FC = () => {
    const handleDelete = () => {
        // 删除逻辑
        message.success('删除成功');
    };
    const [form] = Form.useForm()
    const columns: ProColumns<CredentialsItem>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: '凭证名称',
            dataIndex: 'name',
        },
        {
            title: '凭证指纹',
            dataIndex: 'fingerprint',
        },
        {
            title: '凭证标签',
            dataIndex: 'tags',
            render: (_, record) => {
                return record.tags ? record.tags.split(',').map(tag => (
                    <Tag key={tag} color="blue" style={{ marginRight: 4 }}>
                        {tag}
                    </Tag>
                )) : '-';
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            valueEnum: {
                0: {
                    text: '未绑定',
                    status: 'Primary',
                },
                1: {
                    text: '绑定中',
                    status: 'Processing',
                },
                2: {
                    text: '绑定成功',
                    status: 'Success',
                },
            }
        },
        {
            title: '创建时间',
            dataIndex: 'createTime'
        },
        {
            title: '操作',
            key: 'action',
            render: () => <a onClick={handleDelete}>删除</a>,
        },
    ];
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
            <ProCard style={{ borderRadius: 8, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
                <ProTable<CredentialsItem>
                    columns={columns}
                    rowKey="id"
                    search={false}
                    headerTitle="凭证列表"
                    request={async (params) => {
                        const response = await getCredentialsList({
                            current: params.current || 1,
                            pageSize: params.pageSize || 10,
                        });

                        return {
                            data: response.data?.result || [],
                            success: response.status === 200,
                            total: response.data?.total || 0,
                        };
                    }}
                    toolBarRender={() => [
                        <ModalForm<{name: string;tag: string;}>
                            title="创建凭证"
                            trigger={
                                <Button type="primary">
                                    <PlusOutlined />
                                    创建凭证
                                </Button>
                            }
                            form={form}
                            width={450}
                            autoFocusFirstInput
                            modalProps={{
                                destroyOnClose: true,
                                onCancel: () => form.resetFields()
                            }}
                            submitTimeout={2000}
                            onFinish={async (values) => {
                                // await waitTime(2000);
                                // console.log(values.name);
                                // message.success('提交成功');
                                // return true;
                            }}>
                            <ProFormText
                                name="name"
                                label="凭证名称"
                                rules={[{ required: true, message: '请输入凭证名称' }]}
                            />
                            <ProForm.Item name="tags" label="标签">
                                
                            </ProForm.Item>


                        </ModalForm>
                    ]}
                />
            </ProCard>
        </PageContainer>
    );
}
export default Credentials;