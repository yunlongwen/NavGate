# Deployment Guide | 部署指南

[English](#english) | [中文](#中文)

---

<a name="english"></a>

## English

This guide will help you deploy NavGate personal navigation hub, supporting **two deployment modes**:

- **GitHub Pages Mode**: Pure frontend, zero cost, suitable for personal use
- **Backend Mode**: Express.js + MySQL, suitable for enterprise needs

---

### 📗 Mode 1: GitHub Pages Deployment

#### Prerequisites

1. **GitHub Account** - Free account is sufficient
2. **Node.js** - Version 18 or higher
3. **pnpm** - Version 8 or higher

#### Deployment Steps

##### 1. Prepare Repository

```bash
# Clone project
git clone https://github.com/yourusername/NavGate.git
cd NavGate
```

##### 2. Install Dependencies

```bash
pnpm install
```

##### 3. Local Testing

```bash
# Set environment variable
export VITE_DEPLOY_MODE=github-pages

# Start development server
pnpm run dev
```

Visit http://localhost:5173 to test if features work properly.

##### 4. Push Code and Deploy

```bash
# Commit code
git add .
git commit -m "Initial commit"

# Push to GitHub
git push origin master
```

##### 5. Enable GitHub Pages

1. Go to GitHub repository
2. Click **Settings** → **Pages**
3. Under **Build and deployment**, select **Source**: **GitHub Actions**
4. Wait for Actions workflow to complete
5. Visit deployed URL: `https://yourusername.github.io/your-repo/`

#### Data Management

In GitHub Pages mode, data is stored in browser localStorage:

- **Storage Limit**: 5-10MB, depending on browser
- **Cross-device**: Data on different devices won't sync
- **Data Backup**: Top right menu → Export Data / Import Data

---

### 🖥️ Mode 2: Backend Mode Deployment

#### Prerequisites

1. **Node.js** - Version 18 or higher
2. **pnpm** - Version 8 or higher
3. **MySQL** - Version 8.0 or higher
4. **Docker** - Version 20.10 or higher (optional)
5. **Server** - Alibaba Cloud ECS or other Linux server

#### Local Development

##### 1. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` file and configure the following variables:

```env
VITE_DEPLOY_MODE=backend
DATABASE_URL=mysql://root:password@localhost:3306/navgate
JWT_SECRET=your-super-secret-jwt-key
AUTH_USERNAME=admin
AUTH_PASSWORD=$2a$10$abcdefghijklmnopqrstuvwxyz
PORT=3000
```

##### 2. Generate Encrypted Password

```bash
pnpm run hash-password
```

##### 3. Initialize Database

```bash
cd apps/server
npx prisma generate
npx prisma db push
cd ../..
```

##### 4. Start Application

```bash
# Start backend
pnpm run dev:backend

# Start frontend
pnpm run dev
```

Visit http://localhost:5173

#### Docker Deployment

##### 1. Configure Environment Variables

Edit `.env` file:

```env
DB_PASSWORD=your-mysql-root-password
JWT_SECRET=your-super-secret-jwt-key
AUTH_USERNAME=admin
AUTH_PASSWORD=$2a$10$abcdefghijklmnopqrstuvwxyz
```

##### 2. Build and Start

```bash
cd docker
docker-compose up -d
```

#### Alibaba Cloud ECS Deployment

##### 1. Configure Alibaba Cloud Credentials

Edit `.env` file:

```env
ALIYUN_ACCESS_KEY_ID=your-access-key-id
ALIYUN_ACCESS_KEY_SECRET=your-access-key-secret
ALIYUN_REGION=cn-hangzhou
ALIYUN_ECS_INSTANCE_ID=i-xxxxxxxxx
```

##### 2. Execute Deployment Script

```bash
pnpm run deploy:aliyun
```

---

### 🔧 Common Issues

#### GitHub Pages Mode

**Q: Page shows 404 after deployment**

A: Check if the `base` path in `vite.config.ts` matches the repository name.

**Q: Data loss**

A: localStorage data may be cleared by browser, please export data regularly for backup.

#### Backend Mode

**Q: Database connection failed**

A: Check if `DATABASE_URL` in `.env` file is correct.

**Q: Authentication failed**

A: Ensure `AUTH_PASSWORD` uses the encrypted password.

---

### 📚 Related Documentation

- [Environment Configuration Guide](ENV_SETUP.md)
- [README](README.md)

---

<a name="中文"></a>

## 中文

本指南将帮助你部署 NavGate 个人导航站，支持**两种部署模式**：

- **GitHub Pages 模式**：纯前端，零成本，适合个人使用
- **后端模式**：Express.js + MySQL，适合企业级需求

---

### 📗 模式一：GitHub Pages 部署

#### 前置要求

1. **GitHub 账号** - 免费账号即可
2. **Node.js** - 版本 18 或更高
3. **pnpm** - 版本 8 或更高

#### 部署步骤

##### 1. 准备仓库

```bash
# 克隆项目
git clone https://github.com/yourusername/NavGate.git
cd NavGate
```

##### 2. 安装依赖

```bash
pnpm install
```

##### 3. 本地测试

```bash
# 设置环境变量
export VITE_DEPLOY_MODE=github-pages

# 启动开发服务器
pnpm run dev
```

访问 http://localhost:5173，测试功能是否正常。

##### 4. 推送代码并部署

```bash
# 提交代码
git add .
git commit -m "Initial commit"

# 推送到 GitHub
git push origin master
```

##### 5. 启用 GitHub Pages

1. 进入 GitHub 仓库
2. 点击 **Settings** → **Pages**
3. 在 **Build and deployment** 下，**Source** 选择 **GitHub Actions**
4. 等待 Actions 工作流完成
5. 访问部署的 URL：`https://yourusername.github.io/your-repo/`

#### 数据管理

GitHub Pages 模式下，数据存储在浏览器 localStorage 中：

- **存储限制**：5-10MB，取决于浏览器
- **跨设备**：不同设备上的数据不会同步
- **数据备份**：右上角菜单 → 导出数据 / 导入数据

---

### 🖥️ 模式二：后端模式部署

#### 前置要求

1. **Node.js** - 版本 18 或更高
2. **pnpm** - 版本 8 或更高
3. **MySQL** - 版本 8.0 或更高
4. **Docker** - 版本 20.10 或更高（可选）
5. **服务器** - 阿里云 ECS 或其他 Linux 服务器

#### 本地开发

##### 1. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置以下变量：

```env
VITE_DEPLOY_MODE=backend
DATABASE_URL=mysql://root:password@localhost:3306/navgate
JWT_SECRET=your-super-secret-jwt-key
AUTH_USERNAME=admin
AUTH_PASSWORD=$2a$10$abcdefghijklmnopqrstuvwxyz
PORT=3000
```

##### 2. 生成加密密码

```bash
pnpm run hash-password
```

##### 3. 初始化数据库

```bash
cd apps/server
npx prisma generate
npx prisma db push
cd ../..
```

##### 4. 启动应用

```bash
# 启动后端
pnpm run dev:backend

# 启动前端
pnpm run dev
```

访问 http://localhost:5173

#### Docker 部署

##### 1. 配置环境变量

编辑 `.env` 文件：

```env
DB_PASSWORD=your-mysql-root-password
JWT_SECRET=your-super-secret-jwt-key
AUTH_USERNAME=admin
AUTH_PASSWORD=$2a$10$abcdefghijklmnopqrstuvwxyz
```

##### 2. 构建并启动

```bash
cd docker
docker-compose up -d
```

#### 阿里云 ECS 部署

##### 1. 配置阿里云凭证

编辑 `.env` 文件：

```env
ALIYUN_ACCESS_KEY_ID=your-access-key-id
ALIYUN_ACCESS_KEY_SECRET=your-access-key-secret
ALIYUN_REGION=cn-hangzhou
ALIYUN_ECS_INSTANCE_ID=i-xxxxxxxxx
```

##### 2. 执行部署脚本

```bash
pnpm run deploy:aliyun
```

---

### 🔧 常见问题

#### GitHub Pages 模式

**Q: 部署后页面显示 404**

A: 检查 `vite.config.ts` 中的 `base` 路径是否与仓库名称匹配。

**Q: 数据丢失**

A: localStorage 数据可能被浏览器清理，请定期导出数据备份。

#### 后端模式

**Q: 数据库连接失败**

A: 检查 `.env` 文件中的 `DATABASE_URL` 是否正确。

**Q: 认证失败**

A: 确认 `AUTH_PASSWORD` 使用的是加密后的密码。

---

### 📚 相关文档

- [环境配置说明](ENV_SETUP.md)
- [README](README.md)
