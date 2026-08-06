import type { ResumenFlujo } from "@qlik/contratos/flujos";

export type PestanaDetalleFlujo =
  | "script"
  | "spark"
  | "metadata"
  | "automatizaciones";

export interface AutomatizacionVinculable {
  id: string;
  nombre: string;
}

export function buscarAutomatizacionVinculada<
  T extends AutomatizacionVinculable,
>(
  automatizaciones: T[],
  flujo?: Pick<ResumenFlujo, "id" | "nombre">,
): T | undefined {
  if (!flujo) return undefined;
  const nombreFlujo = flujo.nombre.toLowerCase();
  return automatizaciones.find(
    (automatizacion) =>
      automatizacion.nombre.includes(flujo.id) ||
      automatizacion.nombre.toLowerCase().includes(nombreFlujo),
  );
}

export function construirMetadataDataflow(
  flujo: Pick<
    ResumenFlujo,
    "id" | "nombre" | "espacioId" | "espacioNombre" | "modificadoEn"
  >,
) {
  return {
    id: flujo.id,
    name: flujo.nombre,
    resourceType: "app",
    resourceSubType: "qix-df",
    spaceId: flujo.espacioId || null,
    spaceName: flujo.espacioNombre || "Personal",
    updatedAt: flujo.modificadoEn || null,
    engine: "QIX Data Pipeline Engine",
  };
}

export function urlCatalogoConexiones(conexiones: string[]): string {
  const parametros = new URLSearchParams();
  for (const conexion of conexiones) {
    const coincidencia = conexion.match(
      /^(Base de Datos \/ JDBC|Servidor SFTP): "(.+)"$/,
    );
    if (!coincidencia) continue;
    const tipo = coincidencia[1] === "Base de Datos / JDBC" ? "jdbc" : "sftp";
    parametros.append("conexion", `${tipo}:${coincidencia[2]}`);
  }
  return `/configuracion?${parametros.toString()}`;
}
