# Environment Variables Configuration Guide | 环境变量配置指南

[English](#english) | [中文](#中文)

---

<a name="english"></a>

## English

## 📍 Where to Configure Environment Variables

Environment variables are configured in **different locations** depending on your use case:

### 🎯 Configuration Locations Overview

| Scenario                | Configuration File                    | Purpose                    |
| ----------------------- | ------------------------------------- | -------------------------- |
| **Local Development**   | `apps/frontend/.env.local`            | Test locally before deploy |
| **GitHub Pages Deploy** | GitHub Repository Secrets             | Production deployment      |
| **Backend Server**      | `apps/server/.env`                    | Backend API configuration  |
| **Docker Deployment**   | `.env` (root) or `docker-compose.yml` | Container configuration    |

---

## 🚀 Configuration for Different Modes

### Mode 1: localStorage Mode (Default)

**No configuration needed!** ✅

Just deploy and it works.

---

### Mode 2: GitHub Gist Mode (Recommended) ⭐

#### For Local Development

**Location**: `apps/frontend/.env.local`

**Steps:**

1. Create file `apps/frontend/.env.local`:

```bash
# Navigate to frontend directory
cd apps/frontend

# Create .env.local file
cat > .env.local << 'EOF'
VITE_DEPLOY_MODE=gist
VITE_GIST_ID=your_gist_id_here
VITE_GITHUB_TOKEN=ghp_your_token_here
EOF
```

2. Replace with your actual values:
   - `your_gist_id_here` → Your Gist ID
   - `ghp_your_token_here` → Your GitHub Token

3. Start dev server:

```bash
pnpm dev
```

**⚠️ Important**: `.env.local` is in `.gitignore` - never commit it!

---

#### For GitHub Pages Deployment (Production)

**Location**: GitHub Repository Secrets

**Steps:**

1. **Go to your GitHub repository**
   - Navigate to: `https://github.com/YOUR_USERNAME/NavGate`

2. **Open Settings**
   - Click **Settings** tab
   - Click **Secrets and variables** → **Actions**

3. **Add Secrets** (Click "New repository secret" for each)

   **Secret 1:**

   ```
   Name: VITE_GIST_ID
   Value: abc123def456...  (your Gist ID)
   ```

   **Secret 2:**

   ```
   Name: VITE_GITHUB_TOKEN
   Value: ghp_xxxxxxxxxxxx  (your GitHub Token)
   ```

4. **Update Workflow File**

   Edit `.github/workflows/deploy-github-pages.yml`:

   ```yaml
   - name: Build
     run: pnpm --filter frontend build
     env:
       # Change from:
       # VITE_DEPLOY_MODE: github-pages

       # To:
       VITE_DEPLOY_MODE: gist
       VITE_GIST_ID: ${{ secrets.VITE_GIST_ID }}
       VITE_GITHUB_TOKEN: ${{ secrets.VITE_GITHUB_TOKEN }}
   ```

5. **Commit and Push**

   ```bash
   git add .github/workflows/deploy-github-pages.yml
   git commit -m "feat: enable Gist storage mode"
   git push origin master
   ```

**Done!** GitHub Actions will automatically deploy with Gist storage.

---

### Mode 3: Backend Mode

#### For Local Development

**Location**: `apps/frontend/.env.local` + `apps/server/.env`

**Frontend** (`apps/frontend/.env.local`):

```bash
VITE_DEPLOY_MODE=backend
VITE_API_BASE_URL=http://localhost:3000
```

**Backend** (`apps/server/.env`):

```bash
# Database
DATABASE_URL=mysql://root:password@localhost:3306/navgate

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this

# Authentication
AUTH_USERNAME=admin
AUTH_PASSWORD=$2b$10$hashed_password_here
```

**Generate hashed password:**

```bash
pnpm run hash-password
# Follow prompts to generate hashed password
```

---

## 📝 Environment Variables Reference

### Frontend Variables

| Variable            | Required For | Description                  | Example                           |
| ------------------- | ------------ | ---------------------------- | --------------------------------- |
| `VITE_DEPLOY_MODE`  | All modes    | Storage mode selection       | `github-pages`, `gist`, `backend` |
| `VITE_GIST_ID`      | Gist mode    | GitHub Gist ID               | `abc123def456...`                 |
| `VITE_GITHUB_TOKEN` | Gist mode    | GitHub Personal Access Token | `ghp_xxxxxxxxxxxx`                |
| `VITE_API_BASE_URL` | Backend mode | Backend API URL              | `http://localhost:3000`           |

### Backend Variables

| Variable        | Required | Description                 | Example                               |
| --------------- | -------- | --------------------------- | ------------------------------------- |
| `DATABASE_URL`  | Yes      | MySQL connection string     | `mysql://user:pass@host:3306/navgate` |
| `JWT_SECRET`    | Yes      | JWT signing secret          | `your-super-secret-key`               |
| `AUTH_USERNAME` | Yes      | Admin username              | `admin`                               |
| `AUTH_PASSWORD` | Yes      | Bcrypt hashed password      | `$2b$10$...`                          |
| `PORT`          | No       | Server port (default: 3000) | `3000`                                |
| `NODE_ENV`      | No       | Environment                 | `development`, `production`           |

---

## 🔒 Security Best Practices

### ✅ DO

1. **Use `.env.local` for local development**
   - Already in `.gitignore`
   - Safe to store sensitive data

2. **Use GitHub Secrets for production**
   - Encrypted by GitHub
   - Never exposed in logs

3. **Use strong secrets**
   - JWT_SECRET: At least 32 random characters
   - GitHub Token: Minimal permissions (only `gist`)

4. **Rotate tokens regularly**
   - Change tokens every 3-6 months
   - Revoke unused tokens

### ❌ DON'T

1. **Never commit `.env` files with secrets**
2. **Never hardcode tokens in code**
3. **Never share tokens publicly**
4. **Never grant unnecessary permissions**

---

## 🐛 Troubleshooting

### "Environment variable not found"

**Problem**: Variable not loaded

**Solutions:**

1. **Local dev**: Check `.env.local` exists and has correct format
2. **GitHub Pages**: Verify secrets are added in repository settings
3. **Restart dev server**: After changing `.env.local`, restart `pnpm dev`

### "Gist API returns 401 Unauthorized"

**Problem**: Invalid or expired token

**Solutions:**

1. Check token is correct (starts with `ghp_`)
2. Verify token has `gist` permission
3. Token might be expired - generate new one
4. Check token is added to GitHub Secrets correctly

### "Cannot find Gist"

**Problem**: Invalid Gist ID

**Solutions:**

1. Verify Gist ID is correct (from Gist URL)
2. Check Gist exists and is accessible
3. If secret gist, ensure token has access

---

## 📖 Quick Reference

### Local Development Setup

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

### GitHub Pages Deployment

```bash
# 1. Add secrets in GitHub repo settings
# Settings → Secrets and variables → Actions → New repository secret

# 2. Update workflow file
# Edit .github/workflows/deploy-github-pages.yml

# 3. Push to deploy
git push origin master
```

---

## 🔄 Switching Modes

### Switch to Gist Mode

**Local:**

```bash
# Edit apps/frontend/.env.local
VITE_DEPLOY_MODE=gist
VITE_GIST_ID=your_gist_id
VITE_GITHUB_TOKEN=ghp_your_token
```

**Production:**

1. Add GitHub Secrets (see above)
2. Update workflow file
3. Push to deploy

### Switch to localStorage Mode

**Local:**

```bash
# Edit apps/frontend/.env.local
VITE_DEPLOY_MODE=github-pages
# Remove or comment out GIST variables
```

**Production:**

```yaml
# Edit .github/workflows/deploy-github-pages.yml
env:
  VITE_DEPLOY_MODE: github-pages
  # Comment out GIST variables
```

---

<a name="中文"></a>

## 中文

## 📍 环境变量配置位置

环境变量根据**使用场景不同**，在**不同位置**配置：

### 🎯 配置位置总览

| 使用场景              | 配置文件                                | 用途          |
| --------------------- | --------------------------------------- | ------------- |
| **本地开发**          | `apps/frontend/.env.local`              | 本地测试      |
| **GitHub Pages 部署** | GitHub 仓库 Secrets                     | 生产环境部署  |
| **后端服务器**        | `apps/server/.env`                      | 后端 API 配置 |
| **Docker 部署**       | `.env`（根目录）或 `docker-compose.yml` | 容器配置      |

---

## 🚀 不同模式的配置方法

### 模式 1：localStorage 模式（默认）

**无需配置！** ✅

直接部署即可使用。

---

### 模式 2：GitHub Gist 模式（推荐）⭐

#### 本地开发配置

**配置位置**：`apps/frontend/.env.local`

**步骤：**

1. 创建文件 `apps/frontend/.env.local`：

```bash
# 进入前端目录
cd apps/frontend

# 创建 .env.local 文件
cat > .env.local << 'EOF'
VITE_DEPLOY_MODE=gist
VITE_GIST_ID=你的_gist_id
VITE_GITHUB_TOKEN=ghp_你的_token
EOF
```

2. 替换为你的实际值：
   - `你的_gist_id` → 你的 Gist ID
   - `ghp_你的_token` → 你的 GitHub Token

3. 启动开发服务器：

```bash
pnpm dev
```

**⚠️ 重要**：`.env.local` 已在 `.gitignore` 中 - 永远不要提交它！

---

#### GitHub Pages 部署配置（生产环境）

**配置位置**：GitHub 仓库 Secrets

**步骤：**

1. **进入 GitHub 仓库**
   - 访问：`https://github.com/YOUR_USERNAME/NavGate`

2. **打开设置**
   - 点击 **Settings** 标签
   - 点击 **Secrets and variables** → **Actions**

3. **添加密钥**（每个点击 "New repository secret"）

   **密钥 1：**

   ```
   Name: VITE_GIST_ID
   Value: abc123def456...  (你的 Gist ID)
   ```

   **密钥 2：**

   ```
   Name: VITE_GITHUB_TOKEN
   Value: ghp_xxxxxxxxxxxx  (你的 GitHub Token)
   ```

4. **更新 Workflow 文件**

   编辑 `.github/workflows/deploy-github-pages.yml`：

   ```yaml
   - name: Build
     run: pnpm --filter frontend build
     env:
       # 从这个改：
       # VITE_DEPLOY_MODE: github-pages

       # 改成这个：
       VITE_DEPLOY_MODE: gist
       VITE_GIST_ID: ${{ secrets.VITE_GIST_ID }}
       VITE_GITHUB_TOKEN: ${{ secrets.VITE_GITHUB_TOKEN }}
   ```

5. **提交并推送**

   ```bash
   git add .github/workflows/deploy-github-pages.yml
   git commit -m "feat: 启用 Gist 存储模式"
   git push origin master
   ```

**完成！** GitHub Actions 将自动使用 Gist 存储部署。

---

### 模式 3：后端模式

#### 本地开发配置

**配置位置**：`apps/frontend/.env.local` + `apps/server/.env`

**前端** (`apps/frontend/.env.local`)：

```bash
VITE_DEPLOY_MODE=backend
VITE_API_BASE_URL=http://localhost:3000
```

**后端** (`apps/server/.env`)：

```bash
# 数据库
DATABASE_URL=mysql://root:password@localhost:3306/navgate

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this

# 认证
AUTH_USERNAME=admin
AUTH_PASSWORD=$2b$10$hashed_password_here
```

**生成加密密码：**

```bash
pnpm run hash-password
# 按提示生成加密密码
```

---

## 📝 环境变量参考

### 前端变量

| 变量名              | 必需模式  | 说明                         | 示例值                            |
| ------------------- | --------- | ---------------------------- | --------------------------------- |
| `VITE_DEPLOY_MODE`  | 所有模式  | 存储模式选择                 | `github-pages`, `gist`, `backend` |
| `VITE_GIST_ID`      | Gist 模式 | GitHub Gist ID               | `abc123def456...`                 |
| `VITE_GITHUB_TOKEN` | Gist 模式 | GitHub Personal Access Token | `ghp_xxxxxxxxxxxx`                |
| `VITE_API_BASE_URL` | 后端模式  | 后端 API 地址                | `http://localhost:3000`           |

### 后端变量

| 变量名          | 必需 | 说明                     | 示例值                                |
| --------------- | ---- | ------------------------ | ------------------------------------- |
| `DATABASE_URL`  | 是   | MySQL 连接字符串         | `mysql://user:pass@host:3306/navgate` |
| `JWT_SECRET`    | 是   | JWT 签名密钥             | `your-super-secret-key`               |
| `AUTH_USERNAME` | 是   | 管理员用户名             | `admin`                               |
| `AUTH_PASSWORD` | 是   | Bcrypt 加密的密码        | `$2b$10$...`                          |
| `PORT`          | 否   | 服务器端口（默认：3000） | `3000`                                |
| `NODE_ENV`      | 否   | 运行环境                 | `development`, `production`           |

---

## 🔒 安全最佳实践

### ✅ 应该做的

1. **本地开发使用 `.env.local`**
   - 已在 `.gitignore` 中
   - 可安全存储敏感数据

2. **生产环境使用 GitHub Secrets**
   - GitHub 加密存储
   - 不会在日志中暴露

3. **使用强密钥**
   - JWT_SECRET：至少 32 个随机字符
   - GitHub Token：最小权限（仅 `gist`）

4. **定期轮换 token**
   - 每 3-6 个月更换一次
   - 撤销不用的 token

### ❌ 不应该做的

1. **永远不要提交包含密钥的 `.env` 文件**
2. **永远不要在代码中硬编码 token**
3. **永远不要公开分享 token**
4. **永远不要授予不必要的权限**

---

## 🛠️ 实际操作示例

### 示例 1：配置 Gist 模式（本地开发）

```bash
# 1. 进入前端目录
cd /Users/wenyunlong/github/NavGate/apps/frontend

# 2. 创建 .env.local 文件
cat > .env.local << 'EOF'
VITE_DEPLOY_MODE=gist
VITE_GIST_ID=abc123def456789
VITE_GITHUB_TOKEN=ghp_1234567890abcdefghijklmnopqrstuvwxyz
EOF

# 3. 验证文件创建成功
cat .env.local

# 4. 启动开发服务器
pnpm dev
```

### 示例 2：配置 GitHub Secrets（生产环境）

**通过 GitHub 网页界面：**

1. 访问：`https://github.com/yunlongwen/NavGate/settings/secrets/actions`
2. 点击 **"New repository secret"**
3. 添加第一个密钥：
   - Name: `VITE_GIST_ID`
   - Value: `abc123def456789`
   - 点击 **"Add secret"**
4. 添加第二个密钥：
   - Name: `VITE_GITHUB_TOKEN`
   - Value: `ghp_1234567890abcdefghijklmnopqrstuvwxyz`
   - 点击 **"Add secret"**

**通过 GitHub CLI（可选）：**

```bash
# 安装 gh CLI: https://cli.github.com/

# 添加密钥
gh secret set VITE_GIST_ID --body "abc123def456789"
gh secret set VITE_GITHUB_TOKEN --body "ghp_your_token_here"

# 查看已配置的密钥
gh secret list
```

---

## 🐛 故障排除

### "环境变量未找到"

**问题**：变量未加载

**解决方案：**

1. **本地开发**：检查 `.env.local` 是否存在且格式正确
2. **GitHub Pages**：验证 Secrets 已在仓库设置中添加
3. **重启开发服务器**：修改 `.env.local` 后，重启 `pnpm dev`

### "Gist API 返回 401 Unauthorized"

**问题**：Token 无效或过期

**解决方案：**

1. 检查 token 是否正确（以 `ghp_` 开头）
2. 验证 token 有 `gist` 权限
3. Token 可能已过期 - 生成新的
4. 检查 token 是否正确添加到 GitHub Secrets

### "找不到 Gist"

**问题**：Gist ID 无效

**解决方案：**

1. 验证 Gist ID 正确（从 Gist URL 获取）
2. 检查 Gist 是否存在且可访问
3. 如果是 secret gist，确保 token 有访问权限

---

## 📖 快速参考

### 本地开发设置

```bash
# 1. 在 apps/frontend/ 创建 .env.local
cd apps/frontend
touch .env.local

# 2. 添加配置
echo "VITE_DEPLOY_MODE=gist" >> .env.local
echo "VITE_GIST_ID=你的_gist_id" >> .env.local
echo "VITE_GITHUB_TOKEN=ghp_你的_token" >> .env.local

# 3. 启动开发服务器
pnpm dev
```

### GitHub Pages 部署

```bash
# 1. 在 GitHub 仓库设置中添加 Secrets
# Settings → Secrets and variables → Actions → New repository secret

# 2. 更新 workflow 文件
# 编辑 .github/workflows/deploy-github-pages.yml

# 3. 推送部署
git push origin master
```

---

## 🔄 模式切换

### 切换到 Gist 模式

**本地：**

```bash
# 编辑 apps/frontend/.env.local
VITE_DEPLOY_MODE=gist
VITE_GIST_ID=你的_gist_id
VITE_GITHUB_TOKEN=ghp_你的_token
```

**生产：**

1. 添加 GitHub Secrets（见上文）
2. 更新 workflow 文件
3. 推送部署

### 切换到 localStorage 模式

**本地：**

```bash
# 编辑 apps/frontend/.env.local
VITE_DEPLOY_MODE=github-pages
# 移除或注释掉 GIST 变量
```

**生产：**

```yaml
# 编辑 .github/workflows/deploy-github-pages.yml
env:
  VITE_DEPLOY_MODE: github-pages
  # 注释掉 GIST 变量
```

---

## 📂 文件结构示例

```
NavGate/
├── .env.example              # 环境变量示例（可提交）
├── .gitignore                # 忽略 .env.local（已配置）
├── apps/
│   ├── frontend/
│   │   ├── .env.local        # 前端本地配置（不提交）❌
│   │   └── src/
│   └── server/
│       └── .env              # 后端配置（不提交）❌
└── .github/
    └── workflows/
        └── deploy-github-pages.yml  # 使用 GitHub Secrets
```

---

## 💡 推荐配置

### 个人使用 → Gist 模式 ⭐

**本地开发：**

创建 `apps/frontend/.env.local`：

```bash
VITE_DEPLOY_MODE=gist
VITE_GIST_ID=你的_gist_id
VITE_GITHUB_TOKEN=ghp_你的_token
```

**生产部署：**

在 GitHub 仓库添加 Secrets：

- `VITE_GIST_ID`
- `VITE_GITHUB_TOKEN`

### 团队使用 → 后端模式

需要配置数据库和后端服务器。

---

## 📚 相关文档

- **[QUICK_START.md](QUICK_START.md)** - 5 分钟快速开始
- **[DEPLOYMENT_MODES.md](DEPLOYMENT_MODES.md)** - 模式详细对比
- **[ENV_SETUP.md](ENV_SETUP.md)** - 完整环境设置

---

**开始配置你的 NavGate！** 🚀
