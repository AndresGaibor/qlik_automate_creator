# Bootstrap inicial

El arranque de una instalación nueva se realiza en este orden:

```bash
docker compose up -d postgres
bun run db:migrate
bun run db:seed
bun run db:check
```

`db:seed` es idempotente: reutiliza la organización, el host Qlik y el usuario por correo cuando ya existen. También garantiza que el tenant configurado quede como principal y que el usuario tenga rol `admin` en la organización.

Variables requeridas en `.env`:

```env
DATABASE_URL=postgres://qlik_app:desarrollo@localhost:5432/qlik_automatizaciones
BOOTSTRAP_ORGANIZACION_NOMBRE=Empresa Demo
BOOTSTRAP_TENANT_NOMBRE=Tenant Qlik principal
BOOTSTRAP_TENANT_HOST=empresa.eu.qlikcloud.com
BOOTSTRAP_TENANT_ID_QLIK=tenant-qlik-001
SUPERADMINMAIL=admin@empresa.com
BOOTSTRAP_SUPERADMIN_NOMBRE=Superadministrador
```

En producción, el host debe corresponder a un tenant Qlik real registrado para el cliente OAuth configurado.
