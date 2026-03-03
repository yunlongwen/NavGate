# Deployment Modes | 部署模式说明

[English](#english) | [中文](#中文)

---

<a name="english"></a>

## English

## 🚀 Quick Start (5 Minutes)

**Want to get started quickly?** Follow these steps to set up **GitHub Gist Mode** (recommended):

### Step 1: Create GitHub Token (2 min)

1. Visit: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Name: `NavGate Gist Storage`
4. Check **`gist`** scope only
5. Click **"Generate token"**
6. Copy token (starts with `ghp_`)

### Step 2: Create Gist (1 min)

1. Visit: https://gist.github.com/
2. Click **"Create new gist"**
3. Filename: `navgate-data.json`
4. Paste initial data (see `gist-data.json` in repo, or use empty template below)
5. Click **"Create secret gist"**
6. Copy Gist ID from URL (e.g., `abc123def456...`)

**Empty template:**

```json
{
  "groups": [],
  "sites": [],
  "config": {
    "SITE_TITLE": "Agently",
    "SITE_DESCRIPTION": "个人导航"
  }
}
```

### Step 3: Configure GitHub Secrets (1 min)

1. Go to your repo: **Settings** → **Secrets and variables** → **Actions**
2. Add two secrets:
   - Name: `VITE_GIST_ID`, Value: `[your_gist_id]`
   - Name: `VITE_GITHUB_TOKEN`, Value: `[your_token]`

### Step 4: Update Workflow (1 min)

Edit `.github/workflows/deploy-github-pages.yml`, find the Build step and uncomment Gist mode:

```yaml
env:
  # VITE_DEPLOY_MODE: github-pages  # Comment this
  VITE_DEPLOY_MODE: gist # Uncomment this
  VITE_GIST_ID: ${{ secrets.VITE_GIST_ID }}
  VITE_GITHUB_TOKEN: ${{ secrets.VITE_GITHUB_TOKEN }}
```

### Step 5: Deploy

```bash
git add .github/workflows/deploy-github-pages.yml
git commit -m "feat: enable Gist storage mode"
git push origin master
```

**Done!** 🎉 Your site will now sync across devices!

---

## 📦 Deployment Modes Overview

NavGate supports **three deployment modes** with different data storage approaches:

1. **localStorage Mode** - Pure frontend, data in browser (default)
2. **GitHub Gist Mode** - Pure frontend, data synced via GitHub Gist (recommended)
3. **Backend Mode** - Full stack with database

---

## 🎯 Quick Comparison

| Feature              | localStorage | **Gist** ⭐  | Backend      |
| -------------------- | ------------ | ------------ | ------------ |
| **Cross-device**     | ❌           | ✅           | ✅           |
| **Setup Time**       | 0 min        | **5 min**    | 30+ min      |
| **Cost**             | Free         | **Free**     | Server cost  |
| **Data Persistence** | Browser only | **GitHub**   | Database     |
| **Version History**  | ❌           | ✅           | Depends      |
| **Multi-user**       | ❌           | ❌           | ✅           |
| **Performance**      | Instant      | ~200-500ms   | Varies       |
| **Recommended For**  | Testing      | **Personal** | Team/Company |

---

## 📦 Detailed Mode Descriptions

NavGate supports three deployment modes with different data storage and management approaches:

### 🌐 Mode 1: localStorage Mode (Pure Frontend - Default)

**Simple but Limited**: Data stored only in your browser

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
VITE_DEPLOY_MODE=github-pages  # or leave empty (default)
```

#### Quick Setup

No setup needed! Just deploy to GitHub Pages and it works.

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

### ⭐ Mode 2: GitHub Gist Mode (Pure Frontend - Recommended)

**Best of Both Worlds**: Cross-device sync without a backend server!

#### How it Works

```
User Browser
    ↓
React App
    ↓
GitHub Gist API
    ↓
Your Gist (JSON file)
```

#### Data Flow

1. **Initial Load**: Frontend fetches data from your GitHub Gist
2. **Data Storage**: All data stored in a single Gist file (`navgate-data.json`)
3. **Data Operations**: All CRUD operations update the Gist via GitHub API
4. **Caching**: 5-second cache to reduce API calls

#### Environment Variables

```bash
VITE_DEPLOY_MODE=gist
VITE_GIST_ID=your_gist_id_here
VITE_GITHUB_TOKEN=ghp_your_token_here
```

#### Setup Steps (5 minutes)

**Step 1: Create GitHub Personal Access Token**

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Name: "NavGate Gist Storage"
4. Scope: Check **`gist`** only
5. Click **"Generate token"**
6. Copy the token (starts with `ghp_`)

**Step 2: Create a Gist**

1. Go to: https://gist.github.com/
2. Click **"Create new gist"**
3. Filename: `navgate-data.json`
4. Content:

```json
{
  "groups": [],
  "sites": [],
  "config": {
    "SITE_TITLE": "Agently",
    "SITE_DESCRIPTION": "个人导航"
  }
}
```

5. Click **"Create secret gist"** (recommended)
6. Copy Gist ID from URL (the hash after your username)

**Step 3: Configure GitHub Secrets**

1. Go to your repo: `Settings` → `Secrets and variables` → `Actions`
2. Add secrets:
   - `VITE_GIST_ID`: your gist ID
   - `VITE_GITHUB_TOKEN`: your token

**Step 4: Update GitHub Actions**

Edit `.github/workflows/deploy-github-pages.yml`:

```yaml
- name: Build
  run: pnpm --filter frontend build
  env:
    VITE_DEPLOY_MODE: gist
    VITE_GIST_ID: ${{ secrets.VITE_GIST_ID }}
    VITE_GITHUB_TOKEN: ${{ secrets.VITE_GITHUB_TOKEN }}
```

**Step 5: Push and Deploy**

```bash
git push origin master
# GitHub Actions will automatically deploy with Gist storage
```

#### API Implementation

Uses: `apps/frontend/src/api/gist.ts`

```typescript
// Read from Gist
const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
  headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
})
const data = JSON.parse(gist.files['navgate-data.json'].content)

