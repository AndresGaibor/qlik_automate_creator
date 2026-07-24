---
title: "Users REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/users/"
local_path: "docs/endpoints/users.md"
---

Title: Users REST | Qlik Developer Portal


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
Users

Users represent clients accessing the Qlik Cloud tenant.

Download OpenAPI spec
Endpoints
GET
/api/v1/users
POST
/api/v1/users
GET
/api/v1/users/{userId}
PATCH
/api/v1/users/{userId}
DELETE
/api/v1/users/{userId}
GET
/api/v1/users/actions/count
POST
/api/v1/users/actions/filter
POST
/api/v1/users/actions/invite
GET
/api/v1/users/me
List users

Returns a list of users using cursor-based pagination.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
fields
string

A comma-delimited string of the requested fields per entity. If the 'links' value is omitted, then the entity HATEOAS link will also be omitted.

filter
string

The advanced filtering to use for the query. Refer to RFC 7644 for the syntax. Cannot be combined with any of the fields marked as deprecated. All conditional statements within this query parameter are case insensitive.

The following fields support the eq operator: id, subject, name, email, status, clientId, assignedRoles.id, assignedRoles.name, assignedGroups.id, assignedGroupsAssignedRoles.name, assignedScopes

Additionally, the following fields support the co operator: name, email, subject

Queries may be rate limited if they differ greatly from these examples:

(id eq "62716ab404a7bd8626af9bd6" or id eq "62716ac4c7e500e13ff5fa22") and (status eq "active" or status eq "disabled")

name co "query" or email co "query" or subject co "query" or id eq "query" or assignedRoles.name eq "query"


Any filters for status must be grouped together and applied to the whole query.

Valid:

(name eq "Bob" or name eq "Alice") and (status eq "active" or status eq "disabled")


Invalid:

name eq "Bob" or name eq "Alice" and (status eq "active" or status eq "disabled")

limit
number

The number of user entries to retrieve.

minimum = 1, maximum = 100, default = 20, default = 20

next
string

Get users that come after this cursor value when sorted. Cannot be used in conjunction with prev.

prev
string

Get users that come before this cursor value when sorted. Cannot be used in conjunction with next.

sort
string

The field to sort by, with +/- prefix indicating sort order

Can be one of: "name""+name""-name""_id""+_id""-_id""id""+id""-id""tenantId""+tenantId""-tenantId""clientId""+clientId""-clientId""status""+status""-status""subject""+subject""-subject""email""+email""-email""inviteExpiry""+inviteExpiry""-inviteExpiry""createdAt""+createdAt""-createdAt"

default = "+name"

totalResults
boolean

Whether to return a total match count in the result. Defaults to false. It will trigger an extra DB query to count, reducing the efficiency of the endpoint.

Responses
200

Successful query, returns an array of users

application/json
object
Show application/json properties
400

Invalid request parameters for querying users.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
401

Not authorized.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
429

Request has been rate limited.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
500

Internal server error.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
GET
/api/v1/users
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


