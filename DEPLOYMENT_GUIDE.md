# 🚀 餐饮分析平台部署指南

## 项目信息
- **GitHub仓库**: https://github.com/wuliuqi56713/restaurant-analytics-platform.git
- **前端**: React + Ant Design + Chart.js
- **后端**: Node.js + Express + SQLite
- **部署方案**: Vercel (前端) + Render (后端)

## 📋 部署步骤

### 第一步：部署前端到Vercel

1. **访问 [vercel.com](https://vercel.com)**
2. **使用GitHub账号登录**
3. **点击 "New Project"**
4. **导入GitHub仓库：`wuliuqi56713/restaurant-analytics-platform`**
5. **配置项目设置：**
   ```
   Framework Preset: Create React App
   Root Directory: ./
   Build Command: cd client && npm run build
   Output Directory: client/build
   Install Command: cd client && npm install
   ```
6. **点击 "Deploy"**
7. **等待部署完成，获得前端URL**

### 第二步：部署后端到Render

1. **访问 [render.com](https://render.com)**
2. **使用GitHub账号登录**
3. **点击 "New +" → "Web Service"**
4. **连接GitHub仓库：`wuliuqi56713/restaurant-analytics-platform`**
5. **配置设置：**
   ```
   Name: restaurant-analytics-backend
   Root Directory: server
   Build Command: npm install
   Start Command: npm start
   Environment: Node
   ```
6. **点击 "Create Web Service"**
7. **等待部署完成，获得后端URL**

### 第三步：配置环境变量

#### 在Vercel中设置环境变量：
1. **进入Vercel项目设置**
2. **点击 "Environment Variables"**
3. **添加变量：**
   ```
   Name: REACT_APP_API_URL
   Value: https://your-backend-app.onrender.com
   Environment: Production
   ```

#### 在Render中设置环境变量（可选）：
1. **进入Render项目设置**
2. **点击 "Environment"**
3. **添加变量：**
   ```
   DOUBAO_API_KEY: your_doubao_api_key (可选)
   ```

## 🔗 部署完成后

### 前端URL格式：
```
https://restaurant-analytics-platform.vercel.app
```

### 后端URL格式：
```
https://restaurant-analytics-backend.onrender.com
```

## ✅ 验证部署

1. **访问前端URL**
2. **输入测试数据**
3. **检查图表显示**
4. **测试AI建议功能**

## 🛠️ 故障排除

### 常见问题：
1. **前端无法连接后端**
   - 检查环境变量 `REACT_APP_API_URL` 是否正确
   - 确认后端URL可以访问

2. **后端部署失败**
   - 检查 `server/package.json` 是否存在
   - 确认 `npm start` 命令正确

3. **图表不显示数据**
   - 检查浏览器控制台错误
   - 确认API调用成功

## 📞 技术支持

如有问题，请检查：
1. GitHub仓库代码是否正确
2. 环境变量配置
3. 网络连接
4. 浏览器控制台错误信息

## 🎉 部署成功标志

- ✅ 前端页面正常加载
- ✅ 数据输入功能正常
- ✅ 图表正确显示
- ✅ AI建议功能正常
- ✅ 多语言切换正常
