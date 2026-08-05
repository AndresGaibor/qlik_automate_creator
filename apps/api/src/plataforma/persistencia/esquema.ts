import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
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

export const destinosCache = pgTable(
  "destinos_cache",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizacionId: uuid("organizacion_id")
      .notNull()
      .references(() => organizaciones.id, { onDelete: "cascade" }),
    proveedor: text("proveedor").notNull(),
    idExterno: text("id_externo").notNull(),
    conexionExternaId: text("conexion_externa_id"),
    nombreConexion: text("nombre_conexion"),
    baseDatos: text("base_datos"),
    esquema: text("esquema"),
    tabla: text("tabla").notNull(),
    nombreMostrado: text("nombre_mostrado").notNull(),
    metadatos: jsonb("metadatos").notNull().default({}),
    hashContenido: text("hash_contenido"),
    activo: boolean("activo").notNull().default(true),
    sincronizadoEn: timestamp("sincronizado_en").notNull().defaultNow(),
    expiraCacheEn: timestamp("expira_cache_en"),
  },
  (t) => ({
    uqDestino: unique("destinos_unique").on(
      t.organizacionId,
      t.proveedor,
      t.idExterno,
    ),
  }),
);

export const configuracionesAutomatizacion = pgTable(
  "configuraciones_automatizacion",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizacionId: uuid("organizacion_id")
      .notNull()
      .references(() => organizaciones.id, { onDelete: "cascade" }),
    tenantQlikId: uuid("tenant_qlik_id")
      .notNull()
      .references(() => tenantsQlik.id, { onDelete: "cascade" }),
    creadoPorUsuarioId: uuid("creado_por_usuario_id")
      .notNull()
      .references(() => usuarios.id),
    nombre: text("nombre").notNull(),
    flujoIdQlik: text("flujo_id_qlik").notNull(),
    flujoNombreSnapshot: text("flujo_nombre_snapshot").notNull(),
    flujoEspacioIdQlik: text("flujo_espacio_id_qlik"),
    destinoProveedor: text("destino_proveedor").notNull(),
    destinoIdExterno: text("destino_id_externo").notNull(),
    destinoNombreSnapshot: text("destino_nombre_snapshot").notNull(),
    automatizacionIdQlik: text("automatizacion_id_qlik"),
    automatizacionNombreSnapshot: text("automatizacion_nombre_snapshot"),
    programar: boolean("programar").notNull().default(false),
    estado: text("estado").notNull().default("pendiente"),
    mensajeError: text("mensaje_error"),
    claveIdempotencia: text("clave_idempotencia").unique(),
    creadoEn: timestamp("creado_en").notNull().defaultNow(),
    actualizadoEn: timestamp("actualizado_en").notNull().defaultNow(),
  },
  (t) => ({
    idxTenant: index("idx_configuraciones_tenant").on(t.tenantQlikId),
    idxFlujo: index("idx_configuraciones_flujo").on(
      t.tenantQlikId,
      t.flujoIdQlik,
    ),
    idxAutomatizacion: index("idx_configuraciones_automatizacion").on(
      t.tenantQlikId,
      t.automatizacionIdQlik,
    ),
    ckEstado: check(
      "configuraciones_estado_check",
      sql`${t.estado} IN ('pendiente', 'creando', 'activa', 'error', 'desactivada', 'eliminada')`,
    ),
  }),
);

export const programacionesAutomatizacion = pgTable(
  "programaciones_automatizacion",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    configuracionId: uuid("configuracion_id")
      .notNull()
      .unique()
      .references(() => configuracionesAutomatizacion.id, {
        onDelete: "cascade",
      }),
    tipo: text("tipo").notNull(),
    expresionCron: text("expresion_cron"),
    zonaHoraria: text("zona_horaria").notNull().default("America/Guayaquil"),
    programacionIdQlik: text("programacion_id_qlik"),
    activa: boolean("activa").notNull().default(true),
    proximaEjecucionEn: timestamp("proxima_ejecucion_en"),
    ultimaEjecucionEn: timestamp("ultima_ejecucion_en"),
    creadoEn: timestamp("creado_en").notNull().defaultNow(),
    actualizadoEn: timestamp("actualizado_en").notNull().defaultNow(),
  },
  (t) => ({
    ckTipo: check(
      "programaciones_tipo_check",
      sql`${t.tipo} IN ('manual', 'intervalo', 'cron', 'qlik')`,
    ),
  }),
);

