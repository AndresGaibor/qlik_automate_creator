import { QueryClient } from "@tanstack/react-query";

export const clienteConsultas = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: false },
    mutations: { retry: false },
  },
});
