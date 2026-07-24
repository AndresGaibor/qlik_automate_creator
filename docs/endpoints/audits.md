---
title: "Audits REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/audits/"
local_path: "docs/endpoints/audits.md"
---

Title: Audits REST | Qlik Developer Portal


Audits provides access to events emitted upon each action taken in your tenant, providing detailed access to what's happening in your tenant.

[Download OpenAPI spec](https://qlik.dev/specs/rest/audits.json)

Retrieves list of events for subscribed services for your tenant. Stores events for 90 days, after which they can be accessed via `/v1/audits/archive`.

### Facts

Rate limit[Special](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Header Parameters

*   Authorization string

Required  
The JWT used for authentication. Send the JWT in the AuthRequest header using the Bearer schema.

### Query Parameters

*   eventTime string 
The start/end time interval formatted in ISO 8601 to search by eventTime. For example, "?eventTime=2021-07-14T18:41:15.00Z/2021-07-14T18:41:15.99Z".

pattern = "YYYY-MM-DDThh:mm:ss.sssZ/YYYY-MM-DDThh:mm:ss.sssZ"

*   eventType string 
The case-sensitive string used to search by eventType. Retrieve a list of possible eventTypes with `/v1/audits/types`.

*   id string 
The comma separated list of audit unique identifiers.

*   limit integer 
The maximum number of resources to return for a request.

minimum = 1,  maximum = 100,  default = 10,  format = int64,  default = 10

*   next string 
The cursor to the next page of resources. Provide either the next or prev cursor, but not both.

*   prev string 
The cursor to the previous page of resources. Provide either the next or prev cursor, but not both.

*   sort string 
The property of a resource to sort on (default sort is -eventTime). The supported properties are source, eventType, and eventTime. A property must be prefixed by + or - to indicate ascending or descending sort order respectively.

default = "-eventTime"

*   source string 
The case-sensitive string used to search by source. Retrieve a list of possible sources with `/v1/audits/sources`.

*   userId string 
The case-sensitive string used to search by userId.

### Responses

GET /api/v1/audits

`import { createQlikApi } from '@qlik/api'const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})await qlik.audits.getAudits({})`

### Example Response

`{  "data": [    {      "id": "string",      "data": {},      "links": {        "self": {          "href": "string"        }      },      "source": "string",      "userId": "string",      "eventId": "string",      "tenantId": "string",      "eventTime": "2018-10-30T07:06:22Z",      "eventType": "string",      "extensions": {        "actor": {          "sub": "string",          "subType": "string"        },        "ownerId": "string",        "spaceId": "string",        "topLevelResourceId": "string"      },      "contentType": "string",      "eventTypeVersion": "string"    }  ],  "links": {    "next": {      "href": "string"    },    "prev": {      "href": "string"    },    "self": {      "href": "string"    }  }}`

Finds and returns a specific audit events for the given event ID.

### Facts

Rate limit[Special](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Header Parameters

*   Authorization string

Required  
The JWT used for authentication. Send the JWT in the AuthRequest header using the Bearer schema.

### Path Parameters

*   id string

Required  
The audit item's unique identifier.

### Responses

GET /api/v1/audits/{id}

`import { createQlikApi } from '@qlik/api'const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})await qlik.audits.getAudit('string')`

### Example Response

`{  "id": "string",  "data": {},  "links": {    "self": {      "href": "string"    }  },  "source": "string",  "userId": "string",  "eventId": "string",  "tenantId": "string",  "eventTime": "2018-10-30T07:06:22Z",  "eventType": "string",  "extensions": {    "actor": {      "sub": "string",      "subType": "string"    },    "ownerId": "string",    "spaceId": "string",    "topLevelResourceId": "string"  },  "contentType": "string",  "eventTypeVersion": "string"}`

Returns a Qlik Sense application (QVF file) containing usage data for the tenant's subscription. Requesting user must be assigned the `TenantAdmin` role. Available only for Capacity subscriptions. Consumption report is updated once per day.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Header Parameters

*   Authorization string

Required  
The JWT used for authentication. Send the JWT in the AuthRequest header using the Bearer schema.

### Responses

POST /api/v1/audits/actions/fetch-consumption-app

`import { createQlikApi } from '@qlik/api'const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})await qlik.audits.fetchConsumptionAppAudits()`

### Example Response

`"string"`

Retrieves audit events from long-term storage. Returns all archived audit events for the specified date and tenant, formatted as a JSON array. Archived events are retained for the full lifetime of the tenant, and are not removed or size-limited.

### Facts

Rate limit[Special](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Header Parameters

*   Authorization string

Required  
The JWT is used for authentication. Send the JWT in the AuthRequest header using the Bearer schema.

### Query Parameters

*   date string

Required  
Date to be used as filter and criteria during extraction.

pattern = "YYYY-MM-DD",  format = "date"

### Responses

GET /api/v1/audits/archive

`import { createQlikApi } from '@qlik/api'const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})await qlik.audits.getArchivedAudits({  date: '2020-02-20',})`

### Example Response

`{  "data": [    {      "data": {},      "source": "string",      "userId": "string",      "eventId": "string",      "tenantId": "string",      "eventTime": "2018-10-30T07:06:22Z",      "eventType": "string",      "extensions": {        "actor": {          "sub": "string",          "subType": "string"        },        "ownerId": "string",        "spaceId": "string",        "topLevelResourceId": "string"      },      "contentType": "string",      "eventTypeVersion": "string"    }  ]}`

Returns the server configuration options. It includes options that represent the server configuration state and parameters that were used to run the server with certain functionality.

### Facts

Rate limit[Special](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Header Parameters

*   Authorization string

Required  
The JWT used for authentication. Send the JWT in the AuthRequest header using the Bearer schema.

### Responses

GET /api/v1/audits/settings

`import { createQlikApi } from '@qlik/api'const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})await qlik.audits.getAuditsSettings()`

### Example Response

`{  "data": {    "EventTTL": 42,    "ArchiveEnabled": true  }}`

Finds and returns the list of possible event sources for this tenant.

### Facts

Rate limit[Special](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Header Parameters

*   Authorization string

Required  
The JWT used for authentication. Send the JWT in the AuthRequest header using the Bearer schema.

### Responses

GET /api/v1/audits/sources

`import { createQlikApi } from '@qlik/api'const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})await qlik.audits.getAuditSources()`

### Example Response

`{  "data": [    "string"  ],  "links": {    "next": {      "href": "string"    },    "prev": {      "href": "string"    },    "self": {      "href": "string"    }  }}`

Finds and returns the list of possible event types for this tenant.

### Facts

Rate limit[Special](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Header Parameters

*   Authorization string

Required  
The JWT used for authentication. Send the JWT in the AuthRequest header using the Bearer schema.

### Responses

GET /api/v1/audits/types

`import { createQlikApi } from '@qlik/api'const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})await qlik.audits.getAuditTypes()`

### Example Response

`{  "data": [    "string"  ],  "links": {    "next": {      "href": "string"    },    "prev": {      "href": "string"    },    "self": {      "href": "string"    }  }}`