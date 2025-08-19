import React from 'react';
import { Card, Typography, Button, Spin } from 'antd';
import { RobotOutlined, BulbOutlined } from '@ant-design/icons';
import { t } from '../utils/i18n';

const { Title, Paragraph, Text } = Typography;

const AIAdviceCard = ({ aiAdvice, loading, onGenerate }) => {
  return (
    <Card className="analytics-card">
      <Title level={3} className="form-section-title">
        🤖 {t('aiAdvice')}
      </Title>
      
      {!aiAdvice && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <RobotOutlined style={{ fontSize: '48px', color: '#1e3c72', marginBottom: '16px' }} />
          <Title level={4} style={{ color: '#666', marginBottom: '16px' }}>
            {t('getAiAdvice')}
          </Title>
          <Text style={{ color: '#999', display: 'block', marginBottom: '24px' }}>
            {t('mockAdvice')}
          </Text>
          <Button
            type="primary"
            size="large"
            icon={<BulbOutlined />}
            onClick={onGenerate}
            loading={loading}
            className="submit-button"
            style={{ width: 200 }}
          >
            {loading ? t('loading') : t('getAiAdvice')}
          </Button>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '20px' }}>
            <Text>{t('loading')}</Text>
          </div>
        </div>
      )}

      {aiAdvice && !loading && (
        <div>
          <Title level={4} style={{ color: '#1e3c72', marginBottom: '16px' }}>
            💡 {t('aiAdvice')}
          </Title>
          
          <div style={{ 
            background: 'white', 
            padding: '24px', 
            borderRadius: '12px',
            border: '1px solid #e8e8e8',
            lineHeight: '1.8'
          }}>
            {aiAdvice.split('\n').map((line, index) => (
              <Paragraph key={index} style={{ marginBottom: '12px' }}>
                {line}
              </Paragraph>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Button
              type="default"
              size="large"
              icon={<BulbOutlined />}
              onClick={onGenerate}
              style={{ marginRight: '16px', minWidth: '120px' }}
            >
              {t('regenerateAdvice')}
            </Button>
            <Text style={{ color: '#999', fontSize: '12px' }}>
              * {t('mockAdvice')}
            </Text>
          </div>
        </div>
      )}
    </Card>
  );
};

export default AIAdviceCard;
