FROM node:alpine as builder

RUN apk add --no-cache curl bash && \
    curl -fsSL https://bun.sh/install | bash

ENV BUN_INSTALL="/root/.bun"
ENV PATH="${BUN_INSTALL}/bin:${PATH}"

COPY package*.json ./

RUN bun install

COPY . .

RUN bun run build

# nginx to serve static files
FROM nginx:stable-alpine

COPY --from=builder /dist /usr/share/nginx/html
COPY --from=builder nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]