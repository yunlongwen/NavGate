FROM node:20-alpine AS builder

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm@10

# 复制根目录的 package.json 和 pnpm-lock.yaml（用于 workspace 依赖）
COPY package.json pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/server/package.json ./apps/server/package.json

# 安装依赖
RUN pnpm install --frozen-lockfile --ignore-scripts

# 复制 server 源代码
COPY apps/server/src ./apps/server/src
COPY apps/server/tsconfig.json ./apps/server/tsconfig.json

# 构建
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
COPY --from=builder /app/apps/server/dist ./apps/server/dist

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "apps/server/dist/index.js"]
