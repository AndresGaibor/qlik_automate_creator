---
title: "Data integration projects REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/di-projects/"
local_path: "docs/endpoints/di-projects.md"
---

Title: Data integration projects REST | Qlik Developer Portal


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
Data integration projects
Download OpenAPI spec

Data integration projects are used to group and organize data tasks that move, transform, or prepare data for consumption. These projects can represent data pipelines or replication flows, and are created within spaces.

Overview

The Data integration projects API allows you to automate the three key phases of the project:

Operation: Prepare and validate individual data tasks or entire projects, and run data tasks.
Deployment: Import and export project artifacts, and configure export variables (also known as bindings).
For a step-by-step example, see Deploy a data integration project. To see the supported connectors and their identifiers, refer to Data integration connectors reference.
Monitoring: Track asynchronous action status and task runtime state.
Important

Projects and tasks must currently be created or edited in the Qlik Cloud UI.
The API supports operational, deployment, and monitoring actions once a project has been created.

Workflows and key use cases

The API supports three major workflows, matching the project phases:

Operational endpoints

Manage project and task execution:

Start a project task:
POST /api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/runtime/actions/start

Stop a project task:
POST /api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/runtime/actions/stop

Validate a project:
POST /api/v1/di-projects/{projectId}/actions/validate

Validate a project task:
POST /api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/actions/validate

Prepare a project:
POST /api/v1/di-projects/{projectId}/actions/prepare

Prepare a project task:
POST /api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/actions/prepare

Note

Prepare and validate actions are asynchronous.
Each call returns an actionId, which you can use to poll the Get action status endpoint.

Deployment endpoints

Deploy a project to another space or tenant:

Export a project:
POST /api/v1/di-projects/{projectId}/actions/export

Use the mode request body parameter to select the export format:

MINIMAL (default): YAML format with required and changed settings only. Designed for version-controlled development and code review.
FULL: YAML format with all settings including defaults. Use for inspection and debugging.
LEGACY: JSON format using the previous project structure. Use for backward compatibility with older import workflows.

YAML exports (MINIMAL and FULL) are designed for developer editing. You can modify the YAML files and import the updated package back into Qlik Cloud. For the full YAML editing workflow, see Declarative pipelines.

Note

Legacy (JSON) exports are opaque deployment artifacts and are not intended for direct editing. To create or edit a project using the UI, see Designing your pipeline project.

Get project export variables:
GET /api/v1/di-projects/{projectId}/bindings

Update project export variables:
PUT /api/v1/di-projects/{projectId}/bindings

Create a project:
POST /api/v1/di-projects

Warning

This endpoint creates an empty project in the specified space. Use this only as a container for importing a project, not for manually creating project content.

Import a project:
POST /api/v1/di-projects/{projectId}/actions/import

Note

Project export variables must be set before importing a project.
They apply at import time and don’t dynamically update the UI.

Monitoring endpoints

Retrieve project details, track task state, and monitor asynchronous actions like prepare or validate:

List projects:
GET /api/v1/di-projects

Get a project:
GET /api/v1/di-projects/{projectId}

List project tasks:
GET /api/v1/di-projects/{projectId}/di-tasks

Get a project task:
GET /api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}

Get project task runtime state:
GET /api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/runtime/state

Get action status:
GET /api/v1/di-projects/actions/{actionId}

Endpoints
GET
/api/v1/di-projects
POST
/api/v1/di-projects
GET
/api/v1/di-projects/{projectId}
POST
/api/v1/di-projects/{projectId}/actions/export
POST
/api/v1/di-projects/{projectId}/actions/import
POST
/api/v1/di-projects/{projectId}/actions/import-async
POST
/api/v1/di-projects/{projectId}/actions/prepare
POST
/api/v1/di-projects/{projectId}/actions/validate
GET
/api/v1/di-projects/{projectId}/bindings
PUT
/api/v1/di-projects/{projectId}/bindings
GET
/api/v1/di-projects/{projectId}/di-tasks
GET
/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}
POST
/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/actions/prepare
POST
/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/actions/recreate-datasets
POST
/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/actions/request-reload
POST
/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/actions/validate
POST
/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/runtime/actions/start
POST
/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/runtime/actions/stop
GET
/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/runtime/runs/{runId}/state
GET
/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/runtime/runs/{runId}/state/datasets
POST
/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/runtime/runs/actions/search
GET
/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/runtime/state
GET
/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/runtime/state/datasets
GET
/api/v1/di-projects/actions/{actionId}
POST
/api/v1/di-projects/utils/actions/validate-project-definitions
List projects

