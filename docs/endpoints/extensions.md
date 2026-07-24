---
title: "Extensions REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/extensions/"
local_path: "docs/endpoints/extensions.md"
---

Title: Extensions REST | Qlik Developer Portal



[Skip to content](https://qlik.dev/apis/rest/extensions/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Extensions

*   [List all extensions](https://qlik.dev/apis/rest/extensions/#get-api-v1-extensions "List all extensions")
*   [Create a new extension](https://qlik.dev/apis/rest/extensions/#post-api-v1-extensions "Create a new extension")
*   [Get a specific extension](https://qlik.dev/apis/rest/extensions/#get-api-v1-extensions-id "Get a specific extension")
*   [Update a specific extension](https://qlik.dev/apis/rest/extensions/#patch-api-v1-extensions-id "Update a specific extension")
*   [Delete a specific extension](https://qlik.dev/apis/rest/extensions/#delete-api-v1-extensions-id "Delete a specific extension")
*   [Download extension as an archive](https://qlik.dev/apis/rest/extensions/#get-api-v1-extensions-id-file "Download extension as an archive")
*   [Download file from extension archive.](https://qlik.dev/apis/rest/extensions/#get-api-v1-extensions-id-file-filepath "Download file from extension archive.")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/extensions.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Extensions

Visualization extensions is a capability in Qlik Sense which allows third-party visualizations and other presentation objects to be used in the Qlik Sense client.

[Download OpenAPI spec](https://qlik.dev/specs/rest/extensions.json)

## Endpoints

*   [GET /api/v1/extensions](https://qlik.dev/apis/rest/extensions/#get-api-v1-extensions)
*   [POST /api/v1/extensions](https://qlik.dev/apis/rest/extensions/#post-api-v1-extensions)
*   [GET /api/v1/extensions/{id}](https://qlik.dev/apis/rest/extensions/#get-api-v1-extensions-id)
*   [PATCH /api/v1/extensions/{id}](https://qlik.dev/apis/rest/extensions/#patch-api-v1-extensions-id)
*   [DELETE /api/v1/extensions/{id}](https://qlik.dev/apis/rest/extensions/#delete-api-v1-extensions-id)
*   [GET /api/v1/extensions/{id}/file](https://qlik.dev/apis/rest/extensions/#get-api-v1-extensions-id-file)
*   [GET /api/v1/extensions/{id}/file/{filepath}](https://qlik.dev/apis/rest/extensions/#get-api-v1-extensions-id-file-filepath)

## [](https://qlik.dev/apis/rest/extensions/#get-api-v1-extensions)List all extensions

Lists all imported extensions in the tenant.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Responses

#### 200

OK. Lists all extensions.

*   application/json object   

Show application/json properties 

    *   data array of objects Required   The extension model. 

Show data properties 

        *   id string   
        *   file object   The file that was uploaded with the extension. 
        *   icon string   Icon to show in the client. 
        *   name string   The display name of this extension. 
        *   tags array of strings   List of tags. 
        *   type string   The type of this extension (visualization, etc.). 
        *   author string   Author of the extension. 
        *   bundle object   Object containing meta data regarding the bundle the extension belongs to. If it does not belong to a bundle, this object is not defined. 

Show bundle properties 

            *   id string   Unique identifier of the bundle. 
            *   name string   Name of the bundle. 
            *   description string   Description of the bundle. 

        *   userId string   
        *   bundled boolean   If the extension is part of an extension bundle. 
        *   license string   Under which license this extension is published. 
        *   preview string   Path to an image that enables users to preview the extension. 
        *   version string   Version of the extension. 
        *   checksum string   Checksum of the extension contents. 
        *   homepage string   Home page of the extension. 
        *   keywords string   Keywords for the extension. 
        *   loadpath string   Relative path to the extension's entry file, defaults to `filename` from the qext file. 
        *   supplier string   Supplier of the extension. 
        *   tenantId string   
        *   updateAt string   
format = "date"

        *   createdAt string   
format = "date"

        *   supernova boolean   If the extension is a supernova extension or not. 
        *   deprecated string   A date noting when the extension was deprecated. 
format = "date"

        *   repository string   Link to the extension source code. 
        *   description string   Description of the extension. 
        *   qextVersion string   The version from the qext file that was uploaded with this extension. 
        *   dependencies object   Map of dependencies describing version of the component it requires. 
        *   qextFilename string   The name of the qext file that was uploaded with this extension. 
        *   migrationState string   The migration state of the extension. It can be either "READY_TO_MOVE", "IN_PROGRESS" or "COMPLETED". 

 GET /api/v1/extensions

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.extensions.getExtensions()
```

`qlik extension ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/extensions" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "data": [    {      "id": "string",      "file": {},      "icon": "string",      "name": "string",      "tags": [        "string"      ],      "type": "string",      "author": "string",      "bundle": {        "id": "string",        "name": "string",        "description": "string"      },      "userId": "string",      "bundled": true,      "license": "string",      "preview": "string",      "version": "string",      "checksum": "string",      "homepage": "string",      "keywords": "string",      "loadpath": "string",      "supplier": "string",      "tenantId": "string",      "updateAt": "string",      "createdAt": "string",      "supernova": true,      "deprecated": "string",      "repository": "string",      "description": "string",      "qextVersion": "string",      "dependencies": {},      "qextFilename": "string",      "migrationState": "string"    }  ]}`

## [](https://qlik.dev/apis/rest/extensions/#post-api-v1-extensions)Create a new extension

Creates a new extension. Accepts either provided file or data object. The name of the new extension must be different to any existing extensions.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

*   multipart/form-data object   

Show multipart/form-data properties 

    *   data object   The extension model. 

Show data properties 

        *   file object   The file that was uploaded with the extension. 
        *   icon string   Icon to show in the client. 
        *   name string   The display name of this extension. 
        *   tags array of strings   List of tags. 
        *   type string   The type of this extension (visualization, etc.). 
        *   author string   Author of the extension. 
        *   bundle object   Object containing meta data regarding the bundle the extension belongs to. If it does not belong to a bundle, this object is not defined. 

Show bundle properties 

            *   id string   Unique identifier of the bundle. 
            *   name string   Name of the bundle. 
            *   description string   Description of the bundle. 

        *   bundled boolean   If the extension is part of an extension bundle. 
        *   license string   Under which license this extension is published. 
        *   preview string   Path to an image that enables users to preview the extension. 
        *   version string   Version of the extension. 
        *   checksum string   Checksum of the extension contents. 
        *   homepage string   Home page of the extension. 
        *   keywords string   Keywords for the extension. 
        *   loadpath string   Relative path to the extension's entry file, defaults to `filename` from the qext file. 
        *   supplier string   Supplier of the extension. 
        *   supernova boolean   If the extension is a supernova extension or not. 
        *   deprecated string   A date noting when the extension was deprecated. 
format = "date"

        *   repository string   Link to the extension source code. 
        *   description string   Description of the extension. 
        *   qextVersion string   The version from the qext file that was uploaded with this extension. 
        *   dependencies object   Map of dependencies describing version of the component it requires. 
        *   qextFilename string   The name of the qext file that was uploaded with this extension. 

    *   file string   Extension archive. 
format = "binary"

### Responses

#### 201

Created. Creates a new extension and returns it.

*   application/json object   The extension model. 

Show application/json properties 

    *   id string   
    *   file object   The file that was uploaded with the extension. 
    *   icon string   Icon to show in the client. 
    *   name string   The display name of this extension. 
    *   tags array of strings   List of tags. 
    *   type string   The type of this extension (visualization, etc.). 
    *   author string   Author of the extension. 
    *   bundle object   Object containing meta data regarding the bundle the extension belongs to. If it does not belong to a bundle, this object is not defined. 

Show bundle properties 

        *   id string   Unique identifier of the bundle. 
        *   name string   Name of the bundle. 
        *   description string   Description of the bundle. 

    *   userId string   
    *   bundled boolean   If the extension is part of an extension bundle. 
    *   license string   Under which license this extension is published. 
    *   preview string   Path to an image that enables users to preview the extension. 
    *   version string   Version of the extension. 
    *   checksum string   Checksum of the extension contents. 
    *   homepage string   Home page of the extension. 
    *   keywords string   Keywords for the extension. 
    *   loadpath string   Relative path to the extension's entry file, defaults to `filename` from the qext file. 
    *   supplier string   Supplier of the extension. 
    *   tenantId string   
    *   updateAt string   
format = "date"

    *   createdAt string   
format = "date"

    *   supernova boolean   If the extension is a supernova extension or not. 
    *   deprecated string   A date noting when the extension was deprecated. 
format = "date"

    *   repository string   Link to the extension source code. 
    *   description string   Description of the extension. 
    *   qextVersion string   The version from the qext file that was uploaded with this extension. 
    *   dependencies object   Map of dependencies describing version of the component it requires. 
    *   qextFilename string   The name of the qext file that was uploaded with this extension. 
    *   migrationState string   The migration state of the extension. It can be either "READY_TO_MOVE", "IN_PROGRESS" or "COMPLETED". 

#### 409

Conflict. Resource with same unique identity already exists.

*   application/json object   An error object. 

Show application/json properties 

    *   meta object   Object containing meta data regarding an error. It does not necessarily contain all the properties. 

Show meta properties 

        *   stack string   Full stack trace of the error that was raised. 
        *   message string   A more detailed message explaining the error. 
        *   resourceName string   Name of the resource related to the error. If there is a conflict, it is the name of the model attempting to be created. 

    *   title string Required   Title of the HTTP status code. 
    *   source object   Optional JSON patch object pointing to an invalid property. 
    *   status number   The HTTP status code. 
    *   traceId string   The active traceId. 

#### 415

Unsupported media type. Body of the payload is not a valid JSON object.

*   application/json object   An error object. 

Show application/json properties 

    *   meta object   Object containing meta data regarding an error. It does not necessarily contain all the properties. 

Show meta properties 

        *   stack string   Full stack trace of the error that was raised. 
        *   message string   A more detailed message explaining the error. 
        *   resourceName string   Name of the resource related to the error. If there is a conflict, it is the name of the model attempting to be created. 

    *   title string Required   Title of the HTTP status code. 
    *   source object   Optional JSON patch object pointing to an invalid property. 
    *   status number   The HTTP status code. 
    *   traceId string   The active traceId. 

#### 422

Unprocessable entity. Validation error.

*   application/json object   An error object. 

Show application/json properties 

    *   meta object   Object containing meta data regarding an error. It does not necessarily contain all the properties. 

Show meta properties 

        *   stack string   Full stack trace of the error that was raised. 
        *   message string   A more detailed message explaining the error. 
        *   resourceName string   Name of the resource related to the error. If there is a conflict, it is the name of the model attempting to be created. 

    *   title string Required   Title of the HTTP status code. 
    *   source object   Optional JSON patch object pointing to an invalid property. 
    *   status number   The HTTP status code. 
    *   traceId string   The active traceId. 

#### default

Unexpected error.

*   application/json object   An error object. 

Show application/json properties 

    *   meta object   Object containing meta data regarding an error. It does not necessarily contain all the properties. 

Show meta properties 

        *   stack string   Full stack trace of the error that was raised. 
        *   message string   A more detailed message explaining the error. 
        *   resourceName string   Name of the resource related to the error. If there is a conflict, it is the name of the model attempting to be created. 

    *   title string Required   Title of the HTTP status code. 
    *   source object   Optional JSON patch object pointing to an invalid property. 
    *   status number   The HTTP status code. 
    *   traceId string   The active traceId. 

 POST /api/v1/extensions

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'import { readFileSync } from 'node:fs'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.extensions.uploadExtension({  data: {    author: 'string',    bundle: {      description: 'string',      id: 'string',      name: 'string',    },    bundled: true,    checksum: 'string',    dependencies: {},    deprecated: 'string',    description: 'string',    file: {},    homepage: 'string',    icon: 'string',    keywords: 'string',    license: 'string',    loadpath: 'string',    name: 'string',    preview: 'string',    qextFilename: 'string',    qextVersion: 'string',    repository: 'string',    supernova: true,    supplier: 'string',    tags: ['string'],    type: 'string',    version: 'string',  },  file: new Uint8Array(    readFileSync('<file-path>'),  ),})
```

`qlik extension create`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/extensions" \-X POST \-H "Content-type: multipart/form-data" \-H "Authorization: Bearer <access_token>" \-F "data={\"id\":\"string\",\"file\":{},\"icon\":\"string\",\"name\":\"string\",\"tags\":[\"string\"],\"type\":\"string\",\"author\":\"string\",\"bundle\":{\"id\":\"string\",\"name\":\"string\",\"description\":\"string\"},\"userId\":\"string\",\"bundled\":true,\"license\":\"string\",\"preview\":\"string\",\"version\":\"string\",\"checksum\":\"string\",\"homepage\":\"string\",\"keywords\":\"string\",\"loadpath\":\"string\",\"supplier\":\"string\",\"tenantId\":\"string\",\"updateAt\":\"string\",\"createdAt\":\"string\",\"supernova\":true,\"deprecated\":\"string\",\"repository\":\"string\",\"description\":\"string\",\"qextVersion\":\"string\",\"dependencies\":{},\"qextFilename\":\"string\",\"migrationState\":\"string\"}" \-F "file=@/path/to/file"`

### Example Response

`{  "id": "string",  "file": {},  "icon": "string",  "name": "string",  "tags": [    "string"  ],  "type": "string",  "author": "string",  "bundle": {    "id": "string",    "name": "string",    "description": "string"  },  "userId": "string",  "bundled": true,  "license": "string",  "preview": "string",  "version": "string",  "checksum": "string",  "homepage": "string",  "keywords": "string",  "loadpath": "string",  "supplier": "string",  "tenantId": "string",  "updateAt": "string",  "createdAt": "string",  "supernova": true,  "deprecated": "string",  "repository": "string",  "description": "string",  "qextVersion": "string",  "dependencies": {},  "qextFilename": "string",  "migrationState": "string"}`

## [](https://qlik.dev/apis/rest/extensions/#get-api-v1-extensions-id)Get a specific extension

Returns a specific extension matching either extension ID or extension name.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Path Parameters

*   id string Required   Extension identifier or its qextFilename. 

### Responses

#### 200

OK. Returns extension with {id}.

*   application/json object   The extension model. 

Show application/json properties 

    *   id string   
    *   file object   The file that was uploaded with the extension. 
    *   icon string   Icon to show in the client. 
    *   name string   The display name of this extension. 
    *   tags array of strings   List of tags. 
    *   type string   The type of this extension (visualization, etc.). 
    *   author string   Author of the extension. 
    *   bundle object   Object containing meta data regarding the bundle the extension belongs to. If it does not belong to a bundle, this object is not defined. 

Show bundle properties 

        *   id string   Unique identifier of the bundle. 
        *   name string   Name of the bundle. 
        *   description string   Description of the bundle. 

    *   userId string   
    *   bundled boolean   If the extension is part of an extension bundle. 
    *   license string   Under which license this extension is published. 
    *   preview string   Path to an image that enables users to preview the extension. 
    *   version string   Version of the extension. 
    *   checksum string   Checksum of the extension contents. 
    *   homepage string   Home page of the extension. 
    *   keywords string   Keywords for the extension. 
    *   loadpath string   Relative path to the extension's entry file, defaults to `filename` from the qext file. 
    *   supplier string   Supplier of the extension. 
    *   tenantId string   
    *   updateAt string   
format = "date"

    *   createdAt string   
format = "date"

    *   supernova boolean   If the extension is a supernova extension or not. 
    *   deprecated string   A date noting when the extension was deprecated. 
format = "date"

    *   repository string   Link to the extension source code. 
    *   description string   Description of the extension. 
    *   qextVersion string   The version from the qext file that was uploaded with this extension. 
    *   dependencies object   Map of dependencies describing version of the component it requires. 
    *   qextFilename string   The name of the qext file that was uploaded with this extension. 
    *   migrationState string   The migration state of the extension. It can be either "READY_TO_MOVE", "IN_PROGRESS" or "COMPLETED". 

#### 403

Forbidden. User is not authorized to read extension with {id}.

*   application/json object   An error object. 

Show application/json properties 

    *   meta object   Object containing meta data regarding an error. It does not necessarily contain all the properties. 

Show meta properties 

        *   stack string   Full stack trace of the error that was raised. 
        *   message string   A more detailed message explaining the error. 
        *   resourceName string   Name of the resource related to the error. If there is a conflict, it is the name of the model attempting to be created. 

    *   title string Required   Title of the HTTP status code. 
    *   source object   Optional JSON patch object pointing to an invalid property. 
    *   status number   The HTTP status code. 
    *   traceId string   The active traceId. 

#### 404

Not found. Could not find the extension with {id}.

*   application/json object   An error object. 

Show application/json properties 

    *   meta object   Object containing meta data regarding an error. It does not necessarily contain all the properties. 

Show meta properties 

        *   stack string   Full stack trace of the error that was raised. 
        *   message string   A more detailed message explaining the error. 
        *   resourceName string   Name of the resource related to the error. If there is a conflict, it is the name of the model attempting to be created. 

    *   title string Required   Title of the HTTP status code. 
    *   source object   Optional JSON patch object pointing to an invalid property. 
    *   status number   The HTTP status code. 
    *   traceId string   The active traceId. 

#### 410

Gone. Extension with {id} has been deleted.

*   application/json object   An error object. 

Show application/json properties 

    *   meta object   Object containing meta data regarding an error. It does not necessarily contain all the properties. 

Show meta properties 

        *   stack string   Full stack trace of the error that was raised. 
        *   message string   A more detailed message explaining the error. 
        *   resourceName string   Name of the resource related to the error. If there is a conflict, it is the name of the model attempting to be created. 

    *   title string Required   Title of the HTTP status code. 
    *   source object   Optional JSON patch object pointing to an invalid property. 
    *   status number   The HTTP status code. 
    *   traceId string   The active traceId. 

 GET /api/v1/extensions/{id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.extensions.getExtension('string')
```

`qlik extension get 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/extensions/{id}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "id": "string",  "file": {},  "icon": "string",  "name": "string",  "tags": [    "string"  ],  "type": "string",  "author": "string",  "bundle": {    "id": "string",    "name": "string",    "description": "string"  },  "userId": "string",  "bundled": true,  "license": "string",  "preview": "string",  "version": "string",  "checksum": "string",  "homepage": "string",  "keywords": "string",  "loadpath": "string",  "supplier": "string",  "tenantId": "string",  "updateAt": "string",  "createdAt": "string",  "supernova": true,  "deprecated": "string",  "repository": "string",  "description": "string",  "qextVersion": "string",  "dependencies": {},  "qextFilename": "string",  "migrationState": "string"}`

## [](https://qlik.dev/apis/rest/extensions/#patch-api-v1-extensions-id)Update a specific extension

Updates a specific extension matching either extension ID or extension name. Accepts either provided file or data object.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   id string Required   Extension identifier or its qextFilename. 

### Request Body

Required

*   multipart/form-data object   

Show multipart/form-data properties 

    *   data object   The extension model. 

Show data properties 

        *   file object   The file that was uploaded with the extension. 
        *   icon string   Icon to show in the client. 
        *   name string   The display name of this extension. 
        *   tags array of strings   List of tags. 
        *   type string   The type of this extension (visualization, etc.). 
        *   author string   Author of the extension. 
        *   bundle object   Object containing meta data regarding the bundle the extension belongs to. If it does not belong to a bundle, this object is not defined. 

Show bundle properties 

            *   id string   Unique identifier of the bundle. 
            *   name string   Name of the bundle. 
            *   description string   Description of the bundle. 

        *   bundled boolean   If the extension is part of an extension bundle. 
        *   license string   Under which license this extension is published. 
        *   preview string   Path to an image that enables users to preview the extension. 
        *   version string   Version of the extension. 
        *   checksum string   Checksum of the extension contents. 
        *   homepage string   Home page of the extension. 
        *   keywords string   Keywords for the extension. 
        *   loadpath string   Relative path to the extension's entry file, defaults to `filename` from the qext file. 
        *   supplier string   Supplier of the extension. 
        *   supernova boolean   If the extension is a supernova extension or not. 
        *   deprecated string   A date noting when the extension was deprecated. 
format = "date"

        *   repository string   Link to the extension source code. 
        *   description string   Description of the extension. 
        *   qextVersion string   The version from the qext file that was uploaded with this extension. 
        *   dependencies object   Map of dependencies describing version of the component it requires. 
        *   qextFilename string   The name of the qext file that was uploaded with this extension. 

    *   file string   Extension archive. 
format = "binary"

### Responses

#### 200

OK. Extension has been updated.

*   application/json object   The extension model. 

Show application/json properties 

    *   id string   
    *   file object   The file that was uploaded with the extension. 
    *   icon string   Icon to show in the client. 
    *   name string   The display name of this extension. 
    *   tags array of strings   List of tags. 
    *   type string   The type of this extension (visualization, etc.). 
    *   author string   Author of the extension. 
    *   bundle object   Object containing meta data regarding the bundle the extension belongs to. If it does not belong to a bundle, this object is not defined. 

Show bundle properties 

        *   id string   Unique identifier of the bundle. 
        *   name string   Name of the bundle. 
        *   description string   Description of the bundle. 

    *   userId string   
    *   bundled boolean   If the extension is part of an extension bundle. 
    *   license string   Under which license this extension is published. 
    *   preview string   Path to an image that enables users to preview the extension. 
    *   version string   Version of the extension. 
    *   checksum string   Checksum of the extension contents. 
    *   homepage string   Home page of the extension. 
    *   keywords string   Keywords for the extension. 
    *   loadpath string   Relative path to the extension's entry file, defaults to `filename` from the qext file. 
    *   supplier string   Supplier of the extension. 
    *   tenantId string   
    *   updateAt string   
format = "date"

    *   createdAt string   
format = "date"

    *   supernova boolean   If the extension is a supernova extension or not. 
    *   deprecated string   A date noting when the extension was deprecated. 
format = "date"

    *   repository string   Link to the extension source code. 
    *   description string   Description of the extension. 
    *   qextVersion string   The version from the qext file that was uploaded with this extension. 
    *   dependencies object   Map of dependencies describing version of the component it requires. 
    *   qextFilename string   The name of the qext file that was uploaded with this extension. 
    *   migrationState string   The migration state of the extension. It can be either "READY_TO_MOVE", "IN_PROGRESS" or "COMPLETED". 

#### 403

Forbidden. User is not authorized to update extension with {id}.

*   application/json object   An error object. 

Show application/json properties 

    *   meta object   Object containing meta data regarding an error. It does not necessarily contain all the properties. 

Show meta properties 

        *   stack string   Full stack trace of the error that was raised. 
        *   message string   A more detailed message explaining the error. 
        *   resourceName string   Name of the resource related to the error. If there is a conflict, it is the name of the model attempting to be created. 

    *   title string Required   Title of the HTTP status code. 
    *   source object   Optional JSON patch object pointing to an invalid property. 
    *   status number   The HTTP status code. 
    *   traceId string   The active traceId. 

#### 404

Not found. Could not find the extension with {id}.

*   application/json object   An error object. 

Show application/json properties 

    *   meta object   Object containing meta data regarding an error. It does not necessarily contain all the properties. 

Show meta properties 

        *   stack string   Full stack trace of the error that was raised. 
        *   message string   A more detailed message explaining the error. 
        *   resourceName string   Name of the resource related to the error. If there is a conflict, it is the name of the model attempting to be created. 

    *   title string Required   Title of the HTTP status code. 
    *   source object   Optional JSON patch object pointing to an invalid property. 
    *   status number   The HTTP status code. 
    *   traceId string   The active traceId. 

#### 409

Conflict. Resource with same unique identity already exists.

*   application/json object   An error object. 

Show application/json properties 

    *   meta object   Object containing meta data regarding an error. It does not necessarily contain all the properties. 

Show meta properties 

        *   stack string   Full stack trace of the error that was raised. 
        *   message string   A more detailed message explaining the error. 
        *   resourceName string   Name of the resource related to the error. If there is a conflict, it is the name of the model attempting to be created. 

    *   title string Required   Title of the HTTP status code. 
    *   source object   Optional JSON patch object pointing to an invalid property. 
    *   status number   The HTTP status code. 
    *   traceId string   The active traceId. 

#### 415

Unsupported media type. Body of the payload is not a valid JSON object.

*   application/json object   An error object. 

Show application/json properties 

    *   meta object   Object containing meta data regarding an error. It does not necessarily contain all the properties. 

Show meta properties 

        *   stack string   Full stack trace of the error that was raised. 
        *   message string   A more detailed message explaining the error. 
        *   resourceName string   Name of the resource related to the error. If there is a conflict, it is the name of the model attempting to be created. 

    *   title string Required   Title of the HTTP status code. 
    *   source object   Optional JSON patch object pointing to an invalid property. 
    *   status number   The HTTP status code. 
    *   traceId string   The active traceId. 

#### 422

Unprocessable entity. Validation error.

*   application/json object   An error object. 

Show application/json properties 

    *   meta object   Object containing meta data regarding an error. It does not necessarily contain all the properties. 

Show meta properties 

        *   stack string   Full stack trace of the error that was raised. 
        *   message string   A more detailed message explaining the error. 
        *   resourceName string   Name of the resource related to the error. If there is a conflict, it is the name of the model attempting to be created. 

    *   title string Required   Title of the HTTP status code. 
    *   source object   Optional JSON patch object pointing to an invalid property. 
    *   status number   The HTTP status code. 
    *   traceId string   The active traceId. 

#### default

Unexpected error.

*   application/json object   An error object. 

Show application/json properties 

    *   meta object   Object containing meta data regarding an error. It does not necessarily contain all the properties. 

Show meta properties 

        *   stack string   Full stack trace of the error that was raised. 
        *   message string   A more detailed message explaining the error. 
        *   resourceName string   Name of the resource related to the error. If there is a conflict, it is the name of the model attempting to be created. 

    *   title string Required   Title of the HTTP status code. 
    *   source object   Optional JSON patch object pointing to an invalid property. 
    *   status number   The HTTP status code. 
    *   traceId string   The active traceId. 

 PATCH /api/v1/extensions/{id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'import { readFileSync } from 'node:fs'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.extensions.patchExtension('string', {  data: {    author: 'string',    bundle: {      description: 'string',      id: 'string',      name: 'string',    },    bundled: true,    checksum: 'string',    dependencies: {},    deprecated: 'string',    description: 'string',    file: {},    homepage: 'string',    icon: 'string',    keywords: 'string',    license: 'string',    loadpath: 'string',    name: 'string',    preview: 'string',    qextFilename: 'string',    qextVersion: 'string',    repository: 'string',    supernova: true,    supplier: 'string',    tags: ['string'],    type: 'string',    version: 'string',  },  file: new Uint8Array(    readFileSync('<file-path>'),  ),})
```

`qlik extension patch 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/extensions/{id}" \-X PATCH \-H "Content-type: multipart/form-data" \-H "Authorization: Bearer <access_token>" \-F "data={\"id\":\"string\",\"file\":{},\"icon\":\"string\",\"name\":\"string\",\"tags\":[\"string\"],\"type\":\"string\",\"author\":\"string\",\"bundle\":{\"id\":\"string\",\"name\":\"string\",\"description\":\"string\"},\"userId\":\"string\",\"bundled\":true,\"license\":\"string\",\"preview\":\"string\",\"version\":\"string\",\"checksum\":\"string\",\"homepage\":\"string\",\"keywords\":\"string\",\"loadpath\":\"string\",\"supplier\":\"string\",\"tenantId\":\"string\",\"updateAt\":\"string\",\"createdAt\":\"string\",\"supernova\":true,\"deprecated\":\"string\",\"repository\":\"string\",\"description\":\"string\",\"qextVersion\":\"string\",\"dependencies\":{},\"qextFilename\":\"string\",\"migrationState\":\"string\"}" \-F "file=@/path/to/file"`

### Example Response

`{  "id": "string",  "file": {},  "icon": "string",  "name": "string",  "tags": [    "string"  ],  "type": "string",  "author": "string",  "bundle": {    "id": "string",    "name": "string",    "description": "string"  },  "userId": "string",  "bundled": true,  "license": "string",  "preview": "string",  "version": "string",  "checksum": "string",  "homepage": "string",  "keywords": "string",  "loadpath": "string",  "supplier": "string",  "tenantId": "string",  "updateAt": "string",  "createdAt": "string",  "supernova": true,  "deprecated": "string",  "repository": "string",  "description": "string",  "qextVersion": "string",  "dependencies": {},  "qextFilename": "string",  "migrationState": "string"}`

## [](https://qlik.dev/apis/rest/extensions/#delete-api-v1-extensions-id)Delete a specific extension

Deletes a specific extension matching either extension ID or extension name.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   id string Required   Extension identifier or its qextFilename. 

### Responses

#### 204

No content. Soft deletes the extension.

#### 403

Forbidden. User is not authorized to delete extension with {id}.

*   application/json object   An error object. 

Show application/json properties 

    *   meta object   Object containing meta data regarding an error. It does not necessarily contain all the properties. 

Show meta properties 

        *   stack string   Full stack trace of the error that was raised. 
        *   message string   A more detailed message explaining the error. 
        *   resourceName string   Name of the resource related to the error. If there is a conflict, it is the name of the model attempting to be created. 

    *   title string Required   Title of the HTTP status code. 
    *   source object   Optional JSON patch object pointing to an invalid property. 
    *   status number   The HTTP status code. 
    *   traceId string   The active traceId. 

#### 404

Not found. Could not find the extension with {id}.

*   application/json object   An error object. 

Show application/json properties 

    *   meta object   Object containing meta data regarding an error. It does not necessarily contain all the properties. 

Show meta properties 

        *   stack string   Full stack trace of the error that was raised. 
        *   message string   A more detailed message explaining the error. 
        *   resourceName string   Name of the resource related to the error. If there is a conflict, it is the name of the model attempting to be created. 

    *   title string Required   Title of the HTTP status code. 
    *   source object   Optional JSON patch object pointing to an invalid property. 
    *   status number   The HTTP status code. 
    *   traceId string   The active traceId. 

#### 410

Gone. Extension with {id} has been deleted.

*   application/json object   An error object. 

Show application/json properties 

    *   meta object   Object containing meta data regarding an error. It does not necessarily contain all the properties. 

Show meta properties 

        *   stack string   Full stack trace of the error that was raised. 
        *   message string   A more detailed message explaining the error. 
        *   resourceName string   Name of the resource related to the error. If there is a conflict, it is the name of the model attempting to be created. 

    *   title string Required   Title of the HTTP status code. 
    *   source object   Optional JSON patch object pointing to an invalid property. 
    *   status number   The HTTP status code. 
    *   traceId string   The active traceId. 

 DELETE /api/v1/extensions/{id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.extensions.deleteExtension('string')
```

`qlik extension rm 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/extensions/{id}" \-X DELETE \-H "Authorization: Bearer <access_token>"`

## [](https://qlik.dev/apis/rest/extensions/#get-api-v1-extensions-id-file)Download extension as an archive

Downloads all files in the extension matching either extension ID or extension name as a `.zip` archive.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Path Parameters

*   id string Required   Extension identifier or its qextFilename. 

### Responses

#### 200

OK. Extension exists. Returns the extension archive.

*   application/zip string   
format = "binary"

#### 200

OK. Extension exists. Returns the extension archive.

*   application/octet-stream string   
format = "binary"

#### 403

Forbidden. User is not authorized to read extension with {id}.

*   application/json object   An error object. 

Show application/json properties 

    *   meta object   Object containing meta data regarding an error. It does not necessarily contain all the properties. 

Show meta properties 

        *   stack string   Full stack trace of the error that was raised. 
        *   message string   A more detailed message explaining the error. 
        *   resourceName string   Name of the resource related to the error. If there is a conflict, it is the name of the model attempting to be created. 

    *   title string Required   Title of the HTTP status code. 
    *   source object   Optional JSON patch object pointing to an invalid property. 
    *   status number   The HTTP status code. 
    *   traceId string   The active traceId. 

#### 404

Not found. Could not find the extension with {id}.

*   application/json object   An error object. 

Show application/json properties 

    *   meta object   Object containing meta data regarding an error. It does not necessarily contain all the properties. 

Show meta properties 

        *   stack string   Full stack trace of the error that was raised. 
        *   message string   A more detailed message explaining the error. 
        *   resourceName string   Name of the resource related to the error. If there is a conflict, it is the name of the model attempting to be created. 

    *   title string Required   Title of the HTTP status code. 
    *   source object   Optional JSON patch object pointing to an invalid property. 
    *   status number   The HTTP status code. 
    *   traceId string   The active traceId. 

#### 410

Gone. Extension with {id} has been deleted.

*   application/json object   An error object. 

Show application/json properties 

    *   meta object   Object containing meta data regarding an error. It does not necessarily contain all the properties. 

Show meta properties 

        *   stack string   Full stack trace of the error that was raised. 
        *   message string   A more detailed message explaining the error. 
        *   resourceName string   Name of the resource related to the error. If there is a conflict, it is the name of the model attempting to be created. 

    *   title string Required   Title of the HTTP status code. 
    *   source object   Optional JSON patch object pointing to an invalid property. 
    *   status number   The HTTP status code. 
    *   traceId string   The active traceId. 

 GET /api/v1/extensions/{id}/file

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.extensions.downloadExtension('string')
```

`qlik extension file ls \  --extensionId 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/extensions/{id}/file" \-H "Authorization: Bearer <access_token>"`

### Example Response

`"string"`

## [](https://qlik.dev/apis/rest/extensions/#get-api-v1-extensions-id-file-filepath)Download file from extension archive.

Downloads a specific file from the extension matching either extension ID or extension name, identified by the file path within the imported extension.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Path Parameters

*   filepath string Required   Path to the file location within the specified extension archive. Folders separated with forward slashes. 
*   id string Required   Extension identifier or its qextFilename. 

### Responses

#### 200

OK. Extension exists and the file specified exists. Returns the specific file.

#### 403

Forbidden. User is not authorized to read extension with {id}.

*   application/json object   An error object. 

Show application/json properties 

    *   meta object   Object containing meta data regarding an error. It does not necessarily contain all the properties. 

Show meta properties 

        *   stack string   Full stack trace of the error that was raised. 
        *   message string   A more detailed message explaining the error. 
        *   resourceName string   Name of the resource related to the error. If there is a conflict, it is the name of the model attempting to be created. 

    *   title string Required   Title of the HTTP status code. 
    *   source object   Optional JSON patch object pointing to an invalid property. 
    *   status number   The HTTP status code. 
    *   traceId string   The active traceId. 

#### 404

Not found. Could not find the extension with {id} or the file does not exist in the archive.

*   application/json object   An error object. 

Show application/json properties 

    *   meta object   Object containing meta data regarding an error. It does not necessarily contain all the properties. 

Show meta properties 

        *   stack string   Full stack trace of the error that was raised. 
        *   message string   A more detailed message explaining the error. 
        *   resourceName string   Name of the resource related to the error. If there is a conflict, it is the name of the model attempting to be created. 

    *   title string Required   Title of the HTTP status code. 
    *   source object   Optional JSON patch object pointing to an invalid property. 
    *   status number   The HTTP status code. 
    *   traceId string   The active traceId. 

#### 410

Gone. Extension with {id} has been deleted.

*   application/json object   An error object. 

Show application/json properties 

    *   meta object   Object containing meta data regarding an error. It does not necessarily contain all the properties. 

Show meta properties 

        *   stack string   Full stack trace of the error that was raised. 
        *   message string   A more detailed message explaining the error. 
        *   resourceName string   Name of the resource related to the error. If there is a conflict, it is the name of the model attempting to be created. 

    *   title string Required   Title of the HTTP status code. 
    *   source object   Optional JSON patch object pointing to an invalid property. 
    *   status number   The HTTP status code. 
    *   traceId string   The active traceId. 

 GET /api/v1/extensions/{id}/file/{filepath}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.extensions.downloadFileFromExtension(  'string',  'css/styles.css',)
```

`qlik extension file get 'css/styles.css' \  --extensionId 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/extensions/{id}/file/{filepath}" \-H "Authorization: Bearer <access_token>"`

Was this page helpful?
*   yes 
*   no 

![Image 2: Qlik logo](https://qlik.dev/logo-footer.svg)

[Qlik Community](https://community.qlik.com/)

[](https://join.slack.com/t/qlikdeveloper/shared_invite/zt-3wrdlkhog-Dcq9LuCbjNQVN2XaPlgGqQ)[](https://www.facebook.com/qlik)[](https://www.linkedin.com/company/qlik)[](https://x.com/qlikdeveloper)

[Legal Agreements](https://www.qlik.com/us/legal/legal-agreements) / [Legal Policies](https://www.qlik.com/us/legal/legal-policies) / [Privacy & Cookie Notice](https://www.qlik.com/us/legal/privacy-and-cookie-notice) / [Terms of Use](https://qlik.dev/qlik-developer-portal-terms-of-use.pdf) / Do Not Share My Info

 Copyright © 1993-2026 QlikTech International AB. All rights reserved.