---
title: "Conditions REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/conditions/"
local_path: "docs/endpoints/conditions.md"
---

Title: Conditions REST | Qlik Developer Portal


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
Conditions

Conditions are used by features such as data alerting and subscriptions to determine when action should be taken, based on data in a Qlik app.

Download OpenAPI spec
Endpoints
POST
/api/v1/conditions
GET
/api/v1/conditions/{id}
PATCH
/api/v1/conditions/{id}
DELETE
/api/v1/conditions/{id}
POST
/api/v1/conditions/{id}/evaluations
GET
/api/v1/conditions/{id}/evaluations/{evaluationId}
DELETE
/api/v1/conditions/{id}/evaluations/{evaluationId}
POST
/api/v1/conditions/previews
GET
/api/v1/conditions/previews/{id}
GET
/api/v1/conditions/settings
PUT
/api/v1/conditions/settings
Creates a new condition.
Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body

The condition create request definition.

application/json
object

only one of compoundCondition or dataCondition should be set

Show application/json properties
Responses
201

Condition created

application/json
object
Show application/json properties
400

Bad request body

application/json
object
Show application/json properties
default

Error response.

application/json
object
Show application/json properties
POST
/api/v1/conditions
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


await qlik.conditions.createCondition({
  compoundCondition: {
    conditionBase: {
      appId: '4xQ1chLoHkOikyzUGcHJquteNrAfketW',
      bookmarkId:
        'anTjnOABmxlCirVx8IRfhWhLd9IZjENl',
      description: 'My condition',
      type: 'compound',
    },
    data: {
      conditions: [
        'rDDAcMEI1V0qzauEWepEVY8oSLJ9fvA2',


        'qFPF1dAtPK4vfPTmKyyuKaqA6iERCwLi',


        '4gnz8E6ZruG0lkSKwkau66P24CtORyLr',


        'ATs--Z0b_NGyuHajcbQkxu7RrajgPaEQ',
      ],
      expression: '($0 OR $1) AND ($2 OR $3)',
      history: { enabled: true },
    },
  },
  dataCondition: {
    conditionBase: {
      appId: '4xQ1chLoHkOikyzUGcHJquteNrAfketW',
      bookmarkId:
        'anTjnOABmxlCirVx8IRfhWhLd9IZjENl',
      description: 'My condition',
      type: 'compound',
    },
    conditionData: {},
    dimensions: [
      {
        field: 'Neighborhood',
        qLibraryId: 'PgQKNQ',
        title: 'Neighborhood',
      },
    ],
    headers: ['sumnum'],
    history: { enabled: true },
    measures: [
      {
        qLibraryId: 'PgQKNQ',
        qNumFormat: {
          qDec: '.',
          qFmt: '###0',
          qType: 'I',
          qnDec: 0,
          qUseThou: 1,
        },
        title: 'sumnum',
      },
    ],
    selections: [
      {
        count: 2,
        field: 'SalesTerritoryCountry',
        selectedSummary: [],
      },
    ],
  },
  type: 'compound',
})
Example Response
{
  "errors": [
    {
      "code": "string",
      "meta": {},
      "title": "string",
      "detail": "string"
    }
  ],
  "condition": {
    "type": "compound",
    "ownerId": "EIwSIgqjmbHGwQJI0ShQoS3ORdz5nCpA",
    "tenantId": "5GI7yWoJk9lvNtuEc66SXCypXVfhbVeH",
    "dataCondition": {
      "headers": [
        "sumnum"
      ],
      "history": {
        "enabled": true
      },
      "measures": [
        {
          "title": "sumnum",
          "qLibraryId": "PgQKNQ",
          "qNumFormat": {
            "qDec": ".",
            "qFmt": "###0",
            "qType": "I",
            "qnDec": 0,
            "qUseThou": 1
          }
        }
      ],
      "dimensions": [
        {
          "field": "Neighborhood",
          "title": "Neighborhood",
          "qLibraryId": "PgQKNQ"
        }
      ],
      "selections": [
        {
          "count": 2,
          "field": "SalesTerritoryCountry",
          "selectedSummary": "[ Germany, Australia ]"
        }
      ],
      "conditionBase": {
        "id": "5f31c6e8476ae50001030fb6",
        "type": "compound",
        "appId": "4xQ1chLoHkOikyzUGcHJquteNrAfketW",
        "created": "2006-01-02T15:04:05Z07:00",
        "ownerId": "EIwSIgqjmbHGwQJI0ShQoS3ORdz5nCpA",
        "updated": "2006-01-02T14:04:05Z07:00",
        "tenantId": "5GI7yWoJk9lvNtuEc66SXCypXVfhbVeH",
        "bookmarkId": "anTjnOABmxlCirVx8IRfhWhLd9IZjENl",
        "createdById": "EIwSIgqjmbHGwQJI0ShQoS3ORdz5nCpA",
        "description": "My condition",
        "lastReloadTime": "2006-01-02T15:04:05Z07:00"
      },
      "conditionData": {}
    },
    "compoundCondition": {
      "data": {
        "history": {
          "enabled": true
        },
        "conditions": [
          "rDDAcMEI1V0qzauEWepEVY8oSLJ9fvA2",
          "qFPF1dAtPK4vfPTmKyyuKaqA6iERCwLi",
          "4gnz8E6ZruG0lkSKwkau66P24CtORyLr",
          "ATs--Z0b_NGyuHajcbQkxu7RrajgPaEQ"
        ],
        "expression": "($0 OR $1) AND ($2 OR $3)"
      },
      "conditionBase": {
        "id": "5f31c6e8476ae50001030fb6",
        "type": "compound",
        "appId": "4xQ1chLoHkOikyzUGcHJquteNrAfketW",
        "created": "2006-01-02T15:04:05Z07:00",
        "ownerId": "EIwSIgqjmbHGwQJI0ShQoS3ORdz5nCpA",
        "updated": "2006-01-02T14:04:05Z07:00",
        "tenantId": "5GI7yWoJk9lvNtuEc66SXCypXVfhbVeH",
        "bookmarkId": "anTjnOABmxlCirVx8IRfhWhLd9IZjENl",
        "createdById": "EIwSIgqjmbHGwQJI0ShQoS3ORdz5nCpA",
        "description": "My condition",
        "lastReloadTime": "2006-01-02T15:04:05Z07:00"
      }
    }
  }
}
Retrieve a specific condition by id.
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
id
string
Required

