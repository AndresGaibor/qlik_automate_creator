import { z } from "zod";

export const esquemaTenantResumen = z.object({
  id: z.string(),
  nombre: z.string(),
  slug: z.string(),
  estado: z.string(),
  cantidadUsuarios: z.number(),
  creadoEn: z.string(),
});

export const esquemaUsuarioTenant = z.object({
  id: z.string(),
  correo: z.string().nullable(),
  nombre: z.string(),
  rol: z.enum(["admin", "usuario"]),
});

export const esquemaDetalleTenant = z.object({
  id: z.string(),
  nombre: z.string(),
  slug: z.string(),
  estado: z.string(),
  creadoEn: z.string(),
  usuarios: z.array(esquemaUsuarioTenant),
});

export const esquemaCrearTenant = z.object({
  nombre: z.string().min(1).max(255),
});

export const esquemaActualizarTenant = z.object({
  nombre: z.string().min(1).max(255).optional(),
  estado: z.enum(["activa", "suspendida"]).optional(),
});

export const esquemaAgregarUsuario = z.object({
  correo: z.string().email(),
  rol: z.enum(["admin", "usuario"]),
});

export const esquemaActualizarUsuario = z.object({
  rol: z.enum(["admin", "usuario"]),
});

export type TenantResumen = z.infer<typeof esquemaTenantResumen>;
export type UsuarioTenant = z.infer<typeof esquemaUsuarioTenant>;
export type DetalleTenant = z.infer<typeof esquemaDetalleTenant>;
export type CrearTenant = z.infer<typeof esquemaCrearTenant>;
export type ActualizarTenant = z.infer<typeof esquemaActualizarTenant>;
export type AgregarUsuario = z.infer<typeof esquemaAgregarUsuario>;
export type ActualizarUsuario = z.infer<typeof esquemaActualizarUsuario>;