export const auditoriaEventos = pgTable(
  "auditoria_eventos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizacionId: uuid("organizacion_id").references(
      () => organizaciones.id,
      { onDelete: "set null" },
    ),
    usuarioId: uuid("usuario_id").references(() => usuarios.id, {
      onDelete: "set null",
    }),
    accion: text("accion").notNull(),
    entidadTipo: text("entidad_tipo"),
    entidadId: text("entidad_id"),
    resultado: text("resultado").notNull(),
    datosAnteriores: jsonb("datos_anteriores"),
    datosNuevos: jsonb("datos_nuevos"),
    codigoError: text("codigo_error"),
    mensajeError: text("mensaje_error"),
    ip: text("ip"),
    agenteUsuario: text("agente_usuario"),
    idSolicitud: text("id_solicitud"),
    creadoEn: timestamp("creado_en").notNull().defaultNow(),
  },
  (t) => ({
    idxOrgFecha: index("idx_auditoria_org_fecha").on(
      t.organizacionId,
      t.creadoEn,
    ),
    idxUsuarioFecha: index("idx_auditoria_usuario_fecha").on(
      t.usuarioId,
      t.creadoEn,
    ),
    ckResultado: check(
      "auditoria_resultado_check",
      sql`${t.resultado} IN ('exito', 'error', 'denegado')`,
    ),
  }),
);

export const espaciosQlikCache = pgTable(
  "espacios_qlik_cache",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantQlikId: uuid("tenant_qlik_id")
      .notNull()
      .references(() => tenantsQlik.id, { onDelete: "cascade" }),
    espacioIdQlik: text("espacio_id_qlik").notNull(),
    nombre: text("nombre").notNull(),
    tipo: text("tipo"),
    propietarioIdQlik: text("propietario_id_qlik"),
    metadatos: jsonb("metadatos").notNull().default({}),
    modificadoEnQlik: timestamp("modificado_en_qlik"),
    sincronizadoEn: timestamp("sincronizado_en").notNull().defaultNow(),
    eliminadoEn: timestamp("eliminado_en"),
  },
  (t) => ({
    uqEspacio: unique("espacios_unique").on(t.tenantQlikId, t.espacioIdQlik),
  }),
);

export const flujosQlikCache = pgTable(
  "flujos_qlik_cache",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantQlikId: uuid("tenant_qlik_id")
      .notNull()
      .references(() => tenantsQlik.id, { onDelete: "cascade" }),
    flujoIdQlik: text("flujo_id_qlik").notNull(),
    espacioIdQlik: text("espacio_id_qlik"),
    nombre: text("nombre").notNull(),
    propietarioIdQlik: text("propietario_id_qlik"),
    urlQlik: text("url_qlik"),
    tipoRecurso: text("tipo_recurso"),
    metadatos: jsonb("metadatos").notNull().default({}),
    modificadoEnQlik: timestamp("modificado_en_qlik"),
    sincronizadoEn: timestamp("sincronizado_en").notNull().defaultNow(),
    eliminadoEn: timestamp("eliminado_en"),
  },
  (t) => ({
    uqFlujo: unique("flujos_unique").on(t.tenantQlikId, t.flujoIdQlik),
  }),
);

export const automatizacionesQlikCache = pgTable(
  "automatizaciones_qlik_cache",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantQlikId: uuid("tenant_qlik_id")
      .notNull()
      .references(() => tenantsQlik.id, { onDelete: "cascade" }),
    automatizacionIdQlik: text("automatizacion_id_qlik").notNull(),
    espacioIdQlik: text("espacio_id_qlik"),
    propietarioIdQlik: text("propietario_id_qlik"),
    nombre: text("nombre").notNull(),
    estado: text("estado"),
    modoEjecucion: text("modo_ejecucion"),
    ultimoEstadoEjecucion: text("ultimo_estado_ejecucion"),
    ultimaEjecucionEn: timestamp("ultima_ejecucion_en"),
    creadaEnQlik: timestamp("creada_en_qlik"),
    modificadaEnQlik: timestamp("modificada_en_qlik"),
    metadatos: jsonb("metadatos").notNull().default({}),
    sincronizadoEn: timestamp("sincronizado_en").notNull().defaultNow(),
    eliminadoEn: timestamp("eliminado_en"),
  },
  (t) => ({
    uqAutomatizacion: unique("automatizaciones_unique").on(
      t.tenantQlikId,
      t.automatizacionIdQlik,
    ),
  }),
);

