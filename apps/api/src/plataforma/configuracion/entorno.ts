import { z } from "zod";

const textoOpcional = z.preprocess(
  (valor) =>
    typeof valor === "string" && valor.trim() === "" ? undefined : valor,
  z.string().optional(),
);

const esquemaEntorno = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  DATABASE_URL: z.string().min(1),
  QLIK_CLIENT_ID: textoOpcional,
  QLIK_CLIENT_SECRET: textoOpcional,
  QLIK_REDIRECT_URI: z
    .string()
    .url()
    .default("http://localhost:3000/api/auth/qlik/callback"),
  QLIK_TENANT_HOST: z.string().min(1).transform(normalizarHostQlik).optional(),
  QLIK_OAUTH_SCOPES: z.string().optional(),
  QLIK_OAUTH_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .min(1_000)
    .max(60_000)
    .default(10_000),
  CIFRADO_CLAVE_PRINCIPAL: z.string().optional(),
  REMOTE_API_URL: z.string().url().optional(),
  REMOTE_API_KEY: z.string().optional(),
  SUPERADMINMAIL: z.string().optional(),
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
