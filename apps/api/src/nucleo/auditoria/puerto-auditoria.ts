import type { RegistroAuditoria } from "./registro-auditoria.js";

export interface PuertoAuditoria {
  registrar(evento: RegistroAuditoria): Promise<void>;
}
