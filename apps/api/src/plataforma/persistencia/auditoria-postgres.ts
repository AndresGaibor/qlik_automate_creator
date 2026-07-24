import type { PuertoAuditoria } from "../../nucleo/auditoria/puerto-auditoria.js";
import type { RegistroAuditoria } from "../../nucleo/auditoria/registro-auditoria.js";
import { db } from "./conexion.js";
import { auditoriaEventos } from "./esquema.js";

export class AuditoriaPostgres implements PuertoAuditoria {
  async registrar(registro: RegistroAuditoria): Promise<void> {
    await db.insert(auditoriaEventos).values(registro);
  }
}
