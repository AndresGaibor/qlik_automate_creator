import { IconSprite } from "@/compartido/componentes/ui/icon";
import { Outlet } from "@tanstack/react-router";
import { CabeceraLayout } from "./cabecera-layout";
import { VistaProvider } from "./contexto-vista";
import { ErrorSesionLayout, EstadoLayout } from "./estados-layout";
import { useLayoutPrincipal } from "./use-layout-principal";

export function LayoutPrincipal() {
  return (
    <VistaProvider>
      <ContenidoLayoutPrincipal />
    </VistaProvider>
  );
}

function ContenidoLayoutPrincipal() {
  const layout = useLayoutPrincipal();
  const { consultaSetup, consultaSesion } = layout;

  if (consultaSetup.isLoading) {
    return <EstadoLayout mensaje="Verificando configuración…" />;
  }
  if (consultaSetup.data?.needsSetup === true) return <Outlet />;
  if (layout.esSetup) return <EstadoLayout mensaje="Redirigiendo…" />;
  if (layout.esLogin) return <Outlet />;
  if (consultaSesion.isError) {
    return (
      <ErrorSesionLayout
        error={consultaSesion.error}
        onReintentar={() => consultaSesion.refetch()}
        onLogin={() => layout.navegar({ to: "/login", replace: true })}
      />
    );
  }
  if (consultaSesion.isLoading || !consultaSesion.data) {
    return <EstadoLayout mensaje="Verificando sesión…" />;
  }

  return (
    <div className="ambient min-h-screen overflow-x-hidden bg-app text-ink-900">
      <IconSprite />
      <div className="flex min-h-screen flex-col">
        <CabeceraLayout
          sesion={consultaSesion.data}
          navegacion={layout.navegacion}
          esAdmin={layout.esAdmin}
          modoUsuarioFinal={layout.modoUsuarioFinal}
          onModoUsuarioFinal={layout.setModoUsuarioFinal}
          onCerrarSesion={layout.cerrarSesion}
        />
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-8 sm:py-10 lg:px-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
