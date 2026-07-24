import { z } from "zod";

export const esquemaTenantSesionDisponible = z.object({
  id: z.string(),
  host: z.string(),
  nombre: z.string().nullable(),
  organizacionId: z.string(),
  organizacionNombre: z.string(),
  esPrincipal: z.boolean(),
});

export const esquemaSesionPublica = z.object({
  tenantHost: z.string(),
  tenantActivoId: z.string(),
  tenantsDisponibles: z.array(esquemaTenantSesionDisponible),
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

export type TenantSesionDisponible = z.infer<
  typeof esquemaTenantSesionDisponible
>;
