import { useVistaUsuarioFinal } from "@/app/contexto-vista";
import { EstadoCarga } from "@/compartido/componentes/ui/estado-carga";
import { Icon } from "@/compartido/componentes/ui/icon";
import { PageHeader } from "@/compartido/componentes/ui/page-header";
import { PageLayout } from "@/compartido/componentes/ui/page-layout";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { DetalleReporte } from "./componentes/detalle-reporte";
import { EstadoCatalogoDestino } from "./componentes/estado-catalogo-destino";
import { ListaReportes } from "./componentes/lista-reportes";
import { useCatalogoDestinos } from "./consultas";

export function PaginaTablasDestino() {
  const navegar = useNavigate();
  const { estado } = useVistaUsuarioFinal();
  const [conexionId, setConexionId] = useState<string | null>(null);
  const [recursoId, setRecursoId] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const catalogo = useCatalogoDestinos({ conexionId, recursoId });

  const esAdministrador =
    Boolean(catalogo.sesion?.esSuperadmin) ||
    Boolean(
      catalogo.sesion?.membresias?.some(
        (membresia) => membresia.rol === "admin",
      ),
    );
  const puedeConfigurar = esAdministrador && !estado.modoUsuarioFinal;

  if (catalogo.cargando) {
    return <EstadoCarga mensaje="Consultando el catálogo de destinos…" />;
  }

  if (catalogo.errorCatalogo) {
    return (
      <PageLayout>
        <EncabezadoCatalogo />
        <EstadoCatalogoDestino
          mensaje={mensajeError(catalogo.errorCatalogo)}
          puedeConfigurar={puedeConfigurar}
          onConfigurar={() => navegar({ to: "/configuracion" })}
          onReintentar={() => void catalogo.recargarCatalogo()}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <EncabezadoCatalogo />
      <div className="flex items-start gap-2 rounded-lg border border-info-200 bg-info-50 p-3 text-sm text-info-900">
        <Icon name="help" size="sm" className="mt-0.5 shrink-0" />
        <p>
          <strong>Vista de solo lectura.</strong> Los nombres, campos, conteos y
          fechas que aparecen aquí provienen del destino configurado.
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-8">
        <ListaReportes
          conexiones={catalogo.conexiones}
          conexionActiva={catalogo.conexionActiva}
          recursos={catalogo.recursos}
          automatizaciones={catalogo.automatizaciones}
          busqueda={busqueda}
          recursoSeleccionadoId={recursoId}
          onBusquedaChange={setBusqueda}
          onConexionChange={(id) => {
            setConexionId(id);
            setRecursoId(null);
          }}
          onRecursoChange={setRecursoId}
        />
        <DetalleReporte
          recursoId={recursoId}
          detalle={catalogo.detalle}
          cargando={catalogo.cargandoDetalle}
        />
      </div>
    </PageLayout>
  );
}

function EncabezadoCatalogo() {
  return (
    <PageHeader
      title="Resultados de datos"
      description="Consulta los recursos disponibles en los destinos configurados y revisa los metadatos que devuelve cada sistema."
    />
  );
}

function mensajeError(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "No se pudo consultar el catálogo de destinos";
}
