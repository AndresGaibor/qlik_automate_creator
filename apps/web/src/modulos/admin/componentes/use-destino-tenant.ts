import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { configurarConexionDestino } from "@/modulos/admin/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  type TipoDestino,
  configuracionInicialDestino,
  construirEntradaDestino,
  puedeGuardarDestino,
} from "./modelo-destino-tenant";

export function useDestinoTenant({
  organizacionId,
  tenantQlikId,
  cantidadExistentes,
}: {
  organizacionId: string;
  tenantQlikId: string;
  cantidadExistentes: number;
}) {
  const { mostrarExito, mostrarError } = useNotificaciones();
  const queryClient = useQueryClient();
  const [tipo, setTipo] = useState<TipoDestino>("postgres");
  const [nombre, setNombre] = useState("");
  const [config, setConfig] = useState(() =>
    configuracionInicialDestino("postgres"),
  );
  const [formularioAbierto, setFormularioAbierto] = useState(
    cantidadExistentes === 0,
  );

  const guardar = useMutation({
    mutationFn: () =>
      configurarConexionDestino(
        organizacionId,
        tenantQlikId,
        construirEntradaDestino(tipo, nombre, config),
      ),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["admin-tenants-qlik", organizacionId],
        }),
        queryClient.invalidateQueries({ queryKey: ["destinos-conexiones"] }),
      ]);
      mostrarExito("Conexión de destino guardada");
      setNombre("");
      setConfig(configuracionInicialDestino(tipo));
      setFormularioAbierto(false);
    },
    onError: (error: Error) => mostrarError(error.message),
  });

  function cambiarCampo(campo: string, valor: string) {
    setConfig((anterior) => ({ ...anterior, [campo]: valor }));
  }

  function seleccionarTipo(nuevoTipo: TipoDestino) {
    setTipo(nuevoTipo);
    setConfig(configuracionInicialDestino(nuevoTipo));
  }

  return {
    tipo,
    nombre,
    config,
    formularioAbierto,
    guardando: guardar.isPending,
    habilitado: puedeGuardarDestino(nombre, config),
    setNombre,
    cambiarCampo,
    seleccionarTipo,
    alternarFormulario: () => setFormularioAbierto((actual) => !actual),
    cerrarFormulario: () => setFormularioAbierto(false),
    guardar: () => guardar.mutate(),
  };
}
