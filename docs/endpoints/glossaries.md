---
title: "Glossaries REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/glossaries/"
local_path: "docs/endpoints/glossaries.md"
---

Title: Glossaries REST | Qlik Developer Portal


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
Glossaries

A glossary is a collection of common and agreed upon (business) terms, typically focused on defining the meaning of data and described in terms that everyone understands.

Download OpenAPI spec
Endpoints
GET
/api/v1/glossaries
POST
/api/v1/glossaries
GET
/api/v1/glossaries/{id}
PATCH
/api/v1/glossaries/{id}
PUT
/api/v1/glossaries/{id}
DELETE
/api/v1/glossaries/{id}
GET
/api/v1/glossaries/{id}/actions/export
GET
/api/v1/glossaries/{id}/categories
POST
/api/v1/glossaries/{id}/categories
GET
/api/v1/glossaries/{id}/categories/{categoryId}
PATCH
/api/v1/glossaries/{id}/categories/{categoryId}
PUT
/api/v1/glossaries/{id}/categories/{categoryId}
DELETE
/api/v1/glossaries/{id}/categories/{categoryId}
GET
/api/v1/glossaries/{id}/terms
POST
/api/v1/glossaries/{id}/terms
GET
/api/v1/glossaries/{id}/terms/{termId}
PATCH
/api/v1/glossaries/{id}/terms/{termId}
PUT
/api/v1/glossaries/{id}/terms/{termId}
DELETE
/api/v1/glossaries/{id}/terms/{termId}
POST
/api/v1/glossaries/{id}/terms/{termId}/actions/change-status
GET
/api/v1/glossaries/{id}/terms/{termId}/links
POST
/api/v1/glossaries/{id}/terms/{termId}/links
GET
/api/v1/glossaries/{id}/terms/{termId}/revisions
POST
/api/v1/glossaries/actions/import
Returns all glossaries.
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
countTotal
boolean

Optional parameter to request total count for query

limit
integer

The number of glossaries to get.

minimum = 1, maximum = 100, default = 20, default = 20

next
string

Optional parameter to request the next page.

prev
string

Optional parameter to request the previous page.

sort
string

Optional resource field name to sort on, eg. name. Can be prefixed with +/- to determine order, defaults to (+) ascending.

Can be one of: "name""+name""-name""description""+description""-description"

Responses
200

Successful Operation.

application/json
object
Show application/json properties
400

The request is in incorrect format

application/json
object
Show application/json properties
403

The user does not have privileges to perform the requested action.

application/json
object
Show application/json properties
GET
/api/v1/glossaries
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


await qlik.glossaries.getGlossaries({})
Example Response
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Organization wide glossary",
      "tags": [
        "Red",
        "Sales"
      ],
      "ownerId": "507f191e810c19729de860ea",
      "spaceId": "507f191e810c19729de860ea",
      "overview": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"This glossary contains business terms\"}]}]",
      "createdAt": "2021-10-02T14:20:50.52Z",
      "createdBy": "507f191e810c19729de860ea",
      "updatedAt": "2021-10-02T14:20:50.52Z",
      "updatedBy": "507f191e810c19729de860ea",
      "description": "This glossary contains definitions and concepts of business terms.",
      "termTemplate": {
        "relatedInformation": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]}]"
      }
    }
  ],
  "meta": {
    "countTotal": 42
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
Creates a new glossary.

Only a steward can create a glossary.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
application/json
object
Show application/json properties
Responses
201

Successfully created a new glossary.

application/json
object
Show application/json properties
400

The request is in incorrect format

application/json
object
Show application/json properties
403

The user does not have privileges to perform the requested action.

application/json
object
Show application/json properties
POST
/api/v1/glossaries
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


await qlik.glossaries.createGlossary({
  description:
    'This glossary contains definitions and concepts of business terms.',
  name: 'Organization wide glossary',
  overview:
    '[{"type":"paragraph","children":[{"text":"This glossary contains business terms"}]}]',
  spaceId: '507f191e810c19729de860ea',
  tags: ['Red', 'Sales'],
  termTemplate: {
    relatedInformation:
      '[{"type":"paragraph","children":[{"text":""}]}]',
  },
})
Example Response
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Organization wide glossary",
  "tags": [
    "Red",
    "Sales"
  ],
  "ownerId": "507f191e810c19729de860ea",
  "spaceId": "507f191e810c19729de860ea",
  "overview": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"This glossary contains business terms\"}]}]",
  "createdAt": "2021-10-02T14:20:50.52Z",
  "createdBy": "507f191e810c19729de860ea",
  "updatedAt": "2021-10-02T14:20:50.52Z",
  "updatedBy": "507f191e810c19729de860ea",
  "description": "This glossary contains definitions and concepts of business terms.",
  "termTemplate": {
    "relatedInformation": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]}]"
  }
}
Retrieves a glossary.
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
id
string
Required

The id of the glossary to retrieve.

format = "uuid"

Responses
200

Successfully retrieved the glossary.

application/json
object
Show application/json properties
400

The request is in incorrect format

application/json
object
Show application/json properties
403

The operation failed due to insufficient permissions.

application/json
object
Show application/json properties
404

The glossary is not found

application/json
object
Show application/json properties
GET
/api/v1/glossaries/{id}
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


await qlik.glossaries.getGlossary(
  '123e4567-e89b-12d3-a456-426614174000',
)
Example Response
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Organization wide glossary",
  "tags": [
    "Red",
    "Sales"
  ],
  "ownerId": "507f191e810c19729de860ea",
  "spaceId": "507f191e810c19729de860ea",
  "overview": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"This glossary contains business terms\"}]}]",
  "createdAt": "2021-10-02T14:20:50.52Z",
  "createdBy": "507f191e810c19729de860ea",
  "updatedAt": "2021-10-02T14:20:50.52Z",
  "updatedBy": "507f191e810c19729de860ea",
  "description": "This glossary contains definitions and concepts of business terms.",
  "termTemplate": {
    "relatedInformation": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]}]"
  }
}
Updates glossary properties with json-patch formatted data.
Facts
	Rate limit	Tier 2 (100 requests per minute)
Header Parameters
if-match
string

Optional header to do conditional updates. Using the Etag value that was returned the last time the glossary was fetched.

Path Parameters
id
string
Required

The glossary id.

format = "uuid"

Request Body
Required
application/json
array of objects

An array of JSON Patch documents

Show application/json properties
Responses
204

Glossary updated successfully.

400

Bad request. Payload could not be parsed to a JSON Patch or Patch operations are invalid.

application/json
object
Show application/json properties
401

Not authorized.

application/json
object
Show application/json properties
403

