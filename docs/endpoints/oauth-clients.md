---
title: "OAuth clients REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/oauth-clients/"
local_path: "docs/endpoints/oauth-clients.md"
---

Title: OAuth clients REST | Qlik Developer Portal


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
OAuth clients

Create and manage the configuration of OAuth clients in your tenant.

Download OpenAPI spec
Endpoints
GET
/api/v1/oauth-clients
POST
/api/v1/oauth-clients
GET
/api/v1/oauth-clients/{id}
PATCH
/api/v1/oauth-clients/{id}
DELETE
/api/v1/oauth-clients/{id}
POST
/api/v1/oauth-clients/{id}/actions/publish
POST
/api/v1/oauth-clients/{id}/client-secrets
DELETE
/api/v1/oauth-clients/{id}/client-secrets/{hint}
GET
/api/v1/oauth-clients/{id}/connection-configs/me
PATCH
/api/v1/oauth-clients/{id}/connection-configs/me
DELETE
/api/v1/oauth-clients/{id}/connection-configs/me
List OAuth clients

Retrieve all OAuth clients.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
filter
string

The filter query that should be used to filter the list of oauth clients. The filter syntax is defined in RFC 7644. Valid attributes for filtering are clientId, clientName, appType, tenantId, and createdByType.

limit
number

The number of OAuth client entries to retrieve.

minimum = 1, maximum = 100, default = 20, default = 20

next
string

The next page cursor

prev
string

The previous page cursor

sort
string

The attribute to sort by, beginning with + for ascending and - for descending. Valid attributes for sorting are clientId, clientName, appType, tenantId, createdAt, updatedAt.

Can be one of: "+clientId""-clientId""+clientName""-clientName""+appType""-appType""+tenantId""-tenantId""+createdAt""-createdAt""+updatedAt""-updatedAt"

totalResults
boolean

Boolean query parameter that determines if the total count of results should be included in the response. If true, the response includes the total number of results in the totalResults field. If false or not included in the query, totalResults will be excluded from the response.

default = false

Responses
200

OK

application/json
object
One of:
OAuthClientAdminListResponse
object

Response schema for listing OAuth clients as an admin user

Show OAuthClientAdminListResponse properties
OAuthClientListResponse
object

Response schema for listing OAuth clients

Show OAuthClientListResponse properties
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
/api/v1/oauth-clients
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


