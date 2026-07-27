import type postgres from "postgres";
import type { RepositorioBootstrap } from "./bootstrap.js";

type ClienteSql = ReturnType<typeof postgres>;

export class RepositorioBootstrapPostgres implements RepositorioBootstrap {
  constructor(private readonly sql: ClienteSql) {}

  async resolverOrganizacionInicial(datos: {
    nombre: string;
    tenantHost: string;
  }) {
    return this.sql.begin(async (tx) => {
      const [porHost] = await tx<{ id: string; nombre: string }[]>`
        SELECT o.id, o.nombre
        FROM tenants_qlik t
        INNER JOIN organizaciones o ON o.id = t.organizacion_id
        WHERE t.host = ${datos.tenantHost}
        LIMIT 1
      `;
      if (porHost) {
        const [actualizada] = await tx<{ id: string; nombre: string }[]>`
          UPDATE organizaciones
          SET nombre = ${datos.nombre}, estado = 'activa', actualizado_en = NOW()
          WHERE id = ${porHost.id}
          RETURNING id, nombre
        `;
        if (!actualizada) {
          throw new Error("No se pudo actualizar la organización inicial");
        }
        return actualizada;
      }

      const [porNombre] = await tx<{ id: string; nombre: string }[]>`
        SELECT id, nombre FROM organizaciones
        WHERE nombre = ${datos.nombre}
        LIMIT 1
      `;
      if (porNombre) return porNombre;

      const [creada] = await tx<{ id: string; nombre: string }[]>`
        INSERT INTO organizaciones (nombre, estado)
        VALUES (${datos.nombre}, 'activa')
        RETURNING id, nombre
      `;
      if (!creada) throw new Error("No se pudo crear la organización inicial");
      return creada;
    });
  }

  async asegurarTenantPrincipal(datos: {
    organizacionId: string;
    tenantIdQlik: string;
    host: string;
    nombre: string;
  }) {
    return this.sql.begin(async (tx) => {
      const [existente] = await tx<{ id: string; organizacionId: string }[]>`
        SELECT id, organizacion_id AS "organizacionId"
        FROM tenants_qlik WHERE host = ${datos.host} LIMIT 1
      `;
      if (existente) {
        if (existente.organizacionId !== datos.organizacionId) {
          throw new Error("El host Qlik ya pertenece a otra organización");
        }
        await tx`UPDATE tenants_qlik SET es_principal = false WHERE organizacion_id = ${datos.organizacionId} AND id <> ${existente.id}`;
        await tx`UPDATE tenants_qlik SET es_principal = true, estado = 'activo', nombre = ${datos.nombre}, actualizado_en = NOW() WHERE id = ${existente.id}`;
        return existente;
      }
      await tx`UPDATE tenants_qlik SET es_principal = false WHERE organizacion_id = ${datos.organizacionId}`;
      const [creado] = await tx<{ id: string; organizacionId: string }[]>`
        INSERT INTO tenants_qlik (
          organizacion_id, tenant_id_qlik, host, nombre, estado, es_principal
        ) VALUES (
          ${datos.organizacionId}, ${datos.tenantIdQlik}, ${datos.host},
          ${datos.nombre}, 'activo', true
        ) RETURNING id, organizacion_id AS "organizacionId"
      `;
      if (!creado) throw new Error("No se pudo crear el tenant Qlik inicial");
      return creado;
    });
  }

  async asegurarSuperadministrador(datos: {
    organizacionId: string;
    correo: string;
    nombre: string;
  }) {
    return this.sql.begin(async (tx) => {
      let [usuario] = await tx<{ id: string }[]>`
        SELECT id FROM usuarios WHERE LOWER(correo) = ${datos.correo} LIMIT 1
      `;
      if (!usuario) {
        [usuario] = await tx<{ id: string }[]>`
          INSERT INTO usuarios (nombre, correo, estado, es_superadmin)
          VALUES (${datos.nombre}, ${datos.correo}, 'activo', true) RETURNING id
        `;
      } else {
        await tx`UPDATE usuarios SET nombre = ${datos.nombre}, estado = 'activo', es_superadmin = true, actualizado_en = NOW() WHERE id = ${usuario.id}`;
      }
      if (!usuario) throw new Error("No se pudo crear el superadministrador");
      await tx`
        INSERT INTO membresias_organizacion (organizacion_id, usuario_id, rol)
        VALUES (${datos.organizacionId}, ${usuario.id}, 'admin')
        ON CONFLICT (organizacion_id, usuario_id) DO UPDATE SET rol = 'admin'
      `;
      return usuario;
    });
  }
}
