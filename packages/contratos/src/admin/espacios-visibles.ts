import { z } from "zod";

export const esquemaGuardarEspaciosVisibles = z.object({
  espaciosPermitidosIds: z
    .array(z.string().min(1).max(255))
    .max(500)
    .transform((ids) => [
      ...new Set(ids.map((id) => id.trim()).filter(Boolean)),
    ]),
  permitirRecursosSinEspacio: z.boolean(),
});

export type GuardarEspaciosVisibles = z.infer<
  typeof esquemaGuardarEspaciosVisibles
>;

export interface ConfiguracionEspaciosVisibles {
  tenantQlikId: string;
  espaciosPermitidosIds: string[];
  permitirRecursosSinEspacio: boolean;
  configurada: boolean;
  actualizadoEn: string | null;
}

export interface EspacioConfigurable {
  id: string;
  nombre: string;
  tipo: string;
  disponible: boolean;
  seleccionado: boolean;
}

export interface CatalogoEspaciosVisibles {
  configuracion: ConfiguracionEspaciosVisibles;
  espacios: EspacioConfigurable[];
}

export interface ResultadoGuardarEspaciosVisibles {
  configuracion: ConfiguracionEspaciosVisibles;
  anadidos: string[];
  retirados: string[];
}
