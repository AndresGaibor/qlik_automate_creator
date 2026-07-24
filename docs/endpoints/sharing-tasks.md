---
title: "Sharing tasks REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/sharing-tasks/"
local_path: "docs/endpoints/sharing-tasks.md"
---

Title: Sharing tasks REST | Qlik Developer Portal


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
Sharing tasks
Download OpenAPI spec

For scheduled capabilities such as reports, data alerts, subscriptions, and more, sharing tasks defines when these tasks execute, and tie together the resource definition with any conditions on execution.

Deprecation notice

The reporting template subscription toggle (enable-reporting-template-subscription) is deprecated and will be removed on or after April 28, 2026. After removal, template reporting access will be controlled exclusively by permissions. Since the permission was enabled by default for all users, most users will experience no functional change. If you manage this tenant setting programmatically, update your API calls to remove any enable-reporting-template-subscription toggle configuration.

For more information, see Setting permissions for metered reporting features on Qlik Help.

Endpoints
GET
/api/v1/sharing-tasks
POST
/api/v1/sharing-tasks
GET
/api/v1/sharing-tasks/{taskId}
PATCH
/api/v1/sharing-tasks/{taskId}
DELETE
/api/v1/sharing-tasks/{taskId}
POST
/api/v1/sharing-tasks/{taskId}/actions/cancel
GET
/api/v1/sharing-tasks/{taskId}/executions
GET
/api/v1/sharing-tasks/{taskId}/executions/{executionId}
GET
/api/v1/sharing-tasks/{taskId}/executions/{executionId}/files/{fileAlias}
POST
/api/v1/sharing-tasks/actions/execute
GET
/api/v1/sharing-tasks/settings
PATCH
/api/v1/sharing-tasks/settings
PUT
/api/v1/sharing-tasks/settings
List sharing tasks

Retrieves all sharing tasks accessible to the user. Users assigned the TenantAdmin or AnalyticsAdmin role can view all tasks.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
appid
string

the filter by sharing task resource app id. TenantAdmin users may omit this parameter to list all sharing-tasks in the tenant.

excludeDeleting
boolean

Indicates if task with the status DELETING should be excluded from the list

default = false

limit
integer

Limit the returned result set

minimum = 1, maximum = 100, default = 20, default = 20

offset
integer

Offset for finding a list of entities - used for pagination

minimum = 0, default = 0, default = 0

owner
string

the filter by sharing task resource owner id.

ownername
string

the filter by sharing task resource owner name.

page
string

The cursor to the page of data.

role
array of strings

the filter by sharing task resource role.

Values may be any of: "owner""recipient"

sort
array of strings

Sort the returned result set by the specified field

Values may be any of: "-datecreated""datecreated""+datecreated""-name""name""+name""-ownername""ownername""+ownername""-enabled""enabled""+enabled""-status""status""+status""-type""type""+type""-sent""sent""+sent""-scheduled""scheduled""+scheduled""-appname""appname""+appname""-appid""appid""+appid"

templateId
array of strings

array of template ids to filter by

type
array of strings

the filter by sharing task resource type. If type is template-sharing only and user is not tenant admin, appid is also required.

Values may be any of: "chart-monitoring""chart-sharing""sheet-sharing""template-sharing"

next
string
Deprecated

The cursor to the next page of data. Only one of next or previous may be specified.

prev
string
Deprecated

The cursor to the previous page of data. Only one of next or previous may be specified.

Responses
200

The sharing task list has been successfully returned.

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
/api/v1/sharing-tasks
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


