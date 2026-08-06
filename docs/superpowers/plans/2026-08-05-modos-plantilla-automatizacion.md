# Modos de Plantilla para Automatizaciones Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir que cada tenant configure dos plantillas Qlik y que un modo global determine si las nuevas automatizaciones ejecutan el flujo Spark/Python o el flujo Dataflow-SFTP-Talend.

**Architecture:** La configuracion de plantillas queda por tenant y el modo activo queda en una fila singleton de plataforma. La API de creacion resuelve ambos en servidor, arma un contrato de variables por modo y valida la plantilla antes de copiarla. Los secretos de conexiones origen se cifran por separado; solo se revelan bajo demanda para que un admin los copie al parametro protegido del job, nunca al workspace de Qlik.

**Tech Stack:** Bun, TypeScript, Hono, Drizzle ORM/PostgreSQL, Zod, React, TanStack Query/Router, Qlik Automate API, Bun test.

## Global Constraints

- Mantener el modo activo global y modificable por cualquier admin autenticado.
- Inicializar el modo global en `1` y migrar la plantilla base existente al modo `1` por tenant.
- No modificar automatizaciones Qlik ya creadas.
- El navegador no elige la plantilla efectiva ni genera el payload de ejecucion; el backend es la fuente de verdad.
- Modo 1 inyecta script Qlik, Catalogo Spark JSON, id de ejecucion y tabla destino, sin secretos reales.
- Modo 2 exige una conexion destino y una tabla; inyecta rutas SFTP y esquema de esa unica tabla destino.
- Los secretos reales no pueden llegar a workspace Qlik, outbox, auditoria, respuestas normales ni mensajes de error.
- El valor de un secreto se muestra solo por revelacion explicita a un admin de la organizacion y no se cachea.
- No instalar dependencias nuevas.
- Usar `apply_patch` para cambios manuales y no hacer commit o push sin aprobacion explicita.

---

## File Structure

### Persistencia y contratos

- Create: `apps/api/drizzle/0013_modos_plantilla_y_secretos_origen.sql` - agrega las columnas de dos plantillas, la configuracion global y secretos cifrados; migra datos existentes.
- Modify: `apps/api/drizzle/meta/_journal.json` - registra la migracion 0013.
- Modify: `apps/api/src/plataforma/persistencia/esquema.ts` - modela las nuevas columnas y tablas Drizzle.
- Modify: `packages/contratos/src/admin/index.ts` - agrega contratos de plantilla por modo y modo global.
- Modify: `packages/contratos/src/automatizaciones/panel.ts` - expone el modo aplicado en configuracion y resultado de creacion.

### Configuracion admin y secretos

- Modify: `apps/api/src/modulos/admin/aplicacion/puertos/repositorio-administracion.ts` - declara lectura/escritura de modo global y plantilla por modo.
- Modify: `apps/api/src/modulos/admin/aplicacion/servicio-admin.ts` - agrega la autorizacion para modificar el modo global.
- Modify: `apps/api/src/modulos/admin/infraestructura/consulta-tenant-qlik-postgres.ts` - lee y actualiza campos de plantilla por modo.
- Modify: `apps/api/src/modulos/admin/infraestructura/repositorio-administracion-postgres.ts` - delega las nuevas operaciones.
- Modify: `apps/api/src/modulos/admin/http/rutas-configuracion-tenant.ts` - acepta `modo` al guardar una plantilla.
- Create: `apps/api/src/modulos/admin/http/rutas-configuracion-plataforma.ts` - expone GET/PUT del modo global protegido por admin.
- Modify: `apps/api/src/modulos/admin/http/rutas-admin.ts` - monta las rutas de configuracion de plataforma.
- Modify: `apps/api/src/modulos/origenes/http/rutas-conexiones-origen.ts` - cifra secretos al guardar, los oculta al listar y revela el contexto bajo demanda.

### Preparacion y copia de automatizaciones

- Create: `apps/api/src/modulos/automatizaciones/aplicacion/servicios/preparar-parametros-plantilla.ts` - genera parametros de modo 1 o modo 2 desde Dataflow, catalogo y destino.
- Create: `apps/api/src/modulos/automatizaciones/aplicacion/servicios/configurar-workspace-plantilla.ts` - valida variables requeridas y aplica valores al workspace clonado sin regex ni fallbacks.
- Modify: `apps/api/src/modulos/automatizaciones/aplicacion/servicios/servicio-copia-automatizacion.ts` - valida la plantilla antes de copiar, configura el clon con los parametros y elimina el clon si falla.
- Modify: `apps/api/src/modulos/automatizaciones/http/rutas-panel.ts` - resuelve modo/plantilla en servidor, prepara el payload y devuelve el modo aplicado.
- Modify: `apps/api/src/app.ts` - inyecta `db` y `servicioCifrado` donde los nuevos endpoints y preparadores lo requieren.

