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

const CostStructureTrendChart = ({ monthlyData }) => {
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
  
  // 确保数据是数字类型并计算成本结构：成本占营业额的比例
  const originalCostRatios = monthlyData.map(item => {
    const revenue = parseFloat(item.original_revenue) || 0;
    const cost = parseFloat(item.original_cost) || 0;
    return revenue > 0 ? (cost / revenue * 100) : 0;
  });
  
  const organicCostRatios = monthlyData.map(item => {
    const revenue = parseFloat(item.organic_revenue) || 0;
    const cost = parseFloat(item.organic_cost) || 0;
    return revenue > 0 ? (cost / revenue * 100) : 0;
  });

  // 计算数据范围用于设置Y轴
  const allData = [...originalCostRatios, ...organicCostRatios];
  const minValue = Math.min(...allData);
  const maxValue = Math.max(...allData);
  const range = maxValue - minValue;
  const padding = range * 0.1; // 10% padding

  const data = {
    labels: months,
    datasets: [
      {
        label: `${t('originalFood')} ${t('costRatio')}`,
        data: originalCostRatios,
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: '#ff6384',
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false
      },
      {
        label: `${t('organicFood')} ${t('costRatio')}`,
        data: organicCostRatios,
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: '#36a2eb',
        borderWidth: 2,
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
            weight: 'bold'
          }
        }
      },
      title: {
        display: true,
        text: t('costStructureChange'),
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
          text: `${t('costRatio')} (%)`,
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
    }
  };

  return (
    <div style={{ height: '300px', position: 'relative' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default CostStructureTrendChart;