The operation failed due to insufficient permissions.

application/json
object
Show application/json properties
404

The term to patch was not found.

application/json
object
Show application/json properties
429

Request has been rate limited.

application/json
object
Show application/json properties
PATCH
/api/v1/glossaries/{id}
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


await qlik.glossaries.patchGlossary(
  '123e4567-e89b-12d3-a456-426614174000',
  [
    {
      op: 'replace',
      path: '/name',
      value: 'new name',
    },


    {
      op: 'replace',
      path: '/description',
      value: 'new description',
    },
  ],
)
Updates a glossary.
Facts
	Rate limit	Tier 2 (100 requests per minute)
Header Parameters
if-match
string

Optional header to do conditional updates. Using the Etag value that was returned the last time the glossary was fetched.

Path Parameters
id
string
Required

The id of the glossary to update.

format = "uuid"

Request Body
application/json
object
Show application/json properties
Responses
200

Successfully updated the glossary.

application/json
object
Show application/json properties
400

The request is in incorrect format

application/json
object
Show application/json properties
403

The operation failed due to insufficient permissions.

application/json
object
Show application/json properties
404

The record is not found

application/json
object
Show application/json properties
PUT
/api/v1/glossaries/{id}
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


await qlik.glossaries.updateGlossary(
  '123e4567-e89b-12d3-a456-426614174000',
  {
    description:
      'This glossary contains definitions and concepts of business terms.',
    name: 'Organization wide glossary',
    overview:
      '[{"type":"paragraph","children":[{"text":"This glossary contains business terms"}]}]',
    spaceId: '507f191e810c19729de860ea',
    tags: ['Red', 'Sales'],
    termTemplate: {
      relatedInformation:
        '[{"type":"paragraph","children":[{"text":""}]}]',
    },
  },
)
Example Response
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Organization wide glossary",
  "tags": [
    "Red",
    "Sales"
  ],
  "ownerId": "507f191e810c19729de860ea",
  "spaceId": "507f191e810c19729de860ea",
  "overview": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"This glossary contains business terms\"}]}]",
  "createdAt": "2021-10-02T14:20:50.52Z",
  "createdBy": "507f191e810c19729de860ea",
  "updatedAt": "2021-10-02T14:20:50.52Z",
  "updatedBy": "507f191e810c19729de860ea",
  "description": "This glossary contains definitions and concepts of business terms.",
  "termTemplate": {
    "relatedInformation": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]}]"
  }
}
Deletes a glossary and all of its terms.
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
id
string
Required

The id of the glossary to delete.

format = "uuid"

Responses
204

Successful Operation.

400

The request is in incorrect format

application/json
object
Show application/json properties
403

The operation failed due to insufficient permissions.

application/json
object
Show application/json properties
404

The glossary is not found

application/json
object
Show application/json properties
DELETE
/api/v1/glossaries/{id}
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


await qlik.glossaries.deleteGlossary(
  '123e4567-e89b-12d3-a456-426614174000',
)
Exports a glossary.
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
format
string

The output format

Can be one of: "json""xlsx"

Path Parameters
id
string
Required

The glossary id.

format = "uuid"

Responses
200

Successfully exported the glossary.

application/json
object
Show application/json properties
200

Successfully exported the glossary.

application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
string

format = "binary"

400

The request is in incorrect format

application/json
object
Show application/json properties
403

The operation failed due to insufficient permissions.

application/json
object
Show application/json properties
404

The glossary is not found

application/json
object
Show application/json properties
GET
/api/v1/glossaries/{id}/actions/export
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


await qlik.glossaries.exportGlossary(
  '123e4567-e89b-12d3-a456-426614174000',
)
Example Response
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "string",
  "tags": [
    "tag1",
    "tag2"
  ],
  "terms": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "name",
      "tags": [
        "tag1",
        "tag2"
      ],
      "owner": [
        {
          "name": "Joe Smith",
          "email": "joe.smith@qlik.com",
          "userId": "507f191e810c19729de860ea"
        }
      ],
      "linksTo": [
        {
          "type": "definition",
          "resourceId": "string",
          "resourceType": "app",
          "subResourceId": "string",
          "subResourceName": "string",
          "subResourceType": "master_dimension"
        }
      ],
      "stewards": [
        {
          "name": "string",
          "email": "string",
          "userId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69"
        }
      ],
      "relatesTo": [
        {
          "type": "isA",
          "termId": "123e4567-e89b-12d3-a456-426614174000"
        }
      ],
      "categories": [
        "123e4567-e89b-12d3-a456-426614174000"
      ],
      "description": "description",
      "abbreviation": "abbr",
      "stewardDetails": [
        {
          "name": "string",
          "email": "string",
          "userId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69"
        }
      ]
    }
  ],
  "ownerId": "507f191e810c19729de860ea",
  "spaceId": "507f191e810c19729de860ea",
  "overview": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"This glossary contains business terms\"}]}]",
  "createdAt": "2021-10-02T14:20:50.52Z",
  "createdBy": "507f191e810c19729de860ea",
  "updatedAt": "2021-10-02T14:20:50.52Z",
  "updatedBy": "507f191e810c19729de860ea",
  "categories": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "string",
      "parentId": "123e4567-e89b-12d3-a456-426614174000",
      "description": "string",
      "stewardDetails": [
        {
          "name": "string",
          "email": "string",
          "userId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69"
        }
      ]
    }
  ],
  "description": "string",
  "termTemplate": {
    "relatedInformation": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]}]"
  }
}
Returns a list of categories for a glossary.
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
countTotal
boolean

Optional parameter to request total count for query

limit
integer

The number of terms to get.

minimum = 1, maximum = 100, default = 20, default = 20

next
string

Optional parameter to request the next page.

prev
string

Optional parameter to request the previous page.

sort
string

Optional resource field name to sort on, eg. name. Can be prefixed with +/- to determine order, defaults to (+) ascending.

Can be one of: "description""+description""-description""name""+name""-name""update""+update""-update"

Path Parameters
id
string
Required

The glossary id.

format = "uuid"

Responses
200

Successful Operation.

application/json
object
Show application/json properties
400

The request is in incorrect format

application/json
object
Show application/json properties
403

The operation failed due to insufficient permissions.

application/json
object
Show application/json properties
404

The record is not found

application/json
object
Show application/json properties
GET
/api/v1/glossaries/{id}/categories
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


