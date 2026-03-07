# Docker 部署指南

## 一、概述

本文档详细说明如何使用 Docker 构建、发布和部署 NavGate 项目。

## 二、构建镜像

### 1. 构建本地镜像

```bash
# 在项目根目录执行
docker build -t navgate:latest .
```

### 2. 构建参数

构建过程中会自动：

- 安装依赖
- 构建前端代码
- 构建后端代码
- 配置 Nginx 反向代理
- 设置启动脚本

## 三、发布镜像

### 1. 登录 Docker Hub

```bash
docker login
```

### 2. 标记镜像

```bash
docker tag navgate:latest <your-dockerhub-username>/navgate:latest
```

### 3. 推送镜像

```bash
docker push <your-dockerhub-username>/navgate:latest
```

### 4. GitHub Actions 自动发布

项目已配置 GitHub Actions 工作流，会在推送到 `master` 分支时自动构建并推送镜像到 Docker Hub。

**配置要求**：

- 在 GitHub 仓库的 Secrets 中添加：
  - `DOCKERHUB_USERNAME`：Docker Hub 用户名
  - `DOCKERHUB_TOKEN`：Docker Hub 访问令牌

## 四、部署方式

### 1. 使用 docker run

```bash
docker run -d \
  -p 80:80 \
  -v navgate_data:/app/data \
  -e AUTH_USERNAME=admin \
  -e AUTH_PASSWORD=admin123 \
  --name navgate \
  navgate:latest
```

### 2. 使用 docker-compose

1. **配置 docker-compose.yml**：

```yaml
version: '3.8'

services:
  navgate:
    image: navgate:latest
    ports:
      - '80:80'
    environment:
      - AUTH_USERNAME=${AUTH_USERNAME:-admin}
      - AUTH_PASSWORD=${AUTH_PASSWORD:-admin123}
    volumes:
      - navgate_data:/app/data

volumes:
  navgate_data:
```

2. **启动服务**：

```bash
docker-compose -f docker/docker-compose.yml up -d
```

## 五、配置选项

### 1. 环境变量

| 变量名          | 默认值                    | 描述                     |
| --------------- | ------------------------- | ------------------------ |
| `AUTH_USERNAME` | `admin`                   | 管理员用户名             |
| `AUTH_PASSWORD` | `admin123`                | 管理员密码               |
| `PORT`          | `3000`                    | 后端服务端口（容器内部） |
| `NODE_ENV`      | `production`              | 运行环境                 |
| `JSON_DB_PATH`  | `/app/data/nav-data.json` | 数据文件路径             |

### 2. 端口配置

- **容器端口**：80（Nginx）
- **主机端口**：可通过 `-p` 参数自定义，例如 `8080:80`

### 3. 数据持久化

- 使用 Docker 卷 `navgate_data` 存储数据
- 数据文件：`/app/data/nav-data.json`

## 六、访问方式

### 1. 前端访问

```
http://localhost[:端口]
```

### 2. API 访问

```
http://localhost[:端口]/api
```

### 3. 健康检查

```
http://localhost[:端口]/health
```

## 七、常见问题

### 1. 端口被占用

**解决方法**：使用不同的主机端口，例如：

```bash
docker run -d -p 8080:80 navgate:latest
```

### 2. 数据丢失

**解决方法**：确保使用了 Docker 卷存储数据，避免使用 `--rm` 参数。

### 3. 认证失败

**解决方法**：检查环境变量配置，确保 `AUTH_USERNAME` 和 `AUTH_PASSWORD` 设置正确。

### 4. 镜像拉取失败

**解决方法**：检查网络连接，确保 Docker Hub 可访问。

## 八、更新部署

### 1. 拉取最新镜像

```bash
docker pull <your-dockerhub-username>/navgate:latest
```

### 2. 重启容器

```bash
docker-compose -f docker/docker-compose.yml up -d --force-recreate
```

## 九、停止和清理

### 1. 停止容器

```bash
docker stop navgate
# 或
docker-compose -f docker/docker-compose.yml down
```

### 2. 清理容器

```bash
docker rm navgate
```

### 3. 清理镜像

```bash
docker rmi navgate:latest
```

## 十、开发环境与生产环境

### 开发环境

- 使用 `pnpm dev` 和 `pnpm dev:backend` 启动开发服务器
- 实时热更新，便于调试

### 生产环境

- 使用 Docker 镜像部署
- 性能优化，稳定性高
- 便于横向扩展

## 十一、总结

通过 Docker 部署 NavGate 项目，可以：

- 简化部署流程
- 确保环境一致性
- 提高应用可靠性
- 便于版本管理和回滚

使用本文档提供的方法，您可以轻松构建、发布和部署 NavGate 项目的 Docker 镜像。
