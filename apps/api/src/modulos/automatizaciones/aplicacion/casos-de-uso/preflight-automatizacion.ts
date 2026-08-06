import type { PreflightAutomatizacion as PreflightDto } from "@qlik/contratos/automatizaciones";
import { descubrirRequisitosConexion } from "../../../flujos/publico.js";

interface QlikScript {
  obtenerScriptApp(
    flujoId: string,
    version: "current",
  ): Promise<{ script?: string | null }>;
}

interface OrigenPreflight {
  id: string;
  tipo: string;
  nombre: string;
  estado: "sin_probar" | "disponible" | "error";
  probadaEn: Date | null;
  mensajeError: string | null;
  secretoConfigurado?: boolean;
}

interface DestinoPreflight {
  id: string;
  tipo: string;
  nombre: string;
  estado: "activo" | "error" | "desconectado";
  probadaEn: Date | null;
  mensajeError: string | null;
}

export class PreflightAutomatizacion {
  constructor(
    private readonly qlik: QlikScript,
    private readonly origenes: {
      listar(organizacionId: string): Promise<OrigenPreflight[]>;
    },
    private readonly destinos: {
      listar(organizacionId: string): Promise<DestinoPreflight[]>;
    },
  ) {}

  async ejecutar(entrada: {
    organizacionId: string;
    flujoId: string;
    flujoNombre: string;
  }): Promise<PreflightDto> {
    const { script } = await this.qlik.obtenerScriptApp(
      entrada.flujoId,
      "current",
    );
    const requisitos = descubrirRequisitosConexion(script ?? "");
    const [origenes, destinos] = await Promise.all([
      this.origenes.listar(entrada.organizacionId),
      this.destinos.listar(entrada.organizacionId),
    ]);

    return {
      flujo: { id: entrada.flujoId, nombre: entrada.flujoNombre },
      conexionesRequeridas: requisitos.map((requisito) => {
        const conexion = origenes.find(
          (item) =>
            item.tipo === requisito.tipo && item.nombre === requisito.nombre,
        );
        const incompleta = conexion?.secretoConfigurado === false;
        return {
          tipo: requisito.tipo,
          nombre: requisito.nombre,
          estado: incompleta
            ? ("incompleta" as const)
            : (conexion?.estado ?? "faltante"),
          conexionId: conexion?.id ?? null,
          probadaEn: incompleta
            ? null
            : (conexion?.probadaEn?.toISOString() ?? null),
          mensaje: incompleta
            ? "Falta configurar la credencial segura"
            : (conexion?.mensajeError ?? null),
        };
      }),
      destinosPostgres: destinos
        .filter((destino) => destino.tipo === "postgres")
        .map((destino) => ({
          id: destino.id,
          nombre: destino.nombre,
          estado: destino.estado,
          probadoEn: destino.probadaEn?.toISOString() ?? null,
          mensaje: destino.mensajeError,
        })),
    };
  }
}
