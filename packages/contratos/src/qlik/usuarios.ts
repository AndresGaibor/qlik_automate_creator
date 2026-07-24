import { z } from "zod";
import { esquemaConsultaBaseQlik } from "./comunes.js";

export const esquemaConsultaUsuarios = esquemaConsultaBaseQlik
  .extend({
    limit: z.coerce.number().int().min(1).max(100).optional(),
    fields: z.string().max(1000).optional(),
    tenantId: z.string().max(256).optional(),
    totalResults: z.union([z.boolean(), z.enum(["true", "false"])]).optional(),
  })
  .passthrough();

export const esquemaCrearUsuarioQlik = z
  .object({
    subject: z.string().trim().min(1),
    name: z.string().optional(),
    email: z.string().email().optional(),
    status: z.literal("invited").optional(),
    tenantId: z.string().trim().min(1).optional(),
    assignedRoles: z.array(z.record(z.string(), z.unknown())).optional(),
  })
  .passthrough();

export const esquemaActualizarUsuarioQlik = z
  .array(
    z
      .object({
        op: z.enum(["replace", "set", "unset", "add", "renew", "remove-value"]),
        path: z.string().trim().regex(/^\//, "La ruta debe ser JSON Pointer"),
        value: z.unknown(),
      })
      .passthrough(),
  )
  .min(1);

export const esquemaFiltrarUsuariosQlik = z
  .object({
    filter: z.string().max(8000),
  })
  .passthrough();

export const esquemaInvitarUsuariosQlik = z
  .object({
    invitees: z
      .array(
        z
          .object({
            email: z.string().email(),
            name: z.string().trim().min(1).optional(),
          })
          .passthrough(),
      )
      .min(1),
  })
  .passthrough();
