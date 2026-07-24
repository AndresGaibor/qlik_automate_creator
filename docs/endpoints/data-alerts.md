---
title: "Data alerts REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/data-alerts/"
local_path: "docs/endpoints/data-alerts.md"
---

Title: Data alerts REST | Qlik Developer Portal


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
Data alerts

Supports chart sharing, chart monitoring and alerting features. The legacy sharing APIs refer to chart sharing and chart monitoring, which is a feature that allows the user to send an e-mail with an embedded chart either manually (chart sharing) or in a recurring manner (chart monitoring). It also stores the history related to these actions. The alerting/ data-alerts APIs support the alerting feature, where a user is able to create alerts that trigger notifications in case a condition in the dataset of an app is fulfilled.

Download OpenAPI spec
Endpoints
GET
/api/v1/data-alerts
POST
/api/v1/data-alerts
GET
/api/v1/data-alerts/{alertId}
PATCH
/api/v1/data-alerts/{alertId}
DELETE
/api/v1/data-alerts/{alertId}
GET
/api/v1/data-alerts/{alertId}/condition
GET
/api/v1/data-alerts/{alertId}/executions/{executionId}
DELETE
/api/v1/data-alerts/{alertId}/executions/{executionId}
GET
/api/v1/data-alerts/{alertId}/recipient-stats
GET
/api/v1/data-alerts/{taskId}/executions
GET
/api/v1/data-alerts/{taskId}/executions/{executionId}/evaluations
GET
/api/v1/data-alerts/{taskId}/executions/stats
POST
/api/v1/data-alerts/actions/trigger
POST
/api/v1/data-alerts/actions/validate
GET
/api/v1/data-alerts/settings
PUT
/api/v1/data-alerts/settings
List data alert tasks

Retrieves all data alert tasks accessible to the user. Users assigned the TenantAdmin or AnalyticsAdmin role can view all tasks.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
appID
string

The app ID you would like to filter by

conditionId
string

The conditionId you would like to filter by

limit
integer

Limit the returned result set

minimum = 1, maximum = 100, default = 20, default = 20

next
string

The cursor to the next page of data. Only one of next or previous may be specified.

offset
integer

Offset for finding a list of entities - used for pagination

minimum = 0, default = 0, default = 0

ownerId
string

The id of the owner you would like to filter by

ownerName
string

The name of the owner you would like to filter by

prev
string

The cursor to the previous page of data. Only one of next or previous may be specified.

role
array of strings

The role you would like to filter by

Values may be any of: "owner""recipient""notowner"

sort
array of strings

Sort the returned result set by the specified field

Values may be any of: "-datecreated""datecreated""+datecreated""-ownername""ownername""+ownername""lasttrigger""-lasttrigger""+lasttrigger""lastscan""-lastscan""+lastscan""name""-name""+name""enabled""-enabled""+enabled""status""-status""+status""nextexecutiontime""-nextexecutiontime""+nextexecutiontime"

status
array of strings

The status you would like to filter by

Values may be any of: "INVALID_RECIPIENT""INVALID_OWNER""DISABLED""VALID"

Responses
200

The alerting tasks list has been successfully returned.

application/json
object

properties that should be added to every list response

Show application/json properties
400

Bad request, malformed syntax or errors in parameters.

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
/api/v1/data-alerts
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


