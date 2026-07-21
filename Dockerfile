FROM oven/bun:1 AS builder
WORKDIR /app
COPY package.json bun.lock ./
COPY apps/api ./apps/api
COPY apps/web ./apps/web
COPY packages ./packages
RUN bun install --frozen-lockfile
RUN bun run --cwd apps/api build

FROM oven/bun:1 AS runtime
WORKDIR /app
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
RUN bun install --production
EXPOSE 3000
CMD ["bun", "run", "dist/entrada-node.js"]
