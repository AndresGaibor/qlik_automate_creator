export interface Registrador {
  info(evento: string, datos?: Record<string, unknown>): void;
  advertencia(evento: string, datos?: Record<string, unknown>): void;
  error(evento: string, datos?: Record<string, unknown>): void;
}

const escribir = (
  nivel: "info" | "warn" | "error",
  evento: string,
  datos: Record<string, unknown> = {},
) => {
  console[nivel](JSON.stringify({ nivel, evento, ...datos }));
};

export const registradorConsola: Registrador = {
  info: (evento, datos) => escribir("info", evento, datos),
  advertencia: (evento, datos) => escribir("warn", evento, datos),
  error: (evento, datos) => escribir("error", evento, datos),
};