### Frontend

- Modify: `apps/web/src/modulos/admin/api.ts` - agrega tipos y clientes de modo global/plantillas por modo.
- Modify: `apps/web/src/modulos/admin/componentes/seccion-configurar-automatizacion-base.tsx` - presenta dos selectores de plantilla.
- Create: `apps/web/src/modulos/origenes/componentes/seccion-modo-global-automatizacion.tsx` - card para elegir modo global.
- Modify: `apps/web/src/modulos/origenes/pagina-catalogo-origen.tsx` - captura valores secretos, muestra mascaras y permite copiar el contexto de secretos.
- Modify: `apps/web/src/modulos/automatizaciones/api.ts` - tipa configuracion efectiva, modo aplicado y detalle de recurso destino.
- Modify: `apps/web/src/modulos/automatizaciones/pagina-nueva-automatizacion.tsx` - muestra el modo efectivo y obliga `destinoId` en modo 2.
- Modify: `apps/web/src/modulos/automatizaciones/componentes/alerta-configuracion-tenant.tsx` - muestra faltantes del modo activo.

---

### Task 1: Migrar y modelar la configuracion de dos modos

**Files:**
- Create: `apps/api/drizzle/0013_modos_plantilla_y_secretos_origen.sql`
- Modify: `apps/api/drizzle/meta/_journal.json`
- Modify: `apps/api/src/plataforma/persistencia/esquema.ts`
- Modify: `apps/api/src/esquema.test.ts`
- Test: `apps/api/src/esquema.test.ts`

**Interfaces:**
- Produces `tenantsQlik.automatizacionPlantillaModo1IdQlik`, `tenantsQlik.automatizacionPlantillaModo1Nombre`, `tenantsQlik.automatizacionPlantillaModo2IdQlik`, `tenantsQlik.automatizacionPlantillaModo2Nombre`.
- Produces `configuracionesPlataforma` con `id`, `modoAutomatizacionActivo`, `actualizadoEn`, `actualizadoPorUsuarioId`.
- Produces `secretosConexionOrigen` con `conexionOrigenId`, `nombre`, `valorCifrado`, `creadoEn`, `actualizadoEn`.

- [ ] **Step 1: Escribir pruebas de esquema y migracion que fallen**

Agregar expectativas que lean `0013_modos_plantilla_y_secretos_origen.sql` y confirmen estas sentencias:

```ts
expect(sqlMigracion).toContain(
  'ADD COLUMN "automatizacion_plantilla_modo_1_id_qlik" text',
);
expect(sqlMigracion).toContain(
  'CREATE TABLE IF NOT EXISTS "configuraciones_plataforma"',
);
expect(sqlMigracion).toContain(
  'CREATE TABLE IF NOT EXISTS "secretos_conexion_origen"',
);
expect(sqlMigracion).toContain("UPDATE \"tenants_qlik\"");
```

- [ ] **Step 2: Ejecutar la prueba para verificar el fallo**

Run: `bun test src/esquema.test.ts`

Expected: FAIL porque no existe la migracion ni las definiciones Drizzle esperadas.

- [ ] **Step 3: Crear la migracion 0013**

Crear una migracion idempotente que:

```sql
ALTER TABLE "tenants_qlik"
  ADD COLUMN IF NOT EXISTS "automatizacion_plantilla_modo_1_id_qlik" text,
  ADD COLUMN IF NOT EXISTS "automatizacion_plantilla_modo_1_nombre" text,
  ADD COLUMN IF NOT EXISTS "automatizacion_plantilla_modo_2_id_qlik" text,
  ADD COLUMN IF NOT EXISTS "automatizacion_plantilla_modo_2_nombre" text;

UPDATE "tenants_qlik"
SET
  "automatizacion_plantilla_modo_1_id_qlik" = COALESCE("automatizacion_plantilla_modo_1_id_qlik", "automatizacion_base_id_qlik"),
  "automatizacion_plantilla_modo_1_nombre" = COALESCE("automatizacion_plantilla_modo_1_nombre", "automatizacion_base_nombre");
```

Crear `configuraciones_plataforma` con `id integer primary key check (id = 1)`, `modo_automatizacion_activo smallint not null check (modo_automatizacion_activo in (1, 2)) default 1`, `actualizado_en timestamptz not null default now()` y FK nullable a `usuarios` para `actualizado_por_usuario_id`. Sembrar `(id = 1, modo = 1)` con `ON CONFLICT DO NOTHING`.

Crear `secretos_conexion_origen` con FK `conexion_origen_id` a `conexiones_origen`, `nombre`, `valor_cifrado`, timestamps y unique `(conexion_origen_id, nombre)`.

- [ ] **Step 4: Registrar y modelar las tablas**

