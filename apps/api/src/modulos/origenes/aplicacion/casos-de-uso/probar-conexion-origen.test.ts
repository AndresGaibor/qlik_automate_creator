import { describe, expect, it, vi } from "bun:test";
import type { ProbadorConexionOrigen } from "../puertos/probador-conexion-origen.js";
import type {
  ConexionOrigen,
  RepositorioConexionesOrigen,
} from "../puertos/repositorio-conexiones-origen.js";
import { ProbarConexionOrigen } from "./probar-conexion-origen.js";

const base: Omit<ConexionOrigen, "tipo" | "config"> = {
  id: "11111111-1111-4111-8111-111111111111",
  organizacionId: "22222222-2222-4222-8222-222222222222",
  nombre: "Origen",
  estado: "sin_probar",
  probadaEn: null,
  mensajeError: null,
  creadoEn: new Date(),
  actualizadoEn: new Date(),
};

const conexionJdbc: ConexionOrigen = {
  ...base,
  tipo: "jdbc",
  config: {
    url: "jdbc:postgresql://db.internal:5432/demo?sslmode=require",
    secreto_nombre: "JDBC_DEMO",
  },
};
const conexionSftp: ConexionOrigen = {
  ...base,
  tipo: "sftp",
  config: {
    host: "sftp.internal",
    puerto: 22,
    usuario: "demo",
    secreto_clave_privada_nombre: "SFTP_DEMO_B64",
  },
};

function crearDeps() {
  const repositorio = {
    buscarPorId: vi.fn(async () => conexionJdbc),
    leerSecreto: vi.fn(async () => "demo:cla:ve"),
    registrarPrueba: vi.fn(async () => true),
  } as unknown as RepositorioConexionesOrigen;
  const probador = {
    probarPostgres: vi.fn(async () => undefined),
    probarSftp: vi.fn(async () => undefined),
  } satisfies ProbadorConexionOrigen;
  return { repositorio, probador };
}

describe("ProbarConexionOrigen", () => {
  it("prueba JDBC PostgreSQL con secreto usuario:clave", async () => {
    const { repositorio, probador } = crearDeps();
    const casoUso = new ProbarConexionOrigen(repositorio, probador);

    const resultado = await casoUso.ejecutar(base.organizacionId, base.id);

    expect(probador.probarPostgres).toHaveBeenCalledWith({
      url: "jdbc:postgresql://db.internal:5432/demo?sslmode=require",
      usuario: "demo",
      clave: "cla:ve",
    });
    expect(resultado.estado).toBe("disponible");
  });

  it("rechaza una conexión histórica sin secreto con un error accionable", async () => {
    const { repositorio, probador } = crearDeps();
    repositorio.leerSecreto = vi.fn(async () => null);
    const casoUso = new ProbarConexionOrigen(repositorio, probador);

    await expect(
      casoUso.ejecutar(base.organizacionId, base.id),
    ).rejects.toMatchObject({
      codigo: "CONEXION_ORIGEN_SIN_SECRETO",
      message: "Falta configurar la credencial segura",
      estadoHttp: 422,
    });
    expect(probador.probarPostgres).not.toHaveBeenCalled();
    expect(repositorio.registrarPrueba).not.toHaveBeenCalled();
  });

  it("rechaza drivers JDBC no soportados", async () => {
    const { repositorio, probador } = crearDeps();
    repositorio.buscarPorId = vi.fn(async () => ({
      ...conexionJdbc,
      config: { ...conexionJdbc.config, url: "jdbc:oracle:thin:@db:1521/demo" },
    }));
    const casoUso = new ProbarConexionOrigen(repositorio, probador);

    expect(
      casoUso.ejecutar(base.organizacionId, base.id),
    ).rejects.toMatchObject({
      codigo: "JDBC_NO_SOPORTADO",
      estadoHttp: 422,
    });
  });

  it("prueba SFTP con el PEM descifrado y no lo filtra al fallar", async () => {
    const { repositorio, probador } = crearDeps();
    repositorio.buscarPorId = vi.fn(async () => conexionSftp);
    repositorio.leerSecreto = vi.fn(
      async () => "-----BEGIN OPENSSH PRIVATE KEY-----",
    );
    probador.probarSftp = vi.fn(async () => {
      throw new Error("authentication failed");
    });
    const casoUso = new ProbarConexionOrigen(repositorio, probador);

    const promesa = casoUso.ejecutar(base.organizacionId, base.id);
    await expect(promesa).rejects.toMatchObject({
      codigo: "CONEXION_ORIGEN_NO_DISPONIBLE",
    });
    await expect(promesa).rejects.not.toThrow("PRIVATE KEY");
    expect(repositorio.registrarPrueba).toHaveBeenCalledWith(
      base.organizacionId,
      base.id,
      expect.objectContaining({ estado: "error" }),
    );
  });
});
