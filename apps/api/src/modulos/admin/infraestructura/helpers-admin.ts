import type { tenantsQlik } from "../../../plataforma/persistencia/esquema.js";
import type {
  EstadoTenantQlik,
  TenantQlikAdministrable,
} from "../aplicacion/puertos/repositorio-administracion.js";
import { validarYNormalizarHost } from "../dominio/validador-host-qlik.js";

export function mapearTenantQlik(
  fila: typeof tenantsQlik.$inferSelect,
): TenantQlikAdministrable {
  const tieneDestinoApiKey = Boolean(fila.destinoApiKeyCifrada);
  const tieneImpalaPassword = Boolean(fila.impalaPasswordCifrada);
  const {
    destinoApiKeyCifrada: _destinoApiKeyCifrada,
    impalaPasswordCifrada: _impalaPasswordCifrada,
    ...tenant
  } = fila;
  return {
    ...tenant,
    estado: fila.estado as EstadoTenantQlik,
    tieneDestinoApiKey,
    destinoApiKeyMascara: tieneDestinoApiKey ? "••••••••" : null,
    tieneImpalaPassword,
    impalaPasswordMascara: tieneImpalaPassword ? "••••••••" : null,
  };
}

export function normalizarHostQlik(host: string): string {
  return validarYNormalizarHost(host);
}
