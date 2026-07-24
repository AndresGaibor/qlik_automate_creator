---
title: "Tenant settings REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/tenant-settings/"
local_path: "docs/endpoints/tenant-settings.md"
---

Title: Tenant settings REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/tenant-settings/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Tenant settings

*   [Get tenant settings](https://qlik.dev/apis/rest/tenant-settings/#get-api-v1-tenant-settings "Get tenant settings")
*   [Create tenant settings](https://qlik.dev/apis/rest/tenant-settings/#post-api-v1-tenant-settings "Create tenant settings")
*   [Update tenant settings](https://qlik.dev/apis/rest/tenant-settings/#patch-api-v1-tenant-settings "Update tenant settings")
*   [Delete tenant settings](https://qlik.dev/apis/rest/tenant-settings/#delete-api-v1-tenant-settings "Delete tenant settings")
*   [Toggle cross-region data processing](https://qlik.dev/apis/rest/tenant-settings/#post-api-v1-tenant-settings-actions-toggle-cross-region-data-processing "Toggle cross-region data processing") D 
*   [Toggle cross-region inference](https://qlik.dev/apis/rest/tenant-settings/#post-api-v1-tenant-settings-actions-toggle-cross-region-inference "Toggle cross-region inference")
*   [Get start pages](https://qlik.dev/apis/rest/tenant-settings/#get-api-v1-tenant-settings-start-pages "Get start pages")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/tenant-settings.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Tenant settings

[Download OpenAPI spec](https://qlik.dev/specs/rest/tenant-settings.json)

The Tenant Settings API provides access to tenant-wide configuration options for security policies, user interface customization, and operational preferences that affect all users in your tenant.

## Endpoints

*   [GET /api/v1/tenant-settings](https://qlik.dev/apis/rest/tenant-settings/#get-api-v1-tenant-settings)
*   [POST /api/v1/tenant-settings](https://qlik.dev/apis/rest/tenant-settings/#post-api-v1-tenant-settings)
*   [PATCH /api/v1/tenant-settings](https://qlik.dev/apis/rest/tenant-settings/#patch-api-v1-tenant-settings)
*   [DELETE /api/v1/tenant-settings](https://qlik.dev/apis/rest/tenant-settings/#delete-api-v1-tenant-settings)
*   [POST /api/v1/tenant-settings/actions/toggle-cross-region-data-processing](https://qlik.dev/apis/rest/tenant-settings/#post-api-v1-tenant-settings-actions-toggle-cross-region-data-processing)
*   [POST /api/v1/tenant-settings/actions/toggle-cross-region-inference](https://qlik.dev/apis/rest/tenant-settings/#post-api-v1-tenant-settings-actions-toggle-cross-region-inference)
*   [GET /api/v1/tenant-settings/start-pages](https://qlik.dev/apis/rest/tenant-settings/#get-api-v1-tenant-settings-start-pages)

## [](https://qlik.dev/apis/rest/tenant-settings/#get-api-v1-tenant-settings)Get tenant settings

Retrieves tenant settings associated with the tenant ID specified in JWT. This is access controlled by the permission admin.tenant-settings:read.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Responses

#### 200

Tenant settings retrieval was successful.

*   application/json object   

Show application/json properties 

    *   id string Required   
format = "uid"

    *   tenantId string Required   
format = "uid"

    *   createdAt string Required   
format = "date-time"

    *   createdBy string Required   userId of the user who created the settings 
    *   updatedAt string Required   
format = "date-time"

    *   updatedBy string   userId of the user who last modified the settings 
    *   releaseCadence string   Set the release cadence 
Can be one of: "monthly""continuous"

    *   customizeNoAccess object   

Show customizeNoAccess properties 

        *   linkUrl string   
format = "uri"

        *   message string   
        *   linkLabel string   
        *   linkEnabled boolean Required   

    *   preferredStartPage object   

One of:
        *   StartPageConfigHub object   

Show StartPageConfigHub properties 

            *   route string   
Can be one of: "/insights"

            *   value string   
Can be one of: "analytics-hub"

        *   StartPageConfigCreationHub object   

Show StartPageConfigCreationHub properties 

            *   route string   
Can be one of: "/analytics"

            *   value string   
Can be one of: "analytics-creation-hub"

        *   StartPageConfigQdi object   

Show StartPageConfigQdi properties 

            *   route string   
Can be one of: "/qdi"

            *   value string   
Can be one of: "data-integration-hub"

        *   StartPageConfigConsole object   

Show StartPageConfigConsole properties 

            *   route string   
Can be one of: "/console"

            *   value string   
Can be one of: "management-console"

    *   crossRegionDataProcessing boolean   Set to true to enable cross-region inference, false to disable. 

#### default

Error response.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code integer   Error code. 
        *   title string   Error cause. 

 GET /api/v1/tenant-settings

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `GET /api/v1/tenant-settings` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/v1/tenant-settings',  {    method: 'GET',    headers: {      'Content-Type': 'application/json',    },  },)
```

`qlik tenant-settings ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/tenant-settings" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "createdAt": "2024-01-01T00:00:00.000Z",  "createdBy": "string",  "updatedAt": "2024-01-01T00:00:00.000Z",  "updatedBy": "string",  "releaseCadence": "monthly",  "customizeNoAccess": {    "linkUrl": "string",    "message": "string",    "linkLabel": "string",    "linkEnabled": true  },  "preferredStartPage": {    "route": "/insights",    "value": "analytics-hub"  },  "crossRegionDataProcessing": true}`

## [](https://qlik.dev/apis/rest/tenant-settings/#post-api-v1-tenant-settings)Create tenant settings

Creates a new tenant settings entry for the tenant ID specified in the JWT. This is access controlled by the permission admin.tenant-settings:create.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

*   application/json object   Create a new tenant settings entry for the tenant ID specified in the JWT. At least one of preferredStartPage or customizeNoAccess must be provided. 

Show application/json properties 

    *   customizeNoAccess object   

Show customizeNoAccess properties 

        *   linkUrl string   
format = "uri"

        *   message string   
        *   linkLabel string   
        *   linkEnabled boolean Required   

    *   preferredStartPage string   
Can be one of: "analytics-hub""data-integration-hub""management-console"

### Responses

#### 201

The tenant settings have been successfully created.

*   application/json object   

Show application/json properties 

    *   id string Required   
format = "uid"

    *   tenantId string Required   
format = "uid"

    *   createdAt string Required   
format = "date-time"

    *   createdBy string Required   userId of the user who created the settings 
    *   updatedAt string Required   
format = "date-time"

    *   updatedBy string   userId of the user who last modified the settings 
    *   releaseCadence string   Set the release cadence 
Can be one of: "monthly""continuous"

    *   customizeNoAccess object   

Show customizeNoAccess properties 

        *   linkUrl string   
format = "uri"

        *   message string   
        *   linkLabel string   
        *   linkEnabled boolean Required   

    *   preferredStartPage object   

One of:
        *   StartPageConfigHub object   

Show StartPageConfigHub properties 

            *   route string   
Can be one of: "/insights"

            *   value string   
Can be one of: "analytics-hub"

        *   StartPageConfigCreationHub object   

Show StartPageConfigCreationHub properties 

            *   route string   
Can be one of: "/analytics"

            *   value string   
Can be one of: "analytics-creation-hub"

        *   StartPageConfigQdi object   

Show StartPageConfigQdi properties 

            *   route string   
Can be one of: "/qdi"

            *   value string   
Can be one of: "data-integration-hub"

        *   StartPageConfigConsole object   

Show StartPageConfigConsole properties 

            *   route string   
Can be one of: "/console"

            *   value string   
Can be one of: "management-console"

    *   crossRegionDataProcessing boolean   Set to true to enable cross-region inference, false to disable. 

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status integer   

    *   traceId string   

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status integer   

    *   traceId string   

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status integer   

    *   traceId string   

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status integer   

    *   traceId string   

#### default

Error response.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code integer   Error code. 
        *   title string   Error cause. 

 POST /api/v1/tenant-settings

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `POST /api/v1/tenant-settings` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/v1/tenant-settings',  {    method: 'POST',    headers: {      'Content-Type': 'application/json',    },    body: JSON.stringify({      customizeNoAccess: {        linkUrl: 'string',        message: 'string',        linkLabel: 'string',        linkEnabled: true,      },      preferredStartPage: 'analytics-hub',    }),  },)
```

`qlik tenant-settings create \  --customizeNoAccess-linkEnabled true`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/tenant-settings" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"customizeNoAccess":{"linkUrl":"string","message":"string","linkLabel":"string","linkEnabled":true},"preferredStartPage":"analytics-hub"}'`

### Example Response

`{  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "createdAt": "2024-01-01T00:00:00.000Z",  "createdBy": "string",  "updatedAt": "2024-01-01T00:00:00.000Z",  "updatedBy": "string",  "releaseCadence": "monthly",  "customizeNoAccess": {    "linkUrl": "string",    "message": "string",    "linkLabel": "string",    "linkEnabled": true  },  "preferredStartPage": {    "route": "/insights",    "value": "analytics-hub"  },  "crossRegionDataProcessing": true}`

## [](https://qlik.dev/apis/rest/tenant-settings/#patch-api-v1-tenant-settings)Update tenant settings

Updates existing tenant settings. This is access controlled by the permission admin.tenant-settings:update.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

*   application/json array of objects   

One of:
    *   JSONPatchRequestAddReplaceTest object   

Show JSONPatchRequestAddReplaceTest properties 

        *   op string Required   The operation to perform. 
Can be one of: "add""replace""test"

        *   path string Required   A JSON Pointer path. 
        *   value any Required   The value to add, replace or test. 

    *   JSONPatchRequestRemove object   

Show JSONPatchRequestRemove properties 

        *   op string Required   The operation to perform. 
Can be one of: "remove"

        *   path string Required   A JSON Pointer path. 

    *   JSONPatchRequestMoveCopy object   

Show JSONPatchRequestMoveCopy properties 

        *   op string Required   The operation to perform. 
Can be one of: "move""copy"

        *   from string Required   A JSON Pointer path. 
        *   path string Required   A JSON Pointer path. 

### Responses

#### 200

The tenant settings have been successfully updated.

*   application/json object   

Show application/json properties 

    *   id string Required   
format = "uid"

    *   tenantId string Required   
format = "uid"

    *   createdAt string Required   
format = "date-time"

    *   createdBy string Required   userId of the user who created the settings 
    *   updatedAt string Required   
format = "date-time"

    *   updatedBy string   userId of the user who last modified the settings 
    *   releaseCadence string   Set the release cadence 
Can be one of: "monthly""continuous"

    *   customizeNoAccess object   

Show customizeNoAccess properties 

        *   linkUrl string   
format = "uri"

        *   message string   
        *   linkLabel string   
        *   linkEnabled boolean Required   

    *   preferredStartPage object   

One of:
        *   StartPageConfigHub object   

Show StartPageConfigHub properties 

            *   route string   
Can be one of: "/insights"

            *   value string   
Can be one of: "analytics-hub"

        *   StartPageConfigCreationHub object   

Show StartPageConfigCreationHub properties 

            *   route string   
Can be one of: "/analytics"

            *   value string   
Can be one of: "analytics-creation-hub"

        *   StartPageConfigQdi object   

Show StartPageConfigQdi properties 

            *   route string   
Can be one of: "/qdi"

            *   value string   
Can be one of: "data-integration-hub"

        *   StartPageConfigConsole object   

Show StartPageConfigConsole properties 

            *   route string   
Can be one of: "/console"

            *   value string   
Can be one of: "management-console"

    *   crossRegionDataProcessing boolean   Set to true to enable cross-region inference, false to disable. 

#### 404

Tenant settings for this tenant do not exist.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code integer   Error code. 
        *   title string   Error cause. 

#### default

Error response.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code integer   Error code. 
        *   title string   Error cause. 

 PATCH /api/v1/tenant-settings

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `PATCH /api/v1/tenant-settings` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/v1/tenant-settings',  {    method: 'PATCH',    headers: {      'Content-Type': 'application/json',    },    body: JSON.stringify([      { op: 'add', path: 'string' },    ]),  },)
```

`qlik tenant-settings patch \  --value  \  --from ''`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/tenant-settings" \-X PATCH \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '[{"op":"add","path":"string"}]'`

### Example Response

`{  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "createdAt": "2024-01-01T00:00:00.000Z",  "createdBy": "string",  "updatedAt": "2024-01-01T00:00:00.000Z",  "updatedBy": "string",  "releaseCadence": "monthly",  "customizeNoAccess": {    "linkUrl": "string",    "message": "string",    "linkLabel": "string",    "linkEnabled": true  },  "preferredStartPage": {    "route": "/insights",    "value": "analytics-hub"  },  "crossRegionDataProcessing": true}`

## [](https://qlik.dev/apis/rest/tenant-settings/#delete-api-v1-tenant-settings)Delete tenant settings

Deletes the tenant settings associated with the tenant ID specified in JWT. This is access controlled by the permission admin.tenant-settings:delete.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Responses

#### 204

The tenant settings have been successfully deleted.

#### 404

Tenant settings for tenant ID do not exist.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code integer   Error code. 
        *   title string   Error cause. 

#### default

Error response.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code integer   Error code. 
        *   title string   Error cause. 

 DELETE /api/v1/tenant-settings

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `DELETE /api/v1/tenant-settings` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/v1/tenant-settings',  {    method: 'DELETE',    headers: {      'Content-Type': 'application/json',    },  },)
```

`qlik tenant-settings delete-many`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/tenant-settings" \-X DELETE \-H "Authorization: Bearer <access_token>"`

## [](https://qlik.dev/apis/rest/tenant-settings/#post-api-v1-tenant-settings-actions-toggle-cross-region-data-processing)Toggle cross-region data processing

Deprecated

Replacement available

For new integrations, and when updating your existing integrations, use:

*   `POST v1/tenant-settings/actions/toggle-cross-region-inference`

Sets the cross region inference setting for the tenant. Creates tenant settings if none exist, or updates existing settings. This is access controlled by the permission `admin.tenant-settings:update`. When cross-region processing is required, you must include an additional header `x-qlik-consent-verified: true` in your API requests to confirm that you have the authority to enable this feature and accept the associated terms.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)
Deprecated This endpoint is deprecated and will eventually be removed. Read our API policy [here](https://qlik.dev/apis/api-policy/).
Deprecated sunset 2026-05
Deprecated description Use `/tenant-settings/actions/toggle-cross-region-inference` instead. This endpoint uses outdated terminology.
Replaced by*   [POST v1/tenant-settings/actions/toggle-cross-region-inference](https://qlik.dev/apis/rest/tenant-settings/#post-api-v1-tenant-settings-actions-toggle-cross-region-inference)

### Request Body

Required

*   application/json object   Set to true to enable cross-region inference, false to disable. Defaults to false. 

Show application/json properties 

    *   value boolean Required   Set to true to enable cross-region inference, false to disable. 

### Responses

#### 200

The cross region inference setting has been successfully updated.

*   application/json object   

Show application/json properties 

    *   id string Required   
format = "uid"

    *   tenantId string Required   
format = "uid"

    *   createdAt string Required   
format = "date-time"

    *   createdBy string Required   userId of the user who created the settings 
    *   updatedAt string Required   
format = "date-time"

    *   updatedBy string   userId of the user who last modified the settings 
    *   releaseCadence string   Set the release cadence 
Can be one of: "monthly""continuous"

    *   customizeNoAccess object   

Show customizeNoAccess properties 

        *   linkUrl string   
format = "uri"

        *   message string   
        *   linkLabel string   
        *   linkEnabled boolean Required   

    *   preferredStartPage object   

One of:
        *   StartPageConfigHub object   

Show StartPageConfigHub properties 

            *   route string   
Can be one of: "/insights"

            *   value string   
Can be one of: "analytics-hub"

        *   StartPageConfigCreationHub object   

Show StartPageConfigCreationHub properties 

            *   route string   
Can be one of: "/analytics"

            *   value string   
Can be one of: "analytics-creation-hub"

        *   StartPageConfigQdi object   

Show StartPageConfigQdi properties 

            *   route string   
Can be one of: "/qdi"

            *   value string   
Can be one of: "data-integration-hub"

        *   StartPageConfigConsole object   

Show StartPageConfigConsole properties 

            *   route string   
Can be one of: "/console"

            *   value string   
Can be one of: "management-console"

    *   crossRegionDataProcessing boolean   Set to true to enable cross-region inference, false to disable. 

#### 400

Bad Request. The request is incorrect.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code integer   Error code. 
        *   title string   Error cause. 

#### 401

Unauthorized. The user is not authorized to access the service.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code integer   Error code. 
        *   title string   Error cause. 

#### 403

Forbidden. You don't have sufficient permissions to access this resource.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code integer   Error code. 
        *   title string   Error cause. 

#### default

Error response.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code integer   Error code. 
        *   title string   Error cause. 

 POST /api/v1/tenant-settings/actions/toggle-cross-region-data-processing

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `POST /api/v1/tenant-settings/actions/toggle-cross-region-data-processing` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/v1/tenant-settings/actions/toggle-cross-region-data-processing',  {    method: 'POST',    headers: {      'Content-Type': 'application/json',    },    body: JSON.stringify({ value: true }),  },)
```

`# qlik-cli has not implemented support for POST /api/v1/tenant-settings/actions/toggle-cross-region-data-processing yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/tenant-settings/actions/toggle-cross-region-data-processing" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"value":true}'`

### Example Response

`{  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "createdAt": "2024-01-01T00:00:00.000Z",  "createdBy": "string",  "updatedAt": "2024-01-01T00:00:00.000Z",  "updatedBy": "string",  "releaseCadence": "monthly",  "customizeNoAccess": {    "linkUrl": "string",    "message": "string",    "linkLabel": "string",    "linkEnabled": true  },  "preferredStartPage": {    "route": "/insights",    "value": "analytics-hub"  },  "crossRegionDataProcessing": true}`

## [](https://qlik.dev/apis/rest/tenant-settings/#post-api-v1-tenant-settings-actions-toggle-cross-region-inference)Toggle cross-region inference

Sets the cross-region inference setting for the tenant. Creates tenant settings if none exist, or updates existing settings. This is access controlled by the permission `admin.tenant-settings:update`. When cross-region inference is required, you must include an additional header `x-qlik-consent-verified: true` in your API requests to confirm that you have the authority to enable this feature and accept the associated terms.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)
Replaces*   [POST v1/tenant-settings/actions/toggle-cross-region-data-processing](https://qlik.dev/apis/rest/tenant-settings/#post-api-v1-tenant-settings-actions-toggle-cross-region-data-processing)

### Request Body

Required

*   application/json object   Set to true to enable cross-region inference, false to disable. Defaults to false. 

Show application/json properties 

    *   value boolean Required   Set to true to enable cross-region inference, false to disable. 

### Responses

#### 200

The cross region inference setting has been successfully updated.

*   application/json object   

Show application/json properties 

    *   id string Required   
format = "uid"

    *   tenantId string Required   
format = "uid"

    *   createdAt string Required   
format = "date-time"

    *   createdBy string Required   userId of the user who created the settings 
    *   updatedAt string Required   
format = "date-time"

    *   updatedBy string   userId of the user who last modified the settings 
    *   releaseCadence string   Set the release cadence 
Can be one of: "monthly""continuous"

    *   customizeNoAccess object   

Show customizeNoAccess properties 

        *   linkUrl string   
format = "uri"

        *   message string   
        *   linkLabel string   
        *   linkEnabled boolean Required   

    *   preferredStartPage object   

One of:
        *   StartPageConfigHub object   

Show StartPageConfigHub properties 

            *   route string   
Can be one of: "/insights"

            *   value string   
Can be one of: "analytics-hub"

        *   StartPageConfigCreationHub object   

Show StartPageConfigCreationHub properties 

            *   route string   
Can be one of: "/analytics"

            *   value string   
Can be one of: "analytics-creation-hub"

        *   StartPageConfigQdi object   

Show StartPageConfigQdi properties 

            *   route string   
Can be one of: "/qdi"

            *   value string   
Can be one of: "data-integration-hub"

        *   StartPageConfigConsole object   

Show StartPageConfigConsole properties 

            *   route string   
Can be one of: "/console"

            *   value string   
Can be one of: "management-console"

    *   crossRegionDataProcessing boolean   Set to true to enable cross-region inference, false to disable. 

#### 400

Bad Request. The request is incorrect.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code integer   Error code. 
        *   title string   Error cause. 

#### 401

Unauthorized. The user is not authorized to access the service.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code integer   Error code. 
        *   title string   Error cause. 

#### 403

Forbidden. You don't have sufficient permissions to access this resource.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code integer   Error code. 
        *   title string   Error cause. 

#### default

Error response.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code integer   Error code. 
        *   title string   Error cause. 

 POST /api/v1/tenant-settings/actions/toggle-cross-region-inference

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `POST /api/v1/tenant-settings/actions/toggle-cross-region-inference` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/v1/tenant-settings/actions/toggle-cross-region-inference',  {    method: 'POST',    headers: {      'Content-Type': 'application/json',    },    body: JSON.stringify({ value: true }),  },)
```

`qlik tenant-settings toggle-cross-region-inference \  --value true`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/tenant-settings/actions/toggle-cross-region-inference" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"value":true}'`

### Example Response

`{  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "createdAt": "2024-01-01T00:00:00.000Z",  "createdBy": "string",  "updatedAt": "2024-01-01T00:00:00.000Z",  "updatedBy": "string",  "releaseCadence": "monthly",  "customizeNoAccess": {    "linkUrl": "string",    "message": "string",    "linkLabel": "string",    "linkEnabled": true  },  "preferredStartPage": {    "route": "/insights",    "value": "analytics-hub"  },  "crossRegionDataProcessing": true}`

## [](https://qlik.dev/apis/rest/tenant-settings/#get-api-v1-tenant-settings-start-pages)Get start pages

Retrieves start pages for the tenant settings.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Responses

#### 200

Tenant settings start pages retrieval was successful.

*   application/json object   

Show application/json properties 

    *   values array of objects Required   

Any of:
        *   StartPageConfigHub object   

Show StartPageConfigHub properties 

            *   route string   
Can be one of: "/insights"

            *   value string   
Can be one of: "analytics-hub"

        *   StartPageConfigCreationHub object   

Show StartPageConfigCreationHub properties 

            *   route string   
Can be one of: "/analytics"

            *   value string   
Can be one of: "analytics-creation-hub"

        *   StartPageConfigQdi object   

Show StartPageConfigQdi properties 

            *   route string   
Can be one of: "/qdi"

            *   value string   
Can be one of: "data-integration-hub"

    *   defaultValue string Required   
Can be one of: "analytics-hub"

#### default

Error response.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code integer   Error code. 
        *   title string   Error cause. 

 GET /api/v1/tenant-settings/start-pages

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `GET /api/v1/tenant-settings/start-pages` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/v1/tenant-settings/start-pages',  {    method: 'GET',    headers: {      'Content-Type': 'application/json',    },  },)
```

`qlik tenant-settings start-page ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/tenant-settings/start-pages" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "values": [    {      "route": "/insights",      "value": "analytics-hub"    }  ],  "defaultValue": "analytics-hub"}`

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