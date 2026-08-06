# Plantilla Modo 1 con Conexiones Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el contrato de la plantilla Modo 1, exigir y probar todas las conexiones PostgreSQL/SFTP del Dataflow y un Postgres destino, e inyectar server-side `Appid`, `DFScript`, `ConexionJSON`, `BaseDestinoJSON` y `SECRETOSJSON` en el clon.

**Architecture:** Un preflight server-side comparte el descubrimiento de requisitos con la validacion final, pero la creacion vuelve a leer el script y probar las conexiones para no confiar en estado del navegador. Los secretos permanecen cifrados en la plataforma y solo se descifran dentro del caso de uso final; por excepcion del demo, `SECRETOSJSON` se escribe en el workspace Qlik sin devolverse al cliente.

**Tech Stack:** TypeScript 5.5, Bun, Hono, Zod, Drizzle/PostgreSQL, `postgres`, `ssh2-sftp-client`, React 18, TanStack Query/Router, Vitest, Testing Library, Biome.

## Global Constraints

- La especificacion fuente es `docs/superpowers/specs/2026-08-06-plantilla-modo-1-conexiones-design.md`.
- El Modo 2 y sus pruebas deben permanecer funcionalmente sin cambios.
- El demo admite conexiones JDBC cuyo prefijo sea `jdbc:postgresql://`; cualquier otro driver devuelve un error accionable y no instala dependencias nuevas.
- El Modo 1 no solicita ni envia `tablaId`.
- La entrada publica nunca acepta plantilla, script, catalogos ni secretos calculados por el navegador.
- `SECRETOSJSON` puede escribirse en Qlik para el demo, pero no puede aparecer en respuestas, logs, auditoria, outbox ni errores.
- Los secretos se almacenan cifrados y se manejan de forma inmutable.
- No ejecutar `bun run db:migrate`, backfills ni comandos de produccion durante la implementacion o validacion normal.
- Antes de crear o ejecutar una migracion, obtener aprobacion humana explicita.
- Antes de editar mas de cinco archivos, tocar varios modulos de negocio o cambiar manejo de secretos, obtener aprobacion humana explicita.
- El worktree contiene cambios ajenos no comprometidos. No restaurarlos, sobrescribirlos ni incluirlos accidentalmente en commits.
- Cada commit del plan requiere autorizacion explicita y debe incluir solo cambios de la tarea; si un archivo ya contiene cambios ajenos, pausar para acordar un checkpoint antes de stagearlo.
- Cobertura objetivo: 80% o superior para codigo nuevo y modificado.

---

### Task 1: Contratos publicos del preflight y Modo 1

**Files:**
- Create: `packages/contratos/src/automatizaciones/preflight.ts`
- Create: `packages/contratos/src/automatizaciones/preflight.test.ts`
- Modify: `packages/contratos/src/automatizaciones/panel.ts`
- Modify: `packages/contratos/src/automatizaciones/index.ts`

**Interfaces:**
- Produces: `RequisitoConexionOrigen`, `PreflightAutomatizacion`, `EntradaCrearModo1`.
- Produces: `esquemaPreflightAutomatizacion` and `esquemaEntradaCrearModo1`.
- Consumes: `esquemaIdQlik` and existing Zod conventions.

- [ ] **Step 1: Write failing contract tests**

```ts
import { describe, expect, it } from "bun:test";
import {
  esquemaEntradaCrearModo1,
  esquemaPreflightAutomatizacion,
} from "./preflight.js";

describe("contratos de preflight", () => {
  it("no admite secretos ni valores de plantilla en la entrada Modo 1", () => {
    const entrada = esquemaEntradaCrearModo1.parse({
      nombre: "Ventas demo",
      flujoId: "f16387d7-63af-484f-b267-f3856540dbe6",
      destinoId: "942b04fb-1bc0-49de-9708-8d189632cc08",
      SECRETOSJSON: "sensible",
      DFScript: "script cliente",
      tablaId: "public.ventas",
    });

    expect(entrada).toEqual({
      nombre: "Ventas demo",
      flujoId: "f16387d7-63af-484f-b267-f3856540dbe6",
      destinoId: "942b04fb-1bc0-49de-9708-8d189632cc08",
    });
  });

  it("valida un preflight sin configuracion sensible", () => {
    const resultado = esquemaPreflightAutomatizacion.parse({
      flujo: { id: "flujo-1", nombre: "Ventas" },
      conexionesRequeridas: [
        {
          tipo: "sftp",
          nombre: "Salida SFTP",
          estado: "faltante",
          conexionId: null,
          mensaje: null,
        },
      ],
      destinosPostgres: [],
    });

    expect(JSON.stringify(resultado)).not.toMatch(/password|privateKey|secretoValor/);
  });
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `bun test packages/contratos/src/automatizaciones/preflight.test.ts`

Expected: FAIL because `preflight.ts` and its schemas do not exist.

- [ ] **Step 3: Implement the exact shared contracts**

```ts
import { z } from "zod";

export const esquemaEstadoRequisitoConexion = z.enum([
  "faltante",
  "sin_probar",
  "disponible",
  "error",
]);

export const esquemaRequisitoConexionOrigen = z.object({
  tipo: z.enum(["jdbc", "sftp"]),
  nombre: z.string().min(1),
  estado: esquemaEstadoRequisitoConexion,
  conexionId: z.string().uuid().nullable(),
  mensaje: z.string().nullable(),
});

export const esquemaDestinoPostgresPreflight = z.object({
  id: z.string().uuid(),
  nombre: z.string(),
  estado: z.enum(["activo", "error", "desconectado"]),
  probadoEn: z.string().datetime().nullable(),
  mensaje: z.string().nullable(),
});

export const esquemaPreflightAutomatizacion = z.object({
  flujo: z.object({ id: z.string(), nombre: z.string() }),
  conexionesRequeridas: z.array(esquemaRequisitoConexionOrigen),
  destinosPostgres: z.array(esquemaDestinoPostgresPreflight),
});

export const esquemaEntradaCrearModo1 = z.object({
  nombre: z.string().trim().min(1).max(255),
  flujoId: z.string().min(1),
  destinoId: z.string().uuid(),
  espacioIdQlik: z.string().optional(),
  claveIdempotencia: z.string().trim().min(8).max(255).optional(),
});

