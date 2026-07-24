---
title: "Automations REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/workflows/automations/"
local_path: "docs/endpoints/workflows-automations.md"
---

Title: Automations REST | Qlik Developer Portal


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
workflows
Copy page
Automations
Download OpenAPI spec

Automations in Qlik Automate are no-code workflows which connect applications together.

Preferred API

This API replaces the legacy Automations API. Use this API for all new implementations.

Endpoints
GET
/api/workflows/automations
POST
/api/workflows/automations
GET
/api/workflows/automations/{id}
PUT
/api/workflows/automations/{id}
DELETE
/api/workflows/automations/{id}
POST
/api/workflows/automations/{id}/actions/change-owner
POST
/api/workflows/automations/{id}/actions/change-space
POST
/api/workflows/automations/{id}/actions/copy
POST
/api/workflows/automations/{id}/actions/disable
POST
/api/workflows/automations/{id}/actions/enable
POST
/api/workflows/automations/{id}/actions/move
GET
/api/workflows/automations/{id}/runs
POST
/api/workflows/automations/{id}/runs
GET
/api/workflows/automations/{id}/runs/{runId}
POST
/api/workflows/automations/{id}/runs/{runId}/actions/export
POST
/api/workflows/automations/{id}/runs/{runId}/actions/retry
POST
/api/workflows/automations/{id}/runs/{runId}/actions/stop
GET
/api/workflows/automations/{id}/runs/{runId}/debug
GET
/api/workflows/automations/settings
PUT
/api/workflows/automations/settings
GET
/api/workflows/automations/usage
List automations

Retrieves a list of the automations that the requesting user has access to.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
	Replaces	
GET v1/automations
Query Parameters
cursor
string

Pagination cursor returned from a previous request.

filter
string

Allowed filters: name, runMode, lastRunStatus, ownerId, spaceId.

limit
integer

The number of automations to retrieve.

minimum = 1, maximum = 200, default = 100, default = 100

listAll
boolean

When true, list all automations. Restricted to tenant admins and analytics admins.

default = true

sort
string

The field to sort by, with +- prefix indicating sort order. (?sort=-name => sort on the name field using descending order).

Can be one of: "id""name""runMode""state""createdAt""updatedAt""lastRunAt""lastRunStatus""+id""+name""+runMode""+state""+createdAt""+updatedAt""+lastRunAt""+lastRunStatus""-id""-name""-runMode""-state""-createdAt""-updatedAt""-lastRunAt""-lastRunStatus""maxConcurrentRuns""+maxConcurrentRuns""-maxConcurrentRuns"

