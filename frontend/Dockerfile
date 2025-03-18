FROM oven/bun:latest AS builder

WORKDIR /app

COPY package*.json bun.lock ./

RUN bun install

COPY . .

RUN bun run build

# nginx to serve static files
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]