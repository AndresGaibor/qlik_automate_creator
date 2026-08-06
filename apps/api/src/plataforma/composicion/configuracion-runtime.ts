import type { ConfiguracionAppPostgres } from "../../modulos/setup/infraestructura/configuracion-app-postgres.js";
import type { ConfiguracionAplicacion } from "../configuracion/entorno.js";

export interface ConfiguracionRuntime {
  frontendUrl: string;
  produccion: boolean;
  redirectUriOAuth: string;
  scopesOAuthHeredados: string[];
  configuracionHeredada: {
    clienteId?: string;
    tieneSecreto: boolean;
    scopes: string[];
  };
}

export async function resolverConfiguracionRuntime(
  configuracionApp: Pick<ConfiguracionAppPostgres, "obtener">,
  configuracion?: ConfiguracionAplicacion,
): Promise<ConfiguracionRuntime> {
  const frontendUrlGuardado =
    await obtenerFrontendUrlGuardado(configuracionApp);
  const frontendUrl =
    frontendUrlGuardado ??
    configuracion?.FRONTEND_URL ??
    process.env.FRONTEND_URL ??
    "http://localhost:5173";
  const produccion =
    (configuracion?.NODE_ENV ?? process.env.NODE_ENV) === "production";
  const redirectUriConfigurado =
    process.env.QLIK_REDIRECT_URI ?? configuracion?.QLIK_REDIRECT_URI;
  const redirectUriOAuth = frontendUrlGuardado
    ? new URL("/api/auth/qlik/callback", frontendUrl).toString()
    : (redirectUriConfigurado ??
      "http://localhost:3000/api/auth/qlik/callback");
  const scopesOAuthHeredados = leerScopes(configuracion);
  const clienteId = configuracion?.QLIK_CLIENT_ID ?? process.env.QLIK_CLIENT_ID;
  const clienteSecreto =
    configuracion?.QLIK_CLIENT_SECRET ?? process.env.QLIK_CLIENT_SECRET;

  return {
    frontendUrl,
    produccion,
    redirectUriOAuth,
    scopesOAuthHeredados,
    configuracionHeredada: {
      clienteId,
      tieneSecreto: Boolean(clienteSecreto),
      scopes: scopesOAuthHeredados,
    },
  };
}

function leerScopes(configuracion?: ConfiguracionAplicacion): string[] {
  return (
    configuracion?.QLIK_OAUTH_SCOPES ??
    process.env.QLIK_OAUTH_SCOPES ??
    ""
  )
    .split(/\s+/)
    .filter(Boolean);
}

async function obtenerFrontendUrlGuardado(
  configuracionApp: Pick<ConfiguracionAppPostgres, "obtener">,
): Promise<string | null> {
  try {
    const valor = await configuracionApp.obtener("frontend_url");
    if (typeof valor !== "object" || valor === null) return null;
    const url = (valor as Record<string, unknown>).valor;
    if (typeof url !== "string") return null;
    return new URL(url).toString();
  } catch {
    return null;
  }
}
