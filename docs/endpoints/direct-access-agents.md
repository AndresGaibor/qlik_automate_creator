---
title: "Direct Access Agents REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/direct-access-agents/"
local_path: "docs/endpoints/direct-access-agents.md"
---

Title: Direct Access Agents REST | Qlik Developer Portal


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
Direct Access Agents
Download OpenAPI spec

API for remotely managing configuration settings of Direct Access Gateway agents. Available to users with the Tenant Admin role in Direct Access Gateway v1.7.2+.

Endpoints
POST
/api/v1/direct-access-agents/{agentId}/actions/{agentAction}
POST
/api/v1/direct-access-agents/{agentId}/benchmarks
GET
/api/v1/direct-access-agents/{agentId}/benchmarks/{benchmarkId}
POST
/api/v1/direct-access-agents/{agentId}/benchmarks/{benchmarkId}/cancel
GET
/api/v1/direct-access-agents/{agentId}/configurations
PATCH
/api/v1/direct-access-agents/{agentId}/configurations
GET
/api/v1/direct-access-agents/{agentId}/connectors/{connectorType}/files
GET
/api/v1/direct-access-agents/{agentId}/connectors/{connectorType}/files/{fileType}
PUT
/api/v1/direct-access-agents/{agentId}/connectors/{connectorType}/files/{fileType}
GET
/api/v1/direct-access-agents/{agentId}/connectors/file-connector/files/allowed-paths
PUT
/api/v1/direct-access-agents/{agentId}/connectors/file-connector/files/allowed-paths
GET
/api/v1/direct-access-agents/{agentId}/connectors/odbc-connector/files/custom-data-type-mappings
PUT
/api/v1/direct-access-agents/{agentId}/connectors/odbc-connector/files/custom-data-type-mappings
GET
/api/v1/direct-access-agents/{agentId}/tools/metrics-collector/configuration
PUT
/api/v1/direct-access-agents/{agentId}/tools/metrics-collector/configuration
Restart an agent

Restarts the specified agent. If a reload is in RELOADING status the restart action will be ignored. Use force-restart to restart the agent even if a reload is in RELOADING status. Requestor must be assigned the TenantAdmin role and needs to be either a Gateway's space owner or a member in the Gateway's space with Can Consume Data role. Available in Direct Access Gateway V1.7.2+.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
agentAction
string
Required

The type of action to perform. Permitted values are restart (will not restart the agent if a reload is in RELOADING status) and force-restart (will restart the agent even if a reload is in RELOADING status).

agentId
string
Required

The agent ID

Responses
204

Service restarted successfully.

400

Error restarting the service.

application/json
object
Show application/json properties
403

The requestor does not have the required permissions for the gateway's space.

application/json
object
Show application/json properties
404

Service doesn't exist.

application/json
object
Show application/json properties
409

Conflict

application/json
object
Show application/json properties
500

Internal Server Error

application/json
object
Show application/json properties
POST
/api/v1/direct-access-agents/{agentId}/actions/{agentAction}
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


await qlik.directAccessAgents.restartDirectAccessAgent(
  'string',
  'string',
)
Start agent benchmark

Starts a background benchmark task to measure the performance of a Direct Access agent. Use this endpoint to evaluate agent throughput and latency for capacity planning and performance optimization. Requestor must be assigned the TenantAdmin role and needs to be either a Gateway's space owner or a member in the Gateway's space with Can Consume Data role. Available in Direct Access Gateway V1.7.8+.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Query Parameters
force
boolean

Forces the benchmark to start regardless of the state of the agent. Does not override QCS resource limits. Use with caution.

default = false

gigaBytesToTransfer
integer

The volume of data in GB to transfer during the throughput measurement part of the benchmark.

default = 1, format = int32, default = 1

Path Parameters
agentId
string
Required

The agent ID

Responses
201

Benchmark task created successfully with a unique identifier.

application/json
object
Show application/json properties
403

The requestor does not have the required permissions for the gateway's space.