The id of the condition

format = "uid"

Responses
200

The condition

application/json
object

only one of compoundCondition or dataCondition should be set

Show application/json properties
404

Resource does not exist.

application/json
object
Show application/json properties
default

Error response.

application/json
object
Show application/json properties
GET
/api/v1/conditions/{id}
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


await qlik.conditions.getCondition(
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
)
Example Response
{
  "type": "compound",
  "ownerId": "EIwSIgqjmbHGwQJI0ShQoS3ORdz5nCpA",
  "tenantId": "5GI7yWoJk9lvNtuEc66SXCypXVfhbVeH",
  "dataCondition": {
    "headers": [
      "sumnum"
    ],
    "history": {
      "enabled": true
    },
    "measures": [
      {
        "title": "sumnum",
        "qLibraryId": "PgQKNQ",
        "qNumFormat": {
          "qDec": ".",
          "qFmt": "###0",
          "qType": "I",
          "qnDec": 0,
          "qUseThou": 1
        }
      }
    ],
    "dimensions": [
      {
        "field": "Neighborhood",
        "title": "Neighborhood",
        "qLibraryId": "PgQKNQ"
      }
    ],
    "selections": [
      {
        "count": 2,
        "field": "SalesTerritoryCountry",
        "selectedSummary": "[ Germany, Australia ]"
      }
    ],
    "conditionBase": {
      "id": "5f31c6e8476ae50001030fb6",
      "type": "compound",
      "appId": "4xQ1chLoHkOikyzUGcHJquteNrAfketW",
      "created": "2006-01-02T15:04:05Z07:00",
      "ownerId": "EIwSIgqjmbHGwQJI0ShQoS3ORdz5nCpA",
      "updated": "2006-01-02T14:04:05Z07:00",
      "tenantId": "5GI7yWoJk9lvNtuEc66SXCypXVfhbVeH",
      "bookmarkId": "anTjnOABmxlCirVx8IRfhWhLd9IZjENl",
      "createdById": "EIwSIgqjmbHGwQJI0ShQoS3ORdz5nCpA",
      "description": "My condition",
      "lastReloadTime": "2006-01-02T15:04:05Z07:00"
    },
    "conditionData": {}
  },
  "compoundCondition": {
    "data": {
      "history": {
        "enabled": true
      },
      "conditions": [
        "rDDAcMEI1V0qzauEWepEVY8oSLJ9fvA2",
        "qFPF1dAtPK4vfPTmKyyuKaqA6iERCwLi",
        "4gnz8E6ZruG0lkSKwkau66P24CtORyLr",
        "ATs--Z0b_NGyuHajcbQkxu7RrajgPaEQ"
      ],
      "expression": "($0 OR $1) AND ($2 OR $3)"
    },
    "conditionBase": {
      "id": "5f31c6e8476ae50001030fb6",
      "type": "compound",
      "appId": "4xQ1chLoHkOikyzUGcHJquteNrAfketW",
      "created": "2006-01-02T15:04:05Z07:00",
      "ownerId": "EIwSIgqjmbHGwQJI0ShQoS3ORdz5nCpA",
      "updated": "2006-01-02T14:04:05Z07:00",
      "tenantId": "5GI7yWoJk9lvNtuEc66SXCypXVfhbVeH",
      "bookmarkId": "anTjnOABmxlCirVx8IRfhWhLd9IZjENl",
      "createdById": "EIwSIgqjmbHGwQJI0ShQoS3ORdz5nCpA",
      "description": "My condition",
      "lastReloadTime": "2006-01-02T15:04:05Z07:00"
    }
  }
}
Patch values in the condition
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
id
string
Required

