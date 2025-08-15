# 餐饮经营年度数据分析与AI战略建议平台

## 项目简介
专业的餐饮行业数据分析平台，支持输入原始食品和有机食品的月度经营数据，自动计算关键指标，生成可视化图表，并提供AI驱动的战略建议。

## 功能特性
- 📊 月度数据输入（营业额、成本、利润）
- 🧮 自动计算年度汇总指标
- 📈 多维度数据可视化图表
- 🤖 AI驱动的商业分析建议
- 📄 专业PDF报告导出
- 📱 响应式设计，支持移动端

## 技术栈
- **前端**: React + Chart.js + Ant Design
- **后端**: Node.js + Express
- **数据库**: SQLite
- **AI服务**: OpenAI API
- **PDF生成**: jsPDF + html2canvas

## 快速开始

### 1. 安装依赖
```bash
npm run install-all
```

### 2. 环境配置
在 `server` 目录下创建 `.env` 文件：
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
```

### 3. 启动项目
```bash
npm start
```

- 前端: http://localhost:3000
- 后端: http://localhost:5000

## 项目结构
```
├── client/                 # React前端
├── server/                 # Node.js后端
├── database/               # 数据库脚本和示例数据
├── package.json            # 根依赖配置
└── README.md              # 项目说明
```

## 部署说明
- **Render**: 支持Node.js应用部署
- **Vercel**: 支持前端静态部署

## 作者
Vincentxjm

## 许可证
MIT