// Write to Gist
await fetch(`https://api.github.com/gists/${GIST_ID}`, {
  method: 'PATCH',
  headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
  body: JSON.stringify({
    files: { 'navgate-data.json': { content: JSON.stringify(newData) } },
  }),
})
```

#### Advantages

- ✅ **Cross-device Sync**: Access from any browser
- ✅ **Free**: No server costs
- ✅ **Version History**: GitHub keeps all versions
- ✅ **Reliable**: GitHub's infrastructure
- ✅ **Simple**: 5-minute setup
- ✅ **Secure**: Token-based authentication

#### Limitations

- ⚠️ **Network Latency**: ~200-500ms per request
- ⚠️ **Rate Limits**: 5,000 requests/hour (usually sufficient)
- ⚠️ **Single User**: No multi-user support
- ⚠️ **Concurrent Writes**: Last write wins (no conflict resolution)

#### Security Best Practices

1. **Use Secret Gists**: For private data
2. **Minimal Permissions**: Only grant `gist` scope
3. **Never Commit Tokens**: Use GitHub Secrets
4. **Rotate Tokens**: Periodically update
5. **Revoke if Leaked**: Immediately revoke compromised tokens

---

### 🖥️ Mode 3: Backend Mode (Full Stack)

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

| Feature              | localStorage Mode | **Gist Mode** ⭐ | Backend Mode |
| -------------------- | ----------------- | ---------------- | ------------ |
| **Cost**             | Free              | **Free**         | Server cost  |
| **Setup Difficulty** | None              | **5 min**        | Complex      |
| **Data Storage**     | Browser           | **GitHub Gist**  | MySQL        |
| **Multi-Device**     | ❌                | ✅               | ✅           |
| **Data Sync**        | ❌                | ✅               | ✅           |
| **Multi-User**       | ❌                | ❌               | ✅           |
| **Authentication**   | ❌                | Token            | ✅ JWT       |
| **Data Backup**      | Manual export     | **Auto version** | Database     |
| **Performance**      | Instant           | ~200-500ms       | Network      |
| **Privacy**          | 100% local        | GitHub           | Server       |
| **Version History**  | ❌                | ✅               | Depends      |
| **Rate Limits**      | None              | 5k/hour          | Self-hosted  |

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

### Use localStorage Mode If:

- ✅ Just testing/trying out
- ✅ Don't need data sync
- ✅ Single device usage
- ✅ Maximum privacy

### Use Gist Mode If: ⭐ **RECOMMENDED**

- ✅ Personal use
- ✅ Need multi-device sync
- ✅ Want zero server cost
- ✅ Value simplicity + sync
- ✅ Want version history

### Use Backend Mode If:

- ✅ Team/company use
- ✅ Need multi-user support
- ✅ Need custom features
- ✅ Have server resources
- ✅ Need full control

---

<a name="中文"></a>

## 中文

## 🚀 快速开始（5 分钟）

**想要快速开始？** 按照以下步骤设置 **GitHub Gist 模式**（推荐）：

### 步骤 1：创建 GitHub Token（2 分钟）

1. 访问：https://github.com/settings/tokens
2. 点击 **"Generate new token (classic)"**
3. 名称：`NavGate Gist Storage`
4. 仅勾选 **`gist`** 权限
5. 点击 **"Generate token"**
6. 复制 token（以 `ghp_` 开头）

### 步骤 2：创建 Gist（1 分钟）

1. 访问：https://gist.github.com/
2. 点击 **"Create new gist"**
3. 文件名：`navgate-data.json`
4. 粘贴初始数据（参见仓库中的 `gist-data.json`，或使用下方空模板）
5. 点击 **"Create secret gist"**
6. 从 URL 复制 Gist ID（例如：`abc123def456...`）

**空模板：**

```json
{
  "groups": [],
  "sites": [],
  "config": {
    "SITE_TITLE": "Agently",
    "SITE_DESCRIPTION": "个人导航"
  }
}
```

### 步骤 3：配置 GitHub Secrets（1 分钟）

1. 进入仓库：**Settings** → **Secrets and variables** → **Actions**
2. 添加两个密钥：
   - Name: `VITE_GIST_ID`，Value: `[你的_gist_id]`
   - Name: `VITE_GITHUB_TOKEN`，Value: `[你的_token]`

### 步骤 4：更新 Workflow（1 分钟）

编辑 `.github/workflows/deploy-github-pages.yml`，找到 Build 步骤并取消注释 Gist 模式：

```yaml
env:
  # VITE_DEPLOY_MODE: github-pages  # 注释掉这行
  VITE_DEPLOY_MODE: gist # 取消注释这行
  VITE_GIST_ID: ${{ secrets.VITE_GIST_ID }}
  VITE_GITHUB_TOKEN: ${{ secrets.VITE_GITHUB_TOKEN }}