List data integration projects.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
spaceId
string

Filter by space id

Responses
200

OK

application/json
object
Show application/json properties
400

Bad Request

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
404

Not Found

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
GET
/api/v1/di-projects
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


await qlik.diProjects.getDiProjects({})
Example Response
{
  "projects": [
    {
      "id": "string",
      "name": "string",
      "type": "DATA_PIPELINE",
      "ownerId": "string",
      "spaceId": "string",
      "description": "string",
      "platformType": "SNOWFLAKE"
    }
  ]
}
Create a new project

Creates a new data integration project in the specified space.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
Required

The details of the project to create

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

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
500

Internal Server Error

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
POST
/api/v1/di-projects
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


await qlik.diProjects.createDiProject({
  cloudStagingConnection:
    'storage-connection-string',
  description:
    'This is a new data integration project.',
  name: 'New Project',
  platformConnection: 'connection-string',
  platformType: 'SNOWFLAKE',
  space: 'space-456',
  type: 'DATA_PIPELINE',
})
Example Response
{
  "id": "string",
  "name": "string",
  "type": "DATA_PIPELINE",
  "ownerId": "string",
  "spaceId": "string",
  "description": "string",
  "platformType": "SNOWFLAKE"
}
Get a project

Get a specific data integration project.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
projectId
string
Required

Identifier of the data project.

Responses
200

OK

application/json
object
Show application/json properties
400

Bad Request

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
404

Not Found

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
GET
/api/v1/di-projects/{projectId}
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/v1/di-projects/{projectId}` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/v1/di-projects/{projectId}',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "id": "string",
  "name": "string",
  "type": "DATA_PIPELINE",
  "ownerId": "string",
  "spaceId": "string",
  "description": "string",
  "platformType": "SNOWFLAKE"
}
Export a project

Exports the specified data integration project.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Header Parameters
Accept
string

Optional; only 'application/octet-stream' is supported.

Can be one of: "application/octet-stream"

Path Parameters
projectId
string
Required

Identifier of the data project.

Request Body

Options for the export process

application/json
object
Show application/json properties
Responses
200

OK

application/octet-stream
string

format = "binary"

400

Bad Request

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
404

Not Found

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
500

Internal Server Error

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
POST
/api/v1/di-projects/{projectId}/actions/export
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


await qlik.diProjects.exportDiProject(
  '65424a71c11367914c1e659b',
  {},
)
Import a project (JSON zip)

Imports a data integration project synchronously from a legacy JSON-based .zip file. This endpoint only accepts zips that contain JSON project files (the legacy format). The import is processed synchronously and completes before the response is returned. Submitting a YAML-based zip to this endpoint returns 400. To import a YAML-based zip, use POST /di-projects/{projectId}/actions/import-async instead.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
projectId
string
Required

Identifier of the data project.

Request Body
Required

The ZIP file containing the JSON-based project to import.

multipart/form-data
object
Show multipart/form-data properties
Responses
200

OK — the JSON-based project was imported successfully.

application/json
object
400

Bad Request — for example, if a YAML-based zip is submitted to this endpoint.

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
404

Not Found

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
409

Conflict

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
500

Internal Server Error

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
POST
/api/v1/di-projects/{projectId}/actions/import
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'
import { readFileSync } from 'node:fs'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.diProjects.importDiProject(
  '65424a71c11367914c1e659b',
  {
    zip: new Uint8Array(
      readFileSync('<file-path>'),
    ),
  },
)
Example Response
{}
Import a project asynchronously

Imports a data integration project from a .zip file and returns an action identifier for tracking the background import operation. Accepts both JSON-based (legacy) and YAML-based project formats, making it the recommended endpoint for deploying YAML-defined pipeline definitions programmatically. Poll the import status using GET /di-projects/actions/{actionId}.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
projectId
string
Required

Identifier of the data project.

Request Body
Required

A .zip file containing the project to import. Accepts both JSON-based (legacy) and YAML-based formats.

multipart/form-data
object
Show multipart/form-data properties
Responses
202

The project import has started. Poll the returned actionId using GET /di-projects/actions/{actionId} to track progress.

application/json
object
Show application/json properties
400

Bad Request

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
404

Not Found

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
409

Conflict

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
500

Internal Server Error

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
POST
/api/v1/di-projects/{projectId}/actions/import-async
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/v1/di-projects/{projectId}/actions/import-async` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/v1/di-projects/{projectId}/actions/import-async',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "actionId": "action-123456"
}
Prepare a project

