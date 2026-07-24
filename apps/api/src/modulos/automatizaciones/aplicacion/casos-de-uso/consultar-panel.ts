import type {
  DetalleAutomatizacion,
  EspacioDisponible,
  ResumenAutomatizacion,
} from "@qlik/contratos/automatizaciones";
import type { PuertoQlik, UsuarioQlik } from "../../../qlik/publico.js";
import {
  aDetalleAutomatizacion,
  aEspacioDisponible,
  aResumenAutomatizacion,
  crearMapaEspacios,
  crearMapaUsuarios,
} from "../mapeador-panel.js";

export class ConsultarPanelAutomatizaciones {
  constructor(private readonly qlik: PuertoQlik) {}

  async listar(espacioId?: string): Promise<ResumenAutomatizacion[]> {
    const automatizaciones = await this.qlik.listarAutomatizaciones({
      limit: 200,
      sort: "-updatedAt",
      ...(espacioId ? { spaceId: espacioId } : {}),
    });
    const [espacios, usuarios] = await Promise.all([
      this.obtenerEspaciosSeguro(),
      this.obtenerPropietarios(automatizaciones.map((item) => item.ownerId)),
    ]);
    const mapaEspacios = crearMapaEspacios(espacios);
    const mapaUsuarios = crearMapaUsuarios(usuarios);
    return automatizaciones.map((automatizacion) =>
      aResumenAutomatizacion(automatizacion, mapaEspacios, mapaUsuarios),
    );
  }

  async obtener(id: string): Promise<DetalleAutomatizacion> {
    const [automatizacion, ejecuciones] = await Promise.all([
      this.qlik.obtenerAutomatizacion(id),
      this.qlik.listarEjecuciones(id, { limit: 20, sort: "desc" }),
    ]);
    const [espacios, usuarios] = await Promise.all([
      this.obtenerEspaciosSeguro(),
      this.obtenerPropietarios([automatizacion.ownerId]),
    ]);
    return aDetalleAutomatizacion(
      automatizacion,
      ejecuciones,
      crearMapaEspacios(espacios),
      crearMapaUsuarios(usuarios),
    );
  }

  async listarEspacios(): Promise<EspacioDisponible[]> {
    const espacios = await this.qlik.listarEspacios({
      limit: 100,
      sort: "+name",
    });
    return espacios.map(aEspacioDisponible);
  }

  private async obtenerEspaciosSeguro() {
    try {
      return await this.qlik.listarEspacios({ limit: 100, sort: "+name" });
    } catch {
      return [];
    }
  }

  private async obtenerPropietarios(
    ids: Array<string | undefined>,
  ): Promise<UsuarioQlik[]> {
    const unicos = [...new Set(ids.filter((id): id is string => !!id))];
    const resultados = await Promise.allSettled(
      unicos.map((id) => this.qlik.obtenerUsuario(id, "name,email,subject")),
    );
    return resultados.flatMap((resultado) =>
      resultado.status === "fulfilled" ? [resultado.value] : [],
    );
  }
}
