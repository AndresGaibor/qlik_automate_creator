import crypto from "node:crypto";

const ALGORITMO = "aes-256-gcm";
const CLAVE_CONFIG = "cifrado_clave_principal";

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

interface PuertoConfigCifrado {
  guardar(clave: string, valor: unknown): Promise<void>;
  obtener(clave: string): Promise<unknown | null>;
}

class ServicioCifradoWrapper {
  private servicio: ServicioCifrado | null = null;
  private inicializado = false;

  async inicializarConDb(db: PuertoConfigCifrado): Promise<void> {
    if (this.inicializado) return;
    let clave = process.env.CIFRADO_CLAVE_PRINCIPAL;
    if (!clave) {
      try {
        const almacenado = await db.obtener(CLAVE_CONFIG);
        if (almacenado && typeof almacenado === "object") {
          clave = (almacenado as Record<string, unknown>).valor as string;
        }
      } catch {
        // Tabla aún no existe — se generará clave temporal
      }
    }
    if (!clave) {
      clave = crypto.randomBytes(32).toString("base64");
      try {
        await db.guardar(CLAVE_CONFIG, { valor: clave });
      } catch {
        // No se pudo persistir — sigue con clave en memoria
      }
    }
    this.servicio = new ServicioCifrado(clave);
    this.inicializado = true;
  }

  private obtenerInstancia(): ServicioCifrado {
    if (!this.servicio) {
      const clave = process.env.CIFRADO_CLAVE_PRINCIPAL;
      if (!clave) {
        throw new Error(
          "CIFRADO_CLAVE_PRINCIPAL no está configurado. Asegúrate de llamar a inicializarConDb antes de usar el servicio de cifrado.",
        );
      }
      this.servicio = new ServicioCifrado(clave);
      this.inicializado = true;
    }
    return this.servicio;
  }

  cifrar(textoPlano: string) {
    return this.obtenerInstancia().cifrar(textoPlano);
  }

  descifrar(cifrado: string, iv: string, tag: string) {
    return this.obtenerInstancia().descifrar(cifrado, iv, tag);
  }
}

export const servicioCifrado = new ServicioCifradoWrapper();
