import React from 'react';
import { Bar } from 'react-chartjs-2';
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

const ComparisonChart = ({ summary }) => {
  const data = {
    labels: ['营业额', '成本', '利润'],
    datasets: [
      {
        label: '原始食品',
        data: [
          summary.original.totalRevenue,
          summary.original.totalCost,
          summary.original.totalProfit
        ],
        backgroundColor: 'rgba(30, 60, 114, 0.8)',
        borderColor: '#1e3c72',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false
      },
      {
        label: '有机食品',
        data: [
          summary.organic.totalRevenue,
          summary.organic.totalCost,
          summary.organic.totalProfit
        ],
        backgroundColor: 'rgba(255, 215, 0, 0.8)',
        borderColor: '#ffd700',
        borderWidth: 2,
        borderRadius: 8,
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
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString('zh-CN')} 万元`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#666',
          font: {
            size: 12,
            weight: '600'
          }
        }
      },
      y: {
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
            return value.toLocaleString('zh-CN') + '万';
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

export default ComparisonChart;
