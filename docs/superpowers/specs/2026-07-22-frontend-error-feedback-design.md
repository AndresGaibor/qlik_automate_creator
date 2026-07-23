# Diseño: feedback visible de errores en frontend

## Objetivo

Evitar errores silenciosos en la interfaz y mostrar feedback inmediato cuando fallen
las consultas o mutaciones de autenticación, flujos y automatizaciones.

## Alcance

- Toast global para errores de API y acciones de sesión.
- Mensaje inline reutilizable en las páginas de flujos y automatizaciones.
- Botón de reintento para errores de consultas.
- React Query sin reintentos automáticos para evitar peticiones repetidas y toasts duplicados.
- Mensajes derivados de la respuesta `{ success, error }` del API.
- Redirección a `/login` cuando una consulta de sesión responde 401.

No se añade una dependencia externa de notificaciones.

## Arquitectura

### Notificaciones globales

Crear un contexto/provider de notificaciones montado sobre la aplicación. Expondrá una
función `mostrarError(mensaje)` y renderizará un toast accesible con `role="alert"`,
botón de cierre y autocierre breve.

### Estado inline

Crear un componente `EstadoError` que reciba el mensaje y opcionalmente una acción de
reintento. Se mostrará en lugar del contenido de la consulta cuando exista error.

### Consultas

Las páginas `PaginaFlujos` y `PaginaAutomatizaciones` usarán `isError`, `error` y
`refetch` de React Query. Cada error se notificará una vez mediante un efecto y se
mostrará también inline. Las consultas tendrán `retry: false`.

### Sesión y logout

El layout mostrará un toast si falla el logout. La consulta de sesión no generará una
notificación duplicada cuando la respuesta sea 401: redirigirá a login y el estado
inline no se aplica al layout.

## Flujo de datos

1. El fetch recibe una respuesta no exitosa o `{ success: false }`.
2. La query convierte la respuesta en un `Error` con mensaje seguro.
3. React Query expone el error a la página.
4. La página dispara un toast una sola vez y renderiza `EstadoError`.
5. El usuario pulsa “Reintentar”, que llama `refetch`.

## Accesibilidad y UX

- Toast con `role="alert"` y texto claro en español.
- Error inline visible sin depender exclusivamente de color.
- Botón de reintento operable con teclado.
- No se muestran stacks, tokens ni detalles internos del servidor.

## Verificación

- Tests del provider/toast.
- Tests de estado inline y reintento en ambas páginas.
- Tests de logout fallido mostrando toast.
- Suite web completa y typecheck, documentando errores preexistentes si aparecen.