The id of the condition

format = "uid"

Request Body
application/json
array of objects

A JSON Patch document as defined in https://datatracker.ietf.org/doc/html/rfc6902.

Show application/json properties
Responses
204

The condition was updated

400

A path or value was invalid

application/json
object
Show application/json properties
404

Resource does not exist.

application/json
object
Show application/json properties
default

Error response

application/json
object
Show application/json properties
PATCH
/api/v1/conditions/{id}
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


await qlik.conditions.patchCondition(
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
  [
    {
      op: 'replace',
      path: '/compoundCondition/conditionBase/ownerId',
      value: 'I6mWVd60wRWIbOXZr1ZKV8QTnxhnitbX',
    },


    {
      op: 'replace',
      path: '/dataCondition/conditionBase/description',
      value: 'My description',
    },


    {
      op: 'remove',
      path: '/compoundCondition/data/conditions/0',
    },


    {
      op: 'replace',
      path: '/compoundCondition//data/expression',
      value: '$0 AND $1',
    },


    {
      op: 'replace',
      path: '/dataCondition/conditionData/measure',
      value: 'revenue',
    },
  ],
)
Delete the condition
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
id
string
Required

The id of the condition

format = "uid"

Responses
204

The record was deleted.

404

Resource does not exist.

application/json
object
Show application/json properties
default

Error response

application/json
object
Show application/json properties
DELETE
/api/v1/conditions/{id}
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


await qlik.conditions.deleteCondition(
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
)
Executes the condition
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
id
string
Required

The id of the condition

format = "uid"

Request Body
application/json
object
Show application/json properties
Responses
201

Condition evaluation created

application/json
object
Show application/json properties
400

Bad request body

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
default

Error response.

application/json
object
Show application/json properties
POST
/api/v1/conditions/{id}/evaluations
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


