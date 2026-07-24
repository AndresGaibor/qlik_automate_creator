---
title: "Data assets REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/data-assets/"
local_path: "docs/endpoints/data-assets.md"
---

Title: Data assets REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/data-assets/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Data assets

*   [Save new data asset.](https://qlik.dev/apis/rest/data-assets/#post-api-v1-data-assets "Save new data asset.")
*   [Batch delete data assets by IDs.](https://qlik.dev/apis/rest/data-assets/#delete-api-v1-data-assets "Batch delete data assets by IDs.")
*   [Get data asset by ID.](https://qlik.dev/apis/rest/data-assets/#get-api-v1-data-assets-data-asset-id "Get data asset by ID.")
*   [Patch data asset.](https://qlik.dev/apis/rest/data-assets/#patch-api-v1-data-assets-data-asset-id "Patch data asset.")
*   [Update data asset.](https://qlik.dev/apis/rest/data-assets/#put-api-v1-data-assets-data-asset-id "Update data asset.")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/data-assets.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Data assets

Data assets are part of the catalog in Qlik Cloud. A data asset is a member of a data store, and may contain multiple data sets.

[Download OpenAPI spec](https://qlik.dev/specs/rest/data-assets.json)

## Endpoints

*   [POST /api/v1/data-assets](https://qlik.dev/apis/rest/data-assets/#post-api-v1-data-assets)
*   [DELETE /api/v1/data-assets](https://qlik.dev/apis/rest/data-assets/#delete-api-v1-data-assets)
*   [GET /api/v1/data-assets/{data-asset-id}](https://qlik.dev/apis/rest/data-assets/#get-api-v1-data-assets-data-asset-id)
*   [PATCH /api/v1/data-assets/{data-asset-id}](https://qlik.dev/apis/rest/data-assets/#patch-api-v1-data-assets-data-asset-id)
*   [PUT /api/v1/data-assets/{data-asset-id}](https://qlik.dev/apis/rest/data-assets/#put-api-v1-data-assets-data-asset-id)

## [](https://qlik.dev/apis/rest/data-assets/#post-api-v1-data-assets)Save new data asset.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

*   application/json object   

Show application/json properties 

    *   id string   Only required when updating the resource. Must be null for new resources. 
    *   name string   
minLength = 0,  maxLength = 255

    *   tags array of strings   
uniqueItems = true

    *   appId string   
    *   appType string Required   
    *   ownerId string   The value is automatically set by the application. 
    *   spaceId string   
    *   version integer   Only required when updating the resource. Must be null for new resources. 
format = int64

    *   properties object   A Map of name-value pairs. 

Show additional optional properties 

        *   object object   A Map of name-value pairs. 

    *   description string   
minLength = 0,  maxLength = 1024

    *   dataFreshness string   The date-time when the source data was last changed 
format = "date-time"

    *   dataStoreInfo object   

Show dataStoreInfo properties 

        *   id string Required   

    *   technicalName string Required   
minLength = 1,  maxLength = 255

    *   technicalDescription string   
minLength = 0,  maxLength = 1024

### Responses

#### 201

Created new data asset successfully.

*   application/json object   

Show application/json properties 

    *   id string   Only required when updating the resource. Must be null for new resources. 
    *   name string   
minLength = 0,  maxLength = 255

    *   tags array of strings   
uniqueItems = true

    *   appId string   
    *   appType string Required   
    *   ownerId string   The value is automatically set by the application. 
    *   spaceId string   
    *   version integer   Only required when updating the resource. Must be null for new resources. 
format = int64

    *   tenantId string   The value is automatically set by the application. User defined value is ignored. 
    *   createdBy string   The value is automatically set by the application. User defined value is ignored. 
    *   properties object   A Map of name-value pairs. 

Show additional optional properties 

        *   object object   A Map of name-value pairs. 

    *   createdTime string   The value is automatically set by the application. User defined value is ignored. 
format = "date-time"

    *   description string   
minLength = 0,  maxLength = 1024

    *   dataFreshness string   The date-time when the source data was last changed 
format = "date-time"

    *   dataStoreInfo object   

Show dataStoreInfo properties 

        *   id string Required   
        *   name string   
        *   type string   

    *   technicalName string Required   
minLength = 1,  maxLength = 255

    *   lastModifiedBy string   The value is automatically set by the application. User defined value is ignored. 
    *   lastModifiedTime string   The value is automatically set by the application. User defined value is ignored. 
format = "date-time"

    *   technicalDescription string   
minLength = 0,  maxLength = 1024

#### 400

The request is in incorrect format.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 401

User does not have valid authentication credentials.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 403

User does not have access to the resource.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 404

Resource does not exist.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 409

The input request conflicts with the current state of the resource.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 500

Internal Server Error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 503

Requested service is not available.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

 POST /api/v1/data-assets

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.dataAssets.createDataAsset({  appId: 'string',  appType: 'string',  dataFreshness: '2018-10-30T07:06:22Z',  dataStoreInfo: { id: 'string' },  description: 'string',  id: 'string',  name: 'string',  ownerId: 'string',  properties: {},  spaceId: 'string',  tags: ['string'],  technicalDescription: 'string',  technicalName: 'string',  version: 42,})
```

`qlik data-asset create \  --appType 'string' \  --dataStoreInfo-id 'string' \  --technicalName 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/data-assets" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"id":"string","name":"string","tags":["string"],"appId":"string","appType":"string","ownerId":"string","spaceId":"string","version":42,"properties":{},"description":"string","dataFreshness":"2018-10-30T07:06:22Z","dataStoreInfo":{"id":"string"},"technicalName":"string","technicalDescription":"string"}'`

### Example Response

`{  "id": "string",  "name": "string",  "tags": [    "string"  ],  "appId": "string",  "appType": "string",  "ownerId": "string",  "spaceId": "string",  "version": 42,  "tenantId": "string",  "createdBy": "string",  "properties": {},  "createdTime": "2018-10-30T07:06:22Z",  "description": "string",  "dataFreshness": "2018-10-30T07:06:22Z",  "dataStoreInfo": {    "id": "string",    "name": "string",    "type": "string"  },  "technicalName": "string",  "lastModifiedBy": "string",  "lastModifiedTime": "2018-10-30T07:06:22Z",  "technicalDescription": "string"}`

## [](https://qlik.dev/apis/rest/data-assets/#delete-api-v1-data-assets)Batch delete data assets by IDs.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

*   application/json object   

Show application/json properties 

    *   ids array of strings   
uniqueItems = true

### Responses

#### 204

Deleted data asset with all child objects.

#### 400

The request is in incorrect format.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 401

User does not have valid authentication credentials.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 403

User does not have access to the resource.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 404

Resource does not exist.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 409

The input request conflicts with the current state of the resource.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 500

Internal Server Error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 503

Requested service is not available.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

 DELETE /api/v1/data-assets

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.dataAssets.deleteDataAssets({  ids: ['string'],})
```

`qlik data-asset delete-many`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/data-assets" \-X DELETE \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"ids":["string"]}'`

## [](https://qlik.dev/apis/rest/data-assets/#get-api-v1-data-assets-data-asset-id)Get data asset by ID.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Query Parameters

*   projections array of strings   Comma-separated fields to return in the response. 

### Path Parameters

*   data-asset-id string Required   

### Responses

#### 200

Successful Operation.

*   application/json object   

Show application/json properties 

    *   id string   Only required when updating the resource. Must be null for new resources. 
    *   name string   
minLength = 0,  maxLength = 255

    *   tags array of strings   
uniqueItems = true

    *   appId string   
    *   appType string Required   
    *   ownerId string   The value is automatically set by the application. 
    *   spaceId string   
    *   version integer   Only required when updating the resource. Must be null for new resources. 
format = int64

    *   tenantId string   The value is automatically set by the application. User defined value is ignored. 
    *   createdBy string   The value is automatically set by the application. User defined value is ignored. 
    *   properties object   A Map of name-value pairs. 

Show additional optional properties 

        *   object object   A Map of name-value pairs. 

    *   createdTime string   The value is automatically set by the application. User defined value is ignored. 
format = "date-time"

    *   description string   
minLength = 0,  maxLength = 1024

    *   dataFreshness string   The date-time when the source data was last changed 
format = "date-time"

    *   dataStoreInfo object   

Show dataStoreInfo properties 

        *   id string Required   
        *   name string   
        *   type string   

    *   technicalName string Required   
minLength = 1,  maxLength = 255

    *   lastModifiedBy string   The value is automatically set by the application. User defined value is ignored. 
    *   lastModifiedTime string   The value is automatically set by the application. User defined value is ignored. 
format = "date-time"

    *   technicalDescription string   
minLength = 0,  maxLength = 1024

#### 400

The request is in incorrect format.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 401

User does not have valid authentication credentials.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 403

User does not have access to the resource.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 404

Resource does not exist.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 409

The input request conflicts with the current state of the resource.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 500

Internal Server Error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 503

Requested service is not available.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

 GET /api/v1/data-assets/{data-asset-id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.dataAssets.getDataAsset('string', {})
```

`qlik data-asset get 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/data-assets/{data-asset-id}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "id": "string",  "name": "string",  "tags": [    "string"  ],  "appId": "string",  "appType": "string",  "ownerId": "string",  "spaceId": "string",  "version": 42,  "tenantId": "string",  "createdBy": "string",  "properties": {},  "createdTime": "2018-10-30T07:06:22Z",  "description": "string",  "dataFreshness": "2018-10-30T07:06:22Z",  "dataStoreInfo": {    "id": "string",    "name": "string",    "type": "string"  },  "technicalName": "string",  "lastModifiedBy": "string",  "lastModifiedTime": "2018-10-30T07:06:22Z",  "technicalDescription": "string"}`

## [](https://qlik.dev/apis/rest/data-assets/#patch-api-v1-data-assets-data-asset-id)Patch data asset.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   data-asset-id string Required   

### Request Body

Required

*   application/json array of objects   Array of JSON patch documents as defined by RFC 6902. 

Show application/json properties 

    *   op string Required   The operation to be performed. 
Can be one of: "add""remove""replace""move""copy""test"

    *   from string   A JSON Pointer path pointing to the location to move/copy from. 
    *   path string Required   A JSON pointer to the property being affected. 
    *   value object   The value to add, replace or test. 

### Responses

#### 200

Patched data asset successfully.

*   application/json object   

Show application/json properties 

    *   id string   Only required when updating the resource. Must be null for new resources. 
    *   name string   
minLength = 0,  maxLength = 255

    *   tags array of strings   
uniqueItems = true

    *   appId string   
    *   appType string Required   
    *   ownerId string   The value is automatically set by the application. 
    *   spaceId string   
    *   version integer   Only required when updating the resource. Must be null for new resources. 
format = int64

    *   tenantId string   The value is automatically set by the application. User defined value is ignored. 
    *   createdBy string   The value is automatically set by the application. User defined value is ignored. 
    *   properties object   A Map of name-value pairs. 

Show additional optional properties 

        *   object object   A Map of name-value pairs. 

    *   createdTime string   The value is automatically set by the application. User defined value is ignored. 
format = "date-time"

    *   description string   
minLength = 0,  maxLength = 1024

    *   dataFreshness string   The date-time when the source data was last changed 
format = "date-time"

    *   dataStoreInfo object   

Show dataStoreInfo properties 

        *   id string Required   
        *   name string   
        *   type string   

    *   technicalName string Required   
minLength = 1,  maxLength = 255

    *   lastModifiedBy string   The value is automatically set by the application. User defined value is ignored. 
    *   lastModifiedTime string   The value is automatically set by the application. User defined value is ignored. 
format = "date-time"

    *   technicalDescription string   
minLength = 0,  maxLength = 1024

#### 204

Patched data asset successfully.

*   application/json object   

Show application/json properties 

    *   id string   Only required when updating the resource. Must be null for new resources. 
    *   name string   
minLength = 0,  maxLength = 255

    *   tags array of strings   
uniqueItems = true

    *   appId string   
    *   appType string Required   
    *   ownerId string   The value is automatically set by the application. 
    *   spaceId string   
    *   version integer   Only required when updating the resource. Must be null for new resources. 
format = int64

    *   tenantId string   The value is automatically set by the application. User defined value is ignored. 
    *   createdBy string   The value is automatically set by the application. User defined value is ignored. 
    *   properties object   A Map of name-value pairs. 

Show additional optional properties 

        *   object object   A Map of name-value pairs. 

    *   createdTime string   The value is automatically set by the application. User defined value is ignored. 
format = "date-time"

    *   description string   
minLength = 0,  maxLength = 1024

    *   dataFreshness string   The date-time when the source data was last changed 
format = "date-time"

    *   dataStoreInfo object   

Show dataStoreInfo properties 

        *   id string Required   
        *   name string   
        *   type string   

    *   technicalName string Required   
minLength = 1,  maxLength = 255

    *   lastModifiedBy string   The value is automatically set by the application. User defined value is ignored. 
    *   lastModifiedTime string   The value is automatically set by the application. User defined value is ignored. 
format = "date-time"

    *   technicalDescription string   
minLength = 0,  maxLength = 1024

#### 400

The request is in incorrect format.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 401

User does not have valid authentication credentials.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 403

User does not have access to the resource.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 404

Resource does not exist.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 409

The input request conflicts with the current state of the resource.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 500

Internal Server Error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 503

Requested service is not available.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

 PATCH /api/v1/data-assets/{data-asset-id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.dataAssets.patchDataAsset('string', [  {    from: 'string',    op: 'add',    path: 'string',    value: {},  },])
```

`qlik data-asset patch 'string' \  --op 'add' \  --path 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/data-assets/{data-asset-id}" \-X PATCH \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '[{"op":"add","from":"string","path":"string","value":{}}]'`

### Example Response

`{  "id": "string",  "name": "string",  "tags": [    "string"  ],  "appId": "string",  "appType": "string",  "ownerId": "string",  "spaceId": "string",  "version": 42,  "tenantId": "string",  "createdBy": "string",  "properties": {},  "createdTime": "2018-10-30T07:06:22Z",  "description": "string",  "dataFreshness": "2018-10-30T07:06:22Z",  "dataStoreInfo": {    "id": "string",    "name": "string",    "type": "string"  },  "technicalName": "string",  "lastModifiedBy": "string",  "lastModifiedTime": "2018-10-30T07:06:22Z",  "technicalDescription": "string"}`

## [](https://qlik.dev/apis/rest/data-assets/#put-api-v1-data-assets-data-asset-id)Update data asset.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   data-asset-id string Required   

### Request Body

Required

*   application/json object   

Show application/json properties 

    *   id string   Only required when updating the resource. Must be null for new resources. 
    *   name string   
minLength = 0,  maxLength = 255

    *   tags array of strings   
uniqueItems = true

    *   appId string   
    *   appType string Required   
    *   ownerId string   The value is automatically set by the application. 
    *   spaceId string   
    *   version integer   Only required when updating the resource. Must be null for new resources. 
format = int64

    *   properties object   A Map of name-value pairs. 

Show additional optional properties 

        *   object object   A Map of name-value pairs. 

    *   description string   
minLength = 0,  maxLength = 1024

    *   dataFreshness string   The date-time when the source data was last changed 
format = "date-time"

    *   dataStoreInfo object   

Show dataStoreInfo properties 

        *   id string Required   

    *   technicalName string Required   
minLength = 1,  maxLength = 255

    *   technicalDescription string   
minLength = 0,  maxLength = 1024

### Responses

#### 200

Updated data asset successfully.

*   application/json object   

Show application/json properties 

    *   id string   Only required when updating the resource. Must be null for new resources. 
    *   name string   
minLength = 0,  maxLength = 255

    *   tags array of strings   
uniqueItems = true

    *   appId string   
    *   appType string Required   
    *   ownerId string   The value is automatically set by the application. 
    *   spaceId string   
    *   version integer   Only required when updating the resource. Must be null for new resources. 
format = int64

    *   tenantId string   The value is automatically set by the application. User defined value is ignored. 
    *   createdBy string   The value is automatically set by the application. User defined value is ignored. 
    *   properties object   A Map of name-value pairs. 

Show additional optional properties 

        *   object object   A Map of name-value pairs. 

    *   createdTime string   The value is automatically set by the application. User defined value is ignored. 
format = "date-time"

    *   description string   
minLength = 0,  maxLength = 1024

    *   dataFreshness string   The date-time when the source data was last changed 
format = "date-time"

    *   dataStoreInfo object   

Show dataStoreInfo properties 

        *   id string Required   
        *   name string   
        *   type string   

    *   technicalName string Required   
minLength = 1,  maxLength = 255

    *   lastModifiedBy string   The value is automatically set by the application. User defined value is ignored. 
    *   lastModifiedTime string   The value is automatically set by the application. User defined value is ignored. 
format = "date-time"

    *   technicalDescription string   
minLength = 0,  maxLength = 1024

#### 400

The request is in incorrect format.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 401

User does not have valid authentication credentials.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 403

User does not have access to the resource.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 404

Resource does not exist.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 409

The input request conflicts with the current state of the resource.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 500

Internal Server Error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 503

Requested service is not available.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

 PUT /api/v1/data-assets/{data-asset-id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.dataAssets.updateDataAsset('string', {  appId: 'string',  appType: 'string',  dataFreshness: '2018-10-30T07:06:22Z',  dataStoreInfo: { id: 'string' },  description: 'string',  id: 'string',  name: 'string',  ownerId: 'string',  properties: {},  spaceId: 'string',  tags: ['string'],  technicalDescription: 'string',  technicalName: 'string',  version: 42,})
```

`qlik data-asset update 'string' \  --appType 'string' \  --dataStoreInfo-id 'string' \  --technicalName 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/data-assets/{data-asset-id}" \-X PUT \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"id":"string","name":"string","tags":["string"],"appId":"string","appType":"string","ownerId":"string","spaceId":"string","version":42,"properties":{},"description":"string","dataFreshness":"2018-10-30T07:06:22Z","dataStoreInfo":{"id":"string"},"technicalName":"string","technicalDescription":"string"}'`

### Example Response

`{  "id": "string",  "name": "string",  "tags": [    "string"  ],  "appId": "string",  "appType": "string",  "ownerId": "string",  "spaceId": "string",  "version": 42,  "tenantId": "string",  "createdBy": "string",  "properties": {},  "createdTime": "2018-10-30T07:06:22Z",  "description": "string",  "dataFreshness": "2018-10-30T07:06:22Z",  "dataStoreInfo": {    "id": "string",    "name": "string",    "type": "string"  },  "technicalName": "string",  "lastModifiedBy": "string",  "lastModifiedTime": "2018-10-30T07:06:22Z",  "technicalDescription": "string"}`

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