```

### 步骤 5：部署

```bash
git add .github/workflows/deploy-github-pages.yml
git commit -m "feat: 启用 Gist 存储模式"
git push origin master
```

**完成！** 🎉 你的网站现在可以跨设备同步了！

---

## 📦 部署模式概览

NavGate 支持**三种部署模式**，具有不同的数据存储方式：

1. **localStorage 模式** - 纯前端，数据在浏览器（默认）
2. **GitHub Gist 模式** - 纯前端，通过 GitHub Gist 同步数据（推荐）
3. **后端模式** - 全栈，使用数据库

---

## 🎯 快速对比

| 功能           | localStorage | **Gist** ⭐  | 后端模式   |
| -------------- | ------------ | ------------ | ---------- |
| **跨设备**     | ❌           | ✅           | ✅         |
| **设置时间**   | 0 分钟       | **5 分钟**   | 30+ 分钟   |
| **成本**       | 免费         | **免费**     | 服务器成本 |
| **数据持久化** | 仅浏览器     | **GitHub**   | 数据库     |
| **版本历史**   | ❌           | ✅           | 取决于实现 |
| **多用户**     | ❌           | ❌           | ✅         |
| **性能**       | 即时         | ~200-500ms   | 不定       |
| **推荐用途**   | 测试         | **个人使用** | 团队/企业  |

---

## 📦 详细模式说明

NavGate 支持三种部署模式，具有不同的数据存储和管理方式：

### 🌐 模式 1：localStorage 模式（纯前端 - 默认）

**简单但有限**：数据仅存储在浏览器中

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
VITE_DEPLOY_MODE=github-pages  # 或留空（默认）
```

