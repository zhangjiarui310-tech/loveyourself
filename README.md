# LoveYourself 自我关爱应用

一个基于React和AI的自我关爱应用，提供个性化的每日建议和支持，帮助用户建立积极的自我关爱习惯。

## ✨ 功能特点

- **每日建议**：基于用户偏好和历史记录生成个性化的自我关爱建议
- **建议历史**：记录和管理过去的建议，方便用户回顾和参考
- **用户设置**：允许用户自定义个人偏好和需求
- **响应式设计**：适配各种设备尺寸，提供良好的用户体验
- **现代化UI**：使用Tailwind CSS和Radix UI组件，打造美观直观的界面

## 🛠 技术栈

- **前端框架**：React 19.2.0 + TypeScript
- **构建工具**：Vite 7.2.4
- **样式方案**：Tailwind CSS 3.4.19
- **UI组件**：Radix UI + Lucide React
- **表单处理**：React Hook Form + Zod
- **状态管理**：React Context API + useLocalStorage
- **动画效果**：GSAP + Tailwind CSS Animate
- **图表库**：Recharts

## 📦 安装和运行

### 前提条件

- Node.js 18.0.0 或更高版本
- npm 9.0.0 或更高版本

### 安装步骤

1. 克隆项目到本地

```bash
git clone <repository-url>
cd loveyourself/app
```

2. 安装依赖

```bash
npm install
```

3. 启动开发服务器

```bash
npm run dev
```

4. 构建生产版本

```bash
npm run build
```

5. 预览生产构建

```bash
npm run preview
```

## 📁 项目结构

```
app/
├── public/             # 静态资源
│   ├── hero-1.jpg
│   ├── hero-2.jpg
│   └── hero-3.jpg
├── src/                # 源代码
│   ├── components/     # 组件
│   │   ├── ui/         # UI组件库
│   │   ├── AdviceHistory.tsx
│   │   ├── DailyAdviceCard.tsx
│   │   └── UserSetupForm.tsx
│   ├── hooks/          # 自定义钩子
│   │   ├── use-mobile.ts
│   │   └── useLocalStorage.ts
│   ├── lib/            # 工具库
│   │   ├── adviceGenerator.ts
│   │   ├── llmService.ts
│   │   └── utils.ts
│   ├── sections/       # 页面 sections
│   │   └── HeroSection.tsx
│   ├── types/          # TypeScript 类型定义
│   │   └── index.ts
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .gitignore
├── README.md
├── components.json     # 组件配置
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## 🚀 核心功能模块

### 每日建议生成

应用通过 `adviceGenerator.ts` 和 `llmService.ts` 生成个性化的自我关爱建议，基于用户的偏好和历史交互。

### 建议历史管理

`AdviceHistory.tsx` 组件展示用户过去收到的建议，方便回顾和管理。

### 用户设置

`UserSetupForm.tsx` 组件允许用户设置个人偏好，如兴趣爱好、关注领域等，以获得更精准的建议。

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

如有问题或建议，请通过以下方式联系我们：

- zhangjiarui310@163.com

---

**LoveYourself** - 关爱自己，从每一天开始 ❤️
