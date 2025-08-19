import React, { useState } from 'react';
import { Button, Upload, message, Space, Tooltip } from 'antd';
import { UploadOutlined, DownloadOutlined, FileExcelOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';
import { t } from '../utils/i18n';

const DataImportExport = ({ onDataImport, currentData }) => {
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Excel导入功能
  const handleImport = (file) => {
    setImporting(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // 验证数据格式
        if (jsonData.length < 13) { // 标题行 + 12个月数据
          message.error(t('invalidData'));
          setImporting(false);
          return;
        }

        // 解析数据
        const monthlyData = [];
        for (let i = 1; i <= 12; i++) { // 跳过标题行
          const row = jsonData[i] || [];
          const monthData = {
            originalRevenue: parseFloat(row[1]) || 0,
            originalCost: parseFloat(row[2]) || 0,
            originalProfit: parseFloat(row[3]) || 0,
            organicRevenue: parseFloat(row[4]) || 0,
            organicCost: parseFloat(row[5]) || 0,
            organicProfit: parseFloat(row[6]) || 0
          };
          monthlyData.push(monthData);
        }

        // 验证数据
        const isValid = monthlyData.every(month => 
          month.originalRevenue >= 0 && month.originalCost >= 0 && month.originalProfit >= 0 &&
          month.organicRevenue >= 0 && month.organicCost >= 0 && month.organicProfit >= 0
        );

        if (!isValid) {
          message.error(t('invalidData'));
          setImporting(false);
          return;
        }

        // 调用父组件的导入函数
        if (onDataImport) {
          onDataImport(monthlyData);
        }
        
        message.success(t('dataImportedSuccessfully'));
        setImporting(false);
      } catch (error) {
        console.error('Excel导入错误:', error);
        message.error(t('dataImportFailed'));
        setImporting(false);
      }
    };

    reader.onerror = () => {
      message.error(t('dataImportFailed'));
      setImporting(false);
    };

    reader.readAsArrayBuffer(file);
    return false; // 阻止自动上传
  };

  // Excel导出功能
  const handleExport = () => {
    if (!currentData) {
      message.error(t('invalidData'));
      return;
    }

    setExporting(true);
    try {
      // 准备导出数据
      const exportData = [
        ['月份', '原始食品营业额', '原始食品成本', '原始食品利润', '有机食品营业额', '有机食品成本', '有机食品利润'],
        ...currentData.map((month, index) => [
          `${index + 1}月`,
          month.originalRevenue,
          month.originalCost,
          month.originalProfit,
          month.organicRevenue,
          month.organicCost,
          month.organicProfit
        ])
      ];

      // 创建工作簿
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(exportData);

      // 设置列宽
      const colWidths = [
        { wch: 8 },  // 月份
        { wch: 15 }, // 原始食品营业额
        { wch: 15 }, // 原始食品成本
        { wch: 15 }, // 原始食品利润
        { wch: 15 }, // 有机食品营业额
        { wch: 15 }, // 有机食品成本
        { wch: 15 }  // 有机食品利润
      ];
      worksheet['!cols'] = colWidths;

      // 添加工作表到工作簿
      XLSX.utils.book_append_sheet(workbook, worksheet, '餐饮数据');

      // 导出文件
      const fileName = `餐饮经营数据_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      message.success('Excel文件导出成功！');
      setExporting(false);
    } catch (error) {
      console.error('Excel导出错误:', error);
      message.error('Excel文件导出失败');
      setExporting(false);
    }
  };

  // 生成Excel模板文件
  const generateSampleExcel = () => {
    try {
      // 只包含标题行，不包含示例数据
      const templateData = [
        ['月份', '原始食品营业额', '原始食品成本', '原始食品利润', '有机食品营业额', '有机食品成本', '有机食品利润']
      ];

      // 添加12个空行供用户填写
      for (let i = 1; i <= 12; i++) {
        templateData.push([`${i}月`, '', '', '', '', '', '']);
      }

      // 创建工作簿
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(templateData);

      // 设置列宽
      const colWidths = [
        { wch: 8 },  // 月份
        { wch: 15 }, // 原始食品营业额
        { wch: 15 }, // 原始食品成本
        { wch: 15 }, // 原始食品利润
        { wch: 15 }, // 有机食品营业额
        { wch: 15 }, // 有机食品成本
        { wch: 15 }  // 有机食品利润
      ];
      worksheet['!cols'] = colWidths;

      // 添加工作表到工作簿
      XLSX.utils.book_append_sheet(workbook, worksheet, '数据模板');

      // 导出文件
      const fileName = '餐饮数据导入模板.xlsx';
      XLSX.writeFile(workbook, fileName);
      
      message.success(t('templateGeneratedSuccessfully'));
    } catch (error) {
      console.error('生成示例文件错误:', error);
      message.error('示例文件生成失败');
    }
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <Space size="middle">
        <Tooltip title={t('importExcel')}>
          <Upload
            accept=".xlsx,.xls"
            beforeUpload={handleImport}
            showUploadList={false}
            disabled={importing}
          >
            <Button 
              icon={<UploadOutlined />} 
              loading={importing}
              type="primary"
            >
              {importing ? t('loading') : t('importExcel')}
            </Button>
          </Upload>
        </Tooltip>

        <Tooltip title={t('exportExcel')}>
          <Button 
            icon={<DownloadOutlined />} 
            onClick={handleExport}
            loading={exporting}
            disabled={!currentData}
          >
            {exporting ? t('loading') : t('exportExcel')}
          </Button>
        </Tooltip>

        <Tooltip title={t('downloadTemplateTooltip')}>
          <Button 
            icon={<FileExcelOutlined />} 
            onClick={generateSampleExcel}
          >
            {t('downloadTemplate')}
          </Button>
        </Tooltip>
      </Space>

                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                <p>{t('excelFormatDescription')}</p>
                <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
                  {t('excelFormatRules').map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
    </div>
  );
};

export default DataImportExport;
