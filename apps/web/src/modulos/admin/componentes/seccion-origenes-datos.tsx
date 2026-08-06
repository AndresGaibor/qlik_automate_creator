import { Button } from "@/compartido/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { Icon } from "@/compartido/componentes/ui/icon";
import { PaginaCatalogoOrigen } from "@/modulos/origenes/publico";
import { useState } from "react";

export function SeccionOrigenesDatos() {
  const [abierta, setAbierta] = useState(false);

  return (
    <Card className="border-line-200 bg-surface shadow-card">
      <CardHeader className="border-b border-line-200 bg-app/30 pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
              <Icon name="flow" className="text-brand-600" />
              Orígenes de datos
            </CardTitle>
            <p className="mt-1 text-xs text-ink-500">
              Conexiones SFTP y PostgreSQL utilizadas por los Dataflows.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant={abierta ? "outline" : "default"}
            aria-expanded={abierta}
            onClick={() => setAbierta((actual) => !actual)}
            className="shrink-0 gap-1.5"
          >
            <Icon name={abierta ? "x" : "gear"} size="sm" />
            {abierta ? "Cerrar administrador" : "Administrar orígenes"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className={abierta ? "p-4 sm:p-5" : "p-4"}>
        {abierta ? (
          <PaginaCatalogoOrigen integrada />
        ) : (
          <div className="flex flex-col gap-3 rounded-lg border border-line-200 bg-app/30 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-obj-50 text-obj-700">
                <Icon name="flow" size="sm" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink-900">
                  Catálogo de conexiones
                </p>
                <p className="mt-0.5 text-xs text-ink-500">
                  Abre el administrador solo cuando necesites agregar o cambiar
                  una fuente.
                </p>
              </div>
            </div>
            <span className="rounded-full border border-line-200 bg-surface px-2.5 py-1 text-xs font-medium text-ink-600">
              SFTP · PostgreSQL
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
