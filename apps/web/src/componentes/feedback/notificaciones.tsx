import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

interface Aviso {
  id: string;
  mensaje: string;
}

interface NotificacionesContextValue {
  mostrarError: (mensaje: string) => void;
}

const NotificacionesContext = createContext<NotificacionesContextValue | null>(
  null,
);

export function NotificacionesProvider({ children }: { children: ReactNode }) {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  useEffect(() => {
    return () => {
      // Cleanup: cancelar todos los timeouts al desmontar
      for (const timeoutId of timeoutsRef.current.values()) {
        clearTimeout(timeoutId);
      }
      timeoutsRef.current.clear();
    };
  }, []);

  const quitarAviso = useCallback((id: string) => {
    // Cancelar el timeout si existe (cierre manual)
    const timeoutId = timeoutsRef.current.get(id);
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutsRef.current.delete(id);
    }
    setAvisos((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const mostrarError = useCallback((mensaje: string) => {
    const id = crypto.randomUUID();
    setAvisos((prev) => [...prev, { id, mensaje }]);

    const timeoutId = setTimeout(() => {
      // Auto-cierre: eliminar el handle y el aviso
      timeoutsRef.current.delete(id);
      setAvisos((prev) => prev.filter((a) => a.id !== id));
    }, 5000);

    timeoutsRef.current.set(id, timeoutId);
  }, []);

  return (
    <NotificacionesContext.Provider value={{ mostrarError }}>
      {children}
      <div
        aria-live="assertive"
        className="fixed top-4 right-4 z-50 flex flex-col gap-2"
      >
        {avisos.map((aviso) => (
          <div
            key={aviso.id}
            role="alert"
            className="bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-72 max-w-96"
          >
            <p className="flex-1 text-sm">{aviso.mensaje}</p>
            <button
              type="button"
              name="Cerrar aviso"
              onClick={() => quitarAviso(aviso.id)}
              className="text-white/80 hover:text-white text-sm font-medium shrink-0"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </NotificacionesContext.Provider>
  );
}

export function useNotificaciones(): NotificacionesContextValue {
  const context = useContext(NotificacionesContext);
  if (!context) {
    throw new Error(
      "useNotificaciones must be used within NotificacionesProvider",
    );
  }
  return context;
}
