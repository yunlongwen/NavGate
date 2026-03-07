#!/bin/sh

# 创建数据目录
mkdir -p /app/data

# 启动后端服务
npx tsx /app/apps/server/src/index.ts &

# 启动 Nginx
nginx -g 'daemon off;'
