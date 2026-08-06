import { describe, expect, it } from "vitest";
import {
  puedeCambiarRolUsuario,
  puedeQuitarUsuario,
} from "./usuarios-permisos";

const admin = { id: "admin-1", rol: "admin" as const };
const usuario = { id: "usuario-1", rol: "usuario" as const };

describe("permisos de administración de usuarios", () => {
  it("protege al último administrador", () => {
    expect(puedeQuitarUsuario(admin, [admin, usuario])).toBe(false);
    expect(puedeCambiarRolUsuario(admin, "usuario", [admin, usuario])).toBe(
      false,
    );
  });

  it("permite cambios cuando existe otro administrador", () => {
    const otroAdmin = { id: "admin-2", rol: "admin" as const };
    expect(puedeQuitarUsuario(admin, [admin, otroAdmin])).toBe(true);
    expect(puedeCambiarRolUsuario(admin, "usuario", [admin, otroAdmin])).toBe(
      true,
    );
  });
});
