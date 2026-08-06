import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

export interface EstadoVista {
  modoUsuarioFinal: boolean;
}

const EstadoVistaInicial: EstadoVista = { modoUsuarioFinal: false };

export interface VistaContextoValor {
  estado: EstadoVista;
  setModoUsuarioFinal: (activo: boolean) => void;
}

const VistaContexto = createContext<VistaContextoValor | null>(null);

export function VistaProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoVista>(EstadoVistaInicial);

  const setModoUsuarioFinal = useCallback((activo: boolean) => {
    setEstado((previo) => ({ ...previo, modoUsuarioFinal: activo }));
  }, []);

  return (
    <VistaContexto.Provider value={{ estado, setModoUsuarioFinal }}>
      {children}
    </VistaContexto.Provider>
  );
}

export function useVistaUsuarioFinal(): VistaContextoValor {
  const contexto = useContext(VistaContexto);
  if (!contexto) {
    throw new Error("useVistaUsuarioFinal debe usarse dentro de VistaProvider");
  }
  return contexto;
}
