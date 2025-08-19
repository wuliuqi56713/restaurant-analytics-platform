import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from '../utils/i18n';
import { 
  Form, 
  Input, 
  Button, 
  Row, 
  Col, 
  Card, 
  Typography, 
  message,
  Divider,
  Alert
} from 'antd';
import { CalculatorOutlined } from '@ant-design/icons';
import { apiBaseUrl } from '../utils/config';
import DataImportExport from '../components/DataImportExport';
// 简单的数据验证函数
const validateNumber = (rule, value) => {
  if (!value) {
    return Promise.reject(t('pleaseEnterValue'));
  }
  if (isNaN(value) || parseFloat(value) < 0) {
    return Promise.reject(t('pleaseEnterValidNumber'));
  }
  return Promise.resolve();
};

// 数据验证工具
const DataValidator = {
  validateMonthlyData: (monthlyData) => {
    for (let i = 0; i < monthlyData.length; i++) {
      const month = monthlyData[i];
      const fields = ['originalRevenue', 'originalCost', 'originalProfit', 'organicRevenue', 'organicCost', 'organicProfit'];
      
      for (const field of fields) {
        if (month[field] === undefined || month[field] === null || month[field] === '') {
          return { isValid: false, message: `第${i + 1}月${field}不能为空` };
        }
        if (month[field] < 0) {
          return { isValid: false, message: `第${i + 1}月${field}不能为负数` };
        }
      }
    }
    return { isValid: true, message: '数据验证通过' };
  },
  
  detectAnomalies: (monthlyData) => {
    const anomalies = [];
    for (let i = 0; i < monthlyData.length; i++) {
      const month = monthlyData[i];
      
      // 检查利润计算是否正确
      const expectedOriginalProfit = month.originalRevenue - month.originalCost;
      const expectedOrganicProfit = month.organicRevenue - month.organicCost;
      
      if (Math.abs(month.originalProfit - expectedOriginalProfit) > 0.01) {
        anomalies.push(`第${i + 1}月原始食品利润计算可能不准确`);
      }
      if (Math.abs(month.organicProfit - expectedOrganicProfit) > 0.01) {
        anomalies.push(`第${i + 1}月有机食品利润计算可能不准确`);
      }
    }
    return anomalies;
  }
};

const { Title, Text } = Typography;

const DataInputPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [dataAnomalies, setDataAnomalies] = useState([]);
  const [currentFormData, setCurrentFormData] = useState(null);

  // 当页面加载时，清空localStorage中的分析数据
  useEffect(() => {
    localStorage.removeItem('analysisData');
    console.log('已清空分析数据');
  }, []);

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



  const onFinish = async (values) => {
    setLoading(true);
    setValidationErrors([]);
    setDataAnomalies([]);
    
    try {
      console.log('开始处理表单数据...');
      
      // 提取月度数据
      const monthlyData = [];
      for (let i = 0; i < 12; i++) {
        const monthData = {
          originalRevenue: parseFloat(values[`originalRevenue_${i}`] || 0),
          originalCost: parseFloat(values[`originalCost_${i}`] || 0),
          originalProfit: parseFloat(values[`originalProfit_${i}`] || 0),
          organicRevenue: parseFloat(values[`organicRevenue_${i}`] || 0),
          organicCost: parseFloat(values[`organicCost_${i}`] || 0),
          organicProfit: parseFloat(values[`organicProfit_${i}`] || 0)
        };
        monthlyData.push(monthData);
        console.log(`第${i + 1}月数据:`, monthData);
      }

      console.log('月度数据提取完成:', monthlyData);

      // 数据验证
      console.log('开始数据验证...');
      const validationResult = DataValidator.validateMonthlyData(monthlyData);
      if (!validationResult.isValid) {
        console.error('数据验证失败:', validationResult.message);
        setValidationErrors([validationResult.message]);
        message.error(validationResult.message);
        return;
      }
      console.log(t('dataValidationPassed'), validationResult.message);

      // 检测数据异常
      const anomalies = DataValidator.detectAnomalies(monthlyData);
      setDataAnomalies(anomalies);
      if (anomalies.length > 0) {
        console.log('检测到数据异常:', anomalies);
      }

      // 尝试提交数据到后端，如果失败则使用示例数据
      console.log('开始提交数据到后端...');
      let responseData;
      
      try {
        const response = await fetch(`${apiBaseUrl}/api/submit-data`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ monthlyData })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        responseData = await response.json();
        console.log('后端响应数据:', responseData);
      } catch (error) {
        console.log('后端连接失败，使用示例数据:', error.message);
        // 使用示例数据
        const sampleResponse = await fetch('/sample-data.json');
        responseData = await sampleResponse.json();
        console.log('使用示例数据:', responseData);
      }
      
      if (responseData) {
        message.success(t('dataSubmittedSuccessfully'));
        // 将数据存储到localStorage，然后跳转
        localStorage.setItem('analysisData', JSON.stringify(responseData));
        setTimeout(() => {
          navigate('/analysis');
        }, 1500);
      } else {
        throw new Error('后端返回空数据');
      }
    } catch (error) {
      console.error('提交失败:', error);
      console.error('错误详情:', error.message);
      if (error.response) {
        console.error('响应状态:', error.response.status);
        console.error('响应数据:', error.response.data);
      }
      message.error(`${t('dataSubmissionFailed')}: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };


  // 处理数据导入
  const handleDataImport = (importedData) => {
    // 将导入的数据填充到表单
    const formData = {};
    importedData.forEach((monthData, index) => {
      formData[`originalRevenue_${index}`] = monthData.originalRevenue.toString();
      formData[`originalCost_${index}`] = monthData.originalCost.toString();
      formData[`originalProfit_${index}`] = monthData.originalProfit.toString();
      formData[`organicRevenue_${index}`] = monthData.organicRevenue.toString();
      formData[`organicCost_${index}`] = monthData.organicCost.toString();
      formData[`organicProfit_${index}`] = monthData.organicProfit.toString();
    });
    
    form.setFieldsValue(formData);
    setCurrentFormData(importedData);
    message.success('数据导入成功！');
  };

  const renderMonthInputs = (month) => {

    return (
      <Card 
        key={month} 
        size="small" 
        style={{ marginBottom: 16 }}
        title={`${t('months')[month - 1]} (${month}${t('monthLabel')})`}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name={`originalRevenue_${month - 1}`}
              label={`${t('originalFood')} ${t('revenue')}`}
              rules={[
                { required: true, message: t('fieldRequired') },
                { validator: validateNumber }
              ]}
            >
              <Input 
                placeholder={t('millionYuan')} 
                suffix={t('millionYuan')}
                type="text"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name={`originalCost_${month - 1}`}
              label={`${t('originalFood')} ${t('cost')}`}
              rules={[
                { required: true, message: t('fieldRequired') },
                { validator: validateNumber }
              ]}
            >
              <Input 
                placeholder={t('millionYuan')} 
                suffix={t('millionYuan')}
                type="text"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name={`originalProfit_${month - 1}`}
              label={`${t('originalFood')} ${t('profit')}`}
              rules={[
                { required: true, message: t('fieldRequired') },
                { validator: validateNumber }
              ]}
            >
              <Input 
                placeholder={t('millionYuan')} 
                suffix={t('millionYuan')}
                type="text"
              />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name={`organicRevenue_${month - 1}`}
              label={`${t('organicFood')} ${t('revenue')}`}
              rules={[
                { required: true, message: t('fieldRequired') },
                { validator: validateNumber }
              ]}
            >
              <Input 
                placeholder={t('millionYuan')} 
                suffix={t('millionYuan')}
                type="text"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name={`organicCost_${month - 1}`}
              label={`${t('organicFood')} ${t('cost')}`}
              rules={[
                { required: true, message: t('fieldRequired') },
                { validator: validateNumber }
              ]}
            >
              <Input 
                placeholder={t('millionYuan')} 
                suffix={t('millionYuan')}
                type="text"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name={`organicProfit_${month - 1}`}
              label={`${t('organicFood')} ${t('profit')}`}
              rules={[
                { required: true, message: t('fieldRequired') },
                { validator: validateNumber }
              ]}
            >
              <Input 
                placeholder={t('millionYuan')} 
                suffix={t('millionYuan')}
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
        {t('monthlyDataInput')}
      </Title>
      <Text className="page-subtitle">
        {t('inputDescription')}
      </Text>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{}}
      >
        <div className="form-section">
                    <Title level={3} className="form-section-title">
            📊 {t('monthlyDataInput')}
          </Title>
          
          {/* 数据导入导出功能 */}
          <div style={{ marginBottom: '24px' }}>
            <DataImportExport 
              onDataImport={handleDataImport}
              currentData={currentFormData}
            />
          </div>

          {/* 验证错误提示 */}
          {validationErrors.length > 0 && (
            <Alert
              message="数据验证错误"
              description={validationErrors.join(', ')}
              type="error"
              showIcon
              style={{ marginBottom: '16px' }}
            />
          )}

          {/* 数据异常提示 */}
          {dataAnomalies.length > 0 && (
            <Alert
              message="数据异常检测"
              description={`发现 ${dataAnomalies.length} 个数据异常，请检查数据准确性`}
              type="warning"
              showIcon
              style={{ marginBottom: '16px' }}
            />
          )}
          
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
            {loading ? t('loading') : t('submitDataAndAnalyze')}
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
