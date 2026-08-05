import { describe, expect, it } from "vitest";
import {
  MotivoSesion,
  obtenerMensajeMotivoSesion,
  obtenerMotivoSesion,
} from "./motivo-sesion";

describe("obtenerMensajeMotivoSesion", () => {
  it("devuelve mensaje para credenciales_qlik_invalidas", () => {
    expect(obtenerMensajeMotivoSesion("credenciales_qlik_invalidas")).toBe(
      "Tu conexión con Qlik Cloud venció. Inicia sesión nuevamente.",
    );
  });

  it("devuelve mensaje para sesion_terminada", () => {
    expect(obtenerMensajeMotivoSesion("sesion_terminada")).toBe(
      "Tu sesión terminó. Inicia sesión nuevamente.",
    );
  });

  it("devuelve null para valor inyectado", () => {
    expect(obtenerMensajeMotivoSesion("valor-inyectado")).toBeNull();
  });

  it("devuelve null para null", () => {
    expect(obtenerMensajeMotivoSesion(null)).toBeNull();
  });
});

describe("obtenerMotivoSesion", () => {
  it("mapea CREDENCIALES_QLIK_INVALIDAS a credenciales_qlik_invalidas", () => {
    expect(obtenerMotivoSesion("CREDENCIALES_QLIK_INVALIDAS")).toBe(
      "credenciales_qlik_invalidas",
    );
  });

  it("mapea SESION_INVALIDA a sesion_terminada", () => {
    expect(obtenerMotivoSesion("SESION_INVALIDA")).toBe("sesion_terminada");
  });

  it("fallback a sesion_terminada para código desconocido", () => {
    expect(obtenerMotivoSesion("OTRO_CODIGO")).toBe("sesion_terminada");
    expect(obtenerMotivoSesion(undefined)).toBe("sesion_terminada");
  });
});