await qlik.users.getUsers({})
qlik user ls
curl "https://{tenant}.{region}.qlikcloud.com/api/v1/users" \
-H "Authorization: Bearer <access_token>"
Example Response
{
  "data": [
    {
      "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
      "name": "string",
      "email": "string",
      "links": {
        "self": {
          "href": "http://mytenant.elastic.example/api/v1/users/DKNmFJCNo8SGURUdh2ll--------USER"
        }
      },
      "locale": "string",
      "status": "active",
      "picture": "http://example.com",
      "subject": "string",
      "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
      "zoneinfo": "string",
      "createdAt": "2018-10-30T07:06:22Z",
      "inviteExpiry": 42,
      "assignedRoles": [
        {
          "id": "507f191e810c19729de860ea",
          "name": "My Custom Role",
          "type": "custom",
          "level": "user"
        }
      ],
      "lastUpdatedAt": "2018-10-30T07:06:22Z",
      "assignedGroups": [
        {
          "id": "507f191e810c19729de860eb",
          "name": "Finance",
          "providerType": "idp",
          "assignedRoles": [
            {
              "id": "507f191e810c19729de860ea",
              "name": "My Custom Role",
              "type": "custom",
              "level": "user"
            }
          ]
        }
      ],
      "assignedScopes": [
        "string"
      ],
      "preferredLocale": "string",
      "preferredZoneinfo": "string"
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
Create user

Creates an invited user.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
Required
application/json
object
Show application/json properties
Responses
201

User created successfully.

application/json
object

A user object.

Show application/json properties
400

Invalid request was made.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
401

Unauthorized to create a user.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
403

Forbidden from creating a user.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
409

User conflict when attempting to create a new user.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
413

Payload was too large (limit of 500kB)

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
429

Request has been rate limited.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
500

Internal server error.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
POST
/api/v1/users
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


await qlik.users.createUser({
  assignedRoles: [{ name: 'My Custom Role' }],
  email: 'john.smith@corp.example',
  name: 'John Smith',
  picture: 'https://corp.example/docs/jsmith.png',
  status: 'invited',
  subject: '1234asdasa6789',
  tenantId: 'q3VRZ4YMixRaLKEPhkZWM-XMIDN7cO8f',
})
qlik user create \
  --assignedRoles-id '' \
  --assignedRoles-name '' \
  --subject '1234asdasa6789'
curl "https://{tenant}.{region}.qlikcloud.com/api/v1/users" \
-X POST \
-H "Content-type: application/json" \
-H "Authorization: Bearer <access_token>" \
-d '{"name":"John Smith","email":"john.smith@corp.example","status":"invited","picture":"https://corp.example/docs/jsmith.png","subject":"1234asdasa6789","tenantId":"q3VRZ4YMixRaLKEPhkZWM-XMIDN7cO8f","assignedRoles":[{"name":"My Custom Role"}]}'
Example Response
{
  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "name": "string",
  "email": "string",
  "links": {
    "self": {
      "href": "http://mytenant.elastic.example/api/v1/users/DKNmFJCNo8SGURUdh2ll--------USER"
    }
  },
  "locale": "string",
  "status": "active",
  "picture": "http://example.com",
  "subject": "string",
  "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "zoneinfo": "string",
  "createdAt": "2018-10-30T07:06:22Z",
  "inviteExpiry": 42,
  "assignedRoles": [
    {
      "id": "507f191e810c19729de860ea",
      "name": "My Custom Role",
      "type": "custom",
      "level": "user"
    }
  ],
  "lastUpdatedAt": "2018-10-30T07:06:22Z",
  "assignedGroups": [
    {
      "id": "507f191e810c19729de860eb",
      "name": "Finance",
      "providerType": "idp",
      "assignedRoles": [
        {
          "id": "507f191e810c19729de860ea",
          "name": "My Custom Role",
          "type": "custom",
          "level": "user"
        }
      ]
    }
  ],
  "assignedScopes": [
    "string"
  ],
  "preferredLocale": "string",
  "preferredZoneinfo": "string"
}
Get user by ID

Returns the requested user.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
fields
string

A comma-delimited string of the requested fields per entity. If the 'links' value is omitted, then the entity HATEOAS link will also be omitted.

Path Parameters
userId
string
Required

The user's unique identifier

format = "uid"

Responses
200

User resource

application/json
object

A user object.

Show application/json properties
403

Forbidden from getting a user.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
404

User was not found.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
429

Request has been rate limited.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
500

Internal server error.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
GET
/api/v1/users/{userId}
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


await qlik.users.getUser(
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
  {},
)
qlik user get 'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69'
curl "https://{tenant}.{region}.qlikcloud.com/api/v1/users/{userId}" \
-H "Authorization: Bearer <access_token>"
Example Response
{
  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "name": "string",
  "email": "string",
  "links": {
    "self": {
      "href": "http://mytenant.elastic.example/api/v1/users/DKNmFJCNo8SGURUdh2ll--------USER"
    }
  },
  "locale": "string",
  "status": "active",
  "picture": "http://example.com",
  "subject": "string",
  "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "zoneinfo": "string",
  "createdAt": "2018-10-30T07:06:22Z",
  "inviteExpiry": 42,
  "assignedRoles": [
    {
      "id": "507f191e810c19729de860ea",
      "name": "My Custom Role",
      "type": "custom",
      "level": "user"
    }
  ],
  "lastUpdatedAt": "2018-10-30T07:06:22Z",
  "assignedGroups": [
    {
      "id": "507f191e810c19729de860eb",
      "name": "Finance",
      "providerType": "idp",
      "assignedRoles": [
        {
          "id": "507f191e810c19729de860ea",
          "name": "My Custom Role",
          "type": "custom",
          "level": "user"
        }
      ]
    }
  ],
  "assignedScopes": [
    "string"
  ],
  "preferredLocale": "string",
  "preferredZoneinfo": "string"
}
Update user by ID

Updates fields for a user resource

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
userId
string
Required

The ID of the user to update.

format = "uid"

Request Body
Required
application/json
array of objects

An array of JSON Patch documents

Show application/json properties
Responses
204

User updated successfully.

207

User update was partially successful with non-critical failures.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
400

Invalid request for patching a user.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
403

Forbidden from patching a user.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
404

User was not found.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
429

Request has been rate limited.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
PATCH
/api/v1/users/{userId}
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


await qlik.users.patchUser(
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
  [
    {
      op: 'replace',
      path: '/name',
      value: 'John',
    },


    {
      op: 'replace',
      path: '/assignedRoles',
      value: [{ name: 'My Custom Role' }],
    },


    {
      op: 'replace',
      path: '/email',
      value: 'unicorn@corp.example',
    },


    {
      op: 'replace',
      path: '/preferredZoneInfo',
      value: 'America/Halifax',
    },


    {
      op: 'replace',
      path: '/preferredLocale',
      value: 'en_US_POSIX',
    },


    {
      op: 'replace',
      path: '/status',
      value: 'active',
    },


    {
      op: 'add',
      path: '/assignedRoles/-',
      value: { name: 'TenantAdmin' },
    },


    {
      op: 'remove-value',
      path: '/assignedRoles',
      value: { id: '67ac386d2bab6dd4925008e8' },
    },
  ],
)
qlik user patch 'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69' \
  --op 'replace' \
  --path '/name' \
  --value John \
  --value-id '' \
  --value-name '' \
  --value-providerType ''
curl "https://{tenant}.{region}.qlikcloud.com/api/v1/users/{userId}" \
-X PATCH \
-H "Content-type: application/json" \
-H "Authorization: Bearer <access_token>" \
-d '[{"op":"replace","path":"/name","value":"John"},{"op":"replace","path":"/assignedRoles","value":[{"name":"My Custom Role"}]},{"op":"replace","path":"/email","value":"unicorn@corp.example"},{"op":"replace","path":"/preferredZoneInfo","value":"America/Halifax"},{"op":"replace","path":"/preferredLocale","value":"en_US_POSIX"},{"op":"replace","path":"/status","value":"active"},{"op":"add","path":"/assignedRoles/-","value":{"name":"TenantAdmin"}},{"op":"remove-value","path":"/assignedRoles","value":{"id":"67ac386d2bab6dd4925008e8"}}]'
Example Response
{
  "errors": [
    {
      "code": "USERS-7",
      "title": "Not found",
      "status": 404
    }
  ],
  "traceId": "000000000000000079cf1ebeae103de1"
}
Delete user by ID

Deletes the requested user.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
userId
string
Required

The ID of the user to delete.

format = "uid"

Responses
204

User deleted successfully.

400

Invalid request for deleting a user.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
403

Forbidden from deleting a user.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
404

User was not found.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
429

Request has been rate limited.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
DELETE
/api/v1/users/{userId}
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


await qlik.users.deleteUser(
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
)
qlik user rm 'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69'
curl "https://{tenant}.{region}.qlikcloud.com/api/v1/users/{userId}" \
-X DELETE \
-H "Authorization: Bearer <access_token>"
Count users

Returns the number of users in a given tenant

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Responses
200

The count of users.

application/json
object

The result object for the user count.

Show application/json properties
403

Forbidden from reading the count.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
404

Not found.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
429

Request has been rate limited.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
GET
/api/v1/users/actions/count
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


await qlik.users.countUsers({})
qlik user count
curl "https://{tenant}.{region}.qlikcloud.com/api/v1/users/actions/count" \
-H "Authorization: Bearer <access_token>"
Example Response
{
  "total": 42
}
Filter users

Retrieves a list of users matching the filter using an advanced query string.

Facts
	Rate limit	Special (200 requests per minute)
Query Parameters
fields
string

A comma-delimited string of the requested fields per entity. If the 'links' value is omitted, then the entity HATEOAS link will also be omitted.

limit
number

The number of user entries to retrieve.

minimum = 1, maximum = 100, default = 20, default = 20

next
string

Get users with IDs that are higher than the target user ID. Cannot be used in conjunction with prev.

prev
string

Get users with IDs that are lower than the target user ID. Cannot be used in conjunction with next.

sort
string

The field to sort by, with +/- prefix indicating sort order

Can be one of: "name""+name""-name"

default = "+name"

Request Body

Will contain the query filter to apply. It shall not contain more than 100 ids.

application/json
object

An advanced query filter to be used for complex user querying in the tenant.

Show application/json properties
Responses
200

Users retrieved.

application/json
object
Show application/json properties
400

Advanced query filter syntax error or query params format error or filter too complex.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
401

Unauthorized, JWT invalid or not provided.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
403

The operation failed due to unsufficient permissions.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
429

Request has been rate limited.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
500

Internal server error.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
POST
/api/v1/users/actions/filter
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


await qlik.users.filterUsers(
  {},
  {
    filter:
      '(id eq "626949b9017b657805080bbd" or id eq "626949bf017b657805080bbe") and (status eq "active" or status eq "deleted")',
  },
)
qlik user filter
curl "https://{tenant}.{region}.qlikcloud.com/api/v1/users/actions/filter" \
-X POST \
-H "Content-type: application/json" \
-H "Authorization: Bearer <access_token>" \
-d '{"filter":"(id eq \"626949b9017b657805080bbd\" or id eq \"626949bf017b657805080bbe\") and (status eq \"active\" or status eq \"deleted\")"}'
Example Response
{
  "data": [
    {
      "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
      "name": "string",
      "email": "string",
      "links": {
        "self": {
          "href": "http://mytenant.elastic.example/api/v1/users/DKNmFJCNo8SGURUdh2ll--------USER"
        }
      },
      "locale": "string",
      "status": "active",
      "picture": "http://example.com",
      "subject": "string",
      "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
      "zoneinfo": "string",
      "createdAt": "2018-10-30T07:06:22Z",
      "inviteExpiry": 42,
      "assignedRoles": [
        {
          "id": "507f191e810c19729de860ea",
          "name": "My Custom Role",
          "type": "custom",
          "level": "user"
        }
      ],
      "lastUpdatedAt": "2018-10-30T07:06:22Z",
      "assignedGroups": [
        {
          "id": "507f191e810c19729de860eb",
          "name": "Finance",
          "providerType": "idp",
          "assignedRoles": [
            {
              "id": "507f191e810c19729de860ea",
              "name": "My Custom Role",
              "type": "custom",
              "level": "user"
            }
          ]
        }
      ],
      "assignedScopes": [
        "string"
      ],
      "preferredLocale": "string",
      "preferredZoneinfo": "string"
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
Invite one or more users by email address.
Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
Required
application/json
object
Show application/json properties
Responses
207

Request completed successfully. See Results for ResultDetail on each invite.

application/json
object

Data list - ResultItem or ErrorItem for each InviteeItem.

Show application/json properties
403

Request denied.

application/json
object
Show application/json properties
default

Request error. See Errors.

application/json
object
Show application/json properties
POST
/api/v1/users/actions/invite
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


await qlik.users.inviteUsers({
  invitees: [
    {
      email: 'string',
      language: 'string',
      name: 'string',
      resend: true,
    },
  ],
})
qlik user invite \
  --invitees-email ''
curl "https://{tenant}.{region}.qlikcloud.com/api/v1/users/actions/invite" \
-X POST \
-H "Content-type: application/json" \
-H "Authorization: Bearer <access_token>" \
-d '{"invitees":[{"name":"string","email":"string","resend":true,"language":"string"}]}'
Example Response
{
  "data": [
    {
      "email": "string",
      "status": "ok",
      "userId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
      "subject": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4"
    }
  ]
}
Get my user

Redirects to retrieve the user resource associated with the JWT claims.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Responses
301

Successful redirect.

text/html
string
429

Request has been rate limited.

application/json
object

The error response object describing the error from the handling of an HTTP request.

Show application/json properties
GET
/api/v1/users/me
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


await qlik.users.getMyUser()
qlik user me
curl "https://{tenant}.{region}.qlikcloud.com/api/v1/users/me" \
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