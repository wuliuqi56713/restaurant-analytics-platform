// 国际化配置
export const translations = {
  zh: {
    // 通用
    loading: '加载中...',
    submit: '提交',
    cancel: '取消',
    confirm: '确认',
    back: '返回',
    refresh: '刷新',
    download: '下载',
    upload: '上传',
    success: '成功',
    error: '错误',
    warning: '警告',
    
    // 导航
    dataInput: '数据输入',
    analysisResults: '分析结果',
    platformTitle: '🍽️ 餐饮分析平台',
    
    // 数据输入页面
    monthlyDataInput: '月度数据输入',
    inputDescription: '请输入12个月的经营数据（单位：万元）',
    originalFood: '原始食品',
    organicFood: '有机食品',
    revenue: '营业额',
    cost: '成本',
    profit: '利润',
    month: '月',
    submitDataAndAnalyze: '提交数据并分析',
    dataValidationPassed: '数据验证通过',
    dataValidationFailed: '数据验证失败',
    dataSubmittedSuccessfully: '数据提交成功！正在跳转到分析页面...',
    dataSubmissionFailed: '数据提交失败',
    pleaseEnterValidNumber: '请输入有效的正数',
    pleaseEnterValue: '请输入数值',
    monthLabel: '月',
    
    // Excel功能
    importExcel: '导入Excel',
    exportExcel: '导出Excel',
    downloadTemplate: '下载空白模板',
    downloadTemplateTooltip: '下载Excel导入模板（空白模板）',
    excelFormatDescription: '📋 Excel格式说明：',
    excelFormatRules: [
      '第一行为标题行（月份、原始食品营业额、原始食品成本等）',
      '第2-13行为1-12月的数据（空白模板已预置月份）',
      '所有数值必须为非负数',
      '支持.xlsx和.xls格式',
      '下载的模板为空白模板，不包含示例数据'
    ],
    templateGeneratedSuccessfully: 'Excel模板文件生成成功！',
    dataImportedSuccessfully: '数据导入成功！',
    dataImportFailed: '数据导入失败',
    
    // 分析页面
    restaurantAnnualAnalysis: '餐饮年度数据分析',
    comprehensiveBusinessAnalysis: '综合商业分析报告',
    annualSummary: '年度汇总',
    comparisonAnalysis: '对比分析',
    originalFoodTotal: '原始食品总计',
    organicFoodTotal: '有机食品总计',
    totalRevenue: '总营业额',
    totalCost: '总成本',
    totalProfit: '总利润',
    growthRate: '增长率',
    costRatio: '成本率',
    profitMargin: '利润率',
    absoluteDifference: '绝对差值',
    percentage: '百分比',
    millionYuan: '万元',
    vsLastYear: '同比',
    
    // 图表标题
    monthlyRevenueComparison: '月度收入对比',
    annualDataComparison: '年度数据对比',
    profitTrendAnalysis: '利润趋势分析',
    profitAnalysis: '利润分析',
    costStructureAnalysis: '成本结构分析',
    seasonalPatternAnalysis: '季节性模式分析',
    profitMarginTrendAnalysis: '盈利能力核心指标',
    costStructureChange: '运营效率分析',
    cashFlowAnalysis: '财务健康状况',
    seasonalAnalysisChart: '季节性分析与趋势预测',
    revenueTrendAnalysis: '收入趋势分析',
    revenueTrendAndSeasonality: '收入趋势与季节性',
    seasonalIndex: '季节性指数',
    trendLine: '趋势线',

    // 季节性分析
    peakSeason: '旺季',
    offSeason: '淡季',
    seasonalStrength: '季节性强度',
    seasonalPattern: '季节性模式',
    seasonalAnalysisResults: '季节性分析结果',
    
    // 统计信息
    average: '平均值',
    maximum: '最大值',
    minimum: '最小值',
    revenueStatistics: '收入统计',
    profitStatistics: '利润统计',
    costStatistics: '成本统计',
    
    // AI建议
    aiAdvice: 'AI智能建议',
    getAiAdvice: '获取AI建议',
    regenerateAdvice: '重新生成建议',
    aiAnalysisCompleted: 'AI分析完成！',
    aiAnalysisFailed: 'AI分析失败',
    aiAdviceGenerated: 'AI建议生成成功',
    aiAdviceFailed: 'AI建议生成失败',
    noDataForAI: '没有数据可供AI分析',
    mockAdvice: '基于您的数据分析，我们提供以下建议：',
    
    // 保护页面
    noAnalysisData: '还没有分析数据，请先输入您的经营数据',
    pleaseInputDataFirst: '请先输入数据',
    goToDataInput: '前往数据输入',
    loadDataFailed: '数据加载失败',
    usageSteps: '🎯 使用步骤',
    usageStepsList: [
      '点击下方按钮进入数据输入页面',
      '输入12个月的经营数据（营业额、成本、利润）',
      '支持原始食品和有机食品两种类型',
      '可以手动输入或导入Excel文件',
      '提交数据后查看分析结果'
    ],
    startInputData: '开始输入数据',
    refreshPage: '刷新页面',
    
    // 错误消息
    dataLoadingFailed: '数据加载失败，请重新提交数据',
    
    // 月份名称
    months: [
      '1月', '2月', '3月', '4月', '5月', '6月',
      '7月', '8月', '9月', '10月', '11月', '12月'
    ],
    
    // 数字格式化
    formatNumber: (num) => {
      const number = parseFloat(num);
      if (isNaN(number)) {
        return '0.0';
      }
      if (number >= 10000) {
        return (number / 10000).toFixed(1) + '万';
      }
      return number.toFixed(1);
    },
    
    // 数字格式化（返回数字，用于图表）
    formatNumberForChart: (num) => {
      const number = parseFloat(num);
      if (isNaN(number)) {
        return 0;
      }
      return number;
    }
  },
  
  en: {
    // Common
    loading: 'Loading...',
    submit: 'Submit',
    cancel: 'Cancel',
    confirm: 'Confirm',
    back: 'Back',
    refresh: 'Refresh',
    download: 'Download',
    upload: 'Upload',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    
    // Navigation
    dataInput: 'Data Input',
    analysisResults: 'Analysis Results',
    platformTitle: '🍽️ Restaurant Analytics Platform',
    
    // Data Input Page
    monthlyDataInput: 'Monthly Data Input',
    inputDescription: 'Please enter 12 months of business data (unit: 10K CNY)',
    originalFood: 'Original Food',
    organicFood: 'Organic Food',
    revenue: 'Revenue',
    cost: 'Cost',
    profit: 'Profit',
    month: 'Month',
    submitDataAndAnalyze: 'Submit Data & Analyze',
    dataValidationPassed: 'Data validation passed',
    dataValidationFailed: 'Data validation failed',
    dataSubmittedSuccessfully: 'Data submitted successfully! Redirecting to analysis page...',
    dataSubmissionFailed: 'Data submission failed',
    pleaseEnterValidNumber: 'Please enter a valid positive number',
    pleaseEnterValue: 'Please enter a value',
    monthLabel: 'Month',
    
    // Excel Features
    importExcel: 'Import Excel',
    exportExcel: 'Export Excel',
    downloadTemplate: 'Download Template',
    downloadTemplateTooltip: 'Download Excel import template (blank template)',
    excelFormatDescription: '📋 Excel Format Instructions:',
    excelFormatRules: [
      'First row contains headers (Month, Original Food Revenue, Original Food Cost, etc.)',
      'Rows 2-13 contain data for months 1-12 (blank template has pre-filled months)',
      'All values must be non-negative numbers',
      'Supports .xlsx and .xls formats',
      'Downloaded template is blank, no sample data included'
    ],
    templateGeneratedSuccessfully: 'Excel template generated successfully!',
    dataImportedSuccessfully: 'Data imported successfully!',
    dataImportFailed: 'Data import failed',
    
    // Analysis Page
    restaurantAnnualAnalysis: 'Restaurant Annual Data Analysis',
    comprehensiveBusinessAnalysis: 'Comprehensive Business Analysis Report',
    annualSummary: 'Annual Summary',
    comparisonAnalysis: 'Comparison Analysis',
    originalFoodTotal: 'Original Food Total',
    organicFoodTotal: 'Organic Food Total',
    totalRevenue: 'Total Revenue',
    totalCost: 'Total Cost',
    totalProfit: 'Total Profit',
    growthRate: 'Growth Rate',
    costRatio: 'Cost Ratio',
    profitMargin: 'Profit Margin',
    absoluteDifference: 'Absolute Difference',
    percentage: 'Percentage',
    millionYuan: '10K CNY',
    vsLastYear: 'vs Last Year',
    
    // Chart Titles
    monthlyRevenueComparison: 'Monthly Revenue Comparison',
    annualDataComparison: 'Annual Data Comparison',
    profitTrendAnalysis: 'Profit Trend Analysis',
    profitAnalysis: 'Profit Analysis',
    costStructureAnalysis: 'Cost Structure Analysis',
    seasonalPatternAnalysis: 'Seasonal Pattern Analysis',
    profitMarginTrendAnalysis: 'Profitability Core Indicators',
    costStructureChange: 'Operational Efficiency Analysis',
    cashFlowAnalysis: 'Financial Health Status',
    seasonalAnalysisChart: 'Seasonal Analysis & Trend Prediction',
    revenueTrendAnalysis: 'Revenue Trend Analysis',
    revenueTrendAndSeasonality: 'Revenue Trend & Seasonality',
    seasonalIndex: 'Seasonal Index',
    trendLine: 'Trend Line',

    // Seasonal Analysis
    peakSeason: 'Peak Season',
    offSeason: 'Off Season',
    seasonalStrength: 'Seasonal Strength',
    seasonalPattern: 'Seasonal Pattern',
    seasonalAnalysisResults: 'Seasonal Analysis Results',
    
    // Statistics
    average: 'Average',
    maximum: 'Maximum',
    minimum: 'Minimum',
    revenueStatistics: 'Revenue Statistics',
    profitStatistics: 'Profit Statistics',
    costStatistics: 'Cost Statistics',
    
    // AI Advice
    aiAdvice: 'AI Intelligent Advice',
    getAiAdvice: 'Get AI Advice',
    regenerateAdvice: 'Regenerate Advice',
    aiAnalysisCompleted: 'AI analysis completed!',
    aiAnalysisFailed: 'AI analysis failed',
    aiAdviceGenerated: 'AI advice generated successfully',
    aiAdviceFailed: 'AI advice generation failed',
    noDataForAI: 'No data available for AI analysis',
    mockAdvice: 'Based on your data analysis, we provide the following recommendations:',
    
    // Protection Page
    noAnalysisData: 'No analysis data available. Please input your business data first.',
    pleaseInputDataFirst: 'Please input data first',
    goToDataInput: 'Go to Data Input',
    loadDataFailed: 'Data loading failed',
    usageSteps: '🎯 Usage Steps',
    usageStepsList: [
      'Click the button below to enter the data input page',
      'Enter 12 months of business data (revenue, cost, profit)',
      'Supports both original food and organic food types',
      'You can input manually or import Excel files',
      'Submit data to view analysis results'
    ],
    startInputData: 'Start Input Data',
    refreshPage: 'Refresh Page',
    
    // Error Messages
    dataLoadingFailed: 'Data loading failed, please resubmit data',
    
    // Month Names
    months: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    
    // Number formatting
    formatNumber: (num) => {
      const number = parseFloat(num);
      if (isNaN(number)) {
        return '0.0';
      }
      if (number >= 10000) {
        return (number / 10000).toFixed(1) + 'K';
      }
      return number.toFixed(1);
    },

    // Number formatting for charts (returns number)
    formatNumberForChart: (num) => {
      const number = parseFloat(num);
      if (isNaN(number)) {
        return 0;
      }
      return number;
    }
  }
};

// 设置语言
export const setLanguage = (language) => {
  localStorage.setItem('language', language);
  window.location.reload(); // 重新加载页面以应用新语言
};

// 获取当前语言
export const getCurrentLanguage = () => {
  return localStorage.getItem('language') || 'en';
};

// 翻译函数
export const t = (key, params = {}) => {
  const currentLang = getCurrentLanguage();
  const langData = translations[currentLang];
  
  // 支持嵌套键，如 'comparison.revenueGrowthRate'
  const keys = key.split('.');
  let value = langData;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`Translation key not found: ${key} in ${currentLang}`);
      return key; // 返回键名作为后备
    }
  }
  
  // 如果值是函数，调用它并传递参数
  if (typeof value === 'function') {
    return value(params);
  }
  
  return value;
};
