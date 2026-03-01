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

# 构建 TypeScript
RUN pnpm --filter server build

# 生产阶段
FROM node:20-alpine

WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装 pnpm
RUN npm install -g pnpm@8

# 只安装生产依赖
RUN pnpm install --prod --frozen-lockfile

# 复制构建产物
COPY --from=builder /app/apps/server/dist ./dist

# 复制 Prisma 生成文件
COPY --from=builder /app/apps/server/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/apps/server/prisma ./prisma

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 启动应用
CMD ["node", "dist/index.js"]
