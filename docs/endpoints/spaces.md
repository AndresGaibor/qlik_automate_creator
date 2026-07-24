---
title: "Spaces REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/spaces/"
local_path: "docs/endpoints/spaces.md"
---

Title: Spaces REST | Qlik Developer Portal


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
Spaces

Spaces are logical containers within your tenant and control access for users and groups through space roles to what content users can access.

Download OpenAPI spec
Endpoints
GET
/api/v1/spaces
POST
/api/v1/spaces
GET
/api/v1/spaces/{spaceId}
PATCH
/api/v1/spaces/{spaceId}
PUT
/api/v1/spaces/{spaceId}
DELETE
/api/v1/spaces/{spaceId}
GET
/api/v1/spaces/{spaceId}/assignments
POST
/api/v1/spaces/{spaceId}/assignments
GET
/api/v1/spaces/{spaceId}/assignments/{assignmentId}
PUT
/api/v1/spaces/{spaceId}/assignments/{assignmentId}
DELETE
/api/v1/spaces/{spaceId}/assignments/{assignmentId}
GET
/api/v1/spaces/{spaceId}/shares
POST
/api/v1/spaces/{spaceId}/shares
GET
/api/v1/spaces/{spaceId}/shares/{shareId}
PATCH
/api/v1/spaces/{spaceId}/shares/{shareId}
DELETE
/api/v1/spaces/{spaceId}/shares/{shareId}
GET
/api/v1/spaces/types
List spaces

Retrieves spaces that the current user has access to and match the query.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
action
string

Action on space. Supports only "?action=publish".

environment.name
string

Environment name to filter by. For example, "?environment.name=Development". Use an empty value to return spaces with no environment.

environmentId
string

Environment ID to filter by. For example, "?environmentId=67f4fba37f7cbb2f04ce727a". Use an empty value to return spaces with no environment.

limit
integer

Maximum number of spaces to return.

default = 10, format = int32, default = 10

name
string

Space name to search and filter for. Case-insensitive open search with wildcards both as prefix and suffix. For example, "?name=fin" will get "finance", "Final" and "Griffin".

next
string

The next page cursor. Next links make use of this.

ownerId
string

Space ownerId to filter by. For example, "?ownerId=123".

prev
string

The previous page cursor. Previous links make use of this.

roles
array of strings

Comma-separated list of roles to filter spaces by the caller's assignment role. For example, "?roles=publisher,facilitator" returns spaces where the caller has the publisher or facilitator role.

Values may be any of: "consumer""contributor""dataconsumer""datapreview""facilitator""operator""producer""publisher""basicconsumer""codeveloper"

sort
string

Field to sort by. Prefix with +/- to indicate asc/desc. For example, "?sort=+name" to sort ascending on Name. Supported fields are "type", "name" and "createdAt".

type
string

Type(s) of space to filter. For example, "?type=managed,shared".

Responses
200

Spaces retrieved.

application/json
object
Show application/json properties
400

Bad request

application/json
object
Show application/json properties
401

Unauthorized, JWT invalid or not provided.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
GET
/api/v1/spaces
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


