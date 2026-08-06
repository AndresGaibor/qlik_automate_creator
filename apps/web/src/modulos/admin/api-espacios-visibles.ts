import { clienteApi } from "@/compartido/api/cliente";

export interface ConfiguracionEspaciosVisibles {
  tenantQlikId: string;
  espaciosPermitidosIds: string[];
  permitirRecursosSinEspacio: boolean;
  configurada: boolean;
  actualizadoEn: string | null;
}

export interface EspacioConfigurable {
  id: string;
  nombre: string;
  tipo: string;
  disponible: boolean;
  seleccionado: boolean;
}

export interface CatalogoEspaciosVisibles {
  configuracion: ConfiguracionEspaciosVisibles;
  espacios: EspacioConfigurable[];
}

export interface GuardarEspaciosVisibles {
  espaciosPermitidosIds: string[];
  permitirRecursosSinEspacio: boolean;
}

function rutaEspaciosVisibles(organizacionId: string, tenantQlikId: string) {
  return `/admin/organizaciones/${encodeURIComponent(organizacionId)}/tenants-qlik/${encodeURIComponent(tenantQlikId)}/espacios-visibles`;
}

export function obtenerEspaciosVisibles(
  organizacionId: string,
  tenantQlikId: string,
) {
  return clienteApi.get<CatalogoEspaciosVisibles>(
    rutaEspaciosVisibles(organizacionId, tenantQlikId),
  );
}

export function guardarEspaciosVisibles(
  organizacionId: string,
  tenantQlikId: string,
  entrada: GuardarEspaciosVisibles,
) {
  return clienteApi.put<{
    configuracion: ConfiguracionEspaciosVisibles;
    anadidos: string[];
    retirados: string[];
  }>(rutaEspaciosVisibles(organizacionId, tenantQlikId), entrada);
}

export function sincronizarEspaciosVisibles(
  organizacionId: string,
  tenantQlikId: string,
) {
  return clienteApi.post<{ sincronizados: number }>(
    `${rutaEspaciosVisibles(organizacionId, tenantQlikId)}/sincronizar`,
    {},
  );
}
