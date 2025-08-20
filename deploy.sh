#!/bin/bash

echo "🚀 开始部署餐饮分析平台..."

# 检查是否安装了必要的工具
if ! command -v git &> /dev/null; then
    echo "❌ Git 未安装，请先安装 Git"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ Node.js/npm 未安装，请先安装 Node.js"
    exit 1
fi

echo "✅ 环境检查通过"

# 构建前端
echo "📦 构建前端..."
cd client
npm install
npm run build
cd ..

echo "✅ 前端构建完成"

echo ""
echo "🌐 部署选项："
echo "1. Vercel + Render (推荐 - 免费)"
echo "2. Netlify + Railway"
echo "3. GitHub Pages + Heroku"
echo ""

read -p "请选择部署方式 (1-3): " choice

case $choice in
    1)
        echo "🚀 使用 Vercel + Render 部署..."
        echo ""
        echo "📋 部署步骤："
        echo "1. 将代码推送到 GitHub"
        echo "2. 在 Render.com 部署后端"
        echo "3. 在 Vercel.com 部署前端"
        echo ""
        echo "请按照以下步骤操作："
        echo ""
        echo "🔗 Render 后端部署："
        echo "1. 访问 https://render.com"
        echo "2. 连接 GitHub 仓库"
        echo "3. 创建新的 Web Service"
        echo "4. 选择你的仓库"
        echo "5. 设置："
        echo "   - Name: restaurant-analytics-backend"
        echo "   - Root Directory: server"
        echo "   - Build Command: npm install"
        echo "   - Start Command: npm start"
        echo ""
        echo "🔗 Vercel 前端部署："
        echo "1. 访问 https://vercel.com"
        echo "2. 连接 GitHub 仓库"
        echo "3. 导入项目"
        echo "4. 设置："
        echo "   - Framework Preset: Create React App"
        echo "   - Root Directory: client"
        echo "   - Build Command: npm run build"
        echo "   - Output Directory: build"
        echo ""
        ;;
    2)
        echo "🚀 使用 Netlify + Railway 部署..."
        ;;
    3)
        echo "🚀 使用 GitHub Pages + Heroku 部署..."
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo ""
echo "✅ 部署脚本完成！"
echo "📝 请按照上述步骤完成部署"
