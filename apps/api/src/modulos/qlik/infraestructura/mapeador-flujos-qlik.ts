import type { FlujoQlik } from "../dominio/modelos-qlik.js";

export function mapearItemsAFlujos(respuesta: unknown): FlujoQlik[] {
  if (
    !respuesta ||
    typeof respuesta !== "object" ||
    !("data" in respuesta) ||
    !Array.isArray((respuesta as Record<string, unknown>).data)
  ) {
    return [];
  }

  return (respuesta as { data: Array<Record<string, unknown>> }).data
    .filter(esItemDataflow)
    .map((item) => ({
      id: String(item.resourceId ?? item.id),
      name: String(item.name ?? ""),
      spaceId: valorOpcional(item.spaceId),
      ownerId: valorOpcional(item.ownerId),
      createdAt: valorOpcional(item.resourceCreatedAt),
      updatedAt: valorOpcional(item.resourceUpdatedAt),
    }));
}

function esItemDataflow(item: Record<string, unknown>): boolean {
  return (
    item.resourceSubType === "qix-df" ||
    atributoUso(item.resourceCustomAttributes) === "DATAFLOW_PREP" ||
    atributoUso(item.resourceAttributes) === "DATAFLOW_PREP"
  );
}

function atributoUso(valor: unknown): unknown {
  return valor && typeof valor === "object"
    ? (valor as Record<string, unknown>).usage
    : undefined;
}

function valorOpcional(valor: unknown): string | undefined {
  return valor ? String(valor) : undefined;
}