default = "id"

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
/api/workflows/automations
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/workflows/automations` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/workflows/automations',
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
      "id": "e0e720d0-4947-11ec-a1d2-9559fa35801d",
      "name": "string",
      "state": "available",
      "lastRun": {
        "id": "d452d100-9b0b-11ec-b199-8323e1031c3e",
        "error": [
          {}
        ],
        "title": "string",
        "status": "failed",
        "context": "test_run",
        "metrics": {
          "blocks": [
            {
              "type": "endpointBlock",
              "rxBytes": 18329921,
              "txBytes": 18329921,
              "apiCalls": 40,
              "snippetId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
              "endpointId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
              "connectorId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4"
            }
          ],
          "network": {
            "rxBytes": 0,
            "txBytes": 0
          },
          "totalApiCalls": 0
        },
        "ownerId": "string",
        "spaceId": "string",
        "testRun": true,
        "archived": true,
        "stopTime": "2021-12-23T12:28:21.000000Z",
        "createdAt": "2021-12-23T12:28:21.000000Z",
        "isTestRun": true,
        "startTime": "2021-12-23T12:28:21.000000Z",
        "updatedAt": "2021-12-23T12:28:21.000000Z",
        "isArchived": true,
        "executedById": "string",
        "scheduledStartTime": "2021-12-23T12:28:21.000000Z"
      },
      "ownerId": "sWYAHxZxhtcmBT7Ptc5xJ5I6N7HxwnEy",
      "runMode": "triggered",
      "spaceId": "5f0f78b239ff4f0001234567",
      "duration": "9001",
      "createdAt": "2021-12-23T12:28:21.000000Z",
      "lastRunAt": "2021-12-23T12:28:21.000000Z",
      "updatedAt": "2021-12-23T12:28:21.000000Z",
      "workspace": {},
      "snippetIds": [
        "e0e720d0-4947-11ec-a1d2-9559fa35801d"
      ],
      "description": "string",
      "endpointIds": [
        "9d94bef0-b28c-11eb-8dba-01593c457362",
        "53a6fb70-b28f-11eb-b601-b545a40867e0"
      ],
      "connectorIds": [
        "0d87808f-27c0-11ea-921c-022e6b5ea1e2",
        "0d86ee8a-27c0-11ea-921c-022e6b5ea1e2"
      ],
      "lastRunStatus": "finished",
      "executionToken": "aZXuEogT9X3le0k0WXMBnzuYKq4xRlkDnurjs8NVhEAAW1BYx8C1PpIl3ielgRb1",
      "maxConcurrentRuns": 10
    }
  ],
  "links": {
    "next": {
      "href": "string"
    },
    "prev": {
      "href": "string"
    }
  }
}
Create an automation

Creates a new automation. The requesting user must be assigned the AutomationCreator role or have at least one of the following scopes: automations, admin.automations, automations.private or automations.shared.

Facts
	Rate limit	Tier 2 (100 requests per minute)
	Replaces	
POST v1/automations
Request Body
Required

Automation object to create

application/json
object
Show application/json properties
Responses
201

Created

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
/api/workflows/automations
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/workflows/automations` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/workflows/automations',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'My automation',
      spaceId: '5f0f78b239ff4f0001234567',
      schedules: [
        {
          stopAt: '2022-12-01 00:00:00',
          startAt: '2022-01-01 00:00:00',
          interval: 60,
          timezone: 'Europe/Stockholm',
        },
      ],
      workspace: {},
      description: '',
      maxConcurrentRuns: 1,
    }),
  },
)
Example Response
{
  "id": "e0e720d0-4947-11ec-a1d2-9559fa35801d",
  "name": "string",
  "state": "available",
  "lastRun": {
    "id": "d452d100-9b0b-11ec-b199-8323e1031c3e",
    "error": [
      {}
    ],
    "title": "string",
    "status": "failed",
    "context": "test_run",
    "metrics": {
      "blocks": [
        {
          "type": "endpointBlock",
          "rxBytes": 18329921,
          "txBytes": 18329921,
          "apiCalls": 40,
          "snippetId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
          "endpointId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
          "connectorId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4"
        }
      ],
      "network": {
        "rxBytes": 0,
        "txBytes": 0
      },
      "totalApiCalls": 0
    },
    "ownerId": "string",
    "spaceId": "string",
    "testRun": true,
    "archived": true,
    "stopTime": "2021-12-23T12:28:21.000000Z",
    "createdAt": "2021-12-23T12:28:21.000000Z",
    "isTestRun": true,
    "startTime": "2021-12-23T12:28:21.000000Z",
    "updatedAt": "2021-12-23T12:28:21.000000Z",
    "isArchived": true,
    "executedById": "string",
    "scheduledStartTime": "2021-12-23T12:28:21.000000Z"
  },
  "ownerId": "sWYAHxZxhtcmBT7Ptc5xJ5I6N7HxwnEy",
  "runMode": "triggered",
  "spaceId": "5f0f78b239ff4f0001234567",
  "createdAt": "2021-12-23T12:28:21.000000Z",
  "lastRunAt": "2021-12-23T12:28:21.000000Z",
  "schedules": [
    {
      "id": "d452d100-9b0b-11ec-b199-8323e1031c3e",
      "stopAt": "2022-12-01 00:00:00",
      "startAt": "2021-12-01 00:00:00",
      "interval": 60,
      "timezone": "Europe/Stockholm",
      "lastStartedAt": "2022-01-01T12:28:21.000000Z"
    }
  ],
  "updatedAt": "2021-12-23T12:28:21.000000Z",
  "workspace": {},
  "snippetIds": [
    "e0e720d0-4947-11ec-a1d2-9559fa35801d"
  ],
  "description": "string",
  "endpointIds": [
    "9d94bef0-b28c-11eb-8dba-01593c457362",
    "53a6fb70-b28f-11eb-b601-b545a40867e0"
  ],
  "connectorIds": [
    "0d87808f-27c0-11ea-921c-022e6b5ea1e2",
    "0d86ee8a-27c0-11ea-921c-022e6b5ea1e2"
  ],
  "lastRunStatus": "finished",
  "executionToken": "aZXuEogT9X3le0k0WXMBnzuYKq4xRlkDnurjs8NVhEAAW1BYx8C1PpIl3ielgRb1",
  "maxConcurrentRuns": 10
}
Get an automation

