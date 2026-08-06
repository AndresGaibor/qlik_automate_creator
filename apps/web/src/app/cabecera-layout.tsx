import { Avatar } from "@/compartido/componentes/ui/avatar";
import { inicialesDe } from "@/compartido/componentes/ui/avatar-utils";
import { Button } from "@/compartido/componentes/ui/button";
import { Icon } from "@/compartido/componentes/ui/icon";
import { useState } from "react";
import { type ItemNavegacion, NavegacionLayout } from "./navegacion-layout";
import type { SesionLayout } from "./use-layout-principal";

interface Props {
  sesion: SesionLayout;
  navegacion: ItemNavegacion[];
  esAdmin: boolean;
  modoUsuarioFinal: boolean;
  onModoUsuarioFinal: (activo: boolean) => void;
  onCerrarSesion: () => void;
}

export function CabeceraLayout({
  sesion,
  navegacion,
  esAdmin,
  modoUsuarioFinal,
  onModoUsuarioFinal,
  onCerrarSesion,
}: Props) {
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const nombre = sesion.usuario?.nombre?.trim() || "Usuario Qlik";

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-line-200 bg-surface/95 px-4 shadow-sm backdrop-blur sm:px-8">
        <div className="flex items-center gap-3 shrink-0 pr-4 border-r border-line-200">
          <Icon name="brand" className="text-brand-600" size="lg" />
          <span className="font-display text-[18px] font-semibold tracking-tight text-ink-900">
            Automatizaciones
          </span>
        </div>
        <NavegacionLayout items={navegacion} />
        <div className="ml-auto hidden items-center gap-4 md:flex">
          {esAdmin && (
            <label className="flex cursor-pointer items-center gap-2 select-none">
              <input
                type="checkbox"
                checked={modoUsuarioFinal}
                onChange={(evento) => onModoUsuarioFinal(evento.target.checked)}
                className="h-4 w-4 accent-brand-600"
              />
              <span className="hidden xl:inline text-xs font-medium text-ink-600">
                Vista usuario final
              </span>
            </label>
          )}
          <div className="flex items-center gap-2.5 border-l border-line-200 pl-4">
            <Avatar
              iniciales={inicialesDe(nombre)}
              src={sesion.usuario?.avatarUrl}
              tam="md"
            />
            <span className="hidden text-sm font-semibold text-ink-900 lg:inline-block">
              {nombre}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            data-accion="cerrar-sesion"
            onClick={onCerrarSesion}
          >
            Cerrar sesión
          </Button>
        </div>
        <button
          type="button"
          className="ml-auto grid h-10 w-10 place-items-center rounded-md text-ink-700 hover:bg-hover md:hidden"
          aria-label={
            menuMovilAbierto
              ? "Cerrar menú de navegación"
              : "Abrir menú de navegación"
          }
          aria-expanded={menuMovilAbierto}
          aria-controls="navegacion-movil"
          onClick={() => setMenuMovilAbierto((abierto) => !abierto)}
        >
          <span aria-hidden className="text-xl">
            <Icon name={menuMovilAbierto ? "x" : "rows"} size="sm" />
          </span>
        </button>
      </header>
      {menuMovilAbierto && (
        <div
          id="navegacion-movil"
          className="border-b border-line-200 bg-surface p-3 md:hidden"
        >
          <NavegacionLayout items={navegacion} movil />
          <div className="mt-3 flex items-center justify-between border-t border-line-200 pt-3">
            <span className="truncate text-sm font-medium">{nombre}</span>
            <Button variant="outline" size="sm" onClick={onCerrarSesion}>
              Cerrar sesión
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
