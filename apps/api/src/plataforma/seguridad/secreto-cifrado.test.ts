import { describe, expect, it } from "bun:test";
import {
  cifrarSecretoParaPersistencia,
  descifrarSecretoPersistido,
  leerSecretoCifrado,
} from "./secreto-cifrado.js";
import { ServicioCifrado } from "./servicio-cifrado.js";

describe("secreto cifrado persistido", () => {
  it("serializa el secreto cifrado y permite recuperarlo solo en el servidor", () => {
    const cifrado = new ServicioCifrado(Buffer.alloc(32, 7).toString("base64"));
    const persistido = cifrarSecretoParaPersistencia(cifrado, "secreto-impala");

    expect(persistido).not.toContain("secreto-impala");
    expect(descifrarSecretoPersistido(cifrado, persistido)).toBe(
      "secreto-impala",
    );
  });

  it("lee únicamente secretos almacenados cifrados", () => {
    const cifrado = new ServicioCifrado(Buffer.alloc(32, 7).toString("base64"));
    const persistido = cifrarSecretoParaPersistencia(cifrado, "secreto-impala");

    expect(leerSecretoCifrado(cifrado, persistido)).toBe("secreto-impala");
    expect(leerSecretoCifrado(cifrado, undefined)).toBeUndefined();
  });
});