Retrieves the full definition of an automation. The requesting user must be the owner of the automation and either be assigned one of the roles: AutomationsCreator, TenantAdmin or have at least one of the following scopes (depending on whether the automation is in a private or shared space): automations, automations.private or automations.shared.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
	Replaces	
GET v1/automations/{id}
Path Parameters
id
string
Required

The unique identifier for the automation.

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
/api/workflows/automations/{id}
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/workflows/automations/{id}` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/workflows/automations/{id}',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "id": "e0e720d0-4947-11ec-a1d2-9559fa35801d",
  "name": "string",
  "state": "available",
  "lastRun": {
    "id": "d452d100-9b0b-11ec-b199-8323e1031c3e",
    "error": [
      {}
    ],
    "title": "string",
    "status": "failed",
    "context": "test_run",
    "metrics": {
      "blocks": [
        {
          "type": "endpointBlock",
          "rxBytes": 18329921,
          "txBytes": 18329921,
          "apiCalls": 40,
          "snippetId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
          "endpointId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
          "connectorId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4"
        }
      ],
      "network": {
        "rxBytes": 0,
        "txBytes": 0
      },
      "totalApiCalls": 0
    },
    "ownerId": "string",
    "spaceId": "string",
    "testRun": true,
    "archived": true,
    "stopTime": "2021-12-23T12:28:21.000000Z",
    "createdAt": "2021-12-23T12:28:21.000000Z",
    "isTestRun": true,
    "startTime": "2021-12-23T12:28:21.000000Z",
    "updatedAt": "2021-12-23T12:28:21.000000Z",
    "isArchived": true,
    "executedById": "string",
    "scheduledStartTime": "2021-12-23T12:28:21.000000Z"
  },
  "ownerId": "sWYAHxZxhtcmBT7Ptc5xJ5I6N7HxwnEy",
  "runMode": "triggered",
  "spaceId": "5f0f78b239ff4f0001234567",
  "createdAt": "2021-12-23T12:28:21.000000Z",
  "lastRunAt": "2021-12-23T12:28:21.000000Z",
  "schedules": [
    {
      "id": "d452d100-9b0b-11ec-b199-8323e1031c3e",
      "stopAt": "2022-12-01 00:00:00",
      "startAt": "2021-12-01 00:00:00",
      "interval": 60,
      "timezone": "Europe/Stockholm",
      "lastStartedAt": "2022-01-01T12:28:21.000000Z"
    }
  ],
  "updatedAt": "2021-12-23T12:28:21.000000Z",
  "workspace": {},
  "snippetIds": [
    "e0e720d0-4947-11ec-a1d2-9559fa35801d"
  ],
  "description": "string",
  "endpointIds": [
    "9d94bef0-b28c-11eb-8dba-01593c457362",
    "53a6fb70-b28f-11eb-b601-b545a40867e0"
  ],
  "connectorIds": [
    "0d87808f-27c0-11ea-921c-022e6b5ea1e2",
    "0d86ee8a-27c0-11ea-921c-022e6b5ea1e2"
  ],
  "lastRunStatus": "finished",
  "executionToken": "aZXuEogT9X3le0k0WXMBnzuYKq4xRlkDnurjs8NVhEAAW1BYx8C1PpIl3ielgRb1",
  "maxConcurrentRuns": 10
}
Update an automation

Updates the full definition of an automation. The requesting user must be the owner of the automation and either be assigned the AutomationCreator role or have at least one of the following scopes: automations, admin.automations, automations.private or automations.shared.

Facts
	Rate limit	Tier 2 (100 requests per minute)
	Replaces	
PUT v1/automations/{id}
Path Parameters
id
string
Required

The unique identifier for the automation.

Request Body
Required

Automation object to update

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
409

Conflict with the current state of the resource

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
/api/workflows/automations/{id}
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `PUT /api/workflows/automations/{id}` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/workflows/automations/{id}',
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'My automation',
      schedules: [
        {
          stopAt: '2022-12-01 00:00:00',
          startAt: '2022-01-01 00:00:00',
          interval: 60,
          timezone: 'Europe/Stockholm',
        },
      ],
      workspace: {},
      description: '',
      maxConcurrentRuns: 1,
    }),
  },
)
Example Response
{
  "id": "e0e720d0-4947-11ec-a1d2-9559fa35801d",
  "name": "string",
  "state": "available",
  "lastRun": {
    "id": "d452d100-9b0b-11ec-b199-8323e1031c3e",
    "error": [
      {}
    ],
    "title": "string",
    "status": "failed",
    "context": "test_run",
    "metrics": {
      "blocks": [
        {
          "type": "endpointBlock",
          "rxBytes": 18329921,
          "txBytes": 18329921,
          "apiCalls": 40,
          "snippetId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
          "endpointId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
          "connectorId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4"
        }
      ],
      "network": {
        "rxBytes": 0,
        "txBytes": 0
      },
      "totalApiCalls": 0
    },
    "ownerId": "string",
    "spaceId": "string",
    "testRun": true,
    "archived": true,
    "stopTime": "2021-12-23T12:28:21.000000Z",
    "createdAt": "2021-12-23T12:28:21.000000Z",
    "isTestRun": true,
    "startTime": "2021-12-23T12:28:21.000000Z",
    "updatedAt": "2021-12-23T12:28:21.000000Z",
    "isArchived": true,
    "executedById": "string",
    "scheduledStartTime": "2021-12-23T12:28:21.000000Z"
  },
  "ownerId": "sWYAHxZxhtcmBT7Ptc5xJ5I6N7HxwnEy",
  "runMode": "triggered",
  "spaceId": "5f0f78b239ff4f0001234567",
  "createdAt": "2021-12-23T12:28:21.000000Z",
  "lastRunAt": "2021-12-23T12:28:21.000000Z",
  "schedules": [
    {
      "id": "d452d100-9b0b-11ec-b199-8323e1031c3e",
      "stopAt": "2022-12-01 00:00:00",
      "startAt": "2021-12-01 00:00:00",
      "interval": 60,
      "timezone": "Europe/Stockholm",
      "lastStartedAt": "2022-01-01T12:28:21.000000Z"
    }
  ],
  "updatedAt": "2021-12-23T12:28:21.000000Z",
  "workspace": {},
  "snippetIds": [
    "e0e720d0-4947-11ec-a1d2-9559fa35801d"
  ],
  "description": "string",
  "endpointIds": [
    "9d94bef0-b28c-11eb-8dba-01593c457362",
    "53a6fb70-b28f-11eb-b601-b545a40867e0"
  ],
  "connectorIds": [
    "0d87808f-27c0-11ea-921c-022e6b5ea1e2",
    "0d86ee8a-27c0-11ea-921c-022e6b5ea1e2"
  ],
  "lastRunStatus": "finished",
  "executionToken": "aZXuEogT9X3le0k0WXMBnzuYKq4xRlkDnurjs8NVhEAAW1BYx8C1PpIl3ielgRb1",
  "maxConcurrentRuns": 10
}
Delete an automation

Deletes an automation. The requesting user must meet at least one of the following conditions:

be the owner of the automation
be assigned one of the following roles: AnalyticsAdmin, TenantAdmin
have at least one of the following scopes: admin.automations, admin.automations:strict, automations.private, or automations.shared
Facts
	Rate limit	Tier 2 (100 requests per minute)
	Replaces	
DELETE v1/automations/{id}
Path Parameters
id
string
Required

The unique identifier for the automation.

Responses
204

No Content

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
/api/workflows/automations/{id}
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `DELETE /api/workflows/automations/{id}` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/workflows/automations/{id}',
  {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Change automation owner

Changes the owner of an automation to another user. This action removes the history and change logs of this automation. All linked connections used in the automation are detached and not moved to the new owner. The requesting user must be assigned TenantAdmin role or have at least one of the following scopes: admin.automations, admin.automations:strict.

Facts
	Rate limit	Tier 2 (100 requests per minute)
	Replaces	
POST v1/automations/{id}/actions/change-owner
Path Parameters
id
string
Required

The unique identifier for the automation.

format = "uuid"

Request Body
Required
application/json
object
Show application/json properties
Responses
204

No Content

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
/api/workflows/automations/{id}/actions/change-owner
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/workflows/automations/{id}/actions/change-owner` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/workflows/automations/{id}/actions/change-owner',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: 'sWYAHxZxhtcmBT7Ptc5xJ5I6N7HxwnEy',
    }),
  },
)
Change automation space

