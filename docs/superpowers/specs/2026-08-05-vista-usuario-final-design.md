# Design: Vista usuario final

**Fecha:** 2026-08-05
**Proyecto:** qlik_automate_creator (apps/web)
**Patrón fuente:** qlik_reportes_creator — `apps/web/src/app/contexto-vista.tsx`, `layout-principal.tsx` (toggle "Vista usuario final").

## Contexto y problema

El panel de automatizaciones ofrece funcionalidad administrativa (Organizaciones, Superadministradores, Configuración con catálogo de orígenes, acciones de creación en Resultados). Los administradores quieren previsualizar qué ve un usuario final (sin permisos de administración) sin cerrar sesión, para validar la experiencia y detectar elementos expuestos por error.

En `qlik_reportes_creator` ya existe este patrón: un checkbox "Vista usuario final" (visible solo para admins) que oculta la navegación y el contenido administrativo y redirige desde rutas administrativas. Este spec porta ese patrón a `qlik_automate_creator`.

## Objetivo

Agregar un toggle "Vista usuario final" que, al activarlo, muestre la aplicación como la vería un usuario sin rol admin:

- Oculta los ítems de navegación administrativos (Organizaciones, Superadministradores).
- Redirige al home (`/`) si el usuario está en `/configuracion` o `/admin/*`.
- Oculta el contenido administrativo dentro de páginas (card "Configuración de la plataforma" en Inicio, acciones de admin en Resultados).
- Cambia el badge de rol en Inicio a "Usuario final".

Estado local de UI (useState), sin persistencia y sin cambios de backend.

## Decisiones tomadas

| Decisión | Valor |
|---|---|
| Alcance | Completo: toggle + ocultar navegación admin + ocultar contenido en páginas + redirección |
| Rutas bloqueadas | `/configuracion` y `/admin/*` (no `/tablas`) |
| Persistencia del toggle | Estado local (`useState`), se resetea al recargar |
| Enfoque | Contexto global `VistaContext` + hook `useVistaUsuarioFinal()` (patrón del fuente) |

## Arquitectura

### 1. Nuevo `apps/web/src/app/contexto-vista.tsx`

Replica del fuente (`qlik_reportes_creator/apps/web/src/app/contexto-vista.tsx`):

```ts
import { createContext, useContext } from "react";

export interface ContextoVista {
  modoUsuarioFinal: boolean;
}

export const VistaContext = createContext<ContextoVista>({
  modoUsuarioFinal: false,
});

export function useVistaUsuarioFinal() {
  return useContext(VistaContext).modoUsuarioFinal;
}
```

### 2. `apps/web/src/app/layout-principal.tsx`

- `const [modoUsuarioFinal, setModoUsuarioFinal] = useState(false);`
- `const puedeVerAdministracion = esAdmin && !modoUsuarioFinal;`
- Checkbox "Vista usuario final" (estilo del fuente: `label` + `input type="checkbox"` con `accent-[var(--color-brand-600)]`) en el header desktop (junto al ContextSwitcher, antes del bloque de usuario) y en el menú móvil. Visible solo si `esAdmin`. En desktop el texto se oculta en pantallas < xl (`hidden xl:inline`); en móvil siempre visible.
- Navegación desktop y móvil: el filtro pasa de:
  - `if (item.superadmin && !esSuperadmin) return false;` → `if (item.superadmin && (!esSuperadmin || !puedeVerAdministracion)) return false;`
  - `if (item.admin && !esAdmin) return false;` → `if (item.admin && !puedeVerAdministracion) return false;`
- `useEffect` de redirección (antes de los returns, leyendo `consulta.data` con guard `if (!sesion) return;`, patrón del fuente):

```ts
useEffect(() => {
  const sesion = consulta.data;
  if (!sesion) return;
  const esSuperadmin = sesion.esSuperadmin ?? false;
  const esAdminLocal =
    esSuperadmin || sesion.membresias.some((m) => m.rol === "admin");
  const puedeVerAdministracion = esAdminLocal && !modoUsuarioFinal;
  const estaEnRutaAdministrativa =
    ubicacion.pathname === "/configuracion" ||
    ubicacion.pathname.startsWith("/admin/");
  if (estaEnRutaAdministrativa && !puedeVerAdministracion) {
    navegar({ to: "/", replace: true });
  }
}, [consulta.data, modoUsuarioFinal, ubicacion.pathname, navegar]);
```

