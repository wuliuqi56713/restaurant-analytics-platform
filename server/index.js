const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 数据库连接
const dbPath = path.join(__dirname, 'database', 'restaurant.db');
const db = new sqlite3.Database(dbPath);

// 初始化数据库
const initDatabase = () => {
  db.serialize(() => {
    // 创建月度数据表
    db.run(`
      CREATE TABLE IF NOT EXISTS monthly_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        month INTEGER NOT NULL,
        original_revenue REAL NOT NULL,
        original_cost REAL NOT NULL,
        original_profit REAL NOT NULL,
        organic_revenue REAL NOT NULL,
        organic_cost REAL NOT NULL,
        organic_profit REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建分析结果表
    db.run(`
      CREATE TABLE IF NOT EXISTS analysis_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        original_total_revenue REAL NOT NULL,
        original_total_cost REAL NOT NULL,
        original_total_profit REAL NOT NULL,
        organic_total_revenue REAL NOT NULL,
        organic_total_cost REAL NOT NULL,
        organic_total_profit REAL NOT NULL,
        revenue_growth_rate REAL NOT NULL,
        cost_growth_rate REAL NOT NULL,
        profit_growth_rate REAL NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });
};

// 初始化数据库
initDatabase();

// 路由
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '服务器运行正常' });
});

// 提交月度数据
app.post('/api/submit-data', (req, res) => {
  const { monthlyData } = req.body;
  
  if (!monthlyData || monthlyData.length !== 12) {
    return res.status(400).json({ error: '需要提供12个月的完整数据' });
  }

  // 清空旧数据
  db.run('DELETE FROM monthly_data', (err) => {
    if (err) {
      return res.status(500).json({ error: '数据库操作失败' });
    }

    // 插入新数据
    const stmt = db.prepare(`
      INSERT INTO monthly_data 
      (month, original_revenue, original_cost, original_profit, 
       organic_revenue, organic_cost, organic_profit) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    monthlyData.forEach((data, index) => {
      const month = index + 1;
      stmt.run([
        month,
        data.originalRevenue || 0,
        data.originalCost || 0,
        data.originalProfit || 0,
        data.organicRevenue || 0,
        data.organicCost || 0,
        data.organicProfit || 0
      ]);
    });

    stmt.finalize((err) => {
      if (err) {
        return res.status(500).json({ error: '数据保存失败' });
      }

      // 计算分析结果
      calculateAnalysisResults(res);
    });
  });
});

// 计算分析结果
const calculateAnalysisResults = (res) => {
  db.all('SELECT * FROM monthly_data ORDER BY month', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: '数据查询失败' });
    }

    // 计算原始食品年度汇总
    const originalTotalRevenue = rows.reduce((sum, row) => sum + row.original_revenue, 0);
    const originalTotalCost = rows.reduce((sum, row) => sum + row.original_cost, 0);
    const originalTotalProfit = rows.reduce((sum, row) => sum + row.original_profit, 0);

    // 计算有机食品年度汇总
    const organicTotalRevenue = rows.reduce((sum, row) => sum + row.organic_revenue, 0);
    const organicTotalCost = rows.reduce((sum, row) => sum + row.organic_cost, 0);
    const organicTotalProfit = rows.reduce((sum, row) => sum + row.organic_profit, 0);

    // 计算同比增长率
    const revenueGrowthRate = originalTotalRevenue > 0 ? 
      ((organicTotalRevenue - originalTotalRevenue) / originalTotalRevenue * 100) : 0;
    const costGrowthRate = originalTotalCost > 0 ? 
      ((organicTotalCost - originalTotalCost) / originalTotalCost * 100) : 0;
    const profitGrowthRate = originalTotalProfit > 0 ? 
      ((organicTotalProfit - originalTotalProfit) / originalTotalProfit * 100) : 0;

    // 计算成本占比和利润率
    const originalCostRatio = originalTotalRevenue > 0 ? (originalTotalCost / originalTotalRevenue * 100) : 0;
    const originalProfitRatio = originalTotalRevenue > 0 ? (originalTotalProfit / originalTotalRevenue * 100) : 0;
    const organicCostRatio = organicTotalRevenue > 0 ? (organicTotalCost / organicTotalRevenue * 100) : 0;
    const organicProfitRatio = organicTotalRevenue > 0 ? (organicTotalProfit / organicTotalRevenue * 100) : 0;

    const analysisResult = {
      monthlyData: rows,
      summary: {
        original: {
          totalRevenue: originalTotalRevenue,
          totalCost: originalTotalCost,
          totalProfit: originalTotalProfit,
          costRatio: originalCostRatio,
          profitRatio: originalProfitRatio
        },
        organic: {
          totalRevenue: organicTotalRevenue,
          totalCost: organicTotalCost,
          totalProfit: organicTotalProfit,
          costRatio: organicCostRatio,
          profitRatio: organicProfitRatio
        },
        comparison: {
          revenueGrowthRate: revenueGrowthRate,
          costGrowthRate: costGrowthRate,
          profitGrowthRate: profitGrowthRate,
          revenueIncrease: organicTotalRevenue - originalTotalRevenue,
          costIncrease: organicTotalCost - originalTotalCost,
          profitIncrease: organicTotalProfit - originalTotalProfit
        }
      }
    };

    // 保存分析结果
    db.run(`
      INSERT INTO analysis_results 
      (original_total_revenue, original_total_cost, original_total_profit,
       organic_total_revenue, organic_total_cost, organic_total_profit,
       revenue_growth_rate, cost_growth_rate, profit_growth_rate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      originalTotalRevenue, originalTotalCost, originalTotalProfit,
      organicTotalRevenue, organicTotalCost, organicTotalProfit,
      revenueGrowthRate, costGrowthRate, profitGrowthRate
    ], (err) => {
      if (err) {
        console.error('保存分析结果失败:', err);
      }
      
      res.json(analysisResult);
    });
  });
};

// 获取分析结果
app.get('/api/analysis', (req, res) => {
  db.all('SELECT * FROM monthly_data ORDER BY month', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: '数据查询失败' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ error: '暂无数据' });
    }

    calculateAnalysisResults(res);
  });
});

