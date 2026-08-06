import { Button } from "@/compartido/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { Icon } from "@/compartido/componentes/ui/icon";
import { PasoAdministrador } from "./componentes/paso-administrador";
import { PasoOrganizacion } from "./componentes/paso-organizacion";
import { PasoQlik } from "./componentes/paso-qlik";
import { ProgresoSetup } from "./componentes/progreso-setup";
import { PASOS_SETUP } from "./modelo-setup";
import { useFormularioSetup } from "./use-formulario-setup";

export function PaginaSetup() {
  const {
    paso,
    formulario,
    enviando,
    errorFormulario,
    actualizarCampo,
    alternarScope,
    copiarRedirectUri,
    avanzar,
    retroceder,
    enviar,
  } = useFormularioSetup();

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
          <ProgresoSetup paso={paso} />
        </CardHeader>

        <CardContent className="px-5 py-6 sm:px-8">
          <form onSubmit={enviar} className="space-y-6" noValidate>
            {errorFormulario && (
              <div
                role="alert"
                className="border-l-4 border-danger-600 bg-danger-50 px-3 py-2 text-sm text-danger-800"
              >
                {errorFormulario}
              </div>
            )}

            {paso === 1 && (
              <PasoOrganizacion
                formulario={formulario}
                actualizarCampo={actualizarCampo}
              />
            )}
            {paso === 2 && (
              <PasoQlik
                formulario={formulario}
                actualizarCampo={actualizarCampo}
                alternarScope={alternarScope}
                copiarRedirectUri={copiarRedirectUri}
              />
            )}
            {paso === 3 && (
              <PasoAdministrador
                formulario={formulario}
                actualizarCampo={actualizarCampo}
              />
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-line-200 pt-5 sm:flex-row sm:justify-between">
              {paso > 1 ? (
                <Button type="button" variant="outline" onClick={retroceder}>
                  Anterior
                </Button>
              ) : (
                <span />
              )}
              {paso < PASOS_SETUP.length ? (
                <Button type="button" onClick={avanzar}>
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
