import { Card, CardContent, CardHeader, CardTitle } from "@/compartido/componentes/ui/card";
import { formatearFechaYHora } from "@/compartido/utiles/formateador-fechas";
import type { EjecucionResumen } from "@/modulos/automatizaciones/api";

interface Props {
  ejecuciones: EjecucionResumen[];
}

export function ListaEjecuciones({ ejecuciones }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ejecuciones recientes</CardTitle>
      </CardHeader>
      <CardContent>
        {!ejecuciones || ejecuciones.length === 0 ? (
          <p className="text-sm text-gray-500">No hay ejecuciones recientes</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-500">
                <th className="pb-2 font-medium">ID</th>
                <th className="pb-2 font-medium">Estado</th>
                <th className="pb-2 font-medium">Inicio</th>
                <th className="pb-2 font-medium">Fin</th>
              </tr>
            </thead>
            <tbody>
              {ejecuciones.map((ejecucion: EjecucionResumen) => (
                <tr key={ejecucion.id} className="border-b last:border-0">
                  <td className="py-2">{ejecucion.id}</td>
                  <td className="py-2">{ejecucion.estado}</td>
                  <td className="py-2">
                    {formatearFechaYHora(ejecucion.iniciadoEn)}
                  </td>
                  <td className="py-2">
                    {ejecucion.finalizadoEn
                      ? formatearFechaYHora(ejecucion.finalizadoEn)
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
