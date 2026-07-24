FROM node:24-alpine AS build

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG VITE_API_MODE=mock
ARG VITE_BASE_API_URL=/api
ARG VITE_BASE_PATH=/

ENV VITE_API_MODE=$VITE_API_MODE
ENV VITE_BASE_API_URL=$VITE_BASE_API_URL
ENV VITE_BASE_PATH=$VITE_BASE_PATH

RUN pnpm build

FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1