await qlik.sharingTasks.getSharingTasks({})
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
    "emailAddresses": [
      "abc@xyz.com"
    ]
  },
  "sharingTasks": [
    {
      "id": "string",
      "name": "string",
      "tags": [
        "string"
      ],
      "type": "chart-monitoring",
      "appId": "string",
      "owner": "pXVNKqotgEMwbKwhz2agPE4yFelnPcWO",
      "state": {
        "fields": [
          {}
        ],
        "queryItems": [
          {}
        ],
        "selections": [
          {
            "name": "string",
            "values": [
              "string"
            ],
            "isNumeric": true,
            "stateName": "string",
            "displayName": "string",
            "displayValues": [
              "string"
            ]
          }
        ]
      },
      "tenant": "_mpoXaH22_vLR1pStfI7oUdGya1nKK24",
      "appName": "string",
      "lastRun": "2019-10-15T16:07:01.492Z",
      "message": "Look at the presentation.",
      "spaceId": "string",
      "subType": "pdf",
      "trigger": {
        "recurrence": [
          "string"
        ],
        "chronosJobID": "string",
        "executeOnAppReload": true,
        "executionHistoryInterval": "minutely"
      },
      "createdBy": "string",
      "insightID": "string",
      "ownerName": "Harley Kiffe",
      "startTime": "2019-10-15T16:07:01.492Z",
      "templates": [
        {
          "type": "file",
          "subType": "image",
          "fileName": "string",
          "chartData": {
            "appId": "bdf2efee-815e-4eb7-9e1e-c42d516baf29",
            "jsOpts": {},
            "outDpi": 96,
            "outZoom": 1,
            "patches": [
              {}
            ],
            "sheetId": "bdf2efee-815e-4eb7-9e1e-asdfasdfasdf",
            "widthPx": 1584,
            "heightPx": 587,
            "objectId": "167f3e67-ff3b-4ead-a09e-e8cc81d8ad78",
            "objectDef": {},
            "persistentBookmarkIncludeVariables": true
          },
          "fileAlias": "string",
          "sheetData": {
            "appId": "bdf2efee-815e-4eb7-9e1e-c42d516baf29",
            "jsOpts": {},
            "sheetId": "39a671a-5f58-468c-bb49-dff933294774",
            "widthPx": 1584,
            "heightPx": 587,
            "isPrivate": false,
            "sheetName": "My new sheet",
            "jsOptsById": {},
            "patchesById": {}
          },
          "storyData": {
            "appId": "bdf2efee-815e-4eb7-9e1e-c42d516baf29",
            "storyId": "39a671a-5f58-468c-bb49-dff933294774"
          },
          "templateId": "da5825325dc9a0dd0260af9",
          "fileTimeStamp": "yyyy-MM-dd",
          "multiSheetData": [
            {
              "appId": "bdf2efee-815e-4eb7-9e1e-c42d516baf29",
              "jsOpts": {},
              "sheetId": "39a671a-5f58-468c-bb49-dff933294774",
              "widthPx": 1584,
              "heightPx": 587,
              "isPrivate": false,
              "sheetName": "My new sheet",
              "jsOptsById": {},
              "resizeType": "none",
              "patchesById": {},
              "persistentBookmarkIncludeVariables": true
            }
          ]
        }
      ],
      "thumbnail": "string",
      "updatedBy": "string",
      "expiration": "2019-10-15T16:07:01.492Z",
      "lastViewed": "2019-10-15T16:07:01.492Z",
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
            "subscribed": true,
            "enabledByUser": true,
            "enabledBySystem": true,
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
        "groupIds": [
          {
            "value": "group1",
            "enabledByUser": true,
            "enabledBySystem": true,
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
        ],
        "emailAddresses": [
          {
            "value": "abc@xyz.com",
            "enabled": true,
            "taskRecipientErrors": [
              {
                "value": "USER_IS_DELETED",
                "timestamp": "2019-10-15T16:07:01.492Z"
              }
            ]
          }
        ],
        "netRecipientCount": 10
      },
      "statusCode": "CHART_NOT_FOUND",
      "taskErrors": [
        {
          "value": "OWNER_DISABLED",
          "timestamp": "2019-10-15T16:07:01.492Z"
        }
      ],
      "templateId": "da5825325dc9a0dd0260af9",
      "dateCreated": "2019-10-15T16:07:01.492Z",
      "description": "string",
      "lastUpdated": "2019-10-15T16:07:01.492Z",
      "statusLabel": "string",
      "emailContent": {
        "body": "report body string",
        "subject": "report subject"
      },
      "enabledByUser": true,
      "encryptedState": {
        "cipher": "string"
      },
      "byokMigrationId": "string",
      "enabledBySystem": true,
      "retentionPolicy": {
        "historySize": 10,
        "overrideInterval": "FREQ=DAILY;INTERVAL=1"
      },
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
      "selectionErrors": {},
      "dataConnectionID": "string",
      "hasSectionAccess": true,
      "insightDirectURL": "string",
      "multiInsightURLs": [
        {
          "status": "successful",
          "directURL": "string",
          "insightID": "string",
          "resourceID": "string",
          "templateID": "string",
          "fallbackURL": "string"
        }
      ],
      "nextScheduledRun": "2019-10-15T16:07:01.492Z",
      "reportProperties": {},
      "sharePointFolder": "string",
      "executeOnCreation": true,
      "lastExecutionDate": "2019-10-15T16:09:01.492Z",
      "transportChannels": [
        "email"
      ],
      "distributionListId": "vXVNKqotgEMwbKwhz2agPE4yFelnPcWX",
      "encryptedTemplates": {
        "cipher": "string"
      },
      "insightFallbackURL": "string",
      "encryptedEmailContent": {
        "body": {
          "cipher": "string"
        },
        "subject": {
          "cipher": "string"
        }
      },
      "failedExecutionsCount": 42,
      "failedVerificationsCount": 42,
      "isCandidateForVerification": true,
      "persistentBookmarkIncludeVariables": true,
      "links": {
        "self": {
          "href": "http://localhost:8787/v1/items/5da5825325dc9a0dd0260af9"
        }
      },
      "enabled": true,
      "latestExecutionURL": "string",
      "latestExecutionFilesURL": [
        "string"
      ]
    }
  ]
}
Create sharing task