#### 快速设置

无需设置！直接部署到 GitHub Pages 即可使用。

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

### ⭐ 模式 2：GitHub Gist 模式（纯前端 - 推荐）

**两全其美**：无需后端服务器即可跨设备同步！

#### 工作原理

```
用户浏览器
    ↓
React 应用
    ↓
GitHub Gist API
    ↓
你的 Gist（JSON 文件）
```

#### 数据流程

1. **初始加载**：前端从你的 GitHub Gist 获取数据
2. **数据存储**：所有数据存储在单个 Gist 文件（`navgate-data.json`）
3. **数据操作**：所有 CRUD 操作通过 GitHub API 更新 Gist
4. **缓存机制**：5 秒缓存以减少 API 调用

#### 环境变量

```bash
VITE_DEPLOY_MODE=gist
VITE_GIST_ID=your_gist_id_here
VITE_GITHUB_TOKEN=ghp_your_token_here
```

#### 设置步骤（5 分钟）

**步骤 1：创建 GitHub Personal Access Token**

1. 访问：https://github.com/settings/tokens
2. 点击 **"Generate new token (classic)"**
3. 名称："NavGate Gist Storage"
4. 权限：仅勾选 **`gist`**
5. 点击 **"Generate token"**
6. 复制 token（以 `ghp_` 开头）

**步骤 2：创建 Gist**

1. 访问：https://gist.github.com/
2. 点击 **"Create new gist"**
3. 文件名：`navgate-data.json`
4. 内容：

```json
{
  "groups": [],
  "sites": [],
  "config": {
    "SITE_TITLE": "Agently",
    "SITE_DESCRIPTION": "个人导航"
  }
}
```

5. 点击 **"Create secret gist"**（推荐）
6. 从 URL 复制 Gist ID（用户名后的哈希值）

**步骤 3：配置 GitHub Secrets**

1. 进入仓库：`Settings` → `Secrets and variables` → `Actions`
2. 添加密钥：
   - `VITE_GIST_ID`：你的 gist ID
   - `VITE_GITHUB_TOKEN`：你的 token

**步骤 4：更新 GitHub Actions**

编辑 `.github/workflows/deploy-github-pages.yml`：

```yaml
- name: Build
  run: pnpm --filter frontend build
  env:
    VITE_DEPLOY_MODE: gist
    VITE_GIST_ID: ${{ secrets.VITE_GIST_ID }}
    VITE_GITHUB_TOKEN: ${{ secrets.VITE_GITHUB_TOKEN }}
```

**步骤 5：推送并部署**

```bash
git push origin master
# GitHub Actions 将自动使用 Gist 存储部署
```

#### API 实现

使用：`apps/frontend/src/api/gist.ts`

