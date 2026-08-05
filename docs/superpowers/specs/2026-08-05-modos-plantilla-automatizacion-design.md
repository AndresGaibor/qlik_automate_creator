# Modos de Plantilla para Automatizaciones

## Objetivo

La plataforma debe soportar dos formas excluyentes de crear nuevas automatizaciones Qlik:

- Modo 1: la automatizacion lee el script completo del Dataflow y ejecuta el job Spark/Python. El job recibe el catalogo Spark JSON de conexiones registradas y usa su parametro protegido de secretos.
- Modo 2: la automatizacion ejecuta el Dataflow, espera su resultado en SFTP y llama al job Talend fijo de la plantilla. Recibe la ruta SFTP y el esquema de una tabla destino seleccionada.

Un admin puede elegir globalmente el modo activo. El cambio solo afecta automatizaciones creadas despues del cambio; los clones existentes no se modifican.

## Decisiones Aprobadas

- Cada tenant Qlik configura dos plantillas: una para modo 1 y otra para modo 2.
- El modo activo es unico y global para toda la plataforma. Cualquier admin puede cambiarlo.
- La plantilla Qlik de modo 2 orquesta el Dataflow y el Talend. El job Talend, su URL y sus credenciales son fijos dentro de esa plantilla.
- Modo 2 procesa una sola tabla destino elegida durante la creacion.
- Los secretos reales no se escriben en el workspace de Qlik, eventos, auditoria ni respuestas habituales.
- Un admin de la organizacion puede revelar y copiar bajo demanda un JSON de secretos para pegarlo manualmente en el parametro protegido del job.

## Modelo de Datos

### Plantillas por tenant

Se agregan a `tenants_qlik` cuatro campos persistentes:

- `automatizacion_plantilla_modo_1_id_qlik`
- `automatizacion_plantilla_modo_1_nombre`
- `automatizacion_plantilla_modo_2_id_qlik`
- `automatizacion_plantilla_modo_2_nombre`

La migracion copia la plantilla base actual a los campos de modo 1. Se conserva la configuracion actual durante la transicion para que los tenants existentes no pierdan su configuracion.

### Modo global

Se crea una configuracion singleton de plataforma con:

- `modo_automatizacion_activo`: `1` o `2`, inicializado en `1`.
- `actualizado_en`.
- `actualizado_por_usuario_id` para trazabilidad.

Solo existe un registro. Su alcance es global, no por organizacion ni por tenant. Cualquier admin autenticado puede modificarlo conforme a la decision de producto.

### Secretos de conexiones origen

Las conexiones origen continuan almacenando metadatos en `conexiones_origen.config`, incluidos `secreto_nombre` o `secreto_clave_privada_nombre`.

Se crea una tabla separada de secretos cifrados por conexion, con al menos:

- identificador de conexion origen;
- nombre de secreto;
- valor cifrado mediante el servicio de cifrado existente;
- fechas de creacion y actualizacion.

El valor cifrado no forma parte de las consultas normales de conexiones, catalogos Spark, auditorias, outbox ni errores HTTP.

## Contratos de Plantilla Qlik

La plataforma deja de depender de regex y valores fallback para configurar bloques. Cada plantilla debe declarar variables con los nombres indicados. Antes de crear el clon, el backend valida que la plantilla contenga todas las variables requeridas; si no, rechaza la operacion sin crear una automatizacion incompleta.

### Modo 1: Spark/Python

La plataforma obtiene el script actual del Dataflow y genera el Catalogo Spark JSON desde las conexiones origen registradas. Inyecta estas variables de texto en la plantilla:

- `DataflowId`
- `DataflowScriptContenido`
- `ConexionesContenido`
- `EjecucionId`
- `TablaDestino`

`ConexionesContenido` conserva el contrato del catalogo Spark y contiene referencias como `secreto_nombre`, pero nunca el valor del secreto. La plantilla pasa ese contenido a su job Python, por ejemplo mediante `--dataflow-script-contenido`, `--conexiones-contenido` y `--ejecucion-id`.

El administrador configura manualmente el parametro protegido `MOTOR_SECRETOS_JSON` del job con el JSON revelado por la plataforma. El job lo convierte en sus argumentos `--secreto` o en variables de entorno de Spark.

### Modo 2: Dataflow, SFTP y Talend

Al crear, el usuario debe elegir una conexion destino y una tabla de esa conexion. El backend recupera el detalle de la tabla, incluidas sus columnas, y genera los datos de SFTP desde el Catalogo Spark del Dataflow.

La plantilla de modo 2 debe declarar estas variables de texto:

