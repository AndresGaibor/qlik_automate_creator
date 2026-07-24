---
title: "Tasks REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/scheduling/tasks/"
local_path: "docs/endpoints/scheduling-tasks.md"
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
/
scheduling
Copy page
Tasks
Download OpenAPI spec
Endpoints
GET
/api/scheduling/tasks
POST
/api/scheduling/tasks
GET
/api/scheduling/tasks/{id}
PATCH
/api/scheduling/tasks/{id}
PUT
/api/scheduling/tasks/{id}
DELETE
/api/scheduling/tasks/{id}
POST
/api/scheduling/tasks/{id}/actions/start
GET
/api/scheduling/tasks/{id}/graphs/ancestors
GET
/api/scheduling/tasks/{id}/graphs/children
GET
/api/scheduling/tasks/{id}/graphs/descendants
GET
/api/scheduling/tasks/{id}/graphs/parents
GET
/api/scheduling/tasks/{id}/graphs/subgraph
GET
/api/scheduling/tasks/{id}/runs
GET
/api/scheduling/tasks/{id}/runs/{runId}/log
GET
/api/scheduling/tasks/{id}/runs/last
GET
/api/scheduling/tasks/resources/{id}/runs
List tasks

Retrieves a paginated list of tasks the requesting user has access to. Results include task metadata such as owner, resource, space, and last run status. Use the filter parameter to narrow results by field values, or sort to control the ordering.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
	Replaces	
GET v1/tasks
Query Parameters
filter
string

Advanced filter expression using RFC 7644 SCIM syntax. Refer to RFC 7644 for syntax details. All comparisons are case-insensitive. Supported fields: name, enabled, resourceId, ownerId, spaceId, createdAt, updatedAt, updatedBy, lastStatus, lastTriggeredBy, lastStartedAt, lastEndedAt, lastExecutedAs, and triggerType.

limit
integer

Maximum number of tasks to return per page.

minimum = 1, maximum = 100, default = 20, default = 20

page
string

Cursor token for fetching the next page of results.

resourceId
string

The unique identifier of the resource to filter tasks by.

sort
string

Field and direction to sort results by. Prefix the field name with + for ascending or - for descending order. Defaults to -updatedAt.

Can be one of: "+createdAt""-createdAt""+enabled""-enabled""+name""-name""+ownerId""-ownerId""+resourceId""-resourceId""+spaceId""-spaceId""+updatedAt""-updatedAt""+updatedBy""-updatedBy""+lastStatus""-lastStatus""+lastTriggeredBy""-lastTriggeredBy""+lastStartedAt""-lastStartedAt""+lastEndedAt""-lastEndedAt""+lastExecutedAs""-lastExecutedAs""+triggerType""-triggerType"

default = "-updatedAt"

Responses
200

Tasks retrieved successfully.

application/json
object
Show application/json properties
400

The request is malformed or contains invalid parameters.

application/json
object
Show application/json properties
401

Authentication credentials are missing or invalid.

application/json
object
Show application/json properties
403

Access denied. You lack permission to perform this operation.

application/json
object
Show application/json properties
404

The requested resource was not found.

application/json
object
Show application/json properties
500

An unexpected error occurred on the server.

application/json
object
Show application/json properties
503

The service is temporarily unavailable. Retry the request after a short delay.