await qlik.spaces.getSpaces({})
Example Response
{
  "data": [
    {
      "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
      "meta": {
        "roles": [
          "consumer"
        ],
        "actions": [
          "change_owner"
        ],
        "assignableRoles": [
          "consumer"
        ]
      },
      "name": "string",
      "type": "shared",
      "links": {
        "self": {
          "href": "string"
        },
        "assignments": {
          "href": "string"
        }
      },
      "ownerId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
      "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
      "createdAt": "2018-10-30T07:06:22Z",
      "createdBy": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
      "updatedAt": "2018-10-30T07:06:22Z",
      "description": "string"
    }
  ],
  "meta": {
    "count": 42,
    "personalSpace": {
      "actions": [
        "change_owner"
      ],
      "resourceType": "string"
    }
  },
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
Create a space

Creates a space. Spaces names must be unique. Spaces of type data should only be used for Qlik Talend Data Integration projects.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
Required

Attributes that the user wants to set for a new space.

application/json
object
Show application/json properties
Responses
201

Space created.

application/json
object

A space is a security context simplifying the management of access control by allowing users to control it on the containers instead of on the resources themselves.

Show application/json properties
401

Unauthorized, JWT invalid or not provided.

application/json
object
Show application/json properties
403

Space create operation denied.

application/json
object
Show application/json properties
409

Space already exists. name must be unique.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
POST
/api/v1/spaces
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


await qlik.spaces.createSpace({
  description:
    'Development space for users building apps for the Finance team.',
  name: 'Finance (dev)',
  type: 'shared',
})
Example Response
{
  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "meta": {
    "roles": [
      "consumer"
    ],
    "actions": [
      "change_owner"
    ],
    "assignableRoles": [
      "consumer"
    ]
  },
  "name": "string",
  "type": "shared",
  "links": {
    "self": {
      "href": "string"
    },
    "assignments": {
      "href": "string"
    }
  },
  "ownerId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "createdAt": "2018-10-30T07:06:22Z",
  "createdBy": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "updatedAt": "2018-10-30T07:06:22Z",
  "description": "string"
}
Retrieve a space

Retrieves a single space by ID.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
spaceId
string
Required

The ID of the space to retrieve.

format = "uid"

Responses
200

Space retrieved.

application/json
object

A space is a security context simplifying the management of access control by allowing users to control it on the containers instead of on the resources themselves.

Show application/json properties
401

Unauthorized, JWT invalid or not provided.

application/json
object
Show application/json properties
404

Space not found or access denied.

application/json
object
Show application/json properties
429

Too many repetetive requests.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
GET
/api/v1/spaces/{spaceId}
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


await qlik.spaces.getSpace(
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
)
Example Response
{
  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "meta": {
    "roles": [
      "consumer"
    ],
    "actions": [
      "change_owner"
    ],
    "assignableRoles": [
      "consumer"
    ]
  },
  "name": "string",
  "type": "shared",
  "links": {
    "self": {
      "href": "string"
    },
    "assignments": {
      "href": "string"
    }
  },
  "ownerId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "createdAt": "2018-10-30T07:06:22Z",
  "createdBy": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "updatedAt": "2018-10-30T07:06:22Z",
  "description": "string"
}
Update a space's properties

Updates one or more properties of a space. To update all properties at once, use PUT /spaces/{spaceId}.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
spaceId
string
Required

The ID of the space to update.

format = "uid"

Request Body
Required

Attribute that the user wants to patch (update) for the specified space.

application/json
array of objects

A JSONPatch document as defined by RFC 6902.

Show application/json properties
Responses
200

Space patched (updated).

application/json
object

A space is a security context simplifying the management of access control by allowing users to control it on the containers instead of on the resources themselves.

Show application/json properties
401

Unauthorized, JWT invalid or not provided.

application/json
object
Show application/json properties
403

Space patch (update) operation denied.

application/json
object
Show application/json properties
404

Space not found or access denied.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
PATCH
/api/v1/spaces/{spaceId}
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


await qlik.spaces.patchSpace(
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
  [
    {
      op: 'replace',
      path: '/name',
      value: 'string',
    },
  ],
)
Example Response
{
  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "meta": {
    "roles": [
      "consumer"
    ],
    "actions": [
      "change_owner"
    ],
    "assignableRoles": [
      "consumer"
    ]
  },
  "name": "string",
  "type": "shared",
  "links": {
    "self": {
      "href": "string"
    },
    "assignments": {
      "href": "string"
    }
  },
  "ownerId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "createdAt": "2018-10-30T07:06:22Z",
  "createdBy": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "updatedAt": "2018-10-30T07:06:22Z",
  "description": "string"
}
Update a space

Updates a space. To update specific properties, use PATCH /spaces/{spaceId}.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
spaceId
string
Required

The ID of the space to update.

format = "uid"

Request Body
Required

Attributes that the user wants to update for the specified space.

application/json
object
Show application/json properties
Responses
200

Space updated.

application/json
object

A space is a security context simplifying the management of access control by allowing users to control it on the containers instead of on the resources themselves.

Show application/json properties
401

Unauthorized, JWT invalid or not provided.

application/json
object
Show application/json properties
403

Space update operation denied.

application/json
object
Show application/json properties
404

Space not found or access denied.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
PUT
/api/v1/spaces/{spaceId}
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


await qlik.spaces.updateSpace(
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
  {
    description: 'string',
    name: 'string',
    ownerId: 'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
  },
)
Example Response
{
  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "meta": {
    "roles": [
      "consumer"
    ],
    "actions": [
      "change_owner"
    ],
    "assignableRoles": [
      "consumer"
    ]
  },
  "name": "string",
  "type": "shared",
  "links": {
    "self": {
      "href": "string"
    },
    "assignments": {
      "href": "string"
    }
  },
  "ownerId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "createdAt": "2018-10-30T07:06:22Z",
  "createdBy": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "updatedAt": "2018-10-30T07:06:22Z",
  "description": "string"
}
Delete a space

Deletes a space. Ensure that you first delete all resources from the space to avoid orphaning content.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
spaceId
string
Required

The ID of the space to delete.

format = "uid"

Responses
204

Space deleted.

401

Unauthorized, JWT invalid or not provided.

application/json
object
Show application/json properties
403

Space delete operation denied.

application/json
object
Show application/json properties
404

Space not found or access denied.

application/json
object
Show application/json properties
412

Space delete precondition (space not empty) failed.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
DELETE
/api/v1/spaces/{spaceId}
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


await qlik.spaces.deleteSpace(
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
)
List assignments for a space

Retrieves the assignments of the space matching the query. Each assignment represents one user or group and their corresponding roles in the space. Assignments are not shown for the owner of a space, who receive all assignableRoles by default.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
assigneeId
string

Filters assignment for a specific assigneeid.

limit
integer

Maximum number of assignments to return.

default = 10, format = int32, default = 10

next
string

The next page cursor. Next links make use of this.

prev
string

The previous page cursor. Previous links make use of this.

type
string

The type of assignment. Supported values are user or group.

Can be one of: "user""group""bot"

Path Parameters
spaceId
string
Required

The ID of the space of the assignment.

format = "uid"

Responses
200

Assignments retrieved.

application/json
object
Show application/json properties
401

Unauthorized, JWT invalid or not provided.

application/json
object
Show application/json properties
403

Assignments retrieve operation denied.

application/json
object
Show application/json properties
404

Space not found or access denied.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
GET
/api/v1/spaces/{spaceId}/assignments
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


await qlik.spaces.getSpaceAssignments(
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
  {},
)
Example Response
{
  "data": [
    {
      "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
      "type": "user",
      "links": {
        "self": {
          "href": "string"
        },
        "space": {
          "href": "string"
        }
      },
      "roles": [
        "consumer"
      ],
      "spaceId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
      "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
      "createdAt": "2018-10-30T07:06:22Z",
      "createdBy": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
      "updatedAt": "2018-10-30T07:06:22Z",
      "updatedBy": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
      "assigneeId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69"
    }
  ],
  "meta": {
    "count": 42
  },
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
Assign a user or group to a space

Creates an assignment for a user or group (assignee) to a space with the specified roles. Assignments are not required for space owners, who receive all assignableRoles by default. Only one assignment can exist per space, per user or group.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
spaceId
string
Required

The ID of the space of the assignment.

format = "uid"

Request Body
Required

Attributes that the user wants to set for the assignment for the space.

application/json
object
Show application/json properties
Responses
201

Assignment created.

application/json
object
Show application/json properties
401

Unauthorized, JWT invalid or not provided.

application/json
object
Show application/json properties
403

Assignment create operation denied.

application/json
object
Show application/json properties
404

Space not found or access denied.

application/json
object
Show application/json properties
409

Assignment already exists. assigneeId must be unique.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
POST
/api/v1/spaces/{spaceId}/assignments
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


await qlik.spaces.createSpaceAssignment(
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
  {
    assigneeId:
      'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
    roles: ['consumer'],
    type: 'user',
  },
)
Example Response
{
  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "type": "user",
  "links": {
    "self": {
      "href": "string"
    },
    "space": {
      "href": "string"
    }
  },
  "roles": [
    "consumer"
  ],
  "spaceId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "createdAt": "2018-10-30T07:06:22Z",
  "createdBy": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "updatedAt": "2018-10-30T07:06:22Z",
  "updatedBy": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "assigneeId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69"
}
Retrieve an assignment for a space

Retrieves a single assignment by assignment ID. Use GET /spaces/{spaceId}/assignments to list all users and groups assigned to the space and their assignment ID.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
assignmentId
string
Required

The ID of the assignment to retrieve.

format = "uid"

spaceId
string
Required

The ID of the space of the assignment.

format = "uid"

Responses
200

Assignment retrieved.

application/json
object
Show application/json properties
401

Unauthorized, JWT invalid or not provided.

application/json
object
Show application/json properties
403

Assignment retrieve operation denied.

application/json
object
Show application/json properties
404

Space not found or access denied or assignment not found.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
GET
/api/v1/spaces/{spaceId}/assignments/{assignmentId}
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


await qlik.spaces.getSpaceAssignment(
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
)
Example Response
{
  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "type": "user",
  "links": {
    "self": {
      "href": "string"
    },
    "space": {
      "href": "string"
    }
  },
  "roles": [
    "consumer"
  ],
  "spaceId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "createdAt": "2018-10-30T07:06:22Z",
  "createdBy": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "updatedAt": "2018-10-30T07:06:22Z",
  "updatedBy": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "assigneeId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69"
}
Update an assignment for a space

Updates a single assignment by assignment ID. Use GET /spaces/{spaceId}/assignments to list all users and groups assigned to the space and their assignment ID. The complete list of roles must be provided.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
assignmentId
string
Required

The ID of the assignment to update.

format = "uid"

spaceId
string
Required

The ID of the space of the assignment.

format = "uid"

Request Body
Required

Attributes that the user wants to update for the specified assignment.

application/json
object
Show application/json properties
Responses
200

Assignment updated.

application/json
object
Show application/json properties
401

Unauthorized, JWT invalid or not provided.

application/json
object
Show application/json properties
403

Assignment update operation denied.

application/json
object
Show application/json properties
404

Space not found or access denied.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
PUT
/api/v1/spaces/{spaceId}/assignments/{assignmentId}
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


await qlik.spaces.updateSpaceAssignment(
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
  { roles: ['consumer'] },
)
Example Response
{
  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "type": "user",
  "links": {
    "self": {
      "href": "string"
    },
    "space": {
      "href": "string"
    }
  },
  "roles": [
    "consumer"
  ],
  "spaceId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "createdAt": "2018-10-30T07:06:22Z",
  "createdBy": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "updatedAt": "2018-10-30T07:06:22Z",
  "updatedBy": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "assigneeId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69"
}
Delete an assignment

Deletes an assignment.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
assignmentId
string
Required

The ID of the assignment to delete.

format = "uid"

spaceId
string
Required

The ID of the space of the assignment.

format = "uid"

Responses
204

Assignment deleted.

401

Unauthorized, JWT invalid or not provided.

application/json
object
Show application/json properties
403

Assignment delete operation denied.

application/json
object
Show application/json properties
404

Space not found or access denied or assignment not found.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
DELETE
/api/v1/spaces/{spaceId}/assignments/{assignmentId}
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


await qlik.spaces.deleteSpaceAssignment(
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
)
List space shares

Retrieves the shares of the space matching the query.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
groupId
string

The ID of the group to which the resource is shared.

limit
integer

Maximum number of shares to return.

default = 10, format = int32, default = 10

name
string

The name of the shared resource.

next
string

The next page cursor. Next links make use of this.

prev
string

The previous page cursor. Previous links make use of this.

resourceId
string

The ID of the shared resource.

resourceType
string

The type of the shared resource.

type
string

The type of share. user shares assign to a specific user, group shares assign to a specific group, and link shares provide anonymous access to a resource.

Can be one of: "user""group""link"

userId
string

The ID of the user to which the resource is shared.

Path Parameters
spaceId
string
Required

The ID of the space containing the shares.

format = "uid"

Responses
200

Shares retrieved.

application/json
object
Show application/json properties
401

Unauthorized, JWT invalid or not provided.

application/json
object
Show application/json properties
403

Shares retrieve operation denied.

application/json
object
Show application/json properties
404

Space not found or access denied.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
GET
/api/v1/spaces/{spaceId}/shares
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


await qlik.spaces.getSpaceShares(
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
  {},
)
Example Response
{
  "data": [
    {
      "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
      "type": "user",
      "links": {
        "self": {
          "href": "string"
        },
        "space": {
          "href": "string"
        }
      },
      "roles": [
        "consumer"
      ],
      "spaceId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
      "disabled": true,
      "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
      "createdAt": "2018-10-30T07:06:22Z",
      "createdBy": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
      "updatedAt": "2018-10-30T07:06:22Z",
      "updatedBy": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
      "assigneeId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
      "resourceId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
      "resourceName": "string",
      "resourceType": "app"
    }
  ],
  "meta": {
    "count": 42
  },
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
Create a space share

Creates a share.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
spaceId
string
Required

The ID of the space of the share.

format = "uid"

Request Body
Required
application/json
object
Show application/json properties
Responses
201

Share created.

application/json
object
Show application/json properties
401

Unauthorized, JWT invalid or not provided.

application/json
object
Show application/json properties
403

Share create operation denied.

application/json
object
Show application/json properties
404

Space not found or access denied.

application/json
object
Show application/json properties
409

Share already exists. assigneeId must be unique.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
POST
/api/v1/spaces/{spaceId}/shares
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


await qlik.spaces.createSpaceShare(
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
  {
    assigneeId:
      'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
    resourceId:
      'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
    resourceType:
      'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
    roles: ['consumer'],
    type: 'user',
  },
)
Example Response
{
  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "type": "user",
  "links": {
    "self": {
      "href": "string"
    },
    "space": {
      "href": "string"
    }
  },
  "roles": [
    "consumer"
  ],
  "spaceId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "disabled": true,
  "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "createdAt": "2018-10-30T07:06:22Z",
  "createdBy": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "updatedAt": "2018-10-30T07:06:22Z",
  "updatedBy": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "assigneeId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "resourceId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "resourceName": "string",
  "resourceType": "app"
}
Retrieve a space share

Retrieves a single space share by ID.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
shareId
string
Required

The ID of the share to retrieve.

format = "uid"

spaceId
string
Required

The ID of the space to which the share belongs.

format = "uid"

Responses
200

Share retrieved.

application/json
object
Show application/json properties
401

Unauthorized, JWT invalid or not provided.

application/json
object
Show application/json properties
403

Share retrieve operation denied.

application/json
object
Show application/json properties
404

Space not found or access denied or share not found.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
GET
/api/v1/spaces/{spaceId}/shares/{shareId}
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


await qlik.spaces.getSpaceShare(
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
)
Example Response
{
  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "type": "user",
  "links": {
    "self": {
      "href": "string"
    },
    "space": {
      "href": "string"
    }
  },
  "roles": [
    "consumer"
  ],
  "spaceId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "disabled": true,
  "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "createdAt": "2018-10-30T07:06:22Z",
  "createdBy": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "updatedAt": "2018-10-30T07:06:22Z",
  "updatedBy": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "assigneeId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "resourceId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "resourceName": "string",
  "resourceType": "app"
}
Update a space share

Updates properties of a space share (roles, and disabled state for link shares).

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
shareId
string
Required

The ID of the share to update.

format = "uid"

spaceId
string
Required

The ID of the space to which the share belongs.

format = "uid"

Request Body
Required
application/json
array of objects

A JSONPatch document as defined by RFC 6902

Show application/json properties
Responses
200

Share patched (updated).

application/json
object
Show application/json properties
401

Unauthorized, JWT invalid or not provided.

application/json
object
Show application/json properties
403

Share patch (update) operation denied.

application/json
object
Show application/json properties
404

Share not found or access denied.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
PATCH
/api/v1/spaces/{spaceId}/shares/{shareId}
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


await qlik.spaces.patchShare(
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
  [
    {
      op: 'replace',
      path: '/roles',
      value: 'string',
    },
  ],
)
Example Response
{
  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "type": "user",
  "links": {
    "self": {
      "href": "string"
    },
    "space": {
      "href": "string"
    }
  },
  "roles": [
    "consumer"
  ],
  "spaceId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "disabled": true,
  "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "createdAt": "2018-10-30T07:06:22Z",
  "createdBy": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "updatedAt": "2018-10-30T07:06:22Z",
  "updatedBy": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "assigneeId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "resourceId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
  "resourceName": "string",
  "resourceType": "app"
}
Delete a space share

Deletes a space share.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
shareId
string
Required

The ID of the share to delete.

format = "uid"

spaceId
string
Required

The ID of the space to which the share belongs.

format = "uid"

Responses
204

Share deleted.

401

Unauthorized, JWT invalid or not provided.

application/json
object
Show application/json properties
403

share delete operation denied.

application/json
object
Show application/json properties
404

Space not found or access denied or share not found.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
DELETE
/api/v1/spaces/{spaceId}/shares/{shareId}
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


await qlik.spaces.deleteSpaceShare(
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
)
List space types

Gets a list of distinct space types available for use in the tenant.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Responses
200

Space types retrieved.

application/json
object

The distinct types of spaces (shared, managed, and so on).

Show application/json properties
401

Unauthorized, JWT invalid or not provided.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
GET
/api/v1/spaces/types
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


await qlik.spaces.getSpaceTypes()
Example Response
{
  "data": [
    "data",
    "shared",
    "managed"
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