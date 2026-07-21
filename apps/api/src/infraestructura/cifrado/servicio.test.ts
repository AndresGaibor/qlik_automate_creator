import { beforeEach, describe, expect, it } from "bun:test";
import { ServicioCifrado } from "./servicio";

const CLAVE_VALIDA_32_BYTES = Buffer.alloc(32).fill(0x42).toString("base64");

describe("ServicioCifrado", () => {
  let servicio: ServicioCifrado;

  beforeEach(() => {
    servicio = new ServicioCifrado(CLAVE_VALIDA_32_BYTES);
  });

  describe("constructor", () => {
    it("debería crear instancia con clave válida de 32 bytes", () => {
      expect(() => new ServicioCifrado(CLAVE_VALIDA_32_BYTES)).not.toThrow();
    });

    it("debería lanzar error si la clave no es 32 bytes", () => {
      const claveCorta = Buffer.alloc(16).toString("base64");
      expect(() => new ServicioCifrado(claveCorta)).toThrow(
        "La clave debe ser 32 bytes en base64",
      );
    });

    it("debería lanzar error si la clave no es base64 válida", () => {
      expect(() => new ServicioCifrado("¡no-es-base64!")).toThrow();
    });
  });

  describe("cifrar", () => {
    it("debería cifrar texto plano y devolver cifrado, iv y tag", () => {
      const textoPlano = "mi-token-secreto-12345";

      const resultado = servicio.cifrar(textoPlano);

      expect(resultado).toHaveProperty("cifrado");
      expect(resultado).toHaveProperty("iv");
      expect(resultado).toHaveProperty("tag");
      expect(typeof resultado.cifrado).toBe("string");
      expect(typeof resultado.iv).toBe("string");
      expect(typeof resultado.tag).toBe("string");
    });

    it("debería producir cifrado diferente en cada llamada (random IV)", () => {
      const textoPlano = "mismo-texto";

      const resultado1 = servicio.cifrar(textoPlano);
      const resultado2 = servicio.cifrar(textoPlano);

      expect(resultado1.cifrado).not.toBe(resultado2.cifrado);
      expect(resultado1.iv).not.toBe(resultado2.iv);
    });

    it("debería cifrar texto vacío", () => {
      const resultado = servicio.cifrar("");
      expect(resultado.cifrado).toBeDefined();
      expect(resultado.iv).toBeDefined();
      expect(resultado.tag).toBeDefined();
    });

    it("debería cifrar texto unicode", () => {
      const textoUnicode = "Tokens: áéíóú ñ 中文 🔐";
      const resultado = servicio.cifrar(textoUnicode);
      expect(resultado.cifrado).toBeDefined();
    });

    it("debería cifrar texto largo", () => {
      const textoLargo = "a".repeat(10000);
      const resultado = servicio.cifrar(textoLargo);
      expect(resultado.cifrado).toBeDefined();
    });
  });

  describe("descifrar", () => {
    it("debería descifrar correctamente un texto cifrado", () => {
      const textoPlano = "mi-token-secreto-12345";

      const { cifrado, iv, tag } = servicio.cifrar(textoPlano);
      const descifrado = servicio.descifrar(cifrado, iv, tag);

      expect(descifrado).toBe(textoPlano);
    });

    it("debería descifrar texto unicode correctamente", () => {
      const textoUnicode = "Tokens: áéíóú ñ 中文 🔐";

      const { cifrado, iv, tag } = servicio.cifrar(textoUnicode);
      const descifrado = servicio.descifrar(cifrado, iv, tag);

      expect(descifrado).toBe(textoUnicode);
    });

    it("debería descifrar texto vacío", () => {
      const textoVacio = "";

      const { cifrado, iv, tag } = servicio.cifrar(textoVacio);
      const descifrado = servicio.descifrar(cifrado, iv, tag);

      expect(descifrado).toBe(textoVacio);
    });

    it("debería rechazar tag de autenticación inválido", () => {
      const { cifrado, iv } = servicio.cifrar("texto");

      const tagInvalido = Buffer.alloc(16).toString("base64");

      expect(() => servicio.descifrar(cifrado, iv, tagInvalido)).toThrow();
    });

    it("debería rechazar IV modificado", () => {
      const { cifrado, tag } = servicio.cifrar("texto");
      const ivModificado = Buffer.alloc(16).fill(0xff).toString("base64");

      expect(() => servicio.descifrar(cifrado, ivModificado, tag)).toThrow();
    });

    it("debería rechazar texto cifrado modificado", () => {
      const { cifrado, tag } = servicio.cifrar("texto");
      const cifradoModificado = Buffer.alloc(32).fill(0xff).toString("base64");

      expect(() => servicio.descifrar(cifradoModificado, iv, tag)).toThrow();
    });
  });

  describe("cifrar y descifrar con diferentes instancias", () => {
    it("debería poder descifrar con una nueva instancia del servicio", () => {
      const textoPlano = "token-de-sesion-muy-largo-123456789";

      const { cifrado, iv, tag } = servicio.cifrar(textoPlano);

      const nuevoServicio = new ServicioCifrado(CLAVE_VALIDA_32_BYTES);
      const descifrado = nuevoServicio.descifrar(cifrado, iv, tag);

      expect(descifrado).toBe(textoPlano);
    });

    it("debería fallar al descifrar con clave diferente", () => {
      const textoPlano = "token-secreto";

      const { cifrado, iv, tag } = servicio.cifrar(textoPlano);

      const claveDiferente = Buffer.alloc(32).fill(0xab).toString("base64");
      const otroServicio = new ServicioCifrado(claveDiferente);

      expect(() => otroServicio.descifrar(cifrado, iv, tag)).toThrow();
    });
  });

  describe("formato de salida", () => {
    it("debería devolver iv de 16 bytes en base64 (24 caracteres en base64)", () => {
      const { iv } = servicio.cifrar("test");
      const ivBuffer = Buffer.from(iv, "base64");
      expect(ivBuffer.length).toBe(16);
    });

    it("debería devolver tag de 16 bytes en base64", () => {
      const { tag } = servicio.cifrar("test");
      const tagBuffer = Buffer.from(tag, "base64");
      expect(tagBuffer.length).toBe(16);
    });
  });
});