Changes the space of an automation by specifying a new space.

Facts
	Rate limit	Tier 2 (100 requests per minute)
	Replaces	
POST v1/automations/{id}/actions/change-space
Path Parameters
id
string
Required

The unique identifier for the automation.

Request Body
application/json
object
Show application/json properties
Responses
204

No Content

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
/api/workflows/automations/{id}/actions/change-space
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/workflows/automations/{id}/actions/change-space` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/workflows/automations/{id}/actions/change-space',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spaceId: '5f0f78b239ff4f0001234567',
    }),
  },
)
Duplicate an automation

Duplicates an existing automation. The requesting user must be the owner of the automation or have at least one of the following scopes: automations, admin.automations, automations.private or automations.shared.

Facts
	Rate limit	Tier 2 (100 requests per minute)
	Replaces	
POST v1/automations/{id}/actions/copy
Path Parameters
id
string
Required

The unique identifier for the automation.

Request Body
Required
application/json
object
Show application/json properties
Responses
201

Created

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
/api/workflows/automations/{id}/actions/copy
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/workflows/automations/{id}/actions/copy` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/workflows/automations/{id}/actions/copy',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'My automation',
    }),
  },
)
Example Response
{
  "id": "00000000-0000-0000-0000-000000000000"
}
Disable an automation

