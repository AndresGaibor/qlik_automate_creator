import { z } from "zod";
import { esquemaConsultaBaseQlik, esquemaIdQlik } from "./comunes.js";

const esquemaRolEspacio = z.string().trim().min(1).max(128);
const esquemaNombreEspacio = z.string().trim().min(1).max(256);

export const esquemaConsultaEspacios = esquemaConsultaBaseQlik
  .omit({ cursor: true, filter: true })
  .extend({
    next: z.string().max(2048).optional(),
    prev: z.string().max(2048).optional(),
    name: z.string().max(256).optional(),
    ownerId: esquemaIdQlik.optional(),
    type: z.string().max(128).optional(),
    roles: z.string().max(1000).optional(),
    action: z.literal("publish").optional(),
    environmentId: esquemaIdQlik.optional(),
    "environment.name": z.string().max(256).optional(),
  })
  .passthrough();

export const esquemaCrearEspacioQlik = z
  .object({
    name: esquemaNombreEspacio,
    type: z.enum(["shared", "managed", "data"]),
    description: z.string().max(4000).optional(),
    ownerId: esquemaIdQlik.optional(),
  })
  .passthrough();

export const esquemaActualizarEspacioQlik = z
  .object({
    name: esquemaNombreEspacio.optional(),
    ownerId: esquemaIdQlik.optional(),
    description: z.string().max(4000).optional(),
  })
  .passthrough()
  .refine(
    (valor: Record<string, unknown>) => Object.keys(valor).length > 0,
    "Debe enviar al menos un cambio",
  );

export const esquemaParcheEspacioQlik = z
  .array(
    z.object({
      op: z.literal("replace"),
      path: z.enum(["/name", "/ownerId", "/description"]),
      value: z.string(),
    }),
  )
  .min(1);

export const esquemaCrearAsignacionEspacioQlik = z
  .object({
    type: z.enum(["user", "group", "bot"]),
    assigneeId: esquemaIdQlik,
    roles: z.array(esquemaRolEspacio).min(1),
  })
  .passthrough();

export const esquemaActualizarAsignacionEspacioQlik = z
  .object({
    roles: z.array(esquemaRolEspacio).min(1),
  })
  .passthrough();

export const esquemaCrearComparticionEspacioQlik = z
  .object({
    type: z.enum(["user", "group", "link"]),
    roles: z.array(z.enum(["consumer", "contributor", "basicconsumer"])).min(1),
    assigneeId: esquemaIdQlik,
    resourceId: esquemaIdQlik,
    resourceType: z.string().trim().min(1).max(128),
  })
  .passthrough();

export const esquemaParcheComparticionEspacioQlik = z
  .array(
    z.union([
      z.object({
        op: z.literal("replace"),
        path: z.literal("/roles"),
        value: z
          .array(z.enum(["consumer", "contributor", "basicconsumer"]))
          .min(1),
      }),
      z.object({
        op: z.literal("replace"),
        path: z.literal("/disabled"),
        value: z.boolean(),
      }),
    ]),
  )
  .min(1);