Prepares the data integration project and its tasks for execution.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
projectId
string
Required

Identifier of the data project.

Request Body
Required
application/json
object
Show application/json properties
Responses
202

Preparation started

application/json
object
Show application/json properties
400

Invalid request

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
404

Project not found

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
POST
/api/v1/di-projects/{projectId}/actions/prepare
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


await qlik.diProjects.prepareDiProject(
  '65424a71c11367914c1e659b',
  { selectedTasks: [{ taskId: 'string' }] },
)
Example Response
{
  "actionId": "action-123456"
}
Validate project

Validates the data integration project and its tasks.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
projectId
string
Required

Identifier of the data project.

Request Body
Required
application/json
object
Show application/json properties
Responses
202

Validation started

application/json
object
Show application/json properties
400

Invalid request

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
404

Project not found

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
POST
/api/v1/di-projects/{projectId}/actions/validate
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


await qlik.diProjects.validateDiProject(
  '65424a71c11367914c1e659b',
  { selectedTasks: [{ taskId: 'string' }] },
)
Example Response
{
  "actionId": "action-123456"
}
Get project export variables

Retrieves the export variables for a specific data integration project.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
recalculate
boolean

Recalculate the bindings if true, otherwise saved bindings are returned.

default = true

Path Parameters
projectId
string
Required

Identifier of the data project.

Responses
200

OK

application/json
object
Show application/json properties
400

Bad Request

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
404

Not Found

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
GET
/api/v1/di-projects/{projectId}/bindings
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


await qlik.diProjects.getDiProjectExportVariables(
  '65424a71c11367914c1e659b',
  {},
)
Example Response
{
  "variables": {},
  "nameToIdMap": {}
}
Update project export variables

Updates the export variables for a specific data integration project.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
projectId
string
Required

Identifier of the data project.

Request Body
Required

The details of the export variables to update

application/json
object
Show application/json properties
Responses
200

OK

application/json
object
400

Bad Request

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
404

Not Found

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
500

Internal Server Error

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
PUT
/api/v1/di-projects/{projectId}/bindings
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


await qlik.diProjects.setDiProjectExportVariables(
  '65424a71c11367914c1e659b',
  { variables: {} },
)
Example Response
{}
List project tasks

Lists data tasks within a given data integration project.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
projectId
string
Required

Identifier of the data project.

Responses
200

OK

application/json
object
Show application/json properties
400

Bad Request

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
404

Not Found

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
GET
/api/v1/di-projects/{projectId}/di-tasks
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


await qlik.diProjects.getDiProjectDiTasks(
  '65424a71c11367914c1e659b',
)
Example Response
{
  "dataTasks": [
    {
      "id": "string",
      "name": "string",
      "type": "LANDING",
      "ownerId": "string",
      "spaceId": "string",
      "description": "string"
    }
  ]
}
Get a project task

Get a specific data task within a project.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
dataTaskId
string
Required

Identifier of the data task.

projectId
string
Required

Identifier of the data project.

Responses
200

OK

application/json
object
Show application/json properties
400

Bad Request

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
404

Not Found

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
GET
/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}
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


await qlik.diProjects.getDiProjectDiTask(
  '65424a71c11367914c1e659b',
  'task-cYSY',
)
Example Response
{
  "id": "string",
  "name": "string",
  "type": "LANDING",
  "ownerId": "string",
  "spaceId": "string",
  "description": "string"
}
Prepare a project task

Prepares the specified data task for execution.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
dataTaskId
string
Required

Identifier of the data task.

projectId
string
Required

Identifier of the data project.

Request Body
application/json
object
Show application/json properties
Responses
202

Preparation started

application/json
object
Show application/json properties
400

Invalid request

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
404

Task not found

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
POST
/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/actions/prepare
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


