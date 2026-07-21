import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  jsonb,
  integer,
  check,
  unique,
  index,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const organizaciones = pgTable(
  'organizaciones',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    nombre: text('nombre').notNull(),
    estado: text('estado').notNull().default('activa'),
  },
  (t) => ({
    ckEstado: check(
      'organizaciones_estado_check',
      sql`${t.estado} IN ('activa', 'suspendida')`
    ),
  })
);

export const usuarios = pgTable(
  'usuarios',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    nombre: text('nombre').notNull(),
    correo: text('correo'),
    avatarUrl: text('avatar_url'),
    estado: text('estado').notNull().default('activo'),
    ultimoAccesoEn: timestamp('ultimo_acceso_en'),
    creadoEn: timestamp('creado_en').notNull().defaultNow(),
    actualizadoEn: timestamp('actualizado_en').notNull().defaultNow(),
  },
  (t) => ({
    ckEstado: check(
      'usuarios_estado_check',
      sql`${t.estado} IN ('activo', 'suspendido')`
    ),
  })
);

export const membresiasOrganizacion = pgTable(
  'membresias_organizacion',
  {
    organizacionId: uuid('organizacion_id')
      .notNull()
      .references(() => organizaciones.id, { onDelete: 'cascade' }),
    usuarioId: uuid('usuario_id')
      .notNull()
      .references(() => usuarios.id, { onDelete: 'cascade' }),
    rol: text('rol').notNull().default('usuario'),
    creadoEn: timestamp('creado_en').notNull().defaultNow(),
  },
  (t) => ({
    pk: unique('membresias_pk').on(t.organizacionId, t.usuarioId),
    ckRol: check(
      'membresias_rol_check',
      sql`${t.rol} IN ('administrador', 'editor', 'usuario', 'auditor')`
    ),
  })
);

export const tenantsQlik = pgTable(
  'tenants_qlik',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizacionId: uuid('organizacion_id')
      .notNull()
      .references(() => organizaciones.id, { onDelete: 'cascade' }),
    tenantIdQlik: text('tenant_id_qlik').notNull(),
    host: text('host').notNull(),
    nombre: text('nombre'),
    estado: text('estado').notNull().default('activo'),
    creadoEn: timestamp('creado_en').notNull().defaultNow(),
    actualizadoEn: timestamp('actualizado_en').notNull().defaultNow(),
  },
  (t) => ({
    uqTenantId: unique('tenants_tenant_id_unique').on(t.tenantIdQlik),
    uqHost: unique('tenants_host_unique').on(t.host),
    ckEstado: check(
      'tenants_estado_check',
      sql`${t.estado} IN ('activo', 'desconectado', 'suspendido')`
    ),
  })
);

export const identidadesQlik = pgTable(
  'identidades_qlik',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    usuarioId: uuid('usuario_id')
      .notNull()
      .references(() => usuarios.id, { onDelete: 'cascade' }),
    tenantQlikId: uuid('tenant_qlik_id')
      .notNull()
      .references(() => tenantsQlik.id, { onDelete: 'cascade' }),
    usuarioIdQlik: text('usuario_id_qlik').notNull(),
    sujetoQlik: text('sujeto_qlik'),
    nombreQlik: text('nombre_qlik'),
    correoQlik: text('correo_qlik'),
    avatarQlik: text('avatar_qlik'),
    estadoQlik: text('estado_qlik'),
    sincronizadoEn: timestamp('sincronizado_en').notNull().defaultNow(),
    creadoEn: timestamp('creado_en').notNull().defaultNow(),
    actualizadoEn: timestamp('actualizado_en').notNull().defaultNow(),
  },
  (t) => ({
    uqIdentidad: unique('identidades_unique').on(
      t.tenantQlikId,
      t.usuarioIdQlik
    ),
  })
);

export const credencialesQlik = pgTable(
  'credenciales_qlik',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    identidadQlikId: uuid('identidad_qlik_id')
      .notNull()
      .unique()
      .references(() => identidadesQlik.id, { onDelete: 'cascade' }),
    tokenAccesoCifrado: text('token_acceso_cifrado').notNull(),
    tokenRefrescoCifrado: text('token_refresco_cifrado'),
    scopes: text('scopes').array().notNull().default([]),
    tokenExpiraEn: timestamp('token_expira_en').notNull(),
    estado: text('estado').notNull().default('activa'),
    version: integer('version').notNull().default(1),
    actualizadoEn: timestamp('actualizado_en').notNull().defaultNow(),
  },
  (t) => ({
    ckEstado: check(
      'credenciales_estado_check',
      sql`${t.estado} IN ('activa', 'expirada', 'revocada', 'requiere_reconexion')`
    ),
  })
);

