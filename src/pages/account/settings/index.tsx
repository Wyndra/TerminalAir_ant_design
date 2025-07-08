import { PageContainer, ProBreadcrumb, ProCard } from "@ant-design/pro-components";

const Main: React.FC = () => {
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
                {/* <Tabs
                    defaultActiveKey="1"
                    items={items}
                    type="card"
                    tabBarStyle={{
                        marginBottom: 0
                    }}
                /> */}
            </ProCard>
        </PageContainer>
    );
}

export default Main;