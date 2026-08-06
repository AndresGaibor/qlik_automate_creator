import type { ActualizarCampoSetup, FormularioSetup } from "../modelo-setup";

interface Props {
  formulario: FormularioSetup;
  actualizarCampo: ActualizarCampoSetup;
}

export function PasoOrganizacion({ formulario, actualizarCampo }: Props) {
  return (
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
  );
}