export type RequisitoConexionOrigen = z.infer<typeof esquemaRequisitoConexionOrigen>;
export type PreflightAutomatizacion = z.infer<typeof esquemaPreflightAutomatizacion>;
export type EntradaCrearModo1 = z.infer<typeof esquemaEntradaCrearModo1>;
```

Export these symbols from `automatizaciones/index.ts`. Keep the internal `CrearDesdePlantilla` contract for the application service, but make `rutas-panel.ts` parse Modo 1 with the new public schema in Task 9.

- [ ] **Step 4: Run contract tests and typecheck**

Run: `bun test packages/contratos/src/automatizaciones/preflight.test.ts && bun run --cwd packages/contratos typecheck`

Expected: PASS.

- [ ] **Step 5: Commit after explicit approval**

```bash
git add packages/contratos/src/automatizaciones/preflight.ts packages/contratos/src/automatizaciones/preflight.test.ts packages/contratos/src/automatizaciones/panel.ts packages/contratos/src/automatizaciones/index.ts
git commit -m "feat: definir contratos de preflight de automatizaciones"
```

---

### Task 2: Descubrimiento estricto de requisitos del script

**Files:**
- Modify: `apps/api/src/modulos/flujos/aplicacion/generador-catalogo-spark.ts`
- Modify: `apps/api/src/modulos/flujos/aplicacion/generador-catalogo-spark.spec.ts`
- Modify: `apps/api/src/modulos/flujos/publico.ts`

**Interfaces:**
- Produces: `descubrirRequisitosConexion(script): RequisitoConexionDescubierto[]`.
- Produces: `construirCatalogoConexionesSpark` keyed by `(tipo, nombre)` and without fictitious fallbacks.
- Consumes: `parsearScriptQlik`.

- [ ] **Step 1: Add failing tests for exact matching and deduplication**

```ts
it("distingue conexiones JDBC y SFTP con el mismo nombre", () => {
  const descubierto = {
    conexionesJdbc: [{ nombre: "Compartida", allowlist: [] }],
    conexionesSftp: [{ nombre: "Compartida", rutaBase: "/upload", allowlist: [] }],
    conexionesLocales: [],
  };
  const catalogo = construirCatalogoConexionesSpark(descubierto, [
    {
      tipo: "jdbc",
      nombre: "Compartida",
      config: {
        url: "jdbc:postgresql://db/demo",
        driver: "org.postgresql.Driver",
        secreto_nombre: "JDBC_COMPARTIDA",
      },
    },
    {
      tipo: "sftp",
      nombre: "Compartida",
      config: {
        host: "sftp.internal",
        puerto: 22,
        usuario: "demo",
        secreto_clave_privada_nombre: "SFTP_COMPARTIDA_B64",
        ruta_base: "/upload",
      },
    },
  ]);

  expect(catalogo.jdbc[0].url).toContain("jdbc:postgresql");
  expect(catalogo.sftp[0].host).toBe("sftp.internal");
});

it("devuelve todos los requisitos una sola vez y conserva mayusculas", () => {
  const requisitos = descubrirRequisitosConexion(`
    LIB CONNECT TO [Ventas DB];
    SQL SELECT * FROM public.ventas;
    STORE ventas INTO [lib://Salida SFTP/ventas.csv];
    STORE ventas INTO [lib://Salida SFTP/ventas_2.csv];
  `);

  expect(requisitos).toEqual([
    { tipo: "jdbc", nombre: "Ventas DB" },
    { tipo: "sftp", nombre: "Salida SFTP" },
  ]);
});
```

- [ ] **Step 2: Verify RED**

Run: `bun test apps/api/src/modulos/flujos/aplicacion/generador-catalogo-spark.spec.ts`

Expected: FAIL because matching uses only `nombre` and `descubrirRequisitosConexion` does not exist.

- [ ] **Step 3: Implement the pure requirement function and strict keys**

```ts
export interface RequisitoConexionDescubierto {
  tipo: "jdbc" | "sftp";
  nombre: string;
}

export function descubrirRequisitosConexion(
  script: string,
): RequisitoConexionDescubierto[] {
  const descubierto = parsearScriptQlik(script);
  return [
    ...descubierto.conexionesJdbc.map(({ nombre }) => ({
      tipo: "jdbc" as const,
      nombre,
    })),
    ...descubierto.conexionesSftp.map(({ nombre }) => ({
      tipo: "sftp" as const,
      nombre,
    })),
  ];
}

const claveConexion = (tipo: string, nombre: string) => `${tipo}\u0000${nombre}`;
```

Use `claveConexion(c.tipo, c.nombre)` in the saved configuration map. Remove fallback secret names, hosts and users from catalog construction; callers must validate completeness before invoking it. Keep local outputs in `locales`, because they are not external connection requirements.

- [ ] **Step 4: Run focused tests**

Run: `bun test apps/api/src/modulos/flujos/aplicacion/generador-catalogo-spark.spec.ts`

Expected: PASS.

- [ ] **Step 5: Commit after explicit approval**

```bash
git add apps/api/src/modulos/flujos/aplicacion/generador-catalogo-spark.ts apps/api/src/modulos/flujos/aplicacion/generador-catalogo-spark.spec.ts apps/api/src/modulos/flujos/publico.ts
git commit -m "refactor: descubrir conexiones requeridas por dataflow"
```

---

### Task 3: Estado y lectura acotada de conexiones de origen

**Files:**
- Modify: `apps/api/src/plataforma/persistencia/esquema.ts`
- Modify: `apps/api/src/modulos/origenes/aplicacion/puertos/repositorio-conexiones-origen.ts`
- Modify: `apps/api/src/modulos/origenes/aplicacion/casos-de-uso/gestionar-conexiones-origen.ts`
- Modify: `apps/api/src/modulos/origenes/aplicacion/casos-de-uso/gestionar-conexiones-origen.test.ts`
- Modify: `apps/api/src/modulos/origenes/infraestructura/repositorio-conexiones-origen-postgres.ts`
- Modify: `apps/api/src/modulos/origenes/infraestructura/repositorio-conexiones-origen-postgres.test.ts`

**Interfaces:**
- Produces: `buscarPorTipoYNombre(organizacionId, tipo, nombre)`.
- Produces: `leerSecreto(organizacionId, conexionId, nombre)` for internal server use only.
- Produces: `registrarPrueba(organizacionId, conexionId, { estado, probadaEn, mensajeError })` and public `estado`, `probadaEn`, `mensajeError`.
- Consumes: existing encrypted `secretos_conexion_origen` storage.

- [ ] **Step 1: Write failing use-case tests**

```ts
it("permite el mismo nombre para tipos diferentes", async () => {
  repositorio.buscarPorTipoYNombre
    .mockResolvedValueOnce(null)
    .mockResolvedValueOnce(null);

  await gestor.crear("org-1", entradaJdbc("Compartida"));
  await gestor.crear("org-1", entradaSftp("Compartida"));

  expect(repositorio.buscarPorTipoYNombre).toHaveBeenNthCalledWith(
    1,
    "org-1",
    "jdbc",
    "Compartida",
  );
  expect(repositorio.buscarPorTipoYNombre).toHaveBeenNthCalledWith(
    2,
    "org-1",
    "sftp",
    "Compartida",
  );
});