- `DataflowId`
- `RutasSftpContenido`
- `EsquemaTablaDestino`
- `EjecucionId`
- `TablaDestino`

`RutasSftpContenido` es JSON con rutas y archivos descubiertos del Dataflow. `EsquemaTablaDestino` es JSON del recurso destino seleccionado, incluido su listado de columnas. La plantilla ejecuta el Dataflow, espera que termine y llama al job Talend fijo con esos dos argumentos. Sus secretos se administran fuera de la plataforma como parametros protegidos del job.

## API y Reglas de Aplicacion

### Configuracion admin

- La configuracion de plantilla por tenant acepta un modo explicito y guarda solo la plantilla de ese modo.
- La API global permite consultar y actualizar `modo_automatizacion_activo`.
- La lectura de configuracion del tenant para crear automatizaciones devuelve el modo global y la plantilla efectiva, sin permitir que el navegador elija otra plantilla.

### Creacion de automatizacion

1. El backend lee el modo global.
2. Obtiene la plantilla del modo seleccionado para el tenant Qlik de la sesion.
3. Si falta, devuelve un 422 accionable que indica configurar la plantilla del modo activo.
4. Construye el payload de modo 1 o modo 2 en servidor.
5. Valida las variables de la plantilla y crea el clon solo si el contrato se cumple.
6. Incluye el modo aplicado en la respuesta, auditoria y evento de creacion para trazabilidad.
7. Si falla la configuracion del workspace tras copiar, elimina el clon y devuelve un mensaje accionable.

La API ignora cualquier plantilla o payload de modo recibido desde el navegador. El modo global y el tenant de sesion son la fuente de verdad.

### Revelacion de secretos

Un endpoint exclusivo para administradores de la organizacion produce un objeto como:

```json
{
  "POSTGRES_BANCOLOMBIA": "usuario:clave",
  "SFTP_PRIVATE_KEY_B64": "claveprivada",
  "BASE_DESTINO": "secreto"
}
```

La operacion es explicita, no se cachea y no registra los valores. La auditoria puede registrar que se revelo un contexto de secretos, sin incluir su contenido.

## Interfaz

### Detalle de tenant

La seccion actual de plantilla base muestra dos selectores independientes:

- Plantilla modo 1: Spark/Python.
- Plantilla modo 2: Dataflow, SFTP y Talend.

Cada selector muestra su estado de configuracion y guarda por separado.

### Configuracion

La pagina Configuracion incluye una card de modo global con dos opciones y una advertencia clara: el cambio afecta nuevas automatizaciones de todos los tenants, no clones existentes.

### Nueva automatizacion

La pagina muestra el modo y la plantilla efectivos como informacion de solo lectura. En modo 2 exige una conexion destino y una tabla antes de permitir crear. En modo 1 conserva el flujo actual de tabla destino.

### Conexiones para automatizaciones

Los formularios JDBC y SFTP agregan el campo de valor secreto. La lista normal muestra solo indicadores o mascaras. Un boton protegido permite revelar y copiar el JSON de contexto de secretos para configurar el job.

## Errores

- Modo activo sin plantilla en el tenant: 422 con enlace o instruccion de configuracion.
- Plantilla sin variables requeridas: 422 con modo y variables faltantes.
- Modo 2 sin conexion destino, tabla, ruta SFTP o esquema: 422 con el dato faltante.
- Secreto requerido sin valor cifrado: el JSON no se genera y se indica el nombre faltante.
- Fallo de copia o actualizacion de workspace: se elimina el clon y se conserva el error accionable sin filtrar secretos.

## Pruebas

- Migracion de plantilla existente a modo 1 y modo global inicial en 1.
- Resolucion server-side de la plantilla correcta segun el modo global.
- Rechazo cuando falta la plantilla activa.
- Construccion de payload modo 1 con script y catalogo Spark completos, sin valores secretos.
- Construccion de payload modo 2 con ruta SFTP y esquema de la tabla destino seleccionada.
- Validacion de variables requeridas y limpieza del clon incompleto.
- Cifrado de secretos, ocultamiento en lecturas normales y revelacion autorizada sin filtrar valores a logs/auditoria.
- UI de dos plantillas, switch global, estado efectivo y requisito de destino en modo 2.

## Fuera de Alcance

- Migrar o modificar automatizaciones Qlik ya clonadas.
- Crear o administrar jobs Talend desde la plataforma.
- Implementar scheduling nuevo; la ejecucion y scheduling existentes de Qlik permanecen sin cambios.
- Resolver secretos automaticamente dentro de Talend o Spark durante la ejecucion.
