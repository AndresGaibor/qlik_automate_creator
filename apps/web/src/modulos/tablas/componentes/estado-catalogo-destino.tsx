import { Button } from "@/compartido/componentes/ui/button";
import { Card, CardContent } from "@/compartido/componentes/ui/card";
import { Icon } from "@/compartido/componentes/ui/icon";

export interface EstadoCatalogoDestinoProps {
  mensaje: string;
  puedeConfigurar: boolean;
  onConfigurar(): void;
  onReintentar(): void;
}

export function EstadoCatalogoDestino({
  mensaje,
  puedeConfigurar,
  onConfigurar,
  onReintentar,
}: EstadoCatalogoDestinoProps) {
  const sinConfigurar = mensaje.toLocaleLowerCase("es").includes("configurad");

  return (
    <Card className="border-line-200 bg-surface shadow-card">
      <CardContent className="flex flex-col items-center gap-4 py-14 text-center">
        <div className="rounded-lg bg-warning-50 p-3 text-warning-700">
          <Icon name="db" size="lg" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-ink-900">
            {sinConfigurar
              ? "Destino de datos no configurado"
              : "No se pudo consultar el destino"}
          </h2>
          <p className="mt-1 max-w-lg text-sm text-ink-500">{mensaje}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {puedeConfigurar && sinConfigurar ? (
            <Button onClick={onConfigurar} className="gap-1.5">
              <Icon name="gear" size="sm" />
              Configurar Impala
            </Button>
          ) : null}
          <Button variant="outline" onClick={onReintentar}>
            Reintentar
          </Button>
        </div>
        {!puedeConfigurar && sinConfigurar ? (
          <p className="text-xs text-ink-500">
            Solicita a un administrador que configure el destino de datos.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
