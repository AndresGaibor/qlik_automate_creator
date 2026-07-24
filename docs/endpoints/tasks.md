---
title: "Tasks REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/tasks/"
local_path: "docs/endpoints/tasks.md"
---

Title: Tasks REST | Qlik Developer Portal


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
Tasks

API for managing tasks and task chains in Qlik Cloud. The requesting user needs the "reload" permission on the target resource to use this set of endpoints. A tenant admin can use GET /v1/tasks and DELETE /v1/tasks/{id} to perform administrative actions, even without the "reload" permission.

Download OpenAPI spec
Endpoints
GET
/api/v1/tasks
POST
/api/v1/tasks
GET
/api/v1/tasks/{id}
PUT
/api/v1/tasks/{id}
DELETE
/api/v1/tasks/{id}
POST
/api/v1/tasks/{id}/actions/start
GET
/api/v1/tasks/{id}/runs
GET
/api/v1/tasks/{id}/runs/{runId}/log
GET
/api/v1/tasks/{id}/runs/last
GET
/api/v1/tasks/resources/{id}/runs
List tasks
Replacement available

For new integrations, and when updating your existing integrations, use:

GET scheduling/tasks

Retrieves a list of the tasks that the requesting user has access to.

Facts
	Rate limit	Special (600 requests per minute)

	Replaced by	
GET scheduling/tasks
Query Parameters
limit
integer

The maximum number of resources to return for a request.

minimum = 1, maximum = 100, default = 20, default = 20

page
string

The page cursor.

resourceId
string

Filter tasks by its target resource ID.

sort
string

The property of a resource to sort on (default sort is -updatedAt). A property must be prefixed by + or - to indicate ascending or descending sort order respectively.

Can be one of: "+createdAt""-createdAt""+updatedAt""-updatedAt"

default = "-updatedAt"

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
/api/v1/tasks
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