application/json
object
Show application/json properties
GET
/api/scheduling/tasks
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/scheduling/tasks` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/scheduling/tasks',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "data": [
    {
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "name": "TaskExample",
      "events": [
        {
          "name": "event1",
          "type": "com.qlik/active-analytics-orch",
          "source": "dataset.updated",
          "correlation": [
            {
              "contextAttributeName": "appId",
              "contextAttributeValue": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            }
          ]
        }
      ],
      "states": [
        {
          "end": true,
          "name": "Reload",
          "type": "event",
          "onEvents": [
            {
              "actions": [
                {
                  "name": "app.reload",
                  "functionRef": {
                    "refName": "app.reload",
                    "arguments": {
                      "appId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
                      "partial": false
                    }
                  }
                }
              ],
              "eventRefs": [
                "app1-dataset-updated"
              ]
            }
          ],
          "exclusive": false
        }
      ],
      "enabled": true,
      "version": "1.0.0",
      "metadata": {
        "usage": "ANALYTICS",
        "ownerId": 0,
        "spaceId": "",
        "trigger": {
          "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "type": 4
        },
        "tenantId": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "createdAt": "2025-08-31T23:22:27.929Z",
        "createdBy": 0,
        "updatedAt": "2025-08-31T23:27:51.207Z",
        "orchestration": {
          "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "type": 3,
          "attrs": {
            "last_run_status": "SUCCEEDED",
            "last_run_endedAt": "2025-08-31T23:28:06Z",
            "last_run_startedAt": "2025-08-31T23:28:04Z",
            "last_run_worker_type": "reloads"
          }
        }
      },
      "keepActive": false,
      "resourceId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "description": "this is an example of task response",
      "specVersion": "1.16.0"
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

Creates a new task for the specified resource. The task is owned by the requesting user and is disabled by default until explicitly enabled. The resourceId is derived automatically from the task's state definitions and cannot be set directly in the request body.

Facts
	Rate limit	Tier 2 (100 requests per minute)
	Replaces	
POST v1/tasks
Request Body
Required
application/json
object
Show application/json properties
Responses
201

Task created successfully.

application/json
object
Show application/json properties
400

The request is malformed or contains invalid parameters.

application/json
object
Show application/json properties
401

Authentication credentials are missing or invalid.

application/json
object
Show application/json properties
403

Access denied. You lack permission to perform this operation.

application/json
object
Show application/json properties
404

The requested resource was not found.

application/json
object
Show application/json properties
500

An unexpected error occurred on the server.

application/json
object
Show application/json properties
503

The service is temporarily unavailable. Retry the request after a short delay.

application/json
object
Show application/json properties
POST
/api/scheduling/tasks
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/scheduling/tasks` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/scheduling/tasks',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      name: 'TaskExample',
      events: [
        {
          name: 'event1',
          type: 'com.qlik/active-analytics-orch',
          source: 'dataset.updated',
          correlation: [
            {
              contextAttributeName: 'appId',
              contextAttributeValue:
                'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            },
          ],
        },
      ],
      states: [
        {
          end: true,
          name: 'Reload',
          type: 'event',
          onEvents: [
            {
              actions: [
                {
                  name: 'app.reload',
                  functionRef: {
                    refName: 'app.reload',
                    arguments: {
                      appId:
                        'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
                      partial: false,
                    },
                  },
                },
              ],
              eventRefs: ['app1-dataset-updated'],
            },
          ],
          exclusive: false,
        },
      ],
      enabled: true,
      version: '1.0.0',
      metadata: {
        usage: 'ANALYTICS',
        ownerId: 0,
        spaceId: '',
        trigger: {
          id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
          type: 4,
        },
        tenantId:
          'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        createdAt: '2025-08-31T23:22:27.929Z',
        createdBy: 0,
        updatedAt: '2025-08-31T23:27:51.207Z',
        orchestration: {
          id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
          type: 3,
          attrs: {
            last_run_status: 'SUCCEEDED',
            last_run_endedAt:
              '2025-08-31T23:28:06Z',
            last_run_startedAt:
              '2025-08-31T23:28:04Z',
            last_run_worker_type: 'reloads',
          },
        },
      },
      keepActive: false,
      resourceId:
        'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      description:
        'this is an example of task response',
      specVersion: '1.16.0',
    }),
  },
)
Example Response
{
  "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "name": "TaskExample",
  "events": [
    {
      "name": "event1",
      "type": "com.qlik/active-analytics-orch",
      "source": "dataset.updated",
      "correlation": [
        {
          "contextAttributeName": "appId",
          "contextAttributeValue": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        }
      ]
    }
  ],
  "states": [
    {
      "end": true,
      "name": "Reload",
      "type": "event",
      "onEvents": [
        {
          "actions": [
            {
              "name": "app.reload",
              "functionRef": {
                "refName": "app.reload",
                "arguments": {
                  "appId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
                  "partial": false
                }
              }
            }
          ],
          "eventRefs": [
            "app1-dataset-updated"
          ]
        }
      ],
      "exclusive": false
    }
  ],
  "enabled": true,
  "version": "1.0.0",
  "metadata": {
    "usage": "ANALYTICS",
    "ownerId": 0,
    "spaceId": "",
    "trigger": {
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "type": 4
    },
    "tenantId": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "createdAt": "2025-08-31T23:22:27.929Z",
    "createdBy": 0,
    "updatedAt": "2025-08-31T23:27:51.207Z",
    "orchestration": {
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "type": 3,
      "attrs": {
        "last_run_status": "SUCCEEDED",
        "last_run_endedAt": "2025-08-31T23:28:06Z",
        "last_run_startedAt": "2025-08-31T23:28:04Z",
        "last_run_worker_type": "reloads"
      }
    }
  },
  "keepActive": false,
  "resourceId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "description": "this is an example of task response",
  "specVersion": "1.16.0"
}
Get a task

Retrieves the full definition and metadata for a specific task, including its trigger configuration, state definitions, owner, and last run status. Use this operation to inspect a task before updating or starting it.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
	Replaces	
GET v1/tasks/{id}
Path Parameters
id
string
Required

The unique identifier of the task to retrieve.

Responses
200

Task details retrieved successfully.

application/json
object
Show application/json properties
400

The request is malformed or contains invalid parameters.

application/json
object
Show application/json properties
401

Authentication credentials are missing or invalid.

application/json
object
Show application/json properties
403

Access denied. You lack permission to perform this operation.

application/json
object
Show application/json properties
404

The requested resource was not found.

application/json
object
Show application/json properties
500

An unexpected error occurred on the server.

application/json
object
Show application/json properties
503

The service is temporarily unavailable. Retry the request after a short delay.

