import { Button } from "@/compartido/componentes/ui/button";
import { Icon, type IconName } from "@/compartido/componentes/ui/icon";

export type TipoError = "general" | "conexion" | "servidor" | "no-encontrado";

interface EstadoErrorProps {
  mensaje?: string;
  tipo?: TipoError;
  onReintentar?: () => void;
}

const COPIAS_POR_TIPO: Record<
  TipoError,
  { titulo: string; descripcion: string; icono: IconName }
> = {
  general: {
    titulo: "No pudimos cargar esta información",
    descripcion:
      "Algo salió mal al obtener los datos. Verifica tu conexión e intenta nuevamente.",
    icono: "cloud",
  },
  conexion: {
    titulo: "Sin conexión a internet",
    descripcion:
      "No pudimos conectar con el servidor. Revisa tu conexión e intenta nuevamente.",
    icono: "cloud",
  },
  servidor: {
    titulo: "El servidor no responde",
    descripcion:
      "El servicio está teniendo problemas. Por favor espera unos minutos e intenta nuevamente.",
    icono: "cloud",
  },
  "no-encontrado": {
    titulo: "No encontramos lo que buscabas",
    descripcion: "Es posible que este recurso haya sido eliminado o no exista.",
    icono: "search",
  },
};

function clasificarError(mensaje: string | undefined): TipoError {
  if (!mensaje) return "general";
  const m = mensaje.toLowerCase();
  if (
    m.includes("network") ||
    m.includes("fetch") ||
    m.includes("conexión") ||
    m.includes(" conexion") ||
    m.includes("offline") ||
    m.includes("enlace") ||
    m.includes("failed to resolve")
  ) {
    return "conexion";
  }
  if (
    m.includes("500") ||
    m.includes("502") ||
    m.includes("503") ||
    m.includes("servidor") ||
    m.includes("internal") ||
    m.includes("timeout")
  ) {
    return "servidor";
  }
  if (
    m.includes("404") ||
    m.includes("no encontrado") ||
    m.includes("not found")
  ) {
    return "no-encontrado";
  }
  return "general";
}

export function EstadoError({
  mensaje,
  tipo: tipoForzado,
  onReintentar,
}: EstadoErrorProps) {
  const tipo = tipoForzado ?? clasificarError(mensaje);
  const copia = COPIAS_POR_TIPO[tipo];

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="mx-auto flex min-h-56 max-w-xl items-center justify-center rounded-xl border border-danger-200 bg-surface px-6 py-8 shadow-card"
    >
      <div className="text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-danger-50 text-danger-600">
          <Icon name={copia.icono} size="md" />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-ink-900">
          {copia.titulo}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-ink-500">
          {copia.descripcion}
        </p>
        {mensaje && tipo === "general" && (
          <details className="mt-3">
            <summary className="cursor-pointer text-xs text-ink-400 hover:text-ink-500">
              Ver detalles técnicos
            </summary>
            <p
              className="mt-1 text-left rounded bg-danger-50 px-3 py-2 text-xs text-danger-700"
              data-detalle-error
            >
              {mensaje}
            </p>
          </details>
        )}
        {onReintentar && (
          <Button type="button" className="mt-5 gap-2" onClick={onReintentar}>
            <Icon name="rows" size="sm" />
            Reintentar
          </Button>
        )}
      </div>
    </div>
  );
}
