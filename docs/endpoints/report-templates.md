---
title: "Report templates REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/report-templates/"
local_path: "docs/endpoints/report-templates.md"
---

Title: Report templates REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/report-templates/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Report templates

*   [Get descriptive info for the specified templates.](https://qlik.dev/apis/rest/report-templates/#get-api-v1-report-templates "Get descriptive info for the specified templates.")
*   [Create a new report template.](https://qlik.dev/apis/rest/report-templates/#post-api-v1-report-templates "Create a new report template.")
*   [Get descriptive info for the specified report template.](https://qlik.dev/apis/rest/report-templates/#get-api-v1-report-templates-id "Get descriptive info for the specified report template.")
*   [Patch an existing report template.](https://qlik.dev/apis/rest/report-templates/#patch-api-v1-report-templates-id "Patch an existing report template.")
*   [Update an existing report template.](https://qlik.dev/apis/rest/report-templates/#put-api-v1-report-templates-id "Update an existing report template.")
*   [Delete the specified report template.](https://qlik.dev/apis/rest/report-templates/#delete-api-v1-report-templates-id "Delete the specified report template.")
*   [Download the template file of the specified report template](https://qlik.dev/apis/rest/report-templates/#post-api-v1-report-templates-id-actions-download "Download the template file of the specified report template")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/report-templates.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Report templates

[Download OpenAPI spec](https://qlik.dev/specs/rest/report-templates.json)

The Report Templates API allows you to create, update, and manage templates that define the structure and styling for generated reports, enabling consistent report delivery across your organization.

## Endpoints

*   [GET /api/v1/report-templates](https://qlik.dev/apis/rest/report-templates/#get-api-v1-report-templates)
*   [POST /api/v1/report-templates](https://qlik.dev/apis/rest/report-templates/#post-api-v1-report-templates)
*   [GET /api/v1/report-templates/{id}](https://qlik.dev/apis/rest/report-templates/#get-api-v1-report-templates-id)
*   [PATCH /api/v1/report-templates/{id}](https://qlik.dev/apis/rest/report-templates/#patch-api-v1-report-templates-id)
*   [PUT /api/v1/report-templates/{id}](https://qlik.dev/apis/rest/report-templates/#put-api-v1-report-templates-id)
*   [DELETE /api/v1/report-templates/{id}](https://qlik.dev/apis/rest/report-templates/#delete-api-v1-report-templates-id)
*   [POST /api/v1/report-templates/{id}/actions/download](https://qlik.dev/apis/rest/report-templates/#post-api-v1-report-templates-id-actions-download)

## [](https://qlik.dev/apis/rest/report-templates/#get-api-v1-report-templates)Get descriptive info for the specified templates.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Query Parameters

*   limit integer   If present, restrict the number of returned items to this value. 
minimum = 1,  maximum = 100,  default = 20,  format = int32,  default = 20

*   name string   Template name to search and filter for. Case-insensitive open search with wildcards both as prefix and suffix. 
*   ownerId string   Return the templates for the specified owner. 
*   skip integer   If present, skip this number of the returned values in the result set (facilitates paging). 
minimum = 0,  maximum = 2147483647,  default = 0,  format = int32,  default = 0

*   sort array of strings   Field to sort by. Prefix with +/- to indicate ascending/descending. By default, the sort order is ascending. 
Values may be any of: "name""+name""-name""createdAt""+createdAt""-createdAt""updatedAt""+updatedAt""-updatedAt""type""+type""-type"

*   sourceAppId string   Return the templates that are using the specified app as data source. 

### Responses

#### 200

The templates list was retrieved.

*   application/json object   

Show application/json properties 

    *   data array of objects   The current page data. 

Show data properties 

        *   id string   The template ID 
format = "uuid"

        *   name string   Template name 
        *   type string   Template type 
Can be one of: "excel""pixelPerfect""html""powerPoint""word"

        *   ownerId string   The user that this template is scoped to. 
        *   createdAt string   The date and time when the template was created. 
format = "date-time"

        *   createdBy string   The id of the user who created the template. 
        *   updatedAt string   The date and time when the template was last updated. 
format = "date-time"

        *   updatedBy string   The id of the user who last updated the template. 
        *   description string   Template description 
        *   sourceAppId string   The id of the app that this template is using as data source. 
        *   sourceAppName string   The name of the app that this template is using as data source. 
        *   metadataVersion integer   The template metadata version 
format = int32

    *   links object   

Show links properties 

        *   next object   

Show next properties 

            *   href string   The URL for the pagination link. 
format = "uri"

        *   prev object   

Show prev properties 

            *   href string   The URL for the pagination link. 
format = "uri"

        *   self object   

Show self properties 

            *   href string   The URL for the pagination link. 
format = "uri"

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string   The error code. 
        *   meta object   Additional error metadata. 
        *   title string   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 

    *   statusCode integer   
format = int32

 GET /api/v1/report-templates

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.reportTemplates.getReportTemplates({})
```

`qlik report-template ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/report-templates" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "data": [    {      "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",      "name": "Sales by category",      "type": "excel",      "ownerId": "0rTsxGg_rtsZAs19Zib_421n6haydjIh",      "createdAt": "2026-01-01T12:00:00.000Z",      "createdBy": "0rTsxGg_rtsZAs19Zib_421n6htydjIh",      "updatedAt": "2026-01-01T12:00:00.000Z",      "updatedBy": "0rTsxGg_rtsZAs19Zib_421n6htydjIh",      "description": "Sales grouped by product category",      "sourceAppId": "c4c70012-29c7-47c2-820d-4ff74cb164a9",      "sourceAppName": "Qlik app",      "metadataVersion": 1    }  ],  "links": {    "next": {      "href": "string"    },    "prev": {      "href": "string"    },    "self": {      "href": "string"    }  }}`

## [](https://qlik.dev/apis/rest/report-templates/#post-api-v1-report-templates)Create a new report template.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

The upload request.

*   application/json object   

Show application/json properties 

    *   name string Required   Template name 
minLength = 1,  maxLength = 255

    *   description string   Template description 
maxLength = 255

    *   sourceAppId string   The ID of the app that this template is using as data source. The id stored in the template file metadata is used if no value is specified. 
    *   sourceAppAction string   Specifies the action to perform with the given source app id. Use "validate" to verify that the template source app matches the provided value. Use "replace" to migrate the template to a different app by replacing the source app id. 
Can be one of: "validate""replace"

format = "Enumeration",  default = "validate"

    *   temporaryContentId string Required   The ID of a previously uploaded temporary content file 
minLength = 1

### Responses

#### 201

New template was created.

*   application/json object   

Show application/json properties 

    *   id string   The template ID 
format = "uuid"

    *   name string   Template name 
    *   type string   Template type 
Can be one of: "excel""pixelPerfect""html""powerPoint""word"

    *   ownerId string   The user that this template is scoped to. 
    *   createdAt string   The date and time when the template was created. 
format = "date-time"

    *   createdBy string   The id of the user who created the template. 
    *   updatedAt string   The date and time when the template was last updated. 
format = "date-time"

    *   updatedBy string   The id of the user who last updated the template. 
    *   description string   Template description 
    *   sourceAppId string   The id of the app that this template is using as data source. 
    *   sourceAppName string   The name of the app that this template is using as data source. 
    *   metadataVersion integer   The template metadata version 
format = int32

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string   The error code. 
        *   meta object   Additional error metadata. 
        *   title string   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 

    *   statusCode integer   
format = int32

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string   The error code. 
        *   meta object   Additional error metadata. 
        *   title string   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 

    *   statusCode integer   
format = int32

#### 404

Not Found

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string   The error code. 
        *   meta object   Additional error metadata. 
        *   title string   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 

    *   statusCode integer   
format = int32

#### 413

The template file exceeds the user's quota for maximum file to upload.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string   The error code. 
        *   meta object   Additional error metadata. 
        *   title string   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 

    *   statusCode integer   
format = int32

 POST /api/v1/report-templates

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.reportTemplates.createReportTemplate({  description:    'Sales grouped by product category',  name: 'Sales by category',  sourceAppAction: 'validate',  sourceAppId:    '78fb8e8d-bc83-4da1-b0d1-b0dc0a5c3e5b',  temporaryContentId: '69b14f2bb93332c3ff8c64b8',})
```

`qlik report-template create \  --name 'Sales by category' \  --temporaryContentId '69b14f2bb93332c3ff8c64b8'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/report-templates" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"name":"Sales by category","description":"Sales grouped by product category","sourceAppId":"78fb8e8d-bc83-4da1-b0d1-b0dc0a5c3e5b","sourceAppAction":"validate","temporaryContentId":"69b14f2bb93332c3ff8c64b8"}'`

### Example Response

`{  "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",  "name": "Sales by category",  "type": "excel",  "ownerId": "0rTsxGg_rtsZAs19Zib_421n6haydjIh",  "createdAt": "2026-01-01T12:00:00.000Z",  "createdBy": "0rTsxGg_rtsZAs19Zib_421n6htydjIh",  "updatedAt": "2026-01-01T12:00:00.000Z",  "updatedBy": "0rTsxGg_rtsZAs19Zib_421n6htydjIh",  "description": "Sales grouped by product category",  "sourceAppId": "c4c70012-29c7-47c2-820d-4ff74cb164a9",  "sourceAppName": "Qlik app",  "metadataVersion": 1}`

## [](https://qlik.dev/apis/rest/report-templates/#get-api-v1-report-templates-id)Get descriptive info for the specified report template.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Path Parameters

*   id string Required   The ID of the report template. 
format = "uuid"

### Responses

#### 200

The template was located.

*   application/json object   

Show application/json properties 

    *   id string   The template ID 
format = "uuid"

    *   name string   Template name 
    *   type string   Template type 
Can be one of: "excel""pixelPerfect""html""powerPoint""word"

    *   ownerId string   The user that this template is scoped to. 
    *   createdAt string   The date and time when the template was created. 
format = "date-time"

    *   createdBy string   The id of the user who created the template. 
    *   updatedAt string   The date and time when the template was last updated. 
format = "date-time"

    *   updatedBy string   The id of the user who last updated the template. 
    *   description string   Template description 
    *   sourceAppId string   The id of the app that this template is using as data source. 
    *   sourceAppName string   The name of the app that this template is using as data source. 
    *   metadataVersion integer   The template metadata version 
format = int32

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string   The error code. 
        *   meta object   Additional error metadata. 
        *   title string   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 

    *   statusCode integer   
format = int32

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string   The error code. 
        *   meta object   Additional error metadata. 
        *   title string   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 

    *   statusCode integer   
format = int32

#### 404

A template with the specified ID was not found.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string   The error code. 
        *   meta object   Additional error metadata. 
        *   title string   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 

    *   statusCode integer   
format = int32

 GET /api/v1/report-templates/{id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.reportTemplates.getReportTemplate(  'c35f4b70-3ce4-4a30-b62b-2aef16943bc4',)
```

`qlik report-template get 'c35f4b70-3ce4-4a30-b62b-2aef16943bc4'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/report-templates/{id}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",  "name": "Sales by category",  "type": "excel",  "ownerId": "0rTsxGg_rtsZAs19Zib_421n6haydjIh",  "createdAt": "2026-01-01T12:00:00.000Z",  "createdBy": "0rTsxGg_rtsZAs19Zib_421n6htydjIh",  "updatedAt": "2026-01-01T12:00:00.000Z",  "updatedBy": "0rTsxGg_rtsZAs19Zib_421n6htydjIh",  "description": "Sales grouped by product category",  "sourceAppId": "c4c70012-29c7-47c2-820d-4ff74cb164a9",  "sourceAppName": "Qlik app",  "metadataVersion": 1}`

## [](https://qlik.dev/apis/rest/report-templates/#patch-api-v1-report-templates-id)Patch an existing report template.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   id string Required   The ID of the report template to patch. 
format = "uuid"

### Request Body

A JSON patch request as defined by RFC 6902.

*   application/json array of objects   

Show application/json properties 

    *   op string   
    *   from string   
    *   path string   
    *   value object   

A JSON patch request as defined by RFC 6902.

*   application/json-patch+json array of objects   

Show application/json-patch+json properties 

    *   op string   
    *   from string   
    *   path string   
    *   value object   

### Responses

#### 204

Patch successfully applied to template.

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string   The error code. 
        *   meta object   Additional error metadata. 
        *   title string   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 

    *   statusCode integer   
format = int32

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string   The error code. 
        *   meta object   Additional error metadata. 
        *   title string   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 

    *   statusCode integer   
format = int32

#### 404

A template with the specified ID was not found.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string   The error code. 
        *   meta object   Additional error metadata. 
        *   title string   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 

    *   statusCode integer   
format = int32

#### 409

Conflict

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string   The error code. 
        *   meta object   Additional error metadata. 
        *   title string   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 

    *   statusCode integer   
format = int32

#### 413

The template file exceeds the user's quota for maximum file to upload.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string   The error code. 
        *   meta object   Additional error metadata. 
        *   title string   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 

    *   statusCode integer   
format = int32

 PATCH /api/v1/report-templates/{id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.reportTemplates.patchReportTemplate(  'c35f4b70-3ce4-4a30-b62b-2aef16943bc4',  [    {      from: 'string',      op: 'string',      path: 'string',      value: {},    },  ],)
```

`qlik report-template patch 'c35f4b70-3ce4-4a30-b62b-2aef16943bc4'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/report-templates/{id}" \-X PATCH \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '[{"op":"string","from":"string","path":"string","value":{}}]'`

## [](https://qlik.dev/apis/rest/report-templates/#put-api-v1-report-templates-id)Update an existing report template.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   id string Required   The ID of the report template to update. 
format = "uuid"

### Request Body

The upload request.

*   application/json object   

Show application/json properties 

    *   name string Required   Template name 
minLength = 1,  maxLength = 255

    *   description string   Template description 
maxLength = 255

    *   sourceAppAction string   Specifies the action to perform with the new source app. Use "validate" to verify that the source app of the uploaded template matches the target app. Use "replace" to migrate the uploaded template to the target app by replacing the source app id. 
Can be one of: "validate""replace"

format = "Enumeration",  default = "validate"

    *   temporaryContentId string Required   The ID of a previously uploaded temporary content file 
minLength = 1

### Responses

#### 201

The template was updated.

*   application/json object   

Show application/json properties 

    *   id string   The template ID 
format = "uuid"

    *   name string   Template name 
    *   type string   Template type 
Can be one of: "excel""pixelPerfect""html""powerPoint""word"

    *   ownerId string   The user that this template is scoped to. 
    *   createdAt string   The date and time when the template was created. 
format = "date-time"

    *   createdBy string   The id of the user who created the template. 
    *   updatedAt string   The date and time when the template was last updated. 
format = "date-time"

    *   updatedBy string   The id of the user who last updated the template. 
    *   description string   Template description 
    *   sourceAppId string   The id of the app that this template is using as data source. 
    *   sourceAppName string   The name of the app that this template is using as data source. 
    *   metadataVersion integer   The template metadata version 
format = int32

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string   The error code. 
        *   meta object   Additional error metadata. 
        *   title string   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 

    *   statusCode integer   
format = int32

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string   The error code. 
        *   meta object   Additional error metadata. 
        *   title string   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 

    *   statusCode integer   
format = int32

#### 404

A template with the specified ID was not found.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string   The error code. 
        *   meta object   Additional error metadata. 
        *   title string   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 

    *   statusCode integer   
format = int32

#### 409

Conflict

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string   The error code. 
        *   meta object   Additional error metadata. 
        *   title string   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 

    *   statusCode integer   
format = int32

#### 413

The template file exceeds the user's quota for maximum file to upload.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string   The error code. 
        *   meta object   Additional error metadata. 
        *   title string   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 

    *   statusCode integer   
format = int32

 PUT /api/v1/report-templates/{id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.reportTemplates.updateReportTemplate(  'c35f4b70-3ce4-4a30-b62b-2aef16943bc4',  {    description:      'Sales grouped by product category',    name: 'Sales by category',    sourceAppAction: 'validate',    temporaryContentId:      '69b14f2bb93332c3ff8c64b8',  },)
```

`qlik report-template update 'c35f4b70-3ce4-4a30-b62b-2aef16943bc4' \  --name 'Sales by category' \  --temporaryContentId '69b14f2bb93332c3ff8c64b8'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/report-templates/{id}" \-X PUT \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"name":"Sales by category","description":"Sales grouped by product category","sourceAppAction":"validate","temporaryContentId":"69b14f2bb93332c3ff8c64b8"}'`

### Example Response

`{  "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",  "name": "Sales by category",  "type": "excel",  "ownerId": "0rTsxGg_rtsZAs19Zib_421n6haydjIh",  "createdAt": "2026-01-01T12:00:00.000Z",  "createdBy": "0rTsxGg_rtsZAs19Zib_421n6htydjIh",  "updatedAt": "2026-01-01T12:00:00.000Z",  "updatedBy": "0rTsxGg_rtsZAs19Zib_421n6htydjIh",  "description": "Sales grouped by product category",  "sourceAppId": "c4c70012-29c7-47c2-820d-4ff74cb164a9",  "sourceAppName": "Qlik app",  "metadataVersion": 1}`

## [](https://qlik.dev/apis/rest/report-templates/#delete-api-v1-report-templates-id)Delete the specified report template.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   id string Required   The ID of the report template to delete. 
format = "uuid"

### Responses

#### 204

The template was deleted.

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string   The error code. 
        *   meta object   Additional error metadata. 
        *   title string   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 

    *   statusCode integer   
format = int32

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string   The error code. 
        *   meta object   Additional error metadata. 
        *   title string   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 

    *   statusCode integer   
format = int32

#### 404

Not Found

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string   The error code. 
        *   meta object   Additional error metadata. 
        *   title string   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 

    *   statusCode integer   
format = int32

 DELETE /api/v1/report-templates/{id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.reportTemplates.deleteReportTemplate(  'c35f4b70-3ce4-4a30-b62b-2aef16943bc4',)
```

`qlik report-template rm 'c35f4b70-3ce4-4a30-b62b-2aef16943bc4'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/report-templates/{id}" \-X DELETE \-H "Authorization: Bearer <access_token>"`

## [](https://qlik.dev/apis/rest/report-templates/#post-api-v1-report-templates-id-actions-download)Download the template file of the specified report template

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   id string Required   The ID of the report template. 
format = "uuid"

### Responses

#### 200

The template file.

*   application/octet-stream string   
format = "binary"

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string   The error code. 
        *   meta object   Additional error metadata. 
        *   title string   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 

    *   statusCode integer   
format = int32

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string   The error code. 
        *   meta object   Additional error metadata. 
        *   title string   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 

    *   statusCode integer   
format = int32

#### 404

Not Found

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string   The error code. 
        *   meta object   Additional error metadata. 
        *   title string   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 

    *   statusCode integer   
format = int32

 POST /api/v1/report-templates/{id}/actions/download

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.reportTemplates.downloadReportTemplate(  'c35f4b70-3ce4-4a30-b62b-2aef16943bc4',)
```

`qlik report-template download 'c35f4b70-3ce4-4a30-b62b-2aef16943bc4'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/report-templates/{id}/actions/download" \-X POST \-H "Authorization: Bearer <access_token>" \-o "output-file"`

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