import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { Button } from "@/compartido/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { useEffect, useState } from "react";

// Mensajes seguros permitidos (mapeo de errores del backend)
const MENSAJES_PERMITIDOS: Record<string, string> = {
  identity_scope_error:
    "No se pudo obtener tu identidad de Qlik. Verifica los scopes del OAuth client.",
  login_failed: "No se pudo completar el inicio de sesión.",
};

function obtenerMensajeSeguro(errorParam: string): string {
  const decoded = decodeURIComponent(errorParam);
  return (
    MENSAJES_PERMITIDOS[decoded] ?? "No se pudo completar el inicio de sesión."
  );
}

export function PaginaLogin() {
  const { mostrarError } = useNotificaciones();
  const [errorOAuth, setErrorOAuth] = useState<string | null>(null);
  const [hostTenant, setHostTenant] = useState("");

  // Procesar oauth_error de la URL al montar
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get("oauth_error");

    if (oauthError) {
      const mensaje = obtenerMensajeSeguro(oauthError);
      mostrarError(mensaje);
      setErrorOAuth(mensaje);
      // Limpiar el query param sin recargar
      const cleanUrl = window.location.pathname;
      history.replaceState(null, "", cleanUrl);
    }
  }, [mostrarError]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
        </CardHeader>
        <CardContent>
          {errorOAuth && (
            <div
              role="alert"
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm"
            >
              <p className="font-medium">Error de autenticación</p>
              <p>{errorOAuth}</p>
            </div>
          )}
          <p className="text-sm text-gray-600 mb-4">
            Esta aplicación usa autenticación OAuth de Qlik. Inicia sesión con
            tu cuenta de Qlik Cloud.
          </p>
          <label
            htmlFor="host-tenant-qlik"
            className="mb-4 block text-sm font-medium text-gray-700"
          >
            Host del tenant Qlik
            <input
              id="host-tenant-qlik"
              type="text"
              value={hostTenant}
              onChange={(evento) => setHostTenant(evento.target.value)}
              placeholder="empresa.eu.qlikcloud.com"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </label>
          <Button
            className="w-full"
            disabled={!hostTenant.trim()}
            onClick={() => {
              window.location.href = `/api/auth/qlik/iniciar?host=${encodeURIComponent(
                hostTenant.trim(),
              )}`;
            }}
          >
            Iniciar sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
