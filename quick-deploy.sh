#!/bin/bash

echo "🚀 餐饮分析平台一键部署脚本"
echo "=========================="

# 检查GitHub仓库
echo "📋 检查GitHub仓库..."
if ! git remote -v | grep -q "github.com"; then
    echo "❌ 未找到GitHub远程仓库"
    echo "请先创建GitHub仓库并推送代码"
    exit 1
fi

echo "✅ GitHub仓库检查通过"

# 构建前端
echo "📦 构建前端..."
cd client
npm run build
cd ..

echo "✅ 前端构建完成"

echo ""
echo "🌐 开始部署..."
echo ""
echo "📋 部署步骤："
echo ""
echo "1️⃣ 部署后端到 Render："
echo "   🔗 访问: https://render.com"
echo "   📝 步骤:"
echo "   - 点击 'New +' → 'Web Service'"
echo "   - 连接 GitHub 仓库"
echo "   - 选择仓库: wuliuqi56713/restaurant-analytics-platform"
echo "   - 设置:"
echo "     • Name: restaurant-analytics-backend"
echo "     • Root Directory: server"
echo "     • Build Command: npm install"
echo "     • Start Command: npm start"
echo "   - 点击 'Create Web Service'"
echo ""
echo "2️⃣ 部署前端到 Vercel："
echo "   🔗 访问: https://vercel.com"
echo "   📝 步骤:"
echo "   - 点击 'New Project'"
echo "   - 导入 GitHub 仓库"
echo "   - 选择仓库: wuliuqi56713/restaurant-analytics-platform"
echo "   - 设置:"
echo "     • Framework Preset: Create React App"
echo "     • Root Directory: client"
echo "     • Build Command: npm run build"
echo "     • Output Directory: build"
echo "   - 点击 'Deploy'"
echo ""
echo "3️⃣ 配置环境变量："
echo "   在 Vercel 项目设置中添加环境变量："
echo "   REACT_APP_API_URL=https://你的render后端地址.onrender.com"
echo ""
echo "⏳ 部署完成后，你会得到两个URL："
echo "   • 前端: https://你的项目名.vercel.app"
echo "   • 后端: https://restaurant-analytics-backend.onrender.com"
echo ""
echo "🎉 部署完成后，任何人都可以通过前端URL访问你的网站！"
echo ""
echo "📞 如果遇到问题，请检查："
echo "   - GitHub仓库是否公开"
echo "   - 环境变量是否正确设置"
echo "   - 后端服务是否正常运行"
