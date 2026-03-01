# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装 pnpm
RUN npm install -g pnpm@8

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm --filter frontend build

# 生产阶段
FROM nginx:alpine

# 复制自定义 nginx 配置
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf

# 复制构建产物
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
