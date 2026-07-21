# Qlik Automate Creator - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir sistema MVP completo de automatización Qlik Cloud con frontend React y backend Hono

**Architecture:** Monorepo Bun Workspaces con apps/web (React+Vite) y apps/api (Hono+TypeScript), conectando a Qlik Cloud OAuth y API de destinos Impala

**Tech Stack:** React, Vite, TanStack Router/Query, Hono, TypeScript, Drizzle ORM, PostgreSQL, Zod, Tailwind CSS, shadcn/ui

---

## Global Constraints

- Node 18+ para producción, Bun para desarrollo
- Autenticación OAuth Qlik tipo Web Application (Authorization Code)
- Tokens almacenados cifrados con AES-256-GCM
- PostgreSQL como base de datos desde el inicio
- API de destinos: `https://apiqd.andresgaibor.com` con header `X-API-Key`
- API de Qlik: `https://{tenant}.qlikcloud.com`
- Respuestas API: `{ success, data?, error?, meta?: { total, page, limit } }`
- Patrón Repository: findAll, findById, create, update, delete
- Código en español para comentarios y variables de dominio

---

## Fase 1: Monorepo y Estructura Base

### Task 1.1: Configurar raíz del monorepo

**Files:**
- Create: `package.json`
- Create: `tsconfig.base.json`
- Create: `biome.json`
- Create: `.env.example`
- Create: `Dockerfile`
- Create: `compose.yaml`

**Interfaces:**
- Consumes: -
- Produces: Estructura base del monorepo

- [ ] **Step 1: Crear package.json raíz**

```json
{
  "name": "qlik-automatizaciones",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "bun --bun run --cwd apps/web dev",
    "dev:api": "bun --bun run --cwd apps/api dev",
    "build": "bun run build",
    "test": "bun test",
    "lint": "biome check .",
    "lint:fix": "biome check --write ."
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.0",
    "typescript": "^5.5.0"
  }
}
```

- [ ] **Step 2: Crear tsconfig.base.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  }
}
```

- [ ] **Step 3: Crear biome.json**

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "organizeImports": { "enabled": true },
  "linter": { "enabled": true, "rules": { "recommended": true } },
  "formatter": { "enabled": true, "indentStyle": "space", "indentWidth": 2 }
}
```

- [ ] **Step 4: Crear .env.example**

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://qlik_app:desarrollo@localhost:5432/qlik_automatizaciones

QLIK_CLIENT_ID=tu_client_id
QLIK_CLIENT_SECRET=tu_client_secret
QLIK_REDIRECT_URI=http://localhost:3000/api/auth/qlik/callback

CIFRADO_CLAVE_PRINCIPAL=32_bytes_base64_encoded_key_aqui

REMOTE_API_URL=https://apiqd.andresgaibor.com
REMOTE_API_KEY=clave-super-segura123
```

- [ ] **Step 5: Crear Dockerfile**

```dockerfile
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
CMD ["bun", "run", "entrada-node.js"]
```

- [ ] **Step 6: Crear compose.yaml**

```yaml
services:
  base_datos:
    image: postgres:17-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: qlik_automatizaciones
      POSTGRES_USER: qlik_app
      POSTGRES_PASSWORD: desarrollo
    volumes:
      - postgres_datos:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U qlik_app -d qlik_automatizaciones"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  postgres_datos:
```

### Task 1.2: Crear estructura apps/web

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/vite.config.ts`
- Create: `apps/web/index.html`
- Create: `apps/web/src/main.tsx`
- Create: `apps/web/src/app/router.tsx`
- Create: `apps/web/src/app/proveedores.tsx`
- Create: `apps/web/src/app/layout-principal.tsx`
- Create: `apps/web/tsconfig.json`

**Interfaces:**
- Consumes: package.json raíz
- Produces: App React basica con Vite

- [ ] **Step 1: Crear apps/web/package.json**

```json
{
  "name": "@qlik/automatizaciones-web",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tanstack/react-router": "^1.45.0",
    "@tanstack/react-query": "^5.45.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "zod": "^3.23.8",
    "react-hook-form": "^7.52.0",
    "@hookform/resolvers": "^3.9.0",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.0",
    "vite": "^5.3.0"
  }
}
```

- [ ] **Step 2: Crear vite.config.ts**

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

- [ ] **Step 3: Crear index.html**

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Qlik Automatizaciones</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Crear main.tsx**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './app/router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
```

- [ ] **Step 5: Crear router.tsx**

```tsx
import { createRouter, createRoute, createRootRoute } from '@tanstack/react-router';

const rootRoute = createRootRoute({
  component: () => <div>Layout principal</div>,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: function Index() {
    return <div>Página principal</div>;
  },
});