it("lee solo el secreto solicitado dentro de la organizacion", async () => {
  repositorio.leerSecreto.mockResolvedValue("usuario:clave");
  const valor = await gestor.leerSecretoInterno(
    "org-1",
    "conexion-1",
    "JDBC_VENTAS",
  );
  expect(valor).toBe("usuario:clave");
  expect(repositorio.revelarSecretos).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Verify RED**

Run: `bun test apps/api/src/modulos/origenes/aplicacion/casos-de-uso/gestionar-conexiones-origen.test.ts`

Expected: FAIL because the repository methods do not exist.

- [ ] **Step 3: Extend ports without exposing values in public models**

```ts
export type EstadoPruebaConexion = "sin_probar" | "disponible" | "error";

export interface ConexionOrigen {
  id: string;
  organizacionId: string;
  tipo: TipoConexionOrigen;
  nombre: string;
  config: Record<string, unknown>;
  estado: EstadoPruebaConexion;
  probadaEn: Date | null;
  mensajeError: string | null;
  creadoEn: Date;
  actualizadoEn: Date;
}

export interface RepositorioConexionesOrigen {
  buscarPorTipoYNombre(
    organizacionId: string,
    tipo: TipoConexionOrigen,
    nombre: string,
  ): Promise<ConexionOrigen | null>;
  leerSecreto(
    organizacionId: string,
    conexionId: string,
    nombre: string,
  ): Promise<string | null>;
  registrarPrueba(
    organizacionId: string,
    conexionId: string,
    resultado: {
      estado: "disponible" | "error";
      probadaEn: Date;
      mensajeError: string | null;
    },
  ): Promise<boolean>;
}
```

Add `estado`, `probadaEn` and `mensajeError` columns to the Drizzle schema only. Do not create the SQL migration in this task. Change uniqueness checks to `(organizacionId, tipo, nombre)`. Implement `leerSecreto` with organization ownership in the query and `leerSecretoCifrado`.

- [ ] **Step 4: Add the acotated internal read without changing HTTP yet**

Add a method named `leerSecretoInterno` that delegates to the organization-scoped repository lookup; it must never be mounted as an HTTP route. Keep the legacy bulk reveal temporarily so this task remains type-correct; Task 4 removes the route and bulk method atomically after the replacement probe endpoint exists.

- [ ] **Step 5: Run origin tests and typecheck**

Run: `bun test apps/api/src/modulos/origenes && bun run --cwd apps/api typecheck`

Expected: PASS.

- [ ] **Step 6: Commit after explicit approval**

```bash
git add apps/api/src/plataforma/persistencia/esquema.ts apps/api/src/modulos/origenes/aplicacion apps/api/src/modulos/origenes/infraestructura
git commit -m "feat: registrar estado de conexiones de origen"
```

---

### Task 4: Prueba real PostgreSQL/SFTP de conexiones de origen

**Files:**
- Create: `apps/api/src/modulos/origenes/aplicacion/puertos/probador-conexion-origen.ts`
- Create: `apps/api/src/modulos/origenes/aplicacion/casos-de-uso/probar-conexion-origen.ts`
- Create: `apps/api/src/modulos/origenes/aplicacion/casos-de-uso/probar-conexion-origen.test.ts`
- Create: `apps/api/src/modulos/origenes/infraestructura/probador-conexion-origen.ts`
- Modify: `apps/api/src/modulos/origenes/http/rutas-conexiones-origen.ts`
- Modify: `apps/api/src/modulos/origenes/http/rutas-conexiones-origen.test.ts`
- Modify: `apps/api/src/modulos/origenes/publico.ts`
- Modify: `apps/api/src/app.ts`
- Modify: files from Task 3.

**Interfaces:**
- Consumes: acotated secret reads and persisted test state from Task 3.
- Produces: `ProbarConexionOrigen.ejecutar(organizacionId, id)`.
- Produces HTTP: `POST /conexiones-origen/:id/probar`.

- [ ] **Step 1: Write failing tests for PostgreSQL-only JDBC and SFTP**

```ts
it("prueba JDBC PostgreSQL con secreto usuario:clave", async () => {
  repositorio.buscarPorId.mockResolvedValue(conexionJdbc);
  repositorio.leerSecreto.mockResolvedValue("demo:cla:ve");
  probador.probarPostgres.mockResolvedValue(undefined);

  const resultado = await casoUso.ejecutar("org-1", conexionJdbc.id);

  expect(probador.probarPostgres).toHaveBeenCalledWith({
    url: "jdbc:postgresql://db.internal:5432/demo?sslmode=require",
    usuario: "demo",
    clave: "cla:ve",
  });
  expect(resultado.estado).toBe("disponible");
});

it("rechaza drivers JDBC no soportados", async () => {
  repositorio.buscarPorId.mockResolvedValue({
    ...conexionJdbc,
    config: { ...conexionJdbc.config, url: "jdbc:oracle:thin:@db:1521/demo" },
  });

  await expect(casoUso.ejecutar("org-1", conexionJdbc.id)).rejects.toMatchObject({
    codigo: "JDBC_NO_SOPORTADO",
    estadoHttp: 422,
  });
});

it("prueba SFTP con el PEM descifrado y no lo filtra al fallar", async () => {
  repositorio.buscarPorId.mockResolvedValue(conexionSftp);
  repositorio.leerSecreto.mockResolvedValue("-----BEGIN OPENSSH PRIVATE KEY-----");
  probador.probarSftp.mockRejectedValue(new Error("authentication failed"));

  await expect(casoUso.ejecutar("org-1", conexionSftp.id)).rejects.toMatchObject({
    codigo: "CONEXION_ORIGEN_NO_DISPONIBLE",
  });
  expect(repositorio.registrarPrueba).toHaveBeenCalledWith(
    "org-1",
    conexionSftp.id,
    expect.objectContaining({ estado: "error" }),
  );
});
```

- [ ] **Step 2: Verify RED**

Run: `bun test apps/api/src/modulos/origenes/aplicacion/casos-de-uso/probar-conexion-origen.test.ts`

Expected: FAIL because the case use and adapter do not exist.

- [ ] **Step 3: Implement a small adapter boundary**

```ts
export interface ProbadorConexionOrigen {
  probarPostgres(entrada: {
    url: string;
    usuario: string;
    clave: string;
  }): Promise<void>;
  probarSftp(entrada: {
    host: string;
    puerto: number;
    usuario: string;
    llavePrivada: string;
  }): Promise<void>;
}
```

The infrastructure implementation parses `jdbc:postgresql://` with `URL`, opens a `postgres` client with `max: 1`, executes `SELECT 1`, and closes it in `finally`. For SFTP, connect with `ssh2-sftp-client` and close in `finally`. Split JDBC credentials on the first `:` only.

- [ ] **Step 4: Implement the endpoint and remove bulk secret reveal**

Add `POST /:id/probar`. Delete `POST /contexto-secretos` and its admin reveal dependency. Fix input field names so HTTP accepts `secretoValor` and `secretoClavePrivadaValor`, matching Zod and the case use. Return only:

```ts
{
  estado: "disponible",
  probadaEn: "2026-08-06T12:00:00.000Z",
  mensaje: null,
}
```

- [ ] **Step 5: Run all origin tests and typecheck**

Run: `bun test apps/api/src/modulos/origenes && bun run --cwd apps/api typecheck`

Expected: PASS.

- [ ] **Step 6: Commit after explicit approval**

```bash
git add apps/api/src/plataforma/persistencia/esquema.ts apps/api/src/modulos/origenes apps/api/src/app.ts
git commit -m "feat: probar conexiones de origen de forma segura"
```

---

### Task 5: Cifrado de credenciales Postgres destino

**Human gate:** This task changes secret handling and requires explicit approval before editing. Task 6 separately gates migration creation and execution.

**Files:**
- Modify: `apps/api/src/modulos/destinos/aplicacion/puertos/repositorio-conexiones-destino.ts`
- Modify: `apps/api/src/modulos/destinos/aplicacion/casos-de-uso/gestionar-conexiones-destino.ts`
- Modify: `apps/api/src/modulos/destinos/aplicacion/casos-de-uso/gestionar-conexiones-destino.test.ts`
- Modify: `apps/api/src/modulos/destinos/infraestructura/repositorio-conexiones-destino-postgres.ts`
- Modify: `apps/api/src/modulos/destinos/infraestructura/fabrica-destinos.ts`
- Modify: `apps/api/src/plataforma/persistencia/esquema.ts`
- Modify: `apps/api/src/modulos/destinos/http/rutas-destinos-genericos.ts`
- Modify: `apps/api/src/modulos/destinos/http/rutas-destinos-genericos.test.ts`
- Modify: `apps/api/src/modulos/admin/http/rutas-configuracion-tenant.ts`
- Modify: `apps/api/src/app.ts`

**Interfaces:**
- Produces: encrypted `secretos_conexion_destino` persistence.
- Produces: `SolicitudCrearConexionDestino` for HTTP/application input and `EntradaPersistirConexionDestino` for the repository boundary.
- Produces: `obtenerConSecreto(organizacionId, id)` for internal composition only.
- Consumes: `cifrarSecretoParaPersistencia` and `leerSecretoCifrado`.

- [ ] **Step 1: Write failing manager tests**

```ts
it("extrae password antes de persistir Postgres", async () => {
  await gestor.crear({
    organizacionId: "org-1",
    tipo: "postgres",
    nombre: "Destino demo",
    config: {
      host: "db.internal",
      port: 5432,
      database: "demo",
      schema: "public",
      user: "demo",
      password: "secreto",
      ssl: true,
    },
    secretoRefs: {},
  });

  expect(repositorio.crear).toHaveBeenCalledWith(
    expect.objectContaining({
      config: expect.not.objectContaining({ password: expect.anything() }),
      secreto: {
        nombre: expect.stringMatching(/^POSTGRES_DESTINO_/),
        valor: "secreto",
      },
    }),
  );
});

it("nunca devuelve password al listar", async () => {
  repositorio.listarPorOrganizacion.mockResolvedValue([
    { ...conexionPostgres, config: { password: "legacy" } },
  ]);
  expect(await gestor.listar("org-1")).toEqual([
    expect.objectContaining({ config: expect.not.objectContaining({ password: expect.anything() }) }),
  ]);
});
```

- [ ] **Step 2: Verify RED**

Run: `bun test apps/api/src/modulos/destinos/aplicacion/casos-de-uso/gestionar-conexiones-destino.test.ts`

Expected: FAIL because the destination repository has no encrypted secret operation.

- [ ] **Step 3: Add the secret-aware repository input**

```ts
export interface SolicitudCrearConexionDestino {
  organizacionId: string;
  tipo: TipoDestino;
  nombre: string;
  config: Record<string, unknown>;
  secretoRefs: Record<string, unknown>;
}

export interface EntradaPersistirConexionDestino {
  organizacionId: string;
  tipo: TipoDestino;
  nombre: string;
  config: Record<string, unknown>;
  secretoRefs: Record<string, unknown>;
  secreto?: { nombre: string; valor: string };
}

export interface ConexionDestinoConSecreto extends ConexionDestino {
  secreto: { nombre: string; valor: string } | null;
}
```

Add a `secretosConexionDestino` Drizzle table analogous to `secretosConexionOrigen`, but do not create SQL migration yet. The repository writes connection and encrypted secret in one transaction. Public reads sanitize `password`, `privateKey` and encrypted fields.

- [ ] **Step 4: Route all destination creation through the safe manager**

Generic and admin routes must call the same `GestionarConexionesDestino.crear`. Remove any direct insert into `conexiones_destino` from admin composition. The factory receives a hydrated in-memory config only after internal secret lookup; hydrated config is never serialized.

- [ ] **Step 5: Run destination/admin tests and typecheck**

Run: `bun test apps/api/src/modulos/destinos apps/api/src/modulos/admin && bun run --cwd apps/api typecheck`

Expected: PASS against test doubles; no database migration is executed.

- [ ] **Step 6: Commit after explicit approval**

```bash
git add apps/api/src/modulos/destinos apps/api/src/modulos/admin/http/rutas-configuracion-tenant.ts apps/api/src/plataforma/persistencia/esquema.ts apps/api/src/app.ts
git commit -m "feat: cifrar secretos de destinos postgres"
```

---

### Task 6: Migracion y backfill reanudable de secretos destino

**Human gate:** Stop and request explicit approval before creating this migration. Request separate approval again before ever running `db:migrate` or the backfill.

**Files:**
- Create: `apps/api/drizzle/0015_secretos_destino_y_estado_pruebas.sql`
- Modify: `apps/api/drizzle/meta/_journal.json`
- Create: `apps/api/src/plataforma/persistencia/backfills/cifrar-secretos-destino.ts`
- Create: `apps/api/src/plataforma/persistencia/backfills/cifrar-secretos-destino.test.ts`
- Modify: `apps/api/src/esquema.test.ts`

**Interfaces:**
- Consumes: schema introduced in Tasks 3 and 5.
- Produces: idempotent DDL and `cifrarSecretosDestinoExistentes(db, cifrado)`.

- [ ] **Step 1: Write failing schema and backfill tests**

```ts
it("declara secretos destino y estado de prueba sin reutilizar 0014", () => {
  const sql = readFileSync(
    new URL("../drizzle/0015_secretos_destino_y_estado_pruebas.sql", import.meta.url),
    "utf8",
  );
  expect(sql).toContain("CREATE TABLE IF NOT EXISTS secretos_conexion_destino");
  expect(sql).toContain("probada_en");
  expect(sql).not.toContain("DROP TABLE");
});

it("migra password una vez y elimina el valor de config", async () => {
  db.listarPendientes.mockResolvedValueOnce([
    { id: "destino-1", config: { user: "demo", password: "secreto" } },
  ]).mockResolvedValueOnce([]);

  await cifrarSecretosDestinoExistentes(db, cifrado);

  expect(db.guardarMigracion).toHaveBeenCalledWith(
    expect.objectContaining({
      id: "destino-1",
      config: { user: "demo" },
      valorCifrado: expect.any(String),
    }),
  );
});
```

- [ ] **Step 2: Verify RED without executing migrations**

Run: `bun test apps/api/src/esquema.test.ts apps/api/src/plataforma/persistencia/backfills/cifrar-secretos-destino.test.ts`

Expected: FAIL because files do not exist.

- [ ] **Step 3: Create idempotent DDL**

The migration must:

```sql
ALTER TABLE conexiones_origen
  ADD COLUMN IF NOT EXISTS estado text NOT NULL DEFAULT 'sin_probar',
  ADD COLUMN IF NOT EXISTS probada_en timestamp,
  ADD COLUMN IF NOT EXISTS mensaje_error text;

ALTER TABLE conexiones_destino
  ADD COLUMN IF NOT EXISTS probada_en timestamp;

CREATE TABLE IF NOT EXISTS secretos_conexion_destino (
  conexion_destino_id uuid NOT NULL REFERENCES conexiones_destino(id) ON DELETE CASCADE,
  nombre text NOT NULL,
  valor_cifrado text NOT NULL,
  creado_en timestamp NOT NULL DEFAULT now(),
  actualizado_en timestamp NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_secreto_conexion_destino_nombre
  ON secretos_conexion_destino(conexion_destino_id, nombre);
```

- [ ] **Step 4: Implement an explicit, non-automatic backfill**

The backfill selects only Postgres rows whose `config.password` is a non-empty string and have no encrypted destination secret. Process one transaction per row: encrypt, insert/upsert secret, write `secreto_refs`, then remove `password` from JSON. Return counters only; never log config or secret values.

- [ ] **Step 5: Run tests and database static check only**

Run: `bun test apps/api/src/esquema.test.ts apps/api/src/plataforma/persistencia/backfills/cifrar-secretos-destino.test.ts && bun run db:check`

Expected: PASS. Do not run `bun run db:migrate`.

- [ ] **Step 6: Commit after explicit approval**

```bash
git add apps/api/drizzle/0015_secretos_destino_y_estado_pruebas.sql apps/api/drizzle/meta/_journal.json apps/api/src/esquema.test.ts apps/api/src/plataforma/persistencia/backfills
git commit -m "feat: migrar secretos cifrados de destinos"
```

---

### Task 7: Prueba real de Postgres destino

**Files:**
- Modify: `apps/api/src/modulos/destinos/aplicacion/puertos/puerto-destino.ts`
- Modify: `apps/api/src/modulos/destinos/infraestructura/cliente-postgres.ts`
- Modify: `apps/api/src/modulos/destinos/infraestructura/cliente-postgres.test.ts`
- Modify: `apps/api/src/modulos/destinos/http/rutas-destinos-genericos.ts`
- Modify: `apps/api/src/modulos/destinos/http/rutas-destinos-genericos.test.ts`
- Modify: `apps/api/src/modulos/destinos/aplicacion/puertos/repositorio-conexiones-destino.ts`

**Interfaces:**
- Produces: `PuertoDestino.probar(): Promise<void>`.
- Consumes: hydrated destination config from Task 5.

- [ ] **Step 1: Write failing tests proving a query is executed**

```ts
it("POST /probar ejecuta conectividad y guarda la fecha", async () => {
  cliente.probar.mockResolvedValue(undefined);
  const respuesta = await app.request("/destinos/conexiones/destino-1/probar", {
    method: "POST",
  });

  expect(respuesta.status).toBe(200);
  expect(cliente.probar).toHaveBeenCalledTimes(1);
  expect(gestor.actualizar).toHaveBeenCalledWith(
    "org-1",
    "destino-1",
    expect.objectContaining({ estado: "activo", probadaEn: expect.any(Date) }),
  );
});
```

- [ ] **Step 2: Verify RED**

Run: `bun test apps/api/src/modulos/destinos/http/rutas-destinos-genericos.test.ts`

Expected: FAIL because `/probar` currently calls only `obtenerCapacidades()`.

- [ ] **Step 3: Implement real probing and cleanup**

```ts
export interface PuertoDestino {
  readonly tipo: TipoDestino;
  probar(): Promise<void>;
  obtenerCapacidades(): CapacidadesDestino;
  listarRecursos(): Promise<RecursoDestino[]>;
  obtenerRecurso(id: string): Promise<DetalleRecursoDestino>;
}
```

`ClientePostgres.probar` executes `SELECT 1 AS ok`. Add `cerrar()` or make `probar` use a short-lived client so every success/failure closes connections. Other destination adapters implement a meaningful lightweight probe or throw `PRUEBA_NO_SOPORTADA`; this feature uses Postgres only.

- [ ] **Step 4: Sanitize failure messages**

Persist and return `"No se pudo conectar con el destino PostgreSQL"`; retain the original adapter error only as an internal cause not serialized or audited.

- [ ] **Step 5: Run focused tests**

Run: `bun test apps/api/src/modulos/destinos && bun run --cwd apps/api typecheck`

Expected: PASS.

- [ ] **Step 6: Commit after explicit approval**

```bash
git add apps/api/src/modulos/destinos
git commit -m "feat: verificar conectividad de destinos postgres"
```

---

### Task 8: Caso de uso y endpoint de preflight

**Files:**
- Create: `apps/api/src/modulos/automatizaciones/aplicacion/casos-de-uso/preflight-automatizacion.ts`
- Create: `apps/api/src/modulos/automatizaciones/aplicacion/casos-de-uso/preflight-automatizacion.test.ts`
- Modify: `apps/api/src/modulos/automatizaciones/http/rutas-panel.ts`
- Modify: `apps/api/src/modulos/automatizaciones/http/rutas-panel.test.ts`
- Modify: `apps/api/src/app.ts`

**Interfaces:**
- Consumes: `descubrirRequisitosConexion`, origin lookup/status, destination listing.
- Produces: `PreflightAutomatizacion.ejecutar({ organizacionId, flujoId })`.
- Produces HTTP: `POST /automatizaciones/preflight` body `{ flujoId }`.

- [ ] **Step 1: Write failing case-use tests**

```ts
it("asocia por tipo y nombre y lista solo destinos Postgres", async () => {
  qlik.obtenerScriptApp.mockResolvedValue({ script: SCRIPT_DEMO });
  origenes.listar.mockResolvedValue([
    conexionJdbcDisponible,
    conexionSftpConError,
  ]);
  destinos.listar.mockResolvedValue([
    destinoPostgres,
    { ...destinoPostgres, id: "impala-1", tipo: "impala" },
  ]);

  const resultado = await preflight.ejecutar({
    organizacionId: "org-1",
    flujoId: "flujo-1",
    flujoNombre: "Ventas",
  });

  expect(resultado.conexionesRequeridas).toEqual([
    expect.objectContaining({ tipo: "jdbc", estado: "disponible" }),
    expect.objectContaining({ tipo: "sftp", estado: "error" }),
  ]);
  expect(resultado.destinosPostgres).toHaveLength(1);
  expect(JSON.stringify(resultado)).not.toMatch(/password|PRIVATE KEY|usuario:clave/);
});
```

- [ ] **Step 2: Verify RED**

Run: `bun test apps/api/src/modulos/automatizaciones/aplicacion/casos-de-uso/preflight-automatizacion.test.ts`

Expected: FAIL because the case use does not exist.

- [ ] **Step 3: Implement the case use with public projection only**

```ts
export class PreflightAutomatizacion {
  constructor(
    private readonly qlik: Pick<PuertoQlik, "obtenerScriptApp">,
    private readonly origenes: ConsultaConexionesOrigen,
    private readonly destinos: ConsultaConexionesDestino,
  ) {}

  async ejecutar(entrada: {
    organizacionId: string;
    flujoId: string;
    flujoNombre: string;
  }): Promise<PreflightAutomatizacionDto> {
    const { script } = await this.qlik.obtenerScriptApp(entrada.flujoId, "current");
    const requisitos = descubrirRequisitosConexion(script || "");
    const [origenes, destinos] = await Promise.all([
      this.origenes.listar(entrada.organizacionId),
      this.destinos.listar(entrada.organizacionId),
    ]);
    return proyectarPreflight(entrada, requisitos, origenes, destinos);
  }
}
```

- [ ] **Step 4: Add route with existing space policy**

The route parses `{ flujoId: z.string().min(1) }`, resolves the Qlik flow, and applies the same `resolverPoliticaEspacios` check already used by `/desde-plantilla`. Return 403 `ESPACIO_NO_AUTORIZADO` before reading connection metadata when the flow is forbidden.

- [ ] **Step 5: Run route/case tests**

Run: `bun test apps/api/src/modulos/automatizaciones/aplicacion/casos-de-uso/preflight-automatizacion.test.ts apps/api/src/modulos/automatizaciones/http/rutas-panel.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit after explicit approval**

```bash
git add apps/api/src/modulos/automatizaciones apps/api/src/app.ts
git commit -m "feat: agregar preflight de conexiones de automatizacion"
```

---

### Task 9: Preparar las cinco variables de Modo 1

**Files:**
- Modify: `apps/api/src/modulos/automatizaciones/aplicacion/servicios/preparar-parametros-plantilla.ts`
- Modify: `apps/api/src/modulos/automatizaciones/aplicacion/servicios/preparar-parametros-plantilla.test.ts`
- Create: `apps/api/src/modulos/automatizaciones/aplicacion/servicios/construir-secretos-modo-1.ts`
- Create: `apps/api/src/modulos/automatizaciones/aplicacion/servicios/construir-secretos-modo-1.test.ts`

**Interfaces:**
- Produces: `ParametrosPlantillaModo1` with exactly five values plus discriminator `modo`.
- Consumes: strict discovery, real testers and encrypted secret reads.
- Preserves: `ParametrosPlantillaModo2` unchanged.

- [ ] **Step 1: Replace only Modo 1 tests with the new contract**

```ts
it("construye las cinco variables desde servidor", async () => {
  const parametros = await prepararParametrosPlantilla(deps, {
    modo: 1,
    organizacionId: "org-1",
    flujoId: "flujo-1",
    destinoId: destinoPostgres.id,
  });

  expect(parametros).toEqual({
    modo: 1,
    Appid: "flujo-1",
    DFScript: SCRIPT_DEMO,
    ConexionJSON: JSON.stringify(catalogoEsperado),
    BaseDestinoJSON: JSON.stringify({
      tipo: "postgres",
      host: "db.internal",
      puerto: 5432,
      database: "demo",
      esquema: "public",
      secreto_nombre: "POSTGRES_DESTINO_DEMO",
    }),
    SECRETOSJSON: JSON.stringify({
      JDBC_VENTAS: "lector:clave",
      SFTP_SALIDA_B64: Buffer.from(PEM_DEMO, "utf8").toString("base64"),
      POSTGRES_DESTINO_DEMO: "writer:clave-destino",
    }),
  });
});

it("Modo 1 no requiere tablaId", async () => {
  await expect(
    prepararParametrosPlantilla(deps, {
      modo: 1,
      organizacionId: "org-1",
      flujoId: "flujo-1",
      destinoId: destinoPostgres.id,
    }),
  ).resolves.toMatchObject({ modo: 1 });
});
```

- [ ] **Step 2: Add failing security/error tests**

Assert codes `CONEXIONES_ORIGEN_FALTANTES`, `CONEXION_ORIGEN_NO_DISPONIBLE`, `DESTINO_POSTGRES_REQUERIDO`, `DESTINO_POSTGRES_NO_ENCONTRADO`, `DESTINO_POSTGRES_NO_DISPONIBLE`, and `SECRETO_REQUERIDO_FALTANTE`. Error details may contain type/name/reference only, never URL credentials, PEM or password.

- [ ] **Step 3: Verify RED and Modo 2 baseline**

Run: `bun test apps/api/src/modulos/automatizaciones/aplicacion/servicios/preparar-parametros-plantilla.test.ts`

Expected: new Modo 1 tests FAIL; existing Modo 2 tests PASS.

- [ ] **Step 4: Implement the new parameter type**

```ts
export interface ParametrosPlantillaModo1 {
  modo: 1;
  Appid: string;
  DFScript: string;
  ConexionJSON: string;
  BaseDestinoJSON: string;
  SECRETOSJSON: string;
}
```

Read the current script once in final preparation, derive all requirements, re-run every required origin probe and destination probe, then read only their referenced secrets. Normalize SFTP reference names to `_B64` at connection creation; encode raw PEM exactly once here. Build new objects rather than mutating repository results.

- [ ] **Step 5: Prove secret JSON cannot escape through errors**

In tests, walk every thrown error with `JSON.stringify(error)` and assert it does not include sentinel values such as `CLAVE_SUPER_SECRETA` or `BEGIN OPENSSH PRIVATE KEY`.

- [ ] **Step 6: Run service tests**

Run: `bun test apps/api/src/modulos/automatizaciones/aplicacion/servicios`

Expected: PASS, including unchanged Modo 2 tests.

- [ ] **Step 7: Commit after explicit approval**

```bash
git add apps/api/src/modulos/automatizaciones/aplicacion/servicios
git commit -m "feat: preparar variables de plantilla modo 1"
```

---

### Task 10: Validar workspace y endurecer creacion

**Files:**
- Modify: `apps/api/src/modulos/automatizaciones/aplicacion/servicios/configurar-workspace-plantilla.ts`
- Modify: `apps/api/src/modulos/automatizaciones/aplicacion/servicios/configurar-workspace-plantilla.test.ts`
- Modify: `apps/api/src/modulos/automatizaciones/aplicacion/servicios/servicio-copia-automatizacion.test.ts`
- Modify: `apps/api/src/modulos/automatizaciones/aplicacion/casos-de-uso/crear-desde-plantilla.ts`
- Modify: `apps/api/src/modulos/automatizaciones/aplicacion/casos-de-uso/crear-desde-plantilla.test.ts`
- Modify: `apps/api/src/modulos/automatizaciones/http/rutas-panel.ts`
- Modify: `apps/api/src/modulos/automatizaciones/http/rutas-panel.test.ts`

**Interfaces:**
- Consumes: `ParametrosPlantillaModo1` from Task 9 and public input from Task 1.
- Produces: synchronized immutable workspace and sanitized creation path.

- [ ] **Step 1: Write the real workspace fixture test**

```ts
const workspaceModo1 = {
  variables: [
    { guid: "a", name: "Appid", type: "string" },
    { guid: "b", name: "DFScript", type: "string" },
    { guid: "c", name: "ConexionJSON", type: "string" },
    { guid: "d", name: "BaseDestinoJSON", type: "string" },
    { guid: "e", name: "SECRETOSJSON", type: "string" },
    { guid: "f", name: "Dataset", type: "string" },
  ],
  blocks: [
    {
      type: "VariableBlock",
      name: "Appid",
      operations: [{ id: "set_value", key: "op-a", value: "anterior" }],
    },
  ],
};

it("actualiza set_value y conserva variables adicionales", () => {
  const resultado = configurarWorkspacePlantilla(workspaceModo1, parametrosModo1);
  const appid = resultado.blocks[0].operations[0];
  expect(appid.value).toBe("flujo-1");
  expect(resultado.variables.find((item) => item.name === "Dataset")).toEqual(
    workspaceModo1.variables[5],
  );
  expect(workspaceModo1.blocks[0].operations[0].value).toBe("anterior");
});
```

- [ ] **Step 2: Add missing-variable and cleanup tests**

Expect `VARIABLES_PLANTILLA_FALTANTES` with all missing names before `qlik.copiarAutomatizacion` is called. Keep the existing test proving that a clone is deleted when workspace update fails.

- [ ] **Step 3: Verify RED**

Run: `bun test apps/api/src/modulos/automatizaciones/aplicacion/servicios/configurar-workspace-plantilla.test.ts apps/api/src/modulos/automatizaciones/aplicacion/servicios/servicio-copia-automatizacion.test.ts`

Expected: FAIL because Modo 1 still expects old names and updates the first operation rather than `id === "set_value"`.

- [ ] **Step 4: Implement exact variable mapping**

Set required Modo 1 names to `Appid`, `DFScript`, `ConexionJSON`, `BaseDestinoJSON`, `SECRETOSJSON`. Locate each block operation by `operation.id === "set_value"`; reject a required block without that operation. Keep Modo 2 mapping unchanged.

- [ ] **Step 5: Parse public Modo 1 input server-side**

In `POST /desde-plantilla`, determine mode first. Parse Modo 1 with `esquemaEntradaCrearModo1`; then construct the internal input with server-selected `plantillaIdQlik` and empty `reemplazosWorkspace`. Never spread the raw body into the internal object.

```ts
const entradaPublica = esquemaEntradaCrearModo1.parse(cuerpo);
const entradaInterna = esquemaCrearDesdePlantilla.parse({
  ...entradaPublica,
  plantillaIdQlik: plantilla.id,
  reemplazosWorkspace: [],
  ...(claveEncabezado ? { claveIdempotencia: claveEncabezado } : {}),
});
```

- [ ] **Step 6: Add no-leak/idempotency assertions**

Use sentinel secrets and assert the HTTP response, audit records and outbox events do not contain them. Repeat the request with the same idempotency key and assert one Qlik copy only.

- [ ] **Step 7: Run automation backend tests**

Run: `bun test apps/api/src/modulos/automatizaciones && bun run --cwd apps/api typecheck`

Expected: PASS.

- [ ] **Step 8: Commit after explicit approval**

```bash
git add apps/api/src/modulos/automatizaciones
git commit -m "feat: clonar plantilla modo 1 con variables seguras"
```

---

### Task 11: API web y formularios reutilizables de conexiones

**Files:**
- Modify: `apps/web/src/modulos/automatizaciones/api.ts`
- Create: `apps/web/src/modulos/automatizaciones/componentes/formulario-conexion-origen.tsx`
- Create: `apps/web/src/modulos/automatizaciones/componentes/formulario-conexion-origen.test.tsx`
- Create: `apps/web/src/modulos/automatizaciones/componentes/formulario-postgres-destino.tsx`
- Create: `apps/web/src/modulos/automatizaciones/componentes/formulario-postgres-destino.test.tsx`
- Modify: `apps/web/src/modulos/origenes/pagina-catalogo-origen.tsx`
- Modify: `apps/web/src/modulos/origenes/pagina-catalogo-origen.test.tsx`

**Interfaces:**
- Consumes: shared preflight contracts and origin/destination HTTP endpoints.
- Produces: reusable controlled forms with `onGuardada(id)`.

- [ ] **Step 1: Add API functions with exact payloads**

```ts
export function obtenerPreflightAutomatizacion(flujoId: string) {
  return clienteApi.post<PreflightAutomatizacion>(
    "/automatizaciones/preflight",
    { flujoId },
  );
}

export function probarConexionOrigen(id: string) {
  return clienteApi.post<ResultadoPruebaConexion>(
    `/conexiones-origen/${encodeURIComponent(id)}/probar`,
    {},
  );
}
```

- [ ] **Step 2: Write failing origin form test**

```tsx
it("envia el secreto con el nombre aceptado por backend y prueba al guardar", async () => {
  render(
    <FormularioConexionOrigen
      requisito={{ tipo: "sftp", nombre: "Salida SFTP" }}
      onGuardada={onGuardada}
    />,
  );

  await user.type(screen.getByLabelText("Servidor"), "sftp.internal");
  await user.type(screen.getByLabelText("Usuario"), "demo");
  await user.type(screen.getByLabelText("Llave privada"), PEM_DEMO);
  await user.click(screen.getByRole("button", { name: "Guardar y probar" }));

  expect(postMock).toHaveBeenNthCalledWith(
    1,
    "/conexiones-origen",
    expect.objectContaining({
      config: expect.objectContaining({
        secretoClavePrivadaValor: PEM_DEMO,
      }),
    }),
  );
  expect(postMock).toHaveBeenNthCalledWith(
    2,
    "/conexiones-origen/conexion-1/probar",
    {},
  );
});
```

- [ ] **Step 3: Write failing Postgres form test**

Assert fields `nombre`, `host`, `port`, `database`, `schema`, `user`, `password`, and `ssl`; after create, call destination probe and invoke `onGuardada(id)` only on success.

- [ ] **Step 4: Verify RED**

Run: `bun run --cwd apps/web test:run -- src/modulos/automatizaciones/componentes/formulario-conexion-origen.test.tsx src/modulos/automatizaciones/componentes/formulario-postgres-destino.test.tsx`

Expected: FAIL because components do not exist.

- [ ] **Step 5: Extract forms and remove secret reveal UI**

Move input/state logic out of `pagina-catalogo-origen.tsx` into the controlled origin form. Delete “Copiar JSON de secretos para el job”, dialog state and `/contexto-secretos` call. Ensure password/PEM fields clear after every mutation result and are never copied into query cache.

- [ ] **Step 6: Run form/catalog tests**

Run: `bun run --cwd apps/web test:run -- src/modulos/automatizaciones/componentes/formulario-conexion-origen.test.tsx src/modulos/automatizaciones/componentes/formulario-postgres-destino.test.tsx src/modulos/origenes/pagina-catalogo-origen.test.tsx`

Expected: PASS.

- [ ] **Step 7: Commit after explicit approval**

```bash
git add apps/web/src/modulos/automatizaciones/api.ts apps/web/src/modulos/automatizaciones/componentes/formulario-conexion-origen.tsx apps/web/src/modulos/automatizaciones/componentes/formulario-conexion-origen.test.tsx apps/web/src/modulos/automatizaciones/componentes/formulario-postgres-destino.tsx apps/web/src/modulos/automatizaciones/componentes/formulario-postgres-destino.test.tsx apps/web/src/modulos/origenes
git commit -m "feat: reutilizar formularios seguros de conexiones"
```

---

### Task 12: Asistente Modo 1 de cuatro pasos

**Files:**
- Modify: `apps/web/src/modulos/automatizaciones/pagina-nueva-automatizacion.tsx`
- Modify: `apps/web/src/modulos/automatizaciones/pagina-nueva-automatizacion.test.tsx`
- Modify: `apps/web/src/modulos/automatizaciones/componentes/formulario-crear-automatizacion.tsx`
- Modify: `apps/web/src/modulos/automatizaciones/componentes/formulario-crear-automatizacion-ui.test.tsx`
- Modify: `apps/web/src/modulos/automatizaciones/componentes/resumen-nueva-automatizacion.tsx`
- Modify: `apps/web/src/modulos/automatizaciones/componentes/resumen-nueva-automatizacion.test.tsx`

**Interfaces:**
- Consumes: preflight API and reusable forms from Task 11.
- Produces: four-step Modo 1 UI; preserves existing Modo 2 UI.

- [ ] **Step 1: Write failing page behavior tests**

```tsx
it("ejecuta preflight, exige origenes y Postgres, y no muestra tabla en Modo 1", async () => {
  getConfigMock.mockResolvedValue(configModo1);
  preflightMock.mockResolvedValue(preflightConSftpFaltante);
  render(<PaginaNuevaAutomatizacion />);

  await user.click(screen.getByRole("option", { name: /Dataflow Ventas/ }));

  expect(await screen.findByText("Salida SFTP")).toBeInTheDocument();
  expect(screen.getByText("Base destino PostgreSQL")).toBeInTheDocument();
  expect(screen.queryByLabelText(/tabla destino/i)).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: /crear automatizacion/i })).toBeDisabled();
});

