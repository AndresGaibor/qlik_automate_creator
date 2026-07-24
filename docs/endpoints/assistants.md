---
title: "Assistants REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/assistants/"
local_path: "docs/endpoints/assistants.md"
---

Title: Assistants REST | Qlik Developer Portal


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
Assistants

Assistants provide a chat interface for asking questions and getting personalized, relevant answers for Qlik Answers.

Download OpenAPI spec
Endpoints
GET
/api/v1/assistants
POST
/api/v1/assistants
POST
/api/v1/assistants/{assistantId}/actions/search
GET
/api/v1/assistants/{assistantId}/feedback
POST
/api/v1/assistants/{assistantId}/sources/plaintexts
GET
/api/v1/assistants/{assistantId}/starters
POST
/api/v1/assistants/{assistantId}/starters
GET
/api/v1/assistants/{assistantId}/starters/{starterId}
PUT
/api/v1/assistants/{assistantId}/starters/{starterId}
DELETE
/api/v1/assistants/{assistantId}/starters/{starterId}
PUT
/api/v1/assistants/{assistantId}/starters/{starterId}/followups/{followupId}
DELETE
/api/v1/assistants/{assistantId}/starters/{starterId}/followups/{followupId}
GET
/api/v1/assistants/{assistantId}/threads
POST
/api/v1/assistants/{assistantId}/threads
GET
/api/v1/assistants/{assistantid}/threads/{threadid}
PATCH
/api/v1/assistants/{assistantid}/threads/{threadid}
DELETE
/api/v1/assistants/{assistantid}/threads/{threadid}
POST
/api/v1/assistants/{assistantId}/threads/{threadId}/actions/invoke
POST
/api/v1/assistants/{assistantId}/threads/{threadId}/actions/stream
GET
/api/v1/assistants/{assistantId}/threads/{threadId}/interactions
POST
/api/v1/assistants/{assistantId}/threads/{threadId}/interactions
GET
/api/v1/assistants/{assistantId}/threads/{threadId}/interactions/{interactionId}
DELETE
/api/v1/assistants/{assistantId}/threads/{threadId}/interactions/{interactionId}
POST
/api/v1/assistants/{assistantId}/threads/{threadId}/interactions/{interactionId}/feedback
PATCH
/api/v1/assistants/{assistantId}/threads/{threadId}/interactions/{interactionId}/feedback/{feedbackId}
POST
/api/v1/assistants/{assistantId}/threads/{threadId}/interactions/{interactionId}/reviews
GET
/api/v1/assistants/{id}
PATCH
/api/v1/assistants/{id}
DELETE
/api/v1/assistants/{id}
List assistants

Retrieves the list of assistants. The result can be filtered, sorted, and paginated.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
limit
integer

The number of assistants to get.

minimum = 1, maximum = 100, default = 20, default = 20

next
string

Optional parameter to request the next page.

prev
string

Optional parameter to request the previous page.

sort
string

Optional resource field name to sort on, case insensitive, e.g. name. Can be prefixed with - to set descending order; defaults to ascending.

Can be one of: "NAME""-NAME""DESCRIPTION""-DESCRIPTION""CREATED""-CREATED""UPDATED""-UPDATED"

spaceId
string

Optional parameter to filter assistants by space ID.

countTotal
boolean
Deprecated

Optional parameter to request total count for query.

default = false

Responses
200

Successful operation.

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
/api/v1/assistants
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


