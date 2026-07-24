# Conversación PDR — Qlik Automate Creator

---

## Mensaje 1 — Contexto inicial del usuario

> 1. Se llama Qlik Automate Creator, o en español Creador/Generador de Automatizaciones Qlik. 2. No, partimos desde 0. 3. El contexto es que el usuario quiere Usar Qlik dataflow (Qlik Flujo de Datos) para pasar de una base de datos Impala y hacer un ETL en dataflow y pasar a otra base de datos Impala, la cuestion esta en que Qlik Dataflow permite conexiones de entrada a Impala, se procesa ahi, los joins y todo, es low code, pero no hay una salida a Impala, porque se manda a un S3 y luego con un Job de Talend Generico se lee ese archivo (.csv o .parquet), se procesa con spark si es necesario y se manda a Impala, la cosa es para orquestar todo eso se usa Qlik Automate, diseñamos una automatizacion que tiene 2 selects, uno que esta los flujos y otro que estan las tablas de impala, la cosa es que para que el job sepa de que archivo debe leer, tneemos que pasarle el nombre del archivo pero eso puede cometer errores, asi que lo ideal es extraer eso del dataflow seleccionado pero no se puede por api asi que diseñamos nuestra propia api que por medio de una automatizacion extrae el json del dataflow y lo sirve como api los archivos de salida y esa api tambien sirve para que leer de impala el esquema de esa tabla seleccionada, ya que al job debemos pasarle la tabla de destino y el esquema de la tabla; aqui queremos es duplicar una automaizacion base/plantilla (crear) y pasarle como variable, editar sus variables el dataflow y la tabla, tambien programar si queremos que se ejecute a cierta hora, lo de spark lo dejaremos para despues. Ahora quiero que en la variables de entorno se ponga un correo de superadministrador, y la pantalla del superadministrador podra poner varios tentants ya que este programa debe ser multitenant de de Qlik y permite auntentificacion por OAuth de Qlik y poder registrarlos para que los usuarios puedan autenticarse, definir un adminstrador o adminstradores por tenant, ellos ingresar por oauth de qlik (se identificara que es admin por su correo registrado como admin), el podra registrar que usuarios pueden usar la app, los va ingresando igualmente su correo. y el administrador del tenant pondra la automatizacion base, ya que debe ser asi, ya que qlik automate no permite crear automatizacion, sino duplicar y modificar. Y al usuario final o a el mismo al momento de crear una automatizacion con esta herramienta no debe salirle esa automatizacion base. Y aqui viene la parte del creador de automatizaciones, aqui debe aparecerle el listado de dataflows, el listado de tablas, duplicar la automatizacion base, modificar el nombre y descripcion y modificar la variables con el dataflow seleccionado y la tabla seleccionada. Pero antes de implementar quiero tambien tener documentado todos los endpoints de qlik dataflow, qlik automate, todo probado y con la respuesta que da y como esta estructurado, con la jwt o con API key, me la debe pedir si necesita, asi no se vaya a usar, quiero probar todo pero de manera controlada, nada destructivo, todo destructivo se debe hacer en qlik cloud de manera manual. Tienes preguntas?

---

## Preguntas que hice

1. **Alcance MVP** — ¿Qué pasa si no llegamos a todo? ¿Qué es mandatory vs "después"? (Spark, por ejemplo, ya dijiste que para después)
2. **Usuarios y permisos** — ¿El admin del tenant también usa la app como usuario final, o solo administra? ¿Un usuario puede ser admin de su tenant y además crear automatizaciones?
3. **Automatización base** — ¿Quién crea esa automatización base inicialmente? ¿Un admin técnico o el admin desde una pantalla especial?
4. **Qlik API keys** — ¿Ya tienen credenciales de API de Qlik Cloud? ¿Los tenants son todos de la misma instancia Qlik o cada tenant tiene su propio Qlik Cloud?
5. **Modelo de datos** — ¿Ya existe algo en base de datos o partimos de cero?
6. **Éxito** — ¿Cómo medimos que el producto funciona?
7. **Deployment** — ¿On-premise, cloud propio, o SaaS multi-tenant?
8. **Compliance** — ¿Alguna regulación de datos (GDPR, SOC2, etc.)?

