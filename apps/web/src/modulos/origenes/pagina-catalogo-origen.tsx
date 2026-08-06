import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { PageHeader } from "@/compartido/componentes/ui/page-header";
import { PageLayout } from "@/compartido/componentes/ui/page-layout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  eliminarConexionOrigen,
  guardarConexionOrigen,
  listarConexionesOrigen,
} from "./api-catalogo-origen";
import { SeccionModoGlobalAutomatizacion } from "./componentes/seccion-modo-global-automatizacion";
import { FormularioCatalogoOrigen } from "./formulario-catalogo-origen";
import { ListaConexionesOrigen } from "./lista-conexiones-origen";
import {
  conexionYaRegistrada,
  construirEntradaConexion,
  filtrarSugerenciasPendientes,
} from "./modelo-catalogo-origen";
import { SugerenciasCatalogoOrigen } from "./sugerencias-catalogo-origen";
import { useFormularioCatalogoOrigen } from "./use-formulario-catalogo-origen";

export function PaginaCatalogoOrigen({
  integrada = false,
}: { integrada?: boolean } = {}) {
  const { mostrarError, mostrarExito } = useNotificaciones();
  const queryClient = useQueryClient();
  const formulario = useFormularioCatalogoOrigen();
  const conexiones = useQuery({
    queryKey: ["conexiones-origen"],
    queryFn: listarConexionesOrigen,
  });
  const datos = conexiones.data ?? [];

  const guardar = useMutation({
    mutationFn: ({
      id,
      entrada,
    }: {
      id: string | null;
      entrada: Record<string, unknown>;
    }) => guardarConexionOrigen(id, entrada),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conexiones-origen"] });
      formulario.marcarGuardada();
      mostrarExito("Conexión guardada");
    },
    onError: (error: Error) => mostrarError(error.message),
  });
  const eliminar = useMutation({
    mutationFn: eliminarConexionOrigen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conexiones-origen"] });
      mostrarExito("Conexión de origen eliminada");
    },
    onError: (error: Error) => mostrarError(error.message),
  });

  const duplicada = conexionYaRegistrada(datos, formulario.estado);
  const sugerenciasPendientes = filtrarSugerenciasPendientes(
    formulario.sugerencias,
    datos,
  );

  function guardarActual() {
    if (duplicada) {
      mostrarError("Esta conexión ya está registrada");
      return;
    }
    guardar.mutate({
      id: formulario.estado.conexionEditandoId,
      entrada: construirEntradaConexion(formulario.estado),
    });
    formulario.limpiarSecretos();
  }

  return (
    <PageLayout>
      {!integrada && (
        <PageHeader
          title="Conexiones para automatizaciones"
          description="Selecciona una conexión detectada y completa dónde se encuentran los datos. La configuración técnica se prepara automáticamente."
        />
      )}
      <SeccionModoGlobalAutomatizacion />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="min-w-0 space-y-4">
          <SugerenciasCatalogoOrigen
            sugerencias={sugerenciasPendientes}
            onSeleccionar={formulario.seleccionarSugerencia}
          />
          <FormularioCatalogoOrigen
            estado={formulario.estado}
            conexiones={datos}
            duplicada={duplicada}
            guardando={guardar.isPending}
            actualizar={formulario.actualizar}
            onGuardar={guardarActual}
          />
        </div>
        <ListaConexionesOrigen
          conexiones={datos}
          cargando={conexiones.isLoading}
          eliminando={eliminar.isPending}
          onEditar={formulario.editarConexion}
          onEliminar={(id) => eliminar.mutate(id)}
        />
      </div>
    </PageLayout>
  );
}