Agregar la entrada `0013_modos_plantilla_y_secretos_origen` al journal con el siguiente indice disponible. Modelar exactamente las columnas en `esquema.ts`, incluyendo el `check` de modo, FK de usuario y unique de secreto por conexion.

- [ ] **Step 5: Ejecutar pruebas de esquema**

Run: `bun test src/esquema.test.ts`

Expected: PASS.

- [ ] **Step 6: Aplicar la migracion solo con aprobacion explicita**

Run: `bun run db:migrate`

Expected: migracion 0013 aplicada una vez. Si la BD local no usa journal de Drizzle, ejecutar el SQL de 0013 mediante `psql` solo despues de que el usuario apruebe esa alteracion de BD.

- [ ] **Step 7: Commit**

```bash
git add apps/api/drizzle/0013_modos_plantilla_y_secretos_origen.sql apps/api/drizzle/meta/_journal.json apps/api/src/plataforma/persistencia/esquema.ts apps/api/src/esquema.test.ts
git commit -m "feat: agregar configuracion de modos de automatizacion"
```

### Task 2: Exponer plantillas por modo y modo global para administracion

**Files:**
- Modify: `packages/contratos/src/admin/index.ts`
- Modify: `apps/api/src/modulos/admin/aplicacion/puertos/repositorio-administracion.ts`
- Modify: `apps/api/src/modulos/admin/infraestructura/consulta-tenant-qlik-postgres.ts`
- Modify: `apps/api/src/modulos/admin/infraestructura/repositorio-administracion-postgres.ts`
- Modify: `apps/api/src/modulos/admin/http/rutas-configuracion-tenant.ts`
- Create: `apps/api/src/modulos/admin/http/rutas-configuracion-plataforma.ts`
- Modify: `apps/api/src/modulos/admin/http/rutas-admin.ts`
- Test: `apps/api/src/modulos/admin/http/rutas-configuracion-tenant.test.ts`
- Test: `apps/api/src/modulos/admin/http/rutas-configuracion-plataforma.test.ts`

**Interfaces:**
- Consumes las tablas de Task 1.
- Produces `ModoPlantilla = 1 | 2` y `ConfiguracionModoGlobal = { modoAutomatizacionActivo: ModoPlantilla }`.
- Produces `repositorio.configurarPlantillaAutomatizacion(organizacionId, tenantQlikId, modo, idQlik, nombre?)`.
- Produces `servicioAdmin.puedeCambiarModoGlobal(contexto)`, verdadero para superadmin o para cualquier membresia con rol `admin`.
- Produces `GET /api/admin/configuracion-plataforma/modo-automatizacion` y `PUT` con `{ modoAutomatizacionActivo: 1 | 2 }`.

- [ ] **Step 1: Escribir pruebas HTTP fallidas**

Cubrir tres casos en rutas de tenant:

```ts
expect(respuesta.status).toBe(200);
expect(cuerpo.datos.automatizacionPlantillaModo2IdQlik).toBe("plantilla-2");
```

Cubrir rutas globales:

```ts
expect((await app.request("/api/admin/configuracion-plataforma/modo-automatizacion")).status).toBe(200);
expect((await respuesta.json()).datos.modoAutomatizacionActivo).toBe(1);
expect(putInvalido.status).toBe(400);
```

La prueba de permisos debe usar un contexto `rol: "usuario"` y esperar 403; un contexto admin debe poder actualizar de 1 a 2.

- [ ] **Step 2: Ejecutar las pruebas nuevas para verificar el fallo**

Run: `bun test src/modulos/admin/http/rutas-configuracion-tenant.test.ts src/modulos/admin/http/rutas-configuracion-plataforma.test.ts`

Expected: FAIL porque no existen el contrato por modo ni las rutas globales.

- [ ] **Step 3: Definir contratos y puerto de repositorio**

En `@qlik/contratos/admin`, definir:

```ts
export const esquemaModoPlantilla = z.union([z.literal(1), z.literal(2)]);
export const esquemaConfigurarPlantillaAutomatizacion = z.object({
  modo: esquemaModoPlantilla,
  automatizacionBaseIdQlik: esquemaIdQlik,
  automatizacionBaseNombre: z.string().trim().min(1).max(255).optional(),
});
export const esquemaActualizarModoAutomatizacion = z.object({
  modoAutomatizacionActivo: esquemaModoPlantilla,
});
```

Extender `TenantQlikAdministrable` con los cuatro campos de plantilla por modo. Mantener los campos base heredados para migracion y compatibilidad de lectura.

- [ ] **Step 4: Implementar consultas y rutas**

Implementar `ServicioAdmin.puedeCambiarModoGlobal(contexto)` con `contexto.esSuperadmin || contexto.membresias.some((m) => m.rol === "admin")`. Implementar la actualizacion de solo las columnas del modo solicitado y retornar el tenant mapeado. En la ruta existente de automatizacion base, parsear `{ modo, automatizacionBaseIdQlik, automatizacionBaseNombre }`; mantener el endpoint, pero no aceptar un modo inexistente.

