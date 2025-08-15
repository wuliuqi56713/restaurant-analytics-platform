import React, { useState } from 'react';
import { Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PDFExporter = ({ analysisData, aiAdvice }) => {
  const [exporting, setExporting] = useState(false);

  const exportToPDF = async () => {
    if (!analysisData) {
      message.error('没有可导出的数据');
      return;
    }

    setExporting(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;

      // 设置中文字体（需要引入字体文件）
      pdf.setFont('helvetica');

      // 封面页
      pdf.setFillColor(30, 60, 114);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(32);
      pdf.text('餐饮经营年度数据分析报告', pageWidth / 2, pageHeight / 2 - 20, { align: 'center' });
      
      pdf.setFontSize(18);
      pdf.text('Restaurant Annual Business Analysis Report', pageWidth / 2, pageHeight / 2 + 10, { align: 'center' });
      
      pdf.setFontSize(14);
      pdf.text('制作者：Vincentxjm', pageWidth / 2, pageHeight / 2 + 40, { align: 'center' });
      pdf.text('制作日期：' + new Date().toLocaleDateString('zh-CN'), pageWidth / 2, pageHeight / 2 + 55, { align: 'center' });

      // 添加水印
      addWatermark(pdf, pageWidth, pageHeight);

      // 数据总览页
      pdf.addPage();
      pdf.setTextColor(30, 60, 114);
      pdf.setFontSize(24);
      pdf.text('数据总览', margin, margin + 20);
      
      pdf.setFontSize(12);
      let yPosition = margin + 40;
      
      const { summary } = analysisData;
      
      // 原始食品数据
      pdf.setFontSize(14);
      pdf.setTextColor(30, 60, 114);
      pdf.text('原始食品年度汇总', margin, yPosition);
      yPosition += 15;
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`总营业额：${summary.original.totalRevenue.toLocaleString('zh-CN')} 万元`, margin + 10, yPosition);
      yPosition += 8;
      pdf.text(`总成本：${summary.original.totalCost.toLocaleString('zh-CN')} 万元`, margin + 10, yPosition);
      yPosition += 8;
      pdf.text(`总利润：${summary.original.totalProfit.toLocaleString('zh-CN')} 万元`, margin + 10, yPosition);
      yPosition += 8;
      pdf.text(`成本占比：${summary.original.costRatio.toFixed(2)}%`, margin + 10, yPosition);
      yPosition += 8;
      pdf.text(`利润率：${summary.original.profitRatio.toFixed(2)}%`, margin + 10, yPosition);
      
      yPosition += 20;
      
      // 有机食品数据
      pdf.setFontSize(14);
      pdf.setTextColor(255, 215, 0);
      pdf.text('有机食品年度汇总', margin, yPosition);
      yPosition += 15;
      
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`总营业额：${summary.organic.totalRevenue.toLocaleString('zh-CN')} 万元`, margin + 10, yPosition);
      yPosition += 8;
      pdf.text(`总成本：${summary.organic.totalCost.toLocaleString('zh-CN')} 万元`, margin + 10, yPosition);
      yPosition += 8;
      pdf.text(`总利润：${summary.organic.totalProfit.toLocaleString('zh-CN')} 万元`, margin + 10, yPosition);
      yPosition += 8;
      pdf.text(`成本占比：${summary.organic.costRatio.toFixed(2)}%`, margin + 10, yPosition);
      yPosition += 8;
      pdf.text(`利润率：${summary.organic.profitRatio.toFixed(2)}%`, margin + 10, yPosition);

      // 对比分析页
      pdf.addPage();
      pdf.setTextColor(30, 60, 114);
      pdf.setFontSize(24);
      pdf.text('对比分析', margin, margin + 20);
      
      yPosition = margin + 40;
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      
      pdf.text(`营业额增长率：${summary.comparison.revenueGrowthRate >= 0 ? '+' : ''}${summary.comparison.revenueGrowthRate.toFixed(2)}%`, margin, yPosition);
      yPosition += 8;
      pdf.text(`营业额增加值：${summary.comparison.revenueIncrease.toLocaleString('zh-CN')} 万元`, margin, yPosition);
      yPosition += 15;
      
      pdf.text(`成本增长率：${summary.comparison.costGrowthRate >= 0 ? '+' : ''}${summary.comparison.costGrowthRate.toFixed(2)}%`, margin, yPosition);
      yPosition += 8;
      pdf.text(`成本增加值：${summary.comparison.costIncrease.toLocaleString('zh-CN')} 万元`, margin, yPosition);
      yPosition += 15;
      
      pdf.text(`利润增长率：${summary.comparison.profitGrowthRate >= 0 ? '+' : ''}${summary.comparison.profitGrowthRate.toFixed(2)}%`, margin, yPosition);
      yPosition += 8;
      pdf.text(`利润增加值：${summary.comparison.profitIncrease.toLocaleString('zh-CN')} 万元`, margin, yPosition);

      // AI分析建议页
      if (aiAdvice) {
        pdf.addPage();
        pdf.setTextColor(30, 60, 114);
        pdf.setFontSize(24);
        pdf.text('AI战略建议', margin, margin + 20);
        
        yPosition = margin + 40;
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        
        const adviceLines = aiAdvice.split('\n');
        adviceLines.forEach(line => {
          if (yPosition > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin + 20;
          }
          
          if (line.trim()) {
            pdf.text(line.trim(), margin, yPosition);
            yPosition += 8;
          }
        });
      }

      // 结论页
      pdf.addPage();
      pdf.setTextColor(30, 60, 114);
      pdf.setFontSize(24);
      pdf.text('结论与建议', margin, margin + 20);
      
      yPosition = margin + 40;
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);
      
      const conclusions = [
        '基于以上数据分析，我们得出以下结论：',
        '',
        '1. 营业额变化趋势分析',
        '2. 成本结构优化建议',
        '3. 利润提升策略',
        '4. 风险控制措施',
        '5. 未来发展方向',
        '',
        '本报告由餐饮分析平台自动生成，',
        '制作者：Vincentxjm',
        '生成时间：' + new Date().toLocaleString('zh-CN')
      ];
      
      conclusions.forEach(line => {
        if (yPosition > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin + 20;
        }
        
        if (line.trim()) {
          pdf.text(line.trim(), margin, yPosition);
          yPosition += 8;
        }
      });

      // 保存PDF
      pdf.save('餐饮经营分析报告_' + new Date().toISOString().split('T')[0] + '.pdf');
      message.success('PDF导出成功！');
      
    } catch (error) {
      console.error('PDF导出失败:', error);
      message.error('PDF导出失败，请重试');
    } finally {
      setExporting(false);
    }
  };

  const addWatermark = (pdf, pageWidth, pageHeight) => {
    pdf.setTextColor(200, 200, 200);
    pdf.setFontSize(12);
    
    // 添加45度斜向水印
    for (let i = 0; i < pageWidth + pageHeight; i += 60) {
      pdf.saveGraphicsState();
      pdf.translate(i, 0);
      pdf.rotate(45);
      pdf.text('Vincentxjm', 0, 0);
      pdf.restoreGraphicsState();
    }
  };

  return (
    <Button
      type="primary"
      icon={<DownloadOutlined />}
      loading={exporting}
      onClick={exportToPDF}
      style={{
        background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
        border: 'none',
        color: '#1e3c72',
        fontWeight: '600'
      }}
    >
      {exporting ? '导出中...' : '导出PDF'}
    </Button>
  );
};

export default PDFExporter;
