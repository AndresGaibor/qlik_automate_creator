import type { TenantQlik } from "../api";
import { FormularioOauthTenant } from "./formulario-oauth-tenant";
import { ResumenOauth } from "./resumen-oauth";
import { useOauthTenant } from "./use-oauth-tenant";

export function TarjetaOauthTenant({
  organizacionId,
  tenant,
}: {
  organizacionId: string;
  tenant: TenantQlik;
}) {
  const oauth = useOauthTenant(organizacionId, tenant);

  if (oauth.configurada && oauth.consulta.data && !oauth.editando) {
    return (
      <ResumenOauth
        tenant={tenant}
        configuracion={oauth.consulta.data}
        verificando={oauth.guardando}
        onEditar={oauth.editar}
        onVerificar={() => oauth.guardar(true)}
      />
    );
  }

  return (
    <FormularioOauthTenant
      tenant={tenant}
      configuracion={oauth.consulta.data}
      cargando={oauth.consulta.isLoading}
      clienteId={oauth.clienteId}
      clienteSecreto={oauth.clienteSecreto}
      scopesTexto={oauth.scopesTexto}
      habilitado={oauth.habilitado}
      guardando={oauth.guardando}
      onClienteId={oauth.setClienteId}
      onClienteSecreto={oauth.setClienteSecreto}
      onScopesTexto={oauth.setScopesTexto}
      onGuardar={oauth.guardar}
      onCancelar={oauth.configurada ? oauth.cancelar : undefined}
      onCopiar={oauth.copiarRedirect}
    />
  );
}
