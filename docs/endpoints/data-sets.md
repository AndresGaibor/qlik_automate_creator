---
title: "Data sets REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/data-sets/"
local_path: "docs/endpoints/data-sets.md"
---

Title: Data sets REST | Qlik Developer Portal


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
Data sets

Data sets are part of the catalog in Qlik Cloud. A data set is a member of a data asset.

Download OpenAPI spec
Endpoints
POST
/api/v1/data-sets
DELETE
/api/v1/data-sets
GET
/api/v1/data-sets/{data-set-id}
PATCH
/api/v1/data-sets/{data-set-id}
PUT
/api/v1/data-sets/{data-set-id}
GET
/api/v1/data-sets/{data-set-id}/profiles
Save new data set
Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
Required
application/json
object
Show application/json properties
Responses
201

Created new data set successfully.

application/json
object
Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
401

User does not have valid authentication credentials.

application/json
object
Show application/json properties
403

User does not have access to the resource.

application/json
object
Show application/json properties
404

Resource does not exist.

application/json
object
Show application/json properties
409

The input request conflicts with the current state of the resource.

application/json
object
Show application/json properties
500

Internal Server Error.

application/json
object
Show application/json properties
503

Requested service is not available.

application/json
object
Show application/json properties
POST
/api/v1/data-sets
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


await qlik.dataSets.createDataSet({
  additionalSchemas: [
    {
      anomalies: ['string'],
      dataFields: [
        {
          alias: 'string',
          dataType: {
            originalType: 'string',
            properties: {},
            type: 'DATE',
          },
          description: 'string',
          encrypted: true,
          name: 'string',
          nullable: true,
          ordinalPositionInKey: 42,
          orphan: true,
          primaryKey: true,
          properties: {},
          sensitive: true,
          tags: ['string'],
          userTags: [
            { id: 'string', name: 'string' },
          ],
        },
      ],
      loadOptions: {},
      overrideSchemaAnomalies: true,
      schemaName: 'string',
    },
  ],
  appTypeOverride: 'string',
  createdByConnectionId: 'string',
  dataAssetInfo: {
    dataStoreInfo: { id: 'string' },
    id: 'string',
  },
  description: 'string',
  id: 'string',
  name: 'string',
  operational: {
    contentUpdated: true,
    endDate: '2018-10-30T07:06:22Z',
    lastLoadTime: '2018-10-30T07:06:22Z',
    lastUpdateTime: '2018-10-30T07:06:22Z',
    location: 'string',
    logMessage: 'string',
    rowCount: 42,
    size: 42,
    startDate: '2018-10-30T07:06:22Z',
    status: 'string',
    tableConnectionInfo: {
      additionalProperties: {},
      selectionScript: 'string',
      tableName: 'string',
    },
    tableOwner: 'string',
  },
  ownerId: 'string',
  properties: {},
  qri: 'string',
  schema: {
    anomalies: ['string'],
    dataFields: [
      {
        alias: 'string',
        dataType: {
          originalType: 'string',
          properties: {},
          type: 'DATE',
        },
        description: 'string',
        encrypted: true,
        name: 'string',
        nullable: true,
        ordinalPositionInKey: 42,
        orphan: true,
        primaryKey: true,
        properties: {},
        sensitive: true,
        tags: ['string'],
        userTags: [
          { id: 'string', name: 'string' },
        ],
      },
    ],
    loadOptions: {},
    overrideSchemaAnomalies: true,
    schemaName: 'string',
  },
  secureQri: 'string',
  spaceId: 'string',
  tags: ['string'],
  technicalDescription: 'string',
  technicalName: 'string',
  type: 'string',
  version: 42,
})
Example Response
{
  "id": "string",
  "qri": "string",
  "name": "string",
  "tags": [
    "string"
  ],
  "type": "string",
  "schema": {
    "anomalies": [
      "string"
    ],
    "dataFields": [
      {
        "name": "string",
        "tags": [
          "string"
        ],
        "alias": "string",
        "index": 42,
        "orphan": true,
        "dataType": {
          "type": "DATE",
          "properties": {},
          "originalType": "string"
        },
        "nullable": true,
        "userTags": [
          {
            "id": "string",
            "name": "string"
          }
        ],
        "encrypted": true,
        "sensitive": true,
        "primaryKey": true,
        "properties": {},
        "description": "string",
        "ordinalPositionInKey": 42
      }
    ],
    "schemaName": "string",
    "loadOptions": {},
    "effectiveDate": "2018-10-30T07:06:22Z",
    "overrideSchemaAnomalies": true
  },
  "ownerId": "string",
  "spaceId": "string",
  "version": 42,
  "tenantId": "string",
  "createdBy": "string",
  "secureQri": "string",
  "properties": {},
  "createdTime": "2018-10-30T07:06:22Z",
  "description": "string",
  "operational": {
    "size": 42,
    "status": "string",
    "endDate": "2018-10-30T07:06:22Z",
    "location": "string",
    "rowCount": 42,
    "startDate": "2018-10-30T07:06:22Z",
    "logMessage": "string",
    "tableOwner": "string",
    "lastLoadTime": "2018-10-30T07:06:22Z",
    "contentUpdated": true,
    "lastUpdateTime": "2018-10-30T07:06:22Z",
    "tableConnectionInfo": {
      "tableName": "string",
      "selectionScript": "string",
      "additionalProperties": {}
    }
  },
  "dataAssetInfo": {
    "id": "string",
    "name": "string",
    "dataStoreInfo": {
      "id": "string",
      "name": "string",
      "type": "string"
    }
  },
  "technicalName": "string",
  "lastModifiedBy": "string",
  "appTypeOverride": "string",
  "lastModifiedTime": "2018-10-30T07:06:22Z",
  "additionalSchemas": [
    {
      "anomalies": [
        "string"
      ],
      "dataFields": [
        {
          "name": "string",
          "tags": [
            "string"
          ],
          "alias": "string",
          "index": 42,
          "orphan": true,
          "dataType": {
            "type": "DATE",
            "properties": {},
            "originalType": "string"
          },
          "nullable": true,
          "userTags": [
            {
              "id": "string",
              "name": "string"
            }
          ],
          "encrypted": true,
          "sensitive": true,
          "primaryKey": true,
          "properties": {},
          "description": "string",
          "ordinalPositionInKey": 42
        }
      ],
      "schemaName": "string",
      "loadOptions": {},
      "effectiveDate": "2018-10-30T07:06:22Z",
      "overrideSchemaAnomalies": true
    }
  ],
  "technicalDescription": "string",
  "createdByConnectionId": "string"
}
Batch delete data sets.
Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
Required
application/json
object
Show application/json properties
Responses
204

