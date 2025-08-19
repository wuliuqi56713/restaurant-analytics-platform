import React from 'react';
import { Button, Dropdown } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { getCurrentLanguage, setLanguage } from '../utils/i18n';

const LanguageSwitcher = () => {
  const currentLang = getCurrentLanguage();
  
  const languageOptions = [
    {
      key: 'zh',
      label: '🇨🇳 中文',
      onClick: () => setLanguage('zh')
    },
    {
      key: 'en',
      label: '🇺🇸 English',
      onClick: () => setLanguage('en')
    }
  ];

  const getCurrentLanguageLabel = () => {
    const option = languageOptions.find(opt => opt.key === currentLang);
    return option ? option.label : '🇨🇳 中文';
  };

  return (
    <Dropdown
      menu={{
        items: languageOptions,
        selectedKeys: [currentLang]
      }}
      placement="bottomRight"
      trigger={['click']}
    >
      <Button
        type="text"
        icon={<GlobalOutlined />}
        style={{
          color: '#1e3c72',
          border: 'none',
          background: 'transparent',
          fontSize: '14px',
          padding: '4px 8px',
          height: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        {getCurrentLanguageLabel()}
      </Button>
    </Dropdown>
  );
};

export default LanguageSwitcher;
