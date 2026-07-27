import { describe, expect, it } from "bun:test";
import { type RepositorioBootstrap, ejecutarBootstrap } from "./bootstrap.js";

class RepositorioMemoria implements RepositorioBootstrap {
  organizaciones = new Map<string, { id: string; nombre: string }>();
  tenants = new Map<string, { id: string; organizacionId: string }>();
  usuarios = new Map<string, { id: string }>();
  membresias = new Set<string>();

  async resolverOrganizacionInicial(datos: {
    nombre: string;
    tenantHost: string;
  }) {
    const tenantExistente = this.tenants.get(datos.tenantHost);
    if (tenantExistente) {
      const entradaActual = Array.from(this.organizaciones.entries()).find(
        ([, organizacion]) =>
          organizacion.id === tenantExistente.organizacionId,
      );
      if (!entradaActual)
        throw new Error("Organización del tenant no encontrada");
      const [nombreActual, organizacion] = entradaActual;
      this.organizaciones.delete(nombreActual);
      const actualizada = { ...organizacion, nombre: datos.nombre };
      this.organizaciones.set(datos.nombre, actualizada);
      return actualizada;
    }
    const existente = this.organizaciones.get(datos.nombre);
    if (existente) return existente;
    const creada = {
      id: `org-${this.organizaciones.size + 1}`,
      nombre: datos.nombre,
    };
    this.organizaciones.set(datos.nombre, creada);
    return creada;
  }
  async asegurarTenantPrincipal(datos: {
    organizacionId: string;
    tenantIdQlik: string;
    host: string;
    nombre: string;
  }) {
    const existente = this.tenants.get(datos.host);
    if (existente) return existente;
    const creado = {
      id: `tenant-${this.tenants.size + 1}`,
      organizacionId: datos.organizacionId,
    };
    this.tenants.set(datos.host, creado);
    return creado;
  }
  async asegurarSuperadministrador(datos: {
    organizacionId: string;
    correo: string;
    nombre: string;
  }) {
    let usuario = this.usuarios.get(datos.correo);
    if (!usuario) {
      usuario = { id: `usuario-${this.usuarios.size + 1}` };
      this.usuarios.set(datos.correo, usuario);
    }
    this.membresias.add(`${datos.organizacionId}:${usuario.id}:admin`);
    return usuario;
  }
}

describe("bootstrap inicial", () => {
  it("es idempotente y crea organización, tenant principal y superadministrador", async () => {
    const repositorio = new RepositorioMemoria();
    const entrada = {
      organizacionNombre: "Empresa Demo",
      tenantNombre: "Qlik principal",
      tenantHost: "empresa.eu.qlikcloud.com",
      tenantIdQlik: "tenant-qlik-001",
      superadminCorreo: "admin@empresa.com",
      superadminNombre: "Administrador",
    };

    const primero = await ejecutarBootstrap(repositorio, entrada);
    const segundo = await ejecutarBootstrap(repositorio, entrada);

    expect(primero).toEqual(segundo);
    expect(repositorio.organizaciones.size).toBe(1);
    expect(repositorio.tenants.size).toBe(1);
    expect(repositorio.usuarios.size).toBe(1);
    expect(repositorio.membresias.size).toBe(1);
  });

  it("reutiliza la organización del host aunque su nombre haya cambiado", async () => {
    const repositorio = new RepositorioMemoria();
    repositorio.organizaciones.set("Banco", {
      id: "org-existente",
      nombre: "Banco",
    });
    repositorio.tenants.set("empresa.eu.qlikcloud.com", {
      id: "tenant-existente",
      organizacionId: "org-existente",
    });

    const resultado = await ejecutarBootstrap(repositorio, {
      organizacionNombre: "Bancolombia",
      tenantNombre: "Qlik principal",
      tenantHost: "empresa.eu.qlikcloud.com",
      tenantIdQlik: "tenant-qlik-001",
      superadminCorreo: "admin@empresa.com",
      superadminNombre: "Superadministrador",
    });

    expect(resultado.organizacionId).toBe("org-existente");
    expect(repositorio.organizaciones.size).toBe(1);
    expect(repositorio.organizaciones.get("Bancolombia")?.id).toBe(
      "org-existente",
    );
  });

  it("crea varios superadministradores desde correos separados por coma", async () => {
    const repositorio = new RepositorioMemoria();
    const resultado = await ejecutarBootstrap(repositorio, {
      organizacionNombre: "Empresa Demo",
      tenantNombre: "Qlik principal",
      tenantHost: "empresa.eu.qlikcloud.com",
      tenantIdQlik: "tenant-qlik-001",
      superadminCorreo: " UNO@empresa.com, dos@empresa.com, uno@empresa.com ",
      superadminNombre: "Superadministrador",
    });

    expect(Array.from(repositorio.usuarios.keys())).toEqual([
      "uno@empresa.com",
      "dos@empresa.com",
    ]);
    expect(resultado.superadministradorIds).toEqual(["usuario-1", "usuario-2"]);
  });
});
