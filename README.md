# NavGate - Personal Navigation Hub | 个人导航站

[English](#english) | [中文](#中文)

---

<a name="english"></a>

## English

An elegant, modern personal website navigation management system with **three deployment modes**:

- **localStorage Mode**: Pure frontend, data in browser (default)
- **GitHub Gist Mode**: Pure frontend, cross-device sync via Gist ⭐ **Recommended**
- **Backend Mode**: Full stack with MySQL, multi-user support

### ✨ Features

#### Universal Features

- 🎨 **Modern UI** - Built with React 19 + Material UI 7.0 + Tailwind CSS 4.1
- 📱 **Responsive Design** - Perfect support for desktop and mobile
- 🌙 **Dark Mode** - Light and dark theme switching
- 🔄 **Drag & Drop** - Drag and drop sorting for groups and sites using DND Kit
- 📊 **Group Management** - Flexible group management with public/private settings
- 💾 **Data Export/Import** - JSON format data backup and restore

#### localStorage Mode

- 🚀 **Zero Cost** - Completely free
- 📦 **Browser Storage** - Data in localStorage
- ⚡ **Instant** - No network latency
- 🔒 **Privacy** - Data stays local
- ⚠️ **Single Device** - No cross-device sync

#### GitHub Gist Mode ⭐ **Recommended**

- 🚀 **Zero Cost** - Free GitHub Gist storage
- 🔄 **Cross-device Sync** - Access from any browser
- 📚 **Version History** - Automatic version control
- ⚡ **Fast Setup** - 5 minutes to configure
- 🔒 **Secure** - Token-based authentication
- 🌍 **Reliable** - GitHub's infrastructure

#### Backend Mode

- 🌍 **Database Support** - MySQL persistent storage, multi-device data sync
- 🔐 **Secure Authentication** - JWT + bcrypt encryption, enterprise-grade security
- 👥 **Multi-user Support** - Multiple independent accounts
- 🚀 **Containerized Deployment** - One-click deployment with Docker Compose

### 🛠️ Tech Stack

#### Frontend (Shared)

- React 19
- TypeScript 5.7
- Material UI 7.0
- Tailwind CSS 4.1
- DND Kit
- Vite 6

#### Backend (Backend Mode)

- Express.js
- TypeScript
- Prisma ORM
- MySQL 8.0
- JWT + bcrypt
- Docker

#### Deployment

- GitHub Actions (GitHub Pages)
- Docker Compose (Backend Mode)
- Alibaba Cloud ECS (Optional)

### 📦 Quick Start

#### Choose Your Storage Mode

NavGate supports **three storage modes**. Choose based on your needs:

| Feature           | localStorage | **Gist** ⭐  | Backend      |
| ----------------- | ------------ | ------------ | ------------ |
| Setup Time        | 0 min        | **5 min**    | 30+ min      |
| Cost              | Free         | **Free**     | Server cost  |
| Cross-device Sync | ❌           | ✅           | ✅           |
| Version History   | ❌           | ✅           | Depends      |
| Multi-user        | ❌           | ❌           | ✅           |
| Recommended For   | Testing      | **Personal** | Team/Company |

📖 **Setup Guide, Mode Comparison & Environment Config**: [DEPLOYMENT_MODES.md](DEPLOYMENT_MODES.md)  
📖 **User Guide**: [USER_GUIDE.md](USER_GUIDE.md)

---

### 📗 GitHub Pages Mode

#### 1. Clone Project

```bash
git clone https://github.com/yourusername/NavGate.git
cd NavGate
```

#### 2. Install Dependencies

```bash
pnpm install
```

#### 3. Configure Environment

```bash
# Set to GitHub Pages mode
export VITE_DEPLOY_MODE=github-pages
```

#### 4. Local Development

```bash
pnpm run dev
```

Visit http://localhost:5173

#### 5. Deploy to GitHub Pages

1. Fork this repository to your GitHub account
2. Rename the repository to your project name (e.g., `your-navgate`)
3. Push code to `master` branch
4. Enable GitHub Pages in repository settings:
   - Settings → Pages
   - Source: GitHub Actions
5. Automatic deployment completes, visit `https://yourusername.github.io/your-navgate/`

#### Data Management

- **Export Data**: Top right menu → Export Data → Download JSON file
- **Import Data**: Top right menu → Import Data → Select file or paste JSON data
- **Data Backup**: Regularly export data as backup

---

### 🖥️ Backend Mode

#### Prerequisites

- Node.js 18+ and pnpm 8+
- MySQL 8.0+ database (or use Docker)
- Alibaba Cloud ECS server (optional)

#### 1. Clone Project

```bash
git clone https://github.com/yourusername/NavGate.git
cd NavGate
```

#### 2. Install Dependencies

```bash
pnpm install
```

#### 3. Configure Environment Variables

```bash
# Copy environment variable template
cp .env.example .env

# Edit .env file, configure the following variables:
```

```env
# Deployment mode
VITE_DEPLOY_MODE=backend

# Database configuration
DATABASE_URL=mysql://root:password@localhost:3306/navgate

# JWT configuration
JWT_SECRET=your-super-secret-jwt-key-change-this

# Authentication configuration
AUTH_USERNAME=admin
AUTH_PASSWORD=$2a$10$abcdefghijklmnopqrstuvwxyz
```

**Generate encrypted password:**

```bash
pnpm run hash-password
```

#### 4. Initialize Database

```bash
cd apps/server
npx prisma generate
npx prisma db push
```

#### 5. Local Development

```bash
# Start backend
pnpm run dev:backend

# Start frontend (new terminal window)
pnpm run dev
```

Visit http://localhost:5173

#### 6. Docker Deployment

```bash
cd docker

# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### 7. Alibaba Cloud Deployment

##### Method 1: Use Deployment Script

```bash
# Configure Alibaba Cloud credentials (in .env file)
ALIYUN_ACCESS_KEY_ID=your-access-key-id
ALIYUN_ACCESS_KEY_SECRET=your-access-key-secret
ALIYUN_REGION=cn-hangzhou
ALIYUN_ECS_INSTANCE_ID=i-xxxxxxxxx
ALIYUN_ECS_SSH_KEY=/path/to/ssh/key

# Execute deployment script
pnpm run deploy:aliyun
```

##### Method 2: Manual Deployment

1. Install Docker and Docker Compose on Alibaba Cloud ECS
2. Upload project to server
3. Configure environment variables
4. Run `docker-compose up -d`

### 📖 Usage Guide

#### Login Management (Backend Mode)

1. Click the "Login" button in the top right corner
2. Enter the username and password configured in `.env`
3. After login, you can manage groups and sites

#### Manage Groups

- **Add Group**: Click the + button in the bottom right corner
- **Edit Group**: Click the edit icon next to the group title
- **Delete Group**: Click the delete icon next to the group title
- **Drag to Sort**: Drag group titles to reorder

#### Manage Sites

- **Add Site**: Click the + icon next to the group title
- **Edit Site**: Click the edit icon on the site card
- **Delete Site**: Click the delete icon on the site card
- **Drag to Sort**: Drag site cards to reorder or move to other groups

#### Data Backup (GitHub Pages Mode)

- **Export Data**: Top right menu → Export Data → Download JSON file
- **Import Data**: Top right menu → Import Data → Select file or paste JSON

### 📝 API Documentation

#### Public Endpoints

- `GET /api/groups` - Get group list
- `GET /api/sites` - Get site list
- `GET /api/config` - Get site configuration
- `POST /api/auth/login` - User login (backend mode)

#### Authenticated Endpoints (Backend Mode)

**Group Management**

- `POST /api/groups` - Create group
- `PUT /api/groups/:id` - Update group
- `DELETE /api/groups/:id` - Delete group
- `POST /api/groups/reorder` - Reorder groups

**Site Management**

- `POST /api/sites` - Create site
- `PUT /api/sites/:id` - Update site
- `DELETE /api/sites/:id` - Delete site
- `POST /api/sites/reorder` - Reorder sites

**Configuration Management**

- `PUT /api/config` - Update configuration

### 🤝 Contributing

Welcome to submit Issues and Pull Requests!

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### 📄 License

[MIT License](LICENSE)

### 🚀 More Documentation

- [Detailed Deployment Guide](DEPLOYMENT.md)
- [Environment Configuration Guide](ENV_SETUP.md)

### ⭐ Star History

If this project helps you, welcome to give it a Star ⭐

---

<a name="中文"></a>

## 中文

一个优雅、现代化的个人网站导航管理系统，支持**三种部署模式**：

- **localStorage 模式**：纯前端，数据在浏览器（默认）
- **GitHub Gist 模式**：纯前端，通过 Gist 跨设备同步 ⭐ **推荐**
- **后端模式**：全栈方案，MySQL 数据库，支持多用户

### ✨ 特性

#### 通用特性

- 🎨 **现代化 UI** - 使用 React 19 + Material UI 7.0 + Tailwind CSS 4.1
- 📱 **响应式设计** - 完美支持桌面端和移动端
- 🌙 **暗色模式** - 支持明暗主题切换
- 🔄 **拖拽排序** - 使用 DND Kit 实现分组和站点的拖拽排序
- 📊 **分组管理** - 灵活的分组管理，支持公开/私密设置
- 💾 **数据导出/导入** - 支持 JSON 格式的数据备份和恢复

#### localStorage 模式

- 🚀 **零成本** - 完全免费
- 📦 **浏览器存储** - 数据在 localStorage
- ⚡ **即时响应** - 无网络延迟
- 🔒 **隐私保护** - 数据完全本地
- ⚠️ **单设备** - 无跨设备同步

#### GitHub Gist 模式 ⭐ **推荐**

- 🚀 **零成本** - 免费 GitHub Gist 存储
- 🔄 **跨设备同步** - 任何浏览器访问
- 📚 **版本历史** - 自动版本控制
- ⚡ **快速设置** - 5 分钟配置完成
- 🔒 **安全可靠** - Token 认证
- 🌍 **稳定** - GitHub 基础设施

#### 后端模式

- 🌍 **数据库支持** - MySQL 持久化存储，支持多设备数据同步
- 🔐 **安全认证** - JWT + bcrypt 加密，企业级安全保障
- 👥 **多用户支持** - 支持多账号独立管理
- 🚀 **容器化部署** - Docker Compose 一键部署

### 🛠️ 技术栈

#### 前端（共享）

- React 19
- TypeScript 5.7
- Material UI 7.0
- Tailwind CSS 4.1
- DND Kit
- Vite 6

#### 后端（后端模式）

- Express.js
- TypeScript
- Prisma ORM
- MySQL 8.0
- JWT + bcrypt
- Docker

#### 部署

- GitHub Actions（GitHub Pages）
- Docker Compose（后端模式）
- 阿里云 ECS（可选）

### 📦 快速开始

#### 选择存储模式

NavGate 支持**三种存储模式**，根据需求选择：

| 特性       | localStorage | **Gist** ⭐  | 后端模式   |
| ---------- | ------------ | ------------ | ---------- |
| 设置时间   | 0 分钟       | **5 分钟**   | 30+ 分钟   |
| 成本       | 免费         | **免费**     | 服务器成本 |
| 跨设备同步 | ❌           | ✅           | ✅         |
| 版本历史   | ❌           | ✅           | 取决于实现 |
| 多用户     | ❌           | ❌           | ✅         |
| 推荐用途   | 测试         | **个人使用** | 团队/企业  |

📖 **设置指南、模式对比与环境配置**：[DEPLOYMENT_MODES.md](DEPLOYMENT_MODES.md)  
📖 **使用指南**：[USER_GUIDE.md](USER_GUIDE.md)

---

### 📗 GitHub Pages 模式

#### 1. 克隆项目

```bash
git clone https://github.com/yourusername/NavGate.git
cd NavGate
```

#### 2. 安装依赖

```bash
pnpm install
```

#### 3. 配置环境

```bash
# 设置为 GitHub Pages 模式
export VITE_DEPLOY_MODE=github-pages
```

#### 4. 本地开发

```bash
pnpm run dev
```

访问 http://localhost:5173

#### 5. 部署到 GitHub Pages

1. Fork 本仓库到你的 GitHub 账号
2. 修改仓库名为你的项目名（如：`your-navgate`）
3. 推送代码到 `master` 分支
4. 在 GitHub 仓库设置中启用 GitHub Pages：
   - Settings → Pages
   - Source: GitHub Actions
5. 自动部署完成，访问 `https://yourusername.github.io/your-navgate/`

#### 数据管理

- **导出数据**：点击右上角菜单 → 导出数据 → 下载 JSON 文件
- **导入数据**：点击右上角菜单 → 导入数据 → 选择 JSON 文件或粘贴 JSON 数据
- **数据备份**：建议定期导出数据作为备份

---

### 🖥️ 后端模式

#### 前置要求

- Node.js 18+ 和 pnpm 8+
- MySQL 8.0+ 数据库（或使用 Docker）
- 阿里云 ECS 服务器（可选）

#### 1. 克隆项目

```bash
git clone https://github.com/yourusername/NavGate.git
cd NavGate
```

#### 2. 安装依赖

```bash
pnpm install
```

#### 3. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，配置以下变量：
```

```env
# 部署模式
VITE_DEPLOY_MODE=backend

# 数据库配置
DATABASE_URL=mysql://root:password@localhost:3306/navgate

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key-change-this

# 认证配置
AUTH_USERNAME=admin
AUTH_PASSWORD=$2a$10$abcdefghijklmnopqrstuvwxyz
```

**生成加密密码：**

```bash
pnpm run hash-password
```

#### 4. 初始化数据库

```bash
cd apps/server
npx prisma generate
npx prisma db push
```

#### 5. 本地开发

```bash
# 启动后端
pnpm run dev:backend

# 启动前端（新终端窗口）
pnpm run dev
```

访问 http://localhost:5173

#### 6. Docker 部署

```bash
cd docker

# 构建并启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

#### 7. 阿里云部署

##### 方式一：使用部署脚本

```bash
# 配置阿里云凭证（在 .env 文件中）
ALIYUN_ACCESS_KEY_ID=your-access-key-id
ALIYUN_ACCESS_KEY_SECRET=your-access-key-secret
ALIYUN_REGION=cn-hangzhou
ALIYUN_ECS_INSTANCE_ID=i-xxxxxxxxx
ALIYUN_ECS_SSH_KEY=/path/to/ssh/key

# 执行部署脚本
pnpm run deploy:aliyun
```

##### 方式二：手动部署

1. 在阿里云 ECS 上安装 Docker 和 Docker Compose
2. 上传项目到服务器
3. 配置环境变量
4. 运行 `docker-compose up -d`

### 📖 使用说明

#### 登录管理（后端模式）

1. 点击右上角的"登录"按钮
2. 输入在 `.env` 中配置的用户名和密码
3. 登录后可以进行分组和站点的管理

#### 管理分组

- **添加分组**：点击右下角的 + 按钮
- **编辑分组**：点击分组标题旁的编辑图标
- **删除分组**：点击分组标题旁的删除图标
- **拖拽排序**：拖动分组标题进行排序

#### 管理站点

- **添加站点**：点击分组标题旁的 + 图标
- **编辑站点**：点击站点卡片上的编辑图标
- **删除站点**：点击站点卡片上的删除图标
- **拖拽排序**：拖动站点卡片进行排序或移动到其他分组

#### 数据备份（GitHub Pages 模式）

- **导出数据**：右上角菜单 → 导出数据 → 下载 JSON 文件
- **导入数据**：右上角菜单 → 导入数据 → 选择文件或粘贴 JSON

### 📝 API 文档

#### 公开接口

- `GET /api/groups` - 获取分组列表
- `GET /api/sites` - 获取站点列表
- `GET /api/config` - 获取站点配置
- `POST /api/auth/login` - 用户登录（后端模式）

#### 需要认证的接口（后端模式）

**分组管理**

- `POST /api/groups` - 创建分组
- `PUT /api/groups/:id` - 更新分组
- `DELETE /api/groups/:id` - 删除分组
- `POST /api/groups/reorder` - 分组排序

**站点管理**

- `POST /api/sites` - 创建站点
- `PUT /api/sites/:id` - 更新站点
- `DELETE /api/sites/:id` - 删除站点
- `POST /api/sites/reorder` - 站点排序

**配置管理**

- `PUT /api/config` - 更新配置

### 🤝 贡献

欢迎提交 Issue 和 Pull Request！

查看 [贡献指南](CONTRIBUTING.md) 了解详情。

### 📄 许可证

[MIT License](LICENSE)

### 🚀 更多文档

- [详细部署指南](DEPLOYMENT.md)
- [环境配置说明](ENV_SETUP.md)

### ⭐ Star History

如果这个项目对你有帮助，欢迎点个 Star ⭐