Crear `rutas-configuracion-plataforma.ts` con `GET` y `PUT`. Resolver el contexto admin y verificar `servicioAdmin.puedeCambiarModoGlobal(contexto)`. Leer o insertar la fila singleton y actualizarla con `usuarioId` y `actualizadoEn`. Responder con `{ exito, datos }` y codigos 401/403/400 existentes.

- [ ] **Step 5: Montar la ruta y ejecutar pruebas**

Montar las rutas globales desde `crearRutasAdmin`. Ejecutar:

Run: `bun test src/modulos/admin/http/rutas-configuracion-tenant.test.ts src/modulos/admin/http/rutas-configuracion-plataforma.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add packages/contratos/src/admin/index.ts apps/api/src/modulos/admin
git commit -m "feat: configurar plantillas y modo global de automatizacion"
```

### Task 3: Cifrar y revelar el contexto de secretos de conexiones origen

**Files:**
- Modify: `apps/api/src/modulos/origenes/http/rutas-conexiones-origen.ts`
- Modify: `apps/api/src/app.ts`
- Create: `apps/api/src/modulos/origenes/http/rutas-conexiones-origen.test.ts`
- Test: `apps/api/src/modulos/flujos/aplicacion/generador-catalogo-spark.spec.ts`

**Interfaces:**
- Consumes `secretosConexionOrigen` de Task 1 y `cifrarSecretoParaPersistencia`/`leerSecretoCifrado`.
- Produces entradas JDBC con `secretoValor?: string` y SFTP con `secretoClavePrivadaValor?: string`; dichos campos nunca se incluyen en GET normal.
- Produces `POST /api/conexiones-origen/contexto-secretos` que retorna `Record<string, string>` solo a un admin de la organizacion.

- [ ] **Step 1: Escribir pruebas de secreto fallidas**

Crear una app Hono con DB/repo de prueba y comprobar:

```ts
expect(listado.datos[0].config).not.toHaveProperty("secretoValor");
expect(JSON.stringify(listado)).not.toContain("usuario:clave");
expect((await revelar.json()).datos).toEqual({ JDBC_POSTGRES_BANCO: "usuario:clave" });
expect(noAdmin.status).toBe(403);
```

Agregar una prueba de Catalogo Spark que recibe la conexion almacenada y confirma que incluye `secreto_nombre` pero no el valor cifrado ni el texto plano.

- [ ] **Step 2: Ejecutar las pruebas para verificar el fallo**

Run: `bun test src/modulos/origenes/http/rutas-conexiones-origen.test.ts src/modulos/flujos/aplicacion/generador-catalogo-spark.spec.ts`

Expected: FAIL porque las rutas no aceptan ni almacenan valores secretos cifrados.

- [ ] **Step 3: Extender schemas y persistencia de rutas origen**

Agregar campos opcionales de escritura a los schemas Zod, sin devolverlos en el tipo de salida. Al crear o actualizar:

1. guardar los metadatos de conexion como hoy;
2. si llega un valor no vacio, cifrarlo con `cifrarSecretoParaPersistencia`;
3. hacer upsert de `secretosConexionOrigen` por `(conexionOrigenId, nombre)`;
4. conservar el secreto previo si el formulario de edicion omite el valor.

Cambiar el factory de rutas para recibir `servicioCifrado`, `auditoria` y `resolverContextoAdmin` desde `app.ts`.

- [ ] **Step 4: Implementar revelacion controlada**

Agregar `POST /contexto-secretos` antes de `/:id`. Resolver sesion y contexto admin; exigir `servicioAdmin.puedeAcceder(contextoAdmin, sesion.organizacionId)`, descifrar los secretos de conexiones de esa organizacion y devolver el mapa `{ [nombre]: valor }`. No incluir valores en la auditoria; registrar solo accion `conexion-origen.revelar-contexto-secretos`, organizacion, usuario e id de solicitud.

Devolver 422 con la lista de nombres faltantes si una conexion registrada declara un secreto pero no existe valor cifrado.

- [ ] **Step 5: Ejecutar pruebas de secretos y catalogo**

Run: `bun test src/modulos/origenes/http/rutas-conexiones-origen.test.ts src/modulos/flujos/aplicacion/generador-catalogo-spark.spec.ts`

Expected: PASS, sin valores secretos en serializaciones normales.

- [ ] **Step 6: Commit**

```bash
git add apps/api/src/modulos/origenes apps/api/src/app.ts
git commit -m "feat: cifrar secretos de conexiones origen"
```

### Task 4: Preparar contratos por modo y configurar workspaces Qlik de forma declarativa

