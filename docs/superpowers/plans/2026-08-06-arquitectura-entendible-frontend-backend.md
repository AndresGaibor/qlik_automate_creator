# Arquitectura entendible frontend y backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corregir límites arquitectónicos del frontend y backend, eliminar comportamiento ficticio y dejar protecciones automáticas que mantengan el código entendible.

**Architecture:** Se conserva el monolito modular y las features React actuales. Las rutas quedan como adaptadores HTTP, los casos de uso dependen de puertos, PostgreSQL y clientes externos viven en infraestructura, y cada feature frontend expone una superficie pública estable.

**Tech Stack:** Bun, TypeScript, Hono, Drizzle ORM, React 18, TanStack Query, Vitest, Biome.

## Global Constraints

- Trabajar directamente en `main`, sin worktrees, por autorización expresa del usuario.
- Preservar los cambios locales existentes y no incorporarlos accidentalmente en commits.
- No añadir dependencias nuevas.
- Mantener nombres y contratos del negocio en español.
- No mostrar capacidades simuladas como si fueran reales.
- Comentar únicamente decisiones, restricciones e invariantes no evidentes.
- Cada tarea debe pasar sus pruebas focalizadas y `git diff --check`.

---

## Mapa de archivos y responsabilidades

- `apps/api/src/arquitectura.test.ts`: reglas ejecutables para dependencias permitidas.
- `apps/api/src/modulos/origenes/aplicacion/*`: casos de uso y puerto de persistencia.
- `apps/api/src/modulos/origenes/infraestructura/*`: repositorio PostgreSQL y cifrado persistido.
- `apps/api/src/modulos/origenes/http/*`: traducción HTTP sin Drizzle.
- `apps/api/src/modulos/flujos/aplicacion/puertos/*`: consulta de conexiones de origen usada por flujos.
- `apps/api/src/modulos/destinos/infraestructura/fabrica-destinos.ts`: construcción de clientes concretos.
- `apps/api/src/app.ts`: composición, middleware y registro de rutas.
- `apps/web/src/modulos/*/publico.ts`: contratos públicos entre features.
- `apps/web/src/modulos/tablas/api.ts`: transporte HTTP del catálogo de destinos.
- `apps/web/src/modulos/tablas/consultas.ts`: queries y adaptación de datos.
- `apps/web/src/modulos/tablas/componentes/*`: lista, detalle y estados reales.
- `apps/web/src/modulos/tablas/pagina-tablas-destino.tsx`: coordinación de página.
- `package.json`: comandos canónicos de pruebas por runtime.

### Task 1: Gates de arquitectura y pruebas correctas por runtime

**Files:**
- Modify: `package.json`
- Modify: `apps/api/src/arquitectura.test.ts`
- Create: `apps/web/src/arquitectura.test.ts`

**Interfaces:**
- Produces: scripts `test:api`, `test:web`, `test` y reglas que devuelven rutas relativas de violaciones.
- Consumes: estructura existente de `apps/api/src/modulos` y `apps/web/src/modulos`.

- [ ] **Step 1: Escribir pruebas que expongan las violaciones actuales**

Añadir un escáner reutilizable que lea `.ts` y `.tsx` y pruebe:

```ts
expect(await buscarImportacionesProhibidas("modulos", /drizzle-orm|plataforma\/persistencia/)).toEqual([]);
expect(await buscarAplicacionHaciaInfraestructura()).toEqual([]);
expect(await buscarImportacionesInternasEntreModulos()).toEqual([]);
```
- [ ] **Step 2: Ejecutar los tests y confirmar el fallo esperado**

Run:

```bash
bun test apps/api/src/arquitectura.test.ts
bun run --cwd apps/web test:run -- src/arquitectura.test.ts
```

Expected: FAIL mostrando rutas HTTP con Drizzle, la fábrica de destinos en aplicación e importaciones internas entre features.

- [ ] **Step 3: Corregir scripts raíz**

Configurar:

```json
{
  "test:api": "bun test tests apps/api/src packages/contratos/src",
  "test:web": "bun run --cwd apps/web test:run",
  "test": "bun run test:api && bun run test:web"
}
```

- [ ] **Step 4: Mantener los tests rojos hasta completar los límites**

No debilitar expresiones regulares ni añadir excepciones globales. Las excepciones puntuales deben incluir ruta exacta y comentario de motivo.

- [ ] **Step 5: Verificar formato del bloque**

Run: `git diff --check -- package.json apps/api/src/arquitectura.test.ts apps/web/src/arquitectura.test.ts`

### Task 2: Extraer conexiones de origen fuera de HTTP

