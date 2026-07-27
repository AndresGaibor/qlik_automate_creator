import { type Context, Hono } from "hono";
import { z } from "zod";
import {
  responderError,
  responderExito,
} from "../../../nucleo/http/respuestas.js";
import type { PuertoConfiguracionApp } from "../aplicacion/puerto/puerto-configuracion-app.js";
import {
  ErrorSetupYaCompletado,
  type GuardarOAuthInicial,
  ServicioSetup,
} from "../aplicacion/servicio-setup.js";
import type { EntradaBootstrap } from "../aplicacion/servicio-setup.js";

const esquemaSetup = z.object({
  organizacionNombre: z.string().min(2).max(100),
  qlikTenantHost: z.string().min(1).max(200),
  qlikClientId: z.string().min(1),
  qlikClientSecret: z.string().min(1),
  qlikScopes: z.array(z.string()).min(1),
  superadminNombre: z.string().min(2).max(100),
  superadminCorreo: z.string().email(),
  frontendUrl: z.string().optional(),
});

export function crearRutasSetup(
  configApp: PuertoConfiguracionApp,
  ejecutarBootstrap: (entrada: EntradaBootstrap) => Promise<{
    organizacionId: string;
    tenantQlikId: string;
    superadminId: string;
  }>,
  guardarOAuthInicial?: GuardarOAuthInicial,
) {
  const servicio = new ServicioSetup(
    configApp,
    ejecutarBootstrap,
    guardarOAuthInicial,
  );
  const rutas = new Hono();

  rutas.get("/status", async (c: Context) => {
    const estado = await servicio.obtenerEstado();
    return responderExito(c, estado);
  });

  rutas.post("/complete", async (c: Context) => {
    let cuerpo: unknown;
    try {
      cuerpo = await c.req.json();
    } catch {
      return responderError(c, "Cuerpo inválido", 400, {
        codigo: "CUERPO_INVALIDO",
      });
    }

    const parsed = esquemaSetup.safeParse(cuerpo);
    if (!parsed.success) {
      return responderError(
        c,
        parsed.error.errors[0]?.message ?? "Datos inválidos",
        400,
        {
          codigo: "VALIDACION_ERROR",
          detalles: parsed.error.errors,
        },
      );
    }

    try {
      const resultado = await servicio.completar(parsed.data);
      return responderExito(c, resultado, 201);
    } catch (err) {
      if (err instanceof ErrorSetupYaCompletado) {
        return responderError(
          c,
          "La configuración inicial ya fue completada",
          409,
          { codigo: "SETUP_YA_COMPLETADO" },
        );
      }
      return responderError(
        c,
        "No se pudo completar la configuración inicial",
        500,
        { codigo: "SETUP_ERROR" },
      );
    }
  });

  return rutas;
}