Deleted data sets.

400

The request is in incorrect format.

application/json
object
Show application/json properties
401

User does not have valid authentication credentials.

application/json
object
Show application/json properties
403

User does not have access to the resource.

application/json
object
Show application/json properties
404

Resource does not exist.

application/json
object
Show application/json properties
409

The input request conflicts with the current state of the resource.

application/json
object
Show application/json properties
500

Internal Server Error.

application/json
object
Show application/json properties
503

Requested service is not available.

application/json
object
Show application/json properties
DELETE
/api/v1/data-sets
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


await qlik.dataSets.deleteDataSets({
  ids: ['string'],
})
Get data set by ID.
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
projections
array of strings

Comma-separated fields to return in the response.

Path Parameters
data-set-id
string
Required
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
401

User does not have valid authentication credentials.

application/json
object
Show application/json properties
403

User does not have access to the resource.

application/json
object
Show application/json properties
404

Resource does not exist.

application/json
object
Show application/json properties
409

The input request conflicts with the current state of the resource.

application/json
object
Show application/json properties
500

Internal Server Error.

application/json
object
Show application/json properties
503

Requested service is not available.

application/json
object
Show application/json properties
GET
/api/v1/data-sets/{data-set-id}
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


await qlik.dataSets.getDataSet('string', {})
Example Response
{
  "id": "string",
  "qri": "string",
  "name": "string",
  "tags": [
    "string"
  ],
  "type": "string",
  "schema": {
    "anomalies": [
      "string"
    ],
    "dataFields": [
      {
        "name": "string",
        "tags": [
          "string"
        ],
        "alias": "string",
        "index": 42,
        "orphan": true,
        "dataType": {
          "type": "DATE",
          "properties": {},
          "originalType": "string"
        },
        "nullable": true,
        "userTags": [
          {
            "id": "string",
            "name": "string"
          }
        ],
        "encrypted": true,
        "sensitive": true,
        "primaryKey": true,
        "properties": {},
        "description": "string",
        "ordinalPositionInKey": 42
      }
    ],
    "schemaName": "string",
    "loadOptions": {},
    "effectiveDate": "2018-10-30T07:06:22Z",
    "overrideSchemaAnomalies": true
  },
  "ownerId": "string",
  "spaceId": "string",
  "version": 42,
  "tenantId": "string",
  "createdBy": "string",
  "secureQri": "string",
  "properties": {},
  "createdTime": "2018-10-30T07:06:22Z",
  "description": "string",
  "operational": {
    "size": 42,
    "status": "string",
    "endDate": "2018-10-30T07:06:22Z",
    "location": "string",
    "rowCount": 42,
    "startDate": "2018-10-30T07:06:22Z",
    "logMessage": "string",
    "tableOwner": "string",
    "lastLoadTime": "2018-10-30T07:06:22Z",
    "contentUpdated": true,
    "lastUpdateTime": "2018-10-30T07:06:22Z",
    "tableConnectionInfo": {
      "tableName": "string",
      "selectionScript": "string",
      "additionalProperties": {}
    }
  },
  "dataAssetInfo": {
    "id": "string",
    "name": "string",
    "dataStoreInfo": {
      "id": "string",
      "name": "string",
      "type": "string"
    }
  },
  "technicalName": "string",
  "lastModifiedBy": "string",
  "appTypeOverride": "string",
  "lastModifiedTime": "2018-10-30T07:06:22Z",
  "additionalSchemas": [
    {
      "anomalies": [
        "string"
      ],
      "dataFields": [
        {
          "name": "string",
          "tags": [
            "string"
          ],
          "alias": "string",
          "index": 42,
          "orphan": true,
          "dataType": {
            "type": "DATE",
            "properties": {},
            "originalType": "string"
          },
          "nullable": true,
          "userTags": [
            {
              "id": "string",
              "name": "string"
            }
          ],
          "encrypted": true,
          "sensitive": true,
          "primaryKey": true,
          "properties": {},
          "description": "string",
          "ordinalPositionInKey": 42
        }
      ],
      "schemaName": "string",
      "loadOptions": {},
      "effectiveDate": "2018-10-30T07:06:22Z",
      "overrideSchemaAnomalies": true
    }
  ],
  "technicalDescription": "string",
  "createdByConnectionId": "string"
}
Patch data set.

