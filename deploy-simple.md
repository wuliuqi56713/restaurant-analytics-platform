# 🚀 超简单部署方案

## 方案A：Netlify Drop（最简单，无需GitHub）

### 步骤1：构建前端
```bash
cd client
npm run build
```

### 步骤2：部署到Netlify
1. 访问 [netlify.com](https://netlify.com)
2. 点击 "Deploy manually"
3. 将 `client/build` 文件夹拖拽到页面中
4. 等待部署完成，获得URL

### 步骤3：部署后端到Render
1. 访问 [render.com](https://render.com)
2. 注册账号
3. 点击 "New +" → "Web Service"
4. 连接GitHub仓库（如果已创建）
5. 设置：
   - Name: `restaurant-analytics-backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: `Node`

## 方案B：Vercel + Render（推荐）

### 步骤1：创建GitHub仓库
1. 访问 [github.com](https://github.com)
2. 创建新仓库：`restaurant-analytics-platform`
3. 推送代码到GitHub

### 步骤2：部署前端到Vercel
1. 访问 [vercel.com](https://vercel.com)
2. 导入GitHub仓库
3. 设置环境变量：
   ```
   REACT_APP_API_URL=https://your-backend-app.onrender.com
   ```

### 步骤3：部署后端到Render
1. 访问 [render.com](https://render.com)
2. 创建Web Service
3. 连接GitHub仓库
4. 自动部署

## 方案C：本地服务器（临时方案）

### 使用ngrok暴露本地服务
```bash
# 安装ngrok
npm install -g ngrok

# 启动后端
cd server && npm start

# 新开终端，暴露后端
ngrok http 5001

# 启动前端
cd client && npm start

# 新开终端，暴露前端
ngrok http 3000
```

## 🎯 推荐方案

**最简单：Netlify Drop + Render**
- 无需GitHub
- 5分钟完成
- 完全免费

**最稳定：Vercel + Render**
- 自动部署
- 代码版本控制
- 免费额度充足
