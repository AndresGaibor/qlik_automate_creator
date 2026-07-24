import { z } from "zod";
import {
  esquemaBooleanoConsulta,
  esquemaConsultaBaseQlik,
  esquemaIdQlik,
} from "./comunes.js";

export const esquemaConsultaConexionesAutomatizacion =
  esquemaConsultaBaseQlik.extend({
    listAll: esquemaBooleanoConsulta,
    sort: z
      .enum([
        "id",
        "name",
        "createdAt",
        "updatedAt",
        "+id",
        "+name",
        "+createdAt",
        "+updatedAt",
        "-id",
        "-name",
        "-createdAt",
        "-updatedAt",
      ])
      .optional(),
  });

export const esquemaCrearConexionAutomatizacion = z
  .object({
    connectorId: esquemaIdQlik,
    name: z.string().trim().min(1).max(255).optional(),
    spaceId: esquemaIdQlik.optional(),
    params: z
      .array(
        z.object({
          name: z.string().trim().min(1).max(255),
          value: z.string().max(16_384),
        }),
      )
      .optional(),
  })
  .passthrough();

export const esquemaActualizarConexionAutomatizacion = z
  .object({
    name: z.string().trim().min(1).max(255).optional(),
    params: z
      .array(
        z.object({
          id: esquemaIdQlik,
          value: z.string().max(16_384),
        }),
      )
      .optional(),
  })
  .passthrough();

export const esquemaCambiarEspacioConexionQlik = z.object({
  // Qlik acepta una cadena vacía para mover la conexión al espacio personal.
  spaceId: z.string().trim().max(256),
});