**Files:**
- Create: `apps/api/src/modulos/automatizaciones/aplicacion/servicios/preparar-parametros-plantilla.ts`
- Create: `apps/api/src/modulos/automatizaciones/aplicacion/servicios/configurar-workspace-plantilla.ts`
- Modify: `apps/api/src/modulos/automatizaciones/aplicacion/servicios/servicio-copia-automatizacion.ts`
- Test: `apps/api/src/modulos/automatizaciones/aplicacion/servicios/preparar-parametros-plantilla.test.ts`
- Test: `apps/api/src/modulos/automatizaciones/aplicacion/servicios/configurar-workspace-plantilla.test.ts`
- Test: `apps/api/src/modulos/automatizaciones/aplicacion/servicios/servicio-copia-automatizacion.test.ts`

**Interfaces:**
- Produces `ParametrosPlantillaModo1` con `modo: 1`, `DataflowId`, `DataflowScriptContenido`, `ConexionesContenido`, `EjecucionId`, `TablaDestino`.
- Produces `ParametrosPlantillaModo2` con `modo: 2`, `DataflowId`, `RutasSftpContenido`, `EsquemaTablaDestino`, `EjecucionId`, `TablaDestino`.
- Produces `configurarWorkspacePlantilla(workspace, parametros): Record<string, unknown>` y lanza `ErrorAplicacion("PLANTILLA_INCOMPATIBLE", ..., 422)` con las variables faltantes.

- [ ] **Step 1: Escribir pruebas fallidas para modo 1 y 2**

Para modo 1, mockear `obtenerScriptApp` y el generador de catalogo; esperar:

```ts
expect(parametros).toMatchObject({
  modo: 1,
  DataflowId: "flujo-1",
  DataflowScriptContenido: "LIB CONNECT TO [Postgres_Banco];",
  ConexionesContenido: JSON.stringify(catalogo),
  TablaDestino: "ventas_curadas",
});
expect(parametros.ConexionesContenido).not.toContain("usuario:clave");
```

Para modo 2, mockear una conexion destino y `obtenerRecurso("ventas_curadas")`; esperar `RutasSftpContenido` y `EsquemaTablaDestino` serializados, y que falte SFTP devuelva `ErrorAplicacion` 422 `SFTP_NO_CONFIGURADO`.

Para workspace, incluir bloques `VariableBlock` y verificar que se actualizan solo los nombres requeridos. Probar una plantilla sin `EsquemaTablaDestino` y esperar el codigo `PLANTILLA_INCOMPATIBLE` y el nombre faltante en el mensaje.

- [ ] **Step 2: Ejecutar pruebas para verificar el fallo**

Run: `bun test src/modulos/automatizaciones/aplicacion/servicios/preparar-parametros-plantilla.test.ts src/modulos/automatizaciones/aplicacion/servicios/configurar-workspace-plantilla.test.ts src/modulos/automatizaciones/aplicacion/servicios/servicio-copia-automatizacion.test.ts`

Expected: FAIL porque no existen los preparadores ni la validacion declarativa de variables.

- [ ] **Step 3: Implementar preparacion server-side**

Definir dependencias explicitas para obtener script, conexiones origen y conexion destino. Para modo 1, obtener el script actual de Qlik y llamar a `generarCatalogoSpark`; serializar el catalogo sin consultar `secretosConexionOrigen`.

Para modo 2, exigir `destinoId` y `tablaId`, buscar la conexion dentro de la organizacion, crear el cliente con `crearClienteDestino`, recuperar el recurso elegido y exigir `columnas`. Extraer `catalogo.sftp`; si esta vacio, lanzar `ErrorAplicacion("SFTP_NO_CONFIGURADO", "El Dataflow no declara una ruta SFTP para el modo 2", 422)`.

Generar `EjecucionId` con `generarUuid()` en el backend.

- [ ] **Step 4: Implementar configuracion declarativa de workspace**

Crear un mapa de variables requeridas:

```ts
const VARIABLES_POR_MODO = {
  1: ["DataflowId", "DataflowScriptContenido", "ConexionesContenido", "EjecucionId", "TablaDestino"],
  2: ["DataflowId", "RutasSftpContenido", "EsquemaTablaDestino", "EjecucionId", "TablaDestino"],
} as const;
```

Buscar variables tanto en `workspace.variables` como en bloques `VariableBlock`. Antes de mutar el clon, recopilar todas las ausentes y lanzar una sola excepcion 422. Eliminar `modificarWorkspaceConParametrosFlujo`, su regex `STORE`, y valores fallback `ventas_incremental1`/`ventas_filtro_curados`.

- [ ] **Step 5: Integrar con el servicio de copia y limpieza**

Obtener y validar el workspace de la plantilla antes de llamar `copiarAutomatizacion`. Despues de copiar, aplicar el workspace validado al clon. Si falla actualizar workspace, llamar `eliminarAutomatizacion(id)` y propagar el error; nunca dejar un clon parcialmente configurado.

- [ ] **Step 6: Ejecutar todas las pruebas del servicio**