await qlik.tasks.getTasks({})
Example Response
{
  "data": [
    {
      "id": "string",
      "key": "string",
      "name": "string",
      "start": {
        "schedule": "string",
        "stateName": "string"
      },
      "events": [
        {
          "name": "string",
          "type": "com.qlik.v1.task.run.finished",
          "source": "system-events.task",
          "dataOnly": true,
          "correlation": [
            {
              "contextAttributeName": "id",
              "contextAttributeValue": "string"
            }
          ]
        }
      ],
      "states": [
        {
          "end": true,
          "name": "string",
          "type": "EVENT",
          "onEvents": [
            {
              "actions": [
                {
                  "name": "string",
                  "retryRef": "string",
                  "condition": "string",
                  "functionRef": {},
                  "retryableErrors": [
                    "string"
                  ],
                  "nonRetryableErrors": [
                    "string"
                  ]
                }
              ],
              "eventRefs": [
                "string"
              ],
              "actionMode": "SEQUENTIAL"
            }
          ],
          "timeouts": {
            "eventTimeout": "string",
            "stateExecTimeout": "string",
            "actionExecTimeout": "string"
          },
          "exclusive": true,
          "compensatedBy": "string"
        }
      ],
      "enabled": false,
      "version": "string",
      "metadata": {
        "usage": "ANALYTICS",
        "ownerId": "string",
        "spaceId": "string",
        "trigger": {
          "id": "string",
          "type": 0
        },
        "tenantId": "string",
        "createdAt": "2018-10-30T07:06:22Z",
        "createdBy": "string",
        "deletedAt": "2018-10-30T07:06:22Z",
        "updatedAt": "2018-10-30T07:06:22Z",
        "disabledCode": "MANUALLY",
        "migratedFrom": "string",
        "orchestration": {
          "id": "string",
          "type": 0,
          "attrs": {}
        }
      },
      "keepActive": false,
      "resourceId": "string",
      "annotations": [
        "string"
      ],
      "description": "string",
      "specVersion": "string"
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
Create a task
Replacement available

For new integrations, and when updating your existing integrations, use:

POST scheduling/tasks

Creates a new task.

Facts
	Rate limit	Special (600 requests per minute)

	Replaced by	
POST scheduling/tasks
Query Parameters
migrateFrom
string

ID of the reload-task to migrate from the old system (optional).

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
POST
/api/v1/tasks
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


await qlik.tasks.createTask(
  {},
  {
    annotations: ['string'],
    description: 'string',
    events: [
      {
        correlation: [
          {
            contextAttributeName: 'id',
            contextAttributeValue: 'string',
          },
        ],
        dataOnly: true,
        name: 'string',
        source: 'system-events.task',
        type: 'com.qlik.v1.task.run.finished',
      },
    ],
    key: 'string',
    metadata: {
      createdBy: 'string',
      disabledCode: 'MANUALLY',
      migratedFrom: 'string',
      orchestration: {
        attrs: {},
        id: 'string',
        type: 0,
      },
      ownerId: 'string',
      spaceId: 'string',
      tenantId: 'string',
      trigger: { id: 'string', type: 0 },
      updatedAt: '2018-10-30T07:06:22Z',
      usage: 'ANALYTICS',
    },
    name: 'string',
    resourceId: 'string',
    specVersion: 'string',
    start: {
      schedule: 'string',
      stateName: 'string',
    },
    states: [
      {
        compensatedBy: 'string',
        end: true,
        exclusive: true,
        name: 'string',
        onEvents: [
          {
            actionMode: 'SEQUENTIAL',
            actions: [
              {
                condition: 'string',
                functionRef: {},
                name: 'string',
                nonRetryableErrors: ['string'],
                retryRef: 'string',
                retryableErrors: ['string'],
              },
            ],
            eventRefs: ['string'],
          },
        ],
        timeouts: {
          actionExecTimeout: 'string',
          eventTimeout: 'string',
          stateExecTimeout: 'string',
        },
        type: 'EVENT',
      },
    ],
    version: 'string',
  },
)
Example Response
{
  "id": "string",
  "key": "string",
  "name": "string",
  "start": {
    "schedule": "string",
    "stateName": "string"
  },
  "events": [
    {
      "name": "string",
      "type": "com.qlik.v1.task.run.finished",
      "source": "system-events.task",
      "dataOnly": true,
      "correlation": [
        {
          "contextAttributeName": "id",
          "contextAttributeValue": "string"
        }
      ]
    }
  ],
  "states": [
    {
      "end": true,
      "name": "string",
      "type": "EVENT",
      "onEvents": [
        {
          "actions": [
            {
              "name": "string",
              "retryRef": "string",
              "condition": "string",
              "functionRef": {},
              "retryableErrors": [
                "string"
              ],
              "nonRetryableErrors": [
                "string"
              ]
            }
          ],
          "eventRefs": [
            "string"
          ],
          "actionMode": "SEQUENTIAL"
        }
      ],
      "timeouts": {
        "eventTimeout": "string",
        "stateExecTimeout": "string",
        "actionExecTimeout": "string"
      },
      "exclusive": true,
      "compensatedBy": "string"
    }
  ],
  "enabled": false,
  "version": "string",
  "metadata": {
    "usage": "ANALYTICS",
    "ownerId": "string",
    "spaceId": "string",
    "trigger": {
      "id": "string",
      "type": 0
    },
    "tenantId": "string",
    "createdAt": "2018-10-30T07:06:22Z",
    "createdBy": "string",
    "deletedAt": "2018-10-30T07:06:22Z",
    "updatedAt": "2018-10-30T07:06:22Z",
    "disabledCode": "MANUALLY",
    "migratedFrom": "string",
    "orchestration": {
      "id": "string",
      "type": 0,
      "attrs": {}
    }
  },
  "keepActive": false,
  "resourceId": "string",
  "annotations": [
    "string"
  ],
  "description": "string",
  "specVersion": "string"
}
Get a task
Replacement available

For new integrations, and when updating your existing integrations, use:

GET scheduling/tasks/{id}

Retrieves details for a specific task.

Facts
	Rate limit	Special (600 requests per minute)

	Replaced by	
GET scheduling/tasks/{id}
Path Parameters
id
string
Required

The task's unique identifier.

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
/api/v1/tasks/{id}
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


await qlik.tasks.getTask('string')
Example Response
{
  "id": "string",
  "key": "string",
  "name": "string",
  "start": {
    "schedule": "string",
    "stateName": "string"
  },
  "events": [
    {
      "name": "string",
      "type": "com.qlik.v1.task.run.finished",
      "source": "system-events.task",
      "dataOnly": true,
      "correlation": [
        {
          "contextAttributeName": "id",
          "contextAttributeValue": "string"
        }
      ]
    }
  ],
  "states": [
    {
      "end": true,
      "name": "string",
      "type": "EVENT",
      "onEvents": [
        {
          "actions": [
            {
              "name": "string",
              "retryRef": "string",
              "condition": "string",
              "functionRef": {},
              "retryableErrors": [
                "string"
              ],
              "nonRetryableErrors": [
                "string"
              ]
            }
          ],
          "eventRefs": [
            "string"
          ],
          "actionMode": "SEQUENTIAL"
        }
      ],
      "timeouts": {
        "eventTimeout": "string",
        "stateExecTimeout": "string",
        "actionExecTimeout": "string"
      },
      "exclusive": true,
      "compensatedBy": "string"
    }
  ],
  "enabled": false,
  "version": "string",
  "metadata": {
    "usage": "ANALYTICS",
    "ownerId": "string",
    "spaceId": "string",
    "trigger": {
      "id": "string",
      "type": 0
    },
    "tenantId": "string",
    "createdAt": "2018-10-30T07:06:22Z",
    "createdBy": "string",
    "deletedAt": "2018-10-30T07:06:22Z",
    "updatedAt": "2018-10-30T07:06:22Z",
    "disabledCode": "MANUALLY",
    "migratedFrom": "string",
    "orchestration": {
      "id": "string",
      "type": 0,
      "attrs": {}
    }
  },
  "keepActive": false,
  "resourceId": "string",
  "annotations": [
    "string"
  ],
  "description": "string",
  "specVersion": "string"
}
Update a task
Replacement available

For new integrations, and when updating your existing integrations, use:

PUT scheduling/tasks/{id}

Updates a specific task. If the task is owned by another user, ownership will be transferred to the requesting user.

Facts
	Rate limit	Special (600 requests per minute)

	Replaced by	
PUT scheduling/tasks/{id}
Path Parameters
id
string
Required

The task's unique identifier.

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
/api/v1/tasks/{id}
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


await qlik.tasks.updateTask('string', {
  annotations: ['string'],
  description: 'string',
  events: [
    {
      correlation: [
        {
          contextAttributeName: 'id',
          contextAttributeValue: 'string',
        },
      ],
      dataOnly: true,
      name: 'string',
      source: 'system-events.task',
      type: 'com.qlik.v1.task.run.finished',
    },
  ],
  key: 'string',
  metadata: {
    createdBy: 'string',
    disabledCode: 'MANUALLY',
    migratedFrom: 'string',
    orchestration: {
      attrs: {},
      id: 'string',
      type: 0,
    },
    ownerId: 'string',
    spaceId: 'string',
    tenantId: 'string',
    trigger: { id: 'string', type: 0 },
    updatedAt: '2018-10-30T07:06:22Z',
    usage: 'ANALYTICS',
  },
  name: 'string',
  resourceId: 'string',
  specVersion: 'string',
  start: {
    schedule: 'string',
    stateName: 'string',
  },
  states: [
    {
      compensatedBy: 'string',
      end: true,
      exclusive: true,
      name: 'string',
      onEvents: [
        {
          actionMode: 'SEQUENTIAL',
          actions: [
            {
              condition: 'string',
              functionRef: {},
              name: 'string',
              nonRetryableErrors: ['string'],
              retryRef: 'string',
              retryableErrors: ['string'],
            },
          ],
          eventRefs: ['string'],
        },
      ],
      timeouts: {
        actionExecTimeout: 'string',
        eventTimeout: 'string',
        stateExecTimeout: 'string',
      },
      type: 'EVENT',
    },
  ],
  version: 'string',
})
Example Response
{
  "id": "string",
  "key": "string",
  "name": "string",
  "start": {
    "schedule": "string",
    "stateName": "string"
  },
  "events": [
    {
      "name": "string",
      "type": "com.qlik.v1.task.run.finished",
      "source": "system-events.task",
      "dataOnly": true,
      "correlation": [
        {
          "contextAttributeName": "id",
          "contextAttributeValue": "string"
        }
      ]
    }
  ],
  "states": [
    {
      "end": true,
      "name": "string",
      "type": "EVENT",
      "onEvents": [
        {
          "actions": [
            {
              "name": "string",
              "retryRef": "string",
              "condition": "string",
              "functionRef": {},
              "retryableErrors": [
                "string"
              ],
              "nonRetryableErrors": [
                "string"
              ]
            }
          ],
          "eventRefs": [
            "string"
          ],
          "actionMode": "SEQUENTIAL"
        }
      ],
      "timeouts": {
        "eventTimeout": "string",
        "stateExecTimeout": "string",
        "actionExecTimeout": "string"
      },
      "exclusive": true,
      "compensatedBy": "string"
    }
  ],
  "enabled": false,
  "version": "string",
  "metadata": {
    "usage": "ANALYTICS",
    "ownerId": "string",
    "spaceId": "string",
    "trigger": {
      "id": "string",
      "type": 0
    },
    "tenantId": "string",
    "createdAt": "2018-10-30T07:06:22Z",
    "createdBy": "string",
    "deletedAt": "2018-10-30T07:06:22Z",
    "updatedAt": "2018-10-30T07:06:22Z",
    "disabledCode": "MANUALLY",
    "migratedFrom": "string",
    "orchestration": {
      "id": "string",
      "type": 0,
      "attrs": {}
    }
  },
  "keepActive": false,
  "resourceId": "string",
  "annotations": [
    "string"
  ],
  "description": "string",
  "specVersion": "string"
}
Delete a task
Replacement available

For new integrations, and when updating your existing integrations, use:

DELETE scheduling/tasks/{id}

Deletes a specific task.

Facts
	Rate limit	Special (600 requests per minute)

	Replaced by	
DELETE scheduling/tasks/{id}
Path Parameters
id
string
Required

The task's unique identifier.

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
/api/v1/tasks/{id}
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


await qlik.tasks.deleteTask('string')
Start a task
Replacement available

For new integrations, and when updating your existing integrations, use:

POST scheduling/tasks/{id}/actions/start

Starts the specified task.

Facts
	Rate limit	Special (600 requests per minute)

	Replaced by	
POST scheduling/tasks/{id}/actions/start
Query Parameters
source
string

Indicates the origin of the trigger. If not provided, defaults to 'manual'. For event-triggered tasks, this can be the name of the triggering task.

default = "manual"

Path Parameters
id
string
Required

The task's unique identifier.

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
POST
/api/v1/tasks/{id}/actions/start
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


await qlik.tasks.startTask('string', {})
Example Response
{
  "message": "Task started successfully"
}
List task runs
Replacement available

For new integrations, and when updating your existing integrations, use:

GET scheduling/tasks/{id}/runs

Returns runs for the specified task.

Facts
	Rate limit	Special (600 requests per minute)

	Replaced by	
GET scheduling/tasks/{id}/runs
Query Parameters
limit
integer

The maximum number of task runs to return for a request.

minimum = 1, maximum = 100, default = 20, default = 20

page
string

The page cursor.

sort
string

The property of a resource to sort on (default sort is -startedAt). A property must be prefixed by + or - to indicate ascending or descending sort order respectively.

Can be one of: "+startedAt""-startedAt""+endedAt""-endedAt""+status""-status""+taskId""-taskId""+actionId""-actionId"

default = "-startedAt"

Path Parameters
id
string
Required

The task's unique identifier.

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
/api/v1/tasks/{id}/runs
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


await qlik.tasks.getTaskRuns('string', {})
Example Response
{
  "data": [
    {
      "id": "string",
      "log": "string",
      "status": "RUNNING",
      "taskId": "string",
      "endedAt": "2018-10-30T07:06:22Z",
      "actionId": "string",
      "taskMeta": {
        "usage": "ANALYTICS",
        "ownerId": "string",
        "spaceId": "string",
        "trigger": {
          "id": "string",
          "type": 0
        },
        "tenantId": "string",
        "createdAt": "2018-10-30T07:06:22Z",
        "createdBy": "string",
        "deletedAt": "2018-10-30T07:06:22Z",
        "updatedAt": "2018-10-30T07:06:22Z",
        "disabledCode": "MANUALLY",
        "migratedFrom": "string",
        "orchestration": {
          "id": "string",
          "type": 0,
          "attrs": {}
        }
      },
      "taskName": "string",
      "workerId": "string",
      "startedAt": "2018-10-30T07:06:22Z",
      "executedAs": "string",
      "resourceId": "string",
      "workerType": "string",
      "triggeredBy": "manual"
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
Get task run log
Replacement available

For new integrations, and when updating your existing integrations, use:

GET scheduling/tasks/{id}/runs/{runId}/log

Get specific run log of a task.

Facts
	Rate limit	Special (600 requests per minute)

	Replaced by	
GET scheduling/tasks/{id}/runs/{runId}/log
Header Parameters
Accept
string

The acceptable content types.

Can be one of: "application/json""text/plain"

default = "application/json"

Path Parameters
id
string
Required

The task's unique identifier.

runId
string
Required

The run's unique identifier.

Responses
200

OK Response

text/plain
object
Show text/plain properties
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
/api/v1/tasks/{id}/runs/{runId}/log
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


await qlik.tasks.getTaskRunLog('string', 'string')
Example Response
[object Object]
Get last task run
Replacement available

For new integrations, and when updating your existing integrations, use:

GET scheduling/tasks/{id}/runs/last

Returns the last run of a specific task.

Facts
	Rate limit	Special (600 requests per minute)

	Replaced by	
GET scheduling/tasks/{id}/runs/last
Path Parameters
id
string
Required

The task's unique identifier.

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
/api/v1/tasks/{id}/runs/last
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


await qlik.tasks.getLastTaskRun('string')
Example Response
{
  "id": "string",
  "log": "string",
  "status": "RUNNING",
  "taskId": "string",
  "endedAt": "2018-10-30T07:06:22Z",
  "actionId": "string",
  "taskMeta": {
    "usage": "ANALYTICS",
    "ownerId": "string",
    "spaceId": "string",
    "trigger": {
      "id": "string",
      "type": 0
    },
    "tenantId": "string",
    "createdAt": "2018-10-30T07:06:22Z",
    "createdBy": "string",
    "deletedAt": "2018-10-30T07:06:22Z",
    "updatedAt": "2018-10-30T07:06:22Z",
    "disabledCode": "MANUALLY",
    "migratedFrom": "string",
    "orchestration": {
      "id": "string",
      "type": 0,
      "attrs": {}
    }
  },
  "taskName": "string",
  "workerId": "string",
  "startedAt": "2018-10-30T07:06:22Z",
  "executedAs": "string",
  "resourceId": "string",
  "workerType": "string",
  "triggeredBy": "manual"
}
List task runs for a resource
Replacement available

For new integrations, and when updating your existing integrations, use:

GET scheduling/tasks/resources/{id}/runs

Returns a list of task runs for a specified resourceId.

Facts
	Rate limit	Special (600 requests per minute)

	Replaced by	
GET scheduling/tasks/resources/{id}/runs
Query Parameters
limit
integer

The maximum number of task runs to return for a request.

minimum = 1, maximum = 100, default = 20, default = 20

page
string

The page cursor.

sort
string

The property of a resource to sort on (default sort is -startedAt). A property must be prefixed by + or - to indicate ascending or descending sort order respectively.

Can be one of: "+startedAt""-startedAt""+endedAt""-endedAt""+status""-status""+taskId""-taskId""+actionId""-actionId"

default = "-startedAt"

Path Parameters
id
string
Required

Filter tasks by its target resource ID

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
/api/v1/tasks/resources/{id}/runs
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


await qlik.tasks.getTasksResourceRuns(
  'string',
  {},
)
Example Response
{
  "data": [
    {
      "id": "string",
      "log": "string",
      "status": "RUNNING",
      "taskId": "string",
      "endedAt": "2018-10-30T07:06:22Z",
      "actionId": "string",
      "taskMeta": {
        "usage": "ANALYTICS",
        "ownerId": "string",
        "spaceId": "string",
        "trigger": {
          "id": "string",
          "type": 0
        },
        "tenantId": "string",
        "createdAt": "2018-10-30T07:06:22Z",
        "createdBy": "string",
        "deletedAt": "2018-10-30T07:06:22Z",
        "updatedAt": "2018-10-30T07:06:22Z",
        "disabledCode": "MANUALLY",
        "migratedFrom": "string",
        "orchestration": {
          "id": "string",
          "type": 0,
          "attrs": {}
        }
      },
      "taskName": "string",
      "workerId": "string",
      "startedAt": "2018-10-30T07:06:22Z",
      "executedAs": "string",
      "resourceId": "string",
      "workerType": "string",
      "triggeredBy": "manual"
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