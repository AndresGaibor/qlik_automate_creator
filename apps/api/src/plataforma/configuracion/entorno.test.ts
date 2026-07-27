import { describe, expect, it } from "bun:test";
import { cargarConfiguracion } from "./entorno.js";

const base = {
  DATABASE_URL: "postgres://usuario:clave@localhost:5432/app",
  QLIK_REDIRECT_URI: "http://localhost:3000/api/auth/qlik/callback",
  CIFRADO_CLAVE_PRINCIPAL: "clave-principal-pruebas",
};

describe("configuración de entorno OAuth", () => {
  it("acepta credenciales globales vacías cuando OAuth se configura por tenant", () => {
    const configuracion = cargarConfiguracion({
      ...base,
      QLIK_CLIENT_ID: "",
      QLIK_CLIENT_SECRET: "   ",
    });

    expect(configuracion.QLIK_CLIENT_ID).toBeUndefined();
    expect(configuracion.QLIK_CLIENT_SECRET).toBeUndefined();
  });
});
