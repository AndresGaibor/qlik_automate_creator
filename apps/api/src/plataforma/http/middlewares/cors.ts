import { cors } from "hono/cors";

export function crearMiddlewareCors(origenFrontend: string) {
  return cors({
    origin: origenFrontend,
    credentials: true,
  });
}
