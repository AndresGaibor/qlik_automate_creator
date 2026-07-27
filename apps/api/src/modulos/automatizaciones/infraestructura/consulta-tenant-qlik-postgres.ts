import { eq } from "drizzle-orm";
import { db } from "../../../plataforma/persistencia/conexion.js";
import { tenantsQlik } from "../../../plataforma/persistencia/esquema.js";
import type { PuertoConsultaTenantQlik } from "../aplicacion/puertos/puerto-consulta-tenant-qlik.js";

export function mapearTenantParaAutomatizaciones(
  fila: {
    host: string;
    automatizacionBaseIdQlik?: string | null;
    automatizacionBaseNombre?: string | null;
    destinoApiUrl?: string | null;
    impalaHost?: string | null;
    impalaPort?: number | null;
  } & Record<string, unknown>,
) {
  return {
    host: fila.host,
    automatizacionBaseIdQlik: fila.automatizacionBaseIdQlik,
    automatizacionBaseNombre: fila.automatizacionBaseNombre,
    destinoApiUrl: fila.destinoApiUrl,
    impalaHost: fila.impalaHost,
    impalaPort: fila.impalaPort,
  };
}

export class ConsultaTenantQlikPostgres implements PuertoConsultaTenantQlik {
  async obtenerTenant(tenantQlikId: string) {
    const fila = await db.query.tenantsQlik.findFirst({
      where: eq(tenantsQlik.id, tenantQlikId),
    });
    return fila ? mapearTenantParaAutomatizaciones(fila) : null;
  }
}
