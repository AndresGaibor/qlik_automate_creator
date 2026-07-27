import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { Button } from "@/compartido/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { type EntradaSetup, completarSetup } from "@/modulos/setup/api";
import { useState } from "react";

const PASOS = [
  {
    numero: 1,
    titulo: "Organización",
    descripcion: "Nombre de tu organización",
  },
  {
    numero: 2,
    titulo: "Conexión Qlik",
    descripcion: "Configura tu tenant de Qlik Cloud",
  },
  {
    numero: 3,
    titulo: "Administrador",
    descripcion: "Datos del superadministrador",
  },
];

interface FormularioData {
  organizacionNombre: string;
  qlikTenantHost: string;
  qlikClientId: string;
  qlikClientSecret: string;
  qlikScopes: string[];
  superadminNombre: string;
  superadminCorreo: string;
  qlikRedirectUri: string;
}

const SCOPES_POR_DEFECTO = [
  "audit-log:read",
  "automation:read",
  "automation:write",
  "connector:read",
  "custom-extensions:read",
  "custom-extensions:write",
  "data-connection:read",
  "data-connection:write",
  "fs-template:read",
  "fs-template:write",
  "job-scheduler:read",
  "job-scheduler:write",
  "library-item:read",
  "library-item:write",
  "report:read",
  "report:write",
  "shared-spaces:read",
  "shared-spaces:write",
  "user:read",
];

function calcularRedirectUri(): string {
  if (typeof window !== "undefined") {
    const protocolo = window.location.protocol === "https:" ? "https" : "http";
    const puerto = window.location.port ? `:${window.location.port}` : "";
    return `${protocolo}://${window.location.hostname}${puerto}/api/auth/qlik/callback`;
  }
  return "http://localhost:3000/api/auth/qlik/callback";
}

const estadoInicial: FormularioData = {
  organizacionNombre: "",
  qlikTenantHost: "",
  qlikClientId: "",
  qlikClientSecret: "",
  qlikScopes: SCOPES_POR_DEFECTO,
  superadminNombre: "",
  superadminCorreo: "",
  qlikRedirectUri: calcularRedirectUri(),
};

