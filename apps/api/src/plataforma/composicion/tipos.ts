import type { Context } from "hono";
import type {
  RepositorioAdministracion,
  ResolverContextoAdmin,
} from "../../modulos/admin/publico.js";
import type {
  RepositorioAutenticacion,
  ServicioAutenticacionQlik,
} from "../../modulos/autenticacion-qlik/publico.js";
import type { PuertoCatalogoDestinos } from "../../modulos/destinos/publico.js";
import type { ServicioQlik } from "../../modulos/qlik/publico.js";
import type { PuertoAuditoria } from "../../nucleo/auditoria/puerto-auditoria.js";
import type { PuertoOutbox } from "../../nucleo/eventos/puerto-outbox.js";
import type { PuertoIdempotencia } from "../../nucleo/idempotencia/puerto-idempotencia.js";
import type { ConfiguracionAplicacion } from "../configuracion/entorno.js";
import type { Registrador } from "../observabilidad/registrador.js";

export interface SesionResuelta {
  tenantId: string;
  usuarioId: string;
  organizacionId: string;
  esSuperadmin?: boolean;
  roles?: string[];
}

export interface DependenciasAplicacion {
  configuracion?: ConfiguracionAplicacion;
  registrador?: Registrador;
  repositorioAutenticacion?: RepositorioAutenticacion;
  servicioAutenticacion?: ServicioAutenticacionQlik;
  resolverQlik?: (c: Context) => Promise<ServicioQlik>;
  resolverSesion?: (c: Context) => Promise<SesionResuelta>;
  catalogoDestinos?: PuertoCatalogoDestinos;
  idempotencia?: PuertoIdempotencia;
  outbox?: PuertoOutbox;
  auditoria?: PuertoAuditoria;
  repositorioAdministracion?: RepositorioAdministracion;
  resolverContextoAdmin?: ResolverContextoAdmin;
}
