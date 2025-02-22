#!/bin/sh

cp -r @app_types ./backend/auth_service/src/
cp -r @app_types ./backend/store_service/src/
cp -r @app_types ./frontend/src/

if [ -f .env ]; then
  set -a
  . ./.env
  set +a
fi

# Uncomment this if you want to delete all db data 
# paths=("AUTH_DB_PATH" "STORE_DB_PATH")

# for path in "${paths[@]}"; do
#   if [ -n "${!path}" ]; then
#     sudo rm -r "${!path}"
#   else
#     echo "$path is not set."
#   fi
# done

docker compose down --remove-orphans
docker compose up -d --build
docker compose stop
docker compose up -d
docker exec auth_service sh -c "cd /app/src/db && npx drizzle-kit generate && npx drizzle-kit migrate"
docker exec store_service sh -c "cd /app/src/db && npx drizzle-kit generate && npx drizzle-kit migrate"
docker compose logs -f