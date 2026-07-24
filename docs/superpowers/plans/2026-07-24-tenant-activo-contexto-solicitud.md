# Tenant Activo y Contexto de Solicitud Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Permitir cambiar el tenant Qlik activo de una sesión y centralizar identidad, organización, roles y tenant en un contexto único por solicitud.

**Architecture:** La sesión persiste `tenant_qlik_activo_id`. Un middleware opcional resuelve una sola vez el contexto y los adaptadores HTTP lo consumen. El repositorio limita los tenants disponibles a identidades Qlik activas del mismo usuario.

**Tech Stack:** Bun, Hono, TypeScript, Drizzle ORM, PostgreSQL, React, TanStack Query.

## Global Constraints

- Nombres técnicos y contratos en español.
- Ningún tenant ajeno o inactivo puede seleccionarse.
- El cambio exige identidad y credenciales propias del usuario.
- TDD y verificación completa antes del commit.

---

### Task 1: Persistencia y dominio
- [ ] Prueba roja para contexto y selección.
- [ ] Migración de tenant activo.
- [ ] Puerto y repositorio PostgreSQL.

### Task 2: Middleware y API
- [ ] Contexto central por solicitud.
- [ ] Endpoints para listar y cambiar tenant.
- [ ] Resolver Qlik desde tenant activo.

### Task 3: Frontend
- [ ] Contratos de sesión.
- [ ] Selector en encabezado.
- [ ] Invalidación de consultas al cambiar.

### Task 4: Verificación
- [ ] Tests, typecheck, lint, build y migración.
- [ ] Commit.
