import type { ActualizarCampoSetup, FormularioSetup } from "../modelo-setup";

interface Props {
  formulario: FormularioSetup;
  actualizarCampo: ActualizarCampoSetup;
}

export function PasoAdministrador({ formulario, actualizarCampo }: Props) {
  return (
    <fieldset className="space-y-5">
      <legend className="text-base font-semibold text-ink-900">
        Administrador inicial
      </legend>
      <p className="-mt-3 text-sm text-ink-600">
        Esta persona administrará la organización después de iniciar sesión con
        Qlik.
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
        El correo debe corresponder a una cuenta autorizada en la aplicación
        OAuth de Qlik.
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
  );
}
