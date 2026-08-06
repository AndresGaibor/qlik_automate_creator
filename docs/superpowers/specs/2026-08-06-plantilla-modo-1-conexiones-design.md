# Plantilla Modo 1 con Conexiones y Postgres Destino

## Objetivo

Reemplazar el contrato actual del Modo 1 por la nueva plantilla Qlik configurada
para ejecutar un Dataflow mediante Talend. Al crear una automatizacion, la
plataforma debe detectar y validar todas las conexiones JDBC y SFTP usadas por
el Dataflow, exigir una conexion Postgres independiente como base destino y
configurar las variables del clon sin aceptar valores calculados por el
navegador.

La experiencia debe permitir crear y probar las conexiones faltantes dentro del
mismo asistente, sin perder el progreso de la automatizacion.

## Alcance

- La plantilla nueva reemplaza exclusivamente el contrato del Modo 1.
- El Modo 2 conserva su comportamiento y contrato actuales.
- Todas las conexiones JDBC y SFTP detectadas en el script son obligatorias.
- La conexion Postgres de base destino es obligatoria y se administra por
  separado de las conexiones de origen.
- El Modo 1 deja de pedir una tabla destino. El job determina las tablas a partir
  del script y de la configuracion de la base destino.
- Las conexiones creadas permanecen disponibles para la organizacion aunque la
  clonacion posterior falle.

## Decisiones Aprobadas

- Usar un preflight dirigido por backend para descubrir requisitos y comparar
  conexiones.
- Crear conexiones faltantes mediante formularios inline en el asistente.
- Probar todas las conexiones JDBC, SFTP y Postgres antes de clonar.
- Volver a validar todos los requisitos en servidor al ejecutar la creacion.
- Inyectar valores reales en `SECRETOSJSON` como excepcion temporal para el demo.
- Permitir la creacion a todos los usuarios que actualmente pueden crear
  automatizaciones.
- Codificar la llave privada SFTP en Base64 antes de incluirla en
  `SECRETOSJSON`.

## Arquitectura

### Preflight de Dataflow

Al seleccionar un Dataflow, el frontend solicita un preflight al backend. El
backend:

1. Obtiene el script actual desde Qlik.
2. Analiza todas las referencias JDBC y SFTP mediante el parser existente.
3. Compara cada referencia por tipo y nombre exacto con el catalogo de la
   organizacion.
4. Devuelve las conexiones requeridas, su disponibilidad y su estado de prueba.
5. Informa si existen conexiones Postgres elegibles como base destino.

La respuesta no contiene contrasenas, llaves privadas, valores cifrados ni el
JSON final de secretos.

### Validacion final

El preflight mejora la experiencia, pero no autoriza la creacion. Al recibir la
solicitud final, el backend vuelve a:

1. Leer el script actual.
2. Detectar las conexiones requeridas.
3. Comprobar que todas existen y que su prueba esta vigente o repetir la prueba.
4. Validar que el destino seleccionado existe, pertenece a la organizacion y es
   Postgres.
5. Probar el Postgres destino.
6. Recuperar y descifrar los secretos requeridos.
7. Construir los cinco parametros de plantilla.
8. Validar el contrato de la plantilla antes de copiarla.
9. Crear y configurar el clon.

Si la configuracion del workspace falla, el backend elimina el clon incompleto.
Las conexiones guardadas no se eliminan porque son recursos reutilizables.

## Contrato de la Plantilla

La plantilla de Modo 1 debe declarar al menos estas variables de texto:

- `Appid`
- `DFScript`
- `ConexionJSON`
- `BaseDestinoJSON`
- `SECRETOSJSON`

Puede conservar variables adicionales de la plantilla, que no se modifican ni
forman parte del contrato nuevo. La configuracion debe actualizar de forma consistente tanto la coleccion
`variables` del workspace como la operacion `set_value` del `VariableBlock`
correspondiente. La ausencia de cualquier variable rechaza la operacion antes de
crear el clon.

### Appid

Contiene el ID del Dataflow seleccionado.

### DFScript

Contiene el script actual completo recuperado desde Qlik en el momento de crear
la automatizacion.

