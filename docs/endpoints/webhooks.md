---
title: "Webhooks REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/webhooks/"
local_path: "docs/endpoints/webhooks.md"
---

Title: Webhooks REST | Qlik Developer Portal


Skip to content
Authenticate
Embed
Extend
Manage
APIs
Toolkits
Changelog
Light
Dark
System
Home
/
APIs
/
REST
Copy page
Webhooks

Webhooks are a way for Qlik Cloud to provide other applications with real-time information.

Download OpenAPI spec
Endpoints
GET
/api/v1/webhooks
POST
/api/v1/webhooks
GET
/api/v1/webhooks/{id}
PATCH
/api/v1/webhooks/{id}
PUT
/api/v1/webhooks/{id}
DELETE
/api/v1/webhooks/{id}
GET
/api/v1/webhooks/{id}/deliveries
GET
/api/v1/webhooks/{id}/deliveries/{deliveryId}
POST
/api/v1/webhooks/{id}/deliveries/{deliveryId}/actions/resend
GET
/api/v1/webhooks/event-types
List webhooks

Retrieves all webhooks entries for a tenant that the user has access to. Users assigned the TenantAdmin role can retrieve all webhooks. A user can have up to 150 webhooks at one time.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
createdByUserId
string

Filter resources by user that created it.

enabled
boolean

Filter resources by enabled true/false.

eventTypes
string

Filter resources by event-type/types, a single webhook item can have multiple event-types.

level
string

Filter resources by level that user has access to (either user or level).

limit
number

Maximum number of webhooks to retrieve.

minimum = 1, maximum = 100, default = 20, default = 20

name
string

Filter resources by name (wildcard and case insensitive).

next
string

Cursor to the next page.

origins
string

Filter resources by origins, supports multiorigin.

Can be one of: "api""automations""management-console"

ownerId
string

Filter resources by user that owns it, only applicable for user level webhooks.

prev
string

Cursor to the previous page.

sort
string

Field to sort by, prefix with -/+ to indicate order.

Can be one of: "name""+name""-name""url""+url""-url""createdAt""+createdAt""-createdAt""updatedAt""+updatedAt""-updatedAt"

default = "-createdAt"

updatedByUserId
string

Filter resources by user that last updated the webhook.

url
string

Filter resources by URL (wildcard and case insensitive).

Responses
200

OK Response

application/json
object
Show application/json properties
400

Bad Request

application/json
object
Show application/json properties
401

Unauthorized

application/json
object
Show application/json properties
403

Forbidden

application/json
object
Show application/json properties
500

Internal Server Error

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
GET
/api/v1/webhooks
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.webhooks.getWebhooks({})
Example Response
{
  "data": [
    {
      "id": "string",
      "url": "string",
      "name": "string",
      "level": "tenant",
      "filter": "id eq \"id123\" or spaceId eq \"spaceId123\" or spaceId eq \"spaceId456\" or topLevelResourceId eq \"id789\"",
      "secret": "string",
      "enabled": false,
      "headers": {
        "headerName": "headerValue"
      },
      "ownerId": "string",
      "createdAt": "2018-10-30T07:06:22Z",
      "updatedAt": "2018-10-30T07:06:22Z",
      "eventTypes": [
        "string"
      ],
      "description": "string",
      "disabledReason": "string",
      "secretKeyAdded": true,
      "createdByUserId": "string",
      "updatedByUserId": "string",
      "encryptedHeaders": [
        "header1",
        "header2"
      ],
      "disabledReasonCode": "string",
      "enableCloudEventDelivery": true,
      "checkCertificateRevocation": false,
      "origin": "api"
    }
  ],
  "links": {
    "next": {
      "href": "string"
    },
    "prev": {
      "href": "string"
    },
    "self": {
      "href": "string"
    }
  }
}
Create a new webhook

Creates a new webhook. User must be assigned the TenantAdmin role to create tenant level webhooks.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
Required
application/json
object
Show application/json properties
Responses
201

OK Response

application/json
object
Show application/json properties
400

Bad Request

application/json
object
Show application/json properties
401

Unauthorized

application/json
object
Show application/json properties
403

Forbidden

application/json
object
Show application/json properties
500

Internal Server Error

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
POST
/api/v1/webhooks
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.webhooks.createWebhook({
  description: 'string',
  eventTypes: ['string'],
  filter:
    'id eq "id123" or spaceId eq "spaceId123" or spaceId eq "spaceId456" or topLevelResourceId eq "id789"',
  headers: { headerName: 'headerValue' },
  level: 'tenant',
  name: 'string',
  ownerId: 'string',
  secret: 'string',
  url: 'string',
  origin: 'api',
})
Example Response
{
  "id": "string",
  "url": "string",
  "name": "string",
  "level": "tenant",
  "filter": "id eq \"id123\" or spaceId eq \"spaceId123\" or spaceId eq \"spaceId456\" or topLevelResourceId eq \"id789\"",
  "secret": "string",
  "enabled": false,
  "headers": {
    "headerName": "headerValue"
  },
  "ownerId": "string",
  "createdAt": "2018-10-30T07:06:22Z",
  "updatedAt": "2018-10-30T07:06:22Z",
  "eventTypes": [
    "string"
  ],
  "description": "string",
  "disabledReason": "string",
  "secretKeyAdded": true,
  "createdByUserId": "string",
  "updatedByUserId": "string",
  "encryptedHeaders": [
    "header1",
    "header2"
  ],
  "disabledReasonCode": "string",
  "enableCloudEventDelivery": true,
  "checkCertificateRevocation": false,
  "origin": "api"
}
Get a webhook

