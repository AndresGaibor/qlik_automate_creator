import { Avatar, inicialesDe } from "@/compartido/componentes/ui/avatar";
import { Icon, type IconName } from "@/compartido/componentes/ui/icon";
import { Reveal } from "@/compartido/componentes/ui/reveal";
import { obtenerSesion } from "@/modulos/autenticacion/api";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

// TODO: sustituir por una query real (p.ej. useQuery(["recientes"])) cuando exista el endpoint.
const RECIENTES_EJEMPLO: { id: string; nombre: string; tipo: "flow" | "autom"; espacio: string; hace: string; vivo?: boolean; iniciales: string; color?: string }[] = [
  { id: "1", nombre: "Auto - BanCol_Test_API → ventas", tipo: "autom", espacio: "Bancolombia prueba", hace: "hace 3 h", vivo: true, iniciales: "AG" },
  { id: "2", nombre: "BanColombia_Prueba_1", tipo: "flow", espacio: "Bancolombia prueba", hace: "hace 4 d", iniciales: "BN", color: "#6b8cae" },
  { id: "3", nombre: "Test_BanCol_Incremental", tipo: "autom", espacio: "Bancolombia prueba", hace: "hace 5 h", vivo: true, iniciales: "AG" },
  { id: "4", nombre: "ELT - Impala - Dataflow - CSV", tipo: "flow", espacio: "Bancolombia prueba", hace: "hace 4 d", iniciales: "JO", color: "#6b8cae" },
];

function Acceso({ to, icono, titulo, descripcion, destacado = false }: { to: "/flujos" | "/automatizaciones"; icono: IconName; titulo: string; descripcion: string; destacado?: boolean }) {
  return (
    <Link
      to={to}
      className={[
        "group relative flex flex-col justify-between overflow-hidden rounded-lg border border-line-200 bg-surface p-5 shadow-card transition-all duration-150 ease-soft hover:-translate-y-0.5 hover:border-line-300 hover:shadow-panel",
        destacado ? "sm:col-span-7" : "sm:col-span-5",
      ].join(" ")}
    >
      <div className="flex items-start justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-md bg-hover text-ink-500 transition-colors group-hover:bg-brand-50 group-hover:text-brand-600">
          <Icon name={icono} size="lg" />
        </span>
        <Icon name="ext" size="sm" className="text-ink-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-600" />
      </div>
      <div className="mt-6">
        <h3 className="font-display text-lg font-semibold text-ink-900">{titulo}</h3>
        <p className="mt-1 text-sm text-ink-500">{descripcion}</p>
      </div>
    </Link>
  );
}