- Envolver el contenido con el proveedor:

```tsx
<main ...>
  <VistaContext.Provider value={{ modoUsuarioFinal }}>
    <Outlet />
  </VistaContext.Provider>
</main>
```

### 3. `apps/web/src/modulos/inicio/pagina-inicio.tsx`

- `const modoUsuarioFinal = useVistaUsuarioFinal();`
- Card "Configuración de la plataforma" (líneas ~122-145): `{esAdmin && !modoUsuarioFinal && (...)}`.
- Badge (línea ~97): `{esAdmin && !modoUsuarioFinal ? "Administrador" : "Usuario final"}`.

### 4. `apps/web/src/modulos/tablas/pagina-tablas-destino.tsx`

- `const modoUsuarioFinal = useVistaUsuarioFinal();`
- `esAdmin` efectivo: `(Boolean(sesion?.esSuperadmin) || membresias.some(admin)) && !modoUsuarioFinal`.
- Todos los usos de `esAdmin` (líneas ~219, 262, 272, 445, 453, 496) usan el valor efectivo, por lo que en modo usuario final un admin ve la variante de usuario ("Solicitar un nuevo reporte", sin acciones de creación/configuración).

## Flujo de datos

`LayoutPrincipal` es la única fuente del estado `modoUsuarioFinal`. Lo propaga por `VistaContext.Provider` a todas las rutas hijas. Las páginas lo leen con `useVistaUsuarioFinal()`. La redirección se dispara en el layout cuando cambia el toggle o la ruta y el usuario está en una ruta administrativa sin permisos de administración efectivos.

## Manejo de errores

No aplica: es estado local de UI. La redirección usa `navegar({ to: "/", replace: true })` con dependencias completas; si el usuario está en `/configuracion` o `/admin/*` y activa el modo, sale de la ruta inmediatamente.

## Estrategia de pruebas (TDD)

- `apps/web/src/app/contexto-vista.test.tsx`: default `false`; el provider propaga el valor al hook.
- `apps/web/src/app/layout-principal.test.tsx`:
  - Admin sin toggle: checkbox visible, ítems "Organizaciones" y "Superadministradores" visibles.
  - Admin con toggle activo: checkbox visible, ítems admin desaparecen de la nav.
  - Admin en `/configuracion` con toggle activo: `useNavigate` mock llamado con `{ to: "/", replace: true }`.
  - No-admin: checkbox no se renderiza.
- `apps/web/src/modulos/inicio/pagina-inicio.test.tsx`: con `VistaContext` en modo usuario final no aparece la card "Configuración de la plataforma"; el badge muestra "Usuario final".
- `apps/web/src/modulos/tablas/pagina-tablas-destino.test.tsx` (nuevo): admin con modo usuario final ve "Solicitar un nuevo reporte" y sin acciones de creación; sin modo activo ve "Crear nuevo reporte".

Mocks: `obtenerSesion` (query), `@tanstack/react-router` (`useLocation`, `useNavigate`), QueryClientProvider + NotificacionesProvider, y montar dentro de `VistaContext.Provider` cuando el test apunte a una página.

## Archivos

| Acción | Archivo |
|---|---|
| Crear | `apps/web/src/app/contexto-vista.tsx` |
| Crear | `apps/web/src/app/contexto-vista.test.tsx` |
| Modificar | `apps/web/src/app/layout-principal.tsx` |
| Crear | `apps/web/src/app/layout-principal.test.tsx` |
| Modificar | `apps/web/src/modulos/inicio/pagina-inicio.tsx` |
| Crear | `apps/web/src/modulos/inicio/pagina-inicio.test.tsx` |
| Modificar | `apps/web/src/modulos/tablas/pagina-tablas-destino.tsx` |
| Crear | `apps/web/src/modulos/tablas/pagina-tablas-destino.test.tsx` |

Fuera de alcance: backend, `/tablas` como ruta bloqueada, persistencia del toggle, cambios en `qlik_reportes_creator`.

## Criterios de éxito

- Admin activa el toggle y ve la app como usuario final (sin nav admin, sin card de plataforma, sin acciones de creación).
- Al activar el toggle estando en `/configuracion` o `/admin/*`, se redirige a `/`.
- Los no-admin no ven el toggle (no necesitan este modo).
- Suite web completa en verde (regresión) y typecheck limpio.
