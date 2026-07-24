export interface RegistroAuditoria {
  organizacionId: string;
  usuarioId?: string;
  accion: string;
  entidadTipo: string;
  entidadId?: string;
  resultado: "exito" | "error" | "denegado";
  datosAnteriores?: unknown;
  datosNuevos?: unknown;
  codigoError?: string;
  mensajeError?: string;
  ip?: string;
  agenteUsuario?: string;
  idSolicitud?: string;
}