Disables an automation so that it cannot be run. To disable an automation, the requesting user must meet at least one of the following conditions:

be the owner of the automation
be assigned one of the following roles: TenantAdmin, AnalyticsAdmin
have at least one of the following scopes: admin.automations, admin.automations:strict, automations.private, or automations.shared
Facts
	Rate limit	Tier 2 (100 requests per minute)
	Replaces	
POST v1/automations/{id}/actions/disable
Path Parameters
id
string
Required

The unique identifier for the automation.

Responses
204

No Content

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
/api/workflows/automations/{id}/actions/disable
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/workflows/automations/{id}/actions/disable` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/workflows/automations/{id}/actions/disable',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Enable an automation

Enables an automation so that it can be run. To enable an automation, the requesting user must meet at least one of the following conditions:

be the owner of the automation
be assigned one of the following roles: AnalyticsAdmin, TenantAdmin
have at least one of the following scopes: admin.automations, admin.automations:strict, automations.private, or automations.shared
Facts
	Rate limit	Tier 2 (100 requests per minute)
	Replaces	
POST v1/automations/{id}/actions/enable
Path Parameters
id
string
Required

The unique identifier for the automation.

Responses
204

No Content

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
/api/workflows/automations/{id}/actions/enable
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/workflows/automations/{id}/actions/enable` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/workflows/automations/{id}/actions/enable',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Change automation owner

