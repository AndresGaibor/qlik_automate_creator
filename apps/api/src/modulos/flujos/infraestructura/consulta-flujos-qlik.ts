import type { ServicioQlik } from "../../qlik/publico.js";
import type { PuertoConsultaFlujos } from "../aplicacion/puertos/puerto-consulta-flujos.js";
import type { Flujo } from "../dominio/flujo.js";

export class ConsultaFlujosQlik implements PuertoConsultaFlujos {
  constructor(private readonly qlik: ServicioQlik) {}

  async listar(espacioId?: string): Promise<Flujo[]> {
    const [flujos, espacios] = await Promise.all([
      this.qlik.listarFlujos(espacioId),
      this.qlik.listarEspacios({ limit: 100 }).catch(() => []),
    ]);
    const nombresEspacios = new Map(
      espacios.map((espacio) => [espacio.id, espacio.name]),
    );
    return flujos.map((flujo) => ({
      id: flujo.id,
      nombre: flujo.name,
      ...(flujo.spaceId ? { espacioId: flujo.spaceId } : {}),
      espacioNombre: flujo.spaceId
        ? (nombresEspacios.get(flujo.spaceId) ?? flujo.spaceId)
        : "Espacio personal",
      ...((flujo.ownerId ?? flujo.owner?.id)
        ? { propietarioId: flujo.ownerId ?? flujo.owner?.id }
        : {}),
      ...((flujo.updatedAt ?? flujo.modifiedDate)
        ? { modificadoEn: flujo.updatedAt ?? flujo.modifiedDate }
        : {}),
    }));
  }
}
