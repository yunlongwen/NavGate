FROM node:20-alpine AS builder

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm@10

# 复制根目录的 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./
COPY packages ./packages

# 复制前端和后端的 package.json
COPY apps/frontend/package.json ./apps/frontend/package.json
COPY apps/server/package.json ./apps/server/package.json

# 安装依赖
RUN pnpm install --frozen-lockfile --ignore-scripts

# 复制前端源代码并构建
COPY apps/frontend/src ./apps/frontend/src
COPY apps/frontend/index.html ./apps/frontend/index.html
COPY apps/frontend/vite.config.ts ./apps/frontend/vite.config.ts
COPY apps/frontend/tsconfig.json ./apps/frontend/tsconfig.json
COPY apps/frontend/tsconfig.app.json ./apps/frontend/tsconfig.app.json
COPY apps/frontend/src/vite-env.d.ts ./apps/frontend/src/vite-env.d.ts

WORKDIR /app/apps/frontend
RUN pnpm build

# 复制后端源代码并构建
WORKDIR /app
COPY apps/server/src ./apps/server/src
COPY apps/server/tsconfig.json ./apps/server/tsconfig.json

WORKDIR /app/apps/server
RUN pnpm build

# 生产阶段
FROM node:20-alpine

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm@10

# 复制 package.json 并安装生产依赖
COPY package.json pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/server/package.json ./apps/server/package.json
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# 复制构建产物
COPY --from=builder /app/apps/frontend/dist ./apps/frontend/dist
COPY --from=builder /app/apps/server/dist ./apps/server/dist

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
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:80/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 启动服务
CMD ["/app/start.sh"]