await qlik.conditions.createConditionEvaluation(
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
  {
    alertId: '5f64885b2e11d23982c09e03',
    causalEvent: {
      data: {
        eventID: 'string',
        lastReloadTime:
          '2006-01-02T15:04:05Z07:00',
      },
      eventID: 'string',
      extensions: {
        sessionID: 'string',
        tenantID: 'string',
        userID: 'string',
      },
      manualTrigger: true,
      manualTriggerID: 'string',
    },
    contextId:
      '795c75ba-7812-4c8f-9ced-551b6b006183',
  },
)
Example Response
{
  "errors": [
    {
      "code": "string",
      "meta": {},
      "title": "string",
      "detail": "string"
    }
  ],
  "contextId": "795c75ba-7812-4c8f-9ced-551b6b006183",
  "evaluationId": "795c75ba-7812-4c8f-9ced-551b6b006183"
}
Get an Evaluation
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
evaluationId
string
Required

The id of the evaluation

format = "uid"

id
string
Required

The id of the condition

format = "uid"

Responses
200

The evaluation

application/json
object

Get response returns the evaluation and condition associated

Show application/json properties
404

Resource does not exist.

application/json
object
Show application/json properties
default

Error response.

application/json
object
Show application/json properties
GET
/api/v1/conditions/{id}/evaluations/{evaluationId}
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