await qlik.oauthClients.getOAuthClients({})
qlik oauth-client ls
curl "https://{tenant}.{region}.qlikcloud.com/api/v1/oauth-clients" \
-H "Authorization: Bearer <access_token>"
Example Response
{
  "data": [
    {
      "appType": "web",
      "logoUri": "string",
      "clientUri": "string",
      "createdAt": "2018-10-30T07:06:22Z",
      "deletedAt": "2018-10-30T07:06:22Z",
      "updatedAt": "2018-10-30T07:06:22Z",
      "clientName": "string",
      "disableTag": "string",
      "publicKeys": [
        {
          "e": "AQAB",
          "n": "0vx7agoebGcQSuuPiLJXZptN9nndrQmbXEps2aiAFbWhM78LhWx",
          "x": "WKn-ZIGevcwGIyyrzFoZNBdaq9_TsqzGl96oc0CWuis",
          "y": "y77t-RvAHRKTsSGdIYUfweuOvwrvDD-Q3Hv5J0fSKbE",
          "alg": "RS256",
          "crv": "P-384",
          "kid": "key-1",
          "kty": "RSA",
          "use": "sig"
        }
      ],
      "description": "string",
      "publishedAt": "2018-10-30T07:06:22Z",
      "allowedScopes": [
        "string"
      ],
      "clientSecrets": [
        {
          "hint": "string",
          "createdAt": "2018-10-30T07:06:22Z",
          "createdBy": "string"
        }
      ],
      "createdByType": "string",
      "connectionConfig": {
        "status": "string",
        "consentMethod": "string",
        "deletedByOwner": true
      },
      "allowedGrantTypes": [
        "client_credentials"
      ],
      "allowedAuthMethods": [
        "client_secret"
      ],
      "clientId": "string",
      "redirectUris": [
        "string"
      ],
      "allowedOrigins": [
        "string"
      ]
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
  },
  "totalResults": 42
}
Create an OAuth client

Create a new OAuth client. Requires TenantAdmin role when created in-tenant. appType cannot be changed after creation. Consent method and published state can be changed after creation. For supported appType, use PATCH /oauth-clients/{id}/connection-configs/me to change consent method, and POST /oauth-clients/{id}/actions/publish to change the client to published after creation.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
Required
application/json
object

Request schema for OAuth client creation

Show application/json properties
Responses
201

Created

application/json
object

Response schema for OAuth client creation

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
/api/v1/oauth-clients
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


await qlik.oauthClients.createOAuthClient({
  allowedGrantTypes: ['client_credentials'],
  allowedOrigins: ['string'],
  allowedScopes: ['string'],
  appType: 'web',
  clientName: 'string',
  clientUri: 'string',
  connectionConfig: { consentMethod: 'trusted' },
  description: 'string',
  logoUri: 'string',
  redirectUris: ['string'],
})
qlik oauth-client create \
  --appType 'web' \
  --clientName 'string' \
  --publicKeys-alg '' \
  --publicKeys-kid '' \
  --publicKeys-kty '' \
  --publicKeys-use ''
curl "https://{tenant}.{region}.qlikcloud.com/api/v1/oauth-clients" \
-X POST \
-H "Content-type: application/json" \
-H "Authorization: Bearer <access_token>" \
-d '{"appType":"web","logoUri":"string","clientUri":"string","clientName":"string","publicKeys":[{"e":"AQAB","n":"0vx7agoebGcQSuuPiLJXZptN9nndrQmbXEps2aiAFbWhM78LhWx","x":"WKn-ZIGevcwGIyyrzFoZNBdaq9_TsqzGl96oc0CWuis","y":"y77t-RvAHRKTsSGdIYUfweuOvwrvDD-Q3Hv5J0fSKbE","alg":"RS256","crv":"P-384","kid":"key-1","kty":"RSA","use":"sig"}],"description":"string","redirectUris":["string"],"allowedScopes":["string"],"allowedOrigins":["string"],"connectionConfig":{"consentMethod":"trusted"},"allowedGrantTypes":["client_credentials"],"allowedAuthMethods":["client_secret"]}'
Example Response
{
  "appType": "web",
  "logoUri": "string",
  "clientUri": "string",
  "createdAt": "2018-10-30T07:06:22Z",
  "deletedAt": "2018-10-30T07:06:22Z",
  "updatedAt": "2018-10-30T07:06:22Z",
  "clientName": "string",
  "disableTag": "string",
  "publicKeys": [
    {
      "e": "AQAB",
      "n": "0vx7agoebGcQSuuPiLJXZptN9nndrQmbXEps2aiAFbWhM78LhWx",
      "x": "WKn-ZIGevcwGIyyrzFoZNBdaq9_TsqzGl96oc0CWuis",
      "y": "y77t-RvAHRKTsSGdIYUfweuOvwrvDD-Q3Hv5J0fSKbE",
      "alg": "RS256",
      "crv": "P-384",
      "kid": "key-1",
      "kty": "RSA",
      "use": "sig"
    }
  ],
  "description": "string",
  "publishedAt": "2018-10-30T07:06:22Z",
  "allowedScopes": [
    "string"
  ],
  "clientSecrets": [
    {
      "hint": "string",
      "createdAt": "2025-12-03T14:59:46.331Z",
      "createdBy": "string"
    }
  ],
  "createdByType": "string",
  "connectionConfig": {
    "consentMethod": "required"
  },
  "allowedGrantTypes": [
    "client_credentials"
  ],
  "allowedAuthMethods": [
    "client_secret"
  ],
  "clientId": "string",
  "clientSecret": "string",
  "redirectUris": [
    "string"
  ],
  "allowedOrigins": [
    "string"
  ]
}
Get an OAuth client

Retrieves the specified OAuth client.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
id
string
Required

The unique identifier for the OAuth client

Responses
200

OK

application/json
object
One of:
OAuthClientAdminReadResponse
object

Response schema for reading an OAuth client as an admin user

Show OAuthClientAdminReadResponse properties
OAuthClientReadResponse
object

Response schema for reading an OAuth client

Show OAuthClientReadResponse properties
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

Not Found

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
/api/v1/oauth-clients/{id}
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


await qlik.oauthClients.getOAuthClient('string')
qlik oauth-client get 'string'
curl "https://{tenant}.{region}.qlikcloud.com/api/v1/oauth-clients/{id}" \
-H "Authorization: Bearer <access_token>"
Example Response
{
  "appType": "web",
  "logoUri": "string",
  "clientUri": "string",
  "createdAt": "2018-10-30T07:06:22Z",
  "deletedAt": "2018-10-30T07:06:22Z",
  "updatedAt": "2018-10-30T07:06:22Z",
  "clientName": "string",
  "disableTag": "string",
  "publicKeys": [
    {
      "e": "AQAB",
      "n": "0vx7agoebGcQSuuPiLJXZptN9nndrQmbXEps2aiAFbWhM78LhWx",
      "x": "WKn-ZIGevcwGIyyrzFoZNBdaq9_TsqzGl96oc0CWuis",
      "y": "y77t-RvAHRKTsSGdIYUfweuOvwrvDD-Q3Hv5J0fSKbE",
      "alg": "RS256",
      "crv": "P-384",
      "kid": "key-1",
      "kty": "RSA",
      "use": "sig"
    }
  ],
  "description": "string",
  "publishedAt": "2018-10-30T07:06:22Z",
  "allowedScopes": [
    "string"
  ],
  "clientSecrets": [
    {
      "hint": "string",
      "createdAt": "2018-10-30T07:06:22Z",
      "createdBy": "string"
    }
  ],
  "createdByType": "string",
  "connectionConfig": {
    "consentMethod": "required"
  },
  "allowedGrantTypes": [
    "client_credentials"
  ],
  "allowedAuthMethods": [
    "client_secret"
  ],
  "clientId": "string",
  "redirectUris": [
    "string"
  ],
  "allowedOrigins": [
    "string"
  ]
}
Update an OAuth client

Updates the specified OAuth client. Returns 202 Accepted with a client secret in the response body if a client secret is generated during the update (e.g., when adding client_secret to allowedAuthMethods). Otherwise returns 204 No Content.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
id
string
Required

The unique identifier for the OAuth client

Request Body
Required
application/json
array of objects

A JSON Patch document as defined in http://tools.ietf.org/html/rfc6902

Show application/json properties
Responses
202

Accepted - Client secret was generated

application/json
object

Response schema for PATCH /oauth-clients when a client secret is generated

Show application/json properties
204

No Content

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

Not Found

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
/api/v1/oauth-clients/{id}
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


await qlik.oauthClients.patchOAuthClient(
  'string',
  [
    {
      op: 'add',
      path: '/allowedOrigins',
      value: 'string',
    },
  ],
)
qlik oauth-client patch 'string' \
  --op 'add' \
  --path '/allowedOrigins'
curl "https://{tenant}.{region}.qlikcloud.com/api/v1/oauth-clients/{id}" \
-X PATCH \
-H "Content-type: application/json" \
-H "Authorization: Bearer <access_token>" \
-d '[{"op":"add","path":"/allowedOrigins","value":"string"}]'
Example Response
{
  "clientSecret": "string"
}
Delete an OAuth client

Delete the specified OAuth client.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Header Parameters
qlik-confirm-delete
string
Required

A confirmation string that should match the id of the oauth-client resource to be deleted

Path Parameters
id
string
Required

The unique identifier for the OAuth client

Responses
204

No Content

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

Not Found

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
/api/v1/oauth-clients/{id}
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


await qlik.oauthClients.deleteOAuthClient(
  'string',
)
qlik oauth-client rm 'string'
curl "https://{tenant}.{region}.qlikcloud.com/api/v1/oauth-clients/{id}" \
-X DELETE \
-H "qlik-confirm-delete: string" \
-H "Authorization: Bearer <access_token>"
Publish an OAuth client

Publishes the specified OAuth client. By default, OAuth clients are bound to the tenant that created it. Publishing shares the client and makes it available to all other tenants within a region. Third-party applications connecting to Qlik Cloud can then have the same client ID for all Qlik Cloud tenants.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
id
string
Required

The unique identifier for the OAuth client

Responses
201

Created

application/json
object

Response schema for successfully publishing an OAuth client

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

Not Found

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
/api/v1/oauth-clients/{id}/actions/publish
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


await qlik.oauthClients.publishOAuthClient(
  'string',
)
qlik oauth-client publish 'string'
curl "https://{tenant}.{region}.qlikcloud.com/api/v1/oauth-clients/{id}/actions/publish" \
-X POST \
-H "Authorization: Bearer <access_token>"
Example Response
{
  "publishedAt": "2018-10-30T07:06:22Z"
}
Create an OAuth client secret

Create a new client secret for the specified OAuth client. An OAuth client can have a maximum of 5 client secrets at one time.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
id
string
Required

The unique identifier for the OAuth client

Responses
201

Created

application/json
object

Response schema for creating an OAuth client application secret

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

Not Found

application/json
object
Show application/json properties
409

The max number of client secrets is 5

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
/api/v1/oauth-clients/{id}/client-secrets
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


await qlik.oauthClients.createOAuthClientSecret(
  'string',
)
qlik oauth-client client-secret create \
  --oauth-clientId 'string'
curl "https://{tenant}.{region}.qlikcloud.com/api/v1/oauth-clients/{id}/client-secrets" \
-X POST \
-H "Authorization: Bearer <access_token>"
Example Response
{
  "hint": "string",
  "clientId": "string",
  "createdAt": "2018-10-30T07:06:22Z",
  "createdBy": "string",
  "clientSecret": "string"
}
Delete an OAuth client secret

Deletes a specific client secret for an OAuth client.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
hint
string
Required

The unique identifier for the OAuth secret

id
string
Required

The unique identifier for the OAuth client

Responses
204

No Content

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

Not Found

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
/api/v1/oauth-clients/{id}/client-secrets/{hint}
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


await qlik.oauthClients.deleteOAuthClientSecret(
  'string',
  'string',
)
qlik oauth-client client-secret rm 'string' \
  --oauth-clientId 'string'
curl "https://{tenant}.{region}.qlikcloud.com/api/v1/oauth-clients/{id}/client-secrets/{hint}" \
-X DELETE \
-H "Authorization: Bearer <access_token>"
Get connection config for an OAuth client

Get configuration for consent method and status.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
id
string
Required

The unique identifier for an OAuth client

Responses
200

OK

application/json
object

Response schema for reading a connection config

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

Not Found

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
/api/v1/oauth-clients/{id}/connection-configs/me
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


await qlik.oauthClients.getOAuthClientConnectionConfig(
  'string',
)
qlik oauth-client connection-config ls 'string'
curl "https://{tenant}.{region}.qlikcloud.com/api/v1/oauth-clients/{id}/connection-configs/me" \
-H "Authorization: Bearer <access_token>"
Example Response
{
  "status": "string",
  "consentMethod": "string",
  "deletedByOwner": true
}
Update connection config for an OAuth client

Updates the consent method for the specified OAuth client.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
id
string
Required

The unique identifier for the OAuth client

Request Body
Required
application/json
array of objects

A JSON Patch document as defined in http://tools.ietf.org/html/rfc6902

Show application/json properties
Responses
204

No Content

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

Not Found

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
/api/v1/oauth-clients/{id}/connection-configs/me
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


await qlik.oauthClients.patchOAuthClientConnectionConfig(
  'string',
  [
    {
      op: 'replace',
      path: '/consentMethod',
      value: 'required',
    },
  ],
)
qlik oauth-client connection-config patch 'string' \
  --op 'replace' \
  --path '/consentMethod' \
  --value 'required'
curl "https://{tenant}.{region}.qlikcloud.com/api/v1/oauth-clients/{id}/connection-configs/me" \
-X PATCH \
-H "Content-type: application/json" \
-H "Authorization: Bearer <access_token>" \
-d '[{"op":"replace","path":"/consentMethod","value":"required"}]'
Delete connection config for an OAuth client

Deletes the connection config for the calling tenant, related to the supplied client id.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
id
string
Required

The unique identifier for the OAuth client

Responses
204

No Content

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

Not Found

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
/api/v1/oauth-clients/{id}/connection-configs/me
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


await qlik.oauthClients.deleteOAuthClientConnectionConfig(
  'string',
)
qlik oauth-client connection-config rm 'string'
curl "https://{tenant}.{region}.qlikcloud.com/api/v1/oauth-clients/{id}/connection-configs/me" \
-X DELETE \
-H "Authorization: Bearer <access_token>"
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