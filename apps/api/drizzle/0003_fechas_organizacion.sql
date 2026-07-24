ALTER TABLE "organizaciones"
  ADD COLUMN IF NOT EXISTS "creado_en" timestamp DEFAULT now() NOT NULL;
--> statement-breakpoint
ALTER TABLE "organizaciones"
  ADD COLUMN IF NOT EXISTS "actualizado_en" timestamp DEFAULT now() NOT NULL;
