# Sesion Qlik Determinista y Aviso 401 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Validar las credenciales con la identidad exacta de la sesión Qlik y explicar en login por qué una sesión fue cerrada.

**Architecture:** El repositorio conservará como fuente de verdad `sesiones_usuario.identidad_qlik_id`, validando que pertenezca al tenant activo. El cliente API entregará el código del 401 al manejador global, que lo convierte en un motivo limitado de navegación. Login deriva su aviso seguro desde el mismo motivo, sin mostrar mensajes del backend.

**Tech Stack:** TypeScript, Bun, Drizzle ORM, Hono, React 18, TanStack Router, Vitest.

## Global Constraints

- No modificar tablas, migraciones, tokens, cifrado ni el contrato `{ exito, datos?, error? }` del API.
- No propagar textos del backend, cookies, tokens ni datos de sesión en la URL.
- `CREDENCIALES_QLIK_INVALIDAS` usa un motivo específico; cualquier otro 401 usa un motivo genérico.
- El aviso debe ser inline, persistente y usar `role="alert"`; no crear un toast duplicado.
- Mantener objetos inmutables y no añadir dependencias.

---

## File Structure

- Modify: `apps/api/src/modulos/autenticacion-qlik/infraestructura/repositorio-autenticacion-postgres.ts` - resuelve la identidad por el ID guardado en sesión.
- Create: `apps/api/src/modulos/autenticacion-qlik/infraestructura/repositorio-autenticacion-postgres.test.ts` - prueba de regresión para identidades duplicadas.
- Modify: `apps/web/src/compartido/api/cliente.ts` - entrega el código API al interceptor de 401.
- Modify: `apps/web/src/compartido/api/cliente.test.ts` - comprueba que el interceptor recibe el código.
- Create: `apps/web/src/modulos/autenticacion/motivo-sesion.ts` - lista permitida de motivos de sesión y mensajes seguros.
- Create: `apps/web/src/modulos/autenticacion/motivo-sesion.test.ts` - prueba el mapeo de motivos y el fallback genérico.
- Modify: `apps/web/src/main.tsx` - navega a login con un motivo permitido.
- Modify: `apps/web/src/modulos/autenticacion/pagina-login.tsx` - muestra el aviso inline y limpia el parámetro tras leerlo.

### Task 1: Fijar la identidad de la sesión en API

**Files:**
- Create: `apps/api/src/modulos/autenticacion-qlik/infraestructura/repositorio-autenticacion-postgres.test.ts`
- Modify: `apps/api/src/modulos/autenticacion-qlik/infraestructura/repositorio-autenticacion-postgres.ts:347-369`

**Interfaces:**
- Consumes: `buscarSesionValida(db, tokenSesion)` y `sesionesUsuario.identidadQlikId`.
- Produces: `obtenerInfoSesion(tokenSesion): Promise<InfoSesion | null>` que siempre devuelve la identidad de la sesión o `null`.

- [ ] **Step 1: Escribir la prueba de regresión que falla**

Crear un doble de `ConexionDb` donde `buscarSesionValida` devuelve una sesión con `identidadQlikId: "identidad-vigente"` y tenant `"tenant-1"`. Configurar `db.query.identidadesQlik.findFirst` para devolver solo la identidad cuyo `id` sea `"identidad-vigente"`; hacer que la identidad anterior sea inaccesible. Configurar `tenantsQlik.findFirst` con el tenant activo.

```ts
const info = await repositorio.obtenerInfoSesion("sesion");

expect(info).toMatchObject({
  identidadQlikId: "identidad-vigente",
  tenantId: "tenant-1",
});
```

Añadir una segunda prueba donde la identidad encontrada tenga `tenantQlikId: "tenant-distinto"` y esperar `null`.

- [ ] **Step 2: Ejecutar la prueba para confirmar el fallo**

Run: `bun test src/modulos/autenticacion-qlik/infraestructura/repositorio-autenticacion-postgres.test.ts`

