import { eq } from "drizzle-orm";
import type { ConexionDb } from "../../../plataforma/persistencia/conexion.js";
import { tenantsQlik } from "../../../plataforma/persistencia/esquema.js";
import { leerSecretoCifrado } from "../../../plataforma/seguridad/secreto-cifrado.js";
import type { OpcionesImpala } from "./cliente-impala-directo.js";

interface ServicioCifrado {
  cifrar(valor: string): { cifrado: string; iv: string; tag: string };
  descifrar(cifrado: string, iv: string, tag: string): string;
}

export class ConsultaConfiguracionImpalaPostgres {
  constructor(
    private readonly db: ConexionDb,
    private readonly cifrado: ServicioCifrado,
  ) {}

  async obtener(tenantQlikId: string): Promise<OpcionesImpala | null> {
    const tenant = await this.db.query.tenantsQlik.findFirst({
      where: eq(tenantsQlik.id, tenantQlikId),
    });
    if (!tenant?.impalaHost) return null;

    return {
      host: tenant.impalaHost,
      port: tenant.impalaPort ?? 21050,
      authMechanism: tenant.impalaAuthMechanism ?? "NOSASL",
      user: tenant.impalaUser ?? undefined,
      password: leerSecretoCifrado(this.cifrado, tenant.impalaPasswordCifrada),
      database: tenant.impalaDatabase ?? "default",
    };
  }
}
