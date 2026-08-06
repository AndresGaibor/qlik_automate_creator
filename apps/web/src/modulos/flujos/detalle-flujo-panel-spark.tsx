import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";
import { VisorJsonInteractivo } from "@/compartido/componentes/ui/visor-json-interactivo";
import { useState } from "react";
import type { RespuestaCatalogoSpark } from "./api";
import { urlCatalogoConexiones } from "./modelo-detalle-flujo";

interface Props {
  datos?: RespuestaCatalogoSpark;
  cargando: boolean;
}

export function DetalleFlujoPanelSpark({ datos, cargando }: Props) {
  const [copiado, setCopiado] = useState(false);

  const copiar = () => {
    if (!datos?.catalogoJson) return;
    navigator.clipboard.writeText(JSON.stringify(datos.catalogoJson, null, 2));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="space-y-4">
      {datos?.conexionesFaltantes && datos.conexionesFaltantes.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold text-amber-800 text-sm">
              <Icon name="sparkles" size="sm" className="text-amber-600" />
              ¡Falta configurar el catálogo técnico de conexiones!
            </div>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="bg-white border-amber-300 text-amber-900 hover:bg-amber-100 text-xs"
            >
              <a href={urlCatalogoConexiones(datos.conexionesFaltantes)}>
                Ir a Configuración de Conexiones
              </a>
            </Button>
          </div>
          <p className="text-amber-700">
            El script Qlik contiene nombres de conexión, tablas y archivos, pero
            falta definir los datos técnicos en el catálogo central para las
            siguientes conexiones:
          </p>
          <ul className="list-disc list-inside font-mono text-[11px] text-amber-800 bg-amber-100/50 p-2.5 rounded-lg border border-amber-200 space-y-1">
            {datos.conexionesFaltantes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="text-[11px] text-amber-600 italic">
            Una vez configuradas, se reutilizarán automáticamente para cualquier
            Dataflow que use la misma conexión.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-xs">
        <span className="text-slate-600 font-medium flex items-center gap-2">
          <Icon name="sparkles" size="sm" className="text-brand-600" />
          Catálogo resuelto generado automáticamente a partir del script Qlik
          para Spark motor.py.
        </span>
        <button
          type="button"
          onClick={copiar}
          disabled={!datos?.catalogoJson}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-line-300 text-ink-800 hover:bg-app text-xs font-semibold transition-colors shadow-sm disabled:opacity-50"
        >
          <Icon name="copy" size="sm" className="text-brand-600" />
          {copiado ? "¡JSON Copiado!" : "Copiar JSON para Spark"}
        </button>
      </div>

      {cargando ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center gap-2 bg-white rounded-xl border p-8">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          <p className="text-sm text-ink-500 font-medium">
            Generando catálogo JSON para Spark...
          </p>
        </div>
      ) : datos?.catalogoJson ? (
        <VisorJsonInteractivo data={datos.catalogoJson} />
      ) : (
        <div className="p-5 text-xs text-slate-500">
          No se pudo generar el catálogo para este flujo.
        </div>
      )}
    </div>
  );
}
