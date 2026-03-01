#!/bin/bash

set -e

echo "🚀 开始部署到阿里云..."

# 检查必需的环境变量
required_vars=("ALIYUN_ACCESS_KEY_ID" "ALIYUN_ACCESS_KEY_SECRET" "ALIYUN_REGION")
for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ 错误: $var 环境变量未设置"
    echo "请在 .env 文件中配置以下变量:"
    echo "- ALIYUN_ACCESS_KEY_ID"
    echo "- ALIYUN_ACCESS_KEY_SECRET"
    echo "- ALIYUN_REGION"
    exit 1
  fi
done

# 构建镜像
echo "📦 构建 Docker 镜像..."
docker build -t navgate:latest -f docker/docker-compose.yml .

# 登录阿里云镜像仓库
if [ -n "$ALIYUN_REGISTRY" ]; then
  echo "🔐 登录阿里云镜像仓库..."
  docker login --username=$ALIYUN_REGISTRY_USERNAME --password=$ALIYUN_REGISTRY_PASSWORD $ALIYUN_REGISTRY

  # 推送镜像
  echo "📤 推送镜像到阿里云..."
  docker tag navgate:latest $ALIYUN_REGISTRY/$ALIYUN_REGISTRY_NAMESPACE/navgate:latest
  docker push $ALIYUN_REGISTRY/$ALIYUN_REGISTRY_NAMESPACE/navgate:latest
fi

# 如果配置了 ECS，则部署到 ECS
if [ -n "$ALIYUN_ECS_INSTANCE_ID" ]; then
  echo "🖥️  部署到阿里云 ECS..."

  # 这里需要使用阿里云 CLI 或 SSH 方式部署
  # 由于阿里云 CLI 可能不可用，我们提供 SSH 方式
  if [ -n "$ALIYUN_ECS_SSH_KEY" ]; then
    echo "使用 SSH 方式部署..."

    SSH_HOST=$(aliyun ecs DescribeInstances \
      --InstanceIds.1=$ALIYUN_ECS_INSTANCE_ID \
      --RegionId=$ALIYUN_REGION \
      | grep PublicIpAddress | awk '{print $3}')

    SSH_KEY=$ALIYUN_ECS_SSH_KEY

    echo "SSH 连接到 $SSH_HOST..."
    ssh -i $SSH_KEY root@$SSH_HOST << 'ENDSSH'
      cd /root/navgate
      docker-compose pull
      docker-compose up -d
      docker system prune -f
ENDSSH
  else
    echo "⚠️  未配置 SSH 密钥，跳过自动部署"
    echo "请手动登录到 ECS 服务器执行部署"
  fi
else
  echo "⚠️  未配置 ECS 实例 ID，跳过自动部署"
  echo "请使用以下命令手动部署："
  echo "  docker-compose -f docker/docker-compose.yml up -d"
fi

echo "✅ 部署完成！"