await qlik.glossaries.getGlossaryCategories(
  '123e4567-e89b-12d3-a456-426614174000',
  {},
)
Example Response
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "string",
      "parentId": "123e4567-e89b-12d3-a456-426614174000",
      "stewards": [
        "6305e8691a1d504df06e2ab9",
        "63075b341a1d504df06e2abc"
      ],
      "createdAt": "2021-10-02T14:20:50.52Z",
      "createdBy": "507f191e810c19729de860ea",
      "updatedAt": "2021-10-02T14:20:50.52Z",
      "updatedBy": "507f191e810c19729de860ea",
      "glossaryId": "123e4567-e89b-12d3-a456-426614174000",
      "description": "string"
    }
  ],
  "meta": {
    "countTotal": 42
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
Creates a new category.
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
id
string
Required

The glossary id.

format = "uuid"

Request Body
application/json
object
Show application/json properties
Responses
201

Successfully created a new category.

application/json
object
Show application/json properties
400

The request is in incorrect format

application/json
object
Show application/json properties
403

The operation failed due to insufficient permissions.

application/json
object
Show application/json properties
404

The record is not found

application/json
object
Show application/json properties
POST
/api/v1/glossaries/{id}/categories
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


await qlik.glossaries.createGlossaryCategory(
  '123e4567-e89b-12d3-a456-426614174000',
  {
    description: 'string',
    name: 'string',
    parentId:
      '123e4567-e89b-12d3-a456-426614174000',
    stewards: [
      '6305e8691a1d504df06e2ab9',


      '63075b341a1d504df06e2abc',
    ],
  },
)
Example Response
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "string",
  "parentId": "123e4567-e89b-12d3-a456-426614174000",
  "stewards": [
    "6305e8691a1d504df06e2ab9",
    "63075b341a1d504df06e2abc"
  ],
  "createdAt": "2021-10-02T14:20:50.52Z",
  "createdBy": "507f191e810c19729de860ea",
  "updatedAt": "2021-10-02T14:20:50.52Z",
  "updatedBy": "507f191e810c19729de860ea",
  "glossaryId": "123e4567-e89b-12d3-a456-426614174000",
  "description": "string"
}
Retrieves a category.
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Header Parameters
if-match
string

Optional header to do conditional updates. Using the Etag value that was returned the last time the category was fetched.

Path Parameters
categoryId
string
Required

The category id.

format = "uuid"

id
string
Required

The glossary id.

format = "uuid"

Responses
200

Successfully retrieved the category.

application/json
object
Show application/json properties
400

The request is in incorrect format

application/json
object
Show application/json properties
403

The operation failed due to insufficient permissions.

application/json
object
Show application/json properties
404

The record is not found

application/json
object
Show application/json properties
GET
/api/v1/glossaries/{id}/categories/{categoryId}
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


await qlik.glossaries.getGlossaryCategory(
  '123e4567-e89b-12d3-a456-426614174000',
  '123e4567-e89b-12d3-a456-426614174000',
)
Example Response
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "string",
  "parentId": "123e4567-e89b-12d3-a456-426614174000",
  "stewards": [
    "6305e8691a1d504df06e2ab9",
    "63075b341a1d504df06e2abc"
  ],
  "createdAt": "2021-10-02T14:20:50.52Z",
  "createdBy": "507f191e810c19729de860ea",
  "updatedAt": "2021-10-02T14:20:50.52Z",
  "updatedBy": "507f191e810c19729de860ea",
  "glossaryId": "123e4567-e89b-12d3-a456-426614174000",
  "description": "string"
}
Updates category properties with json-patch formatted data.
Facts
	Rate limit	Tier 2 (100 requests per minute)
Header Parameters
if-match
string

Optional header to do conditional updates. Using the Etag value that was returned the last time the category was fetched.

Path Parameters
categoryId
string
Required

The category id.

format = "uuid"

id
string
Required

The glossary id.

format = "uuid"

Request Body
Required
application/json
array of objects

An array of JSON Patch documents

Show application/json properties
Responses
204

Category updated successfully.

400

Bad request. Payload could not be parsed to a JSON Patch or Patch operations are invalid.

application/json
object
Show application/json properties
401

Not authorized.

application/json
object
Show application/json properties
403

The operation failed due to insufficient permissions.

application/json
object
Show application/json properties
404

The term to patch was not found.

application/json
object
Show application/json properties
429

Request has been rate limited.

application/json
object
Show application/json properties
PATCH
/api/v1/glossaries/{id}/categories/{categoryId}
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


await qlik.glossaries.patchGlossaryCategory(
  '123e4567-e89b-12d3-a456-426614174000',
  '123e4567-e89b-12d3-a456-426614174000',
  [
    {
      op: 'replace',
      path: '/name',
      value: 'new name',
    },


    {
      op: 'replace',
      path: '/description',
      value: 'new description',
    },
  ],
)
Updates a category.
Facts
	Rate limit	Tier 2 (100 requests per minute)
Header Parameters
if-match
string

Optional header to do conditional updates. Using the Etag value that was returned the last time the category was fetched.

Path Parameters
categoryId
string
Required

The category id.

format = "uuid"

id
string
Required

The glossary id.

format = "uuid"

Request Body
application/json
object
Show application/json properties
Responses
200

Successfully updated the category.

application/json
object
Show application/json properties
400

The request is in incorrect format

application/json
object
Show application/json properties
403

The operation failed due to insufficient permissions.

application/json
object
Show application/json properties
404

The record is not found

application/json
object
Show application/json properties
PUT
/api/v1/glossaries/{id}/categories/{categoryId}
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


await qlik.glossaries.updateGlossaryCategory(
  '123e4567-e89b-12d3-a456-426614174000',
  '123e4567-e89b-12d3-a456-426614174000',
  {
    description: 'string',
    name: 'string',
    parentId:
      '123e4567-e89b-12d3-a456-426614174000',
    stewards: [
      '6305e8691a1d504df06e2ab9',


      '63075b341a1d504df06e2abc',
    ],
  },
)
Example Response
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "string",
  "parentId": "123e4567-e89b-12d3-a456-426614174000",
  "stewards": [
    "6305e8691a1d504df06e2ab9",
    "63075b341a1d504df06e2abc"
  ],
  "createdAt": "2021-10-02T14:20:50.52Z",
  "createdBy": "507f191e810c19729de860ea",
  "updatedAt": "2021-10-02T14:20:50.52Z",
  "updatedBy": "507f191e810c19729de860ea",
  "glossaryId": "123e4567-e89b-12d3-a456-426614174000",
  "description": "string"
}
Deletes a category.
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
categoryId
string
Required

The id for the category to delete. All subcategories are also deleted

format = "uuid"

id
string
Required

The id of the glossary.

format = "uuid"

Responses
204

Successful Operation.

400

The request is in incorrect format

application/json
object
Show application/json properties
403

