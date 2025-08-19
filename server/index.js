const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

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
      console.log('Processing month:', month, 'data:', data); // 添加调试日志
      stmt.run([
        month,
        parseFloat(data.originalRevenue) || 0,
        parseFloat(data.originalCost) || 0,
        parseFloat(data.originalProfit) || 0,
        parseFloat(data.organicRevenue) || 0,
        parseFloat(data.organicCost) || 0,
        parseFloat(data.organicProfit) || 0
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
      monthlyData: rows.map(row => ({
        originalRevenue: row.original_revenue,
        originalCost: row.original_cost,
        originalProfit: row.original_profit,
        organicRevenue: row.organic_revenue,
        organicCost: row.organic_cost,
        organicProfit: row.organic_profit
      })),
      summary: {
        totalRevenue: originalTotalRevenue + organicTotalRevenue,
        totalCost: originalTotalCost + organicTotalCost,
        totalProfit: originalTotalProfit + organicTotalProfit,
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
          marginChange: organicProfitRatio - originalProfitRatio,
          costRatioChange: organicCostRatio - originalCostRatio,
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
    const { summary, language = 'zh' } = req.body;
    
    if (!summary) {
      return res.status(400).json({ error: '缺少分析数据' });
    }

    // 调用真正的OpenAI API进行AI分析
          const aiAdvice = await generateRealAIAdvice(summary, language);
    
    res.json({ advice: aiAdvice });
  } catch (error) {
    console.error('AI分析失败:', error);
    // 如果OpenAI API失败，回退到模拟建议
    try {
      const fallbackAdvice = generateMockAIAdvice(summary, language);
      res.json({ advice: fallbackAdvice, note: 'AI服务暂时不可用，使用备用分析' });
    } catch (fallbackError) {
      res.status(500).json({ error: 'AI分析服务暂时不可用' });
    }
  }
});

