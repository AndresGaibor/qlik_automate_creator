interface Props {
  mensaje?: string;
}

export function EstadoCarga({ mensaje = "Cargando..." }: Props) {
  return (
    <div className="flex justify-center items-center py-12">
      <p className="text-gray-500 animate-pulse">{mensaje}</p>
    </div>
  );
}
