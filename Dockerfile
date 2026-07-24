FROM oven/bun:1 AS compilador
WORKDIR /app
COPY package.json bun.lock tsconfig.base.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages/contratos/package.json ./packages/contratos/package.json
RUN bun install --frozen-lockfile
COPY apps/api ./apps/api
COPY packages/contratos ./packages/contratos
RUN bun --cwd apps/api run build

FROM node:22-alpine AS ejecucion
WORKDIR /app
ENV NODE_ENV=production
COPY --from=compilador /app/apps/api/dist ./dist
EXPOSE 3000
CMD ["node", "dist/node.js"]