export function PaginaInicio() {
  const { data: sesion } = useQuery({ queryKey: ["sesion"], queryFn: obtenerSesion });
  const nombre = sesion?.usuario?.nombre?.trim() || "Usuario Qlik";
  const avatarUrl = sesion?.usuario?.avatarUrl?.trim();
  const tenantActivo = sesion?.tenantsDisponibles.find((t) => t.id === sesion?.tenantActivoId);
  const esAdmin =
    (sesion?.esSuperadmin ?? false) ||
    (sesion?.tenantsDisponibles ?? []).some(
      (t) => (t as { rol?: string }).rol === "admin" || (t as { rolAdministracion?: string }).rolAdministracion === "admin",
    );

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      {/* Encabezado tipo Hub: a la izquierda, no centrado */}
      <Reveal>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">Inicio</p>
            <h1 className="font-display text-display font-semibold leading-tight tracking-tight text-ink-900">Hola, {nombre}.</h1>
            <p className="mt-1.5 max-w-xl text-ink-500 text-sm">Desde aquí puedes ver y crear tus flujos de datos y automatizaciones conectadas a Qlik Cloud.</p>
          </div>
        </div>
      </Reveal>

      {/* Franja de contexto */}
      <Reveal delay={60}>
        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
          {tenantActivo && (
            <span className="inline-flex items-center gap-2 rounded-md bg-obj-50 px-2.5 py-1 font-medium text-obj-600">
              <span className="grid h-4 w-4 place-items-center rounded-sm bg-obj-600 text-white">
                <Icon name="cloud" className="h-2.5 w-2.5" />
              </span>
              {tenantActivo.organizacionNombre ?? tenantActivo.nombre ?? tenantActivo.host}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600 animate-dot-pulse" />
            {esAdmin ? "Administrador" : "Usuario final"}
          </span>
        </div>
      </Reveal>



      {/* Accesos rápidos — asimétricos a propósito */}
      <section className="mt-8">
        <h2 className="mb-4 font-display text-lg font-semibold">¿Qué quieres hacer?</h2>
        <Reveal delay={120}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
            <Acceso to="/flujos" icono="flow" titulo="Ver flujos de datos" descripcion="Explora todos los Dataflows disponibles en Qlik Cloud. Puedes buscar, filtrar por espacio y crear nuevos directamente desde aquí." destacado />
            <Acceso to="/automatizaciones" icono="zap" titulo="Mis automatizaciones" descripcion="Crea y ejecuta automatizaciones que conectan un Dataflow de Qlik con una tabla de Impala." />
            {esAdmin && (
              <Link
                to="/admin/tenants"
                className="group flex items-center gap-4 rounded-lg border border-dashed border-line-300 bg-surface/60 p-4 transition-colors hover:border-brand-600 hover:bg-brand-50 sm:col-span-12"
              >
                <span className="grid h-10 w-10 place-items-center rounded-md bg-hover text-ink-500 transition-colors group-hover:bg-brand-100 group-hover:text-brand-700">
                  <Icon name="admin" />
                </span>
                <div className="min-w-0">
                  <div className="font-semibold text-ink-900">Administrar organizaciones y conexiones</div>
                  <div className="truncate text-sm text-ink-500">Configura conexiones a Qlik Cloud e Impala, define la plantilla base y gestiona quién tiene acceso.</div>
                </div>
                <Icon name="chev" size="sm" className="ml-auto rotate-180 text-ink-300 transition-colors group-hover:text-brand-600" />
              </Link>
            )}
          </div>
        </Reveal>
      </section>

      {/* Utilizados recientemente — carrusel con reveal escalonado */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Abiertos recientemente</h2>
          <span className="text-sm text-ink-400">Desliza para ver más →</span>
        </div>
        <div className="-mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2">
          {RECIENTES_EJEMPLO.map((item, i) => (
            <Reveal key={item.id} delay={i * 70} className="min-w-[260px] max-w-[260px] snap-start">
              <article className="group h-full overflow-hidden rounded-lg border border-line-200 bg-surface shadow-card transition-all duration-150 ease-soft hover:-translate-y-0.5 hover:border-line-300 hover:shadow-panel">
                <div className="relative grid h-28 place-items-center border-b border-line-200 bg-app/60">
                  <Icon name={item.tipo === "flow" ? "flow" : "robot"} size="lg" className="text-ink-300 transition-colors group-hover:text-brand-600" />
                  {item.vivo && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-600 animate-dot-pulse" />Activa
                    </span>
                  )}
                  <span className="absolute -bottom-3 left-4 grid h-7 w-7 place-items-center rounded-md bg-obj-600 text-white shadow-[0_0_0_2px_var(--color-surface)]">
                    <Icon name={item.tipo === "flow" ? "flow" : "robot"} className="h-3.5 w-3.5" />
                  </span>
                </div>
                <div className="p-4 pt-5">
                  <h3 className="truncate font-semibold text-ink-900">{item.nombre}</h3>
                  <div className="mt-2 flex items-center gap-2 text-xs text-ink-500">
                    <Avatar iniciales={item.iniciales} color={item.color} tam="sm" />
                    <span className="truncate">{item.espacio}</span>
                    <span className="ml-auto font-mono text-ink-400">{item.hace}</span>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
