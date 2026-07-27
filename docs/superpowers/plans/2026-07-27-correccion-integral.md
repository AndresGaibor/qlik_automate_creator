# Corrección integral del proyecto

**Objetivo:** dejar seguridad, despliegue, calidad, UX y manejo de errores en estado verificable, sin Storybook.

**Restricciones globales:** conservar los cambios actuales del usuario; no hacer commits automáticos; nombres y textos en español; TDD para cambios de comportamiento; no añadir Storybook.

## Tareas

1. **Setup inicial seguro y migración 0008**
   - Probar que `/api/setup/complete` solo funciona una vez, rechaza repetición y concurrencia, guarda OAuth cifrado y no expone secretos.
   - Corregir claves de `app_config`, integración frontend/router y migración duplicada.

2. **Secretos de destino e Impala**
   - Cifrar API key y contraseña, devolver solo máscara/estado y migrar DTO, repositorio y UI.
   - Validar host, puerto e identificadores Impala; preservar secreto al editar.

3. **Seguridad HTTP y sesiones**
   - Añadir timeout/reintentos seguros, Origin/CSRF para mutaciones, cabeceras de seguridad y rate limiting de login/setup/ejecuciones.
   - Revalidar estados y proteger último administrador/superadministrador.

4. **OAuth robusto**
   - Persistir intentos OAuth de uso único y soportar varias pestañas.
   - Renovar access tokens con refresh token y bloqueo de concurrencia.

5. **Outbox e idempotencia operativos**
   - Publicar pendientes con reintentos y recuperación; limpiar expirados y solicitudes estancadas.

6. **Automatizaciones e Impala confiables**
   - Eliminar fallbacks de negocio hardcodeados, validar plantilla y ofrecer error/selección manual.
   - Cerrar conexiones, propagar errores útiles y añadir compensación auditable.

7. **UX/UI y accesibilidad**
   - Corregir rol administrativo, carga infinita, botones vacíos, datos falsos, paginación y estados de consulta.
   - Hacer navegación móvil, diálogos, combobox y tabs accesibles; aislar filtros por tenant.

8. **Despliegue y calidad**
   - Corregir Dockerfile/Compose, añadir `.dockerignore`, CI, health/readiness y cierre ordenado.
   - Actualizar dependencias vulnerables y dejar lint/typecheck/tests/build/Docker en verde.

9. **Documentación fuente de verdad**
   - Actualizar README y guías operativas; retirar referencias contradictorias o marcarlas como archivo histórico.

## Verificación final

- `bun run lint`
- `bun run typecheck`
- `bun test`
- `bun run build`
- `docker compose config`
- `docker build --target api .`
- `docker build --target web .`
- `bun audit`