Creates a new recurring sharing task.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
Required

The sharing task create request definition.

application/json
object
Show application/json properties
Responses
201

The sharing task has been successfully created.

application/json
object

Whatever is persisted in the db + links

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
/api/v1/sharing-tasks
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


await qlik.sharingTasks.createSharingTask({
  appName: 'string',
  dataConnectionID: 'string',
  description: 'string',
  distributionListId:
    'mpoXaH22_vLR1pStfI7oUdGya1nKK24',
  emailContent: {
    body: 'report body string',
    subject: 'report subject',
  },
  enabled: true,
  executeOnCreation: true,
  expiration: '2019-10-15T16:07:01.492Z',
  message: 'Look at the presentation.',
  name: 'Example Sharing Task',
  recipients: {
    emailAddresses: ['abc@xyz.com'],
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
  retentionPolicy: {
    historySize: 10,
    overrideInterval: 'FREQ=DAILY;INTERVAL=1',
  },
  scheduleOptions: {
    recurrence: ['RRULE:FREQ=HOURLY;INTERVAL=2'],
    startDateTime: '2006-01-02T16:04:05',
    timezone: 'Canada/Pacific',
  },
  sharePointFolder: 'string',
  spaceId: 'string',
  startTime: '2019-10-15T16:07:01.492Z',
  state: {
    fields: [{}],
    queryItems: [{}],
    selections: [
      {
        displayName: 'string',
        displayValues: ['string'],
        isNumeric: true,
        name: 'string',
        stateName: 'string',
        values: ['string'],
      },
    ],
  },
  subType: 'pdf',
  tags: ['string'],
  templates: [
    {
      chartData: {
        appId:
          'bdf2efee-815e-4eb7-9e1e-c42d516baf29',
        heightPx: 587,
        jsOpts: {},
        objectDef: {},
        objectId:
          '167f3e67-ff3b-4ead-a09e-e8cc81d8ad78',
        outDpi: 96,
        outZoom: 1,
        patches: [{}],
        sheetId:
          'bdf2efee-815e-4eb7-9e1e-asdfasdfasdf',
        widthPx: 1584,
      },
      fileAlias: 'string',
      fileName: 'string',
      fileTimeStamp: 'yyyy-MM-dd',
      multiSheetData: [
        {
          appId:
            'bdf2efee-815e-4eb7-9e1e-c42d516baf29',
          heightPx: 587,
          jsOpts: {},
          jsOptsById: {},
          patchesById: {},
          resizeType: 'none',
          sheetId:
            '39a671a-5f58-468c-bb49-dff933294774',
          sheetName: 'My new sheet',
          widthPx: 1584,
        },
      ],
      sheetData: {
        appId:
          'bdf2efee-815e-4eb7-9e1e-c42d516baf29',
        heightPx: 587,
        jsOpts: {},
        jsOptsById: {},
        patchesById: {},
        sheetId:
          '39a671a-5f58-468c-bb49-dff933294774',
        sheetName: 'My new sheet',
        widthPx: 1584,
      },
      storyData: {
        appId:
          'bdf2efee-815e-4eb7-9e1e-c42d516baf29',
        storyId:
          '39a671a-5f58-468c-bb49-dff933294774',
      },
      subType: 'image',
      type: 'file',
    },
  ],
  transportChannels: ['email'],
  trigger: {
    executeOnAppReload: true,
    executionHistoryInterval: 'minutely',
    recurrence: ['string'],
  },
  type: 'chart-monitoring',
})
Example Response
{
  "id": "string",
  "name": "string",
  "tags": [
    "string"
  ],
  "type": "chart-monitoring",
  "appId": "string",
  "owner": "pXVNKqotgEMwbKwhz2agPE4yFelnPcWO",
  "state": {
    "fields": [
      {}
    ],
    "queryItems": [
      {}
    ],
    "selections": [
      {
        "name": "string",
        "values": [
          "string"
        ],
        "isNumeric": true,
        "stateName": "string",
        "displayName": "string",
        "displayValues": [
          "string"
        ]
      }
    ]
  },
  "tenant": "_mpoXaH22_vLR1pStfI7oUdGya1nKK24",
  "appName": "string",
  "lastRun": "2019-10-15T16:07:01.492Z",
  "message": "Look at the presentation.",
  "spaceId": "string",
  "subType": "pdf",
  "trigger": {
    "recurrence": [
      "string"
    ],
    "chronosJobID": "string",
    "executeOnAppReload": true,
    "executionHistoryInterval": "minutely"
  },
  "createdBy": "string",
  "insightID": "string",
  "ownerName": "Harley Kiffe",
  "startTime": "2019-10-15T16:07:01.492Z",
  "templates": [
    {
      "type": "file",
      "subType": "image",
      "fileName": "string",
      "chartData": {
        "appId": "bdf2efee-815e-4eb7-9e1e-c42d516baf29",
        "jsOpts": {},
        "outDpi": 96,
        "outZoom": 1,
        "patches": [
          {}
        ],
        "sheetId": "bdf2efee-815e-4eb7-9e1e-asdfasdfasdf",
        "widthPx": 1584,
        "heightPx": 587,
        "objectId": "167f3e67-ff3b-4ead-a09e-e8cc81d8ad78",
        "objectDef": {},
        "persistentBookmarkIncludeVariables": true
      },
      "fileAlias": "string",
      "sheetData": {
        "appId": "bdf2efee-815e-4eb7-9e1e-c42d516baf29",
        "jsOpts": {},
        "sheetId": "39a671a-5f58-468c-bb49-dff933294774",
        "widthPx": 1584,
        "heightPx": 587,
        "isPrivate": false,
        "sheetName": "My new sheet",
        "jsOptsById": {},
        "patchesById": {}
      },
      "storyData": {
        "appId": "bdf2efee-815e-4eb7-9e1e-c42d516baf29",
        "storyId": "39a671a-5f58-468c-bb49-dff933294774"
      },
      "templateId": "da5825325dc9a0dd0260af9",
      "fileTimeStamp": "yyyy-MM-dd",
      "multiSheetData": [
        {
          "appId": "bdf2efee-815e-4eb7-9e1e-c42d516baf29",
          "jsOpts": {},
          "sheetId": "39a671a-5f58-468c-bb49-dff933294774",
          "widthPx": 1584,
          "heightPx": 587,
          "isPrivate": false,
          "sheetName": "My new sheet",
          "jsOptsById": {},
          "resizeType": "none",
          "patchesById": {},
          "persistentBookmarkIncludeVariables": true
        }
      ]
    }
  ],
  "thumbnail": "string",
  "updatedBy": "string",
  "expiration": "2019-10-15T16:07:01.492Z",
  "lastViewed": "2019-10-15T16:07:01.492Z",
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
        "subscribed": true,
        "enabledByUser": true,
        "enabledBySystem": true,
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
    "groupIds": [
      {
        "value": "group1",
        "enabledByUser": true,
        "enabledBySystem": true,
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
    ],
    "emailAddresses": [
      {
        "value": "abc@xyz.com",
        "enabled": true,
        "taskRecipientErrors": [
          {
            "value": "USER_IS_DELETED",
            "timestamp": "2019-10-15T16:07:01.492Z"
          }
        ]
      }
    ],
    "netRecipientCount": 10
  },
  "statusCode": "CHART_NOT_FOUND",
  "taskErrors": [
    {
      "value": "OWNER_DISABLED",
      "timestamp": "2019-10-15T16:07:01.492Z"
    }
  ],
  "templateId": "da5825325dc9a0dd0260af9",
  "dateCreated": "2019-10-15T16:07:01.492Z",
  "description": "string",
  "lastUpdated": "2019-10-15T16:07:01.492Z",
  "statusLabel": "string",
  "emailContent": {
    "body": "report body string",
    "subject": "report subject"
  },
  "enabledByUser": true,
  "encryptedState": {
    "cipher": "string"
  },
  "byokMigrationId": "string",
  "enabledBySystem": true,
  "retentionPolicy": {
    "historySize": 10,
    "overrideInterval": "FREQ=DAILY;INTERVAL=1"
  },
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
  "selectionErrors": {},
  "dataConnectionID": "string",
  "hasSectionAccess": true,
  "insightDirectURL": "string",
  "multiInsightURLs": [
    {
      "status": "successful",
      "directURL": "string",
      "insightID": "string",
      "resourceID": "string",
      "templateID": "string",
      "fallbackURL": "string"
    }
  ],
  "nextScheduledRun": "2019-10-15T16:07:01.492Z",
  "reportProperties": {},
  "sharePointFolder": "string",
  "executeOnCreation": true,
  "lastExecutionDate": "2019-10-15T16:09:01.492Z",
  "transportChannels": [
    "email"
  ],
  "distributionListId": "vXVNKqotgEMwbKwhz2agPE4yFelnPcWX",
  "encryptedTemplates": {
    "cipher": "string"
  },
  "insightFallbackURL": "string",
  "encryptedEmailContent": {
    "body": {
      "cipher": "string"
    },
    "subject": {
      "cipher": "string"
    }
  },
  "failedExecutionsCount": 42,
  "failedVerificationsCount": 42,
  "isCandidateForVerification": true,
  "persistentBookmarkIncludeVariables": true,
  "links": {
    "self": {
      "href": "http://localhost:8787/v1/items/5da5825325dc9a0dd0260af9"
    }
  },
  "enabled": true,
  "latestExecutionURL": "string",
  "latestExecutionFilesURL": [
    "string"
  ]
}
Get sharing task

Returns the details of a specific sharing task.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
isViewChart
boolean

Determines whether to update the lastViewed property for the sharing task, which is used to determine whether the sharing task is still in use. If set to true, this will be updated to current time.

default = false

Path Parameters
taskId
string
Required

The sharing task identifier.

Responses
200

Sharing task has been successfully returned.

application/json
object

Whatever is persisted in the db + links

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
/api/v1/sharing-tasks/{taskId}
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


await qlik.sharingTasks.getSharingTask(
  'string',
  {},
)
Example Response
{
  "id": "string",
  "name": "string",
  "tags": [
    "string"
  ],
  "type": "chart-monitoring",
  "appId": "string",
  "owner": "pXVNKqotgEMwbKwhz2agPE4yFelnPcWO",
  "state": {
    "fields": [
      {}
    ],
    "queryItems": [
      {}
    ],
    "selections": [
      {
        "name": "string",
        "values": [
          "string"
        ],
        "isNumeric": true,
        "stateName": "string",
        "displayName": "string",
        "displayValues": [
          "string"
        ]
      }
    ]
  },
  "tenant": "_mpoXaH22_vLR1pStfI7oUdGya1nKK24",
  "appName": "string",
  "lastRun": "2019-10-15T16:07:01.492Z",
  "message": "Look at the presentation.",
  "spaceId": "string",
  "subType": "pdf",
  "trigger": {
    "recurrence": [
      "string"
    ],
    "chronosJobID": "string",
    "executeOnAppReload": true,
    "executionHistoryInterval": "minutely"
  },
  "createdBy": "string",
  "insightID": "string",
  "ownerName": "Harley Kiffe",
  "startTime": "2019-10-15T16:07:01.492Z",
  "templates": [
    {
      "type": "file",
      "subType": "image",
      "fileName": "string",
      "chartData": {
        "appId": "bdf2efee-815e-4eb7-9e1e-c42d516baf29",
        "jsOpts": {},
        "outDpi": 96,
        "outZoom": 1,
        "patches": [
          {}
        ],
        "sheetId": "bdf2efee-815e-4eb7-9e1e-asdfasdfasdf",
        "widthPx": 1584,
        "heightPx": 587,
        "objectId": "167f3e67-ff3b-4ead-a09e-e8cc81d8ad78",
        "objectDef": {},
        "persistentBookmarkIncludeVariables": true
      },
      "fileAlias": "string",
      "sheetData": {
        "appId": "bdf2efee-815e-4eb7-9e1e-c42d516baf29",
        "jsOpts": {},
        "sheetId": "39a671a-5f58-468c-bb49-dff933294774",
        "widthPx": 1584,
        "heightPx": 587,
        "isPrivate": false,
        "sheetName": "My new sheet",
        "jsOptsById": {},
        "patchesById": {}
      },
      "storyData": {
        "appId": "bdf2efee-815e-4eb7-9e1e-c42d516baf29",
        "storyId": "39a671a-5f58-468c-bb49-dff933294774"
      },
      "templateId": "da5825325dc9a0dd0260af9",
      "fileTimeStamp": "yyyy-MM-dd",
      "multiSheetData": [
        {
          "appId": "bdf2efee-815e-4eb7-9e1e-c42d516baf29",
          "jsOpts": {},
          "sheetId": "39a671a-5f58-468c-bb49-dff933294774",
          "widthPx": 1584,
          "heightPx": 587,
          "isPrivate": false,
          "sheetName": "My new sheet",
          "jsOptsById": {},
          "resizeType": "none",
          "patchesById": {},
          "persistentBookmarkIncludeVariables": true
        }
      ]
    }
  ],
  "thumbnail": "string",
  "updatedBy": "string",
  "expiration": "2019-10-15T16:07:01.492Z",
  "lastViewed": "2019-10-15T16:07:01.492Z",
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
        "subscribed": true,
        "enabledByUser": true,
        "enabledBySystem": true,
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
    "groupIds": [
      {
        "value": "group1",
        "enabledByUser": true,
        "enabledBySystem": true,
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
    ],
    "emailAddresses": [
      {
        "value": "abc@xyz.com",
        "enabled": true,
        "taskRecipientErrors": [
          {
            "value": "USER_IS_DELETED",
            "timestamp": "2019-10-15T16:07:01.492Z"
          }
        ]
      }
    ],
    "netRecipientCount": 10
  },
  "statusCode": "CHART_NOT_FOUND",
  "taskErrors": [
    {
      "value": "OWNER_DISABLED",
      "timestamp": "2019-10-15T16:07:01.492Z"
    }
  ],
  "templateId": "da5825325dc9a0dd0260af9",
  "dateCreated": "2019-10-15T16:07:01.492Z",
  "description": "string",
  "lastUpdated": "2019-10-15T16:07:01.492Z",
  "statusLabel": "string",
  "emailContent": {
    "body": "report body string",
    "subject": "report subject"
  },
  "enabledByUser": true,
  "encryptedState": {
    "cipher": "string"
  },
  "byokMigrationId": "string",
  "enabledBySystem": true,
  "retentionPolicy": {
    "historySize": 10,
    "overrideInterval": "FREQ=DAILY;INTERVAL=1"
  },
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
  "selectionErrors": {},
  "dataConnectionID": "string",
  "hasSectionAccess": true,
  "insightDirectURL": "string",
  "multiInsightURLs": [
    {
      "status": "successful",
      "directURL": "string",
      "insightID": "string",
      "resourceID": "string",
      "templateID": "string",
      "fallbackURL": "string"
    }
  ],
  "nextScheduledRun": "2019-10-15T16:07:01.492Z",
  "reportProperties": {},
  "sharePointFolder": "string",
  "executeOnCreation": true,
  "lastExecutionDate": "2019-10-15T16:09:01.492Z",
  "transportChannels": [
    "email"
  ],
  "distributionListId": "vXVNKqotgEMwbKwhz2agPE4yFelnPcWX",
  "encryptedTemplates": {
    "cipher": "string"
  },
  "insightFallbackURL": "string",
  "encryptedEmailContent": {
    "body": {
      "cipher": "string"
    },
    "subject": {
      "cipher": "string"
    }
  },
  "failedExecutionsCount": 42,
  "failedVerificationsCount": 42,
  "isCandidateForVerification": true,
  "persistentBookmarkIncludeVariables": true,
  "links": {
    "self": {
      "href": "http://localhost:8787/v1/items/5da5825325dc9a0dd0260af9"
    }
  },
  "enabled": true,
  "latestExecutionURL": "string",
  "latestExecutionFilesURL": [
    "string"
  ]
}
Update sharing task

Updates one or more properties of a specific sharing task.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
taskId
string
Required

The sharing task identifier.

Request Body
Required

The sharing task definition.

application/json
array of objects
Show application/json properties
Responses
204

The sharing task has been successfully updated.

400

The specified task ID or body is invalid (e.g. not a number).

application/json
object
Show application/json properties
404

A task with the specified ID was not found.

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
/api/v1/sharing-tasks/{taskId}
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


await qlik.sharingTasks.patchSharingTask(
  'string',
  [
    {
      op: 'replace',
      path: '/name',
      value: 'new name',
    },


    {
      op: 'replace',
      path: '/tags',
      value: ['tag1', 'tag2'],
    },


    {
      op: 'replace',
      path: '/tags',
      value: 'new-tag',
    },


    {
      op: 'replace',
      path: '/tags',
      value: 'deleted-tag',
    },


    {
      op: 'replace',
      path: '/ownerId',
      value: 'new-owner',
    },


    {
      op: 'replace',
      path: '/enabled',
      value: true,
    },


    {
      op: 'replace',
      path: '/description',
      value: 'new-description',
    },
  ],
)
Delete sharing task

Deletes a specific sharing task.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
taskId
string
Required

The sharing task identifier.

Responses
204

The sharing task has been successfully deleted.

400

The specified task ID is invalid (e.g. not a number).

application/json
object
Show application/json properties
404

A task with the specified ID was not found.

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
/api/v1/sharing-tasks/{taskId}
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


await qlik.sharingTasks.deleteSharingTask(
  'string',
)
Cancel sharing task execution

Requests cancellation of an execution of the specified recurring sharing task.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
taskId
string
Required

The sharing task identifier.

Responses
204

The sharing task has been successfully cancelled.

400

Bad request, malformed syntax or errors in parameters.

application/json
object
Show application/json properties
404

Task not found, if the provided sharing task cannot be found or otherwise unable to be cancelled

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
/api/v1/sharing-tasks/{taskId}/actions/cancel
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


await qlik.sharingTasks.cancelSharingTask(
  'string',
)
List sharing task executions

Lists executions for the specified sharing task.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
limit
integer

Limit the returned result set

minimum = 1, maximum = 200, default = 20, default = 20

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

sort
array of strings

Sort the returned result set by the specified field

Values may be any of: "starttime""-starttime""+starttime"

status
string

Specifies a filter for a particular field and value of an execution

Can be one of: "successful""failed"

Path Parameters
taskId
string
Required

The sharing task identifier.

Responses
200

The sharing-executions list has been successfully returned.

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
/api/v1/sharing-tasks/{taskId}/executions
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


await qlik.sharingTasks.getSharingTaskExecutions(
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
      "appId": "string",
      "files": [
        {
          "type": "image",
          "fileID": "za1b2c3d4z",
          "userId": "string",
          "fileAlias": "small-image",
          "templateId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
          "tempContentsLocation": "string"
        }
      ],
      "errors": [
        {
          "code": "string",
          "title": "string",
          "detail": "string"
        }
      ],
      "status": "initialized",
      "endTime": "string",
      "eventID": "string",
      "ownerId": "string",
      "reloadId": "string",
      "tenantId": "string",
      "eventTime": "string",
      "startTime": "string",
      "bookmarkId": "string",
      "failedTime": "string",
      "reloadTime": "string",
      "targetUser": {
        "type": "string",
        "value": "string",
        "timezone": "string",
        "filterName": "string",
        "filterNames": [
          "string"
        ]
      },
      "totalCount": 42,
      "workflowID": "string",
      "bookmarkIds": [
        "string"
      ],
      "failedCount": 42,
      "successCount": 42,
      "cancelledTime": "string",
      "sharingTaskID": "string",
      "cancelledCount": 42,
      "totalUploadCount": 42,
      "failedUploadCount": 42,
      "successUploadCount": 42,
      "links": {
        "self": {
          "href": "http://localhost:8787/v1/items/5da5825325dc9a0dd0260af9"
        }
      },
      "fileLocations": [
        "string"
      ]
    }
  ]
}
Get sharing task execution