await qlik.conditions.getConditionEvaluation(
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
)
Example Response
{
  "condition": {
    "type": "compound",
    "ownerId": "EIwSIgqjmbHGwQJI0ShQoS3ORdz5nCpA",
    "tenantId": "5GI7yWoJk9lvNtuEc66SXCypXVfhbVeH",
    "dataCondition": {
      "headers": [
        "sumnum"
      ],
      "history": {
        "enabled": true
      },
      "measures": [
        {
          "title": "sumnum",
          "qLibraryId": "PgQKNQ",
          "qNumFormat": {
            "qDec": ".",
            "qFmt": "###0",
            "qType": "I",
            "qnDec": 0,
            "qUseThou": 1
          }
        }
      ],
      "dimensions": [
        {
          "field": "Neighborhood",
          "title": "Neighborhood",
          "qLibraryId": "PgQKNQ"
        }
      ],
      "selections": [
        {
          "count": 2,
          "field": "SalesTerritoryCountry",
          "selectedSummary": "[ Germany, Australia ]"
        }
      ],
      "conditionBase": {
        "id": "5f31c6e8476ae50001030fb6",
        "type": "compound",
        "appId": "4xQ1chLoHkOikyzUGcHJquteNrAfketW",
        "created": "2006-01-02T15:04:05Z07:00",
        "ownerId": "EIwSIgqjmbHGwQJI0ShQoS3ORdz5nCpA",
        "updated": "2006-01-02T14:04:05Z07:00",
        "tenantId": "5GI7yWoJk9lvNtuEc66SXCypXVfhbVeH",
        "bookmarkId": "anTjnOABmxlCirVx8IRfhWhLd9IZjENl",
        "createdById": "EIwSIgqjmbHGwQJI0ShQoS3ORdz5nCpA",
        "description": "My condition",
        "lastReloadTime": "2006-01-02T15:04:05Z07:00"
      },
      "conditionData": {}
    },
    "compoundCondition": {
      "data": {
        "history": {
          "enabled": true
        },
        "conditions": [
          "rDDAcMEI1V0qzauEWepEVY8oSLJ9fvA2",
          "qFPF1dAtPK4vfPTmKyyuKaqA6iERCwLi",
          "4gnz8E6ZruG0lkSKwkau66P24CtORyLr",
          "ATs--Z0b_NGyuHajcbQkxu7RrajgPaEQ"
        ],
        "expression": "($0 OR $1) AND ($2 OR $3)"
      },
      "conditionBase": {
        "id": "5f31c6e8476ae50001030fb6",
        "type": "compound",
        "appId": "4xQ1chLoHkOikyzUGcHJquteNrAfketW",
        "created": "2006-01-02T15:04:05Z07:00",
        "ownerId": "EIwSIgqjmbHGwQJI0ShQoS3ORdz5nCpA",
        "updated": "2006-01-02T14:04:05Z07:00",
        "tenantId": "5GI7yWoJk9lvNtuEc66SXCypXVfhbVeH",
        "bookmarkId": "anTjnOABmxlCirVx8IRfhWhLd9IZjENl",
        "createdById": "EIwSIgqjmbHGwQJI0ShQoS3ORdz5nCpA",
        "description": "My condition",
        "lastReloadTime": "2006-01-02T15:04:05Z07:00"
      }
    }
  },
  "evaluation": {
    "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
    "errors": [
      {
        "code": "string",
        "meta": {
          "fatal": true
        },
        "title": "string"
      }
    ],
    "result": true,
    "status": "RUNNING",
    "alertId": "5f64885b2e11d23982c09e03",
    "endTime": "string",
    "ownerId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
    "retries": 42,
    "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
    "condition": {
      "type": "compound",
      "ownerId": "EIwSIgqjmbHGwQJI0ShQoS3ORdz5nCpA",
      "tenantId": "5GI7yWoJk9lvNtuEc66SXCypXVfhbVeH",
      "dataCondition": {
        "headers": [
          "sumnum"
        ],
        "history": {
          "enabled": true
        },
        "measures": [
          {
            "title": "sumnum",
            "qLibraryId": "PgQKNQ",
            "qNumFormat": {
              "qDec": ".",
              "qFmt": "###0",
              "qType": "I",
              "qnDec": 0,
              "qUseThou": 1
            }
          }
        ],
        "dimensions": [
          {
            "field": "Neighborhood",
            "title": "Neighborhood",
            "qLibraryId": "PgQKNQ"
          }
        ],
        "selections": [
          {
            "count": 2,
            "field": "SalesTerritoryCountry",
            "selectedSummary": "[ Germany, Australia ]"
          }
        ],
        "conditionBase": {
          "id": "5f31c6e8476ae50001030fb6",
          "type": "compound",
          "appId": "4xQ1chLoHkOikyzUGcHJquteNrAfketW",
          "created": "2006-01-02T15:04:05Z07:00",
          "ownerId": "EIwSIgqjmbHGwQJI0ShQoS3ORdz5nCpA",
          "updated": "2006-01-02T14:04:05Z07:00",
          "tenantId": "5GI7yWoJk9lvNtuEc66SXCypXVfhbVeH",
          "bookmarkId": "anTjnOABmxlCirVx8IRfhWhLd9IZjENl",
          "createdById": "EIwSIgqjmbHGwQJI0ShQoS3ORdz5nCpA",
          "description": "My condition",
          "lastReloadTime": "2006-01-02T15:04:05Z07:00"
        },
        "conditionData": {}
      },
      "compoundCondition": {
        "data": {
          "history": {
            "enabled": true
          },
          "conditions": [
            "rDDAcMEI1V0qzauEWepEVY8oSLJ9fvA2",
            "qFPF1dAtPK4vfPTmKyyuKaqA6iERCwLi",
            "4gnz8E6ZruG0lkSKwkau66P24CtORyLr",
            "ATs--Z0b_NGyuHajcbQkxu7RrajgPaEQ"
          ],
          "expression": "($0 OR $1) AND ($2 OR $3)"
        },
        "conditionBase": {
          "id": "5f31c6e8476ae50001030fb6",
          "type": "compound",
          "appId": "4xQ1chLoHkOikyzUGcHJquteNrAfketW",
          "created": "2006-01-02T15:04:05Z07:00",
          "ownerId": "EIwSIgqjmbHGwQJI0ShQoS3ORdz5nCpA",
          "updated": "2006-01-02T14:04:05Z07:00",
          "tenantId": "5GI7yWoJk9lvNtuEc66SXCypXVfhbVeH",
          "bookmarkId": "anTjnOABmxlCirVx8IRfhWhLd9IZjENl",
          "createdById": "EIwSIgqjmbHGwQJI0ShQoS3ORdz5nCpA",
          "description": "My condition",
          "lastReloadTime": "2006-01-02T15:04:05Z07:00"
        }
      }
    },
    "contextId": "string",
    "startTime": "string",
    "resultData": {},
    "causalEvent": {},
    "conditionId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
    "retryPolicy": "NONE",
    "reloadEndTime": "string",
    "byokMigrationId": "string",
    "removalErrorCount": 3,
    "dataConditionEvaluatorId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69"
  }
}
Delete an Evaluation
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
evaluationId
string
Required

