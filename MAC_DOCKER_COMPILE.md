# Mac 电脑 Docker 编译指南

本文档提供在 Mac 电脑上编译和运行 NavGate Docker 镜像的详细步骤。

## 步骤 1: 安装 Docker Desktop

### 方法 1: 官方网站下载

1. 访问 [Docker Desktop 官方下载页面](https://www.docker.com/products/docker-desktop/)
2. 点击 "Download for Mac" 按钮
3. 下载完成后，双击 `.dmg` 文件打开
4. 将 Docker 图标拖拽到 Applications 文件夹中
5. 打开 Docker Desktop 应用程序
6. 按照提示完成安装和设置

### 方法 2: 使用 Homebrew (如果网络允许)

```bash
brew install --
```

cask docker

````

## 步骤 2: 验证 Docker 安装

打开终端，运行以下命令验证 Docker 是否正确安装：

```bash
docker --version
docker-compose --version
docker info
````

## 步骤 3: 构建 Docker 镜像

在项目根目录中运行以下命令构建 Docker 镜像：

```bash
# 构建本地镜像
docker build -t navgate:latest .

# 查看构建的镜像
docker images
```

## 步骤 4: 运行 Docker 容器

### 使用 docker run 命令

```bash
docker run -d \
  -p 80:80 \
  -v navgate_data:/app/data \
  -e AUTH_USERNAME=admin \
  -e AUTH_PASSWORD=admin123 \
  --name navgate \
  navgate:latest
```

### 使用 docker-compose

```bash
docker-compose -f docker/docker-compose.yml up -d
```

## 步骤 5: 验证容器运行状态

```bash
# 查看容器状态
docker ps

# 查看容器日志
docker logs navgate

# 检查健康状态
docker inspect --format '{{json .State.Health}}' navgate | jq
```

## 步骤 6: 访问应用

在浏览器中访问以下 URL：

- **前端应用**: http://localhost
- **API 接口**: http://localhost/api
- **健康检查**: http://localhost/health

## 步骤 7: 停止和清理

```bash
# 停止容器
docker stop navgate

# 移除容器
docker rm navgate

# 移除镜像
docker rmi navgate:latest

# 移除数据卷
docker volume rm navgate_data
```

## 常见问题解决

### 1. 端口 80 被占用

如果端口 80 被占用，可以使用其他端口，例如：

```bash
docker run -d \
  -p 8080:80 \
  -v navgate_data:/app/data \
  --name navgate \
  navgate:latest
```

然后访问 http://localhost:8080

### 2. 构建失败

如果构建失败，检查以下几点：

- 确保网络连接正常
- 确保 Docker Desktop 正在运行
- 检查 Dockerfile 文件是否正确
- 查看构建日志中的错误信息

### 3. 容器启动失败

如果容器启动失败，检查以下几点：

- 查看容器日志：`docker logs navgate`
- 确保数据卷权限正确
- 检查环境变量配置

## 构建过程详解

### Docker 镜像构建步骤

1. **基础镜像**: 使用 `node:20-alpine` 作为基础镜像
2. **安装 pnpm**: 全局安装 pnpm 包管理器
3. **复制文件**: 复制项目文件到容器中
4. **安装依赖**: 运行 `pnpm install` 安装所有依赖
5. **构建前端**: 运行 `pnpm build` 构建前端应用
6. **构建后端**: 运行 `pnpm build` 构建后端应用
7. **生产镜像**: 创建生产环境镜像
8. **安装 Nginx**: 安装 Nginx 作为反向代理
9. **配置 Nginx**: 复制 Nginx 配置文件
10. **启动脚本**: 复制并配置启动脚本
11. **环境变量**: 设置必要的环境变量
12. **暴露端口**: 暴露 80 端口
13. **健康检查**: 配置健康检查
14. **启动服务**: 运行启动脚本

### 目录结构

```
navgate/
├── apps/
│   ├── frontend/      # 前端应用
│   └── server/        # 后端服务
├── packages/          # 共享包
├── docker/            # Docker 相关配置
│   ├── nginx/         # Nginx 配置
│   └── scripts/       # 启动脚本
├── Dockerfile         # Docker 构建文件
└── docker-compose.yml # Docker Compose 配置
```

## 总结

通过以上步骤，你可以在 Mac 电脑上成功编译和运行 NavGate Docker 镜像。如果遇到任何问题，请参考常见问题解决部分，或查看 Docker 官方文档获取更多帮助。