Retrieves a specific sharing task execution.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
status
string

Filter by status. If not present then no filtering is done on the status. This is only relevant when requesting latest execution.

Can be one of: "successful""failed""cancelled"

Path Parameters
executionId
string
Required

The execution identifier. If value is "latest", the latest execution will be returned

taskId
string
Required

The sharing task identifier.

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
/api/v1/sharing-tasks/{taskId}/executions/{executionId}
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


await qlik.sharingTasks.getSharingTaskExecution(
  'string',
  'string',
  {},
)
Example Response
{
  "id": "string",
  "appId": "string",
  "files": [
    {
      "type": "image",
      "fileID": "za1b2c3d4z",
      "userId": "string",
      "fileAlias": "small-image",
      "templateId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "tempContentsLocation": "string"
    }
  ],
  "errors": [
    {
      "code": "string",
      "title": "string",
      "detail": "string"
    }
  ],
  "status": "initialized",
  "endTime": "string",
  "eventID": "string",
  "ownerId": "string",
  "reloadId": "string",
  "tenantId": "string",
  "eventTime": "string",
  "startTime": "string",
  "bookmarkId": "string",
  "failedTime": "string",
  "reloadTime": "string",
  "targetUser": {
    "type": "string",
    "value": "string",
    "timezone": "string",
    "filterName": "string",
    "filterNames": [
      "string"
    ]
  },
  "totalCount": 42,
  "workflowID": "string",
  "bookmarkIds": [
    "string"
  ],
  "failedCount": 42,
  "successCount": 42,
  "cancelledTime": "string",
  "sharingTaskID": "string",
  "cancelledCount": 42,
  "totalUploadCount": 42,
  "failedUploadCount": 42,
  "successUploadCount": 42,
  "links": {
    "self": {
      "href": "http://localhost:8787/v1/items/5da5825325dc9a0dd0260af9"
    }
  },
  "fileLocations": [
    "string"
  ]
}
Get sharing task execution file

