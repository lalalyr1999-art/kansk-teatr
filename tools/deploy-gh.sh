#!/bin/sh
# Сборка и выкладка на GitHub Pages (ветка gh-pages). Запуск: sh tools/deploy-gh.sh
set -e
cd "$(dirname "$0")/.."
rm -rf dist
MSYS_NO_PATHCONV=1 npx vite build --base=/kansk-teatr/
python -I tools/gh-fix.py dist
touch dist/.nojekyll
cd dist
rm -rf .git
git init -q -b gh-pages
git add -A
git -c user.name=lalalyr1999-art -c user.email=lalalyr1999-art@users.noreply.github.com commit -qm "Сборка сайта"
git -c http.sslBackend=openssl push -qf https://github.com/lalalyr1999-art/kansk-teatr.git gh-pages
rm -rf .git
echo "ok: https://lalalyr1999-art.github.io/kansk-teatr/"
