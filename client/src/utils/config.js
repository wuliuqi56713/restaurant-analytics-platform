// 环境配置
const config = {
  // 开发环境
  development: {
    apiBaseUrl: 'http://localhost:5001'
  },
  // 生产环境
  production: {
    apiBaseUrl: process.env.REACT_APP_API_URL || 'https://your-backend-app.onrender.com'
  }
};

// 根据当前环境返回配置
const env = process.env.NODE_ENV || 'development';
export const apiBaseUrl = config[env].apiBaseUrl;

export default config[env];