Returns details for a specific webhook.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
id
string
Required

The webhook's unique identifier.

Responses
200

OK Response

application/json
object
Show application/json properties
400

Bad Request

application/json
object
Show application/json properties
401

Unauthorized

application/json
object
Show application/json properties
403

Forbidden

application/json
object
Show application/json properties
404

Not found

application/json
object
Show application/json properties
500

Internal Server Error

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
GET
/api/v1/webhooks/{id}
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.webhooks.getWebhook('string')
Example Response
{
  "id": "string",
  "url": "string",
  "name": "string",
  "level": "tenant",
  "filter": "id eq \"id123\" or spaceId eq \"spaceId123\" or spaceId eq \"spaceId456\" or topLevelResourceId eq \"id789\"",
  "secret": "string",
  "enabled": false,
  "headers": {
    "headerName": "headerValue"
  },
  "ownerId": "string",
  "createdAt": "2018-10-30T07:06:22Z",
  "updatedAt": "2018-10-30T07:06:22Z",
  "eventTypes": [
    "string"
  ],
  "description": "string",
  "disabledReason": "string",
  "secretKeyAdded": true,
  "createdByUserId": "string",
  "updatedByUserId": "string",
  "encryptedHeaders": [
    "header1",
    "header2"
  ],
  "disabledReasonCode": "string",
  "enableCloudEventDelivery": true,
  "checkCertificateRevocation": false,
  "origin": "api"
}
Update one or more webhook properties

Patches a webhook to update one or more properties.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
id
string
Required

The webhook's unique identifier.

Request Body
Required
application/json
array of objects

A JSON Patch document as defined in https://datatracker.ietf.org/doc/html/rfc6902

Show application/json properties
Responses
204

No Content response.

400

Bad Request

application/json
object
Show application/json properties
401

Unauthorized

application/json
object
Show application/json properties
403

Forbidden

application/json
object
Show application/json properties
404

Not found

application/json
object
Show application/json properties
500

Internal Server Error

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
PATCH
/api/v1/webhooks/{id}
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.webhooks.patchWebhook('string', [
  {
    op: 'add',
    path: '/description',
    value: true,
  },
])
Update all webhook properties

Updates a webhook, any omitted fields will be cleared, returns updated webhook.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
id
string
Required

The webhook's unique identifier.

Request Body
Required
application/json
object
Show application/json properties
Responses
200

OK Response

application/json
object
Show application/json properties
400

Bad Request

application/json
object
Show application/json properties
401

Unauthorized

application/json
object
Show application/json properties
403

Forbidden

application/json
object
Show application/json properties
404

Not found

application/json
object
Show application/json properties
500

Internal Server Error

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
PUT
/api/v1/webhooks/{id}
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.webhooks.updateWebhook('string', {
  description: 'string',
  eventTypes: ['string'],
  filter:
    'id eq "id123" or spaceId eq "spaceId123" or spaceId eq "spaceId456" or topLevelResourceId eq "id789"',
  headers: { headerName: 'headerValue' },
  level: 'tenant',
  name: 'string',
  ownerId: 'string',
  secret: 'string',
  url: 'string',
})
Example Response
{
  "id": "string",
  "url": "string",
  "name": "string",
  "level": "tenant",
  "filter": "id eq \"id123\" or spaceId eq \"spaceId123\" or spaceId eq \"spaceId456\" or topLevelResourceId eq \"id789\"",
  "secret": "string",
  "enabled": false,
  "headers": {
    "headerName": "headerValue"
  },
  "ownerId": "string",
  "createdAt": "2018-10-30T07:06:22Z",
  "updatedAt": "2018-10-30T07:06:22Z",
  "eventTypes": [
    "string"
  ],
  "description": "string",
  "disabledReason": "string",
  "secretKeyAdded": true,
  "createdByUserId": "string",
  "updatedByUserId": "string",
  "encryptedHeaders": [
    "header1",
    "header2"
  ],
  "disabledReasonCode": "string",
  "enableCloudEventDelivery": true,
  "checkCertificateRevocation": false,
  "origin": "api"
}
Delete a webhook

Deletes a specific webhook.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
id
string
Required

The webhook's unique identifier.

Responses
204

No Content response.

400

Bad Request

application/json
object
Show application/json properties
401

Unauthorized

application/json
object
Show application/json properties
403

Forbidden

application/json
object
Show application/json properties
404

Not found

application/json
object
Show application/json properties
500

