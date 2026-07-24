import { ErrorConflicto } from "../../../../nucleo/errores/error-aplicacion.js";
import type { PuertoQlik } from "../../../qlik/publico.js";
import { estaEjecucionEnCurso } from "../../dominio/estado-ejecucion.js";
import type { PuertoBloqueoEjecucion } from "../puertos/puerto-bloqueo-ejecucion.js";

export class EjecutarAutomatizacion {
  constructor(
    private readonly qlik: PuertoQlik,
    private readonly bloqueos: PuertoBloqueoEjecucion,
  ) {}

  async ejecutar(tenantId: string, automatizacionId: string) {
    const resultado = await this.bloqueos.ejecutarExclusivo(
      `${tenantId}:${automatizacionId}`,
      async () => {
        const [ultima] = await this.qlik.listarEjecuciones(automatizacionId, {
          limit: 1,
          sort: "desc",
        });
        if (ultima && estaEjecucionEnCurso(ultima.status)) {
          throw new ErrorConflicto(
            `La automatización ya tiene una ejecución en estado ${ultima.status}`,
            { ejecucionId: ultima.id },
          );
        }
        return this.qlik.ejecutarAutomatizacion(automatizacionId);
      },
    );

    if (!resultado) {
      throw new ErrorConflicto("Ya existe una solicitud de ejecución en curso");
    }
    return resultado;
  }
}
