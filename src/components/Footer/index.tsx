import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      links={[
        
        

        // // {
        // //   key: 'github',
        // //   title: <GithubOutlined />,
        // //   href: 'https://github.com/ant-design/ant-design-pro',
        // //   blankTarget: true,
        // // },
        {
          key: 'Terminal Air',
          title: 'Terminal Air',
          href: 'https://term.srcandy.top',
          blankTarget: true,
        },
        {
          key: 'muchui',
          title: '宁波慕垂网络科技有限公司',
          href: 'https://term.srcandy.top',
          blankTarget: true,
        },
        {
          key: 'copyright',
          title: '浙ICP备2023031974号',
          href: 'https://beian.miit.gov.cn/',
          blankTarget: true,
        }
      ]}
    />
  );
};

export default Footer;