Changes the owner of an automation to another user. This action removes the history and change logs of this automation. All linked connections used in the automation are detached and not moved to the new owner. The requesting user must be assigned TenantAdmin role or have at least one of the following scopes: admin.automations, admin.automations:strict.

Facts
	Rate limit	Tier 2 (100 requests per minute)
	Replaces	
POST v1/automations/{id}/actions/move
Path Parameters
id
string
Required

The unique identifier for the automation.

format = "uuid"

Request Body
Required
application/json
object
Show application/json properties
Responses
204

No Content

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
/api/workflows/automations/{id}/actions/move
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/workflows/automations/{id}/actions/move` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/workflows/automations/{id}/actions/move',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: 'sWYAHxZxhtcmBT7Ptc5xJ5I6N7HxwnEy',
    }),
  },
)
List automation runs

Retrieves a list of runs for a specific automation. The requesting user must be the owner of the automation, or be assigned the one of roles: TenantAdmin, AnalyticsAdmin. Alternatively, the user must have at least one of the following scopes: admin.automation-runs, automation-runs.private, or automation-runs.shared.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
	Replaces	
GET v1/automations/{id}/runs
Query Parameters
cursor
string

Pagination cursor returned from a previous request.

filter
string

Allowed filters: status, context, startTime, title, spaceId, ownerId, executedById, billable.

limit
integer

The number of runs to retrieve.

minimum = 1, maximum = 200, default = 10, default = 10

sort
string

The field to sort by, with +- prefix indicating sort order. (?query=-startTime => sort on the startTime field using descending order).

Can be one of: "id""status""startTime""-id""-status""-startTime""+id""+status""+startTime"

default = "id"

Path Parameters
id
string
Required

The unique identifier for the automation.

format = "uuid"

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
/api/workflows/automations/{id}/runs
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/workflows/automations/{id}/runs` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/workflows/automations/{id}/runs',
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
      "id": "d452d100-9b0b-11ec-b199-8323e1031c3e",
      "error": [
        {}
      ],
      "title": "string",
      "status": "failed",
      "context": "test_run",
      "ownerId": "string",
      "spaceId": "string",
      "testRun": true,
      "archived": true,
      "duration": "9001",
      "stopTime": "2021-12-23T12:28:21.000000Z",
      "createdAt": "2021-12-23T12:28:21.000000Z",
      "isTestRun": true,
      "startTime": "2021-12-23T12:28:21.000000Z",
      "updatedAt": "2021-12-23T12:28:21.000000Z",
      "isArchived": true,
      "executedById": "string",
      "scheduledStartTime": "2021-12-23T12:28:21.000000Z"
    }
  ],
  "links": {
    "next": {
      "href": "string"
    },
    "prev": {
      "href": "string"
    }
  }
}
Run an automation

Creates a run for a specific automation. Depending on the space the automation belongs to, the requesting user must meet the following requirement:

Private space: be the owner of the automation and have the automations.private scope
Shared space: be editor or operator in shared space and have automations.shared scope.
Facts
	Rate limit	Tier 2 (100 requests per minute)
	Replaces	
POST v1/automations/{id}/runs
Path Parameters
id
string
Required

The unique identifier for the automation.

Request Body
Required

Run object to create

