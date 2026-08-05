import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { clienteConsultas } from "./cliente-consultas";

export function Proveedores({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={clienteConsultas}>
      {children}
    </QueryClientProvider>
  );
}
