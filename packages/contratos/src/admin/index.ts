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
  correo: z.string().min(3),
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

export const esquemaTenantQlik = z.object({
  id: z.string(),
  organizacionId: z.string(),
  tenantIdQlik: z.string(),
  host: z.string(),
  nombre: z.string().nullable(),
  estado: z.enum(["activo", "desconectado", "suspendido"]),
  esPrincipal: z.boolean(),
  automatizacionBaseIdQlik: z.string().nullable().optional(),
  automatizacionBaseNombre: z.string().nullable().optional(),
  destinoApiUrl: z.string().nullable().optional(),
  destinoApiKey: z.string().nullable().optional(),
  destinoBaseDatos: z.string().nullable().optional(),
  impalaHost: z.string().nullable().optional(),
  impalaPort: z.number().nullable().optional(),
  impalaAuthMechanism: z.string().nullable().optional(),
  impalaUser: z.string().nullable().optional(),
  impalaPassword: z.string().nullable().optional(),
  impalaDatabase: z.string().nullable().optional(),
  creadoEn: z.string(),
});

export const esquemaCrearTenantQlik = z.object({
  tenantIdQlik: z.string().min(1).max(255).optional(),
  host: z.string().min(1).max(255),
  nombre: z.string().min(1).max(255).optional(),
});

export const esquemaConfigurarAutomatizacionBase = z.object({
  automatizacionBaseIdQlik: z.string().min(1),
  automatizacionBaseNombre: z.string().optional(),
});

export const esquemaConfigurarDestinoTenant = z.object({
  destinoApiUrl: z.string().min(1),
  destinoApiKey: z.string().min(1),
  destinoBaseDatos: z.string().optional(),
});

export const esquemaConfigurarImpalaTenant = z.object({
  impalaHost: z.string().min(1),
  impalaPort: z.number().int().positive().default(21050),
  impalaAuthMechanism: z
    .enum(["NOSASL", "PLAIN", "LDAP", "KERBEROS"])
    .default("NOSASL"),
  impalaUser: z.string().optional(),
  impalaPassword: z.string().optional(),
  impalaDatabase: z.string().default("default"),
});

export type TenantQlik = z.infer<typeof esquemaTenantQlik>;
export type CrearTenantQlik = z.infer<typeof esquemaCrearTenantQlik>;
export type ConfigurarAutomatizacionBase = z.infer<
  typeof esquemaConfigurarAutomatizacionBase
>;
export type ConfigurarDestinoTenant = z.infer<
  typeof esquemaConfigurarDestinoTenant
>;
export type ConfigurarImpalaTenant = z.infer<
  typeof esquemaConfigurarImpalaTenant
>;

export const esquemaEstadoConfiguracionOauth = z.enum([
  "pendiente",
  "verificada",
  "error",
  "desactivada",
]);

export const esquemaOrigenConfiguracionOauth = z.enum([
  "tenant",
  "entorno_global",
  "sin_configurar",
]);

export const esquemaConfigurarOauthQlik = z.object({
  clienteId: z.string().trim().min(1).max(500),
  clienteSecreto: z.string().min(8).max(2000).optional(),
  scopes: z.array(z.string().trim().min(1).max(200)).min(1),
});

export const esquemaConfiguracionOauthQlik = z.object({
  tenantQlikId: z.string(),
  clienteId: z.string().nullable(),
  secretoMascara: z.string().nullable(),
  scopes: z.array(z.string()),
  estado: esquemaEstadoConfiguracionOauth.nullable(),
  origen: esquemaOrigenConfiguracionOauth,
  verificadaEn: z.string().nullable(),
  ultimoError: z.string().nullable(),
  actualizadoEn: z.string().nullable(),
  redirectUri: z.string().url(),
});
export type EstadoConfiguracionOauth = z.infer<
  typeof esquemaEstadoConfiguracionOauth
>;
export type OrigenConfiguracionOauth = z.infer<
  typeof esquemaOrigenConfiguracionOauth
>;
export type ConfigurarOauthQlik = z.infer<typeof esquemaConfigurarOauthQlik>;
export type ConfiguracionOauthQlik = z.infer<
  typeof esquemaConfiguracionOauthQlik
>;
