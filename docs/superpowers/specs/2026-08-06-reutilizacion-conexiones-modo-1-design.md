# Diseño: reutilización organizacional de conexiones en Modo 1

Fecha: 2026-08-06
Estado: aprobado

## 1. Objetivo

Evitar que cada usuario vuelva a ingresar host, puerto, base de datos, usuario o llave privada cuando una conexión requerida por un Dataflow ya fue registrada para la misma organización.

Las conexiones de origen serán recursos compartidos de la organización. El asistente de creación de automatizaciones reutilizará automáticamente una conexión existente identificada por su tipo y el nombre exacto usado por Qlik.

## 2. Regla de identidad

La identidad funcional de una conexión será:

```text
(organizacionId, tipo, nombre exacto de Qlik)
```

No se reutilizará únicamente por host, porque un mismo servidor puede contener varias bases, usuarios, rutas o credenciales diferentes.

El usuario que creó la conexión no será parte de la identidad. Cualquier usuario autorizado de la misma organización podrá reutilizarla sin conocer sus secretos.

## 3. Estados y comportamiento del preflight

Para cada requisito descubierto en el script del Dataflow, el backend buscará una conexión de la organización por `(tipo, nombre)` y devolverá uno de estos estados:

### Conexión inexistente

- Estado público: `faltante`.
- La interfaz muestra el formulario completo.
- El usuario registra la conexión una sola vez y la prueba.
- Después del guardado, el preflight se actualiza y la conexión queda disponible para toda la organización.

### Conexión existente sin probar

- Estado público: `sin_probar`.
- La interfaz no muestra host, puerto, usuario, base, contraseña ni llave privada.
- Se muestra una tarjeta de conexión guardada con el botón **Probar conexión guardada**.
- La prueba usa configuración y secretos almacenados en el servidor.

### Conexión existente con error

- Estado público: `error`.
- La interfaz no solicita nuevamente los datos técnicos.
- Se muestra el mensaje seguro de la última prueba y el botón **Volver a probar**.
- Los administradores pueden abrir la edición desde Configuración.

### Conexión disponible

- Estado público: `disponible`.
- Se reutiliza automáticamente.
- La interfaz muestra únicamente una confirmación compacta de disponibilidad.

## 4. Experiencia del asistente Modo 1

En el paso **Verifica las conexiones de origen**, cada requisito se representa con una tarjeta compacta.

Una conexión guardada mostrará:

- nombre exacto de la conexión Qlik;
- tipo JDBC o SFTP;
- estado de la última prueba;
- fecha de la última prueba, cuando exista;
- acción para probar o volver a probar;
- enlace de edición solo para administradores.

No se mostrarán en esta pantalla los valores de host, URL JDBC, usuario, contraseña, PEM ni nombres internos de secretos.

El formulario completo aparecerá exclusivamente cuando el backend indique `faltante`.

Después de una prueba exitosa, la tarjeta cambia a `disponible` sin recargar toda la página. La automatización podrá crearse cuando todas las conexiones requeridas estén disponibles y el destino PostgreSQL seleccionado también esté probado.

## 5. API y flujo de datos

El endpoint de preflight continuará resolviendo los requisitos desde el script de Qlik y consultará todas las conexiones de la organización.

Para probar una conexión existente, el frontend utilizará el endpoint actual:

```http
POST /api/conexiones-origen/:id/probar
```

El backend resolverá la organización desde la sesión, comprobará que la conexión pertenezca a ella y recuperará únicamente el secreto necesario dentro del servidor.

La respuesta pública incluirá estado, fecha y mensaje seguro. Nunca incluirá configuración sensible ni secretos.

## 6. Permisos

Los usuarios finales podrán:

- reutilizar una conexión disponible;
- ejecutar la prueba de una conexión guardada;
- ver un mensaje seguro del resultado.

Los usuarios finales no podrán:

- leer la configuración técnica completa;
- revelar secretos;
- cambiar host, usuario, URL, ruta o credenciales;
- eliminar conexiones compartidas.

Los administradores conservarán la edición y eliminación desde Configuración. El enlace de edición apuntará a la conexión concreta sin exponer sus secretos en la URL.

## 7. Seguridad

La reutilización será siempre server-side. El navegador solo recibirá el identificador de la conexión, su nombre, tipo y estado.

La prueba debe:

- validar pertenencia a la organización;
- leer un solo secreto acotado por organización y conexión;
- cerrar conexiones JDBC/SFTP aunque ocurra un error;
- sanitizar mensajes de error;
- actualizar `estado`, `probadaEn` y `mensajeError`;
- no escribir secretos en logs, auditoría, outbox ni respuestas.

Una conexión con estado `sin_probar` o `error` no será considerada lista para construir `SECRETOSJSON` hasta que una nueva prueba termine correctamente.

## 8. Compatibilidad y alcance

No se cambia la forma en que Qlik nombra las conexiones. La coincidencia seguirá siendo exacta para evitar asociaciones ambiguas.

No se modifica Modo 2.

No se introducen conexiones globales entre organizaciones. Una organización nunca podrá reutilizar la conexión de otra.

No se copian conexiones entre tenants de organizaciones distintas. Si una organización contiene varios tenants Qlik, la conexión se comparte dentro de esa organización porque su identidad proviene del nombre exacto del script y su tipo.

## 9. Pruebas requeridas

Backend:

- preflight reutiliza una conexión `disponible` de otro usuario de la misma organización;
- preflight devuelve `sin_probar` y conserva `conexionId`;
- preflight devuelve `error` con mensaje seguro;
- una conexión de otra organización se considera `faltante`;
- mismo nombre con tipos JDBC y SFTP no se confunde;
- probar una conexión guardada actualiza estado y fecha sin recibir credenciales nuevas;
- respuestas, auditoría y logs no contienen secretos.

Frontend:

- `disponible` muestra confirmación sin formulario;
- `sin_probar` muestra **Probar conexión guardada** sin campos técnicos;
- `error` muestra **Volver a probar** y el mensaje seguro;
- `faltante` muestra el formulario completo;
- una prueba exitosa invalida y actualiza el preflight;
- el enlace de edición aparece solo para administradores;
- Modo 2 conserva sus regresiones actuales.

## 10. Criterios de aceptación

La funcionalidad se considera terminada cuando un segundo usuario de la misma organización puede seleccionar un Dataflow que usa una conexión ya registrada y continuar sin volver a ingresar host, puerto, base, usuario, contraseña o llave privada.

Si la conexión existe pero nunca fue probada, el segundo usuario solo debe pulsar **Probar conexión guardada**. Si la prueba termina correctamente, la conexión pasa a disponible y puede reutilizarse en futuras automatizaciones.