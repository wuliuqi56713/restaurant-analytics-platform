import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChartOutlined, FormOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <FormOutlined />,
      label: '数据输入',
    },
    {
      key: '/analysis',
      icon: <BarChartOutlined />,
      label: '分析结果',
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <AntHeader style={{ 
      background: 'rgba(255, 255, 255, 0.95)', 
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Title level={3} style={{ 
          margin: 0, 
          color: '#1e3c72',
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          🍽️ 餐饮分析平台
        </Title>
      </div>
      
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        onClick={handleMenuClick}
        items={menuItems}
        style={{
          background: 'transparent',
          border: 'none',
          minWidth: '200px'
        }}
      />
    </AntHeader>
  );
};

export default Header;
