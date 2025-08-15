import React from 'react';
import { Card, Typography, Button, Spin, Divider } from 'antd';
import { RobotOutlined, BulbOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const AIAdviceCard = ({ aiAdvice, aiLoading, onGetAdvice, summary }) => {
  const formatNumber = (num) => {
    return num.toLocaleString('zh-CN', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  };

  const formatPercentage = (num) => {
    return num.toFixed(2);
  };

  return (
    <Card className="analytics-card">
      <Title level={3} className="form-section-title">
        🤖 AI智能分析建议
      </Title>
      
      {!aiAdvice && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <RobotOutlined style={{ fontSize: '48px', color: '#1e3c72', marginBottom: '16px' }} />
          <Title level={4} style={{ color: '#666', marginBottom: '16px' }}>
            获取AI驱动的商业分析建议
          </Title>
          <Text style={{ color: '#999', display: 'block', marginBottom: '24px' }}>
            基于您的经营数据，AI将为您提供专业的战略建议和风险分析
          </Text>
          <Button
            type="primary"
            size="large"
            icon={<BulbOutlined />}
            onClick={onGetAdvice}
            loading={aiLoading}
            className="submit-button"
            style={{ width: 200 }}
          >
            {aiLoading ? 'AI分析中...' : '获取AI建议'}
          </Button>
        </div>
      )}

      {aiLoading && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '20px' }}>
            <Text>AI正在分析您的数据，请稍候...</Text>
          </div>
        </div>
      )}

      {aiAdvice && !aiLoading && (
        <div>
          <div style={{ 
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', 
            padding: '20px', 
            borderRadius: '12px',
            marginBottom: '24px',
            borderLeft: '4px solid #ffd700'
          }}>
            <Title level={4} style={{ color: '#1e3c72', marginBottom: '16px' }}>
              📊 数据概览
            </Title>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <Text strong>营业额变化：</Text>
                <Text>从 {formatNumber(summary.original.totalRevenue)} 万元 → {formatNumber(summary.organic.totalRevenue)} 万元</Text>
              </div>
              <div>
                <Text strong>成本变化：</Text>
                <Text>从 {formatNumber(summary.original.totalCost)} 万元 → {formatNumber(summary.organic.totalCost)} 万元</Text>
              </div>
              <div>
                <Text strong>利润变化：</Text>
                <Text>从 {formatNumber(summary.original.totalProfit)} 万元 → {formatNumber(summary.organic.totalProfit)} 万元</Text>
              </div>
            </div>
          </div>

          <Divider />

          <Title level={4} style={{ color: '#1e3c72', marginBottom: '16px' }}>
            💡 AI战略建议
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
              onClick={onGetAdvice}
              style={{ marginRight: '16px' }}
            >
              重新分析
            </Button>
            <Text style={{ color: '#999', fontSize: '12px' }}>
              * AI建议基于当前数据分析生成，仅供参考
            </Text>
          </div>
        </div>
      )}
    </Card>
  );
};

export default AIAdviceCard;
