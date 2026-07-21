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
      throw new Error(`Error intercambiando código: ${error}`);
    }

    return response.json();
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
      throw new Error("Error obteniendo usuario de Qlik");
    }

    const data = await response.json();
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
    };
  }
}
