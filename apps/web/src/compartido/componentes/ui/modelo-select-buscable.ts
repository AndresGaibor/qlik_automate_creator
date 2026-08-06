export interface OpcionSelect {
  id: string;
  nombre: string;
  tipo?: string;
  espacioNombre?: string;
  badgeAviso?: string;
}

export function filtrarOpcionesSelect(
  opciones: OpcionSelect[],
  busqueda: string,
): OpcionSelect[] {
  const termino = busqueda.trim().toLowerCase();
  if (!termino) return opciones;
  return opciones.filter((opcion) =>
    [opcion.nombre, opcion.tipo, opcion.espacioNombre].some((valor) =>
      (valor ?? "").toLowerCase().includes(termino),
    ),
  );
}

export function textoSinResultados(
  busqueda: string,
  textoPersonalizado?: string,
): string {
  return (
    textoPersonalizado ?? `No se encontraron resultados para "${busqueda}"`
  );
}