await qlik.diProjects.prepareDiProjectDiTask(
  '65424a71c11367914c1e659b',
  'task-cYSY',
  {},
)
Example Response
{
  "actionId": "action-123456"
}
Recreate task datasets

Recreates datasets in the specified data task.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
dataTaskId
string
Required

Identifier of the data task.

projectId
string
Required

Identifier of the data project.

Request Body
application/json
object

Request body to recreate task datasets.

Responses
202

Started recreating datasets

application/json
object
Show application/json properties
400

Invalid request

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
404

Task or project not found

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
POST
/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/actions/recreate-datasets
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/actions/recreate-datasets` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/actions/recreate-datasets',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  },
)
Example Response
{
  "actionId": "action-123456"
}
Request dataset reload

Registers a request to reload the datasets associated with the specified data task. The reload does not occur immediately; it will take effect on the next scheduled or manual run of the task.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
dataTaskId
string
Required

Identifier of the data task.

projectId
string
Required

Identifier of the data project.

Request Body
Required
application/json
object
Show application/json properties
Responses
200

Reload request registered.

application/json
object

Indicates whether the reload request was registered successfully.

Show application/json properties
400

Bad Request

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
404

Not Found

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
POST
/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/actions/request-reload
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/actions/request-reload` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/actions/request-reload',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      reloadStrategy: 'NONE',
      selectedDatasets: [{ datasetId: 'string' }],
    }),
  },
)
Example Response
{
  "success": true
}
Validate a project task

Validates the specified data task.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
dataTaskId
string
Required

Identifier of the data task.

projectId
string
Required

Identifier of the data project.

Request Body
application/json
object

Request body for task validation

Responses
202

Validation started

application/json
object
Show application/json properties
400

Invalid request

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
404

Task not found

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
POST
/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/actions/validate
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


await qlik.diProjects.validateDiProjectDiTask(
  '65424a71c11367914c1e659b',
  'task-cYSY',
  {},
)
Example Response
{
  "actionId": "action-123456"
}
Start a project task

Start a data task on a data integration project.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
dataTaskId
string
Required

Identifier of the data task.

projectId
string
Required

Identifier of the data project.

Request Body
application/json
object
Show application/json properties
Responses
204

NO CONTENT

400

Bad Request

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
404

Not Found

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
POST
/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/runtime/actions/start
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


await qlik.diProjects.startDiProjectDiTaskRuntime(
  '65424a71c11367914c1e659b',
  'task-cYSY',
)
Stop a project task

Stop a data task on a data integration project.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
dataTaskId
string
Required

Identifier of the data task.

projectId
string
Required

Identifier of the data project.

Responses
204

NO CONTENT

400

Bad Request

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
404

Not Found

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
POST
/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/runtime/actions/stop
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


await qlik.diProjects.stopDiProjectDiTaskRuntime(
  '65424a71c11367914c1e659b',
  'task-cYSY',
)
Get run state

Returns the state of a specific historical run instance for a data task, including execution progress and any errors encountered.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
dataTaskId
string
Required

Identifier of the data task.

projectId
string
Required

Identifier of the data project.

runId
string
Required

Identifier of the run instance.

Responses
200

Run execution state retrieved successfully.

application/json
object

Represents the current or historical execution state of a data task, including progress information, error details, and dataset-level statistics.

Show application/json properties
400

Invalid request or missing parameters.

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
404

