import React, { useState } from 'react';
import { Button, Upload, message, Space, Tooltip } from 'antd';
import { UploadOutlined, DownloadOutlined, FileTextOutlined } from '@ant-design/icons';
import { t } from '../utils/i18n';

const DataImportExport = ({ onDataImport }) => {
  const [importLoading, setImportLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // 简化的CSV导入功能
  const handleCSVImport = (file) => {
    setImportLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const csvText = e.target.result;
        const lines = csvText.split('\n');
        
        const monthlyData = [];
        for (let i = 1; i < Math.min(lines.length, 13); i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim());
            const monthData = {
              originalRevenue: parseFloat(values[0] || 0),
              originalCost: parseFloat(values[1] || 0),
              originalProfit: parseFloat(values[2] || 0),
              organicRevenue: parseFloat(values[3] || 0),
              organicCost: parseFloat(values[4] || 0),
              organicProfit: parseFloat(values[5] || 0)
            };
            monthlyData.push(monthData);
          }
        }
        
        if (monthlyData.length > 0) {
          onDataImport(monthlyData);
          message.success('CSV数据导入成功！');
        } else {
          message.error('CSV文件格式错误或数据为空');
        }
      } catch (error) {
        console.error('CSV导入错误:', error);
        message.error('CSV文件解析失败');
      }
      setImportLoading(false);
    };
    
    reader.readAsText(file);
    return false; // 阻止默认上传行为
  };

  // 简化的CSV导出功能
  const handleCSVExport = () => {
    setExportLoading(true);
    try {
      // 创建示例数据
      const exportData = [
        ['原始食品收入', '原始食品成本', '原始食品利润', '有机食品收入', '有机食品成本', '有机食品利润'],
        ['85', '48', '37', '65', '42', '23'],
        ['90', '51', '39', '70', '45', '25'],
        ['95', '54', '41', '75', '48', '27'],
        ['100', '57', '43', '80', '51', '29'],
        ['105', '60', '45', '85', '54', '31'],
        ['130', '72', '58', '110', '68', '42'],
        ['150', '82', '68', '130', '78', '52'],
        ['140', '76', '64', '120', '72', '48'],
        ['115', '65', '50', '95', '58', '37'],
        ['110', '62', '48', '90', '55', '35'],
        ['100', '56', '44', '80', '49', '31'],
        ['105', '59', '46', '85', '52', '33']
      ];
      
      const csvContent = exportData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `餐饮经营数据_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      message.success('CSV文件导出成功！');
    } catch (error) {
      console.error('CSV导出错误:', error);
      message.error('CSV文件导出失败');
    }
    setExportLoading(false);
  };

  // 生成CSV模板
  const generateCSVTemplate = () => {
    try {
      const templateData = [
        ['原始食品收入', '原始食品成本', '原始食品利润', '有机食品收入', '有机食品成本', '有机食品利润'],
        ['85', '48', '37', '65', '42', '23'],
        ['90', '51', '39', '70', '45', '25'],
        ['95', '54', '41', '75', '48', '27'],
        ['100', '57', '43', '80', '51', '29'],
        ['105', '60', '45', '85', '54', '31'],
        ['130', '72', '58', '110', '68', '42'],
        ['150', '82', '68', '130', '78', '52'],
        ['140', '76', '64', '120', '72', '48'],
        ['115', '65', '50', '95', '58', '37'],
        ['110', '62', '48', '90', '55', '35'],
        ['100', '56', '44', '80', '49', '31'],
        ['105', '59', '46', '85', '52', '33']
      ];
      
      const csvContent = templateData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', '餐饮数据导入模板.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      message.success('CSV模板生成成功！');
    } catch (error) {
      console.error('生成CSV模板错误:', error);
      message.error('CSV模板生成失败');
    }
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <Space size="middle">
        <Tooltip title="支持CSV格式，请下载模板查看格式">
          <Upload
            accept=".csv"
            beforeUpload={handleCSVImport}
            showUploadList={false}
          >
            <Button 
              icon={<UploadOutlined />} 
              loading={importLoading}
              type="primary"
            >
              {t('importData')}
            </Button>
          </Upload>
        </Tooltip>
        
        <Button 
          icon={<DownloadOutlined />} 
          onClick={handleCSVExport}
          loading={exportLoading}
        >
          {t('exportData')}
        </Button>
        
        <Button 
          icon={<FileTextOutlined />} 
          onClick={generateCSVTemplate}
        >
          {t('downloadTemplate')}
        </Button>
      </Space>
      
      <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
        支持CSV格式，请下载模板查看正确的数据格式
      </div>
    </div>
  );
};

export default DataImportExport;
