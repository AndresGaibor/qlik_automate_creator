import { clienteApi } from "@/compartido/api/cliente";
import type { ResumenFlujo } from "@qlik/contratos";
import type {
  CrearDesdePlantilla,
  EntradaCrearModo1,
  PreflightAutomatizacion,
  ResultadoCrearDesdePlantilla,
} from "@qlik/contratos/automatizaciones";

const RUTA = "/automatizaciones";

export interface ConfiguracionTenant {
  modoAutomatizacionActivo: 1 | 2;
  plantillaEfectivaIdQlik: string | null;
  plantillaEfectivaNombre: string | null;
  configurada: boolean;
  puedeAdministrarConexiones: boolean;
  accesoEspacios: {
    restringido: boolean;
    configurado: boolean;
    cerrado: boolean;
    cantidadEspacios: number;
    permitirRecursosSinEspacio: boolean;
  };
}

export interface ResultadoPruebaConexionOrigen {
  estado: "disponible";
  probadaEn: string;
  mensaje: null;
}

export type EntradaConexionOrigen =
  | {
      tipo: "jdbc";
      nombre: string;
      config: {
        url: string;
        driver: string;
        secreto_nombre: string;
        propiedades: Record<string, string>;
        secretoValor?: string;
      };
    }
  | {
      tipo: "sftp";
      nombre: string;
      config: {
        host: string;
        puerto: number;
        usuario: string;
        secreto_clave_privada_nombre: string;
        ruta_base: string;
        secretoClavePrivadaValor?: string;
      };
    };

export type {
  CrearDesdePlantilla,
  EntradaCrearModo1,
  PreflightAutomatizacion,
  ResultadoCrearDesdePlantilla,
};

export function obtenerConfiguracionTenant(): Promise<ConfiguracionTenant> {
  return clienteApi.get<ConfiguracionTenant>(`${RUTA}/configuracion-tenant`);
}

export function obtenerPreflightAutomatizacion(flujoId: string) {
  return clienteApi.post<PreflightAutomatizacion>(`${RUTA}/preflight`, {
    flujoId,
  });
}

export function guardarConexionOrigen(entrada: EntradaConexionOrigen) {
  return clienteApi.post<{ id: string }>("/conexiones-origen", entrada);
}

export function probarConexionOrigen(id: string) {
  return clienteApi.post<ResultadoPruebaConexionOrigen>(
    `/conexiones-origen/${encodeURIComponent(id)}/probar`,
    {},
  );
}

export function crearAutomatizacionDesdePlantilla(
  entrada:
    | EntradaCrearModo1
    | (Omit<CrearDesdePlantilla, "plantillaIdQlik"> & {
        plantillaIdQlik?: string;
      }),
) {
  const clave = entrada.claveIdempotencia ?? crypto.randomUUID();
  return clienteApi.post<ResultadoCrearDesdePlantilla>(
    `${RUTA}/desde-plantilla`,
    { ...entrada, claveIdempotencia: clave },
    { headers: { "idempotency-key": clave } },
  );
}

export function obtenerFlujosConFiltros(espacioId?: string) {
  return clienteApi.get<ResumenFlujo[]>("/flujos", {
    parametros: espacioId ? { espacioId } : undefined,
  });
}
