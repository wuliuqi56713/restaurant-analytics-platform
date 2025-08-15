import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const CostStructureChart = ({ summary }) => {
  const data = {
    labels: ['原始食品成本', '原始食品利润', '有机食品成本', '有机食品利润'],
    datasets: [
      {
        data: [
          summary.original.totalCost,
          summary.original.totalProfit,
          summary.organic.totalCost,
          summary.organic.totalProfit
        ],
        backgroundColor: [
          'rgba(30, 60, 114, 0.8)',
          'rgba(30, 60, 114, 0.4)',
          'rgba(255, 215, 0, 0.8)',
          'rgba(255, 215, 0, 0.4)'
        ],
        borderColor: [
          '#1e3c72',
          '#1e3c72',
          '#ffd700',
          '#ffd700'
        ],
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 11,
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
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed.toLocaleString('zh-CN')} 万元 (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
    radius: '90%'
  };

  return (
    <div style={{ height: '300px', position: 'relative' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default CostStructureChart;
