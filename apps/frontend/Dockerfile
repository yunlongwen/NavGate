FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@10

COPY package.json pnpm-lock.yaml ./
COPY packages ./packages
COPY apps/frontend/package.json ./apps/frontend/package.json

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY apps/frontend/src ./apps/frontend/src
COPY apps/frontend/index.html ./apps/frontend/index.html
COPY apps/frontend/vite.config.ts ./apps/frontend/vite.config.ts
COPY apps/frontend/tsconfig.app.json ./apps/frontend/tsconfig.app.json

WORKDIR /app/apps/frontend
RUN pnpm build

FROM nginx:alpine

COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