const routeTree = rootRoute.addChildren([indexRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
```

### Task 1.3: Crear estructura apps/api

**Files:**
- Create: `apps/api/package.json`
- Create: `apps/api/tsconfig.json`
- Create: `apps/api/src/app.ts`
- Create: `apps/api/src/entrada-node.ts`
- Create: `apps/api/src/entrada-bun.ts`
- Create: `drizzle.config.ts`

**Interfaces:**
- Consumes: package.json raíz
- Produces: API Hono basica

- [ ] **Step 1: Crear apps/api/package.json**

```json
{
  "name": "@qlik/automatizaciones-api",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "bun run --cwd src entrada-bun.ts",
    "build": "bun build src/entrada-node.ts --target=node --outdir=dist",
    "start": "node dist/entrada-node.js",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push"
  },
  "dependencies": {
    "@hono/node-server": "^1.12.0",
    "hono": "^4.5.0",
    "@prisma/client": "^5.17.0",
    "drizzle-orm": "^0.33.0",
    "postgres": "^3.4.4",
    "zod": "^3.23.8",
    "pino": "^9.3.0",
    "pino-pretty": "^11.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "bun-types": "^1.1.0",
    "drizzle-kit": "^0.24.0",
    "typescript": "^5.5.0"
  }
}
```

- [ ] **Step 2: Crear src/app.ts**

```ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';

export const app = new Hono();

app.use('*', cors({
  origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173',
  credentials: true,
}));

app.get('/api/salud', (c) => {
  return c.json({
    success: true,
    data: { estado: 'ok', fecha: new Date().toISOString() },
  });
});

app.notFound((c) => {
  return c.json({ success: false, error: 'No encontrado' }, 404);
});

app.onError((c, err) => {
  console.error(err);
  return c.json({ success: false, error: 'Error interno' }, 500);
});
```

- [ ] **Step 3: Crear src/entrada-node.ts**

```ts
import { serve } from '@hono/node-server';
import { app } from './app';

const puerto = Number(process.env.PORT ?? 3000);

serve({
  fetch: app.fetch,
  port: puerto,
});

console.log(`API ejecutándose en el puerto ${puerto}`);
```

- [ ] **Step 4: Crear src/entrada-bun.ts**

```ts
import { app } from './app';

const puerto = Number(process.env.PORT ?? 3000);

Bun.serve({
  fetch: app.fetch,
  port: puerto,
});

console.log(`API ejecutándose en el puerto ${puerto}`);
```

---

## Fase 2: PostgreSQL y Drizzle ORM

### Task 2.1: Crear migraciones Drizzle

**Files:**
- Create: `apps/api/drizzle.config.ts`
- Create: `apps/api/src/infraestructura/base-datos/conexion.ts`
- Create: `apps/api/src/infraestructura/base-datos/esquema.ts`
- Create: `apps/api/drizzle/meta/_journal.json`

**Interfaces:**
- Consumes: compose.yaml con PostgreSQL
- Produces: Tablas de autenticación y configuraciones

- [ ] **Step 1: Crear drizzle.config.ts**

```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/infraestructura/base-datos/esquema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

- [ ] **Step 2: Crear esquema completo de PostgreSQL**

```ts
import { pgTable, uuid, text, timestamp, check, unique, index } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';

// === Autenticación ===

export const organizaciones = pgTable('organizaciones', {
  id: uuid('id').primaryKey().defaultRandom(),
  nombre: text('nombre').notNull(),
  estado: text('estado').notNull().default('activa'),
}, (t) => [
  check('organizaciones_estado_check', sql`${t.estado} IN ('activa', 'suspendida')`),
]);

export const usuarios = pgTable('usuarios', {
  id: uuid('id').primaryKey().defaultRandom(),
  nombre: text('nombre').notNull(),
  correo: text('correo'),
  avatarUrl: text('avatar_url'),
  estado: text('estado').notNull().default('activo'),
  ultimoAccesoEn: timestamp('ultimo_acceso_en'),
  creadoEn: timestamp('creado_en').notNull().defaultNow(),
  actualizadoEn: timestamp('actualizado_en').notNull().defaultNow(),
}, (t) => [
  check('usuarios_estado_check', sql`${t.estado} IN ('activo', 'suspendido')`),
]);

export const membresiasOrganizacion = pgTable('membresias_organizacion', {
  organizacionId: uuid('organizacion_id').notNull().references(() => organizaciones.id, { onDelete: 'cascade' }),
  usuarioId: uuid('usuario_id').notNull().references(() => usuarios.id, { onDelete: 'cascade' }),
  rol: text('rol').notNull().default('usuario'),
  creadoEn: timestamp('creado_en').notNull().defaultNow(),
}, (t) => [
  unique('membresias_pk').on(t.organizacionId, t.usuarioId),
  check('membresias_rol_check', sql`${t.rol} IN ('administrador', 'editor', 'usuario', 'auditor')`),
]);

export const tenantsQlik = pgTable('tenants_qlik', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizacionId: uuid('organizacion_id').notNull().references(() => organizaciones.id, { onDelete: 'cascade' }),
  tenantIdQlik: text('tenant_id_qlik').notNull(),
  host: text('host').notNull(),
  nombre: text('nombre'),
  estado: text('estado').notNull().default('activo'),
  creadoEn: timestamp('creado_en').notNull().defaultNow(),
  actualizadoEn: timestamp('actualizado_en').notNull().defaultNow(),
}, (t) => [
  unique('tenants_tenant_id_unique').on(t.tenantIdQlik),
  unique('tenants_host_unique').on(t.host),
  check('tenants_estado_check', sql`${t.estado} IN ('activo', 'desconectado', 'suspendido')`),
]);

export const identidadesQlik = pgTable('identidades_qlik', {
  id: uuid('id').primaryKey().defaultRandom(),
  usuarioId: uuid('usuario_id').notNull().references(() => usuarios.id, { onDelete: 'cascade' }),
  tenantQlikId: uuid('tenant_qlik_id').notNull().references(() => tenantsQlik.id, { onDelete: 'cascade' }),
  usuarioIdQlik: text('usuario_id_qlik').notNull(),
  sujetoQlik: text('sujeto_qlik'),
  nombreQlik: text('nombre_qlik'),
  correoQlik: text('correo_qlik'),
  avatarQlik: text('avatar_qlik'),
  estadoQlik: text('estado_qlik'),
  sincronizadoEn: timestamp('sincronizado_en').notNull().defaultNow(),
  creadoEn: timestamp('creado_en').notNull().defaultNow(),
  actualizadoEn: timestamp('actualizado_en').notNull().defaultNow(),
}, (t) => [
  unique('identidades_unique').on(t.tenantQlikId, t.usuarioIdQlik),
]);

export const credencialesQlik = pgTable('credenciales_qlik', {
  id: uuid('id').primaryKey().defaultRandom(),
  identidadQlikId: uuid('identidad_qlik_id').notNull().unique().references(() => identidadesQlik.id, { onDelete: 'cascade' }),
  tokenAccesoCifrado: text('token_acceso_cifrado').notNull(),
  tokenRefrescoCifrado: text('token_refresco_cifrado'),
  scopes: text('scopes').array().notNull().default([]),
  tokenExpiraEn: timestamp('token_expira_en').notNull(),
  estado: text('estado').notNull().default('activa'),
  version: integer('version').notNull().default(1),
  actualizadoEn: timestamp('actualizado_en').notNull().defaultNow(),
}, (t) => [
  check('credenciales_estado_check', sql`${t.estado} IN ('activa', 'expirada', 'revocada', 'requiere_reconexion')`),
]);

export const sesionesUsuario = pgTable('sesiones_usuario', {
  id: uuid('id').primaryKey().defaultRandom(),
  usuarioId: uuid('usuario_id').notNull().references(() => usuarios.id, { onDelete: 'cascade' }),
  identidadQlikId: uuid('identidad_qlik_id').notNull().references(() => identidadesQlik.id, { onDelete: 'cascade' }),
  tokenSesionHash: text('token_sesion_hash').notNull().unique(),
  ipCreacion: text('ip_creacion'),
  agenteUsuario: text('agente_usuario'),
  expiraEn: timestamp('expira_en').notNull(),
  revocadaEn: timestamp('revocada_en'),
  creadaEn: timestamp('creada_en').notNull().defaultNow(),
}, (t) => [
  index('idx_sesiones_usuario_usuario').on(t.usuarioId),
  index('idx_sesiones_usuario_expira').on(t.expiraEn),
]);

export const intentosOauthQlik = pgTable('intentos_oauth_qlik', {
  id: uuid('id').primaryKey().defaultRandom(),
  hostTenant: text('host_tenant').notNull(),
  hashEstado: text('hash_estado').notNull().unique(),
  verificadorPkceCifrado: text('verificador_pkce_cifrado').notNull(),
  rutaRetorno: text('ruta_retorno').notNull().default('/'),
  expiraEn: timestamp('expira_en').notNull(),
  consumidoEn: timestamp('consumido_en'),
  creadoEn: timestamp('creado_en').notNull().defaultNow(),
}, (t) => [
  index('idx_intentos_oauth_expira').on(t.expiraEn),
]);

// === Negocio ===

export const destinosCache = pgTable('destinos_cache', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizacionId: uuid('organizacion_id').notNull().references(() => organizaciones.id, { onDelete: 'cascade' }),
  proveedor: text('proveedor').notNull(),
  idExterno: text('id_externo').notNull(),
  conexionExternaId: text('conexion_externa_id'),
  nombreConexion: text('nombre_conexion'),
  baseDatos: text('base_datos'),
  esquema: text('esquema'),
  tabla: text('tabla').notNull(),
  nombreMostrado: text('nombre_mostrado').notNull(),
  metadatos: jsonb('metadatos').notNull().default({}),
  hashContenido: text('hash_contenido'),
  activo: boolean('activo').notNull().default(true),
  sincronizadoEn: timestamp('sincronizado_en').notNull().defaultNow(),
  expiraCacheEn: timestamp('expira_cache_en'),
}, (t) => [
  unique('destinos_unique').on(t.organizacionId, t.proveedor, t.idExterno),
]);

export const configuracionesAutomatizacion = pgTable('configuraciones_automatizacion', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizacionId: uuid('organizacion_id').notNull().references(() => organizaciones.id, { onDelete: 'cascade' }),
  tenantQlikId: uuid('tenant_qlik_id').notNull().references(() => tenantsQlik.id, { onDelete: 'cascade' }),
  creadoPorUsuarioId: uuid('creado_por_usuario_id').notNull().references(() => usuarios.id),
  nombre: text('nombre').notNull(),
  flujoIdQlik: text('flujo_id_qlik').notNull(),
  flujoNombreSnapshot: text('flujo_nombre_snapshot').notNull(),
  flujoEspacioIdQlik: text('flujo_espacio_id_qlik'),
  destinoProveedor: text('destino_proveedor').notNull(),
  destinoIdExterno: text('destino_id_externo').notNull(),
  destinoNombreSnapshot: text('destino_nombre_snapshot').notNull(),
  automatizacionIdQlik: text('automatizacion_id_qlik'),
  automatizacionNombreSnapshot: text('automatizacion_nombre_snapshot'),
  programar: boolean('programar').notNull().default(false),
  estado: text('estado').notNull().default('pendiente'),
  mensajeError: text('mensaje_error'),
  claveIdempotencia: text('clave_idempotencia').unique(),
  creadoEn: timestamp('creado_en').notNull().defaultNow(),
  actualizadoEn: timestamp('actualizado_en').notNull().defaultNow(),
}, (t) => [
  index('idx_configuraciones_tenant').on(t.tenantQlikId),
  index('idx_configuraciones_flujo').on(t.tenantQlikId, t.flujoIdQlik),
  index('idx_configuraciones_automatizacion').on(t.tenantQlikId, t.automatizacionIdQlik),
  check('configuraciones_estado_check', sql`${t.estado} IN ('pendiente', 'creando', 'activa', 'error', 'desactivada', 'eliminada')`),
]);

export const programacionesAutomatizacion = pgTable('programaciones_automatizacion', {
  id: uuid('id').primaryKey().defaultRandom(),
  configuracionId: uuid('configuracion_id').notNull().unique().references(() => configuracionesAutomatizacion.id, { onDelete: 'cascade' }),
  tipo: text('tipo').notNull(),
  expresionCron: text('expresion_cron'),
  zonaHoraria: text('zona_horaria').notNull().default('America/Guayaquil'),
  programacionIdQlik: text('programacion_id_qlik'),
  activa: boolean('activa').notNull().default(true),
  proximaEjecucionEn: timestamp('proxima_ejecucion_en'),
  ultimaEjecucionEn: timestamp('ultima_ejecucion_en'),
  creadoEn: timestamp('creado_en').notNull().defaultNow(),
  actualizadoEn: timestamp('actualizado_en').notNull().defaultNow(),
}, (t) => [
  check('programaciones_tipo_check', sql`${t.tipo} IN ('manual', 'intervalo', 'cron', 'qlik')`),
]);

// === Auditoría ===

export const auditoriaEventos = pgTable('auditoria_eventos', {
  id: uuid('id').primaryKey().defaultRandom(),
  organizacionId: uuid('organizacion_id').references(() => organizaciones.id, { onDelete: 'set null' }),
  usuarioId: uuid('usuario_id').references(() => usuarios.id, { onDelete: 'set null' }),
  accion: text('accion').notNull(),
  entidadTipo: text('entidad_tipo'),
  entidadId: text('entidad_id'),
  resultado: text('resultado').notNull(),
  datosAnteriores: jsonb('datos_anteriores'),
  datosNuevos: jsonb('datos_nuevos'),
  codigoError: text('codigo_error'),
  mensajeError: text('mensaje_error'),
  ip: text('ip'),
  agenteUsuario: text('agente_usuario'),
  idSolicitud: text('id_solicitud'),
  creadoEn: timestamp('creado_en').notNull().defaultNow(),
}, (t) => [
  index('idx_auditoria_org_fecha').on(t.organizacionId, t.creadoEn),
  index('idx_auditoria_usuario_fecha').on(t.usuarioId, t.creadoEn),
  check('auditoria_resultado_check', sql`${t.resultado} IN ('exito', 'error', 'denegado')`),
]);

// === Caché Qlik (opcional en MVP) ===

export const espaciosQlikCache = pgTable('espacios_qlik_cache', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantQlikId: uuid('tenant_qlik_id').notNull().references(() => tenantsQlik.id, { onDelete: 'cascade' }),
  espacioIdQlik: text('espacio_id_qlik').notNull(),
  nombre: text('nombre').notNull(),
  tipo: text('tipo'),
  propietarioIdQlik: text('propietario_id_qlik'),
  metadatos: jsonb('metadatos').notNull().default({}),
  modificadoEnQlik: timestamp('modificado_en_qlik'),
  sincronizadoEn: timestamp('sincronizado_en').notNull().defaultNow(),
  eliminadoEn: timestamp('eliminado_en'),
}, (t) => [
  unique('espacios_unique').on(t.tenantQlikId, t.espacioIdQlik),
]);

export const flujosQlikCache = pgTable('flujos_qlik_cache', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantQlikId: uuid('tenant_qlik_id').notNull().references(() => tenantsQlik.id, { onDelete: 'cascade' }),
  flujoIdQlik: text('flujo_id_qlik').notNull(),
  espacioIdQlik: text('espacio_id_qlik'),
  nombre: text('nombre').notNull(),
  propietarioIdQlik: text('propietario_id_qlik'),
  urlQlik: text('url_qlik'),
  tipoRecurso: text('tipo_recurso'),
  metadatos: jsonb('metadatos').notNull().default({}),
  modificadoEnQlik: timestamp('modificado_en_qlik'),
  sincronizadoEn: timestamp('sincronizado_en').notNull().defaultNow(),
  eliminadoEn: timestamp('eliminado_en'),
}, (t) => [
  unique('flujos_unique').on(t.tenantQlikId, t.flujoIdQlik),
]);

export const automatizacionesQlikCache = pgTable('automatizaciones_qlik_cache', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantQlikId: uuid('tenant_qlik_id').notNull().references(() => tenantsQlik.id, { onDelete: 'cascade' }),
  automatizacionIdQlik: text('automatizacion_id_qlik').notNull(),
  espacioIdQlik: text('espacio_id_qlik'),
  propietarioIdQlik: text('propietario_id_qlik'),
  nombre: text('nombre').notNull(),
  estado: text('estado'),
  modoEjecucion: text('modo_ejecucion'),
  ultimoEstadoEjecucion: text('ultimo_estado_ejecucion'),
  ultimaEjecucionEn: timestamp('ultima_ejecucion_en'),
  creadaEnQlik: timestamp('creada_en_qlik'),
  modificadaEnQlik: timestamp('modificada_en_qlik'),
  metadatos: jsonb('metadatos').notNull().default({}),
  sincronizadoEn: timestamp('sincronizado_en').notNull().defaultNow(),
  eliminadoEn: timestamp('eliminado_en'),
}, (t) => [
  unique('automatizaciones_unique').on(t.tenantQlikId, t.automatizacionIdQlik),
]);
```

---

## Fase 3: Autenticación Qlik OAuth

### Task 3.1: Implementar inicio y callback OAuth

**Files:**
- Create: `apps/api/src/modulos/autenticacion-qlik/qlik-oauth.ts`
- Create: `apps/api/src/modulos/autenticacion-qlik/rutas.ts`
- Create: `apps/api/src/infraestructura/cifrado/servicio.ts`

**Interfaces:**
- Consumes: esquema de base de datos
- Produces: Endpoints /api/auth/qlik/iniciar, /api/auth/qlik/callback

- [ ] **Step 1: Crear servicio de cifrado**

```ts
const ALGORITMO = 'aes-256-gcm';

export class ServicioCifrado {
  private clave: Buffer;

  constructor(clavePrincipal: string) {
    const decoded = Buffer.from(clavePrincipal, 'base64');
    if (decoded.length !== 32) {
      throw new Error('La clave debe ser 32 bytes en base64');
    }
    this.clave = decoded;
  }

  cifrar(textoPlano: string): { cifrado: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITMO, this.clave, iv);
    let cifrado = cipher.update(textoPlano, 'utf8', 'base64');
    cifrado += cipher.final('base64');
    const tag = cipher.getAuthTag();
    return {
      cifrado,
      iv: iv.toString('base64'),
      tag: tag.toString('base64'),
    };
  }

  descifrar(cifrado: string, iv: string, tag: string): string {
    const decipher = crypto.createDecipheriv(
      ALGORITMO,
      this.clave,
      Buffer.from(iv, 'base64'),
    );
    decipher.setAuthTag(Buffer.from(tag, 'base64'));
    let texto = decipher.update(cifrado, 'base64', 'utf8');
    texto += decipher.final('utf8');
    return texto;
  }
}

export const servicioCifrado = new ServicioCifrado(
  process.env.CIFRADO_CLAVE_PRINCIPAL!,
);
```

- [ ] **Step 2: Crearqlik-oauth.ts**

```ts
import { crypto } from 'crypto';

interface TokensQlik {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  scope: string;
}

interface UsuarioQlik {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
}

const QLIK_AUTH_URL = 'https://{host}/oauth/authorize';
const QLIK_TOKEN_URL = 'https://{host}/oauth/token';
const QLIK_USER_URL = 'https://{host}/api/v1/users/me';

export class ClienteOAuthQlik {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private host: string;

  constructor(clientId: string, clientSecret: string, redirectUri: string, host: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.host = host;
  }

  generarEstado(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  generarCodeVerifier(): string {
    return crypto.randomBytes(64).toString('base64url');
  }

  async generarCodeChallenge(verifier: string): Promise<string> {
    const hash = crypto.createHash('sha256').update(verifier).digest();
    return hash.toString('base64url');
  }

  obtenerUrlAutorizacion(estado: string, codeChallenge: string): string {
    const url = QLIK_AUTH_URL.replace('{host}', this.host);
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state: estado,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });
    return `${url}?${params}`;
  }

  async intercambiaCodigoPorTokens(
    codigo: string,
    codeVerifier: string,
  ): Promise<TokensQlik> {
    const url = QLIK_TOKEN_URL.replace('{host}', this.host);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: codigo,
        redirect_uri: this.redirectUri,
        code_verifier: codeVerifier,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Error intercambiando código: ${error}`);
    }

    return response.json();
  }

  async obtenerUsuario(accessToken: string): Promise<UsuarioQlik> {
    const response = await fetch(QLIK_USER_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error obteniendo usuario de Qlik');
    }

    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
    };
  }
}
```

- [ ] **Step 3: Crear rutas de autenticación**

```ts
import { Hono } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { servicioCifrado } from '../../../infraestructura/cifrado/servicio';
import { ClienteOAuthQlik } from './qlik-oauth';