export const sesionesUsuario = pgTable(
  'sesiones_usuario',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    usuarioId: uuid('usuario_id')
      .notNull()
      .references(() => usuarios.id, { onDelete: 'cascade' }),
    identidadQlikId: uuid('identidad_qlik_id')
      .notNull()
      .references(() => identidadesQlik.id, { onDelete: 'cascade' }),
    tokenSesionHash: text('token_sesion_hash').notNull().unique(),
    ipCreacion: text('ip_creacion'),
    agenteUsuario: text('agente_usuario'),
    expiraEn: timestamp('expira_en').notNull(),
    revocadaEn: timestamp('revocada_en'),
    creadaEn: timestamp('creada_en').notNull().defaultNow(),
  },
  (t) => ({
    idxUsuario: index('idx_sesiones_usuario_usuario').on(t.usuarioId),
    idxExpira: index('idx_sesiones_usuario_expira').on(t.expiraEn),
  })
);

export const intentosOauthQlik = pgTable(
  'intentos_oauth_qlik',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    hostTenant: text('host_tenant').notNull(),
    hashEstado: text('hash_estado').notNull().unique(),
    verificadorPkceCifrado: text('verificador_pkce_cifrado').notNull(),
    rutaRetorno: text('ruta_retorno').notNull().default('/'),
    expiraEn: timestamp('expira_en').notNull(),
    consumidoEn: timestamp('consumido_en'),
    creadoEn: timestamp('creado_en').notNull().defaultNow(),
  },
  (t) => ({
    idxExpira: index('idx_intentos_oauth_expira').on(t.expiraEn),
  })
);

export const destinosCache = pgTable(
  'destinos_cache',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizacionId: uuid('organizacion_id')
      .notNull()
      .references(() => organizaciones.id, { onDelete: 'cascade' }),
    proveedor: text('proveedor').notNull(),
    idExterno: text('id_externo').notNull(),
    conexionExternaId: text('conexion_externa_id'),
    nombreConexion: text('nombre_conexion'),
    baseDatos: text('base_datos'),
    esquema: text('esquema'),
    tabla: text('tabla').notNull(),
    nombreMostrado: text('nombre_mostrado').notNull(),
    metadatos: jsonb('metadatos').notNull().default({}),
    hashContenido: text('hash_contenido'),
    activo: boolean('activo').notNull().default(true),
    sincronizadoEn: timestamp('sincronizado_en').notNull().defaultNow(),
    expiraCacheEn: timestamp('expira_cache_en'),
  },
  (t) => ({
    uqDestino: unique('destinos_unique').on(
      t.organizacionId,
      t.proveedor,
      t.idExterno
    ),
  })
);

export const configuracionesAutomatizacion = pgTable(
  'configuraciones_automatizacion',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizacionId: uuid('organizacion_id')
      .notNull()
      .references(() => organizaciones.id, { onDelete: 'cascade' }),
    tenantQlikId: uuid('tenant_qlik_id')
      .notNull()
      .references(() => tenantsQlik.id, { onDelete: 'cascade' }),
    creadoPorUsuarioId: uuid('creado_por_usuario_id')
      .notNull()
      .references(() => usuarios.id),
    nombre: text('nombre').notNull(),
    flujoIdQlik: text('flujo_id_qlik').notNull(),
    flujoNombreSnapshot: text('flujo_nombre_snapshot').notNull(),
    flujoEspacioIdQlik: text('flujo_espacio_id_qlik'),
    destinoProveedor: text('destino_proveedor').notNull(),
    destinoIdExterno: text('destino_id_externo').notNull(),
    destinoNombreSnapshot: text('destino_nombre_snapshot').notNull(),
    automatizacionIdQlik: text('automatizacion_id_qlik'),
    automatizacionNombreSnapshot: text('automatizacion_nombre_snapshot'),
    programar: boolean('programar').notNull().default(false),
    estado: text('estado').notNull().default('pendiente'),
    mensajeError: text('mensaje_error'),
    claveIdempotencia: text('clave_idempotencia').unique(),
    creadoEn: timestamp('creado_en').notNull().defaultNow(),
    actualizadoEn: timestamp('actualizado_en').notNull().defaultNow(),
  },
  (t) => ({
    idxTenant: index('idx_configuraciones_tenant').on(t.tenantQlikId),
    idxFlujo: index('idx_configuraciones_flujo').on(
      t.tenantQlikId,
      t.flujoIdQlik
    ),
    idxAutomatizacion: index('idx_configuraciones_automatizacion').on(
      t.tenantQlikId,
      t.automatizacionIdQlik
    ),
    ckEstado: check(
      'configuraciones_estado_check',
      sql`${t.estado} IN ('pendiente', 'creando', 'activa', 'error', 'desactivada', 'eliminada')`
    ),
  })
);

