---
title: "API keys REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/api-keys/"
local_path: "docs/endpoints/api-keys.md"
---

Title: API keys REST | Qlik Developer Portal



[Skip to content](https://qlik.dev/apis/rest/api-keys/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## API keys

*   [List API keys](https://qlik.dev/apis/rest/api-keys/#get-api-v1-api-keys "List API keys")
*   [Create API key](https://qlik.dev/apis/rest/api-keys/#post-api-v1-api-keys "Create API key")
*   [Get API key for a given ID](https://qlik.dev/apis/rest/api-keys/#get-api-v1-api-keys-id "Get API key for a given ID")
*   [Update API key description](https://qlik.dev/apis/rest/api-keys/#patch-api-v1-api-keys-id "Update API key description")
*   [Delete or revoke an API key](https://qlik.dev/apis/rest/api-keys/#delete-api-v1-api-keys-id "Delete or revoke an API key")
*   [Get API key configuration](https://qlik.dev/apis/rest/api-keys/#get-api-v1-api-keys-configs-tenantId "Get API key configuration")
*   [Update API keys configuration](https://qlik.dev/apis/rest/api-keys/#patch-api-v1-api-keys-configs-tenantId "Update API keys configuration")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/api-keys.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# API keys

API keys can be used by developers to gain programmatic access to the Qlik platform, acting as their own user.

[Download OpenAPI spec](https://qlik.dev/specs/rest/api-keys.json)

## Endpoints

*   [GET /api/v1/api-keys](https://qlik.dev/apis/rest/api-keys/#get-api-v1-api-keys)
*   [POST /api/v1/api-keys](https://qlik.dev/apis/rest/api-keys/#post-api-v1-api-keys)
*   [GET /api/v1/api-keys/{id}](https://qlik.dev/apis/rest/api-keys/#get-api-v1-api-keys-id)
*   [PATCH /api/v1/api-keys/{id}](https://qlik.dev/apis/rest/api-keys/#patch-api-v1-api-keys-id)
*   [DELETE /api/v1/api-keys/{id}](https://qlik.dev/apis/rest/api-keys/#delete-api-v1-api-keys-id)
*   [GET /api/v1/api-keys/configs/{tenantId}](https://qlik.dev/apis/rest/api-keys/#get-api-v1-api-keys-configs-tenantId)
*   [PATCH /api/v1/api-keys/configs/{tenantId}](https://qlik.dev/apis/rest/api-keys/#patch-api-v1-api-keys-configs-tenantId)

## [](https://qlik.dev/apis/rest/api-keys/#get-api-v1-api-keys)List API keys

Lists API keys for the tenant. To list API keys owned by other users, requesting user must be assigned the `TenantAdmin` role.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Query Parameters

*   createdByUser string   The user ID that created the API key. 
format = "uid"

*   endingBefore string   Get resources with IDs that are lower than the target resource ID. Cannot be used in conjunction with startingAfter. 
format = "uid v4"

*   limit number   Maximum number of API keys to retrieve. 
minimum = 1,  maximum = 100,  default = 20,  default = 20

*   sort string   The field to sort by, with +/- prefix indicating sort order 
Can be one of: "createdByUser""+createdByUser""-createdByUser""sub""+sub""-sub""status""+status""-status""description""+description""-description""created""+created""-created"

default = "-created"

*   startingAfter string   Get resources with IDs that are higher than the target resource ID. Cannot be used in conjunction with endingBefore. 
format = "uid v4"

*   status string   The status of the API key. 
Can be one of: "active""expired""revoked"

format = "text"

*   sub string   The ID of the subject. For SCIM the format is `SCIM\\{{IDP-ID}}`, where `{{IDP-ID}}` is the ID of the IDP in Qlik. For users, use their user ID, e.g. `64ef645a3b7009d55dee5a2b`. 
format = "uid"

### Responses

#### 200

The list API keys result.

*   application/json object   

Show application/json properties 

    *   data array of objects Required   Properties of API keys in a given tenant. 

Show data properties 

        *   id string Required   The unique ID for the resource. 
format = "uid"

        *   sub string Required   The ID of the subject for the API key. For SCIM the format is `SCIM\\{{IDP-ID}}`, where `{{IDP-ID}}` is the ID of the IDP in Qlik. For users, use their user ID, e.g. `64ef645a3b7009d55dee5a2b`. 
        *   expiry string Required   When the API key will expire and no longer be a valid authentication token. 
format = "date-time"

        *   status string Required   The status of the API key. 
Can be one of: "active""expired""revoked"

        *   created string   When the API key was created. 
format = "date-time"

        *   subType string Required   Type of the subject. For SCIM, it should be `externalClient`. 
Can be one of: "user""externalClient"

        *   tenantId string Required   The tenant ID. 
format = "uid"

        *   description string Required   A description for the API key. 
        *   lastUpdated string   When the API key was last updated. 
format = "date-time"

        *   createdByUser string Required   The ID of the user who created the key. 
format = "uid"

    *   links object Required   Navigation links to page results. 

Show links properties 

        *   next object   

Show next properties 

            *   href string Required   The URL for the link. 
format = "uri"

        *   prev object   

Show prev properties 

            *   href string Required   The URL for the link. 
format = "uri"

        *   self object Required   

Show self properties 

            *   href string Required   The URL for the link. 
format = "uri"

#### 400

Invalid request was made.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status integer   The HTTP status code. 

#### 403

Requestor not allowed to list API keys.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status integer   The HTTP status code. 

#### 429

Request has been rate limited.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status integer   The HTTP status code. 

 GET /api/v1/api-keys

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.apiKeys.getApiKeys({})
```

`qlik api-key ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/api-keys" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "data": [    {      "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",      "sub": "SCIM\\\\215g5595380d646163cadbb9",      "expiry": "2018-10-30T07:06:22Z",      "status": "active",      "created": "2018-10-30T07:06:22Z",      "subType": "user",      "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",      "description": "string",      "lastUpdated": "2018-10-30T07:06:22Z",      "createdByUser": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69"    }  ],  "links": {    "next": {      "href": "string"    },    "prev": {      "href": "string"    },    "self": {      "href": "string"    }  }}`

## [](https://qlik.dev/apis/rest/api-keys/#post-api-v1-api-keys)Create API key

Creates an API key, either for a user, or for configuring SCIM for a compatible Identity Provider. Sending `sub` and `subType` is required only for creating SCIM keys.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

Properties that the user wants to set for the API key.

*   application/json object   

Show application/json properties 

    *   sub string   The ID of the subject for the API key. For SCIM the format is `SCIM\\{{IDP-ID}}`, where `{{IDP-ID}}` is the ID of the IDP in Qlik. When creating an API key for a user, this is their user ID, e.g. `64ef645a3b7009d55dee5a2b`, and will default to the requesting user if not provided. User must be assigned the `Developer` role. 
    *   expiry string   The expiry of the API key, in ISO8601 duration format. For example, `P7D` sets expiry after 7 days. If not provided, defaults to the maximum API key or SCIM key expiry configured in the tenant. 
    *   subType string   Type of the subject. For SCIM, it should be `externalClient`. If not specified, defaults to `user`. 
Can be one of: "user""externalClient"

default = "user"

    *   description string Required   Text that describes the API key. 

### Responses

#### 201

Created the API key successfully.

*   application/json object   

Show application/json properties 

    *   id string Required   The unique ID for the resource. 
format = "uid"

    *   sub string Required   The ID of the subject for the API key. 
format = "uid"

    *   token string Required   The generated signed JWT. 
    *   expiry string Required   When the API key will expire and no longer be a valid authentication token. 
format = "date-time"

    *   status string Required   The status of the API key. 
Can be one of: "active""expired""revoked"

    *   created string   When the API key was created. 
format = "date-time"

    *   subType string Required   Type of the subject. 
Can be one of: "user"

    *   tenantId string Required   The tenant ID. 
format = "uid"

    *   description string Required   A description for the API key. 
    *   lastUpdated string   When the API key was last updated. 
format = "date-time"

    *   createdByUser string Required   The id of the user who created the key. 
format = "uid"

#### 400

Invalid request was made.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status integer   The HTTP status code. 

#### 403

Requestor not allowed to create an API key

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status integer   The HTTP status code. 

#### 429

Request has been rate limited.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status integer   The HTTP status code. 

#### default

Unexpected error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status integer   The HTTP status code. 

 POST /api/v1/api-keys

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.apiKeys.createApiKey({  description: 'string',  expiry: 'P7D',  sub: 'SCIM\\215g5595380d646163cadbb9',  subType: 'user',})
```

`qlik api-key create \  --description 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/api-keys" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"sub":"SCIM\\\\215g5595380d646163cadbb9","expiry":"P7D","subType":"user","description":"string"}'`

### Example Response

`{  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "sub": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "token": "string",  "expiry": "2018-10-30T07:06:22Z",  "status": "active",  "created": "2018-10-30T07:06:22Z",  "subType": "user",  "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "description": "string",  "lastUpdated": "2018-10-30T07:06:22Z",  "createdByUser": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69"}`

## [](https://qlik.dev/apis/rest/api-keys/#get-api-v1-api-keys-id)Get API key for a given ID

Returns the API key for a given API key ID.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Path Parameters

*   id string Required   The ID of the API key to be retrieved. 
format = "uid"

### Responses

#### 200

Returns an API key resource.

*   application/json object   

Show application/json properties 

    *   id string Required   The unique ID for the resource. 
format = "uid"

    *   sub string Required   The ID of the subject for the API key. For SCIM the format is `SCIM\\{{IDP-ID}}`, where `{{IDP-ID}}` is the ID of the IDP in Qlik. For users, use their user ID, e.g. `64ef645a3b7009d55dee5a2b`. 
    *   expiry string Required   When the API key will expire and no longer be a valid authentication token. 
format = "date-time"

    *   status string Required   The status of the API key. 
Can be one of: "active""expired""revoked"

    *   created string   When the API key was created. 
format = "date-time"

    *   subType string Required   Type of the subject. For SCIM, it should be `externalClient`. 
Can be one of: "user""externalClient"

    *   tenantId string Required   The tenant ID. 
format = "uid"

    *   description string Required   A description for the API key. 
    *   lastUpdated string   When the API key was last updated. 
format = "date-time"

    *   createdByUser string Required   The ID of the user who created the key. 
format = "uid"

#### 403

Requestor not allowed to query this API key.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status integer   The HTTP status code. 

#### 404

API key was not found.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status integer   The HTTP status code. 

#### 429

Request has been rate limited.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status integer   The HTTP status code. 

#### default

Unexpected error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status integer   The HTTP status code. 

 GET /api/v1/api-keys/{id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.apiKeys.getApiKey(  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',)
```

`qlik api-key get 'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/api-keys/{id}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "sub": "SCIM\\\\215g5595380d646163cadbb9",  "expiry": "2018-10-30T07:06:22Z",  "status": "active",  "created": "2018-10-30T07:06:22Z",  "subType": "user",  "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "description": "string",  "lastUpdated": "2018-10-30T07:06:22Z",  "createdByUser": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69"}`

## [](https://qlik.dev/apis/rest/api-keys/#patch-api-v1-api-keys-id)Update API key description

Updates an API key description for a given API key ID.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   id string Required   The ID of the API key resource to be updated. 
format = "JWT ID (jti)"

### Request Body

Required

Properties that the user wants to update for the API key.

*   application/json array of objects   A JSON Patch document as defined in [https://datatracker.ietf.org/doc/html/rfc6902](https://datatracker.ietf.org/doc/html/rfc6902). 

Show application/json properties 

    *   op string Required   The operation to be performed. 
Can be one of: "replace"

    *   path string Required   The path for the given resource field to patch. 
Can be one of: "/description"

    *   value string Required   The value to be used for this operation. 

### Responses

#### 204

API key updated successfully.

#### 400

Invalid request was made.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status integer   The HTTP status code. 

#### 403

Requestor not allowed to update this API key.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status integer   The HTTP status code. 

#### 404

API key was not found.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status integer   The HTTP status code. 

#### 429

Request has been rate limited.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status integer   The HTTP status code. 

 PATCH /api/v1/api-keys/{id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.apiKeys.patchApiKey('string', [  {    op: 'replace',    path: '/description',    value: 'my new description',  },])
```

`qlik api-key patch 'string' \  --op 'replace' \  --path '/description' \  --value 'my new description'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/api-keys/{id}" \-X PATCH \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '[{"op":"replace","path":"/description","value":"my new description"}]'`

## [](https://qlik.dev/apis/rest/api-keys/#delete-api-v1-api-keys-id)Delete or revoke an API key

Deletes or revokes an API key for a given API key ID. When the owner of the API key sends the request, the key will be deleted and removed from the tenant. When a user assigned the `TenantAdmin` role sends the request, the key will be disabled and marked as revoked.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   id string Required   The ID of the API key to be retrieved. 
format = "uid"

### Responses

#### 204

Deleted or revoked an API key resource.

#### 403

Requestor not allowed to delete or revoke this API key.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status integer   The HTTP status code. 

#### 404

API key was not found.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status integer   The HTTP status code. 

#### 429

Request has been rate limited.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status integer   The HTTP status code. 

 DELETE /api/v1/api-keys/{id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.apiKeys.deleteApiKey(  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',)
```

`qlik api-key rm 'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/api-keys/{id}" \-X DELETE \-H "Authorization: Bearer <access_token>"`

## [](https://qlik.dev/apis/rest/api-keys/#get-api-v1-api-keys-configs-tenantId)Get API key configuration

Retrieves the API key configuration for a tenant.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Path Parameters

*   tenantId string Required   The tenant ID from which you wish to retrieve the API key configuration. 
format = "uid"

### Responses

#### 200

API keys configuration.

*   application/json object   

Show application/json properties 

    *   max_keys_per_user number   The maximum number of active API keys that any user can create for the specified tenant. 
minimum = 0,  maximum = 1000,  default = 5,  default = 5

    *   max_api_key_expiry string   The maximum lifetime, in ISO8601 duration format, for which an API key can be issued for the specified tenant, e.g. `P7D` for 7 days. 
default = "PT24H"

    *   scim_externalClient_expiry string   The expiry of the scim `externalClient` token in ISO8601 duration format, e.g. `P365D` for 365 days. Used during the creation of an `externalClient` API key for configuring a SCIM compatible Identity Provider. 
default = "P365D"

#### 429

Request has been rate limited.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status integer   The HTTP status code. 

#### default

Unexpected error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status integer   The HTTP status code. 

 GET /api/v1/api-keys/configs/{tenantId}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.apiKeys.getApiKeysConfig(  'Hj5p89bylz1r2AUC6joLNuHzVx5Ya8cF',)
```

`qlik api-key config get 'Hj5p89bylz1r2AUC6joLNuHzVx5Ya8cF'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/api-keys/configs/{tenantId}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "max_keys_per_user": 5,  "max_api_key_expiry": "PT24H",  "scim_externalClient_expiry": "P365D"}`

## [](https://qlik.dev/apis/rest/api-keys/#patch-api-v1-api-keys-configs-tenantId)Update API keys configuration

Updates the API keys configuration for a given tenant ID.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   tenantId string Required   The tenant ID of the API keys configuration to be retrieved. 
format = "uid"

### Request Body

Required

Configurations that the user wants to update for API keys.

*   application/json array of objects   A JSON Patch document as defined in [https://datatracker.ietf.org/doc/html/rfc6902](https://datatracker.ietf.org/doc/html/rfc6902). 

Show application/json properties 

    *   op string Required   The operation to be performed. 
Can be one of: "replace"

    *   path string Required   The path for the given resource field to patch. 
Can be one of: "/max_api_key_expiry""/max_keys_per_user""/scim_externalClient_expiry"

    *   value any Required   The value to be used for this operation. 

### Responses

#### 204

API keys configuration updated successfully.

#### 400

Invalid request was made.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status integer   The HTTP status code. 

#### 403

Requestor not allowed to update the API keys configuration.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status integer   The HTTP status code. 

#### 404

Failed to update the API keys configuration.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status integer   The HTTP status code. 

#### 429

Request has been rate limited.

*   application/json object   

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status integer   The HTTP status code. 

 PATCH /api/v1/api-keys/configs/{tenantId}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.apiKeys.patchApiKeysConfig(  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',  [    {      op: 'replace',      path: '/max_keys_per_user',      value: 10,    },  ],)
```

`qlik api-key config patch 'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69' \  --op 'replace' \  --path '/max_keys_per_user' \  --value 10`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/api-keys/configs/{tenantId}" \-X PATCH \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '[{"op":"replace","path":"/max_keys_per_user","value":10}]'`

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