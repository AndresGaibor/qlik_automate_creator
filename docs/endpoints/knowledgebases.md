---
title: "Knowledgebases REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/knowledgebases/"
local_path: "docs/endpoints/knowledgebases.md"
---

Title: Knowledgebases REST | Qlik Developer Portal


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
Knowledgebases

Knowledgebases are collections of individual data sources, that are indexed for use in generating responses to user questions via Assistants for Qlik Answers.

Download OpenAPI spec
Endpoints
GET
/api/v1/knowledgebases
POST
/api/v1/knowledgebases
GET
/api/v1/knowledgebases/{id}
PATCH
/api/v1/knowledgebases/{id}
DELETE
/api/v1/knowledgebases/{id}
POST
/api/v1/knowledgebases/{id}/actions/search
POST
/api/v1/knowledgebases/{id}/datasources
PUT
/api/v1/knowledgebases/{id}/datasources/{datasourceId}
DELETE
/api/v1/knowledgebases/{id}/datasources/{datasourceId}
POST
/api/v1/knowledgebases/{id}/datasources/{datasourceId}/actions/cancel
POST
/api/v1/knowledgebases/{id}/datasources/{datasourceId}/actions/download
POST
/api/v1/knowledgebases/{id}/datasources/{datasourceId}/actions/sync
GET
/api/v1/knowledgebases/{id}/datasources/{datasourceId}/histories
GET
/api/v1/knowledgebases/{id}/datasources/{datasourceId}/histories/{syncId}
GET
/api/v1/knowledgebases/{id}/datasources/{datasourceId}/schedules
POST
/api/v1/knowledgebases/{id}/datasources/{datasourceId}/schedules
DELETE
/api/v1/knowledgebases/{id}/datasources/{datasourceId}/schedules
GET
/api/v1/knowledgebases/{id}/histories
List knowledgebases

Returns a list of all knowledgebases the user has access to.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
limit
integer

The number of knowledgebases to get.

minimum = 1, maximum = 100, default = 20, default = 20

next
string

Optional parameter to request the next page.

prev
string

Optional parameter to request the previous page.

sort
string

Optional resource field name to sort on, case insensitive, eg. name. Can be prefixed with - to set descending order, defaults to ascending.

Can be one of: "NAME""-NAME""DESCRIPTION""-DESCRIPTION""CREATED""-CREATED""UPDATED""-UPDATED"

countTotal
boolean
Deprecated

Optional parameter to request total count for query

default = false

Responses
200

Successful Operation.

application/json
object
Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
403

The user does not have privileges to perform the requested action.

application/json
object
Show application/json properties
GET
/api/v1/knowledgebases
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