Internal Server Error

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
DELETE
/api/v1/webhooks/{id}
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.webhooks.deleteWebhook('string')
Return deliveries for a webhook

Returns deliveries for a specific webhook. Delivery history is stored for 1 week.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
eventType
string

Filter resources by event-type.

limit
number

Maximum number of deliveries to retrieve.

minimum = 1, maximum = 100, default = 20, default = 20

next
string

Cursor to the next page.

prev
string

Cursor to the previous page.

sort
string

Field to sort by, prefix with -/+ to indicate order.

Can be one of: "status""+status""-status""triggeredAt""+triggeredAt""-triggeredAt"

default = "-triggeredAt"

status
string

Filter resources by status (success or fail).

Can be one of: "success""fail"

Path Parameters
id
string
Required

The webhook's unique identifier.

Responses
200

OK Response

application/json
object
Show application/json properties
400

Bad Request

application/json
object
Show application/json properties
401

Unauthorized

application/json
object
Show application/json properties
403

Forbidden

application/json
object
Show application/json properties
404

Not found

application/json
object
Show application/json properties
500

Internal Server Error

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
GET
/api/v1/webhooks/{id}/deliveries
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.webhooks.getWebhookDeliveries(
  'string',
  {},
)
Example Response
{
  "data": [
    {
      "id": "string",
      "status": "success",
      "request": {
        "url": "string",
        "body": {},
        "headers": {
          "headerName": "headerValue",
          "encryptedHeadersName": "**OMITTED**"
        }
      },
      "response": {
        "body": "string",
        "headers": {
          "headerName": "headerValue",
          "encryptedHeadersName": "**OMITTED**"
        },
        "statusCode": 42
      },
      "eventType": "string",
      "webhookId": "string",
      "triggeredAt": "2018-10-30T07:06:22Z",
      "statusMessage": "string"
    }
  ],
  "links": {
    "next": {
      "href": "string"
    },
    "prev": {
      "href": "string"
    },
    "self": {
      "href": "string"
    }
  }
}
Return details for specific delivery

Returns details for a specific delivery.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
deliveryId
string
Required

The delivery's unique identifier.

id
string
Required

The webhook's unique identifier.

Responses
200

OK Response

application/json
object
Show application/json properties
400

Bad Request

application/json
object
Show application/json properties
401

Unauthorized

application/json
object
Show application/json properties
403

Forbidden

application/json
object
Show application/json properties
404

Not found

application/json
object
Show application/json properties
500

Internal Server Error

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
GET
/api/v1/webhooks/{id}/deliveries/{deliveryId}
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.webhooks.getWebhookDelivery(
  'string',
  'string',
)
Example Response
{
  "id": "string",
  "status": "success",
  "request": {
    "url": "string",
    "body": {},
    "headers": {
      "headerName": "headerValue",
      "encryptedHeadersName": "**OMITTED**"
    }
  },
  "response": {
    "body": "string",
    "headers": {
      "headerName": "headerValue",
      "encryptedHeadersName": "**OMITTED**"
    },
    "statusCode": 42
  },
  "eventType": "string",
  "webhookId": "string",
  "triggeredAt": "2018-10-30T07:06:22Z",
  "statusMessage": "string"
}
Resend delivery

Resends the delivery with the same payload.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
deliveryId
string
Required

The delivery's unique identifier.

id
string
Required

The webhook's unique identifier.

Responses
201

OK Response

application/json
object
Show application/json properties
401

Unauthorized

application/json
object
Show application/json properties
404

Not found.

application/json
object
Show application/json properties
500

Internal Server Error

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
POST
/api/v1/webhooks/{id}/deliveries/{deliveryId}/actions/resend
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.webhooks.resendWebhookDelivery(
  'string',
  'string',
)
Example Response
{
  "id": "string",
  "status": "success",
  "request": {
    "url": "string",
    "body": {},
    "headers": {
      "headerName": "headerValue",
      "encryptedHeadersName": "**OMITTED**"
    }
  },
  "response": {
    "body": "string",
    "headers": {
      "headerName": "headerValue",
      "encryptedHeadersName": "**OMITTED**"
    },
    "statusCode": 42
  },
  "eventType": "string",
  "webhookId": "string",
  "triggeredAt": "2018-10-30T07:06:22Z",
  "statusMessage": "string"
}
List event-types

Lists event-types that are possible to subscribe to.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Responses
200

OK Response

application/json
object
Show application/json properties
401

Unauthorized

application/json
object
Show application/json properties
500

Internal Server Error

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
GET
/api/v1/webhooks/event-types
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.webhooks.getWebhookEventTypes()
Example Response
{
  "data": [
    {
      "name": "string",
      "title": "string",
      "levels": [
        "string"
      ],
      "description": "string"
    }
  ]
}
Was this page helpful?
yesno
Qlik Community
Legal Agreements
/
Legal Policies
/
Privacy & Cookie Notice
/
Terms of Use
/
Do Not Share My Info
Copyright © 1993-2026 QlikTech International AB. All rights reserved.