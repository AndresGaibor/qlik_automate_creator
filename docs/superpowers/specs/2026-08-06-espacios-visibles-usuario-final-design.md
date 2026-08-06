# Espacios visibles de Qlik Cloud para usuarios finales

**Fecha:** 2026-08-06  
**Estado:** diseño aprobado  
**Ámbito:** configuración administrativa, persistencia, API y autorización de Dataflows y automatizaciones.

## 1. Objetivo

Permitir que el administrador de la organización seleccione qué espacios de Qlik Cloud estarán disponibles para los usuarios finales. La misma política debe limitar Dataflows y automatizaciones en listados, filtros, detalles, ejecuciones, creación y acceso directo por API.

La solución será cerrada por defecto: mientras no exista al menos un espacio autorizado ni se permita la categoría especial de recursos personales o sin espacio, el usuario final no verá recursos.

## 2. Decisiones aprobadas

- Existe una única política de espacios visibles para toda la organización y su tenant Qlik principal.
- La política se aplica a usuarios con rol `usuario`.
- También se aplica a administradores cuando activan **Vista usuario final**.
- Un administrador en vista administrativa normal conserva acceso a todos los espacios que permita Qlik.
- Los recursos personales o sin espacio se controlan mediante una opción independiente.
- Ocultar en frontend no es suficiente: la API y las rutas directas deben bloquear recursos no autorizados.
- Sin configuración, el resultado es acceso cerrado.
- La autorización se guarda por ID estable de espacio, no por nombre.
- El usuario final no verá un selector de espacio ni la opción **Todos los espacios**; los recursos autorizados se combinarán automáticamente.
- El filtro por espacio permanecerá disponible únicamente para administradores en vista administrativa normal.

## 3. Enfoque arquitectónico

Se implementará una política centralizada por tenant Qlik. El backend será la autoridad y resolverá el acceso antes de devolver o modificar recursos.

La política efectiva tendrá esta forma conceptual:

```ts
interface PoliticaEspaciosUsuarioFinal {
  tenantQlikId: string;
  espaciosPermitidosIds: string[];
  permitirRecursosSinEspacio: boolean;
  configurada: boolean;
}
```

La decisión de acceso se resolverá con:

```ts
interface ContextoAccesoEspacios {
  rolUsuario: "admin" | "usuario";
  vistaUsuarioFinal: boolean;
  politica: PoliticaEspaciosUsuarioFinal;
}
```

Reglas:

1. `admin` con `vistaUsuarioFinal = false`: acceso administrativo sin esta restricción.
2. `usuario`: siempre se aplica la política.
3. `admin` con `vistaUsuarioFinal = true`: se aplica exactamente la misma política que a `usuario`.
4. Un espacio es visible únicamente si su ID está en `espaciosPermitidosIds`.
5. Un recurso sin `spaceId` solo es visible si `permitirRecursosSinEspacio` es `true`.
6. Una política ausente equivale a lista vacía y `permitirRecursosSinEspacio = false`.

## 4. Persistencia

Se usarán dos tablas específicas.

### 4.1 Configuración principal

```text
configuracion_espacios_visibles
- tenant_qlik_id UUID PK/FK -> tenants_qlik.id ON DELETE CASCADE
- permitir_recursos_sin_espacio BOOLEAN NOT NULL DEFAULT false
- actualizado_en TIMESTAMP NOT NULL
- actualizado_por_usuario_id UUID NULL FK -> usuarios.id ON DELETE SET NULL
```

### 4.2 Espacios permitidos

```text
espacios_visibles_usuario_final
- tenant_qlik_id UUID NOT NULL FK -> tenants_qlik.id ON DELETE CASCADE
- espacio_id_qlik TEXT NOT NULL
- creado_en TIMESTAMP NOT NULL
- PRIMARY KEY (tenant_qlik_id, espacio_id_qlik)
```

El nombre y tipo del espacio no se duplicarán en la autorización. Se obtendrán desde Qlik o desde `espacios_qlik_cache`.

