---
title: "Automation connections REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/workflows/automation-connections/"
local_path: "docs/endpoints/workflows-automation-connections.md"
---

Title: Automation connections REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/workflows/automation-connections/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Automation connections

*   [List automation connections](https://qlik.dev/apis/rest/workflows/automation-connections/#get-api-workflows-automation-connections "List automation connections")
*   [Create an automation connection](https://qlik.dev/apis/rest/workflows/automation-connections/#post-api-workflows-automation-connections "Create an automation connection")
*   [Get an automation connection](https://qlik.dev/apis/rest/workflows/automation-connections/#get-api-workflows-automation-connections-id "Get an automation connection")
*   [Update an automation connection](https://qlik.dev/apis/rest/workflows/automation-connections/#put-api-workflows-automation-connections-id "Update an automation connection")
*   [Delete an automation connection](https://qlik.dev/apis/rest/workflows/automation-connections/#delete-api-workflows-automation-connections-id "Delete an automation connection")
*   [Change automation connection owner](https://qlik.dev/apis/rest/workflows/automation-connections/#post-api-workflows-automation-connections-id-actions-change-owner "Change automation connection owner")
*   [Change automation connection space](https://qlik.dev/apis/rest/workflows/automation-connections/#post-api-workflows-automation-connections-id-actions-change-space "Change automation connection space")
*   [Check automation connection](https://qlik.dev/apis/rest/workflows/automation-connections/#post-api-workflows-automation-connections-id-actions-check "Check automation connection")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)
6.    / 
7.    workflows 

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/workflows/automation-connections.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Automation connections

[Download OpenAPI spec](https://qlik.dev/specs/rest/workflows/automation-connections.json)

Automation Connections are used by Qlik Automate connectors during automation execution.

Preferred API

This API replaces the legacy [Automation connections API](https://qlik.dev/apis/rest/automation-connections/). Use this API for all new implementations.

## Endpoints

*   [GET /api/workflows/automation-connections](https://qlik.dev/apis/rest/workflows/automation-connections/#get-api-workflows-automation-connections)
*   [POST /api/workflows/automation-connections](https://qlik.dev/apis/rest/workflows/automation-connections/#post-api-workflows-automation-connections)
*   [GET /api/workflows/automation-connections/{id}](https://qlik.dev/apis/rest/workflows/automation-connections/#get-api-workflows-automation-connections-id)
*   [PUT /api/workflows/automation-connections/{id}](https://qlik.dev/apis/rest/workflows/automation-connections/#put-api-workflows-automation-connections-id)
*   [DELETE /api/workflows/automation-connections/{id}](https://qlik.dev/apis/rest/workflows/automation-connections/#delete-api-workflows-automation-connections-id)
*   [POST /api/workflows/automation-connections/{id}/actions/change-owner](https://qlik.dev/apis/rest/workflows/automation-connections/#post-api-workflows-automation-connections-id-actions-change-owner)
*   [POST /api/workflows/automation-connections/{id}/actions/change-space](https://qlik.dev/apis/rest/workflows/automation-connections/#post-api-workflows-automation-connections-id-actions-change-space)
*   [POST /api/workflows/automation-connections/{id}/actions/check](https://qlik.dev/apis/rest/workflows/automation-connections/#post-api-workflows-automation-connections-id-actions-check)

## [](https://qlik.dev/apis/rest/workflows/automation-connections/#get-api-workflows-automation-connections)List automation connections

Retrieves a list of automation connections the requesting user has access to.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)
Replaces*   [GET v1/automation-connections](https://qlik.dev/apis/rest/automation-connections/#get-api-v1-automation-connections)

### Query Parameters

*   cursor string   Pagination cursor returned from a previous request. 
*   filter string   Filters the result based on the specified criteria: name, connectorId, ownerId, or spaceId. 
*   limit integer   The number of automation connections to retrieve. 
minimum = 1,  maximum = 200,  default = 100,  default = 100

*   listAll boolean   When true, list all connections. Restricted to tenant admins and analytics admins. 
default = false

*   sort string   The field to sort by, with +- prefix indicating sort order. (`?sort=-name` => sort on the `name` field using descending order). 
Can be one of: "id""name""createdAt""updatedAt""+id""+name""+createdAt""+updatedAt""-id""-name""-createdAt""-updatedAt"

default = "id"

### Responses

#### 200

OK Response

*   application/json object   

Show application/json properties 

    *   data array of objects   

Show data properties 

        *   id string   The unique identifier of an automation connection. 
        *   name string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The name of an automation connection. 
        *   ownerId string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The unique identifier of the owner of the automation connection. 
        *   spaceId string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The space ID of the automation connection. 
        *   createdAt string   The timestamp when the automation connection is created. 
format = "date-time"

        *   updatedAt string   The timestamp when the automation connection is updated. 
format = "date-time"

        *   connectorId string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The unique identifier of the connector the automation connection is created from. 
        *   isConnected boolean   Returns true if the automtion connection is connected. 

    *   links object   

Show links properties 

        *   next object   

Show next properties 

            *   href string   The URL to a resource request 

        *   prev object   

Show prev properties 

            *   href string   The URL to a resource request 

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 503

Service Unavailable

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

 GET /api/workflows/automation-connections

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `GET /api/workflows/automation-connections` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/workflows/automation-connections',  {    method: 'GET',    headers: {      'Content-Type': 'application/json',    },  },)
```

`qlik workflows automation-connection ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/workflows/automation-connections" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "data": [    {      "id": "e0e720d0-4947-11ec-a1d2-9559fa35801d",      "name": "auto conn",      "ownerId": "sWYAHxZxhtcmBT7Ptc5xJ5I6N7HxwnEy",      "spaceId": "5f0f78b239ff4f0001234567",      "createdAt": "2021-12-23T12:28:21.000000Z",      "updatedAt": "2021-12-23T12:28:21.000000Z",      "connectorId": "e0e720d0-4947-11ec-a1d2-9559fa35801d",      "isConnected": true    }  ],  "links": {    "next": {      "href": "string"    },    "prev": {      "href": "string"    }  }}`

## [](https://qlik.dev/apis/rest/workflows/automation-connections/#post-api-workflows-automation-connections)Create an automation connection

Creates a new connection object from an automation connector.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)
Replaces*   [POST v1/automation-connections](https://qlik.dev/apis/rest/automation-connections/#post-api-v1-automation-connections)

### Request Body

Required

The automation object to create.

*   application/json object   

Show application/json properties 

    *   name string   The name of the created automation connection. 
    *   params array of objects   

Show params properties 

        *   name string   The name of the automation connection parameter. 
        *   value string   The value of the automation connection parameter option. 

    *   spaceId string   The unique identifier of the space in which the automation connection is created. 
    *   connectorId string Required   The unique identifier of the connector from which the automation connection is created. 

### Responses

#### 201

Created

*   application/json object   

Show application/json properties 

    *   id string   The unique identifier of the automation connection. 
    *   name string   The name of the automation connection. 
    *   error object   This contains the error message if a connection is being created with an issue. 
    *   params array of objects   

Show params properties 

        *   id string   The unique identifier of the automation connection parameter. 
        *   meta array of undefineds   The metadata of the automation connection parameter. 
        *   name string   The name of the automation connection parameter. 
        *   order integer   The order that the automation connection configuration fields should be displayed in. 
        *   value string   The value of the automation connection parameter. 
        *   fieldType string   The field type of the automation connection parameter. 
        *   isOptional boolean   When true, the parameter is optional. 
        *   exampleValue string   The example value of the automation connection parameter. 
        *   paramOptions array of objects   

Show paramOptions properties 

            *   id string   The unique identifier of the automation connection parameter option. 
            *   value string   The value of the automation connection parameter option. 

        *   documentation string   The documentation of the automation connection parameter. 

    *   ownerId string   The unique identifier of the owner of the automation connection. 
    *   spaceId string   The space ID of the automation connection. 
    *   redirect string   The redirect of the OAuth account. 
    *   createdAt string   The timestamp when the automation connection was created. 
format = "date-time"

    *   updatedAt string   The timestamp when the automation connection was updated. 
format = "date-time"

    *   connectorId string   The unique identifier of the automation connector. 
    *   isConnected boolean   The connection status of the automation connection. When true, the automation connection is connected. 
    *   oauthAccountName string   The name of the OAuth account associated with the automation connection. 

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 503

Service Unavailable

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

 POST /api/workflows/automation-connections

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `POST /api/workflows/automation-connections` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/workflows/automation-connections',  {    method: 'POST',    headers: {      'Content-Type': 'application/json',    },    body: JSON.stringify({      name: 'connection',      params: [        {          name: 'username',          value: 'example-username',        },      ],      spaceId: '5f0f78b239ff4f0001234567',      connectorId:        '3004e850-1985-11ee-b6df-8d800b305320',    }),  },)
```

`qlik workflows automation-connection create \  --connectorId '3004e850-1985-11ee-b6df-8d800b305320'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/workflows/automation-connections" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"name":"connection","params":[{"name":"username","value":"example-username"}],"spaceId":"5f0f78b239ff4f0001234567","connectorId":"3004e850-1985-11ee-b6df-8d800b305320"}'`

### Example Response

`{  "id": "e0e720d0-4947-11ec-a1d2-9559fa35801d",  "name": "connection",  "error": {},  "params": [    {      "id": "39a90780-8874-11ee-b16c-89512345678",      "meta": [],      "name": "region",      "order": 1,      "value": "string",      "fieldType": "enum",      "isOptional": "false",      "exampleValue": "string",      "paramOptions": [        {          "id": "39a90780-8874-11ee-b16c-89512345678",          "value": "string"        }      ],      "documentation": "string"    }  ],  "ownerId": "sWYAHxZxhtcmBT7Ptc5xJ5I6N7HxwnEy",  "spaceId": "5f0f78b239ff4f0001234567",  "redirect": "string",  "createdAt": "2021-12-23T12:28:21.000000Z",  "updatedAt": "2021-12-23T12:28:21.000000Z",  "connectorId": "e0e720d0-4947-11ec-a1d2-9559fa35801d",  "isConnected": true,  "oauthAccountName": "oauth"}`

## [](https://qlik.dev/apis/rest/workflows/automation-connections/#get-api-workflows-automation-connections-id)Get an automation connection

Returns details about the specified automation connection.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)
Replaces*   [GET v1/automation-connections/{id}](https://qlik.dev/apis/rest/automation-connections/#get-api-v1-automation-connections-id)

### Path Parameters

*   id string Required   The unique identifier for the automation connection. 

### Responses

#### 200

OK Response

*   application/json object   

Show application/json properties 

    *   id string   The unique identifier of the automation connection. 
    *   name string   The name of the automation connection. 
    *   error object   This contains the error message if a connection is being created with an issue. 
    *   params array of objects   

Show params properties 

        *   id string   The unique identifier of the automation connection parameter. 
        *   meta array of undefineds   The metadata of the automation connection parameter. 
        *   name string   The name of the automation connection parameter. 
        *   order integer   The order that the automation connection configuration fields should be displayed in. 
        *   value string   The value of the automation connection parameter. 
        *   fieldType string   The field type of the automation connection parameter. 
        *   isOptional boolean   When true, the parameter is optional. 
        *   exampleValue string   The example value of the automation connection parameter. 
        *   paramOptions array of objects   

Show paramOptions properties 

            *   id string   The unique identifier of the automation connection parameter option. 
            *   value string   The value of the automation connection parameter option. 

        *   documentation string   The documentation of the automation connection parameter. 

    *   ownerId string   The unique identifier of the owner of the automation connection. 
    *   spaceId string   The space ID of the automation connection. 
    *   redirect string   The redirect of the OAuth account. 
    *   createdAt string   The timestamp when the automation connection was created. 
format = "date-time"

    *   updatedAt string   The timestamp when the automation connection was updated. 
format = "date-time"

    *   connectorId string   The unique identifier of the automation connector. 
    *   isConnected boolean   The connection status of the automation connection. When true, the automation connection is connected. 
    *   oauthAccountName string   The name of the OAuth account associated with the automation connection. 

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 404

Not found

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 503

Service Unavailable

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

 GET /api/workflows/automation-connections/{id}

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `GET /api/workflows/automation-connections/{id}` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/workflows/automation-connections/{id}',  {    method: 'GET',    headers: {      'Content-Type': 'application/json',    },  },)
```

`qlik workflows automation-connection get 'd6321ebd-d9e8-48fe-9d86-97dbd473bf60'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/workflows/automation-connections/{id}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "id": "e0e720d0-4947-11ec-a1d2-9559fa35801d",  "name": "connection",  "error": {},  "params": [    {      "id": "39a90780-8874-11ee-b16c-89512345678",      "meta": [],      "name": "region",      "order": 1,      "value": "string",      "fieldType": "enum",      "isOptional": "false",      "exampleValue": "string",      "paramOptions": [        {          "id": "39a90780-8874-11ee-b16c-89512345678",          "value": "string"        }      ],      "documentation": "string"    }  ],  "ownerId": "sWYAHxZxhtcmBT7Ptc5xJ5I6N7HxwnEy",  "spaceId": "5f0f78b239ff4f0001234567",  "redirect": "string",  "createdAt": "2021-12-23T12:28:21.000000Z",  "updatedAt": "2021-12-23T12:28:21.000000Z",  "connectorId": "e0e720d0-4947-11ec-a1d2-9559fa35801d",  "isConnected": true,  "oauthAccountName": "oauth"}`

## [](https://qlik.dev/apis/rest/workflows/automation-connections/#put-api-workflows-automation-connections-id)Update an automation connection

Updates the specified properties of an automation connection.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)
Replaces*   [PUT v1/automation-connections/{id}](https://qlik.dev/apis/rest/automation-connections/#put-api-v1-automation-connections-id)

### Path Parameters

*   id string Required   The unique identifier for the automation connection. 

### Request Body

Required

The automation connection object to update.

*   application/json object   

Show application/json properties 

    *   name string   The new name of the automation connection to be renamed to. 
    *   params array of objects   

Show params properties 

        *   id string   The unique identifier of the automation connection parameter option. 
        *   value string   The value of the automation connection parameter option. 

### Responses

#### 200

OK Response

*   application/json object   

Show application/json properties 

    *   id string   The unique identifier of the automation connection. 
    *   name string   The name of the automation connection. 
    *   error object   This contains the error message if a connection is being created with an issue. 
    *   params array of objects   

Show params properties 

        *   id string   The unique identifier of the automation connection parameter. 
        *   meta array of undefineds   The metadata of the automation connection parameter. 
        *   name string   The name of the automation connection parameter. 
        *   order integer   The order that the automation connection configuration fields should be displayed in. 
        *   value string   The value of the automation connection parameter. 
        *   fieldType string   The field type of the automation connection parameter. 
        *   isOptional boolean   When true, the parameter is optional. 
        *   exampleValue string   The example value of the automation connection parameter. 
        *   paramOptions array of objects   

Show paramOptions properties 

            *   id string   The unique identifier of the automation connection parameter option. 
            *   value string   The value of the automation connection parameter option. 

        *   documentation string   The documentation of the automation connection parameter. 

    *   ownerId string   The unique identifier of the owner of the automation connection. 
    *   spaceId string   The space ID of the automation connection. 
    *   redirect string   The redirect of the OAuth account. 
    *   createdAt string   The timestamp when the automation connection was created. 
format = "date-time"

    *   updatedAt string   The timestamp when the automation connection was updated. 
format = "date-time"

    *   connectorId string   The unique identifier of the automation connector. 
    *   isConnected boolean   The connection status of the automation connection. When true, the automation connection is connected. 
    *   oauthAccountName string   The name of the OAuth account associated with the automation connection. 

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 404

Not found

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 409

Conflict with the current state of the resource

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 503

Service Unavailable

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

 PUT /api/workflows/automation-connections/{id}

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `PUT /api/workflows/automation-connections/{id}` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/workflows/automation-connections/{id}',  {    method: 'PUT',    headers: {      'Content-Type': 'application/json',    },    body: JSON.stringify({      name: 'connection',      params: [        {          id: '39a90780-8874-11ee-b16c-89512345678',          value: '100',        },      ],    }),  },)
```

`qlik workflows automation-connection update '00000000-0000-0000-0000-000000000000'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/workflows/automation-connections/{id}" \-X PUT \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"name":"connection","params":[{"id":"39a90780-8874-11ee-b16c-89512345678","value":"100"}]}'`

### Example Response

`{  "id": "e0e720d0-4947-11ec-a1d2-9559fa35801d",  "name": "connection",  "error": {},  "params": [    {      "id": "39a90780-8874-11ee-b16c-89512345678",      "meta": [],      "name": "region",      "order": 1,      "value": "string",      "fieldType": "enum",      "isOptional": "false",      "exampleValue": "string",      "paramOptions": [        {          "id": "39a90780-8874-11ee-b16c-89512345678",          "value": "string"        }      ],      "documentation": "string"    }  ],  "ownerId": "sWYAHxZxhtcmBT7Ptc5xJ5I6N7HxwnEy",  "spaceId": "5f0f78b239ff4f0001234567",  "redirect": "string",  "createdAt": "2021-12-23T12:28:21.000000Z",  "updatedAt": "2021-12-23T12:28:21.000000Z",  "connectorId": "e0e720d0-4947-11ec-a1d2-9559fa35801d",  "isConnected": true,  "oauthAccountName": "oauth"}`

## [](https://qlik.dev/apis/rest/workflows/automation-connections/#delete-api-workflows-automation-connections-id)Delete an automation connection

Deletes the specified automation connection.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)
Replaces*   [DELETE v1/automation-connections/{id}](https://qlik.dev/apis/rest/automation-connections/#delete-api-v1-automation-connections-id)

### Query Parameters

*   forced boolean   When true, the automation connection will be deleted regardless of its usage by any automations. 
default = false

### Path Parameters

*   id string Required   The unique identifier for the automation connection. 

### Responses

#### 204

No Content

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 404

Not found

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 503

Service Unavailable

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

 DELETE /api/workflows/automation-connections/{id}

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `DELETE /api/workflows/automation-connections/{id}` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/workflows/automation-connections/{id}',  {    method: 'DELETE',    headers: {      'Content-Type': 'application/json',    },  },)
```

`qlik workflows automation-connection rm '00000000-0000-0000-0000-000000000000'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/workflows/automation-connections/{id}" \-X DELETE \-H "Authorization: Bearer <access_token>"`

## [](https://qlik.dev/apis/rest/workflows/automation-connections/#post-api-workflows-automation-connections-id-actions-change-owner)Change automation connection owner

Changes the owner of an automation connection by specifying a new owner.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)
Replaces*   [POST v1/automation-connections/{id}/actions/change-owner](https://qlik.dev/apis/rest/automation-connections/#post-api-v1-automation-connections-id-actions-change-owner)

### Path Parameters

*   id string Required   The unique identifier for the automation connection. 

### Request Body

Required

The new owner of the automation connection.

*   application/json object   

Show application/json properties 

    *   userId string   The unique identifier of the new owner. 

### Responses

#### 204

No Content

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 404

Not found

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 503

Service Unavailable

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

 POST /api/workflows/automation-connections/{id}/actions/change-owner

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `POST /api/workflows/automation-connections/{id}/actions/change-owner` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/workflows/automation-connections/{id}/actions/change-owner',  {    method: 'POST',    headers: {      'Content-Type': 'application/json',    },    body: JSON.stringify({      userId: 'sWYAHxZxhtcmBT7Ptc5xJ5I6N7HxwnEy',    }),  },)
```

`qlik workflows automation-connection change-owner '00000000-0000-0000-0000-000000000000'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/workflows/automation-connections/{id}/actions/change-owner" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"userId":"sWYAHxZxhtcmBT7Ptc5xJ5I6N7HxwnEy"}'`

## [](https://qlik.dev/apis/rest/workflows/automation-connections/#post-api-workflows-automation-connections-id-actions-change-space)Change automation connection space

Changes the space of an automation connection by specifying a new space.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)
Replaces*   [POST v1/automation-connections/{id}/actions/change-space](https://qlik.dev/apis/rest/automation-connections/#post-api-v1-automation-connections-id-actions-change-space)

### Path Parameters

*   id string Required   The unique identifier for the automation connection. 

### Request Body

Required

The new space of the automation connection.

*   application/json object   

Show application/json properties 

    *   spaceId string   The unique identifier of the new space. Leave empty to move to the owner's personal space. 

### Responses

#### 204

No Content

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 404

Not found

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 503

Service Unavailable

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

 POST /api/workflows/automation-connections/{id}/actions/change-space

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `POST /api/workflows/automation-connections/{id}/actions/change-space` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/workflows/automation-connections/{id}/actions/change-space',  {    method: 'POST',    headers: {      'Content-Type': 'application/json',    },    body: JSON.stringify({      spaceId: '5f0f78b239ff4f0001234567',    }),  },)
```

`qlik workflows automation-connection change-space '00000000-0000-0000-0000-000000000000'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/workflows/automation-connections/{id}/actions/change-space" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"spaceId":"5f0f78b239ff4f0001234567"}'`

## [](https://qlik.dev/apis/rest/workflows/automation-connections/#post-api-workflows-automation-connections-id-actions-check)Check automation connection

Tries to validate and checks the connection status of an automation connection.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)
Replaces*   [POST v1/automation-connections/{id}/actions/check](https://qlik.dev/apis/rest/automation-connections/#post-api-v1-automation-connections-id-actions-check)

### Path Parameters

*   id string Required   The unique identifier for the automation connection. 

### Responses

#### 200

OK Response

*   application/json object   

Show application/json properties 

    *   connected boolean   The connection status of the automation connection. When true, the automation connection is connected. 
    *   is_connected boolean   The connection status of the automation connection. When true, the automation connection is connected. 

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 404

Not found

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 503

Service Unavailable

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

 POST /api/workflows/automation-connections/{id}/actions/check

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `POST /api/workflows/automation-connections/{id}/actions/check` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/workflows/automation-connections/{id}/actions/check',  {    method: 'POST',    headers: {      'Content-Type': 'application/json',    },  },)
```

`qlik workflows automation-connection check '00000000-0000-0000-0000-000000000000'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/workflows/automation-connections/{id}/actions/check" \-X POST \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "connected": true,  "is_connected": true}`

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