import { Button } from "@/compartido/componentes/ui/button";
import { CardHeader, CardTitle } from "@/compartido/componentes/ui/card";
import { Icon } from "@/compartido/componentes/ui/icon";

export function CabeceraUsuariosTenant({
  cantidad,
  onAgregar,
}: {
  cantidad: number;
  onAgregar: () => void;
}) {
  return (
    <CardHeader className="border-b border-line-200 bg-app/30 pb-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
            <Icon name="users" className="text-brand-600" /> Usuarios y permisos
          </CardTitle>
          <p className="mt-1 text-xs text-ink-500">
            {cantidad}{" "}
            {cantidad === 1 ? "usuario autorizado" : "usuarios autorizados"} en
            la plataforma.
          </p>
        </div>
        <Button
          size="sm"
          onClick={onAgregar}
          className="shrink-0 gap-1.5 sm:self-auto"
        >
          <Icon name="plus" size="sm" /> Autorizar usuario
        </Button>
      </div>
    </CardHeader>
  );
}
