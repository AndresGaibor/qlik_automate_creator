import { describe, expect, it, vi } from "bun:test";
import { ClienteImpalaDirecto } from "./cliente-impala-directo.js";

const esquemaFilas = [
  ["id", "bigint"],
  ["nombre", "string"],
];

describe("ClienteImpalaDirecto", () => {
  it("delega consultas SQL al ejecutor inyectado", async () => {
    const ejecutarColumna = vi.fn(async (sql: string) =>
      sql === "SHOW DATABASES" ? ["default", "ventas"] : ["facturas"],
    );
    const ejecutarFilas = vi.fn(async () => esquemaFilas);
    const cliente = new ClienteImpalaDirecto(
      { host: "impala.local", database: "default" },
      { ejecutarColumna, ejecutarFilas },
    );

    await expect(cliente.listarBasesDatos()).resolves.toEqual([
      "default",
      "ventas",
    ]);
    await expect(cliente.listarTablas("ventas")).resolves.toEqual(["facturas"]);
    await expect(
      cliente.obtenerEsquemaTabla("ventas", "facturas"),
    ).resolves.toEqual({
      baseDatos: "ventas",
      tabla: "facturas",
      columnas: [
        { nombre: "id", tipo: "bigint" },
        { nombre: "nombre", tipo: "string" },
      ],
      especificacionEsquema: "id:bigint|nombre:string",
    });

    expect(ejecutarColumna).toHaveBeenCalledWith("SHOW DATABASES");
    expect(ejecutarColumna).toHaveBeenCalledWith("SHOW TABLES IN `ventas`");
    expect(ejecutarFilas).toHaveBeenCalledWith("DESCRIBE `ventas`.`facturas`");
  });
});