it("envia payload minimo cuando todo esta probado", async () => {
  preflightMock.mockResolvedValue(preflightCompleto);
  render(<PaginaNuevaAutomatizacion />);
  await completarAsistente(user);

  expect(crearMock).toHaveBeenCalledWith({
    nombre: "Ventas demo",
    flujoId: "flujo-1",
    destinoId: "942b04fb-1bc0-49de-9708-8d189632cc08",
    espacioIdQlik: "espacio-1",
  });
});
```

- [ ] **Step 2: Add race-condition and progress tests**

Use deferred promises: select Dataflow A, then B, resolve A last, and assert only B requirements render. After creating a connection, invalidate/refetch preflight while preserving `nombre`, `flujoId`, `destinoId` and the existing `beforeunload` protection.

- [ ] **Step 3: Verify RED**

Run: `bun run --cwd apps/web test:run -- src/modulos/automatizaciones/pagina-nueva-automatizacion.test.tsx src/modulos/automatizaciones/componentes/formulario-crear-automatizacion-ui.test.tsx`

Expected: FAIL because Modo 1 still asks for a table and has no preflight.

- [ ] **Step 4: Implement deferred preflight state**

Use TanStack Query keyed by `['automatizaciones-preflight', flujoId]` with `enabled: modoActivo === 1 && Boolean(flujoId)`. Derive readiness from every requirement having `estado === 'disponible'` and the selected Postgres having `estado === 'activo'` with non-null `probadoEn`. Do not duplicate server discovery logic in React.

- [ ] **Step 5: Render four Modo 1 steps and warning**

The confirmation text must state: `Este demo guardara credenciales en la variable SECRETOSJSON del workspace de Qlik. Los usuarios con permiso de edicion podran verlas.` Require an explicit checkbox before enabling create. Keep Modo 2 components and table selection on their existing branch.

- [ ] **Step 6: Run all automation UI tests**

Run: `bun run --cwd apps/web test:run -- src/modulos/automatizaciones`

Expected: PASS.

- [ ] **Step 7: Commit after explicit approval**

```bash
git add apps/web/src/modulos/automatizaciones
git commit -m "feat: guiar conexiones al crear automatizacion"
```

---

### Task 13: Verificacion integral y cierre de seguridad

**Files:**
- Modify only failing tests or implementation files directly attributable to this feature.
- Update: `docs/superpowers/specs/2026-08-06-plantilla-modo-1-conexiones-design.md` only if implementation exposed a verified design correction.

**Interfaces:**
- Consumes all prior tasks.
- Produces verified build with no known secret leaks and Modo 2 regression coverage.

- [ ] **Step 1: Run focused backend suites**

Run:

```bash
bun test apps/api/src/modulos/flujos/aplicacion/generador-catalogo-spark.spec.ts
bun test apps/api/src/modulos/origenes
bun test apps/api/src/modulos/destinos
bun test apps/api/src/modulos/automatizaciones
```

Expected: all PASS.

- [ ] **Step 2: Run focused frontend suites**

Run:

```bash
bun run --cwd apps/web test:run -- src/modulos/origenes src/modulos/automatizaciones
```

Expected: all PASS.

- [ ] **Step 3: Run complete static and test verification**

Run:

```bash
bun run test:api
bun run test:web
bun run typecheck
bun run lint
bun run build
bun run db:check
```

Expected: every command exits 0. Do not run `bun run db:migrate`.

- [ ] **Step 4: Verify coverage for changed modules**

Use the existing Bun/Vitest coverage command configured by each workspace. Confirm at least 80% statements/branches/functions/lines for new preflight, tester, secret-construction and form modules. If the repository has no coverage script, add one only after checking existing Vitest/Bun configuration rather than installing a dependency.

- [ ] **Step 5: Search generated output for secret sentinels**

Run tests with fixed sentinels and inspect captured HTTP responses, audit mocks and outbox mocks. Assertions must prove absence of `CLAVE_SUPER_SECRETA`, `BEGIN OPENSSH PRIVATE KEY`, `password`, and hydrated DSNs outside the Qlik workspace update call.

- [ ] **Step 6: Review the final diff without changing unrelated work**

Run: `git status --short`, `git diff --check`, `git diff -- apps/api/src/modulos/automatizaciones apps/api/src/modulos/origenes apps/api/src/modulos/destinos`, and `git diff -- apps/web/src/modulos/automatizaciones apps/web/src/modulos/origenes`. Confirm the existing unrelated dirty files were not reverted or staged.

- [ ] **Step 7: Confirm that verification introduced no uncommitted fixes**

Run: `git diff --name-only` and compare the result with the status captured before execution. If verification required a code fix, return to the owning task, rerun its focused tests and request approval for that task's explicit commit command. Do not create an empty verification commit.

## Execution Checkpoints

1. After Tasks 1-4: contracts, strict discovery and safe origin probes work independently.
2. Before Tasks 5-6: obtain explicit approval for secret handling and migration creation.
3. After Tasks 5-7: Postgres destination secrets and real probing work independently.
4. After Tasks 8-10: backend preflight and cloning are complete and testable by API.
5. After Tasks 11-12: the four-step UI is complete.
6. Task 13: full regression, security and build verification; migration execution remains a separate operational action.
