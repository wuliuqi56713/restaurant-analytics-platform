#!/bin/bash

echo "🚀 开始部署后端到 Render..."
echo "=========================="

echo "📋 检查环境..."
if ! command -v curl &> /dev/null; then
    echo "❌ curl 未安装"
    exit 1
fi

echo "✅ 环境检查通过"

echo ""
echo "🔗 请按照以下步骤部署后端："
echo ""
echo "1️⃣ 打开浏览器访问: https://render.com"
echo ""
echo "2️⃣ 使用 GitHub 账号登录"
echo ""
echo "3️⃣ 点击 'New +' → 'Web Service'"
echo ""
echo "4️⃣ 连接 GitHub 仓库"
echo "   - 选择: wuliuqi56713/restaurant-analytics-platform"
echo ""
echo "5️⃣ 配置服务设置："
echo "   - Name: restaurant-analytics-backend"
echo "   - Root Directory: server"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo "   - Plan: Free"
echo ""
echo "6️⃣ 点击 'Create Web Service'"
echo ""
echo "⏳ 等待部署完成（约3-5分钟）"
echo ""
echo "✅ 部署完成后，你会得到后端URL"
echo "   例如: https://restaurant-analytics-backend.onrender.com"
echo ""
echo "�� 请记住这个URL，下一步会用到！"