await qlik.assistants.getAssistants({})
Example Response
{
  "data": [
    {
      "id": "507f191e810c19729de860ea",
      "name": "Organization-wide Assistant",
      "tags": [
        "Red",
        "Sales"
      ],
      "title": "Assistant for Sales activities",
      "ownerId": "507f191e810c19729de860ea",
      "spaceId": "507f191e810c19729de860ea",
      "tenantId": "507f191e810c19729de860ea",
      "createdAt": "2021-10-02T14:20:50.52Z",
      "createdBy": "507f191e810c19729de860ea",
      "hasAvatar": true,
      "updatedAt": "2021-10-02T14:20:50.52Z",
      "updatedBy": "507f191e810c19729de860ea",
      "description": "This assistant is used for...",
      "systemMessage": "You are helpful Sales assistant. Provide concise and actionable insights.",
      "knowledgeBases": [
        "507f191e810c19729de860ea"
      ],
      "welcomeMessage": "Welcome to Sales process support Assistant.",
      "customProperties": {
        "customErrors": {
          "outsideScopeError": "Outside of scope error",
          "complexQuestionError": "Complex question error",
          "promptInjectionError": "Prompt injection error"
        }
      },
      "defaultPromptType": "thread",
      "orderedStarterIds": [
        "507f191e810c19729de860ea",
        "787f191e810c19729de860er"
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
Create an assistant

Creates a new assistant.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
application/json
object
Show application/json properties
multipart/form-data
object
Show multipart/form-data properties
Responses
201

Successfully created an assistant.

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
/api/v1/assistants
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


await qlik.assistants.createAssistant({
  customProperties: {
    customErrors: {
      outsideScopeError: 'Outside of scope error',
      complexQuestionError:
        'Complex question error',
      promptInjectionError:
        'Prompt injection error',
    },
  },
  defaultPromptType: 'thread',
  description: 'This assistant is used for...',
  knowledgeBases: ['507f191e810c19729de860ea'],
  name: 'Organization-wide assistant',
  orderedStarterIds: [
    '507f191e810c19729de860ea',


    '787f191e810c19729de860er',
  ],
  spaceId: '507f191e810c19729de860ea',
  systemMessage:
    'You are helpful Sales assistant. Provide concise and actionable insights.',
  tags: ['Red', 'Sales'],
  title: 'Assistant for Sales activities',
  welcomeMessage:
    'Welcome to Sales process support Assistant.',
})
Example Response
{
  "id": "507f191e810c19729de860ea",
  "name": "Organization-wide Assistant",
  "tags": [
    "Red",
    "Sales"
  ],
  "title": "Assistant for Sales activities",
  "ownerId": "507f191e810c19729de860ea",
  "spaceId": "507f191e810c19729de860ea",
  "tenantId": "507f191e810c19729de860ea",
  "createdAt": "2021-10-02T14:20:50.52Z",
  "createdBy": "507f191e810c19729de860ea",
  "hasAvatar": true,
  "updatedAt": "2021-10-02T14:20:50.52Z",
  "updatedBy": "507f191e810c19729de860ea",
  "description": "This assistant is used for...",
  "systemMessage": "You are helpful Sales assistant. Provide concise and actionable insights.",
  "knowledgeBases": [
    "507f191e810c19729de860ea"
  ],
  "welcomeMessage": "Welcome to Sales process support Assistant.",
  "customProperties": {
    "customErrors": {
      "outsideScopeError": "Outside of scope error",
      "complexQuestionError": "Complex question error",
      "promptInjectionError": "Prompt injection error"
    }
  },
  "defaultPromptType": "thread",
  "orderedStarterIds": [
    "507f191e810c19729de860ea",
    "787f191e810c19729de860er"
  ]
}
Perform search on an assistant

Perform search with either SIMPLE or FULL mode. SIMPLE does semantic search while FULL does semantic search, reranking and hybrid search. Use topN to control number of chunks in response, max limit is 50. Default to 5.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
assistantId
string
Required

The ID for the Assistant of interest

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

Assistant is not found.

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
/api/v1/assistants/{assistantId}/actions/search
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/v1/assistants/{assistantId}/actions/search` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/v1/assistants/{assistantId}/actions/search',
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
Get feedback

Retrieves feedback summary for the assistant.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
assistantId
string
Required

The ID of the assistant from which to retrieve feedback summary.

format = "uuid"

Responses
200

Successfully retrieved the feedback summary for the assistant.

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

The assistant was not found.

application/json
object
Show application/json properties
GET
/api/v1/assistants/{assistantId}/feedback
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


await qlik.assistants.getAssistantFeedback(
  '507f191e810c19729de860ea',
)
Example Response
{
  "likes": 42,
  "other": 42,
  "reviews": 42,
  "dislikes": 42,
  "unhelpful": 42,
  "inaccurate": 42,
  "irrelevant": 42,
  "repetitive": 42,
  "unanswered": 42,
  "interactions": 42
}
Bulk search source chunks

Perform a bulk search for the plaintext of source chunks for the assistant.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
assistantId
string
Required

The ID of the assistant in which to search for source chunks.

format = "uuid"

Request Body
application/json
object
Show application/json properties
Responses
202

Successfully retrieved plaintext of the chunks.

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

The resource was not found.

application/json
object
Show application/json properties
POST
/api/v1/assistants/{assistantId}/sources/plaintexts
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


await qlik.assistants.getAssistantSources(
  '507f191e810c19729de860ea',
  {
    chunkIds: [
      'c2ef42d9-7164-4fb0-bdbb-6534ae37263e',


      '486ada2c-f895-4961-8ba5-7995f1026d26',
    ],
  },
)
Example Response
{
  "textByChunkId": {
    "chunk1_id": "chunk1_text",
    "chunk2_id": "chunk2_text"
  }
}
List starters

Retrieves the list of starters for the assistant.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
limit
integer

The number of starters to get.

minimum = 1, maximum = 100, default = 20, default = 20

next
string

Optional parameter to request the next page.

prev
string

Optional parameter to request the previous page.

sort
string

Optional resource field name to sort on, case insensitive, e.g. name. Can be prefixed with - to set descending order; defaults to ascending.

Can be one of: "QUESTION""-QUESTION""CREATED""-CREATED""UPDATED""-UPDATED"

Path Parameters
assistantId
string
Required

The ID of the assistant from which to retrieve starters.

format = "uuid"

Responses
200

Successfully retrieved the assistant's starters.

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

The assistant was not found.

application/json
object
Show application/json properties
GET
/api/v1/assistants/{assistantId}/starters
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


await qlik.assistants.getAssistantStarters(
  '507f191e810c19729de860ea',
  {},
)
Example Response
{
  "data": [
    {
      "id": "507f191e810c19729de860ea",
      "question": "Where was Genghis Khan buried?",
      "createdAt": "2021-10-02T14:20:50.52Z",
      "followups": [
        {
          "id": "507f191e810c19729de860ea",
          "question": "Where was Genghis Khan buried?",
          "additionalContext": "string",
          "recommendedAnswer": {
            "content": "string",
            "contentType": "text | markdown | html"
          }
        }
      ],
      "updatedAt": "2021-10-02T14:20:50.52Z",
      "additionalContext": "string",
      "recommendedAnswer": {
        "content": "string",
        "contentType": "text | markdown | html"
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
Create a starter

Creates a new starter for the assistant.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
assistantId
string
Required

The ID of the assistant in which to create the starter.

format = "uuid"

Request Body
application/json
object
Show application/json properties
Responses
201

Successfully created a new assistant starter.

application/json
object
Show application/json properties
400

The request is in incorrect format or starter limit exceeded.

application/json
object
Show application/json properties
403

The user does not have privileges to perform the requested action.

application/json
object
Show application/json properties
404

The assistant was not found.

application/json
object
Show application/json properties
POST
/api/v1/assistants/{assistantId}/starters
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


await qlik.assistants.createAssistantStarter(
  '507f191e810c19729de860ea',
  {
    additionalContext: 'string',
    followups: [
      {
        additionalContext: 'string',
        id: '507f191e810c19729de860ea',
        question:
          'Where was Genghis Khan buried?',
        recommendedAnswer: {
          content: 'string',
          contentType: 'text | markdown | html',
        },
      },
    ],
    question: 'Where was Genghis Khan buried?',
    recommendedAnswer: {
      content: 'string',
      contentType: 'text | markdown | html',
    },
  },
)
Example Response
{
  "id": "507f191e810c19729de860ea",
  "question": "Where was Genghis Khan buried?",
  "createdAt": "2021-10-02T14:20:50.52Z",
  "followups": [
    {
      "id": "507f191e810c19729de860ea",
      "question": "Where was Genghis Khan buried?",
      "additionalContext": "string",
      "recommendedAnswer": {
        "content": "string",
        "contentType": "text | markdown | html"
      }
    }
  ],
  "updatedAt": "2021-10-02T14:20:50.52Z",
  "additionalContext": "string",
  "recommendedAnswer": {
    "content": "string",
    "contentType": "text | markdown | html"
  }
}
Get a starter

Retrieves the specified starter.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
assistantId
string
Required

The ID of the assistant containing the requested starter.

format = "uuid"

starterId
string
Required

The ID of the starter to retrieve.

format = "uuid"

Responses
200

Successfully retrieved the starter.

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

The starter was not found.

application/json
object
Show application/json properties
GET
/api/v1/assistants/{assistantId}/starters/{starterId}
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


await qlik.assistants.getAssistantStarter(
  '507f191e810c19729de860ea',
  '507f191e810c19729de860ea',
)
Example Response
{
  "id": "507f191e810c19729de860ea",
  "question": "Where was Genghis Khan buried?",
  "createdAt": "2021-10-02T14:20:50.52Z",
  "followups": [
    {
      "id": "507f191e810c19729de860ea",
      "question": "Where was Genghis Khan buried?",
      "additionalContext": "string",
      "recommendedAnswer": {
        "content": "string",
        "contentType": "text | markdown | html"
      }
    }
  ],
  "updatedAt": "2021-10-02T14:20:50.52Z",
  "additionalContext": "string",
  "recommendedAnswer": {
    "content": "string",
    "contentType": "text | markdown | html"
  }
}
Update a starter

Updates the specified starter.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
assistantId
string
Required

The ID of the assistant containing the requested starter.

format = "uuid"

starterId
string
Required

The ID of the starter to retrieve.

format = "uuid"

Request Body
application/json
object
Show application/json properties
Responses
200

Successfully updated the starter.

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

The record was not found.

application/json
object
Show application/json properties
PUT
/api/v1/assistants/{assistantId}/starters/{starterId}
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


await qlik.assistants.updateAssistantStarter(
  '507f191e810c19729de860ea',
  '507f191e810c19729de860ea',
  {
    additionalContext: 'string',
    followups: [
      {
        additionalContext: 'string',
        id: '507f191e810c19729de860ea',
        question:
          'Where was Genghis Khan buried?',
        recommendedAnswer: {
          content: 'string',
          contentType: 'text | markdown | html',
        },
      },
    ],
    id: '507f191e810c19729de860ea',
    question: 'Where was Genghis Khan buried?',
    recommendedAnswer: {
      content: 'string',
      contentType: 'text | markdown | html',
    },
  },
)
Example Response
{
  "id": "507f191e810c19729de860ea",
  "question": "Where was Genghis Khan buried?",
  "createdAt": "2021-10-02T14:20:50.52Z",
  "followups": [
    {
      "id": "507f191e810c19729de860ea",
      "question": "Where was Genghis Khan buried?",
      "additionalContext": "string",
      "recommendedAnswer": {
        "content": "string",
        "contentType": "text | markdown | html"
      }
    }
  ],
  "updatedAt": "2021-10-02T14:20:50.52Z",
  "additionalContext": "string",
  "recommendedAnswer": {
    "content": "string",
    "contentType": "text | markdown | html"
  }
}
Delete a starter

Deletes the starter and all of its resources.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
assistantId
string
Required

The ID of the assistant containing the requested starter.

format = "uuid"

starterId
string
Required

The ID of the starter to delete.

format = "uuid"

Responses
204

Successful operation.

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

The assistant was not found.

application/json
object
Show application/json properties
DELETE
/api/v1/assistants/{assistantId}/starters/{starterId}
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


await qlik.assistants.deleteAssistantStarter(
  '507f191e810c19729de860ea',
  '507f191e810c19729de860ea',
)
Update a Followup

Updates the specified Followup.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
assistantId
string
Required

The ID of the assistant containing the requested Followup.

format = "uuid"

followupId
string
Required

The ID of the Followup to update.

format = "uuid"

starterId
string
Required

The ID of the starter containing the requested Followup.

format = "uuid"

Request Body
application/json
object
Show application/json properties
Responses
200

Successfully updated the Followup.

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

The record was not found.

application/json
object
Show application/json properties
PUT
/api/v1/assistants/{assistantId}/starters/{starterId}/followups/{followupId}
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


await qlik.assistants.updateAssistantStarterFollowup(
  '507f191e810c19729de860ea',
  '507f191e810c19729de860ea',
  '507f191e810c19729de860ea',
  {
    additionalContext: 'string',
    id: '507f191e810c19729de860ea',
    question: 'Where was Genghis Khan buried?',
    recommendedAnswer: {
      content: 'string',
      contentType: 'text | markdown | html',
    },
  },
)
Example Response
{
  "id": "507f191e810c19729de860ea",
  "question": "Where was Genghis Khan buried?",
  "createdAt": "2021-10-02T14:20:50.52Z",
  "followups": [
    {
      "id": "507f191e810c19729de860ea",
      "question": "Where was Genghis Khan buried?",
      "additionalContext": "string",
      "recommendedAnswer": {
        "content": "string",
        "contentType": "text | markdown | html"
      }
    }
  ],
  "updatedAt": "2021-10-02T14:20:50.52Z",
  "additionalContext": "string",
  "recommendedAnswer": {
    "content": "string",
    "contentType": "text | markdown | html"
  }
}
Delete a Followup

Deletes the specified Followup.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
assistantId
string
Required

The ID of the assistant containing the requested Followup.

format = "uuid"

followupId
string
Required

The ID of the Followup to delete.

format = "uuid"

starterId
string
Required

The ID of the starter containing the requested Followup.

format = "uuid"

Responses
204

Successful operation.

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

The Followup was not found.

application/json
object
Show application/json properties
DELETE
/api/v1/assistants/{assistantId}/starters/{starterId}/followups/{followupId}
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


await qlik.assistants.deleteAssistantStarterFollowup(
  '507f191e810c19729de860ea',
  '507f191e810c19729de860ea',
  '507f191e810c19729de860ea',
)
List threads

Retrieves the list of threads for the assistant.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
filter
string

Optional parameter to filter threads.

limit
integer

The number of assistants to get.

minimum = 1, maximum = 100, default = 20, default = 20

next
string

Optional parameter to request the next page.

prev
string

Optional parameter to request the previous page.

sort
string

Optional resource field name to sort on, case insensitive, e.g. name. Can be prefixed with - to set descending order; defaults to ascending.

Can be one of: "NAME""-NAME""CREATED""-CREATED""UPDATED""-UPDATED"

Path Parameters
assistantId
string
Required

The ID of the assistant from which to retrieve threads.

format = "uuid"

Responses
200

Successfully retrieved the threads for the assistant.

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

The assistant was not found.

application/json
object
Show application/json properties
GET
/api/v1/assistants/{assistantId}/threads
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


await qlik.assistants.getAssistantThreads(
  '507f191e810c19729de860ea',
  {},
)
Example Response
{
  "data": [
    {
      "id": "507f191e810c19729de860ea",
      "name": "Initial conversation",
      "ownerId": "10d347c4-f28a-4faf-93f0-48e781aaf303",
      "favorite": false,
      "createdAt": "2021-10-02T14:20:50.52Z",
      "deletedAt": "2021-10-02T14:20:50.52Z",
      "updatedAt": "2021-10-02T14:20:50.52Z",
      "hasFeedback": false,
      "summaryStats": {
        "likes": 42,
        "other": 42,
        "reviews": 42,
        "dislikes": 42,
        "unhelpful": 42,
        "inaccurate": 42,
        "irrelevant": 42,
        "repetitive": 42,
        "unanswered": 42,
        "interactions": 42
      },
      "useUserPreferredLanguage": false
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
Create a thread

Creates a new thread for the assistant.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
assistantId
string
Required

The ID of the assistant in which to create the thread.

format = "uuid"

Request Body
application/json
object
Show application/json properties
Responses
201

Successfully created a new assistant thread.

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

The assistant was not found.

application/json
object
Show application/json properties
POST
/api/v1/assistants/{assistantId}/threads
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


await qlik.assistants.createAssistantThread(
  '507f191e810c19729de860ea',
  { name: 'Initial conversation' },
)
Example Response
{
  "id": "507f191e810c19729de860ea",
  "name": "Initial conversation",
  "ownerId": "10d347c4-f28a-4faf-93f0-48e781aaf303",
  "favorite": false,
  "createdAt": "2021-10-02T14:20:50.52Z",
  "deletedAt": "2021-10-02T14:20:50.52Z",
  "updatedAt": "2021-10-02T14:20:50.52Z",
  "hasFeedback": false,
  "summaryStats": {
    "likes": 42,
    "other": 42,
    "reviews": 42,
    "dislikes": 42,
    "unhelpful": 42,
    "inaccurate": 42,
    "irrelevant": 42,
    "repetitive": 42,
    "unanswered": 42,
    "interactions": 42
  },
  "useUserPreferredLanguage": false
}
Get a thread

Retrieves a thread for the assistant.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
assistantid
string
Required

The ID of the assistant containing the requested thread.

format = "uuid"

threadid
string
Required

The ID of the thread to retrieve.

format = "uuid"

Responses
200

Successfully retrieved the thread.

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

The thread was not found.

application/json
object
Show application/json properties
GET
/api/v1/assistants/{assistantid}/threads/{threadid}
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


await qlik.assistants.getAssistantThread(
  '507f191e810c19729de860ea',
  '507f191e810c19729de860ea',
)
Example Response
{
  "id": "507f191e810c19729de860ea",
  "name": "Initial conversation",
  "ownerId": "507f191e810c19729de860ea",
  "favorite": false,
  "messages": [
    {
      "id": "10d347c4-f28a-4faf-93f0-48e781aaf303",
      "role": "ai",
      "content": "Somewhere in an unmarked grave",
      "sources": [
        {
          "chunks": [
            {
              "text": "string",
              "chunkId": "10d347c4-f28a-4faf-93f0-48e781aaf303"
            }
          ],
          "source": "Reference.md",
          "documentId": "10d347c4-f28a-4faf-93f0-48e781aaf303",
          "datasourceId": "10d347c4-f28a-4faf-93f0-48e781aaf303",
          "lastIndexedAt": "2021-10-02T14:20:50.52Z",
          "knowledgebaseId": "10d347c4-f28a-4faf-93f0-48e781aaf303"
        }
      ],
      "createdAt": "2021-10-02T14:20:50.52Z"
    }
  ],
  "createdAt": "2021-10-02T14:20:50.52Z",
  "deletedAt": "2021-10-02T14:20:50.52Z",
  "updatedAt": "2021-10-02T14:20:50.52Z",
  "hasFeedback": false,
  "summaryStats": {
    "likes": 42,
    "other": 42,
    "reviews": 42,
    "dislikes": 42,
    "unhelpful": 42,
    "inaccurate": 42,
    "irrelevant": 42,
    "repetitive": 42,
    "unanswered": 42,
    "interactions": 42
  },
  "useUserPreferredLanguage": false
}
Update thread properties

Updates the properties of an existing thread with JSON Patch-formatted data.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
assistantid
string
Required

The ID of the assistant containing the requested thread.

format = "uuid"

threadid
string
Required

The ID of the thread to retrieve.

format = "uuid"

Request Body
Required
application/json
array of objects

An array of JSON Patch documents.

Show application/json properties
Responses
204

Thread updated successfully.

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

The request has been rate-limited.

application/json
object
Show application/json properties
PATCH
/api/v1/assistants/{assistantid}/threads/{threadid}
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


await qlik.assistants.patchAssistantThread(
  '507f191e810c19729de860ea',
  '507f191e810c19729de860ea',
  [
    {
      op: 'replace',
      path: '/name',
      value: 'new name',
    },
  ],
)
Delete a thread

Deletes the specified thread and all of its resources.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
assistantid
string
Required

The ID of the assistant containing the requested thread.

format = "uuid"

threadid
string
Required

The ID of the thread to retrieve.

format = "uuid"

Responses
204

Successful operation.

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

The assistant was not found.

application/json
object
Show application/json properties
DELETE
/api/v1/assistants/{assistantid}/threads/{threadid}
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


await qlik.assistants.deleteAssistantThread(
  '507f191e810c19729de860ea',
  '507f191e810c19729de860ea',
)
Execute synchronous prompt

Execute prompt in synchronous non-streaming mode.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
assistantId
string
Required

The ID of the Assistant containing requested Thread

format = "uuid"

threadId
string
Required

The ID of the Thread to retrieve

format = "uuid"

Request Body
application/json
object
Show application/json properties
Responses
200

Prompt is successfully executed.

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

Assistant is not found.

application/json
object
Show application/json properties
500

Prompt processing error.

application/json
object
Show application/json properties
POST
/api/v1/assistants/{assistantId}/threads/{threadId}/actions/invoke
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


await qlik.assistants.invokeAssistantThread(
  '507f191e810c19729de860ea',
  '507f191e810c19729de860ea',
  {
    input: {
      includeText: true,
      prompt: 'What is a LLM?',
      promptType: 'thread',
    },
  },
)
Example Response
{
  "output": "LLM stands for Large Language Model",
  "sources": [
    {
      "chunks": [
        {
          "text": "LLM stands for Large Language Model",
          "chunkId": "10d347c4-f28a-4faf-93f0-48e781aaf303"
        }
      ],
      "source": "Reference.md",
      "documentId": "10d347c4-f28a-4faf-93f0-48e781aaf303",
      "datasourceId": "10d347c4-f28a-4faf-93f0-48e781aaf303",
      "knowledgebaseId": "10d347c4-f28a-4faf-93f0-48e781aaf303"
    }
  ],
  "question": "What was the primary goal of the Apollo program?"
}
Execute asynchronous prompt

Execute prompt in asynchronous streaming mode.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
assistantId
string
Required

The ID of the Assistant containing requested Thread

format = "uuid"

threadId
string
Required

The ID of the Thread to retrieve

format = "uuid"

Request Body
application/json
object
Show application/json properties
Responses
200

Prompt is successfully executed.

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

Method is not allowed.

application/json
object
Show application/json properties
405

Assistant is not found.

application/json
object
Show application/json properties
500

Prompt processing error.

application/json
object
Show application/json properties
POST
/api/v1/assistants/{assistantId}/threads/{threadId}/actions/stream
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


await qlik.assistants.streamAssistantThread(
  '507f191e810c19729de860ea',
  '507f191e810c19729de860ea',
  {
    input: {
      includeText: true,
      prompt: 'What is a LLM?',
      promptType: 'thread',
    },
  },
)
Example Response
{
  "output": "LLM stands for Large Language Model",
  "sources": [
    {
      "chunks": [
        {
          "text": "LLM stands for Large Language Model",
          "chunkId": "10d347c4-f28a-4faf-93f0-48e781aaf303"
        }
      ],
      "source": "Reference.md",
      "documentId": "10d347c4-f28a-4faf-93f0-48e781aaf303",
      "datasourceId": "10d347c4-f28a-4faf-93f0-48e781aaf303",
      "knowledgebaseId": "10d347c4-f28a-4faf-93f0-48e781aaf303"
    }
  ]
}
List interactions

Retrieves the list of interactions for the thread.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
limit
integer

The number of feedback to get.

minimum = 1, maximum = 100, default = 20, default = 20

next
string

Optional parameter to request the next page.

prev
string

Optional parameter to request the previous page.

sort
string

Optional resource field name to sort on, case insensitive, e.g. created. Can be prefixed with - to set descending order; defaults to ascending.

Can be one of: "CREATED""-CREATED""UPDATED""-UPDATED"

Path Parameters
assistantId
string
Required

The ID of the assistant from which to retrieve the interactions.

format = "uuid"

threadId
string
Required

The ID of the thread from which to retrieve the interactions.

format = "uuid"

Responses
200

Successfully retrieved the thread interactions.

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

The feedback was not found.

application/json
object
Show application/json properties
GET
/api/v1/assistants/{assistantId}/threads/{threadId}/interactions
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


await qlik.assistants.getAssistantThreadInteractions(
  '507f191e810c19729de860ea',
  '507f191e810c19729de860bb',
  {},
)
Example Response
{
  "data": [
    {
      "id": "10d347c4-f28a-4faf-93f0-48e781aaf303",
      "ownerId": "65e310c43fb1cf46654e0878",
      "request": "Where was Genghis Khan buried?",
      "sources": [
        {
          "chunks": [
            {
              "text": "string",
              "chunkId": "10d347c4-f28a-4faf-93f0-48e781aaf303"
            }
          ],
          "source": "Reference.md",
          "documentId": "10d347c4-f28a-4faf-93f0-48e781aaf303",
          "datasourceId": "10d347c4-f28a-4faf-93f0-48e781aaf303",
          "lastIndexedAt": "2021-10-02T14:20:50.52Z",
          "knowledgebaseId": "10d347c4-f28a-4faf-93f0-48e781aaf303"
        }
      ],
      "feedback": {
        "id": "507f191e810c19729de860ea",
        "vote": 1,
        "reason": "inaccurate | irrelevant | repetitive | unhelpful | other",
        "comment": "string",
        "reviewedAt": "2021-10-02T14:20:50.52Z",
        "reviewerId": "507f191e810c19729de860ea",
        "reviewStatus": "reviewed | unreviewed"
      },
      "rejected": true,
      "response": "Somewhere in an unmarked grave",
      "threadId": "125c24c4-668c-4c97-bef8-30d910169913",
      "createdAt": "2021-10-02T14:20:50.52Z",
      "updatedAt": "2021-10-02T14:20:55.52Z"
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
Create an interaction

Creates a new interaction for the thread.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
assistantId
string
Required

The ID of the assistant in which to create the interaction.

format = "uuid"

threadId
string
Required

The ID of the thread in which to create the interaction.

format = "uuid"

Request Body
application/json
object
Show application/json properties
Responses
201

Successfully created a new thread interaction.

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

The assistant or the thread was not found.

application/json
object
Show application/json properties
POST
/api/v1/assistants/{assistantId}/threads/{threadId}/interactions
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


await qlik.assistants.createAssistantThreadInteraction(
  '507f191e810c19729de860ea',
  '507f191e810c19729de860ea',
  {
    rejected: true,
    rejectionReason: 1,
    request: 'Where was Genghis Khan buried?',
    response: 'Somewhere in an unmarked grave',
    sources: [
      {
        chunks: [
          {
            chunkId:
              '10d347c4-f28a-4faf-93f0-48e781aaf303',
            text: 'string',
          },
        ],
        datasourceId:
          '10d347c4-f28a-4faf-93f0-48e781aaf303',
        documentId:
          '10d347c4-f28a-4faf-93f0-48e781aaf303',
        knowledgebaseId:
          '10d347c4-f28a-4faf-93f0-48e781aaf303',
        lastIndexedAt: '2021-10-02T14:20:50.52Z',
        source: 'Reference.md',
      },
    ],
  },
)
Example Response
{
  "id": "10d347c4-f28a-4faf-93f0-48e781aaf303",
  "ownerId": "65e310c43fb1cf46654e0878",
  "request": "Where was Genghis Khan buried?",
  "sources": [
    {
      "chunks": [
        {
          "text": "string",
          "chunkId": "10d347c4-f28a-4faf-93f0-48e781aaf303"
        }
      ],
      "source": "Reference.md",
      "documentId": "10d347c4-f28a-4faf-93f0-48e781aaf303",
      "datasourceId": "10d347c4-f28a-4faf-93f0-48e781aaf303",
      "lastIndexedAt": "2021-10-02T14:20:50.52Z",
      "knowledgebaseId": "10d347c4-f28a-4faf-93f0-48e781aaf303"
    }
  ],
  "feedback": {
    "id": "507f191e810c19729de860ea",
    "vote": 1,
    "reason": "inaccurate | irrelevant | repetitive | unhelpful | other",
    "comment": "string",
    "reviewedAt": "2021-10-02T14:20:50.52Z",
    "reviewerId": "507f191e810c19729de860ea",
    "reviewStatus": "reviewed | unreviewed"
  },
  "rejected": true,
  "response": "Somewhere in an unmarked grave",
  "threadId": "125c24c4-668c-4c97-bef8-30d910169913",
  "createdAt": "2021-10-02T14:20:50.52Z",
  "updatedAt": "2021-10-02T14:20:55.52Z"
}
Get an interaction

Retrieves an interaction for the thread.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
assistantId
string
Required

The ID of the assistant in which to retrieve the interaction.

format = "uuid"

interactionId
string
Required

The ID of the interaction to retrieve.

format = "uuid"

threadId
string
Required

The ID of the thread in which to retrieve the interaction.

format = "uuid"

Responses
200

Successfully retrieved the interaction.

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

The interaction was not found.

application/json
object
Show application/json properties
GET
/api/v1/assistants/{assistantId}/threads/{threadId}/interactions/{interactionId}
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


await qlik.assistants.getAssistantThreadInteraction(
  '507f191e810c19729de860ea',
  '507f191e810c19729de860ea',
  '507f191e810c19729de860ea',
)
Example Response
{
  "id": "10d347c4-f28a-4faf-93f0-48e781aaf303",
  "ownerId": "65e310c43fb1cf46654e0878",
  "request": "Where was Genghis Khan buried?",
  "sources": [
    {
      "chunks": [
        {
          "text": "string",
          "chunkId": "10d347c4-f28a-4faf-93f0-48e781aaf303"
        }
      ],
      "source": "Reference.md",
      "documentId": "10d347c4-f28a-4faf-93f0-48e781aaf303",
      "datasourceId": "10d347c4-f28a-4faf-93f0-48e781aaf303",
      "lastIndexedAt": "2021-10-02T14:20:50.52Z",
      "knowledgebaseId": "10d347c4-f28a-4faf-93f0-48e781aaf303"
    }
  ],
  "feedback": {
    "id": "507f191e810c19729de860ea",
    "vote": 1,
    "reason": "inaccurate | irrelevant | repetitive | unhelpful | other",
    "comment": "string",
    "reviewedAt": "2021-10-02T14:20:50.52Z",
    "reviewerId": "507f191e810c19729de860ea",
    "reviewStatus": "reviewed | unreviewed"
  },
  "rejected": true,
  "response": "Somewhere in an unmarked grave",
  "threadId": "125c24c4-668c-4c97-bef8-30d910169913",
  "createdAt": "2021-10-02T14:20:50.52Z",
  "updatedAt": "2021-10-02T14:20:55.52Z"
}
Delete an interaction

Deletes the specified interaction and all of its resources.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
assistantId
string
Required

The ID of the assistant in which to delete the interaction.

format = "uuid"

interactionId
string
Required

The ID of the interaction to delete.

format = "uuid"

threadId
string
Required

The ID of the thread in which to delete the interaction.

format = "uuid"

Responses
204

Successful operation.

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

The resource was not found.

application/json
object
Show application/json properties
DELETE
/api/v1/assistants/{assistantId}/threads/{threadId}/interactions/{interactionId}
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


await qlik.assistants.deleteAssistantThreadInteraction(
  '507f191e810c19729de860ea',
  '507f191e810c19729de860ea',
  '507f191e810c19729de860ea',
)
Create feedback

Creates feedback for the thread.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
assistantId
string
Required

The ID of the assistant in which to create the feedback.

format = "uuid"

interactionId
string
Required

The ID of the interaction in which to create the feedback.

format = "uuid"

threadId
string
Required

The ID of the thread in which to create the feedback.

format = "uuid"

Request Body
application/json
object
Show application/json properties
Responses
201

Successfully created a new thread feedback.

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

The resource was not found.

application/json
object
Show application/json properties
POST
/api/v1/assistants/{assistantId}/threads/{threadId}/interactions/{interactionId}/feedback
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


await qlik.assistants.createAssistantThreadInteractionFeedback(
  '507f191e810c19729de860ea',
  '507f191e810c19729de860ea',
  '507f191e810c19729de860ea',
  {
    comment: 'string',
    reason:
      'inaccurate | irrelevant | repetitive | unhelpful | other',
    vote: 1,
  },
)
Example Response
{
  "id": "10d347c4-f28a-4faf-93f0-48e781aaf303",
  "ownerId": "65e310c43fb1cf46654e0878",
  "request": "Where was Genghis Khan buried?",
  "sources": [
    {
      "chunks": [
        {
          "text": "string",
          "chunkId": "10d347c4-f28a-4faf-93f0-48e781aaf303"
        }
      ],
      "source": "Reference.md",
      "documentId": "10d347c4-f28a-4faf-93f0-48e781aaf303",
      "datasourceId": "10d347c4-f28a-4faf-93f0-48e781aaf303",
      "lastIndexedAt": "2021-10-02T14:20:50.52Z",
      "knowledgebaseId": "10d347c4-f28a-4faf-93f0-48e781aaf303"
    }
  ],
  "feedback": {
    "id": "507f191e810c19729de860ea",
    "vote": 1,
    "reason": "inaccurate | irrelevant | repetitive | unhelpful | other",
    "comment": "string",
    "reviewedAt": "2021-10-02T14:20:50.52Z",
    "reviewerId": "507f191e810c19729de860ea",
    "reviewStatus": "reviewed | unreviewed"
  },
  "rejected": true,
  "response": "Somewhere in an unmarked grave",
  "threadId": "125c24c4-668c-4c97-bef8-30d910169913",
  "createdAt": "2021-10-02T14:20:50.52Z",
  "updatedAt": "2021-10-02T14:20:55.52Z"
}
Update feedback

Updates feedback for the thread.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
assistantId
string
Required

The ID of the assistant containing the requested feedback.

format = "uuid"

feedbackId
string
Required

The ID of the feedback to update.

format = "uuid"

interactionId
string
Required

The ID of the interaction containing the requested Feedback.

format = "uuid"

threadId
string
Required

The ID of the thread containing the requested feedback.

format = "uuid"

Request Body
application/json
array of objects

An array of JSON Patch documents.

Show application/json properties
Responses
204

Successfully updated the feedback.

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

The resource was not found.

application/json
object
Show application/json properties
PATCH
/api/v1/assistants/{assistantId}/threads/{threadId}/interactions/{interactionId}/feedback/{feedbackId}
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


await qlik.assistants.patchAssistantThreadInteractionFeedback(
  '507f191e810c19729de860ea',
  '507f191e810c19729de860ea',
  '507f191e810c19729de860ea',
  '507f191e810c19729de860ea',
  [
    {
      op: 'replace',
      path: '/reason',
      value: 'irrelevant',
    },
  ],
)
Create feedback review

Creates feedback review for the thread.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
assistantId
string
Required

The ID of the assistant in which to create the feedback review.

format = "uuid"

interactionId
string
Required

The ID of the interaction in which to create the feedback review.

format = "uuid"

threadId
string
Required

The ID of the thread in which to create the feedback review.

format = "uuid"

Request Body
application/json
object
Show application/json properties
Responses
201

Successfully created a new thread feedback.

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

A resource was not found.

application/json
object
Show application/json properties
POST
/api/v1/assistants/{assistantId}/threads/{threadId}/interactions/{interactionId}/reviews
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


await qlik.assistants.createAssistantThreadInteractionReview(
  '507f191e810c19729de860ea',
  '507f191e810c19729de860ea',
  '507f191e810c19729de860ea',
  { reviewStatus: 'reviewed | unreviewed' },
)
Example Response
{
  "id": "10d347c4-f28a-4faf-93f0-48e781aaf303",
  "ownerId": "65e310c43fb1cf46654e0878",
  "request": "Where was Genghis Khan buried?",
  "sources": [
    {
      "chunks": [
        {
          "text": "string",
          "chunkId": "10d347c4-f28a-4faf-93f0-48e781aaf303"
        }
      ],
      "source": "Reference.md",
      "documentId": "10d347c4-f28a-4faf-93f0-48e781aaf303",
      "datasourceId": "10d347c4-f28a-4faf-93f0-48e781aaf303",
      "lastIndexedAt": "2021-10-02T14:20:50.52Z",
      "knowledgebaseId": "10d347c4-f28a-4faf-93f0-48e781aaf303"
    }
  ],
  "feedback": {
    "id": "507f191e810c19729de860ea",
    "vote": 1,
    "reason": "inaccurate | irrelevant | repetitive | unhelpful | other",
    "comment": "string",
    "reviewedAt": "2021-10-02T14:20:50.52Z",
    "reviewerId": "507f191e810c19729de860ea",
    "reviewStatus": "reviewed | unreviewed"
  },
  "rejected": true,
  "response": "Somewhere in an unmarked grave",
  "threadId": "125c24c4-668c-4c97-bef8-30d910169913",
  "createdAt": "2021-10-02T14:20:50.52Z",
  "updatedAt": "2021-10-02T14:20:55.52Z"
}
Get an assistant

Retrieves the specified assistant.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
id
string
Required

The ID of the assistant to retrieve.

format = "uuid"

Responses
200

Successfully retrieved the assistant.

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

The assistant was not found.

application/json
object
Show application/json properties
GET
/api/v1/assistants/{id}
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


await qlik.assistants.getAssistant(
  '507f191e810c19729de860ea',
)
Example Response
{
  "id": "507f191e810c19729de860ea",
  "name": "Organization-wide Assistant",
  "tags": [
    "Red",
    "Sales"
  ],
  "title": "Assistant for Sales activities",
  "ownerId": "507f191e810c19729de860ea",
  "spaceId": "507f191e810c19729de860ea",
  "tenantId": "507f191e810c19729de860ea",
  "createdAt": "2021-10-02T14:20:50.52Z",
  "createdBy": "507f191e810c19729de860ea",
  "hasAvatar": true,
  "updatedAt": "2021-10-02T14:20:50.52Z",
  "updatedBy": "507f191e810c19729de860ea",
  "description": "This assistant is used for...",
  "systemMessage": "You are helpful Sales assistant. Provide concise and actionable insights.",
  "knowledgeBases": [
    "507f191e810c19729de860ea"
  ],
  "welcomeMessage": "Welcome to Sales process support Assistant.",
  "customProperties": {
    "customErrors": {
      "outsideScopeError": "Outside of scope error",
      "complexQuestionError": "Complex question error",
      "promptInjectionError": "Prompt injection error"
    }
  },
  "defaultPromptType": "thread",
  "orderedStarterIds": [
    "507f191e810c19729de860ea",
    "787f191e810c19729de860er"
  ]
}
Update assistant properties

Updates the properties of an existing assistant with JSON Patch-formatted data.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Header Parameters
if-match
string

Optional header to do conditional updates. Using the Etag value that was returned the last time the assistant was fetched.

Path Parameters
id
string
Required

The assistant ID.

format = "uuid"

Request Body
Required
application/json
array of objects

An array of JSON Patch documents.

Show application/json properties
Responses
204

Assistant updated successfully.

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

The request has been rate-limited.

application/json
object
Show application/json properties
PATCH
/api/v1/assistants/{id}
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


await qlik.assistants.patchAssistant(
  '507f191e810c19729de860ea',
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


    {
      op: 'add',
      path: '/defaultPromptType',
      value: 'thread',
    },


    { op: 'remove', path: '/avatar' },


    {
      op: 'add',
      path: '/avatar',
      value:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAlAQAAAAAsYlcCAAAACklEQVR4AWMYBQABAwABRUEDtQAAAABJRU5ErkJggg==',
    },


    {
      op: 'replace',
      path: '/avatar',
      value:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAlAQAAAAAsYlcCAAAACklEQVR4AWMYBQABAwABRUEDtQAAAABJRU5ErkJggg==',
    },
  ],
)
Delete an assistant

Deletes the assistant and all of its resources.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
id
string
Required

The ID of the assistant to delete.

format = "uuid"

Responses
204

Successful operation.

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

The assistant was not found.

application/json
object
Show application/json properties
DELETE
/api/v1/assistants/{id}
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


await qlik.assistants.deleteAssistant(
  '507f191e810c19729de860ea',
)
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
We use cookies to improve your experience with our websites and to deliver content tailored to your interests. By clicking ‘Ok’, you accept the use of additional cookies which may involve data transmission to third parties. Refer to our Privacy & Cookie Notice or click ‘More Information’ for details on cookie usage on our sites.Privacy & Cookie Notice
Ok
More Information