#!/bin/bash

echo "🚀 开始部署前端到 Vercel..."
echo "=========================="

echo "📋 检查环境..."
if ! command -v curl &> /dev/null; then
    echo "❌ curl 未安装"
    exit 1
fi

echo "✅ 环境检查通过"

echo ""
echo "🔗 请按照以下步骤部署前端："
echo ""
echo "1️⃣ 打开浏览器访问: https://vercel.com"
echo ""
echo "2️⃣ 使用 GitHub 账号登录"
echo ""
echo "3️⃣ 点击 'New Project'"
echo ""
echo "4️⃣ 导入 GitHub 仓库"
echo "   - 选择: wuliuqi56713/restaurant-analytics-platform"
echo ""
echo "5️⃣ 配置项目设置："
echo "   - Framework Preset: Create React App"
echo "   - Root Directory: client"
echo "   - Build Command: npm run build"
echo "   - Output Directory: build"
echo ""
echo "6️⃣ 点击 'Deploy'"
echo ""
echo "⏳ 等待部署完成（约2-3分钟）"
echo ""
echo "✅ 部署完成后，你会得到前端URL"
echo "   例如: https://restaurant-analytics-platform.vercel.app"
echo ""
echo "📝 请记住这个URL！"