Retrieves the file content for the requested execution and file type.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
status
string

Filter by status. If not present then no filtering is done on the status. This is only relevant when requesting latest execution.

Can be one of: "successful""failed""cancelled"

Path Parameters
executionId
string
Required

The execution identifier.

fileAlias
string
Required

The execution identifier. If value is "latest", the latest execution will be returned

taskId
string
Required

The sharing task identifier.

Responses
200

The content of the file has been successfully returned.

image/png
string

format = "binary"

200

The content of the file has been successfully returned.

application/json
string

format = "binary"

404

A task or execution with the specified ID was not found.

image/png
object
Show image/png properties
404

A task or execution with the specified ID was not found.

application/json
object
Show application/json properties
500

Internal server error.

image/png
object
Show image/png properties
500

Internal server error.

application/json
object
Show application/json properties
default

Error response.

image/png
object
Show image/png properties
default

Error response.

application/json
object
Show application/json properties
GET
/api/v1/sharing-tasks/{taskId}/executions/{executionId}/files/{fileAlias}
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


await qlik.sharingTasks.getSharingTaskExecutionFile(
  'string',
  'string',
  'string',
  {},
)
Example Response
"string"
Start sharing task execution

Requests execution of the specified recurring sharing task.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
Required

The sharing task execute request definition.

