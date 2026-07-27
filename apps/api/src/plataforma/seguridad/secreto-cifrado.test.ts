import { describe, expect, it } from "bun:test";
import { ServicioCifrado } from "./servicio-cifrado.js";
import {
  cifrarSecretoParaPersistencia,
  descifrarSecretoPersistido,
} from "./secreto-cifrado.js";

describe("secreto cifrado persistido", () => {
  it("serializa el secreto cifrado y permite recuperarlo solo en el servidor", () => {
    const cifrado = new ServicioCifrado(Buffer.alloc(32, 7).toString("base64"));
    const persistido = cifrarSecretoParaPersistencia(cifrado, "secreto-impala");

    expect(persistido).not.toContain("secreto-impala");
    expect(descifrarSecretoPersistido(cifrado, persistido)).toBe(
      "secreto-impala",
    );
  });
});