The operation failed due to insufficient permissions.

application/json
object
Show application/json properties
404

The record is not found

application/json
object
Show application/json properties
DELETE
/api/v1/glossaries/{id}/categories/{categoryId}
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


await qlik.glossaries.deleteGlossaryCategory(
  '123e4567-e89b-12d3-a456-426614174000',
  '123e4567-e89b-12d3-a456-426614174000',
)
Returns a list of terms for a glossary.
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
countTotal
boolean

Optional parameter to request total count for query

filter
string

Optional SCIM filter to be used to filter terms Usable fields are

id
name
relatedInformation
description
abbreviation
tags
stewards
status
categories
limit
integer

The number of terms to get.

minimum = 1, maximum = 100, default = 20, default = 20

next
string

Optional parameter to request the next page.

prev
string

Optional parameter to request the previous page.

sort
string

Optional resource field name to sort on, eg. name. Can be prefixed with +/- to determine order, defaults to (+) ascending.

Can be one of: "abbreviation""+abbreviation""-abbreviation""description""+description""-description""name""+name""-name""status""+status""-status""updated""+updated""-updated"

Path Parameters
id
string
Required

The glossary id.

format = "uuid"

Responses
200

Successful Operation.

application/json
object
Show application/json properties
400

The request is in incorrect format

application/json
object
Show application/json properties
403

The operation failed due to insufficient permissions.

application/json
object
Show application/json properties
404

The record is not found

application/json
object
Show application/json properties
GET
/api/v1/glossaries/{id}/terms
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


await qlik.glossaries.getGlossaryTerms(
  '123e4567-e89b-12d3-a456-426614174000',
  {},
)
Example Response
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Earnings Before Interest and Tax (EBIT)",
      "tags": [
        "Finance",
        "Accounting"
      ],
      "status": {
        "type": "draft",
        "updatedAt": "2021-10-02T14:20:50.52Z",
        "updatedBy": "507f191e810c19729de860ea"
      },
      "linksTo": [
        {
          "id": "123e4567-e89b-12d3-a456-426614174000",
          "name": "Sales App",
          "type": "definition",
          "title": "string",
          "status": 201,
          "openUrl": "https://tenant.qlik.com/sense/app/52bc4307-f9f2-4ce6-b521-67ca87018759",
          "createdAt": "2021-10-02T14:20:50.52Z",
          "createdBy": "507f191e810c19729de860ea",
          "resourceId": "123e4567-e89b-12d3-a456-426614174000",
          "resourceType": "app",
          "subResourceId": "123e4567-e89b-12d3-a456-426614174000",
          "resourceSpaceId": "507f191e810c19729de860ea",
          "subResourceName": "Sales YTD",
          "subResourceType": "master_dimension",
          "subResourceInvalid": true
        }
      ],
      "revision": 0,
      "stewards": [
        "6305e8691a1d504df06e2ab9",
        "63075b341a1d504df06e2abc"
      ],
      "createdAt": "2021-10-02T14:20:50.52Z",
      "createdBy": "507f191e810c19729de860ea",
      "relatesTo": [
        {
          "type": "isA",
          "termId": "123e4567-e89b-12d3-a456-426614174000"
        }
      ],
      "updatedAt": "2021-10-02T14:20:50.52Z",
      "updatedBy": "507f191e810c19729de860ea",
      "categories": [
        "123e4567-e89b-12d3-a456-426614174000",
        "123e4567-e89b-12d3-a456-426614174001"
      ],
      "glossaryId": "123e4567-e89b-12d3-a456-426614174000",
      "description": "string",
      "abbreviation": "EBIT",
      "referredRelations": [
        {
          "type": "isA",
          "termId": "123e4567-e89b-12d3-a456-426614174000"
        }
      ],
      "relatedInformation": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"In accounting and finance, earnings before interest and taxes (EBIT) is a measure of a firm's profit that includes all incomes and expenses (operating and non-operating) except interest expenses and income tax expenses.\"}]}]"
    }
  ],
  "meta": {
    "countTotal": 42
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
Creates a new term.
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
id
string
Required

The glossary id.

format = "uuid"

Request Body
application/json
object
Show application/json properties
Responses
201

Successfully created a new term.

application/json
object
Show application/json properties
400

The request is in incorrect format

application/json
object
Show application/json properties
403

The operation failed due to insufficient permissions.

application/json
object
Show application/json properties
404

The record is not found

application/json
object
Show application/json properties
POST
/api/v1/glossaries/{id}/terms
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


await qlik.glossaries.createGlossaryTerm(
  '123e4567-e89b-12d3-a456-426614174000',
  {
    abbreviation: 'EBIT',
    categories: [
      '123e4567-e89b-12d3-a456-426614174000',


      '123e4567-e89b-12d3-a456-426614174001',
    ],
    description: 'string',
    linksTo: [
      {
        resourceId: 'string',
        resourceType: 'app',
        subResourceId: 'string',
        subResourceName: 'string',
        subResourceType: 'master_dimension',
        type: 'definition',
      },
    ],
    name: 'Earnings Before Interest and Tax (EBIT)',
    relatedInformation:
      '[{"type":"paragraph","children":[{"text":"In accounting and finance, earnings before interest and taxes (EBIT) is a measure of a firm\'s profit that includes all incomes and expenses (operating and non-operating) except interest expenses and income tax expenses."}]}]',
    relatesTo: [
      {
        termId:
          '123e4567-e89b-12d3-a456-426614174000',
        type: 'isA',
      },
    ],
    stewards: [
      '6305e8691a1d504df06e2ab9',


      '63075b341a1d504df06ef2bc',
    ],
    tags: ['Finance', 'Accounting'],
  },
)
Example Response
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Earnings Before Interest and Tax (EBIT)",
  "tags": [
    "Finance",
    "Accounting"
  ],
  "status": {
    "type": "draft",
    "updatedAt": "2021-10-02T14:20:50.52Z",
    "updatedBy": "507f191e810c19729de860ea"
  },
  "linksTo": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Sales App",
      "type": "definition",
      "title": "string",
      "status": 201,
      "openUrl": "https://tenant.qlik.com/sense/app/52bc4307-f9f2-4ce6-b521-67ca87018759",
      "createdAt": "2021-10-02T14:20:50.52Z",
      "createdBy": "507f191e810c19729de860ea",
      "resourceId": "123e4567-e89b-12d3-a456-426614174000",
      "resourceType": "app",
      "subResourceId": "123e4567-e89b-12d3-a456-426614174000",
      "resourceSpaceId": "507f191e810c19729de860ea",
      "subResourceName": "Sales YTD",
      "subResourceType": "master_dimension",
      "subResourceInvalid": true
    }
  ],
  "revision": 0,
  "stewards": [
    "6305e8691a1d504df06e2ab9",
    "63075b341a1d504df06e2abc"
  ],
  "createdAt": "2021-10-02T14:20:50.52Z",
  "createdBy": "507f191e810c19729de860ea",
  "relatesTo": [
    {
      "type": "isA",
      "termId": "123e4567-e89b-12d3-a456-426614174000"
    }
  ],
  "updatedAt": "2021-10-02T14:20:50.52Z",
  "updatedBy": "507f191e810c19729de860ea",
  "categories": [
    "123e4567-e89b-12d3-a456-426614174000",
    "123e4567-e89b-12d3-a456-426614174001"
  ],
  "glossaryId": "123e4567-e89b-12d3-a456-426614174000",
  "description": "string",
  "abbreviation": "EBIT",
  "referredRelations": [
    {
      "type": "isA",
      "termId": "123e4567-e89b-12d3-a456-426614174000"
    }
  ],
  "relatedInformation": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"In accounting and finance, earnings before interest and taxes (EBIT) is a measure of a firm's profit that includes all incomes and expenses (operating and non-operating) except interest expenses and income tax expenses.\"}]}]"
}
Retrieves a term.
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
id
string
Required