// 生成真正的AI建议（使用豆包API）
const generateRealAIAdvice = async (summary, language = 'zh') => {
  try {
    // 检查豆包API密钥
    if (!process.env.DOUBAO_API_KEY || process.env.DOUBAO_API_KEY === 'your_doubao_api_key_here') {
      console.log('⚠️ 豆包API密钥未配置，使用模拟建议');
      return generateMockAIAdvice(summary, language);
    }

    // 构建分析数据
    const analysisData = buildAnalysisDataForAI(summary);
    
    // 构建AI提示词
    const prompt = buildAIPrompt(analysisData, language);
    
    // 调用豆包API
    const axios = require('axios');
    
    const response = await axios.post('https://api.doubao.com/v1/chat/completions', {
      model: "doubao-pro",
      messages: [
        {
          role: "system",
          content: language === 'zh' 
            ? "你是一位资深的餐饮行业分析师和商业顾问，专门为餐饮企业提供数据驱动的战略建议。请基于提供的财务数据，提供专业、具体、可操作的商业建议。"
            : "You are a senior restaurant industry analyst and business consultant, specializing in providing data-driven strategic advice for restaurant businesses. Please provide professional, specific, and actionable business recommendations based on the provided financial data."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.DOUBAO_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30秒超时
    });

    const aiAdvice = response.data.choices[0].message.content;
    console.log('🤖 豆包AI分析完成');
    return aiAdvice;
    
  } catch (error) {
    console.error('豆包API调用失败:', error.message);
    console.log('🔄 回退到模拟建议');
    return generateMockAIAdvice(summary, language);
  }
};

// 构建AI分析数据
const buildAnalysisDataForAI = (summary) => {
  try {
    if (!summary || typeof summary !== 'object') {
      return { error: '数据格式错误' };
    }
    
    const { original, organic, comparison } = summary;
    
    if (!original || !organic || !comparison) {
      return { error: '缺少必要的分析数据' };
    }
    
    return {
      original: {
        totalRevenue: original.totalRevenue || 0,
        totalCost: original.totalCost || 0,
        totalProfit: original.totalProfit || 0,
        profitRatio: original.profitRatio || 0,
        costRatio: original.costRatio || 0
      },
      organic: {
        totalRevenue: organic.totalRevenue || 0,
        totalCost: organic.totalCost || 0,
        totalProfit: organic.totalProfit || 0,
        profitRatio: organic.profitRatio || 0,
        costRatio: organic.costRatio || 0
      },
      comparison: {
        revenueGrowthRate: comparison.revenueGrowthRate || 0,
        costGrowthRate: comparison.costGrowthRate || 0,
        profitIncrease: comparison.profitIncrease || 0,
        profitRatioChange: comparison.profitRatioChange || 0
      }
    };
  } catch (error) {
    console.error('构建AI数据失败:', error);
    return { error: '数据处理错误' };
  }
};

// 构建AI提示词
const buildAIPrompt = (data, language = 'zh') => {
  if (data.error) {
    return language === 'zh' 
      ? `请基于餐饮经营数据分析，提供专业的战略建议。数据可能不完整，请基于可用信息进行分析。`
      : `Please provide professional strategic recommendations based on restaurant business data analysis. Data may be incomplete, please analyze based on available information.`;
  }
  
  const { original, organic, comparison } = data;
  
  if (language === 'zh') {
    return `请基于以下餐饮经营数据，提供专业的商业分析和战略建议：

【原始食品数据】
- 年度总收入：${safeToFixed(original.totalRevenue, 1)}万元
- 年度总成本：${safeToFixed(original.totalCost, 1)}万元
- 年度总利润：${safeToFixed(original.totalProfit, 1)}万元
- 利润率：${safeToFixed(original.profitRatio, 2)}%
- 成本占比：${safeToFixed(original.costRatio, 2)}%

【有机食品数据】
- 年度总收入：${safeToFixed(organic.totalRevenue, 1)}万元
- 年度总成本：${safeToFixed(organic.totalCost, 1)}万元
- 年度总利润：${safeToFixed(organic.totalProfit, 1)}万元
- 利润率：${safeToFixed(organic.profitRatio, 2)}%
- 成本占比：${safeToFixed(organic.costRatio, 2)}%

【对比分析】
- 收入增长率：${safeToFixed(comparison.revenueGrowthRate, 2)}%
- 成本增长率：${safeToFixed(comparison.costGrowthRate, 2)}%
- 利润增长：${safeToFixed(comparison.profitIncrease, 1)}万元
- 利润率变化：${safeToFixed(comparison.profitRatioChange, 2)}个百分点

请提供：
1. 数据解读和关键发现
2. 业务表现评估
3. 具体的战略建议（包括定价、成本控制、市场策略等）
4. 风险提示和机会分析
5. 可执行的行动计划

请用中文回答，保持专业性和可操作性，字数控制在300-500字。`;
  } else {
    return `Please provide professional business analysis and strategic recommendations based on the following restaurant business data:

【Original Food Data】
- Annual Total Revenue: ${safeToFixed(original.totalRevenue, 1)} 10K CNY
- Annual Total Cost: ${safeToFixed(original.totalCost, 1)} 10K CNY
- Annual Total Profit: ${safeToFixed(original.totalProfit, 1)} 10K CNY
- Profit Margin: ${safeToFixed(original.profitRatio, 2)}%
- Cost Ratio: ${safeToFixed(original.costRatio, 2)}%

【Organic Food Data】
- Annual Total Revenue: ${safeToFixed(organic.totalRevenue, 1)} 10K CNY
- Annual Total Cost: ${safeToFixed(organic.totalCost, 1)} 10K CNY
- Annual Total Profit: ${safeToFixed(organic.totalProfit, 1)} 10K CNY
- Profit Margin: ${safeToFixed(organic.profitRatio, 2)}%
- Cost Ratio: ${safeToFixed(organic.costRatio, 2)}%

【Comparison Analysis】
- Revenue Growth Rate: ${safeToFixed(comparison.revenueGrowthRate, 2)}%
- Cost Growth Rate: ${safeToFixed(comparison.costGrowthRate, 2)}%
- Profit Increase: ${safeToFixed(comparison.profitIncrease, 1)} 10K CNY
- Profit Margin Change: ${safeToFixed(comparison.profitRatioChange, 2)} percentage points

Please provide:
1. Data interpretation and key findings
2. Business performance evaluation
3. Specific strategic recommendations (including pricing, cost control, market strategy, etc.)
4. Risk warnings and opportunity analysis
5. Actionable implementation plans

Please answer in English, maintain professionalism and operability, and keep the word count between 300-500 words.`;
  }
};

// 安全的数字格式化函数
const safeToFixed = (num, digits = 1) => {
  const number = parseFloat(num);
  if (isNaN(number)) {
    return '0' + (digits > 0 ? '.' + '0'.repeat(digits) : '');
  }
  return number.toFixed(digits);
};

// 多语言翻译函数
const translate = (text, language) => {
  const translations = {
    zh: {
      '基于您的餐饮经营数据分析，我为您提供以下战略建议：': '基于您的餐饮经营数据分析，我为您提供以下战略建议：',
      '【数据分析】': '【数据分析】',
      '您的餐饮业务数据已成功提交并分析完成。': '您的餐饮业务数据已成功提交并分析完成。',
      '【战略建议】': '【战略建议】',
      '继续优化供应链管理，控制采购成本；': '继续优化供应链管理，控制采购成本；',
      '加强品牌营销，提升客户认知度；': '加强品牌营销，提升客户认知度；',
      '关注季节性波动，做好库存管理；': '关注季节性波动，做好库存管理；',
      '定期分析经营数据，及时调整策略。': '定期分析经营数据，及时调整策略。',
      '【发展建议】': '【发展建议】',
      '建议定期进行数据分析，持续优化经营策略，提升整体盈利能力。': '建议定期进行数据分析，持续优化经营策略，提升整体盈利能力。',
      '营业额从': '营业额从',
      '万元增长到': '万元增长到',
      '万元，涨幅': '万元，涨幅',
      '%。': '%。',
      '万元下降到': '万元下降到',
      '万元，降幅': '万元，降幅',
      '原材料成本从': '原材料成本从',
      '万元增长到': '万元增长到',
      '万元，增幅': '万元，增幅',
      '万元下降到': '万元下降到',
      '万元，降幅': '万元，降幅',
      '成本占比从': '成本占比从',
      '% 下降至': '% 下降至',
      '%，说明单价提升并未导致成本比例恶化。': '%，说明单价提升并未导致成本比例恶化。',
      '% 上升至': '% 上升至',
      '%，需要关注成本控制。': '%，需要关注成本控制。',
      '利润增加': '利润增加',
      '万元，利润率提升': '万元，利润率提升',
      '个百分点。': '个百分点。',
      '利润减少': '利润减少',
      '万元，利润率下降': '万元，利润率下降',
      '继续推进有机食品策略，市场接受度良好；': '继续推进有机食品策略，市场接受度良好；',
      '优化供应链管理，进一步控制有机食品采购成本；': '优化供应链管理，进一步控制有机食品采购成本；',
      '加强品牌营销，突出有机食品的健康价值；': '加强品牌营销，突出有机食品的健康价值；',
      '考虑扩大有机食品品类，满足不同客户需求。': '考虑扩大有机食品品类，满足不同客户需求。',
      '重新评估有机食品定价策略，平衡成本与利润；': '重新评估有机食品定价策略，平衡成本与利润；',
      '寻找更优质的有机食品供应商，降低采购成本；': '寻找更优质的有机食品供应商，降低采购成本；',
      '加强客户教育，提高有机食品的附加值认知；': '加强客户教育，提高有机食品的附加值认知；',
      '考虑混合经营模式，平衡传统与有机食品比例。': '考虑混合经营模式，平衡传统与有机食品比例。'
    },
    en: {
      '基于您的餐饮经营数据分析，我为您提供以下战略建议：': 'Based on your restaurant business data analysis, I provide the following strategic recommendations:',
      '【数据分析】': '【Data Analysis】',
      '您的餐饮业务数据已成功提交并分析完成。': 'Your restaurant business data has been successfully submitted and analyzed.',
      '【战略建议】': '【Strategic Recommendations】',
      '继续优化供应链管理，控制采购成本；': 'Continue optimizing supply chain management to control procurement costs;',
      '加强品牌营销，提升客户认知度；': 'Strengthen brand marketing to enhance customer awareness;',
      '关注季节性波动，做好库存管理；': 'Pay attention to seasonal fluctuations and manage inventory properly;',
      '定期分析经营数据，及时调整策略。': 'Regularly analyze operational data and adjust strategies promptly.',
      '【发展建议】': '【Development Recommendations】',
      '建议定期进行数据分析，持续优化经营策略，提升整体盈利能力。': 'It is recommended to conduct regular data analysis, continuously optimize business strategies, and improve overall profitability.',
      '营业额从': 'Revenue from',
      '万元增长到': '10K CNY increased to',
      '万元，涨幅': '10K CNY, growth rate',
      '%。': '%.',
      '万元下降到': '10K CNY decreased to',
      '万元，降幅': '10K CNY, decline rate',
      '原材料成本从': 'Raw material costs from',
      '万元增长到': '10K CNY increased to',
      '万元，增幅': '10K CNY, growth rate',
      '万元下降到': '10K CNY decreased to',
      '万元，降幅': '10K CNY, decline rate',
      '成本占比从': 'Cost ratio from',
      '% 下降至': '% decreased to',
      '%，说明单价提升并未导致成本比例恶化。': '%, indicating that price increases did not worsen the cost ratio.',
      '% 上升至': '% increased to',
      '%，需要关注成本控制。': '%, cost control needs attention.',
      '利润增加': 'Profit increased by',
      '万元，利润率提升': '10K CNY, profit margin increased by',
      '个百分点。': 'percentage points.',
      '利润减少': 'Profit decreased by',
      '万元，利润率下降': '10K CNY, profit margin decreased by',
      '继续推进有机食品策略，市场接受度良好；': 'Continue promoting organic food strategy with good market acceptance;',
      '优化供应链管理，进一步控制有机食品采购成本；': 'Optimize supply chain management to further control organic food procurement costs;',
      '加强品牌营销，突出有机食品的健康价值；': 'Strengthen brand marketing to highlight the health value of organic food;',
      '考虑扩大有机食品品类，满足不同客户需求。': 'Consider expanding organic food categories to meet different customer needs.',
      '重新评估有机食品定价策略，平衡成本与利润；': 'Re-evaluate organic food pricing strategy to balance costs and profits;',
      '寻找更优质的有机食品供应商，降低采购成本；': 'Find better organic food suppliers to reduce procurement costs;',
      '加强客户教育，提高有机食品的附加值认知；': 'Strengthen customer education to improve awareness of organic food value-added;',
      '考虑混合经营模式，平衡传统与有机食品比例。': 'Consider a mixed business model to balance traditional and organic food ratios.'
    }
  };
  
  return translations[language]?.[text] || text;
};

// 生成模拟AI建议（备用方案）
const generateMockAIAdvice = (summary, language = 'zh') => {
  try {
    // 如果summary是字符串，返回默认建议
    if (typeof summary === 'string') {
      return `${translate('基于您的餐饮经营数据分析，我为您提供以下战略建议：', language)}

${translate('【数据分析】', language)}
${translate('您的餐饮业务数据已成功提交并分析完成。', language)}

${translate('【战略建议】', language)}
1. ${translate('继续优化供应链管理，控制采购成本；', language)}
2. ${translate('加强品牌营销，提升客户认知度；', language)}
3. ${translate('关注季节性波动，做好库存管理；', language)}
4. ${translate('定期分析经营数据，及时调整策略。', language)}

${translate('【发展建议】', language)}
${translate('建议定期进行数据分析，持续优化经营策略，提升整体盈利能力。', language)}`;
    }
    
    // 检查summary对象的结构
    if (!summary || typeof summary !== 'object') {
      return `${translate('基于您的餐饮经营数据分析，我为您提供以下战略建议：', language)}

${translate('【数据分析】', language)}
${translate('您的餐饮业务数据已成功提交并分析完成。', language)}

${translate('【战略建议】', language)}
1. ${translate('继续优化供应链管理，控制采购成本；', language)}
2. ${translate('加强品牌营销，提升客户认知度；', language)}
3. ${translate('关注季节性波动，做好库存管理；', language)}
4. ${translate('定期分析经营数据，及时调整策略。', language)}

${translate('【发展建议】', language)}
${translate('建议定期进行数据分析，持续优化经营策略，提升整体盈利能力。', language)}`;
    }
    
    // 检查必要的字段是否存在
    if (!summary.original || !summary.organic || !summary.comparison) {
      return `${translate('基于您的餐饮经营数据分析，我为您提供以下战略建议：', language)}

${translate('【数据分析】', language)}
${translate('您的餐饮业务数据已成功提交并分析完成。', language)}

${translate('【战略建议】', language)}
1. ${translate('继续优化供应链管理，控制采购成本；', language)}
2. ${translate('加强品牌营销，提升客户认知度；', language)}
3. ${translate('关注季节性波动，做好库存管理；', language)}
4. ${translate('定期分析经营数据，及时调整策略。', language)}

${translate('【发展建议】', language)}
${translate('建议定期进行数据分析，持续优化经营策略，提升整体盈利能力。', language)}`;
    }
    
    const { original, organic, comparison } = summary;
    
    // 检查所有必要的子字段是否存在
    if (!original || !organic || !comparison) {
      return `${translate('基于您的餐饮经营数据分析，我为您提供以下战略建议：', language)}

${translate('【数据分析】', language)}
${translate('您的餐饮业务数据已成功提交并分析完成。', language)}

${translate('【战略建议】', language)}
1. ${translate('继续优化供应链管理，控制采购成本；', language)}
2. ${translate('加强品牌营销，提升客户认知度；', language)}
3. ${translate('关注季节性波动，做好库存管理；', language)}
4. ${translate('定期分析经营数据，及时调整策略。', language)}

${translate('【发展建议】', language)}
${translate('建议定期进行数据分析，持续优化经营策略，提升整体盈利能力。', language)}`;
    }
    
    // 检查具体字段是否存在
    if (!original.totalRevenue || !original.totalCost || !original.profitRatio || !original.costRatio ||
        !organic.totalRevenue || !organic.totalCost || !organic.profitRatio || !organic.costRatio ||
        !comparison.revenueGrowthRate || !comparison.costGrowthRate || !comparison.profitIncrease) {
      return `${translate('基于您的餐饮经营数据分析，我为您提供以下战略建议：', language)}

${translate('【数据分析】', language)}
${translate('您的餐饮业务数据已成功提交并分析完成。', language)}

${translate('【战略建议】', language)}
1. ${translate('继续优化供应链管理，控制采购成本；', language)}
2. ${translate('加强品牌营销，提升客户认知度；', language)}
3. ${translate('关注季节性波动，做好库存管理；', language)}
4. ${translate('定期分析经营数据，及时调整策略。', language)}

${translate('【发展建议】', language)}
${translate('建议定期进行数据分析，持续优化经营策略，提升整体盈利能力。', language)}`;
    }
  
  let advice = `${translate('基于您的餐饮经营数据分析，我为您提供以下战略建议：', language)}\n\n`;
  
  // 营业额分析
  if (comparison.revenueGrowthRate > 0) {
    advice += `${translate('营业额从', language)} ${safeToFixed(original.totalRevenue, 1)} ${translate('万元增长到', language)} ${safeToFixed(organic.totalRevenue, 1)} ${translate('万元，涨幅', language)} ${safeToFixed(comparison.revenueGrowthRate, 2)}${translate('%。', language)}`;
  } else {
    advice += `${translate('营业额从', language)} ${safeToFixed(original.totalRevenue, 1)} ${translate('万元下降到', language)} ${safeToFixed(organic.totalRevenue, 1)} ${translate('万元，降幅', language)} ${safeToFixed(Math.abs(comparison.revenueGrowthRate), 2)}${translate('%。', language)}`;
  }
  
  // 成本分析
  if (comparison.costGrowthRate > 0) {
    advice += `\n${translate('原材料成本从', language)} ${safeToFixed(original.totalCost, 1)} ${translate('万元增长到', language)} ${safeToFixed(organic.totalCost, 1)} ${translate('万元，增幅', language)} ${safeToFixed(comparison.costGrowthRate, 2)}${translate('%。', language)}`;
  } else {
    advice += `\n${translate('原材料成本从', language)} ${safeToFixed(original.totalCost, 1)} ${translate('万元下降到', language)} ${safeToFixed(organic.totalCost, 1)} ${translate('万元，降幅', language)} ${safeToFixed(Math.abs(comparison.costGrowthRate), 2)}${translate('%。', language)}`;
  }
  
  // 成本占比分析
  if (organic.costRatio < original.costRatio) {
    advice += `\n${translate('成本占比从', language)} ${safeToFixed(original.costRatio, 2)}${translate('% 下降至', language)} ${safeToFixed(organic.costRatio, 2)}${translate('%，说明单价提升并未导致成本比例恶化。', language)}`;
  } else {
    advice += `\n${translate('成本占比从', language)} ${safeToFixed(original.costRatio, 2)}${translate('% 上升至', language)} ${safeToFixed(organic.costRatio, 2)}${translate('%，需要关注成本控制。', language)}`;
  }
  
  // 利润分析
  if (comparison.profitIncrease > 0) {
    advice += `\n${translate('利润增加', language)} ${safeToFixed(comparison.profitIncrease, 1)} ${translate('万元，利润率提升', language)} ${safeToFixed(organic.profitRatio - original.profitRatio, 2)} ${translate('个百分点。', language)}`;
  } else {
    advice += `\n${translate('利润减少', language)} ${safeToFixed(Math.abs(comparison.profitIncrease), 1)} ${translate('万元，利润率下降', language)} ${safeToFixed(Math.abs(organic.profitRatio - original.profitRatio), 2)} ${translate('个百分点。', language)}`;
  }
  
  // 战略建议
  advice += `\n\n${translate('【战略建议】', language)}\n`;
  
  if (comparison.profitIncrease > 0 && organic.profitRatio > original.profitRatio) {
    advice += `1. ${translate('继续推进有机食品策略，市场接受度良好；', language)}\n`;
    advice += `2. ${translate('优化供应链管理，进一步控制有机食品采购成本；', language)}\n`;
    advice += `3. ${translate('加强品牌营销，突出有机食品的健康价值；', language)}\n`;
    advice += `4. ${translate('考虑扩大有机食品品类，满足不同客户需求。', language)}`;
  } else {
    advice += `1. ${translate('重新评估有机食品定价策略，平衡成本与利润；', language)}\n`;
    advice += `2. ${translate('寻找更优质的有机食品供应商，降低采购成本；', language)}\n`;
    advice += `3. ${translate('加强客户教育，提高有机食品的附加值认知；', language)}\n`;
    advice += `4. ${translate('考虑混合经营模式，平衡传统与有机食品比例。', language)}`;
  }
  
  return advice;
  } catch (error) {
    console.error('AI建议生成错误:', error);
    return `${translate('基于您的餐饮经营数据分析，我为您提供以下战略建议：', language)}

${translate('【数据分析】', language)}
${translate('您的餐饮业务数据已成功提交并分析完成。', language)}

${translate('【战略建议】', language)}
1. ${translate('继续优化供应链管理，控制采购成本；', language)}
2. ${translate('加强品牌营销，提升客户认知度；', language)}
3. ${translate('关注季节性波动，做好库存管理；', language)}
4. ${translate('定期分析经营数据，及时调整策略。', language)}

${translate('【发展建议】', language)}
${translate('建议定期进行数据分析，持续优化经营策略，提升整体盈利能力。', language)}`;
  }
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
