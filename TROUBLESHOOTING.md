# Troubleshooting Guide | 故障排除指南

## 🚨 空白页面问题诊断

如果部署后页面是空白的，请按以下步骤排查：

### 步骤 1：检查 GitHub Actions 部署状态

1. 访问：`https://github.com/yunlongwen/NavGate/actions`
2. 查看最新的 workflow 运行状态
3. 确认部署是否成功（绿色 ✅）

**如果部署失败（红色 ❌）：**

- 点击查看详细日志
- 查找错误信息
- 常见错误：
  - `secrets.VITE_GIST_ID` 未定义 → 检查 GitHub Secrets 是否添加
  - `secrets.VITE_GITHUB_TOKEN` 未定义 → 检查 GitHub Secrets 是否添加
  - Build 失败 → 查看具体错误信息

---

### 步骤 2：检查浏览器控制台

1. 打开你的 GitHub Pages 页面
2. 按 `F12` 打开开发者工具
3. 切换到 **Console** 标签
4. 查看是否有错误信息

**常见错误及解决方案：**

#### 错误 1：`401 Unauthorized` (Gist API)

```
Error: Request failed with status code 401
```

**原因：** GitHub Token 无效或过期

**解决方案：**

1. 检查 GitHub Token 是否正确
2. 确认 Token 有 `gist` 权限
3. Token 可能已过期，重新生成：
   - 访问：https://github.com/settings/tokens
   - 删除旧 token
   - 创建新 token（勾选 `gist` 权限）
   - 更新 GitHub Secrets 中的 `VITE_GITHUB_TOKEN`

#### 错误 2：`404 Not Found` (Gist)

```
Error: Request failed with status code 404
```

**原因：** Gist ID 不正确或 Gist 不存在

**解决方案：**

1. 访问你的 Gist：https://gist.github.com/
2. 找到你创建的 `navgate-data.json` Gist
3. 从 URL 复制正确的 Gist ID
   - 例如：`https://gist.github.com/yunlongwen/abc123def456`
   - Gist ID 是：`abc123def456`
4. 更新 GitHub Secrets 中的 `VITE_GIST_ID`

#### 错误 3：`Failed to parse JSON`

```
SyntaxError: Unexpected token < in JSON at position 0
```

**原因：** Gist 中的 JSON 格式不正确

**解决方案：**

1. 访问你的 Gist
2. 点击 "Edit"
3. 确保 JSON 格式正确，使用以下模板：

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

4. 保存 Gist
5. 刷新页面

#### 错误 4：`VITE_DEPLOY_MODE is undefined`

**原因：** 环境变量未正确传递

**解决方案：**

1. 检查 `.github/workflows/deploy-github-pages.yml`
2. 确认 `env:` 部分配置正确：

```yaml
env:
  VITE_DEPLOY_MODE: gist
  VITE_GIST_ID: ${{ secrets.VITE_GIST_ID }}
  VITE_GITHUB_TOKEN: ${{ secrets.VITE_GITHUB_TOKEN }}
```

3. 重新部署

---

### 步骤 3：检查 GitHub Secrets 配置

1. 访问：`https://github.com/yunlongwen/NavGate/settings/secrets/actions`
2. 确认以下 Secrets 已添加：
   - ✅ `VITE_GIST_ID`
   - ✅ `VITE_GITHUB_TOKEN`

**验证方法：**

- Secrets 名称必须完全匹配（大小写敏感）
- 点击 "Update" 可以重新设置值

---

### 步骤 4：检查 Gist 内容

1. 访问你的 Gist：https://gist.github.com/
2. 找到 `navgate-data.json`
3. 点击 "Raw" 查看原始内容
4. 确认 JSON 格式正确

**正确的 JSON 格式：**

```json
{
  "groups": [
    {
      "id": 1,
      "name": "示例分组",
      "order_num": 0,
      "is_public": 1,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "sites": [
    {
      "id": 101,
      "group_id": 1,
      "name": "示例站点",
      "url": "https://example.com",
      "description": "示例描述",
      "icon": "https://example.com/favicon.ico",
      "order_num": 0,
      "is_public": 1,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "config": {
    "SITE_TITLE": "Agently",
    "SITE_DESCRIPTION": "个人导航"
  }
}
```

