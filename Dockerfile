# 使用 Node.js 20 作为基础镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm@10

# 复制所有文件
COPY . .

# 安装所有依赖
ENV CI=true
RUN pnpm install --frozen-lockfile --verbose

# 构建前端
WORKDIR /app/apps/frontend
ENV VITE_DEPLOY_MODE=backend
RUN npx vite build

# 构建后端（跳过TypeScript编译，使用tsx直接运行）
WORKDIR /app/apps/server

# 安装 Nginx
RUN apk add --no-cache nginx

# 配置 Nginx
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf

# 复制启动脚本
COPY docker/scripts/start.sh /app/start.sh
RUN chmod +x /app/start.sh

# 环境变量
ARG AUTH_USERNAME=admin
ARG AUTH_PASSWORD=admin123

ENV NODE_ENV=production
ENV PORT=3000
ENV AUTH_USERNAME=${AUTH_USERNAME}
ENV AUTH_PASSWORD=${AUTH_PASSWORD}
ENV JSON_DB_PATH=/app/data/nav-data.json

# 暴露端口
EXPOSE 3456

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3456/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 启动服务
CMD ["/app/start.sh"]