El reemplazo de la selección será transaccional: se actualizará la configuración principal y se sustituirá el conjunto de IDs en una sola transacción. Un fallo no podrá dejar una selección parcial.

## 5. Contratos

Se añadirán contratos compartidos para administración y consumo interno:

```ts
interface ConfiguracionEspaciosVisibles {
  tenantQlikId: string;
  espaciosPermitidosIds: string[];
  permitirRecursosSinEspacio: boolean;
  configurada: boolean;
  actualizadoEn: string | null;
}

interface EspacioConfigurable {
  id: string;
  nombre: string;
  tipo: string;
  disponible: boolean;
  seleccionado: boolean;
}

interface GuardarEspaciosVisibles {
  espaciosPermitidosIds: string[];
  permitirRecursosSinEspacio: boolean;
}
```

Los IDs repetidos serán rechazados o normalizados antes de persistir. Los espacios desconocidos no se aceptarán silenciosamente cuando Qlik esté disponible; la respuesta debe identificar cuáles dejaron de existir.

## 6. API administrativa

Se añadirán endpoints bajo la organización y el tenant Qlik:

```http
GET  /admin/organizaciones/:id/tenants-qlik/:tenantQlikId/espacios-visibles
PUT  /admin/organizaciones/:id/tenants-qlik/:tenantQlikId/espacios-visibles
POST /admin/organizaciones/:id/tenants-qlik/:tenantQlikId/espacios-visibles/sincronizar
```

### GET

Devuelve la política guardada y el catálogo combinando:

- espacios actuales de Qlik Cloud;
- nombres/tipos disponibles en caché;
- IDs autorizados que ya no existan, marcados como `disponible: false`.

### PUT

Reemplaza la selección completa de manera atómica. Requiere acceso administrativo a la organización. Devuelve la política persistida y un resumen de espacios añadidos y retirados.

### POST sincronizar

Actualiza el catálogo desde Qlik Cloud. No modifica la política guardada. Si Qlik falla, conserva la política anterior y devuelve un error recuperable.

## 7. Servicio central de autorización

Se creará una unidad de dominio/aplicación con responsabilidades acotadas:

```ts
interface PoliticaAccesoRecursosQlik {
  debeRestringir(contexto: ContextoSesion, vistaUsuarioFinal: boolean): boolean;
  puedeVerEspacio(espacioId: string | null | undefined): boolean;
  filtrarPorEspacios<T extends { espacioId?: string }>(items: T[]): T[];
  exigirAcceso(espacioId: string | null | undefined): void;
}
```

Esta unidad no conocerá React ni rutas HTTP. Recibirá la sesión resuelta y la política persistida. Las rutas y casos de uso la reutilizarán para evitar diferencias entre Dataflows y automatizaciones.

## 8. Vista usuario final

El modo de previsualización administrativo no dependerá únicamente de estado local para autorizar.

El cliente enviará `X-Vista-Usuario-Final: 1` en las solicitudes de recursos Qlik cuando el administrador active la vista. El backend aceptará ese encabezado solo como una petición de **más restricción**:

- para un administrador, activa la política de usuario final;
- para un usuario normal, no cambia nada porque ya está restringido;
- nunca desactiva restricciones ni eleva permisos;
- cualquier otro valor se ignora o se valida como falso.

Las llamadas administrativas no usarán este encabezado para evitar que la previsualización bloquee la propia pantalla de configuración.

## 9. Alcance de autorización

La política se aplicará a:

### Dataflows

- listado y búsqueda;
- combinación automática de todos los espacios autorizados para usuarios restringidos;
- catálogo y selector de espacios únicamente para administradores en vista normal;
- detalle;
- script y metadatos;
- enlaces de apertura en Qlik;
- selección de origen al crear una automatización.

### Automatizaciones

- listado y búsqueda;
- combinación automática de todos los espacios autorizados para usuarios restringidos;
- catálogo y selector de espacios únicamente para administradores en vista normal;
- detalle;
- historial y detalle de ejecuciones;
- ejecución manual;
- creación desde plantilla;
- navegación directa por ID.

