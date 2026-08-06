export interface DestinoPendienteBackfill {
  id: string;
  config: Record<string, unknown>;
}

export interface PuertoBackfillSecretosDestino {
  listarPendientes(): Promise<DestinoPendienteBackfill[]>;
  guardarMigracion(entrada: {
    id: string;
    config: Record<string, unknown>;
    nombreSecreto: string;
    valorCifrado: string;
  }): Promise<void>;
}

interface CifradorBackfill {
  cifrar(valor: string): { cifrado: string; iv: string; tag: string };
}

export async function cifrarSecretosDestinoExistentes(
  db: PuertoBackfillSecretosDestino,
  cifrado: CifradorBackfill,
): Promise<{ migrados: number; omitidos: number }> {
  let migrados = 0;
  let omitidos = 0;

  while (true) {
    const pendientes = await db.listarPendientes();
    if (pendientes.length === 0) break;

    for (const pendiente of pendientes) {
      const password = pendiente.config.password;
      if (typeof password !== "string" || password.length === 0) {
        omitidos += 1;
        continue;
      }
      const { password: _omitido, ...configSegura } = pendiente.config;
      await db.guardarMigracion({
        id: pendiente.id,
        config: configSegura,
        nombreSecreto: `POSTGRES_DESTINO_${pendiente.id.toUpperCase()}`,
        valorCifrado: JSON.stringify(cifrado.cifrar(password)),
      });
      migrados += 1;
    }
  }

  return { migrados, omitidos };
}