The glossary id.

format = "uuid"

termId
string
Required

The term id.

format = "uuid"

Responses
200

Successfully retrieved the term.

application/json
object
Show application/json properties
400

The request is in incorrect format

application/json
object
Show application/json properties
403

The operation failed due to insufficient permissions.

application/json
object
Show application/json properties
404

The record is not found

application/json
object
Show application/json properties
GET
/api/v1/glossaries/{id}/terms/{termId}
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


await qlik.glossaries.getGlossaryTerm(
  '123e4567-e89b-12d3-a456-426614174000',
  '123e4567-e89b-12d3-a456-426614174000',
)
Example Response
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Earnings Before Interest and Tax (EBIT)",
  "tags": [
    "Finance",
    "Accounting"
  ],
  "status": {
    "type": "draft",
    "updatedAt": "2021-10-02T14:20:50.52Z",
    "updatedBy": "507f191e810c19729de860ea"
  },
  "linksTo": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Sales App",
      "type": "definition",
      "title": "string",
      "status": 201,
      "openUrl": "https://tenant.qlik.com/sense/app/52bc4307-f9f2-4ce6-b521-67ca87018759",
      "createdAt": "2021-10-02T14:20:50.52Z",
      "createdBy": "507f191e810c19729de860ea",
      "resourceId": "123e4567-e89b-12d3-a456-426614174000",
      "resourceType": "app",
      "subResourceId": "123e4567-e89b-12d3-a456-426614174000",
      "resourceSpaceId": "507f191e810c19729de860ea",
      "subResourceName": "Sales YTD",
      "subResourceType": "master_dimension",
      "subResourceInvalid": true
    }
  ],
  "revision": 0,
  "stewards": [
    "6305e8691a1d504df06e2ab9",
    "63075b341a1d504df06e2abc"
  ],
  "createdAt": "2021-10-02T14:20:50.52Z",
  "createdBy": "507f191e810c19729de860ea",
  "relatesTo": [
    {
      "type": "isA",
      "termId": "123e4567-e89b-12d3-a456-426614174000"
    }
  ],
  "updatedAt": "2021-10-02T14:20:50.52Z",
  "updatedBy": "507f191e810c19729de860ea",
  "categories": [
    "123e4567-e89b-12d3-a456-426614174000",
    "123e4567-e89b-12d3-a456-426614174001"
  ],
  "glossaryId": "123e4567-e89b-12d3-a456-426614174000",
  "description": "string",
  "abbreviation": "EBIT",
  "referredRelations": [
    {
      "type": "isA",
      "termId": "123e4567-e89b-12d3-a456-426614174000"
    }
  ],
  "relatedInformation": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"In accounting and finance, earnings before interest and taxes (EBIT) is a measure of a firm's profit that includes all incomes and expenses (operating and non-operating) except interest expenses and income tax expenses.\"}]}]"
}
Updates term properties with json-patch formatted data
Facts
	Rate limit	Tier 2 (100 requests per minute)
Header Parameters
if-match
string

Optional header to do conditional updates. Using the Etag value that was returned the last time the term was fetched.

Path Parameters
id
string
Required

The glossary id.

format = "uuid"

termId
string
Required

The term id.

format = "uuid"

Request Body
Required
application/json
array of objects

An array of JSON Patch documents

Show application/json properties
Responses
204

Term updated successfully.

400

Bad request. Payload could not be parsed to a JSON Patch or Patch operations are invalid.

application/json
object
Show application/json properties
401

Not authorized.

application/json
object
Show application/json properties
403

The operation failed due to insufficient permissions.

application/json
object
Show application/json properties
404

The term to patch was not found.

application/json
object
Show application/json properties
412

Conditional update failed. Trying to modify an old version.

application/json
object
Show application/json properties
429

Request has been rate limited.

application/json
object
Show application/json properties
PATCH
/api/v1/glossaries/{id}/terms/{termId}
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


await qlik.glossaries.patchGlossaryTerm(
  '123e4567-e89b-12d3-a456-426614174000',
  '123e4567-e89b-12d3-a456-426614174000',
  [
    {
      op: 'replace',
      path: '/name',
      value: 'new name',
    },


    {
      op: 'replace',
      path: '/description',
      value: 'new description',
    },
  ],
)
Updates a term.
Facts
	Rate limit	Tier 2 (100 requests per minute)
Header Parameters
if-match
string

Optional header to do conditional updates. Using the Etag value that was returned the last time the term was fetched.

Path Parameters
id
string
Required

The glossary id.

format = "uuid"

termId
string
Required

The term id.

format = "uuid"

Request Body
application/json
object
Show application/json properties
Responses
200

Successfully updated the term.

application/json
object
Show application/json properties
400

The request is in incorrect format

application/json
object
Show application/json properties
403

The operation failed due to insufficient permissions.

application/json
object
Show application/json properties
404

The record is not found

application/json
object
Show application/json properties
412

Conditional update failed. Trying to modify an old version.

application/json
object
Show application/json properties
PUT
/api/v1/glossaries/{id}/terms/{termId}
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