The id of the evaluation

format = "uid"

id
string
Required

The id of the condition

format = "uid"

Responses
204

The evaluation was deleted

404

Resource does not exist.

application/json
object
Show application/json properties
default

Error response

application/json
object
Show application/json properties
DELETE
/api/v1/conditions/{id}/evaluations/{evaluationId}
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


await qlik.conditions.deleteConditionEvaluation(
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
)
Create condition preview request\

Create condition preview request.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body

Create condition preview request

application/json
object

only one of compoundCondition or dataCondition should be set

Show application/json properties
Responses
201

Condition preview request created.

application/json
object
Show application/json properties
400

Bad request body

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
default

Error response.

application/json
object
Show application/json properties
POST
/api/v1/conditions/previews
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


await qlik.conditions.createConditionPreview({
  compoundCondition: {
    conditionBase: {
      appId: '4xQ1chLoHkOikyzUGcHJquteNrAfketW',
      bookmarkId:
        'anTjnOABmxlCirVx8IRfhWhLd9IZjENl',
      description: 'My condition',
      type: 'compound',
    },
    data: {
      conditions: [
        'rDDAcMEI1V0qzauEWepEVY8oSLJ9fvA2',


        'qFPF1dAtPK4vfPTmKyyuKaqA6iERCwLi',


        '4gnz8E6ZruG0lkSKwkau66P24CtORyLr',


        'ATs--Z0b_NGyuHajcbQkxu7RrajgPaEQ',
      ],
      expression: '($0 OR $1) AND ($2 OR $3)',
      history: { enabled: true },
    },
  },
  dataCondition: {
    conditionBase: {
      appId: '4xQ1chLoHkOikyzUGcHJquteNrAfketW',
      bookmarkId:
        'anTjnOABmxlCirVx8IRfhWhLd9IZjENl',
      description: 'My condition',
      type: 'compound',
    },
    conditionData: {},
    dimensions: [
      {
        field: 'Neighborhood',
        qLibraryId: 'PgQKNQ',
        title: 'Neighborhood',
      },
    ],
    headers: ['sumnum'],
    history: { enabled: true },
    measures: [
      {
        qLibraryId: 'PgQKNQ',
        qNumFormat: {
          qDec: '.',
          qFmt: '###0',
          qType: 'I',
          qnDec: 0,
          qUseThou: 1,
        },
        title: 'sumnum',
      },
    ],
    selections: [
      {
        count: 2,
        field: 'SalesTerritoryCountry',
        selectedSummary: [],
      },
    ],
  },
  type: 'compound',
})
Example Response
{
  "previewId": "467ea9bc-bbd7-11ea-b3de-0242ac130004"
}
Get condition preview response

Get condition preview response.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
id
string
Required

The id of the condition

format = "uid"

Responses
200

The evaluation

application/json
object
Show application/json properties
400

Bad request body

application/json
object
Show application/json properties
404

Resource does not exist.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
default

Error response.

application/json
object
Show application/json properties
GET
/api/v1/conditions/previews/{id}
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


