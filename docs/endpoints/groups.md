---
title: "Groups REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/groups/"
local_path: "docs/endpoints/groups.md"
---

Title: Groups REST | Qlik Developer Portal



[Skip to content](https://qlik.dev/apis/rest/groups/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Groups

*   [List groups](https://qlik.dev/apis/rest/groups/#get-api-v1-groups "List groups")
*   [Create group](https://qlik.dev/apis/rest/groups/#post-api-v1-groups "Create group")
*   [Get group by ID](https://qlik.dev/apis/rest/groups/#get-api-v1-groups-groupId "Get group by ID")
*   [Update group by ID](https://qlik.dev/apis/rest/groups/#patch-api-v1-groups-groupId "Update group by ID")
*   [Delete group by ID](https://qlik.dev/apis/rest/groups/#delete-api-v1-groups-groupId "Delete group by ID")
*   [Filter groups](https://qlik.dev/apis/rest/groups/#post-api-v1-groups-actions-filter "Filter groups")
*   [Get group settings](https://qlik.dev/apis/rest/groups/#get-api-v1-groups-settings "Get group settings")
*   [Update group settings](https://qlik.dev/apis/rest/groups/#patch-api-v1-groups-settings "Update group settings")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/groups.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Groups

Groups is the resource representing a group in the system, to which space and tenant roles can be assigned to simplify access control management.

[Download OpenAPI spec](https://qlik.dev/specs/rest/groups.json)

## Endpoints

*   [GET /api/v1/groups](https://qlik.dev/apis/rest/groups/#get-api-v1-groups)
*   [POST /api/v1/groups](https://qlik.dev/apis/rest/groups/#post-api-v1-groups)
*   [GET /api/v1/groups/{groupId}](https://qlik.dev/apis/rest/groups/#get-api-v1-groups-groupId)
*   [PATCH /api/v1/groups/{groupId}](https://qlik.dev/apis/rest/groups/#patch-api-v1-groups-groupId)
*   [DELETE /api/v1/groups/{groupId}](https://qlik.dev/apis/rest/groups/#delete-api-v1-groups-groupId)
*   [POST /api/v1/groups/actions/filter](https://qlik.dev/apis/rest/groups/#post-api-v1-groups-actions-filter)
*   [GET /api/v1/groups/settings](https://qlik.dev/apis/rest/groups/#get-api-v1-groups-settings)
*   [PATCH /api/v1/groups/settings](https://qlik.dev/apis/rest/groups/#patch-api-v1-groups-settings)

## [](https://qlik.dev/apis/rest/groups/#get-api-v1-groups)List groups

Returns a list of groups with cursor-based pagination.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Query Parameters

*   filter string   The advanced filtering to use for the query. Refer to [RFC 7644](https://datatracker.ietf.org/doc/rfc7644/) for the syntax. Cannot be combined with any of the fields marked as deprecated. All conditional statements within this query parameter are case insensitive. 
*   limit number   The number of groups to retrieve. 
minimum = 1,  maximum = 100,  default = 20,  default = 20

*   next string   The next page cursor. 
format = "uid"

*   prev string   The previous page cursor. 
format = "uid"

*   sort string   Optional resource field name to sort on, eg. name. Can be prefixed with +/- to determine order, defaults to (+) ascending. 
*   systemGroups boolean   Return system groups (e.g. Everyone) instead of regular groups. Cannot be combined with any other query parameters. 
default = false

*   totalResults boolean   Whether to return a total match count in the result. Defaults to false. 

### Responses

#### 200

An array of groups, and pagination links.

*   application/json object   A result object when listing groups. 

Show application/json properties 

    *   data array of objects   An array of groups. 

Show data properties 

        *   id string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The unique identifier for the group 
format = "uid"

        *   name string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The name of the group. 
minLength = 1,  maxLength = 256

        *   links object Required   Contains Links for current document 

Show links properties 

            *   self object Required   

Show self properties 

                *   href string Required   Link to the current group document 
format = "uri"

        *   status string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The state of the group. 
Can be one of: "active""disabled"

        *   tenantId string Required   The tenant identifier associated with the given group 
format = "uid"

        *   createdAt string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The timestamp for when the group record was created. 
format = "date-time"

        *   createdBy string   Id of user that created role. 
        *   updatedBy string   Id of user that last updated this role. 
        *   description string   A description of a custom group. 
        *   providerType string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The type of provider for the group. 
Can be one of: "idp""custom"

        *   assignedRoles array of objects   An array of role references. Visibility dependant on access level. Must have access to roles to view other users' assigned roles. 

Show assignedRoles properties 

            *   id string Required   The unique role identitier 
format = "uid"

            *   name string Required   The role name 
            *   type string Required   The type of role 
Can be one of: "default""custom"

            *   level string Required   The role level 
Can be one of: "admin""user"

        *   lastUpdatedAt string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The timestamp for when the group record was last updated. 
format = "date-time"

    *   links object   

Show links properties 

        *   next object   

Show next properties 

            *   href string Required   Link to the next page of items 
format = "uri"

        *   prev object   

Show prev properties 

            *   href string Required   Link to the previous page of items 
format = "uri"

        *   self object Required   

Show self properties 

            *   href string Required   Link to the current page of items 
format = "uri"

    *   totalResults integer   Indicates the total number of matching documents. Will only be returned if the query parameter "totalResults" is true. 

#### 400

Invalid request parameters for querying groups.

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

        *   status integer   The HTTP status code. 

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

        *   status integer   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### 403

All operations failed due to insufficient permissions.

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

        *   status integer   The HTTP status code. 

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

        *   status integer   The HTTP status code. 

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

        *   status integer   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

 GET /api/v1/groups

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.groups.getGroups({})
```

`qlik group ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/groups" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "data": [    {      "id": "507f191e810c19729de860ea",      "name": "Development",      "links": {        "self": {          "href": "http://mytenant.us.qlikcloud.com/api/v1/groups/507f191e810c19729de860ea"        }      },      "status": "active",      "tenantId": "q3VRZ4YMixRaLKEPhkZWM-XMIDN7cO8f",      "createdAt": "2021-03-21T17:32:28Z",      "createdBy": "string",      "updatedBy": "string",      "description": "string",      "providerType": "idp",      "assignedRoles": [        {          "id": "507f191e810c19729de860ea",          "name": "A Custom Role",          "type": "custom",          "level": "user"        }      ],      "lastUpdatedAt": "2021-03-22T10:01:02Z"    }  ],  "links": {    "next": {      "href": "http://mytenant.us.qlikcloud.com/api/v1/groups?next=FgAAAAdfaWQAYF33ydumcVj1cawoAA"    },    "prev": {      "href": "http://mytenant.us.qlikcloud.com/api/v1/groups?prev=FgAACAdfaWQAYF33ydumcVj1cawoAA"    },    "self": {      "href": "http://mytenant.us.qlikcloud.com/api/v1/groups"    }  },  "totalResults": 42}`

## [](https://qlik.dev/apis/rest/groups/#post-api-v1-groups)Create group

Creates a new group. The maximum number of groups a tenant can have is 10,000. Group names are case-sensitive, and must be unique.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

*   application/json object   

Show application/json properties 

    *   name string Required   The name of the group (maximum length of 256 characters). 
    *   status string   The status of the created group within the tenant. Defaults to active if empty. 
Can be one of: "active"

    *   description string   The description of the group. 
    *   providerType string   The type of group provider. Must be "idp" or "custom". Defaults to "idp" if not provided. 
Can be one of: "idp""custom"

default = "idp"

    *   assignedRoles array   The roles to assign to the group (limit of 100 roles per group). 

One of:
        *   AssignedRolesRefIDs array of objects   An array of role reference identifiers. 

Show AssignedRolesRefIDs properties 

            *   id string Required   The unique role identitier 
format = "uid"

        *   AssignedRolesRefNames array of objects   An array of role reference names. 

Show AssignedRolesRefNames properties 

            *   name string Required   The name of the role 

### Responses

#### 201

Group was successfully created.

*   application/json object   represents a Group document 

Show application/json properties 

    *   id string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The unique identifier for the group 
format = "uid"

    *   name string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The name of the group. 
minLength = 1,  maxLength = 256

    *   links object Required   Contains Links for current document 

Show links properties 

        *   self object Required   

Show self properties 

            *   href string Required   Link to the current group document 
format = "uri"

    *   status string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The state of the group. 
Can be one of: "active""disabled"

    *   tenantId string Required   The tenant identifier associated with the given group 
format = "uid"

    *   createdAt string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The timestamp for when the group record was created. 
format = "date-time"

    *   createdBy string   Id of user that created role. 
    *   updatedBy string   Id of user that last updated this role. 
    *   description string   A description of a custom group. 
    *   providerType string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The type of provider for the group. 
Can be one of: "idp""custom"

    *   assignedRoles array of objects   An array of role references. Visibility dependant on access level. Must have access to roles to view other users' assigned roles. 

Show assignedRoles properties 

        *   id string Required   The unique role identitier 
format = "uid"

        *   name string Required   The role name 
        *   type string Required   The type of role 
Can be one of: "default""custom"

        *   level string Required   The role level 
Can be one of: "admin""user"

    *   lastUpdatedAt string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The timestamp for when the group record was last updated. 
format = "date-time"

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

        *   status integer   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### 401

Unauthorized to create a group.

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

        *   status integer   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### 403

Forbidden from creating a group.

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

        *   status integer   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### 409

Name conflict when attempting to create a new group.

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

        *   status integer   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### 413

Payload was too large.

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

        *   status integer   The HTTP status code. 

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

        *   status integer   The HTTP status code. 

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

        *   status integer   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

 POST /api/v1/groups

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.groups.createGroup({  assignedRoles: [{ name: 'A Custom Role' }],  name: 'Development',  status: 'active',})
```

`qlik group create \  --assignedRoles-id '' \  --assignedRoles-name '' \  --name 'Development'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/groups" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"name":"Development","status":"active","assignedRoles":[{"name":"A Custom Role"}]}'`

### Example Response

`{  "id": "507f191e810c19729de860ea",  "name": "Development",  "links": {    "self": {      "href": "http://mytenant.us.qlikcloud.com/api/v1/groups/507f191e810c19729de860ea"    }  },  "status": "active",  "tenantId": "q3VRZ4YMixRaLKEPhkZWM-XMIDN7cO8f",  "createdAt": "2021-03-21T17:32:28Z",  "createdBy": "string",  "updatedBy": "string",  "description": "string",  "providerType": "idp",  "assignedRoles": [    {      "id": "507f191e810c19729de860ea",      "name": "A Custom Role",      "type": "custom",      "level": "user"    }  ],  "lastUpdatedAt": "2021-03-22T10:01:02Z"}`

## [](https://qlik.dev/apis/rest/groups/#get-api-v1-groups-groupId)Get group by ID

Returns the requested group.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Path Parameters

*   groupId string Required   The group's unique identifier 

### Responses

#### 200

Request successfully completed.

*   application/json object   represents a Group document 

Show application/json properties 

    *   id string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The unique identifier for the group 
format = "uid"

    *   name string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The name of the group. 
minLength = 1,  maxLength = 256

    *   links object Required   Contains Links for current document 

Show links properties 

        *   self object Required   

Show self properties 

            *   href string Required   Link to the current group document 
format = "uri"

    *   status string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The state of the group. 
Can be one of: "active""disabled"

    *   tenantId string Required   The tenant identifier associated with the given group 
format = "uid"

    *   createdAt string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The timestamp for when the group record was created. 
format = "date-time"

    *   createdBy string   Id of user that created role. 
    *   updatedBy string   Id of user that last updated this role. 
    *   description string   A description of a custom group. 
    *   providerType string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The type of provider for the group. 
Can be one of: "idp""custom"

    *   assignedRoles array of objects   An array of role references. Visibility dependant on access level. Must have access to roles to view other users' assigned roles. 

Show assignedRoles properties 

        *   id string Required   The unique role identitier 
format = "uid"

        *   name string Required   The role name 
        *   type string Required   The type of role 
Can be one of: "default""custom"

        *   level string Required   The role level 
Can be one of: "admin""user"

    *   lastUpdatedAt string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The timestamp for when the group record was last updated. 
format = "date-time"

#### 403

The operation failed due to insufficient permissions.

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

        *   status integer   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### 404

Group ID not found or Invalid format.

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

        *   status integer   The HTTP status code. 

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

        *   status integer   The HTTP status code. 

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

        *   status integer   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

 GET /api/v1/groups/{groupId}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.groups.getGroup('string')
```

`qlik group get 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/groups/{groupId}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "id": "507f191e810c19729de860ea",  "name": "Development",  "links": {    "self": {      "href": "http://mytenant.us.qlikcloud.com/api/v1/groups/507f191e810c19729de860ea"    }  },  "status": "active",  "tenantId": "q3VRZ4YMixRaLKEPhkZWM-XMIDN7cO8f",  "createdAt": "2021-03-21T17:32:28Z",  "createdBy": "string",  "updatedBy": "string",  "description": "string",  "providerType": "idp",  "assignedRoles": [    {      "id": "507f191e810c19729de860ea",      "name": "A Custom Role",      "type": "custom",      "level": "user"    }  ],  "lastUpdatedAt": "2021-03-22T10:01:02Z"}`

## [](https://qlik.dev/apis/rest/groups/#patch-api-v1-groups-groupId)Update group by ID

Updates the requested group.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   groupId string Required   The ID of the group to update. 
format = "uid"

### Request Body

Required

*   application/json array of objects   An array of JSON Patches for a group. 

Show application/json properties 

    *   op string Required   The operation to be performed. Currently "replace" is the only supported operation. 
Can be one of: "replace"

    *   path string Required   Attribute name of a field of the Groups entity. "Name" and "description" is only available for custom groups. 
Can be one of: "assignedRoles""name""description"

    *   value array|string Required   The roles to assign to the group (limit of 100 roles per group) or the new custom group name or description. 

One of:
        *   AssignedRolesRefIDs array of objects   An array of role reference identifiers. 

Show AssignedRolesRefIDs properties 

            *   id string Required   The unique role identitier 
format = "uid"

        *   AssignedRolesRefNames array of objects   An array of role reference names. 

Show AssignedRolesRefNames properties 

            *   name string Required   The name of the role 

        *   string   

### Responses

#### 204

Group updated successfully.

#### 400

Invalid request for patching a user.

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

        *   status integer   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### 401

Unauthorized to patch a group.

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

        *   status integer   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### 403

Forbidden from patching a group.

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

        *   status integer   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### 404

Group was not found.

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

        *   status integer   The HTTP status code. 

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

        *   status integer   The HTTP status code. 

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

        *   status integer   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

 PATCH /api/v1/groups/{groupId}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.groups.patchGroup(  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',  [    {      op: 'replace',      path: '/assignedRoles',      value: [        { name: 'TenantAdmin' },        { name: 'AnalyticsAdmin' },      ],    },  ],)
```

`qlik group patch 'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69' \  --op 'replace' \  --path '/assignedRoles' \  --value-id '' \  --value-name '' \  --value '[{"name":"TenantAdmin"},{"name":"AnalyticsAdmin"}]'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/groups/{groupId}" \-X PATCH \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '[{"op":"replace","path":"/assignedRoles","value":[{"name":"TenantAdmin"},{"name":"AnalyticsAdmin"}]}]'`

## [](https://qlik.dev/apis/rest/groups/#delete-api-v1-groups-groupId)Delete group by ID

Deletes the requested group.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   groupId string Required   The ID of the group to delete. 
format = "uid"

### Responses

#### 204

Group deleted successfully.

#### 401

Unauthorized.

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

        *   status integer   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### 404

Group ID not found or Invalid format.

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

        *   status integer   The HTTP status code. 

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

        *   status integer   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

 DELETE /api/v1/groups/{groupId}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.groups.deleteGroup(  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',)
```

`qlik group rm 'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/groups/{groupId}" \-X DELETE \-H "Authorization: Bearer <access_token>"`

## [](https://qlik.dev/apis/rest/groups/#post-api-v1-groups-actions-filter)Filter groups

Retrieves a list of groups matching the filter using advanced query string.

### Facts

Rate limit[Special](https://qlik.dev/apis/rest/rate-limiting/)(200 requests per minute)

### Query Parameters

*   limit number   The number of user entries to retrieve. 
minimum = 1,  maximum = 100,  default = 20,  default = 20

*   next string   Get users with IDs that are higher than the target user ID. Cannot be used in conjunction with prev. 
*   prev string   Get users with IDs that are lower than the target user ID. Cannot be used in conjunction with next. 
*   sort string   The field to sort by, with +/- prefix indicating sort order 
Can be one of: "name""+name""-name"

default = "+name"

### Request Body

Will contain the query filter to apply. It shall not contain more than 100 ids.

*   application/json object   An advanced query filter to be used for complex user querying in the tenant. 

Show application/json properties 

    *   filter string   The advanced filtering to be applied the query. All conditional statements within this query parameter are case insensitive. 

### Responses

#### 200

Groups retrieved.

*   application/json object   A result object when listing groups. 

Show application/json properties 

    *   data array of objects   An array of groups. 

Show data properties 

        *   id string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The unique identifier for the group 
format = "uid"

        *   name string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The name of the group. 
minLength = 1,  maxLength = 256

        *   links object Required   Contains Links for current document 

Show links properties 

            *   self object Required   

Show self properties 

                *   href string Required   Link to the current group document 
format = "uri"

        *   status string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The state of the group. 
Can be one of: "active""disabled"

        *   tenantId string Required   The tenant identifier associated with the given group 
format = "uid"

        *   createdAt string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The timestamp for when the group record was created. 
format = "date-time"

        *   createdBy string   Id of user that created role. 
        *   updatedBy string   Id of user that last updated this role. 
        *   description string   A description of a custom group. 
        *   providerType string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The type of provider for the group. 
Can be one of: "idp""custom"

        *   assignedRoles array of objects   An array of role references. Visibility dependant on access level. Must have access to roles to view other users' assigned roles. 

Show assignedRoles properties 

            *   id string Required   The unique role identitier 
format = "uid"

            *   name string Required   The role name 
            *   type string Required   The type of role 
Can be one of: "default""custom"

            *   level string Required   The role level 
Can be one of: "admin""user"

        *   lastUpdatedAt string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The timestamp for when the group record was last updated. 
format = "date-time"

    *   links object   

Show links properties 

        *   next object   

Show next properties 

            *   href string Required   Link to the next page of items 
format = "uri"

        *   prev object   

Show prev properties 

            *   href string Required   Link to the previous page of items 
format = "uri"

        *   self object Required   

Show self properties 

            *   href string Required   Link to the current page of items 
format = "uri"

    *   totalResults integer   Indicates the total number of matching documents. Will only be returned if the query parameter "totalResults" is true. 

#### 400

Advanced query filter syntax error or query params format error or filter too complex.

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

        *   status integer   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### 401

Unauthorized, JWT invalid or not provided.

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

        *   status integer   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### 403

The operation failed due to insufficient permissions.

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

        *   status integer   The HTTP status code. 

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

        *   status integer   The HTTP status code. 

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

        *   status integer   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

 POST /api/v1/groups/actions/filter

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.groups.filterGroups(  {},  {    filter:      '(id eq "626949b9017b657805080bbd" or id eq "626949bf017b657805080bbe") and (status eq "active" or status eq "deleted")',  },)
```

`qlik group filter`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/groups/actions/filter" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"filter":"(id eq \"626949b9017b657805080bbd\" or id eq \"626949bf017b657805080bbe\") and (status eq \"active\" or status eq \"deleted\")"}'`

### Example Response

`{  "data": [    {      "id": "507f191e810c19729de860ea",      "name": "Development",      "links": {        "self": {          "href": "http://mytenant.us.qlikcloud.com/api/v1/groups/507f191e810c19729de860ea"        }      },      "status": "active",      "tenantId": "q3VRZ4YMixRaLKEPhkZWM-XMIDN7cO8f",      "createdAt": "2021-03-21T17:32:28Z",      "createdBy": "string",      "updatedBy": "string",      "description": "string",      "providerType": "idp",      "assignedRoles": [        {          "id": "507f191e810c19729de860ea",          "name": "A Custom Role",          "type": "custom",          "level": "user"        }      ],      "lastUpdatedAt": "2021-03-22T10:01:02Z"    }  ],  "links": {    "next": {      "href": "http://mytenant.us.qlikcloud.com/api/v1/groups?next=FgAAAAdfaWQAYF33ydumcVj1cawoAA"    },    "prev": {      "href": "http://mytenant.us.qlikcloud.com/api/v1/groups?prev=FgAACAdfaWQAYF33ydumcVj1cawoAA"    },    "self": {      "href": "http://mytenant.us.qlikcloud.com/api/v1/groups"    }  },  "totalResults": 42}`

## [](https://qlik.dev/apis/rest/groups/#get-api-v1-groups-settings)Get group settings

Returns the tenant's group settings, such as whether automatic group creation and IdP group synchronization are enabled or disabled, and roles assigned to system groups.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Responses

#### 200

The requested tenant's group settings.

*   application/json object   represents a GroupSetting document 

Show application/json properties 

    *   links object Required   Contains Links for current document 

Show links properties 

        *   self object Required   

Show self properties 

            *   href string Required   Link to the current group settings document 
format = "uri"

    *   tenantId string Required   The unique tenant identifier. 
format = "uid"

    *   systemGroups object   

Show systemGroups properties 

        *   000000000000000000000001 object   

Show 000000000000000000000001 properties 

            *   id string   The ID of the Everyone group. This value will not change and is immutable. 
Can be one of: "000000000000000000000001"

            *   name string   The name of the Everyone group. This value will not change and is immutable. 
Can be one of: "com.qlik.Everyone"

            *   enabled boolean   For Everyone, this is always `true` and can't be patched. 
default = true

            *   createdAt string   The timestamp for when the Everyone group was created. 
format = "date-time"

            *   assignedRoles array of objects   An array of role references. Visibility dependant on access level. Must have access to roles to view other users' assigned roles. 

Show assignedRoles properties 

                *   id string Required   The unique role identitier 
format = "uid"

                *   name string Required   The role name 
                *   type string Required   The type of role 
Can be one of: "default""custom"

                *   level string Required   The role level 
Can be one of: "admin""user"

            *   lastUpdatedAt string   The timestamp for when the Everyone group was last updated. 
format = "date-time"

    *   syncIdpGroups boolean Deprecated   Determines if groups should be created on login. 
    *   autoCreateGroups boolean Required   Determines if groups should be created on login. 

#### 401

Not authorized.

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

        *   status integer   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### 403

The operation failed due to insufficient permissions.

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

        *   status integer   The HTTP status code. 

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

        *   status integer   The HTTP status code. 

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

        *   status integer   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

 GET /api/v1/groups/settings

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.groups.getGroupsSettings()
```

`qlik group settings ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/groups/settings" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "links": {    "self": {      "href": "http://mytenant.us.qlikcloud.com/api/v1/groups/settings"    }  },  "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "systemGroups": {    "000000000000000000000001": {      "id": "000000000000000000000001",      "name": "com.qlik.Everyone",      "enabled": true,      "createdAt": "2021-03-22T10:01:02Z",      "assignedRoles": [        {          "id": "507f191e810c19729de860ea",          "name": "A Custom Role",          "type": "custom",          "level": "user"        }      ],      "lastUpdatedAt": "2021-03-22T10:01:02Z"    }  },  "syncIdpGroups": false,  "autoCreateGroups": false}`

## [](https://qlik.dev/apis/rest/groups/#patch-api-v1-groups-settings)Update group settings

Updates the tenant's group settings, such as whether automatic group creation and IdP group synchronization are enabled or disabled, and roles assigned to system groups.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

*   application/json array of objects   An array of JSON Patches for the groups settings. 

Show application/json properties 

    *   op string Required   The operation to be performed. 
Can be one of: "replace"

    *   path string Required   A JSON Pointer. 
Can be one of: "/autoCreateGroups""/syncIdpGroups""/systemGroups/{id}/assignedRoles"

    *   value boolean|array Required   The value to be used for this operation. 

One of:
        *   boolean   
        *   AssignedRolesRefIDs array of objects   An array of role reference identifiers. 

Show AssignedRolesRefIDs properties 

            *   id string Required   The unique role identitier 
format = "uid"

        *   AssignedRolesRefNames array of objects   An array of role reference names. 

Show AssignedRolesRefNames properties 

            *   name string Required   The name of the role 

### Responses

#### 204

Config updated successfully.

#### 400

Bad request. Payload could not be parsed to a JSON Patch or Patch operations are invalid.

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

        *   status integer   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### 401

Not authorized.

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

        *   status integer   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### 403

The operation failed due to insufficient permissions.

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

        *   status integer   The HTTP status code. 

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

        *   status integer   The HTTP status code. 

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

        *   status integer   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

 PATCH /api/v1/groups/settings

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.groups.patchGroupsSettings([  {    op: 'replace',    path: '/syncIdpGroups',    value: true,  },
  {    op: 'replace',    path: '/autoCreateGroups',    value: true,  },
  {    op: 'replace',    path: '/systemGroups/000000000000000000000001/assignedRoles',    value: [{ name: 'Steward' }],  },])
```

`qlik group settings patch \  --op 'replace' \  --path '/syncIdpGroups' \  --value true \  --value-id '' \  --value-name ''`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/groups/settings" \-X PATCH \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '[{"op":"replace","path":"/syncIdpGroups","value":true},{"op":"replace","path":"/autoCreateGroups","value":true},{"op":"replace","path":"/systemGroups/000000000000000000000001/assignedRoles","value":[{"name":"Steward"}]}]'`

Was this page helpful?
*   yes 
*   no 

![Image 2: Qlik logo](https://qlik.dev/logo-footer.svg)

[Qlik Community](https://community.qlik.com/)

[](https://join.slack.com/t/qlikdeveloper/shared_invite/zt-3wrdlkhog-Dcq9LuCbjNQVN2XaPlgGqQ)[](https://www.facebook.com/qlik)[](https://www.linkedin.com/company/qlik)[](https://x.com/qlikdeveloper)

[Legal Agreements](https://www.qlik.com/us/legal/legal-agreements) / [Legal Policies](https://www.qlik.com/us/legal/legal-policies) / [Privacy & Cookie Notice](https://www.qlik.com/us/legal/privacy-and-cookie-notice) / [Terms of Use](https://qlik.dev/qlik-developer-portal-terms-of-use.pdf) / Do Not Share My Info

 Copyright © 1993-2026 QlikTech International AB. All rights reserved.