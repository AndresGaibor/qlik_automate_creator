# ============================================================
# Stage 1: Install dependencies
# ============================================================
FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock tsconfig.base.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages/contratos/package.json ./packages/contratos/package.json
RUN bun install --frozen-lockfile

# ============================================================
# Stage 2: Build contracts
# ============================================================
FROM deps AS build-contratos
WORKDIR /app
COPY packages/contratos ./packages/contratos
RUN bun --cwd packages/contratos run build

# ============================================================
# Stage 3: Build API
# ============================================================
FROM deps AS build-api
COPY --from=build-contratos /app/packages/contratos/dist ./packages/contratos/dist
COPY packages/contratos/package.json ./packages/contratos/package.json
COPY apps/api ./apps/api
RUN bun --cwd apps/api run build

# ============================================================
# Stage 4: Build Frontend
# ============================================================
FROM deps AS build-web
COPY --from=build-contratos /app/packages/contratos/dist ./packages/contratos/dist
COPY packages/contratos/package.json ./packages/contratos/package.json
COPY apps/web ./apps/web
RUN bun --cwd apps/web run build

# ============================================================
# Stage 5: API runtime (Node)
# ============================================================
FROM node:22-alpine AS api
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build-api /app/apps/api/dist ./dist
COPY --from=build-api /app/apps/api/node_modules ./node_modules
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/salud || exit 1
CMD ["node", "dist/node.js"]

# ============================================================
# Stage 5b: Frontend runtime (nginx)
# ============================================================
FROM nginx:alpine AS web
COPY --from=build-web /app/apps/web/dist /usr/share/nginx/html
# nginx.conf se provee vía volumen o config_path
EXPOSE 80
