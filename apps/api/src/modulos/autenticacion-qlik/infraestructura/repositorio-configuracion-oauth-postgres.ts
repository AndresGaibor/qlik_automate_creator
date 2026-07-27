import { and, eq } from "drizzle-orm";
import type { ConexionDb } from "../../../plataforma/persistencia/conexion.js";
import { configuracionesOauthQlik } from "../../../plataforma/persistencia/esquema.js";
import type { ServicioCifradoPuerto } from "../aplicacion/puertos/repositorio-autenticacion.js";
import type { EstadoConfiguracionOAuthQlik } from "../aplicacion/servicio-autenticacion.js";

export interface ConfiguracionOAuthHeredada {
  clienteId?: string;
  clienteSecreto?: string;
  scopes?: string[];
}

export interface CredencialesClienteOAuthQlik {
  configuracionId?: string;
  origen: "tenant" | "entorno_global";
  clienteId: string;
  clienteSecreto: string;
  scopes: string[];
}

type DbConfiguracionOAuth = ConexionDb;

export class RepositorioConfiguracionOAuthPostgres
  implements EstadoConfiguracionOAuthQlik
{
  constructor(
    private readonly db: DbConfiguracionOAuth,
    private readonly cifrado: ServicioCifradoPuerto,
    private readonly heredada: ConfiguracionOAuthHeredada,
  ) {}
  async obtenerParaTenant(
    tenantQlikId: string,
    configuracionId?: string,
  ): Promise<CredencialesClienteOAuthQlik> {
    const fila = await this.db.query.configuracionesOauthQlik.findFirst({
      where: configuracionId
        ? and(
            eq(configuracionesOauthQlik.id, configuracionId),
            eq(configuracionesOauthQlik.tenantQlikId, tenantQlikId),
          )
        : eq(configuracionesOauthQlik.tenantQlikId, tenantQlikId),
    });

    if (fila) {
      if (fila.estado === "desactivada") {
        throw new Error("La configuración OAuth del tenant está desactivada");
      }
      const paquete = leerPaqueteCifrado(fila.clienteSecretoCifrado);
      return {
        configuracionId: fila.id,
        origen: "tenant",
        clienteId: fila.clienteId,
        clienteSecreto: this.cifrado.descifrar(
          paquete.cifrado,
          paquete.iv,
          paquete.tag,
        ),
        scopes: Array.isArray(fila.scopes) ? fila.scopes : [],
      };
    }
    if (configuracionId) {
      throw new Error("La configuración OAuth seleccionada ya no existe");
    }
    if (!this.heredada.clienteId || !this.heredada.clienteSecreto) {
      throw new Error("El tenant no tiene configuración OAuth");
    }
    return {
      origen: "entorno_global",
      clienteId: this.heredada.clienteId,
      clienteSecreto: this.heredada.clienteSecreto,
      scopes: this.heredada.scopes ?? [],
    };
  }

  async marcarVerificada(configuracionId: string): Promise<void> {
    await this.db
      .update(configuracionesOauthQlik)
      .set({
        estado: "verificada",
        verificadaEn: new Date(),
        ultimoError: null,
        actualizadoEn: new Date(),
      })
      .where(eq(configuracionesOauthQlik.id, configuracionId));
  }

  async marcarError(configuracionId: string, mensaje: string): Promise<void> {
    await this.db
      .update(configuracionesOauthQlik)
      .set({
        estado: "error",
        ultimoError: mensaje.slice(0, 500),
        actualizadoEn: new Date(),
      })
      .where(eq(configuracionesOauthQlik.id, configuracionId));
  }

  async guardarOAuthInicial(
    tenantQlikId: string,
    clienteId: string,
    clienteSecreto: string,
    scopes: string[],
  ): Promise<string> {
    const cifradoPaquete = this.cifrado.cifrar(clienteSecreto);
    const clienteSecretoCifrado = JSON.stringify({
      cifrado: cifradoPaquete.cifrado,
      iv: cifradoPaquete.iv,
      tag: cifradoPaquete.tag,
    });
    const secretoSufijo = clienteSecreto.slice(-4);
    const ahora = new Date();

    const [fila] = await this.db
      .insert(configuracionesOauthQlik)
      .values({
        tenantQlikId,
        clienteId,
        clienteSecretoCifrado,
        secretoSufijo,
        scopes,
        estado: "pendiente",
        verificadaEn: null,
        ultimoError: null,
        creadoPorUsuarioId: null,
        actualizadoPorUsuarioId: null,
        actualizadoEn: ahora,
      })
      .onConflictDoUpdate({
        target: configuracionesOauthQlik.tenantQlikId,
        set: {
          clienteId,
          clienteSecretoCifrado,
          secretoSufijo,
          scopes,
          estado: "pendiente",
          verificadaEn: null,
          ultimoError: null,
          actualizadoEn: ahora,
        },
      })
      .returning();

    return fila.id;
  }
}

function leerPaqueteCifrado(valor: string): {
  cifrado: string;
  iv: string;
  tag: string;
} {
  const paquete = JSON.parse(valor) as Record<string, unknown>;
  if (
    typeof paquete.cifrado !== "string" ||
    typeof paquete.iv !== "string" ||
    typeof paquete.tag !== "string"
  ) {
    throw new Error("La configuración OAuth cifrada es inválida");
  }
  return {
    cifrado: paquete.cifrado,
    iv: paquete.iv,
    tag: paquete.tag,
  };
}
