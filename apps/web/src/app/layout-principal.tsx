import { ErrorClienteApi } from "@/compartido/api/cliente";
import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { Avatar, inicialesDe } from "@/compartido/componentes/ui/avatar";
import { Button } from "@/compartido/componentes/ui/button";
import { ContextSwitcher } from "@/compartido/componentes/ui/context-switcher";
import {
  Icon,
  type IconName,
  IconSprite,
} from "@/compartido/componentes/ui/icon";
import {
  cambiarTenantActivo,
  cerrarSesion,
  obtenerSesion,
} from "@/modulos/autenticacion/api";
import { obtenerEstadoSetup } from "@/modulos/setup/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

// Rutas de primer nivel. Subconjunto explícito de tu routeTree → tipa sin `any`.
type RutaNav =
  | "/"
  | "/flujos"
  | "/automatizaciones"
  | "/tablas"
  | "/admin/tenants"
  | "/admin/superadmins";

const NAVEGACION: readonly {
  to: RutaNav;
  etiqueta: string;
  icono: IconName;
  admin?: boolean;
  superadmin?: boolean;
}[] = [
  { to: "/", etiqueta: "Inicio", icono: "home" },
  { to: "/flujos", etiqueta: "Dataflows", icono: "flow" },
  { to: "/automatizaciones", etiqueta: "Automatizaciones", icono: "zap" },
  { to: "/tablas", etiqueta: "Resultados", icono: "db" },
  {
    to: "/admin/tenants",
    etiqueta: "Configuración",
    icono: "admin",
    admin: true,
  },
  {
    to: "/admin/superadmins",
    etiqueta: "Organizaciones",
    icono: "shield",
    superadmin: true,
  },
] as const;

function HeaderLink({
  to,
  etiqueta,
  icono,
}: { to: RutaNav; etiqueta: string; icono: IconName }) {
  const { pathname } = useLocation();
  const activo =
    to === "/"
      ? pathname === "/"
      : pathname === to || pathname.startsWith(`${to}/`);
  return (
    <Link
      to={to}
      className={[
        "relative flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors duration-150 ease-soft font-medium",
        activo
          ? "bg-brand-50 text-brand-700 font-semibold"
          : "text-ink-700 hover:bg-hover hover:text-ink-900",
      ].join(" ")}
    >
      <Icon
        name={icono}
        size="sm"
        className={activo ? "text-brand-600" : "text-ink-500"}
      />
      <span>{etiqueta}</span>
    </Link>
  );
}

