import React from 'react';
import { Bar } from 'react-chartjs-2';
import { t } from '../../utils/i18n';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const CostStructureChart = ({ monthlyData }) => {
  console.log('CostStructureChart received monthlyData:', monthlyData); // 调试日志
  
  if (!monthlyData || monthlyData.length === 0) {
    console.log('CostStructureChart: No data available'); // 调试日志
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

  // 提取成本数据
  const originalCost = monthlyData.map(item => parseFloat(item.originalCost || 0));
  const organicCost = monthlyData.map(item => parseFloat(item.organicCost || 0));
  
  console.log('CostStructureChart extracted data:', { originalCost, organicCost }); // 调试日志
  
  // 计算成本占比
  const originalCostRatio = monthlyData.map(item => {
    const revenue = parseFloat(item.originalRevenue) || 0;
    const cost = parseFloat(item.originalCost) || 0;
    return revenue > 0 ? (cost / revenue * 100) : 0;
  });
  
  const organicCostRatio = monthlyData.map(item => {
    const revenue = parseFloat(item.organicRevenue) || 0;
    const cost = parseFloat(item.organicCost) || 0;
    return revenue > 0 ? (cost / revenue * 100) : 0;
  });

  // 计算Y轴范围
  const allCostData = [...originalCost, ...organicCost];
  const allRatioData = [...originalCostRatio, ...organicCostRatio];

  const costMin = Math.min(...allCostData);
  const costMax = Math.max(...allCostData);
  const ratioMin = Math.min(...allRatioData);
  const ratioMax = Math.max(...allRatioData);

  const costRange = costMax - costMin;
  const ratioRange = ratioMax - ratioMin;
  const costPadding = costRange * 0.15;
  const ratioPadding = ratioRange * 0.15;

  const data = {
    labels: t('months'),
    datasets: [
      {
        label: `${t('originalFood')} ${t('cost')}`,
        data: originalCost,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        yAxisID: 'y',
        type: 'bar'
      },
      {
        label: `${t('organicFood')} ${t('cost')}`,
        data: organicCost,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        yAxisID: 'y',
        type: 'bar'
      },
      {
        label: `${t('originalFood')} ${t('costRatio')}`,
        data: originalCostRatio,
        backgroundColor: 'rgba(75, 192, 192, 0.3)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        yAxisID: 'y1',
        type: 'line',
        fill: false
      },
      {
        label: `${t('organicFood')} ${t('costRatio')}`,
        data: organicCostRatio,
        backgroundColor: 'rgba(255, 159, 64, 0.3)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 2,
        yAxisID: 'y1',
        type: 'line',
        fill: false
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: t('costStructureAnalysis'),
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
        title: {
          display: true,
          text: t('month')
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: `${t('cost')} (${t('millionYuan')})`
        },
        min: Math.max(0, costMin - costPadding),
        max: costMax + costPadding,
        grid: {
          drawOnChartArea: true,
        },
        ticks: {
          color: '#666',
          font: { size: 12 },
          callback: function(value) {
            return value.toFixed(0);
          },
          stepSize: Math.ceil((costMax - costMin) / 10)
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: `${t('costRatio')} (%)`
        },
        min: Math.max(0, ratioMin - ratioPadding),
        max: ratioMax + ratioPadding,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: '#666',
          font: { size: 12 },
          callback: function(value) {
            return value.toFixed(1) + '%';
          },
          stepSize: Math.ceil((ratioMax - ratioMin) / 10)
        }
      },
    },
  };

  // 计算统计信息
  const originalAvgCost = originalCost.reduce((sum, val) => sum + val, 0) / originalCost.length;
  const organicAvgCost = organicCost.reduce((sum, val) => sum + val, 0) / organicCost.length;
  const originalAvgRatio = originalCostRatio.reduce((sum, val) => sum + val, 0) / originalCostRatio.length;
  const organicAvgRatio = organicCostRatio.reduce((sum, val) => sum + val, 0) / organicCostRatio.length;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: '400px', position: 'relative' }}>
        <Bar data={data} options={options} />
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
          📊 {t('costStatistics')}
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div>
            <h5 style={{ color: '#ff6384', margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
              {t('originalFood')} {t('cost')}
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
              <div><strong>{t('average')}:</strong> {originalAvgCost.toFixed(1)} {t('millionYuan')}</div>
              <div><strong>{t('costRatio')}:</strong> {originalAvgRatio.toFixed(2)}%</div>
              <div><strong>{t('maximum')}:</strong> {Math.max(...originalCost).toFixed(0)} {t('millionYuan')}</div>
              <div><strong>{t('minimum')}:</strong> {Math.min(...originalCost).toFixed(0)} {t('millionYuan')}</div>
            </div>
          </div>
          <div>
            <h5 style={{ color: '#36a2eb', margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
              {t('organicFood')} {t('cost')}
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
              <div><strong>{t('average')}:</strong> {organicAvgCost.toFixed(1)} {t('millionYuan')}</div>
              <div><strong>{t('costRatio')}:</strong> {organicAvgRatio.toFixed(2)}%</div>
              <div><strong>{t('maximum')}:</strong> {Math.max(...organicCost).toFixed(0)} {t('millionYuan')}</div>
              <div><strong>{t('minimum')}:</strong> {Math.min(...organicCost).toFixed(0)} {t('millionYuan')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostStructureChart;
