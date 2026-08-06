import type { PuertoAuditoria } from "../../../../nucleo/auditoria/puerto-auditoria.js";
import {
  ErrorAplicacion,
  ErrorNoEncontrado,
} from "../../../../nucleo/errores/error-aplicacion.js";
import type {
  ConfiguracionOauthAdministrable,
  EntradaGuardarConfiguracionOauth,
  RepositorioAdministracion,
} from "../puertos/repositorio-administracion.js";

export interface OpcionesGestionConfiguracionOauth {
  redirectUri: string;
  configuracionHeredada: {
    clienteId?: string;
    tieneSecreto: boolean;
    scopes: string[];
  };
}

interface ContextoAuditoriaOauth {
  organizacionId: string;
  tenantQlikId: string;
  usuarioId?: string;
  ip?: string;
  agenteUsuario?: string;
}

export class GestionarConfiguracionOauth {
  constructor(
    private readonly repositorio: RepositorioAdministracion,
    private readonly auditoria: PuertoAuditoria,
    private readonly opciones: OpcionesGestionConfiguracionOauth,
  ) {}

  async obtener(organizacionId: string, tenantQlikId: string) {
    const configuracion = await this.repositorio.obtenerConfiguracionOAuth(
      organizacionId,
      tenantQlikId,
    );
    return configuracion
      ? serializar(configuracion, this.opciones.redirectUri)
      : resumenSinFila(tenantQlikId, this.opciones);
  }

  async guardar(
    entrada: ContextoAuditoriaOauth & {
      entrada: EntradaGuardarConfiguracionOauth;
    },
  ) {
    const anterior = await this.repositorio.obtenerConfiguracionOAuth(
      entrada.organizacionId,
      entrada.tenantQlikId,
    );

    let guardada: ConfiguracionOauthAdministrable | null;
    try {
      guardada = await this.repositorio.guardarConfiguracionOAuth(
        entrada.organizacionId,
        entrada.tenantQlikId,
        { ...entrada.entrada, usuarioId: entrada.usuarioId },
      );
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Debes ingresar el secreto OAuth inicial"
      ) {
        throw new ErrorAplicacion(
          "SECRETO_OAUTH_REQUERIDO",
          error.message,
          400,
        );
      }
      throw error;
    }

    if (!guardada) throw new ErrorNoEncontrado("Tenant Qlik no encontrado");

    await this.registrarAuditoria({
      ...entrada,
      accion: "oauth.configurar",
      datosAnteriores: anterior ? resumirAuditoria(anterior) : undefined,
      datosNuevos: resumirAuditoria(guardada),
    });
    return serializar(guardada, this.opciones.redirectUri);
  }

  async eliminar(entrada: ContextoAuditoriaOauth & { esSuperadmin: boolean }) {
    if (!entrada.esSuperadmin) {
      throw new ErrorAplicacion(
        "NO_AUTORIZADO",
        "Solo un superadministrador puede eliminar OAuth",
        403,
      );
    }
    const eliminado = await this.repositorio.eliminarConfiguracionOAuth(
      entrada.organizacionId,
      entrada.tenantQlikId,
    );
    if (!eliminado) {
      throw new ErrorNoEncontrado("Configuración OAuth no encontrada");
    }

    await this.registrarAuditoria({
      ...entrada,
      accion: "oauth.eliminar",
    });
    return { eliminado: true as const };
  }

  private async registrarAuditoria(
    entrada: ContextoAuditoriaOauth & {
      accion: string;
      datosAnteriores?: unknown;
      datosNuevos?: unknown;
    },
  ) {
    await this.auditoria
      .registrar({
        organizacionId: entrada.organizacionId,
        usuarioId: entrada.usuarioId,
        accion: entrada.accion,
        entidadTipo: "configuracion-oauth-qlik",
        entidadId: entrada.tenantQlikId,
        resultado: "exito",
        datosAnteriores: entrada.datosAnteriores,
        datosNuevos: entrada.datosNuevos,
        ip: entrada.ip,
        agenteUsuario: entrada.agenteUsuario,
      })
      .catch(() => undefined);
  }
}

function serializar(
  configuracion: ConfiguracionOauthAdministrable,
  redirectUri: string,
) {
  return {
    ...configuracion,
    verificadaEn: configuracion.verificadaEn?.toISOString() ?? null,
    actualizadoEn: configuracion.actualizadoEn.toISOString(),
    redirectUri,
  };
}

function resumenSinFila(
  tenantQlikId: string,
  opciones: OpcionesGestionConfiguracionOauth,
) {
  const clienteId = opciones.configuracionHeredada.clienteId ?? null;
  const usaHeredada = Boolean(
    clienteId && opciones.configuracionHeredada.tieneSecreto,
  );
  return {
    tenantQlikId,
    clienteId: usaHeredada ? clienteId : null,
    secretoMascara: usaHeredada ? "••••••••" : null,
    scopes: usaHeredada ? opciones.configuracionHeredada.scopes : [],
    estado: null,
    origen: usaHeredada
      ? ("entorno_global" as const)
      : ("sin_configurar" as const),
    verificadaEn: null,
    ultimoError: null,
    actualizadoEn: null,
    redirectUri: opciones.redirectUri,
  };
}

function resumirAuditoria(configuracion: ConfiguracionOauthAdministrable) {
  return {
    tenantQlikId: configuracion.tenantQlikId,
    clienteId: configuracion.clienteId,
    scopes: configuracion.scopes,
    estado: configuracion.estado,
    origen: configuracion.origen,
  };
}
