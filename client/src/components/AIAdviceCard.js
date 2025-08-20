import React from 'react';
import { Card, Typography, Button, Spin, List, Tag } from 'antd';
import { RobotOutlined, BulbOutlined } from '@ant-design/icons';
import { t } from '../utils/i18n';

const { Title, Paragraph, Text } = Typography;

const AIAdviceCard = ({ aiAdvice, loading, onGenerate }) => {
  // 将AI建议对象转换为显示格式
  const formatAIAdvice = (advice) => {
    if (!advice || typeof advice === 'string') {
      return advice;
    }
    
    const sections = [];
    
    if (advice.revenue && advice.revenue.length > 0) {
      sections.push({
        title: '💰 收入分析建议',
        items: advice.revenue,
        color: '#52c41a'
      });
    }
    
    if (advice.cost && advice.cost.length > 0) {
      sections.push({
        title: '📊 成本分析建议',
        items: advice.cost,
        color: '#fa8c16'
      });
    }
    
    if (advice.profit && advice.profit.length > 0) {
      sections.push({
        title: '📈 利润分析建议',
        items: advice.profit,
        color: '#1890ff'
      });
    }
    
    if (advice.strategy && advice.strategy.length > 0) {
      sections.push({
        title: '🎯 业务策略建议',
        items: advice.strategy,
        color: '#722ed1'
      });
    }
    
    if (advice.seasonal && advice.seasonal.length > 0) {
      sections.push({
        title: '📅 季节性分析',
        items: advice.seasonal,
        color: '#13c2c2'
      });
    }
    
    if (advice.recommendations && advice.recommendations.length > 0) {
      sections.push({
        title: '💡 综合建议',
        items: advice.recommendations,
        color: '#eb2f96'
      });
    }
    
    return sections;
  };

  const formattedAdvice = formatAIAdvice(aiAdvice);

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
            基于您的数据生成智能分析建议
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
            {typeof formattedAdvice === 'string' ? (
              // 如果是字符串格式，按原来的方式显示
              formattedAdvice.split('\n').map((line, index) => (
                <Paragraph key={index} style={{ marginBottom: '12px' }}>
                  {line}
                </Paragraph>
              ))
            ) : (
              // 如果是对象格式，按分类显示
              formattedAdvice.map((section, sectionIndex) => (
                <div key={sectionIndex} style={{ marginBottom: '24px' }}>
                  <Title level={5} style={{ color: section.color, marginBottom: '12px' }}>
                    {section.title}
                  </Title>
                  <List
                    dataSource={section.items}
                    renderItem={(item, index) => (
                      <List.Item style={{ border: 'none', padding: '4px 0' }}>
                        <Text style={{ fontSize: '14px', lineHeight: '1.6' }}>
                          • {item}
                        </Text>
                      </List.Item>
                    )}
                  />
                </div>
              ))
            )}
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
              * 基于您的数据生成的智能建议
            </Text>
          </div>
        </div>
      )}
    </Card>
  );
};

export default AIAdviceCard;