await qlik.dataAlerts.getDataAlerts({})
Example Response
{
  "totalCount": 42,
  "currentPageCount": 42,
  "links": {
    "next": {
      "href": "http://localhost:8787/v1/items?limit=12",
      "type": "next",
      "token": "JwAAAAJfaWQAGQAAADVjZjUwM2NjMjVkYzlhMTM1MzYwZTVjZAAA"
    },
    "prev": {
      "href": "http://localhost:8787/v1/items?limit=12",
      "type": "next",
      "token": "JwAAAAJfaWQAGQAAADVjZjUwM2NjMjVkYzlhMTM1MzYwZTVjZAAA"
    },
    "self": {
      "href": "http://localhost:8787/v1/items/5da5825325dc9a0dd0260af9"
    }
  },
  "tasks": [
    {
      "id": "5da5825325dc9a0dd0260af9",
      "name": "string",
      "appId": "string",
      "links": {
        "self": {
          "href": "http://localhost:8787/v1/items/5da5825325dc9a0dd0260af9"
        }
      },
      "status": "creating",
      "enabled": true,
      "ownerId": "string",
      "sheetId": "string",
      "lastScan": "string",
      "tenantId": "string",
      "ownerName": "string",
      "accessMode": "SOURCE_ACCESS",
      "bookmarkId": "string",
      "recipients": {
        "DLUsers": [],
        "userIds": [
          {
            "value": "1b263bs8m0mm_s21s3f",
            "groups": [
              "addedIndividually",
              "group1",
              "group2"
            ],
            "enabled": true,
            "subscribed": true,
            "taskRecipientErrors": [
              {
                "value": "USER_IS_DELETED",
                "timestamp": "2019-10-15T16:07:01.492Z"
              }
            ],
            "alertingTaskRecipientErrors": [
              {
                "added": "2019-10-15T16:07:01.492Z",
                "value": "USER_IS_DELETED"
              }
            ]
          }
        ],
        "DLGroups": [],
        "DLListId": "string",
        "groupIds": [
          {
            "value": "group1",
            "enabled": true,
            "taskGroupRecipientErrors": [
              {
                "value": "GROUP_IS_DISABLED",
                "timestamp": "2019-10-15T16:07:01.492Z"
              }
            ],
            "alertingTaskGroupRecipientErrors": [
              {
                "added": "2019-10-15T16:07:01.492Z",
                "value": "GROUP_IS_DISABLED"
              }
            ]
          }
        ]
      },
      "throttling": {
        "capacity": 42,
        "timezone": "Etc/UTC",
        "replenishRate": 42,
        "recurrenceRule": "string",
        "initialTokenCount": 42,
        "referenceTimestamp": "string"
      },
      "conditionId": "string",
      "dateCreated": "2019-10-15T16:07:01.492Z",
      "description": "string",
      "errorStatus": "OK",
      "lastTrigger": "string",
      "lastUpdated": "2019-10-15T16:07:01.492Z",
      "triggerType": "RELOAD",
      "triggerStats": {
        "totalScans": 100,
        "last10Scans": 10,
        "last100Scans": 100
      },
      "hideSelections": true,
      "evaluationCount": 42,
      "scheduleOptions": {
        "timezone": "Canada/Pacific",
        "recurrence": [
          "RRULE:FREQ=HOURLY;INTERVAL=2"
        ],
        "endDateTime": "",
        "chronosJobID": "string",
        "startDateTime": "2006-01-02T16:04:05",
        "lastExecutionTime": "2020-11-20T12:00:55.000Z",
        "nextExecutionTime": "2020-11-20T12:00:55.000Z"
      },
      "subscriptionIds": [
        "string"
      ],
      "absoluteLastScan": "string",
      "conditionResponse": {},
      "alertingTaskErrors": [
        {
          "added": "2019-10-15T16:07:01.492Z",
          "value": "OWNER_DISABLED"
        }
      ],
      "absoluteLastTrigger": "string",
      "hasHistoryCondition": true,
      "lastExecutionStatus": "OK",
      "recipientsChangeHistory": [
        {
          "dateTime": "string",
          "patchAction": [
            {
              "op": "add",
              "value": {
                "value": "recipient-1",
                "enabled": true
              },
              "recipientType": "userid"
            },
            {
              "op": "remove",
              "value": "I6mWVd60wRWIbOXZr1ZKV8QTnxhnitb",
              "recipientType": "userid"
            },
            {
              "op": "enable",
              "value": "I6mWVd60wRWIbOXZr1ZKV8QTnxhnitb",
              "recipientType": "userid"
            },
            {
              "op": "disable",
              "value": "I6mWVd60wRWIbOXZr1ZKV8QTnxhnitb",
              "recipientType": "userid"
            },
            {
              "op": "replace",
              "value": [
                {
                  "value": "recipient-1",
                  "enabled": true
                },
                {
                  "value": "recipient-2",
                  "enabled": false
                }
              ],
              "recipientType": "userid"
            }
          ]
        }
      ],
      "lastEvaluationCountUpdate": "string"
    }
  ]
}
Create data alert task

Creates a new data alerting task.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
Required

The alerting task create request definition.

application/json
object

a alerting task (a definition on an alert)

Show application/json properties
Responses
202

Alert creation has been accepted. The alerting task will have status creating, until status is set to either valid or invalid.

application/json
object
Show application/json properties
400

Bad request, malformed syntax or errors in parameters.

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
/api/v1/data-alerts
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


