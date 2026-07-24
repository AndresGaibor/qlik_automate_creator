---
title: "Roles REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/roles/"
local_path: "docs/endpoints/roles.md"
---

Title: Roles REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/roles/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Roles

*   [List roles](https://qlik.dev/apis/rest/roles/#get-api-v1-roles "List roles")
*   [Create role](https://qlik.dev/apis/rest/roles/#post-api-v1-roles "Create role")
*   [Get role by ID](https://qlik.dev/apis/rest/roles/#get-api-v1-roles-id "Get role by ID")
*   [Update role by ID](https://qlik.dev/apis/rest/roles/#patch-api-v1-roles-id "Update role by ID")
*   [Delete role by ID](https://qlik.dev/apis/rest/roles/#delete-api-v1-roles-id "Delete role by ID")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/roles.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Roles

Tenant roles are assigned to users or groups in the tenant, and define what permissions they have.

[Download OpenAPI spec](https://qlik.dev/specs/rest/roles.json)

## Endpoints

*   [GET /api/v1/roles](https://qlik.dev/apis/rest/roles/#get-api-v1-roles)
*   [POST /api/v1/roles](https://qlik.dev/apis/rest/roles/#post-api-v1-roles)
*   [GET /api/v1/roles/{id}](https://qlik.dev/apis/rest/roles/#get-api-v1-roles-id)
*   [PATCH /api/v1/roles/{id}](https://qlik.dev/apis/rest/roles/#patch-api-v1-roles-id)
*   [DELETE /api/v1/roles/{id}](https://qlik.dev/apis/rest/roles/#delete-api-v1-roles-id)

## [](https://qlik.dev/apis/rest/roles/#get-api-v1-roles)List roles

Returns a list of roles using cursor-based pagination.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Query Parameters

*   filter string   The advanced filtering to use for the query. Refer to [RFC 7644](https://datatracker.ietf.org/doc/rfc7644/) for the syntax. All conditional statements within this query parameter are case insensitive. 
*   limit number   The number of roles to retrieve. 
minimum = 1,  maximum = 100,  default = 20,  default = 20

*   next string   The next page cursor. 
format = "uid"

*   prev string   The previous page cursor. 
format = "uid"

*   sort string   Optional resource field name to sort on, eg. name. Can be prefixed with +/- to determine order, defaults to (+) ascending. 
*   totalResults boolean   Determines wether to return a count of the total records matched in the query. Defaults to false. 

### Responses

#### 200

An array of roles, and pagination links.

*   application/json object   

Show application/json properties 

    *   data array of objects Required   An array of roles. 

Show data properties 

        *   id string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The unique identifier for the role. 
format = "uid"

        *   name string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The name of the role. 
        *   type string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The type of role. 
Can be one of: "default""custom"

        *   level string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The level of access associated to the role. 
Can be one of: "admin""user"

        *   links object Required   Contains links for the role. 

Show links properties 

            *   self object Required   

Show self properties 

                *   href string Required   Link to the role. 
format = "uri"

        *   canEdit boolean   Indicate if role can be edited by tenant (Shown as Profile in MC) 
default = false

        *   fullUser boolean Deprecated   DEPRECATED. Use userEntitlementType instead for impact of roles on user entitlements with a capacity-based subscription. 
        *   tenantId string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The tenant unique identifier associated with the given Role. 
format = "uid"

        *   canDelete boolean   Indicate if role can be deleted 
default = false

        *   createdAt string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The timestamp for when the role was created. 
format = "date-time"

        *   createdBy string   Id of user that created role 
        *   updatedBy string   Id of user that last updated this role 
        *   description string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   Descriptive text for the role. 
        *   permissions array of strings [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   An array of permissions associated with the role. 
        *   lastUpdatedAt string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The timestamp for when the role was last updated. 
format = "date-time"

        *   assignedScopes array of strings   Selection of scopes added to this Role 
        *   userEntitlementType string   Indicate whether this role will trigger promotion of a user from a basic to a full user on tenants with a capacity-based subscription. Does not apply to tenants with a user-based subscription. Returns fullUser if it will trigger promotion. 

    *   links object Required   Contains pagination links 

Show links properties 

        *   next object   Link to the next page of items 

Show next properties 

            *   href string Required   
format = "uri"

        *   prev object   Link to the previous page of items 

Show prev properties 

            *   href string Required   
format = "uri"

        *   self object Required   Link to the current page of items 

Show self properties 

            *   href string Required   
format = "uri"

    *   totalResults integer   Indicates the total number of matching documents. Will only be returned if the query parameter "totalResults" is true. 

#### 400

Invalid request parameters for querying roles.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

#### 401

Unauthorized, JWT is invalid or not provided.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

#### 429

Request has been rate limited.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

#### 500

Internal server error.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

 GET /api/v1/roles

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.roles.getRoles({})
```

`qlik role ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/roles" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "data": [    {      "id": "507f191e810c19729de860ea",      "name": "My Custom Role",      "type": "custom",      "level": "user",      "links": {        "self": {          "href": "http://mytenant.us.qlikcloud.com/api/v1/roles/507f191e810c19729de860ea"        }      },      "canEdit": false,      "fullUser": true,      "tenantId": "q3VRZ4YMixRaLKEPhkZWM-XMIDN7cO8f",      "canDelete": false,      "createdAt": "2021-03-21T17:32:28Z",      "createdBy": "string",      "updatedBy": "string",      "description": "Grants permission to edit resource 'foo'",      "permissions": [        "edit_foo"      ],      "lastUpdatedAt": "2021-03-22T10:01:02Z",      "assignedScopes": [        "string"      ],      "userEntitlementType": "fullUser"    }  ],  "links": {    "next": {      "href": "http://mytenant.us.qlikcloud.com/api/v1/roles?next=QaFdFYW6pImZvRgFaDyB1UffNgfs4mRd"    },    "prev": {      "href": "http://mytenant.us.qlikcloud.com/api/v1/roles?prev=QaFdFYW6pImZvRgFaDyB1UffNgfs4mRd"    },    "self": {      "href": "http://mytenant.us.qlikcloud.com/api/v1/roles"    }  },  "totalResults": 42}`

## [](https://qlik.dev/apis/rest/roles/#post-api-v1-roles)Create role

Creates a custom role. Role names must be unique, and there is a maximum of 500 custom roles per tenant. Requestor must be assigned the `TenantAdmin` role.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

*   application/json object   

Show application/json properties 

    *   name string Required   Role name, needs to be unique 
    *   description string   Role description 
    *   assignedScopes array of strings   Selection of scopes to assign to role 

### Responses

#### 201

Created

*   application/json object   

Show application/json properties 

    *   id string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The unique identifier for the role. 
format = "uid"

    *   name string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The name of the role. 
    *   type string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The type of role. 
Can be one of: "default""custom"

    *   level string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The level of access associated to the role. 
Can be one of: "admin""user"

    *   links object Required   Contains links for the role. 

Show links properties 

        *   self object Required   

Show self properties 

            *   href string Required   Link to the role. 
format = "uri"

    *   canEdit boolean   Indicate if role can be edited by tenant (Shown as Profile in MC) 
default = false

    *   fullUser boolean Deprecated   DEPRECATED. Use userEntitlementType instead for impact of roles on user entitlements with a capacity-based subscription. 
    *   tenantId string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The tenant unique identifier associated with the given Role. 
format = "uid"

    *   canDelete boolean   Indicate if role can be deleted 
default = false

    *   createdAt string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The timestamp for when the role was created. 
format = "date-time"

    *   createdBy string   Id of user that created role 
    *   updatedBy string   Id of user that last updated this role 
    *   description string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   Descriptive text for the role. 
    *   permissions array of strings [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   An array of permissions associated with the role. 
    *   lastUpdatedAt string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The timestamp for when the role was last updated. 
format = "date-time"

    *   assignedScopes array of strings   Selection of scopes added to this Role 
    *   userEntitlementType string   Indicate whether this role will trigger promotion of a user from a basic to a full user on tenants with a capacity-based subscription. Does not apply to tenants with a user-based subscription. Returns fullUser if it will trigger promotion. 

#### 400

Invalid request was made.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

#### 401

Unauthorized to create role.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

#### 403

Forbidden from creating role.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

#### 429

Request has been rate limited.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

#### 500

Internal server error.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

 POST /api/v1/roles

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.roles.createRole({  assignedScopes: ['string'],  description: 'string',  name: 'string',})
```

`qlik role create \  --name 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/roles" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"name":"string","description":"string","assignedScopes":["string"]}'`

### Example Response

`{  "id": "507f191e810c19729de860ea",  "name": "My Custom Role",  "type": "custom",  "level": "user",  "links": {    "self": {      "href": "http://mytenant.us.qlikcloud.com/api/v1/roles/507f191e810c19729de860ea"    }  },  "canEdit": false,  "fullUser": true,  "tenantId": "q3VRZ4YMixRaLKEPhkZWM-XMIDN7cO8f",  "canDelete": false,  "createdAt": "2021-03-21T17:32:28Z",  "createdBy": "string",  "updatedBy": "string",  "description": "Grants permission to edit resource 'foo'",  "permissions": [    "edit_foo"  ],  "lastUpdatedAt": "2021-03-22T10:01:02Z",  "assignedScopes": [    "string"  ],  "userEntitlementType": "fullUser"}`

## [](https://qlik.dev/apis/rest/roles/#get-api-v1-roles-id)Get role by ID

Returns the requested role.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Path Parameters

*   id string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The unique identifier for the role. 
format = "uid"

### Responses

#### 200

Request successfully completed.

*   application/json object   

Show application/json properties 

    *   id string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The unique identifier for the role. 
format = "uid"

    *   name string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The name of the role. 
    *   type string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The type of role. 
Can be one of: "default""custom"

    *   level string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The level of access associated to the role. 
Can be one of: "admin""user"

    *   links object Required   Contains links for the role. 

Show links properties 

        *   self object Required   

Show self properties 

            *   href string Required   Link to the role. 
format = "uri"

    *   canEdit boolean   Indicate if role can be edited by tenant (Shown as Profile in MC) 
default = false

    *   fullUser boolean Deprecated   DEPRECATED. Use userEntitlementType instead for impact of roles on user entitlements with a capacity-based subscription. 
    *   tenantId string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The tenant unique identifier associated with the given Role. 
format = "uid"

    *   canDelete boolean   Indicate if role can be deleted 
default = false

    *   createdAt string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The timestamp for when the role was created. 
format = "date-time"

    *   createdBy string   Id of user that created role 
    *   updatedBy string   Id of user that last updated this role 
    *   description string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   Descriptive text for the role. 
    *   permissions array of strings [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   An array of permissions associated with the role. 
    *   lastUpdatedAt string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The timestamp for when the role was last updated. 
format = "date-time"

    *   assignedScopes array of strings   Selection of scopes added to this Role 
    *   userEntitlementType string   Indicate whether this role will trigger promotion of a user from a basic to a full user on tenants with a capacity-based subscription. Does not apply to tenants with a user-based subscription. Returns fullUser if it will trigger promotion. 

#### 404

Role ID not found or Invalid format.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

#### 429

Request has been rate limited.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

#### 500

Internal Server Error.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

 GET /api/v1/roles/{id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.roles.getRole(  '507f191e810c19729de860ea',)
```

`qlik role get '507f191e810c19729de860ea'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/roles/{id}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "id": "507f191e810c19729de860ea",  "name": "My Custom Role",  "type": "custom",  "level": "user",  "links": {    "self": {      "href": "http://mytenant.us.qlikcloud.com/api/v1/roles/507f191e810c19729de860ea"    }  },  "canEdit": false,  "fullUser": true,  "tenantId": "q3VRZ4YMixRaLKEPhkZWM-XMIDN7cO8f",  "canDelete": false,  "createdAt": "2021-03-21T17:32:28Z",  "createdBy": "string",  "updatedBy": "string",  "description": "Grants permission to edit resource 'foo'",  "permissions": [    "edit_foo"  ],  "lastUpdatedAt": "2021-03-22T10:01:02Z",  "assignedScopes": [    "string"  ],  "userEntitlementType": "fullUser"}`

## [](https://qlik.dev/apis/rest/roles/#patch-api-v1-roles-id)Update role by ID

Updates the requested role. Only applicable to roles of type `custom`. Requestor must be assigned the `TenantAdmin` role.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   id string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The unique identifier for the role. 
format = "uid"

### Request Body

Required

*   application/json array of objects   An array of JSON Patch documents 

Show application/json properties 

    *   op string Required   
Can be one of: "replace""add""remove-value"

    *   path string Required   
Can be one of: "/name""/description""/assignedScopes""/assignedScopes/-"

    *   value string|array Required   

One of:
        *   string   
        *   array of strings   

### Responses

#### 204

Updated

#### 400

Invalid request was made.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

#### 401

Unauthorized to update role.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

#### 403

Forbidden from updating role.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

#### 404

Role ID not found or Invalid format.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

#### 429

Request has been rate limited.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

#### 500

Internal server error.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

 PATCH /api/v1/roles/{id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.roles.patchRole(  '507f191e810c19729de860ea',  [    {      op: 'replace',      path: '/name',      value: 'Role1',    },
    {      op: 'replace',      path: '/assignedScopes',      value: ['knowledgebase'],    },
    {      op: 'add',      path: '/assignedScopes/-',      value: 'knowledgebase',    },
    {      op: 'remove-value',      path: '/assignedScopes',      value: 'knowledgebase',    },
    {      op: 'replace',      path: '/description',      value: 'My custom role description',    },  ],)
```

`qlik role patch '507f191e810c19729de860ea' \  --op 'replace' \  --path '/name' \  --value 'Role1'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/roles/{id}" \-X PATCH \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '[{"op":"replace","path":"/name","value":"Role1"},{"op":"replace","path":"/assignedScopes","value":["knowledgebase"]},{"op":"add","path":"/assignedScopes/-","value":"knowledgebase"},{"op":"remove-value","path":"/assignedScopes","value":"knowledgebase"},{"op":"replace","path":"/description","value":"My custom role description"}]'`

## [](https://qlik.dev/apis/rest/roles/#delete-api-v1-roles-id)Delete role by ID

Deletes the requested role. Role can only be deleted if it has been unassigned from all users and groups. Only applicable to roles of type `custom`. Requestor must be assigned the `TenantAdmin` role.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   id string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The unique identifier for the role. 
format = "uid"

### Responses

#### 204

Deleted successfully.

#### 400

Invalid request was made.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

#### 401

Unauthorized to delete role.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

#### 403

Forbidden from deleting role.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

#### 429

Request has been rate limited.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

#### 500

Internal server error.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

 DELETE /api/v1/roles/{id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.roles.deleteRole(  '507f191e810c19729de860ea',)
```

`qlik role rm '507f191e810c19729de860ea'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/roles/{id}" \-X DELETE \-H "Authorization: Bearer <access_token>"`

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