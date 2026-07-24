import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type TipoAviso = "error" | "exito";

interface Aviso {
  id: string;
  mensaje: string;
  tipo: TipoAviso;
}

interface NotificacionesContextValue {
  mostrarError: (mensaje: string) => void;
  mostrarExito: (mensaje: string) => void;
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
      for (const timeoutId of timeoutsRef.current.values()) {
        clearTimeout(timeoutId);
      }
      timeoutsRef.current.clear();
    };
  }, []);

  const quitarAviso = useCallback((id: string) => {
    const timeoutId = timeoutsRef.current.get(id);
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timeoutsRef.current.delete(id);
    }
    setAvisos((previos) => previos.filter((aviso) => aviso.id !== id));
  }, []);

  const mostrar = useCallback((mensaje: string, tipo: TipoAviso) => {
    const id = crypto.randomUUID();
    setAvisos((previos) => [...previos, { id, mensaje, tipo }]);
    const timeoutId = setTimeout(() => {
      timeoutsRef.current.delete(id);
      setAvisos((previos) => previos.filter((aviso) => aviso.id !== id));
    }, 5000);
    timeoutsRef.current.set(id, timeoutId);
  }, []);

  const mostrarError = useCallback(
    (mensaje: string) => mostrar(mensaje, "error"),
    [mostrar],
  );
  const mostrarExito = useCallback(
    (mensaje: string) => mostrar(mensaje, "exito"),
    [mostrar],
  );

  return (
    <NotificacionesContext.Provider value={{ mostrarError, mostrarExito }}>
      {children}
      <div
        aria-live="assertive"
        className="fixed right-4 top-4 z-50 flex flex-col gap-2"
      >
        {avisos.map((aviso) => (
          <div
            key={aviso.id}
            role={aviso.tipo === "error" ? "alert" : "status"}
            className={`${
              aviso.tipo === "error" ? "bg-red-600" : "bg-emerald-600"
            } flex min-w-72 max-w-96 items-center gap-3 rounded-lg px-4 py-3 text-white shadow-lg`}
          >
            <p className="flex-1 text-sm">{aviso.mensaje}</p>
            <button
              type="button"
              aria-label="Cerrar aviso"
              onClick={() => quitarAviso(aviso.id)}
              className="shrink-0 text-sm font-medium text-white/80 hover:text-white"
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
  const contexto = useContext(NotificacionesContext);
  if (!contexto) {
    throw new Error(
      "useNotificaciones debe usarse dentro de NotificacionesProvider",
    );
  }
  return contexto;
}
