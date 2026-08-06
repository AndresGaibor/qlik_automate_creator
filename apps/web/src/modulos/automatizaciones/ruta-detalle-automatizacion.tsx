import { useParams } from "@tanstack/react-router";
import { PaginaDetalleAutomatizacion } from "./pagina-detalle-automatizacion";

export function RutaDetalleAutomatizacion() {
  const { id } = useParams({ strict: false }) as { id: string };
  return <PaginaDetalleAutomatizacion id={id} />;
}
