import { eq } from "drizzle-orm";
import { db } from "../../../plataforma/persistencia/conexion.js";
import { tenantsQlik } from "../../../plataforma/persistencia/esquema.js";
import type { PuertoConsultaTenantQlik } from "../aplicacion/puertos/puerto-consulta-tenant-qlik.js";

export function mapearTenantParaAutomatizaciones(
  fila: {
    host: string;
    automatizacionBaseIdQlik?: string | null;
    automatizacionBaseNombre?: string | null;
    automatizacionPlantillaModo1IdQlik?: string | null;
    automatizacionPlantillaModo1Nombre?: string | null;
    automatizacionPlantillaModo2IdQlik?: string | null;
    automatizacionPlantillaModo2Nombre?: string | null;
    destinoApiUrl?: string | null;
    impalaHost?: string | null;
    impalaPort?: number | null;
  } & Record<string, unknown>,
) {
  return {
    host: fila.host,
    automatizacionBaseIdQlik: fila.automatizacionBaseIdQlik,
    automatizacionBaseNombre: fila.automatizacionBaseNombre,
    automatizacionPlantillaModo1IdQlik: fila.automatizacionPlantillaModo1IdQlik,
    automatizacionPlantillaModo1Nombre: fila.automatizacionPlantillaModo1Nombre,
    automatizacionPlantillaModo2IdQlik: fila.automatizacionPlantillaModo2IdQlik,
    automatizacionPlantillaModo2Nombre: fila.automatizacionPlantillaModo2Nombre,
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
