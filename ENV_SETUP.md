# Environment Configuration Guide | 环境配置说明

[English](#english) | [中文](#中文)

---

<a name="english"></a>

## English

This document details the configuration and usage of various environment variables in the NavGate project.

### 📋 Environment Variables Overview

| Variable Name      | Description                    | Required | Default      | Mode    |
| ------------------ | ------------------------------ | -------- | ------------ | ------- |
| `VITE_DEPLOY_MODE` | Deployment mode                | ✅       | github-pages | All     |
| `DATABASE_URL`     | MySQL connection string        | ❌       | -            | Backend |
| `JWT_SECRET`       | JWT secret key                 | ❌       | -            | Backend |
| `AUTH_USERNAME`    | Admin username                 | ❌       | admin        | Backend |
| `AUTH_PASSWORD`    | Admin password (encrypted)     | ❌       | -            | Backend |
| `PORT`             | Backend service port           | ❌       | 3000         | Backend |
| `NODE_ENV`         | Runtime environment            | ❌       | development  | Backend |

---

### 🚀 Deployment Mode Configuration

#### VITE_DEPLOY_MODE

Controls the application running mode, determines data storage and authentication methods.

**Available values:**

- `github-pages` - GitHub Pages mode (pure frontend)
- `backend` - Backend mode (Express.js + MySQL)

**Configuration methods:**

```bash
# Method 1: Environment variable
export VITE_DEPLOY_MODE=github-pages

# Method 2: In .env file
echo "VITE_DEPLOY_MODE=github-pages" >> .env

# Method 3: Docker Compose
environment:
  - VITE_DEPLOY_MODE=github-pages
```

**Impact:**

1. **API Implementation**
   - `github-pages`: Uses localStorage
   - `backend`: Uses HTTP requests to backend API

2. **Authentication**
   - `github-pages`: No authentication, data stored directly in browser
   - `backend`: Uses JWT + bcrypt authentication

3. **Data Storage**
   - `github-pages`: Browser localStorage (5-10MB)
   - `backend`: MySQL database (persistent)

---

### 🗄️ Database Configuration

#### DATABASE_URL

MySQL database connection string, only required when `VITE_DEPLOY_MODE=backend`.

**Format:**

```
mysql://[user]:[password]@[host]:[port]/[database]
```

**Examples:**

```env
# Local MySQL
DATABASE_URL=mysql://root:password123@localhost:3306/navgate

# Remote MySQL (RDS)
DATABASE_URL=mysql://navgate:securepassword@rm-xxxxx.mysql.rds.aliyuncs.com:3306/navgate

# Docker Compose
DATABASE_URL=mysql://root:${DB_PASSWORD}@db:3306/navgate
```

**Parameter description:**

- `user` - Database username
- `password` - Database password
- `host` - Database host address
- `port` - Database port (default 3306)
- `database` - Database name

**Docker Compose special configuration:**

In `docker/docker-compose.yml`, the database URL uses Docker service name:

```yaml
environment:
  - DATABASE_URL=mysql://root:${DB_PASSWORD}@db:3306/navgate
```

---

### 🔐 Authentication Configuration

#### JWT_SECRET

Secret key string for signing and verifying JWT tokens, only required when `VITE_DEPLOY_MODE=backend`.

**Requirements:**

- At least 32 characters long
- Contains letters, numbers, and special characters
- Do not hardcode in code

**Generation methods:**

```bash
# Method 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Method 2: Using OpenSSL
openssl rand -hex 32

# Method 3: Online generation
# https://generate-secret.vercel.app/32
```

**Example:**

```env
JWT_SECRET=super-secret-jwt-key-change-this-please
```

**Security recommendations:**

- Do not hardcode in code
- Do not commit to Git repository
- Rotate keys regularly
- Use environment variable management tools (e.g., AWS Secrets Manager)

#### AUTH_USERNAME

Admin username, only required when `VITE_DEPLOY_MODE=backend`.

**Example:**

```env
AUTH_USERNAME=myadmin
```

**Security recommendations:**

- Do not use common usernames like "admin", "root"
- Use hard-to-guess usernames

#### AUTH_PASSWORD

Admin password (bcrypt encrypted), only required when `VITE_DEPLOY_MODE=backend`.

**Generate encrypted password:**

```bash
pnpm run hash-password
```

Enter your desired plaintext password, the tool will return the encrypted password.

**Example:**

```bash
$ pnpm run hash-password
? Enter password: mySecurePassword123
$2a$10$abcdefghijklmnopqrstuvwxyz1234567890
```

Copy the generated encrypted password to `.env` file:

```env
AUTH_PASSWORD=$2a$10$abcdefghijklmnopqrstuvwxyz1234567890
```

**Security recommendations:**

- Password at least 12 characters
- Contains uppercase, lowercase letters, numbers and special characters
- Change password regularly
- Do not use the same password elsewhere

---

### 🌐 Server Configuration

#### PORT

Backend service listening port, only required when `VITE_DEPLOY_MODE=backend`.

**Example:**

```env
PORT=3000
```

**Common ports:**

- `3000` - Default backend port
- `80` - HTTP standard port (requires root privileges)
- `443` - HTTPS standard port (requires root privileges)

#### NODE_ENV

Runtime environment, affects certain application behaviors.

**Available values:**

- `development` - Development environment
- `production` - Production environment

**Impact:**

- Log verbosity
- Error handling methods
- Performance optimization settings

---

### ☁️ Alibaba Cloud Configuration

These variables are only needed when deploying to Alibaba Cloud.

#### ALIYUN_ACCESS_KEY_ID

Alibaba Cloud access key ID.

**How to obtain:**

1. Log in to Alibaba Cloud console
2. Go to AccessKey management
3. Create AccessKey

**Example:**

```env
ALIYUN_ACCESS_KEY_ID=LTAI4xxxxxxxxxxxxxxxx
```

#### ALIYUN_ACCESS_KEY_SECRET

Alibaba Cloud access key secret.

**Example:**

```env
ALIYUN_ACCESS_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Security recommendations:**

- Do not commit to Git
- Use RAM sub-accounts with limited permissions
- Rotate keys regularly

#### ALIYUN_REGION

Alibaba Cloud region code.

**Common regions:**

- `cn-hangzhou` - East China 1 (Hangzhou)
- `cn-shanghai` - East China 2 (Shanghai)
- `cn-beijing` - North China 2 (Beijing)
- `cn-shenzhen` - South China 1 (Shenzhen)
- `us-east-1` - US East 1 (Virginia)

**Example:**

```env
ALIYUN_REGION=cn-hangzhou
```

#### ALIYUN_ECS_INSTANCE_ID

Alibaba Cloud ECS instance ID.

**How to obtain:**

1. Go to ECS console
2. Select instance
3. View instance ID in instance details

**Example:**

```env
ALIYUN_ECS_INSTANCE_ID=i-xxxxxxxxxxxxxxxxx
```

#### ALIYUN_ECS_SSH_KEY

SSH private key file path for connecting to ECS instance.

**Example:**

```env
ALIYUN_ECS_SSH_KEY=/path/to/your/ssh/key.pem
```

**Notes:**

- Ensure correct file permissions: `chmod 400 your-key.pem`
- Do not commit to Git
- Keep private key secure

---

### 🐳 Docker Configuration

#### DB_PASSWORD

MySQL root password in Docker Compose.

**Example:**

```env
DB_PASSWORD=your-mysql-root-password
```

**Usage in docker-compose.yml:**

```yaml
services:
  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=${DB_PASSWORD}
```

---

### 📝 .env File Examples

#### GitHub Pages Mode

```env
# Deployment mode
VITE_DEPLOY_MODE=github-pages

# GitHub Pages mode requires no other configuration
```

#### Backend Mode (Local Development)

```env
# Deployment mode
VITE_DEPLOY_MODE=backend

# Database configuration
DATABASE_URL=mysql://root:password@localhost:3306/navgate

# JWT configuration
JWT_SECRET=your-super-secret-jwt-key-change-this

# Authentication configuration
AUTH_USERNAME=myadmin
AUTH_PASSWORD=$2a$10$abcdefghijklmnopqrstuvwxyz1234567890

# Service port
PORT=3000

# Runtime environment
NODE_ENV=development
```

#### Docker Compose Deployment

```env
# Docker Compose automatically sets the following variables
DB_PASSWORD=your-mysql-root-password
JWT_SECRET=your-super-secret-jwt-key
AUTH_USERNAME=myadmin
AUTH_PASSWORD=$2a$10$abcdefghijklmnopqrstuvwxyz1234567890
```

#### Alibaba Cloud Deployment

```env
# Deployment mode
VITE_DEPLOY_MODE=backend

# Database configuration (using RDS)
DATABASE_URL=mysql://navgate:securepassword@rm-xxxxx.mysql.rds.aliyuncs.com:3306/navgate

# JWT configuration
JWT_SECRET=your-super-secret-jwt-key-change-this

# Authentication configuration
AUTH_USERNAME=myadmin
AUTH_PASSWORD=$2a$10$abcdefghijklmnopqrstuvwxyz1234567890

# Alibaba Cloud configuration
ALIYUN_ACCESS_KEY_ID=LTAI4xxxxxxxxxxxxxxxx
ALIYUN_ACCESS_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ALIYUN_REGION=cn-hangzhou
ALIYUN_ECS_INSTANCE_ID=i-xxxxxxxxxxxxxxxxx
ALIYUN_ECS_SSH_KEY=/path/to/your/ssh/key.pem
```

---

### 🔒 Security Best Practices

1. **Never commit sensitive information to Git**
   - Add `.env` to `.gitignore`
   - Use environment variable management tools

2. **Use strong keys and passwords**
   - JWT_SECRET at least 32 characters
   - Password at least 12 characters, including uppercase, lowercase, numbers and special characters

3. **Rotate keys regularly**
   - Change JWT_SECRET every 3-6 months
   - Change database password regularly

4. **Limit permissions**
   - Use principle of least privilege
   - Use sub-accounts instead of main accounts

5. **Monitoring and logging**
   - Enable access logs
   - Monitor abnormal login behavior

---

### 📚 Related Documentation

- [Deployment Guide](DEPLOYMENT.md)
- [README](README.md)

---

<a name="中文"></a>

## 中文

本文档详细说明了 NavGate 项目中各种环境变量的配置和使用方法。

### 📋 环境变量总览

| 变量名             | 说明               | 必需 | 默认值       | 适用模式 |
| ------------------ | ------------------ | ---- | ------------ | -------- |
| `VITE_DEPLOY_MODE` | 部署模式           | ✅   | github-pages | 所有     |
| `DATABASE_URL`     | MySQL 连接字符串   | ❌   | -            | 后端     |
| `JWT_SECRET`       | JWT 密钥           | ❌   | -            | 后端     |
| `AUTH_USERNAME`    | 管理员用户名       | ❌   | admin        | 后端     |
| `AUTH_PASSWORD`    | 管理员密码（加密） | ❌   | -            | 后端     |
| `PORT`             | 后端服务端口       | ❌   | 3000         | 后端     |
| `NODE_ENV`         | 运行环境           | ❌   | development  | 后端     |

---

### 🚀 部署模式配置

#### VITE_DEPLOY_MODE

控制应用运行的模式，决定了数据存储和认证方式。

**可用值：**

- `github-pages` - GitHub Pages 模式（纯前端）
- `backend` - 后端模式（Express.js + MySQL）

**设置方法：**

```bash
# 方式 1：环境变量
export VITE_DEPLOY_MODE=github-pages

# 方式 2：在 .env 文件中
echo "VITE_DEPLOY_MODE=github-pages" >> .env

# 方式 3：Docker Compose
environment:
  - VITE_DEPLOY_MODE=github-pages
```

**影响：**

1. **API 实现方式**
   - `github-pages`：使用 localStorage
   - `backend`：使用 HTTP 请求到后端 API

2. **认证方式**
   - `github-pages`：无认证，数据直接存储在浏览器
   - `backend`：使用 JWT + bcrypt 认证

3. **数据存储**
   - `github-pages`：浏览器 localStorage（5-10MB）
   - `backend`：MySQL 数据库（持久化）

---

### 🗄️ 数据库配置

#### DATABASE_URL

MySQL 数据库连接字符串，仅在 `VITE_DEPLOY_MODE=backend` 时需要。

**格式：**

```
mysql://[user]:[password]@[host]:[port]/[database]
```

**示例：**

```env
# 本地 MySQL
DATABASE_URL=mysql://root:password123@localhost:3306/navgate

# 远程 MySQL（RDS）
DATABASE_URL=mysql://navgate:securepassword@rm-xxxxx.mysql.rds.aliyuncs.com:3306/navgate

# Docker Compose
DATABASE_URL=mysql://root:${DB_PASSWORD}@db:3306/navgate
```

**参数说明：**

- `user` - 数据库用户名
- `password` - 数据库密码
- `host` - 数据库主机地址
- `port` - 数据库端口（默认 3306）
- `database` - 数据库名称

**Docker Compose 特殊配置：**

在 `docker/docker-compose.yml` 中，数据库 URL 使用 Docker 服务名称：

```yaml
environment:
  - DATABASE_URL=mysql://root:${DB_PASSWORD}@db:3306/navgate
```

---

### 🔐 认证配置

#### JWT_SECRET

用于签名和验证 JWT token 的密钥字符串，仅在 `VITE_DEPLOY_MODE=backend` 时需要。

**要求：**

- 长度至少 32 个字符
- 包含字母、数字和特殊字符
- 不要在代码中硬编码

**生成方法：**

```bash
# 方式 1：使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 方式 2：使用 OpenSSL
openssl rand -hex 32

# 方式 3：在线生成
# https://generate-secret.vercel.app/32
```

**示例：**

```env
JWT_SECRET=super-secret-jwt-key-change-this-please
```

**安全建议：**

- 不要在代码中硬编码
- 不要提交到 Git 仓库
- 定期更换密钥
- 使用环境变量管理工具（如 AWS Secrets Manager）

#### AUTH_USERNAME

管理员用户名，仅在 `VITE_DEPLOY_MODE=backend` 时需要。

**示例：**

```env
AUTH_USERNAME=myadmin
```

**安全建议：**

- 不要使用 "admin"、"root" 等常见用户名
- 使用不易猜测的用户名

#### AUTH_PASSWORD

管理员密码（bcrypt 加密），仅在 `VITE_DEPLOY_MODE=backend` 时需要。

**生成加密密码：**

```bash
pnpm run hash-password
```

输入你想要的明文密码，工具会返回加密后的密码。

**示例：**

```bash
$ pnpm run hash-password
? 请输入密码: mySecurePassword123
$2a$10$abcdefghijklmnopqrstuvwxyz1234567890
```

将生成的加密密码复制到 `.env` 文件：

```env
AUTH_PASSWORD=$2a$10$abcdefghijklmnopqrstuvwxyz1234567890
```

**安全建议：**

- 密码至少 12 位
- 包含大小写字母、数字和特殊字符
- 定期更换密码
- 不要在其他地方使用相同密码

---

### 🌐 服务器配置

#### PORT

后端服务监听的端口号，仅在 `VITE_DEPLOY_MODE=backend` 时需要。

**示例：**

```env
PORT=3000
```

**常用端口：**

- `3000` - 默认后端端口
- `80` - HTTP 标准端口（需要 root 权限）
- `443` - HTTPS 标准端口（需要 root 权限）

#### NODE_ENV

运行环境，影响应用的某些行为。

**可用值：**

- `development` - 开发环境
- `production` - 生产环境

**影响：**

- 日志详细程度
- 错误处理方式
- 性能优化设置

---

### ☁️ 阿里云配置

这些变量仅在部署到阿里云时需要。

#### ALIYUN_ACCESS_KEY_ID

阿里云访问密钥 ID。

**获取方式：**

1. 登录阿里云控制台
2. 进入 AccessKey 管理
3. 创建 AccessKey

**示例：**

```env
ALIYUN_ACCESS_KEY_ID=LTAI4xxxxxxxxxxxxxxxx
```

#### ALIYUN_ACCESS_KEY_SECRET

阿里云访问密钥 Secret。

**示例：**

```env
ALIYUN_ACCESS_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**安全建议：**

- 不要提交到 Git
- 使用 RAM 子账号并限制权限
- 定期轮换密钥

#### ALIYUN_REGION

阿里云区域代码。

**常用区域：**

- `cn-hangzhou` - 华东 1（杭州）
- `cn-shanghai` - 华东 2（上海）
- `cn-beijing` - 华北 2（北京）
- `cn-shenzhen` - 华南 1（深圳）
- `us-east-1` - 美东 1（弗吉尼亚）

**示例：**

```env
ALIYUN_REGION=cn-hangzhou
```

#### ALIYUN_ECS_INSTANCE_ID

阿里云 ECS 实例 ID。

**获取方式：**

1. 进入 ECS 控制台
2. 选择实例
3. 在实例详情中查看实例 ID

**示例：**

```env
ALIYUN_ECS_INSTANCE_ID=i-xxxxxxxxxxxxxxxxx
```

#### ALIYUN_ECS_SSH_KEY

SSH 私钥文件路径，用于连接到 ECS 实例。

**示例：**

```env
ALIYUN_ECS_SSH_KEY=/path/to/your/ssh/key.pem
```

**注意事项：**

- 确保文件权限正确：`chmod 400 your-key.pem`
- 不要提交到 Git
- 保持私钥安全

---

### 🐳 Docker 配置

#### DB_PASSWORD

Docker Compose 中 MySQL root 密码。

**示例：**

```env
DB_PASSWORD=your-mysql-root-password
```

**在 docker-compose.yml 中使用：**

```yaml
services:
  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=${DB_PASSWORD}
```

---

### 📝 .env 文件示例

#### GitHub Pages 模式

```env
# 部署模式
VITE_DEPLOY_MODE=github-pages

# GitHub Pages 模式不需要其他配置
```

#### 后端模式（本地开发）

```env
# 部署模式
VITE_DEPLOY_MODE=backend

# 数据库配置
DATABASE_URL=mysql://root:password@localhost:3306/navgate

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key-change-this

# 认证配置
AUTH_USERNAME=myadmin
AUTH_PASSWORD=$2a$10$abcdefghijklmnopqrstuvwxyz1234567890

# 服务端口
PORT=3000

# 运行环境
NODE_ENV=development
```

#### Docker Compose 部署

```env
# Docker Compose 会自动设置以下变量
DB_PASSWORD=your-mysql-root-password
JWT_SECRET=your-super-secret-jwt-key
AUTH_USERNAME=myadmin
AUTH_PASSWORD=$2a$10$abcdefghijklmnopqrstuvwxyz1234567890
```

#### 阿里云部署

```env
# 部署模式
VITE_DEPLOY_MODE=backend

# 数据库配置（使用 RDS）
DATABASE_URL=mysql://navgate:securepassword@rm-xxxxx.mysql.rds.aliyuncs.com:3306/navgate

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key-change-this

# 认证配置
AUTH_USERNAME=myadmin
AUTH_PASSWORD=$2a$10$abcdefghijklmnopqrstuvwxyz1234567890

# 阿里云配置
ALIYUN_ACCESS_KEY_ID=LTAI4xxxxxxxxxxxxxxxx
ALIYUN_ACCESS_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ALIYUN_REGION=cn-hangzhou
ALIYUN_ECS_INSTANCE_ID=i-xxxxxxxxxxxxxxxxx
ALIYUN_ECS_SSH_KEY=/path/to/your/ssh/key.pem
```

---

### 🔒 安全最佳实践

1. **永远不要提交敏感信息到 Git**
   - 在 `.gitignore` 中添加 `.env`
   - 使用环境变量管理工具

2. **使用强密钥和密码**
   - JWT_SECRET 至少 32 个字符
   - 密码至少 12 位，包含大小写字母、数字和特殊字符

3. **定期轮换密钥**
   - 每 3-6 个月更换 JWT_SECRET
   - 定期更换数据库密码

4. **限制权限**
   - 使用最小权限原则
   - 使用子账号而不是主账号

5. **监控和日志**
   - 启用访问日志
   - 监控异常登录行为

---

### 📚 相关文档

- [部署指南](DEPLOYMENT.md)
- [README](README.md)
