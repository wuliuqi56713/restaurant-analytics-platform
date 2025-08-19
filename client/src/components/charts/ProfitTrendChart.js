import React from 'react';
import { Bar } from 'react-chartjs-2';
import { t } from '../../utils/i18n';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProfitTrendChart = ({ monthlyData }) => {
  if (!monthlyData || monthlyData.length === 0) {
    return (
      <div style={{ 
        height: '300px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <div style={{ color: '#666', fontSize: '14px' }}>
          {t('loading')}...
        </div>
      </div>
    );
  }

  const monthNames = t('months');
  
  // 确保数据是数字类型
  const originalData = monthlyData.map(item => parseFloat(item.original_profit) || 0);
  const organicData = monthlyData.map(item => parseFloat(item.organic_profit) || 0);

  // 计算数据范围用于设置Y轴
  const allData = [...originalData, ...organicData];
  const minValue = Math.min(...allData);
  const maxValue = Math.max(...allData);
  const range = maxValue - minValue;
  const padding = range * 0.1; // 10% padding

  const data = {
    labels: monthNames,
    datasets: [
      {
        label: `${t('originalFood')} ${t('profit')}`,
        data: originalData,
        backgroundColor: 'rgba(30, 60, 114, 0.7)',
        borderColor: '#1e3c72',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false
      },
      {
        label: `${t('organicFood')} ${t('profit')}`,
        data: organicData,
        backgroundColor: 'rgba(255, 215, 0, 0.7)',
        borderColor: '#ffd700',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
      title: {
        display: true,
        text: t('profitTrendAnalysis'),
        font: {
          size: 16,
          weight: 'bold'
        },
        color: '#1a1a1a'
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#ffd700',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${t('formatNumber', { num: context.parsed.y })}`;
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
          font: {
            size: 12,
            weight: '600'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#666',
          font: {
            size: 11
          }
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: `${t('profit')} (${t('millionYuan')})`,
          color: '#666',
          font: {
            size: 12,
            weight: '600'
          }
        },
        min: Math.max(0, minValue - padding), // 确保最小值不为负数
        max: maxValue + padding,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#666',
          font: {
            size: 11
          },
          callback: function(value) {
            return t('formatNumber', { num: value });
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <div style={{ height: '300px', position: 'relative' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ProfitTrendChart;
