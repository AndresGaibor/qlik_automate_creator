# Qlik Automate Creator

Aplicación web para consultar, ejecutar y crear automatizaciones de Qlik a partir de una automatización base. El backend expone una API REST en español con OAuth 2.0 + PKCE para autenticación con Qlik Cloud.

## Requisitos

- Docker y Docker Compose
- Git

## Despliegue — 0 configuración manual

```bash
git clone https://github.com/AndresGaibor/qlik_automate_creator.git
cd qlik_automate_creator
cp .env.example .env
docker compose up -d
```

Listo. Abre **http://<ip-del-servidor>:3847** y completa el wizard de configuración inicial.

---

## Puertos por defecto

| Servicio | Puerto |
|---|---|
| Frontend (nginx) | 3847 |
| API (Bun) | 7823 |
| PostgreSQL | 5432 (interno) |

---

## Configuración

Todo se configura desde la interfaz. Las variables de `.env` son opcionales — los defaults funcionan.

### `.env` — lo único que podrías necesitar cambiar

```bash
# Acceso por IP (default — no necesita dominio)
HOST_IP=0.0.0.0

# Si tienes dominio:
SERVER_NAME=api.midominio.com

# Cambiar puertos (opcional):
PORT_WEB=3847
PORT_API=7823
```

### Docker Compose levanta todo

- **PostgreSQL** — base de datos con usuario y contraseña por defecto
- **API** — backend Bun en puerto interno 7823
- **Frontend** — nginx + static en puerto 3847

Las tablas se crean automáticamente al primer arranque.

---

## Wizard de configuración inicial

Consulta la guía completa de producción, Cloudflare Tunnel, OAuth, migraciones,
identidades y diagnóstico en
[`docs/setup/CONFIGURACION-PRODUCCION.md`](docs/setup/CONFIGURACION-PRODUCCION.md).

Al abrir la app por primera vez:

1. **Organización** — nombre de tu organización
2. **Conexión Qlik Cloud** — host del tenant, Client ID, Client Secret, scopes editables. La URI de redirección se muestra para que la copies en Qlik Cloud
3. **Superadministrador** — nombre y correo

Después del wizard → `/login` → autenticación OAuth con Qlik Cloud.

---

## Dominio propio y Cloudflare

```bash
# .env
SERVER_NAME=api.midominio.com
HOST_IP=0.0.0.0
PORT_WEB=80
PORT_API=7823
```

1. Crea un túnel de Cloudflare en [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Apunta el túnel a `http://localhost:3847`
3. Configura el DNS: `api.midominio.com` → túnel
4. `docker compose up -d`

SSL se maneja en Cloudflare (el tráfico llega en HTTPS a Cloudflare, se reenvía en HTTP al servidor).

---

## Gestión de superadministradores

Después del primer login, accede a `/admin/superadmins` para agregar o eliminar superadministradores.

---

## Comandos útiles

```bash
# Ver logs
docker compose logs -f

# Reiniciar
docker compose restart

# Actualizar (reconstruir)
git pull
docker compose up -d --build

# Detener
docker compose down

# Reset completo (borra todo)
docker compose down -v
docker compose up -d

# Conectarse a PostgreSQL
docker compose exec postgres psql -U qlik_app -d qlik_automatizaciones
```

---

## Arquitectura

Backend: **monolito modular** con Clean Architecture y arquitectura hexagonal

```
apps/api/src/
├── app.ts              # composition root
├── entradas/           # Bun, Node y Cloudflare Worker
├── plataforma/         # HTTP, configuración, persistencia
├── nucleo/             # auditoría, eventos, idempotencia
└── modulos/
    ├── autenticacion-qlik/
    ├── automatizaciones/
    ├── destinos/
    ├── flujos/
    ├── qlik/
    └── setup/          # wizard de configuración inicial

packages/contratos/     # Zod y DTO compartidos con React
apps/web/               # React + TanStack Router + TanStack Query
```

Tecnologías: React 18, Vite, Hono, PostgreSQL, Drizzle ORM, OAuth 2.0 + PKCE, AES-256-GCM.

---

## Desarrollo local

```bash
cp .env.example .env
bun install
docker compose up -d
bun run dev:api   # API en http://localhost:7823
bun run dev       # Frontend en http://localhost:5173
```

---

## Calidad

```bash
bun run typecheck
bun run test
bun run lint
bun run build
```