**使用仓库中的模板：**

- 复制 `gist-data.json` 的内容
- 粘贴到你的 Gist 中

---

### 步骤 5：检查网络请求

1. 打开开发者工具（F12）
2. 切换到 **Network** 标签
3. 刷新页面
4. 查找对 `api.github.com/gists` 的请求

**正常情况：**

- 状态码：200 OK
- 响应内容：包含你的 groups、sites、config 数据

**异常情况：**

- 状态码：401 → Token 问题
- 状态码：404 → Gist ID 问题
- 状态码：403 → Token 权限不足或 API 限流

---

## 🔧 快速修复步骤

### 如果是 Token 问题：

```bash
# 1. 重新生成 GitHub Token
# 访问：https://github.com/settings/tokens
# 创建新 token，勾选 gist 权限

# 2. 更新 GitHub Secrets
# 访问：https://github.com/yunlongwen/NavGate/settings/secrets/actions
# 更新 VITE_GITHUB_TOKEN

# 3. 触发重新部署
git commit --allow-empty -m "chore: trigger redeploy"
git push origin master
```

### 如果是 Gist ID 问题：

```bash
# 1. 获取正确的 Gist ID
# 访问：https://gist.github.com/
# 从 URL 复制 Gist ID

# 2. 更新 GitHub Secrets
# 访问：https://github.com/yunlongwen/NavGate/settings/secrets/actions
# 更新 VITE_GIST_ID

# 3. 触发重新部署
git commit --allow-empty -m "chore: trigger redeploy"
git push origin master
```

### 如果是 JSON 格式问题：

```bash
# 1. 编辑你的 Gist
# 访问：https://gist.github.com/
# 点击 Edit

# 2. 使用正确的 JSON 格式
# 复制 gist-data.json 的内容

# 3. 保存 Gist

# 4. 刷新页面（无需重新部署）
```

---

## 📋 完整检查清单

- [ ] GitHub Actions 部署成功（绿色 ✅）
- [ ] GitHub Secrets 已正确添加（`VITE_GIST_ID`, `VITE_GITHUB_TOKEN`）
- [ ] Gist 已创建且 JSON 格式正确
- [ ] GitHub Token 有效且有 `gist` 权限
- [ ] Workflow 文件配置正确（`VITE_DEPLOY_MODE: gist`）
- [ ] 浏览器控制台无错误
- [ ] Network 标签显示 Gist API 请求成功（200 OK）

---

## 🆘 仍然无法解决？

如果以上步骤都检查过了，页面仍然空白，请提供以下信息：

1. **GitHub Actions 日志**
   - 访问：https://github.com/yunlongwen/NavGate/actions
   - 复制最新 workflow 的日志

2. **浏览器控制台错误**
   - 按 F12 打开控制台
   - 截图或复制错误信息

3. **Network 请求详情**
   - 开发者工具 → Network 标签
   - 找到 `gists` 请求
   - 查看 Request Headers 和 Response

4. **Gist URL**
   - 提供你的 Gist URL（确保是 public 或你有权限访问）

---

## 💡 临时解决方案：使用 localStorage 模式

如果 Gist 模式暂时无法工作，可以先切换回 localStorage 模式：

1. 编辑 `.github/workflows/deploy-github-pages.yml`
2. 修改 `env:` 部分：

```yaml
env:
  VITE_DEPLOY_MODE: github-pages # 改回 github-pages
  # VITE_GIST_ID: ${{ secrets.VITE_GIST_ID }}  # 注释掉
  # VITE_GITHUB_TOKEN: ${{ secrets.VITE_GITHUB_TOKEN }}  # 注释掉
```

3. 提交并推送：

```bash
git add .github/workflows/deploy-github-pages.yml
git commit -m "fix: 临时切换回 localStorage 模式"
git push origin master
```

4. 等待部署完成，页面应该可以正常显示（使用 localStorage 存储）

---

**祝你顺利解决问题！🚀**
