---
title: "Reload tasks REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/reload-tasks/"
local_path: "docs/endpoints/reload-tasks.md"
---

Title: Reload tasks REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/reload-tasks/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

*   [Authenticate](https://qlik.dev/authenticate/)
*   [Embed](https://qlik.dev/embed/)
*   [Extend](https://qlik.dev/extend/)
*   [Manage](https://qlik.dev/manage/)

*   [APIs](https://qlik.dev/apis/)
*   [Toolkits](https://qlik.dev/toolkits/)
*   [Changelog](https://qlik.dev/changelog/)

*   [Authenticate](https://qlik.dev/authenticate/)
*   [Embed](https://qlik.dev/embed/)
*   [Extend](https://qlik.dev/extend/)
*   [Manage](https://qlik.dev/manage/)

* * *

*   [APIs](https://qlik.dev/apis/)
*   [Toolkits](https://qlik.dev/toolkits/)
*   [Changelog](https://qlik.dev/changelog/)

## Reload tasks

*   [Find and return tasks](https://qlik.dev/apis/rest/reload-tasks/#get-api-v1-reload-tasks "Find and return tasks
") D 
*   [Create a task](https://qlik.dev/apis/rest/reload-tasks/#post-api-v1-reload-tasks "Create a task 
") D 
*   [Find a task](https://qlik.dev/apis/rest/reload-tasks/#get-api-v1-reload-tasks-taskId "Find a task
") D 
*   [Update an existing task](https://qlik.dev/apis/rest/reload-tasks/#put-api-v1-reload-tasks-taskId "Update an existing task
") D 
*   [Delete a task](https://qlik.dev/apis/rest/reload-tasks/#delete-api-v1-reload-tasks-taskId "Delete a task
") D 

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/reload-tasks.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Reload tasks

Reloads tasks allow you to schedule reloads of analytics applications in your tenant.

[Download OpenAPI spec](https://qlik.dev/specs/rest/reload-tasks.json)

## Endpoints

*   [GET /api/v1/reload-tasks](https://qlik.dev/apis/rest/reload-tasks/#get-api-v1-reload-tasks)
*   [POST /api/v1/reload-tasks](https://qlik.dev/apis/rest/reload-tasks/#post-api-v1-reload-tasks)
*   [GET /api/v1/reload-tasks/{taskId}](https://qlik.dev/apis/rest/reload-tasks/#get-api-v1-reload-tasks-taskId)
*   [PUT /api/v1/reload-tasks/{taskId}](https://qlik.dev/apis/rest/reload-tasks/#put-api-v1-reload-tasks-taskId)
*   [DELETE /api/v1/reload-tasks/{taskId}](https://qlik.dev/apis/rest/reload-tasks/#delete-api-v1-reload-tasks-taskId)

## [](https://qlik.dev/apis/rest/reload-tasks/#get-api-v1-reload-tasks)Find and return tasks

Deprecated

Finds and returns the tasks that the user has access to.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)
Deprecated This endpoint is deprecated and will eventually be removed. Read our API policy [here](https://qlik.dev/apis/api-policy/).
Deprecated sunset 2026-09
Deprecated description This endpoint is deprecated and will be removed after 2026-09. Use the `/scheduling/tasks` endpoint instead.

### Header Parameters

*   Authorization string Required   JWT containing tenant credentials. 

### Query Parameters

*   appId string   The case sensitive string used to search for a task by app ID. 
*   limit integer   The maximum number of resources to return for a request. The limit must be an integer between 1 and 100 (inclusive). 
minimum = 1,  maximum = 100,  default = 10,  format = int32,  default = 10

*   next string   The cursor to the next page of resources. Provide either the next or prev cursor, but not both. 
*   partial boolean   The boolean value used to search for a task is partial or not 
*   prev string   The cursor to the previous page of resources. Provide either the next or prev cursor, but not both. 

### Responses

#### 200

Expected response to a valid request.

*   application/json object   

Show application/json properties 

    *   data array of objects Required   

Show data properties 

        *   appId string Required   The ID of the app. 
        *   partial boolean   The task is partial reload or not 
default = false

        *   timeZone string Required   The time zone in which the time is specified. (Formatted as an IANA Time Zone Database name, e.g. Europe/Zurich.) This field specifies the time zone in which the event start/end are expanded. If missing the start/end fields must specify a UTC offset in RFC3339 format. 
        *   autoReload boolean   A flag that indicates whether a reload is triggered when data of the app is changed 
default = false

        *   recurrence array of strings   List of RECUR lines for a recurring event, as specified in RFC5545. Note that DTSTART and DTEND lines are not allowed in this field; event start and end times are specified in the start and end fields. This field is omitted for single events or instances of recurring events 
        *   endDateTime string   The time that the task will stop recurring. If the time zone is missing, this is a combined date-time value expressing a time with a fixed UTC offset (formatted according to RFC3339). If a time zone is given, the zone offset must be omitted. 
        *   startDateTime string   The time that the task execution start recurring. If the time zone is missing, this is a combined date-time value expressing a time with a fixed UTC offset (formatted according to RFC3339). If a time zone is given, the zone offset must be omitted. Field startDateTime should not be before the Unix epoch 00:00:00 UTC on 1 January 1970. Note that the empty string value with the empty recurrence array indicates the scheduled job is not set. 
        *   autoReloadPartial boolean   A flag that indicates whether it is a partial reload or not for the auto reload 
default = false

        *   id string Required   The ID of the task. 
        *   log string Deprecated   The reason why the task was disabled. 
        *   links object Required   

Show links properties 

            *   self object Required   

Show self properties 

                *   href string Required   
format = "uri"

        *   state string Required   Toggle for enabling and disabling the reload task 
Can be one of: "Enabled""Disabled""Completed"

        *   userId string Required   The ID of the user who owns the task. 
        *   spaceId string   The space ID of the application 
        *   migrated boolean   A flag indicating whether the task has been migrated to the new scheduling service. 
default = false

        *   tenantId string Required   The ID of the tenant who owns the task. 
        *   fortressId string Deprecated   The fortress ID of the application 
        *   disabledCode string   The reason why the task was disabled. 
Can be one of: "MANUALLY""CONSECUTIVE-FAILURES""OWNER-DELETED""OWNER-DISABLED"

        *   lastExecutionTime string   The last time the task executed. 
        *   nextExecutionTime string   The next time the task will execute. 

    *   links object Required   

Show links properties 

        *   self object Required   

Show self properties 

            *   href string Required   
format = "uri"

        *   next object   

Show next properties 

            *   href string Required   
format = "uri"

        *   prev object   

Show prev properties 

            *   href string Required   
format = "uri"

#### 400

Bad Request.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

#### 401

Unauthorized, JWT invalid or not provided.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

#### 403

Forbidden, the requesting JWT does not allow for retrieval of this task.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

#### 404

Not Found.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

#### 429

Too Many Requests.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

#### 500

Internal server error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

#### 503

Service Unavailable.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

 GET /api/v1/reload-tasks

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.reloadTasks.getReloadTasks({})
```

`# qlik-cli has not implemented support for GET /api/v1/reload-tasks yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/reload-tasks" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "data": [    {      "appId": "116dbfae-7fb9-4983-8e23-5ccd8c508722",      "partial": false,      "timeZone": "America/Toronto",      "autoReload": false,      "recurrence": [        "RRULE:FREQ=DAILY;INTERVAL=1;BYHOUR=11;BYMINUTE=18;BYSECOND=0",        "RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,TU;BYHOUR=13;BYMINUTE=17;BYSECOND=0"      ],      "endDateTime": "2022-10-12T23:59:00",      "startDateTime": "2022-09-19T11:18:00",      "autoReloadPartial": false,      "id": "5be59decca62aa00097268a4",      "log": "Scheduled reload has been disabled since exceeded limit of 5 consecutive reload failures. Please fix error and re-enable schedule.",      "links": {        "self": {          "href": "http://example.com"        }      },      "state": "Enabled",      "userId": "FyPG6xWp6prDU6BXQ3g7LY9gWR_YRkkx",      "spaceId": "602c2c2be2be220002a22a22",      "migrated": false,      "tenantId": "efSCcpNYuayTysONkUcE3F80zYQ_LV9w",      "fortressId": "5c5b097116d25a0001a48b06",      "disabledCode": "CONSECUTIVE-FAILURES",      "lastExecutionTime": "2022-09-20T17:17:00Z",      "nextExecutionTime": "2022-09-20T17:17:00Z"    }  ],  "links": {    "self": {      "href": "http://example.com"    },    "next": {      "href": "http://example.com"    },    "prev": {      "href": "http://example.com"    }  }}`

## [](https://qlik.dev/apis/rest/reload-tasks/#post-api-v1-reload-tasks)Create a task

Deprecated

Creates a task for a specified app.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)
Deprecated This endpoint is deprecated and will eventually be removed. Read our API policy [here](https://qlik.dev/apis/api-policy/).
Deprecated sunset 2026-09
Deprecated description This endpoint is deprecated and will be removed after 2026-09. Use the `/scheduling/tasks` endpoint instead.

### Header Parameters

*   Authorization string Required   JWT containing tenant credentials. 

### Request Body

Required

Request body specifying the task parameters.

*   application/json object   

Show application/json properties 

    *   appId string Required   The ID of the app. 
    *   partial boolean   The task is partial reload or not 
default = false

    *   timeZone string Required   The time zone in which the time is specified. (Formatted as an IANA Time Zone Database name, e.g. Europe/Zurich.) This field specifies the time zone in which the event start/end are expanded. If missing the start/end fields must specify a UTC offset in RFC3339 format. 
    *   autoReload boolean   A flag that indicates whether a reload is triggered when data of the app is changed 
default = false

    *   recurrence array of strings   List of RECUR lines for a recurring event, as specified in RFC5545. Note that DTSTART and DTEND lines are not allowed in this field; event start and end times are specified in the start and end fields. This field is omitted for single events or instances of recurring events 
    *   endDateTime string   The time that the task will stop recurring. If the time zone is missing, this is a combined date-time value expressing a time with a fixed UTC offset (formatted according to RFC3339). If a time zone is given, the zone offset must be omitted. 
    *   startDateTime string   The time that the task execution start recurring. If the time zone is missing, this is a combined date-time value expressing a time with a fixed UTC offset (formatted according to RFC3339). If a time zone is given, the zone offset must be omitted. Field startDateTime should not be before the Unix epoch 00:00:00 UTC on 1 January 1970. Note that the empty string value with the empty recurrence array indicates the scheduled job is not set. 
    *   autoReloadPartial boolean   A flag that indicates whether it is a partial reload or not for the auto reload 
default = false

    *   type string Deprecated   Type of task being created - only contains the "scheduled_reload" value. Type value is not used for creating a schedule reload. It has been deprecated since 2022-04-05. 
Can be one of: "scheduled_reload"

### Responses

#### 201

Expected response to a valid request.

*   application/json object   

Show application/json properties 

    *   appId string Required   The ID of the app. 
    *   partial boolean   The task is partial reload or not 
default = false

    *   timeZone string Required   The time zone in which the time is specified. (Formatted as an IANA Time Zone Database name, e.g. Europe/Zurich.) This field specifies the time zone in which the event start/end are expanded. If missing the start/end fields must specify a UTC offset in RFC3339 format. 
    *   autoReload boolean   A flag that indicates whether a reload is triggered when data of the app is changed 
default = false

    *   recurrence array of strings   List of RECUR lines for a recurring event, as specified in RFC5545. Note that DTSTART and DTEND lines are not allowed in this field; event start and end times are specified in the start and end fields. This field is omitted for single events or instances of recurring events 
    *   endDateTime string   The time that the task will stop recurring. If the time zone is missing, this is a combined date-time value expressing a time with a fixed UTC offset (formatted according to RFC3339). If a time zone is given, the zone offset must be omitted. 
    *   startDateTime string   The time that the task execution start recurring. If the time zone is missing, this is a combined date-time value expressing a time with a fixed UTC offset (formatted according to RFC3339). If a time zone is given, the zone offset must be omitted. Field startDateTime should not be before the Unix epoch 00:00:00 UTC on 1 January 1970. Note that the empty string value with the empty recurrence array indicates the scheduled job is not set. 
    *   autoReloadPartial boolean   A flag that indicates whether it is a partial reload or not for the auto reload 
default = false

    *   id string Required   The ID of the task. 
    *   log string Deprecated   The reason why the task was disabled. 
    *   links object Required   

Show links properties 

        *   self object Required   

Show self properties 

            *   href string Required   
format = "uri"

    *   state string Required   Toggle for enabling and disabling the reload task 
Can be one of: "Enabled""Disabled""Completed"

    *   userId string Required   The ID of the user who owns the task. 
    *   spaceId string   The space ID of the application 
    *   migrated boolean   A flag indicating whether the task has been migrated to the new scheduling service. 
default = false

    *   tenantId string Required   The ID of the tenant who owns the task. 
    *   fortressId string Deprecated   The fortress ID of the application 
    *   disabledCode string   The reason why the task was disabled. 
Can be one of: "MANUALLY""CONSECUTIVE-FAILURES""OWNER-DELETED""OWNER-DISABLED"

    *   lastExecutionTime string   The last time the task executed. 
    *   nextExecutionTime string   The next time the task will execute. 

#### 400

Bad Request.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

#### 401

Unauthorized, JWT invalid or not provided.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

#### 403

Forbidden, the requesting JWT does not allow for retrieval of this task.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

#### 404

Not Found.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

#### 500

Internal server error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

#### 503

Service Unavailable.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

 POST /api/v1/reload-tasks

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.reloadTasks.createReloadTask({  appId: '116dbfae-7fb9-4983-8e23-5ccd8c508722',  endDateTime: '2022-10-12T23:59:00',  recurrence: [    'RRULE:FREQ=DAILY;INTERVAL=1;BYHOUR=11;BYMINUTE=18;BYSECOND=0',
    'RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,TU;BYHOUR=13;BYMINUTE=17;BYSECOND=0',  ],  startDateTime: '2022-09-19T11:18:00',  timeZone: 'America/Toronto',  type: 'scheduled_reload',})
```

`# qlik-cli has not implemented support for POST /api/v1/reload-tasks yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/reload-tasks" \-X POST \-H "Authorization: Bearer <access_token>" \-H "Content-type: application/json" \-d '{"appId":"116dbfae-7fb9-4983-8e23-5ccd8c508722","partial":false,"timeZone":"America/Toronto","autoReload":false,"recurrence":["RRULE:FREQ=DAILY;INTERVAL=1;BYHOUR=11;BYMINUTE=18;BYSECOND=0","RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,TU;BYHOUR=13;BYMINUTE=17;BYSECOND=0"],"endDateTime":"2022-10-12T23:59:00","startDateTime":"2022-09-19T11:18:00","autoReloadPartial":false,"type":"scheduled_reload"}'`

### Example Response

`{  "appId": "116dbfae-7fb9-4983-8e23-5ccd8c508722",  "partial": false,  "timeZone": "America/Toronto",  "autoReload": false,  "recurrence": [    "RRULE:FREQ=DAILY;INTERVAL=1;BYHOUR=11;BYMINUTE=18;BYSECOND=0",    "RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,TU;BYHOUR=13;BYMINUTE=17;BYSECOND=0"  ],  "endDateTime": "2022-10-12T23:59:00",  "startDateTime": "2022-09-19T11:18:00",  "autoReloadPartial": false,  "id": "5be59decca62aa00097268a4",  "log": "Scheduled reload has been disabled since exceeded limit of 5 consecutive reload failures. Please fix error and re-enable schedule.",  "links": {    "self": {      "href": "http://example.com"    }  },  "state": "Enabled",  "userId": "FyPG6xWp6prDU6BXQ3g7LY9gWR_YRkkx",  "spaceId": "602c2c2be2be220002a22a22",  "migrated": false,  "tenantId": "efSCcpNYuayTysONkUcE3F80zYQ_LV9w",  "fortressId": "5c5b097116d25a0001a48b06",  "disabledCode": "CONSECUTIVE-FAILURES",  "lastExecutionTime": "2022-09-20T17:17:00Z",  "nextExecutionTime": "2022-09-20T17:17:00Z"}`

## [](https://qlik.dev/apis/rest/reload-tasks/#get-api-v1-reload-tasks-taskId)Find a task

Deprecated

Finds and returns a task.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)
Deprecated This endpoint is deprecated and will eventually be removed. Read our API policy [here](https://qlik.dev/apis/api-policy/).
Deprecated sunset 2026-09
Deprecated description This endpoint is deprecated and will be removed after 2026-09. Use the `/scheduling/tasks/{id}` endpoint instead.

### Header Parameters

*   Authorization string Required   JWT containing tenant credentials. 

### Path Parameters

*   taskId string Required   The unique identifier of the task. 

### Responses

#### 200

Expected response to a valid request.

*   application/json object   

Show application/json properties 

    *   appId string Required   The ID of the app. 
    *   partial boolean   The task is partial reload or not 
default = false

    *   timeZone string Required   The time zone in which the time is specified. (Formatted as an IANA Time Zone Database name, e.g. Europe/Zurich.) This field specifies the time zone in which the event start/end are expanded. If missing the start/end fields must specify a UTC offset in RFC3339 format. 
    *   autoReload boolean   A flag that indicates whether a reload is triggered when data of the app is changed 
default = false

    *   recurrence array of strings   List of RECUR lines for a recurring event, as specified in RFC5545. Note that DTSTART and DTEND lines are not allowed in this field; event start and end times are specified in the start and end fields. This field is omitted for single events or instances of recurring events 
    *   endDateTime string   The time that the task will stop recurring. If the time zone is missing, this is a combined date-time value expressing a time with a fixed UTC offset (formatted according to RFC3339). If a time zone is given, the zone offset must be omitted. 
    *   startDateTime string   The time that the task execution start recurring. If the time zone is missing, this is a combined date-time value expressing a time with a fixed UTC offset (formatted according to RFC3339). If a time zone is given, the zone offset must be omitted. Field startDateTime should not be before the Unix epoch 00:00:00 UTC on 1 January 1970. Note that the empty string value with the empty recurrence array indicates the scheduled job is not set. 
    *   autoReloadPartial boolean   A flag that indicates whether it is a partial reload or not for the auto reload 
default = false

    *   id string Required   The ID of the task. 
    *   log string Deprecated   The reason why the task was disabled. 
    *   links object Required   

Show links properties 

        *   self object Required   

Show self properties 

            *   href string Required   
format = "uri"

    *   state string Required   Toggle for enabling and disabling the reload task 
Can be one of: "Enabled""Disabled""Completed"

    *   userId string Required   The ID of the user who owns the task. 
    *   spaceId string   The space ID of the application 
    *   migrated boolean   A flag indicating whether the task has been migrated to the new scheduling service. 
default = false

    *   tenantId string Required   The ID of the tenant who owns the task. 
    *   fortressId string Deprecated   The fortress ID of the application 
    *   disabledCode string   The reason why the task was disabled. 
Can be one of: "MANUALLY""CONSECUTIVE-FAILURES""OWNER-DELETED""OWNER-DISABLED"

    *   lastExecutionTime string   The last time the task executed. 
    *   nextExecutionTime string   The next time the task will execute. 

#### 400

Bad Request.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

#### 401

Unauthorized, JWT invalid or not provided.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

#### 403

Forbidden, the requesting JWT does not allow for creation or retrieval of this engine session.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

#### 404

Not Found.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

#### 429

Too Many Requests.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

#### 500

Internal server error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

#### 503

Service Unavailable.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

 GET /api/v1/reload-tasks/{taskId}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.reloadTasks.getReloadTask('string')
```

`# qlik-cli has not implemented support for GET /api/v1/reload-tasks/{taskId} yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/reload-tasks/{taskId}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "appId": "116dbfae-7fb9-4983-8e23-5ccd8c508722",  "partial": false,  "timeZone": "America/Toronto",  "autoReload": false,  "recurrence": [    "RRULE:FREQ=DAILY;INTERVAL=1;BYHOUR=11;BYMINUTE=18;BYSECOND=0",    "RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,TU;BYHOUR=13;BYMINUTE=17;BYSECOND=0"  ],  "endDateTime": "2022-10-12T23:59:00",  "startDateTime": "2022-09-19T11:18:00",  "autoReloadPartial": false,  "id": "5be59decca62aa00097268a4",  "log": "Scheduled reload has been disabled since exceeded limit of 5 consecutive reload failures. Please fix error and re-enable schedule.",  "links": {    "self": {      "href": "http://example.com"    }  },  "state": "Enabled",  "userId": "FyPG6xWp6prDU6BXQ3g7LY9gWR_YRkkx",  "spaceId": "602c2c2be2be220002a22a22",  "migrated": false,  "tenantId": "efSCcpNYuayTysONkUcE3F80zYQ_LV9w",  "fortressId": "5c5b097116d25a0001a48b06",  "disabledCode": "CONSECUTIVE-FAILURES",  "lastExecutionTime": "2022-09-20T17:17:00Z",  "nextExecutionTime": "2022-09-20T17:17:00Z"}`

## [](https://qlik.dev/apis/rest/reload-tasks/#put-api-v1-reload-tasks-taskId)Update an existing task

Deprecated

Updates an existing task

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)
Deprecated This endpoint is deprecated and will eventually be removed. Read our API policy [here](https://qlik.dev/apis/api-policy/).
Deprecated sunset 2026-09
Deprecated description This endpoint is deprecated and will be removed after 2026-09. Use the `/scheduling/tasks/{id}` endpoint instead.

### Header Parameters

*   Authorization string Required   JWT containing tenant credentials. 

### Path Parameters

*   taskId string Required   The unique identifier of the task. 

### Request Body

Required

Request body specifying the task parameters.

*   application/json object   

Show application/json properties 

    *   appId string   The ID of the app. 
    *   partial boolean   The task is partial reload or not 
default = false

    *   timeZone string   The time zone in which the time is specified. (Formatted as an IANA Time Zone Database name, e.g. Europe/Zurich.) This field specifies the time zone in which the event start/end are expanded. If missing the start/end fields must specify a UTC offset in RFC3339 format. 
    *   autoReload boolean   A flag that indicates whether a reload is triggered when data of the app is changed 
default = false

    *   recurrence array of strings   List of RECUR lines for a recurring event, as specified in RFC5545. Note that DTSTART and DTEND lines are not allowed in this field; event start and end times are specified in the start and end fields. This field is omitted for single events or instances of recurring events 
    *   endDateTime string   The time that the task will stop recurring. If the time zone is missing, this is a combined date-time value expressing a time with a fixed UTC offset (formatted according to RFC3339). If a time zone is given, the zone offset must be omitted. 
    *   startDateTime string   The time that the task execution start recurring. If the time zone is missing, this is a combined date-time value expressing a time with a fixed UTC offset (formatted according to RFC3339). If a time zone is given, the zone offset must be omitted. Field startDateTime should not be before the Unix epoch 00:00:00 UTC on 1 January 1970. Note that the empty string value with the empty recurrence array indicates the scheduled job is not set. 
    *   autoReloadPartial boolean   A flag that indicates whether it is a partial reload or not for the auto reload 
default = false

    *   state string   Toggle for enabling and disabling the reload task 
Can be one of: "Enabled""Disabled""Completed"

### Responses

#### 200

Expected response to a valid request.

*   application/json object   

Show application/json properties 

    *   appId string Required   The ID of the app. 
    *   partial boolean   The task is partial reload or not 
default = false

    *   timeZone string Required   The time zone in which the time is specified. (Formatted as an IANA Time Zone Database name, e.g. Europe/Zurich.) This field specifies the time zone in which the event start/end are expanded. If missing the start/end fields must specify a UTC offset in RFC3339 format. 
    *   autoReload boolean   A flag that indicates whether a reload is triggered when data of the app is changed 
default = false

    *   recurrence array of strings   List of RECUR lines for a recurring event, as specified in RFC5545. Note that DTSTART and DTEND lines are not allowed in this field; event start and end times are specified in the start and end fields. This field is omitted for single events or instances of recurring events 
    *   endDateTime string   The time that the task will stop recurring. If the time zone is missing, this is a combined date-time value expressing a time with a fixed UTC offset (formatted according to RFC3339). If a time zone is given, the zone offset must be omitted. 
    *   startDateTime string   The time that the task execution start recurring. If the time zone is missing, this is a combined date-time value expressing a time with a fixed UTC offset (formatted according to RFC3339). If a time zone is given, the zone offset must be omitted. Field startDateTime should not be before the Unix epoch 00:00:00 UTC on 1 January 1970. Note that the empty string value with the empty recurrence array indicates the scheduled job is not set. 
    *   autoReloadPartial boolean   A flag that indicates whether it is a partial reload or not for the auto reload 
default = false

    *   id string Required   The ID of the task. 
    *   log string Deprecated   The reason why the task was disabled. 
    *   links object Required   

Show links properties 

        *   self object Required   

Show self properties 

            *   href string Required   
format = "uri"

    *   state string Required   Toggle for enabling and disabling the reload task 
Can be one of: "Enabled""Disabled""Completed"

    *   userId string Required   The ID of the user who owns the task. 
    *   spaceId string   The space ID of the application 
    *   migrated boolean   A flag indicating whether the task has been migrated to the new scheduling service. 
default = false

    *   tenantId string Required   The ID of the tenant who owns the task. 
    *   fortressId string Deprecated   The fortress ID of the application 
    *   disabledCode string   The reason why the task was disabled. 
Can be one of: "MANUALLY""CONSECUTIVE-FAILURES""OWNER-DELETED""OWNER-DISABLED"

    *   lastExecutionTime string   The last time the task executed. 
    *   nextExecutionTime string   The next time the task will execute. 

#### 400

Bad Request.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

#### 401

Unauthorized, JWT invalid or not provided.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

#### 403

Forbidden, the requesting JWT does not allow for creation or retrieval of this engine session.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

#### 404

Not Found.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

#### 500

Internal server error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

#### 503

Service Unavailable.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

 PUT /api/v1/reload-tasks/{taskId}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.reloadTasks.updateReloadTask(  'string',  {    appId: '116dbfae-7fb9-4983-8e23-5ccd8c508722',    endDateTime: '2022-10-12T23:59:00',    recurrence: [      'RRULE:FREQ=DAILY;INTERVAL=1;BYHOUR=11;BYMINUTE=18;BYSECOND=0',
      'RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,TU;BYHOUR=13;BYMINUTE=17;BYSECOND=0',    ],    startDateTime: '2022-09-19T11:18:00',    timeZone: 'America/Toronto',    state: 'Disabled',  },)
```

`# qlik-cli has not implemented support for PUT /api/v1/reload-tasks/{taskId} yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/reload-tasks/{taskId}" \-X PUT \-H "Authorization: Bearer <access_token>" \-H "Content-type: application/json" \-d '{"appId":"116dbfae-7fb9-4983-8e23-5ccd8c508722","partial":false,"timeZone":"America/Toronto","autoReload":false,"recurrence":["RRULE:FREQ=DAILY;INTERVAL=1;BYHOUR=11;BYMINUTE=18;BYSECOND=0","RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,TU;BYHOUR=13;BYMINUTE=17;BYSECOND=0"],"endDateTime":"2022-10-12T23:59:00","startDateTime":"2022-09-19T11:18:00","autoReloadPartial":false,"state":"Disabled"}'`

### Example Response

`{  "appId": "116dbfae-7fb9-4983-8e23-5ccd8c508722",  "partial": false,  "timeZone": "America/Toronto",  "autoReload": false,  "recurrence": [    "RRULE:FREQ=DAILY;INTERVAL=1;BYHOUR=11;BYMINUTE=18;BYSECOND=0",    "RRULE:FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,TU;BYHOUR=13;BYMINUTE=17;BYSECOND=0"  ],  "endDateTime": "2022-10-12T23:59:00",  "startDateTime": "2022-09-19T11:18:00",  "autoReloadPartial": false,  "id": "5be59decca62aa00097268a4",  "log": "Scheduled reload has been disabled since exceeded limit of 5 consecutive reload failures. Please fix error and re-enable schedule.",  "links": {    "self": {      "href": "http://example.com"    }  },  "state": "Enabled",  "userId": "FyPG6xWp6prDU6BXQ3g7LY9gWR_YRkkx",  "spaceId": "602c2c2be2be220002a22a22",  "migrated": false,  "tenantId": "efSCcpNYuayTysONkUcE3F80zYQ_LV9w",  "fortressId": "5c5b097116d25a0001a48b06",  "disabledCode": "CONSECUTIVE-FAILURES",  "lastExecutionTime": "2022-09-20T17:17:00Z",  "nextExecutionTime": "2022-09-20T17:17:00Z"}`

## [](https://qlik.dev/apis/rest/reload-tasks/#delete-api-v1-reload-tasks-taskId)Delete a task

Deprecated

Deletes a task

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)
Deprecated This endpoint is deprecated and will eventually be removed. Read our API policy [here](https://qlik.dev/apis/api-policy/).
Deprecated sunset 2026-09
Deprecated description This endpoint is deprecated and will be removed after 2026-09. Use the `/scheduling/tasks/{id}` endpoint instead.

### Header Parameters

*   Authorization string Required   JWT containing tenant credentials. 

### Path Parameters

*   taskId string Required   The unique identifier of the task. 

### Responses

#### 204

Task deleted successfully.

#### 400

Bad Request.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

#### 401

Unauthorized, JWT invalid or not provided.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

#### 403

Forbidden, the requesting JWT does not allow for creation or retrieval of this engine session.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

#### 404

Not Found.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

#### 500

Internal server error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   
        *   title string Required   
        *   detail string   

    *   traceId string   

 DELETE /api/v1/reload-tasks/{taskId}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.reloadTasks.deleteReloadTask('string')
```

`# qlik-cli has not implemented support for DELETE /api/v1/reload-tasks/{taskId} yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/reload-tasks/{taskId}" \-X DELETE \-H "Authorization: Bearer <access_token>"`

Was this page helpful?
*   yes 
*   no 

![Image 2: Qlik logo](https://qlik.dev/logo-footer.svg)

[Qlik Community](https://community.qlik.com/)

[](https://join.slack.com/t/qlikdeveloper/shared_invite/zt-3wrdlkhog-Dcq9LuCbjNQVN2XaPlgGqQ)[](https://www.facebook.com/qlik)[](https://www.linkedin.com/company/qlik)[](https://x.com/qlikdeveloper)

[Legal Agreements](https://www.qlik.com/us/legal/legal-agreements) / [Legal Policies](https://www.qlik.com/us/legal/legal-policies) / [Privacy & Cookie Notice](https://www.qlik.com/us/legal/privacy-and-cookie-notice) / [Terms of Use](https://qlik.dev/qlik-developer-portal-terms-of-use.pdf) / Do Not Share My Info

 Copyright © 1993-2026 QlikTech International AB. All rights reserved. 

We use cookies to improve your experience with our websites and to deliver content tailored to your interests. By clicking ‘Ok’, you accept the use of additional cookies which may involve data transmission to third parties. Refer to our Privacy & Cookie Notice or click ‘More Information’ for details on cookie usage on our sites.[Privacy & Cookie Notice](https://www.qlik.com/us/legal/cookies-and-privacy-policy)

Ok

More Information

![Image 3: Company Logo](https://cdn.cookielaw.org/logos/0fff665c-78ed-4cdf-8357-4cb648f38616/018f1b3a-c29f-79e8-84cb-8f0f597a1714/bdc0e6d8-2ecf-48dc-808d-33588709b9b4/qliklogo_2024.png)

## Privacy Preference Center

When you visit any website, it may store or retrieve information on your browser, mostly in the form of cookies which may include third party cookies. As a Californian resident or citizen, it is your right under the CPRA to opt out of cross-context behavioral advertising. Cross-context behavioral ads use data from one site or app to advertise to you on a different company's site or app to show ads or products that you may be interested in. 

[More information](https://www.qlik.com/us/legal/privacy-and-cookie-notice)

Allow All
### Manage Consent Preferences

#### Strictly Necessary Cookies

Always Active

These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms. You can set your browser to block or alert you about these cookies, but some parts of the site will not then work.

Cookies Details‎

#### Functional Cookies

- [x] Functional Cookies 

These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages. If you do not allow these cookies, then some or all of these services may not function properly. These cookies do not typically store personal information enabling us to identify you, but are based on uniquely identifying your browser and internet device.

Cookies Details‎

#### Performance Cookies

- [x] Performance Cookies 

These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site and make it easier to navigate. For example, they help us to know which pages are the most and least popular and see how visitors move around the site. When analyzing this data it is typically done on an aggregated (anonymous) basis.

Cookies Details‎

#### Advertising Cookies

- [x] Advertising Cookies 

These cookies may be set through our site by our advertising partners to build a profile of your interests and show you relevant advertisements on other sites. They do not typically store personal information enabling us to identify you, but are based on uniquely identifying your browser and internet device. If you do not allow these cookies, you will experience less relevant advertising.

Cookies Details‎

### Cookie List

Clear

*   - [x] checkbox label label 

Apply Cancel

Consent Leg.Interest

- [x] checkbox label label

- [x] checkbox label label

- [x] checkbox label label

Confirm My Choices

[![Image 4: Powered by Onetrust](https://cdn.cookielaw.org/logos/static/powered_by_logo.svg)](https://www.onetrust.com/products/cookie-consent/)