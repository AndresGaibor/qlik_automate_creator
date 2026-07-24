import { z } from "zod";

export const esquemaSesionPublica = z.object({
  tenantHost: z.string(),
  usuario: z
    .object({
      id: z.string(),
      nombre: z.string(),
      correo: z.string().nullable(),
      avatarUrl: z.string().nullable(),
    })
    .nullable(),
  identidad: z
    .object({
      id: z.string(),
      nombreQlik: z.string().nullable(),
      correoQlik: z.string().nullable(),
    })
    .nullable(),
  esSuperadmin: z.boolean().default(false),
  membresias: z
    .array(
      z.object({
        organizacionId: z.string(),
        organizacionNombre: z.string(),
        rol: z.enum(["admin", "usuario"]),
      }),
    )
    .default([]),
});

export type SesionPublica = z.infer<typeof esquemaSesionPublica>;