await qlik.dataAlerts.createDataAlert({
  appId: 'string',
  bookmarkId: 'string',
  conditionId: 'string',
  description: 'string',
  enabled: true,
  name: 'string',
  recipients: {
    DLListId: 'string',
    groupIds: [
      {
        alertingTaskGroupRecipientErrors: [
          {
            added: '2019-10-15T16:07:01.492Z',
            value: 'GROUP_IS_DISABLED',
          },
        ],
        enabled: true,
        taskGroupRecipientErrors: [
          {
            timestamp: '2019-10-15T16:07:01.492Z',
            value: 'GROUP_IS_DISABLED',
          },
        ],
        value: 'group1',
      },
    ],
    userIds: [
      {
        alertingTaskRecipientErrors: [
          {
            added: '2019-10-15T16:07:01.492Z',
            value: 'USER_IS_DELETED',
          },
        ],
        enabled: true,
        groups: [
          'addedIndividually',


          'group1',


          'group2',
        ],
        subscribed: true,
        taskRecipientErrors: [
          {
            timestamp: '2019-10-15T16:07:01.492Z',
            value: 'USER_IS_DELETED',
          },
        ],
        value: '1b263bs8m0mm_s21s3f',
      },
    ],
  },
  scheduleOptions: {
    recurrence: ['RRULE:FREQ=HOURLY;INTERVAL=2'],
    startDateTime: '2006-01-02T16:04:05',
    timezone: 'Canada/Pacific',
  },
  sheetId: 'string',
  throttling: {
    capacity: 42,
    initialTokenCount: 42,
    recurrenceRule: 'string',
    referenceTimestamp: 'string',
    replenishRate: 42,
    timezone: 'Etc/UTC',
  },
  triggerType: 'RELOAD',
})
Example Response
{
  "id": "5da5825325dc9a0dd0260af9",
  "name": "string",
  "appId": "string",
  "links": {
    "self": {
      "href": "http://localhost:8787/v1/items/5da5825325dc9a0dd0260af9"
    }
  },
  "status": "creating",
  "enabled": true,
  "ownerId": "string",
  "sheetId": "string",
  "lastScan": "string",
  "tenantId": "string",
  "ownerName": "string",
  "accessMode": "SOURCE_ACCESS",
  "bookmarkId": "string",
  "recipients": {
    "DLUsers": [],
    "userIds": [
      {
        "value": "1b263bs8m0mm_s21s3f",
        "groups": [
          "addedIndividually",
          "group1",
          "group2"
        ],
        "enabled": true,
        "subscribed": true,
        "taskRecipientErrors": [
          {
            "value": "USER_IS_DELETED",
            "timestamp": "2019-10-15T16:07:01.492Z"
          }
        ],
        "alertingTaskRecipientErrors": [
          {
            "added": "2019-10-15T16:07:01.492Z",
            "value": "USER_IS_DELETED"
          }
        ]
      }
    ],
    "DLGroups": [],
    "DLListId": "string",
    "groupIds": [
      {
        "value": "group1",
        "enabled": true,
        "taskGroupRecipientErrors": [
          {
            "value": "GROUP_IS_DISABLED",
            "timestamp": "2019-10-15T16:07:01.492Z"
          }
        ],
        "alertingTaskGroupRecipientErrors": [
          {
            "added": "2019-10-15T16:07:01.492Z",
            "value": "GROUP_IS_DISABLED"
          }
        ]
      }
    ]
  },
  "throttling": {
    "capacity": 42,
    "timezone": "Etc/UTC",
    "replenishRate": 42,
    "recurrenceRule": "string",
    "initialTokenCount": 42,
    "referenceTimestamp": "string"
  },
  "conditionId": "string",
  "dateCreated": "2019-10-15T16:07:01.492Z",
  "description": "string",
  "errorStatus": "OK",
  "lastTrigger": "string",
  "lastUpdated": "2019-10-15T16:07:01.492Z",
  "triggerType": "RELOAD",
  "triggerStats": {
    "totalScans": 100,
    "last10Scans": 10,
    "last100Scans": 100
  },
  "hideSelections": true,
  "evaluationCount": 42,
  "scheduleOptions": {
    "timezone": "Canada/Pacific",
    "recurrence": [
      "RRULE:FREQ=HOURLY;INTERVAL=2"
    ],
    "endDateTime": "",
    "chronosJobID": "string",
    "startDateTime": "2006-01-02T16:04:05",
    "lastExecutionTime": "2020-11-20T12:00:55.000Z",
    "nextExecutionTime": "2020-11-20T12:00:55.000Z"
  },
  "subscriptionIds": [
    "string"
  ],
  "absoluteLastScan": "string",
  "conditionResponse": {},
  "alertingTaskErrors": [
    {
      "added": "2019-10-15T16:07:01.492Z",
      "value": "OWNER_DISABLED"
    }
  ],
  "absoluteLastTrigger": "string",
  "hasHistoryCondition": true,
  "lastExecutionStatus": "OK",
  "recipientsChangeHistory": [
    {
      "dateTime": "string",
      "patchAction": [
        {
          "op": "add",
          "value": {
            "value": "recipient-1",
            "enabled": true
          },
          "recipientType": "userid"
        },
        {
          "op": "remove",
          "value": "I6mWVd60wRWIbOXZr1ZKV8QTnxhnitb",
          "recipientType": "userid"
        },
        {
          "op": "enable",
          "value": "I6mWVd60wRWIbOXZr1ZKV8QTnxhnitb",
          "recipientType": "userid"
        },
        {
          "op": "disable",
          "value": "I6mWVd60wRWIbOXZr1ZKV8QTnxhnitb",
          "recipientType": "userid"
        },
        {
          "op": "replace",
          "value": [
            {
              "value": "recipient-1",
              "enabled": true
            },
            {
              "value": "recipient-2",
              "enabled": false
            }
          ],
          "recipientType": "userid"
        }
      ]
    }
  ],
  "lastEvaluationCountUpdate": "string"
}
Get data alert task

