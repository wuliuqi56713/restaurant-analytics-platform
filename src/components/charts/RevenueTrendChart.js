import React from 'react';
import { Line } from 'react-chartjs-2';
import { t } from '../../utils/i18n';

const RevenueTrendChart = ({ monthlyData }) => {
  console.log('RevenueTrendChart received monthlyData:', monthlyData); // 调试日志

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

  // 提取收入数据
  const originalData = monthlyData.map(item => parseFloat(item.originalRevenue) || 0);
  const organicData = monthlyData.map(item => parseFloat(item.organicRevenue) || 0);

  console.log('Extracted revenue data:', { originalData, organicData }); // 调试日志

  // 计算趋势线（线性回归）
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

  const originalTrend = calculateTrendLine(originalData);
  const organicTrend = calculateTrendLine(organicData);

  // 计算Y轴范围
  const allData = [...originalData, ...organicData, ...originalTrend, ...organicTrend];
  const minValue = Math.min(...allData);
  const maxValue = Math.max(...allData);
  const range = maxValue - minValue;
  const padding = range * 0.15; // 15% padding

  const data = {
    labels: t('months'),
    datasets: [
      {
        label: `${t('originalFood')} ${t('revenue')}`,
        data: originalData,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8
      },
      {
        label: `${t('organicFood')} ${t('revenue')}`,
        data: organicData,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8
      },
      {
        label: `${t('originalFood')} ${t('trendLine')}`,
        data: originalTrend,
        backgroundColor: 'transparent',
        borderColor: 'rgba(54, 162, 235, 0.6)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.1,
        pointRadius: 0
      },
      {
        label: `${t('organicFood')} ${t('trendLine')}`,
        data: organicTrend,
        backgroundColor: 'transparent',
        borderColor: 'rgba(255, 99, 132, 0.6)',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        tension: 0.1,
        pointRadius: 0
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: t('revenueTrendAnalysis'),
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
        display: true,
        title: {
          display: true,
          text: `${t('revenue')} (${t('millionYuan')})`,
          color: '#666',
          font: { size: 14, weight: '600' }
        },
        min: Math.max(0, minValue - padding),
        max: maxValue + padding,
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
          stepSize: Math.ceil((maxValue - minValue) / 10)
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  // 计算统计信息
  const originalAvg = originalData.reduce((sum, val) => sum + val, 0) / originalData.length;
  const organicAvg = organicData.reduce((sum, val) => sum + val, 0) / organicData.length;
  const originalMax = Math.max(...originalData);
  const organicMax = Math.max(...organicData);
  const originalMin = Math.min(...originalData);
  const organicMin = Math.min(...organicData);
  const originalTotal = originalData.reduce((sum, val) => sum + val, 0);
  const organicTotal = organicData.reduce((sum, val) => sum + val, 0);

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
          📊 {t('revenueStatistics')}
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div>
            <h5 style={{ color: '#ff6384', margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
              {t('originalFood')} {t('revenue')}
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
              <div><strong>{t('average')}:</strong> {originalAvg.toFixed(1)} {t('millionYuan')}</div>
              <div><strong>{t('maximum')}:</strong> {originalMax.toFixed(0)} {t('millionYuan')}</div>
              <div><strong>{t('minimum')}:</strong> {originalMin.toFixed(0)} {t('millionYuan')}</div>
              <div><strong>{t('totalRevenue')}:</strong> {originalTotal.toFixed(0)} {t('millionYuan')}</div>
            </div>
          </div>
          <div>
            <h5 style={{ color: '#36a2eb', margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
              {t('organicFood')} {t('revenue')}
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
              <div><strong>{t('average')}:</strong> {organicAvg.toFixed(1)} {t('millionYuan')}</div>
              <div><strong>{t('maximum')}:</strong> {organicMax.toFixed(0)} {t('millionYuan')}</div>
              <div><strong>{t('minimum')}:</strong> {organicMin.toFixed(0)} {t('millionYuan')}</div>
              <div><strong>{t('totalRevenue')}:</strong> {organicTotal.toFixed(0)} {t('millionYuan')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueTrendChart;