await qlik.glossaries.updateGlossaryTerm(
  '123e4567-e89b-12d3-a456-426614174000',
  '123e4567-e89b-12d3-a456-426614174000',
  {
    abbreviation: 'EBIT',
    categories: [
      '123e4567-e89b-12d3-a456-426614174000',


      '123e4567-e89b-12d3-a456-426614174001',
    ],
    description: 'string',
    linksTo: [
      {
        resourceId: 'string',
        resourceType: 'app',
        subResourceId: 'string',
        subResourceName: 'string',
        subResourceType: 'master_dimension',
        type: 'definition',
      },
    ],
    name: 'Earnings Before Interest and Tax (EBIT)',
    relatedInformation:
      '[{"type":"paragraph","children":[{"text":"In accounting and finance, earnings before interest and taxes (EBIT) is a measure of a firm\'s profit that includes all incomes and expenses (operating and non-operating) except interest expenses and income tax expenses."}]}]',
    relatesTo: [
      {
        termId:
          '123e4567-e89b-12d3-a456-426614174000',
        type: 'isA',
      },
    ],
    stewards: [
      '6305e8691a1d504df06e2ab9',


      '63075b341a1d504df06ef2bc',
    ],
    tags: ['Finance', 'Accounting'],
  },
)
Example Response
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Earnings Before Interest and Tax (EBIT)",
  "tags": [
    "Finance",
    "Accounting"
  ],
  "status": {
    "type": "draft",
    "updatedAt": "2021-10-02T14:20:50.52Z",
    "updatedBy": "507f191e810c19729de860ea"
  },
  "linksTo": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Sales App",
      "type": "definition",
      "title": "string",
      "status": 201,
      "openUrl": "https://tenant.qlik.com/sense/app/52bc4307-f9f2-4ce6-b521-67ca87018759",
      "createdAt": "2021-10-02T14:20:50.52Z",
      "createdBy": "507f191e810c19729de860ea",
      "resourceId": "123e4567-e89b-12d3-a456-426614174000",
      "resourceType": "app",
      "subResourceId": "123e4567-e89b-12d3-a456-426614174000",
      "resourceSpaceId": "507f191e810c19729de860ea",
      "subResourceName": "Sales YTD",
      "subResourceType": "master_dimension",
      "subResourceInvalid": true
    }
  ],
  "revision": 0,
  "stewards": [
    "6305e8691a1d504df06e2ab9",
    "63075b341a1d504df06e2abc"
  ],
  "createdAt": "2021-10-02T14:20:50.52Z",
  "createdBy": "507f191e810c19729de860ea",
  "relatesTo": [
    {
      "type": "isA",
      "termId": "123e4567-e89b-12d3-a456-426614174000"
    }
  ],
  "updatedAt": "2021-10-02T14:20:50.52Z",
  "updatedBy": "507f191e810c19729de860ea",
  "categories": [
    "123e4567-e89b-12d3-a456-426614174000",
    "123e4567-e89b-12d3-a456-426614174001"
  ],
  "glossaryId": "123e4567-e89b-12d3-a456-426614174000",
  "description": "string",
  "abbreviation": "EBIT",
  "referredRelations": [
    {
      "type": "isA",
      "termId": "123e4567-e89b-12d3-a456-426614174000"
    }
  ],
  "relatedInformation": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"In accounting and finance, earnings before interest and taxes (EBIT) is a measure of a firm's profit that includes all incomes and expenses (operating and non-operating) except interest expenses and income tax expenses.\"}]}]"
}
Deletes a term.
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
id
string
Required

The glossary id.

format = "uuid"

termId
string
Required

The term id.

format = "uuid"

Responses
204

Successful Operation.

400

The request is in incorrect format

application/json
object
Show application/json properties
403

The operation failed due to insufficient permissions.

application/json
object
Show application/json properties
404

The record is not found

application/json
object
Show application/json properties
DELETE
/api/v1/glossaries/{id}/terms/{termId}
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


await qlik.glossaries.deleteGlossaryTerm(
  '123e4567-e89b-12d3-a456-426614174000',
  '123e4567-e89b-12d3-a456-426614174000',
)
Changes the status of the term.

Only a steward can verify a term. Once the term is verified only a steward can modify the term. Note that links to resources are considered external relations that can be managed independently of the status of the term.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Header Parameters
if-match
string

Optional header to do conditional updates. Using the Etag value that was returned the last time the term was fetched.

Query Parameters
status
string
Required

The status to update to.

Can be one of: "draft""verified""deprecated"

Path Parameters
id
string
Required

The glossary id.

format = "uuid"

termId
string
Required

The term id.

format = "uuid"

Responses
200

Successfully updated the term status.

application/json
object
Show application/json properties
400

The request is in incorrect format

application/json
object
Show application/json properties
403

The operation failed due to insufficient permissions.

application/json
object
Show application/json properties
404

The record is not found

application/json
object
Show application/json properties
412

Conditional update failed. Trying to modify an old version.

application/json
object
Show application/json properties
POST
/api/v1/glossaries/{id}/terms/{termId}/actions/change-status
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


await qlik.glossaries.changeGlossaryTermStatus(
  '123e4567-e89b-12d3-a456-426614174000',
  '123e4567-e89b-12d3-a456-426614174000',
  { status: 'draft' },
)
Example Response
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Earnings Before Interest and Tax (EBIT)",
  "tags": [
    "Finance",
    "Accounting"
  ],
  "status": {
    "type": "draft",
    "updatedAt": "2021-10-02T14:20:50.52Z",
    "updatedBy": "507f191e810c19729de860ea"
  },
  "linksTo": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Sales App",
      "type": "definition",
      "title": "string",
      "status": 201,
      "openUrl": "https://tenant.qlik.com/sense/app/52bc4307-f9f2-4ce6-b521-67ca87018759",
      "createdAt": "2021-10-02T14:20:50.52Z",
      "createdBy": "507f191e810c19729de860ea",
      "resourceId": "123e4567-e89b-12d3-a456-426614174000",
      "resourceType": "app",
      "subResourceId": "123e4567-e89b-12d3-a456-426614174000",
      "resourceSpaceId": "507f191e810c19729de860ea",
      "subResourceName": "Sales YTD",
      "subResourceType": "master_dimension",
      "subResourceInvalid": true
    }
  ],
  "revision": 0,
  "stewards": [
    "6305e8691a1d504df06e2ab9",
    "63075b341a1d504df06e2abc"
  ],
  "createdAt": "2021-10-02T14:20:50.52Z",
  "createdBy": "507f191e810c19729de860ea",
  "relatesTo": [
    {
      "type": "isA",
      "termId": "123e4567-e89b-12d3-a456-426614174000"
    }
  ],
  "updatedAt": "2021-10-02T14:20:50.52Z",
  "updatedBy": "507f191e810c19729de860ea",
  "categories": [
    "123e4567-e89b-12d3-a456-426614174000",
    "123e4567-e89b-12d3-a456-426614174001"
  ],
  "glossaryId": "123e4567-e89b-12d3-a456-426614174000",
  "description": "string",
  "abbreviation": "EBIT",
  "referredRelations": [
    {
      "type": "isA",
      "termId": "123e4567-e89b-12d3-a456-426614174000"
    }
  ],
  "relatedInformation": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"In accounting and finance, earnings before interest and taxes (EBIT) is a measure of a firm's profit that includes all incomes and expenses (operating and non-operating) except interest expenses and income tax expenses.\"}]}]"
}
Returns a list of links assigned to a term.
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
countTotal
boolean