Returns the details of a specific data alert task.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
alertId
string
Required

The alerting task identifier.

Responses
200

Alert has been successfully returned.

application/json
object
Show application/json properties
400

Bad request, malformed syntax or errors in parameters.

application/json
object
Show application/json properties
404

Task or execution not found.

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
/api/v1/data-alerts/{alertId}
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


await qlik.dataAlerts.getDataAlert('string')
Example Response
{
  "id": "5da5825325dc9a0dd0260af9",
  "name": "string",
  "appId": "string",
  "links": {
    "self": {
      "href": "http://localhost:8787/v1/items/5da5825325dc9a0dd0260af9"
    }
  },
  "status": "creating",
  "enabled": true,
  "ownerId": "string",
  "sheetId": "string",
  "lastScan": "string",
  "tenantId": "string",
  "ownerName": "string",
  "accessMode": "SOURCE_ACCESS",
  "bookmarkId": "string",
  "recipients": {
    "DLUsers": [],
    "userIds": [
      {
        "value": "1b263bs8m0mm_s21s3f",
        "groups": [
          "addedIndividually",
          "group1",
          "group2"
        ],
        "enabled": true,
        "subscribed": true,
        "taskRecipientErrors": [
          {
            "value": "USER_IS_DELETED",
            "timestamp": "2019-10-15T16:07:01.492Z"
          }
        ],
        "alertingTaskRecipientErrors": [
          {
            "added": "2019-10-15T16:07:01.492Z",
            "value": "USER_IS_DELETED"
          }
        ]
      }
    ],
    "DLGroups": [],
    "DLListId": "string",
    "groupIds": [
      {
        "value": "group1",
        "enabled": true,
        "taskGroupRecipientErrors": [
          {
            "value": "GROUP_IS_DISABLED",
            "timestamp": "2019-10-15T16:07:01.492Z"
          }
        ],
        "alertingTaskGroupRecipientErrors": [
          {
            "added": "2019-10-15T16:07:01.492Z",
            "value": "GROUP_IS_DISABLED"
          }
        ]
      }
    ]
  },
  "throttling": {
    "capacity": 42,
    "timezone": "Etc/UTC",
    "replenishRate": 42,
    "recurrenceRule": "string",
    "initialTokenCount": 42,
    "referenceTimestamp": "string"
  },
  "conditionId": "string",
  "dateCreated": "2019-10-15T16:07:01.492Z",
  "description": "string",
  "errorStatus": "OK",
  "lastTrigger": "string",
  "lastUpdated": "2019-10-15T16:07:01.492Z",
  "triggerType": "RELOAD",
  "triggerStats": {
    "totalScans": 100,
    "last10Scans": 10,
    "last100Scans": 100
  },
  "hideSelections": true,
  "evaluationCount": 42,
  "scheduleOptions": {
    "timezone": "Canada/Pacific",
    "recurrence": [
      "RRULE:FREQ=HOURLY;INTERVAL=2"
    ],
    "endDateTime": "",
    "chronosJobID": "string",
    "startDateTime": "2006-01-02T16:04:05",
    "lastExecutionTime": "2020-11-20T12:00:55.000Z",
    "nextExecutionTime": "2020-11-20T12:00:55.000Z"
  },
  "subscriptionIds": [
    "string"
  ],
  "absoluteLastScan": "string",
  "conditionResponse": {},
  "alertingTaskErrors": [
    {
      "added": "2019-10-15T16:07:01.492Z",
      "value": "OWNER_DISABLED"
    }
  ],
  "absoluteLastTrigger": "string",
  "hasHistoryCondition": true,
  "lastExecutionStatus": "OK",
  "recipientsChangeHistory": [
    {
      "dateTime": "string",
      "patchAction": [
        {
          "op": "add",
          "value": {
            "value": "recipient-1",
            "enabled": true
          },
          "recipientType": "userid"
        },
        {
          "op": "remove",
          "value": "I6mWVd60wRWIbOXZr1ZKV8QTnxhnitb",
          "recipientType": "userid"
        },
        {
          "op": "enable",
          "value": "I6mWVd60wRWIbOXZr1ZKV8QTnxhnitb",
          "recipientType": "userid"
        },
        {
          "op": "disable",
          "value": "I6mWVd60wRWIbOXZr1ZKV8QTnxhnitb",
          "recipientType": "userid"
        },
        {
          "op": "replace",
          "value": [
            {
              "value": "recipient-1",
              "enabled": true
            },
            {
              "value": "recipient-2",
              "enabled": false
            }
          ],
          "recipientType": "userid"
        }
      ]
    }
  ],
  "lastEvaluationCountUpdate": "string"
}
Update data alert task

