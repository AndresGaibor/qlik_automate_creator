---
title: "Automation connectors REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/workflows/automation-connectors/"
local_path: "docs/endpoints/workflows-automation-connectors.md"
---

Title: Automation connectors REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/workflows/automation-connectors/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Automation connectors

*   [List automation connectors](https://qlik.dev/apis/rest/workflows/automation-connectors/#get-api-workflows-automation-connectors "List automation connectors")
*   [Get an automation connector](https://qlik.dev/apis/rest/workflows/automation-connectors/#get-api-workflows-automation-connectors-connectorId "Get an automation connector")
*   [Get webhook configuration for an automation connector](https://qlik.dev/apis/rest/workflows/automation-connectors/#get-api-workflows-automation-connectors-connectorId-webhooks-configuration "Get webhook configuration for an automation connector")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)
6.    / 
7.    workflows 

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/workflows/automation-connectors.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Automation connectors

[Download OpenAPI spec](https://qlik.dev/specs/rest/workflows/automation-connectors.json)

Automation connectors let you integrate third-party services and applications into your data analytics workflows. Use this API to discover available connectors and understand billing characteristics.

Preferred API

This API replaces the legacy [Automation connectors API](https://qlik.dev/apis/rest/automation-connectors/). Use this API for all new implementations.

## Endpoints

*   [GET /api/workflows/automation-connectors](https://qlik.dev/apis/rest/workflows/automation-connectors/#get-api-workflows-automation-connectors)
*   [GET /api/workflows/automation-connectors/{connectorId}](https://qlik.dev/apis/rest/workflows/automation-connectors/#get-api-workflows-automation-connectors-connectorId)
*   [GET /api/workflows/automation-connectors/{connectorId}/webhooks/configuration](https://qlik.dev/apis/rest/workflows/automation-connectors/#get-api-workflows-automation-connectors-connectorId-webhooks-configuration)

## [](https://qlik.dev/apis/rest/workflows/automation-connectors/#get-api-workflows-automation-connectors)List automation connectors

Retrieves a list of automation connectors.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)
Replaces*   [GET v1/automation-connectors](https://qlik.dev/apis/rest/automation-connectors/#get-api-v1-automation-connectors)

### Query Parameters

*   cursor string   Pagination cursor returned from a previous request. 
*   filter string   Filters the result based on the specified criteria: name. 
*   limit integer   The number of automation connectors to retrieve. 
minimum = 1,  maximum = 200,  default = 100,  default = 100

*   sort string   The field to sort by, with +- prefix indicating sort order. (`?sort=-name` => sort on the `name` field using descending order). 
Can be one of: "id""-id""+id""name""+name""-name"

default = "id"

### Responses

#### 200

OK Response

*   application/json object   

Show application/json properties 

    *   data array of objects   

Show data properties 

        *   id string   
format = "uuid"

        *   name string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The name of an automation connector. 
        *   billable boolean   Indicates if the connector is billable. 
        *   logoLarge string   The URL to the large logo of the connector. 
        *   logoSmall string   The URL to the small logo of the connector. 
        *   logoMedium string   The URL to the medium logo of the connector. 
        *   description string   The description of the automation connector. 
        *   hasWebhooks boolean   Indicates if the connector supports webhooks. 

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

 GET /api/workflows/automation-connectors

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `GET /api/workflows/automation-connectors` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/workflows/automation-connectors',  {    method: 'GET',    headers: {      'Content-Type': 'application/json',    },  },)
```

`qlik workflows automation-connector ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/workflows/automation-connectors" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "data": [    {      "id": "0d87347d-27c0-11ea-921c-022e6b5ea1e2",      "name": "Airtable",      "billable": "true",      "logoLarge": "https://cdn.qlikcloud.com/automations/logos/a2649cabda63b339ebc68a0c8d028f08.png",      "logoSmall": "https://cdn.qlikcloud.com/automations/logos/a14638b5bf73f6d360f3c2732cf94bd9.png",      "logoMedium": "https://cdn.qlikcloud.com/automations/logos/db2e3454fd01a6c3a53c09609a0b504f.png",      "description": "Airtable is a cloud collaboration service.",      "hasWebhooks": "true"    }  ],  "links": {    "next": {      "href": "string"    },    "prev": {      "href": "string"    }  }}`

## [](https://qlik.dev/apis/rest/workflows/automation-connectors/#get-api-workflows-automation-connectors-connectorId)Get an automation connector

Retrieves the full details of an automation connector, including its connection parameters, blocks, and snippets.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Path Parameters

*   connectorId string Required   The unique identifier of the automation connector. 
format = "uuid"

### Responses

#### 200

OK Response

*   application/json object   

Show application/json properties 

    *   id string   
format = "uuid"

    *   name string   The name of the automation connector. 
    *   blocks array of objects   The available blocks (endpoints) for this connector. 

Show blocks properties 

        *   id string   The unique identifier of the block. 
format = "uuid"

        *   name string   The name of the block. 
        *   role string   The role of the block. 
        *   inputs array of objects   The input parameters for this block. 

Show inputs properties 

            *   id string   The unique identifier of the parameter. 
format = "uuid"

            *   name string   The name of the parameter. 
            *   options array of strings   The available options for the parameter. 
            *   setting boolean   Indicates whether the parameter is a setting. 
            *   optional boolean   Indicates whether the parameter is optional. 
            *   fieldType string   The field type of the parameter. 
            *   description string   The description of the parameter. 
            *   exampleValue string   An example value for the parameter. 

        *   objectType string   The object type this block operates on. 
        *   description string   The description of the block. 
        *   exampleOutput object|array|string   An example of the output this block produces. 

One of:
            *   object   
            *   array of object,string,number,booleans   

One of:
                *   object   
                *   string   
                *   number   
                *   boolean   

            *   string   

    *   params array of objects   The connection parameters required to authenticate with this connector. 

Show params properties 

        *   id string   The unique identifier of the parameter. 
format = "uuid"

        *   name string   The name of the parameter. 
        *   options array of strings   The available options for the parameter. 
        *   setting boolean   Indicates whether the parameter is a setting. 
        *   optional boolean   Indicates whether the parameter is optional. 
        *   fieldType string   The field type of the parameter. 
        *   description string   The description of the parameter. 
        *   exampleValue string   An example value for the parameter. 

    *   billable boolean   Indicates if the connector is billable. 
    *   snippets array of objects   The available snippet templates for this connector. 

Show snippets properties 

        *   id string   The unique identifier of the snippet. 
format = "uuid"

        *   name string   The name of the snippet. 
        *   role string   The role of the snippet. 
        *   inputs array of objects   The input fields for this snippet. 

Show inputs properties 

            *   id string   The unique identifier of the snippet input. 
format = "uuid"

            *   name string   The display name (prompt) of the input. 
            *   options object|array   The available options for this input. 

One of:
                *   object   
                *   array of undefineds   

            *   optional boolean   Indicates whether the input is optional. 
            *   fieldType string   The field type of the input. 
            *   description string   The help text for this input. 

        *   objectType string   The object type this snippet operates on. 
        *   description string   The description of the snippet. 
        *   exampleOutput object|array|string   An example of the output this snippet produces. 

One of:
            *   object   
            *   array of object,string,number,booleans   

One of:
                *   object   
                *   string   
                *   number   
                *   boolean   

            *   string   

    *   description string   The description of the automation connector. 
    *   hasWebhooks boolean   Indicates if the connector supports webhooks. 
    *   connectDocumentation string   Documentation for setting up a connection with this connector. 

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

 GET /api/workflows/automation-connectors/{connectorId}

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `GET /api/workflows/automation-connectors/{connectorId}` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/workflows/automation-connectors/{connectorId}',  {    method: 'GET',    headers: {      'Content-Type': 'application/json',    },  },)
```

`# qlik-cli has not implemented support for GET /api/workflows/automation-connectors/{connectorId} yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/workflows/automation-connectors/{connectorId}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "id": "0d87347d-27c0-11ea-921c-022e6b5ea1e2",  "name": "Airtable",  "blocks": [    {      "id": "9d94bef0-b28c-11eb-8dba-01593c457362",      "name": "List Records",      "role": "list",      "inputs": [        {          "id": "0d87347d-27c0-11ea-921c-022e6b5ea1e2",          "name": "API Key",          "options": [            "string"          ],          "setting": false,          "optional": false,          "fieldType": "text",          "description": "string",          "exampleValue": "string"        }      ],      "objectType": "Record",      "description": "string",      "exampleOutput": {}    }  ],  "params": [    {      "id": "0d87347d-27c0-11ea-921c-022e6b5ea1e2",      "name": "API Key",      "options": [        "string"      ],      "setting": false,      "optional": false,      "fieldType": "text",      "description": "string",      "exampleValue": "string"    }  ],  "billable": true,  "snippets": [    {      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",      "name": "Sync Records",      "role": "string",      "inputs": [        {          "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",          "name": "Table Name",          "options": {},          "optional": false,          "fieldType": "text",          "description": "string"        }      ],      "objectType": "Record",      "description": "string",      "exampleOutput": {}    }  ],  "description": "string",  "hasWebhooks": true,  "connectDocumentation": "string"}`

## [](https://qlik.dev/apis/rest/workflows/automation-connectors/#get-api-workflows-automation-connectors-connectorId-webhooks-configuration)Get webhook configuration for an automation connector

Retrieves the webhook configuration for an automation connector, including its events and event parameters.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Path Parameters

*   connectorId string Required   The unique identifier of the automation connector. 
format = "uuid"

### Responses

#### 200

OK Response

*   application/json object   

Show application/json properties 

    *   id string   The unique identifier of the webhook configuration. 
format = "uuid"

    *   events array of objects   The available webhook events for this connector. 

Show events properties 

        *   id string   The unique identifier of the webhook event. 
format = "uuid"

        *   name string   The name of the webhook event. 
        *   role string   The role of the webhook event. 
        *   params array of objects   The parameters available for this webhook event. 

Show params properties 

            *   id string   The unique identifier of the webhook event parameter. 
format = "uuid"

            *   name string   The name of the parameter. 
            *   type string   The type of the parameter. 
            *   options array of strings   The available options for this parameter. 
            *   required boolean   Indicates whether the parameter is required. 

        *   description string   The description of the webhook event. 
        *   exampleOutput object|array|string   An example of the payload this event produces. 

One of:
            *   object   
            *   array of object,string,number,booleans   

One of:
                *   object   
                *   string   
                *   number   
                *   boolean   

            *   string   

    *   automatic boolean   Indicates whether the webhook is set up automatically. 

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

 GET /api/workflows/automation-connectors/{connectorId}/webhooks/configuration

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `GET /api/workflows/automation-connectors/{connectorId}/webhooks/configuration` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/workflows/automation-connectors/{connectorId}/webhooks/configuration',  {    method: 'GET',    headers: {      'Content-Type': 'application/json',    },  },)
```

`# qlik-cli has not implemented support for GET /api/workflows/automation-connectors/{connectorId}/webhooks/configuration yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/workflows/automation-connectors/{connectorId}/webhooks/configuration" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "id": "0d87347d-27c0-11ea-921c-022e6b5ea1e2",  "events": [    {      "id": "0d87347d-27c0-11ea-921c-022e6b5ea1e2",      "name": "Record Created",      "role": "create",      "params": [        {          "id": "0d87347d-27c0-11ea-921c-022e6b5ea1e2",          "name": "table_id",          "type": "text",          "options": [            "string"          ],          "required": true        }      ],      "description": "string",      "exampleOutput": {}    }  ],  "automatic": true}`

Was this page helpful?
*   yes 
*   no 

![Image 2: Qlik logo](https://qlik.dev/logo-footer.svg)

[Qlik Community](https://community.qlik.com/)

[](https://join.slack.com/t/qlikdeveloper/shared_invite/zt-3wrdlkhog-Dcq9LuCbjNQVN2XaPlgGqQ)[](https://www.facebook.com/qlik)[](https://www.linkedin.com/company/qlik)[](https://x.com/qlikdeveloper)

[Legal Agreements](https://www.qlik.com/us/legal/legal-agreements) / [Legal Policies](https://www.qlik.com/us/legal/legal-policies) / [Privacy & Cookie Notice](https://www.qlik.com/us/legal/privacy-and-cookie-notice) / [Terms of Use](https://qlik.dev/qlik-developer-portal-terms-of-use.pdf) / Do Not Share My Info

 Copyright © 1993-2026 QlikTech International AB. All rights reserved.