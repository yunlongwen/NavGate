#!/bin/bash

echo "🔧 Installing Husky and related packages..."

pnpm add -D husky@latest commitlint @commitlint/cli @commitlint/config-conventional @commitlint/config-linter @commitlint/cz @commitlint/format @commitlint/commitlint-plugin @commitlint/cz @commitlint/format @commitlint/cli @cz-conventional-changelog @cz-custom-config @cz-custom-config/prettier @cz-custom-config/git-cz @cz-custom-config/lint-staged @cz-custom-config/lint-staged @cz-custom-config/commitlint-plugin @commitlint/format @commitlint/cz @commitlint/config-conventional
pnpm add -D lint-staged @lint-staged/config-conventional @lint-staged/eslint

echo "✅ Husky installed"
echo ""
echo "Creating Husky configuration..."