Partially updates an existing DataSet by ID using JSON Patch operations (RFC 6902), including ownership attributes.

A user can update any DataSet within a space if they fulfill one of the following conditions:

Has Can edit permission in a data space.
Is a Professional user with the Editor or Operator role in a shared space.
Is a Professional user with the Facilitator or Operator role in a managed space.
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
data-set-id
string
Required
Request Body
Required
application/json
array of objects

Array of JSON patch documents as defined by RFC 6902.

Show application/json properties
Responses
200

Patched data set successfully.

application/json
object
Show application/json properties
204

Patched data set successfully.

application/json
object
Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
401

User does not have valid authentication credentials.

application/json
object
Show application/json properties
403

User does not have access to the resource.

application/json
object
Show application/json properties
404

Resource does not exist.

application/json
object
Show application/json properties
409

The input request conflicts with the current state of the resource.

application/json
object
Show application/json properties
500

Internal Server Error.

application/json
object
Show application/json properties
503

Requested service is not available.

application/json
object
Show application/json properties
PATCH
/api/v1/data-sets/{data-set-id}
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


await qlik.dataSets.patchDataSet('string', [
  {
    from: 'string',
    op: 'add',
    path: 'string',
    value: {},
  },
])
Example Response
{
  "id": "string",
  "qri": "string",
  "name": "string",
  "tags": [
    "string"
  ],
  "type": "string",
  "schema": {
    "anomalies": [
      "string"
    ],
    "dataFields": [
      {
        "name": "string",
        "tags": [
          "string"
        ],
        "alias": "string",
        "index": 42,
        "orphan": true,
        "dataType": {
          "type": "DATE",
          "properties": {},
          "originalType": "string"
        },
        "nullable": true,
        "userTags": [
          {
            "id": "string",
            "name": "string"
          }
        ],
        "encrypted": true,
        "sensitive": true,
        "primaryKey": true,
        "properties": {},
        "description": "string",
        "ordinalPositionInKey": 42
      }
    ],
    "schemaName": "string",
    "loadOptions": {},
    "effectiveDate": "2018-10-30T07:06:22Z",
    "overrideSchemaAnomalies": true
  },
  "ownerId": "string",
  "spaceId": "string",
  "version": 42,
  "tenantId": "string",
  "createdBy": "string",
  "secureQri": "string",
  "properties": {},
  "createdTime": "2018-10-30T07:06:22Z",
  "description": "string",
  "operational": {
    "size": 42,
    "status": "string",
    "endDate": "2018-10-30T07:06:22Z",
    "location": "string",
    "rowCount": 42,
    "startDate": "2018-10-30T07:06:22Z",
    "logMessage": "string",
    "tableOwner": "string",
    "lastLoadTime": "2018-10-30T07:06:22Z",
    "contentUpdated": true,
    "lastUpdateTime": "2018-10-30T07:06:22Z",
    "tableConnectionInfo": {
      "tableName": "string",
      "selectionScript": "string",
      "additionalProperties": {}
    }
  },
  "dataAssetInfo": {
    "id": "string",
    "name": "string",
    "dataStoreInfo": {
      "id": "string",
      "name": "string",
      "type": "string"
    }
  },
  "technicalName": "string",
  "lastModifiedBy": "string",
  "appTypeOverride": "string",
  "lastModifiedTime": "2018-10-30T07:06:22Z",
  "additionalSchemas": [
    {
      "anomalies": [
        "string"
      ],
      "dataFields": [
        {
          "name": "string",
          "tags": [
            "string"
          ],
          "alias": "string",
          "index": 42,
          "orphan": true,
          "dataType": {
            "type": "DATE",
            "properties": {},
            "originalType": "string"
          },
          "nullable": true,
          "userTags": [
            {
              "id": "string",
              "name": "string"
            }
          ],
          "encrypted": true,
          "sensitive": true,
          "primaryKey": true,
          "properties": {},
          "description": "string",
          "ordinalPositionInKey": 42
        }
      ],
      "schemaName": "string",
      "loadOptions": {},
      "effectiveDate": "2018-10-30T07:06:22Z",
      "overrideSchemaAnomalies": true
    }
  ],
  "technicalDescription": "string",
  "createdByConnectionId": "string"
}
Update data set.