```typescript
// 从 Gist 读取
const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
  headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
})
const data = JSON.parse(gist.files['navgate-data.json'].content)

// 写入 Gist
await fetch(`https://api.github.com/gists/${GIST_ID}`, {
  method: 'PATCH',
  headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
  body: JSON.stringify({
    files: { 'navgate-data.json': { content: JSON.stringify(newData) } },
  }),
})
```

#### 优势

- ✅ **跨设备同步**：从任何浏览器访问
- ✅ **免费**：无服务器成本
- ✅ **版本历史**：GitHub 保留所有版本
- ✅ **可靠**：GitHub 基础设施
- ✅ **简单**：5 分钟设置
- ✅ **安全**：基于 Token 的身份验证

#### 限制

- ⚠️ **网络延迟**：每次请求约 200-500ms
- ⚠️ **速率限制**：5,000 次请求/小时（通常足够）
- ⚠️ **单用户**：不支持多用户
- ⚠️ **并发写入**：最后写入获胜（无冲突解决）

#### 安全最佳实践

1. **使用 Secret Gist**：存储私密数据
2. **最小权限**：只授予 `gist` 权限
3. **永不提交 Token**：使用 GitHub Secrets
4. **定期轮换**：定期更新 Token
5. **泄露立即撤销**：如果 Token 泄露，立即撤销

---

### 🖥️ 模式 3：后端模式（全栈）

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

### 使用 localStorage 模式，如果：

- ✅ 仅测试/试用
- ✅ 不需要数据同步
- ✅ 单设备使用
- ✅ 最大化隐私

### 使用 Gist 模式，如果：⭐ **推荐**

- ✅ 个人使用
- ✅ 需要多设备同步
- ✅ 想要零服务器成本
- ✅ 重视简单性 + 同步
- ✅ 想要版本历史

### 使用后端模式，如果：

- ✅ 团队/企业使用
- ✅ 需要多用户支持
- ✅ 需要自定义功能
- ✅ 有服务器资源
- ✅ 需要完全控制

---

## 📝 Environment Variables Reference | 环境变量参考

### Frontend Variables | 前端变量

| Variable            | Required For | Description                  | Example                           |
| ------------------- | ------------ | ---------------------------- | --------------------------------- |
| `VITE_DEPLOY_MODE`  | All modes    | Storage mode selection       | `github-pages`, `gist`, `backend` |
| `VITE_GIST_ID`      | Gist mode    | GitHub Gist ID               | `abc123def456...`                 |
| `VITE_GITHUB_TOKEN` | Gist mode    | GitHub Personal Access Token | `ghp_xxxxxxxxxxxx`                |
| `VITE_API_BASE_URL` | Backend mode | Backend API URL              | `http://localhost:3000`           |

### Backend Variables | 后端变量

| Variable        | Required | Description                 | Example                               |
| --------------- | -------- | --------------------------- | ------------------------------------- |
| `DATABASE_URL`  | Yes      | MySQL connection string     | `mysql://user:pass@host:3306/navgate` |
| `JWT_SECRET`    | Yes      | JWT signing secret          | `your-super-secret-key`               |
| `AUTH_USERNAME` | Yes      | Admin username              | `admin`                               |
| `AUTH_PASSWORD` | Yes      | Bcrypt hashed password      | `$2b$10$...`                          |
| `PORT`          | No       | Server port (default: 3000) | `3000`                                |
| `NODE_ENV`      | No       | Environment                 | `development`, `production`           |

---

## 🔒 Security Best Practices | 安全最佳实践

### ✅ DO | 应该做的

1. **Use `.env.local` for local development**  
   **本地开发使用 `.env.local`**
   - Already in `.gitignore` / 已在 `.gitignore` 中
   - Safe to store sensitive data / 可安全存储敏感数据

2. **Use GitHub Secrets for production**  
   **生产环境使用 GitHub Secrets**
   - Encrypted by GitHub / GitHub 加密存储
   - Never exposed in logs / 不会在日志中暴露

3. **Use strong secrets**  
   **使用强密钥**
   - JWT_SECRET: At least 32 random characters / 至少 32 个随机字符
   - GitHub Token: Minimal permissions (only `gist`) / 最小权限（仅 `gist`）

4. **Rotate tokens regularly**  
   **定期轮换 token**
   - Change tokens every 3-6 months / 每 3-6 个月更换一次
   - Revoke unused tokens / 撤销不用的 token

