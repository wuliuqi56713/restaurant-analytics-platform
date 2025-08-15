import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Row, 
  Col, 
  Card, 
  Typography, 
  message,
  Divider 
} from 'antd';
import { CalculatorOutlined } from '@ant-design/icons';
import axios from 'axios';
import API_BASE_URL from '../config/api';

const { Title, Text } = Typography;

const DataInputPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 初始化12个月的数据
  const initialMonthlyData = Array.from({ length: 12 }, (_, index) => ({
    month: index + 1,
    originalRevenue: '',
    originalCost: '',
    originalProfit: '',
    organicRevenue: '',
    organicCost: '',
    organicProfit: ''
  }));

  // 数字验证函数
  const validateNumber = (rule, value) => {
    if (!value) {
      return Promise.reject('请输入数值');
    }
    if (isNaN(value) || parseFloat(value) < 0) {
      return Promise.reject('请输入有效的正数');
    }
    return Promise.resolve();
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 提取月度数据
      const monthlyData = [];
      for (let i = 0; i < 12; i++) {
        monthlyData.push({
          originalRevenue: parseFloat(values[`originalRevenue_${i}`] || 0),
          originalCost: parseFloat(values[`originalCost_${i}`] || 0),
          originalProfit: parseFloat(values[`originalProfit_${i}`] || 0),
          organicRevenue: parseFloat(values[`organicRevenue_${i}`] || 0),
          organicCost: parseFloat(values[`organicCost_${i}`] || 0),
          organicProfit: parseFloat(values[`organicProfit_${i}`] || 0)
        });
      }

      // 提交数据到后端
      const response = await axios.post(`${API_BASE_URL}/api/submit-data`, { monthlyData });
      
      if (response.data) {
        message.success('数据提交成功！正在跳转到分析页面...');
        // 将数据存储到localStorage，然后跳转
        localStorage.setItem('analysisData', JSON.stringify(response.data));
        setTimeout(() => {
          navigate('/analysis');
        }, 1500);
      }
    } catch (error) {
      console.error('提交失败:', error);
      message.error('数据提交失败，请检查网络连接或联系管理员');
    } finally {
      setLoading(false);
    }
  };

  const renderMonthInputs = (month) => {
    const monthNames = [
      '一月', '二月', '三月', '四月', '五月', '六月',
      '七月', '八月', '九月', '十月', '十一月', '十二月'
    ];

    return (
      <Card 
        key={month} 
        size="small" 
        style={{ marginBottom: 16 }}
        title={`${monthNames[month - 1]} (${month}月)`}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name={`originalRevenue_${month - 1}`}
              label="原始食品营业额"
              rules={[
                { required: true, message: '请输入营业额' },
                { validator: validateNumber }
              ]}
            >
              <Input 
                placeholder="万元" 
                suffix="万元"
                type="text"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name={`originalCost_${month - 1}`}
              label="原始食品成本"
              rules={[
                { required: true, message: '请输入成本' },
                { validator: validateNumber }
              ]}
            >
              <Input 
                placeholder="万元" 
                suffix="万元"
                type="text"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name={`originalProfit_${month - 1}`}
              label="原始食品利润"
              rules={[
                { required: true, message: '请输入利润' },
                { validator: validateNumber }
              ]}
            >
              <Input 
                placeholder="万元" 
                suffix="万元"
                type="text"
              />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name={`organicRevenue_${month - 1}`}
              label="有机食品营业额"
              rules={[
                { required: true, message: '请输入营业额' },
                { validator: validateNumber }
              ]}
            >
              <Input 
                placeholder="万元" 
                suffix="万元"
                type="text"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name={`organicCost_${month - 1}`}
              label="有机食品成本"
              rules={[
                { required: true, message: '请输入成本' },
                { validator: validateNumber }
              ]}
            >
              <Input 
                placeholder="万元" 
                suffix="万元"
                type="text"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name={`organicProfit_${month - 1}`}
              label="有机食品利润"
              rules={[
                { required: true, message: '请输入利润' },
                { validator: validateNumber }
              ]}
            >
              <Input 
                placeholder="万元" 
                suffix="万元"
                type="text"
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <div className="page-container fade-in">
      <Title level={1} className="page-title">
        餐饮经营数据输入
      </Title>
      <Text className="page-subtitle">
        请输入原始食品和有机食品在1-12月的营业额、成本、利润数据（单位：万元）
      </Text>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{}}
      >
        <div className="form-section">
          <Title level={3} className="form-section-title">
            📊 月度经营数据
          </Title>
          
          {initialMonthlyData.map((_, index) => renderMonthInputs(index + 1))}
        </div>

        <Divider />

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            icon={<CalculatorOutlined />}
            loading={loading}
            className="submit-button"
            style={{ width: 200 }}
          >
            {loading ? '正在提交...' : '提交数据并分析'}
          </Button>
        </div>
      </Form>

      {/* 作者标识 */}
      <div className="author-signature">
        Vincentxjm
      </div>
    </div>
  );
};

export default DataInputPage;
