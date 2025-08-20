#!/bin/bash

echo "🚀 最简单免费部署方法"
echo "===================="

echo "📋 检查环境..."
if ! command -v git &> /dev/null; then
    echo "❌ Git 未安装"
    exit 1
fi

echo "✅ 环境检查通过"

# 构建前端
echo "📦 构建前端..."
cd client
npm run build
cd ..

echo "✅ 前端构建完成"

echo ""
echo "🌐 开始部署到 Netlify（免费）..."
echo ""
echo "📋 部署步骤："
echo ""
echo "1️⃣ 打开浏览器访问: https://netlify.com"
echo ""
echo "2️⃣ 使用 GitHub 账号登录"
echo ""
echo "3️⃣ 点击 'New site from Git'"
echo ""
echo "4️⃣ 选择 GitHub"
echo ""
echo "5️⃣ 选择仓库: wuliuqi56713/restaurant-analytics-platform"
echo ""
echo "6️⃣ 设置部署配置："
echo "   - Build command: cd client && npm install && npm run build"
echo "   - Publish directory: client/build"
echo ""
echo "7️⃣ 点击 'Deploy site'"
echo ""
echo "⏳ 等待部署完成（约2-3分钟）"
echo ""
echo "✅ 部署完成后，你会得到网站URL"
echo "   例如: https://your-site-name.netlify.app"
echo ""
echo "🎉 完成！任何人都可以通过这个URL访问你的网站！"
echo ""
echo "📝 特点："
echo "   ✅ 完全免费"
echo "   ✅ 自动部署"
echo "   ✅ 包含后端API"
echo "   ✅ 无需配置环境变量"
echo "   ✅ 一键部署"
