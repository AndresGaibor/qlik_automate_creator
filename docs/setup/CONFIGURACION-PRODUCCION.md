# Configuración de Producción

Guía operativa para desplegar Qlik Automate Creator con Docker, PostgreSQL,
Cloudflare Tunnel y OAuth de Qlik Cloud.

> Estado: CONFIRMADO
> Esta guía refleja la configuración implementada en el repositorio y los
> problemas comprobados durante el despliegue.

## Arquitectura Publicada

```text
Navegador
  ↓ HTTPS
Cloudflare Tunnel
  ↓ HTTP localhost:3847
Contenedor web (nginx)
  ├── /       → frontend React/Vite
  └── /api/* → contenedor api:7823
                    ↓
                PostgreSQL
```

El frontend y la API se publican por el mismo dominio. No hace falta crear un
DNS separado para frontend y backend.

## Primer Despliegue

```bash
git clone https://github.com/AndresGaibor/qlik_automate_creator.git
cd qlik_automate_creator
cp .env.example .env
docker compose up -d
```

La aplicación web queda en `http://<servidor>:3847` y la API en el puerto
interno `7823`.

Para Cloudflare Tunnel, `.env` no necesita contener el dominio ni las
credenciales OAuth. El wizard guarda la URL pública y la configuración OAuth
en PostgreSQL.

## Migraciones Y Datos

Al iniciar la API, el entrypoint Node ejecuta automáticamente las migraciones
SQL de `apps/api/drizzle/` y asegura las tablas auxiliares.

El usuario final no debe ejecutar `drizzle-kit`, `psql` ni INSERTs manuales para
crear tablas o completar el setup.

El volumen `postgres_data` contiene toda la configuración y los datos:

```text
docker compose build --no-cache web   → no borra datos
docker compose up -d                   → no borra datos
docker compose down                    → no borra el volumen
docker compose down -v                 → BORRA la base de datos
```

Después de actualizar código:

```bash
git pull
docker compose build --no-cache api web
docker compose up -d
docker compose logs api --tail=100
```

No usar `down -v` salvo que se quiera reiniciar completamente la instalación.

## Cloudflare Tunnel

### Instalar Y Autenticar

```bash
curl -L --output cloudflared.deb \
  https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb
cloudflared login
```

Abre en un navegador la URL que muestra `cloudflared login` y autoriza el
dominio. Debe existir `~/.cloudflared/cert.pem`.

### Crear Y Configurar El Túnel

```bash
cloudflared tunnel create qlik-automate
```

Crea `~/.cloudflared/config.yml` usando el UUID real generado:

```yaml
tunnel: qlik-automate
credentials-file: /home/andresadmin/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: apiqac.andresgaibor.com
    service: http://127.0.0.1:3847
  - service: http://127.0.0.1:3847
```

Asocia el hostname e inicia el túnel:

```bash
cloudflared tunnel route dns qlik-automate apiqac.andresgaibor.com
cloudflared tunnel run qlik-automate
```

Para una prueba temporal en segundo plano:

```bash
nohup cloudflared tunnel run qlik-automate \
  > /tmp/cloudflared.log 2>&1 &
```

Para producción, configura `cloudflared` como servicio del sistema y verifica
su estado con `systemctl status cloudflared`.

### Por Qué No Usar Un Registro A Directo

El servidor puede tener Apache/Plesk ocupando el puerto 80, mientras Docker
publica el frontend en `3847`. Cloudflare no permite indicar `3847` en un
registro A proxied estándar; el acceso directo puede mostrar Plesk, redirigir a
otro puerto o producir el error 526.

El Tunnel evita ese conflicto porque conecta directamente con
`127.0.0.1:3847`.

## Configuración OAuth En Qlik Cloud

En la aplicación OAuth de Qlik Cloud registra:

### Allowed Origins

```text
https://apiqac.andresgaibor.com
```

Para desarrollo local se puede conservar adicionalmente `http://localhost:5173`.

### Redirect URI

Debe coincidir exactamente con:

```text
https://apiqac.andresgaibor.com/api/auth/qlik/callback
```

No usar en producción URLs `localhost`. Después de completar el wizard, la API
deriva el redirect URI desde la URL pública guardada en `frontend_url`.

Si Qlik redirige a `localhost`, la API en ejecución no contiene la versión
actualizada:

```bash
git pull
docker compose build --no-cache api
docker compose up -d
```

## Wizard Inicial

Abre únicamente la URL pública:

```text
https://apiqac.andresgaibor.com/setup
```

Completa organización, tenant Qlik Cloud, Client ID, Client Secret, scopes y
superadministrador. La URL del frontend debe ser:

```text
https://apiqac.andresgaibor.com
```

El wizard guarda organización, tenant, OAuth, superadministrador,
`frontend_url` y `setup.completado`.

El middleware CSRF consulta `frontend_url` en la base de datos. No cambiarlo a
`localhost` en producción.

## Identidad Del Usuario

El nombre que aparece después del login proviene de la identidad autenticada
en Qlik Cloud. El navegador puede conservar una sesión Qlik de otro usuario.

Si aparece otro usuario:

1. Cierra sesión en Qlik Cloud.
2. Abre una ventana privada.
3. Inicia OAuth con la cuenta correcta.
4. Revisa `/admin/superadmins` y agrega la cuenta si es necesario.

Los superadministradores y demás datos permanecen en PostgreSQL entre
reinicios y actualizaciones.

## Reinicio Limpio

Solo para una instalación inicial sin datos importantes:

```bash
docker compose down -v
docker compose up -d
```

Esto elimina organizaciones, usuarios, OAuth, superadministradores y toda la
base de datos. No debe usarse como actualización normal.

## Diagnóstico

### Login En Vez Del Wizard

```bash
docker compose logs api --tail=100
```

Si aparece `relation "app_config" does not exist` o `relation "usuarios" does
not exist`, reconstruye la imagen API sin caché:

```bash
git pull
docker compose build --no-cache api
docker compose up -d
```

### `ORIGEN_NO_PERMITIDO`

La petición llega desde un origen distinto al público o la API usa un build
anterior. Verifica que el navegador esté en el mismo dominio público y
reconstruye `api` sin caché.

### Error 526

Cloudflare está intentando validar HTTPS contra el servidor origen. En esta
arquitectura el Tunnel termina la conexión pública y reenvía HTTP a
`127.0.0.1:3847`. Verifica que el túnel esté activo y que el ingress apunte a
ese puerto.

### Qlik Redirige A Localhost

Revisa la Redirect URI en Qlik Cloud y reconstruye `api`. No basta reconstruir
solo `web` para cambiar OAuth.

### Vista Previa Al Compartir

El frontend publica metadatos Open Graph y `og-image.svg`. Después de cambiar
estos metadatos:

```bash
git pull
docker compose build --no-cache web
docker compose up -d
```

La imagen pública es:

```text
https://apiqac.andresgaibor.com/og-image.svg
```

WhatsApp y otras plataformas pueden mantener la vista previa en caché.

## Comandos Seguros Y Peligrosos

### Seguros Para Actualizar

```bash
git pull
docker compose build --no-cache api web
docker compose up -d
docker compose logs api --tail=100
```

### Peligrosos

```bash
docker compose down -v
```

No ejecutar INSERTs ni DELETEs manuales en `app_config` para simular el wizard.
Un registro `setup.completado` con cualquier objeto, incluso
`{"valor": null}`, se interpreta como setup completado.