Fully replaces an existing DataSet by ID, including ownership attributes.

A user can update any DataSet within a space if they fulfill one of the following conditions:

Has Can edit permission in a data space.
Is a Professional user with the Editor or Operator role in a shared space.
Is a Professional user with the Facilitator or Operator role in a managed space.
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
data-set-id
string
Required
Request Body
Required
application/json
object
Show application/json properties
Responses
200

Updated data set successfully.

application/json
object
Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
401

User does not have valid authentication credentials.

application/json
object
Show application/json properties
403

User does not have access to the resource.

application/json
object
Show application/json properties
404

Resource does not exist.

application/json
object
Show application/json properties
409

The input request conflicts with the current state of the resource.

application/json
object
Show application/json properties
500

Internal Server Error.

application/json
object
Show application/json properties
503

Requested service is not available.

application/json
object
Show application/json properties
PUT
/api/v1/data-sets/{data-set-id}
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


await qlik.dataSets.updateDataSet('string', {
  additionalSchemas: [
    {
      anomalies: ['string'],
      dataFields: [
        {
          alias: 'string',
          dataType: {
            originalType: 'string',
            properties: {},
            type: 'DATE',
          },
          description: 'string',
          encrypted: true,
          name: 'string',
          nullable: true,
          ordinalPositionInKey: 42,
          orphan: true,
          primaryKey: true,
          properties: {},
          sensitive: true,
          tags: ['string'],
          userTags: [
            { id: 'string', name: 'string' },
          ],
        },
      ],
      loadOptions: {},
      overrideSchemaAnomalies: true,
      schemaName: 'string',
    },
  ],
  appTypeOverride: 'string',
  createdByConnectionId: 'string',
  dataAssetInfo: {
    dataStoreInfo: { id: 'string' },
    id: 'string',
  },
  description: 'string',
  id: 'string',
  name: 'string',
  operational: {
    contentUpdated: true,
    endDate: '2018-10-30T07:06:22Z',
    lastLoadTime: '2018-10-30T07:06:22Z',
    lastUpdateTime: '2018-10-30T07:06:22Z',
    location: 'string',
    logMessage: 'string',
    rowCount: 42,
    size: 42,
    startDate: '2018-10-30T07:06:22Z',
    status: 'string',
    tableConnectionInfo: {
      additionalProperties: {},
      selectionScript: 'string',
      tableName: 'string',
    },
    tableOwner: 'string',
  },
  ownerId: 'string',
  properties: {},
  qri: 'string',
  schema: {
    anomalies: ['string'],
    dataFields: [
      {
        alias: 'string',
        dataType: {
          originalType: 'string',
          properties: {},
          type: 'DATE',
        },
        description: 'string',
        encrypted: true,
        name: 'string',
        nullable: true,
        ordinalPositionInKey: 42,
        orphan: true,
        primaryKey: true,
        properties: {},
        sensitive: true,
        tags: ['string'],
        userTags: [
          { id: 'string', name: 'string' },
        ],
      },
    ],
    loadOptions: {},
    overrideSchemaAnomalies: true,
    schemaName: 'string',
  },
  secureQri: 'string',
  spaceId: 'string',
  tags: ['string'],
  technicalDescription: 'string',
  technicalName: 'string',
  type: 'string',
  version: 42,
})
Example Response
{
  "id": "string",
  "qri": "string",
  "name": "string",
  "tags": [
    "string"
  ],
  "type": "string",
  "schema": {
    "anomalies": [
      "string"
    ],
    "dataFields": [
      {
        "name": "string",
        "tags": [
          "string"
        ],
        "alias": "string",
        "index": 42,
        "orphan": true,
        "dataType": {
          "type": "DATE",
          "properties": {},
          "originalType": "string"
        },
        "nullable": true,
        "userTags": [
          {
            "id": "string",
            "name": "string"
          }
        ],
        "encrypted": true,
        "sensitive": true,
        "primaryKey": true,
        "properties": {},
        "description": "string",
        "ordinalPositionInKey": 42
      }
    ],
    "schemaName": "string",
    "loadOptions": {},
    "effectiveDate": "2018-10-30T07:06:22Z",
    "overrideSchemaAnomalies": true
  },
  "ownerId": "string",
  "spaceId": "string",
  "version": 42,
  "tenantId": "string",
  "createdBy": "string",
  "secureQri": "string",
  "properties": {},
  "createdTime": "2018-10-30T07:06:22Z",
  "description": "string",
  "operational": {
    "size": 42,
    "status": "string",
    "endDate": "2018-10-30T07:06:22Z",
    "location": "string",
    "rowCount": 42,
    "startDate": "2018-10-30T07:06:22Z",
    "logMessage": "string",
    "tableOwner": "string",
    "lastLoadTime": "2018-10-30T07:06:22Z",
    "contentUpdated": true,
    "lastUpdateTime": "2018-10-30T07:06:22Z",
    "tableConnectionInfo": {
      "tableName": "string",
      "selectionScript": "string",
      "additionalProperties": {}
    }
  },
  "dataAssetInfo": {
    "id": "string",
    "name": "string",
    "dataStoreInfo": {
      "id": "string",
      "name": "string",
      "type": "string"
    }
  },
  "technicalName": "string",
  "lastModifiedBy": "string",
  "appTypeOverride": "string",
  "lastModifiedTime": "2018-10-30T07:06:22Z",
  "additionalSchemas": [
    {
      "anomalies": [
        "string"
      ],
      "dataFields": [
        {
          "name": "string",
          "tags": [
            "string"
          ],
          "alias": "string",
          "index": 42,
          "orphan": true,
          "dataType": {
            "type": "DATE",
            "properties": {},
            "originalType": "string"
          },
          "nullable": true,
          "userTags": [
            {
              "id": "string",
              "name": "string"
            }
          ],
          "encrypted": true,
          "sensitive": true,
          "primaryKey": true,
          "properties": {},
          "description": "string",
          "ordinalPositionInKey": 42
        }
      ],
      "schemaName": "string",
      "loadOptions": {},
      "effectiveDate": "2018-10-30T07:06:22Z",
      "overrideSchemaAnomalies": true
    }
  ],
  "technicalDescription": "string",
  "createdByConnectionId": "string"
}
Get profile for the given dataset and connection Id pair, if the profile already exists in the system. Profile returned can be either latest or Stale one based on when it was computed.
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
dataConnectionIds
array of strings