---

## Respuestas del usuario

1. **MVP:** Poder generar automatizacion en qlik automate y poderlas ejecutar aqui. Tambien otra cosa qlik automate tiene com input el schedule, aqui quiero un generador de schedule — si qlik cloud deja editar el schedule se edita sino un cron aqui que llame a la automatizacion porque tambien deja llamarla por webhook.

2. **Admin puede usar:** Si también puede usarla, si.

3. **Automatización base:** Un admin técnico, no importa, el admin solo selecciona la automatización base.

4. **Credenciales:** Si tengo todas las credenciales, quiero probar con api key y con oauth.

5. **Modelo de datos:** Ya existe, puedes revisarla pero se puede modificar sin problema a lo que sea mejor, no quiero que en esta conversacion se diseñe nada sino que se documente los PDR ya otro agente diseñara la base.

6. **Éxito:** No lo se.

7. **Deployment:** On premise.

8. **Compliance:** No lo se.

---

## Segunda ronda de preguntas

1. **Métricas de éxito** — Te propongo algunas, dime si tienen sentido:
   - Tiempo promedio para crear una automatización (vs hacerlo manual)
   - # de automatizaciones creadas por mes
   - Tasa de ejecución exitosa vs fallida
   - % de uso del schedule generator (vs cron propio)

2. **Tenants:** ¿Cuántos tenants manejas hoy? ¿Esperas crecimiento rápido?

3. **Logs:** Las ejecuciones de automatizaciones, ¿se loguean en tu sistema o solo importan los logs de Qlik?

---

## Respuestas segunda ronda

1. **Métricas:** Solo un tenant de momento, si me pidieron para muchos tenants quizas 20, pueden haber hasta 1k usuarios y 10k dataflows entre todos.

2. **Logs:** lo que sea mejor.

3. **Superadmin:** también puede crear automatizaciones.

---

## Tercera ronda de preguntas

1. **UI de resultados:** ¿Los usuarios finales necesitan una UI además de la herramienta de crear automatizaciones? ¿Solo crean y ven desde la herramienta, o también necesitan ver el resultado/ejecución?

2. **Compartidas vs propias:** ¿Las automatizaciones duplicadas se comparten entre usuarios del mismo tenant o cada usuario tiene las suyas propias?

3. **Límites:** ¿Hay límite de automatizaciones por usuario o por tenant?

4. **Cron fallback:** El schedule fallback (cron propio) — cuando Qlik no permite editar el schedule, ¿el webhook lo dispara tu servidor o Qlik lo llama directamente?

5. **Historial:** Historial de ejecuciones — ¿necesitas guardar en tu BD quién ejecutó qué y cuándo, o solo importa el log de Qlik?

---

## Respuestas tercera ronda

1. **Resultados:** Pueden ver el resultado.

2. **Compartidas:** Se comparten.

3. **Límites:** No.

4. **Cron fallback:** Mi servidor (por eso quiero que se documente y pruebe toda pero toda la api).

5. **Historial:** Guardar en mi base.

---

## Cuarta ronda de preguntas

1. **Automatización base por tenant:** ¿La automatización base está en una cuenta/tenant específico de Qlik que es compartido para todos los tenants de la herramienta, o cada tenant de la herramienta tiene su propio tenant de Qlik con su propia automatización base?

2. **Webhook autenticado:** ¿Qlik Automate permite webhooks autenticados o es un URL pública?

---

## Respuestas cuarta ronda

1. **Base por tenant:** La automatización base esta en cada tenant.

2. **Webhook:** No lo se, lo averiguaremos, quiero que documentes todo.

---

## Nota

El usuario decidió que otro agente investigará y probará las APIs de Qlik. No debo hacer web fetching adicional por mi cuenta.
