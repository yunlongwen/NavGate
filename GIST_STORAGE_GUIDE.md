# GitHub Gist Storage Guide | Gist 存储模式指南

[English](#english) | [中文](#中文)

---

<a name="english"></a>

## English

## 🎯 What is Gist Storage Mode?

Gist Storage Mode uses **GitHub Gist** as a data storage backend, providing a middle ground between pure localStorage and a full backend:

- ✅ **Cross-device sync**: Access your data from any browser
- ✅ **Version history**: GitHub Gist keeps all versions
- ✅ **Free**: No server costs
- ✅ **Reliable**: Backed by GitHub's infrastructure
- ✅ **Simple**: No database setup required

---

## 📋 Setup Steps

### Step 1: Create a GitHub Personal Access Token

1. Go to GitHub Settings: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Set token name: e.g., "NavGate Gist Storage"
4. Select scopes: **Check `gist`** (only this permission needed)
5. Click **"Generate token"**
6. **Important**: Copy the token immediately (you won't see it again!)

Example token: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Step 2: Create a Gist for Data Storage

1. Go to: https://gist.github.com/
2. Click **"Create new gist"**
3. Set filename: `navgate-data.json`
4. Add initial content:

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

5. Choose:
   - **Create public gist**: Anyone can view (read-only)
   - **Create secret gist**: Only you can access (recommended)
6. Click **"Create secret gist"** or **"Create public gist"**
7. Copy the Gist ID from URL

Example URL: `https://gist.github.com/username/abc123def456...`
Gist ID: `abc123def456...` (the hash after your username)

### Step 3: Configure Environment Variables

Create `.env.local` file in `apps/frontend/`:

```bash
# Gist Storage Mode
VITE_DEPLOY_MODE=gist
VITE_GIST_ID=your_gist_id_here
VITE_GITHUB_TOKEN=ghp_your_token_here
```

**Security Note**: Never commit `.env.local` to Git! It's already in `.gitignore`.

### Step 4: Build and Deploy

**For Local Development:**

```bash
cd apps/frontend
pnpm dev
```

**For GitHub Pages Deployment:**

You need to add secrets to your GitHub repository:

1. Go to your repository: `Settings` → `Secrets and variables` → `Actions`
2. Click **"New repository secret"**
3. Add two secrets:
   - Name: `VITE_GIST_ID`, Value: your gist ID
   - Name: `VITE_GITHUB_TOKEN`, Value: your token

4. Update `.github/workflows/deploy-github-pages.yml`:

```yaml
- name: Build
  run: pnpm --filter frontend build
  env:
    VITE_DEPLOY_MODE: gist
    VITE_GIST_ID: ${{ secrets.VITE_GIST_ID }}
    VITE_GITHUB_TOKEN: ${{ secrets.VITE_GITHUB_TOKEN }}
```

5. Push to GitHub to trigger deployment

---

## 🔄 How It Works

### Data Flow

```
User Browser
    ↓
React App
    ↓
GitHub Gist API
    ↓
Your Gist (JSON file)
```

### Read Operation

```typescript
// Fetch data from Gist
GET https://api.github.com/gists/{GIST_ID}
Authorization: Bearer {GITHUB_TOKEN}

// Parse navgate-data.json content
const data = JSON.parse(gist.files['navgate-data.json'].content)
```

### Write Operation

```typescript
// Update Gist with new data
PATCH https://api.github.com/gists/{GIST_ID}
Authorization: Bearer {GITHUB_TOKEN}
Body: {
  files: {
    'navgate-data.json': {
      content: JSON.stringify(newData)
    }
  }
}
```

### Caching

- Data is cached for 5 seconds to reduce API calls
- Each write updates the cache immediately
- GitHub API rate limit: 5,000 requests/hour (authenticated)

---

## ⚡ Performance Considerations

### Advantages

- ✅ **Fast reads**: Cached for 5 seconds
- ✅ **Reliable**: GitHub's CDN and infrastructure
- ✅ **Version history**: Can rollback if needed

### Limitations

- ⚠️ **Network latency**: ~200-500ms per request
- ⚠️ **Rate limits**: 5,000 requests/hour (usually sufficient)
- ⚠️ **File size**: Gist files limited to 10MB (plenty for navigation data)
- ⚠️ **Concurrent writes**: No conflict resolution (last write wins)

---

## 🔒 Security Best Practices

### Token Security

1. **Never commit tokens to Git**
2. **Use secret gists** for private data
3. **Minimal permissions**: Only grant `gist` scope
4. **Rotate tokens** periodically
5. **Use GitHub Secrets** for CI/CD

### Data Privacy

- **Public gist**: Anyone can read (but not write)
- **Secret gist**: Only accessible with token
- **Token exposure**: If token leaks, revoke immediately

### Recommended Setup

```bash
# .env.local (local development)
VITE_DEPLOY_MODE=gist
VITE_GIST_ID=abc123...
VITE_GITHUB_TOKEN=ghp_xxx...

# GitHub Secrets (production)
VITE_GIST_ID → Repository secret
VITE_GITHUB_TOKEN → Repository secret
```

---

## 🆚 Comparison with Other Modes

| Feature              | localStorage | Gist Storage | Backend Mode |
| -------------------- | ------------ | ------------ | ------------ |
| **Cross-device**     | ❌           | ✅           | ✅           |
| **Data persistence** | Browser only | GitHub       | Database     |
| **Setup complexity** | None         | Easy         | Complex      |
| **Cost**             | Free         | Free         | Server cost  |
| **Performance**      | Instant      | ~200-500ms   | Varies       |
| **Multi-user**       | ❌           | ❌           | ✅           |
| **Version history**  | ❌           | ✅           | Depends      |
| **Rate limits**      | None         | 5k/hour      | Self-hosted  |

---

## 🐛 Troubleshooting

### "Failed to fetch gist"

**Possible causes:**

1. Invalid Gist ID
2. Invalid or expired token
3. Network issues
4. Rate limit exceeded

**Solution:**

- Check Gist ID and token
- Verify token has `gist` permission
- Wait if rate limited (resets hourly)

### "Failed to save to gist"

**Possible causes:**

1. Token doesn't have write permission
2. Gist doesn't exist
3. Network issues

**Solution:**

- Ensure token has `gist` scope
- Verify Gist ID is correct
- Check network connection

### Data not updating

**Possible causes:**

1. Cache not cleared
2. Multiple tabs/devices conflict
3. Network latency

**Solution:**

- Refresh page (F5)
- Close other tabs
- Wait a few seconds and retry

---

## 📝 Example Gist Data Structure

```json
{
  "groups": [
    {
      "id": 1,
      "name": "AI 开发工具",
      "order_num": 0,
      "is_public": 1,
      "created_at": "2024-03-01T10:00:00.000Z",
      "updated_at": "2024-03-01T10:00:00.000Z"
    }
  ],
  "sites": [
    {
      "id": 101,
      "group_id": 1,
      "name": "Cursor",
      "url": "https://cursor.sh",
      "description": "AI-powered code editor",
      "icon": "https://cursor.sh/favicon.ico",
      "order_num": 0,
      "is_public": 1,
      "created_at": "2024-03-01T10:00:00.000Z",
      "updated_at": "2024-03-01T10:00:00.000Z"
    }
  ],
  "config": {
    "SITE_TITLE": "AI Engineer Hub",
    "SITE_DESCRIPTION": "AI应用工程师的开发导航站"
  }
}
```

---

## 🔄 Migration Guide

### From localStorage to Gist

1. Export data from localStorage (use Export button)
2. Create Gist with exported data
3. Configure environment variables
4. Rebuild and deploy

### From Gist to Backend

1. Export data from Gist
2. Import to backend database
3. Switch `VITE_DEPLOY_MODE` to `backend`
4. Rebuild and deploy

---

<a name="中文"></a>

## 中文

## 🎯 什么是 Gist 存储模式？

Gist 存储模式使用 **GitHub Gist** 作为数据存储后端，提供了纯 localStorage 和完整后端之间的中间方案：

- ✅ **跨设备同步**：从任何浏览器访问数据
- ✅ **版本历史**：GitHub Gist 保留所有版本
- ✅ **免费**：无服务器成本
- ✅ **可靠**：由 GitHub 基础设施支持
- ✅ **简单**：无需数据库设置

---

## 📋 设置步骤

### 步骤 1：创建 GitHub Personal Access Token

1. 访问 GitHub 设置：https://github.com/settings/tokens
2. 点击 **"Generate new token"** → **"Generate new token (classic)"**
3. 设置 token 名称：例如 "NavGate Gist Storage"
4. 选择权限：**勾选 `gist`**（只需要这个权限）
5. 点击 **"Generate token"**
6. **重要**：立即复制 token（之后无法再看到！）

示例 token：`ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 步骤 2：创建用于数据存储的 Gist

1. 访问：https://gist.github.com/
2. 点击 **"Create new gist"**
3. 设置文件名：`navgate-data.json`
4. 添加初始内容：

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

5. 选择：
   - **Create public gist**：任何人可查看（只读）
   - **Create secret gist**：只有你能访问（推荐）
6. 点击 **"Create secret gist"** 或 **"Create public gist"**
7. 从 URL 复制 Gist ID

示例 URL：`https://gist.github.com/username/abc123def456...`
Gist ID：`abc123def456...`（用户名后的哈希值）

### 步骤 3：配置环境变量

在 `apps/frontend/` 创建 `.env.local` 文件：

```bash
# Gist 存储模式
VITE_DEPLOY_MODE=gist
VITE_GIST_ID=your_gist_id_here
VITE_GITHUB_TOKEN=ghp_your_token_here
```

**安全提示**：永远不要将 `.env.local` 提交到 Git！它已在 `.gitignore` 中。

### 步骤 4：构建和部署

**本地开发：**

```bash
cd apps/frontend
pnpm dev
```

**GitHub Pages 部署：**

需要在 GitHub 仓库中添加密钥：

1. 进入仓库：`Settings` → `Secrets and variables` → `Actions`
2. 点击 **"New repository secret"**
3. 添加两个密钥：
   - Name: `VITE_GIST_ID`，Value: 你的 gist ID
   - Name: `VITE_GITHUB_TOKEN`，Value: 你的 token

4. 更新 `.github/workflows/deploy-github-pages.yml`：

```yaml
- name: Build
  run: pnpm --filter frontend build
  env:
    VITE_DEPLOY_MODE: gist
    VITE_GIST_ID: ${{ secrets.VITE_GIST_ID }}
    VITE_GITHUB_TOKEN: ${{ secrets.VITE_GITHUB_TOKEN }}
```

5. 推送到 GitHub 触发部署

---

## 🔄 工作原理

### 数据流程

```
用户浏览器
    ↓
React 应用
    ↓
GitHub Gist API
    ↓
你的 Gist（JSON 文件）
```

### 读取操作

```typescript
// 从 Gist 获取数据
GET https://api.github.com/gists/{GIST_ID}
Authorization: Bearer {GITHUB_TOKEN}

// 解析 navgate-data.json 内容
const data = JSON.parse(gist.files['navgate-data.json'].content)
```

### 写入操作

```typescript
// 用新数据更新 Gist
PATCH https://api.github.com/gists/{GIST_ID}
Authorization: Bearer {GITHUB_TOKEN}
Body: {
  files: {
    'navgate-data.json': {
      content: JSON.stringify(newData)
    }
  }
}
```

### 缓存机制

- 数据缓存 5 秒以减少 API 调用
- 每次写入立即更新缓存
- GitHub API 速率限制：5,000 次请求/小时（已认证）

---

## ⚡ 性能考虑

### 优势

- ✅ **快速读取**：缓存 5 秒
- ✅ **可靠**：GitHub 的 CDN 和基础设施
- ✅ **版本历史**：需要时可以回滚

### 限制

- ⚠️ **网络延迟**：每次请求约 200-500ms
- ⚠️ **速率限制**：5,000 次请求/小时（通常足够）
- ⚠️ **文件大小**：Gist 文件限制 10MB（对导航数据足够）
- ⚠️ **并发写入**：无冲突解决（最后写入获胜）

---

## 🔒 安全最佳实践

### Token 安全

1. **永远不要将 token 提交到 Git**
2. **使用 secret gist** 存储私密数据
3. **最小权限**：只授予 `gist` 权限
4. **定期轮换** token
5. **使用 GitHub Secrets** 用于 CI/CD

### 数据隐私

- **Public gist**：任何人可读（但不能写）
- **Secret gist**：只能通过 token 访问
- **Token 泄露**：如果 token 泄露，立即撤销

### 推荐设置

```bash
# .env.local（本地开发）
VITE_DEPLOY_MODE=gist
VITE_GIST_ID=abc123...
VITE_GITHUB_TOKEN=ghp_xxx...

# GitHub Secrets（生产环境）
VITE_GIST_ID → 仓库密钥
VITE_GITHUB_TOKEN → 仓库密钥
```

---

## 🆚 与其他模式对比

| 功能           | localStorage | Gist 存储  | 后端模式   |
| -------------- | ------------ | ---------- | ---------- |
| **跨设备**     | ❌           | ✅         | ✅         |
| **数据持久化** | 仅浏览器     | GitHub     | 数据库     |
| **设置复杂度** | 无           | 简单       | 复杂       |
| **成本**       | 免费         | 免费       | 服务器成本 |
| **性能**       | 即时         | ~200-500ms | 不定       |
| **多用户**     | ❌           | ❌         | ✅         |
| **版本历史**   | ❌           | ✅         | 取决于实现 |
| **速率限制**   | 无           | 5k/小时    | 自托管     |

---

## 🐛 故障排除

### "Failed to fetch gist"

**可能原因：**

1. 无效的 Gist ID
2. 无效或过期的 token
3. 网络问题
4. 超过速率限制

**解决方案：**

- 检查 Gist ID 和 token
- 验证 token 有 `gist` 权限
- 如果超限，等待（每小时重置）

### "Failed to save to gist"

**可能原因：**

1. Token 没有写权限
2. Gist 不存在
3. 网络问题

**解决方案：**

- 确保 token 有 `gist` 权限
- 验证 Gist ID 正确
- 检查网络连接

### 数据未更新

**可能原因：**

1. 缓存未清除
2. 多个标签页/设备冲突
3. 网络延迟

**解决方案：**

- 刷新页面（F5）
- 关闭其他标签页
- 等待几秒后重试

---

**选择适合你的存储方案！🚀**
