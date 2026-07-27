export interface ContextoSesion {
  esSuperadmin: boolean;
  usuarioId?: string;
  membresias: Array<{
    organizacionId: string;
    organizacionNombre: string;
    rol: "admin" | "usuario";
  }>;
}

export class ServicioAdmin {
  puedeAcceder(sesion: ContextoSesion, organizacionId: string): boolean {
    if (sesion.esSuperadmin) return true;
    return sesion.membresias.some(
      (m) => m.organizacionId === organizacionId && m.rol === "admin",
    );
  }

  puedeListar(sesion: ContextoSesion): boolean {
    return sesion.esSuperadmin;
  }

  puedeCrear(sesion: ContextoSesion): boolean {
    return sesion.esSuperadmin;
  }

  puedeEliminar(sesion: ContextoSesion, organizacionId: string): boolean {
    if (sesion.esSuperadmin) return true;
    return sesion.membresias.some(
      (m) => m.organizacionId === organizacionId && m.rol === "admin",
    );
  }
}
