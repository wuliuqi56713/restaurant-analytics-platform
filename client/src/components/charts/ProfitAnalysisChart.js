import React from 'react';
import { Line } from 'react-chartjs-2';
import { t } from '../../utils/i18n';

const ProfitAnalysisChart = ({ monthlyData }) => {
  if (!monthlyData || monthlyData.length === 0) {
    return (
      <div style={{ 
        height: '400px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <div style={{ color: '#666', fontSize: '16px' }}>
          {t('loading')}...
        </div>
      </div>
    );
  }

  // 提取利润数据
  const originalProfit = monthlyData.map(item => parseFloat(item.originalProfit) || 0);
  const organicProfit = monthlyData.map(item => parseFloat(item.organicProfit) || 0);

  // 计算利润率
  const originalProfitMargin = monthlyData.map(item => {
    const revenue = parseFloat(item.originalRevenue) || 0;
    const profit = parseFloat(item.originalProfit) || 0;
    return revenue > 0 ? (profit / revenue * 100) : 0;
  });

  const organicProfitMargin = monthlyData.map(item => {
    const revenue = parseFloat(item.organicRevenue) || 0;
    const profit = parseFloat(item.organicProfit) || 0;
    return revenue > 0 ? (profit / revenue * 100) : 0;
  });

  // 计算趋势线
  const calculateTrendLine = (data) => {
    const n = data.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = data.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * data[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return x.map(xi => slope * xi + intercept);
  };

  const originalProfitTrend = calculateTrendLine(originalProfit);
  const organicProfitTrend = calculateTrendLine(organicProfit);

  // 计算Y轴范围
  const allProfitData = [...originalProfit, ...organicProfit, ...originalProfitTrend, ...organicProfitTrend];
  const allMarginData = [...originalProfitMargin, ...organicProfitMargin];

  const profitMin = Math.min(...allProfitData);
  const profitMax = Math.max(...allProfitData);
  const marginMin = Math.min(...allMarginData);
  const marginMax = Math.max(...allMarginData);

  const profitRange = profitMax - profitMin;
  const marginRange = marginMax - marginMin;
  const profitPadding = profitRange * 0.15;
  const marginPadding = marginRange * 0.15;

  const data = {
    labels: t('months'),
    datasets: [
      {
        label: `${t('originalFood')} ${t('profit')}`,
        data: originalProfit,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        yAxisID: 'y'
      },
      {
        label: `${t('organicFood')} ${t('profit')}`,
        data: organicProfit,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        yAxisID: 'y'
      },
      {
        label: `${t('originalFood')} ${t('trendLine')}`,
        data: originalProfitTrend,
        backgroundColor: 'transparent',
        borderColor: 'rgba(54, 162, 235, 0.6)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.1,
        pointRadius: 0,
        yAxisID: 'y'
      },
      {
        label: `${t('organicFood')} ${t('trendLine')}`,
        data: organicProfitTrend,
        backgroundColor: 'transparent',
        borderColor: 'rgba(255, 99, 132, 0.6)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.1,
        pointRadius: 0,
        yAxisID: 'y'
      },
      {
        label: `${t('originalFood')} ${t('profitMargin')}`,
        data: originalProfitMargin,
        backgroundColor: 'rgba(75, 192, 192, 0.3)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'y1'
      },
      {
        label: `${t('organicFood')} ${t('profitMargin')}`,
        data: organicProfitMargin,
        backgroundColor: 'rgba(255, 159, 64, 0.3)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 2,
        fill: false,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'y1'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: t('profitAnalysis'),
        font: { size: 18, weight: 'bold' },
        color: '#1a1a1a',
        padding: 20
      },
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 14, weight: '600' }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#ff6384',
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: true,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            if (context.dataset.yAxisID === 'y1') {
              return `${label}: ${value.toFixed(2)}%`;
            }
            return `${label}: ${value.toFixed(0)} ${t('millionYuan')}`;
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: t('month'),
          color: '#666',
          font: { size: 14, weight: '600' }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#666',
          font: { size: 12 }
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: `${t('profit')} (${t('millionYuan')})`,
          color: '#666',
          font: { size: 14, weight: '600' }
        },
        min: Math.max(0, profitMin - profitPadding),
        max: profitMax + profitPadding,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#666',
          font: { size: 12 },
          callback: function(value) {
            return value.toFixed(0);
          },
          stepSize: Math.ceil((profitMax - profitMin) / 10)
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: `${t('profitMargin')} (%)`,
          color: '#666',
          font: { size: 14, weight: '600' }
        },
        min: Math.max(0, marginMin - marginPadding),
        max: marginMax + marginPadding,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: '#666',
          font: { size: 12 },
          callback: function(value) {
            return value.toFixed(1) + '%';
          },
          stepSize: Math.ceil((marginMax - marginMin) / 10)
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  // 计算统计信息
  const originalProfitAvg = originalProfit.reduce((sum, val) => sum + val, 0) / originalProfit.length;
  const organicProfitAvg = organicProfit.reduce((sum, val) => sum + val, 0) / organicProfit.length;
  const originalMarginAvg = originalProfitMargin.reduce((sum, val) => sum + val, 0) / originalProfitMargin.length;
  const organicMarginAvg = organicProfitMargin.reduce((sum, val) => sum + val, 0) / organicProfitMargin.length;
  const originalProfitTotal = originalProfit.reduce((sum, val) => sum + val, 0);
  const organicProfitTotal = organicProfit.reduce((sum, val) => sum + val, 0);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: '400px', position: 'relative' }}>
        <Line data={data} options={options} />
      </div>
      <div style={{ 
        marginTop: '24px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '12px',
        border: '1px solid #e9ecef',
        flexShrink: 0
      }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#495057', fontSize: '18px', fontWeight: 'bold' }}>
          📊 {t('profitStatistics')}
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div>
            <h5 style={{ color: '#ff6384', margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
              {t('originalFood')} {t('profit')}
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
              <div><strong>{t('average')}:</strong> {originalProfitAvg.toFixed(1)} {t('millionYuan')}</div>
              <div><strong>{t('totalProfit')}:</strong> {originalProfitTotal.toFixed(0)} {t('millionYuan')}</div>
              <div><strong>{t('profitMargin')}:</strong> {originalMarginAvg.toFixed(2)}%</div>
            </div>
          </div>
          <div>
            <h5 style={{ color: '#36a2eb', margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
              {t('organicFood')} {t('profit')}
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
              <div><strong>{t('average')}:</strong> {organicProfitAvg.toFixed(1)} {t('millionYuan')}</div>
              <div><strong>{t('totalProfit')}:</strong> {organicProfitTotal.toFixed(0)} {t('millionYuan')}</div>
              <div><strong>{t('profitMargin')}:</strong> {organicMarginAvg.toFixed(2)}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitAnalysisChart;
