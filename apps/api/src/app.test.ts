import { describe, expect, it } from "bun:test";
import { crearAplicacion } from "./app.js";
import type { Registrador } from "./plataforma/observabilidad/registrador.js";

function crearRegistradorPrueba(): Registrador {
  return {
    info: () => undefined,
    advertencia: () => undefined,
    error: () => undefined,
  };
}

describe("API", () => {
  it("expone el estado de salud con el contrato común", async () => {
    const app = crearAplicacion({ registrador: crearRegistradorPrueba() });
    const respuesta = await app.request("/api/salud");
    const cuerpo = await respuesta.json();

    expect(respuesta.status).toBe(200);
    expect(cuerpo.exito).toBe(true);
    expect(cuerpo.datos.estado).toBe("ok");
    expect(cuerpo.datos.arquitectura).toBe("monolito-modular");
    expect(cuerpo.datos.fecha).toBeDefined();
  });

  it("normaliza rutas inexistentes", async () => {
    const app = crearAplicacion({ registrador: crearRegistradorPrueba() });
    const respuesta = await app.request("/api/inexistente");
    const cuerpo = await respuesta.json();

    expect(respuesta.status).toBe(404);
    expect(cuerpo).toMatchObject({
      exito: false,
      error: {
        codigo: "RUTA_NO_ENCONTRADA",
        mensaje: "Ruta no encontrada",
      },
    });
  });

  it("mapea errores no controlados sin exponer detalles", async () => {
    const app = crearAplicacion({ registrador: crearRegistradorPrueba() });
    app.get("/api/__prueba-error", () => {
      throw new Error("secreto interno");
    });

    const respuesta = await app.request("/api/__prueba-error");
    const cuerpo = await respuesta.json();

    expect(respuesta.status).toBe(500);
    expect(cuerpo.exito).toBe(false);
    expect(cuerpo.error.codigo).toBe("INTERNO");
    expect(cuerpo.error.mensaje).toBe("Error interno del servidor");
    expect(JSON.stringify(cuerpo)).not.toContain("secreto interno");
  });
});
