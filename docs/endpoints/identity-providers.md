---
title: "Identity providers REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/identity-providers/"
local_path: "docs/endpoints/identity-providers.md"
---

Title: Identity providers REST | Qlik Developer Portal


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
Identity providers

Identity providers define how your users authenticate to your tenant when attempting to access content.

Download OpenAPI spec
Endpoints
GET
/api/v1/identity-providers
POST
/api/v1/identity-providers
GET
/api/v1/identity-providers/.well-known/metadata.json
GET
/api/v1/identity-providers/{id}
PATCH
/api/v1/identity-providers/{id}
DELETE
/api/v1/identity-providers/{id}
GET
/api/v1/identity-providers/me/meta
GET
/api/v1/identity-providers/status
List IdPs

This endpoint retrieves any IdPs registered on the tenant.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
active
boolean

If provided, filters the results by the active field.

limit
number

The number of IdP entries to retrieve.

minimum = 1, maximum = 100, default = 20, default = 20

next
string

The next page cursor.

prev
string

The previous page cursor.

Responses
200

Success

application/json
object
Show application/json properties
404

Not Found

application/json
object

A representation of the errors encountered from the HTTP request.

Show application/json properties
GET
/api/v1/identity-providers
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


await qlik.identityProviders.getIdps({})
Example Response
{
  "data": [
    {
      "id": "string",
      "meta": {},
      "active": true,
      "created": "2018-10-30T07:06:22Z",
      "protocol": "OIDC",
      "provider": "auth0",
      "tenantIds": [
        "string"
      ],
      "description": "string",
      "interactive": true,
      "lastUpdated": "2018-10-30T07:06:22Z",
      "clockToleranceSec": 42,
      "createNewUsersOnLogin": true,
      "postLogoutRedirectUri": "string",
      "options": {
        "realm": "string",
        "scope": "string",
        "issuer": "string",
        "clientId": "string",
        "clientSecret": "string",
        "discoveryUrl": "string",
        "claimsMapping": {
          "sub": [
            "string"
          ],
          "name": [
            "string"
          ],
          "email": [
            "string"
          ],
          "groups": [
            "string"
          ],
          "locale": [
            "string"
          ],
          "picture": [
            "string"
          ],
          "zoneinfo": [
            "string"
          ],
          "client_id": [
            "string"
          ],
          "email_verified": [
            "string"
          ]
        },
        "decryptingKey": {
          "jwks": "string",
          "keyId": "string",
          "keySize": 42,
          "keyType": "string",
          "createdAt": "2018-10-30T07:06:22Z",
          "createdBy": "string",
          "publicKey": "string",
          "certificate": "string"
        },
        "openid_configuration": {
          "issuer": "string",
          "jwks_uri": "string",
          "token_endpoint": "string",
          "userinfo_endpoint": "string",
          "end_session_endpoint": "string",
          "authorization_endpoint": "string",
          "introspection_endpoint": "string"
        },
        "blockOfflineAccessScope": true,
        "emailVerifiedAlwaysTrue": true
      },
      "pendingState": "verified",
      "pendingResult": {
        "error": "string",
        "status": "success",
        "started": "2018-10-30T07:06:22Z",
        "protocol": "OIDC",
        "idpClaims": {},
        "oauth2Error": {
          "error": "string",
          "errorURI": "string",
          "errorDescription": "string"
        },
        "resultantClaims": {}
      },
      "pendingOptions": {
        "realm": "string",
        "scope": "string",
        "issuer": "string",
        "clientId": "string",
        "clientSecret": "string",
        "discoveryUrl": "string",
        "claimsMapping": {
          "sub": [
            "string"
          ],
          "name": [
            "string"
          ],
          "email": [
            "string"
          ],
          "groups": [
            "string"
          ],
          "locale": [
            "string"
          ],
          "picture": [
            "string"
          ],
          "zoneinfo": [
            "string"
          ],
          "client_id": [
            "string"
          ],
          "email_verified": [
            "string"
          ]
        },
        "decryptingKey": {
          "jwks": "string",
          "keyId": "string",
          "keySize": 42,
          "keyType": "string",
          "createdAt": "2018-10-30T07:06:22Z",
          "createdBy": "string",
          "publicKey": "string",
          "certificate": "string"
        },
        "openid_configuration": {
          "issuer": "string",
          "jwks_uri": "string",
          "token_endpoint": "string",
          "userinfo_endpoint": "string",
          "end_session_endpoint": "string",
          "authorization_endpoint": "string",
          "introspection_endpoint": "string"
        },
        "blockOfflineAccessScope": true,
        "emailVerifiedAlwaysTrue": true
      }
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
Create a new IdP

Creates a new IdP on a tenant. Requesting user must be assigned the TenantAdmin role. For non-interactive IdPs (e.g. JWT), IdP must be created by sending options payload. For interactive IdPs (e.g. SAML or OIDC), send pendingOptions payload to require the interactive verification step; or send options payload with skipVerify set to true to skip validation step and make IdP immediately available.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body

Attributes that the user wants to set for a new identity provider resource.

application/json
object
One of:
CreateOIDCPayload
object

Payload for creating an OIDC-compatible identity provider.

Show CreateOIDCPayload properties
CreateJWTAuthPayload
object

Payload for creating an identity provider using JWT authentication.

Show CreateJWTAuthPayload properties
CreateSAMLPayload
object

Payload for creating a SAML compatible identity provider.

Show CreateSAMLPayload properties
Responses
201

Created

application/json
any
One of:
IDPOIDC
object

An OIDC-compliant identity provider.

Show IDPOIDC properties
IDPSAML
object

A SAML-compliant identity provider.

Show IDPSAML properties
IDPJWTAuth
object

An identity provider for JWT authentication.

Show IDPJWTAuth properties
400

Bad Request

application/json
object

A representation of the errors encountered from the HTTP request.

Show application/json properties
403

Forbidden. User missing TenantAdmin role, or the tenantID in the JWT does not match any of the tenantIDs in the payload.

application/json
object

A representation of the errors encountered from the HTTP request.

Show application/json properties
POST
/api/v1/identity-providers
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


await qlik.identityProviders.createIdp({
  options: {
    realm: 'string',
    audience: 'string',
    discoveryUrl: 'string',
    claimsMapping: {
      sub: ['string'],
      client_id: ['string'],
    },
    allowedClientIds: ['string'],
    openid_configuration: {
      issuer: 'string',
      jwks_uri: 'string',
      token_endpoint: 'string',
      userinfo_endpoint: 'string',
      end_session_endpoint: 'string',
      authorization_endpoint: 'string',
      introspection_endpoint: 'string',
    },
  },
  protocol: 'OIDC',
  provider: 'auth0',
  tenantIds: ['string'],
  skipVerify: false,
  description: 'string',
  interactive: false,
  pendingOptions: {
    realm: 'string',
    scope: 'string',
    clientId: 'string',
    clientSecret: 'string',
    discoveryUrl: 'string',
    claimsMapping: {
      sub: ['string'],
      name: ['string'],
      email: ['string'],
      groups: ['string'],
      locale: ['string'],
      picture: ['string'],
      zoneinfo: ['string'],
      client_id: ['string'],
      email_verified: ['string'],
    },
    decryptingKey: {
      jwks: 'string',
      keyId: 'string',
      keySize: 42,
      keyType: 'string',
      createdAt: '2018-10-30T07:06:22Z',
      createdBy: 'string',
      publicKey: 'string',
      certificate: 'string',
    },
    idTokenSignatureAlg: 'RS256',
    openid_configuration: {
      issuer: 'string',
      jwks_uri: 'string',
      token_endpoint: 'string',
      userinfo_endpoint: 'string',
      end_session_endpoint: 'string',
      authorization_endpoint: 'string',
      introspection_endpoint: 'string',
    },
    useClaimsFromIdToken: true,
    blockOfflineAccessScope: true,
    emailVerifiedAlwaysTrue: true,
  },
  clockToleranceSec: 5,
  createNewUsersOnLogin: true,
  postLogoutRedirectUri: 'string',
})
Example Response
{
  "id": "string",
  "meta": {},
  "active": true,
  "created": "2018-10-30T07:06:22Z",
  "protocol": "OIDC",
  "provider": "auth0",
  "tenantIds": [
    "string"
  ],
  "description": "string",
  "interactive": true,
  "lastUpdated": "2018-10-30T07:06:22Z",
  "clockToleranceSec": 42,
  "createNewUsersOnLogin": true,
  "postLogoutRedirectUri": "string",
  "options": {
    "realm": "string",
    "scope": "string",
    "issuer": "string",
    "clientId": "string",
    "clientSecret": "string",
    "discoveryUrl": "string",
    "claimsMapping": {
      "sub": [
        "string"
      ],
      "name": [
        "string"
      ],
      "email": [
        "string"
      ],
      "groups": [
        "string"
      ],
      "locale": [
        "string"
      ],
      "picture": [
        "string"
      ],
      "zoneinfo": [
        "string"
      ],
      "client_id": [
        "string"
      ],
      "email_verified": [
        "string"
      ]
    },
    "decryptingKey": {
      "jwks": "string",
      "keyId": "string",
      "keySize": 42,
      "keyType": "string",
      "createdAt": "2018-10-30T07:06:22Z",
      "createdBy": "string",
      "publicKey": "string",
      "certificate": "string"
    },
    "openid_configuration": {
      "issuer": "string",
      "jwks_uri": "string",
      "token_endpoint": "string",
      "userinfo_endpoint": "string",
      "end_session_endpoint": "string",
      "authorization_endpoint": "string",
      "introspection_endpoint": "string"
    },
    "blockOfflineAccessScope": true,
    "emailVerifiedAlwaysTrue": true
  },
  "pendingState": "verified",
  "pendingResult": {
    "error": "string",
    "status": "success",
    "started": "2018-10-30T07:06:22Z",
    "protocol": "OIDC",
    "idpClaims": {},
    "oauth2Error": {
      "error": "string",
      "errorURI": "string",
      "errorDescription": "string"
    },
    "resultantClaims": {}
  },
  "pendingOptions": {
    "realm": "string",
    "scope": "string",
    "issuer": "string",
    "clientId": "string",
    "clientSecret": "string",
    "discoveryUrl": "string",
    "claimsMapping": {
      "sub": [
        "string"
      ],
      "name": [
        "string"
      ],
      "email": [
        "string"
      ],
      "groups": [
        "string"
      ],
      "locale": [
        "string"
      ],
      "picture": [
        "string"
      ],
      "zoneinfo": [
        "string"
      ],
      "client_id": [
        "string"
      ],
      "email_verified": [
        "string"
      ]
    },
    "decryptingKey": {
      "jwks": "string",
      "keyId": "string",
      "keySize": 42,
      "keyType": "string",
      "createdAt": "2018-10-30T07:06:22Z",
      "createdBy": "string",
      "publicKey": "string",
      "certificate": "string"
    },
    "openid_configuration": {
      "issuer": "string",
      "jwks_uri": "string",
      "token_endpoint": "string",
      "userinfo_endpoint": "string",
      "end_session_endpoint": "string",
      "authorization_endpoint": "string",
      "introspection_endpoint": "string"
    },
    "blockOfflineAccessScope": true,
    "emailVerifiedAlwaysTrue": true
  }
}
Return IdP configuration metadata

Returns IdP configuration metadata supported on the tenant. Clients can use this information to programmatically configure their interactions with Qlik Cloud.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Responses
200

Success

application/json
object
GET
/api/v1/identity-providers/.well-known/metadata.json
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


await qlik.identityProviders.getIdpWellKnownMetaData()
Example Response
{}
Get an IdP

Retrieves a specific IdP. Requesting user must be assigned the TenantAdmin role.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
id
string
Required

The identity provider ID.

Responses
200

Success

application/json
any
One of:
IDPOIDC
object

An OIDC-compliant identity provider.

Show IDPOIDC properties
IDPSAML
object

A SAML-compliant identity provider.

Show IDPSAML properties
IDPJWTAuth
object

An identity provider for JWT authentication.

Show IDPJWTAuth properties
401

Unauthorized

application/json
object

A representation of the errors encountered from the HTTP request.

Show application/json properties
404

Not Found

application/json
object

A representation of the errors encountered from the HTTP request.

Show application/json properties
GET
/api/v1/identity-providers/{id}
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


await qlik.identityProviders.getIdp('string')
Example Response
{
  "id": "string",
  "meta": {},
  "active": true,
  "created": "2018-10-30T07:06:22Z",
  "protocol": "OIDC",
  "provider": "auth0",
  "tenantIds": [
    "string"
  ],
  "description": "string",
  "interactive": true,
  "lastUpdated": "2018-10-30T07:06:22Z",
  "clockToleranceSec": 42,
  "createNewUsersOnLogin": true,
  "postLogoutRedirectUri": "string",
  "options": {
    "realm": "string",
    "scope": "string",
    "issuer": "string",
    "clientId": "string",
    "clientSecret": "string",
    "discoveryUrl": "string",
    "claimsMapping": {
      "sub": [
        "string"
      ],
      "name": [
        "string"
      ],
      "email": [
        "string"
      ],
      "groups": [
        "string"
      ],
      "locale": [
        "string"
      ],
      "picture": [
        "string"
      ],
      "zoneinfo": [
        "string"
      ],
      "client_id": [
        "string"
      ],
      "email_verified": [
        "string"
      ]
    },
    "decryptingKey": {
      "jwks": "string",
      "keyId": "string",
      "keySize": 42,
      "keyType": "string",
      "createdAt": "2018-10-30T07:06:22Z",
      "createdBy": "string",
      "publicKey": "string",
      "certificate": "string"
    },
    "openid_configuration": {
      "issuer": "string",
      "jwks_uri": "string",
      "token_endpoint": "string",
      "userinfo_endpoint": "string",
      "end_session_endpoint": "string",
      "authorization_endpoint": "string",
      "introspection_endpoint": "string"
    },
    "blockOfflineAccessScope": true,
    "emailVerifiedAlwaysTrue": true
  },
  "pendingState": "verified",
  "pendingResult": {
    "error": "string",
    "status": "success",
    "started": "2018-10-30T07:06:22Z",
    "protocol": "OIDC",
    "idpClaims": {},
    "oauth2Error": {
      "error": "string",
      "errorURI": "string",
      "errorDescription": "string"
    },
    "resultantClaims": {}
  },
  "pendingOptions": {
    "realm": "string",
    "scope": "string",
    "issuer": "string",
    "clientId": "string",
    "clientSecret": "string",
    "discoveryUrl": "string",
    "claimsMapping": {
      "sub": [
        "string"
      ],
      "name": [
        "string"
      ],
      "email": [
        "string"
      ],
      "groups": [
        "string"
      ],
      "locale": [
        "string"
      ],
      "picture": [
        "string"
      ],
      "zoneinfo": [
        "string"
      ],
      "client_id": [
        "string"
      ],
      "email_verified": [
        "string"
      ]
    },
    "decryptingKey": {
      "jwks": "string",
      "keyId": "string",
      "keySize": 42,
      "keyType": "string",
      "createdAt": "2018-10-30T07:06:22Z",
      "createdBy": "string",
      "publicKey": "string",
      "certificate": "string"
    },
    "openid_configuration": {
      "issuer": "string",
      "jwks_uri": "string",
      "token_endpoint": "string",
      "userinfo_endpoint": "string",
      "end_session_endpoint": "string",
      "authorization_endpoint": "string",
      "introspection_endpoint": "string"
    },
    "blockOfflineAccessScope": true,
    "emailVerifiedAlwaysTrue": true
  }
}
Update an IdP

Updates the configuration of an IdP. Requesting user must be assigned the TenantAdmin role. Partial failure is treated as complete failure and returns an error.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Header Parameters
QLIK-IDP-POPTS-MATCH
string

A unique string representing a hash that should map to an IdP's hash representation of the current configuration being tested.

format = "uuid"

Path Parameters
id
string
Required

The identity provider ID.

Request Body

Attributes that the user wants to patially update for an identity provider resource.

application/json
array
One of:
array of objects

A patch request for an identity provider using the OIDC protocol.

Show properties
array of objects

A patch request for an identity provider using the SAML protocol. Supports a custom operation value called promote-options that allows the test configuration (pendingOptions) to be promoted to the live configuration (options) used for login.'

Show properties
array of objects

A patch request for an identity provider using the jwtAuth protocol.

Show properties
Responses
204

Success

400

Bad request. Invalid request body, URL, or state transition.

application/json
object

A representation of the errors encountered from the HTTP request.

Show application/json properties
401

Unauthorized

application/json
object

A representation of the errors encountered from the HTTP request.

Show application/json properties
403

Access Denied. Only the edge-auth service or TenantAdmin user request can patch an IdP.

application/json
object

A representation of the errors encountered from the HTTP request.

Show application/json properties
404

Not Found

application/json
object

A representation of the errors encountered from the HTTP request.

Show application/json properties
412

Precondition Failed. Missing QLIK-IDP-OPTS-MATCH header, or value doesn't match against IdP test configuration value.

application/json
object

A representation of the errors encountered from the HTTP request.

Show application/json properties
500

Internal server error, the operation failed unexpectedly

application/json
object

A representation of the errors encountered from the HTTP request.

Show application/json properties
PATCH
/api/v1/identity-providers/{id}
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


await qlik.identityProviders.patchIdp('string', [
  { op: 'replace', path: '/active' },
])
Delete an IdP

Deletes an identity provider. Requesting user must be assigned the TenantAdmin role.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
id
string
Required

The identity provider ID.

Responses
204

Success

400

Bad request. The interactive IdP for the tenant can't be deleted.

application/json
object

A representation of the errors encountered from the HTTP request.

Show application/json properties
404

Not Found

application/json
object

A representation of the errors encountered from the HTTP request.

Show application/json properties
DELETE
/api/v1/identity-providers/{id}
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


await qlik.identityProviders.deleteIdp('string')
Return active interactive IdP metadata

Retrieves default IdP metadata when no interactive IdP is enabled.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Responses
200

Success

application/json
object
Show application/json properties
403

Forbidden

application/json
object

A representation of the errors encountered from the HTTP request.

Show application/json properties
404

Not Found

application/json
object

A representation of the errors encountered from the HTTP request.

Show application/json properties
500

Internal server error

application/json
object

A representation of the errors encountered from the HTTP request.

Show application/json properties
GET
/api/v1/identity-providers/me/meta
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


await qlik.identityProviders.getMyIdpMeta()
Example Response
{
  "userPortalLink": "string",
  "upgradeSubscriptionLink": "string"
}
List IdP statuses

Retrieves the status of all IdP configurations. Requires TenantAdmin role.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Responses
200

Success

application/json
object
Show application/json properties
403

Forbidden

application/json
object

A representation of the errors encountered from the HTTP request.

Show application/json properties
404

Not Found

application/json
object

A representation of the errors encountered from the HTTP request.

Show application/json properties
500

Internal Server Error

application/json
object

A representation of the errors encountered from the HTTP request.

Show application/json properties
GET
/api/v1/identity-providers/status
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


await qlik.identityProviders.getIdpStatuses()
Example Response
{
  "idps_metadata": [
    {
      "active": true,
      "provider": "auth0",
      "interactive": true
    }
  ],
  "active_interactive_idps_count": 42
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