**Files:**
- Create: `apps/api/src/modulos/origenes/aplicacion/puertos/repositorio-conexiones-origen.ts`
- Create: `apps/api/src/modulos/origenes/aplicacion/casos-de-uso/gestionar-conexiones-origen.ts`
- Create: `apps/api/src/modulos/origenes/infraestructura/repositorio-conexiones-origen-postgres.ts`
- Modify: `apps/api/src/modulos/origenes/http/rutas-conexiones-origen.ts`
- Modify: `apps/api/src/modulos/origenes/http/rutas-conexiones-origen.test.ts`
- Modify: `apps/api/src/modulos/origenes/publico.ts`
- Modify: `apps/api/src/app.ts`

**Interfaces:**
- Produces: `RepositorioConexionesOrigen`, `GestionarConexionesOrigen` y `RepositorioConexionesOrigenPostgres`.
- Consumes: `PuertoAuditoria`, servicio de cifrado y contexto de sesión.

- [ ] **Step 1: Escribir tests del caso de uso antes de mover lógica**

Cubrir creación, actualización conservando secreto vacío, nombre repetido, eliminación y revelación autorizada:

```ts
const servicio = new GestionarConexionesOrigen(repositorioFalso, cifradoFalso, auditoriaFalsa);
const creada = await servicio.crear(contexto, entradaJdbc);
expect(creada.nombre).toBe("Ventas");
expect(repositorioFalso.secretosGuardados).not.toContain("usuario:clave");
```

- [ ] **Step 2: Ejecutar y confirmar que el caso de uso no existe**

Run: `bun test apps/api/src/modulos/origenes/aplicacion/casos-de-uso/gestionar-conexiones-origen.test.ts`

Expected: FAIL por módulo inexistente.

- [ ] **Step 3: Definir el puerto con operaciones de negocio**

```ts
export interface RepositorioConexionesOrigen {
  listar(organizacionId: string): Promise<ConexionOrigen[]>;
  buscarPorId(organizacionId: string, id: string): Promise<ConexionOrigen | null>;
  buscarPorNombre(organizacionId: string, nombre: string): Promise<ConexionOrigen | null>;
  guardar(entrada: ConexionOrigenPersistible): Promise<ConexionOrigen>;
  actualizar(id: string, entrada: ConexionOrigenPersistible): Promise<ConexionOrigen>;
  eliminar(organizacionId: string, id: string): Promise<boolean>;
  guardarSecreto(conexionId: string, nombre: string, valorCifrado: string): Promise<void>;
  listarSecretos(conexionId: string): Promise<SecretoConexionOrigen[]>;
}
```
- [ ] **Step 4: Implementar el caso de uso y repositorio PostgreSQL**

Mover las transacciones, unicidad, cifrado persistido y rotación de nombres de secreto al repositorio/caso de uso. El caso de uso devuelve configuraciones sanitizadas y registra auditoría al revelar secretos.

- [ ] **Step 5: Reducir las rutas a adaptación HTTP**

La fábrica debe recibir `GestionarConexionesOrigen` y cada handler limitarse a sesión, parseo, llamada y respuesta:

```ts
rutas.get("/", async (c) => {
  const sesion = await deps.resolverSesion(c);
  return responderExito(c, await deps.gestor.listar(sesion.organizacionId));
});
```

- [ ] **Step 6: Ejecutar pruebas focalizadas**

Run:

```bash
bun test apps/api/src/modulos/origenes
bun test apps/api/src/arquitectura.test.ts
```

Expected: conexiones de origen PASS y ninguna importación de persistencia desde `origenes/http`.

### Task 3: Corregir dependencias de flujos y destinos

**Files:**
- Create: `apps/api/src/modulos/flujos/aplicacion/puertos/consulta-conexiones-origen.ts`
- Create: `apps/api/src/modulos/origenes/infraestructura/consulta-conexiones-origen-postgres.ts`
- Modify: `apps/api/src/modulos/flujos/http/rutas.ts`
- Move: `apps/api/src/modulos/destinos/aplicacion/fabrica-destinos.ts` → `apps/api/src/modulos/destinos/infraestructura/fabrica-destinos.ts`
- Modify: `apps/api/src/modulos/destinos/publico.ts`
- Modify: `apps/api/src/modulos/destinos/http/rutas-destinos-genericos.ts`
- Modify: `apps/api/src/modulos/automatizaciones/aplicacion/servicios/preparar-parametros-plantilla.ts`
- Modify: `apps/api/src/app.ts`

**Interfaces:**
- Produces: `ConsultaConexionesOrigen.listarPorOrganizacion()` y fábrica concreta exportada solo desde infraestructura/composición.
- Consumes: puerto `PuertoDestino` y configuración tipada de destino.
- [ ] **Step 1: Añadir test de flujos con consulta inyectada**

```ts
const consultaConexiones = {
  listarPorOrganizacion: async () => [{ tipo: "jdbc", nombre: "Ventas", config: {} }],
};
const rutas = crearRutasFlujos(resolverConsulta, resolverQlik, resolverSesion, resolverPolitica, consultaConexiones);
```

