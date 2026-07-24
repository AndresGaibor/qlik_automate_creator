import type { tenantsQlik } from "../../../plataforma/persistencia/esquema.js";
import type {
  EstadoTenantQlik,
  TenantQlikAdministrable,
} from "../aplicacion/puertos/repositorio-administracion.js";
import { validarYNormalizarHost } from "../dominio/validador-host-qlik.js";

export function mapearTenantQlik(
  fila: typeof tenantsQlik.$inferSelect,
): TenantQlikAdministrable {
  return {
    ...fila,
    estado: fila.estado as EstadoTenantQlik,
  };
}

export function normalizarHostQlik(host: string): string {
  return validarYNormalizarHost(host);
}