Task run not found.

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
GET
/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/runtime/runs/{runId}/state
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/runtime/runs/{runId}/state` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/runtime/runs/{runId}/state',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "name": "string",
  "type": "LANDING",
  "lastRun": {
    "state": "STARTING",
    "errors": [
      {
        "code": "string",
        "title": "string",
        "detail": "string",
        "source": {
          "pointer": "string",
          "parameter": "string"
        },
        "status": 42
      }
    ],
    "endTime": "2018-10-30T07:06:22Z",
    "general": {
      "gatewayId": "string",
      "gatewayName": "string",
      "datasetCount": 42,
      "gatewayTaskName": "string",
      "dataTaskUpdatedTo": "2018-10-30T07:06:22Z",
      "lakehouseClusterId": "string",
      "liveViewsUpdatedTo": "2018-10-30T07:06:22Z",
      "datasetsInErrorCount": 42,
      "lakehouseClusterName": "string"
    },
    "message": "string",
    "traceId": "string",
    "duration": "string",
    "fullLoad": {
      "errorCount": 42,
      "queuedCount": 42,
      "loadingCount": 42,
      "completedCount": 42
    },
    "cdcStatus": {
      "latency": "01:30:45",
      "totalProcessedCount": 42,
      "applyingChangesCount": 42,
      "incomingChangesCount": 42,
      "accumulatingChangesCount": 42,
      "throughputInKilobytesPerSecond": 42
    },
    "startTime": "2018-10-30T07:06:22Z",
    "streaming": {
      "latency": "string",
      "errorCount": 42,
      "queuedCount": 42,
      "runningCount": 42,
      "totalProcessedCount": 42
    },
    "lastBatchOfChanges": {
      "relatesToRecordsTo": "2018-10-30T07:06:22Z",
      "totalProcessedCount": 42,
      "relatesToRecordsFrom": "2018-10-30T07:06:22Z",
      "throughputInRecordsPerSecond": 42
    }
  },
  "runReadiness": {
    "state": "READY_TO_RUN",
    "message": "string"
  }
}
List run dataset states

Returns dataset-level state for a specific historical run instance of a data task. All datasets for the run are returned in a single response; this endpoint does not paginate.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
dataTaskId
string
Required

Identifier of the data task.

projectId
string
Required

Identifier of the data project.

runId
string
Required

Identifier of the run instance.

Responses
200

Dataset-level state for the specified run instance retrieved successfully.

application/json
object
Show application/json properties
400

Invalid request or missing parameters.

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
404

Task run not found.

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
410

Gone — the dataset state for this run has been purged due to retention policy.

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
413

Payload Too Large — the dataset state for this run exceeds the per-response size limit. This is a soft guard against pathologically large tasks; if you hit this consistently, contact support.

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
GET
/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/runtime/runs/{runId}/state/datasets
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/runtime/runs/{runId}/state/datasets` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/runtime/runs/{runId}/state/datasets',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "datasets": [
    {
      "name": "string",
      "fullLoad": {
        "state": "QUEUED",
        "endTime": "2018-10-30T07:06:22Z",
        "message": "string",
        "duration": "string",
        "fileStats": {
          "volume": "string",
          "processedCount": 42
        },
        "startTime": "2018-10-30T07:06:22Z",
        "cachedChangesCount": 42,
        "failedRecordsCount": 42,
        "totalProcessedCount": 42
      },
      "cdcStatus": {
        "state": "QUEUED",
        "message": "string",
        "ddlCount": 42,
        "deleteCount": 42,
        "insertCount": 42,
        "updateCount": 42,
        "lastProcessed": "2018-10-30T07:06:22Z",
        "totalProcessedCount": 42,
        "incomingChangesCount": 42,
        "unoptimizedRecordsCount": 42
      },
      "datasetId": "string",
      "streaming": {
        "state": "QUEUED",
        "message": "string",
        "lastProcessed": "2018-10-30T07:06:22Z",
        "parseIssueCount": 42,
        "recordsWrittenCount": 42,
        "totalProcessedCount": 42,
        "recordsFilteredCount": 42,
        "unoptimizedRecordsCount": 42
      },
      "sourceName": "string",
      "dataReadiness": "READY",
      "lastBatchOfChanges": {
        "state": "QUEUED",
        "endTime": "2018-10-30T07:06:22Z",
        "message": "string",
        "duration": "string",
        "fileStats": {
          "volume": "string",
          "processedCount": 42
        },
        "startTime": "2018-10-30T07:06:22Z",
        "operationStats": {
          "deleteCount": 42,
          "failedCount": 42,
          "insertCount": 42,
          "updateCount": 42
        },
        "totalProcessedCount": 42,
        "throughputInRecordsPerSecond": 42
      }
    }
  ]
}
Search task run history

Returns a paginated list of historical run instances for the specified data task, filtered by the provided criteria.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
dataTaskId
string
Required

Identifier of the data task.

projectId
string
Required

Identifier of the data project.

Request Body
Required

Search criteria and pagination options for task run history query.

application/json
object

Request parameters for searching task run history, including filter criteria and pagination options.

Show application/json properties
Responses
200

