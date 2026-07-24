import postgres from "postgres";
import { ejecutarBootstrap } from "./bootstrap.js";
import { RepositorioBootstrapPostgres } from "./repositorio-bootstrap-postgres.js";

const exigir = (nombre: string): string => {
  const valor = process.env[nombre]?.trim();
  if (!valor) throw new Error(`Falta la variable ${nombre}`);
  return valor;
};

const sql = postgres(exigir("DATABASE_URL"), { max: 1 });
try {
  const resultado = await ejecutarBootstrap(
    new RepositorioBootstrapPostgres(sql),
    {
      organizacionNombre: exigir("BOOTSTRAP_ORGANIZACION_NOMBRE"),
      tenantNombre:
        process.env.BOOTSTRAP_TENANT_NOMBRE?.trim() || "Tenant Qlik principal",
      tenantHost: exigir("BOOTSTRAP_TENANT_HOST"),
      tenantIdQlik: exigir("BOOTSTRAP_TENANT_ID_QLIK"),
      superadminCorreo: exigir("SUPERADMINMAIL"),
      superadminNombre:
        process.env.BOOTSTRAP_SUPERADMIN_NOMBRE?.trim() || "Superadministrador",
    },
  );
  console.log("Bootstrap completado:", resultado);
} finally {
  await sql.end();
}