Updates one or more properties of a specific data alerting task.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
alertId
string
Required

The alerting task identifier.

Request Body
Required

Patch request definition for an alerting task.

application/json
array of objects
Show application/json properties
Responses
204

The alerting task has been successfully updated.

400

The specified alerting task ID or body is invalid (e.g. not a number).

application/json
object
Show application/json properties
404

An alerting task with the specified ID was not found.

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
PATCH
/api/v1/data-alerts/{alertId}
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


await qlik.dataAlerts.patchDataAlert('string', [
  {
    op: 'replace',
    path: '/ownerName',
    value: {},
  },
])
Delete data alert task

Deletes a specific data alerting task.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
alertId
string
Required

The alerting task identifier.

Responses
204

The alerting task has been successfully deleted.

400

The specified alerting task ID is invalid (e.g. not a number).

application/json
object
Show application/json properties
404

An alerting task with the specified ID was not found.

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
DELETE
/api/v1/data-alerts/{alertId}
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


await qlik.dataAlerts.deleteDataAlert('string')
Get data alert task condition

Retrieves the condition associated with a data alerting task.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
alertId
string
Required

The alerting task identifier.

Responses
200

Condition associated with the alerting task has been successfully returned. See ConditionResponse in condition-manager api docs

application/json
object
Show application/json properties
400

Bad request, malformed syntax or errors in parameters.

application/json
object
Show application/json properties
404

Task or condition not found.

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
/api/v1/data-alerts/{alertId}/condition
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


await qlik.dataAlerts.getDataAlertCondition(
  'string',
)
Example Response
{
  "hideSelections": true,
  "conditionResponse": {}
}
Get data alert task execution

Retrieves a specific execution for the specified data alerting task.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
alertId
string
Required

The alerting task identifier.

executionId
string
Required

The execution identifier. If value is "latest", the latest execution will be returned

Responses
200

The execution has been successfully returned.

application/json
object
Show application/json properties
400

The specified task or execution ID is invalid (e.g. not a number).

application/json
object
Show application/json properties
404

Task or execution not found.

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
/api/v1/data-alerts/{alertId}/executions/{executionId}
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


await qlik.dataAlerts.getDataAlertExecution(
  'string',
  'string',
)
Example Response
{
  "id": "string",
  "errors": [
    {
      "code": "string",
      "title": "string",
      "detail": "string"
    }
  ],
  "result": {
    "alertTriggerStatus": "alertSent",
    "throttlerTokensLeft": 5
  },
  "alertId": "string",
  "ownerId": "string",
  "measures": [
    "string"
  ],
  "tenantId": "string",
  "accessMode": "SOURCE_ACCESS",
  "bookmarkId": "string",
  "dimensions": [
    "string"
  ],
  "workflowId": "string",
  "conditionId": "string",
  "triggerTime": "string",
  "evaluationId": "string",
  "executionType": "INDIVIDUAL",
  "conditionStatus": "FINISHED",
  "executionEvaluationStatus": "CONDITION_MET",
  "links": {
    "self": {
      "href": "http://localhost:8787/v1/items/5da5825325dc9a0dd0260af9"
    }
  },
  "evaluation": {
    "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
    "result": "success",
    "status": "RUNNING",
    "endTime": "string",
    "ownerId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
    "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
    "contextId": "string",
    "startTime": "string",
    "resultData": {},
    "causalEvent": {},
    "conditionId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
    "dataConditionEvaluatorId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69"
  }
}
Delete data alert task execution