Comma-separated data connection IDs.

limit
integer

Page size limit.

maximum = 100, default = 20, format = int32, default = 20

page
integer

default = 0, format = int32, default = 0

projections
array of strings

Comma-separated fields to return in the response.

sort
array of strings
Path Parameters
data-set-id
string
Required
Responses
200

Return profiles of data set.

application/json
object
Show application/json properties
202

The profile is currently running.

application/json
object
Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
401

User does not have valid authentication credentials.

application/json
object
Show application/json properties
403

User does not have access to the resource.

application/json
object
Show application/json properties
404

Resource does not exist.

application/json
object
Show application/json properties
409

The input request conflicts with the current state of the resource.

application/json
object
Show application/json properties
500

Internal Server Error.

application/json
object
Show application/json properties
503

Requested service is not available.

application/json
object
Show application/json properties
GET
/api/v1/data-sets/{data-set-id}/profiles
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


await qlik.dataSets.getDataSetProfiles(
  'string',
  {},
)
Example Response
{
  "data": [
    {
      "meta": {
        "status": "QUEUED",
        "messages": [
          "string"
        ],
        "dataSetId": "string",
        "resultType": "NORMAL",
        "connectionId": "string",
        "lastLoadTime": "2018-10-30T07:06:22Z",
        "computationEndTime": "2018-10-30T07:06:22Z",
        "computationStartTime": "2018-10-30T07:06:22Z"
      },
      "samples": [
        {
          "name": "string",
          "records": [
            {
              "values": [
                "string"
              ]
            }
          ],
          "fieldNames": [
            "string"
          ]
        }
      ],
      "profiles": [
        {
          "name": "string",
          "sizeInBytes": 42,
          "numberOfRows": 42,
          "fieldProfiles": [
            {
              "name": "string",
              "tags": [
                "string"
              ],
              "index": 42,
              "median": 42,
              "average": 42,
              "dataType": "DATE",
              "evenness": 42,
              "kurtosis": 42,
              "skewness": 42,
              "fractiles": [
                42
              ],
              "sampleValues": [
                "string"
              ],
              "technicalName": "string",
              "classification": {
                "pii": true,
                "tags": [
                  {
                    "tag": "string",
                    "score": 42
                  }
                ],
                "sensitive": true,
                "obfuscation": "string"
              },
              "nullValueCount": 42,
              "textValueCount": 42,
              "zeroValueCount": 42,
              "maxNumericValue": 42,
              "maxStringLength": 42,
              "minNumericValue": 42,
              "minStringLength": 42,
              "sumStringLength": 42,
              "emptyStringCount": 42,
              "sumNumericValues": 42,
              "numericValueCount": 42,
              "standardDeviation": 42,
              "distinctValueCount": 42,
              "mostFrequentValues": [
                {
                  "value": "string",
                  "frequency": 42
                }
              ],
              "negativeValueCount": 42,
              "positiveValueCount": 42,
              "averageStringLength": 42,
              "frequencyDistribution": [
                {
                  "binEdge": 42,
                  "frequency": 42
                }
              ],
              "lastSortedStringValue": "string",
              "firstSortedStringValue": "string",
              "sumSquaredNumericValues": 42
            }
          ]
        }
      ]
    }
  ],
  "page": 42,
  "limit": 42,
  "links": {
    "last": {
      "href": "string"
    },
    "next": {
      "href": "string"
    },
    "prev": {
      "href": "string"
    },
    "self": {
      "href": "string"
    },
    "first": {
      "href": "string"
    }
  },
  "pages": 42,
  "total": 42
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