### ConexionJSON

Contiene el catalogo de todas las conexiones JDBC y SFTP detectadas. Incluye su
configuracion, allowlists, propiedades y referencias como `secreto_nombre` o
`secreto_clave_privada_nombre`, pero no contiene valores secretos.

### BaseDestinoJSON

Se construye desde la conexion Postgres destino seleccionada con esta forma:

```json
{
  "tipo": "postgres",
  "host": "db.example.internal",
  "puerto": 5432,
  "database": "analytics",
  "esquema": "public",
  "secreto_nombre": "POSTGRES_DESTINO_ANALYTICS"
}
```

No incluye usuario ni contrasena.

### SECRETOSJSON

Es un objeto que relaciona cada referencia usada en `ConexionJSON` y
`BaseDestinoJSON` con su valor real:

- JDBC de origen: `usuario:clave`.
- Postgres destino: `usuario:clave`.
- SFTP: contenido PEM codificado en Base64. Su referencia termina en `_B64`.

Este objeto se construye unicamente en el backend. El navegador no puede enviar
ni sobrescribir su contenido.

## Gestion de Secretos

Los secretos JDBC y SFTP de origen continuan almacenados cifrados mediante el
servicio existente. La contrasena del Postgres destino tambien se mueve a
almacenamiento cifrado; la configuracion normal conserva solo host, puerto,
database, esquema, usuario, SSL y la referencia del secreto.

Los valores descifrados no deben aparecer en:

- respuestas de preflight o creacion;
- consultas normales de conexiones;
- auditoria;
- outbox;
- logs;
- mensajes de error.

### Excepcion temporal del demo

`SECRETOSJSON` queda escrito como texto en el workspace del clon de Qlik. Por
esta razon, cualquier usuario con permiso para editar esa automatizacion en Qlik
puede leer sus credenciales. El asistente muestra esta advertencia antes de la
confirmacion.

Esta excepcion esta aprobada solo para el demo y no cambia la obligacion de
proteger los secretos dentro de la plataforma.

## Flujo de Interfaz

### Paso 1: Dataflow

El usuario selecciona el Dataflow. La UI ejecuta el preflight y presenta el
resultado del analisis.

### Paso 2: Conexiones requeridas

La UI lista cada JDBC y SFTP detectado por su tipo y nombre exacto:

- una conexion existente y probada aparece lista;
- una conexion existente con error permite corregirse y probarse otra vez;
- una conexion faltante muestra su formulario inline;
- no se puede continuar mientras alguna conexion falte o falle.

Al guardar una conexion, el asistente la prueba y conserva el resto del
progreso. Si el usuario cambia de Dataflow, descarta el preflight anterior y
calcula uno nuevo, sin eliminar conexiones ya registradas.

### Paso 3: Base destino Postgres

El usuario elige una conexion Postgres existente o crea una inline. El
formulario solicita:

- nombre;
- host;
- puerto;
- base de datos;
- esquema;
- usuario;
- contrasena;
- configuracion SSL.

La conexion debe superar su prueba antes de continuar. No se solicita tabla
destino.

### Paso 4: Confirmacion

El usuario define el nombre y revisa el resumen de Dataflow, conexiones de
origen y Postgres destino. Antes de crear se muestra la advertencia sobre la
visibilidad de `SECRETOSJSON` en Qlik.

## API

### Preflight

Se agrega una operacion bajo `/automatizaciones` que recibe `flujoId` y devuelve:

- identificacion del Dataflow;
- conexiones requeridas por tipo y nombre;
- conexion registrada asociada, si existe;
- estado de disponibilidad/prueba;
- conexiones Postgres destino elegibles.

El endpoint aplica el tenant, organizacion y politica de espacios de la sesion.

### Prueba de conexiones de origen

Se agrega una operacion para probar conexiones JDBC y SFTP registradas. La
prueba se ejecuta server-side usando el secreto cifrado y persiste un estado no
sensible con fecha y mensaje sanitizado.

### Creacion desde plantilla

Para Modo 1, la entrada util contiene:

