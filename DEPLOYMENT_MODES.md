# Deployment Modes | 部署模式说明

[English](#english) | [中文](#中文)

---

<a name="english"></a>

## English

## 📦 Two Deployment Modes

NavGate supports two deployment modes with different data storage and management approaches:

### 🌐 Mode 1: GitHub Pages Mode (Pure Frontend)

**Current Deployment**: This is what you're using now!

#### How it Works

```
User Browser
    ↓
Static HTML/JS/CSS (GitHub Pages)
    ↓
localStorage (Browser Storage)
```

#### Data Flow

1. **Initial Load**: When you first visit, demo data is automatically loaded from `DEFAULT_GROUPS` and `DEFAULT_SITES` constants
2. **Data Storage**: All data (groups, sites, config) is stored in browser `localStorage`
3. **Data Operations**: All CRUD operations happen in the browser using the `local.ts` API implementation
4. **No Backend**: No server requests, everything runs in the browser

#### Environment Variable

```bash
VITE_DEPLOY_MODE=github-pages
```

#### API Implementation

Uses: `apps/frontend/src/api/local.ts`

```typescript
// Automatically selected in index.ts
if (mode === 'github-pages') {
  apiImplementation = await import('./local')
}
```

#### Advantages

- ✅ **Zero Cost**: Completely free hosting on GitHub Pages
- ✅ **Fast**: No network latency, instant operations
- ✅ **Privacy**: Data never leaves your browser
- ✅ **Simple**: No server setup required

#### Limitations

- ⚠️ **Single Device**: Data only exists in one browser
- ⚠️ **No Sync**: Can't automatically sync across devices
- ⚠️ **Data Loss Risk**: Clearing browser data loses everything
- ⚠️ **No Multi-User**: Can't share with others

---

### 🖥️ Mode 2: Backend Mode (Full Stack)

**For Self-Hosting**: Deploy with your own server and database

#### How it Works

```
User Browser
    ↓
Frontend (React App)
    ↓
Backend API (Express.js)
    ↓
MySQL Database
```

#### Data Flow

1. **Initial Load**: Frontend fetches data from backend API via HTTP requests
2. **Data Storage**: All data stored in MySQL database
3. **Data Operations**: All CRUD operations send HTTP requests to backend
4. **Authentication**: JWT-based authentication for secure access

#### Environment Variables

**Frontend:**

```bash
VITE_DEPLOY_MODE=backend
VITE_API_BASE_URL=http://your-server.com:3000
```

**Backend:**

```bash
DATABASE_URL=mysql://user:password@localhost:3306/navgate
JWT_SECRET=your-secret-key
AUTH_USERNAME=admin
AUTH_PASSWORD=hashed-password
```

#### API Implementation

Uses: `apps/frontend/src/api/http.ts`

```typescript
// Automatically selected in index.ts
if (mode === 'backend') {
  apiImplementation = await import('./http')
}
```

#### How Data Refresh Works

**Page Load:**

```typescript
// App.tsx - useEffect on mount
useEffect(() => {
  loadData() // Fetches from backend API
}, [])

const loadData = async () => {
  const [groupsData, sitesData, configData] = await Promise.all([
    getGroups(), // GET /api/groups
    getSites(), // GET /api/sites
    getConfig(), // GET /api/config
  ])
  setGroups(groupsData)
  setSites(sitesData)
  setConfig(configData)
}
```

**After Operations:**

```typescript
// After create/update/delete
await createGroup(data)
onDataChange() // Calls loadData() to refresh from backend
```

#### Advantages

- ✅ **Multi-Device**: Access from anywhere
- ✅ **Data Sync**: Automatic synchronization
- ✅ **Persistent**: Database storage, no data loss
- ✅ **Multi-User**: Support multiple accounts
- ✅ **Secure**: JWT authentication
- ✅ **Scalable**: Can handle large datasets

#### Requirements

- ⚠️ **Server**: Need a server to host backend
- ⚠️ **Database**: Need MySQL database
- ⚠️ **Maintenance**: Server and database maintenance
- ⚠️ **Cost**: Hosting costs

---

## 🔄 How Mode Selection Works

### Automatic API Selection

The frontend automatically selects the correct API implementation based on the `VITE_DEPLOY_MODE` environment variable:

```typescript
// apps/frontend/src/api/index.ts
const mode = import.meta.env.VITE_DEPLOY_MODE || 'github-pages'

let apiModule: any

if (mode === 'github-pages') {
  // Pure frontend mode: use localStorage
  apiModule = import('./local')
} else {
  // Backend mode: use HTTP API
  apiModule = import('./http')
}
```

### Build Configuration

**GitHub Pages Build:**

```yaml
# .github/workflows/deploy-github-pages.yml
- name: Build
  run: pnpm --filter frontend build
  env:
    VITE_DEPLOY_MODE: github-pages
```

**Backend Mode Build:**

```bash
# Build with backend mode
VITE_DEPLOY_MODE=backend VITE_API_BASE_URL=http://your-server.com:3000 pnpm --filter frontend build
```

---

## 🚀 Deployment Instructions

### Deploy GitHub Pages Mode (Current)

Already deployed! Just push to GitHub:

```bash
git push origin master
# GitHub Actions automatically builds and deploys
```

### Deploy Backend Mode

See detailed instructions in:

- [DEPLOYMENT.md](DEPLOYMENT.md) - Full deployment guide
- [ENV_SETUP.md](ENV_SETUP.md) - Environment setup

Quick steps:

1. **Setup Database**

   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE navgate;
   ```

2. **Configure Environment**

   ```bash
   # Backend .env
   DATABASE_URL="mysql://user:password@localhost:3306/navgate"
   JWT_SECRET="your-secret-key"
   AUTH_USERNAME="admin"
   AUTH_PASSWORD="$2b$10$..."
   ```

3. **Build and Deploy**

   ```bash
   # Build frontend with backend mode
   VITE_DEPLOY_MODE=backend pnpm --filter frontend build

   # Start backend
   cd apps/server
   pnpm prisma:generate
   pnpm prisma:migrate
   pnpm start
   ```

4. **Use Docker (Recommended)**
   ```bash
   docker-compose up -d
   ```

---

## 📊 Comparison Table

| Feature              | GitHub Pages Mode | Backend Mode |
| -------------------- | ----------------- | ------------ |
| **Cost**             | Free              | Server cost  |
| **Setup Difficulty** | Easy              | Medium       |
| **Data Storage**     | localStorage      | MySQL        |
| **Multi-Device**     | ❌                | ✅           |
| **Data Sync**        | ❌                | ✅           |
| **Multi-User**       | ❌                | ✅           |
| **Authentication**   | ❌                | ✅ JWT       |
| **Data Backup**      | Manual export     | Database     |
| **Performance**      | Instant           | Network      |
| **Privacy**          | 100% local        | Server       |

---

## 🔧 Switching Between Modes

### From GitHub Pages to Backend

1. Deploy backend server with database
2. Export data from GitHub Pages (JSON)
3. Import data to backend database
4. Update frontend build with backend mode
5. Deploy frontend to your server

### From Backend to GitHub Pages

1. Export data from backend
2. Convert to demo data format
3. Update `DEFAULT_GROUPS` and `DEFAULT_SITES` in `local.ts`
4. Build with GitHub Pages mode
5. Deploy to GitHub Pages

---

## 💡 Recommendations

### Use GitHub Pages Mode If:

- ✅ Personal use only
- ✅ Don't need multi-device sync
- ✅ Want zero cost
- ✅ Prefer simplicity
- ✅ Value privacy

### Use Backend Mode If:

- ✅ Need multi-device access
- ✅ Want to share with others
- ✅ Need multi-user support
- ✅ Have server resources
- ✅ Need data persistence

---

<a name="中文"></a>

## 中文

## 📦 两种部署模式

NavGate 支持两种部署模式，具有不同的数据存储和管理方式：

### 🌐 模式 1：GitHub Pages 模式（纯前端）

**当前部署**：这就是你现在使用的模式！

#### 工作原理

```
用户浏览器
    ↓
静态 HTML/JS/CSS (GitHub Pages)
    ↓
localStorage (浏览器存储)
```

#### 数据流程

1. **初始加载**：首次访问时，从 `DEFAULT_GROUPS` 和 `DEFAULT_SITES` 常量自动加载演示数据
2. **数据存储**：所有数据（分组、站点、配置）存储在浏览器 `localStorage` 中
3. **数据操作**：所有 CRUD 操作在浏览器中使用 `local.ts` API 实现
4. **无后端**：无服务器请求，一切都在浏览器中运行

#### 环境变量

```bash
VITE_DEPLOY_MODE=github-pages
```

#### API 实现

使用：`apps/frontend/src/api/local.ts`

```typescript
// 在 index.ts 中自动选择
if (mode === 'github-pages') {
  apiImplementation = await import('./local')
}
```

#### 优势

- ✅ **零成本**：GitHub Pages 完全免费托管
- ✅ **快速**：无网络延迟，即时操作
- ✅ **隐私**：数据永不离开浏览器
- ✅ **简单**：无需服务器设置

#### 限制

- ⚠️ **单设备**：数据仅存在于一个浏览器
- ⚠️ **无同步**：无法自动跨设备同步
- ⚠️ **数据丢失风险**：清除浏览器数据会丢失所有内容
- ⚠️ **无多用户**：无法与他人共享

---

### 🖥️ 模式 2：后端模式（全栈）

**自托管**：使用自己的服务器和数据库部署

#### 工作原理

```
用户浏览器
    ↓
前端 (React 应用)
    ↓
后端 API (Express.js)
    ↓
MySQL 数据库
```

#### 数据流程

1. **初始加载**：前端通过 HTTP 请求从后端 API 获取数据
2. **数据存储**：所有数据存储在 MySQL 数据库中
3. **数据操作**：所有 CRUD 操作向后端发送 HTTP 请求
4. **身份验证**：基于 JWT 的身份验证，确保安全访问

#### 环境变量

**前端：**

```bash
VITE_DEPLOY_MODE=backend
VITE_API_BASE_URL=http://your-server.com:3000
```

**后端：**

```bash
DATABASE_URL=mysql://user:password@localhost:3306/navgate
JWT_SECRET=your-secret-key
AUTH_USERNAME=admin
AUTH_PASSWORD=hashed-password
```

#### API 实现

使用：`apps/frontend/src/api/http.ts`

```typescript
// 在 index.ts 中自动选择
if (mode === 'backend') {
  apiImplementation = await import('./http')
}
```

#### 数据刷新机制

**页面加载：**

```typescript
// App.tsx - 组件挂载时的 useEffect
useEffect(() => {
  loadData() // 从后端 API 获取数据
}, [])

const loadData = async () => {
  const [groupsData, sitesData, configData] = await Promise.all([
    getGroups(), // GET /api/groups
    getSites(), // GET /api/sites
    getConfig(), // GET /api/config
  ])
  setGroups(groupsData)
  setSites(sitesData)
  setConfig(configData)
}
```

**操作后：**

```typescript
// 创建/更新/删除后
await createGroup(data)
onDataChange() // 调用 loadData() 从后端刷新数据
```

#### 优势

- ✅ **多设备**：随处访问
- ✅ **数据同步**：自动同步
- ✅ **持久化**：数据库存储，无数据丢失
- ✅ **多用户**：支持多个账户
- ✅ **安全**：JWT 身份验证
- ✅ **可扩展**：可处理大型数据集

#### 要求

- ⚠️ **服务器**：需要服务器托管后端
- ⚠️ **数据库**：需要 MySQL 数据库
- ⚠️ **维护**：服务器和数据库维护
- ⚠️ **成本**：托管费用

---

## 🔄 模式选择机制

### 自动 API 选择

前端根据 `VITE_DEPLOY_MODE` 环境变量自动选择正确的 API 实现：

```typescript
// apps/frontend/src/api/index.ts
const mode = import.meta.env.VITE_DEPLOY_MODE || 'github-pages'

let apiModule: any

if (mode === 'github-pages') {
  // 纯前端模式：使用 localStorage
  apiModule = import('./local')
} else {
  // 后端模式：使用 HTTP API
  apiModule = import('./http')
}
```

### 构建配置

**GitHub Pages 构建：**

```yaml
# .github/workflows/deploy-github-pages.yml
- name: Build
  run: pnpm --filter frontend build
  env:
    VITE_DEPLOY_MODE: github-pages
```

**后端模式构建：**

```bash
# 使用后端模式构建
VITE_DEPLOY_MODE=backend VITE_API_BASE_URL=http://your-server.com:3000 pnpm --filter frontend build
```

---

## 🚀 部署说明

### 部署 GitHub Pages 模式（当前）

已部署！只需推送到 GitHub：

```bash
git push origin master
# GitHub Actions 自动构建和部署
```

### 部署后端模式

查看详细说明：

- [DEPLOYMENT.md](DEPLOYMENT.md) - 完整部署指南
- [ENV_SETUP.md](ENV_SETUP.md) - 环境设置

快速步骤：

1. **设置数据库**

   ```bash
   # 创建 MySQL 数据库
   mysql -u root -p
   CREATE DATABASE navgate;
   ```

2. **配置环境**

   ```bash
   # 后端 .env
   DATABASE_URL="mysql://user:password@localhost:3306/navgate"
   JWT_SECRET="your-secret-key"
   AUTH_USERNAME="admin"
   AUTH_PASSWORD="$2b$10$..."
   ```

3. **构建和部署**

   ```bash
   # 使用后端模式构建前端
   VITE_DEPLOY_MODE=backend pnpm --filter frontend build

   # 启动后端
   cd apps/server
   pnpm prisma:generate
   pnpm prisma:migrate
   pnpm start
   ```

4. **使用 Docker（推荐）**
   ```bash
   docker-compose up -d
   ```

---

## 📊 对比表

| 功能         | GitHub Pages 模式 | 后端模式   |
| ------------ | ----------------- | ---------- |
| **成本**     | 免费              | 服务器成本 |
| **设置难度** | 简单              | 中等       |
| **数据存储** | localStorage      | MySQL      |
| **多设备**   | ❌                | ✅         |
| **数据同步** | ❌                | ✅         |
| **多用户**   | ❌                | ✅         |
| **身份验证** | ❌                | ✅ JWT     |
| **数据备份** | 手动导出          | 数据库     |
| **性能**     | 即时              | 网络       |
| **隐私**     | 100% 本地         | 服务器     |

---

## 🔧 模式切换

### 从 GitHub Pages 切换到后端

1. 部署带数据库的后端服务器
2. 从 GitHub Pages 导出数据（JSON）
3. 将数据导入后端数据库
4. 使用后端模式更新前端构建
5. 将前端部署到服务器

### 从后端切换到 GitHub Pages

1. 从后端导出数据
2. 转换为演示数据格式
3. 更新 `local.ts` 中的 `DEFAULT_GROUPS` 和 `DEFAULT_SITES`
4. 使用 GitHub Pages 模式构建
5. 部署到 GitHub Pages

---

## 💡 建议

### 使用 GitHub Pages 模式，如果：

- ✅ 仅个人使用
- ✅ 不需要多设备同步
- ✅ 想要零成本
- ✅ 偏好简单性
- ✅ 重视隐私

### 使用后端模式，如果：

- ✅ 需要多设备访问
- ✅ 想与他人共享
- ✅ 需要多用户支持
- ✅ 有服务器资源
- ✅ 需要数据持久化

---

**选择适合你的模式！🚀**