export function LayoutPrincipal() {
  const navegar = useNavigate();
  const queryClient = useQueryClient();
  const ubicacion = useLocation();
  const { mostrarError } = useNotificaciones();
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  const esLogin = ubicacion.pathname === "/login";
  const esSetup = ubicacion.pathname === "/setup";

  const consultaSetup = useQuery({
    queryKey: ["setup-status"],
    queryFn: obtenerEstadoSetup,
    retry: false,
  });

  const consulta = useQuery({
    queryKey: ["sesion"],
    queryFn: obtenerSesion,
    retry: false,
    enabled: !esLogin && !esSetup,
  });

  useEffect(() => {
    if (consultaSetup.data?.needsSetup === true && !esSetup) {
      navegar({ to: "/setup", replace: true });
    }
    if (consultaSetup.data?.needsSetup === false && esSetup) {
      navegar({ to: "/login", replace: true });
    }
  }, [consultaSetup.data, esSetup, navegar]);

  const cambiarTenant = useMutation({
    mutationFn: cambiarTenantActivo,
    onSuccess: async () => {
      await queryClient.invalidateQueries();
    },
    onError: (error: Error) => mostrarError(error.message),
  });
  const cerrar = useMutation({
    mutationFn: cerrarSesion,
    onSuccess: async () => {
      queryClient.clear();
      navegar({ to: "/login", replace: true });
    },
    onError: (error: Error) => mostrarError(error.message),
  });

  useEffect(() => {
    if (!esLogin && consulta.error instanceof ErrorClienteApi) {
      if (consulta.error.estado === 401)
        navegar({ to: "/login", replace: true });
      else mostrarError(consulta.error.message);
    }
  }, [consulta.error, esLogin, mostrarError, navegar]);

  if (consultaSetup.isLoading) {
    return (
      <div className="ambient flex min-h-screen items-center justify-center bg-app px-4">
        <p className="text-ink-500" aria-live="polite">
          Verificando configuración…
        </p>
      </div>
    );
  }

  if (consultaSetup.data?.needsSetup === true) {
    return <Outlet />;
  }

  if (esSetup) {
    return (
      <div className="ambient flex min-h-screen items-center justify-center bg-app px-4">
        <p className="text-ink-500" aria-live="polite">
          Redirigiendo…
        </p>
      </div>
    );
  }

  if (esLogin) return <Outlet />;

  if (consulta.isError) {
    return (
      <div className="ambient flex min-h-screen items-center justify-center bg-app px-4">
        <div
          className="max-w-md rounded-lg border border-danger-200 bg-surface p-6 text-center shadow-card"
          role="alert"
        >
          <h1 className="font-semibold text-ink-900">
            No pudimos verificar tu sesión
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            {consulta.error instanceof Error
              ? consulta.error.message
              : "Intenta nuevamente."}
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Button variant="outline" onClick={() => consulta.refetch()}>
              Reintentar
            </Button>
            <Button onClick={() => navegar({ to: "/login", replace: true })}>
              Ir al inicio de sesión
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (consulta.isLoading || !consulta.data) {
    return (
      <div className="ambient flex min-h-screen items-center justify-center bg-app px-4">
        <p className="text-ink-500" aria-live="polite">
          Verificando sesión…
        </p>
      </div>
    );
  }

  const sesion = consulta.data;
  const esSuperadmin = sesion.esSuperadmin ?? false;
  const esAdmin =
    esSuperadmin || sesion.membresias.some((m) => m.rol === "admin");
  const nombre = sesion.usuario?.nombre?.trim() || "Usuario Qlik";

  return (
    <div className="ambient min-h-screen bg-app text-ink-900">
      <IconSprite />
      <div className="flex min-h-screen flex-col">
        {/* ── Topbar / Header completo ── */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-line-200 bg-surface/95 px-4 shadow-sm backdrop-blur sm:px-8">
          {/* Logo / Marca */}
          <div className="flex items-center gap-3 shrink-0 pr-4 border-r border-line-200">
            <Icon name="brand" className="text-brand-600" size="lg" />
            <span className="font-display text-[18px] font-semibold tracking-tight text-ink-900">
              Automatizaciones
            </span>
          </div>

          {/* Navegación horizontal centrada / limpia */}
          <nav
            className="hidden items-center gap-1.5 md:flex"
            aria-label="Navegación principal"
          >
            {NAVEGACION.filter((item) => {
              if (item.superadmin && !esSuperadmin) return false;
              if (item.admin && !esAdmin) return false;
              return true;
            }).map((item) => (
              <HeaderLink key={item.to} {...item} />
            ))}
          </nav>

          {/* Acciones del extremo derecho (Tenant selector + usuario + logout) */}
          <div className="ml-auto hidden items-center gap-4 md:flex">
            {sesion.tenantsDisponibles.length > 1 && (
              <ContextSwitcher
                tenants={sesion.tenantsDisponibles}
                activoId={sesion.tenantActivoId}
                cargando={cambiarTenant.isPending}
                onCambiar={(id) => cambiarTenant.mutate(id)}
              />
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
              onClick={() => cerrar.mutate()}
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
            <nav className="grid gap-1" aria-label="Navegación móvil">
              {NAVEGACION.filter(
                (item) =>
                  (!item.superadmin || esSuperadmin) &&
                  (!item.admin || esAdmin),
              ).map((item) => (
                <HeaderLink key={item.to} {...item} />
              ))}
            </nav>
            <div className="mt-3 flex items-center justify-between border-t border-line-200 pt-3">
              <span className="truncate text-sm font-medium">{nombre}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => cerrar.mutate()}
              >
                Cerrar sesión
              </Button>
            </div>
          </div>
        )}

        {/* ── Contenido Principal (Full width aprovechando la pantalla) ── */}
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-8 sm:py-10 lg:px-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
