import { db } from "../../../plataforma/persistencia/conexion.js";
import { tenantsQlik } from "../../../plataforma/persistencia/esquema.js";
import { eq } from "drizzle-orm";
import type { PuertoConsultaTenantQlik } from "../aplicacion/puertos/puerto-consulta-tenant-qlik.js";

export class ConsultaTenantQlikPostgres implements PuertoConsultaTenantQlik {
  async obtenerTenant(tenantQlikId: string) {
    const fila = await db.query.tenantsQlik.findFirst({
      where: eq(tenantsQlik.id, tenantQlikId),
    });
    return fila ?? null;
  }
}
