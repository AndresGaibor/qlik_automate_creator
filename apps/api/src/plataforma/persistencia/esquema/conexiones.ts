import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { organizaciones, tenantsQlik } from "./identidad.js";

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
    probadaEn: timestamp("probada_en"),
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
export const secretosConexionDestino = pgTable(
  "secretos_conexion_destino",
  {
    conexionDestinoId: uuid("conexion_destino_id")
      .notNull()
      .references(() => conexionesDestino.id, { onDelete: "cascade" }),
    nombre: text("nombre").notNull(),
    valorCifrado: text("valor_cifrado").notNull(),
    creadoEn: timestamp("creado_en").notNull().defaultNow(),
    actualizadoEn: timestamp("actualizado_en").notNull().defaultNow(),
  },
  (t) => ({
    uqNombre: unique("uq_secreto_conexion_destino_nombre").on(
      t.conexionDestinoId,
      t.nombre,
    ),
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
    estado: text("estado").notNull().default("sin_probar"),
    probadaEn: timestamp("probada_en"),
    mensajeError: text("mensaje_error"),
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
export const secretosConexionOrigen = pgTable(
  "secretos_conexion_origen",
  {
    conexionOrigenId: uuid("conexion_origen_id")
      .notNull()
      .references(() => conexionesOrigen.id, { onDelete: "cascade" }),
    nombre: text("nombre").notNull(),
    valorCifrado: text("valor_cifrado").notNull(),
    creadoEn: timestamp("creado_en").notNull().defaultNow(),
    actualizadoEn: timestamp("actualizado_en").notNull().defaultNow(),
  },
  (t) => ({
    uqConexionNombre: uniqueIndex("uq_secreto_conexion_origen_nombre").on(
      t.conexionOrigenId,
      t.nombre,
    ),
  }),
);