export const programacionesAutomatizacion = pgTable(
  'programaciones_automatizacion',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    configuracionId: uuid('configuracion_id')
      .notNull()
      .unique()
      .references(() => configuracionesAutomatizacion.id, {
        onDelete: 'cascade',
      }),
    tipo: text('tipo').notNull(),
    expresionCron: text('expresion_cron'),
    zonaHoraria: text('zona_horaria').notNull().default('America/Guayaquil'),
    programacionIdQlik: text('programacion_id_qlik'),
    activa: boolean('activa').notNull().default(true),
    proximaEjecucionEn: timestamp('proxima_ejecucion_en'),
    ultimaEjecucionEn: timestamp('ultima_ejecucion_en'),
    creadoEn: timestamp('creado_en').notNull().defaultNow(),
    actualizadoEn: timestamp('actualizado_en').notNull().defaultNow(),
  },
  (t) => ({
    ckTipo: check(
      'programaciones_tipo_check',
      sql`${t.tipo} IN ('manual', 'intervalo', 'cron', 'qlik')`
    ),
  })
);

export const auditoriaEventos = pgTable(
  'auditoria_eventos',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizacionId: uuid('organizacion_id').references(
      () => organizaciones.id,
      { onDelete: 'set null' }
    ),
    usuarioId: uuid('usuario_id').references(() => usuarios.id, {
      onDelete: 'set null',
    }),
    accion: text('accion').notNull(),
    entidadTipo: text('entidad_tipo'),
    entidadId: text('entidad_id'),
    resultado: text('resultado').notNull(),
    datosAnteriores: jsonb('datos_anteriores'),
    datosNuevos: jsonb('datos_nuevos'),
    codigoError: text('codigo_error'),
    mensajeError: text('mensaje_error'),
    ip: text('ip'),
    agenteUsuario: text('agente_usuario'),
    idSolicitud: text('id_solicitud'),
    creadoEn: timestamp('creado_en').notNull().defaultNow(),
  },
  (t) => ({
    idxOrgFecha: index('idx_auditoria_org_fecha').on(
      t.organizacionId,
      t.creadoEn
    ),
    idxUsuarioFecha: index('idx_auditoria_usuario_fecha').on(
      t.usuarioId,
      t.creadoEn
    ),
    ckResultado: check(
      'auditoria_resultado_check',
      sql`${t.resultado} IN ('exito', 'error', 'denegado')`
    ),
  })
);

export const espaciosQlikCache = pgTable(
  'espacios_qlik_cache',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantQlikId: uuid('tenant_qlik_id')
      .notNull()
      .references(() => tenantsQlik.id, { onDelete: 'cascade' }),
    espacioIdQlik: text('espacio_id_qlik').notNull(),
    nombre: text('nombre').notNull(),
    tipo: text('tipo'),
    propietarioIdQlik: text('propietario_id_qlik'),
    metadatos: jsonb('metadatos').notNull().default({}),
    modificadoEnQlik: timestamp('modificado_en_qlik'),
    sincronizadoEn: timestamp('sincronizado_en').notNull().defaultNow(),
    eliminadoEn: timestamp('eliminado_en'),
  },
  (t) => ({
    uqEspacio: unique('espacios_unique').on(t.tenantQlikId, t.espacioIdQlik),
  })
);

export const flujosQlikCache = pgTable(
  'flujos_qlik_cache',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantQlikId: uuid('tenant_qlik_id')
      .notNull()
      .references(() => tenantsQlik.id, { onDelete: 'cascade' }),
    flujoIdQlik: text('flujo_id_qlik').notNull(),
    espacioIdQlik: text('espacio_id_qlik'),
    nombre: text('nombre').notNull(),
    propietarioIdQlik: text('propietario_id_qlik'),
    urlQlik: text('url_qlik'),
    tipoRecurso: text('tipo_recurso'),
    metadatos: jsonb('metadatos').notNull().default({}),
    modificadoEnQlik: timestamp('modificado_en_qlik'),
    sincronizadoEn: timestamp('sincronizado_en').notNull().defaultNow(),
    eliminadoEn: timestamp('eliminado_en'),
  },
  (t) => ({
    uqFlujo: unique('flujos_unique').on(t.tenantQlikId, t.flujoIdQlik),
  })
);

export const automatizacionesQlikCache = pgTable(
  'automatizaciones_qlik_cache',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantQlikId: uuid('tenant_qlik_id')
      .notNull()
      .references(() => tenantsQlik.id, { onDelete: 'cascade' }),
    automatizacionIdQlik: text('automatizacion_id_qlik').notNull(),
    espacioIdQlik: text('espacio_id_qlik'),
    propietarioIdQlik: text('propietario_id_qlik'),
    nombre: text('nombre').notNull(),
    estado: text('estado'),
    modoEjecucion: text('modo_ejecucion'),
    ultimoEstadoEjecucion: text('ultimo_estado_ejecucion'),
    ultimaEjecucionEn: timestamp('ultima_ejecucion_en'),
    creadaEnQlik: timestamp('creada_en_qlik'),
    modificadaEnQlik: timestamp('modificada_en_qlik'),
    metadatos: jsonb('metadatos').notNull().default({}),
    sincronizadoEn: timestamp('sincronizado_en').notNull().defaultNow(),
    eliminadoEn: timestamp('eliminado_en'),
  },
  (t) => ({
    uqAutomatizacion: unique('automatizaciones_unique').on(
      t.tenantQlikId,
      t.automatizacionIdQlik
    ),
  })
);