Expected: FAIL porque la implementación actual no consulta por `identidadesQlik.id` y puede resolver una identidad distinta de la asociada a la sesión.

- [ ] **Step 3: Implementar la consulta determinista mínima**

En `obtenerInfoSesion`, reemplazar la búsqueda por usuario y tenant por una búsqueda por `eq(identidadesQlik.id, sesion.identidadQlikId)`. Tras cargarla, devolver `null` cuando `identidad.tenantQlikId !== sesion.tenantQlikActivoId`. Mantener la búsqueda del tenant y la construcción existente de `InfoSesion`.

```ts
const identidad = await this.db.query.identidadesQlik.findFirst({
  where: eq(identidadesQlik.id, sesion.identidadQlikId),
});
if (!identidad || identidad.tenantQlikId !== sesion.tenantQlikActivoId) {
  return null;
}
```

- [ ] **Step 4: Ejecutar las pruebas de API afectadas**

Run: `bun test src/modulos/autenticacion-qlik/infraestructura/repositorio-autenticacion-postgres.test.ts src/modulos/autenticacion-qlik/aplicacion/servicio-autenticacion.test.ts src/modulos/autenticacion-qlik/http/rutas.test.ts`

Expected: PASS.

- [ ] **Step 5: Solicitar aprobación antes de crear el commit**

Proponer el commit `fix: usar identidad de sesión para credenciales Qlik` e incluir únicamente los dos archivos de esta tarea. No ejecutar `git commit` sin aprobación explícita.

### Task 2: Propagar y clasificar el motivo del 401

**Files:**
- Modify: `apps/web/src/compartido/api/cliente.ts:19-26,93-106`
- Modify: `apps/web/src/compartido/api/cliente.test.ts`
- Create: `apps/web/src/modulos/autenticacion/motivo-sesion.ts`
- Create: `apps/web/src/modulos/autenticacion/motivo-sesion.test.ts`

**Interfaces:**
- Consumes: `ErrorClienteApi.codigo` de respuestas no exitosas.
- Produces: `ClienteApi.onUnauthorized?: (codigo?: string) => void` y `obtenerMotivoSesion(codigo?: string): MotivoSesion`.

- [ ] **Step 1: Escribir las pruebas que fallan**

En `cliente.test.ts`, simular un 401 con `codigo: "CREDENCIALES_QLIK_INVALIDAS"`, asignar un espía a `cliente.onUnauthorized` y verificar el argumento.

```ts
expect(noAutorizado).toHaveBeenCalledWith("CREDENCIALES_QLIK_INVALIDAS");
```

En `motivo-sesion.test.ts`, comprobar el mapeo específico y el fallback.

```ts
expect(obtenerMotivoSesion("CREDENCIALES_QLIK_INVALIDAS")).toBe(
  "credenciales_qlik_invalidas",
);
expect(obtenerMotivoSesion("SESION_INVALIDA")).toBe("sesion_terminada");
```

- [ ] **Step 2: Ejecutar las pruebas para confirmar el fallo**

Run: `bun run test:run src/compartido/api/cliente.test.ts src/modulos/autenticacion/motivo-sesion.test.ts`

Expected: FAIL porque el callback no recibe argumentos y el módulo de motivo no existe.

- [ ] **Step 3: Implementar las interfaces mínimas**

Cambiar el tipo de `onUnauthorized` a `(codigo?: string) => void` y llamarlo con `error.codigo` después de convertir el contrato de error. Crear `motivo-sesion.ts` con tipos cerrados y mensajes locales:

```ts
export type MotivoSesion =
  | "credenciales_qlik_invalidas"
  | "sesion_terminada";

export function obtenerMotivoSesion(codigo?: string): MotivoSesion {
  return codigo === "CREDENCIALES_QLIK_INVALIDAS"
    ? "credenciales_qlik_invalidas"
    : "sesion_terminada";
}

```

- [ ] **Step 4: Ejecutar las pruebas web unitarias**

Run: `bun run test:run src/compartido/api/cliente.test.ts src/modulos/autenticacion/motivo-sesion.test.ts`

