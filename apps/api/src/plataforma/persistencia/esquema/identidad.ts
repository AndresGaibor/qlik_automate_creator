import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const organizaciones = pgTable(
  "organizaciones",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    nombre: text("nombre").notNull(),
    estado: text("estado").notNull().default("activa"),
    creadoEn: timestamp("creado_en").notNull().defaultNow(),
    actualizadoEn: timestamp("actualizado_en").notNull().defaultNow(),
  },
  (t) => ({
    ckEstado: check(
      "organizaciones_estado_check",
      sql`${t.estado} IN ('activa', 'suspendida')`,
    ),
  }),
);
export const usuarios = pgTable(
  "usuarios",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    nombre: text("nombre").notNull(),
    correo: text("correo"),
    avatarUrl: text("avatar_url"),
    estado: text("estado").notNull().default("activo"),
    esSuperadmin: boolean("es_superadmin").notNull().default(false),
    ultimoAccesoEn: timestamp("ultimo_acceso_en"),
    creadoEn: timestamp("creado_en").notNull().defaultNow(),
    actualizadoEn: timestamp("actualizado_en").notNull().defaultNow(),
  },
  (t) => ({
    ckEstado: check(
      "usuarios_estado_check",
      sql`${t.estado} IN ('activo', 'suspendido')`,
    ),
  }),
);
export const membresiasOrganizacion = pgTable(
  "membresias_organizacion",
  {
    organizacionId: uuid("organizacion_id")
      .notNull()
      .references(() => organizaciones.id, { onDelete: "cascade" }),
    usuarioId: uuid("usuario_id")
      .notNull()
      .references(() => usuarios.id, { onDelete: "cascade" }),
    rol: text("rol").notNull().default("usuario"),
    creadoEn: timestamp("creado_en").notNull().defaultNow(),
  },
  (t) => ({
    pk: unique("membresias_pk").on(t.organizacionId, t.usuarioId),
    ckRol: check(
      "membresias_rol_check",
      sql`${t.rol} IN ('administrador', 'editor', 'usuario', 'auditor', 'admin')`,
    ),
  }),
);
export const tenantsQlik = pgTable(
  "tenants_qlik",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizacionId: uuid("organizacion_id")
      .notNull()
      .references(() => organizaciones.id, { onDelete: "cascade" }),
    tenantIdQlik: text("tenant_id_qlik").notNull(),
    host: text("host").notNull(),
    nombre: text("nombre"),
    estado: text("estado").notNull().default("activo"),
    esPrincipal: boolean("es_principal").notNull().default(false),
    automatizacionBaseIdQlik: text("automatizacion_base_id_qlik"),
    automatizacionBaseNombre: text("automatizacion_base_nombre"),
    automatizacionPlantillaModo1IdQlik: text(
      "automatizacion_plantilla_modo_1_id_qlik",
    ),
    automatizacionPlantillaModo1Nombre: text(
      "automatizacion_plantilla_modo_1_nombre",
    ),
    automatizacionPlantillaModo2IdQlik: text(
      "automatizacion_plantilla_modo_2_id_qlik",
    ),
    automatizacionPlantillaModo2Nombre: text(
      "automatizacion_plantilla_modo_2_nombre",
    ),
    destinoApiUrl: text("destino_api_url"),
    destinoApiKeyCifrada: text("destino_api_key_cifrada"),
    destinoBaseDatos: text("destino_base_datos"),
    impalaHost: text("impala_host"),
    impalaPort: integer("impala_port"),
    impalaAuthMechanism: text("impala_auth_mechanism"),
    impalaUser: text("impala_user"),
    impalaPasswordCifrada: text("impala_password_cifrada"),
    impalaDatabase: text("impala_database"),
    creadoEn: timestamp("creado_en").notNull().defaultNow(),
    actualizadoEn: timestamp("actualizado_en").notNull().defaultNow(),
  },
  (t) => ({
    uqTenantId: unique("tenants_tenant_id_unique").on(t.tenantIdQlik),
    uqHost: unique("tenants_host_unique").on(t.host),
    uqPrincipalPorOrganizacion: uniqueIndex(
      "uq_tenant_principal_por_organizacion",
    )
      .on(t.organizacionId)
      .where(sql`${t.esPrincipal} = true`),
    ckEstado: check(
      "tenants_estado_check",
      sql`${t.estado} IN ('activo', 'desconectado', 'suspendido')`,
    ),
  }),
);
export const configuracionesOauthQlik = pgTable(
  "configuraciones_oauth_qlik",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantQlikId: uuid("tenant_qlik_id")
      .notNull()
      .references(() => tenantsQlik.id, { onDelete: "cascade" }),
    clienteId: text("cliente_id").notNull(),
    clienteSecretoCifrado: text("cliente_secreto_cifrado").notNull(),
    secretoSufijo: text("secreto_sufijo").notNull(),
    scopes: text("scopes").array().notNull().default([]),
    estado: text("estado").notNull().default("pendiente"),
    verificadaEn: timestamp("verificada_en"),
    ultimoError: text("ultimo_error"),
    creadoPorUsuarioId: uuid("creado_por_usuario_id").references(
      () => usuarios.id,
      { onDelete: "set null" },
    ),
    actualizadoPorUsuarioId: uuid("actualizado_por_usuario_id").references(
      () => usuarios.id,
      { onDelete: "set null" },
    ),
    creadoEn: timestamp("creado_en").notNull().defaultNow(),
    actualizadoEn: timestamp("actualizado_en").notNull().defaultNow(),
  },
  (t) => ({
    uqTenant: uniqueIndex("uq_configuracion_oauth_por_tenant").on(
      t.tenantQlikId,
    ),
    ckEstado: check(
      "configuraciones_oauth_estado_check",
      sql`${t.estado} IN ('pendiente', 'verificada', 'error', 'desactivada')`,
    ),
  }),
);
export const identidadesQlik = pgTable(
  "identidades_qlik",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    usuarioId: uuid("usuario_id")
      .notNull()
      .references(() => usuarios.id, { onDelete: "cascade" }),
    tenantQlikId: uuid("tenant_qlik_id")
      .notNull()
      .references(() => tenantsQlik.id, { onDelete: "cascade" }),
    usuarioIdQlik: text("usuario_id_qlik").notNull(),
    sujetoQlik: text("sujeto_qlik"),
    nombreQlik: text("nombre_qlik"),
    correoQlik: text("correo_qlik"),
    avatarQlik: text("avatar_qlik"),
    estadoQlik: text("estado_qlik"),
    sincronizadoEn: timestamp("sincronizado_en").notNull().defaultNow(),
    creadoEn: timestamp("creado_en").notNull().defaultNow(),
    actualizadoEn: timestamp("actualizado_en").notNull().defaultNow(),
  },
  (t) => ({
    uqIdentidad: unique("identidades_unique").on(
      t.tenantQlikId,
      t.usuarioIdQlik,
    ),
  }),
);
export const credencialesQlik = pgTable(
  "credenciales_qlik",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    identidadQlikId: uuid("identidad_qlik_id")
      .notNull()
      .unique()
      .references(() => identidadesQlik.id, { onDelete: "cascade" }),
    tokenAccesoCifrado: text("token_acceso_cifrado").notNull(),
    tokenRefrescoCifrado: text("token_refresco_cifrado"),
    scopes: text("scopes").array().notNull().default([]),
    tokenExpiraEn: timestamp("token_expira_en").notNull(),
    estado: text("estado").notNull().default("activa"),
    version: integer("version").notNull().default(1),
    actualizadoEn: timestamp("actualizado_en").notNull().defaultNow(),
  },
  (t) => ({
    ckEstado: check(
      "credenciales_estado_check",
      sql`${t.estado} IN ('activa', 'expirada', 'revocada', 'requiere_reconexion')`,
    ),
  }),
);
export const sesionesUsuario = pgTable(
  "sesiones_usuario",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    usuarioId: uuid("usuario_id")
      .notNull()
      .references(() => usuarios.id, { onDelete: "cascade" }),
    identidadQlikId: uuid("identidad_qlik_id")
      .notNull()
      .references(() => identidadesQlik.id, { onDelete: "cascade" }),
    tenantQlikActivoId: uuid("tenant_qlik_activo_id")
      .notNull()
      .references(() => tenantsQlik.id, { onDelete: "cascade" }),
    tokenSesionHash: text("token_sesion_hash").notNull().unique(),
    ipCreacion: text("ip_creacion"),
    agenteUsuario: text("agente_usuario"),
    expiraEn: timestamp("expira_en").notNull(),
    revocadaEn: timestamp("revocada_en"),
    creadaEn: timestamp("creada_en").notNull().defaultNow(),
  },
  (t) => ({
    idxUsuario: index("idx_sesiones_usuario_usuario").on(t.usuarioId),
    idxExpira: index("idx_sesiones_usuario_expira").on(t.expiraEn),
  }),
);
export const intentosOauthQlik = pgTable(
  "intentos_oauth_qlik",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    hostTenant: text("host_tenant").notNull(),
    hashEstado: text("hash_estado").notNull().unique(),
    verificadorPkceCifrado: text("verificador_pkce_cifrado").notNull(),
    rutaRetorno: text("ruta_retorno").notNull().default("/"),
    expiraEn: timestamp("expira_en").notNull(),
    consumidoEn: timestamp("consumido_en"),
    creadoEn: timestamp("creado_en").notNull().defaultNow(),
  },
  (t) => ({
    idxExpira: index("idx_intentos_oauth_expira").on(t.expiraEn),
  }),
);
