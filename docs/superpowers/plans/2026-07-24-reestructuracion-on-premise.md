# Reestructuración On-Premise Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Consolidar una sola arquitectura modular on-premise con Bun/Node, Hono, PostgreSQL y múltiples tenants Qlik por organización.

**Architecture:** El composition root conecta módulos verticales mediante puertos. PostgreSQL es la fuente de verdad; Qlik y la API de destinos son adaptadores externos. El frontend replica los límites funcionales y consume contratos compartidos.

**Tech Stack:** Bun, Node.js 22, TypeScript, Hono, React, Vite, Drizzle ORM, PostgreSQL 17, Zod, Biome.

## Global Constraints

- Nombres de dominio y persistencia en español.
- Una organización admite varios tenants Qlik y como máximo uno principal.
- No mantener dos arquitecturas en paralelo.
- Tokens cifrados, sesiones hasheadas, auditoría e idempotencia.
- `bun test`, `bun run typecheck`, `bun run lint` y `bun run build` deben pasar.

## Tasks

- [x] Consolidar composition root, núcleo, plataforma y módulos públicos.
- [x] Migrar autenticación, Qlik, flujos, destinos y automatizaciones a puertos/adaptadores.
- [x] Migrar frontend a módulos verticales y cliente HTTP compartido.
- [x] Añadir contratos compartidos y respuesta HTTP normalizada.
- [x] Añadir soporte de múltiples tenants y unicidad del tenant principal.
- [x] Corregir scripts raíz para Bun actual.
- [x] Actualizar documentación y despliegue Docker on-premise.
- [x] Verificar pruebas, tipos, lint y build.
