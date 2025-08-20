import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Button, message, Spin } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, DollarOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { t } from '../utils/i18n';
import { apiBaseUrl } from '../utils/config';
import RevenueTrendChart from '../components/charts/RevenueTrendChart';
import ProfitAnalysisChart from '../components/charts/ProfitAnalysisChart';
import CostStructureChart from '../components/charts/CostStructureChart';
import AIAdviceCard from '../components/AIAdviceCard';

const AnalysisPage = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    loadAnalysisData();
  }, []);

  const loadAnalysisData = async () => {
    try {
      setLoading(true);
      console.log('开始加载分析数据...');
      
      const storedData = localStorage.getItem('analysisData');
      console.log('localStorage中的数据:', storedData);
      
      if (storedData) {
        const data = JSON.parse(storedData);
        console.log('解析后的分析数据:', data); // 调试日志
        
        setAnalysisData(data);
        
        // 转换数据格式以匹配图表组件的期望
        const convertedMonthlyData = (data.monthlyData || []).map(item => ({
          originalRevenue: parseFloat(item.originalRevenue || 0),
          originalCost: parseFloat(item.originalCost || 0),
          originalProfit: parseFloat(item.originalProfit || 0),
          organicRevenue: parseFloat(item.organicRevenue || 0),
          organicCost: parseFloat(item.organicCost || 0),
          organicProfit: parseFloat(item.organicProfit || 0)
        }));
        
        console.log('转换后的月度数据:', convertedMonthlyData); // 调试日志
        console.log('数据长度:', convertedMonthlyData.length);
        
        setMonthlyData(convertedMonthlyData);
        setSummary(data.summary || {});
        setAiAdvice(data.aiAdvice || {});
        
        console.log('数据设置完成');
      } else {
        console.log('localStorage中没有找到数据');
        message.warning(t('noAnalysisData'));
        // 如果没有数据，尝试从后端获取
        try {
          const apiUrl = process.env.NODE_ENV === 'production' 
            ? '/api/data' 
            : `${apiBaseUrl}/api/data`;
          console.log('尝试从API获取数据:', apiUrl);
          const response = await fetch(apiUrl);
          if (response.ok) {
            const data = await response.json();
            console.log('从API获取的数据:', data);
            if (data.monthlyData && data.monthlyData.length > 0) {
              setAnalysisData(data);
              setMonthlyData(data.monthlyData);
              setSummary(data.summary || {});
              setAiAdvice(data.aiAdvice || {});
            }
          }
        } catch (error) {
          console.log('无法从后端获取数据:', error);
        }
      }
    } catch (error) {
      console.error('加载分析数据失败:', error);
      message.error(t('loadDataFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAIAdvice = async () => {
    if (!analysisData || !monthlyData.length) {
      message.warning(t('noDataForAI'));
      return;
    }

    setAiLoading(true);
    try {
      // 使用相对路径，让Netlify自动处理API路由
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/api/submit-data' 
        : `${apiBaseUrl}/api/submit-data`;
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monthlyData: monthlyData
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.aiAdvice) {
          setAiAdvice(data.aiAdvice);
          
          // 更新localStorage
          const updatedData = { ...analysisData, aiAdvice: data.aiAdvice };
          localStorage.setItem('analysisData', JSON.stringify(updatedData));
          
          message.success(t('aiAdviceGenerated'));
        } else {
          throw new Error('AI建议数据为空');
        }
      } else {
        throw new Error('AI建议生成失败');
      }
    } catch (error) {
      console.error('生成AI建议失败:', error);
      message.error(t('aiAdviceFailed'));
    } finally {
      setAiLoading(false);
    }
  };

  const formatPercentage = (num) => {
    const number = parseFloat(num);
    if (isNaN(number)) {
      return '0.00';
    }
    return number.toFixed(2);
  };

  // 计算总收入和总利润
  const calculateTotals = () => {
    console.log('calculateTotals - monthlyData:', monthlyData); // 调试日志
    
    if (!monthlyData.length) {
      console.log('calculateTotals - no data available'); // 调试日志
      return { totalRevenue: 0, totalProfit: 0 };
    }
    
    const totalRevenue = monthlyData.reduce((sum, item) => {
      const originalRev = parseFloat(item.originalRevenue) || 0;
      const organicRev = parseFloat(item.organicRevenue) || 0;
      return sum + originalRev + organicRev;
    }, 0);
    
    const totalProfit = monthlyData.reduce((sum, item) => {
      const originalProfit = parseFloat(item.originalProfit) || 0;
      const organicProfit = parseFloat(item.organicProfit) || 0;
      return sum + originalProfit + organicProfit;
    }, 0);
    
    console.log('calculateTotals - results:', { totalRevenue, totalProfit }); // 调试日志
    return { totalRevenue, totalProfit };
  };

  const { totalRevenue, totalProfit } = calculateTotals();

  if (!analysisData || !monthlyData.length) {
    return (
      <div style={{ 
        padding: '50px', 
        textAlign: 'center',
        backgroundColor: '#f5f5f5',
        minHeight: '100vh'
      }}>
        <Card style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2>{t('noAnalysisData')}</h2>
          <p>{t('pleaseInputDataFirst')}</p>
          <Button type="primary" size="large" onClick={() => window.location.href = '/'}>
            {t('goToDataInput')}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Spin spinning={loading}>
        {/* 页面标题 */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1a1a1a', margin: '0 0 12px 0' }}>
            {t('restaurantAnnualAnalysis')}
          </h1>
          <p style={{ fontSize: '18px', color: '#666', margin: 0 }}>
            {t('comprehensiveBusinessAnalysis')}
          </p>
        </div>

        {/* 关键指标卡片 */}
        <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ textAlign: 'center', height: '160px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <Statistic
                title={t('totalRevenue')}
                value={totalRevenue}
                precision={1}
                valueStyle={{ color: '#3f8600', fontSize: '28px', fontWeight: 'bold' }}
                prefix={<DollarOutlined style={{ fontSize: '24px' }} />}
                suffix={t('millionYuan')}
              />
              <div style={{ marginTop: '12px' }}>
                <span style={{ color: '#3f8600', fontSize: '16px' }}>
                  <ArrowUpOutlined />
                  {formatPercentage(summary?.comparison?.revenueGrowthRate || 0)}%
                </span>
                <span style={{ color: '#666', marginLeft: '8px', fontSize: '14px' }}>{t('vsLastYear')}</span>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ textAlign: 'center', height: '160px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <Statistic
                title={t('totalProfit')}
                value={totalProfit}
                precision={1}
                valueStyle={{ color: '#1890ff', fontSize: '28px', fontWeight: 'bold' }}
                prefix={<RiseOutlined style={{ fontSize: '24px' }} />}
                suffix={t('millionYuan')}
              />
              <div style={{ marginTop: '12px' }}>
                <span style={{ color: '#3f8600', fontSize: '16px' }}>
                  <ArrowUpOutlined />
                  {formatPercentage(summary?.comparison?.profitGrowthRate || 0)}%
                </span>
                <span style={{ color: '#666', marginLeft: '8px', fontSize: '14px' }}>{t('vsLastYear')}</span>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ textAlign: 'center', height: '160px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <Statistic
                title={t('profitMargin')}
                value={totalRevenue > 0 ? (totalProfit / totalRevenue * 100) : 0}
                precision={2}
                valueStyle={{ color: '#722ed1', fontSize: '28px', fontWeight: 'bold' }}
                prefix={<RiseOutlined style={{ fontSize: '24px' }} />}
                suffix="%"
              />
              <div style={{ marginTop: '12px' }}>
                <span style={{ color: '#3f8600', fontSize: '16px' }}>
                  <ArrowUpOutlined />
                  {formatPercentage(summary?.comparison?.marginChange || 0)}%
                </span>
                <span style={{ color: '#666', marginLeft: '8px', fontSize: '14px' }}>{t('vsLastYear')}</span>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} sm={12} lg={6}>
            <Card style={{ textAlign: 'center', height: '160px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <Statistic
                title={t('costRatio')}
                value={totalRevenue > 0 ? ((totalRevenue - totalProfit) / totalRevenue * 100) : 0}
                precision={2}
                valueStyle={{ color: '#fa8c16', fontSize: '28px', fontWeight: 'bold' }}
                prefix={<FallOutlined style={{ fontSize: '24px' }} />}
                suffix="%"
              />
              <div style={{ marginTop: '12px' }}>
                <span style={{ color: '#cf1322', fontSize: '16px' }}>
                  <ArrowDownOutlined />
                  {formatPercentage(summary?.comparison?.costRatioChange || 0)}%
                </span>
                <span style={{ color: '#666', marginLeft: '8px', fontSize: '14px' }}>{t('vsLastYear')}</span>
              </div>
            </Card>
          </Col>
        </Row>

        {/* 主要分析图表 - 每个图表独占一行 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {/* 收入趋势分析 */}
          <Card 
            title={<h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a' }}>{t('revenueTrendAnalysis')}</h2>}
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            bodyStyle={{ padding: '24px', minHeight: '650px' }}
          >
            <RevenueTrendChart monthlyData={monthlyData} />
          </Card>

          {/* 利润分析 */}
          <Card 
            title={<h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a' }}>{t('profitAnalysis')}</h2>}
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            bodyStyle={{ padding: '24px', minHeight: '650px' }}
          >
            <ProfitAnalysisChart monthlyData={monthlyData} />
          </Card>

          {/* 成本结构分析 */}
          <Card 
            title={<h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a' }}>{t('costStructureAnalysis')}</h2>}
            style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            bodyStyle={{ padding: '24px', minHeight: '650px' }}
          >
            <CostStructureChart monthlyData={monthlyData} />
          </Card>
        </div>

        {/* AI建议 */}
        <div style={{ marginTop: '40px' }}>
          <AIAdviceCard 
            aiAdvice={aiAdvice}
            onGenerate={handleGenerateAIAdvice}
            loading={aiLoading}
          />
        </div>
      </Spin>
    </div>
  );
};

export default AnalysisPage;