### ❌ DON'T | 不应该做的

1. **Never commit `.env` files with secrets**  
   **永远不要提交包含密钥的 `.env` 文件**

2. **Never hardcode tokens in code**  
   **永远不要在代码中硬编码 token**

3. **Never share tokens publicly**  
   **永远不要公开分享 token**

4. **Never grant unnecessary permissions**  
   **永远不要授予不必要的权限**

---

## 🐛 Troubleshooting | 故障排除

### "Environment variable not found" | "环境变量未找到"

**Problem | 问题**: Variable not loaded / 变量未加载

**Solutions | 解决方案:**

1. **Local dev | 本地开发**: Check `.env.local` exists and has correct format / 检查 `.env.local` 是否存在且格式正确
2. **GitHub Pages**: Verify secrets are added in repository settings / 验证 Secrets 已在仓库设置中添加
3. **Restart dev server | 重启开发服务器**: After changing `.env.local`, restart `pnpm dev` / 修改 `.env.local` 后，重启 `pnpm dev`

### "Gist API returns 401 Unauthorized" | "Gist API 返回 401 未授权"

**Problem | 问题**: Invalid or expired token / Token 无效或过期

**Solutions | 解决方案:**

1. Check token is correct (starts with `ghp_`) / 检查 token 是否正确（以 `ghp_` 开头）
2. Verify token has `gist` permission / 验证 token 有 `gist` 权限
3. Token might be expired - generate new one / Token 可能已过期 - 生成新的
4. Check token is added to GitHub Secrets correctly / 检查 token 是否正确添加到 GitHub Secrets

### "Cannot find Gist" | "找不到 Gist"

**Problem | 问题**: Invalid Gist ID / Gist ID 无效

**Solutions | 解决方案:**

1. Verify Gist ID is correct (from Gist URL) / 验证 Gist ID 正确（从 Gist URL 获取）
2. Check Gist exists and is accessible / 检查 Gist 是否存在且可访问
3. If secret gist, ensure token has access / 如果是 secret gist，确保 token 有访问权限

### "Build fails on GitHub Actions" | "GitHub Actions 构建失败"

**Problem | 问题**: Missing secrets or incorrect configuration / 缺少 secrets 或配置错误

**Solutions | 解决方案:**

1. Verify both `VITE_GIST_ID` and `VITE_GITHUB_TOKEN` are added to GitHub Secrets / 验证 `VITE_GIST_ID` 和 `VITE_GITHUB_TOKEN` 都已添加到 GitHub Secrets
2. Check workflow file has correct environment variables / 检查 workflow 文件有正确的环境变量
3. Ensure secrets are not expired / 确保 secrets 未过期
4. Check GitHub Actions logs for specific error messages / 查看 GitHub Actions 日志获取具体错误信息

---

## 📖 Quick Reference | 快速参考

### Local Development Setup | 本地开发设置

```bash
# 1. Create .env.local in apps/frontend/
cd apps/frontend
touch .env.local

# 2. Add your configuration
echo "VITE_DEPLOY_MODE=gist" >> .env.local
echo "VITE_GIST_ID=your_gist_id" >> .env.local
echo "VITE_GITHUB_TOKEN=ghp_your_token" >> .env.local

# 3. Start dev server
pnpm dev
```

### GitHub Pages Deployment | GitHub Pages 部署

```bash
# 1. Add secrets in GitHub repo settings
# Settings → Secrets and variables → Actions → New repository secret

# 2. Update workflow file
# Edit .github/workflows/deploy-github-pages.yml

# 3. Push to deploy
git push origin master
```

### Verify Configuration | 验证配置

```bash
# Check .gitignore includes .env.local
grep "\.env\.local" .gitignore
# Output: .env.local ✅

# Verify .env.local won't be committed
git status
# .env.local should not appear in the list ✅
```

---

**选择适合你的模式！🚀**
