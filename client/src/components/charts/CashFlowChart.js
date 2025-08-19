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

const CashFlowChart = ({ monthlyData }) => {
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
  
  // 确保数据是数字类型并计算现金流：营业额 - 成本
  const originalCashFlow = monthlyData.map(item => parseFloat(item.original_revenue || 0) - parseFloat(item.original_cost || 0));
  const organicCashFlow = monthlyData.map(item => parseFloat(item.organic_revenue || 0) - parseFloat(item.organic_cost || 0));
  
  // 计算累计现金流
  const originalCumulativeCashFlow = originalCashFlow.reduce((acc, curr, index) => {
    acc.push(index === 0 ? curr : acc[index - 1] + curr);
    return acc;
  }, []);
  
  const organicCumulativeCashFlow = organicCashFlow.reduce((acc, curr, index) => {
    acc.push(index === 0 ? curr : acc[index - 1] + curr);
    return acc;
  }, []);

  // 计算数据范围用于设置Y轴
  const allCashFlowData = [...originalCashFlow, ...organicCashFlow];
  const allCumulativeData = [...originalCumulativeCashFlow, ...organicCumulativeCashFlow];
  
  const cashFlowMin = Math.min(...allCashFlowData);
  const cashFlowMax = Math.max(...allCashFlowData);
  const cumulativeMin = Math.min(...allCumulativeData);
  const cumulativeMax = Math.max(...allCumulativeData);
  
  const cashFlowRange = cashFlowMax - cashFlowMin;
  const cumulativeRange = cumulativeMax - cumulativeMin;
  const cashFlowPadding = cashFlowRange * 0.1;
  const cumulativePadding = cumulativeRange * 0.1;

  const data = {
    labels: months,
    datasets: [
      {
        label: `${t('originalFood')} ${t('cashFlowAnalysis')}`,
        data: originalCashFlow,
        borderColor: '#722ed1',
        backgroundColor: 'rgba(114, 46, 209, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#722ed1',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        yAxisID: 'y'
      },
      {
        label: `${t('organicFood')} ${t('cashFlowAnalysis')}`,
        data: organicCashFlow,
        borderColor: '#13c2c2',
        backgroundColor: 'rgba(19, 194, 194, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: '#13c2c2',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        yAxisID: 'y'
      },
      {
        label: `${t('originalFood')} Cumulative ${t('cashFlowAnalysis')}`,
        data: originalCumulativeCashFlow,
        borderColor: '#fa8c16',
        backgroundColor: 'rgba(250, 140, 22, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#fa8c16',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: 'y1'
      },
      {
        label: `${t('organicFood')} Cumulative ${t('cashFlowAnalysis')}`,
        data: organicCumulativeCashFlow,
        borderColor: '#eb2f96',
        backgroundColor: 'rgba(235, 47, 150, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#eb2f96',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
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
        text: t('cashFlowAnalysis'),
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
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: `${t('cashFlowAnalysis')} (${t('millionYuan')})`,
          color: '#666',
          font: {
            size: 12,
            weight: '600'
          }
        },
        min: cashFlowMin - cashFlowPadding,
        max: cashFlowMax + cashFlowPadding,
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
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: `Cumulative ${t('cashFlowAnalysis')} (${t('millionYuan')})`,
          color: '#666',
          font: {
            size: 12,
            weight: '600'
          }
        },
        min: cumulativeMin - cumulativePadding,
        max: cumulativeMax + cumulativePadding,
        grid: {
          drawOnChartArea: false,
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
    },
    elements: {
      point: {
        hoverBackgroundColor: '#fff',
        hoverBorderWidth: 3
      }
    }
  };

  return (
    <div style={{ height: '300px', position: 'relative' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default CashFlowChart;
