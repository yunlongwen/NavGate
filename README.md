# NavGate

个人网站导航管理系统，支持三种部署模式：localStorage（默认）、GitHub Gist 同步和 Docker 部署。

## 项目特点

- **多部署模式**：支持本地存储、GitHub Gist 同步和 Docker 容器化部署
- **响应式设计**：适配不同屏幕尺寸
- **拖拽排序**：支持分组和站点的拖拽排序
- **搜索功能**：快速查找站点
- **主题切换**：支持浅色/深色模式

## 部署方式

### 1. GitHub Gist 部署

**配置步骤**：

1. 在 GitHub 上创建一个新的 Gist
2. 生成一个具有 `gist` 权限的 GitHub Token
3. 在应用中设置以下环境变量：
   - `VITE_DEPLOY_MODE=gist`
   - `VITE_GIST_ID=your_gist_id`
   - `VITE_GITHUB_TOKEN=your_github_token`

**优势**：

- 跨设备同步数据
- 无需服务器
- 免费存储

### 2. Docker 部署

**快速启动**：

```bash
# 构建镜像
docker build -t navgate:latest .

# 运行容器
docker run -d \
  -p 80:80 \
  -v navgate_data:/app/data \
  -e AUTH_USERNAME=admin \
  -e AUTH_PASSWORD=admin123 \
  --name navgate \
  navgate:latest
```

**访问地址**：

- 前端应用：http://localhost
- API 接口：http://localhost/api
- 健康检查：http://localhost/health

**优势**：

- 完整的后端服务
- 数据持久化存储
- 易于部署和管理

## 开发环境

```bash
# 安装依赖
pnpm install

# 启动前端开发服务器
pnpm dev

# 启动后端开发服务器
pnpm dev:backend
```

## 技术栈

- **前端**：React 19、Material UI 7.0、Tailwind CSS 4.1、Vite
- **后端**：Express.js、JSON 文件存储
- **部署**：Docker、GitHub Gist

## 许可证

MIT