Search results retrieved successfully.

application/json
object
Show application/json properties
400

Invalid request. Check parameter formats and filter syntax.

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
404

Project or task not found.

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
POST
/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/runtime/runs/actions/search
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/runtime/runs/actions/search` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/runtime/runs/actions/search',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      limit: 50,
      lastId:
        'caf50cbf-d6f8-47c6-a5e0-b31e0d11102a',
      filters: [
        {
          field: 'STATUS',
          value: ['COMPLETED', 'FAILED'],
          operator: 'IN',
        },
        {
          field: 'PERIOD',
          value: [
            '2024-03-01T00:00:00Z',
            '2024-03-31T23:59:59Z',
          ],
          operator: 'BETWEEN',
        },
      ],
    }),
  },
)
Example Response
{
  "runs": [
    {
      "runId": "caf50cbf-d6f8-47c6-a5e0-b31e0d11102a",
      "status": "STARTING",
      "endTime": "2024-03-01T09:30:00Z",
      "duration": "00:30:00",
      "startTime": "2024-03-01T09:00:00Z",
      "subStatus": "string",
      "errorMessage": "",
      "datasetsCount": 10,
      "originSubStatus": "string",
      "datasetsErrorCount": 0
    }
  ],
  "lastId": "caf50cbf-d6f8-47c6-a5e0-b31e0d11102a",
  "nextPageExists": true
}
Get project task runtime state

Get the current runtime state of a data task

Facts
	Rate limit	Special (120 requests per minute)
Path Parameters
dataTaskId
string
Required

Identifier of the data task.

projectId
string
Required

Identifier of the data project.

Responses
200

OK

application/json
object

Represents the current or historical execution state of a data task, including progress information, error details, and dataset-level statistics.

Show application/json properties
400

Bad Request

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
404

Not Found

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
GET
/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/runtime/state
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


await qlik.diProjects.getDiProjectDiTaskRuntimeState(
  '65424a71c11367914c1e659b',
  'task-cYSY',
)
Example Response
{
  "name": "string",
  "type": "LANDING",
  "lastRun": {
    "state": "STARTING",
    "errors": [
      {
        "code": "string",
        "title": "string",
        "detail": "string",
        "source": {
          "pointer": "string",
          "parameter": "string"
        },
        "status": 42
      }
    ],
    "endTime": "2018-10-30T07:06:22Z",
    "general": {
      "gatewayId": "string",
      "gatewayName": "string",
      "datasetCount": 42,
      "gatewayTaskName": "string",
      "dataTaskUpdatedTo": "2018-10-30T07:06:22Z",
      "lakehouseClusterId": "string",
      "liveViewsUpdatedTo": "2018-10-30T07:06:22Z",
      "datasetsInErrorCount": 42,
      "lakehouseClusterName": "string"
    },
    "message": "string",
    "traceId": "string",
    "duration": "string",
    "fullLoad": {
      "errorCount": 42,
      "queuedCount": 42,
      "loadingCount": 42,
      "completedCount": 42
    },
    "cdcStatus": {
      "latency": "01:30:45",
      "totalProcessedCount": 42,
      "applyingChangesCount": 42,
      "incomingChangesCount": 42,
      "accumulatingChangesCount": 42,
      "throughputInKilobytesPerSecond": 42
    },
    "startTime": "2018-10-30T07:06:22Z",
    "streaming": {
      "latency": "string",
      "errorCount": 42,
      "queuedCount": 42,
      "runningCount": 42,
      "totalProcessedCount": 42
    },
    "lastBatchOfChanges": {
      "relatesToRecordsTo": "2018-10-30T07:06:22Z",
      "totalProcessedCount": 42,
      "relatesToRecordsFrom": "2018-10-30T07:06:22Z",
      "throughputInRecordsPerSecond": 42
    }
  },
  "runReadiness": {
    "state": "READY_TO_RUN",
    "message": "string"
  }
}
List runtime dataset states

Returns dataset-level runtime state for a data task

Facts
	Rate limit	Special (120 requests per minute)
Path Parameters
dataTaskId
string
Required

Identifier of the data task.

projectId
string
Required

Identifier of the data project.

Responses
200

Returns all datasets for the specified data task

application/json
object
Show application/json properties
400

Bad Request

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
404

Not Found

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
GET
/api/v1/di-projects/{projectId}/di-tasks/{dataTaskId}/runtime/state/datasets
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


await qlik.diProjects.getDiProjectDiTaskRuntimeStateDatasets(
  'string',
  'string',
)
Example Response
{
  "datasets": [
    {
      "name": "string",
      "fullLoad": {
        "state": "QUEUED",
        "endTime": "2018-10-30T07:06:22Z",
        "message": "string",
        "duration": "string",
        "fileStats": {
          "volume": "string",
          "processedCount": 42
        },
        "startTime": "2018-10-30T07:06:22Z",
        "cachedChangesCount": 42,
        "failedRecordsCount": 42,
        "totalProcessedCount": 42
      },
      "cdcStatus": {
        "state": "QUEUED",
        "message": "string",
        "ddlCount": 42,
        "deleteCount": 42,
        "insertCount": 42,
        "updateCount": 42,
        "lastProcessed": "2018-10-30T07:06:22Z",
        "totalProcessedCount": 42,
        "incomingChangesCount": 42,
        "unoptimizedRecordsCount": 42
      },
      "datasetId": "string",
      "streaming": {
        "state": "QUEUED",
        "message": "string",
        "lastProcessed": "2018-10-30T07:06:22Z",
        "parseIssueCount": 42,
        "recordsWrittenCount": 42,
        "totalProcessedCount": 42,
        "recordsFilteredCount": 42,
        "unoptimizedRecordsCount": 42
      },
      "sourceName": "string",
      "dataReadiness": "READY",
      "lastBatchOfChanges": {
        "state": "QUEUED",
        "endTime": "2018-10-30T07:06:22Z",
        "message": "string",
        "duration": "string",
        "fileStats": {
          "volume": "string",
          "processedCount": 42
        },
        "startTime": "2018-10-30T07:06:22Z",
        "operationStats": {
          "deleteCount": 42,
          "failedCount": 42,
          "insertCount": 42,
          "updateCount": 42
        },
        "totalProcessedCount": 42,
        "throughputInRecordsPerSecond": 42
      }
    }
  ]
}
Get Action status

Retrieves the status of an asynchronous operation.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
detailed
boolean

Specifies whether to include detailed status information in the response. Set to true to return detailed information.

default = false

Path Parameters
actionId
string
Required

Identifier of the action.

Responses
200

OK

application/json
object
Show application/json properties
404

Action not found

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
GET
/api/v1/di-projects/actions/{actionId}
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


await qlik.diProjects.getDiProject(
  'action-123456',
  {},
)
Example Response
{
  "name": "Prepare project myspace.demoproject",
  "type": "PROJECT_PREPARE",
  "error": {
    "code": "string",
    "details": "string",
    "message": "string"
  },
  "state": "PENDING",
  "endTime": "2018-10-30T07:06:22Z",
  "startTime": "2018-10-30T07:06:22Z",
  "taskDetails": [
    {
      "info": "string",
      "name": "string",
      "error": {
        "code": "string",
        "details": "string",
        "message": "string"
      },
      "state": "PENDING",
      "taskId": "string"
    }
  ],
  "taskProgress": {
    "failed": 42,
    "pending": 42,
    "skipped": 42,
    "canceled": 42,
    "completed": 42,
    "executing": 42
  }
}
Validate project definitions

Validates the project definition files in a .zip and returns a structured report of warnings and errors. The validation runs synchronously and completes before the response is returned. Use this operation before importing with POST /di-projects/{projectId}/actions/import-async to confirm that YAML-based pipeline definitions are correct.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
Required

A .zip file containing the project definition files to validate.

multipart/form-data
object
Show multipart/form-data properties
Responses
200

Validation completed. The response contains a report of warnings and errors found in the project definitions.

application/json
object
Show application/json properties
400

Bad Request

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
404

Not Found

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
500

Internal Server Error

application/json
object

Standard error response wrapper containing one or more error details and a trace ID for diagnostics.

Show application/json properties
POST
/api/v1/di-projects/utils/actions/validate-project-definitions
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/v1/di-projects/utils/actions/validate-project-definitions` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/v1/di-projects/utils/actions/validate-project-definitions',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "reports": [
    {
      "path": "string",
      "level": "WARNING",
      "reason": "string"
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