- `nombre`;
- `flujoId`;
- `destinoId`;
- `espacioIdQlik`, cuando aplique;
- clave de idempotencia.

El backend ignora cualquier plantilla, script, catalogo o secreto proporcionado
por el cliente. El Modo 2 conserva su entrada actual.

## Errores

- `VARIABLES_PLANTILLA_FALTANTES`: la plantilla no declara el contrato completo.
- `CONEXIONES_ORIGEN_FALTANTES`: lista solo tipos y nombres no configurados.
- `CONEXION_ORIGEN_NO_DISPONIBLE`: identifica la conexion y devuelve un mensaje
  sanitizado.
- `DESTINO_POSTGRES_REQUERIDO`: falta la seleccion de base destino.
- `DESTINO_POSTGRES_NO_ENCONTRADO`: el destino no existe o no pertenece a la
  organizacion.
- `DESTINO_POSTGRES_NO_DISPONIBLE`: la prueba de destino falla.
- `SECRETO_REQUERIDO_FALTANTE`: informa solo la referencia ausente.
- Fallo al actualizar el workspace: elimina el clon y devuelve un error
  accionable sin valores sensibles.

La idempotencia existente evita clones duplicados ante reintentos.

## Pruebas

### Backend

- Descubrimiento de todas las conexiones JDBC/SFTP del script.
- Comparacion exacta por tipo y nombre.
- Preflight sin valores secretos.
- Rechazo de conexiones faltantes o con prueba fallida.
- Rechazo de destinos que no sean Postgres o pertenezcan a otra organizacion.
- Pruebas JDBC, SFTP y Postgres mediante adaptadores simulados.
- Construccion de `Appid`, `DFScript`, `ConexionJSON`, `BaseDestinoJSON` y
  `SECRETOSJSON`.
- Formato `usuario:clave` para JDBC/Postgres.
- Codificacion Base64 de la llave privada SFTP.
- Sincronizacion de `variables` y `VariableBlock`.
- Validacion previa de las cinco variables.
- Cifrado del secreto de Postgres y migracion de configuraciones existentes.
- Ausencia de secretos en respuestas, auditoria, outbox y errores.
- Eliminacion del clon cuando falla su configuracion.
- Idempotencia de la creacion.

### Frontend

- Render del resultado de preflight.
- Conexion existente y probada.
- Creacion inline de JDBC y SFTP.
- Correccion y repeticion de una prueba fallida.
- Postgres destino obligatorio y creacion inline.
- Ausencia del selector de tabla en Modo 1.
- Conservacion del progreso tras guardar conexiones.
- Reinicio del preflight al cambiar de Dataflow.
- Advertencia de secretos y creacion exitosa.

## Migracion

La migracion de conexiones Postgres existentes debe extraer la contrasena de la
configuracion, cifrarla en el almacen de secretos y reemplazarla por una
referencia. Debe poder ejecutarse de forma segura sobre registros sin contrasena
o ya migrados y nunca registrar el valor durante el proceso.

La ejecucion de esta migracion requiere aprobacion humana separada antes de
implementarse o ejecutarse.

## Fuera de Alcance

- Modificar automatizaciones ya clonadas.
- Cambiar el contrato del Modo 2.
- Crear o administrar el job de Talend.
- Ocultar `SECRETOSJSON` dentro del workspace de Qlik durante el demo.
- Permitir elegir una tabla destino en Modo 1.
- Eliminar automaticamente conexiones creadas si luego falla la clonacion.

## Criterios de Aceptacion

- Un usuario no puede clonar hasta que todas las conexiones detectadas y el
  Postgres destino existan y superen sus pruebas.
- El usuario puede crear conexiones faltantes sin salir del asistente.
- El clon contiene las cinco variables con valores derivados en servidor.
- `BaseDestinoJSON` representa siempre el Postgres seleccionado.
- `SECRETOSJSON` contiene los secretos reales requeridos, incluida la llave SFTP
  en Base64, y no se devuelve al navegador.
- Ningun secreto aparece en respuestas, logs, auditoria, outbox o errores.
- Un fallo al configurar el workspace no deja un clon incompleto.
- El Modo 2 sigue funcionando sin cambios.
