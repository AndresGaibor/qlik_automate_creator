---
title: "Reloads REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/reloads/"
local_path: "docs/endpoints/reloads.md"
---

Title: Reloads REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/reloads/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Reloads

*   [Find and return reloads](https://qlik.dev/apis/rest/reloads/#get-api-v1-reloads "Find and return reloads")
*   [Reload an app](https://qlik.dev/apis/rest/reloads/#post-api-v1-reloads "Reload an app")
*   [Get reload record](https://qlik.dev/apis/rest/reloads/#get-api-v1-reloads-reloadId "Get reload record")
*   [Cancel a reload](https://qlik.dev/apis/rest/reloads/#post-api-v1-reloads-reloadId-actions-cancel "Cancel a reload")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/reloads.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Reloads

Reloads allows for triggering reloads of apps to refresh its data. Traditionally this has only been possible through the JSON-RPC WebSocket API, but can now also be done by using this REST API.

[Download OpenAPI spec](https://qlik.dev/specs/rest/reloads.json)

## Endpoints

*   [GET /api/v1/reloads](https://qlik.dev/apis/rest/reloads/#get-api-v1-reloads)
*   [POST /api/v1/reloads](https://qlik.dev/apis/rest/reloads/#post-api-v1-reloads)
*   [GET /api/v1/reloads/{reloadId}](https://qlik.dev/apis/rest/reloads/#get-api-v1-reloads-reloadId)
*   [POST /api/v1/reloads/{reloadId}/actions/cancel](https://qlik.dev/apis/rest/reloads/#post-api-v1-reloads-reloadId-actions-cancel)

## [](https://qlik.dev/apis/rest/reloads/#get-api-v1-reloads)Find and return reloads

Finds and returns the reloads that the user has access to.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Header Parameters

*   Authorization string Required   JWT containing tenant credentials. 

### Query Parameters

*   appId string Required   The UUID formatted string used to search for an app's reload history entries. TenantAdmin users may omit this parameter to list all reload history in the tenant. 
*   filter string   

SCIM filter expression used to search for reloads. The filter syntax is defined in RFC 7644 section 3.4.2.2

Supported attributes:

    *   status: see #schemas/Status
    *   partial: see #schemas/Partial
    *   type: see #schemas/Type

Supported operators:

    *   eq

*   limit integer   The maximum number of resources to return for a request. The limit must be an integer between 1 and 100 (inclusive). 
minimum = 1,  maximum = 100,  default = 10,  format = int32,  default = 10

*   log boolean   The boolean value used to include the log field or not, set log=true to include the log field. 
default = false

*   next string   The cursor to the next page of resources. Provide either the next or prev cursor, but not both. 
*   partial boolean   The boolean value used to search for a reload is partial or not. 
*   prev string   The cursor to the previous page of resources. Provide either the next or prev cursor, but not both. 
*   sort string   The field to sort by, with +/- prefix indicating sort order 
Can be one of: "creationTime""+creationTime""-creationTime""status""+status""-status""startTime""+startTime""-startTime""endTime""+endTime""-endTime"

default = "-creationTime"

### Responses

#### 200

Expected response to a valid request.

*   application/json object   

Show application/json properties 

    *   data array of objects Required   

Show data properties 

        *   id string Required   The ID of the reload. 
        *   log string   The log describing the result of the latest reload execution from the request. 
        *   type string Required   What initiated the reload: hub = one-time reload manually triggered in hub, chronos = time based scheduled reload triggered by chronos, external = reload triggered via external API request, automations = reload triggered in automation, data-refresh = reload triggered by refresh of data, choreographer = reload triggered by choreographer. 
Can be one of: "hub""external""chronos""automations""data-refresh""choreographer"

        *   appId string Required   The ID of the app. 
        *   links object   

Show links properties 

            *   self object   

Show self properties 

                *   href string   
format = "uri"

        *   status string Required   The status of the reload. There are seven statuses. `QUEUED`, `RELOADING`, `CANCELING` are the active statuses. `SUCCEEDED`, `FAILED`, `CANCELED`, `EXCEEDED_LIMIT` are the end statuses. 
Can be one of: "QUEUED""RELOADING""CANCELING""SUCCEEDED""FAILED""CANCELED""EXCEEDED_LIMIT"

        *   userId string Required   The ID of the user who created the reload. 
        *   weight integer   The weight of the reload for the same tenant. The higher the weight, the sooner the reload will be scheduled relative to other reloads for the same tenant. The personal app will be always set as 1. 
minimum = 1,  maximum = 10,  default = 1,  default = 1

        *   endTime string   The time the reload job finished. 
        *   partial boolean   The boolean value used to present the reload is partial or not. 
        *   tenantId string Required   The ID of the tenant who owns the reload. 
        *   errorCode string   The error code when the status is FAILED. 
        *   startTime string   The time the reload job was consumed from the queue. 
        *   engineTime string   The timestamp returned from the Sense engine upon successful reload. 
        *   resourceId string   The String field identifying the specific resource ID within that service 
        *   creationTime string Required   The time the reload job was created. 
        *   errorMessage string   The error message when the status is FAILED. 
        *   resourceType string   The String field identifying the service type that triggered the reload, e.g. "api" 
Can be one of: "api""reload-tasks""tasks""automate"

    *   links object Required   

Show links properties 

        *   self object   

Show self properties 

            *   href string   
format = "uri"

        *   next object   

Show next properties 

            *   href string   
format = "uri"

        *   prev object   

Show prev properties 

            *   href string   
format = "uri"

#### 400

Bad request.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The error code is in form of 'RELOADS-xxx'. ranges from 'RELOADS-001' to 'RELOADS-013'. 
        *   title string Required   
        *   detail string   

#### 401

Unauthorized, JWT invalid or not provided.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The error code is in form of 'RELOADS-xxx'. ranges from 'RELOADS-001' to 'RELOADS-013'. 
        *   title string Required   
        *   detail string   

#### 403

Forbidden, the requesting JWT does not allow for retrieval of this reload(error code: RELOADS-003).

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The error code is in form of 'RELOADS-xxx'. ranges from 'RELOADS-001' to 'RELOADS-013'. 
        *   title string Required   
        *   detail string   

#### 500

Internal server error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The error code is in form of 'RELOADS-xxx'. ranges from 'RELOADS-001' to 'RELOADS-013'. 
        *   title string Required   
        *   detail string   

 GET /api/v1/reloads

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.reloads.getReloads({ appId: 'string' })
```

`qlik reload ls \  --appId 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/reloads" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "data": [    {      "id": "5be59decca62aa00097268a4",      "log": "ReloadID: 5be59decca62aa00097268a4\\nStarted loading\\n(A detailed script progress log can be downloaded when the reload is finished)\\nApp saved\\nFinished successfully\\n",      "type": "chronos",      "appId": "116dbfae-7fb9-4983-8e23-5ccd8c508722",      "links": {        "self": {          "href": "http://example.com"        }      },      "status": "FAILED",      "userId": "FyPG6xWp6prDU6BXQ3g7LY9gWR_YRkkx",      "weight": 1,      "endTime": "2020-11-03T17:00:11.865Z",      "partial": false,      "tenantId": "efSCcpNYuayTysONkUcE3F80zYQ_LV9w",      "errorCode": "EngineConnectionError",      "startTime": "2020-11-03T17:00:06.351Z",      "engineTime": "2020-11-03T17:00:07.048Z",      "resourceId": "5be59decca62aa00097268a4",      "creationTime": "2020-11-03T17:00:00.164Z",      "errorMessage": "failed to complete reload: unexpected EOF",      "resourceType": "api"    }  ],  "links": {    "self": {      "href": "http://example.com"    },    "next": {      "href": "http://example.com"    },    "prev": {      "href": "http://example.com"    }  }}`

## [](https://qlik.dev/apis/rest/reloads/#post-api-v1-reloads)Reload an app

Reloads an app specified by an app ID.

### Facts

Rate limit[Special](https://qlik.dev/apis/rest/rate-limiting/)(50 requests per minute)

### Header Parameters

*   Authorization string Required   JWT containing tenant credentials. 

### Request Body

Required

Request body specifying ID of app to be reloaded.

*   application/json object   

Show application/json properties 

    *   appId string Required   The ID of the app to be reloaded. 
    *   weight integer   The weight of the reload for the same tenant. The higher the weight, the sooner the reload will be scheduled relative to other reloads for the same tenant. The personal app will be always set as 1. 
minimum = 1,  maximum = 10,  default = 1,  default = 1

    *   partial boolean   The boolean value used to present the reload is partial or not 
    *   variables object   The variables to be used in the load script. Maximum of 20 variables allowed with a maximum length of 256 characters for each name/value. 
maxProperties = 20

Show additional optional properties 

        *   string string   
maxLength = 256

    *   resourceId string   The String field identifying the specific resource ID within that service 
    *   resourceType string   The String field identifying the service type that triggered the reload, e.g. "api" 
Can be one of: "api""reload-tasks""tasks""automate"

### Responses

#### 201

Expected response to a valid request.

*   application/json object   

Show application/json properties 

    *   id string Required   The ID of the reload. 
    *   log string   The log describing the result of the latest reload execution from the request. 
    *   type string Required   What initiated the reload: hub = one-time reload manually triggered in hub, chronos = time based scheduled reload triggered by chronos, external = reload triggered via external API request, automations = reload triggered in automation, data-refresh = reload triggered by refresh of data, choreographer = reload triggered by choreographer. 
Can be one of: "hub""external""chronos""automations""data-refresh""choreographer"

    *   appId string Required   The ID of the app. 
    *   links object   

Show links properties 

        *   self object   

Show self properties 

            *   href string   
format = "uri"

    *   status string Required   The status of the reload. There are seven statuses. `QUEUED`, `RELOADING`, `CANCELING` are the active statuses. `SUCCEEDED`, `FAILED`, `CANCELED`, `EXCEEDED_LIMIT` are the end statuses. 
Can be one of: "QUEUED""RELOADING""CANCELING""SUCCEEDED""FAILED""CANCELED""EXCEEDED_LIMIT"

    *   userId string Required   The ID of the user who created the reload. 
    *   weight integer   The weight of the reload for the same tenant. The higher the weight, the sooner the reload will be scheduled relative to other reloads for the same tenant. The personal app will be always set as 1. 
minimum = 1,  maximum = 10,  default = 1,  default = 1

    *   endTime string   The time the reload job finished. 
    *   partial boolean   The boolean value used to present the reload is partial or not. 
    *   tenantId string Required   The ID of the tenant who owns the reload. 
    *   errorCode string   The error code when the status is FAILED. 
    *   startTime string   The time the reload job was consumed from the queue. 
    *   engineTime string   The timestamp returned from the Sense engine upon successful reload. 
    *   resourceId string   The String field identifying the specific resource ID within that service 
    *   creationTime string Required   The time the reload job was created. 
    *   errorMessage string   The error message when the status is FAILED. 
    *   resourceType string   The String field identifying the service type that triggered the reload, e.g. "api" 
Can be one of: "api""reload-tasks""tasks""automate"

#### 400

Bad request.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The error code is in form of 'RELOADS-xxx'. ranges from 'RELOADS-001' to 'RELOADS-013'. 
        *   title string Required   
        *   detail string   

#### 401

Unauthorized, JWT invalid or not provided.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The error code is in form of 'RELOADS-xxx'. ranges from 'RELOADS-001' to 'RELOADS-013'. 
        *   title string Required   
        *   detail string   

#### 403

Forbidden, the requesting JWT does not allow for execution of this reload(error code: RELOADS-003) or the reload frequency quota has been met.(error code: RELOADS-013).

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The error code is in form of 'RELOADS-xxx'. ranges from 'RELOADS-001' to 'RELOADS-013'. 
        *   title string Required   
        *   detail string   

#### 429

Too many requests, a pending reload request already exists for this app.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The error code is in form of 'RELOADS-xxx'. ranges from 'RELOADS-001' to 'RELOADS-013'. 
        *   title string Required   
        *   detail string   

#### 500

Internal server error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The error code is in form of 'RELOADS-xxx'. ranges from 'RELOADS-001' to 'RELOADS-013'. 
        *   title string Required   
        *   detail string   

 POST /api/v1/reloads

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.reloads.queueReload({  appId: '116dbfae-7fb9-4983-8e23-5ccd8c508722',  variables: { var1: 'value1', var2: 'value2' },  weight: 1,})
```

`qlik reload create \  --appId '116dbfae-7fb9-4983-8e23-5ccd8c508722'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/reloads" \-X POST \-H "Authorization: Bearer <access_token>" \-H "Content-type: application/json" \-d '{"appId":"116dbfae-7fb9-4983-8e23-5ccd8c508722","weight":1,"partial":false,"variables":{"var1":"value1","var2":"value2"},"resourceId":"5be59decca62aa00097268a4","resourceType":"api"}'`

### Example Response

`{  "id": "5be59decca62aa00097268a4",  "log": "ReloadID: 5be59decca62aa00097268a4\\nStarted loading\\n(A detailed script progress log can be downloaded when the reload is finished)\\nApp saved\\nFinished successfully\\n",  "type": "chronos",  "appId": "116dbfae-7fb9-4983-8e23-5ccd8c508722",  "links": {    "self": {      "href": "http://example.com"    }  },  "status": "FAILED",  "userId": "FyPG6xWp6prDU6BXQ3g7LY9gWR_YRkkx",  "weight": 1,  "endTime": "2020-11-03T17:00:11.865Z",  "partial": false,  "tenantId": "efSCcpNYuayTysONkUcE3F80zYQ_LV9w",  "errorCode": "EngineConnectionError",  "startTime": "2020-11-03T17:00:06.351Z",  "engineTime": "2020-11-03T17:00:07.048Z",  "resourceId": "5be59decca62aa00097268a4",  "creationTime": "2020-11-03T17:00:00.164Z",  "errorMessage": "failed to complete reload: unexpected EOF",  "resourceType": "api"}`

## [](https://qlik.dev/apis/rest/reloads/#get-api-v1-reloads-reloadId)Get reload record

Finds and returns a reload record.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Header Parameters

*   Authorization string Required   JWT containing tenant credentials. 

### Path Parameters

*   reloadId string Required   The unique identifier of the reload. 

### Responses

#### 200

Expected response to a valid request.

*   application/json object   

Show application/json properties 

    *   id string Required   The ID of the reload. 
    *   log string   The log describing the result of the latest reload execution from the request. 
    *   type string Required   What initiated the reload: hub = one-time reload manually triggered in hub, chronos = time based scheduled reload triggered by chronos, external = reload triggered via external API request, automations = reload triggered in automation, data-refresh = reload triggered by refresh of data, choreographer = reload triggered by choreographer. 
Can be one of: "hub""external""chronos""automations""data-refresh""choreographer"

    *   appId string Required   The ID of the app. 
    *   links object   

Show links properties 

        *   self object   

Show self properties 

            *   href string   
format = "uri"

    *   status string Required   The status of the reload. There are seven statuses. `QUEUED`, `RELOADING`, `CANCELING` are the active statuses. `SUCCEEDED`, `FAILED`, `CANCELED`, `EXCEEDED_LIMIT` are the end statuses. 
Can be one of: "QUEUED""RELOADING""CANCELING""SUCCEEDED""FAILED""CANCELED""EXCEEDED_LIMIT"

    *   userId string Required   The ID of the user who created the reload. 
    *   weight integer   The weight of the reload for the same tenant. The higher the weight, the sooner the reload will be scheduled relative to other reloads for the same tenant. The personal app will be always set as 1. 
minimum = 1,  maximum = 10,  default = 1,  default = 1

    *   endTime string   The time the reload job finished. 
    *   partial boolean   The boolean value used to present the reload is partial or not. 
    *   tenantId string Required   The ID of the tenant who owns the reload. 
    *   errorCode string   The error code when the status is FAILED. 
    *   startTime string   The time the reload job was consumed from the queue. 
    *   engineTime string   The timestamp returned from the Sense engine upon successful reload. 
    *   resourceId string   The String field identifying the specific resource ID within that service 
    *   creationTime string Required   The time the reload job was created. 
    *   errorMessage string   The error message when the status is FAILED. 
    *   resourceType string   The String field identifying the service type that triggered the reload, e.g. "api" 
Can be one of: "api""reload-tasks""tasks""automate"

#### 400

Bad request.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The error code is in form of 'RELOADS-xxx'. ranges from 'RELOADS-001' to 'RELOADS-013'. 
        *   title string Required   
        *   detail string   

#### 401

Unauthorized, JWT invalid or not provided.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The error code is in form of 'RELOADS-xxx'. ranges from 'RELOADS-001' to 'RELOADS-013'. 
        *   title string Required   
        *   detail string   

#### 403

Forbidden, the requesting JWT does not allow to find or get a reload(error code: RELOADS-003).

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The error code is in form of 'RELOADS-xxx'. ranges from 'RELOADS-001' to 'RELOADS-013'. 
        *   title string Required   
        *   detail string   

#### 404

Not found.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The error code is in form of 'RELOADS-xxx'. ranges from 'RELOADS-001' to 'RELOADS-013'. 
        *   title string Required   
        *   detail string   

#### 500

Internal server error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The error code is in form of 'RELOADS-xxx'. ranges from 'RELOADS-001' to 'RELOADS-013'. 
        *   title string Required   
        *   detail string   

 GET /api/v1/reloads/{reloadId}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.reloads.getReload('string')
```

`qlik reload get 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/reloads/{reloadId}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "id": "5be59decca62aa00097268a4",  "log": "ReloadID: 5be59decca62aa00097268a4\\nStarted loading\\n(A detailed script progress log can be downloaded when the reload is finished)\\nApp saved\\nFinished successfully\\n",  "type": "chronos",  "appId": "116dbfae-7fb9-4983-8e23-5ccd8c508722",  "links": {    "self": {      "href": "http://example.com"    }  },  "status": "FAILED",  "userId": "FyPG6xWp6prDU6BXQ3g7LY9gWR_YRkkx",  "weight": 1,  "endTime": "2020-11-03T17:00:11.865Z",  "partial": false,  "tenantId": "efSCcpNYuayTysONkUcE3F80zYQ_LV9w",  "errorCode": "EngineConnectionError",  "startTime": "2020-11-03T17:00:06.351Z",  "engineTime": "2020-11-03T17:00:07.048Z",  "resourceId": "5be59decca62aa00097268a4",  "creationTime": "2020-11-03T17:00:00.164Z",  "errorMessage": "failed to complete reload: unexpected EOF",  "resourceType": "api"}`

## [](https://qlik.dev/apis/rest/reloads/#post-api-v1-reloads-reloadId-actions-cancel)Cancel a reload

Cancels a reload that is in progress or has been queued

### Facts

Rate limit[Special](https://qlik.dev/apis/rest/rate-limiting/)(50 requests per minute)

### Header Parameters

*   Authorization string Required   JWT containing tenant credentials. 

### Path Parameters

*   reloadId string Required   The unique identifier of the reload. 

### Responses

#### 202

Reload is being cancelled.

*   application/json object   

Show application/json properties 

    *   status string   The status of the reload. 
Can be one of: "QUEUED""RELOADING""CANCELING""SUCCEEDED""FAILED""CANCELED""EXCEEDED_LIMIT"

#### 204

Reload has been cancelled.

#### 400

Bad request.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The error code is in form of 'RELOADS-xxx'. ranges from 'RELOADS-001' to 'RELOADS-013'. 
        *   title string Required   
        *   detail string   

#### 401

Unauthorized, JWT invalid or not provided.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The error code is in form of 'RELOADS-xxx'. ranges from 'RELOADS-001' to 'RELOADS-013'. 
        *   title string Required   
        *   detail string   

#### 403

Forbidden, the requesting JWT does not allow to cancel a reload(error code: RELOADS-003).

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The error code is in form of 'RELOADS-xxx'. ranges from 'RELOADS-001' to 'RELOADS-013'. 
        *   title string Required   
        *   detail string   

#### 404

The specified reload record could not be found.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The error code is in form of 'RELOADS-xxx'. ranges from 'RELOADS-001' to 'RELOADS-013'. 
        *   title string Required   
        *   detail string   

#### 409

Reload is not in a cancellable state.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The error code is in form of 'RELOADS-xxx'. ranges from 'RELOADS-001' to 'RELOADS-013'. 
        *   title string Required   
        *   detail string   

#### 500

Internal server error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The error code is in form of 'RELOADS-xxx'. ranges from 'RELOADS-001' to 'RELOADS-013'. 
        *   title string Required   
        *   detail string   

 POST /api/v1/reloads/{reloadId}/actions/cancel

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.reloads.cancelReload('string')
```

`qlik reload cancel 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/reloads/{reloadId}/actions/cancel" \-X POST \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "status": "RELOADING"}`

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