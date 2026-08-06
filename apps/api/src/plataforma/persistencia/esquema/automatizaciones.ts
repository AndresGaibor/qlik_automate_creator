import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { organizaciones, tenantsQlik, usuarios } from "./identidad.js";

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
