import { clienteApi } from "@/compartido/api/cliente";
import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { Button } from "@/compartido/componentes/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/compartido/componentes/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { type FormEvent, useState } from "react";

interface EstadoFormulario {
  ambiente: string;
  flujo: string;
  destino: string;
}

const estadoInicial: EstadoFormulario = {
  ambiente: "",
  flujo: "",
  destino: "",
};

const claseCampo =
  "mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200";

export function PaginaNuevaAutomatizacion() {
  const navegar = useNavigate();
  const consultas = useQueryClient();
  const { mostrarError, mostrarExito } = useNotificaciones();
  const [formulario, setFormulario] = useState(estadoInicial);

  const ambientes = useQuery({
    queryKey: ["ambientes"],
    queryFn: () => Promise.resolve([]),
  });

  const flujos = useQuery({
    queryKey: ["flujos", formulario.ambiente],
    queryFn: () => Promise.resolve([]),
    enabled: !!formulario.ambiente,
  });

  const destinos = useQuery({
    queryKey: ["impala-tablas"],
    queryFn: () =>
      clienteApi.get<{ tableName: string }[]>(
        "https://apiqd.andresgaibor.com/api/v1/impala/databases/default/tables",
      ),
  });

  const crear = useMutation({
    mutationFn: async (entrada: EstadoFormulario) => {
      console.log("Crear automatización:", entrada);
      return entrada;
    },
    onSuccess: async () => {
      mostrarExito("Automatización creada");
      navegar({ to: "/automatizaciones" });
    },
    onError: (error: Error) => mostrarError(error.message),
  });

  function actualizar(campo: keyof EstadoFormulario, valor: string) {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    crear.mutate(formulario);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Nueva automatización</h2>
        <p className="mt-1 text-sm text-gray-600">
          Crea una nueva automatización.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos de la automatización</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={enviar}>
            <label className="block text-sm font-medium">
              Ambiente
              <select
                className={claseCampo}
                value={formulario.ambiente}
                onChange={(evento) =>
                  actualizar("ambiente", evento.target.value)
                }
                required
              >
                <option value="">Selecciona un ambiente</option>
              </select>
            </label>

            <label className="block text-sm font-medium">
              Flujo
              <select
                className={claseCampo}
                value={formulario.flujo}
                onChange={(evento) => actualizar("flujo", evento.target.value)}
                required
                disabled={!formulario.ambiente}
              >
                <option value="">Selecciona un flujo</option>
              </select>
            </label>

            <label className="block text-sm font-medium">
              Destino
              <select
                className={claseCampo}
                value={formulario.destino}
                onChange={(evento) =>
                  actualizar("destino", evento.target.value)
                }
                required
              >
                <option value="">Selecciona un destino</option>
                {(destinos.data ?? []).map((tabla) => (
                  <option key={tabla.tableName} value={tabla.tableName}>
                    {tabla.tableName}
                  </option>
                ))}
              </select>
              {destinos.isError ? (
                <span className="mt-1 block text-xs text-red-600">
                  No se pudieron cargar los destinos.
                </span>
              ) : null}
            </label>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navegar({ to: "/automatizaciones" })}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={crear.isPending}>
                {crear.isPending ? "Creando…" : "Crear automatización"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
