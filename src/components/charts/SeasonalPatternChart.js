import React from 'react';
import { Line, Radar } from 'react-chartjs-2';
import { t } from '../../utils/i18n';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SeasonalPatternChart = ({ monthlyData }) => {
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

  // 提取总收入数据
  const totalRevenue = monthlyData.map(item => 
    (parseFloat(item.original_revenue) || 0) + (parseFloat(item.organic_revenue) || 0)
  );

  // 计算季节性指数
  const averageRevenue = totalRevenue.reduce((sum, val) => sum + val, 0) / totalRevenue.length;
  const seasonalIndex = totalRevenue.map(revenue => (revenue / averageRevenue) * 100);

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

  const trendLine = calculateTrendLine(totalRevenue);

  // 计算Y轴范围
  const allRevenueData = [...totalRevenue, ...trendLine];
  const minRevenue = Math.min(...allRevenueData);
  const maxRevenue = Math.max(...allRevenueData);
  const revenueRange = maxRevenue - minRevenue;
  const revenuePadding = revenueRange * 0.15;

  // 收入趋势数据
  const revenueData = {
    labels: t('months'),
    datasets: [
      {
        label: t('totalRevenue'),
        data: totalRevenue,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8
      },
      {
        label: t('trendLine'),
        data: trendLine,
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

  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: t('revenueTrendAndSeasonality'),
        font: { size: 16, weight: 'bold' }
      },
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${t('formatNumber', { num: value })} ${t('millionYuan')}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: t('month')
        }
      },
      y: {
        title: {
          display: true,
          text: `${t('revenue')} (${t('millionYuan')})`
        },
        min: Math.max(0, minRevenue - revenuePadding),
        max: maxRevenue + revenuePadding,
        ticks: {
          color: '#666',
          font: { size: 12 },
          callback: function(value) {
            return value.toFixed(0);
          },
          stepSize: Math.ceil((maxRevenue - minRevenue) / 10)
        }
      }
    }
  };

  // 季节性指数雷达图数据
  const seasonalData = {
    labels: t('months'),
    datasets: [
      {
        label: t('seasonalIndex'),
        data: seasonalIndex,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75, 192, 192, 1)'
      }
    ]
  };

  const seasonalOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: t('seasonalIndex'),
        font: { size: 16, weight: 'bold' }
      },
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${t('seasonalIndex')}: ${context.parsed.r.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      r: {
        beginAtZero: false,
        min: Math.min(...seasonalIndex) * 0.8,
        max: Math.max(...seasonalIndex) * 1.2,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  // 季节性分析结果
  const maxSeasonalIndex = Math.max(...seasonalIndex);
  const minSeasonalIndex = Math.min(...seasonalIndex);
  const maxSeasonalMonth = t('months')[seasonalIndex.indexOf(maxSeasonalIndex)];
  const minSeasonalMonth = t('months')[seasonalIndex.indexOf(minSeasonalIndex)];
  const seasonalStrength = ((maxSeasonalIndex - minSeasonalIndex) / 100) * 100;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', flex: 1, minHeight: '400px' }}>
        <div style={{ position: 'relative' }}>
          <Line data={revenueData} options={revenueOptions} />
        </div>
        <div style={{ position: 'relative' }}>
          <Radar data={seasonalData} options={seasonalOptions} />
        </div>
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
          📊 {t('seasonalAnalysisResults')}
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          <div>
            <h5 style={{ color: '#ff6384', margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
              {t('peakSeason')}
            </h5>
            <div style={{ fontSize: '14px' }}>
              <div><strong>{t('month')}:</strong> {maxSeasonalMonth}</div>
              <div><strong>{t('seasonalIndex')}:</strong> {maxSeasonalIndex.toFixed(1)}%</div>
            </div>
          </div>
          <div>
            <h5 style={{ color: '#36a2eb', margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
              {t('offSeason')}
            </h5>
            <div style={{ fontSize: '14px' }}>
              <div><strong>{t('month')}:</strong> {minSeasonalMonth}</div>
              <div><strong>{t('seasonalIndex')}:</strong> {minSeasonalIndex.toFixed(1)}%</div>
            </div>
          </div>
          <div>
            <h5 style={{ color: '#4bc0c0', margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
              {t('seasonalStrength')}
            </h5>
            <div style={{ fontSize: '14px' }}>
              <div><strong>{t('strength')}:</strong> {seasonalStrength.toFixed(1)}%</div>
              <div><strong>{t('pattern')}:</strong> {seasonalStrength > 20 ? t('strongSeasonal') : seasonalStrength > 10 ? t('moderateSeasonal') : t('weakSeasonal')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonalPatternChart;
