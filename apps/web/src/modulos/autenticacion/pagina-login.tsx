import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { Button } from "@/compartido/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import {
  iniciarSesion,
  iniciarSesionPorCorreo,
} from "@/modulos/autenticacion/api";
import { useEffect, useState } from "react";

// Mensajes seguros permitidos (mapeo de errores del backend)
const MENSAJES_PERMITIDOS: Record<string, string> = {
  user_not_found:
    "Tu correo electrónico no está registrado en el sistema. Contacta al administrador para solicitar acceso.",
  tenant_not_found:
    "El tenant de Qlik especificado no está registrado o se encuentra inactivo.",
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
  const [correo, setCorreo] = useState("");
  const [hostManual, setHostManual] = useState("");
  const [modoAvanzado, setModoAvanzado] = useState(false);

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

  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorOAuth(null);
    setCargando(true);

    try {
      const data = modoAvanzado
        ? await iniciarSesion(hostManual.trim())
        : await iniciarSesionPorCorreo(correo.trim());

      if (!data.exito || !data.datos?.url) {
        const msg =
          data.error?.mensaje ??
          "Tu correo no está registrado en el sistema. Contacta al administrador para solicitar acceso.";
        setErrorOAuth(msg);
        mostrarError(msg);
        setCargando(false);
        return;
      }

      window.location.href = data.datos.url;
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Error al conectar con el servidor";
      setErrorOAuth(msg);
      mostrarError(msg);
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Iniciar sesión
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Usa tu correo corporativo y te redirigiremos automáticamente a tu
            entorno de Qlik Cloud.
          </p>
        </CardHeader>
        <CardContent>
          {errorOAuth && (
            <div
              role="alert"
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm"
            >
              <p className="font-medium">No pudimos iniciar sesión</p>
              <p>{errorOAuth}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!modoAvanzado ? (
              <div>
                <label
                  htmlFor="correo-usuario"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Correo Electrónico
                </label>
                <input
                  id="correo-usuario"
                  type="email"
                  required
                  value={correo}
                  onChange={(evento) => setCorreo(evento.target.value)}
                  placeholder="usuario@empresa.com"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            ) : (
              <div>
                <label
                  htmlFor="host-tenant-qlik"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Dirección del entorno Qlik Cloud
                </label>
                <input
                  id="host-tenant-qlik"
                  type="text"
                  required
                  value={hostManual}
                  onChange={(evento) => setHostManual(evento.target.value)}
                  placeholder="empresa.eu.qlikcloud.com (ej: miempresa.us.qlikcloud.com)"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition"
              disabled={
                cargando || (modoAvanzado ? !hostManual.trim() : !correo.trim())
              }
            >
              {cargando
                ? "Redirigiendo a Qlik Cloud…"
                : "Continuar con Qlik Cloud →"}
            </Button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setModoAvanzado(!modoAvanzado)}
                className="text-xs text-gray-500 hover:text-gray-700 underline"
              >
                {modoAvanzado
                  ? "← Volver a ingresar con correo"
                  : "¿Conoces la dirección de tu entorno Qlik? Ingrésala directamente"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
