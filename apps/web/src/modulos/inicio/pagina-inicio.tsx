import { Icon, type IconName } from "@/compartido/componentes/ui/icon";
import { Reveal } from "@/compartido/componentes/ui/reveal";
import { useVistaUsuarioFinal } from "@/app/contexto-vista";
import { obtenerSesion } from "@/modulos/autenticacion/publico";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

function Acceso({
  to,
  icono,
  titulo,
  descripcion,
  destacado = false,
}: {
  to: "/flujos" | "/automatizaciones";
  icono: IconName;
  titulo: string;
  descripcion: string;
  destacado?: boolean;
}) {
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
        <Icon
          name="ext"
          size="sm"
          className="text-ink-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-600"
        />
      </div>
      <div className="mt-6">
        <h3 className="font-display text-lg font-semibold text-ink-900">
          {titulo}
        </h3>
        <p className="mt-1 text-sm text-ink-500">{descripcion}</p>
      </div>
    </Link>
  );
}

export function PaginaInicio() {
  const { data: sesion } = useQuery({
    queryKey: ["sesion"],
    queryFn: obtenerSesion,
  });
  const nombre = sesion?.usuario?.nombre?.trim() || "Usuario Qlik";
  const avatarUrl = sesion?.usuario?.avatarUrl?.trim();
  const tenantActivo = sesion?.tenantsDisponibles.find(
    (t) => t.id === sesion?.tenantActivoId,
  );
  const esAdmin =
    (sesion?.esSuperadmin ?? false) ||
    (sesion?.membresias ?? []).some((m) => m.rol === "admin");
  const { estado } = useVistaUsuarioFinal();
  const puedeVerAdministracion = esAdmin && !estado.modoUsuarioFinal;

  return (
    <div className="mx-auto w-full max-w-[1180px]">
      {/* Encabezado tipo Hub: a la izquierda, no centrado */}
      <Reveal>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">
              Inicio
            </p>
            <h1 className="font-display text-display font-semibold leading-tight tracking-tight text-ink-900">
              Bienvenido a Qlik Automate Creator
            </h1>
            <p className="mt-1.5 max-w-xl text-ink-500 text-sm">
              Aquí puedes ver, conectar y automatizar tus datos en un solo
              lugar, sin necesidad de escribir código.
            </p>
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
              {tenantActivo.organizacionNombre ??
                tenantActivo.nombre ??
                tenantActivo.host}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600 animate-dot-pulse" />
            {puedeVerAdministracion ? "Administrador" : "Usuario final"}
          </span>
        </div>
      </Reveal>

      {/* Accesos rápidos — asimétricos a propósito */}
      <section className="mt-8">
        <h2 className="mb-4 font-display text-lg font-semibold">
          ¿Qué quieres hacer?
        </h2>
        <Reveal delay={120}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
            <Acceso
              to="/flujos"
              icono="flow"
              titulo="Fuentes de datos conectadas"
              descripcion="Revisa los Dataflows de Qlik Cloud que ya están sincronizados y listos para usar en tus automatizaciones."
              destacado
            />
            <Acceso
              to="/automatizaciones"
              icono="zap"
              titulo="Automatizaciones funcionando"
              descripcion="Explora los procesos de Qlik Automate que están corriendo o programados para mantener tus datos al día."
            />
            {puedeVerAdministracion && (
              <Link
                to="/admin/tenants"
                className="group flex items-center gap-4 rounded-lg border border-dashed border-line-300 bg-surface/60 p-4 transition-colors hover:border-brand-600 hover:bg-brand-50 sm:col-span-12"
              >
                <span className="grid h-10 w-10 place-items-center rounded-md bg-hover text-ink-500 transition-colors group-hover:bg-brand-100 group-hover:text-brand-700">
                  <Icon name="admin" />
                </span>
                <div className="min-w-0">
                  <div className="font-semibold text-ink-900">
                    Configuración de la plataforma
                  </div>
                  <div className="truncate text-sm text-ink-500">
                    Gestiona organizaciones, conexiones a Qlik Cloud y destinos,
                    plantillas base y permisos de usuarios.
                  </div>
                </div>
                <Icon
                  name="chev"
                  size="sm"
                  className="ml-auto rotate-180 text-ink-300 transition-colors group-hover:text-brand-600"
                />
              </Link>
            )}
          </div>
        </Reveal>
      </section>

      {/* El API todavía no ofrece historial de recientes; no se muestran ejemplos ficticios. */}
      <section className="mt-10">
        <h2 className="mb-4 font-display text-lg font-semibold">
          Abiertos recientemente
        </h2>
        <div className="rounded-lg border border-dashed border-line-300 bg-surface p-6 text-center text-sm text-ink-500">
          Aún no hay historial de elementos recientes.
        </div>
      </section>
    </div>
  );
}
