import { describe, expect, it } from "bun:test";
import {
  configurarConexionConSecreto,
  presentarConexionDestino,
} from "./modelo-destino-http.js";

const conexion = {
  id: "destino-1",
  organizacionId: "org-1",
  tipo: "postgres" as const,
  nombre: "Postgres",
  estado: "activo" as const,
  mensajeError: null,
  probadaEn: new Date("2026-08-06T12:30:00.000Z"),
  config: { host: "db.internal", user: "etl" },
  secretoRefs: { password: "POSTGRES_DESTINO" },
};

describe("modelo HTTP de destinos", () => {
  it("presenta solo campos públicos y serializa la fecha", () => {
    expect(presentarConexionDestino(conexion)).toEqual({
      id: "destino-1",
      tipo: "postgres",
      nombre: "Postgres",
      estado: "activo",
      mensajeError: null,
      probadaEn: "2026-08-06T12:30:00.000Z",
    });
  });

  it("inyecta el secreto únicamente en la configuración interna", () => {
    expect(
      configurarConexionConSecreto({
        ...conexion,
        secreto: { nombre: "POSTGRES_DESTINO", valor: "secreto-real" },
      }).config,
    ).toEqual({ host: "db.internal", user: "etl", password: "secreto-real" });
  });

  it("conserva la configuración cuando no existe secreto", () => {
    expect(
      configurarConexionConSecreto({ ...conexion, secreto: null }).config,
    ).toEqual(conexion.config);
  });
});
