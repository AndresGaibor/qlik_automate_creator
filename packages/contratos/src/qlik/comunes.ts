import { z } from "zod";

export const esquemaIdQlik = z
  .string()
  .trim()
  .min(1)
  .max(256)
  .refine(
    (valor: string) => !valor.includes("/"),
    "El identificador no puede contener /",
  );

export const esquemaCursor = z.string().trim().min(1).max(2048).optional();
export const esquemaLimiteQlik = z.coerce
  .number()
  .int()
  .min(1)
  .max(200)
  .optional();
export const esquemaBooleanoConsulta = z
  .union([z.boolean(), z.enum(["true", "false"])])
  .transform((valor: boolean | "true" | "false") =>
    typeof valor === "boolean" ? valor : valor === "true",
  )
  .optional();

export const esquemaCuerpoObjetoQlik = z.record(z.string(), z.unknown());

export const esquemaConsultaBaseQlik = z
  .object({
    cursor: esquemaCursor,
    limit: esquemaLimiteQlik,
    filter: z.string().max(4000).optional(),
    sort: z.string().max(128).optional(),
  })
  .passthrough();

export type ObjetoQlik = Record<string, unknown>;
