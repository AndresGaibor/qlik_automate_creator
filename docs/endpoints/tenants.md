---
title: "Tenants REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/tenants/"
local_path: "docs/endpoints/tenants.md"
---

Title: Tenants REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/tenants/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Tenants

*   [Create a tenant](https://qlik.dev/apis/rest/tenants/#post-api-v1-tenants "Create a tenant")
*   [Get a tenant](https://qlik.dev/apis/rest/tenants/#get-api-v1-tenants-tenantId "Get a tenant")
*   [Update a tenant](https://qlik.dev/apis/rest/tenants/#patch-api-v1-tenants-tenantId "Update a tenant")
*   [Deactivate a tenant](https://qlik.dev/apis/rest/tenants/#post-api-v1-tenants-tenantId-actions-deactivate "Deactivate a tenant")
*   [Reactivate a tenant](https://qlik.dev/apis/rest/tenants/#post-api-v1-tenants-tenantId-actions-reactivate "Reactivate a tenant")
*   [Redirect to current tenant](https://qlik.dev/apis/rest/tenants/#get-api-v1-tenants-me "Redirect to current tenant")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/tenants.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Tenants

Tenants are the highest level of logical container, with this API supporting configuration of several key tenant settings.

[Download OpenAPI spec](https://qlik.dev/specs/rest/tenants.json)

## Endpoints

*   [POST /api/v1/tenants](https://qlik.dev/apis/rest/tenants/#post-api-v1-tenants)
*   [GET /api/v1/tenants/{tenantId}](https://qlik.dev/apis/rest/tenants/#get-api-v1-tenants-tenantId)
*   [PATCH /api/v1/tenants/{tenantId}](https://qlik.dev/apis/rest/tenants/#patch-api-v1-tenants-tenantId)
*   [POST /api/v1/tenants/{tenantId}/actions/deactivate](https://qlik.dev/apis/rest/tenants/#post-api-v1-tenants-tenantId-actions-deactivate)
*   [POST /api/v1/tenants/{tenantId}/actions/reactivate](https://qlik.dev/apis/rest/tenants/#post-api-v1-tenants-tenantId-actions-reactivate)
*   [GET /api/v1/tenants/me](https://qlik.dev/apis/rest/tenants/#get-api-v1-tenants-me)

## [](https://qlik.dev/apis/rest/tenants/#post-api-v1-tenants)Create a tenant

Creates a tenant in the requested region, linked to the provided license key. You must use a regional OAuth client generated via the [My Qlik portal](https://account.myqlik.qlik.com/account) to call this endpoint. Tenant creation, deactivation, and reactivation requests must be sent to the register endpoint in the relevant Qlik Cloud region, e.g. `https://register.us.qlikcloud.com/api/v1/tenants` if interacting with tenants in the `us` region.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

*   application/json object   

Show application/json properties 

    *   datacenter string   

The datacenter where the tenant is located.

Supported locations for commercial licenses:

        *   `ap-northeast-1`: Japan (jp)
        *   `ap-southeast-1`: Australia (ap)
        *   `ap-southeast-2`: Singapore (sg)
        *   `eu-central-1`: Germany (de)
        *   `eu-west-1`: Ireland (eu)
        *   `eu-west-2`: United Kingdom (uk)
        *   `us-east-1`: United States of America (us)

    *   licenseKey string   The signed license key of the license that will be associated with the created tenant. 

### Responses

#### 201

Tenant created.

*   application/json object   

Show application/json properties 

    *   id string Required   The unique tenant identifier. 
format = "uid"

    *   name string Required   The display name of the tenant. 
    *   links object   

Show links properties 

        *   self object Required   A link to this tenant. 

Show self properties 

            *   href string Required   URL that defines the resource. 

    *   region string   The region where the tenant is located. 
    *   status string   The status of the tenant. 
Can be one of: "active""disabled""deleted""user-access-disabled"

    *   created string   The timestamp for when the tenant record was created (1970-01-01T00:00:00.001Z for static tenants). 
format = "date"

    *   hostnames array of strings   List of case insensitive hostnames that are mapped to the tenant. The first record maps to the display name and the subsequent entries are aliases. 
    *   datacenter string   The datacenter where the tenant is located. 
    *   lastUpdated string   The timestamp for when the tenant record was last updated (1970-01-01T00:00:00.001Z for static tenants). 
format = "date"

    *   createdByUser string   The user ID who created the tenant. 
    *   statusLastUpdatedAt string   The timestamp for when the tenant status was last changed. 
format = "date-time"

    *   enableAnalyticCreation boolean Deprecated Sunset 2027-03   
default = false

    *   enableAppOpeningFeedback boolean   
default = false

    *   autoAssignCreateSharedSpacesRoleToProfessionals boolean   
default = true

    *   autoAssignDataServicesContributorRoleToProfessionals boolean   
default = true

    *   autoAssignPrivateAnalyticsContentCreatorRoleToProfessionals boolean   
default = true

#### 400

Invalid request was made.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the error. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status string Required   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### 403

Invalid request was made.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the error. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status string Required   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### 500

Internal server error

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the error. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status string Required   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### default

Unexpected error.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the error. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status string Required   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

 POST /api/v1/tenants

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.tenants.createTenant({  datacenter: 'us-east-1',  licenseKey: '1234567890',})
```

`qlik tenant create`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/tenants" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"datacenter":"us-east-1","licenseKey":1234567890}'`

### Example Response

`{  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "name": "QlikTenant",  "links": {    "self": {      "href": "http://foo.example/api/v1/tenants/TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69"    }  },  "region": "us",  "status": "active",  "created": "string",  "hostnames": [    "foo.example"  ],  "datacenter": "us-east-1",  "lastUpdated": "string",  "createdByUser": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy7A",  "statusLastUpdatedAt": "2023-08-18T12:34:56.789Z",  "enableAnalyticCreation": false,  "enableAppOpeningFeedback": false,  "autoAssignCreateSharedSpacesRoleToProfessionals": true,  "autoAssignDataServicesContributorRoleToProfessionals": true,  "autoAssignPrivateAnalyticsContentCreatorRoleToProfessionals": true}`

## [](https://qlik.dev/apis/rest/tenants/#get-api-v1-tenants-tenantId)Get a tenant

Retrieves a specific tenant by ID.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Path Parameters

*   tenantId string Required   The ID of the tenant to retrieve 
format = "uid"

### Responses

#### 200

Tenant found.

*   application/json object   

Show application/json properties 

    *   id string Required   The unique tenant identifier. 
format = "uid"

    *   name string Required   The display name of the tenant. 
    *   links object   

Show links properties 

        *   self object Required   A link to this tenant. 

Show self properties 

            *   href string Required   URL that defines the resource. 

    *   region string   The region where the tenant is located. 
    *   status string   The status of the tenant. 
Can be one of: "active""disabled""deleted""user-access-disabled"

    *   created string   The timestamp for when the tenant record was created (1970-01-01T00:00:00.001Z for static tenants). 
format = "date"

    *   hostnames array of strings   List of case insensitive hostnames that are mapped to the tenant. The first record maps to the display name and the subsequent entries are aliases. 
    *   datacenter string   The datacenter where the tenant is located. 
    *   lastUpdated string   The timestamp for when the tenant record was last updated (1970-01-01T00:00:00.001Z for static tenants). 
format = "date"

    *   createdByUser string   The user ID who created the tenant. 
    *   statusLastUpdatedAt string   The timestamp for when the tenant status was last changed. 
format = "date-time"

    *   enableAnalyticCreation boolean Deprecated Sunset 2027-03   
default = false

    *   enableAppOpeningFeedback boolean   
default = false

    *   autoAssignCreateSharedSpacesRoleToProfessionals boolean   
default = true

    *   autoAssignDataServicesContributorRoleToProfessionals boolean   
default = true

    *   autoAssignPrivateAnalyticsContentCreatorRoleToProfessionals boolean   
default = true

#### 404

Tenant not found.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the error. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status string Required   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### default

Unexpected error

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the error. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status string Required   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

 GET /api/v1/tenants/{tenantId}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.tenants.getTenant(  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',)
```

`qlik tenant get 'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/tenants/{tenantId}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "name": "QlikTenant",  "links": {    "self": {      "href": "http://foo.example/api/v1/tenants/TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69"    }  },  "region": "us",  "status": "active",  "created": "string",  "hostnames": [    "foo.example"  ],  "datacenter": "us-east-1",  "lastUpdated": "string",  "createdByUser": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy7A",  "statusLastUpdatedAt": "2023-08-18T12:34:56.789Z",  "enableAnalyticCreation": false,  "enableAppOpeningFeedback": false,  "autoAssignCreateSharedSpacesRoleToProfessionals": true,  "autoAssignDataServicesContributorRoleToProfessionals": true,  "autoAssignPrivateAnalyticsContentCreatorRoleToProfessionals": true}`

## [](https://qlik.dev/apis/rest/tenants/#patch-api-v1-tenants-tenantId)Update a tenant

Updates properties of a specific tenant by ID.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   tenantId string Required   The ID of the tenant to update 
format = "uid"

### Request Body

Required

*   application/json array of objects   A JSON Patch document as defined in [http://tools.ietf.org/html/rfc6902](http://tools.ietf.org/html/rfc6902). 

Show application/json properties 

    *   op string Required   The operation to be performed. 
Can be one of: "replace"

    *   path string Required   A JSON Pointer value that references a location within the target document where the operation is performed. 
Can be one of: "/name""/hostnames/1""/autoAssignCreateSharedSpacesRoleToProfessionals""/autoAssignPrivateAnalyticsContentCreatorRoleToProfessionals""/autoAssignDataServicesContributorRoleToProfessionals""/enableAnalyticCreation""/enableAppOpeningFeedback"

    *   value string|boolean Required   The value to be used for this operation. 

One of:
        *   string   
        *   boolean   

### Responses

#### 204

Tenant updated successfully

#### 400

Invalid PATCH request

*   application/json object   

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object|array   

One of:
            *   TenantSingleMetaErrorDetail object   

Show TenantSingleMetaErrorDetail properties 

                *   code string   The error code. 
                *   title string   The error summary. 

            *   TenantMultipleMetaErrorsDetail array of objects   

Show TenantMultipleMetaErrorsDetail properties 

                *   code string   The error code. 
                *   title string   The error summary. 

        *   title string Required   Summary of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

#### 403

Forbidden

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the error. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status string Required   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### 404

Tenant not found.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the error. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status string Required   The HTTP status code. 

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
        *   detail string   A human-readable explanation specific to this occurrence of the error. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status string Required   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### default

Unexpected error

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the error. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status string Required   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

 PATCH /api/v1/tenants/{tenantId}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.tenants.patchTenant(  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',  [    {      op: 'replace',      path: '/name',      value: 'Corp',    },
    {      op: 'replace',      path: '/hostnames/1',      value: 'example-tenant.us.qlikcloud.com',    },
    {      op: 'replace',      path: '/autoAssignCreateSharedSpacesRoleToProfessionals',      value: true,    },
    {      op: 'replace',      path: '/autoAssignPrivateAnalyticsContentCreatorRoleToProfessionals',    },
    {      op: 'replace',      path: '/autoAssignDataServicesContributorRoleToProfessionals',      value: true,    },
    {      op: 'replace',      path: '/enableAnalyticCreation',    },  ],)
```

`qlik tenant patch 'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69' \  --op 'replace' \  --path '/name' \  --value Corp`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/tenants/{tenantId}" \-X PATCH \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '[{"op":"replace","path":"/name","value":"Corp"},{"op":"replace","path":"/hostnames/1","value":"example-tenant.us.qlikcloud.com"},{"op":"replace","path":"/autoAssignCreateSharedSpacesRoleToProfessionals","value":true},{"op":"replace","path":"/autoAssignPrivateAnalyticsContentCreatorRoleToProfessionals","value":false},{"op":"replace","path":"/autoAssignDataServicesContributorRoleToProfessionals","value":true},{"op":"replace","path":"/enableAnalyticCreation","value":false}]'`

## [](https://qlik.dev/apis/rest/tenants/#post-api-v1-tenants-tenantId-actions-deactivate)Deactivate a tenant

Deactivates a specific tenant. Once deactivated, tenant will be deleted on or after `estimatedPurgeDate`. Tenant can be reactivated using `/v1/tenants/{tenantId}/actions/reactivate` until this date. You must use a regional OAuth client generated via the [My Qlik portal](https://account.myqlik.qlik.com/account) to call this endpoint. Tenant creation, deactivation, and reactivation requests must be sent to the register endpoint in the relevant Qlik Cloud region, e.g. `https://register.us.qlikcloud.com/api/v1/tenants/{tenantId}/actions/deactivate` if interacting with tenants in the `us` region.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Header Parameters

*   qlik-confirm-hostname string Required   A confirmation string that should match the hostname associated with the tenant resource to be deactivated. Example: unicorn.eu.qlikcloud.com 
format = "hostname"

### Path Parameters

*   tenantId string Required   The id of the tenant to deactivate 
format = "uid"

### Request Body

*   application/json object   A request to deactivate a tenant. 

Show application/json properties 

    *   purgeAfterDays integer   Sets the number of days to purge the tenant after deactivation. Only available to OEMs. 
minimum = 10,  maximum = 90,  default = 30,  default = 30

### Responses

#### 200

Tenant deactivated successfully

*   application/json object   The result of tenant deactivation. 

Show application/json properties 

    *   id string   The unique tenant identifier. 
format = "uid"

    *   status string   The status of the tenant. 
Can be one of: "disabled"

    *   estimatedPurgeDate string   The estimated date time of when tenant will be purged. 
format = "date-time"

#### 400

Invalid request

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the error. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status string Required   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### 403

Forbidden

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the error. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status string Required   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### 404

Tenant Not Found

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the error. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status string Required   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### 412

Precondition Failed (invalid qlik-confirm-hostname value)

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the error. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status string Required   The HTTP status code. 

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
        *   detail string   A human-readable explanation specific to this occurrence of the error. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status string Required   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### default

Unexpected error

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the error. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status string Required   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

 POST /api/v1/tenants/{tenantId}/actions/deactivate

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.tenants.deactivateTenant(  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',  { purgeAfterDays: 30 },)
```

`qlik tenant deactivate 'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/tenants/{tenantId}/actions/deactivate" \-X POST \-H "qlik-confirm-hostname: unicorn.eu.qlikcloud.com" \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"purgeAfterDays":30}'`

### Example Response

`{  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "status": "disabled",  "estimatedPurgeDate": "2023-08-18T00:00:00.000Z"}`

## [](https://qlik.dev/apis/rest/tenants/#post-api-v1-tenants-tenantId-actions-reactivate)Reactivate a tenant

Reactivates a deactivated tenant. Tenants can be reactivated until the `estimatedPurgeDate` provided at time of deactivation. You must use a regional OAuth client generated via the [My Qlik portal](https://account.myqlik.qlik.com/account) to call this endpoint. Tenant creation, deactivation, and reactivation requests must be sent to the register endpoint in the relevant Qlik Cloud region, e.g. `https://register.us.qlikcloud.com/api/v1/tenants/{tenantId}/actions/reactivate` if interacting with tenants in the `us` region.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Header Parameters

*   qlik-confirm-hostname string Required   A confirmation string that should match one of the hostnames of the tenant resource to be reactivated. Example: unicorn.eu.qlikcloud.com 

### Path Parameters

*   tenantId string Required   The id of the tenant to reactivate 
format = "uid"

### Request Body

*   application/json object   

### Responses

#### 200

Tenant reactivated successfully

*   application/json object   

#### 403

Forbidden

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the error. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status string Required   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### 404

Not Found

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the error. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status string Required   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### 412

Precondition Failed (invalid qlik-confirm-hostname value)

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the error. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status string Required   The HTTP status code. 

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
        *   detail string   A human-readable explanation specific to this occurrence of the error. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status string Required   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### default

Unexpected error

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the error. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status string Required   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

 POST /api/v1/tenants/{tenantId}/actions/reactivate

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.tenants.reactivateTenant(  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',  {},)
```

`qlik tenant reactivate 'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/tenants/{tenantId}/actions/reactivate" \-X POST \-H "qlik-confirm-hostname: unicorn.us.qlikcloud.com" \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{}'`

### Example Response

`{}`

## [](https://qlik.dev/apis/rest/tenants/#get-api-v1-tenants-me)Redirect to current tenant

Redirects to current tenant.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Responses

#### 302

Successful redirect.

*   text/html string   

 GET /api/v1/tenants/me

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.tenants.getMyTenant()
```

`qlik tenant me`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/tenants/me" \-H "Authorization: Bearer <access_token>"`

Was this page helpful?
*   yes 
*   no 

![Image 2: Qlik logo](https://qlik.dev/logo-footer.svg)

[Qlik Community](https://community.qlik.com/)

[](https://join.slack.com/t/qlikdeveloper/shared_invite/zt-3wrdlkhog-Dcq9LuCbjNQVN2XaPlgGqQ)[](https://www.facebook.com/qlik)[](https://www.linkedin.com/company/qlik)[](https://x.com/qlikdeveloper)

[Legal Agreements](https://www.qlik.com/us/legal/legal-agreements) / [Legal Policies](https://www.qlik.com/us/legal/legal-policies) / [Privacy & Cookie Notice](https://www.qlik.com/us/legal/privacy-and-cookie-notice) / [Terms of Use](https://qlik.dev/qlik-developer-portal-terms-of-use.pdf) / Do Not Share My Info

 Copyright © 1993-2026 QlikTech International AB. All rights reserved.