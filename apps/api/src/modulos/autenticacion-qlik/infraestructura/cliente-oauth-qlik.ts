import crypto from "node:crypto";
import type { PuertoOAuthQlik } from "../aplicacion/puertos/puerto-oauth-qlik.js";
import type { TokensQlik, UsuarioOAuthQlik } from "../dominio/modelos.js";

const SCOPES_PREDETERMINADOS = [
  "user_default",
  "offline_access",
  "identity.name:read",
  "identity.email:read",
  "identity.subject:read",
  "identity.picture:read",
  "automations",
  "automations.private",
  "automations.shared",
  "spaces:read",
  "apps:read",
  "data-integration",
].join(" ");

export class ClienteOAuthQlik implements PuertoOAuthQlik {
  private readonly origen: string;

  constructor(
    private readonly clienteId: string,
    private readonly clienteSecreto: string,
    private readonly uriRedireccion: string,
    host: string,
    private readonly scopes = process.env.QLIK_OAUTH_SCOPES ??
      SCOPES_PREDETERMINADOS,
    private readonly fetchFn: typeof fetch = fetch,
  ) {
    const hostNormalizado = /^https?:\/\//i.test(host)
      ? host
      : `https://${host}`;
    const url = new URL(hostNormalizado);
    if (url.protocol !== "https:" || url.pathname !== "/") {
      throw new Error("QLIK_TENANT_HOST debe ser un host HTTPS sin ruta");
    }
    this.origen = url.origin;
  }

  generarEstado(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  generarVerificadorPkce(): string {
    return crypto.randomBytes(64).toString("base64url");
  }

  async generarDesafioPkce(verificador: string): Promise<string> {
    return crypto.createHash("sha256").update(verificador).digest("base64url");
  }

  obtenerUrlAutorizacion(estado: string, desafio: string): string {
    const url = new URL("/oauth/authorize", this.origen);
    url.search = new URLSearchParams({
      response_type: "code",
      client_id: this.clienteId,
      redirect_uri: this.uriRedireccion,
      state: estado,
      code_challenge: desafio,
      code_challenge_method: "S256",
      scope: this.scopes,
    }).toString();
    return url.toString();
  }

  async intercambiarCodigo(
    codigo: string,
    verificador: string,
  ): Promise<TokensQlik> {
    const respuesta = await this.fetchFn(new URL("/oauth/token", this.origen), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: codigo,
        redirect_uri: this.uriRedireccion,
        code_verifier: verificador,
        client_id: this.clienteId,
        client_secret: this.clienteSecreto,
      }),
    });

    const datos = await leerJsonSeguro(respuesta);
    if (!respuesta.ok) {
      throw new Error(`Qlik OAuth respondió ${respuesta.status}`);
    }

    const tokenAcceso = datoTexto(datos, "access_token", "accessToken");
    const expiraEn = datoNumero(datos, "expires_in", "expiresIn");
    if (!tokenAcceso || expiraEn === undefined) {
      throw new Error("Respuesta OAuth de Qlik incompleta");
    }

    const tokenRefresco = datoTexto(datos, "refresh_token", "refreshToken");
    const scopes = (datoTexto(datos, "scope") ?? this.scopes)
      .split(/\s+/)
      .filter(Boolean);

    return {
      tokenAcceso,
      ...(tokenRefresco ? { tokenRefresco } : {}),
      expiraEnSegundos: expiraEn,
      scopes,
    };
  }

  async obtenerUsuario(tokenAcceso: string): Promise<UsuarioOAuthQlik> {
    const respuesta = await this.fetchFn(
      new URL("/api/v1/users/me", this.origen),
      {
        headers: {
          Authorization: `Bearer ${tokenAcceso}`,
          Accept: "application/json",
        },
      },
    );
    const datos = await leerJsonSeguro(respuesta);
    if (!respuesta.ok) {
      throw new Error(`Qlik users/me respondió ${respuesta.status}`);
    }
    const id = datoTexto(datos, "id");
    if (!id) throw new Error("Qlik users/me no devolvió id");
    const nombre = datoTexto(datos, "name");
    const correo = datoTexto(datos, "email");
    const avatarUrl = datoTexto(datos, "avatar", "picture");
    return {
      id,
      ...(nombre ? { nombre } : {}),
      ...(correo ? { correo } : {}),
      ...(avatarUrl ? { avatarUrl } : {}),
    };
  }
}

async function leerJsonSeguro(
  respuesta: Response,
): Promise<Record<string, unknown>> {
  const datos = await respuesta.json().catch(() => ({}));
  return datos && typeof datos === "object"
    ? (datos as Record<string, unknown>)
    : {};
}

function datoTexto(
  datos: Record<string, unknown>,
  ...claves: string[]
): string | undefined {
  for (const clave of claves) {
    const valor = datos[clave];
    if (typeof valor === "string" && valor) return valor;
  }
  return undefined;
}

function datoNumero(
  datos: Record<string, unknown>,
  ...claves: string[]
): number | undefined {
  for (const clave of claves) {
    const valor = Number(datos[clave]);
    if (Number.isFinite(valor) && valor > 0) return valor;
  }
  return undefined;
}