export function PaginaSetup() {
  const { mostrarExito, mostrarError } = useNotificaciones();
  const [paso, setPaso] = useState(1);
  const [formulario, setFormulario] = useState<FormularioData>(estadoInicial);
  const [enviando, setEnviando] = useState(false);

  const actualizarCampo = <K extends keyof FormularioData>(
    campo: K,
    valor: FormularioData[K],
  ) => {
    setFormulario((anterior) => ({ ...anterior, [campo]: valor }));
  };

  const validarPaso1 = () => {
    if (
      !formulario.organizacionNombre.trim() ||
      formulario.organizacionNombre.trim().length < 2
    ) {
      mostrarError(
        "El nombre de la organización debe tener al menos 2 caracteres",
      );
      return false;
    }
    return true;
  };

  const validarPaso2 = () => {
    if (!formulario.qlikTenantHost.trim()) {
      mostrarError("La dirección del tenant de Qlik Cloud es obligatoria");
      return false;
    }
    if (!formulario.qlikClientId.trim()) {
      mostrarError("El Client ID de OAuth es obligatorio");
      return false;
    }
    if (!formulario.qlikClientSecret.trim()) {
      mostrarError("El Client Secret de OAuth es obligatorio");
      return false;
    }
    if (formulario.qlikScopes.length === 0) {
      mostrarError("Debes configurar al menos un scope de OAuth");
      return false;
    }
    return true;
  };

  const validarPaso3 = () => {
    if (
      !formulario.superadminNombre.trim() ||
      formulario.superadminNombre.trim().length < 2
    ) {
      mostrarError(
        "El nombre del administrador debe tener al menos 2 caracteres",
      );
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formulario.superadminCorreo)) {
      mostrarError("El correo electrónico del administrador no es válido");
      return false;
    }
    return true;
  };

  const handleSiguiente = () => {
    if (paso === 1 && !validarPaso1()) return;
    if (paso === 2 && !validarPaso2()) return;
    setPaso((p) => Math.min(p + 1, 3));
  };

  const handleAnterior = () => {
    setPaso((p) => Math.max(p - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarPaso3()) return;

    setEnviando(true);
    try {
      const datos: EntradaSetup = {
        organizacionNombre: formulario.organizacionNombre.trim(),
        qlikTenantHost: formulario.qlikTenantHost.trim(),
        qlikClientId: formulario.qlikClientId.trim(),
        qlikClientSecret: formulario.qlikClientSecret.trim(),
        qlikScopes: formulario.qlikScopes,
        superadminNombre: formulario.superadminNombre.trim(),
        superadminCorreo: formulario.superadminCorreo.trim().toLowerCase(),
        frontendUrl: window.location.origin,
      };

      const resultado = await completarSetup(datos);

      if (resultado.organizacionId && resultado.tenantQlikId) {
        mostrarExito("Configuración completada exitosamente");
        window.location.href = "/login";
      } else {
        mostrarError("La respuesta del servidor no fue la esperada");
      }
    } catch (err) {
      const mensaje =
        err instanceof Error
          ? err.message
          : "Error al guardar la configuración";
      mostrarError(mensaje);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-xl shadow-lg border-gray-200">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg
              className="w-10 h-10 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-label="Configuración"
            >
              <title>Configuración</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Configuración Inicial
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Completa los pasos para configurar tu aplicación
          </p>

          <div className="flex items-center justify-center gap-2 mt-6">
            {PASOS.map((p) => (
              <div key={p.numero} className="flex items-center">
                <div
                  className={[
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                    paso === p.numero
                      ? "bg-blue-600 text-white ring-4 ring-blue-100"
                      : paso > p.numero
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500",
                  ].join(" ")}
                >
                  {paso > p.numero ? "✓" : p.numero}
                </div>
                {p.numero < 3 && (
                  <div
                    className={[
                      "w-12 h-1 mx-1 rounded",
                      paso > p.numero ? "bg-green-500" : "bg-gray-200",
                    ].join(" ")}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-8 mt-2">
            {PASOS.map((p) => (
              <span
                key={p.numero}
                className={[
                  "text-xs",
                  paso === p.numero
                    ? "text-blue-600 font-medium"
                    : "text-gray-400",
                ].join(" ")}
              >
                {p.titulo}
              </span>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {paso === 1 && (
              <fieldset className="space-y-4">
                <legend className="text-lg font-medium text-gray-900 mb-4">
                  Información de la Organización
                </legend>

                <div>
                  <label
                    htmlFor="organizacionNombre"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre de la Organización
                  </label>
                  <input
                    id="organizacionNombre"
                    type="text"
                    required
                    value={formulario.organizacionNombre}
                    onChange={(e) =>
                      actualizarCampo("organizacionNombre", e.target.value)
                    }
                    placeholder="Mi Empresa S.A."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Este nombre se usará para identificar tu organización en el
                    sistema.
                  </p>
                </div>
              </fieldset>
            )}

            {paso === 2 && (
              <fieldset className="space-y-4">
                <legend className="text-lg font-medium text-gray-900 mb-4">
                  Configuración de Qlik Cloud
                </legend>

                <div>
                  <label
                    htmlFor="qlikTenantHost"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Dirección del Tenant de Qlik Cloud
                  </label>
                  <input
                    id="qlikTenantHost"
                    type="text"
                    required
                    value={formulario.qlikTenantHost}
                    onChange={(e) =>
                      actualizarCampo("qlikTenantHost", e.target.value)
                    }
                    placeholder="empresa.us.qlikcloud.com"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="qlikClientId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Client ID de OAuth
                  </label>
                  <input
                    id="qlikClientId"
                    type="text"
                    required
                    value={formulario.qlikClientId}
                    onChange={(e) =>
                      actualizarCampo("qlikClientId", e.target.value)
                    }
                    placeholder="Client ID de tu aplicación OAuth en Qlik Cloud"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="qlikClientSecret"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Client Secret de OAuth
                  </label>
                  <input
                    id="qlikClientSecret"
                    type="password"
                    required
                    value={formulario.qlikClientSecret}
                    onChange={(e) =>
                      actualizarCampo("qlikClientSecret", e.target.value)
                    }
                    placeholder="Client Secret de tu aplicación OAuth"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <fieldset>
                  <legend className="block text-sm font-medium text-gray-700 mb-2">
                    Scopes de OAuth
                  </legend>
                  <div className="bg-gray-50 rounded-md border border-gray-200 p-3 max-h-40 overflow-y-auto space-y-1">
                    {formulario.qlikScopes.map((scope) => (
                      <label
                        key={scope}
                        className="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <input
                          type="checkbox"
                          checked={formulario.qlikScopes.includes(scope)}
                          onChange={() => {
                            if (formulario.qlikScopes.includes(scope)) {
                              actualizarCampo(
                                "qlikScopes",
                                formulario.qlikScopes.filter(
                                  (s) => s !== scope,
                                ),
                              );
                            } else {
                              actualizarCampo("qlikScopes", [
                                ...formulario.qlikScopes,
                                scope,
                              ]);
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600"
                        />
                        <span className="font-mono text-xs">{scope}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Selecciona los scopes que necesita tu aplicación.
                  </p>
                </fieldset>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-xs font-medium text-blue-800 mb-1">
                    URI de redirección OAuth
                  </p>
                  <p className="text-xs text-blue-700 mb-2">
                    Configura esta URL en tu aplicación OAuth de Qlik Cloud:
                  </p>
                  <code className="block bg-white border border-blue-200 rounded px-2 py-1 text-xs font-mono text-gray-800 break-all">
                    {formulario.qlikRedirectUri}
                  </code>
                </div>
              </fieldset>
            )}

            {paso === 3 && (
              <fieldset className="space-y-4">
                <legend className="text-lg font-medium text-gray-900 mb-4">
                  Datos del Superadministrador
                </legend>

                <div>
                  <label
                    htmlFor="superadminNombre"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Nombre Completo
                  </label>
                  <input
                    id="superadminNombre"
                    type="text"
                    required
                    value={formulario.superadminNombre}
                    onChange={(e) =>
                      actualizarCampo("superadminNombre", e.target.value)
                    }
                    placeholder="Juan Pérez"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="superadminCorreo"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Correo Electrónico
                  </label>
                  <input
                    id="superadminCorreo"
                    type="email"
                    required
                    value={formulario.superadminCorreo}
                    onChange={(e) =>
                      actualizarCampo("superadminCorreo", e.target.value)
                    }
                    placeholder="juan@empresa.com"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Usa el mismo correo que configurarás en tu cliente OAuth de
                    Qlik.
                  </p>
                </div>
              </fieldset>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
              {paso > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAnterior}
                >
                  ← Anterior
                </Button>
              ) : (
                <div />
              )}

              {paso < 3 ? (
                <Button type="button" onClick={handleSiguiente}>
                  Siguiente →
                </Button>
              ) : (
                <Button type="submit" disabled={enviando}>
                  {enviando ? "Guardando…" : "Completar Configuración"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