### Creación de automatizaciones

Antes de crear, el backend verificará el espacio del Dataflow de origen. Para usuarios restringidos, no se podrá crear desde un Dataflow oculto aunque se conozca su ID. La automatización creada debe quedar en un espacio permitido o en la categoría sin espacio cuando dicha categoría esté autorizada.

### Respuestas

- Recurso existente pero no autorizado: `403` con código estable `ESPACIO_NO_AUTORIZADO` y sin datos del recurso.
- Recurso inexistente: `404`.
- Listado sin espacios configurados: `200` con lista vacía y metadato de política cerrada, no un error técnico.

## 10. Interfaz administrativa

Se añadirá una sección **Espacios visibles** en `/configuracion`, después de **Qlik Cloud** y antes de **OAuth**.

La navegación lateral y el resumen superior incorporarán la nueva sección. Su estado será:

- completo: existe al menos un espacio permitido o está habilitada la categoría sin espacio;
- pendiente: política cerrada sin recursos autorizados;
- error: no pudo cargarse la configuración persistida.

### Contenido expandido

- Buscador por nombre y tipo.
- Lista con selección múltiple mediante casillas.
- Nombre y tipo de cada espacio.
- Contador `N de M espacios habilitados`.
- Acción **Seleccionar todos los visibles**.
- Acción **Quitar selección**.
- Opción **Permitir recursos personales o sin espacio**.
- Botón **Guardar espacios visibles**.
- Botón **Actualizar desde Qlik Cloud**.
- Indicador de cambios sin guardar.

La acción “Seleccionar todos los visibles” afectará únicamente a los resultados que coincidan con la búsqueda actual, sin desmarcar otros espacios ya seleccionados.

### Resumen compacto

Ejemplo:

> **3 espacios habilitados**  
> Ventas, Finanzas y Operaciones.  
> Recursos personales o sin espacio: no permitidos.

Si no hay permisos:

> **Acceso de usuarios finales pendiente**  
> No se mostrará ningún Dataflow ni automatización hasta autorizar espacios.

## 11. Experiencia del usuario final

Cuando la política esté cerrada, Dataflows y automatizaciones mostrarán:

> **No tienes espacios de Qlik Cloud habilitados**  
> Solicita al administrador que autorice los espacios necesarios.

En la vista restringida no se mostrará el selector **Filtrar por espacio de Qlik Cloud**, la opción **Todos los espacios** ni una opción especial para recursos personales. El listado combinará automáticamente los Dataflows o automatizaciones de todos los espacios autorizados; los recursos personales se incorporarán silenciosamente cuando el administrador los permita.

El buscador por nombre puede permanecer visible porque no cambia el alcance de autorización.

Si `localStorage` o la URL contienen `espacioId` al entrar en una vista restringida:

1. se elimina el parámetro aunque el espacio siga autorizado;
2. se limpia la persistencia local;
3. se consulta el conjunto completo de recursos autorizados sin enviar `espacioId`;
4. al volver a la vista administrativa normal, el administrador recupera el filtro por espacio.

## 12. Sincronización y recursos eliminados

- Los espacios nuevos aparecen desmarcados.
- Los espacios renombrados conservan autorización por ID.
- Los espacios autorizados que ya no existan aparecen como **Ya no disponible**.
- La sincronización no borra autorizaciones automáticamente.
- Al guardar, el administrador debe confirmar la eliminación de IDs no disponibles.
- Si falla la sincronización, la política previa sigue activa.
- Un fallo nunca debe abrir acceso a todos los espacios.

## 13. Advertencia de impacto

Antes de retirar espacios, la interfaz solicitará confirmación cuando pueda determinar que contienen Dataflows o automatizaciones visibles actualmente. El mensaje mostrará cantidades cuando estén disponibles, sin bloquear el guardado si Qlik no puede calcularlas.

El backend sigue siendo autoritativo: aunque el cliente no muestre la advertencia, el reemplazo se aplicará de forma segura y quedará auditado.

