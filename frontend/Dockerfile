# Stage 1: Build static assets using Node Alpine to minimize intermediate footprint.
FROM node:22-alpine AS builder

WORKDIR /app

# Copying package manifests separately leverages Docker layer caching for npm dependencies.
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve compiled assets using high-performance lightweight Nginx web server.
FROM nginx:alpine

# Custom Nginx config handles client SPA routing and container-to-container API proxying.
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
