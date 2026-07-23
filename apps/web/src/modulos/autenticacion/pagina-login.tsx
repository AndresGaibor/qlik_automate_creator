import { useNotificaciones } from "@/componentes/feedback/notificaciones";
import { Button } from "@/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/componentes/ui/card";
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
          <Button asChild className="w-full">
            <a href="/api/auth/qlik/iniciar">Iniciar sesión</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
