import { useNotificaciones } from "@/compartido/componentes/feedback/notificaciones";
import { Icon } from "@/compartido/componentes/ui/icon";
import { SelectBuscable } from "@/compartido/componentes/ui/select-buscable";
import type { ResumenAutomatizacion } from "@qlik/contratos/automatizaciones";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type TenantQlik,
  configurarPlantillaAutomatizacionTenant,
  listarAutomatizacionesParaAdmin,
} from "../api";

export function SetupTecnicoPlantilla({
  organizacionId,
  tenantsQlik,
}: {
  organizacionId: string;
  tenantsQlik: TenantQlik[];
}) {
  const { mostrarExito, mostrarError } = useNotificaciones();
  const queryClient = useQueryClient();

  const { data: automatizaciones = [], isLoading } = useQuery<
    ResumenAutomatizacion[]
  >({
    queryKey: ["automatizaciones-admin-list"],
    queryFn: listarAutomatizacionesParaAdmin,
  });

  const guardar = useMutation({
    mutationFn: ({
      tenantQlikId,
      auto,
    }: {
      tenantQlikId: string;
      auto: ResumenAutomatizacion;
    }) =>
      configurarPlantillaAutomatizacionTenant(
        organizacionId,
        tenantQlikId,
        1,
        auto.id,
        auto.nombre,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-tenants-qlik", organizacionId],
      });
      mostrarExito("Plantilla base actualizada");
    },
    onError: (err: Error) => mostrarError(err.message),
  });

  const opciones = automatizaciones.map((a) => ({
    id: a.id,
    nombre: a.nombre,
    espacioNombre: a.espacioNombre || "Personal",
  }));

  return (
    <div className="space-y-4">
      {tenantsQlik.map((tQlik) => (
        <div
          key={tQlik.id}
          className="rounded-lg border border-line-200 bg-app/30 p-4 space-y-3"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-ink-500 uppercase tracking-wider">
              Entorno:
            </span>
            <span className="font-semibold text-ink-900 text-sm">
              {tQlik.nombre || tQlik.host}
            </span>
            <span className="font-mono text-xs text-ink-400">
              {tQlik.nombre ? `· ${tQlik.host}` : ""}
            </span>
          </div>

          {tQlik.automatizacionBaseNombre && (
            <div className="flex items-center gap-2 border-l-2 border-brand-600 bg-brand-50 px-3 py-2">
              <Icon name="star" size="sm" className="text-brand-600 shrink-0" />
              <div className="min-w-0">
                <span className="text-xs text-ink-500">Plantilla activa: </span>
                <span className="font-semibold text-brand-800 text-sm truncate">
                  {tQlik.automatizacionBaseNombre}
                </span>
              </div>
            </div>
          )}

          <SelectBuscable
            placeholder={
              tQlik.automatizacionBaseNombre
                ? "Seleccionar otra plantilla…"
                : "Busca y selecciona la automatización molde…"
            }
            searchPlaceholder="Filtra por nombre…"
            emptyText="No encontramos automatizaciones en este entorno."
            opciones={opciones}
            valorSeleccionado={tQlik.automatizacionBaseIdQlik || ""}
            onSeleccionar={(id) => {
              const auto = automatizaciones.find((a) => a.id === id);
              if (auto) guardar.mutate({ tenantQlikId: tQlik.id, auto });
            }}
            cargando={isLoading}
          />
        </div>
      ))}
    </div>
  );
}
