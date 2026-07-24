import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) throw new Error("Falta la variable DATABASE_URL");
const sql = postgres(databaseUrl, { max: 1 });
const tablas = [
  "organizaciones",
  "usuarios",
  "membresias_organizacion",
  "tenants_qlik",
  "sesiones_usuario",
];
try {
  await sql`SELECT 1`;
  for (const tabla of tablas) {
    const [fila] = await sql<
      { existe: string | null }[]
    >`SELECT to_regclass(${`public.${tabla}`})::text AS existe`;
    if (!fila?.existe) throw new Error(`Falta la tabla requerida: ${tabla}`);
  }
  const [resumen] = await sql<
    { organizaciones: number; tenants: number; principales: number }[]
  >`
    SELECT
      (SELECT COUNT(*)::int FROM organizaciones) AS organizaciones,
      (SELECT COUNT(*)::int FROM tenants_qlik) AS tenants,
      (SELECT COUNT(*)::int FROM tenants_qlik WHERE es_principal = true) AS principales
  `;
  console.log("Base de datos disponible:", resumen);
} finally {
  await sql.end();
}
