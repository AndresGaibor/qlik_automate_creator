# PDR — Qlik Automate Creator

## 1. Visión y Propósito

**Problema:** Crear automatizaciones en Qlik Automate que involucren dataflows Impala → S3 → Talend → Impala es propenso a errores, ya que se pasan nombres de archivo a mano y no hay forma de extraer automáticamente el esquema de la tabla destino.

**Solución:** Herramienta on-premise que permite seleccionar un dataflow y una tabla Impala, duplicar una automatización base con variables precargadas, y orquestar la ejecución con schedule configurable.

---

## 2. Alcance

### MVP

- Autenticación OAuth Qlik (superadmin, admin, usuario)
- Gestión multitenant (superadmin registra tenants, admin gestiona usuarios del tenant)
- Dashboard de automatización base por tenant
- Listado de dataflows y tablas vía API propia (extrae JSON del dataflow + esquema Impala)
- Duplicar automatización base, editar nombre/descripción y variables
- Schedule: editor nativo Qlik Cloud + fallback cron (servidor on-premise) + webhook
- Ejecución de automatizaciones desde la herramienta
- Historial de ejecuciones en base de datos local

### Post-MVP

- Procesamiento Spark
- Notificaciones avanzadas (Slack, email)
- Dashboard analítico

---

## 3. Modelo de Tenancy

- **On-premise**, multi-tenant de Qlik
- Un tenant de la herramienta = un tenant de Qlik Cloud
- Capacidad: hasta ~20 tenants, ~1K usuarios, ~10K dataflows

---

## 4. Usuarios y Roles

| Rol | Descripción |
|-----|-------------|
| **Superadmin** | Registra tenants, crea automatizaciones, accede a todos los tenants |
| **Admin (tenant)** | Registra usuarios del tenant, selecciona automatización base, crea automatizaciones |
| **Usuario (tenant)** | Crea automatizaciones con la herramienta |

**Notas:**

- Un admin también puede ser usuario (crear automatizaciones)
- El superadmin también puede crear automatizaciones
- Identificación de admin: correo registrado en el sistema
- Identificación de superadmin: variable de entorno `SUPERADMIN_EMAIL`

---

## 5. Flujo Core: Creador de Automatizaciones

1. Usuario selecciona un **dataflow** de la lista
2. Usuario selecciona una **tabla Impala** de la lista
3. El sistema **duplica** la automatización base del tenant
4. Se edita: nombre, descripción, y variables (dataflow + tabla)
5. La automatización base **no aparece** como opción para el usuario final
6. Se configura el **schedule** (Qlik Cloud nativo o cron propio + webhook)

---

## 6. Automatización Base

- Cada tenant tiene **una** automatización base/plantilla
- Un admin técnico crea la automatización base en Qlik Automate (Qlik no permite crear por API, solo duplicar)
- El admin del tenant simplemente la selecciona desde la herramienta
- La herramienta usa `POST /api/workflows/automations/{id}/actions/copy` para duplicarla
- Luego `PUT /api/workflows/automations/{id}` para editar nombre, descripción y variables
- Las automatizaciones duplicadas son **compartidas** dentro del tenant
- La base **no es visible** para usuarios finales

---

## 7. Scheduling

| Escenario | Comportamiento |
|-----------|----------------|
| Qlik Cloud permite editar schedule | Se usa editor nativo de Qlik Automate |
| Qlik Cloud no permite editar schedule | Se genera cron en servidor on-premise |
| Ejecución por cron propio | Servidor hace POST al webhook de Qlik Automate |

**Nota:** Se requiere investigar si Qlik Automate soporta webhooks autenticados.

---

## 8. APIs — Qlik

**Regla:** Toda API se documenta y prueba (API Key + OAuth). Solo lectura y duplicación; ninguna operación destructiva en Qlik Cloud desde código.

| API | Auth | Objetivo |
|-----|------|----------|
| Qlik Cloud OAuth | OAuth | Autenticación de usuarios |
| Qlik Automate | API Key / OAuth | Listar, duplicar, editar, ejecutar automatizaciones |
| Qlik Dataflow | API Key / OAuth | Listar dataflows, extraer JSON de salida |
| Qlik Automate Schedules | API Key / OAuth | Crear/editar schedules |
| Qlik Webhook | API Key | Trigger por webhook |
| API propia | API Key | Servir schema tablas Impala y metadata dataflows |

---

## 9. API Propia — Alcance

Esta API es propia del sistema y sirve:

1. **Schema de tablas Impala** — para que la herramienta conozca el esquema de la tabla destino antes de crear la automatización
2. **Metadata de dataflows** — extrae el JSON del dataflow (archivos de salida: nombre, formato .csv/.parquet) vía una automatización de Qlik que sirve esto como endpoint

---

## 10. Historial de Ejecuciones

- Se guarda en **base de datos local** (no solo en Qlik)
- Registra: quién ejecutó, qué automatización, cuándo, estado, duración, errores
- El superadmin y admin de tenant pueden consultar el historial de su tenant

---

## 11. Autenticación

- **OAuth Qlik** es el único método de autenticación para usuarios
- El superadmin se identifica por correo (variable de entorno `SUPERADMIN_EMAIL`)
- El admin de tenant se identifica por correo (registrado en el sistema como admin)
- La herramienta valida el token OAuth y extrae el correo para determinar rol

---

## 12. Límites

- ~20 tenants máximo
- ~1K usuarios total
- ~10K dataflows entre todos
- Sin límite de automatizaciones por usuario o tenant

---

## 13. Métricas de Éxito

*(Pendiente de definición con el usuario)*

Métricas propuestas:

| Métrica | Definición |
|---------|------------|
| Tiempo de creación | Tiempo promedio desde seleccionar dataflow/tabla hasta automatización activa |
| Tasa de uso | % de usuarios activos que crean al menos 1 automatización / mes |
| Tasa de éxito | % de ejecuciones completadas sin error |
| Adopción de schedule | % de automatizaciones usando editor Qlik vs cron propio |

---

## 14. Variables de Entorno

```env
SUPERADMIN_EMAIL=correo@ejemplo.com
```

---

## 15. Preguntas Abiertas

1. Métricas de éxito — ¿cuáles son las correctas?
2. ¿Qlik Automate soporta webhooks autenticados?
3. ¿Compliance/GDPR/SOC2 aplica?
4. ¿Volumen esperado de automatizaciones creadas por mes?
5. ¿Los resultados de ejecución se muestran en la herramienta o solo en Qlik?
