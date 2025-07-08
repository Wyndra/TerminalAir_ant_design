import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  colorPrimary: '#1677ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'Terminal Air',
  pwa: true,
  // logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  logo: 'https://term.srcandy.top/img/shell.9016e476.svg',
  iconfontUrl: '',
  token: {
    // 参见ts声明，demo 见文档，通过token 修改样式
    //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
    // header: {
    //   colorBgHeader: '#292f33',
    //   colorHeaderTitle: '#fff',
    //   colorTextMenu: '#dfdfdf',
    //   colorTextMenuSecondary: '#dfdfdf',
    //   colorTextMenuSelected: '#fff',
    //   colorBgMenuItemSelected: '#22272b',
    //   colorTextRightActionsItem: '#dfdfdf',
    // },
    // sider: {
    //   colorMenuBackground: '#fff',
    //   colorMenuItemDivider: '#dfdfdf',
    //   colorTextMenu: '#595959',
    //   colorTextMenuSelected: 'rgba(42,122,251,1)',
    //   colorBgMenuItemHover: 'rgba(90, 75, 75, 0.03)',
    //   colorBgMenuItemSelected: 'rgba(230,243,254,1)',
    // },
  },
};

export default Settings;
