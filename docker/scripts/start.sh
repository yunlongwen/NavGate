#!/bin/sh

# 创建数据目录
mkdir -p /app/data

# 启动后端服务
node /app/apps/server/dist/index.js &

# 启动 Nginx
nginx -g 'daemon off;'
