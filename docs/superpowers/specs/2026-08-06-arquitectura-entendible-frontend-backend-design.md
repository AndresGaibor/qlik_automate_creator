# Diseño de arquitectura entendible para frontend y backend

## Objetivo

Hacer que `qlik_automate_creator` pueda ser entendido y modificado por una persona sin depender de contexto implícito, nombres genéricos ni capas ceremoniales. La arquitectura existente se conserva: monolito modular en backend y módulos funcionales en frontend.

El cambio debe corregir desviaciones reales de responsabilidades, eliminar comportamiento ficticio de la interfaz y añadir protecciones automáticas para impedir que la arquitectura vuelva a degradarse.

## Principios

1. Una unidad tiene una responsabilidad principal y un nombre que explique para qué existe.
2. Las rutas HTTP traducen solicitudes y respuestas; no implementan persistencia ni reglas de negocio.
3. Los casos de uso coordinan operaciones mediante puertos.
4. La infraestructura conoce PostgreSQL, Qlik, Impala, SFTP y otros servicios externos.
5. El dominio no conoce frameworks, transporte ni adaptadores.
6. El frontend solo muestra capacidades reales del sistema.
7. Los comentarios explican decisiones no evidentes, no repiten el código.
8. No se añaden abstracciones genéricas sin al menos dos consumidores reales.

## Estado observado

La documentación ya define límites correctos, pero el código no los aplica de forma uniforme. Existen rutas que importan Drizzle, una fábrica de aplicación que construye adaptadores, módulos frontend que importan archivos internos de otros módulos y páginas con demasiadas responsabilidades.

Los puntos prioritarios son:

- `apps/api/src/app.ts` mezcla ensamblaje con consultas y callbacks de persistencia.
- `origenes/http` y partes de `flujos/http` acceden directamente a PostgreSQL.
- `destinos/aplicacion/fabrica-destinos.ts` construye adaptadores concretos.
- `automatizaciones/http/rutas-panel.ts` acumula demasiadas capacidades.
- Varias features frontend no exponen una API pública estable.
- `pagina-tablas-destino.tsx` mezcla datos, permisos, presentación y funcionalidad simulada.
- El script raíz de pruebas ejecuta pruebas Vitest con Bun Test.
- Las pruebas arquitectónicas solo cubren una parte de `admin`.

## Arquitectura backend

Cada módulo mantiene esta forma cuando las capas sean necesarias:

```text
modulo/
├── dominio/
├── aplicacion/
│   ├── casos-de-uso/
│   └── puertos/
├── infraestructura/
├── http/
└── publico.ts
```

No se crearán carpetas vacías ni capas sin comportamiento. Un módulo CRUD sencillo puede tener casos de uso funcionales en lugar de clases si eso reduce ruido.

### Responsabilidades backend

- HTTP valida parámetros con contratos compartidos, obtiene contexto, llama un caso de uso y serializa el resultado.
- Aplicación decide el orden de operaciones y depende de interfaces pequeñas.
- Infraestructura implementa consultas, transacciones, cifrado persistido y clientes externos.
- `app.ts` conserva la decisión final de qué implementación conecta con cada puerto.
- Las políticas de autorización reutilizables se resuelven mediante servicios de aplicación, no closures duplicados en rutas.
- Los errores de negocio se expresan mediante errores de aplicación; las rutas no construyen manualmente el mismo JSON en varios lugares.

### Cambios backend prioritarios

1. Convertir conexiones de origen en un módulo completo: puerto de repositorio, casos de uso y repositorio PostgreSQL.
2. Extraer el acceso a conexiones de origen usado por flujos hacia un puerto de consulta.
3. Mover la fábrica de clientes destino a infraestructura.
4. Reforzar `app.ts` para que solo ensamble dependencias y registre rutas.
5. Dividir rutas grandes por capacidad cuando la extracción reduzca responsabilidades reales.
6. Ampliar las pruebas arquitectónicas a todos los módulos.

## Arquitectura frontend

Cada feature expone `publico.ts`. Los consumidores externos importan desde esa superficie y no desde `api.ts`, páginas o componentes internos.

```text
modulos/tablas/
├── api.ts
├── consultas.ts
├── modelo-presentacion.ts
├── pagina-tablas-destino.tsx
├── componentes/
└── publico.ts
```

### Responsabilidades frontend

- `api.ts` contiene llamadas HTTP y tipos de transporte.
- `consultas.ts` define query keys, queries y mutaciones de React Query.
- Las páginas coordinan selección, navegación y composición.
- Los componentes reciben datos y callbacks explícitos.
- Las transformaciones de DTO a presentación son funciones puras.
- La autorización visual consume una API pública de sesión; nunca reimplementa reglas del backend.

### Eliminación de comportamiento ficticio

La página de tablas no debe simular solicitudes de aprobación, historiales, usuarios, fechas ni estados que el backend no expone. Las acciones sin soporte real se ocultan o se presentan como no disponibles, sin generar mensajes de éxito falsos.

El historial solo se renderizará cuando exista un contrato y endpoint real. Hasta entonces, la pantalla mostrará datos reales del catálogo y una explicación breve de que la vista es de solo lectura.

## Comentarios y nombres

Se comentarán únicamente:

- restricciones o rarezas de APIs externas;
- decisiones de seguridad;
- compatibilidad temporal con datos heredados;
- compensaciones y transacciones no evidentes;
- invariantes de un puerto o caso de uso.

Se eliminarán comentarios numerados, rótulos de JSX y explicaciones que repitan el nombre de una función. Los nombres deben usar el vocabulario del producto en español y evitar `manager`, `helper`, `processor`, `data` o `utils` cuando exista un concepto más preciso.

## Protecciones automáticas

Las pruebas de arquitectura deben fallar cuando:

- un archivo bajo `modulos/*/http` importe Drizzle o persistencia;
- aplicación importe infraestructura, Hono o React;
- dominio importe aplicación, HTTP, plataforma o infraestructura;
- un módulo backend importe carpetas internas de otro módulo;
- una feature frontend importe archivos internos de otra feature;
- una feature frontend no exponga `publico.ts` cuando tenga consumidores externos.

Las excepciones necesarias deberán declararse con una razón concreta y revisable, no mediante patrones amplios.

## Verificación

Los comandos canónicos serán:

```bash
bun run lint
bun run typecheck
bun run test:api
bun run test:web
bun run build
```

El script raíz `test` ejecutará por separado Bun Test para backend/contratos y Vitest para frontend.

## Restricciones de ejecución

- Trabajar directamente en `main`, sin worktrees, por autorización expresa del usuario.
- Preservar los cambios locales existentes y no incorporarlos accidentalmente en commits.
- No cambiar contratos de negocio salvo para corregir una capacidad ficticia o una violación demostrada.
- No añadir dependencias nuevas si el problema puede resolverse con TypeScript, Bun, Vitest y las herramientas existentes.
- Aplicar la refactorización en bloques pequeños y verificables.