application/json
object
Show application/json properties
404

The agent was not found.

application/json
object
Show application/json properties
500

There was an error processing the request.

application/json
object
Show application/json properties
501

All or part of the request has not yet been implemented.

application/json
object
Show application/json properties
503

Service is unavailable.

application/json
object
Show application/json properties
POST
/api/v1/direct-access-agents/{agentId}/benchmarks
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/v1/direct-access-agents/{agentId}/benchmarks` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/v1/direct-access-agents/{agentId}/benchmarks',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "benchmarkId": "string"
}
Get benchmark status

Retrieves the current status and progress of a running or completed benchmark task. Use this endpoint to monitor benchmark execution and retrieve performance metrics once the task is completed. Requestor must be assigned the TenantAdmin role and needs to be either a Gateway's space owner or a member in the Gateway's space with Can Consume Data role. Available in Direct Access Gateway V1.7.8+.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
agentId
string
Required

The agent ID

benchmarkId
string
Required

The benchmark ID

Responses
200

Benchmark status and performance metrics retrieved successfully.

application/json
object
Show application/json properties
403

The requestor does not have the required permissions for the gateway's space.

application/json
object
Show application/json properties
404

The benchmark was not found.

application/json
object
Show application/json properties
500

There was an error processing the request.

application/json
object
Show application/json properties
503

Service is unavailable.

application/json
object
Show application/json properties
GET
/api/v1/direct-access-agents/{agentId}/benchmarks/{benchmarkId}
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/v1/direct-access-agents/{agentId}/benchmarks/{benchmarkId}` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/v1/direct-access-agents/{agentId}/benchmarks/{benchmarkId}',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "status": "string",
  "results": {
    "latency": 42,
    "throughput": 42,
    "totalBytesTransferred": 42,
    "dataTransmissionEndTime": "string",
    "dataTransmissionStartTime": "string"
  },
  "benchmarkId": "string",
  "statusMessage": "string",
  "benchmarkEndTime": "string",
  "benchmarkStartTime": "string",
  "totalBytesRequested": 42
}
Requests a cancellation on a running benchmark

Requests a cancellation on a running benchmark by id for the specified agent. Requestor must be assigned the TenantAdmin role and needs to be either a Gateway's space owner or a member in the Gateway's space with Can Consume Data role. Available in Direct Access Gateway V1.7.8+.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
agentId
string
Required

The agent ID

benchmarkId
string
Required

The benchmark ID

Responses
202

The cancellation was requested successfully.

application/json
object
Show application/json properties
403

The requestor does not have the required permissions for the gateway's space.

application/json
object
Show application/json properties
404

The benchmark was not found.

application/json
object
Show application/json properties
500

There was an error processing the request.

application/json
object
Show application/json properties
503

Service is unavailable.