Optional parameter to request total count for query

filter
string

Optional SCIM filter to be used to filter terms

limit
integer

The number of terms to get.

minimum = 1, maximum = 100, default = 20, default = 20

next
string

Optional parameter to request the next page.

prev
string

Optional parameter to request the previous page.

sort
string

Optional resource field name to sort on, eg. name. Can be prefixed with +/- to determine order, defaults to (+) ascending.

Can be one of: "type""+type""-type""subtype""+subtype""-subtype""created""+created""-created"

Path Parameters
id
string
Required

The glossary id.

format = "uuid"

termId
string
Required

The term id.

format = "uuid"

Responses
200

Successful Operation.

application/json
object
Show application/json properties
400

The request is in incorrect format

application/json
object
Show application/json properties
403

The operation failed due to insufficient permissions.

application/json
object
Show application/json properties
404

The record is not found

application/json
object
Show application/json properties
GET
/api/v1/glossaries/{id}/terms/{termId}/links
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


await qlik.glossaries.getGlossaryTermLinks(
  '123e4567-e89b-12d3-a456-426614174000',
  '123e4567-e89b-12d3-a456-426614174000',
  {},
)
Example Response
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Sales App",
      "type": "definition",
      "title": "string",
      "status": 201,
      "openUrl": "https://tenant.qlik.com/sense/app/52bc4307-f9f2-4ce6-b521-67ca87018759",
      "createdAt": "2021-10-02T14:20:50.52Z",
      "createdBy": "507f191e810c19729de860ea",
      "resourceId": "123e4567-e89b-12d3-a456-426614174000",
      "resourceType": "app",
      "subResourceId": "123e4567-e89b-12d3-a456-426614174000",
      "resourceSpaceId": "507f191e810c19729de860ea",
      "subResourceName": "Sales YTD",
      "subResourceType": "master_dimension",
      "subResourceInvalid": true
    }
  ],
  "meta": {
    "countTotal": 42
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
Creates a new link to a term.

Links to resources are not considered term properties but external relations. Links can be created for terms in any status. Permissions on term and resource determine if the link can be created.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Header Parameters
if-match
string

Optional header to do conditional updates. Using the Etag value that was returned the last time the term was fetched.

Path Parameters
id
string
Required

The glossary id.

format = "uuid"

termId
string
Required

The term id.

format = "uuid"

Request Body
application/json
object

Describes links to other data assets such as analytics applications or dataset.

Note: When linking to a subresource (e.g., a master dimension, master measure, or dataset field within an app or dataset), all three subresource fields (subResourceType, subResourceId, and subResourceName) must be provided together. If any one subresource field is specified, all three are required.

Show application/json properties
Responses
201

Successfully created the link.

application/json
object

Describes links to other entities such as qlik charts, dataset columns etc.

Show application/json properties
400

The request is in incorrect format

application/json
object
Show application/json properties
403

The operation failed due to insufficient permissions.

application/json
object
Show application/json properties
404

The record is not found

application/json
object
Show application/json properties
412

Conditional update failed. Trying to modify an old version.

application/json
object
Show application/json properties
POST
/api/v1/glossaries/{id}/terms/{termId}/links
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


await qlik.glossaries.createGlossaryTermLink(
  '123e4567-e89b-12d3-a456-426614174000',
  '123e4567-e89b-12d3-a456-426614174000',
  {
    resourceId: 'string',
    resourceType: 'app',
    subResourceId: 'string',
    subResourceName: 'string',
    subResourceType: 'master_dimension',
    type: 'definition',
  },
)
Example Response
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Sales App",
  "type": "definition",
  "title": "string",
  "status": 201,
  "openUrl": "https://tenant.qlik.com/sense/app/52bc4307-f9f2-4ce6-b521-67ca87018759",
  "createdAt": "2021-10-02T14:20:50.52Z",
  "createdBy": "507f191e810c19729de860ea",
  "resourceId": "123e4567-e89b-12d3-a456-426614174000",
  "resourceType": "app",
  "subResourceId": "123e4567-e89b-12d3-a456-426614174000",
  "resourceSpaceId": "507f191e810c19729de860ea",
  "subResourceName": "Sales YTD",
  "subResourceType": "master_dimension",
  "subResourceInvalid": true
}
Retrieves previous revisions of a term.
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
countTotal
boolean

Optional parameter to request total count for query

limit
integer

The number of terms to get.

minimum = 1, maximum = 100, default = 20, default = 20

next
string

Optional parameter to request the next page.

prev
string

Optional parameter to request the previous page.

sort
string

Optional resource field name to sort on, eg. name. Can be prefixed with +/- to determine order, defaults to (+) ascending.

Can be one of: "update""+update""-update"

Path Parameters
id
string
Required

The glossary id.

format = "uuid"

termId
string
Required

The term id.

format = "uuid"

Responses
200

Successfully retrieved the revisions.

application/json
object
Show application/json properties
400

The request is in incorrect format

application/json
object
Show application/json properties
403

The operation failed due to insufficient permissions.

application/json
object
Show application/json properties
404

The record is not found

application/json
object
Show application/json properties
GET
/api/v1/glossaries/{id}/terms/{termId}/revisions
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


