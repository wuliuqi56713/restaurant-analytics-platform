const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const app = express();

// 中间件
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// 内存数据库（简单存储）
let database = {
  monthlyData: [],
  summary: {},
  aiAdvice: {}
};

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '服务器运行正常' });
});

// 提交数据
app.post('/api/submit-data', async (req, res) => {
  try {
    const { monthlyData } = req.body;
    
    if (!monthlyData || !Array.isArray(monthlyData)) {
      return res.status(400).json({ error: '无效的数据格式' });
    }

    console.log('收到数据:', monthlyData.length, '条记录');

    // 处理数据
    let totalOriginalRevenue = 0;
    let totalOriginalCost = 0;
    let totalOriginalProfit = 0;
    let totalOrganicRevenue = 0;
    let totalOrganicCost = 0;
    let totalOrganicProfit = 0;

    monthlyData.forEach((item, index) => {
      console.log(`Processing month: ${index + 1} data:`, item);
      
      totalOriginalRevenue += parseFloat(item.originalRevenue) || 0;
      totalOriginalCost += parseFloat(item.originalCost) || 0;
      totalOriginalProfit += parseFloat(item.originalProfit) || 0;
      totalOrganicRevenue += parseFloat(item.organicRevenue) || 0;
      totalOrganicCost += parseFloat(item.organicCost) || 0;
      totalOrganicProfit += parseFloat(item.organicProfit) || 0;
    });

    // 计算汇总数据
    const summary = {
      totalRevenue: {
        original: totalOriginalRevenue,
        organic: totalOrganicRevenue,
        total: totalOriginalRevenue + totalOrganicRevenue
      },
      totalCost: {
        original: totalOriginalCost,
        organic: totalOrganicCost,
        total: totalOriginalCost + totalOrganicCost
      },
      totalProfit: {
        original: totalOriginalProfit,
        organic: totalOrganicProfit,
        total: totalOriginalProfit + totalOrganicProfit
      },
      profitMargin: {
        original: totalOriginalRevenue > 0 ? (totalOriginalProfit / totalOriginalRevenue * 100) : 0,
        organic: totalOrganicRevenue > 0 ? (totalOrganicProfit / totalOrganicRevenue * 100) : 0,
        total: (totalOriginalRevenue + totalOrganicRevenue) > 0 ? 
          ((totalOriginalProfit + totalOrganicProfit) / (totalOriginalRevenue + totalOrganicRevenue) * 100) : 0
      }
    };

    // 生成AI建议
    const aiAdvice = generateAIAdvice(summary, monthlyData);

    // 保存到数据库
    database.monthlyData = monthlyData;
    database.summary = summary;
    database.aiAdvice = aiAdvice;

    res.json({
      success: true,
      message: '数据提交成功',
      summary,
      aiAdvice
    });

  } catch (error) {
    console.error('处理数据时出错:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取数据
app.get('/api/data', (req, res) => {
  res.json({
    monthlyData: database.monthlyData,
    summary: database.summary,
    aiAdvice: database.aiAdvice
  });
});

// AI建议生成函数
function generateAIAdvice(summary, monthlyData) {
  const { totalRevenue, totalProfit, profitMargin } = summary;
  
  let advice = {
    revenue: [],
    cost: [],
    profit: [],
    strategy: []
  };

  // 收入建议
  if (totalRevenue.total < 1000) {
    advice.revenue.push('建议增加营销投入，扩大客户群体');
  } else if (totalRevenue.total > 2000) {
    advice.revenue.push('收入表现良好，可以考虑扩大规模');
  }

  // 利润建议
  if (profitMargin.total < 20) {
    advice.profit.push('利润率偏低，建议优化成本结构');
  } else if (profitMargin.total > 40) {
    advice.profit.push('利润率优秀，可以考虑增加投资');
  }

  // 策略建议
  if (totalProfit.organic > totalProfit.original) {
    advice.strategy.push('有机食品业务表现更好，建议重点发展');
  } else {
    advice.strategy.push('传统食品业务占主导，建议平衡发展');
  }

  // 季节性分析
  const monthlyRevenues = monthlyData.map(item => parseFloat(item.originalRevenue) + parseFloat(item.organicRevenue));
  const maxMonth = monthlyRevenues.indexOf(Math.max(...monthlyRevenues)) + 1;
  const minMonth = monthlyRevenues.indexOf(Math.min(...monthlyRevenues)) + 1;
  
  advice.strategy.push(`第${maxMonth}月是销售高峰，建议提前准备库存`);
  advice.strategy.push(`第${minMonth}月是销售低谷，建议加强促销活动`);

  return advice;
}

// 导出为Netlify Function
module.exports.handler = serverless(app);
