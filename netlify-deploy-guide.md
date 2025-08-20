# Netlify 部署详细指南

## 方法一：通过"Add new site"按钮

1. **访问**: https://netlify.com
2. **用GitHub账号登录**
3. **在Netlify控制台找到以下任一按钮**：
   - "Add new site"
   - "New site from Git"
   - "Import an existing project"
   - "Deploy manually"
   - 或者点击右上角的 "+" 号

## 方法二：如果找不到上述按钮

1. **访问**: https://app.netlify.com
2. **点击**: "Sites" 标签
3. **点击**: "Add new site" 或 "Import an existing project"

## 方法三：直接访问部署页面

1. **直接访问**: https://app.netlify.com/start
2. **选择**: "GitHub"
3. **授权**: 允许Netlify访问你的GitHub

## 具体配置步骤

无论使用哪种方法，配置都是一样的：

1. **选择Git提供商**: 点击 "GitHub"
2. **选择仓库**: 找到并点击 `wuliuqi56713/restaurant-analytics-platform`
3. **配置构建设置**:
   - **Base directory**: 留空
   - **Build command**: `cd client && npm install && npm run build`
   - **Publish directory**: `client/build`
4. **点击**: "Deploy site"

## 如果还是找不到

可以尝试：
1. 刷新页面
2. 重新登录
3. 或者告诉我你看到的界面，我可以给你更具体的指导

## 部署完成后

你会得到一个类似这样的URL：
`https://random-name-123456.netlify.app`

任何人都可以通过这个链接访问你的网站！
