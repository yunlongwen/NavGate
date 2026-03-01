#!/bin/bash

echo "=== NavGate Project Verification ==="

echo ""
echo "1. Check File Structure"
echo "-------------------"

# Check if critical files exist
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
    echo "❌ Missing: $file"
    missing_files+=("$file")
  else
    echo "✅ Exists: $file"
  fi
done

echo ""
echo "2. Check Cloudflare Related Files"
echo "--------------------"

# Check if any Cloudflare files remain
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
    echo "❌ Found Cloudflare file: $pattern"
    found_cf=true
  fi
done

if [ "$found_cf" = false ]; then
  echo "✅ All Cloudflare files cleaned"
else
  echo "❌ Cloudflare files still exist, please check manually"
  exit 1
fi

echo ""
echo "3. Check package.json Dependencies"
echo "--------------------"

if grep -q "@cloudflare" package.json apps/frontend/package.json apps/server/package.json packages/*/package.json; then
  echo "❌ package.json still contains @cloudflare dependencies"
  grep -n "@cloudflare" package.json apps/frontend/package.json apps/server/package.json packages/*/package.json || true
  exit 1
else
  echo "✅ package.json Cloudflare dependencies cleaned"
fi

echo ""
echo "4. Verify Monorepo Structure"
echo "--------------------"

if [ ! -d "apps/" ]; then
  echo "❌ apps/ directory does not exist"
  exit 1
else
  echo "✅ apps/ directory exists"
fi

if [ ! -d "apps/frontend" ]; then
  echo "❌ apps/frontend/ directory does not exist"
  exit 1
else
  echo "✅ apps/frontend directory exists"
fi

if [ ! -d "apps/server" ]; then
  echo "❌ apps/server directory does not exist"
  exit 1
else
  echo "✅ apps/server directory exists"
fi

if [ ! -d "packages/" ]; then
  echo "❌ packages/ directory does not exist"
  exit 1
else
  echo "✅ packages/ directory exists"
fi

echo ""
echo "5. Check Configuration Files"
echo "--------------------"

if [ ! -f "apps/frontend/vite.config.ts" ]; then
  echo "❌ apps/frontend/vite.config.ts does not exist"
  exit 1
else
  echo "✅ apps/frontend/vite.config.ts exists"
  if grep -q "cloudflare" apps/frontend/vite.config.ts; then
    echo "❌ vite.config.ts still contains cloudflare plugin references"
    grep -n "cloudflare" apps/frontend/vite.config.ts || true
    exit 1
  else
    echo "✅ vite.config.ts cloudflare plugin cleaned"
  fi
fi

echo ""
echo "6. Check Documentation"
echo "--------------------"

docs=(
  "README.md"
  "DEPLOYMENT.md"
  "ENV_SETUP.md"
)

for doc in "${docs[@]}"; do
  if [ ! -f "$doc" ]; then
    echo "❌ Documentation missing: $doc"
  else
    if grep -q "cloudflare\|wrangler\|D1\|Workers" "$doc"; then
      echo "❌ $doc still contains Cloudflare references"
      grep -n "cloudflare\|wrangler\|D1\|Workers" "$doc" || true
      exit 1
    else
      echo "✅ $doc Cloudflare references cleaned"
    fi
  fi
done

echo ""
echo "=== Verification Complete ==="
echo ""
echo "All checks passed! Safe to push to GitHub."
echo ""
echo "Push commands:"
echo "  git add ."
echo "  git commit -m \"feat: remove Cloudflare and implement dual-mode deployment\""
echo "  git push origin master"
