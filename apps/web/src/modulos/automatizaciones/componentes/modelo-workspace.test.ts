import { describe, expect, it } from "vitest";
import {
  obtenerTipoBadge,
  presentarValorEntrada,
  procesarBloquesWorkspace,
} from "./modelo-workspace";

describe("modelo de presentación del workspace", () => {
  it("normaliza bloques e inputs sin depender del JSX", () => {
    const resultado = procesarBloquesWorkspace({
      blocks: [
        {
          id: "bloque-1",
          blockType: "StartBlock",
          displayName: "Inicio",
          childId: "bloque-2",
          inputs: [{ name: "ruta", value: "/entrada" }],
        },
      ],
    });

    expect(resultado.bloques).toEqual([
      expect.objectContaining({
        id: "bloque-1",
        type: "StartBlock",
        title: "Inicio",
        nextBlockId: "bloque-2",
        inputs: [
          { id: "ruta", label: "ruta", type: undefined, value: "/entrada" },
        ],
      }),
    ]);
  });

  it("clasifica los tipos conocidos y conserva los desconocidos", () => {
    expect(obtenerTipoBadge("StartBlock")).toMatchObject({
      icon: "play",
      label: "Inicio / Disparador",
    });
    expect(obtenerTipoBadge("CustomBlock")).toMatchObject({
      icon: "flow",
      label: "CustomBlock",
    });
  });

  it("presenta valores vacíos, objetos y escalares", () => {
    expect(presentarValorEntrada(undefined)).toEqual({
      texto: "sin configurar",
      vacio: true,
    });
    expect(presentarValorEntrada({ activo: true })).toEqual({
      texto: '{"activo":true}',
      vacio: false,
    });
    expect(presentarValorEntrada(42)).toEqual({ texto: "42", vacio: false });
  });
});
