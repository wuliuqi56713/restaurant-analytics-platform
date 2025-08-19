-- 餐饮分析平台数据库初始化脚本
-- 作者: Vincentxjm

-- 创建月度数据表
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
);

-- 创建分析结果表
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
);

-- 数据库初始化时不插入示例数据
-- 用户需要先输入数据才能进行分析

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_monthly_data_month ON monthly_data(month);
CREATE INDEX IF NOT EXISTS idx_analysis_results_created_at ON analysis_results(created_at);

-- 显示表结构
.schema monthly_data
.schema analysis_results

-- 显示示例数据
SELECT * FROM monthly_data ORDER BY month;