application/json
object
Show application/json properties
Responses
201

Created

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
/api/workflows/automations/{id}/runs
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/workflows/automations/{id}/runs` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/workflows/automations/{id}/runs',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ context: 'api' }),
  },
)
Example Response
{
  "id": "d452d100-9b0b-11ec-b199-8323e1031c3e",
  "error": [
    {}
  ],
  "title": "string",
  "status": "failed",
  "context": "test_run",
  "metrics": {
    "blocks": [
      {
        "type": "endpointBlock",
        "rxBytes": 18329921,
        "txBytes": 18329921,
        "apiCalls": 40,
        "snippetId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
        "endpointId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
        "connectorId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4"
      }
    ],
    "network": {
      "rxBytes": 0,
      "txBytes": 0
    },
    "totalApiCalls": 0
  },
  "ownerId": "string",
  "spaceId": "string",
  "testRun": true,
  "archived": true,
  "stopTime": "2021-12-23T12:28:21.000000Z",
  "createdAt": "2021-12-23T12:28:21.000000Z",
  "isTestRun": true,
  "startTime": "2021-12-23T12:28:21.000000Z",
  "updatedAt": "2021-12-23T12:28:21.000000Z",
  "isArchived": true,
  "executedById": "string",
  "scheduledStartTime": "2021-12-23T12:28:21.000000Z"
}
Get an automation run

Retrieves a specific run for an automation. Depending on the space the automation belongs to, the requesting user must meet the following requirement:

Private space: be the owner of the automation and have the automations.private scope
Shared space: be editor or operator in shared space and have automations.shared scope.
Facts
	Rate limit	Tier 1 (1000 requests per minute)
	Replaces	
GET v1/automations/{id}/runs/{runId}
Path Parameters
id
string
Required

The unique identifier for the automation.

runId
string
Required

The unique identifier for the run.

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
/api/workflows/automations/{id}/runs/{runId}
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/workflows/automations/{id}/runs/{runId}` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/workflows/automations/{id}/runs/{runId}',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "id": "d452d100-9b0b-11ec-b199-8323e1031c3e",
  "error": [
    {}
  ],
  "title": "string",
  "status": "failed",
  "context": "test_run",
  "metrics": {
    "blocks": [
      {
        "type": "endpointBlock",
        "rxBytes": 18329921,
        "txBytes": 18329921,
        "apiCalls": 40,
        "snippetId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
        "endpointId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
        "connectorId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4"
      }
    ],
    "network": {
      "rxBytes": 0,
      "txBytes": 0
    },
    "totalApiCalls": 0
  },
  "ownerId": "string",
  "spaceId": "string",
  "testRun": true,
  "archived": true,
  "stopTime": "2021-12-23T12:28:21.000000Z",
  "createdAt": "2021-12-23T12:28:21.000000Z",
  "isTestRun": true,
  "startTime": "2021-12-23T12:28:21.000000Z",
  "updatedAt": "2021-12-23T12:28:21.000000Z",
  "isArchived": true,
  "executedById": "string",
  "scheduledStartTime": "2021-12-23T12:28:21.000000Z"
}
Export automation run log

Retrieves the URL for the debug log of a specific automation run. Depending on the space the automation belongs to, the requesting user must meet the following requirement:

Private space: be the owner of the automation and have the automations.private scope
Shared space: be editor or operator in shared space and have automations.shared scope.
Facts
	Rate limit	Tier 2 (100 requests per minute)
	Replaces	
POST v1/automations/{id}/runs/{runId}/actions/export
Path Parameters
id
string
Required

The unique identifier for the automation.

runId
string
Required

