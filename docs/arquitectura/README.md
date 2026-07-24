# Arquitectura del sistema

## Decisión principal

El backend es un **monolito modular**. Cada módulo es un bounded context con límites explícitos y dependencias dirigidas hacia el dominio:

```text
HTTP → aplicación → dominio
                ↘ puertos ← infraestructura
```

Se combinan:

- Clean Architecture para dirigir dependencias hacia adentro.
- Arquitectura hexagonal para aislar Qlik, PostgreSQL y servicios remotos detrás de puertos.
- DDD táctico para nombrar módulos, casos de uso, eventos y valores según el negocio.

## Estructura

```text
apps/api/src/
├── app.ts                         # composition root único
├── entradas/
│   ├── bun.ts
│   ├── node.ts
│   └── worker.ts
├── plataforma/
│   ├── configuracion/
│   ├── contexto/
│   ├── errores/
│   ├── http/
│   ├── observabilidad/
│   ├── persistencia/
│   └── seguridad/
├── nucleo/
│   ├── auditoria/
│   ├── errores/
│   ├── eventos/
│   ├── idempotencia/
│   ├── tiempo/
│   └── valores/
└── modulos/
    ├── autenticacion-qlik/
    ├── automatizaciones/
    ├── destinos/
    ├── flujos/
    └── qlik/

packages/contratos/src/
├── autenticacion/
├── automatizaciones/
├── comun/
├── flujos/
└── qlik/
```

Cada módulo expone únicamente su `publico.ts`. Los consumidores no deben importar archivos internos de otro módulo.

## Flujo de una solicitud

1. Una ruta Hono recibe la solicitud.
2. El contrato Zod valida parámetros, query o cuerpo.
3. La ruta construye la entrada del caso de uso; no consulta repositorios.
4. El caso de uso coordina dominio y puertos.
5. Un adaptador implementa PostgreSQL, Qlik o la API remota.
6. Los helpers HTTP devuelven el contrato común en español.
7. El manejador central traduce errores de validación, aplicación y Qlik.

## Reglas obligatorias

1. `app.ts` es el único composition root.
2. HTTP nunca usa Drizzle, SQL ni `fetch` directo.
3. Dominio y aplicación no importan Hono, React ni adaptadores.
4. Los contratos compartidos viven en `packages/contratos`.
5. Todo módulo nuevo debe tener `publico.ts`.
6. Un módulo no importa carpetas internas de otro módulo; consume su API pública.
7. Los nombres del negocio, DTO, eventos y estados se escriben en español. Se conservan nombres ingleses solo al representar literalmente el contrato externo de Qlik.
8. Las escrituras repetibles aceptan clave de idempotencia.
9. Los hechos relevantes generan auditoría y evento outbox.
10. Los tokens de Qlik no salen del backend ni se escriben en logs.

## API de negocio frente a API externa

Hay dos superficies intencionales:

- `/api/automatizaciones`, `/api/flujos` y `/api/destinos`: API estable del producto, con DTO en español.
- `/api/qlik/*`: proxy controlado y validado de endpoints oficiales. Conserva las respuestas exitosas de Qlik; los errores se traducen al contrato común para operaciones administrativas o avanzadas.

El frontend debe usar la API de negocio. El proxy no debe convertirse en un atajo para saltarse casos de uso del dominio.

## Creación desde plantilla

Qlik no publica una API independiente para instanciar las plantillas visuales del catálogo. El caso de uso implementado trata una automatización existente como plantilla:

```text
copiar automatización
  → cambiar espacio opcional
  → obtener workspace
  → reemplazar únicamente rutas JSON Pointer existentes
  → actualizar definición completa
  → cambiar propietario opcional (al final)
  → auditoría + outbox + completar idempotencia
```

Si un paso posterior a la copia falla, el caso de uso intenta eliminar la copia para no dejar recursos incompletos.

## Fronteras del frontend

```text
apps/web/src/
├── app/                    # router, layout y providers
├── compartido/             # API client, UI y feedback transversal
└── modulos/
    ├── autenticacion/
    ├── automatizaciones/
    ├── flujos/
    └── inicio/
```

Cada feature contiene su API, páginas, rutas y `publico.ts`. La feature no conoce Drizzle ni la forma cruda de Qlik.
