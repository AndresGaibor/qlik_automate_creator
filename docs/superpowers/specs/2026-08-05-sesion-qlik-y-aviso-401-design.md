# Diseño: sesión Qlik determinista y aviso de autenticación

## Objetivo

Evitar que una sesión recién creada con OAuth Qlik se invalide al consultar una
identidad anterior del mismo usuario y tenant. Informar al usuario cuando la
aplicación lo redirige a login por una respuesta 401.

## Causa confirmada

`sesiones_usuario` conserva `identidad_qlik_id`, pero `obtenerInfoSesion` busca
otra identidad por `usuario_id` y `tenant_qlik_activo_id`. Un usuario puede tener
más de una identidad en ese tenant. Sin un orden explícito, la consulta puede
seleccionar una identidad anterior cuya credencial está vencida, aunque la
identidad asociada a la sesión tenga una credencial válida.

## Alcance

- Resolver la identidad de una sesión mediante `sesiones_usuario.identidad_qlik_id`.
- Conservar la comprobación de coherencia con el tenant activo de la sesión.
- Al recibir un 401, redirigir al login con un motivo seguro y permitido.
- Mostrar un aviso inline persistente en login.
- Usar texto específico para `CREDENCIALES_QLIK_INVALIDAS` y genérico para los
  demás 401.

No se modifican tablas, tokens, cifrado, ni el contrato de respuesta del API.

## Diseño

### Resolución de identidad

`RepositorioAutenticacionPostgres.obtenerInfoSesion` cargará la identidad por el
identificador almacenado en la sesión. Si no existe o su tenant no coincide con
`tenant_qlik_activo_id`, devolverá `null`. Así, la validación de credenciales usa
exactamente la identidad autenticada al crear la sesión.

### Motivo de redirección

El interceptor global de respuestas no autorizadas clasificará el código de API
en un motivo de URL limitado. Solo `CREDENCIALES_QLIK_INVALIDAS` se conservará
como motivo específico; los demás 401 usarán un motivo genérico. No se trasladan
mensajes de servidor, tokens ni información de la sesión.

La página de login leerá y traducirá el motivo a un aviso inline con `role="alert"`:

- Credenciales Qlik: "Tu conexión con Qlik Cloud venció. Inicia sesión nuevamente."
- Sesión genérica: "Tu sesión terminó. Inicia sesión nuevamente."

El aviso se mantiene visible en login y no se duplica mediante toast.

## Pruebas

- Repositorio: con dos identidades del mismo usuario y tenant, confirmar que una
  sesión usa su `identidad_qlik_id` y no la identidad anterior.
- Cliente/interceptor: un 401 con código de credenciales Qlik redirige con motivo
  específico; cualquier otro 401 usa motivo genérico.
- Login: ambos motivos muestran el mensaje inline correcto y accesible.
- Ejecutar typecheck y las suites afectadas de API y web.

## Riesgos

Las sesiones existentes que referencien una identidad eliminada o de otro tenant
pasarán a ser inválidas, que es el comportamiento seguro. La corrección no
recupera credenciales realmente vencidas.
