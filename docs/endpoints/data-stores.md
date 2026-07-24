---
title: "Data stores REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/data-stores/"
local_path: "docs/endpoints/data-stores.md"
---

Title: Data stores REST | Qlik Developer Portal


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
Data stores

Data stores are part of the catalog in Qlik Cloud. A data store may contain one or more data stores, which in turn may contain multiple data sets.

Download OpenAPI spec
Endpoints
GET
/api/v1/data-stores
POST
/api/v1/data-stores
DELETE
/api/v1/data-stores
GET
/api/v1/data-stores/{data-store-id}
PATCH
/api/v1/data-stores/{data-store-id}
PUT
/api/v1/data-stores/{data-store-id}
GET
/api/v1/data-stores/{data-store-ids}/data-assets
DELETE
/api/v1/data-stores/{data-store-ids}/data-assets
GET
/api/v1/data-stores/{data-store-ids}/data-assets/{data-asset-ids}/data-sets
DELETE
/api/v1/data-stores/{data-store-ids}/data-assets/{data-asset-ids}/data-sets
Get all data stores.
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
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

Comma-separated fields and field start with '-' character sorts the result set in descending order.

Responses
200

Successful Operation

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
/api/v1/data-stores
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


await qlik.dataStores.getDataStores({})
Example Response
{
  "data": [
    {
      "id": "string",
      "uri": "string",
      "name": "string",
      "tags": [
        "string"
      ],
      "type": "string",
      "ownerId": "string",
      "spaceId": "string",
      "version": 42,
      "tenantId": "string",
      "createdBy": "string",
      "properties": {},
      "createdTime": "2018-10-30T07:06:22Z",
      "description": "string",
      "technicalName": "string",
      "lastModifiedBy": "string",
      "lastModifiedTime": "2018-10-30T07:06:22Z",
      "technicalDescription": "string"
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
Save new data store.
Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
Required
application/json
object
Show application/json properties
Responses
201

Created new data store successfully.

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
/api/v1/data-stores
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


await qlik.dataStores.createDataStore({
  description: 'string',
  id: 'string',
  name: 'string',
  ownerId: 'string',
  properties: {},
  spaceId: 'string',
  tags: ['string'],
  technicalDescription: 'string',
  technicalName: 'string',
  type: 'string',
  uri: 'string',
  version: 42,
})
Example Response
{
  "id": "string",
  "uri": "string",
  "name": "string",
  "tags": [
    "string"
  ],
  "type": "string",
  "ownerId": "string",
  "spaceId": "string",
  "version": 42,
  "tenantId": "string",
  "createdBy": "string",
  "properties": {},
  "createdTime": "2018-10-30T07:06:22Z",
  "description": "string",
  "technicalName": "string",
  "lastModifiedBy": "string",
  "lastModifiedTime": "2018-10-30T07:06:22Z",
  "technicalDescription": "string"
}
Delete data stores if it does not contain any data-assets.
Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
Required
application/json
object
Show application/json properties
Responses
204

Deleted empty data stores.

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
/api/v1/data-stores
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


await qlik.dataStores.deleteDataStores({
  ids: ['string'],
})
Get data store by ID.
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
projections
array of strings

Comma-separated fields to return in the response.

Path Parameters
data-store-id
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
/api/v1/data-stores/{data-store-id}
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


await qlik.dataStores.getDataStore('string', {})
Example Response
{
  "id": "string",
  "uri": "string",
  "name": "string",
  "tags": [
    "string"
  ],
  "type": "string",
  "ownerId": "string",
  "spaceId": "string",
  "version": 42,
  "tenantId": "string",
  "createdBy": "string",
  "properties": {},
  "createdTime": "2018-10-30T07:06:22Z",
  "description": "string",
  "technicalName": "string",
  "lastModifiedBy": "string",
  "lastModifiedTime": "2018-10-30T07:06:22Z",
  "technicalDescription": "string"
}
Patch data store.
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
data-store-id
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

Patched data store successfully.

application/json
object
Show application/json properties
204

Patched data store successfully.

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
/api/v1/data-stores/{data-store-id}
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


await qlik.dataStores.patchDataStore('string', [
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
  "uri": "string",
  "name": "string",
  "tags": [
    "string"
  ],
  "type": "string",
  "ownerId": "string",
  "spaceId": "string",
  "version": 42,
  "tenantId": "string",
  "createdBy": "string",
  "properties": {},
  "createdTime": "2018-10-30T07:06:22Z",
  "description": "string",
  "technicalName": "string",
  "lastModifiedBy": "string",
  "lastModifiedTime": "2018-10-30T07:06:22Z",
  "technicalDescription": "string"
}
Update data store.
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
data-store-id
string
Required
Request Body
Required
application/json
object
Show application/json properties
Responses
200

Updated data store successfully.

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
/api/v1/data-stores/{data-store-id}
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


await qlik.dataStores.updateDataStore('string', {
  description: 'string',
  id: 'string',
  name: 'string',
  ownerId: 'string',
  properties: {},
  spaceId: 'string',
  tags: ['string'],
  technicalDescription: 'string',
  technicalName: 'string',
  type: 'string',
  uri: 'string',
  version: 42,
})
Example Response
{
  "id": "string",
  "uri": "string",
  "name": "string",
  "tags": [
    "string"
  ],
  "type": "string",
  "ownerId": "string",
  "spaceId": "string",
  "version": 42,
  "tenantId": "string",
  "createdBy": "string",
  "properties": {},
  "createdTime": "2018-10-30T07:06:22Z",
  "description": "string",
  "technicalName": "string",
  "lastModifiedBy": "string",
  "lastModifiedTime": "2018-10-30T07:06:22Z",
  "technicalDescription": "string"
}
Get all data assets belonging to the data store(s).
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
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

Comma-separated fields and field start with '-' character sorts the result set in descending order.

Path Parameters
data-store-ids
array of strings
Required

Comma-separated data store IDs or * to include all data stores.

Responses
200

Successful Operation

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
/api/v1/data-stores/{data-store-ids}/data-assets
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


await qlik.dataStores.getDataStoreDataAssets(
  'value',
  {},
)
Example Response
{
  "data": [
    {
      "id": "string",
      "name": "string",
      "tags": [
        "string"
      ],
      "appId": "string",
      "appType": "string",
      "ownerId": "string",
      "spaceId": "string",
      "version": 42,
      "tenantId": "string",
      "createdBy": "string",
      "properties": {},
      "createdTime": "2018-10-30T07:06:22Z",
      "description": "string",
      "dataFreshness": "2018-10-30T07:06:22Z",
      "dataStoreInfo": {
        "id": "string",
        "name": "string",
        "type": "string"
      },
      "technicalName": "string",
      "lastModifiedBy": "string",
      "lastModifiedTime": "2018-10-30T07:06:22Z",
      "technicalDescription": "string"
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
Delete data assets and child data-sets by data-store IDs.
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
data-store-ids
array of strings
Required

Comma-separated data store IDs or * to include all data stores.

Responses
204

Deleted data assets successfully.

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
/api/v1/data-stores/{data-store-ids}/data-assets
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


await qlik.dataStores.deleteDataStoreDataAssets(
  'value',
)
Get all data sets belonging to the data store(s) and data asset(s).
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
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

Comma-separated fields and field start with '-' character sorts the result set in descending order.

Path Parameters
data-asset-ids
array of strings
Required

Comma-separated data asset IDs or * to include all data assets.

data-store-ids
array of strings
Required

Comma-separated data store IDs or * to include all data stores.

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
/api/v1/data-stores/{data-store-ids}/data-assets/{data-asset-ids}/data-sets
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


await qlik.dataStores.getDataStoreDataAssetDataSets(
  'value',
  'value',
  {},
)
Example Response
{
  "data": [
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
Delete data sets by data-store IDs and data-asset IDs.
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
data-asset-ids
array of strings
Required

Comma-separated data asset IDs or * to include all data assets.

data-store-ids
array of strings
Required

Comma-separated data store IDs or * to include all data stores.

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
/api/v1/data-stores/{data-store-ids}/data-assets/{data-asset-ids}/data-sets
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


await qlik.dataStores.deleteDataStoreDataAssetDataSets(
  'value',
  'value',
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