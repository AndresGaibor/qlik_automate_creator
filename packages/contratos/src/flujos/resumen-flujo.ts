import { z } from "zod";

export const esquemaResumenFlujo = z.object({
  id: z.string(),
  nombre: z.string(),
  espacioId: z.string().optional(),
  espacioNombre: z.string(),
  propietarioId: z.string().optional(),
  modificadoEn: z.string().optional(),
});

export type ResumenFlujo = z.infer<typeof esquemaResumenFlujo>;