application/json
object
Show application/json properties
GET
/api/scheduling/tasks/{id}
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/scheduling/tasks/{id}` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/scheduling/tasks/{id}',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "name": "TaskExample",
  "events": [
    {
      "name": "event1",
      "type": "com.qlik/active-analytics-orch",
      "source": "dataset.updated",
      "correlation": [
        {
          "contextAttributeName": "appId",
          "contextAttributeValue": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        }
      ]
    }
  ],
  "states": [
    {
      "end": true,
      "name": "Reload",
      "type": "event",
      "onEvents": [
        {
          "actions": [
            {
              "name": "app.reload",
              "functionRef": {
                "refName": "app.reload",
                "arguments": {
                  "appId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
                  "partial": false
                }
              }
            }
          ],
          "eventRefs": [
            "app1-dataset-updated"
          ]
        }
      ],
      "exclusive": false
    }
  ],
  "enabled": true,
  "version": "1.0.0",
  "metadata": {
    "usage": "ANALYTICS",
    "ownerId": 0,
    "spaceId": "",
    "trigger": {
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "type": 4
    },
    "tenantId": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "createdAt": "2025-08-31T23:22:27.929Z",
    "createdBy": 0,
    "updatedAt": "2025-08-31T23:27:51.207Z",
    "orchestration": {
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "type": 3,
      "attrs": {
        "last_run_status": "SUCCEEDED",
        "last_run_endedAt": "2025-08-31T23:28:06Z",
        "last_run_startedAt": "2025-08-31T23:28:04Z",
        "last_run_worker_type": "reloads"
      }
    }
  },
  "keepActive": false,
  "resourceId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "description": "this is an example of task response",
  "specVersion": "1.16.0"
}
Patch a task

Partially updates a specific task using a JSON Patch document (RFC 6902). Only the fields included in the patch operations are modified. All other fields remain unchanged. If the task is owned by another user, ownership is transferred to the requesting user.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
id
string
Required

The unique identifier of the task to update.

Request Body
Required
application/json
array of objects

A JSON Patch document as defined by RFC 6902.

Show application/json properties
Responses
200

Task updated successfully.

application/json
object
Show application/json properties
204

Task updated with no content to return.

400

The request is malformed or contains invalid parameters.

application/json
object
Show application/json properties
401

Authentication credentials are missing or invalid.

application/json
object
Show application/json properties
403

Access denied. You lack permission to perform this operation.

application/json
object
Show application/json properties
404

The requested resource was not found.

application/json
object
Show application/json properties
500

An unexpected error occurred on the server.

application/json
object
Show application/json properties
503

The service is temporarily unavailable. Retry the request after a short delay.

application/json
object
Show application/json properties
PATCH
/api/scheduling/tasks/{id}
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `PATCH /api/scheduling/tasks/{id}` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/scheduling/tasks/{id}',
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      {
        op: 'add',
        path: 'string',
        value: 'string',
      },
    ]),
  },
)
Example Response
{
  "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "name": "TaskExample",
  "events": [
    {
      "name": "event1",
      "type": "com.qlik/active-analytics-orch",
      "source": "dataset.updated",
      "correlation": [
        {
          "contextAttributeName": "appId",
          "contextAttributeValue": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        }
      ]
    }
  ],
  "states": [
    {
      "end": true,
      "name": "Reload",
      "type": "event",
      "onEvents": [
        {
          "actions": [
            {
              "name": "app.reload",
              "functionRef": {
                "refName": "app.reload",
                "arguments": {
                  "appId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
                  "partial": false
                }
              }
            }
          ],
          "eventRefs": [
            "app1-dataset-updated"
          ]
        }
      ],
      "exclusive": false
    }
  ],
  "enabled": true,
  "version": "1.0.0",
  "metadata": {
    "usage": "ANALYTICS",
    "ownerId": 0,
    "spaceId": "",
    "trigger": {
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "type": 4
    },
    "tenantId": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "createdAt": "2025-08-31T23:22:27.929Z",
    "createdBy": 0,
    "updatedAt": "2025-08-31T23:27:51.207Z",
    "orchestration": {
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "type": 3,
      "attrs": {
        "last_run_status": "SUCCEEDED",
        "last_run_endedAt": "2025-08-31T23:28:06Z",
        "last_run_startedAt": "2025-08-31T23:28:04Z",
        "last_run_worker_type": "reloads"
      }
    }
  },
  "keepActive": false,
  "resourceId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "description": "this is an example of task response",
  "specVersion": "1.16.0"
}
Replace a task

Replaces the full definition of a specific task with the supplied payload. All fields not included in the request body are reset to their defaults. If the task is owned by another user, ownership is transferred to the requesting user. Use PATCH instead to apply a partial update.

Facts
	Rate limit	Tier 2 (100 requests per minute)
	Replaces	
PUT v1/tasks/{id}
Path Parameters
id
string
Required

The unique identifier of the task to replace.

Request Body
Required
application/json
object
Show application/json properties
Responses
200

Task replaced successfully.

application/json
object
Show application/json properties
400

The request is malformed or contains invalid parameters.

application/json
object
Show application/json properties
401

Authentication credentials are missing or invalid.

application/json
object
Show application/json properties
403

Access denied. You lack permission to perform this operation.

application/json
object
Show application/json properties
404

The requested resource was not found.

application/json
object
Show application/json properties
409

The request conflicts with the current state of the resource.

application/json
object
Show application/json properties
500

An unexpected error occurred on the server.

application/json
object
Show application/json properties
503

The service is temporarily unavailable. Retry the request after a short delay.

application/json
object
Show application/json properties
PUT
/api/scheduling/tasks/{id}
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `PUT /api/scheduling/tasks/{id}` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/scheduling/tasks/{id}',
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      name: 'TaskExample',
      events: [
        {
          name: 'event1',
          type: 'com.qlik/active-analytics-orch',
          source: 'dataset.updated',
          correlation: [
            {
              contextAttributeName: 'appId',
              contextAttributeValue:
                'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            },
          ],
        },
      ],
      states: [
        {
          end: true,
          name: 'Reload',
          type: 'event',
          onEvents: [
            {
              actions: [
                {
                  name: 'app.reload',
                  functionRef: {
                    refName: 'app.reload',
                    arguments: {
                      appId:
                        'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
                      partial: false,
                    },
                  },
                },
              ],
              eventRefs: ['app1-dataset-updated'],
            },
          ],
          exclusive: false,
        },
      ],
      enabled: true,
      version: '1.0.0',
      metadata: {
        usage: 'ANALYTICS',
        ownerId: 0,
        spaceId: '',
        trigger: {
          id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
          type: 4,
        },
        tenantId:
          'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        createdAt: '2025-08-31T23:22:27.929Z',
        createdBy: 0,
        updatedAt: '2025-08-31T23:27:51.207Z',
        orchestration: {
          id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
          type: 3,
          attrs: {
            last_run_status: 'SUCCEEDED',
            last_run_endedAt:
              '2025-08-31T23:28:06Z',
            last_run_startedAt:
              '2025-08-31T23:28:04Z',
            last_run_worker_type: 'reloads',
          },
        },
      },
      keepActive: false,
      resourceId:
        'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      description:
        'this is an example of task response',
      specVersion: '1.16.0',
    }),
  },
)
Example Response
{
  "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "name": "TaskExample",
  "events": [
    {
      "name": "event1",
      "type": "com.qlik/active-analytics-orch",
      "source": "dataset.updated",
      "correlation": [
        {
          "contextAttributeName": "appId",
          "contextAttributeValue": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
        }
      ]
    }
  ],
  "states": [
    {
      "end": true,
      "name": "Reload",
      "type": "event",
      "onEvents": [
        {
          "actions": [
            {
              "name": "app.reload",
              "functionRef": {
                "refName": "app.reload",
                "arguments": {
                  "appId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
                  "partial": false
                }
              }
            }
          ],
          "eventRefs": [
            "app1-dataset-updated"
          ]
        }
      ],
      "exclusive": false
    }
  ],
  "enabled": true,
  "version": "1.0.0",
  "metadata": {
    "usage": "ANALYTICS",
    "ownerId": 0,
    "spaceId": "",
    "trigger": {
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "type": 4
    },
    "tenantId": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "createdAt": "2025-08-31T23:22:27.929Z",
    "createdBy": 0,
    "updatedAt": "2025-08-31T23:27:51.207Z",
    "orchestration": {
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "type": 3,
      "attrs": {
        "last_run_status": "SUCCEEDED",
        "last_run_endedAt": "2025-08-31T23:28:06Z",
        "last_run_startedAt": "2025-08-31T23:28:04Z",
        "last_run_worker_type": "reloads"
      }
    }
  },
  "keepActive": false,
  "resourceId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "description": "this is an example of task response",
  "specVersion": "1.16.0"
}
Delete a task

Deletes a specific task and cancels any scheduled or pending runs associated with it. This action cannot be undone. Tenant admins can delete tasks owned by other users.

Facts
	Rate limit	Tier 2 (100 requests per minute)
	Replaces	
DELETE v1/tasks/{id}
Path Parameters
id
string
Required

The unique identifier of the task to delete.

Responses
204

Task deleted successfully.

400

The request is malformed or contains invalid parameters.

application/json
object
Show application/json properties
401

Authentication credentials are missing or invalid.

application/json
object
Show application/json properties
403

Access denied. You lack permission to perform this operation.

application/json
object
Show application/json properties
404

The requested resource was not found.

application/json
object
Show application/json properties
500

An unexpected error occurred on the server.

application/json
object
Show application/json properties
503

The service is temporarily unavailable. Retry the request after a short delay.

application/json
object
Show application/json properties
DELETE
/api/scheduling/tasks/{id}
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `DELETE /api/scheduling/tasks/{id}` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/scheduling/tasks/{id}',
  {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Start a task

Triggers an immediate run of the specified task outside its normal schedule. The optional source parameter identifies what initiated the run, which is recorded in the run history for auditing purposes.

Facts
	Rate limit	Tier 2 (100 requests per minute)
	Replaces	
POST v1/tasks/{id}/actions/start
Query Parameters
source
string

The origin of the trigger. Defaults to manual. For event-triggered tasks, this can be the name of the triggering task.

default = "manual"

Path Parameters
id
string
Required

The unique identifier of the task to start.

Responses
200

Task started successfully.

application/json
object
Show application/json properties
400

The request is malformed or contains invalid parameters.

application/json
object
Show application/json properties
401

Authentication credentials are missing or invalid.

application/json
object
Show application/json properties
403

Access denied. You lack permission to perform this operation.

application/json
object
Show application/json properties
404

The requested resource was not found.

application/json
object
Show application/json properties
500

An unexpected error occurred on the server.

application/json
object
Show application/json properties
503

The service is temporarily unavailable. Retry the request after a short delay.

application/json
object
Show application/json properties
POST
/api/scheduling/tasks/{id}/actions/start
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/scheduling/tasks/{id}/actions/start` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/scheduling/tasks/{id}/actions/start',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "message": "Task started successfully"
}
Get ancestor graph

