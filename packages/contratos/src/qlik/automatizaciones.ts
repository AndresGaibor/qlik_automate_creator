import { z } from "zod";
import {
  esquemaBooleanoConsulta,
  esquemaConsultaBaseQlik,
  esquemaIdQlik,
} from "./comunes.js";

const ordenAutomatizaciones = [
  "id",
  "name",
  "runMode",
  "state",
  "createdAt",
  "updatedAt",
  "lastRunAt",
  "lastRunStatus",
  "maxConcurrentRuns",
] as const;

const ordenConPrefijo = ordenAutomatizaciones.flatMap((campo) => [
  campo,
  `+${campo}`,
  `-${campo}`,
]);

export const esquemaConsultaAutomatizaciones = esquemaConsultaBaseQlik.extend({
  listAll: esquemaBooleanoConsulta,
  sort: z.enum(ordenConPrefijo as [string, ...string[]]).optional(),
});

export const esquemaCrearAutomatizacionQlik = z
  .object({
    name: z.string().trim().min(1).max(255),
    spaceId: esquemaIdQlik.optional(),
    schedules: z.array(z.record(z.string(), z.unknown())).optional(),
    workspace: z.record(z.string(), z.unknown()).optional(),
    description: z.string().max(4000).optional(),
    maxConcurrentRuns: z.number().int().min(1).optional(),
  })
  .passthrough();

export const esquemaActualizarAutomatizacionQlik =
  esquemaCrearAutomatizacionQlik
    .omit({ spaceId: true })
    .partial()
    .passthrough();

export const esquemaCambiarPropietarioQlik = z.object({
  userId: esquemaIdQlik,
});

export const esquemaCambiarEspacioAutomatizacionQlik = z.object({
  spaceId: esquemaIdQlik,
});

export const esquemaCopiarAutomatizacionQlik = z.object({
  name: z.string().trim().min(1).max(255),
});

export const esquemaCrearEjecucionQlik = z.object({
  context: z.literal("api").default("api"),
});

export const esquemaConsultaEjecuciones = esquemaConsultaBaseQlik.extend({
  sort: z
    .enum([
      "id",
      "status",
      "startTime",
      "+id",
      "+status",
      "+startTime",
      "-id",
      "-status",
      "-startTime",
    ])
    .optional(),
});

export const esquemaConfiguracionAutomatizacionesQlik = z.record(
  z.string(),
  z.unknown(),
);
