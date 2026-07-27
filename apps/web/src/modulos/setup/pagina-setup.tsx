import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { Button } from "@/compartido/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { Icon } from "@/compartido/componentes/ui/icon";
import { type EntradaSetup, completarSetup } from "@/modulos/setup/api";
import { SCOPES_OAUTH_PREDETERMINADOS } from "@/modulos/setup/scopes-oauth";
import { useState } from "react";

const PASOS = [
  { numero: 1, titulo: "Organización", descripcion: "Identificación" },
  { numero: 2, titulo: "Qlik Cloud", descripcion: "Credenciales OAuth" },
  { numero: 3, titulo: "Administrador", descripcion: "Acceso inicial" },
] as const;

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

function calcularRedirectUri(): string {
  if (typeof window !== "undefined") {
    const protocolo = window.location.protocol === "https:" ? "https" : "http";
    const puerto = window.location.port ? `:${window.location.port}` : "";
    return `${protocolo}://${window.location.hostname}${puerto}/api/auth/qlik/callback`;
  }
  return "http://localhost:3000/api/auth/qlik/callback";
}

function crearEstadoInicial(): FormularioData {
  return {
    organizacionNombre: "",
    qlikTenantHost: "",
    qlikClientId: "",
    qlikClientSecret: "",
    qlikScopes: [...SCOPES_OAUTH_PREDETERMINADOS],
    superadminNombre: "",
    superadminCorreo: "",
    qlikRedirectUri: calcularRedirectUri(),
  };
}

