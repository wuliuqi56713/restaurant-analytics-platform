#!/bin/bash

echo "🚀 餐饮分析平台部署脚本"
echo "=========================="

# 检查Node.js版本
echo "📋 检查环境..."
node_version=$(node -v)
echo "Node.js版本: $node_version"

# 安装依赖
echo "📦 安装依赖..."
echo "安装前端依赖..."
cd client
npm install
cd ..

echo "安装后端依赖..."
cd server
npm install
cd ..

# 构建前端
echo "🔨 构建前端..."
cd client
npm run build
cd ..

echo "✅ 构建完成！"
echo ""
echo "📋 部署选项："
echo "1. Vercel + Render (推荐，免费)"
echo "2. Netlify + Railway (免费)"
echo "3. 阿里云/腾讯云 (付费)"
echo ""
echo "🔗 部署链接："
echo "- Vercel: https://vercel.com"
echo "- Render: https://render.com"
echo "- Netlify: https://netlify.com"
echo "- Railway: https://railway.app"
echo ""
echo "📖 详细部署说明请查看 README.md"