Confirmar que el catálogo Spark recibe conexiones sin que HTTP importe Drizzle.

- [ ] **Step 2: Ejecutar el test rojo**

Run: `bun test apps/api/src/modulos/flujos/http`

Expected: FAIL porque la nueva dependencia todavía no existe.

- [ ] **Step 3: Implementar el puerto y adaptador de consulta**

El adaptador PostgreSQL devuelve solo `{ tipo, nombre, config }` y nunca secretos. `app.ts` lo construye y lo entrega a rutas de flujos.

- [ ] **Step 4: Mover la fábrica de destinos**

Actualizar importaciones para que aplicación reciba `crearCliente` como dependencia y el fallback concreto se resuelva en HTTP/composición, no dentro de aplicación.

```ts
export interface DependenciasPrepararParametros {
  crearCliente(conexion: ConfigConexionDestino): PuertoDestino;
}
```

- [ ] **Step 5: Ejecutar pruebas de flujos, destinos y automatizaciones**

Run:

```bash
bun test apps/api/src/modulos/flujos apps/api/src/modulos/destinos apps/api/src/modulos/automatizaciones/aplicacion/servicios/preparar-parametros-plantilla.test.ts
bun test apps/api/src/arquitectura.test.ts
```

### Task 4: Simplificar composición y política de espacios

**Files:**
- Create: `apps/api/src/modulos/espacios-visibles/aplicacion/politica-espacios.ts`
- Modify: `apps/api/src/modulos/espacios-visibles/publico.ts`
- Modify: `apps/api/src/app.ts`
- Modify: `apps/api/src/modulos/automatizaciones/http/rutas-panel.ts`
- Modify: `apps/api/src/modulos/flujos/http/rutas.ts`
**Interfaces:**
- Produces: `resolverPoliticaEspacios(contexto, vistaUsuarioFinal)` y errores reutilizables de acceso.
- Consumes: repositorio de configuración de espacios y contexto autenticado.

- [ ] **Step 1: Escribir tests puros de la política**

Cubrir administrador normal, administrador previsualizando usuario final, usuario, recursos sin espacio y configuración cerrada:

```ts
expect(crearPoliticaEspacios(config, { esAdministrador: false }).puedeVer("ventas")).toBe(true);
expect(crearPoliticaEspacios(config, { esAdministrador: false }).puedeVer("finanzas")).toBe(false);
```

- [ ] **Step 2: Ejecutar test rojo**

Run: `bun test apps/api/src/modulos/espacios-visibles/aplicacion/politica-espacios.test.ts`

- [ ] **Step 3: Implementar la política pura y reutilizarla**

`app.ts` solo obtiene contexto/configuración y llama la función. Las rutas consumen el resultado sin reconstruir reglas ni respuestas 403 distintas.

- [ ] **Step 4: Extraer funciones de registro sin ocultar la composición**

Agrupar middlewares y montaje de rutas en funciones con nombres concretos dentro de `app.ts` o `plataforma/http`, manteniendo en `crearAplicacion()` la construcción explícita de adaptadores. El archivo debe dejar de contener CRUD anónimo de destinos; ese acceso se entrega mediante repositorios concretos.

- [ ] **Step 5: Verificar backend completo**

Run:

```bash
bun run test:api
bun run --cwd apps/api typecheck
```

### Task 5: Estabilizar APIs públicas del frontend

**Files:**
- Create: `apps/web/src/modulos/origenes/publico.ts`
- Modify: `apps/web/src/modulos/admin/publico.ts`
- Modify: `apps/web/src/modulos/autenticacion/publico.ts`
- Modify: `apps/web/src/modulos/automatizaciones/publico.ts`
- Modify: `apps/web/src/modulos/flujos/publico.ts`
- Modify: consumidores señalados por `apps/web/src/arquitectura.test.ts`

**Interfaces:**
- Produces: exports públicos de sesión, automatizaciones, flujos, administración y catálogo de orígenes.
- Consumes: implementaciones internas existentes sin cambiar su comportamiento.
- [ ] **Step 1: Ejecutar el test arquitectónico rojo del frontend**

Run: `bun run --cwd apps/web test:run -- src/arquitectura.test.ts`

Expected: FAIL con importaciones como `@/modulos/autenticacion/api` y `@/modulos/automatizaciones/api` desde otras features.

- [ ] **Step 2: Exportar solo contratos necesarios**

Ejemplo:

```ts
// modulos/autenticacion/publico.ts
export { obtenerSesion } from "./api";
export type { SesionUsuario } from "@qlik/contratos/autenticacion";
```

No reexportar componentes internos sin consumidores externos.

- [ ] **Step 3: Migrar consumidores a `publico.ts`**

Usar imports como:

```ts
import { obtenerSesion } from "@/modulos/autenticacion/publico";
import { obtenerAutomatizaciones } from "@/modulos/automatizaciones/publico";
```

- [ ] **Step 4: Ejecutar arquitectura y pruebas frontend**

Run:

```bash
bun run --cwd apps/web test:run -- src/arquitectura.test.ts
bun run --cwd apps/web typecheck
```

### Task 6: Dividir la página de tablas y eliminar datos ficticios

**Files:**
- Create: `apps/web/src/modulos/tablas/api.ts`
- Create: `apps/web/src/modulos/tablas/consultas.ts`
- Create: `apps/web/src/modulos/tablas/modelo-presentacion.ts`
- Create: `apps/web/src/modulos/tablas/componentes/lista-reportes.tsx`
- Create: `apps/web/src/modulos/tablas/componentes/detalle-reporte.tsx`
- Create: `apps/web/src/modulos/tablas/componentes/estado-catalogo-destino.tsx`
- Modify: `apps/web/src/modulos/tablas/pagina-tablas-destino.tsx`
- Modify: `apps/web/src/modulos/tablas/pagina-tablas-destino.test.tsx`
- Modify: `apps/web/src/modulos/tablas/publico.ts`

**Interfaces:**
- Produces: `useCatalogoDestinos()`, `adaptarDetalleRecurso()` y componentes de presentación sin acceso directo a API.
- Consumes: APIs públicas de autenticación y automatizaciones.
- [ ] **Step 1: Cambiar tests para exigir únicamente datos reales**

Eliminar expectativas de “Solicitud enviada”, historial fijo y permisos simulados. Añadir:

```ts
expect(screen.queryByText(/24\/07\/2026/)).not.toBeInTheDocument();
expect(screen.queryByText(/solicitud de creación enviada/i)).not.toBeInTheDocument();
expect(screen.getByText(/vista de solo lectura/i)).toBeInTheDocument();
```

- [ ] **Step 2: Ejecutar el test rojo**

Run: `bun run --cwd apps/web test:run -- src/modulos/tablas/pagina-tablas-destino.test.tsx`

Expected: FAIL porque la página aún renderiza historial y mutación simulados.

- [ ] **Step 3: Extraer transporte y consultas**

`api.ts` encapsula todas las rutas de destinos. `consultas.ts` selecciona conexión activa, usa fallback heredado y adapta el detalle sin que la página conozca URLs.

- [ ] **Step 4: Extraer componentes de presentación**

`ListaReportes` recibe recursos, búsqueda, selección y conexión. `DetalleReporte` recibe únicamente el detalle real y acciones realmente disponibles.

- [ ] **Step 5: Eliminar funcionalidad ficticia**

Quitar `mutationSolicitarCrear`, modal de solicitud, historial fijo, usuario ficticio y mensajes de éxito simulados. Mostrar una nota de solo lectura cuando no exista endpoint de escritura.
- [ ] **Step 6: Verificar la feature**

Run:

```bash
bun run --cwd apps/web test:run -- src/modulos/tablas
bun run --cwd apps/web typecheck
```

Expected: página de tablas PASS, sin textos o fechas inventadas.

### Task 7: Comentarios, documentación y gates finales

**Files:**
- Modify: `docs/arquitectura/README.md`
- Modify: archivos tocados que mantengan comentarios numerados o redundantes.
- Modify: `README.md` si los comandos de calidad cambian.

**Interfaces:**
- Produces: guía corta alineada con las reglas ejecutables y comandos reales.
- Consumes: resultado final de las tareas 1–6.

- [ ] **Step 1: Eliminar comentarios que repiten el código**

Eliminar rótulos como `// 0. Obtener sesión`, `// Panel izquierdo` y `// Encabezado`. Conservar comentarios sobre fallback Impala heredado, seguridad y peculiaridades de Qlik.

- [ ] **Step 2: Actualizar documentación arquitectónica**

Documentar la API pública frontend, el flujo HTTP → caso de uso → puerto → adaptador y el comando de pruebas separado por runtime.

- [ ] **Step 3: Ejecutar todos los gates**

```bash
bun run lint
bun run typecheck
bun run test:api
bun run test:web
bun run build
```

- [ ] **Step 4: Revisar tamaño y límites**

```bash
wc -l apps/api/src/app.ts apps/web/src/modulos/tablas/pagina-tablas-destino.tsx
bun test apps/api/src/arquitectura.test.ts
bun run --cwd apps/web test:run -- src/arquitectura.test.ts
```

Expected: las pruebas arquitectónicas pasan y las páginas/rutas principales ya no concentran persistencia, simulaciones y presentación en la misma unidad.

- [ ] **Step 5: Revisar el diff final**

Run: `git diff --check && git status --short`

Confirmar que no se borró ni se incluyó accidentalmente trabajo local previo del usuario.
