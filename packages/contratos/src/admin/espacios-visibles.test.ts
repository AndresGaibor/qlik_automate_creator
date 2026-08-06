import { expect, test } from "bun:test";
import { esquemaGuardarEspaciosVisibles } from "./espacios-visibles";

test("normaliza espacios repetidos y conserva acceso cerrado", () => {
  expect(
    esquemaGuardarEspaciosVisibles.parse({
      espaciosPermitidosIds: ["space-1", "space-1"],
      permitirRecursosSinEspacio: false,
    }),
  ).toEqual({
    espaciosPermitidosIds: ["space-1"],
    permitirRecursosSinEspacio: false,
  });
});
