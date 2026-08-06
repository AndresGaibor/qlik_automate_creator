import { eq } from "drizzle-orm";
import type { ConexionDb } from "../../../plataforma/persistencia/conexion.js";
import {
  configuracionesPlataforma,
  usuarios,
} from "../../../plataforma/persistencia/esquema.js";
import type {
  EntradaGuardarConfiguracionOauth,
  EstadoOrganizacion,
  ModoPlantilla,
  RepositorioAdministracion,
  ResultadoEliminarSuperadmin,
  RolAdministracion,
  ServicioCifradoAdministracion,
  SuperadminAdministrable,
  TenantQlikAdministrable,
  UsuarioAdministrable,
} from "../aplicacion/puertos/repositorio-administracion.js";
import {
  eliminarConfiguracionOauth,
  guardarConfiguracionOauth,
  obtenerConfiguracionOauth,
} from "./consulta-configuracion-oauth-postgres.js";
import { ConsultaOrganizacion } from "./consulta-organizacion-postgres.js";
import { ConsultaTenantQlik } from "./consulta-tenant-qlik-postgres.js";
import { ConsultaUsuario } from "./consulta-usuario-postgres.js";

type DbType = ConexionDb;

export class RepositorioAdministracionPostgres
  implements RepositorioAdministracion
{
  constructor(
    private readonly db: DbType,
    private readonly cifrado: ServicioCifradoAdministracion,
  ) {}

  async listarOrganizaciones() {
    return ConsultaOrganizacion.listarOrganizaciones(this.db);
  }

  async obtenerOrganizacion(id: string) {
    return ConsultaOrganizacion.obtenerOrganizacion(this.db, id);
  }

  async crearOrganizacion(nombre: string) {
    return ConsultaOrganizacion.crearOrganizacion(this.db, nombre);
  }

  async actualizarOrganizacion(
    id: string,
    cambios: { nombre?: string; estado?: EstadoOrganizacion },
  ) {
    return ConsultaOrganizacion.actualizarOrganizacion(this.db, id, cambios);
  }

  async eliminarOrganizacion(id: string) {
    return ConsultaOrganizacion.eliminarOrganizacion(this.db, id);
  }

  async listarUsuarios(
    organizacionId: string,
  ): Promise<UsuarioAdministrable[]> {
    return ConsultaUsuario.listarUsuarios(this.db, organizacionId);
  }

  async agregarUsuario(
    organizacionId: string,
    correo: string,
    rol: RolAdministracion,
  ) {
    return ConsultaUsuario.agregarUsuario(
      this.db,
      organizacionId,
      correo,
      rol,
      (id) => this.obtenerOrganizacion(id),
    );
  }

  async actualizarRolUsuario(
    organizacionId: string,
    usuarioId: string,
    rol: RolAdministracion,
  ) {
    return ConsultaUsuario.actualizarRolUsuario(
      this.db,
      organizacionId,
      usuarioId,
      rol,
    );
  }

  async eliminarUsuario(organizacionId: string, usuarioId: string) {
    return ConsultaUsuario.eliminarUsuario(this.db, organizacionId, usuarioId);
  }

  async listarTenantsQlik(
    organizacionId: string,
  ): Promise<TenantQlikAdministrable[]> {
    return ConsultaTenantQlik.listarTenantsQlik(this.db, organizacionId);
  }

  async crearTenantQlik(entrada: {
    organizacionId: string;
    tenantIdQlik?: string;
    host: string;
    nombre?: string;
  }): Promise<TenantQlikAdministrable | null> {
    return ConsultaTenantQlik.crearTenantQlik(this.db, entrada, (id) =>
      this.obtenerOrganizacion(id),
    );
  }

  async marcarTenantQlikPrincipal(
    organizacionId: string,
    tenantQlikId: string,
  ): Promise<TenantQlikAdministrable | null> {
    return ConsultaTenantQlik.marcarTenantQlikPrincipal(
      this.db,
      organizacionId,
      tenantQlikId,
    );
  }

  async configurarAutomatizacionBase(
    organizacionId: string,
    tenantQlikId: string,
    automatizacionBaseIdQlik: string,
    automatizacionBaseNombre?: string,
  ): Promise<TenantQlikAdministrable | null> {
    return ConsultaTenantQlik.configurarAutomatizacionBase(
      this.db,
      organizacionId,
      tenantQlikId,
      automatizacionBaseIdQlik,
      automatizacionBaseNombre,
    );
  }

  async configurarPlantillaAutomatizacion(
    organizacionId: string,
    tenantQlikId: string,
    modo: ModoPlantilla,
    automatizacionBaseIdQlik: string,
    automatizacionBaseNombre?: string,
  ): Promise<TenantQlikAdministrable | null> {
    return ConsultaTenantQlik.configurarPlantillaAutomatizacion(
      this.db,
      organizacionId,
      tenantQlikId,
      modo,
      automatizacionBaseIdQlik,
      automatizacionBaseNombre,
    );
  }

  async obtenerModoAutomatizacionGlobal(): Promise<{
    modoAutomatizacionActivo: ModoPlantilla;
  }> {
    const fila = await this.db.query.configuracionesPlataforma.findFirst({
      where: eq(configuracionesPlataforma.id, 1),
    });
    const rawModo = fila?.modoAutomatizacionActivo ?? 1;
    const modoValido: ModoPlantilla =
      rawModo === 1 || rawModo === 2 ? rawModo : 1;
    return { modoAutomatizacionActivo: modoValido };
  }

  async actualizarModoAutomatizacionGlobal(
    modo: ModoPlantilla,
    usuarioId?: string,
  ): Promise<{ modoAutomatizacionActivo: ModoPlantilla }> {
    const existente = await this.db.query.configuracionesPlataforma.findFirst({
      where: eq(configuracionesPlataforma.id, 1),
    });

    if (!existente) {
      const [nueva] = await this.db
        .insert(configuracionesPlataforma)
        .values({
          id: 1,
          modoAutomatizacionActivo: modo,
          actualizadoPorUsuarioId: usuarioId ?? null,
        })
        .returning();
      const rawModo = nueva.modoAutomatizacionActivo;
      const modoValido: ModoPlantilla =
        rawModo === 1 || rawModo === 2 ? rawModo : 1;
      return { modoAutomatizacionActivo: modoValido };
    }

    const [actualizada] = await this.db
      .update(configuracionesPlataforma)
      .set({
        modoAutomatizacionActivo: modo,
        actualizadoEn: new Date(),
        actualizadoPorUsuarioId: usuarioId ?? null,
      })
      .where(eq(configuracionesPlataforma.id, 1))
      .returning();

    const rawModo = actualizada.modoAutomatizacionActivo;
    const modoValido: ModoPlantilla =
      rawModo === 1 || rawModo === 2 ? rawModo : 1;
    return { modoAutomatizacionActivo: modoValido };
  }

  async configurarDestinoTenant(
    organizacionId: string,
    tenantQlikId: string,
    destinoApiUrl: string,
    destinoApiKey?: string,
    destinoBaseDatos?: string,
  ): Promise<TenantQlikAdministrable | null> {
    return ConsultaTenantQlik.configurarDestinoTenant(
      this.db,
      this.cifrado,
      organizacionId,
      tenantQlikId,
      destinoApiUrl,
      destinoApiKey,
      destinoBaseDatos,
    );
  }

  async configurarImpalaTenant(
    organizacionId: string,
    tenantQlikId: string,
    datos: {
      impalaHost: string;
      impalaPort?: number;
      impalaAuthMechanism?: string;
      impalaUser?: string;
      impalaPassword?: string;
      impalaDatabase?: string;
    },
  ): Promise<TenantQlikAdministrable | null> {
    return ConsultaTenantQlik.configurarImpalaTenant(
      this.db,
      this.cifrado,
      organizacionId,
      tenantQlikId,
      datos,
    );
  }

  async eliminarTenantQlik(organizacionId: string, tenantQlikId: string) {
    return ConsultaTenantQlik.eliminarTenantQlik(
      this.db,
      organizacionId,
      tenantQlikId,
    );
  }

  async obtenerConfiguracionOAuth(
    organizacionId: string,
    tenantQlikId: string,
  ) {
    return obtenerConfiguracionOauth(this.db, organizacionId, tenantQlikId);
  }

  async guardarConfiguracionOAuth(
    organizacionId: string,
    tenantQlikId: string,
    entrada: EntradaGuardarConfiguracionOauth,
  ) {
    return guardarConfiguracionOauth(
      this.db,
      this.cifrado,
      organizacionId,
      tenantQlikId,
      entrada,
    );
  }

  async eliminarConfiguracionOAuth(
    organizacionId: string,
    tenantQlikId: string,
  ) {
    return eliminarConfiguracionOauth(this.db, organizacionId, tenantQlikId);
  }

  async listarSuperadmins(): Promise<SuperadminAdministrable[]> {
    const rows = await this.db.query.usuarios.findMany({
      where: eq(usuarios.esSuperadmin, true),
    });
    return rows.map((u) => ({
      id: u.id,
      nombre: u.nombre,
      correo: u.correo,
      estado: u.estado as "activo" | "suspendido",
      esSuperadmin: u.esSuperadmin,
      creadoEn: u.creadoEn,
    }));
  }

  async agregarSuperadmin(entrada: {
    nombre: string;
    correo: string;
  }): Promise<SuperadminAdministrable | null> {
    const existente = await this.db.query.usuarios.findFirst({
      where: eq(usuarios.correo, entrada.correo.toLowerCase()),
    });

    if (existente) {
      if (existente.esSuperadmin) {
        throw new Error("Ya existe un superadministrador con este correo");
      }
      const [actualizado] = await this.db
        .update(usuarios)
        .set({
          nombre: entrada.nombre,
          estado: "activo",
          esSuperadmin: true,
          actualizadoEn: new Date(),
        })
        .where(eq(usuarios.id, existente.id))
        .returning();
      if (!actualizado) return null;
      return {
        id: actualizado.id,
        nombre: actualizado.nombre,
        correo: actualizado.correo,
        estado: actualizado.estado as "activo" | "suspendido",
        esSuperadmin: actualizado.esSuperadmin,
        creadoEn: actualizado.creadoEn,
      };
    }

    const [nuevo] = await this.db
      .insert(usuarios)
      .values({
        nombre: entrada.nombre,
        correo: entrada.correo.toLowerCase(),
        estado: "activo",
        esSuperadmin: true,
      })
      .returning();
    if (!nuevo) return null;
    return {
      id: nuevo.id,
      nombre: nuevo.nombre,
      correo: nuevo.correo,
      estado: nuevo.estado as "activo" | "suspendido",
      esSuperadmin: nuevo.esSuperadmin,
      creadoEn: nuevo.creadoEn,
    };
  }

  async eliminarSuperadmin(id: string): Promise<ResultadoEliminarSuperadmin> {
    const superadmin = await this.db.query.usuarios.findFirst({
      where: eq(usuarios.id, id),
    });

    if (!superadmin) {
      return {
        exito: false,
        mensaje: "Superadministrador no encontrado",
        codigo: "NO_ENCONTRADO",
      };
    }

    if (!superadmin.esSuperadmin) {
      return {
        exito: false,
        mensaje: "El usuario no es un superadministrador",
        codigo: "NO_ES_SUPERADMIN",
      };
    }

    const todosSuperadmins = await this.db.query.usuarios.findMany({
      where: eq(usuarios.esSuperadmin, true),
    });

    if (todosSuperadmins.length <= 1) {
      return {
        exito: false,
        mensaje: "No puedes eliminar al último superadministrador",
        codigo: "ULTIMO_SUPERADMIN",
      };
    }

    await this.db
      .update(usuarios)
      .set({
        esSuperadmin: false,
        estado: "suspendido",
        actualizadoEn: new Date(),
      })
      .where(eq(usuarios.id, id));

    return { exito: true };
  }
}
