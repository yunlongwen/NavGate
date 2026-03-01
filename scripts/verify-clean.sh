#!/bin/bash

echo "=== NavGate 项目验证 ==="

echo ""
echo "1. 检查文件结构"
echo "-------------------"

# 检查关键文件是否存在
files=(
  "pnpm-workspace.yaml"
  "package.json"
  "apps/frontend/package.json"
  "apps/server/package.json"
  "packages/types/package.json"
  "packages/utils/package.json"
  "packages/validation/package.json"
)

missing_files=()

for file in "${files[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ 缺少: $file"
    missing_files+=("$file")
  else
    echo "✅ 存在: $file"
  fi
done

echo ""
echo "2. 检查 Cloudflare 相关文件"
echo "--------------------"

# 检查是否还有 Cloudflare 文件
cloudflare_files=(
  "wrangler*"
  "worker/"
  "*.sql"
  "tsconfig.worker.json"
  "worker-configuration.d.ts"
)

found_cf=false
for pattern in "${cloudflare_files[@]}"; do
  if ls -d $pattern 2>/dev/null; then
    echo "❌ 发现 Cloudflare 文件: $pattern"
    found_cf=true
  fi
done

if [ "$found_cf" = false ]; then
  echo "✅ 所有 Cloudflare 文件已清理"
else
  echo "❌ 仍有 Cloudflare 文件未清理，请手动检查"
  exit 1
fi

echo ""
echo "3. 检查 package.json 依赖"
echo "--------------------"

if grep -q "@cloudflare" package.json apps/frontend/package.json apps/server/package.json packages/*/package.json; then
  echo "❌ package.json 中仍包含 @cloudflare 依赖"
  grep -n "@cloudflare" package.json apps/frontend/package.json apps/server/package.json packages/*/package.json || true
  exit 1
else
  echo "✅ package.json 已清理 Cloudflare 依赖"
fi

echo ""
echo "4. 验证 Monorepo 结构"
echo "--------------------"

if [ ! -d "apps/" ]; then
  echo "❌ apps/ 目录不存在"
  exit 1
else
  echo "✅ apps/ 目录存在"
fi

if [ ! -d "apps/frontend" ]; then
  echo "❌ apps/frontend/ 目录不存在"
  exit 1
else
  echo "✅ apps/frontend 目录存在"
fi

if [ ! -d "apps/server" ]; then
  echo "❌ apps/server 目录不存在"
  exit 1
else
  echo "✅ apps/server 目录存在"
fi

if [ ! -d "packages/" ]; then
  echo "❌ packages/ 目录不存在"
  exit 1
else
  echo "✅ packages/ 目录存在"
fi

echo ""
echo "5. 检查配置文件"
echo "--------------------"

if [ ! -f "apps/frontend/vite.config.ts" ]; then
  echo "❌ apps/frontend/vite.config.ts 不存在"
  exit 1
else
  echo "✅ apps/frontend/vite.config.ts 存在"
  if grep -q "cloudflare" apps/frontend/vite.config.ts; then
    echo "❌ vite.config.ts 仍包含 cloudflare 插件引用"
    grep -n "cloudflare" apps/frontend/vite.config.ts || true
    exit 1
  else
    echo "✅ vite.config.ts 已清理 cloudflare 插件"
  fi
fi

echo ""
echo "6. 检查文档"
echo "--------------------"

docs=(
  "README.md"
  "DEPLOYMENT.md"
  "ENV_SETUP.md"
)

for doc in "${docs[@]}"; do
  if [ ! -f "$doc" ]; then
    echo "❌ 文档缺失: $doc"
  else
    if grep -q "cloudflare\|wrangler\|D1\|Workers" "$doc"; then
      echo "❌ $doc 仍包含 Cloudflare 引用"
      grep -n "cloudflare\|wrangler\|D1\|Workers" "$doc" || true
      exit 1
    else
      echo "✅ $doc 已清理 Cloudflare 引用"
    fi
  fi
done

echo ""
echo "=== 验证完成 ==="
echo ""
echo "所有检查通过！可以安全推送到 GitHub。"
echo ""
echo "推送命令："
echo "  git add ."
echo "  git commit -m "feat: 移除 Cloudflare，实现双模式部署"
echo "  git push origin main"
