import {
  boolean,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { tenantsQlik, usuarios } from "./identidad.js";

export const configuracionEspaciosVisibles = pgTable(
  "configuracion_espacios_visibles",
  {
    tenantQlikId: uuid("tenant_qlik_id")
      .primaryKey()
      .references(() => tenantsQlik.id, { onDelete: "cascade" }),
    permitirRecursosSinEspacio: boolean("permitir_recursos_sin_espacio")
      .notNull()
      .default(false),
    actualizadoEn: timestamp("actualizado_en").notNull().defaultNow(),
    actualizadoPorUsuarioId: uuid("actualizado_por_usuario_id").references(
      () => usuarios.id,
      { onDelete: "set null" },
    ),
  },
);
export const espaciosVisiblesUsuarioFinal = pgTable(
  "espacios_visibles_usuario_final",
  {
    tenantQlikId: uuid("tenant_qlik_id")
      .notNull()
      .references(() => tenantsQlik.id, { onDelete: "cascade" }),
    espacioIdQlik: text("espacio_id_qlik").notNull(),
    creadoEn: timestamp("creado_en").notNull().defaultNow(),
  },
  (t) => ({
    uqEspacioVisible: unique("espacios_visibles_usuario_final_unique").on(
      t.tenantQlikId,
      t.espacioIdQlik,
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
