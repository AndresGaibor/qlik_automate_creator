import crypto from "node:crypto";

interface TokensQlik {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  scope: string;
}

interface UsuarioQlik {
  id: string;
  name?: string;
  email?: string;
  avatar?: string;
}

const QLIK_AUTH_URL = "https://{host}/oauth/authorize";
const QLIK_TOKEN_URL = "https://{host}/oauth/token";
const QLIK_USER_URL = "https://{host}/api/v1/users/me";

// Scopes necesarios para leer identidad del usuario vía /api/v1/users/me
const QLIK_SCOPES = [
  "user_default",
  "offline_access",
  "identity.name:read",
  "identity.email:read",
  "identity.subject:read",
  "identity.picture:read",
].join(" ");

export class ClienteOAuthQlik {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private host: string;

  constructor(
    clientId: string,
    clientSecret: string,
    redirectUri: string,
    host: string,
  ) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.host = host;
  }

  generarEstado(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  generarCodeVerifier(): string {
    return crypto.randomBytes(64).toString("base64url");
  }

  async generarCodeChallenge(verifier: string): Promise<string> {
    const hash = crypto.createHash("sha256").update(verifier).digest();
    return hash.toString("base64url");
  }

  obtenerUrlAutorizacion(estado: string, codeChallenge: string): string {
    const url = QLIK_AUTH_URL.replace("{host}", this.host);
    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state: estado,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      scope: QLIK_SCOPES,
    });
    return `${url}?${params}`;
  }

  async intercambiaCodigoPorTokens(
    codigo: string,
    codeVerifier: string,
  ): Promise<TokensQlik> {
    const url = QLIK_TOKEN_URL.replace("{host}", this.host);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: codigo,
        redirect_uri: this.redirectUri,
        code_verifier: codeVerifier,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      const errorSanitizado = error.replace(/<[^>]+>/g, "").slice(0, 200);
      console.error(
        `OAuth token exchange error: { status: ${response.status}, endpoint: "token", body: "${errorSanitizado}" }`,
      );
      throw new Error(`Error intercambiando código: ${error}`);
    }

    console.info(
      `OAuth token exchange: { status: ${response.status}, endpoint: "token" }`,
    );
    const data = await response.json();

    const accessToken = data.access_token ?? data.accessToken;
    const expiresIn = data.expires_in ?? data.expiresIn;

    if (!accessToken || typeof accessToken !== "string") {
      throw new Error(
        "Token exchange: access_token ausente en respuesta de Qlik",
      );
    }
    if (expiresIn === undefined || expiresIn === null) {
      throw new Error(
        "Token exchange: expires_in ausente en respuesta de Qlik",
      );
    }

    return {
      accessToken,
      refreshToken: data.refresh_token ?? data.refreshToken,
      expiresIn: Number(expiresIn),
      scope: data.scope ?? "",
    };
  }

  async obtenerUsuario(accessToken: string): Promise<UsuarioQlik> {
    const url = QLIK_USER_URL.replace("{host}", this.host);
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Extraer información segura del error (sin tokens, secrets ni cookies)
      const cuerpoSeguro = await response.text().catch(() => "(no body)");
      const cuerpoSanitizado = cuerpoSeguro
        .replace(/<[^>]+>/g, "")
        .slice(0, 200);
      console.error(
        `OAuth users/me error: { status: ${response.status}, endpoint: "users/me", body: "${cuerpoSanitizado}" }`,
      );
      const mensajeSeguro = `Qlik API error: ${response.status} ${response.statusText} - ${cuerpoSanitizado}`;
      throw new Error(mensajeSeguro);
    }

    console.info(
      `OAuth users/me: { status: ${response.status}, endpoint: "users/me" }`,
    );
    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
    };
  }
}
