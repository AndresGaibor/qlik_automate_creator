---
title: "Themes REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/themes/"
local_path: "docs/endpoints/themes.md"
---

Title: Themes REST | Qlik Developer Portal



[Skip to content](https://qlik.dev/apis/rest/themes/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Themes

*   [List all themes](https://qlik.dev/apis/rest/themes/#get-api-v1-themes "List all themes")
*   [Create a new theme](https://qlik.dev/apis/rest/themes/#post-api-v1-themes "Create a new theme")
*   [Return specific theme](https://qlik.dev/apis/rest/themes/#get-api-v1-themes-id "Return specific theme")
*   [Update a specific theme](https://qlik.dev/apis/rest/themes/#patch-api-v1-themes-id "Update a specific theme")
*   [Delete specific theme](https://qlik.dev/apis/rest/themes/#delete-api-v1-themes-id "Delete specific theme")
*   [Download theme as an archive](https://qlik.dev/apis/rest/themes/#get-api-v1-themes-id-file "Download theme as an archive")
*   [Download file from theme archive](https://qlik.dev/apis/rest/themes/#get-api-v1-themes-id-file-filepath "Download file from theme archive")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/themes.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Themes

Themes enable you to customize/style the Qlik Sense client experience.

[Download OpenAPI spec](https://qlik.dev/specs/rest/themes.json)

## Endpoints

*   [GET /api/v1/themes](https://qlik.dev/apis/rest/themes/#get-api-v1-themes)
*   [POST /api/v1/themes](https://qlik.dev/apis/rest/themes/#post-api-v1-themes)
*   [GET /api/v1/themes/{id}](https://qlik.dev/apis/rest/themes/#get-api-v1-themes-id)
*   [PATCH /api/v1/themes/{id}](https://qlik.dev/apis/rest/themes/#patch-api-v1-themes-id)
*   [DELETE /api/v1/themes/{id}](https://qlik.dev/apis/rest/themes/#delete-api-v1-themes-id)
*   [GET /api/v1/themes/{id}/file](https://qlik.dev/apis/rest/themes/#get-api-v1-themes-id-file)
*   [GET /api/v1/themes/{id}/file/{filepath}](https://qlik.dev/apis/rest/themes/#get-api-v1-themes-id-file-filepath)

## [](https://qlik.dev/apis/rest/themes/#get-api-v1-themes)List all themes

Lists all imported themes in the tenant.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Responses

#### 200

OK. Lists all themes.

*   application/json object   

Show application/json properties 

    *   data array of objects Required   The theme model. 

Show data properties 

        *   id string   
        *   file object   The file that was uploaded with the theme. 
        *   icon string   Icon to show in the client. 
        *   name string   The display name of this theme. 
        *   tags array of strings   List of tags. 
        *   type string   The type of this theme (visualization, etc.). 
        *   author string   Author of the theme. 
        *   userId string   
        *   license string   Under which license this theme is published. 
        *   version string   Version of the theme. 
        *   homepage string   Home page of the theme. 
        *   keywords string   Keywords for the theme. 
        *   supplier string   Supplier of the theme. 
        *   tenantId string   
        *   updateAt string   
format = "date"

        *   createdAt string   
format = "date"

        *   repository string   Link to the theme source code. 
        *   description string   Description of the theme. 
        *   qextVersion string   The version from the qext file that was uploaded with this extension. 
        *   dependencies object   Map of dependencies describing version of the component it requires. 
        *   qextFilename string   The name of the qext file that was uploaded with this theme. 
        *   migrationState string   The migration state of the theme. It can be either "READY_TO_MOVE", "IN_PROGRESS" or "COMPLETED". 

 GET /api/v1/themes

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.themes.getThemes()
```

`qlik theme ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/themes" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "data": [    {      "id": "string",      "file": {},      "icon": "string",      "name": "string",      "tags": [        "string"      ],      "type": "string",      "author": "string",      "userId": "string",      "license": "string",      "version": "string",      "homepage": "string",      "keywords": "string",      "supplier": "string",      "tenantId": "string",      "updateAt": "string",      "createdAt": "string",      "repository": "string",      "description": "string",      "qextVersion": "string",      "dependencies": {},      "qextFilename": "string",      "migrationState": "string"    }  ]}`

## [](https://qlik.dev/apis/rest/themes/#post-api-v1-themes)Create a new theme

Creates a new theme. Accepts either provided file or data object. The name of the new theme must be different to any existing themes.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

*   multipart/form-data object   

Show multipart/form-data properties 

    *   data object   The theme model. 

Show data properties 

        *   file object   The file that was uploaded with the theme. 
        *   icon string   Icon to show in the client. 
        *   name string   The display name of this theme. 
        *   tags array of strings   List of tags. 
        *   type string   The type of this theme (visualization, etc.). 
        *   author string   Author of the theme. 
        *   license string   Under which license this theme is published. 
        *   version string   Version of the theme. 
        *   homepage string   Home page of the theme. 
        *   keywords string   Keywords for the theme. 
        *   supplier string   Supplier of the theme. 
        *   repository string   Link to the theme source code. 
        *   description string   Description of the theme. 
        *   qextVersion string   The version from the qext file that was uploaded with this extension. 
        *   dependencies object   Map of dependencies describing version of the component it requires. 
        *   qextFilename string   The name of the qext file that was uploaded with this theme. 

    *   file string   Theme archive. 
format = "binary"

### Responses

#### 201

Created. Creates a new theme and returns it.

*   application/json object   The theme model. 

Show application/json properties 

    *   id string   
    *   file object   The file that was uploaded with the theme. 
    *   icon string   Icon to show in the client. 
    *   name string   The display name of this theme. 
    *   tags array of strings   List of tags. 
    *   type string   The type of this theme (visualization, etc.). 
    *   author string   Author of the theme. 
    *   userId string   
    *   license string   Under which license this theme is published. 
    *   version string   Version of the theme. 
    *   homepage string   Home page of the theme. 
    *   keywords string   Keywords for the theme. 
    *   supplier string   Supplier of the theme. 
    *   tenantId string   
    *   updateAt string   
format = "date"

    *   createdAt string   
format = "date"

    *   repository string   Link to the theme source code. 
    *   description string   Description of the theme. 
    *   qextVersion string   The version from the qext file that was uploaded with this extension. 
    *   dependencies object   Map of dependencies describing version of the component it requires. 
    *   qextFilename string   The name of the qext file that was uploaded with this theme. 
    *   migrationState string   The migration state of the theme. It can be either "READY_TO_MOVE", "IN_PROGRESS" or "COMPLETED". 

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

 POST /api/v1/themes

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'import { readFileSync } from 'node:fs'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.themes.uploadTheme({  data: {    author: 'string',    dependencies: {},    description: 'string',    file: {},    homepage: 'string',    icon: 'string',    keywords: 'string',    license: 'string',    name: 'string',    qextFilename: 'string',    qextVersion: 'string',    repository: 'string',    supplier: 'string',    tags: ['string'],    type: 'string',    version: 'string',  },  file: new Uint8Array(    readFileSync('<file-path>'),  ),})
```

`qlik theme create`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/themes" \-X POST \-H "Content-type: multipart/form-data" \-H "Authorization: Bearer <access_token>" \-F "data={\"id\":\"string\",\"file\":{},\"icon\":\"string\",\"name\":\"string\",\"tags\":[\"string\"],\"type\":\"string\",\"author\":\"string\",\"userId\":\"string\",\"license\":\"string\",\"version\":\"string\",\"homepage\":\"string\",\"keywords\":\"string\",\"supplier\":\"string\",\"tenantId\":\"string\",\"updateAt\":\"string\",\"createdAt\":\"string\",\"repository\":\"string\",\"description\":\"string\",\"qextVersion\":\"string\",\"dependencies\":{},\"qextFilename\":\"string\",\"migrationState\":\"string\"}" \-F "file=@/path/to/file"`

### Example Response

`{  "id": "string",  "file": {},  "icon": "string",  "name": "string",  "tags": [    "string"  ],  "type": "string",  "author": "string",  "userId": "string",  "license": "string",  "version": "string",  "homepage": "string",  "keywords": "string",  "supplier": "string",  "tenantId": "string",  "updateAt": "string",  "createdAt": "string",  "repository": "string",  "description": "string",  "qextVersion": "string",  "dependencies": {},  "qextFilename": "string",  "migrationState": "string"}`

## [](https://qlik.dev/apis/rest/themes/#get-api-v1-themes-id)Return specific theme

Returns a specific theme matching either theme ID or theme name.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Path Parameters

*   id string Required   Theme identifier or its qextFilename 

### Responses

#### 200

OK. Returns theme with {id}.

*   application/json object   The theme model. 

Show application/json properties 

    *   id string   
    *   file object   The file that was uploaded with the theme. 
    *   icon string   Icon to show in the client. 
    *   name string   The display name of this theme. 
    *   tags array of strings   List of tags. 
    *   type string   The type of this theme (visualization, etc.). 
    *   author string   Author of the theme. 
    *   userId string   
    *   license string   Under which license this theme is published. 
    *   version string   Version of the theme. 
    *   homepage string   Home page of the theme. 
    *   keywords string   Keywords for the theme. 
    *   supplier string   Supplier of the theme. 
    *   tenantId string   
    *   updateAt string   
format = "date"

    *   createdAt string   
format = "date"

    *   repository string   Link to the theme source code. 
    *   description string   Description of the theme. 
    *   qextVersion string   The version from the qext file that was uploaded with this extension. 
    *   dependencies object   Map of dependencies describing version of the component it requires. 
    *   qextFilename string   The name of the qext file that was uploaded with this theme. 
    *   migrationState string   The migration state of the theme. It can be either "READY_TO_MOVE", "IN_PROGRESS" or "COMPLETED". 

#### 403

Forbidden. User is not authorized to read theme with {id}.

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

Not found. Could not find the theme with {id}.

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

Gone. Theme with {id} has been deleted.

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

 GET /api/v1/themes/{id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.themes.getTheme('string')
```

`qlik theme get 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/themes/{id}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "id": "string",  "file": {},  "icon": "string",  "name": "string",  "tags": [    "string"  ],  "type": "string",  "author": "string",  "userId": "string",  "license": "string",  "version": "string",  "homepage": "string",  "keywords": "string",  "supplier": "string",  "tenantId": "string",  "updateAt": "string",  "createdAt": "string",  "repository": "string",  "description": "string",  "qextVersion": "string",  "dependencies": {},  "qextFilename": "string",  "migrationState": "string"}`

## [](https://qlik.dev/apis/rest/themes/#patch-api-v1-themes-id)Update a specific theme

Updates a specific theme matching either theme ID or theme name. Accepts either provided file or data object.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   id string Required   Theme identifier or its qextFilename. 

### Request Body

Required

*   multipart/form-data object   

Show multipart/form-data properties 

    *   data object   The theme model. 

Show data properties 

        *   file object   The file that was uploaded with the theme. 
        *   icon string   Icon to show in the client. 
        *   name string   The display name of this theme. 
        *   tags array of strings   List of tags. 
        *   type string   The type of this theme (visualization, etc.). 
        *   author string   Author of the theme. 
        *   license string   Under which license this theme is published. 
        *   version string   Version of the theme. 
        *   homepage string   Home page of the theme. 
        *   keywords string   Keywords for the theme. 
        *   supplier string   Supplier of the theme. 
        *   repository string   Link to the theme source code. 
        *   description string   Description of the theme. 
        *   qextVersion string   The version from the qext file that was uploaded with this extension. 
        *   dependencies object   Map of dependencies describing version of the component it requires. 
        *   qextFilename string   The name of the qext file that was uploaded with this theme. 

    *   file string   Theme archive. 
format = "binary"

### Responses

#### 200

OK. Theme has been updated.

*   application/json object   

Show application/json properties 

    *   data array of objects Required   The theme model. 

Show data properties 

        *   id string   
        *   file object   The file that was uploaded with the theme. 
        *   icon string   Icon to show in the client. 
        *   name string   The display name of this theme. 
        *   tags array of strings   List of tags. 
        *   type string   The type of this theme (visualization, etc.). 
        *   author string   Author of the theme. 
        *   userId string   
        *   license string   Under which license this theme is published. 
        *   version string   Version of the theme. 
        *   homepage string   Home page of the theme. 
        *   keywords string   Keywords for the theme. 
        *   supplier string   Supplier of the theme. 
        *   tenantId string   
        *   updateAt string   
format = "date"

        *   createdAt string   
format = "date"

        *   repository string   Link to the theme source code. 
        *   description string   Description of the theme. 
        *   qextVersion string   The version from the qext file that was uploaded with this extension. 
        *   dependencies object   Map of dependencies describing version of the component it requires. 
        *   qextFilename string   The name of the qext file that was uploaded with this theme. 
        *   migrationState string   The migration state of the theme. It can be either "READY_TO_MOVE", "IN_PROGRESS" or "COMPLETED". 

#### 403

Forbidden. User is not authorized to update theme with {id}.

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

Not found. Could not find the theme with {id}.

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

 PATCH /api/v1/themes/{id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'import { readFileSync } from 'node:fs'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.themes.patchTheme('string', {  data: {    author: 'string',    dependencies: {},    description: 'string',    file: {},    homepage: 'string',    icon: 'string',    keywords: 'string',    license: 'string',    name: 'string',    qextFilename: 'string',    qextVersion: 'string',    repository: 'string',    supplier: 'string',    tags: ['string'],    type: 'string',    version: 'string',  },  file: new Uint8Array(    readFileSync('<file-path>'),  ),})
```

`qlik theme patch 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/themes/{id}" \-X PATCH \-H "Content-type: multipart/form-data" \-H "Authorization: Bearer <access_token>" \-F "data={\"id\":\"string\",\"file\":{},\"icon\":\"string\",\"name\":\"string\",\"tags\":[\"string\"],\"type\":\"string\",\"author\":\"string\",\"userId\":\"string\",\"license\":\"string\",\"version\":\"string\",\"homepage\":\"string\",\"keywords\":\"string\",\"supplier\":\"string\",\"tenantId\":\"string\",\"updateAt\":\"string\",\"createdAt\":\"string\",\"repository\":\"string\",\"description\":\"string\",\"qextVersion\":\"string\",\"dependencies\":{},\"qextFilename\":\"string\",\"migrationState\":\"string\"}" \-F "file=@/path/to/file"`

### Example Response

`{  "data": [    {      "id": "string",      "file": {},      "icon": "string",      "name": "string",      "tags": [        "string"      ],      "type": "string",      "author": "string",      "userId": "string",      "license": "string",      "version": "string",      "homepage": "string",      "keywords": "string",      "supplier": "string",      "tenantId": "string",      "updateAt": "string",      "createdAt": "string",      "repository": "string",      "description": "string",      "qextVersion": "string",      "dependencies": {},      "qextFilename": "string",      "migrationState": "string"    }  ]}`

## [](https://qlik.dev/apis/rest/themes/#delete-api-v1-themes-id)Delete specific theme

Deletes a specific theme matching either theme ID or theme name.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   id string Required   Theme identifier or its qextFilename. 

### Responses

#### 204

No content. Soft deletes the theme.

#### 403

Forbidden. User is not authorized to delete themes with {id}.

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

Not found. Could not find the theme with {id}.

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

Gone. Theme with {id} has been deleted.

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

 DELETE /api/v1/themes/{id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.themes.deleteTheme('string')
```

`qlik theme rm 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/themes/{id}" \-X DELETE \-H "Authorization: Bearer <access_token>"`

## [](https://qlik.dev/apis/rest/themes/#get-api-v1-themes-id-file)Download theme as an archive

Downloads all files in the theme matching either theme ID or theme name as a `.zip` archive.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Path Parameters

*   id string Required   Theme identifier or its qextFilename 

### Responses

#### 200

OK. Theme exists. Returns the theme archive.

*   application/zip string   
format = "binary"

#### 200

OK. Theme exists. Returns the theme archive.

*   application/octet-stream string   
format = "binary"

#### 403

Forbidden. User is not authorized to read theme with {id}.

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

Not found. Could not find the theme with {id}.

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

Gone. Theme with {id} has been deleted.

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

 GET /api/v1/themes/{id}/file

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.themes.downloadTheme('string')
```

`qlik theme file ls \  --themeId 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/themes/{id}/file" \-H "Authorization: Bearer <access_token>"`

### Example Response

`"string"`

## [](https://qlik.dev/apis/rest/themes/#get-api-v1-themes-id-file-filepath)Download file from theme archive

Downloads a file from the theme matching either theme ID or theme name, identified by the file path within the imported extension.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Path Parameters

*   filepath string Required   Path to the file location within the specified theme archive. Folders separated with forward slashes. 
*   id string Required   Theme identifier or its qextFilename. 

### Responses

#### 200

OK. Theme exists and the file specified exists. Returns the specific file.

#### 403

Forbidden. User is not authorized to read theme with {id}.

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

Not found. Could not find a theme with {id} or the file does not exist in the archive.

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

Gone. Theme with {id} has been deleted.

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

 GET /api/v1/themes/{id}/file/{filepath}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.themes.downloadFileFromTheme(  'string',  'css/styles.css',)
```

`qlik theme file get 'css/styles.css' \  --themeId 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/themes/{id}/file/{filepath}" \-H "Authorization: Bearer <access_token>"`

Was this page helpful?
*   yes 
*   no 

![Image 2: Qlik logo](https://qlik.dev/logo-footer.svg)

[Qlik Community](https://community.qlik.com/)

[](https://join.slack.com/t/qlikdeveloper/shared_invite/zt-3wrdlkhog-Dcq9LuCbjNQVN2XaPlgGqQ)[](https://www.facebook.com/qlik)[](https://www.linkedin.com/company/qlik)[](https://x.com/qlikdeveloper)

[Legal Agreements](https://www.qlik.com/us/legal/legal-agreements) / [Legal Policies](https://www.qlik.com/us/legal/legal-policies) / [Privacy & Cookie Notice](https://www.qlik.com/us/legal/privacy-and-cookie-notice) / [Terms of Use](https://qlik.dev/qlik-developer-portal-terms-of-use.pdf) / Do Not Share My Info

 Copyright © 1993-2026 QlikTech International AB. All rights reserved.