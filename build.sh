#!/bin/sh

cp -r @app_types ./backend/auth_service/src/
cp -r @app_types ./backend/order_service/src/
cp -r @app_types ./frontend/src/

if [ -f .env ]; then
  set -a
  . ./.env
  set +a
fi

if [ -n "${AUTH_DB_PATH}" ]; then
  sudo rm -r "${AUTH_DB_PATH}"
else
  echo "AUTH_DB_PATH is not set."
fi

docker compose down
docker compose up -d --build
docker compose stop
docker compose up -d
docker exec auth_service sh -c "cd /app/src/db && npx drizzle-kit migrate"
docker compose logs -f
