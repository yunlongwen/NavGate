# Quick Start Guide | 快速开始指南

[English](#english) | [中文](#中文)

---

<a name="english"></a>

## English

## 🚀 Choose Your Storage Mode

NavGate offers **two storage options** for GitHub Pages deployment:

### Option 1: localStorage Mode (Default) ⚡

**Zero configuration, works immediately!**

```
✅ No setup needed
✅ Instant performance
❌ Single device only
❌ Data lost if browser cleared
```

**Best for**: Testing, single device usage

---

### Option 2: GitHub Gist Mode (Recommended) ⭐

**5-minute setup, cross-device sync!**

```
✅ Cross-device sync
✅ Version history
✅ Free (no server cost)
✅ Reliable (GitHub infrastructure)
⚠️ ~200-500ms latency
```

**Best for**: Personal use, multiple devices

---

## 🎯 Quick Setup: GitHub Gist Mode

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
4. Paste this content:

```json
{
  "groups": [],
  "sites": [],
  "config": {
    "SITE_TITLE": "AI Engineer Hub",
    "SITE_DESCRIPTION": "AI应用工程师的开发导航站"
  }
}
```

5. Click **"Create secret gist"**
6. Copy Gist ID from URL (e.g., `abc123def456...`)

### Step 3: Configure GitHub Secrets (2 min)

1. Go to your repo: **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Add two secrets:

**Secret 1:**

- Name: `VITE_GIST_ID`
- Value: `your_gist_id_here` (from Step 2)

**Secret 2:**

- Name: `VITE_GITHUB_TOKEN`
- Value: `ghp_your_token_here` (from Step 1)

### Step 4: Update Workflow (1 min)

Edit `.github/workflows/deploy-github-pages.yml`:

Find the Build step and change:

```yaml
# FROM (localStorage mode):
env:
  VITE_DEPLOY_MODE: github-pages

# TO (Gist mode):
env:
  VITE_DEPLOY_MODE: gist
  VITE_GIST_ID: ${{ secrets.VITE_GIST_ID }}
  VITE_GITHUB_TOKEN: ${{ secrets.VITE_GITHUB_TOKEN }}
```

### Step 5: Deploy (1 min)

```bash
git add .github/workflows/deploy-github-pages.yml
git commit -m "feat: enable Gist storage mode"
git push origin master
```

**Done!** 🎉 Your site will now sync across devices!

---

## 🔄 Switch Between Modes

### From localStorage to Gist

1. Export data from localStorage (click Export button)
2. Setup Gist mode (Steps 1-5 above)
3. After deployment, import data (click Import button)

### From Gist to localStorage

1. Export data from Gist (click Export button)
2. Change workflow back to `VITE_DEPLOY_MODE: github-pages`
3. Push and deploy
4. Import data in new deployment

---

## 📚 Full Documentation

- **[DEPLOYMENT_MODES.md](DEPLOYMENT_MODES.md)** - Complete mode comparison
- **[USER_GUIDE.md](USER_GUIDE.md)** - How to use NavGate
- **[README.md](README.md)** - Project overview

---

<a name="中文"></a>

## 中文

## 🚀 选择存储模式

NavGate 为 GitHub Pages 部署提供**两种存储选项**：

### 选项 1：localStorage 模式（默认）⚡

**零配置，立即可用！**

```
✅ 无需设置
✅ 即时性能
❌ 仅单设备
❌ 清除浏览器数据会丢失
```

**适合**：测试、单设备使用

---

### 选项 2：GitHub Gist 模式（推荐）⭐

**5 分钟设置，跨设备同步！**

```
✅ 跨设备同步
✅ 版本历史
✅ 免费（无服务器成本）
✅ 可靠（GitHub 基础设施）
⚠️ ~200-500ms 延迟
```

**适合**：个人使用、多设备访问

---

## 🎯 快速设置：GitHub Gist 模式

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
4. 粘贴以下内容：

```json
{
  "groups": [],
  "sites": [],
  "config": {
    "SITE_TITLE": "AI Engineer Hub",
    "SITE_DESCRIPTION": "AI应用工程师的开发导航站"
  }
}
```

5. 点击 **"Create secret gist"**
6. 从 URL 复制 Gist ID（例如：`abc123def456...`）

### 步骤 3：配置 GitHub Secrets（2 分钟）

1. 进入仓库：**Settings** → **Secrets and variables** → **Actions**
2. 点击 **"New repository secret"**
3. 添加两个密钥：

**密钥 1：**

- Name: `VITE_GIST_ID`
- Value: `your_gist_id_here`（来自步骤 2）

**密钥 2：**

- Name: `VITE_GITHUB_TOKEN`
- Value: `ghp_your_token_here`（来自步骤 1）

### 步骤 4：更新 Workflow（1 分钟）

编辑 `.github/workflows/deploy-github-pages.yml`：

找到 Build 步骤并修改：

```yaml
# 从（localStorage 模式）：
env:
  VITE_DEPLOY_MODE: github-pages

# 改为（Gist 模式）：
env:
  VITE_DEPLOY_MODE: gist
  VITE_GIST_ID: ${{ secrets.VITE_GIST_ID }}
  VITE_GITHUB_TOKEN: ${{ secrets.VITE_GITHUB_TOKEN }}
```

### 步骤 5：部署（1 分钟）

```bash
git add .github/workflows/deploy-github-pages.yml
git commit -m "feat: enable Gist storage mode"
git push origin master
```

**完成！** 🎉 你的网站现在可以跨设备同步了！

---

## 🔄 模式切换

### 从 localStorage 切换到 Gist

1. 从 localStorage 导出数据（点击导出按钮）
2. 按照上述步骤 1-5 设置 Gist 模式
3. 部署后，导入数据（点击导入按钮）

### 从 Gist 切换到 localStorage

1. 从 Gist 导出数据（点击导出按钮）
2. 将 workflow 改回 `VITE_DEPLOY_MODE: github-pages`
3. 推送并部署
4. 在新部署中导入数据

---

## 📚 完整文档

- **[DEPLOYMENT_MODES.md](DEPLOYMENT_MODES.md)** - 完整模式对比
- **[USER_GUIDE.md](USER_GUIDE.md)** - 使用指南
- **[README.md](README.md)** - 项目概览

---

## 💡 推荐配置

### 个人使用 → **Gist 模式** ⭐

**为什么？**

- ✅ 手机、电脑、平板都能访问
- ✅ 数据自动同步
- ✅ 有版本历史，可以回滚
- ✅ 完全免费
- ✅ 5 分钟搞定

### 团队使用 → **后端模式**

**为什么？**

- ✅ 多用户账号系统
- ✅ 权限管理
- ✅ 完全控制

---

**开始使用 NavGate！🎉**
