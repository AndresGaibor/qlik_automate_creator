import React from "react";

interface EstadoErrorProps {
  mensaje: string;
  onReintentar?: () => void;
}

export function EstadoError({ mensaje, onReintentar }: EstadoErrorProps) {
  return (
    <div role="alert" aria-live="assertive">
      <p>{mensaje}</p>
      {onReintentar && (
        <button
          type="button"
          name="Reintentar"
          data-accion="reintentar"
          onClick={onReintentar}
        >
          Reintentar
        </button>
      )}
    </div>
  );
}
