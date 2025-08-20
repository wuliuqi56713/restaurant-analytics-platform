import React from 'react';
import { Card, Typography, Button, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { t } from '../utils/i18n';

const { Title } = Typography;

const ProtectedRoute = ({ children }) => {
  // 检查是否有分析数据
  const hasAnalysisData = () => {
    // 检查localStorage中是否有数据
    const localData = localStorage.getItem('analysisData');
    console.log('ProtectedRoute检查数据:', localData);
    
    if (localData) {
      try {
        const data = JSON.parse(localData);
        console.log('ProtectedRoute解析的数据:', data);
        
        // 检查数据是否有效
        const hasValidData = data && (
          (data.monthlyData && data.monthlyData.length > 0) ||
          (data.summary) ||
          (data.aiAdvice)
        );
        
        console.log('ProtectedRoute数据有效性:', hasValidData);
        return hasValidData;
      } catch (error) {
        console.error('ProtectedRoute数据解析错误:', error);
        return false;
      }
    }
    console.log('ProtectedRoute没有找到数据');
    return false;
  };

  // 如果没有数据，显示提示页面
  if (!hasAnalysisData()) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <div style={{ marginBottom: '40px' }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: '20px' }}>
            {t('platformTitle')}
          </Title>
          <div style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>
            {t('noAnalysisData')}
          </div>
        </div>
        
        <Card style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
          <div style={{ padding: '20px' }}>
            <Title level={4} style={{ marginBottom: '15px' }}>
              {t('usageSteps')}
            </Title>
            <ol style={{ fontSize: '16px', lineHeight: '2', color: '#333' }}>
              {t('usageStepsList').map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
            
            <div style={{ marginTop: '30px', textAlign: 'center' }}>
              <Space size="middle">
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<ArrowLeftOutlined />}
                  onClick={() => window.location.href = '/'}
                >
                  {t('startInputData')}
                </Button>
                <Button 
                  size="large" 
                  onClick={() => window.location.reload()}
                >
                  {t('refreshPage')}
                </Button>
              </Space>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // 如果有数据，显示分析页面
  return children;
};

export default ProtectedRoute;
