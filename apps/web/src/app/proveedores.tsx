import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

const clienteConsultas = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: false },
    mutations: { retry: false },
  },
});

export function Proveedores({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={clienteConsultas}>
      {children}
    </QueryClientProvider>
  );
}
