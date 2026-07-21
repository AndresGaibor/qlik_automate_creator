import crypto from "node:crypto";

const ALGORITMO = "aes-256-gcm";

export class ServicioCifrado {
  private clave: Buffer;

  constructor(clavePrincipal: string) {
    const decoded = Buffer.from(clavePrincipal, "base64");
    if (decoded.length !== 32) {
      throw new Error("La clave debe ser 32 bytes en base64");
    }
    this.clave = decoded;
  }

  cifrar(textoPlano: string): { cifrado: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITMO, this.clave, iv);
    let cifrado = cipher.update(textoPlano, "utf8", "base64");
    cifrado += cipher.final("base64");
    const tag = cipher.getAuthTag();
    return {
      cifrado,
      iv: iv.toString("base64"),
      tag: tag.toString("base64"),
    };
  }

  descifrar(cifrado: string, iv: string, tag: string): string {
    const decipher = crypto.createDecipheriv(
      ALGORITMO,
      this.clave,
      Buffer.from(iv, "base64"),
    );
    decipher.setAuthTag(Buffer.from(tag, "base64"));
    let texto = decipher.update(cifrado, "base64", "utf8");
    texto += decipher.final("utf8");
    return texto;
  }
}

export const crearServicioCifrado = (): ServicioCifrado => {
  const clave = process.env.CIFRADO_CLAVE_PRINCIPAL;
  if (!clave) {
    throw new Error("CIFRADO_CLAVE_PRINCIPAL environment variable is not set");
  }
  return new ServicioCifrado(clave);
};

export const servicioCifrado = process.env.CIFRADO_CLAVE_PRINCIPAL
  ? new ServicioCifrado(process.env.CIFRADO_CLAVE_PRINCIPAL)
  : null;
