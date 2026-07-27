# Diseño de mejora integral del frontend

## Objetivo

Unificar la interfaz, mejorar la claridad de los estados y reducir el coste de mantenimiento sin cambiar los contratos de negocio ni añadir Storybook.

## Alcance

1. Consistencia visual: modales, paneles, badges, loaders, sombras, radios, tokens y movimiento.
2. UX funcional: carga, vacío, error, permisos, dependencias no configuradas, filtros, paginación y acciones destructivas.
3. Mantenibilidad: extraer responsabilidades de `pagina-tablas-destino.tsx`, `visor-workspace-modal.tsx` y `seccion-setup-tecnico.tsx`.

## Sistema visual

- Usar únicamente tokens de `index.css` para superficies, texto, bordes y estados.
- Reservar radios grandes y sombras fuertes para diálogos; paneles normales usan `rounded-lg`, borde y sombra mínima.
- Eliminar pulsos decorativos. Una animación solo representa una operación activa.
- Sustituir badges ornamentales por `EstadoEtiqueta`, con icono opcional y texto explícito.
- Unificar diálogos con un componente accesible que controle foco, Escape, título, descripción y restauración del foco.

## Estados de interfaz

- `EstadoCarga`: spinner discreto, `role=status`, `aria-live=polite`, soporte de tamaño compacto.
- `EstadoVacio`: título, descripción y acción opcional; nunca simula datos.
- `EstadoError`: mensaje humano, detalle técnico opcional y reintento.
- `EstadoDependencia`: diferencia falta de configuración, falta de permisos y servicio no disponible.
- Los filtros conservan el contexto del tenant, informan resultados y se pueden limpiar.

## Mantenibilidad

- La página de tablas conserva coordinación de consultas y estado; lista, detalle y modal de solicitud pasan a componentes propios.
- El visor de workspace conserva carga/mutaciones; editor JSON, topología y modal pasan a unidades separadas.
- El setup técnico conserva coordinación; Qlik, plantilla e Impala pasan a secciones aisladas con props explícitas.

## Restricciones

- Sin Storybook.
- Sin cambios de contratos API ni lógica de negocio salvo corrección demostrada.
- Nombres, textos, estados y ejemplos en español, excepto términos oficiales Qlik/OAuth/Impala.
- Cada bloque debe pasar Biome, typecheck, pruebas, build y auditoría.
- Los cambios se publican en commits separados y revisables.
