import { Button } from "@/compartido/componentes/ui/button";
import { obtenerSesion } from "@/modulos/autenticacion/api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export function PaginaInicio() {
  const navegar = useNavigate();
  const { data: sesion } = useQuery({
    queryKey: ["sesion"],
    queryFn: obtenerSesion,
  });
  const nombre = sesion?.usuario?.nombre.trim() || "Usuario Qlik";
  const avatarUrl = sesion?.usuario?.avatarUrl?.trim();
  const partes = nombre.split(/\s+/).filter(Boolean);
  const iniciales = [partes[0], partes.at(-1)]
    .filter(
      (parte, indice, lista) => parte && (indice === 0 || parte !== lista[0]),
    )
    .map((parte) => parte?.[0]?.toUpperCase())
    .join("");

  return (
    <div className="mx-auto max-w-4xl py-4 sm:py-10">
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-10 sm:py-12">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Qlik Automatizaciones
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Hola, {nombre}
            </h2>
            <p className="mt-4 max-w-md text-base leading-7 text-slate-300 sm:text-lg">
              Gestiona tus automatizaciones y flujos desde un solo lugar.
            </p>
          </div>
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/10 text-2xl font-bold text-cyan-100 shadow-lg sm:h-24 sm:w-24 sm:text-3xl"
            aria-label={avatarUrl ? undefined : `Iniciales de ${nombre}`}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`Avatar de ${nombre}`}
                className="h-full w-full object-cover"
              />
            ) : (
              iniciales
            )}
          </div>
        </div>
      </section>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button onClick={() => navegar({ to: "/flujos" })}>Ver flujos</Button>
        <Button
          variant="outline"
          onClick={() => navegar({ to: "/automatizaciones" })}
        >
          Ver automatizaciones
        </Button>
      </div>
    </div>
  );
}
