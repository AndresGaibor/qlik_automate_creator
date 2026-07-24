---
title: "Licenses REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/licenses/"
local_path: "docs/endpoints/licenses.md"
---

Title: Licenses REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/licenses/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Licenses

*   [Retrieves assignments for the current tenant](https://qlik.dev/apis/rest/licenses/#get-api-v1-licenses-assignments "Retrieves assignments for the current tenant")
*   [Assigns license access to the given users](https://qlik.dev/apis/rest/licenses/#post-api-v1-licenses-assignments-actions-add "Assigns license access to the given users")
*   [Removes license access for the given users](https://qlik.dev/apis/rest/licenses/#post-api-v1-licenses-assignments-actions-delete "Removes license access for the given users")
*   [Updates license access for the given users](https://qlik.dev/apis/rest/licenses/#post-api-v1-licenses-assignments-actions-update "Updates license access for the given users")
*   [Retrieves license consumption for the current tenant](https://qlik.dev/apis/rest/licenses/#get-api-v1-licenses-consumption "Retrieves license consumption for the current tenant")
*   [Gets the general information of the license applied to the current tenant](https://qlik.dev/apis/rest/licenses/#get-api-v1-licenses-overview "Gets the general information of the license applied to the current tenant")
*   [Get auto assign settings for tenant.](https://qlik.dev/apis/rest/licenses/#get-api-v1-licenses-settings "Get auto assign settings for tenant.")
*   [Set auto assign settings for tenant](https://qlik.dev/apis/rest/licenses/#put-api-v1-licenses-settings "Set auto assign settings for tenant")
*   [Gets the license status information of the current tenant](https://qlik.dev/apis/rest/licenses/#get-api-v1-licenses-status "Gets the license status information of the current tenant")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/licenses.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Licenses

Licenses define tenant and user entitlements, and can be used in conjunction with the consumption API to get a picture of entitlement usage.

[Download OpenAPI spec](https://qlik.dev/specs/rest/licenses.json)

## Endpoints

*   [GET /api/v1/licenses/assignments](https://qlik.dev/apis/rest/licenses/#get-api-v1-licenses-assignments)
*   [POST /api/v1/licenses/assignments/actions/add](https://qlik.dev/apis/rest/licenses/#post-api-v1-licenses-assignments-actions-add)
*   [POST /api/v1/licenses/assignments/actions/delete](https://qlik.dev/apis/rest/licenses/#post-api-v1-licenses-assignments-actions-delete)
*   [POST /api/v1/licenses/assignments/actions/update](https://qlik.dev/apis/rest/licenses/#post-api-v1-licenses-assignments-actions-update)
*   [GET /api/v1/licenses/consumption](https://qlik.dev/apis/rest/licenses/#get-api-v1-licenses-consumption)
*   [GET /api/v1/licenses/overview](https://qlik.dev/apis/rest/licenses/#get-api-v1-licenses-overview)
*   [GET /api/v1/licenses/settings](https://qlik.dev/apis/rest/licenses/#get-api-v1-licenses-settings)
*   [PUT /api/v1/licenses/settings](https://qlik.dev/apis/rest/licenses/#put-api-v1-licenses-settings)
*   [GET /api/v1/licenses/status](https://qlik.dev/apis/rest/licenses/#get-api-v1-licenses-status)

## [](https://qlik.dev/apis/rest/licenses/#get-api-v1-licenses-assignments)Retrieves assignments for the current tenant

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Header Parameters

*   authorization string   Authentication token 
format = "bearer"

### Query Parameters

*   filter string   The filter for finding entries. 
*   limit integer   The preferred number of entries to return. 
minimum = 1,  maximum = 100,  default = 20,  format = int32,  default = 20

*   orphans boolean   Only return assignments which are 'orphans' in the current tenant. 
*   page string   The requested page. 
*   sort string   The field to sort on; can be prefixed with +/- for ascending/descending sort order. 

### Responses

#### 200

List of assignments.

*   application/json object   

Show application/json properties 

    *   data array of objects Required   

Show data properties 

        *   type string Required   Allotment type 
        *   excess boolean Required   Assignment excess status. 
        *   created string Required   Assignment created date. 
        *   subject string Required   Subject 

    *   links object Required   

Show links properties 

        *   next object   

Show next properties 

            *   href string   link 

        *   prev object   

Show prev properties 

            *   href string   link 

#### 400

Bad request, invalid query.

*   application/json object   

Show application/json properties 

    *   error string Deprecated Required   Error type 
    *   errors array of objects Required   

Show errors properties 

        *   code string Required   Error code 
        *   title string Required   Error title 
        *   detail string   Additional error detail. 

    *   message string Deprecated Required   Error message 

#### 401

Unauthorized (invalid token).

*   application/json object   

Show application/json properties 

    *   error string Deprecated Required   Error type 
    *   errors array of objects Required   

Show errors properties 

        *   code string Required   Error code 
        *   title string Required   Error title 
        *   detail string   Additional error detail. 

    *   message string Deprecated Required   Error message 

#### 403

Insufficient access

*   application/json object   

Show application/json properties 

    *   error string Deprecated Required   Error type 
    *   errors array of objects Required   

Show errors properties 

        *   code string Required   Error code 
        *   title string Required   Error title 
        *   detail string   Additional error detail. 

    *   message string Deprecated Required   Error message 

 GET /api/v1/licenses/assignments

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.licenses.getLicenseAssignments({})
```

`qlik license assignment ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/licenses/assignments" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "data": [    {      "type": "analyzer",      "excess": false,      "created": "2020-12-03T09:24:48.114Z",      "subject": "qlik\\kalle"    },    {      "type": false,      "created": "2020-12-03T09:24:48.114Z",      "subject": "qlik\\nalle"    }  ],  "links": {    "next": {      "href": "http://license/v1/licenses/assignments?limit=4&page=bmV4dDpGZ0FBQUFkZmFXUUFYOHBUcTlpM1U4UU1YWHZrQUE%3D"    },    "prev": {      "href": "http://license/v1/licenses/assignments?limit=4&page=cHJldjpGZ0FBQUFkZmFXUUFYOHBUcTlpM1U4UU1YWHZ0QUE%3D"    }  }}`

## [](https://qlik.dev/apis/rest/licenses/#post-api-v1-licenses-assignments-actions-add)Assigns license access to the given users

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Header Parameters

*   authorization string   Authentication token 
format = "bearer"

### Request Body

Required

List of subjects to allocate assignments for.

*   application/json object   

Show application/json properties 

    *   add array of objects Required   

Show add properties 

        *   name string Deprecated   User name 
        *   type string Required   Allotment type 
        *   userId string Deprecated   User ID 
        *   subject string Required   User subject 

### Responses

#### 207

Processed. (The status of the individual assignments is found in the response body)

*   application/json object   

Show application/json properties 

    *   data array of objects Required   

Show data properties 

        *   code string   Error code 
        *   type string   Allotment type 
        *   title string   Error title 
        *   status integer Required   Response status 
        *   subject string Required   Subject 

#### 400

Body is invalid or missing.

*   application/json object   

Show application/json properties 

    *   error string Deprecated Required   Error type 
    *   errors array of objects Required   

Show errors properties 

        *   code string Required   Error code 
        *   title string Required   Error title 
        *   detail string   Additional error detail. 

    *   message string Deprecated Required   Error message 

#### 401

Unauthorized (invalid token).

*   application/json object   

Show application/json properties 

    *   error string Deprecated Required   Error type 
    *   errors array of objects Required   

Show errors properties 

        *   code string Required   Error code 
        *   title string Required   Error title 
        *   detail string   Additional error detail. 

    *   message string Deprecated Required   Error message 

#### 403

Insufficient access

*   application/json object   

Show application/json properties 

    *   error string Deprecated Required   Error type 
    *   errors array of objects Required   

Show errors properties 

        *   code string Required   Error code 
        *   title string Required   Error title 
        *   detail string   Additional error detail. 

    *   message string Deprecated Required   Error message 

 POST /api/v1/licenses/assignments/actions/add

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.licenses.addLicenseAssignments({  add: [    {      subject: 'qlik\kalle',      type: 'professional',    },
    { subject: 'qlik\nalle', type: 'analyzer' },  ],})
```

`qlik license assignment add \  --add-name '' \  --add-subject '' \  --add-type '' \  --add-userId ''`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/licenses/assignments/actions/add" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"add":[{"type":"professional","subject":"qlik\\kalle"},{"type":"analyzer","subject":"qlik\\nalle"}]}'`

### Example Response

`{  "data": [    {      "type": "professional",      "status": 201,      "subject": "qlik\\kalle"    },    {      "code": "LICENSES-011",      "type": "analyzer",      "title": "No available allotment error, No available allotment.",      "status": 403,      "subject": "qlik\\nalle"    }  ]}`

## [](https://qlik.dev/apis/rest/licenses/#post-api-v1-licenses-assignments-actions-delete)Removes license access for the given users

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Header Parameters

*   authorization string   Authentication token 
format = "bearer"

### Request Body

Required

List of assignments to delete.

*   application/json object   

Show application/json properties 

    *   delete array of objects Required   

Show delete properties 

        *   type string Required   Allotment type 
        *   subject string Required   User subject 

### Responses

#### 207

Processed. (The status of the individual assignments is found in the response body)

*   application/json object   

Show application/json properties 

    *   data array of objects Required   

Show data properties 

        *   code string   Error code 
        *   type string   Allotment type 
        *   title string   Error title 
        *   status integer Required   Response status 
        *   subject string   Subject 

#### 400

Body is invalid or missing.

*   application/json object   

Show application/json properties 

    *   error string Deprecated Required   Error type 
    *   errors array of objects Required   

Show errors properties 

        *   code string Required   Error code 
        *   title string Required   Error title 
        *   detail string   Additional error detail. 

    *   message string Deprecated Required   Error message 

#### 401

Unauthorized (invalid token).

*   application/json object   

Show application/json properties 

    *   error string Deprecated Required   Error type 
    *   errors array of objects Required   

Show errors properties 

        *   code string Required   Error code 
        *   title string Required   Error title 
        *   detail string   Additional error detail. 

    *   message string Deprecated Required   Error message 

#### 403

Insufficient access

*   application/json object   

Show application/json properties 

    *   error string Deprecated Required   Error type 
    *   errors array of objects Required   

Show errors properties 

        *   code string Required   Error code 
        *   title string Required   Error title 
        *   detail string   Additional error detail. 

    *   message string Deprecated Required   Error message 

 POST /api/v1/licenses/assignments/actions/delete

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.licenses.deleteLicenseAssignments({  delete: [    { subject: 'qlik\malik', type: 'analyzer' },  ],})
```

`qlik license assignment delete \  --delete-subject '' \  --delete-type ''`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/licenses/assignments/actions/delete" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"delete":[{"type":"analyzer","subject":"qlik\\malik"}]}'`

### Example Response

`{  "data": [    {      "type": "professional",      "status": 200,      "subject": "qlik\\malik"    },    {      "code": "LICENSES-016",      "type": "analyzer",      "title": "Assignment not found.",      "status": 404,      "subject": "qlik\\no"    }  ]}`

## [](https://qlik.dev/apis/rest/licenses/#post-api-v1-licenses-assignments-actions-update)Updates license access for the given users

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Header Parameters

*   authorization string   Authentication token 
format = "bearer"

### Request Body

Required

List of assignments to update.

*   application/json object   

Show application/json properties 

    *   update array of objects Required   

Show update properties 

        *   type string   Target assignment type. 
        *   subject string Required   User subject, the current or the desired after the patch. 
        *   sourceType string   Current assignment type. 
        *   sourceSubject string   The current user subject, in case that should be patched. 

### Responses

#### 207

Processed. (The status of the individual assignments is found in the response body)

*   application/json object   

Show application/json properties 

    *   data array of objects Required   

Show data properties 

        *   code string   Error code 
        *   type string   Target allotment type. 
        *   title string   Error title 
        *   status integer Required   HTTP status code indicating the result of the individual assignment operation. A value of 200 represents a successful update, while 201 indicates a new resource was created due to a subject update. Any 400-level status codes indicate an error. 
        *   subject string   Target subject. 
        *   sourceType string   Current allotment type. 
        *   sourceSubject string   Current subject. 

#### 400

Body is invalid or missing.

*   application/json object   

Show application/json properties 

    *   error string Deprecated Required   Error type 
    *   errors array of objects Required   

Show errors properties 

        *   code string Required   Error code 
        *   title string Required   Error title 
        *   detail string   Additional error detail. 

    *   message string Deprecated Required   Error message 

#### 401

Unauthorized (invalid token).

*   application/json object   

Show application/json properties 

    *   error string Deprecated Required   Error type 
    *   errors array of objects Required   

Show errors properties 

        *   code string Required   Error code 
        *   title string Required   Error title 
        *   detail string   Additional error detail. 

    *   message string Deprecated Required   Error message 

#### 403

Insufficient access

*   application/json object   

Show application/json properties 

    *   error string Deprecated Required   Error type 
    *   errors array of objects Required   

Show errors properties 

        *   code string Required   Error code 
        *   title string Required   Error title 
        *   detail string   Additional error detail. 

    *   message string Deprecated Required   Error message 

 POST /api/v1/licenses/assignments/actions/update

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.licenses.updateLicenseAssignments({  update: [    {      sourceType: 'analyzer',      subject: 'qlik\malik',      type: 'professional',    },  ],})
```

`qlik license assignment update \  --update-sourceSubject '' \  --update-sourceType '' \  --update-subject '' \  --update-type ''`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/licenses/assignments/actions/update" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"update":[{"type":"professional","subject":"qlik\\malik","sourceType":"analyzer"}]}'`

### Example Response

`{  "data": [    {      "type": "professional",      "status": 200,      "subject": "qlik\\malik",      "sourceType": "analyzer"    },    {      "code": "LICENSES-016",      "title": "Assignment not found.",      "status": 404,      "subject": "qlik/sara",      "sourceType": "analyzer"    }  ]}`

## [](https://qlik.dev/apis/rest/licenses/#get-api-v1-licenses-consumption)Retrieves license consumption for the current tenant

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Header Parameters

*   authorization string   Authentication token 
format = "bearer"

### Query Parameters

*   filter string   The SCIM filter for the query. Filterable property is "endTime". 
*   limit integer   The preferred number of entries to return. 
minimum = 1,  maximum = 200,  default = 200,  format = int32,  default = 200

*   page string   The requested page. 
*   sort string   The field to sort on; can be prefixed with +/- for ascending/descending sort order. 

### Responses

#### 200

Successful

*   application/json object   

Show application/json properties 

    *   data array of objects Required   

Show data properties 

        *   id string   ID 
        *   appId string   App ID 
        *   userId string   User ID 
        *   endTime string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   Engine session end time. 
        *   duration string   Engine session duration. 
        *   sessionId string   Engine session ID. 
        *   allotmentId string   Allotment ID 
        *   minutesUsed integer   Analyzer capacity minutes consumed. 
        *   capacityUsed integer   Analyzer capacity chunks consumed. 
        *   licenseUsage string   License usage 

    *   links object Required   

Show links properties 

        *   next object   

Show next properties 

            *   href string   link 

        *   prev object   

Show prev properties 

            *   href string   link 

#### 400

Bad request, malformed query.

*   application/json object   

Show application/json properties 

    *   error string Deprecated Required   Error type 
    *   errors array of objects Required   

Show errors properties 

        *   code string Required   Error code 
        *   title string Required   Error title 
        *   detail string   Additional error detail. 

    *   message string Deprecated Required   Error message 

#### 401

Unauthorized (invalid token).

*   application/json object   

Show application/json properties 

    *   error string Deprecated Required   Error type 
    *   errors array of objects Required   

Show errors properties 

        *   code string Required   Error code 
        *   title string Required   Error title 
        *   detail string   Additional error detail. 

    *   message string Deprecated Required   Error message 

#### 403

Insufficient access

*   application/json object   

Show application/json properties 

    *   error string Deprecated Required   Error type 
    *   errors array of objects Required   

Show errors properties 

        *   code string Required   Error code 
        *   title string Required   Error title 
        *   detail string   Additional error detail. 

    *   message string Deprecated Required   Error message 

 GET /api/v1/licenses/consumption

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.licenses.getLicenseConsumption({})
```

`qlik license consumption ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/licenses/consumption" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "data": [    {      "id": "string",      "appId": "string",      "userId": "string",      "endTime": "string",      "duration": "string",      "sessionId": "string",      "allotmentId": "string",      "minutesUsed": 42,      "capacityUsed": 42,      "licenseUsage": "string"    }  ],  "links": {    "next": {      "href": "string"    },    "prev": {      "href": "string"    }  }}`

## [](https://qlik.dev/apis/rest/licenses/#get-api-v1-licenses-overview)Gets the general information of the license applied to the current tenant

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Header Parameters

*   authorization string   Authentication token. 
format = "bearer"

### Responses

#### 200

Licenses overview info.

*   application/json object   

Show application/json properties 

    *   trial boolean Required   Boolean indicating if it is a trial license. 
    *   valid string Required   Period that the license is currently set to be active. Represented as an ISO 8601 time interval with start and end. 
    *   origin string Required   Origin of license key. 
Can be one of: "Internal""External"

    *   status string Required   Enum with status of license. Only status Ok grants license. access. 
Can be one of: "Ok""Blacklisted""Expired"

    *   product string Required   The product the license is valid for. 
    *   updated string Required   An ISO 8601 timestamp for when the license was last updated. 
    *   allotments array of objects Required   

Show allotments properties 

        *   name string Required   
Can be one of: "professional""analyzer""analyzer_time"

        *   units integer Required   
        *   overage integer   Overage value; -1 means unbounded overage. 
        *   unitsUsed integer Required   
        *   usageClass string Required   

    *   changeTime string   An ISO 8601 timestamp for when the license was last changed. 
    *   customerId string   Customer ID 
    *   licenseKey string Required   
    *   parameters array of objects Required   The license parameters. 

Show parameters properties 

        *   name string Required   Parameter set (provision) name. 
        *   valid string Required   Time interval for parameter validity. 
pattern = "^(\.|\d{4}-\d{2}-\d{2})/(\.|\d{4}-\d{2}-\d{2})$"

        *   access object   Parameters for licenses to control access to the parameters. 

Show access properties 

            *   allotment string   Name of an allotment that the user must have access to. to 

        *   values object   Parameter values 

    *   licenseType string   
    *   licenseNumber string Required   
    *   latestValidTime string   An ISO 8601 timestamp for when the latest time the license has been known to be valid, a missing value indicates the indefinite future. 
    *   secondaryNumber string Required   The secondary number of a definition. 
    *   capabilityBankId string   the capability bank id 
    *   parentLicenseNumber string   the parent number of the license. can be shared by multiple license numbers 

#### 400

invalid tenant

*   application/json object   

Show application/json properties 

    *   error string Deprecated Required   Error type 
    *   errors array of objects Required   

Show errors properties 

        *   code string Required   Error code 
        *   title string Required   Error title 
        *   detail string   Additional error detail. 

    *   message string Deprecated Required   Error message 

#### 401

Unauthorized (invalid token).

*   application/json object   

Show application/json properties 

    *   error string Deprecated Required   Error type 
    *   errors array of objects Required   

Show errors properties 

        *   code string Required   Error code 
        *   title string Required   Error title 
        *   detail string   Additional error detail. 

    *   message string Deprecated Required   Error message 

#### 404

License not found.

*   application/json object   

Show application/json properties 

    *   error string Deprecated Required   Error type 
    *   errors array of objects Required   

Show errors properties 

        *   code string Required   Error code 
        *   title string Required   Error title 
        *   detail string   Additional error detail. 

    *   message string Deprecated Required   Error message 

 GET /api/v1/licenses/overview

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.licenses.getLicenseOverview()
```

`qlik license overview`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/licenses/overview" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "trial": false,  "valid": "2018-01-01/2018-12-31",  "origin": "Internal",  "status": "Ok",  "product": "Qlik Sense Enterprise SaaS",  "allotments": [    {      "name": "analyzer_time",      "units": 300,      "overage": 100,      "unitsUsed": 242,      "usageClass": "time"    },    {      "name": "professional",      "units": 200,      "unitsUsed": 15,      "usageClass": "assigned"    }  ],  "licenseKey": "hejhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6IktFWTEifQ.eyJqdGkiOiIxZjZkZTc0Zi04MDcyLTRjMTQtYjc1OS02ZjlkYmJmYWM5MjAiLCJsaWNlbnNlIjoiOTk5OTAwMDAwMDAwMTIzNCJ9.fwa6l6gY1MR_Ja2OMnV65V68fbzQYW5OAKUFnLfG9oZjNAbjhdDkZvS2S2zHaBnSrSva1ARh5iq_S0KTBOKKcJJDTb7jRVURyaAvbCuBDk_0ITrUudHaT9U_Mc9EKkfT8mR6vthhZxVzEhyYPFS7gDw7M6bav2ntpDsoJFPgous",  "parameters": [    {      "name": "qlikAlerting",      "valid": "./.",      "values": {        "saas_alerting": "FULL"      }    }  ],  "licenseNumber": "9999000000001204",  "secondaryNumber": "12345"}`

## [](https://qlik.dev/apis/rest/licenses/#get-api-v1-licenses-settings)Get auto assign settings for tenant.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Header Parameters

*   authorization string   Authentication token 
format = "bearer"

### Responses

#### 200

Auto assign settings.

*   application/json object   

Show application/json properties 

    *   autoAssignAnalyzer boolean   If analyzer users are available, they will be automatically assigned. Otherwise, analyzer capacity will be assigned, if available. 
    *   autoAssignProfessional boolean   If professional users are available, they will be automatically assigned. Otherwise, analyzer capacity will be assigned, if available. 

#### 400

Missing or invalid tenant.

*   application/json object   

Show application/json properties 

    *   error string Deprecated Required   Error type 
    *   errors array of objects Required   

Show errors properties 

        *   code string Required   Error code 
        *   title string Required   Error title 
        *   detail string   Additional error detail. 

    *   message string Deprecated Required   Error message 

#### 401

Not allowed

*   application/json object   

Show application/json properties 

    *   error string Deprecated Required   Error type 
    *   errors array of objects Required   

Show errors properties 

        *   code string Required   Error code 
        *   title string Required   Error title 
        *   detail string   Additional error detail. 

    *   message string Deprecated Required   Error message 

#### 403

Insufficient access

*   application/json object   

Show application/json properties 

    *   error string Deprecated Required   Error type 
    *   errors array of objects Required   

Show errors properties 

        *   code string Required   Error code 
        *   title string Required   Error title 
        *   detail string   Additional error detail. 

    *   message string Deprecated Required   Error message 

 GET /api/v1/licenses/settings

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.licenses.getLicenseSettings()
```

`qlik license settings ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/licenses/settings" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "autoAssignAnalyzer": true,  "autoAssignProfessional": false}`

## [](https://qlik.dev/apis/rest/licenses/#put-api-v1-licenses-settings)Set auto assign settings for tenant

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Header Parameters

*   authorization string   Authentication token 
format = "bearer"

### Request Body

Dynamic assignment settings for professional and analyzer users. If professional users and analyzer users are both set, professional users will be automatically assigned, if available. Otherwise, analyzer users will be assigned. If neither of those users are available, analyzer capacity will be assigned, if available.

*   application/json object   

Show application/json properties 

    *   autoAssignAnalyzer boolean   If analyzer users are available, they will be automatically assigned. Otherwise, analyzer capacity will be assigned, if available. 
    *   autoAssignProfessional boolean   If professional users are available, they will be automatically assigned. Otherwise, analyzer capacity will be assigned, if available. 

### Responses

#### 200

Auto assign settings.

*   application/json object   

Show application/json properties 

    *   autoAssignAnalyzer boolean   If analyzer users are available, they will be automatically assigned. Otherwise, analyzer capacity will be assigned, if available. 
    *   autoAssignProfessional boolean   If professional users are available, they will be automatically assigned. Otherwise, analyzer capacity will be assigned, if available. 

#### 400

Missing or invalid tenant.

*   application/json object   

Show application/json properties 

    *   error string Deprecated Required   Error type 
    *   errors array of objects Required   

Show errors properties 

        *   code string Required   Error code 
        *   title string Required   Error title 
        *   detail string   Additional error detail. 

    *   message string Deprecated Required   Error message 

#### 401

Action not allowed.

*   application/json object   

Show application/json properties 

    *   error string Deprecated Required   Error type 
    *   errors array of objects Required   

Show errors properties 

        *   code string Required   Error code 
        *   title string Required   Error title 
        *   detail string   Additional error detail. 

    *   message string Deprecated Required   Error message 

#### 403

Insufficient access

*   application/json object   

Show application/json properties 

    *   error string Deprecated Required   Error type 
    *   errors array of objects Required   

Show errors properties 

        *   code string Required   Error code 
        *   title string Required   Error title 
        *   detail string   Additional error detail. 

    *   message string Deprecated Required   Error message 

 PUT /api/v1/licenses/settings

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.licenses.updateLicenseSettings({  autoAssignAnalyzer: true,})
```

`qlik license settings update`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/licenses/settings" \-X PUT \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"autoAssignAnalyzer":true,"autoAssignProfessional":false}'`

### Example Response

`{  "autoAssignAnalyzer": true,  "autoAssignProfessional": false}`

## [](https://qlik.dev/apis/rest/licenses/#get-api-v1-licenses-status)Gets the license status information of the current tenant

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Header Parameters

*   authorization string   Authentication token 
format = "bearer"

### Responses

#### 200

License status info.

*   application/json object   

Show application/json properties 

    *   type string Required   Type of license key. 
Can be one of: "Signed""Plain""2.0"

    *   trial boolean Required   Boolean indicating if it is a trial license. 
    *   valid string Required   Period that the license is currently set to be active. Represented as an ISO 8601 time interval with start and end. 
    *   origin string Required   Origin of license key. 
Can be one of: "Internal""External"

    *   status string Required   Enum with status of license. Only status Ok grants license. access. 
Can be one of: "Ok""Blacklisted""Expired""Missing"

    *   product string Required   The product the license is valid for. 
    *   deactivated boolean Required   Boolean indicating if the license is deactivated. 
    *   extensionStatus string Required   Enum with extension status of license. access. 
Can be one of: "Unavailable""Pending""Available"

#### 400

invalid tenant

*   application/json object   

Show application/json properties 

    *   error string Deprecated Required   Error type 
    *   errors array of objects Required   

Show errors properties 

        *   code string Required   Error code 
        *   title string Required   Error title 
        *   detail string   Additional error detail. 

    *   message string Deprecated Required   Error message 

#### 401

Unauthorized (invalid token).

*   application/json object   

Show application/json properties 

    *   error string Deprecated Required   Error type 
    *   errors array of objects Required   

Show errors properties 

        *   code string Required   Error code 
        *   title string Required   Error title 
        *   detail string   Additional error detail. 

    *   message string Deprecated Required   Error message 

 GET /api/v1/licenses/status

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.licenses.getLicenseStatus()
```

`qlik license status`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/licenses/status" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "type": "Signed",  "trial": false,  "valid": "2018-01-01/2018-12-31",  "origin": "Internal",  "status": "Ok",  "product": "Qlik Sense Business",  "extensionStatus": "Unavailable"}`

Was this page helpful?
*   yes 
*   no 

![Image 2: Qlik logo](https://qlik.dev/logo-footer.svg)

[Qlik Community](https://community.qlik.com/)

[](https://join.slack.com/t/qlikdeveloper/shared_invite/zt-3wrdlkhog-Dcq9LuCbjNQVN2XaPlgGqQ)[](https://www.facebook.com/qlik)[](https://www.linkedin.com/company/qlik)[](https://x.com/qlikdeveloper)

[Legal Agreements](https://www.qlik.com/us/legal/legal-agreements) / [Legal Policies](https://www.qlik.com/us/legal/legal-policies) / [Privacy & Cookie Notice](https://www.qlik.com/us/legal/privacy-and-cookie-notice) / [Terms of Use](https://qlik.dev/qlik-developer-portal-terms-of-use.pdf) / Do Not Share My Info

 Copyright © 1993-2026 QlikTech International AB. All rights reserved.