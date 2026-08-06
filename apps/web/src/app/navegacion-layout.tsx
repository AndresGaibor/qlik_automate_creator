import { Icon, type IconName } from "@/compartido/componentes/ui/icon";
import { Link, useLocation } from "@tanstack/react-router";

export type RutaNav =
  | "/"
  | "/flujos"
  | "/automatizaciones"
  | "/tablas"
  | "/configuracion";

export interface ItemNavegacion {
  to: RutaNav;
  etiqueta: string;
  icono: IconName;
  admin?: boolean;
  superadmin?: boolean;
}

const NAVEGACION: readonly ItemNavegacion[] = [
  { to: "/", etiqueta: "Inicio", icono: "home" },
  { to: "/flujos", etiqueta: "Dataflows", icono: "flow" },
  { to: "/automatizaciones", etiqueta: "Automatizaciones", icono: "zap" },
  { to: "/tablas", etiqueta: "Resultados", icono: "db" },
  {
    to: "/configuracion",
    etiqueta: "Configuración",
    icono: "admin",
    admin: true,
  },
] as const;

export function filtrarNavegacion({
  esAdmin,
  esSuperadmin,
  modoUsuarioFinal,
}: {
  esAdmin: boolean;
  esSuperadmin: boolean;
  modoUsuarioFinal: boolean;
}): ItemNavegacion[] {
  return NAVEGACION.filter((item) => {
    if (item.superadmin && !esSuperadmin) return false;
    if (item.admin && !esAdmin) return false;
    if (modoUsuarioFinal && (item.admin || item.superadmin)) return false;
    return true;
  });
}

export function NavegacionLayout({
  items,
  movil = false,
}: {
  items: ItemNavegacion[];
  movil?: boolean;
}) {
  return (
    <nav
      className={movil ? "grid gap-1" : "hidden items-center gap-1.5 md:flex"}
      aria-label={movil ? "Navegación móvil" : "Navegación principal"}
    >
      {items.map((item) => (
        <HeaderLink key={item.to} {...item} />
      ))}
    </nav>
  );
}

function HeaderLink({
  to,
  etiqueta,
  icono,
}: Pick<ItemNavegacion, "to" | "etiqueta" | "icono">) {
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