Deletes a specific data alerting task execution.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
alertId
string
Required

The alerting task identifier.

executionId
string
Required

The execution identifier.

Responses
204

The execution has been successfully deleted.

400

The specified task or execution ID is invalid (e.g. not a number).

application/json
object
Show application/json properties
404

Task or execution not found.

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
DELETE
/api/v1/data-alerts/{alertId}/executions/{executionId}
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


await qlik.dataAlerts.deleteDataAlertExecution(
  'string',
  'string',
)
Get data alert task recipient stats

Retrieve the recipient stats for a data alerting task.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
groups
array of strings

The name of the groups you would like to filter by

sort
array of strings

Sort the returned result set by the specified field

Values may be any of: "+userID""-userID""subscribed""+subscribed"

subscribed
boolean

Subscribed property you would like to filter by

userID
string

The recipients ID you would like to filter by

Path Parameters
alertId
string
Required

The alerting task identifier.

Responses
200

Alert recipient stats have been successfully returned.

application/json
object
Show application/json properties
400

Bad request, malformed syntax or errors in parameters.

application/json
object
Show application/json properties
404

Task or execution not found.

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
/api/v1/data-alerts/{alertId}/recipient-stats
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


await qlik.dataAlerts.getDataAlertRecipientStats(
  'string',
  {},
)
Example Response
{
  "recipientStats": [
    {
      "type": "userid",
      "value": "string",
      "errors": [
        {
          "code": "string",
          "title": "string",
          "detail": "string"
        }
      ],
      "groups": [
        "addedIndividually",
        "group1",
        "group2"
      ],
      "enabled": true,
      "lastScan": "string",
      "subscribed": true,
      "lastTrigger": "string",
      "conditionStatus": "OK"
    }
  ]
}
List data alert task executions

Lists executions for the specified data alerting task.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
conditionId
string

Filter by condition id related to the executions.

conditionStatus
string

Filter by whether the alerting task execution status is FINISHED or FAILED.

Can be one of: "FINISHED""FAILED""ALL"

daysOfMonth
array of integers

Specifies required days of the month that the execution was created in

daysOfWeek
array of strings

Specifies a filter for custom handled periods of time in which the executions were handled

Values may be any of: "MONDAY""TUESDAY""WEDNESDAY""THURSDAY""FRIDAY""SATURDAY""SUNDAY"

fields
array of strings

Specifies specific properties to be populated

Values may be any of: "evaluationId""triggerTime""conditionStatus""executionEvaluationStatus""evaluation""evaluation.endTime""evaluation.resultData""evaluation.resultData.count""evaluation.resultData.headers""evaluation.resultData.positive""evaluation.resultData.negative""evaluation.resultData.dimensions""evaluation.resultData.measures"

includeEvaluation
boolean

Specifies whether to include evaluation details

lastEachDay
boolean

Specifies whether to only show the last execution in each day

limit
integer

Limit the returned result set

minimum = 1, maximum = 100, default = 20, default = 20

minimumGapDays
integer

Specifies the number of days required between each entry. This should require a sort by triggertime

next
string

The cursor to the next page of data. Only one of next or previous may be specified.

offset
integer

Offset for pagination - how many elements to skip

minimum = 0, default = 0, default = 0

prev
string

The cursor to the previous page of data. Only one of next or previous may be specified.

searchResultsLimit
integer

Specifies a limit number for the search query, affects total count and is not related to pagination

since
string

Specifies a date that executions should have been created after. Date in RFC3339Nano format, such as 2020-01-01T00:00:00.000Z

sort
array of strings

Sort the returned result set by the specified field

Values may be any of: "triggertime""-triggertime""+triggertime"

timezone
string

Specifies a timezone the other time-based filters in this query should consider. Expecting a momentjs format, such as America/Los_Angeles

triggered
boolean

Filter by whether the alerting task is triggered.

until
string

Specifies a date that executions should have been created before. Date in RFC3339Nano format, such as 2020-01-01T00:00:00.000Z

Path Parameters
taskId
string
Required

The alerting task identifier.

Responses
200

The alerting-executions list has been successfully returned.

application/json
object

properties that should be added to every list response

Show application/json properties
400