application/json
object
Show application/json properties
Responses
204

The sharing task has been successfully set up for execution.

400

Bad request, malformed syntax or errors in parameters.

application/json
object
Show application/json properties
404

Task not found, if the provided sharing task cannot be found or otherwise unable to be executed

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
/api/v1/sharing-tasks/actions/execute
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


await qlik.sharingTasks.executeSharingTasks({
  sharingTaskID: 'a1b2c3d4f5',
})
Get sharing settings

Retrieves the current settings for sharing tasks, reports, and other related configuration.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Responses
200

The sharing settings have been successfully returned

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
/api/v1/sharing-tasks/settings
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


await qlik.sharingTasks.getSharingTasksSettings()
Example Response
{
  "tenantId": "cgdsAumGmQ6l0Bi7CUKt9V8P_Y9GL0sC",
  "maxRecipients": 200,
  "enable-sharing": true,
  "reportSubscriptionStatus": "disabling",
  "maxSubscriptionRecipients": 42,
  "enable-report-subscription": true,
  "reporting-service-license-status": "enabled",
  "reportSubscriptionStatusChangeTime": "2020-09-02T13:44:33Z"
}
Update sharing toggle settings

Patches the toggle settings for sharing tasks, reports, and other related configuration in the tenant. User must be assigned the TenantAdmin role.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
Required

Request for updating the API settings

application/json
array of objects

A JSON Patch document as defined in https://datatracker.ietf.org/doc/html/rfc6902.

Show application/json properties
Responses
204

Sharing settings have been successfully updated.

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
PATCH
/api/v1/sharing-tasks/settings
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


await qlik.sharingTasks.updateSharingTasksSettings(
  [
    {
      op: 'replace',
      path: '/enable-sharing',
      value: true,
    },


    { op: 'replace', path: '/enable-sharing' },


    {
      op: 'replace',
      path: '/enable-report-subscription',
      value: true,
    },


    {
      op: 'replace',
      path: '/enable-report-subscription',
    },
  ],
)
Update sharing settings

Updates the settings for sharing tasks, reports, and other related configuration in the tenant. User must be assigned the TenantAdmin role.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
Required

Request for updating the API settings

application/json
object
Show application/json properties
Responses
204

API settings have been successfully updated.

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
/api/v1/sharing-tasks/settings
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `PUT /api/v1/sharing-tasks/settings` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/v1/sharing-tasks/settings',
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'enable-sharing': true,
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