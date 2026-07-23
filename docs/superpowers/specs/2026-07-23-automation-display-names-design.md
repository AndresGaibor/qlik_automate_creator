# Nombres legibles en automatizaciones

## Objetivo

Mostrar en `/automatizaciones` el nombre legible del espacio y del propietario en lugar de los identificadores crudos de Qlik Automate.

## Alcance

- Enriquecer las respuestas de `/api/qlik/automatizaciones` y `/api/qlik/automatizaciones/:id` en el backend.
- Resolver espacios mediante `/api/v1/spaces` y `/api/v1/spaces/{spaceId}`.
- Resolver propietarios mediante `/api/v1/users/{ownerId}`.
- Mantener la UI consumiendo `espacioNombre` y `ownerNombre`.
- Conservar el ID únicamente como fallback cuando Qlik no permita resolver el nombre.

## Flujo de datos

1. Qlik Automate devuelve `spaceId` y `ownerId`.
2. El backend deduplica esos IDs.
3. Consulta los recursos de Spaces y Users en paralelo.
4. Usa `Promise.allSettled` para tolerar fallos parciales.
5. El mapeador entrega nombres legibles al frontend.

## Reglas de resolución

- Espacio: `space.name` resuelto; si no está disponible, `spaceId`.
- Propietario: `owner.name` existente, luego `user.name`, `user.email`, `user.subject` y finalmente `ownerId`.
- Un error `403`, `404` o una respuesta sin nombre no debe convertir una lista válida de automatizaciones en error `500`.

## Pruebas de aceptación

- Un payload real con `spaceId` y `ownerId` muestra nombres legibles.
- Los IDs se deduplican antes de consultar Qlik.
- Fallar al consultar un espacio o usuario mantiene la respuesta `200` y usa el fallback.
- Las respuestas incompletas de Users API no provocan excepciones.
- El detalle de una automatización aplica las mismas reglas.
- La UI no muestra el ID cuando existe un nombre resuelto.

## Fuera de alcance

- Resolver nombres desde el frontend.
- Añadir persistencia o cache local de espacios y usuarios.
- Cambiar contratos públicos distintos al endpoint de automatizaciones.