Bad request, malformed syntax or errors in parameters.

application/json
object
Show application/json properties
404

Task or execution not found.

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
/api/v1/data-alerts/{taskId}/executions
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


await qlik.dataAlerts.getDataAlertExecutions(
  'string',
  {},
)
Example Response
{
  "totalCount": 42,
  "currentPageCount": 42,
  "links": {
    "next": {
      "href": "http://localhost:8787/v1/items?limit=12",
      "type": "next",
      "token": "JwAAAAJfaWQAGQAAADVjZjUwM2NjMjVkYzlhMTM1MzYwZTVjZAAA"
    },
    "prev": {
      "href": "http://localhost:8787/v1/items?limit=12",
      "type": "next",
      "token": "JwAAAAJfaWQAGQAAADVjZjUwM2NjMjVkYzlhMTM1MzYwZTVjZAAA"
    },
    "self": {
      "href": "http://localhost:8787/v1/items/5da5825325dc9a0dd0260af9"
    }
  },
  "executions": [
    {
      "id": "string",
      "errors": [
        {
          "code": "string",
          "title": "string",
          "detail": "string"
        }
      ],
      "result": {
        "alertTriggerStatus": "alertSent",
        "throttlerTokensLeft": 5
      },
      "alertId": "string",
      "ownerId": "string",
      "measures": [
        "string"
      ],
      "tenantId": "string",
      "accessMode": "SOURCE_ACCESS",
      "bookmarkId": "string",
      "dimensions": [
        "string"
      ],
      "workflowId": "string",
      "conditionId": "string",
      "triggerTime": "string",
      "evaluationId": "string",
      "executionType": "INDIVIDUAL",
      "conditionStatus": "FINISHED",
      "executionEvaluationStatus": "CONDITION_MET",
      "links": {
        "self": {
          "href": "http://localhost:8787/v1/items/5da5825325dc9a0dd0260af9"
        }
      },
      "evaluation": {
        "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
        "result": "success",
        "status": "RUNNING",
        "endTime": "string",
        "ownerId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
        "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
        "contextId": "string",
        "startTime": "string",
        "resultData": {},
        "causalEvent": {},
        "conditionId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
        "dataConditionEvaluatorId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69"
      }
    }
  ]
}
Get data alert task execution evaluation

Retrieves the content of an evaluation for a specified data alerting task execution.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
executionId
string
Required

The execution identifier.

taskId
string
Required

The alerting task identifier.

Responses
200

Evaluation successfully returned.

application/json
object
Show application/json properties
404

A task or execution with the specified ID was not found.

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
/api/v1/data-alerts/{taskId}/executions/{executionId}/evaluations
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


await qlik.dataAlerts.getDataAlertExecutionEvaluations(
  'string',
  'string',
)
Example Response
{
  "condition": {},
  "evaluation": {
    "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
    "result": "success",
    "status": "RUNNING",
    "endTime": "string",
    "ownerId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
    "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
    "contextId": "string",
    "startTime": "string",
    "resultData": {},
    "causalEvent": {},
    "conditionId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",
    "dataConditionEvaluatorId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69"
  },
  "hideSelections": true
}
Get data alert task execution stats
Deprecated

Retrieves stats for overall data alerting task executions.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
	Deprecated	This endpoint is deprecated and will eventually be removed. Read our API policy here.
Query Parameters
period
string
Required

The period by which the stats aggregation needs to be performed.

Can be one of: "month"

Path Parameters
taskId
string
Required

The alerting task identifier.

Responses
200

Evaluation successfully returned.

application/json
object
Deprecated

properties that should be added to every list response

Show application/json properties
404

A task or execution with the specified ID was not found.

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
/api/v1/data-alerts/{taskId}/executions/stats
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


await qlik.dataAlerts.getDataAlertExecutionsStats(
  'string',
  { period: 'month' },
)
Example Response
{
  "totalCount": 42,
  "currentPageCount": 42,
  "links": {
    "next": {
      "href": "http://localhost:8787/v1/items?limit=12",
      "type": "next",
      "token": "JwAAAAJfaWQAGQAAADVjZjUwM2NjMjVkYzlhMTM1MzYwZTVjZAAA"
    },
    "prev": {
      "href": "http://localhost:8787/v1/items?limit=12",
      "type": "next",
      "token": "JwAAAAJfaWQAGQAAADVjZjUwM2NjMjVkYzlhMTM1MzYwZTVjZAAA"
    },
    "self": {
      "href": "http://localhost:8787/v1/items/5da5825325dc9a0dd0260af9"
    }
  },
  "executionsStats": [
    {
      "endTime": "string",
      "periodKey": "string",
      "startTime": "string",
      "totalExecutions": "string",
      "triggeredExecutions": "string"
    }
  ]
}
Create data alert task trigger