Expected: PASS.

- [ ] **Step 5: Solicitar aprobación antes de crear el commit**

Proponer el commit `fix: clasificar motivos de sesión no autorizada` e incluir solo los cuatro archivos de esta tarea. No ejecutar `git commit` sin aprobación explícita.

### Task 3: Mostrar el aviso persistente en login

**Files:**
- Modify: `apps/web/src/main.tsx:10-13`
- Modify: `apps/web/src/modulos/autenticacion/pagina-login.tsx:15-53,102-110`

**Interfaces:**
- Consumes: `obtenerMotivoSesion` y `router.navigate`.
- Produces: navegación a `/login?motivo_sesion=<motivo>` y un aviso inline accesible en login.

- [ ] **Step 1: Escribir primero la prueba del mensaje seguro**

Ampliar `motivo-sesion.test.ts` importando una nueva función
`obtenerMensajeMotivoSesion` y cubriendo los mensajes que renderizará login y un
valor desconocido.

```ts
expect(
  obtenerMensajeMotivoSesion("credenciales_qlik_invalidas"),
).toBe("Tu conexión con Qlik Cloud venció. Inicia sesión nuevamente.");
expect(obtenerMensajeMotivoSesion("valor-inyectado")).toBeNull();
```

- [ ] **Step 2: Ejecutar la prueba para confirmar el fallo**

Run: `bun run test:run src/modulos/autenticacion/motivo-sesion.test.ts`

Expected: FAIL porque `obtenerMensajeMotivoSesion` todavía no existe.

- [ ] **Step 3: Conectar navegación y renderizado**

En `motivo-sesion.ts`, implementar y exportar `obtenerMensajeMotivoSesion(motivo: string | null): string | null`. Debe devolver solo los dos mensajes definidos por la especificación y `null` ante cualquier valor desconocido.

En `main.tsx`, recibir `codigo`, limpiar React Query, derivar `motivo` con `obtenerMotivoSesion(codigo)` y navegar con `search` hacia `/login`. Mantener `replace: true`.

En `pagina-login.tsx`, leer `motivo_sesion` junto a `oauth_error`; convertirlo con `obtenerMensajeMotivoSesion`; usar el estado inline existente (`errorOAuth`) sin llamar `mostrarError` para este motivo. Limpiar ambos parámetros con `history.replaceState` conservando solo pathname. La alerta existente ya aporta `role="alert"` y persistencia.

```ts
const motivoSesion = params.get("motivo_sesion");
const mensajeSesion = obtenerMensajeMotivoSesion(motivoSesion);
if (mensajeSesion) setErrorOAuth(mensajeSesion);
```

- [ ] **Step 4: Ejecutar validaciones web completas**

Run: `bun run test:run && bun run typecheck && bun run build`

Expected: PASS.

- [ ] **Step 5: Verificar manualmente el flujo completo**

1. En DevTools, provocar o simular un 401 con `CREDENCIALES_QLIK_INVALIDAS`.
2. Confirmar que la URL llega a `/login?motivo_sesion=credenciales_qlik_invalidas`.
3. Confirmar que login muestra el aviso inline y no un toast duplicado.
4. Repetir con otro código 401 y confirmar el mensaje genérico.
5. Completar OAuth y confirmar que `/api/auth/qlik/sesion` devuelve 200 para la nueva sesión.

- [ ] **Step 6: Solicitar aprobación antes de crear el commit**

Proponer el commit `fix: informar cierres de sesión en login` e incluir los dos archivos de esta tarea y los cambios de la Task 2 que dependan de ella. No ejecutar `git commit` sin aprobación explícita.

## Final Verification

- [ ] Run: `bun --cwd apps/api test`
- [ ] Run: `bun --cwd apps/api run typecheck`
- [ ] Run: `bun --cwd apps/web run test:run`
- [ ] Run: `bun --cwd apps/web run typecheck`
- [ ] Confirmar que no se imprimen, persisten ni transportan secretos o mensajes internos.
