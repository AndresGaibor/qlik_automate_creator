import { useEffect, useRef } from "react";

export function useManejoError(onMostrarError: (msg: string) => void) {
  const msgRef = useRef<string | null>(null);

  const manejar = (error: Error | null | undefined) => {
    if (error?.message !== msgRef.current) {
      msgRef.current = error?.message ?? null;
      onMostrarError(error?.message ?? "Error desconocido");
    }
  };

  return { manejar };
}
