import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  Typography, 
  Row, 
  Col, 
  Button, 
  Spin, 
  message,
  Divider,
  Alert
} from 'antd';
import { 
  ReloadOutlined, 
  ArrowLeftOutlined 
} from '@ant-design/icons';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import RevenueChart from '../components/charts/RevenueChart';
import ComparisonChart from '../components/charts/ComparisonChart';
import CostStructureChart from '../components/charts/CostStructureChart';
import ProfitTrendChart from '../components/charts/ProfitTrendChart';
import AIAdviceCard from '../components/AIAdviceCard';
import PDFExporter from '../components/PDFExporter';

const { Title, Text } = Typography;

const AnalysisPage = () => {
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiAdvice, setAiAdvice] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    loadAnalysisData();
  }, []);

  const loadAnalysisData = async () => {
    try {
      // 首先尝试从localStorage获取数据
      const localData = localStorage.getItem('analysisData');
      if (localData) {
        setAnalysisData(JSON.parse(localData));
        setLoading(false);
        return;
      }

      // 如果没有本地数据，从API获取
      const response = await axios.get(`${API_BASE_URL}/api/analysis`);
      if (response.data) {
        setAnalysisData(response.data);
        localStorage.setItem('analysisData', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('加载分析数据失败:', error);
      message.error('无法加载分析数据，请先输入数据');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  const getAIAdvice = async () => {
    if (!analysisData?.summary) return;
    
    setAiLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/ai-advice`, {
        summary: analysisData.summary
      });
      
      if (response.data?.advice) {
        setAiAdvice(response.data.advice);
        message.success('AI分析完成！');
      }
    } catch (error) {
      console.error('AI分析失败:', error);
      message.error('AI分析服务暂时不可用');
    } finally {
      setAiLoading(false);
    }
  };

  const formatNumber = (num) => {
    return num.toLocaleString('zh-CN', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  };

  const formatPercentage = (num) => {
    return num.toFixed(2);
  };

  if (loading) {
    return (
      <div className="page-container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 20 }}>
          <Text>正在加载分析数据...</Text>
        </div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="page-container">
        <Alert
          message="数据加载失败"
          description="无法获取分析数据，请返回数据输入页面重新提交数据。"
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => navigate('/')}>
              返回输入页面
            </Button>
          }
        />
      </div>
    );
  }

  const { summary, monthlyData } = analysisData;

  return (
    <div className="page-container fade-in">
      {/* 页面头部 */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={1} className="page-title">
          餐饮经营数据分析报告
        </Title>
        <Text className="page-subtitle">
          基于您提供的月度数据生成的年度经营分析
        </Text>
        
        <div style={{ marginTop: 16 }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/')}
            style={{ marginRight: 16 }}
          >
            返回输入页面
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={loadAnalysisData}
            style={{ marginRight: 16 }}
          >
            刷新数据
          </Button>
          <PDFExporter analysisData={analysisData} aiAdvice={aiAdvice} />
        </div>
      </div>

      {/* 数据总览 */}
      <Card className="analytics-card">
        <Title level={3} className="form-section-title">
          📈 年度数据总览
        </Title>
        
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <div className="summary-item">
              <div className="summary-value">
                {formatNumber(summary.original.totalRevenue)}
              </div>
              <div className="summary-label">原始食品总营业额 (万元)</div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div className="summary-item">
              <div className="summary-value">
                {formatNumber(summary.organic.totalRevenue)}
              </div>
              <div className="summary-label">有机食品总营业额 (万元)</div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div className="summary-item">
              <div className="summary-value">
                {formatNumber(summary.original.totalProfit)}
              </div>
              <div className="summary-label">原始食品总利润 (万元)</div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <div className="summary-item">
              <div className="summary-value">
                {formatNumber(summary.organic.totalProfit)}
              </div>
              <div className="summary-label">有机食品总利润 (万元)</div>
            </div>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={8}>
            <div className="summary-item">
              <div className="summary-value">
                {formatPercentage(summary.original.costRatio)}%
              </div>
              <div className="summary-label">原始食品成本占比</div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <div className="summary-item">
              <div className="summary-value">
                {formatPercentage(summary.organic.costRatio)}%
              </div>
              <div className="summary-label">有机食品成本占比</div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <div className="summary-item">
              <div className="summary-value">
                {formatPercentage(summary.original.profitRatio)}%
              </div>
              <div className="summary-label">原始食品利润率</div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 对比分析 */}
      <Card className="analytics-card">
        <Title level={3} className="form-section-title">
          🔍 年度对比分析
        </Title>
        
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={8}>
            <div className="summary-item">
              <div className="summary-value" style={{ color: summary.comparison.revenueGrowthRate >= 0 ? '#52c41a' : '#ff4d4f' }}>
                {summary.comparison.revenueGrowthRate >= 0 ? '+' : ''}{formatPercentage(summary.comparison.revenueGrowthRate)}%
              </div>
              <div className="summary-label">营业额增长率</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                增加 {formatNumber(summary.comparison.revenueIncrease)} 万元
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <div className="summary-item">
              <div className="summary-value" style={{ color: summary.comparison.costGrowthRate >= 0 ? '#ff4d4f' : '#52c41a' }}>
                {summary.comparison.costGrowthRate >= 0 ? '+' : ''}{formatPercentage(summary.comparison.costGrowthRate)}%
              </div>
              <div className="summary-label">成本增长率</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                增加 {formatNumber(summary.comparison.costIncrease)} 万元
              </div>
            </div>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <div className="summary-item">
              <div className="summary-value" style={{ color: summary.comparison.profitGrowthRate >= 0 ? '#52c41a' : '#ff4d4f' }}>
                {summary.comparison.profitGrowthRate >= 0 ? '+' : ''}{formatPercentage(summary.comparison.profitGrowthRate)}%
              </div>
              <div className="summary-label">利润增长率</div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                增加 {formatNumber(summary.comparison.profitIncrease)} 万元
              </div>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 图表展示 */}
      <Card className="analytics-card">
        <Title level={3} className="form-section-title">
          📊 数据可视化图表
        </Title>
        
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <div className="chart-container">
              <div className="chart-title">月度营业额对比</div>
              <RevenueChart monthlyData={monthlyData} />
            </div>
          </Col>
          <Col xs={24} lg={12}>
            <div className="chart-container">
              <div className="chart-title">年度数据对比</div>
              <ComparisonChart summary={summary} />
            </div>
          </Col>
        </Row>
        
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <div className="chart-container">
              <div className="chart-title">成本结构分析</div>
              <CostStructureChart summary={summary} />
            </div>
          </Col>
          <Col xs={24} lg={12}>
            <div className="chart-container">
              <div className="chart-title">利润趋势分析</div>
              <ProfitTrendChart monthlyData={monthlyData} />
            </div>
          </Col>
        </Row>
      </Card>

      {/* AI分析建议 */}
      <AIAdviceCard 
        aiAdvice={aiAdvice}
        aiLoading={aiLoading}
        onGetAdvice={getAIAdvice}
        summary={summary}
      />

      {/* 作者标识 */}
      <div className="author-signature">
        Vincentxjm
      </div>
    </div>
  );
};

export default AnalysisPage;
