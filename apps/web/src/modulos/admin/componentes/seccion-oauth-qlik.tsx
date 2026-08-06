import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { Icon } from "@/compartido/componentes/ui/icon";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import type { TenantQlik } from "../api";
import { TarjetaOauthTenant } from "./tarjeta-oauth-tenant";

interface Props {
  organizacionId: string;
  tenantsQlik: TenantQlik[];
}

export function SeccionOauthQlik({ organizacionId, tenantsQlik }: Props) {
  const queryClient = useQueryClient();
  const { mostrarError, mostrarExito } = useNotificaciones();

  useEffect(() => {
    const parametros = new URLSearchParams(window.location.search);
    const verificado = parametros.get("oauth_verificado");
    const error = parametros.get("oauth_error");
    if (!verificado && !error) return;

    if (verificado) {
      mostrarExito("Conexión OAuth con Qlik verificada");
      queryClient.invalidateQueries({ queryKey: ["admin-oauth-qlik"] });
    } else if (error) {
      mostrarError("No se pudo verificar la conexión OAuth con Qlik");
    }
    history.replaceState(null, "", window.location.pathname);
  }, [mostrarError, mostrarExito, queryClient]);

  if (tenantsQlik.length === 0) return null;

  return (
    <Card className="border-line-200 bg-surface shadow-card">
      <CardHeader className="border-b border-line-200 bg-app/30 pb-4">
        <CardTitle className="flex items-center gap-2 font-display text-lg font-semibold text-ink-900">
          <Icon name="gear" className="text-obj-600" />
          Acceso OAuth de Qlik
        </CardTitle>
        <p className="mt-1 text-xs text-ink-500">
          Cada entorno Qlik utiliza su propio cliente OAuth. El secreto se cifra
          antes de guardarse y nunca vuelve a mostrarse.
        </p>
      </CardHeader>
      <CardContent className="space-y-5 pt-6">
        {tenantsQlik.map((tenant) => (
          <TarjetaOauthTenant
            key={tenant.id}
            organizacionId={organizacionId}
            tenant={tenant}
          />
        ))}
      </CardContent>
    </Card>
  );
}