await qlik.glossaries.getGlossaryTermRevisions(
  '123e4567-e89b-12d3-a456-426614174000',
  '123e4567-e89b-12d3-a456-426614174000',
  {},
)
Example Response
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Earnings Before Interest and Tax (EBIT)",
      "tags": [
        "Finance",
        "Accounting"
      ],
      "status": {
        "type": "draft",
        "updatedAt": "2021-10-02T14:20:50.52Z",
        "updatedBy": "507f191e810c19729de860ea"
      },
      "linksTo": [
        {
          "id": "123e4567-e89b-12d3-a456-426614174000",
          "name": "Sales App",
          "type": "definition",
          "title": "string",
          "status": 201,
          "openUrl": "https://tenant.qlik.com/sense/app/52bc4307-f9f2-4ce6-b521-67ca87018759",
          "createdAt": "2021-10-02T14:20:50.52Z",
          "createdBy": "507f191e810c19729de860ea",
          "resourceId": "123e4567-e89b-12d3-a456-426614174000",
          "resourceType": "app",
          "subResourceId": "123e4567-e89b-12d3-a456-426614174000",
          "resourceSpaceId": "507f191e810c19729de860ea",
          "subResourceName": "Sales YTD",
          "subResourceType": "master_dimension",
          "subResourceInvalid": true
        }
      ],
      "revision": 0,
      "stewards": [
        "6305e8691a1d504df06e2ab9",
        "63075b341a1d504df06e2abc"
      ],
      "createdAt": "2021-10-02T14:20:50.52Z",
      "createdBy": "507f191e810c19729de860ea",
      "relatesTo": [
        {
          "type": "isA",
          "termId": "123e4567-e89b-12d3-a456-426614174000"
        }
      ],
      "updatedAt": "2021-10-02T14:20:50.52Z",
      "updatedBy": "507f191e810c19729de860ea",
      "categories": [
        "123e4567-e89b-12d3-a456-426614174000",
        "123e4567-e89b-12d3-a456-426614174001"
      ],
      "glossaryId": "123e4567-e89b-12d3-a456-426614174000",
      "description": "string",
      "abbreviation": "EBIT",
      "referredRelations": [
        {
          "type": "isA",
          "termId": "123e4567-e89b-12d3-a456-426614174000"
        }
      ],
      "relatedInformation": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"In accounting and finance, earnings before interest and taxes (EBIT) is a measure of a firm's profit that includes all incomes and expenses (operating and non-operating) except interest expenses and income tax expenses.\"}]}]"
    }
  ],
  "meta": {
    "countTotal": 42
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
Imports a glossary from file.

Creates a new or updates an existing glossary, including categories and terms, based on a glossary definition file. Supported formats are currently, qlik, atlan and atlas.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Query Parameters
importerAsFallbackSteward
boolean

Appending the current importer user as steward to categories/terms where no steward is defined/not match the identity service.

lookupUserOnEmail
boolean

Using email in the steward fields to lookup userIds in the identity service

spaceId
string

The spaceId (leave blank or omit for personal)

format = "uid"

Request Body
application/json
object
Show application/json properties
application/json+qlik
object
Show application/json+qlik properties
application/json+atlan
object

Atlan glossary format. For more information, see https://docs.atlan.com/

Show application/json+atlan properties
application/json+atlas
object
Show application/json+atlas properties
Responses
201

Successfully created a new glossary.

application/json
object
Show application/json properties
400

See custom codes

application/json
object
Custom error codes
BG-1 - Context JWT is missing tenantId.
BG-2 - Context JWT is missing userId.
BG-4 - Invalid or unsupported Content Type. Valid types are: application/json, application/json+qlik, application/json+atlan, application/json+atlas
BG-5 - Failed to decode JSON payload.
BG-6 - A glossary name is required.
BG-7 - Two categories with the same name cannot have the same parent.
BG-11 - Glossary validation failed - A value or parameter is invalid or not set
BG-12 - Category validation failed - A value or parameter is invalid or not set
BG-13 - Term validation failed - A value or parameter is invalid or not set
BG-14 - Two or more categories share Id
BG-15 - Two or more terms share Id
BG-16 - Not detecting proper Atlas format
BG-17 - Not detecting proper Atlan format
BG-18 - Not detecting proper Qlik format
BG-19 - Invalid format in term
BG-20 - Duplicate link definition
BG-21 - Rich text validation failed. Rich text fields must be valid JSON strings in the format: [{"type":"paragraph","children":[{"text":"your text here"}]}]
BG-22 - Import cancelled
BG-23 - Duplicate link related
Show application/json properties
403

See custom codes

application/json
object
Custom error codes
BG-3 - Access denied, no read access
BG-30 - Feature not enabled on tenant.
Show application/json properties
404

See custom codes

application/json
object
Custom error codes
BG-8 - Glossary not found
BG-9 - Category not found
BG-10 - Term not found
Show application/json properties
POST
/api/v1/glossaries/actions/import
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


await qlik.glossaries.importGlossary(
  {},
  {
    categories: [
      {
        description: 'string',
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'string',
        parentId:
          '123e4567-e89b-12d3-a456-426614174000',
        stewardDetails: [
          {
            email: 'string',
            name: 'string',
            userId:
              'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
          },
        ],
        stewards: ['507f191e810c19729de860ea'],
      },
    ],
    description: 'string',
    name: 'string',
    overview:
      '[{"type":"paragraph","children":[{"text":""}]}]',
    spaceId: '507f191e810c19729de860ea',
    tags: ['tag1', 'tag2'],
    termTemplate: {
      relatedInformation:
        '[{"type":"paragraph","children":[{"text":""}]}]',
    },
    terms: [
      {
        abbreviation: 'abbr',
        categories: [
          '123e4567-e89b-12d3-a456-426614174000',
        ],
        description: 'description',
        id: '123e4567-e89b-12d3-a456-426614174000',
        linksTo: [
          {
            resourceId: 'string',
            resourceType: 'app',
            subResourceId: 'string',
            subResourceName: 'string',
            subResourceType: 'master_dimension',
            type: 'definition',
          },
        ],
        name: 'name',
        owner: [
          {
            email: 'joe.smith@qlik.com',
            name: 'Joe Smith',
            userId: '507f191e810c19729de860ea',
          },
        ],
        relatesTo: [
          {
            termId:
              '123e4567-e89b-12d3-a456-426614174000',
            type: 'isA',
          },
        ],
        stewardDetails: [
          {
            email: 'string',
            name: 'string',
            userId:
              'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
          },
        ],
        stewards: [
          {
            email: 'string',
            name: 'string',
            userId:
              'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
          },
        ],
        tags: ['tag1', 'tag2'],
      },
    ],
  },
)
Example Response
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Organization wide glossary",
  "tags": [
    "Red",
    "Sales"
  ],
  "ownerId": "507f191e810c19729de860ea",
  "spaceId": "507f191e810c19729de860ea",
  "overview": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"This glossary contains business terms\"}]}]",
  "createdAt": "2021-10-02T14:20:50.52Z",
  "createdBy": "507f191e810c19729de860ea",
  "updatedAt": "2021-10-02T14:20:50.52Z",
  "updatedBy": "507f191e810c19729de860ea",
  "description": "This glossary contains definitions and concepts of business terms.",
  "termTemplate": {
    "relatedInformation": "[{\"type\":\"paragraph\",\"children\":[{\"text\":\"\"}]}]"
  }
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