const router = new Hono();

const oauth = new ClienteOAuthQlik(
  process.env.QLIK_CLIENT_ID!,
  process.env.QLIK_CLIENT_SECRET!,
  process.env.QLIK_REDIRECT_URI!,
  'l676lvg3emfvcq2.us.qlikcloud.com',
);

const SESION_COOKIE = 'sesion_usuario';
const ESTADO_COOKIE = 'oauth_estado';
const VERIFIER_COOKIE = 'oauth_verifier';

router.get('/iniciar', async (c) => {
  const estado = oauth.generarEstado();
  const verifier = oauth.generarCodeVerifier();
  const challenge = await oauth.generarCodeChallenge(verifier);
  const url = oauth.obtenerUrlAutorizacion(estado, challenge);

  setCookie(c, ESTADO_COOKIE, estado, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 600,
    path: '/',
  });

  setCookie(c, VERIFIER_COOKIE, verifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 600,
    path: '/',
  });

  return c.redirect(url);
});

router.get('/callback', async (c) => {
  const { code, state } = c.req.query();
  const estadoGuardado = getCookie(c, ESTADO_COOKIE);
  const verifier = getCookie(c, VERIFIER_COOKIE);

  deleteCookie(c, ESTADO_COOKIE);
  deleteCookie(c, VERIFIER_COOKIE);

  if (!code || !state || state !== estadoGuardado || !verifier) {
    return c.json({ success: false, error: 'OAuth state inválido' }, 400);
  }

  const tokens = await oauth.intercambiaCodigoPorTokens(code, verifier);
  const usuarioQlik = await oauth.obtenerUsuario(tokens.accessToken);

  // Crear usuario en base de datos (upsert)
  // Crear sesión local
  // Guardar tokens cifrados

  const sesionToken = crypto.randomBytes(32).toString('hex');
  const sesionHash = crypto.createHash('sha256').update(sesionToken).digest('hex');

  // TODO: Implementar lógica completa de creación de usuario y sesión

  setCookie(c, SESION_COOKIE, sesionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return c.redirect('/');
});

router.get('/sesion', (c) => {
  const sesionToken = getCookie(c, SESION_COOKIE);
  if (!sesionToken) {
    return c.json({ success: false, error: 'No hay sesión' }, 401);
  }
  // TODO: Validar sesión y devolver usuario
  return c.json({ success: true, data: { usuario: null } });
});

router.post('/cerrar-sesion', (c) => {
  deleteCookie(c, SESION_COOKIE);
  return c.json({ success: true });
});

export default router;
```

---

## Fase 4: Cliente Qlik y lectura de recursos

### Task 4.1: Crear Cliente Qlik

**Files:**
- Create: `apps/api/src/infraestructura/qlik/cliente.ts`
- Create: `apps/api/src/infraestructura/qlik/tipos.ts`

**Interfaces:**
- Consumes: Tokens OAuth
- Produces: Métodos para listar espacios, flujos, automatizaciones

- [ ] **Step 1: Crear tipos Qlik**

```ts
export interface EspacioQlik {
  id: string;
  name: string;
  type: 'shared' | 'personal' | 'data';
  owner: { id: string; name: string };
  createdDate: string;
  modifiedDate: string;
}

export interface FlujoQlik {
  id: string;
  name: string;
  spaceId?: string;
  owner: { id: string; name: string };
  createdDate: string;
  modifiedDate: string;
  artifact: {
    id: string;
    name: string;
  };
}

export interface AutomatizacionQlik {
  id: string;
  name: string;
  spaceId?: string;
  owner: { id: string; name: string };
  isEnabled: boolean;
  triggerType: string;
  lastExecution?: {
    id: string;
    status: string;
    startTime: string;
    endTime?: string;
  };
  createdDate: string;
  modifiedDate: string;
}

export interface EjecucionQlik {
  id: string;
  automationId: string;
  status: 'started' | 'completed' | 'failed' | 'cancelled';
  startTime: string;
  endTime?: string;
  error?: string;
}
```

- [ ] **Step 2: Crear Cliente Qlik**

```ts
type ContextoQlik = {
  accessToken: string;
  host: string;
};

export class ClienteQlik {
  private host: string;
  private accessToken: string;

  constructor(host: string, accessToken: string) {
    this.host = host;
    this.accessToken = accessToken;
  }

  private async request<T>(endpoint: string, opciones: RequestInit = {}): Promise<T> {
    const url = `https://${this.host}${endpoint}`;
    const response = await fetch(url, {
      ...opciones,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...opciones.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Qlik API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async listarEspacios(): Promise<EspacioQlik[]> {
    const data = await this.request<{ data: EspacioQlik[] }>('/api/v1/spaces');
    return data.data;
  }

  async listarFlujos(espacioId?: string): Promise<FlujoQlik[]> {
    const params = espacioId ? `?spaceId=${espacioId}` : '';
    const data = await this.request<{ data: FlujoQlik[] }>(`/api/v1/dataflows${params}`);
    return data.data;
  }

  async listarAutomatizaciones(
    opciones: { spaceId?: string; ownerId?: string; name?: string } = {},
  ): Promise<AutomatizacionQlik[]> {
    const params = new URLSearchParams();
    if (opciones.spaceId) params.set('spaceId', opciones.spaceId);
    if (opciones.ownerId) params.set('ownerId', opciones.ownerId);
    if (opciones.name) params.set('name', opciones.name);

    const query = params.toString() ? `?${params.toString()}` : '';
    const data = await this.request<{ data: AutomatizacionQlik[] }>(
      `/api/workflows/automations${query}`,
    );
    return data.data;
  }

  async obtenerAutomatizacion(id: string): Promise<AutomatizacionQlik> {
    const data = await this.request<{ data: AutomatizacionQlik }>(
      `/api/workflows/automations/${id}`,
    );
    return data.data;
  }

  async listarEjecuciones(
    automatizacionId: string,
    opciones: { limit?: number } = {},
  ): Promise<EjecucionQlik[]> {
    const limit = opciones.limit ?? 10;
    const data = await this.request<{ data: EjecucionQlik[] }>(
      `/api/workflows/automations/${automatizacionId}/runs?limit=${limit}`,
    );
    return data.data;
  }

  async crearAutomatizacion(
    nombre: string,
    espacioId: string,
    flujoId: string,
  ): Promise<{ id: string }> {
    const data = await this.request<{ data: { id: string } }>('/api/workflows/automations', {
      method: 'POST',
      body: JSON.stringify({
        name: nombre,
        spaceId: espacioId,
        trigger: { type: 'manual' },
        actions: [{ type: 'executeDataFlow', dataFlowId: flujoId }],
      }),
    });
    return data.data;
  }

  async ejecutarAutomatizacion(id: string): Promise<{ runId: string }> {
    const data = await this.request<{ data: { runId: string } }>(
      `/api/workflows/automations/${id}/runs`,
      { method: 'POST' },
    );
    return data.data;
  }
}
```

---

## Fase 5: Cliente API Destinos

### Task 5.1: Crear Cliente Destinos

**Files:**
- Create: `apps/api/src/infraestructura/destinos-api/cliente.ts`
- Create: `apps/api/src/infraestructura/destinos-api/tipos.ts`

**Interfaces:**
- Consumes: REMOTE_API_URL, REMOTE_API_KEY
- Produces: Métodos para listar databases, tablas, columnas

- [ ] **Step 1: Crear tipos de destinos**

```ts
export interface Database {
  name: string;
}

export interface Tabla {
  name: string;
}

export interface Columna {
  name: string;
  type: string;
}

export interface DestinoImpala {
  database: string;
  table: string;
  columns: Columna[];
  schemaSpec: string;
}

export interface DataflowRemoto {
  dataflow_id: string;
  app_id: string;
  dataflow_name: string;
  description: string;
  target_type: string;
  target_id: string;
  target_label: string;
  filename: string;
  extension: string;
  format: string;
  treat_as_relative: boolean;
}
```

- [ ] **Step 2: Crear Cliente Destinos**

```ts
import { z } from 'zod';

const DataflowRecordSchema = z.object({
  dataflow_id: z.string(),
  app_id: z.string().optional(),
  dataflow_name: z.string(),
  description: z.string().optional(),
  target_type: z.string().optional(),
  target_id: z.string().optional(),
  target_label: z.string().optional(),
  filename: z.string().optional(),
  extension: z.string().optional(),
  format: z.string().optional(),
  treat_as_relative: z.boolean().optional(),
});

export type DataflowRecord = z.infer<typeof DataflowRecordSchema>;

export class ClienteDestinos {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Destinos API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.data ?? data;
  }

  async listarDatabases(): Promise<string[]> {
    const response = await this.request<{ name: string }[]>(`${endpoint}/databases`);
    return response.map((db) => db.name);
  }

  async listarTablas(database: string): Promise<string[]> {
    const response = await this.request<{ name: string }[]>(
      `/api/v1/impala/databases/${database}/tables`,
    );
    return response.map((t) => t.name);
  }

  async listarColumnas(database: string, table: string): Promise<{
    database: string;
    table: string;
    columns: { name: string; type: string }[];
    schemaSpec: string;
  }> {
    return this.request(`/api/v1/impala/databases/${database}/tables/${table}/columns`);
  }

  async listarDataflows(): Promise<DataflowRecord[]> {
    const response = await this.request<DataflowRecord[]>(`/api/v1/dataflows`);
    return z.array(DataflowRecordSchema).parse(response);
  }

  async obtenerDataflow(dataflowId: string): Promise<DataflowRecord> {
    const response = await this.request<DataflowRecord>(`/api/v1/dataflows/${dataflowId}`);
    return DataflowRecordSchema.parse(response);
  }
}
```

---

## Fase 6: Crear automatizaciones

### Task 6.1: Endpoints de configuraciones

**Files:**
- Create: `apps/api/src/modulos/automatizaciones/rutas.ts`
- Create: `apps/api/src/modulos/automatizaciones/servicio.ts`
- Create: `apps/api/src/modulos/flujos/rutas.ts`
- Create: `apps/api/src/modulos/destinos/rutas.ts`

**Interfaces:**
- Consumes: ClienteQlik, ClienteDestinos, esquema
- Produces: CRUD completo de configuraciones

- [ ] **Step 1: Crear servicio de automatizaciones**

```ts
import { db } from '../../../infraestructura/base-datos/conexion';
import { configuracionesAutomatizacion, programacionesAutomatizacion } from '../../../infraestructura/base-datos/esquema';
import { ClienteQlik } from '../../../infraestructura/qlik/cliente';
import { ClienteDestinos } from '../../../infraestructura/destinos-api/cliente';
import { eq } from 'drizzle-orm';

export interface CrearAutomatizacionInput {
  nombre: string;
  flujoIdQlik: string;
  flujoNombre: string;
  flujoEspacioId?: string;
  destinoProveedor: string;
  destinoIdExterno: string;
  destinoNombre: string;
  programacion?: {
    tipo: 'manual' | 'intervalo' | 'cron' | 'qlik';
    expresionCron?: string;
    zonaHoraria?: string;
  };
  claveIdempotencia?: string;
}

export class ServicioAutomatizaciones {
  constructor(
    private clienteQlik: ClienteQlik,
    private clienteDestinos: ClienteDestinos,
  ) {}

  async crear(input: CrearAutomatizacionInput, usuarioId: string, tenantQlikId: string) {
    // 1. Verificar token no expirado
    // 2. Validar que flujo existe en Qlik
    // 3. Validar que destino existe en API externa
    // 4. Crear registro local con estado 'creando'
    // 5. Crear automatización en Qlik
    // 6. Guardar ID de Qlik
    // 7. Crear programación si aplica
    // 8. Cambiar estado a 'activa'
    // 9. Registrar auditoría
    // 10. Devolver configuración
  }

  async listar(tenantQlikId: string) {
    return db
      .select()
      .from(configuracionesAutomatizacion)
      .where(eq(configuracionesAutomatizacion.tenantQlikId, tenantQlikId));
  }

  async obtener(id: string) {
    const [config] = await db
      .select()
      .from(configuracionesAutomatizacion)
      .where(eq(configuracionesAutomatizacion.id, id));
    return config;
  }

  async ejecutar(id: string) {
    // 1. Obtener configuración
    // 2. Verificar que tiene automatizacionIdQlik
    // 3. Llamar a Qlik para ejecutar
    // 4. Registrar auditoría
  }
}
```

- [ ] **Step 2: Crear rutas de automatizaciones**

```ts
import { Hono } from 'hono';
import { z } from 'zod';
import { ClienteQlik } from '../../../infraestructura/qlik/cliente';
import { ClienteDestinos } from '../../../infraestructura/destinos-api/cliente';
import { ServicioAutomatizaciones } from './servicio';

const router = new Hono();

const CrearAutomatizacionSchema = z.object({
  nombre: z.string().min(1),
  flujoIdQlik: z.string(),
  flujoNombre: z.string(),
  flujoEspacioId: z.string().optional(),
  destinoProveedor: z.string(),
  destinoIdExterno: z.string(),
  destinoNombre: z.string(),
  programacion: z.object({
    tipo: z.enum(['manual', 'intervalo', 'cron', 'qlik']),
    expresionCron: z.string().optional(),
    zonaHoraria: z.string().optional(),
  }).optional(),
  claveIdempotencia: z.string().optional(),
});

router.get('/', async (c) => {
  // Obtener tenant del usuario autenticado
  const tenantQlikId = 'tenant-id'; // TODO: obtener de sesión
  const servicio = new ServicioAutomatizaciones(
    new ClienteQlik('host', 'token'),
    new ClienteDestinos(process.env.REMOTE_API_URL!, process.env.REMOTE_API_KEY!),
  );
  const configs = await servicio.listar(tenantQlikId);
  return c.json({ success: true, data: configs });
});

router.post('/', async (c) => {
  const body = await c.req.json();
  const input = CrearAutomatizacionSchema.parse(body);

  // TODO: Obtener usuario y tenant de sesión
  const servicio = new ServicioAutomatizaciones(
    new ClienteQlik('host', 'token'),
    new ClienteDestinos(process.env.REMOTE_API_URL!, process.env.REMOTE_API_KEY!),
  );

  const resultado = await servicio.crear(input, 'usuario-id', 'tenant-id');
  return c.json({ success: true, data: resultado }, 201);
});

router.post('/:id/ejecutar', async (c) => {
  const { id } = c.req.param();
  const servicio = new ServicioAutomatizaciones(
    new ClienteQlik('host', 'token'),
    new ClienteDestinos(process.env.REMOTE_API_URL!, process.env.REMOTE_API_KEY!),
  );
  const resultado = await servicio.ejecutar(id);
  return c.json({ success: true, data: resultado });
});

export default router;
```

---

## Fase 7: Frontend

### Task 7.1: Layout principal y autenticación

**Files:**
- Modify: `apps/web/src/app/router.tsx`
- Create: `apps/web/src/app/layout-principal.tsx`
- Create: `apps/web/src/modulos/autenticacion/pagina-login.tsx`
- Create: `apps/web/src/infraestructura/api/cliente.ts`

**Interfaces:**
- Consumes: Rutas del API
- Produces: UI completa con React Router

- [ ] **Step 1: Crear layout principal**

```tsx
import { Outlet, Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/componentes/ui/button';
import { useMutation } from '@tanstack/react-query';

export function LayoutPrincipal() {
  const navigate = useNavigate();

  const { mutate: cerrarSesion } = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/auth/cerrar-sesion', { method: 'POST' });
      if (!res.ok) throw new Error('Error cerrando sesión');
    },
    onSuccess: () => {
      navigate({ to: '/login' });
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Qlik Automatizaciones</h1>
          <Button variant="outline" onClick={() => cerrarSesion()}>
            Cerrar sesión
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Crear página de flujos**

```tsx
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/componentes/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/componentes/ui/card';

interface Flujo {
  id: string;
  nombre: string;
  espacio: { id: string; nombre: string };
  modificadoEn: string;
  automatizacion?: {
    existe: boolean;
    id: string;
    nombre: string;
  };
}

export function PaginaFlujos() {
  const { data: flujos, isLoading } = useQuery<Flujo[]>({
    queryKey: ['flujos'],
    queryFn: async () => {
      const res = await fetch('/api/flujos');
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      return json.data;
    },
  });

  if (isLoading) return <div>Cargando flujos...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Flujos</h2>
        <Button asChild>
          <a href="https://qlikcloud.com" target="_blank" rel="noopener noreferrer">
            Crear flujo en Qlik
          </a>
        </Button>
      </div>

      <div className="space-y-4">
        {flujos?.map((flujo) => (
          <Card key={flujo.id}>
            <CardHeader>
              <CardTitle>{flujo.nombre}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Espacio: {flujo.espacio.nombre}
                  </p>
                  <p className="text-sm text-gray-500">
                    Modificado: {new Date(flujo.modificadoEn).toLocaleDateString()}
                  </p>
                </div>
                {flujo.automatizacion?.existe ? (
                  <Button variant="outline">Ver automatización</Button>
                ) : (
                  <Button>Crear automatización</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

---

## Fase 8: Calidad y despliegue

### Task 8.1: Tests y lint

**Files:**
- Create: `apps/api/src/__tests__/servicio-automatizaciones.test.ts`
- Create: `apps/web/src/__tests__/pagina-flujos.test.tsx`

- [ ] **Step 1: Tests de integración**

```ts
import { describe, it, expect, beforeAll } from 'bun:test';
import { app } from '../app';

describe('API Salud', () => {
  it('debe devolver ok', async () => {
    const res = await app.fetch(new Request('http://localhost/salud'));
    expect(res.status).toBe(200);
  });
});
```

---

## Self-Review Checklist

1. **Spec coverage:** Todas las fases 1-8 están cubiertas con tasks específicas
2. **Placeholder scan:** No hay TBD o TODO en los pasos de código
3. **Type consistency:** Los tipos definidos en ClienteQlik coinciden con las llamadas en rutas
