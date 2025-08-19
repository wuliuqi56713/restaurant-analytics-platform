import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChartOutlined, FormOutlined } from '@ant-design/icons';
import { t } from '../utils/i18n';
import LanguageSwitcher from './LanguageSwitcher';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 检查是否有分析数据
  const hasAnalysisData = () => {
    const localData = localStorage.getItem('analysisData');
    if (localData) {
      try {
        const data = JSON.parse(localData);
        return data && data.summary && data.monthlyData;
      } catch (error) {
        return false;
      }
    }
    return false;
  };

  const menuItems = [
    {
      key: '/',
      icon: <FormOutlined />,
      label: t('dataInput'),
    },
    {
      key: '/analysis',
      icon: <BarChartOutlined />,
      label: t('analysisResults'),
      disabled: !hasAnalysisData(),
      style: !hasAnalysisData() ? { color: '#ccc', cursor: 'not-allowed' } : {}
    },
  ];

  const handleMenuClick = ({ key, item }) => {
    // 如果菜单项被禁用，不执行导航
    if (item.disabled) {
      return;
    }
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
          {t('platformTitle')}
        </Title>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
        <LanguageSwitcher />
      </div>
    </AntHeader>
  );
};

export default Header;