Run: `bun test src/modulos/automatizaciones/aplicacion/servicios/preparar-parametros-plantilla.test.ts src/modulos/automatizaciones/aplicacion/servicios/configurar-workspace-plantilla.test.ts src/modulos/automatizaciones/aplicacion/servicios/servicio-copia-automatizacion.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add apps/api/src/modulos/automatizaciones/aplicacion/servicios
git commit -m "feat: preparar automatizaciones por modo"
```

### Task 5: Resolver el modo efectivo al crear y devolver trazabilidad

**Files:**
- Modify: `packages/contratos/src/automatizaciones/panel.ts`
- Modify: `apps/api/src/modulos/automatizaciones/http/rutas-panel.ts`
- Modify: `apps/api/src/modulos/automatizaciones/aplicacion/casos-de-uso/crear-desde-plantilla.ts`
- Modify: `apps/api/src/modulos/automatizaciones/aplicacion/servicios/servicio-copia-automatizacion.ts`
- Modify: `apps/api/src/modulos/automatizaciones/http/rutas-panel.test.ts`
- Test: `apps/api/src/app.test.ts`

**Interfaces:**
- Consumes `modoAutomatizacionActivo` y las plantillas por modo de Tasks 1-2.
- Consumes `prepararParametrosPlantilla` y `configurarWorkspacePlantilla` de Task 4.
- Produces `ResultadoCrearDesdePlantilla` con `{ id, nombre, plantillaIdQlik, modoPlantilla }`.
- Produces `GET /api/automatizaciones/configuracion-tenant` con `{ modoAutomatizacionActivo, plantillaEfectivaIdQlik, plantillaEfectivaNombre, configurada }`.

- [ ] **Step 1: Escribir pruebas HTTP fallidas**

Crear casos para:

```ts
expect(configuracion.datos).toEqual({
  modoAutomatizacionActivo: 2,
  plantillaEfectivaIdQlik: "plantilla-talend",
  plantillaEfectivaNombre: "Talend SFTP",
  configurada: true,
});
expect(resultado.datos.modoPlantilla).toBe(2);
```

Agregar un tenant con modo 2 activo sin plantilla 2 y esperar 422 `SIN_PLANTILLA_MODO_ACTIVO`. Agregar un request modo 2 sin `destinoId` y esperar 422 `DESTINO_REQUERIDO_MODO_2`. Confirmar que un `plantillaIdQlik` enviado por el cliente se ignora.

- [ ] **Step 2: Ejecutar pruebas para verificar el fallo**

Run: `bun test src/modulos/automatizaciones/http/rutas-panel.test.ts src/app.test.ts`

Expected: FAIL porque la ruta usa solo `automatizacionBaseIdQlik` y no devuelve modo efectivo.

- [ ] **Step 3: Extender contratos de panel y caso de uso**

Agregar `modoPlantilla: z.union([z.literal(1), z.literal(2)])` al resultado. Hacer que `CrearAutomatizacionDesdePlantilla.ejecutar` reciba parametros preparados y los incluya en la llamada de copia; incluir `modoPlantilla` en `resultado`, `datosNuevos` de auditoria y datos del evento outbox, sin incluir secretos.

- [ ] **Step 4: Resolver configuracion en la ruta**

Inyectar en `DependenciasRutasPanel` un lector de configuracion global, acceso a conexiones origen/destino y el preparador de Task 4. En `POST /desde-plantilla`:

1. obtener sesion, tenant y modo global;
2. seleccionar exactamente la plantilla del modo;
3. devolver 422 accionable si falta;
4. validar `destinoId` en modo 2;
5. preparar parametros en servidor;
6. sobrescribir `plantillaIdQlik` del body con la plantilla efectiva;
7. crear y devolver el resultado.

Actualizar `GET /configuracion-tenant` para exponer solo la plantilla efectiva del modo global y `configurada`.

- [ ] **Step 5: Ejecutar pruebas de ruta y regresion**

Run: `bun test src/modulos/automatizaciones/http/rutas-panel.test.ts src/app.test.ts`

Expected: PASS salvo el fallo preexistente de Origin documentado en `apps/api/src/app.test.ts:84`; no introducir fallos adicionales.

- [ ] **Step 6: Commit**

```bash
git add packages/contratos/src/automatizaciones/panel.ts apps/api/src/modulos/automatizaciones
git commit -m "feat: crear automatizaciones con el modo global activo"
```

### Task 6: Configurar dos plantillas y el switch global en la interfaz admin

**Files:**
- Modify: `apps/web/src/modulos/admin/api.ts`
- Modify: `apps/web/src/modulos/admin/componentes/seccion-configurar-automatizacion-base.tsx`
- Create: `apps/web/src/modulos/origenes/componentes/seccion-modo-global-automatizacion.tsx`
- Modify: `apps/web/src/modulos/origenes/pagina-catalogo-origen.tsx`
- Test: `apps/web/src/modulos/admin/componentes/seccion-configurar-automatizacion-base.test.tsx`
- Test: `apps/web/src/modulos/origenes/componentes/seccion-modo-global-automatizacion.test.tsx`

