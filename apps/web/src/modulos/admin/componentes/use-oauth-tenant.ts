import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { iniciarVerificacionOauth } from "@/modulos/autenticacion/publico";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { TenantQlik } from "../api";
import {
  guardarConfiguracionOauthTenant,
  obtenerConfiguracionOauthTenant,
} from "../api";
import { normalizarScopesOauth, puedeGuardarOauth } from "./oauth-formulario";

const SCOPES_RECOMENDADOS = [
  "user_default",
  "offline_access",
  "identity.name:read",
  "identity.email:read",
  "identity.subject:read",
  "identity.picture:read",
  "automations",
  "automations.private",
  "automations.shared",
  "spaces:read",
  "apps:read",
  "data-integration",
];

export function useOauthTenant(organizacionId: string, tenant: TenantQlik) {
  const queryClient = useQueryClient();
  const { mostrarError, mostrarExito } = useNotificaciones();
  const [editando, setEditando] = useState(false);
  const [clienteId, setClienteId] = useState("");
  const [clienteSecreto, setClienteSecreto] = useState("");
  const [scopesTexto, setScopesTexto] = useState(
    SCOPES_RECOMENDADOS.join("\n"),
  );
  const queryKey = ["admin-oauth-qlik", organizacionId, tenant.id] as const;
  const consulta = useQuery({
    queryKey,
    queryFn: () => obtenerConfiguracionOauthTenant(organizacionId, tenant.id),
  });

  useEffect(() => {
    if (!consulta.data) return;
    setClienteId(consulta.data.clienteId ?? "");
    setScopesTexto(
      (consulta.data.scopes.length
        ? consulta.data.scopes
        : SCOPES_RECOMENDADOS
      ).join("\n"),
    );
  }, [consulta.data]);

  const guardar = useMutation({
    mutationFn: async (conectar: boolean) => {
      const scopes = normalizarScopesOauth(scopesTexto);
      const existeConfiguracionPropia = consulta.data?.origen === "tenant";
      if (
        !puedeGuardarOauth({
          clienteId,
          scopes,
          clienteSecreto,
          existeConfiguracionPropia,
        })
      ) {
        throw new Error(
          existeConfiguracionPropia
            ? "Ingresa el Client ID y al menos un scope OAuth"
            : "La primera configuración requiere Client ID, scopes y secreto",
        );
      }

      const configuracion = await guardarConfiguracionOauthTenant(
        organizacionId,
        tenant.id,
        {
          clienteId: clienteId.trim(),
          ...(clienteSecreto ? { clienteSecreto } : {}),
          scopes,
        },
      );
      setClienteSecreto("");
      if (conectar) {
        const inicio = await iniciarVerificacionOauth(
          tenant.host,
          "/configuracion",
        );
        if (!inicio.exito || !inicio.datos?.url) {
          throw new Error(
            inicio.error?.mensaje ?? "No se pudo iniciar la verificación OAuth",
          );
        }
        window.location.href = inicio.datos.url;
      }
      return configuracion;
    },
    onSuccess: (_configuracion, conectar) => {
      setClienteSecreto("");
      queryClient.invalidateQueries({ queryKey });
      if (!conectar) {
        setEditando(false);
        mostrarExito("Configuración OAuth guardada");
      }
    },
    onError: (error: Error) => mostrarError(error.message),
  });

  const scopes = normalizarScopesOauth(scopesTexto);
  const existeConfiguracionPropia = consulta.data?.origen === "tenant";
  const configurada =
    existeConfiguracionPropia && Boolean(consulta.data?.clienteId);

  return {
    consulta,
    editando,
    configurada,
    clienteId,
    clienteSecreto,
    scopesTexto,
    habilitado: puedeGuardarOauth({
      clienteId,
      scopes,
      clienteSecreto,
      existeConfiguracionPropia,
    }),
    guardando: guardar.isPending,
    setClienteId,
    setClienteSecreto,
    setScopesTexto,
    editar: () => setEditando(true),
    cancelar: () => setEditando(false),
    guardar: (conectar: boolean) => guardar.mutate(conectar),
    copiarRedirect: async () => {
      const redirectUri = consulta.data?.redirectUri;
      if (!redirectUri) return;
      await navigator.clipboard.writeText(redirectUri);
      mostrarExito("URL de redirección copiada");
    },
  };
}
