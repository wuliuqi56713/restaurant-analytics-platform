# 餐饮经营年度数据分析与AI战略建议平台

## 项目简介

这是一个专业的餐饮业务分析平台，提供年度数据分析、可视化图表展示和AI战略建议功能。

## 功能特性

- 📊 **数据输入**：支持手动输入和Excel导入
- 📈 **可视化分析**：收入趋势、利润分析、成本结构分析
- 🤖 **AI建议**：基于数据的智能战略建议
- 🌐 **多语言支持**：中英文切换
- 📱 **响应式设计**：适配各种设备

## 技术栈

- **前端**：React + Ant Design + Chart.js
- **后端**：Node.js + Express
- **数据库**：SQLite
- **AI服务**：豆包API

## 部署方案

### 方案1：Vercel + Render（推荐，免费）

#### 前端部署到Vercel

1. **准备代码**
   ```bash
   # 确保在项目根目录
   cd client
   npm run build
   ```

2. **部署到Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用GitHub账号登录
   - 导入项目仓库
   - 设置环境变量：
     ```
     REACT_APP_API_URL=https://your-backend-app.onrender.com
     ```

#### 后端部署到Render

1. **准备代码**
   ```bash
   # 确保server目录有package.json
   cd server
   npm install
   ```

2. **部署到Render**
   - 访问 [render.com](https://render.com)
   - 创建新Web Service
   - 连接GitHub仓库
   - 设置：
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Environment: Node

### 方案2：Netlify + Railway

#### 前端部署到Netlify
- 类似Vercel流程
- 设置环境变量指向Railway后端

#### 后端部署到Railway
- 连接GitHub仓库
- 自动部署

### 方案3：阿里云/腾讯云（付费）

#### 服务器配置
- 轻量应用服务器（2核4G）
- 域名解析
- SSL证书

#### 部署步骤
1. 购买服务器和域名
2. 配置Nginx反向代理
3. 使用PM2管理Node.js进程
4. 配置SSL证书

## 本地开发

### 环境要求
- Node.js >= 16
- npm >= 8

### 安装依赖
```bash
# 安装前端依赖
cd client
npm install

# 安装后端依赖
cd ../server
npm install
```

### 启动服务
```bash
# 启动后端（端口5001）
cd server
npm start

# 启动前端（端口3000）
cd client
npm start
```

### 环境变量配置
创建 `.env` 文件：
```
# 后端环境变量
PORT=5001
DOUBAO_API_KEY=your_doubao_api_key

# 前端环境变量
REACT_APP_API_URL=http://localhost:5001
```

## 使用说明

1. **数据输入**：在第一页输入12个月的营收数据
2. **数据分析**：查看自动生成的图表和分析结果
3. **AI建议**：获取基于数据的战略建议
4. **数据导出**：支持Excel格式导出

## 注意事项

- 确保后端API地址配置正确
- 生产环境建议配置豆包API密钥
- 定期备份数据库数据

## 技术支持

如有问题，请检查：
1. 网络连接
2. API服务状态
3. 环境变量配置
4. 浏览器控制台错误信息
