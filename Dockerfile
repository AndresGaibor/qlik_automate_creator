FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock tsconfig.base.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages/contratos/package.json ./packages/contratos/package.json
RUN bun install --frozen-lockfile

FROM deps AS build-api
COPY packages/contratos ./packages/contratos
COPY apps/api ./apps/api
WORKDIR /app/apps/api
RUN bun run build

FROM deps AS build-web
COPY packages/contratos ./packages/contratos
COPY apps/web ./apps/web
WORKDIR /app/apps/web
RUN bun run build

FROM node:22-alpine AS api
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=7823
COPY --from=build-api /app/apps/api/dist ./dist
COPY --from=build-api /app/apps/api/drizzle ./drizzle
EXPOSE 7823
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:7823/api/salud || exit 1
CMD ["node", "dist/node.js"]

FROM nginx:alpine AS web
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-web /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ || exit 1
