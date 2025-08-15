// API配置文件
const API_CONFIG = {
  // 开发环境
  development: 'http://localhost:5001',
  // 生产环境
  production: process.env.REACT_APP_API_URL || 'https://your-backend-url.onrender.com'
};

// 根据当前环境选择API地址
const API_BASE_URL = API_CONFIG[process.env.NODE_ENV] || API_CONFIG.development;

export default API_BASE_URL;