// AI分析建议
app.post('/api/ai-advice', async (req, res) => {
  try {
    const { summary } = req.body;
    
    if (!summary) {
      return res.status(400).json({ error: '缺少分析数据' });
    }

    // 这里应该调用OpenAI API，但为了演示，我们返回模拟的AI建议
    const aiAdvice = generateMockAIAdvice(summary);
    
    res.json({ advice: aiAdvice });
  } catch (error) {
    console.error('AI分析失败:', error);
    res.status(500).json({ error: 'AI分析服务暂时不可用' });
  }
});

// 生成模拟AI建议（实际项目中应调用OpenAI API）
const generateMockAIAdvice = (summary) => {
  const { original, organic, comparison } = summary;
  
  let advice = `基于您的餐饮经营数据分析，我为您提供以下战略建议：\n\n`;
  
  // 营业额分析
  if (comparison.revenueGrowthRate > 0) {
    advice += `营业额从 ${original.totalRevenue.toFixed(1)} 万元增长到 ${organic.totalRevenue.toFixed(1)} 万元，涨幅 ${comparison.revenueGrowthRate.toFixed(2)}%。`;
  } else {
    advice += `营业额从 ${original.totalRevenue.toFixed(1)} 万元下降到 ${organic.totalRevenue.toFixed(1)} 万元，降幅 ${Math.abs(comparison.revenueGrowthRate).toFixed(2)}%。`;
  }
  
  // 成本分析
  if (comparison.costGrowthRate > 0) {
    advice += `\n原材料成本从 ${original.totalCost.toFixed(1)} 万元增长到 ${organic.totalCost.toFixed(1)} 万元，增幅 ${comparison.costGrowthRate.toFixed(2)}%。`;
  } else {
    advice += `\n原材料成本从 ${original.totalCost.toFixed(1)} 万元下降到 ${organic.totalCost.toFixed(1)} 万元，降幅 ${Math.abs(comparison.costGrowthRate).toFixed(2)}%。`;
  }
  
  // 成本占比分析
  if (organic.costRatio < original.costRatio) {
    advice += `\n成本占比从 ${original.costRatio.toFixed(2)}% 下降至 ${organic.costRatio.toFixed(2)}%，说明单价提升并未导致成本比例恶化。`;
  } else {
    advice += `\n成本占比从 ${original.costRatio.toFixed(2)}% 上升至 ${organic.costRatio.toFixed(2)}%，需要关注成本控制。`;
  }
  
  // 利润分析
  if (comparison.profitIncrease > 0) {
    advice += `\n利润增加 ${comparison.profitIncrease.toFixed(1)} 万元，利润率提升 ${(organic.profitRatio - original.profitRatio).toFixed(2)} 个百分点。`;
  } else {
    advice += `\n利润减少 ${Math.abs(comparison.profitIncrease).toFixed(1)} 万元，利润率下降 ${Math.abs(organic.profitRatio - original.profitRatio).toFixed(2)} 个百分点。`;
  }
  
  // 战略建议
  advice += `\n\n【战略建议】\n`;
  
  if (comparison.profitIncrease > 0 && organic.profitRatio > original.profitRatio) {
    advice += `1. 继续推进有机食品策略，市场接受度良好；\n`;
    advice += `2. 优化供应链管理，进一步控制有机食品采购成本；\n`;
    advice += `3. 加强品牌营销，突出有机食品的健康价值；\n`;
    advice += `4. 考虑扩大有机食品品类，满足不同客户需求。`;
  } else {
    advice += `1. 重新评估有机食品定价策略，平衡成本与利润；\n`;
    advice += `2. 寻找更优质的有机食品供应商，降低采购成本；\n`;
    advice += `3. 加强客户教育，提高有机食品的附加值认知；\n`;
    advice += `4. 考虑混合经营模式，平衡传统与有机食品比例。`;
  }
  
  return advice;
};

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在端口 ${PORT}`);
  console.log(`📊 餐饮分析平台后端服务已启动`);
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n🛑 正在关闭服务器...');
  db.close((err) => {
    if (err) {
      console.error('数据库关闭失败:', err);
    } else {
      console.log('✅ 数据库连接已关闭');
    }
    process.exit(0);
  });
});