**Interfaces:**
- Consumes `configurarPlantillaAutomatizacionTenant(organizacionId, tenantQlikId, modo, idQlik, nombre)`.
- Consumes `obtenerModoGlobalAutomatizacion()` y `guardarModoGlobalAutomatizacion(modo)`.
- Produces una UI que representa la plantilla de modo 1 y de modo 2 sin enviar plantilla efectiva desde la pagina de creacion.

- [ ] **Step 1: Escribir pruebas de componentes fallidas**

Para la seccion de plantillas, renderizar dos automatizaciones y verificar dos selectores con etiquetas distintas. Simular seleccionar modo 2 y esperar que el mock reciba:

```ts
expect(configurarPlantillaAutomatizacionTenant).toHaveBeenCalledWith(
  "org-1", "tenant-1", 2, "plantilla-2", "Talend SFTP",
);
```

Para el switch, verificar que presenta ambos modos, muestra la advertencia de impacto global y llama `guardarModoGlobalAutomatizacion(2)` al confirmar.

- [ ] **Step 2: Ejecutar pruebas para verificar el fallo**

Run: `bun test src/modulos/admin/componentes/seccion-configurar-automatizacion-base.test.tsx src/modulos/origenes/componentes/seccion-modo-global-automatizacion.test.tsx`

Expected: FAIL porque solo existe una plantilla base y no existe la card de modo global.

- [ ] **Step 3: Extender cliente admin y la seccion de plantillas**

Actualizar `TenantQlik` para incluir los cuatro campos por modo. Reemplazar el unico estado `baseIdSeleccionado` por dos estados, cada uno inicializado desde el tenant. Reutilizar la consulta de automatizaciones, pero enviar `modo: 1` o `modo: 2` al guardar y mostrar texto explicativo de Spark/Python o Dataflow-SFTP-Talend.

- [ ] **Step 4: Crear la card de modo global**

Implementar la card con React Query: consulta inicial, radio buttons para 1 y 2, confirmacion antes de cambiar y toast de exito/error. La card debe decir literalmente que el cambio afecta nuevas automatizaciones de todos los tenants y no modifica clones existentes.

- [ ] **Step 5: Montar la card en Configuracion y ejecutar pruebas**

Renderizar `SeccionModoGlobalAutomatizacion` al inicio de `PaginaCatalogoOrigen`, antes de la configuracion de conexiones. Ejecutar:

Run: `bun test src/modulos/admin/componentes/seccion-configurar-automatizacion-base.test.tsx src/modulos/origenes/componentes/seccion-modo-global-automatizacion.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/modulos/admin apps/web/src/modulos/origenes
git commit -m "feat: configurar modos de plantilla desde admin"
```

### Task 7: Mostrar el modo efectivo, exigir destino en modo 2 y copiar secretos

**Files:**
- Modify: `apps/web/src/modulos/automatizaciones/api.ts`
- Modify: `apps/web/src/modulos/automatizaciones/pagina-nueva-automatizacion.tsx`
- Modify: `apps/web/src/modulos/automatizaciones/componentes/alerta-configuracion-tenant.tsx`
- Modify: `apps/web/src/modulos/origenes/pagina-catalogo-origen.tsx`
- Test: `apps/web/src/modulos/automatizaciones/pagina-nueva-automatizacion.test.tsx`
- Test: `apps/web/src/modulos/origenes/pagina-catalogo-origen.test.tsx`

**Interfaces:**
- Consumes `ConfiguracionTenant` con `modoAutomatizacionActivo`, `plantillaEfectivaNombre`, `configurada`.
- Consumes `POST /conexiones-origen/contexto-secretos`.
- Produces requests de creacion con `destinoId` obligatorio cuando `modoAutomatizacionActivo === 2`.

- [ ] **Step 1: Escribir pruebas de UI fallidas**

Probar que modo 2 sin destino seleccionado deshabilita crear y muestra:

```ts
expect(screen.getByText("El modo 2 requiere seleccionar una conexión destino y una tabla.")).toBeInTheDocument();
```

Probar que modo 1 no muestra ese requisito adicional. Probar que la pagina de conexiones no renderiza `usuario:clave` en la lista normal, pero tras pulsar "Copiar JSON de secretos para el job" llama el endpoint, muestra el JSON en un dialogo y usa `navigator.clipboard.writeText(JSON.stringify(contexto, null, 2))` al confirmar copiar.

- [ ] **Step 2: Ejecutar pruebas para verificar el fallo**