export function PaginaSetup() {
  const { mostrarExito, mostrarError } = useNotificaciones();
  const [paso, setPaso] = useState(1);
  const [formulario, setFormulario] =
    useState<FormularioData>(crearEstadoInicial);
  const [enviando, setEnviando] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState<string | null>(null);

  const actualizarCampo = <K extends keyof FormularioData>(
    campo: K,
    valor: FormularioData[K],
  ) => {
    setErrorFormulario(null);
    setFormulario((anterior) => ({ ...anterior, [campo]: valor }));
  };

  const informarError = (mensaje: string) => {
    setErrorFormulario(mensaje);
    mostrarError(mensaje);
    return false;
  };

  const validarPaso1 = () =>
    formulario.organizacionNombre.trim().length >= 2 ||
    informarError(
      "El nombre de la organización debe tener al menos 2 caracteres.",
    );

  const validarPaso2 = () => {
    if (!formulario.qlikTenantHost.trim()) {
      return informarError(
        "La dirección del tenant de Qlik Cloud es obligatoria.",
      );
    }
    if (!formulario.qlikClientId.trim()) {
      return informarError("El Client ID de OAuth es obligatorio.");
    }
    if (!formulario.qlikClientSecret.trim()) {
      return informarError("El Client Secret de OAuth es obligatorio.");
    }
    return (
      formulario.qlikScopes.length > 0 ||
      informarError("Debes configurar al menos un scope de OAuth.")
    );
  };

  const validarPaso3 = () => {
    if (formulario.superadminNombre.trim().length < 2) {
      return informarError(
        "El nombre del administrador debe tener al menos 2 caracteres.",
      );
    }
    return (
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.superadminCorreo) ||
      informarError("El correo electrónico del administrador no es válido.")
    );
  };

  const handleSiguiente = () => {
    const valido = paso === 1 ? validarPaso1() : validarPaso2();
    if (valido) setPaso((actual) => Math.min(actual + 1, PASOS.length));
  };

  const handleSubmit = async (evento: React.FormEvent) => {
    evento.preventDefault();
    if (!validarPaso3()) return;

    setEnviando(true);
    setErrorFormulario(null);
    try {
      const resultado = await completarSetup({
        organizacionNombre: formulario.organizacionNombre.trim(),
        qlikTenantHost: formulario.qlikTenantHost.trim(),
        qlikClientId: formulario.qlikClientId.trim(),
        qlikClientSecret: formulario.qlikClientSecret.trim(),
        qlikScopes: formulario.qlikScopes,
        superadminNombre: formulario.superadminNombre.trim(),
        superadminCorreo: formulario.superadminCorreo.trim().toLowerCase(),
        frontendUrl: window.location.origin,
      } satisfies EntradaSetup);

      if (!resultado.organizacionId || !resultado.tenantQlikId) {
        throw new Error(
          "La respuesta del servidor no contiene la configuración creada.",
        );
      }
      mostrarExito("La configuración inicial se guardó correctamente.");
      window.location.assign("/login");
    } catch (causa) {
      const mensaje =
        causa instanceof Error
          ? causa.message
          : "No se pudo guardar la configuración.";
      setErrorFormulario(mensaje);
      mostrarError(mensaje);
    } finally {
      setEnviando(false);
    }
  };

  const alternarScope = (scope: string) => {
    actualizarCampo(
      "qlikScopes",
      formulario.qlikScopes.includes(scope)
        ? formulario.qlikScopes.filter((actual) => actual !== scope)
        : [...formulario.qlikScopes, scope],
    );
  };

  return (
    <main className="min-h-screen bg-app px-4 py-8 sm:px-6 sm:py-12">
      <Card className="mx-auto w-full max-w-2xl border-line-200 shadow-sm">
        <CardHeader className="space-y-5 border-line-200 px-5 py-5 sm:px-8 sm:py-7">
          <div className="flex items-start gap-3">
            <Icon name="gear" size="md" className="mt-0.5 text-brand-700" />
            <div>
              <CardTitle className="text-xl text-ink-900">
                Configuración inicial
              </CardTitle>
              <p className="mt-1 text-sm text-ink-600">
                Registra la organización, las credenciales de Qlik Cloud y el
                acceso administrador.
              </p>
            </div>
          </div>

          <div
            aria-label={`Paso ${paso} de ${PASOS.length}`}
            className="space-y-2"
          >
            <div className="flex items-center justify-between text-xs font-medium text-ink-600">
              <span>Progreso</span>
              <span>
                {paso} de {PASOS.length}
              </span>
            </div>
            <div
              aria-valuemax={PASOS.length}
              aria-valuemin={1}
              aria-valuenow={paso}
              aria-valuetext={`Paso ${paso} de ${PASOS.length}: ${PASOS[paso - 1].titulo}`}
              className="h-2 overflow-hidden rounded-sm bg-line-200"
              role="progressbar"
              tabIndex={0}
            >
              <div
                className="h-full bg-brand-600 transition-[width]"
                style={{ width: `${(paso / PASOS.length) * 100}%` }}
              />
            </div>
            <ol
              className="grid grid-cols-3 gap-2"
              aria-label="Pasos de configuración"
            >
              {PASOS.map((item) => (
                <li
                  key={item.numero}
                  aria-current={paso === item.numero ? "step" : undefined}
                  className={
                    paso === item.numero ? "text-ink-900" : "text-ink-500"
                  }
                >
                  <span className="block text-xs font-semibold">
                    {item.numero}. {item.titulo}
                  </span>
                  <span className="hidden text-xs sm:block">
                    {item.descripcion}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </CardHeader>

        <CardContent className="px-5 py-6 sm:px-8">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {errorFormulario && (
              <div
                role="alert"
                className="border-l-4 border-danger-600 bg-danger-50 px-3 py-2 text-sm text-danger-800"
              >
                {errorFormulario}
              </div>
            )}

            {paso === 1 && (
              <fieldset className="space-y-4">
                <legend className="text-base font-semibold text-ink-900">
                  Organización
                </legend>
                <p className="-mt-2 text-sm text-ink-600">
                  Nombre con el que se identificará esta cuenta.
                </p>
                <div>
                  <label
                    htmlFor="organizacionNombre"
                    className="mb-1.5 block text-sm font-medium text-ink-700"
                  >
                    Nombre de la organización
                  </label>
                  <input
                    id="organizacionNombre"
                    type="text"
                    required
                    minLength={2}
                    autoComplete="organization"
                    value={formulario.organizacionNombre}
                    onChange={(evento) =>
                      actualizarCampo("organizacionNombre", evento.target.value)
                    }
                    placeholder="Empresa S. A."
                    className="w-full rounded-md border border-line-200 bg-surface px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                </div>
              </fieldset>
            )}

            {paso === 2 && (
              <fieldset className="space-y-5">
                <legend className="text-base font-semibold text-ink-900">
                  Conexión con Qlik Cloud
                </legend>
                <p className="-mt-3 text-sm text-ink-600">
                  Usa las credenciales de la aplicación OAuth registrada en el
                  tenant.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="qlikTenantHost"
                      className="mb-1.5 block text-sm font-medium text-ink-700"
                    >
                      Host del tenant
                    </label>
                    <input
                      id="qlikTenantHost"
                      type="text"
                      required
                      value={formulario.qlikTenantHost}
                      onChange={(evento) =>
                        actualizarCampo("qlikTenantHost", evento.target.value)
                      }
                      placeholder="empresa.us.qlikcloud.com"
                      className="w-full rounded-md border border-line-200 bg-surface px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="qlikClientId"
                      className="mb-1.5 block text-sm font-medium text-ink-700"
                    >
                      Client ID
                    </label>
                    <input
                      id="qlikClientId"
                      type="text"
                      required
                      autoComplete="username"
                      value={formulario.qlikClientId}
                      onChange={(evento) =>
                        actualizarCampo("qlikClientId", evento.target.value)
                      }
                      className="w-full rounded-md border border-line-200 bg-surface px-3 py-2 text-sm text-ink-900 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="qlikClientSecret"
                      className="mb-1.5 block text-sm font-medium text-ink-700"
                    >
                      Client Secret
                    </label>
                    <input
                      id="qlikClientSecret"
                      type="password"
                      required
                      autoComplete="new-password"
                      value={formulario.qlikClientSecret}
                      onChange={(evento) =>
                        actualizarCampo("qlikClientSecret", evento.target.value)
                      }
                      className="w-full rounded-md border border-line-200 bg-surface px-3 py-2 text-sm text-ink-900 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-ink-700">
                    Scopes OAuth
                  </p>
                  <div className="grid gap-2 border border-line-200 p-3 sm:grid-cols-2">
                    {SCOPES_OAUTH_PREDETERMINADOS.map((scope) => (
                      <label
                        key={scope}
                        className="flex items-start gap-2 text-sm text-ink-700"
                      >
                        <input
                          type="checkbox"
                          checked={formulario.qlikScopes.includes(scope)}
                          onChange={() => alternarScope(scope)}
                          className="mt-1 h-4 w-4 accent-[var(--color-brand-600)]"
                        />
                        <span className="font-mono text-xs leading-5">
                          {scope}
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-ink-500">
                    Los scopes disponibles coinciden con la configuración
                    predeterminada del servidor.
                  </p>
                </div>
                <aside
                  className="border border-line-200 bg-app px-3 py-3"
                  aria-label="URI de redirección OAuth"
                >
                  <p className="text-sm font-medium text-ink-800">
                    URI de redirección
                  </p>
                  <p className="mt-1 text-xs text-ink-600">
                    Registra esta URI exactamente en la aplicación OAuth de Qlik
                    Cloud.
                  </p>
                  <code className="mt-2 block break-all border border-line-200 bg-surface px-2 py-1.5 text-xs text-ink-800">
                    {formulario.qlikRedirectUri}
                  </code>
                </aside>
              </fieldset>
            )}

            {paso === 3 && (
              <fieldset className="space-y-5">
                <legend className="text-base font-semibold text-ink-900">
                  Administrador inicial
                </legend>
                <p className="-mt-3 text-sm text-ink-600">
                  Esta persona administrará la organización después de iniciar
                  sesión con Qlik.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="superadminNombre"
                      className="mb-1.5 block text-sm font-medium text-ink-700"
                    >
                      Nombre completo
                    </label>
                    <input
                      id="superadminNombre"
                      type="text"
                      required
                      minLength={2}
                      autoComplete="name"
                      value={formulario.superadminNombre}
                      onChange={(evento) =>
                        actualizarCampo("superadminNombre", evento.target.value)
                      }
                      placeholder="Nombre Apellido"
                      className="w-full rounded-md border border-line-200 bg-surface px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="superadminCorreo"
                      className="mb-1.5 block text-sm font-medium text-ink-700"
                    >
                      Correo electrónico
                    </label>
                    <input
                      id="superadminCorreo"
                      type="email"
                      required
                      autoComplete="email"
                      value={formulario.superadminCorreo}
                      onChange={(evento) =>
                        actualizarCampo("superadminCorreo", evento.target.value)
                      }
                      placeholder="nombre@empresa.com"
                      className="w-full rounded-md border border-line-200 bg-surface px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-100"
                    />
                  </div>
                </div>
                <aside className="border-l-4 border-brand-600 bg-brand-50 px-3 py-2 text-sm text-brand-900">
                  El correo debe corresponder a una cuenta autorizada en la
                  aplicación OAuth de Qlik.
                </aside>
                <div className="border-t border-line-200 pt-4">
                  <p className="text-sm font-medium text-ink-900">Resumen</p>
                  <dl className="mt-2 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-ink-500">Organización</dt>
                      <dd className="font-medium text-ink-800">
                        {formulario.organizacionNombre || "Sin especificar"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-ink-500">Tenant</dt>
                      <dd className="font-mono text-xs text-ink-800">
                        {formulario.qlikTenantHost || "Sin especificar"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-ink-500">Administrador</dt>
                      <dd className="font-medium text-ink-800">
                        {formulario.superadminCorreo || "Sin especificar"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-ink-500">Scopes</dt>
                      <dd className="font-medium text-ink-800">
                        {formulario.qlikScopes.length} seleccionados
                      </dd>
                    </div>
                  </dl>
                </div>
              </fieldset>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-line-200 pt-5 sm:flex-row sm:justify-between">
              {paso > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setErrorFormulario(null);
                    setPaso((actual) => actual - 1);
                  }}
                >
                  Anterior
                </Button>
              ) : (
                <span />
              )}
              {paso < PASOS.length ? (
                <Button type="button" onClick={handleSiguiente}>
                  Continuar
                </Button>
              ) : (
                <Button type="submit" disabled={enviando}>
                  {enviando
                    ? "Guardando configuración"
                    : "Guardar configuración"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
