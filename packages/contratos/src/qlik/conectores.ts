import { z } from "zod";
import { esquemaConsultaBaseQlik } from "./comunes.js";

export const esquemaConsultaConectoresAutomatizacion =
  esquemaConsultaBaseQlik.extend({
    sort: z.enum(["id", "+id", "-id", "name", "+name", "-name"]).optional(),
  });