The unique identifier for the run.

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
/api/workflows/automations/{id}/runs/{runId}/actions/export
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/workflows/automations/{id}/runs/{runId}/actions/export` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/workflows/automations/{id}/runs/{runId}/actions/export',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "url": "https://{tenantname}.{region}.qlikcloud.com/api/workflows/automations/{id}/runs/{runId}/debug"
}
Retry an automation run

Retries a specific run by creating a new run using the same inputs. Depending on the space the automation belongs to, the requesting user must meet the following requirement:

Private space: be the owner of the automation and have the automations.private scope
Shared space: be editor or operator in shared space and have automations.shared scope.
Facts
	Rate limit	Tier 2 (100 requests per minute)
	Replaces	
POST v1/automations/{id}/runs/{runId}/actions/retry
Path Parameters
id
string
Required

The unique identifier for the automation.

runId
string
Required

The unique identifier for the run.

Responses
204

OK Response

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
/api/workflows/automations/{id}/runs/{runId}/actions/retry
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/workflows/automations/{id}/runs/{runId}/actions/retry` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/workflows/automations/{id}/runs/{runId}/actions/retry',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Stop an automation run

Forcefully stops an automation run immediately. Depending on the space the automation belongs to, the requesting user must meet the following requirement:

Private space: be the owner of the automation and have the automations.private scope
Shared space: be editor or operator in shared space and have automations.shared scope.
Facts
	Rate limit	Tier 2 (100 requests per minute)
	Replaces	
POST v1/automations/{id}/runs/{runId}/actions/stop
Path Parameters
id
string
Required

The unique identifier for the automation.

runId
string
Required

The unique identifier for the run.

Responses
204

OK Response

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
/api/workflows/automations/{id}/runs/{runId}/actions/stop
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/workflows/automations/{id}/runs/{runId}/actions/stop` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/workflows/automations/{id}/runs/{runId}/actions/stop',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Get automation run debug log

Retrieves the debug log for a specific run of an automation. Depending on the space the automation belongs to, the requesting user must meet the following requirement:

Private space: be the owner of the automation and have the automations.private scope
Shared space: be editor or operator in shared space and have automations.shared scope.
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
id
string
Required

The unique identifier for the automation.

runId
string
Required

The unique identifier for the run.

Responses
200

OK Response

text/plain
string
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
/api/workflows/automations/{id}/runs/{runId}/debug
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/workflows/automations/{id}/runs/{runId}/debug` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/workflows/automations/{id}/runs/{runId}/debug',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
string
Get automation settings

Retrieves the global automation settings for the tenant.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
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
/api/workflows/automations/settings
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/workflows/automations/settings` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/workflows/automations/settings',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "maxConcurrentRunsPerAutomation": 10
}
Update automation settings

Updates the global automation settings for the tenant.

Facts
	Rate limit	Tier 2 (100 requests per minute)
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
409

Conflict with the current state of the resource

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
/api/workflows/automations/settings
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `PUT /api/workflows/automations/settings` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/workflows/automations/settings',
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      maxConcurrentRunsPerAutomation: 10,
    }),
  },
)
Example Response
{
  "maxConcurrentRunsPerAutomation": 10
}
Get automation usage metrics

Retrieves paginated usage metrics for automations. The requesting user must be assigned the TenantAdmin or AnalyticsAdmin role.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
	Replaces	
GET v1/automations/usage
Query Parameters
filter
string
Required

Indicates how the metrics should be filtered using a SCIM-style expression. Available parameters:

name (specify one or more enums to return specific metrics. Supported enum values: runs, scheduledRuns, triggeredRuns, webhookRuns, duration, bandwidthIn, bandwidthOut)
date (return a metric for a specific date or range of dates, e.g. "2025-08-01")
breakdownBy
string

If specified, result will be broken apart for each automation

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
/api/workflows/automations/usage
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/workflows/automations/usage` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/workflows/automations/usage',
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
      "date": "2021-12-15",
      "name": "bandwidthIn",
      "value": 310179713,
      "automation": {
        "guid": "00000000-0000-0000-0000-000000000000",
        "name": "My Automation.",
        "ownerId": "KP1zJiPDn0gsla236GmETadFcxBW-J8F"
      }
    }
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