application/json
object
Show application/json properties
POST
/api/v1/direct-access-agents/{agentId}/benchmarks/{benchmarkId}/cancel
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/v1/direct-access-agents/{agentId}/benchmarks/{benchmarkId}/cancel` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/v1/direct-access-agents/{agentId}/benchmarks/{benchmarkId}/cancel',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "message": "string",
  "statusUrl": {
    "href": "string"
  }
}
Get agent configuration

Retrieves the connector agent configuration from the specified agent. Requestor must be assigned the TenantAdmin role and needs to be either a Gateway's space owner or a member in the Gateway's space with Can Consume Data role. Available in Direct Access Gateway V1.7.2+.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
queryProperties
array of strings

Individual properties within the agent configuration

Path Parameters
agentId
string
Required

The agent ID

Responses
200

The dictionary of key/value pairs retrieved from the configuration file.

application/json
object
Show application/json properties
403

The requestor does not have the required permissions for the gateway's space.

application/json
object
Show application/json properties
404

Configuration file not found.

application/json
object
Show application/json properties
GET
/api/v1/direct-access-agents/{agentId}/configurations
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


await qlik.directAccessAgents.getDirectAccessAgentConfiguration(
  'string',
  {},
)
Example Response
{
  "connectors": [
    {
      "settings": [
        {
          "name": "string",
          "value": "string",
          "connector": "string",
          "uiActions": [
            "Read"
          ],
          "apiActions": [
            "Read"
          ],
          "description": "string",
          "displayName": "string",
          "defaultValue": "string",
          "pendingValue": "string",
          "permittedRangeEnd": 42,
          "pendingApplication": true,
          "allowMultipleValues": true,
          "applyWithoutRestart": true,
          "permittedRangeStart": 42
        }
      ],
      "connectorName": "string"
    }
  ],
  "dcaasSettings": [
    {
      "name": "string",
      "value": "string",
      "connector": "string",
      "uiActions": [
        "Read"
      ],
      "apiActions": [
        "Read"
      ],
      "description": "string",
      "displayName": "string",
      "defaultValue": "string",
      "pendingValue": "string",
      "permittedRangeEnd": 42,
      "pendingApplication": true,
      "allowMultipleValues": true,
      "applyWithoutRestart": true,
      "permittedRangeStart": 42
    }
  ],
  "connectorAgentSettings": [
    {
      "name": "string",
      "value": "string",
      "connector": "string",
      "uiActions": [
        "Read"
      ],
      "apiActions": [
        "Read"
      ],
      "description": "string",
      "displayName": "string",
      "defaultValue": "string",
      "pendingValue": "string",
      "permittedRangeEnd": 42,
      "pendingApplication": true,
      "allowMultipleValues": true,
      "applyWithoutRestart": true,
      "permittedRangeStart": 42
    }
  ]
}
Update agent configuration

Makes changes to the local agent configuration using JSON Patch. Requestor must be assigned the TenantAdmin role and needs to be either a Gateway's space owner or a member in the Gateway's space with Can Consume Data role. Available in Direct Access Gateway V1.7.2+.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
agentId
string
Required

The agent ID

Request Body

The JSON Patch document

application/json
array of objects
Show application/json properties

The JSON Patch document

application/json-patch+json
array of objects
Show application/json-patch+json properties
Responses
204

Patch applied.

207

Patch applied, validation results show success or failure of each individual patch operation.

application/json
object
Show application/json properties
400

Bad request.

application/json
object
Show application/json properties
403

The requestor does not have the required permissions for the gateway's space.

application/json
object
Show application/json properties
404

Configuration file not found.

application/json
object
Show application/json properties
415

Unsupported content-type. This endpoint must include application/json as a valid content-type for API compliance, but C# JsonPatchDocument doesn't support it. Requests must use application/json-patch+json.

application/json
object
Show application/json properties
PATCH
/api/v1/direct-access-agents/{agentId}/configurations
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


await qlik.directAccessAgents.patchDirectAccessAgentConfiguration(
  'string',
  [
    {
      op: 'add',
      path: 'AGENT_LOG_LEVEL',
      value: 'string',
    },
  ],
)
Example Response
{
  "data": [
    {
      "valid": true,
      "operation": {
        "op": "add",
        "path": "AGENT_LOG_LEVEL",
        "value": "string"
      },
      "validationResult": "string"
    }
  ],
  "errorMessage": "string",
  "httpStatusCode": 42,
  "failedPatchError": {
    "errors": [
      {
        "code": "string",
        "title": "string",
        "detail": "string"
      }
    ],
    "traceId": "string",
    "hasErrors": true
  }
}
Get connector configuration files

Retrieves the configuration files associated with the connector. Requestor must be assigned the TenantAdmin role and needs to be either a Gateway's space owner or a member in the Gateway's space with Can Consume Data role. Available in Direct Access Gateway V1.7.4+.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
agentId
string
Required

The agent ID

connectorType
string
Required

The connector to retrieve the list of files for

Can be one of: "file-connector""rest-connector""odbc-connector"

Responses
200

The list of files for the specified connector.

application/json
object
Show application/json properties
403

The requestor does not have the required permissions for the gateway's space.

application/json
object
Show application/json properties
404

Configuration file not found.

application/json
object
Show application/json properties
GET
/api/v1/direct-access-agents/{agentId}/connectors/{connectorType}/files
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


await qlik.directAccessAgents.getDirectAccessAgentConnectorFilesWithoutQuery(
  'string',
  'file-connector',
)
Example Response
{
  "result": [
    "string"
  ],
  "errorMessage": {
    "errors": [
      {
        "code": "string",
        "title": "string",
        "detail": "string"
      }
    ],
    "traceId": "string",
    "hasErrors": true
  }
}
Get connector configuration

Retrieves the configuration items in the flat file for the specified connector. Requestor must be assigned the TenantAdmin role and needs to be either a Gateway's space owner or a member in the Gateway's space with Can Consume Data role. Available in Direct Access Gateway V1.7.4+.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
agentId
string
Required

The agent ID

connectorType
string
Required

The connector type to retrieve

Can be one of: "file-connector""rest-connector""odbc-connector"

fileType
string
Required

The type of file to retrieve

Can be one of: "CustomTypesMapping""PlainTextConfiguration""AllowedPaths""AllowedDrivers""AllowedDsns"

Responses
200

The list of configuration values from the file.

application/json
object
Show application/json properties
403

The requestor does not have the required permissions for the gateway's space.

application/json
object
Show application/json properties
404

Configuration file not found.

application/json
object
Show application/json properties
GET
/api/v1/direct-access-agents/{agentId}/connectors/{connectorType}/files/{fileType}
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


await qlik.directAccessAgents.getDirectAccessAgentConnectorFile(
  'string',
  'file-connector',
  'CustomTypesMapping',
)
Example Response
{
  "result": [
    "string"
  ],
  "errorMessage": {
    "errors": [
      {
        "code": "string",
        "title": "string",
        "detail": "string"
      }
    ],
    "traceId": "string",
    "hasErrors": true
  }
}
Set connector configuration

Completely replaces the contents of the connector's configuration file. Partial updates are not supported. Requestor must be assigned the TenantAdmin role and needs to be either a Gateway's space owner or a member in the Gateway's space with Can Consume Data role. Available in Direct Access Gateway V1.7.4+.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
agentId
string
Required

The agent ID

connectorType
string
Required

The connector type to update

Can be one of: "file-connector""rest-connector""odbc-connector"

fileType
string
Required

The file type to update

Can be one of: "CustomTypesMapping""PlainTextConfiguration""AllowedPaths""AllowedDrivers""AllowedDsns"

Request Body

The contents of the file to be updated

application/json
object

The request to update a connector flat file

Show application/json properties
Responses
204

Updated.

400

Bad request.

application/json
object
Show application/json properties
404

Configuration file not found.

application/json
object
Show application/json properties
409

Conflict.

application/json
object
Show application/json properties
PUT
/api/v1/direct-access-agents/{agentId}/connectors/{connectorType}/files/{fileType}
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


await qlik.directAccessAgents.updateDirectAccessAgentConnectorFileWithoutQuery(
  'string',
  'file-connector',
  'CustomTypesMapping',
  { contentsToSave: ['C:\\filepath'] },
)
Get file connector allowed paths configuration

Retrieves the allowed paths settings for the File Connector. Requestor must be assigned the TenantAdmin role. Available in Direct Access Gateway V1.7.6+.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
agentId
string
Required

The agent ID

Responses
200

The list of configuration values from the file.

application/json
object
Show application/json properties
404

Configuration file not found.

application/json
object
Show application/json properties
GET
/api/v1/direct-access-agents/{agentId}/connectors/file-connector/files/allowed-paths
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/v1/direct-access-agents/{agentId}/connectors/file-connector/files/allowed-paths` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/v1/direct-access-agents/{agentId}/connectors/file-connector/files/allowed-paths',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "result": [
    {
      "path": "\\\\\\\\Server\\\\Share\\\\example",
      "spaces": [
        "Foo",
        "Bar"
      ]
    }
  ],
  "errorMessage": {
    "errors": [
      {
        "code": "string",
        "title": "string",
        "detail": "string"
      }
    ],
    "traceId": "string",
    "hasErrors": true
  }
}
Set connector allowed paths configuration