## 14. Auditoría

Cada guardado registrará:

- tenant Qlik;
- administrador responsable;
- IDs añadidos;
- IDs retirados;
- valor anterior y nuevo de `permitirRecursosSinEspacio`;
- resultado de la operación.

No se almacenarán secretos ni payloads de Qlik en el evento.

## 15. Estados y manejo de errores

### Administración

- **Cargando:** skeleton y contador reservado.
- **Qlik no disponible:** mostrar selección guardada y aviso; no borrar datos.
- **Sin espacios:** mensaje y acción de sincronización.
- **Cambios sin guardar:** indicador y protección de navegación.
- **Guardando:** controles bloqueados y progreso.
- **Guardado:** confirmación con cantidad autorizada.
- **Espacio eliminado:** etiqueta de no disponible y confirmación al retirar.

### Usuario final

- Sin configuración: estado vacío explicativo.
- URL no autorizada: pantalla `No tienes acceso a este recurso`.
- Selector de espacios: ausente en Dataflows y automatizaciones.
- `espacioId` persistido o presente en URL: limpieza automática al entrar en modo restringido.
- Error de política: acceso cerrado; nunca fallback a “mostrar todo”.

## 16. Pruebas

### Backend

- política ausente produce acceso cerrado;
- usuario con uno o varios espacios permitidos;
- recurso personal permitido y bloqueado;
- administrador normal sin restricción;
- administrador en Vista usuario final restringido;
- encabezado de previsualización nunca eleva permisos;
- listados filtran Dataflows y automatizaciones;
- catálogos de espacios solo muestran opciones permitidas;
- detalles, scripts y ejecuciones devuelven `403` cuando corresponde;
- ejecución manual bloqueada;
- creación desde Dataflow oculto bloqueada;
- reemplazo transaccional de la política;
- sincronización fallida conserva política;
- IDs renombrados conservan autorización;
- recursos sin espacio obedecen el booleano.

### Frontend

- búsqueda y selección múltiple;
- seleccionar todos los resultados visibles;
- quitar selección;
- contador y resumen;
- opción de recursos personales;
- confirmación al retirar espacios;
- cambios sin guardar;
- estados de carga, vacío y error;
- usuario final sin espacios;
- ausencia del selector de espacios y de **Todos los espacios** en la vista restringida;
- listado combinado de todos los espacios autorizados sin enviar `espacioId`;
- limpieza de cualquier filtro persistido al entrar en vista restringida;
- selector conservado para el administrador en vista normal;
- administrador alternando Vista usuario final.

### Verificación final

- migraciones y esquema Drizzle;
- contratos compartidos;
- pruebas focalizadas;
- suite completa;
- typecheck;
- build;
- Biome;
- `git diff --check`;
- revisión manual en vista administrativa y usuario final.

## 17. Fuera de alcance

- permisos distintos por usuario;
- permisos por grupo o rol adicional;
- autorización individual por Dataflow o automatización;
- sincronización en tiempo real mediante webhooks de Qlik;
- modificación de permisos nativos dentro de Qlik Cloud;
- múltiples listas por tenant secundario en esta primera versión.

## 18. Criterios de aceptación

1. El administrador puede guardar una lista de espacios y la opción de recursos sin espacio.
2. Sin selección, los usuarios finales no reciben recursos.
3. Los usuarios finales solo ven Dataflows y automatizaciones autorizados.
4. El mismo control protege listados, detalles, ejecuciones, creación y URLs directas.
5. Los administradores normales conservan acceso completo.
6. Vista usuario final reproduce las restricciones reales sin poder ampliar permisos.
7. El usuario final no ve el selector de espacio ni **Todos los espacios**; recibe un listado combinado de recursos autorizados.
8. El administrador en vista normal conserva el filtro por espacio.
9. Una falla de Qlik o de sincronización no elimina ni abre la política guardada.
10. Todos los cambios quedan auditados y cubiertos por pruebas.