await qlik.knowledgebases.getKnowledgebases({})
Example Response
{
  "data": [
    {
      "id": "f256b3e4-03e0-4f74-ae46-a4d43882ee5d",
      "name": "Organization wide knowledgebase",
      "tags": [
        "Red",
        "Sales"
      ],
      "ownerId": "507f191e810c19729de860ea",
      "spaceId": "507f191e810c19729de860ea",
      "tenantId": "507f191e810c19729de860ea",
      "createdAt": "2021-10-02T14:20:50.52Z",
      "createdBy": "507f191e810c19729de860ea",
      "updatedAt": "2021-10-02T14:20:50.52Z",
      "updatedBy": "507f191e810c19729de860ea",
      "description": "This knowledgebase is used for...",
      "lastIndexedAt": "2021-10-02T14:20:50.52Z",
      "contentSummary": {
        "fileSize": 42,
        "textSize": 42,
        "fileCount": 42,
        "effectivePages": 42
      },
      "advancedIndexing": true,
      "selectedErrorsCount": 10
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
Create new knowledgebase

Creates a new knowledgebase.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
application/json
object
Show application/json properties
Responses
201

Successfully created a new knowledgebase.

application/json
object
Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
403

The user does not have privileges to perform the requested action.

application/json
object
Show application/json properties
POST
/api/v1/knowledgebases
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


await qlik.knowledgebases.createKnowledgebase({
  description:
    'This knowledgebase is used for...',
  name: 'Organization wide knowledgebase',
  selectedErrorsCount: 10,
  spaceId: '507f191e810c19729de860ea',
  tags: ['Red', 'Sales'],
})
Example Response
{
  "id": "f256b3e4-03e0-4f74-ae46-a4d43882ee5d",
  "name": "Organization wide knowledgebase",
  "tags": [
    "Red",
    "Sales"
  ],
  "ownerId": "507f191e810c19729de860ea",
  "spaceId": "507f191e810c19729de860ea",
  "tenantId": "507f191e810c19729de860ea",
  "createdAt": "2021-10-02T14:20:50.52Z",
  "createdBy": "507f191e810c19729de860ea",
  "updatedAt": "2021-10-02T14:20:50.52Z",
  "updatedBy": "507f191e810c19729de860ea",
  "description": "This knowledgebase is used for...",
  "lastIndexedAt": "2021-10-02T14:20:50.52Z",
  "contentSummary": {
    "fileSize": 42,
    "textSize": 42,
    "fileCount": 42,
    "effectivePages": 42
  },
  "advancedIndexing": true,
  "selectedErrorsCount": 10
}
Retrieve a knowledgebase

Retrieves a specific knowledgebase.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
id
string
Required

The id of the knowledgebase to retrieve.

format = "uuid"

Responses
200

Successfully retrieved the knowledgebase.

application/json
object
Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
403

The operation failed due to insufficient permissions.

application/json
object
Show application/json properties
404

The knowledgebase is not found

application/json
object
Show application/json properties
GET
/api/v1/knowledgebases/{id}
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


await qlik.knowledgebases.getKnowledgebase(
  'f256b3e4-03e0-4f74-ae46-a4d43882ee5d',
)
Example Response
{
  "id": "f256b3e4-03e0-4f74-ae46-a4d43882ee5d",
  "name": "Organization wide knowledgebase",
  "tags": [
    "Red",
    "Sales"
  ],
  "ownerId": "507f191e810c19729de860ea",
  "spaceId": "507f191e810c19729de860ea",
  "tenantId": "507f191e810c19729de860ea",
  "createdAt": "2021-10-02T14:20:50.52Z",
  "createdBy": "507f191e810c19729de860ea",
  "updatedAt": "2021-10-02T14:20:50.52Z",
  "updatedBy": "507f191e810c19729de860ea",
  "description": "This knowledgebase is used for...",
  "lastIndexedAt": "2021-10-02T14:20:50.52Z",
  "contentSummary": {
    "fileSize": 42,
    "textSize": 42,
    "fileCount": 42,
    "effectivePages": 42
  },
  "advancedIndexing": true,
  "selectedErrorsCount": 10,
  "datasources": [
    {
      "id": "f256b3e4-03e0-4f74-ae46-a4d43882ee5d",
      "name": "string",
      "type": "file",
      "spaceId": "507f191e810c19729de860ea",
      "chunking": {
        "size": 1024,
        "type": "recursive",
        "overlap": 20,
        "separators": [
          "\n",
          ".",
          " "
        ],
        "keepSeparator": false
      },
      "syncInfo": {
        "status": "neverIndexed",
        "startedAt": "2021-10-02T14:20:50.52Z",
        "lastSyncId": "f256b3e4-03e0-4f74-ae46-a4d43882ee5d",
        "completedAt": "2021-10-02T14:20:50.52Z"
      },
      "fileConfig": {
        "files": [
          "string"
        ],
        "scope": {
          "depth": 1,
          "maxSize": 1000000,
          "extensions": [
            "pdf"
          ],
          "maxFilesTotal": 50,
          "modifiedAfter": "2021-10-02T14:20:50.52Z",
          "maxFilesPerFolder": 100
        },
        "folder": "folderA/folderB",
        "userId": "507f191e810c19729de860ea",
        "connectionId": "f256b3e4-03e0-4f74-ae46-a4d43882ee5d",
        "crawlPatterns": [
          {
            "type": "include",
            "pattern": "(.*)example(.*)"
          }
        ]
      },
      "sourceCount": 10,
      "contentSummary": {
        "fileSize": 42,
        "textSize": 42,
        "fileCount": 42,
        "effectivePages": 42
      }
    }
  ]
}
Update a knowledgebase

Updates properties of a specific knowledgebase.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Header Parameters
if-match
string

Optional header to do conditional updates. Using the Etag value that was returned the last time the knowledgebase was fetched.

Path Parameters
id
string
Required

The knowledgebase id.

format = "uuid"

Request Body
Required
application/json
array of objects

An array of JSON Patch documents

Show application/json properties
Responses
204

Knowledgebase updated successfully.

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
/api/v1/knowledgebases/{id}
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


await qlik.knowledgebases.patchKnowledgebase(
  'f256b3e4-03e0-4f74-ae46-a4d43882ee5d',
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
Delete a knowledgebase

Deletes a knowledgebase and all of its resources.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
id
string
Required

The id of the knowledgebase to delete.

format = "uuid"

Responses
204

Successful Operation.

400

The request is in incorrect format.

application/json
object
Show application/json properties
403

The operation failed due to insufficient permissions.

application/json
object
Show application/json properties
404

The knowledgebase is not found

application/json
object
Show application/json properties
DELETE
/api/v1/knowledgebases/{id}
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


await qlik.knowledgebases.deleteKnowledgebase(
  'f256b3e4-03e0-4f74-ae46-a4d43882ee5d',
)
Search chunks from a knowledge base

Execute search with either SIMPLE or FULL mode. SIMPLE does semantic search while FULL will also do reranking and include keyword based chunks. Use topN to control number of chunks in response, max limit is 50. Default to 5.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
id
string
Required

The ID of the knowledgebase

format = "uuid"

Request Body
application/json
object
Show application/json properties
Responses
200

Chunks retrieved successfully.

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
404

Knowledgebase is not found.

application/json
object
Show application/json properties
405

Method is not allowed.

application/json
object
Show application/json properties
500

Prompt processing error.

application/json
object
Show application/json properties
POST
/api/v1/knowledgebases/{id}/actions/search
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/v1/knowledgebases/{id}/actions/search` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/v1/knowledgebases/{id}/actions/search',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topN: 20,
      prompt: 'What is LLM?',
      searchMode: 'SIMPLE',
    }),
  },
)
Example Response
{
  "chunks": [
    {
      "text": "LLM stands for Large Language Model",
      "chunkMeta": {
        "source": "string",
        "chunkId": "string",
        "documentId": "string",
        "datasourceId": "string",
        "knowledgeBaseId": "string"
      },
      "tfidfScore": 0.9,
      "searchSource": "string",
      "semanticScore": 0.63
    }
  ]
}
Add a datasource to a knowledgebase

Adds a datasource to a knowledgebase.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
id
string
Required

The id of the knowledgebase.

format = "uuid"

Request Body
application/json
object

Specification on where to fetch the files for. This is required when the type == 'file'. Only one of path and files can be set. Path takes precedence if both are provided.

Show application/json properties
Responses
201

Successfully added a datasource to the knowledgebase.

application/json
object

Specification on where to fetch the files for. This is required when the type == 'file'. Only one of path and files can be set. Path takes precedence if both are provided.

Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
403

The user does not have privileges to perform the requested action.

application/json
object
Show application/json properties
404

The knowledgebase is not found.

application/json
object
Show application/json properties
POST
/api/v1/knowledgebases/{id}/datasources
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


await qlik.knowledgebases.createKnowledgebaseDatasource(
  'f256b3e4-03e0-4f74-ae46-a4d43882ee5d',
  {
    fileConfig: {
      connectionId:
        'f256b3e4-03e0-4f74-ae46-a4d43882ee5d',
      crawlPatterns: [
        {
          pattern: '(.*)example(.*)',
          type: 'include',
        },
      ],
      files: ['string'],
      folder: 'folderA/folderB',
      scope: {
        depth: 1,
        extensions: ['pdf'],
        maxFilesPerFolder: 100,
        maxFilesTotal: 50,
        maxSize: 1000000,
        modifiedAfter: '2021-10-02T14:20:50.52Z',
      },
      userId: '507f191e810c19729de860ea',
    },
    name: 'string',
    type: 'file',
  },
)
Example Response
{
  "id": "f256b3e4-03e0-4f74-ae46-a4d43882ee5d",
  "name": "string",
  "type": "file",
  "spaceId": "507f191e810c19729de860ea",
  "chunking": {
    "size": 1024,
    "type": "recursive",
    "overlap": 20,
    "separators": [
      "\n",
      ".",
      " "
    ],
    "keepSeparator": false
  },
  "syncInfo": {
    "status": "neverIndexed",
    "startedAt": "2021-10-02T14:20:50.52Z",
    "lastSyncId": "f256b3e4-03e0-4f74-ae46-a4d43882ee5d",
    "completedAt": "2021-10-02T14:20:50.52Z"
  },
  "fileConfig": {
    "files": [
      "string"
    ],
    "scope": {
      "depth": 1,
      "maxSize": 1000000,
      "extensions": [
        "pdf"
      ],
      "maxFilesTotal": 50,
      "modifiedAfter": "2021-10-02T14:20:50.52Z",
      "maxFilesPerFolder": 100
    },
    "folder": "folderA/folderB",
    "userId": "507f191e810c19729de860ea",
    "connectionId": "f256b3e4-03e0-4f74-ae46-a4d43882ee5d",
    "crawlPatterns": [
      {
        "type": "include",
        "pattern": "(.*)example(.*)"
      }
    ]
  },
  "sourceCount": 10,
  "contentSummary": {
    "fileSize": 42,
    "textSize": 42,
    "fileCount": 42,
    "effectivePages": 42
  }
}
Update a knowledgebase datasource

Updates a specified datasource.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
datasourceId
string
Required

The id of the datasource to update.

format = "uuid"

id
string
Required

The id of a knowledgebase.

format = "uuid"

Request Body
application/json
object

Specification on where to fetch the files for. This is required when the type == 'file'. Only one of path and files can be set. Path takes precedence if both are provided.

Show application/json properties
Responses
200

Successfully updated the datasource.

application/json
object

Specification on where to fetch the files for. This is required when the type == 'file'. Only one of path and files can be set. Path takes precedence if both are provided.

Show application/json properties
400

The request is in incorrect format.

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
/api/v1/knowledgebases/{id}/datasources/{datasourceId}
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `PUT /api/v1/knowledgebases/{id}/datasources/{datasourceId}` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/v1/knowledgebases/{id}/datasources/{datasourceId}',
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: 'f256b3e4-03e0-4f74-ae46-a4d43882ee5d',
      name: 'string',
      type: 'file',
      spaceId: '507f191e810c19729de860ea',
      chunking: {
        size: 1024,
        type: 'recursive',
        overlap: 20,
        separators: ['\n', '.', ' '],
        keepSeparator: false,
      },
      syncInfo: {
        lastSyncId:
          'f256b3e4-03e0-4f74-ae46-a4d43882ee5d',
      },
      fileConfig: {
        files: ['string'],
        scope: {
          depth: 1,
          maxSize: 1000000,
          extensions: ['pdf'],
          maxFilesTotal: 50,
          modifiedAfter:
            '2021-10-02T14:20:50.52Z',
          maxFilesPerFolder: 100,
        },
        folder: 'folderA/folderB',
        userId: '507f191e810c19729de860ea',
        connectionId:
          'f256b3e4-03e0-4f74-ae46-a4d43882ee5d',
        crawlPatterns: [
          {
            type: 'include',
            pattern: '(.*)example(.*)',
          },
        ],
      },
      sourceCount: 10,
      contentSummary: {
        fileSize: 42,
        textSize: 42,
        fileCount: 42,
        effectivePages: 42,
      },
    }),
  },
)
Example Response
{
  "id": "f256b3e4-03e0-4f74-ae46-a4d43882ee5d",
  "name": "string",
  "type": "file",
  "spaceId": "507f191e810c19729de860ea",
  "chunking": {
    "size": 1024,
    "type": "recursive",
    "overlap": 20,
    "separators": [
      "\n",
      ".",
      " "
    ],
    "keepSeparator": false
  },
  "syncInfo": {
    "status": "neverIndexed",
    "startedAt": "2021-10-02T14:20:50.52Z",
    "lastSyncId": "f256b3e4-03e0-4f74-ae46-a4d43882ee5d",
    "completedAt": "2021-10-02T14:20:50.52Z"
  },
  "fileConfig": {
    "files": [
      "string"
    ],
    "scope": {
      "depth": 1,
      "maxSize": 1000000,
      "extensions": [
        "pdf"
      ],
      "maxFilesTotal": 50,
      "modifiedAfter": "2021-10-02T14:20:50.52Z",
      "maxFilesPerFolder": 100
    },
    "folder": "folderA/folderB",
    "userId": "507f191e810c19729de860ea",
    "connectionId": "f256b3e4-03e0-4f74-ae46-a4d43882ee5d",
    "crawlPatterns": [
      {
        "type": "include",
        "pattern": "(.*)example(.*)"
      }
    ]
  },
  "sourceCount": 10,
  "contentSummary": {
    "fileSize": 42,
    "textSize": 42,
    "fileCount": 42,
    "effectivePages": 42
  }
}
Delete a knowledgebase datasource

Deletes a specified datasource and all its resources.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
datasourceId
string
Required

The id of the datasource to delete.

format = "uuid"

id
string
Required

The id of the knowledgebase the datasource belongs to.

format = "uuid"

Responses
204

Successful Operation.

400

The request is in incorrect format.

application/json
object
Show application/json properties
403

The operation failed due to insufficient permissions.

application/json
object
Show application/json properties
404

The knowledgebase is not found

application/json
object
Show application/json properties
DELETE
/api/v1/knowledgebases/{id}/datasources/{datasourceId}
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


await qlik.knowledgebases.deleteKnowledgebaseDatasource(
  'f256b3e4-03e0-4f74-ae46-a4d43882ee5d',
  'f256b3e4-03e0-4f74-ae46-a4d43882ee5d',
)
Cancel sync of a knowledgebase datasource

Cancels ongoing sync for a specified datasource.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
datasourceId
string
Required

The id of the datasource to cancel sync for.

format = "uuid"

id
string
Required

The id of the knowledgebase the datasource belongs to.

format = "uuid"

Responses
200

Successfully cancelled sync.

application/json
object

Response when a datasource sync is started, contains the sync Id

Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
403

The user does not have privileges to perform the requested action.

application/json
object
Show application/json properties
404

The resource does not exist.

application/json
object
Show application/json properties
POST
/api/v1/knowledgebases/{id}/datasources/{datasourceId}/actions/cancel
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


await qlik.knowledgebases.cancelKnowledgebaseDatasource(
  'f256b3e4-03e0-4f74-ae46-a4d43882ee5d',
  'f256b3e4-03e0-4f74-ae46-a4d43882ee5d',
)
Example Response
{
  "id": "f256b3e4-03e0-4f74-ae46-a4d43882ee5d"
}
Download knowledgebase datasource reference

Downloads a specified reference.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
datasourceId
string
Required

The id of the datasource to download from.

format = "uuid"

id
string
Required

The id of the knowledgebase the datasource belongs to.

format = "uuid"

Request Body
application/json
object
Show application/json properties
Responses
200

Download a file from a datasource.

application/json
object

Download information for the file.

Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
403

The user does not have privileges to perform the requested action.

application/json
object
Show application/json properties
404

The resource does not exist.

application/json
object
Show application/json properties
POST
/api/v1/knowledgebases/{id}/datasources/{datasourceId}/actions/download
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


await qlik.knowledgebases.downloadKnowledgebaseDatasource(
  'f256b3e4-03e0-4f74-ae46-a4d43882ee5d',
  'f256b3e4-03e0-4f74-ae46-a4d43882ee5d',
  { path: 'folder/file.pdf' },
)
Example Response
{
  "url": "/v1/temp-contents/65f4287d785c400fe6d1e861",
  "name": "stories/content/billy.txt",
  "spaceId": "507f191e810c19729de860ea",
  "fileSize": 542,
  "mimeType": "text/plain",
  "lastUpdatedAt": "2020-04-16T23:17:28Z"
}
Sync a knowledgebase datasource

Starts syncing a specified datasource to a specified knowledgebase index.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Query Parameters
migrate
boolean

Optional parameter to migrate indexed files to docdetails collection

Path Parameters
datasourceId
string
Required

The id of the datasource to sync.

format = "uuid"

id
string
Required

The id of the knowledgebase the datasource belongs to.

format = "uuid"

Responses
202

Successfully started sync.

application/json
object

Response when a datasource sync is started, contains the sync Id

Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
403

The user does not have privileges to perform the requested action.

application/json
object
Show application/json properties
404

The resource does not exist.

application/json
object
Show application/json properties
POST
/api/v1/knowledgebases/{id}/datasources/{datasourceId}/actions/sync
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


await qlik.knowledgebases.syncKnowledgebaseDatasource(
  'f256b3e4-03e0-4f74-ae46-a4d43882ee5d',
  'f256b3e4-03e0-4f74-ae46-a4d43882ee5d',
  {},
)
Example Response
{
  "id": "f256b3e4-03e0-4f74-ae46-a4d43882ee5d"
}
List knowledgebase datasource sync histories

Retrieves sync history for a specified datasource in a knowledgebase. Returns a 404 if there is no sync history, or if the calling user doesn't have access to the datasource.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
limit
integer

The number of knowledgebases to get.

minimum = 1, maximum = 100, default = 20, default = 20

next
string

Optional parameter to request the next page.

prev
string

Optional parameter to request the previous page.

sort
string

Optional resource field name to sort on, case insensitive, eg. name. Can be prefixed with - to set descending order, defaults to ascending.

Can be one of: "COMPLETED""-COMPLETED"

Path Parameters
datasourceId
string
Required

The id of the datasource.

format = "uuid"

id
string
Required

The id of the knowledgebase the datasource belongs to.

format = "uuid"

Responses
200

List of sync items ordered by the completed time.

application/json
object
Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
403

The user does not have privileges to perform the requested action.

application/json
object
Show application/json properties
404

The datasource is not found, the datasource has no sync history (no syncs have been run), or the calling user doesn't have access to this datasource in the knowledgebase.

application/json
object
Show application/json properties
GET
/api/v1/knowledgebases/{id}/datasources/{datasourceId}/histories
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


await qlik.knowledgebases.getKnowledgebaseDatasourceHistories(
  'f256b3e4-03e0-4f74-ae46-a4d43882ee5d',
  'f256b3e4-03e0-4f74-ae46-a4d43882ee5d',
  {},
)
Example Response
{
  "data": [
    {
      "id": "f256b3e4-03e0-4f74-ae46-a4d43882ee5d",
      "status": [
        "neverIndexed | progress | completed | completedWithError"
      ],
      "docStats": {
        "added": 1,
        "errors": 0,
        "deleted": 0,
        "updated": 0,
        "deltaBytes": 0,
        "deltaTextSize": 0,
        "largestFileSize": 123044444,
        "deltaEffectivePages": 0,
        "totalBytesProcessed": 123044444
      },
      "startedAt": "2021-10-02T14:20:50.52Z",
      "completedAt": "2021-10-02T14:20:50.52Z",
      "triggerType": [
        "manual | schedule"
      ],
      "connectionId": "ee6a390c-5d33-11e8-9c2d-fa7ae01bbebc",
      "datasourceId": "f256b3e4-03e0-4f74-ae46-a4d43882ee5d",
      "errorSummary": [
        {
          "code": "string",
          "count": 1000,
          "sample": "failed to parse document",
          "sources": [
            "myfile.pdf"
          ]
        }
      ],
      "selectedErrors": [
        "unsupported file extension"
      ]
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
Retrieve a knowledgebase datasource sync history
Deprecated

Retrieves detailed sync history for a specified datasource.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
	Deprecated	This endpoint is deprecated and will eventually be removed. Read our API policy here.
Path Parameters
datasourceId
string
Required

The id of the datasource.

format = "uuid"

id
string
Required

The id of the knowledgebase the datasource belongs to.

format = "uuid"

syncId
string
Required

The sync identifier.

format = "uuid"

Responses
200

List of sync items ordered by the start time.

application/json
object
Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
403

The user does not have privileges to perform the requested action.

application/json
object
Show application/json properties
404

The resource does not exist.

application/json
object
Show application/json properties
GET
/api/v1/knowledgebases/{id}/datasources/{datasourceId}/histories/{syncId}
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


await qlik.knowledgebases.getKnowledgebaseDatasourceHistory(
  'f256b3e4-03e0-4f74-ae46-a4d43882ee5d',
  'f256b3e4-03e0-4f74-ae46-a4d43882ee5d',
  'f256b3e4-03e0-4f74-ae46-a4d43882ee5d',
)
Example Response
{
  "id": "f256b3e4-03e0-4f74-ae46-a4d43882ee5d",
  "error": "unsupported file extension",
  "action": "add",
  "chunks": 10,
  "source": "myfile.pdf",
  "syncId": "f256b3e4-03e0-4f74-ae46-a4d43882ee5d",
  "duration": {
    "chunk": 0,
    "embed": 996,
    "parse": 0,
    "store": 3653363805,
    "download": 207
  },
  "fileSize": 123044444,
  "syncedAt": "2021-10-02T14:20:50.52Z",
  "chunkSize": 14721,
  "errorCode": "string",
  "explicitPages": 42,
  "fileStartedAt": "2021-10-02T14:20:50.52Z",
  "fileCompletedAt": "2021-10-02T14:21:50.52Z",
  "fileLastModified": "2024-02-16T20:06:02Z"
}
Get a knowledgebase datasource schedule

Returns a datasource schedule.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
datasourceId
string
Required

The id of the datasource the schedule belongs to.

format = "uuid"

id
string
Required

The id of the knowledgebase the schedule belongs to.

format = "uuid"

Responses
200

Successfully created a schedule.

application/json
object
Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
403

The user does not have privileges to perform the requested action.

application/json
object
Show application/json properties
404

The resource does not exist.

application/json
object
Show application/json properties
GET
/api/v1/knowledgebases/{id}/datasources/{datasourceId}/schedules
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


await qlik.knowledgebases.getKnowledgebaseDatasourceSchedule(
  'f256b3e4-03e0-4f74-ae46-a4d43882ee5d',
  'f256b3e4-03e0-4f74-ae46-a4d43882ee5d',
)
Example Response
{
  "ownerId": "507f191e810c19729de860ed",
  "spaceId": "507f191e810c19729de860ec",
  "tenantId": "507f191e810c19729de860eb",
  "calendars": [
    {
      "hour": [
        {
          "end": 42,
          "step": 1,
          "start": 42
        }
      ],
      "year": [
        {
          "end": 42,
          "step": 1,
          "start": 42
        }
      ],
      "month": [
        {
          "end": 42,
          "step": 1,
          "start": 42
        }
      ],
      "minute": [
        {
          "end": 42,
          "step": 1,
          "start": 42
        }
      ],
      "second": [
        {
          "end": 42,
          "step": 1,
          "start": 42
        }
      ],
      "comment": "string",
      "dayOfWeek": [
        {
          "end": 42,
          "step": 1,
          "start": 42
        }
      ],
      "dayOfMonth": [
        {
          "end": 42,
          "step": 1,
          "start": 42
        }
      ]
    }
  ],
  "intervals": [
    {
      "every": "5h30m",
      "offset": "0s"
    }
  ],
  "datasourceId": "f256b3e4-03e0-4f74-ae46-a4d43882ee5d",
  "knowledgebaseId": "f256b3e4-03e0-4f74-ae46-a4d43882ee5d"
}
Create a knowledgebase datasource schedule

Creates or updates a specified datasource schedule.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
datasourceId
string
Required

The id of the datasource the schedule belongs to.

format = "uuid"

id
string
Required

The id of the knowledgebase the schedule belongs to.

format = "uuid"

Request Body
application/json
object
Show application/json properties
Responses
200

Successfully created a schedule.

application/json
object
Show application/json properties
201

Successfully created a schedule.

application/json
object
Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
403

The user does not have privileges to perform the requested action.

application/json
object
Show application/json properties
404

The resource does not exist.

application/json
object
Show application/json properties
POST
/api/v1/knowledgebases/{id}/datasources/{datasourceId}/schedules
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


await qlik.knowledgebases.createKnowledgebaseDatasourceSchedule(
  'f256b3e4-03e0-4f74-ae46-a4d43882ee5d',
  'f256b3e4-03e0-4f74-ae46-a4d43882ee5d',
  {
    calendars: [
      {
        comment: 'string',
        dayOfMonth: [
          { end: 42, start: 42, step: 1 },
        ],
        dayOfWeek: [
          { end: 42, start: 42, step: 1 },
        ],
        hour: [{ end: 42, start: 42, step: 1 }],
        minute: [{ end: 42, start: 42, step: 1 }],
        month: [{ end: 42, start: 42, step: 1 }],
        second: [{ end: 42, start: 42, step: 1 }],
        year: [{ end: 42, start: 42, step: 1 }],
      },
    ],
    intervals: [{ every: '5h30m', offset: '0s' }],
  },
)
Example Response
{
  "ownerId": "507f191e810c19729de860ed",
  "spaceId": "507f191e810c19729de860ec",
  "tenantId": "507f191e810c19729de860eb",
  "calendars": [
    {
      "hour": [
        {
          "end": 42,
          "step": 1,
          "start": 42
        }
      ],
      "year": [
        {
          "end": 42,
          "step": 1,
          "start": 42
        }
      ],
      "month": [
        {
          "end": 42,
          "step": 1,
          "start": 42
        }
      ],
      "minute": [
        {
          "end": 42,
          "step": 1,
          "start": 42
        }
      ],
      "second": [
        {
          "end": 42,
          "step": 1,
          "start": 42
        }
      ],
      "comment": "string",
      "dayOfWeek": [
        {
          "end": 42,
          "step": 1,
          "start": 42
        }
      ],
      "dayOfMonth": [
        {
          "end": 42,
          "step": 1,
          "start": 42
        }
      ]
    }
  ],
  "intervals": [
    {
      "every": "5h30m",
      "offset": "0s"
    }
  ],
  "datasourceId": "f256b3e4-03e0-4f74-ae46-a4d43882ee5d",
  "knowledgebaseId": "f256b3e4-03e0-4f74-ae46-a4d43882ee5d"
}
Delete knowledgebase datasource schedule

Deletes a datasource schedule.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
datasourceId
string
Required

The id of the datasource the schedule belongs to.

format = "uuid"

id
string
Required

The id of the knowledgebase the schedule belongs to.

format = "uuid"

Responses
204

Successfully deleted a schedule.

400

The request is in incorrect format.

application/json
object
Show application/json properties
403

The user does not have privileges to perform the requested action.

application/json
object
Show application/json properties
404

The resource does not exist.

application/json
object
Show application/json properties
DELETE
/api/v1/knowledgebases/{id}/datasources/{datasourceId}/schedules
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


await qlik.knowledgebases.deleteKnowledgebaseDatasourceSchedule(
  'f256b3e4-03e0-4f74-ae46-a4d43882ee5d',
  'f256b3e4-03e0-4f74-ae46-a4d43882ee5d',
)
Retrieve knowledgebase sync history

Retrieves sync history for the specified knowledgebase. Will return a 404 if no sync history exists, or if the calling user does not have access to synced datasources.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
limit
integer

The number of sync histories to get.

minimum = 1, maximum = 100, default = 20, default = 20

next
string

Optional parameter to request the next page.

prev
string

Optional parameter to request the previous page.

sort
string

Optional resource field name to sort on, case insensitive, eg. name. Can be prefixed with - to set descending order, defaults to ascending.

Can be one of: "COMPLETED""-COMPLETED"

Path Parameters
id
string
Required

The id of the knowledgebase.

format = "uuid"

Responses
200

List of sync items ordered by the completed time.

application/json
object
Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
403

The user does not have privileges to perform the requested action.

application/json
object
Show application/json properties
404

The knowledgebase is not found, the knowledgebase has no sync history, or the calling user doesn't have access to the datasources in the knowledgebase.

application/json
object
Show application/json properties
GET
/api/v1/knowledgebases/{id}/histories
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


await qlik.knowledgebases.getKnowledgebaseHistories(
  'f256b3e4-03e0-4f74-ae46-a4d43882ee5d',
  {},
)
Example Response
{
  "data": [
    {
      "id": "f256b3e4-03e0-4f74-ae46-a4d43882ee5d",
      "status": [
        "neverIndexed | progress | completed | completedWithError"
      ],
      "docStats": {
        "added": 1,
        "errors": 0,
        "deleted": 0,
        "updated": 0,
        "deltaBytes": 0,
        "deltaTextSize": 0,
        "largestFileSize": 123044444,
        "deltaEffectivePages": 0,
        "totalBytesProcessed": 123044444
      },
      "startedAt": "2021-10-02T14:20:50.52Z",
      "completedAt": "2021-10-02T14:20:50.52Z",
      "triggerType": [
        "manual | schedule"
      ],
      "connectionId": "ee6a390c-5d33-11e8-9c2d-fa7ae01bbebc",
      "datasourceId": "f256b3e4-03e0-4f74-ae46-a4d43882ee5d",
      "errorSummary": [
        {
          "code": "string",
          "count": 1000,
          "sample": "failed to parse document",
          "sources": [
            "myfile.pdf"
          ]
        }
      ],
      "selectedErrors": [
        "unsupported file extension"
      ]
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