Completely replaces the contents of the allowed paths configuration file for the File Connector. Partial updates are not supported. Requestor must be assigned the TenantAdmin role. Available in Direct Access Gateway V1.7.6+.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
agentId
string
Required

The agent id

Request Body

The contents of the file to be updated

application/json
object

The request to update file connector allowed paths configuration

Show application/json properties
Responses
204

Updated.

400

Bad request.

application/json
object
Show application/json properties
404

Configuration file not found.

application/json
object
Show application/json properties
409

Conflict.

application/json
object
Show application/json properties
PUT
/api/v1/direct-access-agents/{agentId}/connectors/file-connector/files/allowed-paths
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `PUT /api/v1/direct-access-agents/{agentId}/connectors/file-connector/files/allowed-paths` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/v1/direct-access-agents/{agentId}/connectors/file-connector/files/allowed-paths',
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileConnectorAllowedPaths: [
        {
          path: '\\\\\\\\Server\\\\Share\\\\example',
          spaces: ['Foo', 'Bar'],
        },
      ],
    }),
  },
)
Get connector type mapping configuration

Retrieves the custom data type mapping settings for the Generic ODBC Connector. Requestor must be assigned the TenantAdmin role. Available in Direct Access Gateway V1.7.5+.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
agentId
string
Required

