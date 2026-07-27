import { describe, expect, it } from "bun:test";
import { getTableConfig } from "drizzle-orm/pg-core";
import {
  auditoriaEventos,
  automatizacionesQlikCache,
  configuracionesAutomatizacion,
  configuracionesOauthQlik,
  credencialesQlik,
  destinosCache,
  espaciosQlikCache,
  eventosOutbox,
  flujosQlikCache,
  identidadesQlik,
  intentosOauthQlik,
  membresiasOrganizacion,
  organizaciones,
  programacionesAutomatizacion,
  sesionesUsuario,
  solicitudesIdempotentes,
  tenantsQlik,
  usuarios,
} from "./plataforma/persistencia/esquema.js";

function colNames(table: ReturnType<typeof getTableConfig>) {
  return table.columns.map((c) => c.name);
}

function idxNames(table: ReturnType<typeof getTableConfig>) {
  return table.indexes.map((i) => (i.config as { name: string }).name);
}

describe("Esquema Drizzle", () => {
  it("organizaciones tiene las columnas esperadas", () => {
    const cols = colNames(getTableConfig(organizaciones));
    expect(cols).toContain("id");
    expect(cols).toContain("nombre");
    expect(cols).toContain("estado");
    expect(cols).toContain("creado_en");
    expect(cols).toContain("actualizado_en");
  });

  it("usuarios tiene las columnas esperadas", () => {
    const cols = colNames(getTableConfig(usuarios));
    expect(cols).toContain("id");
    expect(cols).toContain("nombre");
    expect(cols).toContain("correo");
    expect(cols).toContain("estado");
    expect(cols).toContain("es_superadmin");
  });

  it("membresiasOrganizacion tiene las columnas de FK", () => {
    const cols = colNames(getTableConfig(membresiasOrganizacion));
    expect(cols).toContain("organizacion_id");
    expect(cols).toContain("usuario_id");
    expect(cols).toContain("rol");
  });

  it("tenantsQlik tiene las columnas esperadas", () => {
    const cols = colNames(getTableConfig(tenantsQlik));
    expect(cols).toContain("tenant_id_qlik");
    expect(cols).toContain("host");
    expect(cols).toContain("estado");
    expect(cols).toContain("es_principal");
    expect(idxNames(getTableConfig(tenantsQlik))).toContain(
      "uq_tenant_principal_por_organizacion",
    );
  });

  it("configuracionesOauthQlik protege secretos por tenant", () => {
    const config = getTableConfig(configuracionesOauthQlik);
    const cols = colNames(config);
    expect(cols).toContain("tenant_qlik_id");
    expect(cols).toContain("cliente_id");
    expect(cols).toContain("cliente_secreto_cifrado");
    expect(cols).toContain("secreto_sufijo");
    expect(cols).toContain("scopes");
    expect(cols).toContain("estado");
    expect(cols).toContain("verificada_en");
    expect(cols).toContain("ultimo_error");
    expect(idxNames(config)).toContain("uq_configuracion_oauth_por_tenant");
  });

  it("mantiene columnas cifradas separadas sin borrar secretos heredados durante la migración", async () => {
    const contenido = await Bun.file(
      new URL("../drizzle/0009_secretos_destino_impala.sql", import.meta.url),
    ).text();

    expect(contenido).toContain("destino_api_key_cifrada");
    expect(contenido).toContain("impala_password_cifrada");
    expect(contenido).not.toContain("DROP COLUMN");
  });

  it("identidadesQlik tiene las columnas esperadas", () => {
    const cols = colNames(getTableConfig(identidadesQlik));
    expect(cols).toContain("usuario_id_qlik");
    expect(cols).toContain("tenant_qlik_id");
  });

  it("credencialesQlik tiene columnas de token", () => {
    const cols = colNames(getTableConfig(credencialesQlik));
    expect(cols).toContain("token_acceso_cifrado");
    expect(cols).toContain("token_refresco_cifrado");
    expect(cols).toContain("scopes");
    expect(cols).toContain("token_expira_en");
  });

  it("sesionesUsuario tiene indices definidos", () => {
    const idxs = idxNames(getTableConfig(sesionesUsuario));
    expect(idxs).toContain("idx_sesiones_usuario_usuario");
    expect(idxs).toContain("idx_sesiones_usuario_expira");
  });

  it("configuracionesAutomatizacion tiene las columnas esperadas", () => {
    const cols = colNames(getTableConfig(configuracionesAutomatizacion));
    expect(cols).toContain("flujo_id_qlik");
    expect(cols).toContain("automatizacion_id_qlik");
    expect(cols).toContain("programar");
    expect(cols).toContain("estado");
  });

  it("programacionesAutomatizacion tiene tipo y zonaHoraria", () => {
    const cols = colNames(getTableConfig(programacionesAutomatizacion));
    expect(cols).toContain("tipo");
    expect(cols).toContain("zona_horaria");
    expect(cols).toContain("activa");
  });

  it("auditoriaEventos tiene columnas de auditoria", () => {
    const cols = colNames(getTableConfig(auditoriaEventos));
    expect(cols).toContain("accion");
    expect(cols).toContain("resultado");
    expect(cols).toContain("datos_anteriores");
    expect(cols).toContain("datos_nuevos");
  });

  it("espaciosQlikCache tiene las columnas esperadas", () => {
    const cols = colNames(getTableConfig(espaciosQlikCache));
    expect(cols).toContain("espacio_id_qlik");
    expect(cols).toContain("nombre");
    expect(cols).toContain("tipo");
  });

  it("flujosQlikCache tiene las columnas esperadas", () => {
    const cols = colNames(getTableConfig(flujosQlikCache));
    expect(cols).toContain("flujo_id_qlik");
    expect(cols).toContain("nombre");
    expect(cols).toContain("url_qlik");
  });

  it("automatizacionesQlikCache tiene columnas de estado", () => {
    const cols = colNames(getTableConfig(automatizacionesQlikCache));
    expect(cols).toContain("automatizacion_id_qlik");
    expect(cols).toContain("nombre");
    expect(cols).toContain("estado");
    expect(cols).toContain("ultimo_estado_ejecucion");
  });

  it("solicitudesIdempotentes conserva clave, hash y respuesta", () => {
    const cols = colNames(getTableConfig(solicitudesIdempotentes));
    expect(cols).toContain("clave");
    expect(cols).toContain("hash_solicitud");
    expect(cols).toContain("respuesta");
  });

  it("eventosOutbox conserva agregado, payload y publicación", () => {
    const cols = colNames(getTableConfig(eventosOutbox));
    expect(cols).toContain("agregado_tipo");
    expect(cols).toContain("datos");
    expect(cols).toContain("publicado_en");
  });

  it("intentosOauthQlik tiene indice en expiraEn", () => {
    const idxs = idxNames(getTableConfig(intentosOauthQlik));
    expect(idxs).toContain("idx_intentos_oauth_expira");
  });
});