Run: `bun test src/modulos/automatizaciones/pagina-nueva-automatizacion.test.tsx src/modulos/origenes/pagina-catalogo-origen.test.tsx`

Expected: FAIL porque el contrato de configuracion no incluye modo y no existe revelacion/copia de secretos.

- [ ] **Step 3: Actualizar API y pagina de nueva automatizacion**

Tipar la configuracion efectiva y `modoPlantilla` de resultado. Reemplazar `tieneBase` por `configTenant?.configurada`. Mostrar un bloque de solo lectura con modo y plantilla efectivos. Cuando el modo sea 2, exigir `destinoId` explicito y mantener la tabla elegida dentro de esa conexion; no usar `conexiones[0]` como fallback silencioso.

Actualizar la alerta para mencionar el modo activo y enlazar a Administracion cuando falte su plantilla.

- [ ] **Step 4: Agregar secreto cifrado y dialogo de copia en conexiones**

Agregar inputs de valor secreto para JDBC y llave privada SFTP. En edicion, dejar vacio significa conservar el secreto, y mostrar solo indicador de secreto configurado. Agregar boton admin de revelacion, dialogo con advertencia de contenido sensible, JSON no editable y boton de copia. Limpiar el estado del JSON cuando el dialogo se cierre.

- [ ] **Step 5: Ejecutar pruebas de UI**

Run: `bun test src/modulos/automatizaciones/pagina-nueva-automatizacion.test.tsx src/modulos/origenes/pagina-catalogo-origen.test.tsx`

Expected: PASS.

- [ ] **Step 6: Ejecutar regresion frontend y typecheck**

Run: `bun test`

Run: `bun run --bun tsc --noEmit`

Expected: ambas ordenes PASS.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/modulos/automatizaciones apps/web/src/modulos/origenes
git commit -m "feat: mostrar modo efectivo y copiar secretos de jobs"
```

### Task 8: Verificacion integral y documentacion operativa

**Files:**
- Modify: `docs/desarrollo/puesta-en-marcha.md`
- Modify: `docs/AGENTS_GUIDE.md`
- Test: `apps/api/src/app.test.ts`
- Test: `apps/web/src/modulos/automatizaciones/pagina-nueva-automatizacion.test.tsx`

**Interfaces:**
- Consumes todos los endpoints y contratos de Tasks 1-7.
- Produces instrucciones seguras para configurar las dos plantillas y copiar `MOTOR_SECRETOS_JSON`.

- [ ] **Step 1: Documentar preparacion de plantillas**

Agregar una seccion que enumere exactamente las variables obligatorias:

```text
Modo 1: DataflowId, DataflowScriptContenido, ConexionesContenido, EjecucionId, TablaDestino
Modo 2: DataflowId, RutasSftpContenido, EsquemaTablaDestino, EjecucionId, TablaDestino
```

Documentar que el administrador debe pegar el JSON de secretos en el parametro protegido del job y que nunca debe agregarlo a una variable del workspace Qlik.

- [ ] **Step 2: Ejecutar la suite API completa**

Run: `bun test`

Workdir: `apps/api`

Expected: todos los tests nuevos PASS; documentar separadamente el fallo preexistente de Origin si persiste en `app.test.ts:84`.

- [ ] **Step 3: Ejecutar typecheck completo**

Run: `bun run --bun tsc --noEmit`

Workdir: `apps/api`

Run: `bun run --bun tsc --noEmit`

Workdir: `apps/web`

Expected: ambas ordenes PASS.

- [ ] **Step 4: Verificacion manual no secreta**

1. Configurar dos plantillas en un tenant.
2. Cambiar modo global de 1 a 2 y confirmar que Nueva automatizacion muestra la plantilla efectiva correcta.
3. Crear una automatizacion de cada modo y verificar las variables del workspace sin secretos reales.
4. Abrir el Catalogo Spark de un Dataflow y comprobar que mantiene solo nombres de secreto.
5. Revelar y copiar el JSON de secretos como admin; cerrar el dialogo y comprobar que desaparece del DOM.

- [ ] **Step 5: Commit de documentacion**

```bash
git add docs/desarrollo/puesta-en-marcha.md docs/AGENTS_GUIDE.md
git commit -m "docs: explicar configuracion de automatizaciones por modo"
```

## Self-Review

- Cobertura: Tasks 1-2 cubren persistencia, migracion, contratos y configuracion global; Task 3 cubre secretos cifrados; Tasks 4-5 cubren ambos contratos Qlik y el flujo server-side; Tasks 6-7 cubren todas las pantallas y restricciones; Task 8 cubre documentacion y regresion.
- Sin placeholders: cada tarea contiene archivos, interfaces, datos esperados, comandos y criterios de exito concretos.
- Consistencia: `modoAutomatizacionActivo` y `modoPlantilla` usan `1 | 2` en persistencia, API, backend y UI; las variables de Qlik coinciden con las aprobadas en el spec.
