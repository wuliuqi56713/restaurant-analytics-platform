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
      },
      // 添加同比计算数据
      comparison: {
        revenueGrowthRate: totalOriginalRevenue > 0 ? 
          ((totalOrganicRevenue - totalOriginalRevenue) / totalOriginalRevenue * 100) : 0,
        costGrowthRate: totalOriginalCost > 0 ? 
          ((totalOrganicCost - totalOriginalCost) / totalOriginalCost * 100) : 0,
        profitGrowthRate: totalOriginalProfit > 0 ? 
          ((totalOrganicProfit - totalOriginalProfit) / totalOriginalProfit * 100) : 0,
        marginChange: (totalOrganicRevenue > 0 ? (totalOrganicProfit / totalOrganicRevenue * 100) : 0) - 
                     (totalOriginalRevenue > 0 ? (totalOriginalProfit / totalOriginalRevenue * 100) : 0),
        costRatioChange: (totalOrganicRevenue > 0 ? (totalOrganicCost / totalOrganicRevenue * 100) : 0) - 
                        (totalOriginalRevenue > 0 ? (totalOriginalCost / totalOriginalRevenue * 100) : 0),
        revenueIncrease: totalOrganicRevenue - totalOriginalRevenue,
        costIncrease: totalOrganicCost - totalOriginalCost,
        profitIncrease: totalOrganicProfit - totalOriginalProfit
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
      monthlyData,
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
  const { totalRevenue, totalCost, totalProfit, profitMargin } = summary;
  
  let advice = {
    revenue: [],
    cost: [],
    profit: [],
    strategy: [],
    seasonal: [],
    recommendations: []
  };

  // 收入分析建议
  if (totalRevenue.total < 1000) {
    advice.revenue.push('总收入偏低，建议增加营销投入，扩大客户群体');
    advice.revenue.push('考虑开发新的产品线或服务项目');
  } else if (totalRevenue.total > 2000) {
    advice.revenue.push('收入表现良好，可以考虑扩大规模');
    advice.revenue.push('建议投资更多资源到表现最好的业务线');
  } else {
    advice.revenue.push('收入处于中等水平，建议优化现有业务模式');
  }

  // 成本分析建议
  const costRatio = totalCost.total / totalRevenue.total;
  if (costRatio > 0.8) {
    advice.cost.push('成本占比过高，建议优化供应链管理');
    advice.cost.push('考虑寻找更优质的供应商或批量采购');
  } else if (costRatio < 0.6) {
    advice.cost.push('成本控制良好，可以考虑提高服务质量');
  } else {
    advice.cost.push('成本结构合理，建议保持当前水平');
  }

  // 利润分析建议
  if (profitMargin.total < 15) {
    advice.profit.push('利润率偏低，建议优化成本结构');
    advice.profit.push('考虑提高产品定价或增加高利润产品');
  } else if (profitMargin.total > 35) {
    advice.profit.push('利润率优秀，可以考虑增加投资扩大规模');
    advice.profit.push('建议将部分利润投入到研发或市场拓展');
  } else {
    advice.profit.push('利润率处于健康水平，建议保持稳定发展');
  }

  // 业务策略建议
  if (totalProfit.organic > totalProfit.original) {
    advice.strategy.push('有机食品业务表现更好，建议重点发展');
    advice.strategy.push('可以考虑增加有机食品的产品种类');
  } else {
    advice.strategy.push('传统食品业务占主导，建议平衡发展');
    advice.strategy.push('考虑逐步增加有机食品的投入');
  }

  // 季节性分析
  const monthlyRevenues = monthlyData.map(item => parseFloat(item.originalRevenue) + parseFloat(item.organicRevenue));
  const maxMonth = monthlyRevenues.indexOf(Math.max(...monthlyRevenues)) + 1;
  const minMonth = monthlyRevenues.indexOf(Math.min(...monthlyRevenues)) + 1;
  
  advice.seasonal.push(`第${maxMonth}月是销售高峰，建议提前准备库存和人员`);
  advice.seasonal.push(`第${minMonth}月是销售低谷，建议加强促销活动和营销投入`);
  
  // 计算季节性强度
  const avgRevenue = monthlyRevenues.reduce((a, b) => a + b, 0) / monthlyRevenues.length;
  const seasonalStrength = ((Math.max(...monthlyRevenues) - Math.min(...monthlyRevenues)) / avgRevenue * 100).toFixed(1);
  advice.seasonal.push(`季节性强度为${seasonalStrength}%，建议根据季节性特点调整经营策略`);

  // 综合建议
  advice.recommendations.push('建议每月进行数据分析，及时调整经营策略');
  advice.recommendations.push('考虑建立客户反馈机制，了解市场需求变化');
  advice.recommendations.push('建议制定详细的年度经营计划，包括收入目标和成本控制');
  
  if (totalRevenue.total > 1500) {
    advice.recommendations.push('业务规模较大，建议考虑引入专业的管理系统');
  }

  return advice;
}

// 导出为Netlify Function
module.exports.handler = serverless(app);
