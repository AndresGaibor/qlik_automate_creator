import postgres from "postgres";
import { crearServicioCifrado } from "../../seguridad/servicio-cifrado.js";
import { cifrarSecretosDestinoExistentes } from "./cifrar-secretos-destino.js";

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) throw new Error("Falta la variable DATABASE_URL");

const sql = postgres(databaseUrl, { max: 1 });
const cifrado = crearServicioCifrado();

try {
  const resultado = await cifrarSecretosDestinoExistentes(
    {
      async listarPendientes() {
        return sql<{ id: string; config: Record<string, unknown> }[]>`
          SELECT id, config
          FROM conexiones_destino
          WHERE tipo = 'postgres'
            AND jsonb_typeof(config->'password') = 'string'
            AND length(config->>'password') > 0
            AND NOT EXISTS (
              SELECT 1 FROM secretos_conexion_destino secreto
              WHERE secreto.conexion_destino_id = conexiones_destino.id
            )
          ORDER BY id
          LIMIT 100
        `;
      },
      async guardarMigracion(entrada) {
        await sql.begin(async (tx) => {
          await tx`
            INSERT INTO secretos_conexion_destino (
              conexion_destino_id, nombre, valor_cifrado
            ) VALUES (
              ${entrada.id}, ${entrada.nombreSecreto}, ${entrada.valorCifrado}
            )
            ON CONFLICT (conexion_destino_id, nombre)
            DO UPDATE SET
              valor_cifrado = EXCLUDED.valor_cifrado,
              actualizado_en = now()
          `;
          await tx`
            UPDATE conexiones_destino
            SET config = ${JSON.stringify(entrada.config)}::jsonb,
                secreto_refs = COALESCE(secreto_refs, '{}'::jsonb)
                  || jsonb_build_object('password', ${entrada.nombreSecreto}),
                actualizado_en = now()
            WHERE id = ${entrada.id}
          `;
        });
      },
    },
    cifrado,
  );
  console.log("Backfill de secretos destino completado:", resultado);
} finally {
  await sql.end({ timeout: 5 });
}
