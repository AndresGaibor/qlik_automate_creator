import type { Context } from "hono";
import type { PuertoAuditoria } from "../../../nucleo/auditoria/puerto-auditoria.js";
import type { PuertoOutbox } from "../../../nucleo/eventos/puerto-outbox.js";
import type { PuertoIdempotencia } from "../../../nucleo/idempotencia/puerto-idempotencia.js";
import type { FabricaDestino } from "../../destinos/publico.js";
import type { ServicioQlik } from "../../qlik/publico.js";
import type { PuertoBloqueoEjecucion } from "../aplicacion/puertos/puerto-bloqueo-ejecucion.js";
import type { PuertoConsultaTenantQlik } from "../aplicacion/puertos/puerto-consulta-tenant-qlik.js";

export type ModoPlantilla = 1 | 2;

export interface ContextoSesionPanel {
  tenantId: string;
  usuarioId: string;
  organizacionId: string;
}

export interface PoliticaEspaciosPanel {
  restringida: boolean;
  configurada: boolean;
  espaciosPermitidosIds: string[];
  permitirRecursosSinEspacio: boolean;
  puedeVer(espacioId?: string | null): boolean;
}

export interface DependenciasRutasPanel {
  resolverQlik(c: Context): Promise<ServicioQlik>;
  resolverSesion(c: Context): Promise<ContextoSesionPanel>;
  consultaTenant: PuertoConsultaTenantQlik;
  obtenerModoGlobal(): Promise<{ modoAutomatizacionActivo: ModoPlantilla }>;
  consultarConexionesOrigen(organizacionId: string): Promise<
    Array<{
      id?: string;
      tipo: string;
      nombre: string;
      config: Record<string, unknown>;
      estado?: "sin_probar" | "disponible" | "error";
      probadaEn?: Date | null;
      mensajeError?: string | null;
      secretoConfigurado?: boolean;
    }>
  >;
  consultarConexionesDestino?: (organizacionId: string) => Promise<
    Array<{
      id: string;
      tipo: string;
      nombre: string;
      estado: "activo" | "error" | "desconectado";
      probadaEn: Date | null;
      mensajeError: string | null;
    }>
  >;
  consultarConexionDestino(
    destinoId: string,
    organizacionId: string,
  ): Promise<{ tipo: string; config: Record<string, unknown> } | null>;
  crearClienteDestino?: FabricaDestino;
  probarConexionOrigen?: (
    organizacionId: string,
    conexionId: string,
  ) => Promise<unknown>;
  leerSecretoOrigen?: (
    organizacionId: string,
    conexionId: string,
    nombre: string,
  ) => Promise<string | null>;
  obtenerConexionDestinoConSecreto?: (
    destinoId: string,
    organizacionId: string,
  ) => Promise<{
    id: string;
    tipo: string;
    nombre: string;
    estado: "activo" | "error" | "desconectado";
    probadaEn: Date | null;
    mensajeError: string | null;
    config: Record<string, unknown>;
    secreto: { nombre: string; valor: string } | null;
  } | null>;
  probarConexionDestino?: (
    organizacionId: string,
    destinoId: string,
  ) => Promise<unknown>;
  bloqueos: PuertoBloqueoEjecucion;
  idempotencia: PuertoIdempotencia;
  outbox: PuertoOutbox;
  auditoria: PuertoAuditoria;
  resolverPoliticaEspacios?: (c: Context) => Promise<PoliticaEspaciosPanel>;
}
