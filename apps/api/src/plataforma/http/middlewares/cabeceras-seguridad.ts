import type { MiddlewareHandler } from "hono";

export function crearMiddlewareCabecerasSeguridad(
  produccion: boolean,
): MiddlewareHandler {
  return async (c, siguiente) => {
    await siguiente();

    c.header("x-content-type-options", "nosniff");
    c.header("x-frame-options", "DENY");
    c.header("referrer-policy", "strict-origin-when-cross-origin");
    c.header("permissions-policy", "camera=(), microphone=(), geolocation=()");
    c.header(
      "content-security-policy",
      "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
    );
    c.header("cache-control", "no-store");
    c.header("cross-origin-opener-policy", "same-origin");
    c.header("cross-origin-resource-policy", "same-origin");
    if (produccion) {
      c.header(
        "strict-transport-security",
        "max-age=31536000; includeSubDomains",
      );
    }
  };
}
