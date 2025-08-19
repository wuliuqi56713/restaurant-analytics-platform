import React from 'react';
import { Line } from 'react-chartjs-2';
import { t } from '../../utils/i18n';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  Title,
  Tooltip,
  Legend,
  Filler
);

const ProfitMarginChart = ({ monthlyData }) => {
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

  const months = t('months');
  
  // 确保数据是数字类型并计算利润率 = (利润 / 营业额) * 100
  const originalProfitMargins = monthlyData.map(item => {
    const revenue = parseFloat(item.original_revenue) || 0;
    const profit = parseFloat(item.original_profit) || 0;
    return revenue > 0 ? (profit / revenue * 100) : 0;
  });
  
  const organicProfitMargins = monthlyData.map(item => {
    const revenue = parseFloat(item.organic_revenue) || 0;
    const profit = parseFloat(item.organic_profit) || 0;
    return revenue > 0 ? (profit / revenue * 100) : 0;
  });

  // 计算数据范围用于设置Y轴
  const allData = [...originalProfitMargins, ...organicProfitMargins];
  const minValue = Math.min(...allData);
  const maxValue = Math.max(...allData);
  const range = maxValue - minValue;
  const padding = range * 0.1; // 10% padding

  const data = {
    labels: months,
    datasets: [
      {
        label: `${t('originalFood')} ${t('profitMargin')}`,
        data: originalProfitMargins,
        borderColor: '#1890ff',
        backgroundColor: 'rgba(24, 144, 255, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#1890ff',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      },
      {
        label: `${t('organicFood')} ${t('profitMargin')}`,
        data: organicProfitMargins,
        borderColor: '#52c41a',
        backgroundColor: 'rgba(82, 196, 26, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#52c41a',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
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
            weight: 'bold'
          }
        }
      },
      title: {
        display: true,
        text: t('profitMarginTrendAnalysis'),
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
        borderColor: '#1890ff',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const number = parseFloat(context.parsed.y);
            return `${context.dataset.label}: ${isNaN(number) ? '0.00' : number.toFixed(2)}%`;
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
          text: `${t('profitMargin')} (%)`,
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
            return value + '%';
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      point: {
        hoverBackgroundColor: '#fff'
      }
    }
  };

  return (
    <div style={{ height: '300px', position: 'relative' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default ProfitMarginChart;
