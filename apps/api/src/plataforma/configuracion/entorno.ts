import { z } from "zod";

const esquemaEntorno = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  DATABASE_URL: z.string().min(1),
  QLIK_CLIENT_ID: z.string().min(1),
  QLIK_CLIENT_SECRET: z.string().min(1),
  QLIK_REDIRECT_URI: z.string().url(),
  QLIK_TENANT_HOST: z.string().min(1).transform(normalizarHostQlik),
  QLIK_OAUTH_SCOPES: z.string().min(1).optional(),
  CIFRADO_CLAVE_PRINCIPAL: z.string().min(1),
  REMOTE_API_URL: z.string().url().optional(),
  REMOTE_API_KEY: z.string().optional(),
  SUPERADMINMAIL: z.string().email().optional(),
});

export type ConfiguracionAplicacion = z.infer<typeof esquemaEntorno>;

export function cargarConfiguracion(
  valores: Record<string, string | undefined> = process.env,
): ConfiguracionAplicacion {
  return esquemaEntorno.parse(valores);
}

export function normalizarHostQlik(host: string): string {
  const valor =
    host.startsWith("http://") || host.startsWith("https://")
      ? host
      : `https://${host}`;
  const url = new URL(valor);
  if (url.protocol !== "https:") {
    throw new Error("El host de Qlik debe usar HTTPS");
  }
  if (url.pathname !== "/" || url.search || url.hash) {
    throw new Error("QLIK_TENANT_HOST debe contener solo el host del tenant");
  }
  return url.host;
}
