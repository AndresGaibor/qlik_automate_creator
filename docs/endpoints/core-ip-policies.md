---
title: "IP Policies REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/core/ip-policies/"
local_path: "docs/endpoints/core-ip-policies.md"
---

Title: IP Policies REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/core/ip-policies/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## IP Policies

*   [List IP policies](https://qlik.dev/apis/rest/core/ip-policies/#get-api-core-ip-policies "List IP policies")
*   [Create an IP policy](https://qlik.dev/apis/rest/core/ip-policies/#post-api-core-ip-policies "Create an IP policy")
*   [Get an IP policy](https://qlik.dev/apis/rest/core/ip-policies/#get-api-core-ip-policies-id "Get an IP policy")
*   [Update an IP policy](https://qlik.dev/apis/rest/core/ip-policies/#patch-api-core-ip-policies-id "Update an IP policy")
*   [Delete an IP policy](https://qlik.dev/apis/rest/core/ip-policies/#delete-api-core-ip-policies-id "Delete an IP policy")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)
6.    / 
7.    core 

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/core/ip-policies.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# IP Policies

IP policies let you control which IP addresses can access your Qlik Cloud tenant. Use this API to manage allowlisting rules by creating, listing, updating, and deleting IP policies. When allowlisting is enabled, only users connecting from allowed IPv4 addresses or ranges can access the tenant.

[Download OpenAPI spec](https://qlik.dev/specs/rest/core/ip-policies.json)

## Endpoints

*   [GET /api/core/ip-policies](https://qlik.dev/apis/rest/core/ip-policies/#get-api-core-ip-policies)
*   [POST /api/core/ip-policies](https://qlik.dev/apis/rest/core/ip-policies/#post-api-core-ip-policies)
*   [GET /api/core/ip-policies/{id}](https://qlik.dev/apis/rest/core/ip-policies/#get-api-core-ip-policies-id)
*   [PATCH /api/core/ip-policies/{id}](https://qlik.dev/apis/rest/core/ip-policies/#patch-api-core-ip-policies-id)
*   [DELETE /api/core/ip-policies/{id}](https://qlik.dev/apis/rest/core/ip-policies/#delete-api-core-ip-policies-id)

## [](https://qlik.dev/apis/rest/core/ip-policies/#get-api-core-ip-policies)List IP policies

Returns a list of IP policies present in the tenant. The user must be assigned the `TenantAdmin` role.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Query Parameters

*   fields string   A comma-separated list of fields to limit in the response. 
*   filter string   The advanced filtering to use for the query. Refer to [RFC 7644](https://datatracker.ietf.org/doc/rfc7644/) for the syntax. All conditional statements within this query parameter are case insensitive.

field "enabled" supports following operators: eq

field "id" supports following operators: eq, ne

field "name" supports following operators: eq, co

field "tenantId" supports following operators: eq 
*   limit number   The number of IP policies to retrieve. 
minimum = 1,  maximum = 100,  default = 20,  default = 20

*   page string   The page cursor. Takes precedence over other parameters. 
*   sort string   Optional resource field name to sort on, eg. name. Can be prefixed with +/- to determine order, defaults to (+) ascending. 
Can be one of: "enabled""+enabled""-enabled""createdAt""+createdAt""-createdAt""updatedAt""+updatedAt""-updatedAt""name""+name""-name"

*   totalResults boolean   Determines whether to return a count of the total records matched in the query. Defaults to false. 
default = false

### Responses

#### 200

IP policies retrieved successfully. The response includes an array of IP policies and pagination links.

*   application/json object   

Show application/json properties 

    *   data array of objects Required   An array of IP policies. 

Show data properties 

        *   id string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The unique identifier for the IP policy. 
format = "uid"

        *   name string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The descriptive name for the IP policy. 
        *   enabled boolean   Indicates whether the IP policy is enabled. 
        *   editable boolean   Indicates whether the IP policy can be updated. 
        *   tenantId string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The tenant unique identifier associated with the given IP policy. 
format = "uid"

        *   createdAt string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The timestamp for when the resource was created. 
format = "date-time"

        *   createdBy string   The user ID of the user who created the IP policy. 
        *   deletable boolean   Indicates whether the IP policy can be deleted. 
        *   updatedAt string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The timestamp for when the resource was last updated. 
format = "date-time"

        *   updatedBy string   The user ID of the user who last updated the IP policy. 
        *   allowedIps array of strings   An array of allowed IP addresses. 
        *   toggleable boolean   Indicates whether the IP policy can be enabled/disabled. 

    *   links object Required   Contains pagination links. self is a link to the current results page, next is a link to the next results page and prev is a link to the previous results page 

Show links properties 

        *   next object   A link 

Show next properties 

            *   href string Required   
format = "uri"

        *   prev object   A link 

Show prev properties 

            *   href string Required   
format = "uri"

        *   self object Required   A link 

Show self properties 

            *   href string Required   
format = "uri"

    *   totalResults integer   Indicates the total number of matching documents. Will only be returned if the query parameter "totalResults" is true. 

#### 400

Invalid request parameters for querying IP policies.

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

 GET /api/core/ip-policies

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `GET /api/core/ip-policies` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/core/ip-policies',  {    method: 'GET',    headers: {      'Content-Type': 'application/json',    },  },)
```

`qlik core ip-policy ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/core/ip-policies" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "data": [    {      "id": "507f191e810c19729de860ea",      "name": "Allow access from office IP addresses.",      "enabled": true,      "editable": true,      "tenantId": "644fd58b846d649c82eba436",      "createdAt": "2021-03-21T17:32:28Z",      "createdBy": "507f191e810c19729de860ea",      "deletable": true,      "updatedAt": "2021-03-22T10:01:02Z",      "updatedBy": "507f191e810c19729de860ea",      "allowedIps": [        "61.254.213.0/24",        "22.46.216.142"      ],      "toggleable": true    }  ],  "links": {    "next": {      "href": "http://mytenant.us.qlikcloud.com/api/core/ip-policies?page=QaFdFYW6pImZvRgFaDyB1UffNgfs4mRd"    },    "prev": {      "href": "http://mytenant.us.qlikcloud.com/api/core/ip-policies?page=QaFdFYW6pImZvRgFaDyB1UffNgfs4mRd"    },    "self": {      "href": "http://mytenant.us.qlikcloud.com/api/core/ip-policies?page=QaFdFYW6pImZvRgFaDyB1UffNgfs4mRd"    }  },  "totalResults": 42}`

## [](https://qlik.dev/apis/rest/core/ip-policies/#post-api-core-ip-policies)Create an IP policy

Creates a new IPv4 IP policy in the tenant. If this is the first enabled policy, IP allowlisting will be enabled and access via other IP addresses will be blocked. The user's IP address must be present in at least one policy if allowlisting is enabled. The user must be assigned the `TenantAdmin` role. IPv6 IP addresses are not currently supported.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

*   application/json object   

Show application/json properties 

    *   name string   The descriptive name for the IP policy. 
    *   enabled boolean   Indicates whether the IP policy is enabled. 
default = false

    *   allowedIps array of strings Required   An array of allowed IP IPv4 addresses, either as plain IP addresses, or as CIDR ranges. 

### Responses

#### 201

Request successfully completed.

*   application/json object   

Show application/json properties 

    *   id string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The unique identifier for the IP policy. 
format = "uid"

    *   name string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The descriptive name for the IP policy. 
    *   enabled boolean Required   Indicates whether the IP policy is enabled. 
    *   editable boolean Required   Indicates whether the IP policy can be updated. 
    *   tenantId string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The tenant unique identifier associated with the given IP policy. 
format = "uid"

    *   createdAt string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The timestamp for when the IP policy was created. 
format = "date-time"

    *   createdBy string Required   The user ID of the user who created the IP policy. 
    *   deletable boolean Required   Indicates whether the IP policy can be deleted. 
    *   updatedAt string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The timestamp for when the IP policy was last updated. 
format = "date-time"

    *   updatedBy string Required   The user ID of the user who last updated the IP policy. 
    *   allowedIps array of strings Required   An array of allowed public IPv4 addresses. 
    *   toggleable boolean Required   Indicates whether the IP policy can be enabled/disabled.. 

#### 400

Invalid request body.

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

IP Policy ID not found or Invalid format.

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

 POST /api/core/ip-policies

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `POST /api/core/ip-policies` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/core/ip-policies',  {    method: 'POST',    headers: {      'Content-Type': 'application/json',    },    body: JSON.stringify({      name: 'Allow access from office IP addresses.',      enabled: false,      allowedIps: [        '61.254.213.0/24',        '22.46.216.142',      ],    }),  },)
```

`qlik core ip-policy create \  --allowedIps '61.254.213.0/24,22.46.216.142'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/core/ip-policies" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"name":"Allow access from office IP addresses.","enabled":false,"allowedIps":["61.254.213.0/24","22.46.216.142"]}'`

### Example Response

`{  "id": "507f191e810c19729de860ea",  "name": "Allow access from office IP addresses.",  "enabled": true,  "editable": true,  "tenantId": "644fd58b846d649c82eba436",  "createdAt": "2021-03-21T17:32:28Z",  "createdBy": "507f191e810c19729de860ea",  "deletable": true,  "updatedAt": "2021-03-22T10:01:02Z",  "updatedBy": "507f191e810c19729de860ea",  "allowedIps": [    "61.254.213.0/24",    "22.46.216.142"  ],  "toggleable": true}`

## [](https://qlik.dev/apis/rest/core/ip-policies/#get-api-core-ip-policies-id)Get an IP policy

Retrieves details for a specific IP policy by policy ID.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Path Parameters

*   id string Required   The IP policy unique identifier 

### Responses

#### 200

Request successfully completed.

*   application/json object   

Show application/json properties 

    *   id string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The unique identifier for the IP policy. 
format = "uid"

    *   name string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The descriptive name for the IP policy. 
    *   enabled boolean Required   Indicates whether the IP policy is enabled. 
    *   editable boolean Required   Indicates whether the IP policy can be updated. 
    *   tenantId string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The tenant unique identifier associated with the given IP policy. 
format = "uid"

    *   createdAt string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The timestamp for when the IP policy was created. 
format = "date-time"

    *   createdBy string Required   The user ID of the user who created the IP policy. 
    *   deletable boolean Required   Indicates whether the IP policy can be deleted. 
    *   updatedAt string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The timestamp for when the IP policy was last updated. 
format = "date-time"

    *   updatedBy string Required   The user ID of the user who last updated the IP policy. 
    *   allowedIps array of strings Required   An array of allowed public IPv4 addresses. 
    *   toggleable boolean Required   Indicates whether the IP policy can be enabled/disabled.. 

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

#### 404

IP Policy ID not found or Invalid format.

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

 GET /api/core/ip-policies/{id}

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `GET /api/core/ip-policies/{id}` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/core/ip-policies/{id}',  {    method: 'GET',    headers: {      'Content-Type': 'application/json',    },  },)
```

`qlik core ip-policy get 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/core/ip-policies/{id}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "id": "507f191e810c19729de860ea",  "name": "Allow access from office IP addresses.",  "enabled": true,  "editable": true,  "tenantId": "644fd58b846d649c82eba436",  "createdAt": "2021-03-21T17:32:28Z",  "createdBy": "507f191e810c19729de860ea",  "deletable": true,  "updatedAt": "2021-03-22T10:01:02Z",  "updatedBy": "507f191e810c19729de860ea",  "allowedIps": [    "61.254.213.0/24",    "22.46.216.142"  ],  "toggleable": true}`

## [](https://qlik.dev/apis/rest/core/ip-policies/#patch-api-core-ip-policies-id)Update an IP policy

Updates the IP policy. If this is the first enabled policy in the tenant, IP allowlisting will be enabled and access via other IP addresses will be blocked. The user's IP address must be present in at least one policy if allowlisting is enabled. The user must be assigned the `TenantAdmin` role.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   id string Required   The unique identifier for the IP policy. 

### Request Body

Required

*   application/json array of objects   An array of JSON Patch documents 

Show application/json properties 

    *   op string Required   The operation to be performed. 
Can be one of: "replace"

    *   path string Required   A JSON Pointer. 
Can be one of: "/enabled""/name""/allowedIps"

    *   value string|boolean|array Required   The value to be used for this operation. 

One of:
        *   string   
        *   boolean   
        *   array of strings   

### Responses

#### 204

IP policy updated successfully.

#### 400

Invalid request body.

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

#### 403

Access Denied.

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

IP policy ID not found or Invalid format.

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

 PATCH /api/core/ip-policies/{id}

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `PATCH /api/core/ip-policies/{id}` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/core/ip-policies/{id}',  {    method: 'PATCH',    headers: {      'Content-Type': 'application/json',    },    body: JSON.stringify([      {        op: 'replace',        path: '/name',        value: 'New name',      },      {        op: 'replace',        path: '/allowedIps',        value: [          '61.254.213.0/24',          '22.46.216.142',        ],      },      {        op: 'replace',        path: '/enabled',        value: true,      },    ]),  },)
```

`qlik core ip-policy patch 'string' \  --op 'replace' \  --path '/name' \  --value New name`

`curl "https://{tenant}.{region}.qlikcloud.com/api/core/ip-policies/{id}" \-X PATCH \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '[{"op":"replace","path":"/name","value":"New name"},{"op":"replace","path":"/allowedIps","value":["61.254.213.0/24","22.46.216.142"]},{"op":"replace","path":"/enabled","value":true}]'`

## [](https://qlik.dev/apis/rest/core/ip-policies/#delete-api-core-ip-policies-id)Delete an IP policy

Deletes an IP policy by ID. If this is the last enabled policy in the tenant, IP allowlisting will be disabled and access will be permitted via all IP addresses. The user's IP address must be present in at least one other policy if allowlisting is enabled. The user must be assigned the `TenantAdmin` role.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   id string Required   The unique identifier for the IP policy. 

### Responses

#### 204

IP policy deleted successfully.

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

#### 403

Access Denied.

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

IP policy ID not found or Invalid format.

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

 DELETE /api/core/ip-policies/{id}

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `DELETE /api/core/ip-policies/{id}` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/core/ip-policies/{id}',  {    method: 'DELETE',    headers: {      'Content-Type': 'application/json',    },  },)
```

`qlik core ip-policy rm 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/core/ip-policies/{id}" \-X DELETE \-H "Authorization: Bearer <access_token>"`

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