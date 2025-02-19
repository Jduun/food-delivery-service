#!/bin/sh

cp -r @app_types ./backend/auth_service/src/
cp -r @app_types ./backend/order_service/src/
cp -r @app_types ./frontend/src/

docker compose down
docker compose up --build
docker exec auth_service sh -c "cd /app/src/db && npx drizzle-kit migrate"
