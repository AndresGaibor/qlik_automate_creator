import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  jsonb,
  pgTable,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import { organizaciones, usuarios } from "./identidad.js";

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
export const configuracionesPlataforma = pgTable(
  "configuraciones_plataforma",
  {
    id: integer("id").primaryKey(),
    modoAutomatizacionActivo: smallint("modo_automatizacion_activo")
      .notNull()
      .default(1),
    actualizadoEn: timestamp("actualizado_en").notNull().defaultNow(),
    actualizadoPorUsuarioId: uuid("actualizado_por_usuario_id").references(
      () => usuarios.id,
      { onDelete: "set null" },
    ),
  },
  (t) => ({
    ckId: check("configuraciones_plataforma_id_check", sql`${t.id} = 1`),
    ckModo: check(
      "configuraciones_plataforma_modo_check",
      sql`${t.modoAutomatizacionActivo} IN (1, 2)`,
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
