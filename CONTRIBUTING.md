# Contributing Guide | 贡献指南

[English](#english) | [中文](#中文)

---

<a name="english"></a>

## English

Thank you for considering contributing to NavGate!

### How to Contribute

#### Report Bugs

If you find a bug, please create an Issue with the following information:

1. **Bug Description** - Clear and concise description of the problem
2. **Reproduction Steps** - Detailed steps to reproduce
3. **Expected Behavior** - What you expected to happen
4. **Actual Behavior** - What actually happened
5. **Environment Info** - Browser version, operating system, etc.
6. **Screenshots** - If applicable, add screenshots to help explain the problem

#### Propose New Features

If you have an idea for a new feature, please create an Issue with:

1. **Feature Description** - Clearly describe the feature you want
2. **Use Case** - Why this feature is needed
3. **Possible Implementation** - If you have ideas, describe how to implement it

#### Submit Code

##### 1. Fork the Project

```bash
# Clone after forking
git clone https://github.com/yourusername/NavGate.git
cd NavGate
```

##### 2. Create Branch

```bash
git checkout -b feature/your-feature-name
```

##### 3. Install Dependencies

```bash
pnpm install
```

##### 4. Make Changes

- Follow project code style
- Add necessary tests
- Update relevant documentation

##### 5. Commit Code

```bash
git add .
git commit -m "feat: add your feature description"
```

Commit message format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation update
- `style:` Code formatting (no functionality changes)
- `refactor:` Refactoring
- `test:` Test related
- `chore:` Build process or auxiliary tool changes

##### 6. Push to GitHub

```bash
git push origin feature/your-feature-name
```

##### 7. Create Pull Request

- Create Pull Request on GitHub
- Fill in PR template
- Wait for code review

### Development Standards

#### Code Style

The project uses ESLint and Prettier for code formatting:

```bash
# Check code format
pnpm run lint

# Auto format
pnpm run format
```

#### TypeScript

- Use TypeScript strict mode
- Add type annotations for all functions and variables
- Avoid using `any` type

#### React

- Use function components and Hooks
- Component names use PascalCase
- Props interface named as ComponentName + Props

#### File Organization

```
src/
├── components/     # React components
├── api/           # API calls
│   ├── http.ts    # Backend mode API
│   ├── local.ts   # GitHub Pages mode API
│   └── index.ts   # API exports
├── App.tsx        # Main application component
└── main.tsx       # Entry file

apps/server/
├── controllers/   # API controllers
├── middleware/    # Middleware
├── routes/        # Routes
└── index.ts       # Server entry
```

### Testing

Before submitting PR, please ensure:

1. Code builds successfully
2. All features work properly
3. No ESLint errors

```bash
# Build test
pnpm run build

# Local test
pnpm run dev
```

### Documentation

If your changes affect user usage, please update relevant documentation:

- README.md - Project introduction and quick start
- DEPLOYMENT_MODES.md - Deployment modes & guide
- ENV_SETUP.md - Environment configuration
- API documentation - If API is modified

### Code of Conduct

- Respect all contributors
- Accept constructive criticism
- Focus on what's best for the project
- Show empathy towards community members

### License

By submitting code, you agree to release the code under the MIT license.

### Questions?

Feel free to:

- Create an Issue
- Send an email
- Discuss in Discussions

Thank you for your contribution! 🎉

---

<a name="中文"></a>

## 中文

感谢你考虑为 NavGate 做出贡献！

### 如何贡献

#### 报告 Bug

如果你发现了 Bug，请创建一个 Issue，并包含以下信息：

1. **Bug 描述** - 清晰简洁地描述问题
2. **复现步骤** - 详细的复现步骤
3. **期望行为** - 你期望发生什么
4. **实际行为** - 实际发生了什么
5. **环境信息** - 浏览器版本、操作系统等
6. **截图** - 如果适用，添加截图帮助说明问题

#### 提出新功能

如果你有新功能的想法，请创建一个 Issue，并包含：

1. **功能描述** - 清晰描述你想要的功能
2. **使用场景** - 为什么需要这个功能
3. **可能的实现** - 如果有想法，可以描述如何实现

#### 提交代码

##### 1. Fork 项目

```bash
# Fork 后克隆到本地
git clone https://github.com/yourusername/NavGate.git
cd NavGate
```

##### 2. 创建分支

```bash
git checkout -b feature/your-feature-name
```

##### 3. 安装依赖

```bash
pnpm install
```

##### 4. 进行修改

- 遵循项目的代码风格
- 添加必要的测试
- 更新相关文档

##### 5. 提交代码

```bash
git add .
git commit -m "feat: add your feature description"
```

提交信息格式：

- `feat:` 新功能
- `fix:` Bug 修复
- `docs:` 文档更新
- `style:` 代码格式（不影响功能）
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建过程或辅助工具的变动

##### 6. 推送到 GitHub

```bash
git push origin feature/your-feature-name
```

##### 7. 创建 Pull Request

- 在 GitHub 上创建 Pull Request
- 填写 PR 模板
- 等待代码审查

### 开发规范

#### 代码风格

项目使用 ESLint 和 Prettier 进行代码格式化：

```bash
# 检查代码格式
pnpm run lint

# 自动格式化
pnpm run format
```

#### TypeScript

- 使用 TypeScript 严格模式
- 为所有函数和变量添加类型注解
- 避免使用 `any` 类型

#### React

- 使用函数组件和 Hooks
- 组件名使用 PascalCase
- Props 接口以组件名 + Props 命名

#### 文件组织

```
src/
├── components/     # React 组件
├── api/           # API 调用
│   ├── http.ts    # 后端模式 API
│   ├── local.ts   # GitHub Pages 模式 API
│   └── index.ts   # API 导出
├── App.tsx        # 主应用组件
└── main.tsx       # 入口文件

apps/server/
├── controllers/   # API 控制器
├── middleware/    # 中间件
├── routes/        # 路由
└── index.ts       # 服务器入口
```

### 测试

在提交 PR 前，请确保：

1. 代码可以正常构建
2. 所有功能正常工作
3. 没有 ESLint 错误

```bash
# 构建测试
pnpm run build

# 本地测试
pnpm run dev
```

### 文档

如果你的更改影响了用户使用方式，请更新相关文档：

- README.md - 项目介绍和快速开始
- DEPLOYMENT_MODES.md - 部署模式和指南
- ENV_SETUP.md - 环境配置说明
- API 文档 - 如果修改了 API

### 行为准则

- 尊重所有贡献者
- 接受建设性的批评
- 专注于对项目最有利的事情
- 对社区成员表现出同理心

### 许可证

提交代码即表示你同意将代码以 MIT 许可证发布。

### 问题？

如有任何问题，欢迎：

- 创建 Issue
- 发送邮件
- 在 Discussions 中讨论

感谢你的贡献！🎉