The agent ID.

Responses
200

The list of configuration values from the file.

application/json
object
Show application/json properties
404

Configuration file not found.

application/json
object
Show application/json properties
GET
/api/v1/direct-access-agents/{agentId}/connectors/odbc-connector/files/custom-data-type-mappings
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/v1/direct-access-agents/{agentId}/connectors/odbc-connector/files/custom-data-type-mappings` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/v1/direct-access-agents/{agentId}/connectors/odbc-connector/files/custom-data-type-mappings',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "result": [
    {
      "id": "Amazon Athena ODBC (x64)",
      "bit": true,
      "size": 0,
      "qlikDataType": "String",
      "nativeDataType": "varchar"
    }
  ],
  "errorMessage": {
    "errors": [
      {
        "code": "string",
        "title": "string",
        "detail": "string"
      }
    ],
    "traceId": "string",
    "hasErrors": true
  }
}
Set connector type mapping configuration

Completely replaces the contents of the custom data type mapping configuration file for the Generic ODBC connector. Partial updates are not supported. There are property naming differences between the API and the file contents. Use the API property format when making changes. Requestor must be assigned the TenantAdmin role. Available in Direct Access Gateway V1.7.5+.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
agentId
string
Required

The agent ID.

Request Body

The contents of the file to be updated.

application/json
object
Show application/json properties
Responses
204

Updated.

400

Bad request.

application/json
object
Show application/json properties
404

Configuration file not found.

application/json
object
Show application/json properties
409

Conflict.

application/json
object
Show application/json properties
PUT
/api/v1/direct-access-agents/{agentId}/connectors/odbc-connector/files/custom-data-type-mappings
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `PUT /api/v1/direct-access-agents/{agentId}/connectors/odbc-connector/files/custom-data-type-mappings` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/v1/direct-access-agents/{agentId}/connectors/odbc-connector/files/custom-data-type-mappings',
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      odbcCustomDataTypes: [
        {
          id: 'Amazon Athena ODBC (x64)',
          bit: true,
          size: 0,
          qlikDataType: 'String',
          nativeDataType: 'varchar',
        },
      ],
    }),
  },
)
Get metrics collector settings

Retrieves the settings for the metrics collector. Requestor must be assigned the TenantAdmin role. Available in Direct Access Gateway V1.7.9+.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
agentId
string
Required

The agent ID.

Responses
200

The list of configuration values from the file.

application/json
object
Show application/json properties
400

Bad request.

application/json
object
Show application/json properties
404

Configuration file not found.

application/json
object
Show application/json properties
GET
/api/v1/direct-access-agents/{agentId}/tools/metrics-collector/configuration
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/v1/direct-access-agents/{agentId}/tools/metrics-collector/configuration` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/v1/direct-access-agents/{agentId}/tools/metrics-collector/configuration',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "result": {
    "connectorConfigurations": {
      "fileConnector": {
        "scrapeIntervalSeconds": 42,
        "metricsCollectionEnabled": true
      },
      "odbcConnector": {
        "scrapeIntervalSeconds": 42,
        "metricsCollectionEnabled": true
      },
      "restConnector": {
        "scrapeIntervalSeconds": 42,
        "metricsCollectionEnabled": true
      },
      "systemMetrics": {
        "scrapeIntervalSeconds": 42,
        "metricsCollectionEnabled": true
      },
      "connectorAgent": {
        "scrapeIntervalSeconds": 42,
        "metricsCollectionEnabled": true
      },
      "sapBwConnector": {
        "scrapeIntervalSeconds": 42,
        "metricsCollectionEnabled": true
      },
      "sapSqlConnector": {
        "scrapeIntervalSeconds": 42,
        "metricsCollectionEnabled": true
      },
      "sapPackageConnector": {
        "scrapeIntervalSeconds": 42,
        "metricsCollectionEnabled": true
      }
    },
    "metricsCollectorSettings": {
      "port": 42,
      "enabled": true,
      "localDataRetentionDays": 42,
      "baseScrapeIntervalSeconds": 42,
      "localDatabaseFileLocation": "string",
      "dataRetentionCheckIntervalMinutes": 42
    }
  },
  "errorMessage": {
    "errors": [
      {
        "code": "string",
        "title": "string",
        "detail": "string"
      }
    ],
    "traceId": "string",
    "hasErrors": true
  }
}
Set metrics collector settings