export const appConfig = pgTable("app_config", {
  id: uuid("id").primaryKey().defaultRandom(),
  clave: text("clave").notNull().unique(),
  valor: jsonb("valor").notNull(),
  actualizadoEn: timestamp("actualizado_en").notNull().defaultNow(),
});

export const solicitudesIdempotentes = pgTable(
  "solicitudes_idempotentes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizacionId: uuid("organizacion_id")
      .notNull()
      .references(() => organizaciones.id, { onDelete: "cascade" }),
    alcance: text("alcance").notNull(),
    clave: text("clave").notNull(),
    hashSolicitud: text("hash_solicitud").notNull(),
    estado: text("estado").notNull().default("procesando"),
    estadoHttp: integer("estado_http"),
    respuesta: jsonb("respuesta"),
    expiraEn: timestamp("expira_en").notNull(),
    creadoEn: timestamp("creado_en").notNull().defaultNow(),
    actualizadoEn: timestamp("actualizado_en").notNull().defaultNow(),
  },
  (t) => ({
    uqClave: unique("solicitudes_idempotentes_unique").on(
      t.organizacionId,
      t.alcance,
      t.clave,
    ),
    idxExpira: index("idx_solicitudes_idempotentes_expira").on(t.expiraEn),
    ckEstado: check(
      "solicitudes_idempotentes_estado_check",
      sql`${t.estado} IN ('procesando', 'completada', 'fallida')`,
    ),
  }),
);

export const conexionesDestino = pgTable(
  "conexiones_destino",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizacionId: uuid("organizacion_id")
      .notNull()
      .references(() => organizaciones.id, { onDelete: "cascade" }),
    tenantQlikId: uuid("tenant_qlik_id").references(() => tenantsQlik.id, {
      onDelete: "set null",
    }),
    tipo: text("tipo").notNull(),
    nombre: text("nombre").notNull(),
    config: jsonb("config").notNull().default({}),
    secretoRefs: jsonb("secreto_refs").notNull().default({}),
    estado: text("estado").notNull().default("activo"),
    mensajeError: text("mensaje_error"),
    creadoEn: timestamp("creado_en").notNull().defaultNow(),
    actualizadoEn: timestamp("actualizado_en").notNull().defaultNow(),
  },
  (t) => ({
    uqNombrePorOrg: unique("uq_conexion_por_org_nombre").on(
      t.organizacionId,
      t.tipo,
      t.nombre,
    ),
    idxTipo: index("idx_conexiones_tipo").on(t.tipo),
    idxEstado: index("idx_conexiones_estado").on(t.estado),
  }),
);

export const conexionesOrigen = pgTable(
  "conexiones_origen",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    organizacionId: uuid("organizacion_id")
      .notNull()
      .references(() => organizaciones.id, { onDelete: "cascade" }),
    tipo: text("tipo").notNull(),
    nombre: text("nombre").notNull(),
    config: jsonb("config").notNull().default({}),
    creadoEn: timestamp("creado_en").notNull().defaultNow(),
    actualizadoEn: timestamp("actualizado_en").notNull().defaultNow(),
  },
  (t) => ({
    uqNombrePorOrg: unique("uq_conexion_origen_por_org_nombre").on(
      t.organizacionId,
      t.tipo,
      t.nombre,
    ),
    idxOrganizacion: index("idx_conexiones_origen_organizacion").on(
      t.organizacionId,
    ),
  }),
);

export const eventosOutbox = pgTable(
  "eventos_outbox",
  {
    id: uuid("id").primaryKey(),
    agregadoTipo: text("agregado_tipo").notNull(),
    agregadoId: text("agregado_id").notNull(),
    tipo: text("tipo").notNull(),
    version: integer("version").notNull().default(1),
    datos: jsonb("datos").notNull(),
    metadatos: jsonb("metadatos").notNull().default({}),
    ocurridoEn: timestamp("ocurrido_en").notNull(),
    publicadoEn: timestamp("publicado_en"),
    intentos: integer("intentos").notNull().default(0),
    ultimoError: text("ultimo_error"),
    creadoEn: timestamp("creado_en").notNull().defaultNow(),
  },
  (t) => ({
    idxPendientes: index("idx_eventos_outbox_pendientes").on(
      t.publicadoEn,
      t.ocurridoEn,
    ),
    idxAgregado: index("idx_eventos_outbox_agregado").on(
      t.agregadoTipo,
      t.agregadoId,
    ),
  }),
);
