# 餐饮分析平台项目结构

## 📁 项目目录结构

```
商业分析网站/
├── 📁 client/                    # 前端React应用
│   ├── 📁 public/               # 静态资源
│   ├── 📁 src/                  # 源代码
│   │   ├── 📁 components/       # React组件
│   │   │   ├── 📁 charts/       # 图表组件
│   │   │   ├── AIAdviceCard.js  # AI建议卡片
│   │   │   ├── DataImportExport.js # Excel导入导出
│   │   │   └── Header.js        # 页面头部
│   │   ├── 📁 config/           # 配置文件
│   │   │   └── api.js           # API配置
│   │   ├── 📁 pages/            # 页面组件
│   │   │   ├── AnalysisPage.js  # 分析结果页面
│   │   │   └── DataInputPage.js # 数据输入页面
│   │   ├── 📁 utils/            # 工具函数（空目录）
│   │   ├── App.js               # 主应用组件
│   │   ├── App.css              # 应用样式
│   │   ├── index.js             # 应用入口
│   │   └── index.css            # 全局样式
│   ├── package.json             # 前端依赖配置
│   └── package-lock.json        # 依赖锁定文件
├── 📁 server/                   # 后端Node.js应用
│   ├── 📁 database/             # 数据库文件
│   │   ├── init.sql             # 数据库初始化脚本
│   │   └── restaurant.db        # SQLite数据库文件
│   ├── 📁 node_modules/         # 后端依赖
│   ├── index.js                 # 后端主文件
│   ├── env.example              # 环境变量示例
│   ├── package.json             # 后端依赖配置
│   └── package-lock.json        # 依赖锁定文件
├── 📁 .git/                     # Git版本控制
├── .gitignore                   # Git忽略规则
├── DOUBAO_API_SETUP.md          # 豆包API配置指南
├── package.json                 # 根目录配置
├── README.md                    # 项目说明
├── SYSTEM_STATUS.md             # 系统状态报告
└── vercel.json                  # Vercel部署配置
```

## 🗂️ 核心文件说明

### 📱 前端文件 (client/)
- **App.js**: React应用主组件，包含路由配置
- **DataInputPage.js**: 数据输入页面，支持Excel导入导出
- **AnalysisPage.js**: 分析结果页面，显示图表和AI建议
- **charts/**: 包含7种专业图表组件
- **DataImportExport.js**: Excel导入导出功能组件
- **AIAdviceCard.js**: AI建议显示组件

### 🖥️ 后端文件 (server/)
- **index.js**: Express服务器主文件，包含所有API端点
- **database/init.sql**: 数据库表结构和示例数据
- **env.example**: 环境变量配置示例

### 📋 配置文件
- **package.json**: 项目依赖和脚本配置
- **.gitignore**: Git忽略规则
- **vercel.json**: Vercel部署配置

### 📚 文档文件
- **README.md**: 项目介绍和使用说明
- **DOUBAO_API_SETUP.md**: 豆包API配置指南
- **SYSTEM_STATUS.md**: 系统功能状态报告

## 🧹 已清理的文件

以下文件已被清理，不影响程序运行：
- ✅ `test_doubao_api.js` - 测试脚本
- ✅ `simple_test_report.pdf` - 测试PDF文件
- ✅ `test_restaurant_report.pdf` - 测试PDF文件
- ✅ `测试数据.md` - 测试数据说明
- ✅ `server/OPENAI_SETUP.md` - OpenAI配置文档
- ✅ `餐饮数据导入模板.xlsx` - 临时Excel文件
- ✅ 根目录 `node_modules/` - 不必要的依赖
- ✅ 根目录 `package-lock.json` - 不必要的锁定文件

## 🎯 保留的核心功能

### ✅ 数据输入功能
- 12个月数据输入表单
- Excel文件导入导出
- 数据验证和错误提示

### ✅ 数据分析功能
- 年度汇总计算
- 增长率分析
- 成本利润分析

### ✅ 图表展示功能
- 7种专业图表
- 响应式设计
- 交互式图表

### ✅ AI建议功能
- 豆包API集成
- 智能分析建议
- 自动回退机制

### ✅ 系统功能
- 数据库存储
- API接口
- 错误处理

## 🚀 启动方式

```bash
# 安装依赖
npm run install-all

# 启动开发服务器
npm start

# 或分别启动
npm run server  # 后端 (端口5001)
npm run client  # 前端 (端口3000)
```

## 📊 项目统计

- **总文件数**: ~50个核心文件
- **代码行数**: ~3000行
- **依赖包**: ~100个
- **功能模块**: 5个主要模块
- **图表类型**: 7种专业图表

**项目结构已优化，保持核心功能完整！** 🎉