Retrieves the ancestor subgraph for a specific task, with the requested task as the root vertex. Traverses parent relationships breadth-first up to the depth specified by level. Use this to understand all upstream dependencies of a task.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
level
integer

Maximum ancestor depth to traverse breadth-first.

minimum = 1, maximum = 100

withTask
boolean

When true, includes the full task document for each accessible vertex in the response.

default = false

Path Parameters
id
string
Required

The unique identifier of the task.

Responses
200

Ancestor graph retrieved successfully.

application/json
object
Show application/json properties
400

The request is malformed or contains invalid parameters.

application/json
object
Show application/json properties
401

Authentication credentials are missing or invalid.

application/json
object
Show application/json properties
403

Access denied. You lack permission to perform this operation.

application/json
object
Show application/json properties
404

The requested resource was not found.

application/json
object
Show application/json properties
500

An unexpected error occurred on the server.

application/json
object
Show application/json properties
503

The service is temporarily unavailable. Retry the request after a short delay.

application/json
object
Show application/json properties
GET
/api/scheduling/tasks/{id}/graphs/ancestors
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/scheduling/tasks/{id}/graphs/ancestors` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/scheduling/tasks/{id}/graphs/ancestors',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "edges": [
    {
      "attrs": {
        "depth": 1
      },
      "source": "22222222-2222-2222-2222-222222222222",
      "target": "11111111-1111-1111-1111-111111111111"
    }
  ],
  "taskId": "11111111-1111-1111-1111-111111111111",
  "vertices": [
    {
      "attrs": {
        "depth": 0,
        "isChild": false,
        "isParent": true
      },
      "taskId": "11111111-1111-1111-1111-111111111111"
    },
    {
      "attrs": {
        "depth": 1,
        "isChild": true,
        "isParent": false
      },
      "taskId": "22222222-2222-2222-2222-222222222222"
    }
  ]
}
List child tasks

Retrieves a paginated list of tasks that are direct children of the specified task in the dependency graph. A child task is one that is triggered when the parent task completes successfully.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
filter
string

Advanced filter expression using RFC 7644 SCIM syntax. Refer to RFC 7644 for syntax details. All comparisons are case-insensitive. Supported fields: name, enabled, resourceId, ownerId, spaceId, createdAt, updatedAt, updatedBy, lastStatus, lastTriggeredBy, lastStartedAt, lastEndedAt, lastExecutedAs, and triggerType.

limit
integer

Maximum number of tasks to return per page.

minimum = 1, maximum = 100, default = 20, default = 20

page
string

Cursor token for fetching the next page of results.

sort
string

Field and direction to sort results by. Prefix the field name with + for ascending or - for descending order. Defaults to -updatedAt.

Can be one of: "+createdAt""-createdAt""+enabled""-enabled""+name""-name""+ownerId""-ownerId""+resourceId""-resourceId""+spaceId""-spaceId""+updatedAt""-updatedAt""+updatedBy""-updatedBy""+lastStatus""-lastStatus""+lastTriggeredBy""-lastTriggeredBy""+lastStartedAt""-lastStartedAt""+lastEndedAt""-lastEndedAt""+lastExecutedAs""-lastExecutedAs""+triggerType""-triggerType"

default = "-updatedAt"

Path Parameters
id
string
Required

The unique identifier of the parent task.

Responses
200

Child tasks retrieved successfully.

application/json
object
Show application/json properties
400

The request is malformed or contains invalid parameters.

application/json
object
Show application/json properties
401

Authentication credentials are missing or invalid.

application/json
object
Show application/json properties
403

Access denied. You lack permission to perform this operation.

application/json
object
Show application/json properties
404

The requested resource was not found.

application/json
object
Show application/json properties
500

An unexpected error occurred on the server.

application/json
object
Show application/json properties
503

The service is temporarily unavailable. Retry the request after a short delay.

application/json
object
Show application/json properties
GET
/api/scheduling/tasks/{id}/graphs/children
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/scheduling/tasks/{id}/graphs/children` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/scheduling/tasks/{id}/graphs/children',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "data": [
    {
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "name": "TaskExample",
      "events": [
        {
          "name": "event1",
          "type": "com.qlik/active-analytics-orch",
          "source": "dataset.updated",
          "correlation": [
            {
              "contextAttributeName": "appId",
              "contextAttributeValue": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            }
          ]
        }
      ],
      "states": [
        {
          "end": true,
          "name": "Reload",
          "type": "event",
          "onEvents": [
            {
              "actions": [
                {
                  "name": "app.reload",
                  "functionRef": {
                    "refName": "app.reload",
                    "arguments": {
                      "appId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
                      "partial": false
                    }
                  }
                }
              ],
              "eventRefs": [
                "app1-dataset-updated"
              ]
            }
          ],
          "exclusive": false
        }
      ],
      "enabled": true,
      "version": "1.0.0",
      "metadata": {
        "usage": "ANALYTICS",
        "ownerId": 0,
        "spaceId": "",
        "trigger": {
          "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "type": 4
        },
        "tenantId": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "createdAt": "2025-08-31T23:22:27.929Z",
        "createdBy": 0,
        "updatedAt": "2025-08-31T23:27:51.207Z",
        "orchestration": {
          "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "type": 3,
          "attrs": {
            "last_run_status": "SUCCEEDED",
            "last_run_endedAt": "2025-08-31T23:28:06Z",
            "last_run_startedAt": "2025-08-31T23:28:04Z",
            "last_run_worker_type": "reloads"
          }
        }
      },
      "keepActive": false,
      "resourceId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "description": "this is an example of task response",
      "specVersion": "1.16.0"
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
Get descendant graph

Retrieves the descendant subgraph for a specific task, with the requested task as the root vertex. Traverses child relationships breadth-first down to the depth specified by level. Use this to identify all downstream tasks that will be triggered when this task completes.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
level
integer

Maximum descendant depth to traverse breadth-first.

minimum = 1, maximum = 100

withTask
boolean

When true, includes the full task document for each accessible vertex in the response.

default = false

Path Parameters
id
string
Required

The unique identifier of the task.

Responses
200

Descendant graph retrieved successfully.

application/json
object
Show application/json properties
400

The request is malformed or contains invalid parameters.

application/json
object
Show application/json properties
401

Authentication credentials are missing or invalid.

application/json
object
Show application/json properties
403

Access denied. You lack permission to perform this operation.

application/json
object
Show application/json properties
404

The requested resource was not found.

application/json
object
Show application/json properties
500

An unexpected error occurred on the server.

application/json
object
Show application/json properties
503

The service is temporarily unavailable. Retry the request after a short delay.

application/json
object
Show application/json properties
GET
/api/scheduling/tasks/{id}/graphs/descendants
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/scheduling/tasks/{id}/graphs/descendants` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/scheduling/tasks/{id}/graphs/descendants',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "edges": [
    {
      "attrs": {
        "depth": 1
      },
      "source": "22222222-2222-2222-2222-222222222222",
      "target": "11111111-1111-1111-1111-111111111111"
    }
  ],
  "taskId": "11111111-1111-1111-1111-111111111111",
  "vertices": [
    {
      "attrs": {
        "depth": 0,
        "isChild": false,
        "isParent": true
      },
      "taskId": "11111111-1111-1111-1111-111111111111"
    },
    {
      "attrs": {
        "depth": 1,
        "isChild": true,
        "isParent": false
      },
      "taskId": "22222222-2222-2222-2222-222222222222"
    }
  ]
}
List parent tasks

Retrieves a paginated list of tasks that are direct parents of the specified task in the dependency graph. A parent task is one whose completion triggers the current task.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
filter
string

Advanced filter expression using RFC 7644 SCIM syntax. Refer to RFC 7644 for syntax details. All comparisons are case-insensitive. Supported fields: name, enabled, resourceId, ownerId, spaceId, createdAt, updatedAt, updatedBy, lastStatus, lastTriggeredBy, lastStartedAt, lastEndedAt, lastExecutedAs, and triggerType.

limit
integer

Maximum number of tasks to return per page.

minimum = 1, maximum = 100, default = 20, default = 20

page
string

Cursor token for fetching the next page of results.

sort
string

Field and direction to sort results by. Prefix the field name with + for ascending or - for descending order. Defaults to -updatedAt.

Can be one of: "+createdAt""-createdAt""+enabled""-enabled""+name""-name""+ownerId""-ownerId""+resourceId""-resourceId""+spaceId""-spaceId""+updatedAt""-updatedAt""+updatedBy""-updatedBy""+lastStatus""-lastStatus""+lastTriggeredBy""-lastTriggeredBy""+lastStartedAt""-lastStartedAt""+lastEndedAt""-lastEndedAt""+lastExecutedAs""-lastExecutedAs""+triggerType""-triggerType"

default = "-updatedAt"

Path Parameters
id
string
Required

The unique identifier of the child task.

Responses
200

Parent tasks retrieved successfully.

application/json
object
Show application/json properties
400

The request is malformed or contains invalid parameters.

application/json
object
Show application/json properties
401

Authentication credentials are missing or invalid.

application/json
object
Show application/json properties
403

Access denied. You lack permission to perform this operation.

application/json
object
Show application/json properties
404

The requested resource was not found.

application/json
object
Show application/json properties
500

An unexpected error occurred on the server.

application/json
object
Show application/json properties
503

The service is temporarily unavailable. Retry the request after a short delay.

application/json
object
Show application/json properties
GET
/api/scheduling/tasks/{id}/graphs/parents
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/scheduling/tasks/{id}/graphs/parents` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/scheduling/tasks/{id}/graphs/parents',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "data": [
    {
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "name": "TaskExample",
      "events": [
        {
          "name": "event1",
          "type": "com.qlik/active-analytics-orch",
          "source": "dataset.updated",
          "correlation": [
            {
              "contextAttributeName": "appId",
              "contextAttributeValue": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            }
          ]
        }
      ],
      "states": [
        {
          "end": true,
          "name": "Reload",
          "type": "event",
          "onEvents": [
            {
              "actions": [
                {
                  "name": "app.reload",
                  "functionRef": {
                    "refName": "app.reload",
                    "arguments": {
                      "appId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
                      "partial": false
                    }
                  }
                }
              ],
              "eventRefs": [
                "app1-dataset-updated"
              ]
            }
          ],
          "exclusive": false
        }
      ],
      "enabled": true,
      "version": "1.0.0",
      "metadata": {
        "usage": "ANALYTICS",
        "ownerId": 0,
        "spaceId": "",
        "trigger": {
          "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "type": 4
        },
        "tenantId": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        "createdAt": "2025-08-31T23:22:27.929Z",
        "createdBy": 0,
        "updatedAt": "2025-08-31T23:27:51.207Z",
        "orchestration": {
          "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          "type": 3,
          "attrs": {
            "last_run_status": "SUCCEEDED",
            "last_run_endedAt": "2025-08-31T23:28:06Z",
            "last_run_startedAt": "2025-08-31T23:28:04Z",
            "last_run_worker_type": "reloads"
          }
        }
      },
      "keepActive": false,
      "resourceId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "description": "this is an example of task response",
      "specVersion": "1.16.0"
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
Get task subgraph

Retrieves the combined ancestor-and-descendant subgraph for a specific task, with the requested task as the root vertex. Traverses both parent and child relationships breadth-first up to the depth specified by level. Use this to see the full dependency context for a task in one request.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
level
integer

Maximum ancestor and descendant depth to traverse breadth-first.

minimum = 1, maximum = 100

withTask
boolean

When true, includes the full task document for each accessible vertex in the response.

default = false

Path Parameters
id
string
Required

The unique identifier of the task.

Responses
200

Task subgraph retrieved successfully.

application/json
object
Show application/json properties
400

The request is malformed or contains invalid parameters.

application/json
object
Show application/json properties
401

Authentication credentials are missing or invalid.

application/json
object
Show application/json properties
403

Access denied. You lack permission to perform this operation.

application/json
object
Show application/json properties
404

The requested resource was not found.

application/json
object
Show application/json properties
500

An unexpected error occurred on the server.

application/json
object
Show application/json properties
503

The service is temporarily unavailable. Retry the request after a short delay.

application/json
object
Show application/json properties
GET
/api/scheduling/tasks/{id}/graphs/subgraph
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/scheduling/tasks/{id}/graphs/subgraph` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/scheduling/tasks/{id}/graphs/subgraph',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "edges": [
    {
      "attrs": {
        "depth": 1
      },
      "source": "22222222-2222-2222-2222-222222222222",
      "target": "11111111-1111-1111-1111-111111111111"
    }
  ],
  "taskId": "11111111-1111-1111-1111-111111111111",
  "vertices": [
    {
      "attrs": {
        "depth": 0,
        "isChild": false,
        "isParent": true
      },
      "taskId": "11111111-1111-1111-1111-111111111111"
    },
    {
      "attrs": {
        "depth": 1,
        "isChild": true,
        "isParent": false
      },
      "taskId": "22222222-2222-2222-2222-222222222222"
    }
  ]
}
List task runs

Retrieves a paginated list of execution runs for the specified task, ordered by most recent run by default. Each run record includes the start and end time, status, and the identity that triggered it.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
	Replaces	
GET v1/tasks/{id}/runs
Query Parameters
limit
integer

Maximum number of task runs to return per page.

minimum = 1, maximum = 100, default = 20, default = 20

page
string

Cursor token for fetching the next page of results.

sort
string

Field and direction to sort results by. Prefix the field name with + for ascending or - for descending order. Defaults to -startedAt.

Can be one of: "+startedAt""-startedAt""+endedAt""-endedAt""+status""-status""+taskId""-taskId""+actionId""-actionId"

default = "-startedAt"

Path Parameters
id
string
Required

The unique identifier of the task.

Responses
200

Task runs retrieved successfully.

application/json
object
Show application/json properties
400

The request is malformed or contains invalid parameters.

application/json
object
Show application/json properties
401

Authentication credentials are missing or invalid.

application/json
object
Show application/json properties
403

Access denied. You lack permission to perform this operation.

application/json
object
Show application/json properties
404

The requested resource was not found.

application/json
object
Show application/json properties
500

An unexpected error occurred on the server.

application/json
object
Show application/json properties
503

The service is temporarily unavailable. Retry the request after a short delay.

application/json
object
Show application/json properties
GET
/api/scheduling/tasks/{id}/runs
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/scheduling/tasks/{id}/runs` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/scheduling/tasks/{id}/runs',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "data": [
    {
      "id": "0c42b269-51d4-453a-a8ea-55734d209aa9",
      "status": "SUCCEEDED",
      "endedAt": "2018-03-20T09:12:28Z",
      "workerId": "550e8400-e29b-41d4-a716-446655440000",
      "startedAt": "2018-03-20T09:12:28Z",
      "executedAs": "z1w_5hWRq-wIxXON_slIRrsF0YxpYjA",
      "workerType": "reloads",
      "triggeredBy": "manual",
      "log": "string",
      "taskId": "string",
      "actionId": "string",
      "taskMeta": {
        "usage": "ANALYTICS",
        "ownerId": "z1w_5hWRq-wIxXON_slIRrsF0YxpYjA",
        "spaceId": "434f9f7c-4eeb-43f0-8f08-88b91f357c07",
        "trigger": {
          "id": "0c42b269-51d4-453a-a8ea-55734d209aa9",
          "type": 1
        },
        "tenantId": "rpxzti_ptV0RS4eGPSsaI0SCKl-6h2a",
        "topology": {
          "isChild": false,
          "isParent": true
        },
        "createdAt": "2018-03-20T09:12:28Z",
        "createdBy": "LP_LlaXYhUUWMr5csy8pFfTHecXePH5Z",
        "deletedAt": "2018-03-20T09:12:28Z",
        "spaceType": "shared",
        "updatedAt": "2018-03-20T09:12:28Z",
        "disabledCode": "MANUALLY",
        "migratedFrom": "c7dba73-dd5a-4725-9dd2-8bd9c8d126d7",
        "resourceName": "sample app",
        "resourceType": "app",
        "orchestration": {
          "id": "0c42b269-51d4-453a-a8ea-55734d209aa9",
          "type": 3,
          "attrs": {
            "last_run_status": "SUCCEEDED",
            "last_run_worker_type": "reloads"
          },
          "lastRun": {
            "id": "0c42b269-51d4-453a-a8ea-55734d209aa9",
            "status": "SUCCEEDED",
            "endedAt": "2018-03-20T09:12:28Z",
            "workerId": "550e8400-e29b-41d4-a716-446655440000",
            "startedAt": "2018-03-20T09:12:28Z",
            "executedAs": "z1w_5hWRq-wIxXON_slIRrsF0YxpYjA",
            "workerType": "reloads",
            "triggeredBy": "manual"
          }
        },
        "scriptOwnerId": "z1w_5hWRq-wIxXON_slIRrsF0YxpYjA",
        "resourceSubType": "script"
      },
      "taskName": "string",
      "resourceId": "string"
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

Retrieves the execution log for a specific task run. Set the Accept header to text/plain to receive the raw log as a downloadable file, or application/json (default) to receive it wrapped in a JSON object with a logContent field.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
	Replaces	
GET v1/tasks/{id}/runs/{runId}/log
Header Parameters
Accept
string

The preferred response format for the log content.

Can be one of: "application/json""text/plain"

default = "application/json"

Path Parameters
id
string
Required

The unique identifier of the task.

runId
string
Required

The unique identifier of the task run.

Responses
200

Task run log retrieved successfully.

text/plain
object
Show text/plain properties
200

Task run log retrieved successfully.

application/json
object
Show application/json properties
400

The request is malformed or contains invalid parameters.

application/json
object
Show application/json properties
401

Authentication credentials are missing or invalid.

application/json
object
Show application/json properties
403

Access denied. You lack permission to perform this operation.

application/json
object
Show application/json properties
404

The requested resource was not found.

application/json
object
Show application/json properties
500

An unexpected error occurred on the server.

application/json
object
Show application/json properties
503

The service is temporarily unavailable. Retry the request after a short delay.

application/json
object
Show application/json properties
GET
/api/scheduling/tasks/{id}/runs/{runId}/log
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/scheduling/tasks/{id}/runs/{runId}/log` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/scheduling/tasks/{id}/runs/{runId}/log',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
[object Object]
Get last task run

Retrieves the most recent execution run for the specified task. Returns a 404 response if the task has never been run. Use this operation to quickly check whether the last run succeeded or failed without paginating through the full run history.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
	Replaces	
GET v1/tasks/{id}/runs/last
Path Parameters
id
string
Required

The unique identifier of the task.

Responses
200

Last task run retrieved successfully.

application/json
object
Show application/json properties
400

The request is malformed or contains invalid parameters.

application/json
object
Show application/json properties
401

Authentication credentials are missing or invalid.

application/json
object
Show application/json properties
403

Access denied. You lack permission to perform this operation.

application/json
object
Show application/json properties
404

The requested resource was not found.

application/json
object
Show application/json properties
500

An unexpected error occurred on the server.

application/json
object
Show application/json properties
503

The service is temporarily unavailable. Retry the request after a short delay.

application/json
object
Show application/json properties
GET
/api/scheduling/tasks/{id}/runs/last
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/scheduling/tasks/{id}/runs/last` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/scheduling/tasks/{id}/runs/last',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "id": "0c42b269-51d4-453a-a8ea-55734d209aa9",
  "status": "SUCCEEDED",
  "endedAt": "2018-03-20T09:12:28Z",
  "workerId": "550e8400-e29b-41d4-a716-446655440000",
  "startedAt": "2018-03-20T09:12:28Z",
  "executedAs": "z1w_5hWRq-wIxXON_slIRrsF0YxpYjA",
  "workerType": "reloads",
  "triggeredBy": "manual",
  "log": "string",
  "taskId": "string",
  "actionId": "string",
  "taskMeta": {
    "usage": "ANALYTICS",
    "ownerId": "z1w_5hWRq-wIxXON_slIRrsF0YxpYjA",
    "spaceId": "434f9f7c-4eeb-43f0-8f08-88b91f357c07",
    "trigger": {
      "id": "0c42b269-51d4-453a-a8ea-55734d209aa9",
      "type": 1
    },
    "tenantId": "rpxzti_ptV0RS4eGPSsaI0SCKl-6h2a",
    "topology": {
      "isChild": false,
      "isParent": true
    },
    "createdAt": "2018-03-20T09:12:28Z",
    "createdBy": "LP_LlaXYhUUWMr5csy8pFfTHecXePH5Z",
    "deletedAt": "2018-03-20T09:12:28Z",
    "spaceType": "shared",
    "updatedAt": "2018-03-20T09:12:28Z",
    "disabledCode": "MANUALLY",
    "migratedFrom": "c7dba73-dd5a-4725-9dd2-8bd9c8d126d7",
    "resourceName": "sample app",
    "resourceType": "app",
    "orchestration": {
      "id": "0c42b269-51d4-453a-a8ea-55734d209aa9",
      "type": 3,
      "attrs": {
        "last_run_status": "SUCCEEDED",
        "last_run_worker_type": "reloads"
      },
      "lastRun": {
        "id": "0c42b269-51d4-453a-a8ea-55734d209aa9",
        "status": "SUCCEEDED",
        "endedAt": "2018-03-20T09:12:28Z",
        "workerId": "550e8400-e29b-41d4-a716-446655440000",
        "startedAt": "2018-03-20T09:12:28Z",
        "executedAs": "z1w_5hWRq-wIxXON_slIRrsF0YxpYjA",
        "workerType": "reloads",
        "triggeredBy": "manual"
      }
    },
    "scriptOwnerId": "z1w_5hWRq-wIxXON_slIRrsF0YxpYjA",
    "resourceSubType": "script"
  },
  "taskName": "string",
  "resourceId": "string"
}
List task runs for a resource

Retrieves a paginated list of task runs for a given resource, identified by id. Returns run history across all tasks associated with that resource, ordered by the most recent run by default.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
	Replaces	
GET v1/tasks/resources/{id}/runs
Query Parameters
limit
integer

Maximum number of task runs to return per page.

minimum = 1, maximum = 100, default = 20, default = 20

page
string

Cursor token for fetching the next page of results.

sort
string

Field and direction to sort results by. Prefix the field name with + for ascending or - for descending order. Defaults to -startedAt.

Can be one of: "+startedAt""-startedAt""+endedAt""-endedAt""+status""-status""+taskId""-taskId""+actionId""-actionId"

default = "-startedAt"

Path Parameters
id
string
Required

The unique identifier of the resource to retrieve task runs for.

Responses
200

Task runs retrieved successfully.

application/json
object
Show application/json properties
400

The request is malformed or contains invalid parameters.

application/json
object
Show application/json properties
401

Authentication credentials are missing or invalid.

application/json
object
Show application/json properties
403

Access denied. You lack permission to perform this operation.

application/json
object
Show application/json properties
404

The requested resource was not found.

application/json
object
Show application/json properties
500

An unexpected error occurred on the server.

application/json
object
Show application/json properties
503

The service is temporarily unavailable. Retry the request after a short delay.

application/json
object
Show application/json properties
GET
/api/scheduling/tasks/resources/{id}/runs
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/scheduling/tasks/resources/{id}/runs` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/scheduling/tasks/resources/{id}/runs',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "data": [
    {
      "id": "0c42b269-51d4-453a-a8ea-55734d209aa9",
      "status": "SUCCEEDED",
      "endedAt": "2018-03-20T09:12:28Z",
      "workerId": "550e8400-e29b-41d4-a716-446655440000",
      "startedAt": "2018-03-20T09:12:28Z",
      "executedAs": "z1w_5hWRq-wIxXON_slIRrsF0YxpYjA",
      "workerType": "reloads",
      "triggeredBy": "manual",
      "log": "string",
      "taskId": "string",
      "actionId": "string",
      "taskMeta": {
        "usage": "ANALYTICS",
        "ownerId": "z1w_5hWRq-wIxXON_slIRrsF0YxpYjA",
        "spaceId": "434f9f7c-4eeb-43f0-8f08-88b91f357c07",
        "trigger": {
          "id": "0c42b269-51d4-453a-a8ea-55734d209aa9",
          "type": 1
        },
        "tenantId": "rpxzti_ptV0RS4eGPSsaI0SCKl-6h2a",
        "topology": {
          "isChild": false,
          "isParent": true
        },
        "createdAt": "2018-03-20T09:12:28Z",
        "createdBy": "LP_LlaXYhUUWMr5csy8pFfTHecXePH5Z",
        "deletedAt": "2018-03-20T09:12:28Z",
        "spaceType": "shared",
        "updatedAt": "2018-03-20T09:12:28Z",
        "disabledCode": "MANUALLY",
        "migratedFrom": "c7dba73-dd5a-4725-9dd2-8bd9c8d126d7",
        "resourceName": "sample app",
        "resourceType": "app",
        "orchestration": {
          "id": "0c42b269-51d4-453a-a8ea-55734d209aa9",
          "type": 3,
          "attrs": {
            "last_run_status": "SUCCEEDED",
            "last_run_worker_type": "reloads"
          },
          "lastRun": {
            "id": "0c42b269-51d4-453a-a8ea-55734d209aa9",
            "status": "SUCCEEDED",
            "endedAt": "2018-03-20T09:12:28Z",
            "workerId": "550e8400-e29b-41d4-a716-446655440000",
            "startedAt": "2018-03-20T09:12:28Z",
            "executedAs": "z1w_5hWRq-wIxXON_slIRrsF0YxpYjA",
            "workerType": "reloads",
            "triggeredBy": "manual"
          }
        },
        "scriptOwnerId": "z1w_5hWRq-wIxXON_slIRrsF0YxpYjA",
        "resourceSubType": "script"
      },
      "taskName": "string",
      "resourceId": "string"
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