await qlik.conditions.getConditionPreview(
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
)
Example Response
{
  "errors": [
    {
      "code": "string",
      "meta": {},
      "title": "string",
      "detail": "string"
    }
  ],
  "status": "ACCEPTED",
  "condition": {
    "type": "compound",
    "ownerId": "EIwSIgqjmbHGwQJI0ShQoS3ORdz5nCpA",
    "tenantId": "5GI7yWoJk9lvNtuEc66SXCypXVfhbVeH",
    "dataCondition": {
      "headers": [
        "sumnum"
      ],
      "history": {
        "enabled": true
      },
      "measures": [
        {
          "title": "sumnum",
          "qLibraryId": "PgQKNQ",
          "qNumFormat": {
            "qDec": ".",
            "qFmt": "###0",
            "qType": "I",
            "qnDec": 0,
            "qUseThou": 1
          }
        }
      ],
      "dimensions": [
        {
          "field": "Neighborhood",
          "title": "Neighborhood",
          "qLibraryId": "PgQKNQ"
        }
      ],
      "selections": [
        {
          "count": 2,
          "field": "SalesTerritoryCountry",
          "selectedSummary": "[ Germany, Australia ]"
        }
      ],
      "conditionBase": {
        "id": "5f31c6e8476ae50001030fb6",
        "type": "compound",
        "appId": "4xQ1chLoHkOikyzUGcHJquteNrAfketW",
        "created": "2006-01-02T15:04:05Z07:00",
        "ownerId": "EIwSIgqjmbHGwQJI0ShQoS3ORdz5nCpA",
        "updated": "2006-01-02T14:04:05Z07:00",
        "tenantId": "5GI7yWoJk9lvNtuEc66SXCypXVfhbVeH",
        "bookmarkId": "anTjnOABmxlCirVx8IRfhWhLd9IZjENl",
        "createdById": "EIwSIgqjmbHGwQJI0ShQoS3ORdz5nCpA",
        "description": "My condition",
        "lastReloadTime": "2006-01-02T15:04:05Z07:00"
      },
      "conditionData": {}
    },
    "compoundCondition": {
      "data": {
        "history": {
          "enabled": true
        },
        "conditions": [
          "rDDAcMEI1V0qzauEWepEVY8oSLJ9fvA2",
          "qFPF1dAtPK4vfPTmKyyuKaqA6iERCwLi",
          "4gnz8E6ZruG0lkSKwkau66P24CtORyLr",
          "ATs--Z0b_NGyuHajcbQkxu7RrajgPaEQ"
        ],
        "expression": "($0 OR $1) AND ($2 OR $3)"
      },
      "conditionBase": {
        "id": "5f31c6e8476ae50001030fb6",
        "type": "compound",
        "appId": "4xQ1chLoHkOikyzUGcHJquteNrAfketW",
        "created": "2006-01-02T15:04:05Z07:00",
        "ownerId": "EIwSIgqjmbHGwQJI0ShQoS3ORdz5nCpA",
        "updated": "2006-01-02T14:04:05Z07:00",
        "tenantId": "5GI7yWoJk9lvNtuEc66SXCypXVfhbVeH",
        "bookmarkId": "anTjnOABmxlCirVx8IRfhWhLd9IZjENl",
        "createdById": "EIwSIgqjmbHGwQJI0ShQoS3ORdz5nCpA",
        "description": "My condition",
        "lastReloadTime": "2006-01-02T15:04:05Z07:00"
      }
    }
  },
  "previewId": "467ea9bc-bbd7-11ea-b3de-0242ac130004",
  "evaluation": {
    "endTime": "string",
    "ownerId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
    "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
    "resultUrl": "string",
    "startTime": "string"
  }
}
Retrieves condition manager settings

Lists api settings.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Responses
200

The api settings have been successfully returned

application/json
object
Show application/json properties
404

Resource does not exist.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
default

Error response.

application/json
object
Show application/json properties
GET
/api/v1/conditions/settings
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


await qlik.conditions.getConditionsSettings()
Example Response
{
  "tenantId": "cgdsAumGmQ6l0Bi7CUKt9V8P_Y9GL0sC",
  "enable-conditions": true
}
Updates condition manager settings

Updates API configuration. Accessible only by tenant admins.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Header Parameters
Authorization
string

The JWT used for authentication. Send the JWT in the AuthRequest header using the Bearer schema.

Request Body

Request for updating the api settings

application/json
object
Show application/json properties
Responses
204

api settings have been successfully updated.

400

Bad request body

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
default

Error response.

application/json
object
Show application/json properties
PUT
/api/v1/conditions/settings
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `PUT /api/v1/conditions/settings` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/v1/conditions/settings',
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'enable-conditions': true,
    }),
  },
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