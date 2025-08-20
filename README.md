# 餐饮经营年度数据分析与AI战略建议平台

## 项目简介

这是一个专为餐饮企业设计的年度财务数据分析平台，提供全面的数据可视化分析和AI驱动的战略建议。平台支持原始食品和有机食品业务的对比分析，帮助餐饮企业做出数据驱动的经营决策。

## 主要功能

### 📊 数据分析
- **收入趋势分析** - 可视化展示月度收入变化趋势
- **利润分析** - 深度分析利润构成和变化规律
- **成本结构分析** - 分析成本占比和结构变化
- **现金流分析** - 跟踪现金流状况

### 🔄 对比分析
- **有机vs原始食品对比** - 详细对比两种业务模式的财务表现
- **同比增长率计算** - 自动计算各项指标的同比增长情况
- **利润率对比** - 分析不同业务模式的盈利能力差异

### 🤖 AI智能分析
- **多维度分析** - 从收入、成本、利润、策略、季节性等多个维度进行分析
- **智能建议生成** - 基于数据分析结果，提供个性化的业务建议
- **季节性分析** - 识别业务季节性特征，指导季节性经营策略

### 📁 数据管理
- **12个月数据录入** - 支持按月输入原始食品和有机食品的财务数据
- **CSV导入导出** - 支持批量数据导入和结果导出
- **数据验证** - 实时验证数据格式和逻辑关系

## 技术栈

### 前端
- React 18
- Ant Design
- Chart.js
- React Router

### 后端
- Node.js
- Express.js
- Netlify Functions

### 部署
- Netlify (静态网站 + 函数服务)

## 快速开始

### 本地开发

1. **克隆项目**
```bash
git clone https://github.com/wuliuqi56713/restaurant-analytics-platform.git
cd restaurant-analytics-platform
```

2. **安装依赖**
```bash
cd client
npm install
```

3. **启动开发服务器**
```bash
npm start
```

4. **访问应用**
打开浏览器访问 http://localhost:3000

### 部署到Netlify

1. **Fork项目到你的GitHub账户**

2. **在Netlify中导入项目**
   - 访问 [Netlify](https://netlify.com)
   - 点击 "New site from Git"
   - 选择你的GitHub仓库
   - 设置构建配置：
     - Build command: `cd client && npm install && CI=false npm run build`
     - Publish directory: `client/build`

3. **部署完成**
   - Netlify会自动部署你的网站
   - 你会得到一个类似 `https://your-site-name.netlify.app` 的URL

## 项目结构

```
restaurant-analytics-platform/
├── client/                 # 前端React应用
│   ├── public/            # 静态资源
│   ├── src/               # 源代码
│   │   ├── components/    # React组件
│   │   ├── pages/         # 页面组件
│   │   ├── utils/         # 工具函数
│   │   └── App.js         # 主应用组件
│   └── package.json       # 前端依赖
├── netlify/               # Netlify Functions
│   └── functions/         # 服务器端函数
├── netlify.toml           # Netlify配置
└── README.md              # 项目说明
```

## 使用说明

### 1. 数据输入
- 在首页点击"开始输入数据"
- 按月份输入原始食品和有机食品的营业额、成本、利润数据
- 系统会自动验证数据格式和逻辑关系

### 2. 数据分析
- 提交数据后自动跳转到分析页面
- 查看各种图表和分析结果
- 点击"生成AI建议"获取智能分析建议

### 3. 数据导出
- 在数据输入页面可以导出CSV格式的数据模板
- 在分析页面可以导出分析结果

## 贡献指南

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开Pull Request

## 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式

如有问题或建议，请通过以下方式联系：
- 项目Issues: [GitHub Issues](https://github.com/wuliuqi56713/restaurant-analytics-platform/issues)
- 邮箱: [your-email@example.com]

---

**注意**: 这是一个演示项目，实际使用时请根据具体需求进行调整和优化。