Creates a new data alerting task trigger action.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
Required

The alerting trigger action create request definition.

application/json
object
Show application/json properties
Responses
202

Action has been successfully done. Request to eventing was successfully triggered.

application/json
object
Show application/json properties
400

Bad request, malformed syntax or errors in parameters.

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
/api/v1/data-alerts/actions/trigger
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


await qlik.dataAlerts.triggerDataAlerts({
  alertingTaskID: 'a1b2c3d4f5',
})
Example Response
{
  "workflowID": "a1b2c3d4f5"
}
Validate data alert task

Validates a new data alerting task. Current support includes validation for recipients only.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
Required

The alerting validate action validates a new alerting task.

application/json
object

a alerting task (a definition on an alert)

Show application/json properties
Responses
200

Alerting task has been validated successfully.

application/json
object
Show application/json properties
400

Bad request, malformed syntax or errors in parameters.

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
/api/v1/data-alerts/actions/validate
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


await qlik.dataAlerts.validateDataAlerts({
  appId: 'string',
  bookmarkId: 'string',
  conditionId: 'string',
  description: 'string',
  enabled: true,
  name: 'string',
  recipients: {
    DLListId: 'string',
    groupIds: [
      {
        alertingTaskGroupRecipientErrors: [
          {
            added: '2019-10-15T16:07:01.492Z',
            value: 'GROUP_IS_DISABLED',
          },
        ],
        enabled: true,
        taskGroupRecipientErrors: [
          {
            timestamp: '2019-10-15T16:07:01.492Z',
            value: 'GROUP_IS_DISABLED',
          },
        ],
        value: 'group1',
      },
    ],
    userIds: [
      {
        alertingTaskRecipientErrors: [
          {
            added: '2019-10-15T16:07:01.492Z',
            value: 'USER_IS_DELETED',
          },
        ],
        enabled: true,
        groups: [
          'addedIndividually',


          'group1',


          'group2',
        ],
        subscribed: true,
        taskRecipientErrors: [
          {
            timestamp: '2019-10-15T16:07:01.492Z',
            value: 'USER_IS_DELETED',
          },
        ],
        value: '1b263bs8m0mm_s21s3f',
      },
    ],
  },
  scheduleOptions: {
    recurrence: ['RRULE:FREQ=HOURLY;INTERVAL=2'],
    startDateTime: '2006-01-02T16:04:05',
    timezone: 'Canada/Pacific',
  },
  sheetId: 'string',
  throttling: {
    capacity: 42,
    initialTokenCount: 42,
    recurrenceRule: 'string',
    referenceTimestamp: 'string',
    replenishRate: 42,
    timezone: 'Etc/UTC',
  },
  triggerType: 'RELOAD',
})
Example Response
{
  "status": "FAILURE",
  "validations": [
    {
      "id": "string",
      "type": "RECIPIENT",
      "error": "NO_ACCESS",
      "description": "string",
      "validationErrors": [
        "NO_ACCESS"
      ]
    }
  ]
}
Get data alert settings

Retrieves the current settings for data alerts.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Responses
200

The alerting settings have been successfully returned

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
/api/v1/data-alerts/settings
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


await qlik.dataAlerts.getDataAlertsSettings()
Example Response
{
  "tenantId": "cgdsAumGmQ6l0Bi7CUKt9V8P_Y9GL0sC",
  "dataAlertsLimits": 50,
  "dataAlertsConsumed": 40,
  "enable-data-alerting": true,
  "data-alerting-license-status": "enabled",
  "max-recipients-in-target-access": 100,
  "data-alerting-feature-operation-status": "disabling",
  "data-alerting-feature-operation-status-change": "2020-09-02T13:44:33Z"
}
Update data alert settings

Updates the settings for data alerts. User must be assigned the TenantAdmin role.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
Required

Request for updating the alerting settings

application/json
object
Show application/json properties
Responses
204

Alerting settings have been successfully updated.

400

Bad request body

application/json
object
Show application/json properties
409

Request was denied at this time. This could happen when requesting to disable/enable the feature while there is an ongoing operation to enable/disable the feature

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
/api/v1/data-alerts/settings
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `PUT /api/v1/data-alerts/settings` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/v1/data-alerts/settings',
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'enable-data-alerting': true,
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