Completely replaces the contents of the metrics collector settings configuration file. Partial updates are not supported. Requestor must be assigned the TenantAdmin role. Available in Direct Access Gateway V1.7.9+.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
agentId
string
Required

The agent ID.

Request Body

The contents of the file to be updated.

application/json
object
Show application/json properties
Responses
204

Updated.

400

Bad request.

application/json
object
Show application/json properties
404

Configuration file not found.

application/json
object
Show application/json properties
PUT
/api/v1/direct-access-agents/{agentId}/tools/metrics-collector/configuration
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `PUT /api/v1/direct-access-agents/{agentId}/tools/metrics-collector/configuration` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/v1/direct-access-agents/{agentId}/tools/metrics-collector/configuration',
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      connectorConfigurations: {
        fileConnector: {
          scrapeIntervalSeconds: 42,
          metricsCollectionEnabled: true,
        },
        odbcConnector: {
          scrapeIntervalSeconds: 42,
          metricsCollectionEnabled: true,
        },
        restConnector: {
          scrapeIntervalSeconds: 42,
          metricsCollectionEnabled: true,
        },
        systemMetrics: {
          scrapeIntervalSeconds: 42,
          metricsCollectionEnabled: true,
        },
        connectorAgent: {
          scrapeIntervalSeconds: 42,
          metricsCollectionEnabled: true,
        },
        sapBwConnector: {
          scrapeIntervalSeconds: 42,
          metricsCollectionEnabled: true,
        },
        sapSqlConnector: {
          scrapeIntervalSeconds: 42,
          metricsCollectionEnabled: true,
        },
        sapPackageConnector: {
          scrapeIntervalSeconds: 42,
          metricsCollectionEnabled: true,
        },
      },
      metricsCollectorSettings: {
        port: 1,
        enabled: true,
        localDataRetentionDays: 1,
        baseScrapeIntervalSeconds: 1,
        localDatabaseFileLocation: 'string',
        dataRetentionCheckIntervalMinutes: 1,
      },
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