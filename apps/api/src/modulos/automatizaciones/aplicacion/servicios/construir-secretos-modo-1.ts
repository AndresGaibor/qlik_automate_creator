export interface SecretoOrigenModo1 {
  tipo: "jdbc" | "sftp";
  referencia: string;
  valor: string;
}

export interface SecretoDestinoModo1 {
  referencia: string;
  usuario: string;
  password: string;
}

export function construirSecretosModo1(
  origenes: SecretoOrigenModo1[],
  destino: SecretoDestinoModo1,
): Record<string, string> {
  const resultado: Record<string, string> = {};
  for (const origen of origenes) {
    resultado[origen.referencia] =
      origen.tipo === "sftp"
        ? Buffer.from(origen.valor, "utf8").toString("base64")
        : origen.valor;
  }
  resultado[destino.referencia] = `${destino.usuario}:${destino.password}`;
  return resultado;
}
