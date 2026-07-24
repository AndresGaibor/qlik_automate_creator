---
title: "Apps REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/apps/"
local_path: "docs/endpoints/apps.md"
---

Title: Apps REST | Qlik Developer Portal


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
Apps
Download OpenAPI spec

Create, manage, and retrieve analytics applications in Qlik Cloud.

New capabilities in the analytics namespace

Some new capabilities are only being added to the Apps API in the analytics namespace.

Where endpoints are available in the analytics namespace, use those instead.

This API remains available and fully supported.

Endpoints
POST
/api/v1/apps
GET
/api/v1/apps/{appId}
PUT
/api/v1/apps/{appId}
DELETE
/api/v1/apps/{appId}
POST
/api/v1/apps/{appId}/copy
GET
/api/v1/apps/{appId}/data/lineage
GET
/api/v1/apps/{appId}/data/metadata
POST
/api/v1/apps/{appId}/export
GET
/api/v1/apps/{appId}/insight-analyses
POST
/api/v1/apps/{appId}/insight-analyses/actions/recommend
GET
/api/v1/apps/{appId}/insight-analyses/model
GET
/api/v1/apps/{appId}/media/files/{path}
PUT
/api/v1/apps/{appId}/media/files/{path}
DELETE
/api/v1/apps/{appId}/media/files/{path}
GET
/api/v1/apps/{appId}/media/list/{path}
GET
/api/v1/apps/{appId}/media/thumbnail
POST
/api/v1/apps/{appId}/objects/{objectId}/actions/change-owner
PUT
/api/v1/apps/{appId}/owner
GET
/api/v1/apps/{appId}/placement
PUT
/api/v1/apps/{appId}/placement
DELETE
/api/v1/apps/{appId}/placement
POST
/api/v1/apps/{appId}/publish
PUT
/api/v1/apps/{appId}/publish
GET
/api/v1/apps/{appId}/reloads/logs
GET
/api/v1/apps/{appId}/reloads/logs/{reloadId}
GET
/api/v1/apps/{appId}/reloads/metadata/{reloadId}
GET
/api/v1/apps/{appId}/report-filters
POST
/api/v1/apps/{appId}/report-filters
GET
/api/v1/apps/{appId}/report-filters/{id}
PATCH
/api/v1/apps/{appId}/report-filters/{id}
DELETE
/api/v1/apps/{appId}/report-filters/{id}
GET
/api/v1/apps/{appId}/report-filters/actions/count
GET
/api/v1/apps/{appId}/scripts
POST
/api/v1/apps/{appId}/scripts
GET
/api/v1/apps/{appId}/scripts/{id}
PATCH
/api/v1/apps/{appId}/scripts/{id}
DELETE
/api/v1/apps/{appId}/scripts/{id}
PUT
/api/v1/apps/{appId}/space
DELETE
/api/v1/apps/{appId}/space
GET
/api/v1/apps/{guid}/evaluations
POST
/api/v1/apps/{guid}/evaluations
GET
/api/v1/apps/evaluations/{baseid}/actions/compare/{comparisonid}
GET
/api/v1/apps/evaluations/{baseid}/actions/compare/{comparisonid}/actions/download
GET
/api/v1/apps/evaluations/{id}
GET
/api/v1/apps/evaluations/{id}/actions/download
POST
/api/v1/apps/import
GET
/api/v1/apps/privileges
POST
/api/v1/apps/validatescript
Creates a new app.

Creates a new app.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
Required

Attributes that the user wants to set in new app.

*/*
object
Show */* properties
Responses
200

OK

application/json
object

Application attributes and user privileges.

Show application/json properties
POST
/api/v1/apps
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


await qlik.apps.createApp({
  attributes: {
    description: 'string',
    locale: 'string',
    name: 'string',
    spaceId: 'string',
  },
})
Example Response
{
  "create": [
    {
      "resource": "string",
      "canCreate": true
    }
  ],
  "attributes": {
    "id": "string",
    "name": "string",
    "owner": "string",
    "custom": {},
    "ownerId": "string",
    "encrypted": true,
    "published": true,
    "thumbnail": "string",
    "createdDate": "2018-10-30T07:06:22Z",
    "description": "string",
    "originAppId": "string",
    "publishTime": "2018-10-30T07:06:22Z",
    "dynamicColor": "string",
    "modifiedDate": "2018-10-30T07:06:22Z",
    "lastReloadTime": "2018-10-30T07:06:22Z",
    "hasSectionAccess": true,
    "isDirectQueryMode": true
  },
  "privileges": [
    "string"
  ]
}
Retrieves information for a specific app.

Retrieves information for a specific app.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
appId
string
Required

Identifier of the app.

Responses
200

OK

application/json
object

Application attributes and user privileges.

Show application/json properties
GET
/api/v1/apps/{appId}
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


await qlik.apps.getAppInfo('string')
Example Response
{
  "create": [
    {
      "resource": "string",
      "canCreate": true
    }
  ],
  "attributes": {
    "id": "string",
    "name": "string",
    "owner": "string",
    "custom": {},
    "ownerId": "string",
    "encrypted": true,
    "published": true,
    "thumbnail": "string",
    "createdDate": "2018-10-30T07:06:22Z",
    "description": "string",
    "originAppId": "string",
    "publishTime": "2018-10-30T07:06:22Z",
    "dynamicColor": "string",
    "modifiedDate": "2018-10-30T07:06:22Z",
    "lastReloadTime": "2018-10-30T07:06:22Z",
    "hasSectionAccess": true,
    "isDirectQueryMode": true
  },
  "privileges": [
    "string"
  ]
}
Updates the information for a specific app.

Updates the information for a specific app.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
appId
string
Required

Identifier of the app.

Request Body
Required

Attributes that user wants to set.

*/*
object
Show */* properties
Responses
200

OK

application/json
object

Application attributes and user privileges.

Show application/json properties
PUT
/api/v1/apps/{appId}
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


await qlik.apps.updateAppInfo('string', {
  attributes: {
    description: 'string',
    name: 'string',
  },
})
Example Response
{
  "create": [
    {
      "resource": "string",
      "canCreate": true
    }
  ],
  "attributes": {
    "id": "string",
    "name": "string",
    "owner": "string",
    "custom": {},
    "ownerId": "string",
    "encrypted": true,
    "published": true,
    "thumbnail": "string",
    "createdDate": "2018-10-30T07:06:22Z",
    "description": "string",
    "originAppId": "string",
    "publishTime": "2018-10-30T07:06:22Z",
    "dynamicColor": "string",
    "modifiedDate": "2018-10-30T07:06:22Z",
    "lastReloadTime": "2018-10-30T07:06:22Z",
    "hasSectionAccess": true,
    "isDirectQueryMode": true
  },
  "privileges": [
    "string"
  ]
}
Deletes a specific app.

Deletes a specific app.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
appId
string
Required

Identifier of the app.

Responses
200

OK

DELETE
/api/v1/apps/{appId}
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


await qlik.apps.deleteApp('string')
Copies a specific app.

Copies a specific app.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
appId
string
Required

Identifier of the app.

Request Body
Required

Attributes that should be set in the copy.

*/*
object
Show */* properties
Responses
200

OK

application/json
object

Application attributes and user privileges.

Show application/json properties
POST
/api/v1/apps/{appId}/copy
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


await qlik.apps.copyApp('string', {
  attributes: {
    description: 'string',
    locale: 'string',
    name: 'string',
    spaceId: 'string',
  },
})
Example Response
{
  "create": [
    {
      "resource": "string",
      "canCreate": true
    }
  ],
  "attributes": {
    "id": "string",
    "name": "string",
    "owner": "string",
    "custom": {},
    "ownerId": "string",
    "encrypted": true,
    "published": true,
    "thumbnail": "string",
    "createdDate": "2018-10-30T07:06:22Z",
    "description": "string",
    "originAppId": "string",
    "publishTime": "2018-10-30T07:06:22Z",
    "dynamicColor": "string",
    "modifiedDate": "2018-10-30T07:06:22Z",
    "lastReloadTime": "2018-10-30T07:06:22Z",
    "hasSectionAccess": true,
    "isDirectQueryMode": true
  },
  "privileges": [
    "string"
  ]
}
Retrieves the lineage for an app. Returns a JSON-formatted array of strings describing the lineage of the app.

Retrieves the lineage for an app. Returns a JSON-formatted array of strings describing the lineage of the app.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
appId
string
Required

Identifier of the app.

Responses
200

OK

application/json
array of objects
Show application/json properties
GET
/api/v1/apps/{appId}/data/lineage
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


await qlik.apps.getAppDataLineage('string')
Example Response
[
  {
    "statement": "string",
    "discriminator": "string"
  }
]
Retrieves the data model and reload statistics metadata of an app. An empty metadata structure is returned if the metadata is not available in the app.

Retrieves the data model and reload statistics metadata of an app. An empty metadata structure is returned if the metadata is not available in the app.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
appId
string
Required

Identifier of the app.

Responses
200

OK

application/json
object
Show application/json properties
GET
/api/v1/apps/{appId}/data/metadata
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


await qlik.apps.getAppDataMetadata('string')
Example Response
{
  "fields": [
    {
      "hash": "string",
      "name": "string",
      "tags": [
        "string"
      ],
      "comment": "string",
      "cardinal": 42,
      "byte_size": 42,
      "is_hidden": true,
      "is_locked": true,
      "is_system": true,
      "is_numeric": true,
      "src_tables": [
        "string"
      ],
      "is_semantic": true,
      "total_count": 42,
      "distinct_only": true,
      "always_one_selected": true
    }
  ],
  "tables": [
    {
      "name": "string",
      "comment": "string",
      "is_loose": true,
      "byte_size": 42,
      "is_system": true,
      "no_of_rows": 42,
      "is_semantic": true,
      "no_of_fields": 42,
      "no_of_key_fields": 42
    }
  ],
  "reload_meta": {
    "hardware": {
      "total_memory": 42,
      "logical_cores": 42
    },
    "cpu_time_spent_ms": 42,
    "peak_memory_bytes": 42,
    "fullReloadPeakMemoryBytes": 42,
    "partialReloadPeakMemoryBytes": 42
  },
  "static_byte_size": 42,
  "has_section_access": true,
  "is_direct_query_mode": true,
  "tables_profiling_data": [
    {
      "NoOfRows": 42,
      "FieldProfiling": [
        {
          "Max": 42,
          "Min": 42,
          "Std": 42,
          "Sum": 42,
          "Name": "string",
          "Sum2": 42,
          "Median": 42,
          "Average": 42,
          "Kurtosis": 42,
          "Skewness": 42,
          "FieldTags": [
            "string"
          ],
          "Fractiles": [
            42
          ],
          "NegValues": 42,
          "PosValues": 42,
          "LastSorted": "string",
          "NullValues": 42,
          "TextValues": 42,
          "ZeroValues": 42,
          "FirstSorted": "string",
          "AvgStringLen": 42,
          "DataEvenness": 42,
          "EmptyStrings": 42,
          "MaxStringLen": 42,
          "MinStringLen": 42,
          "MostFrequent": [
            {
              "Symbol": {
                "Text": "string",
                "Number": 42
              },
              "Frequency": 42
            }
          ],
          "NumberFormat": {
            "Dec": "string",
            "Fmt": "string",
            "Thou": "string",
            "nDec": 10,
            "UseThou": 0
          },
          "SumStringLen": 42,
          "NumericValues": 42,
          "DistinctValues": 42,
          "DistinctTextValues": 42,
          "DistinctNumericValues": 42,
          "FrequencyDistribution": {
            "BinsEdges": [
              42
            ],
            "Frequencies": [
              42
            ],
            "NumberOfBins": 42
          }
        }
      ]
    }
  ]
}
Exports a specific app.

Exports a specific app.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Query Parameters
NoData
boolean

The flag indicating if only object contents should be exported.

Path Parameters
appId
string
Required

Identifier of the app.

Responses
201

Created

400

Bad request

401

Unauthorized

403

Forbidden

404

Not Found

POST
/api/v1/apps/{appId}/export
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


await qlik.apps.exportApp('string', {})
Returns information about supported analyses for the app's data model. Lists available analysis types, along with minimum and maximum number of dimensions, measures, and fields.
Facts
	Rate limit	Special (500 requests per minute)
Header Parameters
accept-language
string

language specified as an ISO-639-1 code. Defaults to 'en' (English).

Path Parameters
appId
string
Required

Qlik Sense app identifier

format = "uid"

Responses
200

The request is successfully processed and information about supported analyses is returned.

application/json
object
Show application/json properties
400

Bad request. The payload is not formed correctly.

application/json
object
Show application/json properties
401

User is not authorized

application/json
object
Show application/json properties
404

Not found

application/json
object
Show application/json properties
422

Unprocessable entity. The payload contains fields that are invalid, such as too long of a query.

application/json
object
Show application/json properties
500

Internal server error

application/json
object
Show application/json properties
GET
/api/v1/apps/{appId}/insight-analyses
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


await qlik.apps.getAppInsightAnalyses(
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
)
Example Response
{
  "data": [
    {
      "id": "string",
      "compositions": [
        {
          "dims": {
            "max": 42,
            "min": 42
          },
          "geos": {
            "max": 42,
            "min": 42
          },
          "msrs": {
            "max": 42,
            "min": 42
          },
          "items": {
            "max": 42,
            "min": 42
          },
          "temporals": {
            "max": 42,
            "min": 42
          },
          "description": {
            "long": "string",
            "short": "string"
          }
        }
      ],
      "supportsMasterItems": true,
      "requiresAutoCalendarPeriod": true,
      "requiresDefinedAnalysisPeriod": true,
      "requiresAvailableAnalysisPeriod": true
    }
  ],
  "links": {
    "next": {
      "href": "http://example.com"
    },
    "prev": {
      "href": "http://example.com"
    },
    "self": {
      "href": "http://example.com"
    }
  }
}
Returns analysis recommendations in response to a natural language question, a set of fields and master items, or a set of fields and master items with an optional target analysis.
Facts
	Rate limit	Special (500 requests per minute)
Header Parameters
accept-language
string

language specified as an ISO-639-1 code. Defaults to 'en' (English).

Path Parameters
appId
string
Required

Qlik Sense app identifier

format = "uid"

Request Body
Required
application/json
object

Request payload can be of two types, using natural language query or consist of fields or master items and optional target analysis. In below examples, consider sales as a master item and product as field, so to get recommendations using sales and product, you can utilize below three approaches, also you can set language parameter in headers as part of accept-language. Examples:

{
  'text': 'show me sales by product'
}

{
  'fields': [
    {
      'name': 'product'
    }
  ],
  'libItems': [
    {
      libId: 'NwQfJ'
    }
  ]
}

{
  'fields': [
    {
      'name': 'product'
    }
  ],
  'libItems': [
    {
      'libId': 'NwQfJ'
    }
  ],
  'targetAnalysis': {
    'id': 'rank-rank'
  }
}

One of:
RecommendNaturalLangQuery
object
Show RecommendNaturalLangQuery properties
RecommendItems
object
Show RecommendItems properties
Responses
200

The request is successfully processed and recommendations are returned.

application/json
object
Show application/json properties
400

Bad request. The payload is not formed correctly.

application/json
object
Show application/json properties
401

User is not authorized

application/json
object
Show application/json properties
404

Not found

application/json
object
Show application/json properties
409

Invalid Business Logic

application/json
object
Show application/json properties
422

Unprocessable entity. The payload contains fields that are invalid, such as too long of a query.

application/json
object
Show application/json properties
500

Internal server error

application/json
object
Show application/json properties
POST
/api/v1/apps/{appId}/insight-analyses/actions/recommend
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


await qlik.apps.getAppInsightAnalysisRecommendations(
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
  { text: 'string' },
)
Example Response
{
  "data": [
    {
      "nluInfo": [
        {
          "role": "dimension",
          "text": "string",
          "type": "field",
          "fieldName": "string",
          "fieldValue": "string"
        }
      ],
      "recAnalyses": [
        {
          "options": {},
          "analysis": {
            "title": "string",
            "analysis": "breakdown",
            "analysisGroup": "anomaly"
          },
          "chartType": "barchart",
          "relevance": 42,
          "parts": [
            {
              "options": {},
              "analysis": {
                "title": "string",
                "analysis": "breakdown",
                "analysisGroup": "anomaly"
              },
              "chartType": "barchart",
              "relevance": 42
            }
          ]
        }
      ]
    }
  ]
}
Returns information about model used to make analysis recommendations. Lists all fields and master items in the logical model, along with an indication of the validity of the logical model if the default is not used.
Facts
	Rate limit	Special (500 requests per minute)
Path Parameters
appId
string
Required

Qlik Sense app identifier

format = "uid"

Responses
200

The request is successfully processed and information about model is returned.

application/json
object
Show application/json properties
400

Bad request. The payload is not formed correctly.

application/json
object
Show application/json properties
401

User is not authorized

application/json
object
Show application/json properties
404

Not found

application/json
object
Show application/json properties
409

Invalid Business Logic

application/json
object
Show application/json properties
422

Unprocessable entity. The payload contains fields that are invalid, such as too long of a query.

application/json
object
Show application/json properties
500

Internal server error

application/json
object
Show application/json properties
GET
/api/v1/apps/{appId}/insight-analyses/model
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


await qlik.apps.getAppInsightAnalysisModel(
  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',
)
Example Response
{
  "data": [
    {
      "fields": [
        {
          "name": "string",
          "isHidden": false,
          "classifications": [
            "dimension"
          ],
          "simplifiedClassifications": [
            "dimension"
          ]
        }
      ],
      "masterItems": [
        {
          "libId": "string",
          "caption": "string",
          "isHidden": false,
          "classifications": [
            "dimension"
          ],
          "simplifiedClassifications": [
            "dimension"
          ]
        }
      ],
      "isLogicalModelEnabled": true,
      "isDefinedLogicalModelValid": true
    }
  ],
  "links": {
    "next": {
      "href": "http://example.com"
    },
    "prev": {
      "href": "http://example.com"
    },
    "self": {
      "href": "http://example.com"
    }
  }
}
Gets media content from file. Returns a stream of bytes containing the media file content on success, or error if file is not found.

Gets media content from file. Returns a stream of bytes containing the media file content on success, or error if file is not found.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
appId
string
Required

Unique application identifier.

path
string
Required

Path to file content.

Responses
200

OK

application/octet-stream
string

format = "binary"

403

Forbidden

404

Not Found

GET
/api/v1/apps/{appId}/media/files/{path}
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


await qlik.apps.getAppMedia('string', 'string')
Stores the media content file. Returns OK if the bytes containing the media file content were successfully stored, or error in case of failure, lack of permission or file already exists on the supplied path.

Stores the media content file. Returns OK if the bytes containing the media file content were successfully stored, or error in case of failure, lack of permission or file already exists on the supplied path.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
appId
string
Required

Unique application identifier.

path
string
Required

Path to file content.

Request Body
Required
application/octet-stream
string

format = "binary"

Responses
200

OK

403

Forbidden

404

Not Found

409

Conflict

PUT
/api/v1/apps/{appId}/media/files/{path}
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


await qlik.apps.uploadAppMedia(
  'string',
  'string',
  new Uint8Array(readFileSync('<file-path>')),
)
Deletes a media content file or complete directory. Returns OK if the bytes containing the media file (or the complete content of a directory) were successfully deleted, or error in case of failure or lack of permission.

Deletes a media content file or complete directory. Returns OK if the bytes containing the media file (or the complete content of a directory) were successfully deleted, or error in case of failure or lack of permission.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
appId
string
Required

Unique application identifier.

path
string
Required

Path to file content.

Responses
200

OK

403

Forbidden

404

Not Found

DELETE
/api/v1/apps/{appId}/media/files/{path}
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


await qlik.apps.deleteAppMedia('string', 'string')
Lists media content. Returns a JSON formatted array of strings describing the available media content or error if the optional path supplied is not found.

Lists media content. Returns a JSON formatted array of strings describing the available media content or error if the optional path supplied is not found.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
show
string

Optional. List output can include files and folders in different ways:

Not recursive, default if show option is not supplied or incorrectly specified, results in output with files and empty directories for the path specified only.
Recursive(r), use ?show=r or ?show=recursive, results in a recursive output with files, all empty folders are excluded.
All(a), use ?show=a or ?show=all, results in a recursive output with files and empty directories.
Path Parameters
appId
string
Required

Unique application identifier.

path
string
Required

The path to sub folder with static content relative to the root folder. Use empty path to access the root folder.

Responses
200

OK

application/json
object
Show application/json properties
403

Forbidden

404

Not Found

GET
/api/v1/apps/{appId}/media/list/{path}
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


await qlik.apps.getAppMediaList(
  'string',
  'string',
  {},
)
Example Response
{
  "data": [
    {
      "id": "string",
      "link": "string",
      "name": "string",
      "type": "string"
    }
  ],
  "library": "string",
  "subpath": "string"
}
Gets media content from file currently used as application thumbnail. Returns a stream of bytes containing the media file content on success, or error if file is not found. The image selected as thumbnail is only updated when application is saved.

Gets media content from file currently used as application thumbnail. Returns a stream of bytes containing the media file content on success, or error if file is not found. The image selected as thumbnail is only updated when application is saved.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
appId
string
Required

Unique application identifier.

Responses
200

OK

application/octet-stream
string

format = "binary"

403

Forbidden

404

Not Found

GET
/api/v1/apps/{appId}/media/thumbnail
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


await qlik.apps.getAppThumbnail('string')
Sets owner on an app object. The user must be the owner of the object.

Sets owner on an app object. The user must be the owner of the object.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
appId
string
Required

Identifier of the app.

objectId
string
Required

Identifier of the object.

Request Body
Required

New owner.

*/*
object
Show */* properties
Responses
200

OK

application/json
object

Application object attributes and user privileges.

Show application/json properties
400

Bad request

404

Not Found

POST
/api/v1/apps/{appId}/objects/{objectId}/actions/change-owner
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


await qlik.apps.updateAppObjectOwner(
  'string',
  'string',
  { ownerId: 'string' },
)
Example Response
{
  "attributes": {
    "id": "string",
    "name": "string",
    "ownerId": "string",
    "approved": true,
    "createdAt": "2018-10-30T07:06:22Z",
    "updatedAt": "2018-10-30T07:06:22Z",
    "objectType": "string",
    "description": "string",
    "publishedAt": "2018-10-30T07:06:22Z"
  },
  "privileges": [
    "string"
  ]
}
Changes owner of the app.

Changes owner of the app.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
appId
string
Required

Identifier of the app.

Request Body
Required

New owner.

*/*
object
Show */* properties
Responses
200

OK

application/json
object

Application attributes and user privileges.

Show application/json properties
403

Forbidden

404

Not Found

PUT
/api/v1/apps/{appId}/owner
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


await qlik.apps.updateAppOwner('string', {
  ownerId: 'string',
})
Example Response
{
  "create": [
    {
      "resource": "string",
      "canCreate": true
    }
  ],
  "attributes": {
    "id": "string",
    "name": "string",
    "owner": "string",
    "custom": {},
    "ownerId": "string",
    "encrypted": true,
    "published": true,
    "thumbnail": "string",
    "createdDate": "2018-10-30T07:06:22Z",
    "description": "string",
    "originAppId": "string",
    "publishTime": "2018-10-30T07:06:22Z",
    "dynamicColor": "string",
    "modifiedDate": "2018-10-30T07:06:22Z",
    "lastReloadTime": "2018-10-30T07:06:22Z",
    "hasSectionAccess": true,
    "isDirectQueryMode": true
  },
  "privileges": [
    "string"
  ]
}
Retrieves the app size override for an app.

Retrieves the app size override for an app.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
appId
string
Required

Identifier of the app

Responses
200

OK

application/json
object

Override for app placement on non reload engines.

Show application/json properties
GET
/api/v1/apps/{appId}/placement
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/v1/apps/{appId}/placement` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/v1/apps/{appId}/placement',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "createdAt": "2018-10-30T07:06:22Z"
}
Sets the app size override for an app.

Sets the app size override for an app.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
appId
string
Required

Identifier of the app

Request Body
Required

The override information to be used for app placement.

*/*
object

Engine size override for app placement on non reload engines.

Show */* properties
Responses
200

OK

PUT
/api/v1/apps/{appId}/placement
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `PUT /api/v1/apps/{appId}/placement` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/v1/apps/{appId}/placement',
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Removes the app size override for an app.

Removes the app size override for an app.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
appId
string
Required

Identifier of the app

Responses
200

OK

DELETE
/api/v1/apps/{appId}/placement
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `DELETE /api/v1/apps/{appId}/placement` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/v1/apps/{appId}/placement',
  {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Publishes a specific app to a managed space.

Publishes a specific app to a managed space.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
appId
string
Required

Identifier of the app.

Request Body
Required

Publish information for the app.

*/*
object
Show */* properties
Responses
200

OK

application/json
object

Application attributes and user privileges.

Show application/json properties
POST
/api/v1/apps/{appId}/publish
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


await qlik.apps.publishApp('string', {
  attributes: {
    description: 'string',
    name: 'string',
  },
  originAppId: 'string',
  spaceId: 'string',
})
Example Response
{
  "create": [
    {
      "resource": "string",
      "canCreate": true
    }
  ],
  "attributes": {
    "id": "string",
    "name": "string",
    "owner": "string",
    "custom": {},
    "ownerId": "string",
    "encrypted": true,
    "published": true,
    "thumbnail": "string",
    "createdDate": "2018-10-30T07:06:22Z",
    "description": "string",
    "originAppId": "string",
    "publishTime": "2018-10-30T07:06:22Z",
    "dynamicColor": "string",
    "modifiedDate": "2018-10-30T07:06:22Z",
    "lastReloadTime": "2018-10-30T07:06:22Z",
    "hasSectionAccess": true,
    "isDirectQueryMode": true
  },
  "privileges": [
    "string"
  ]
}
Republishes a published app to a managed space.

Republishes a published app to a managed space.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
appId
string
Required

Identifier of the app.

Request Body
Required

Republish information for the app.

*/*
object
Show */* properties
Responses
200

OK

application/json
object

Application attributes and user privileges.

Show application/json properties
PUT
/api/v1/apps/{appId}/publish
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


await qlik.apps.republishApp('string', {
  attributes: {
    description: 'string',
    name: 'string',
  },
  checkOriginAppId: true,
  targetId: 'string',
})
Example Response
{
  "create": [
    {
      "resource": "string",
      "canCreate": true
    }
  ],
  "attributes": {
    "id": "string",
    "name": "string",
    "owner": "string",
    "custom": {},
    "ownerId": "string",
    "encrypted": true,
    "published": true,
    "thumbnail": "string",
    "createdDate": "2018-10-30T07:06:22Z",
    "description": "string",
    "originAppId": "string",
    "publishTime": "2018-10-30T07:06:22Z",
    "dynamicColor": "string",
    "modifiedDate": "2018-10-30T07:06:22Z",
    "lastReloadTime": "2018-10-30T07:06:22Z",
    "hasSectionAccess": true,
    "isDirectQueryMode": true
  },
  "privileges": [
    "string"
  ]
}
Retrieves the metadata about all script logs stored for an app. Returns an array of ScriptLogMeta objects.

Retrieves the metadata about all script logs stored for an app. Returns an array of ScriptLogMeta objects.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
appId
string
Required

Identifier of the app.

Responses
200

OK

application/json
object
Show application/json properties
GET
/api/v1/apps/{appId}/reloads/logs
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


await qlik.apps.getAppReloadLogs('string')
Example Response
{
  "data": [
    {
      "links": {
        "log": "string"
      },
      "endTime": "2018-10-30T07:06:22Z",
      "success": true,
      "duration": 42,
      "reloadId": "string"
    }
  ]
}
Retrieves the log of a specific reload. Returns the log as "text/plain; charset=UTF-8".

Retrieves the log of a specific reload. Returns the log as "text/plain; charset=UTF-8".

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
appId
string
Required

Identifier of the app.

reloadId
string
Required

Identifier of the reload.

Responses
200

OK

application/octet-stream
string

format = "binary"

GET
/api/v1/apps/{appId}/reloads/logs/{reloadId}
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


await qlik.apps.getAppReloadLog(
  'string',
  'string',
)
Retrieves the app reload metadata list. Reload metadata contains reload information, including reload id, duration, endtime and lineage load info. Data is available for the last 10 reloads of an application.

Retrieves the app reload metadata list. Reload metadata contains reload information, including reload id, duration, endtime and lineage load info. Data is available for the last 10 reloads of an application.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
includeSkipStoreReloads
boolean

Include metadata for reloads ran with SkipStore flag set to true. Default: false

limit
string

Maximum number of records to return from this request. Default: 100

reloadId
string

Identifier of the reload. Use empty reloadId to get all reloads.

Path Parameters
appId
string
Required

Identifier of the app

Responses
200

OK

application/json
object
Show application/json properties
GET
/api/v1/apps/{appId}/reloads/metadata/{reloadId}
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


await qlik.apps.getAppReloadMetadata(
  'string',
  '',
  {},
)
Example Response
{
  "data": [
    {
      "endTime": "2018-10-30T07:06:22Z",
      "success": true,
      "duration": 42,
      "reloadId": "string",
      "rowLimit": -1,
      "appDbHash": "string",
      "skipStore": false,
      "storeHash": "string",
      "statements": [
        {
          "qri": "string",
          "type": "string",
          "label": "string",
          "dataSize": 42,
          "duration": 42,
          "nbrOfRows": 42,
          "tableName": "string",
          "connection": "string",
          "nbrOfFields": 42,
          "connectionId": "string",
          "partialReloadOperation": "string"
        }
      ],
      "accessDbHash": "string",
      "includeFiles": [
        {
          "qri": "string",
          "path": "string",
          "connection": "string"
        }
      ],
      "loadFilesBytes": 42,
      "isPartialReload": true,
      "storeFilesBytes": 42,
      "loadExternalBytes": 42,
      "loadDataFilesBytes": 42,
      "storeDataFilesBytes": 42
    }
  ]
}
Get the filter list

List all filters that are present in the given app. Filters allow to reduce the app data visible in a report output. Each filter can contain definitions on one or multiple fields.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
filterTypes
array of strings
Required

The filter type (REP, SUB). REP stands for report bookmark, SUB for subscription bookmark.

Values may be any of: "REP""SUB"

minItems = 1

filter
string

The advanced filtering to use for the query. Refer to RFC 7644 for the syntax. Cannot be combined with any of the fields marked as deprecated. All conditional statements within this query parameter are case insensitive. The following fields support the co (contains) operator: name, description The following fields support the eq (equals) operator: id, ownerId Example: (name co "query1" or description co "query2") and ownerId eq "123"

limit
integer

Limit the returned result set

minimum = 1, maximum = 100, default = 20, default = 20

loadType
string

Load type expressing the kind of request, eg. interactive for report requests from the Web UI, batch for scheduled report generation.

Can be one of: "interactive""batch"

default = "interactive"

page
string

If present, the cursor that starts the page of data that is returned.

sort
array of strings

Sorting parameters.

Values may be any of: "+ownerId""-ownerId""-name""+name""+description""-description""+createdAt""-createdAt""+updatedAt""-updatedAt"

Path Parameters
appId
string
Required

Qlik Sense app identifier

format = "uid"

Responses
200

The filters have been successfully returned.

application/json
object
Show application/json properties
400

Bad request. Malformed syntax, errors in params.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
401

Unauthorized, JWT invalid or not provided.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
403

Forbidden, user lacks sufficient permissions to access the resource.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
404

Not found.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
429

Too many request. Indicates the user has sent too many requests in a given amount of time, aka "rate limiting".

application/json
object

Errors occured during the Filter creation.

Show application/json properties
500

Internal server error.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
GET
/api/v1/apps/{appId}/report-filters
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


await qlik.apps.getAppReportFilters(
  '11ecf638-0be4-4b94-a9e6-91218f34e175',
  { filterTypes: [] },
)
Example Response
{
  "data": [
    {
      "id": "c61841ac-7b35-4434-aa74-4421f10fc68e",
      "name": "Filter 1",
      "ownerId": "649173fbc8ffcfde27412b99",
      "createdAt": "2023-08-09T08:19:37.577Z",
      "updatedAt": "2023-08-09T08:19:37.577Z",
      "filterType": "REP",
      "filterV1_0": {
        "fieldsByState": {
          "$": [
            {
              "name": "Country",
              "values": [
                {
                  "valueType": "string",
                  "valueAsText": "1-Argentina"
                },
                {
                  "valueType": "string",
                  "valueAsText": "4-Brazil"
                }
              ],
              "overrideValues": false,
              "selectExcluded": false
            },
            {
              "name": "Order number",
              "values": [
                {
                  "valueType": "number",
                  "valueAsText": "61300",
                  "valueAsNumber": 61300
                }
              ],
              "overrideValues": false,
              "selectExcluded": false
            }
          ]
        }
      },
      "description": "This is the filter description",
      "filterVersion": "filter-1.0"
    }
  ],
  "links": {
    "next": {
      "href": "https://tenant.qlik-cloud.com:443/api/v1/apps/816e23e1-03d2-446b-8721-cdee6b5e59cf/report-filters?filter=&filterTypes=REP&filterTypes=REP&limit=20&page=0&sort=%2Bname"
    },
    "prev": {
      "href": "https://tenant.qlik-cloud.com:443/api/v1/apps/816e23e1-03d2-446b-8721-cdee6b5e59cf/report-filters?filter=&filterTypes=REP&filterTypes=REP&limit=20&page=0&sort=%2Bname"
    },
    "self": {
      "href": "https://tenant.qlik-cloud.com:443/api/v1/apps/816e23e1-03d2-446b-8721-cdee6b5e59cf/report-filters?filter=&filterTypes=REP&filterTypes=REP&limit=20&page=0&sort=%2Bname"
    }
  }
}
Create a new filter.

Creates a new report filter which is used to re-apply selections, variables, patches to an engine session.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
appId
string
Required

Qlik Sense app identifier

format = "uid"

Request Body
Required

The filter definition.

application/json
object
Show application/json properties
Responses
201

The filter has been successfully created.

application/json
object
Show application/json properties
400

Bad request, malformed syntax, errors in params or the report request is not valid.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
401

Unauthorized, JWT invalid or not provided.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
403

Forbidden, user lacks sufficient permissions to access the resource.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
404

Not found.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
409

Filter name conflict.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
429

Too many request. Indicates the user has sent too many requests in a given amount of time, aka "rate limiting".

application/json
object

Errors occured during the Filter creation.

Show application/json properties
500

Internal server error.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
POST
/api/v1/apps/{appId}/report-filters
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


await qlik.apps.createAppReportFilter(
  '11ecf638-0be4-4b94-a9e6-91218f34e175',
  {
    description: 'this is a filter sample',
    filterType: 'REP',
    filterV1_0: {
      fieldsByState: {
        $: [
          {
            name: 'Country',
            values: [
              {
                valueAsText: '1-Argentina',
                valueType: 'string',
              },


              {
                valueAsText: '4-Brazil',
                valueType: 'string',
              },
            ],
          },


          {
            name: 'Order number',
            values: [
              {
                valueAsNumber: 61300,
                valueAsText: '61300',
                valueType: 'number',
              },
            ],
          },
        ],
      },
    },
    filterVersion: 'filter-1.0',
    name: 'Filter sample',
  },
)
Example Response
{
  "id": "c61841ac-7b35-4434-aa74-4421f10fc68e",
  "name": "Filter 1",
  "ownerId": "649173fbc8ffcfde27412b99",
  "createdAt": "2023-08-09T08:19:37.577Z",
  "updatedAt": "2023-08-09T08:19:37.577Z",
  "filterType": "REP",
  "filterV1_0": {
    "fieldsByState": {
      "$": [
        {
          "name": "Country",
          "values": [
            {
              "valueType": "string",
              "valueAsText": "1-Argentina"
            },
            {
              "valueType": "string",
              "valueAsText": "4-Brazil"
            }
          ],
          "overrideValues": false,
          "selectExcluded": false
        },
        {
          "name": "Order number",
          "values": [
            {
              "valueType": "number",
              "valueAsText": "61300",
              "valueAsNumber": 61300
            }
          ],
          "overrideValues": false,
          "selectExcluded": false
        }
      ]
    }
  },
  "description": "This is the filter description",
  "filterVersion": "filter-1.0"
}
Get a filter
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
loadType
string

Load type expressing the kind of request, eg. interactive for report requests from the Web UI, batch for scheduled report generation.

Can be one of: "interactive""batch"

default = "interactive"

Path Parameters
appId
string
Required

Qlik Sense app identifier

format = "uid"

id
string
Required

The filter id identifier (bookmarkId).

Responses
200

The filter has been successfully returned.

application/json
object
Show application/json properties
400

Bad request. Malformed syntax, errors in params.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
401

Unauthorized, JWT invalid or not provided.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
403

Forbidden, user lacks sufficient permissions to access the resource.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
404

Not found.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
429

Too many request. Indicates the user has sent too many requests in a given amount of time, aka "rate limiting".

application/json
object

Errors occured during the Filter creation.

Show application/json properties
500

Internal server error.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
GET
/api/v1/apps/{appId}/report-filters/{id}
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


await qlik.apps.getAppReportFilter(
  '01562a37-23e3-4b43-865d-84c26122276c',
  '01562a37-23e3-4b43-865d-84c26122276c',
)
Example Response
{
  "id": "c61841ac-7b35-4434-aa74-4421f10fc68e",
  "name": "Filter 1",
  "ownerId": "649173fbc8ffcfde27412b99",
  "createdAt": "2023-08-09T08:19:37.577Z",
  "updatedAt": "2023-08-09T08:19:37.577Z",
  "filterType": "REP",
  "filterV1_0": {
    "fieldsByState": {
      "$": [
        {
          "name": "Country",
          "values": [
            {
              "valueType": "string",
              "valueAsText": "1-Argentina"
            },
            {
              "valueType": "string",
              "valueAsText": "4-Brazil"
            }
          ],
          "overrideValues": false,
          "selectExcluded": false
        },
        {
          "name": "Order number",
          "values": [
            {
              "valueType": "number",
              "valueAsText": "61300",
              "valueAsNumber": 61300
            }
          ],
          "overrideValues": false,
          "selectExcluded": false
        }
      ]
    }
  },
  "description": "This is the filter description",
  "filterVersion": "filter-1.0"
}
Update a filter
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
appId
string
Required

Qlik Sense app identifier

format = "uid"

id
string
Required

The filter id identifier (bookmarkId).

Request Body
Required

The filter definition that will replace the existing one.

application/json
array of objects
Show application/json properties
Responses
204

The filter has been successfully patched.

400

Bad request. Malformed syntax, errors in params.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
401

Unauthorized, JWT invalid or not provided.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
403

Forbidden, user lacks sufficient permissions to access the resource.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
404

Not found.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
409

Filter name conflict. A filter with the same name already exists.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
429

Too many request. Indicates the user has sent too many requests in a given amount of time, aka "rate limiting".

application/json
object

Errors occured during the Filter creation.

Show application/json properties
500

Internal server error.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
PATCH
/api/v1/apps/{appId}/report-filters/{id}
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


await qlik.apps.patchAppReportFilter(
  '01562a37-23e3-4b43-865d-84c26122276c',
  '01562a37-23e3-4b43-865d-84c26122276c',
  [
    {
      op: 'replace',
      path: '/filter',
      value: {
        Filter: {
          description:
            'This is the filter description',
          filterV1_0: {
            fieldsByState: {
              $: [
                {
                  name: 'Country',
                  values: [
                    {
                      valueAsText: '1-Argentina',
                      valueType: 'string',
                    },


                    {
                      valueAsText: '4-Brazil',
                      valueType: 'string',
                    },
                  ],
                },


                {
                  name: 'Order number',
                  values: [
                    {
                      valueAsNumber: 61300,
                      valueAsText: '61300',
                      valueType: 'number',
                    },
                  ],
                },
              ],
            },
          },
          filterVersion: 'filter-1.0',
          name: 'Filter 1',
          ownerId: '649173fbc8ffcfde27412b99',
        },
      },
    },
  ],
)
Delete a filter
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
appId
string
Required

Qlik Sense app identifier

format = "uid"

id
string
Required

The filter id identifier (bookmarkId).

Responses
204

The filter has been successfully deleted.

400

Bad request. Malformed syntax, errors in params.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
401

Unauthorized, JWT invalid or not provided.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
403

Forbidden, user lacks sufficient permissions to access the resource.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
404

Not found.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
429

Too many request. Indicates the user has sent too many requests in a given amount of time, aka "rate limiting".

application/json
object

Errors occured during the Filter creation.

Show application/json properties
500

Internal server error.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
DELETE
/api/v1/apps/{appId}/report-filters/{id}
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


await qlik.apps.deleteAppReportFilter(
  '01562a37-23e3-4b43-865d-84c26122276c',
  '01562a37-23e3-4b43-865d-84c26122276c',
)
Get the number of filters for the given app and filter types
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
filterTypes
array of strings
Required

The filter type (REP, SUB). REP stands for report bookmark, SUB for subscription bookmark.

Values may be any of: "REP""SUB"

minItems = 1

Path Parameters
appId
string
Required

Qlik Sense app identifier

format = "uid"

Responses
200

The count of filters.

application/json
object
Show application/json properties
400

Bad request. Malformed syntax, errors in params.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
401

Unauthorized, JWT invalid or not provided.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
403

Forbidden, user lacks sufficient permissions to access the resource.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
404

Not found.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
429

Too many request. Indicates the user has sent too many requests in a given amount of time, aka "rate limiting".

application/json
object

Errors occured during the Filter creation.

Show application/json properties
500

Internal server error.

application/json
object

Errors occured during the Filter creation.

Show application/json properties
GET
/api/v1/apps/{appId}/report-filters/actions/count
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


await qlik.apps.countAppReportFilters(
  '01562a37-23e3-4b43-865d-84c26122276c',
  { filterTypes: ['REP'] },
)
Example Response
{
  "total": 20
}
Retrieves the script history for an app. Returns information about the saved versions of the script in a list sorted with latest first.

Retrieves the script history for an app. Returns information about the saved versions of the script in a list sorted with latest first.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
filter
string

A scim filter expression defining which script versions should be retrieved. Filterable fields are:

ScriptId
ModifiedTime
ModifierId
limit
string

Maximum number of records to return from this request.

page
string

Opaque definition of which page of the result set to return. Returned from a previous call using the same filter. Not yet supported.

Path Parameters
appId
string
Required

Identifier of the app.

Responses
200

OK

application/json
object
Show application/json properties
GET
/api/v1/apps/{appId}/scripts
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


await qlik.apps.getAppScriptHistory('string', {})
Example Response
{
  "links": {
    "next": {
      "href": "string"
    },
    "prev": {
      "href": "string"
    }
  },
  "scripts": [
    {
      "size": 42,
      "scriptId": "string",
      "modifierId": "string",
      "modifiedTime": "string",
      "versionMessage": "string"
    }
  ],
  "privileges": [
    "string"
  ]
}
Sets script for an app.

Sets script for an app.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
appId
string
Required

Identifier of the app.

Request Body
Required

The script to set.

*/*
object
Show */* properties
Responses
200

OK

POST
/api/v1/apps/{appId}/scripts
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


await qlik.apps.updateAppScript('string', {
  script: 'string',
  versionMessage: 'string',
})
Retrieves a version of the script for an app. Returns the script text.

Retrieves a version of the script for an app. Returns the script text.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
appId
string
Required

Identifier of the app.

id
string
Required

Identifier of the script version, or 'current' for retrieving the current version.

Responses
200

OK

application/json
object
Show application/json properties
GET
/api/v1/apps/{appId}/scripts/{id}
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


await qlik.apps.getAppScript('string', 'string')
Example Response
{
  "script": "string",
  "versionMessage": "string"
}
Updates a specific version of the script for an app.

Updates a specific version of the script for an app.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
appId
string
Required

Identifier of the app.

id
string
Required

Identifier of the script version.

Request Body
Required

Array of patches for the object ScriptVersion.

Patches have limited functionality for this object. Only /versionMessage can be modified using operations add, remove and replace.
*/*
array of objects
Show */* properties
Responses
200

OK

PATCH
/api/v1/apps/{appId}/scripts/{id}
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


await qlik.apps.patchAppScript(
  'string',
  'string',
  [{ Path: 'string', Value: 'string' }],
)
Deletes a specific version of the script for an app. Fails if the supplied id is the current version.

Deletes a specific version of the script for an app. Fails if the supplied id is the current version.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
appId
string
Required

Identifier of the app.

id
string
Required

Identifier of the script version

Responses
200

OK

DELETE
/api/v1/apps/{appId}/scripts/{id}
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


await qlik.apps.deleteAppScript(
  'string',
  'string',
)
Sets space on a specific app.

Sets space on a specific app.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
appId
string
Required

Identifier of the app.

Request Body
Required

New space.

*/*
object
Show */* properties
Responses
200

OK

application/json
object

Application attributes and user privileges.

Show application/json properties
PUT
/api/v1/apps/{appId}/space
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


await qlik.apps.moveAppToSpace('string', {
  spaceId: 'string',
})
Example Response
{
  "create": [
    {
      "resource": "string",
      "canCreate": true
    }
  ],
  "attributes": {
    "id": "string",
    "name": "string",
    "owner": "string",
    "custom": {},
    "ownerId": "string",
    "encrypted": true,
    "published": true,
    "thumbnail": "string",
    "createdDate": "2018-10-30T07:06:22Z",
    "description": "string",
    "originAppId": "string",
    "publishTime": "2018-10-30T07:06:22Z",
    "dynamicColor": "string",
    "modifiedDate": "2018-10-30T07:06:22Z",
    "lastReloadTime": "2018-10-30T07:06:22Z",
    "hasSectionAccess": true,
    "isDirectQueryMode": true
  },
  "privileges": [
    "string"
  ]
}
Removes space from a specific app.

Removes space from a specific app.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
appId
string
Required

Identifier of the app.

Responses
200

OK

application/json
object

Application attributes and user privileges.

Show application/json properties
DELETE
/api/v1/apps/{appId}/space
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


await qlik.apps.removeAppFromSpace('string')
Example Response
{
  "create": [
    {
      "resource": "string",
      "canCreate": true
    }
  ],
  "attributes": {
    "id": "string",
    "name": "string",
    "owner": "string",
    "custom": {},
    "ownerId": "string",
    "encrypted": true,
    "published": true,
    "thumbnail": "string",
    "createdDate": "2018-10-30T07:06:22Z",
    "description": "string",
    "originAppId": "string",
    "publishTime": "2018-10-30T07:06:22Z",
    "dynamicColor": "string",
    "modifiedDate": "2018-10-30T07:06:22Z",
    "lastReloadTime": "2018-10-30T07:06:22Z",
    "hasSectionAccess": true,
    "isDirectQueryMode": true
  },
  "privileges": [
    "string"
  ]
}
Retrieve a list of all historic evaluations for an app GUID
Replacement available

For new integrations, and when updating your existing integrations, use:

GET analytics/apps/{guid}/evaluations

Find all evaluations for an app GUID. Supports paging via next, prev which are sent in the response body

Facts
	Rate limit	Tier 1 (1000 requests per minute)

	Replaced by	
GET analytics/apps/{guid}/evaluations
Query Parameters
all
boolean

Get the full data of the evaluation

fileMode
boolean

Add file transfer headers to response

format
string

Specify output format, currently supported are 'json' and 'xml'

limit
integer

Number of results to return per page.

minimum = 1, maximum = 100, default = 20, format = int32, default = 20

next
string

The app evaluation id to get next page from

prev
string

The app evaluation id to get previous page from

sort
string

Property to sort list on

Path Parameters
guid
string
Required

The app guid.

Responses
200

Evaluation(s) retrieved successfully.

application/json
object
Show application/json properties
400

Bad request.

application/json
object
Show application/json properties
404

Not Found.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
GET
/api/v1/apps/{guid}/evaluations
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


await qlik.apps.getAppEvaluations(
  'abcdefghijklmnopq',
  {},
)
Example Response
{
  "data": [
    {
      "id": "5ecb5e65028d1f0001a98071",
      "appId": "7c2ce11d-4d10-4414-a9b0-620e57298038",
      "ended": "2022-02-09T06:58:40.575Z",
      "events": [
        {
          "details": "An object failed",
          "sheetId": "gregFG",
          "objectId": "adfRFr",
          "severity": "warning",
          "errorCode": "ERR-GOPHERCISER",
          "objectType": "linechart",
          "sheetTitle": "mysheet",
          "objectTitle": "profit",
          "objectVisualization": "linechart"
        }
      ],
      "result": {
        "sheets": [
          {
            "sheet": {
              "id": "fjETFn",
              "title": "my chart",
              "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
              "objectType": "table",
              "timeoutStatusCode": "CALC-TIMEOUT",
              "responseTimeSeconds": 12.3
            },
            "objectCount": 1,
            "sheetObjects": [
              {
                "id": "fjETFn",
                "title": "my chart",
                "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
                "objectType": "table",
                "timeoutStatusCode": "CALC-TIMEOUT",
                "responseTimeSeconds": 12.3
              }
            ]
          }
        ],
        "rowCount": 20000,
        "objNoCache": [
          {
            "id": "fjETFn",
            "title": "my chart",
            "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
            "objectType": "table",
            "timeoutStatusCode": "CALC-TIMEOUT",
            "responseTimeSeconds": 12.3
          }
        ],
        "sheetCount": 5,
        "objectCount": 33,
        "objSlowCached": [
          {
            "id": "fjETFn",
            "title": "my chart",
            "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
            "objectType": "table",
            "timeoutStatusCode": "CALC-TIMEOUT",
            "responseTimeSeconds": 12.3
          }
        ],
        "objMemoryLimit": [
          {
            "id": "fjETFn",
            "title": "my chart",
            "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
            "objectType": "table",
            "memoryLimitStatusCode": "OUT-OF-MEMORY"
          }
        ],
        "documentSizeMiB": 12.3,
        "objSlowUncached": [
          {
            "id": "fjETFn",
            "title": "my chart",
            "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
            "objectType": "table",
            "timeoutStatusCode": "CALC-TIMEOUT",
            "responseTimeSeconds": 12.3
          }
        ],
        "hasSectionAccess": false,
        "topFieldsByBytes": [
          {
            "name": "a",
            "byte_size": 1234,
            "is_system": false
          }
        ],
        "topTablesByBytes": [
          {
            "name": "a",
            "byte_size": 1234,
            "is_system": false
          }
        ],
        "objSingleThreaded": [
          {
            "id": "fjETFn",
            "title": "my chart",
            "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
            "objectType": "table",
            "cpuQuotient1": 12.3
          }
        ]
      },
      "status": "finished",
      "appName": "my app",
      "details": {
        "errors": [
          "this is an error"
        ],
        "warnings": [
          "this is a warning"
        ],
        "dedicated": false,
        "objectMetrics": {},
        "engineHasCache": false,
        "concurrentReload": false
      },
      "sheetId": "zyb2bQTeFmPVt9TXZOS0I5GZCFn",
      "started": "2022-02-09T06:58:40.575Z",
      "version": 1,
      "metadata": {
        "reloadmeta": {
          "cpuspent": "123983",
          "peakmemorybytes": 112
        },
        "amountofrows": 1423423234,
        "amountoffields": 12,
        "amountoftables": 7,
        "staticbytesize": 1444234,
        "hassectionaccess": false,
        "amountoffieldvalues": 144423433,
        "amountofcardinalfieldvalues": 14442
      },
      "tenantId": "zyb2bQTeFmPVt9TXZOS0I5GZCFn",
      "appItemId": "zyb2bQTeFmPVt9TXZOS0I5GZCFn",
      "timestamp": "2022-02-09T06:58:40.575Z",
      "sheetTitle": "my sheet"
    }
  ],
  "links": {
    "next": {
      "href": "/api/v1/evaluations/appId=a84c22cf-31e5-41fe-9e8f-544b85513484&prev=5f5201908b3fc5fc132dbd35"
    },
    "prev": {
      "href": "/api/v1/evaluations/appId=a84c22cf-31e5-41fe-9e8f-544b85513484&prev=5f5201908b3fc5fc132dbd35"
    }
  }
}
Queue an app evaluation
Replacement available

For new integrations, and when updating your existing integrations, use:

POST analytics/apps/{guid}/evaluations

Queue an app evaluation by its app guid.

Facts
	Rate limit	Tier 2 (100 requests per minute)

	Replaced by	
POST analytics/apps/{guid}/evaluations
Path Parameters
guid
string
Required

Guid of the app.

Responses
201

App evaluation queued.

application/json
object
Show application/json properties
400

Bad request, incorrect body.

application/json
object
Show application/json properties
403

User lacks permissions to evaluate app.

application/json
object
Show application/json properties
404

App does not exist.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
POST
/api/v1/apps/{guid}/evaluations
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


await qlik.apps.queueAppEvaluation(
  'abcdefghijklmnopq',
)
Example Response
{
  "id": "5ecb5e65028d1f0001a98071",
  "appId": "7c2ce11d-4d10-4414-a9b0-620e57298038",
  "ended": "2022-02-09T06:58:40.575Z",
  "events": [
    {
      "details": "An object failed",
      "sheetId": "gregFG",
      "objectId": "adfRFr",
      "severity": "warning",
      "errorCode": "ERR-GOPHERCISER",
      "objectType": "linechart",
      "sheetTitle": "mysheet",
      "objectTitle": "profit",
      "objectVisualization": "linechart"
    }
  ],
  "result": {
    "sheets": [
      {
        "sheet": {
          "id": "fjETFn",
          "title": "my chart",
          "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
          "objectType": "table",
          "timeoutStatusCode": "CALC-TIMEOUT",
          "responseTimeSeconds": 12.3
        },
        "objectCount": 1,
        "sheetObjects": [
          {
            "id": "fjETFn",
            "title": "my chart",
            "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
            "objectType": "table",
            "timeoutStatusCode": "CALC-TIMEOUT",
            "responseTimeSeconds": 12.3
          }
        ]
      }
    ],
    "rowCount": 20000,
    "objNoCache": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "timeoutStatusCode": "CALC-TIMEOUT",
        "responseTimeSeconds": 12.3
      }
    ],
    "sheetCount": 5,
    "objectCount": 33,
    "objSlowCached": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "timeoutStatusCode": "CALC-TIMEOUT",
        "responseTimeSeconds": 12.3
      }
    ],
    "objMemoryLimit": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "memoryLimitStatusCode": "OUT-OF-MEMORY"
      }
    ],
    "documentSizeMiB": 12.3,
    "objSlowUncached": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "timeoutStatusCode": "CALC-TIMEOUT",
        "responseTimeSeconds": 12.3
      }
    ],
    "hasSectionAccess": false,
    "topFieldsByBytes": [
      {
        "name": "a",
        "byte_size": 1234,
        "is_system": false
      }
    ],
    "topTablesByBytes": [
      {
        "name": "a",
        "byte_size": 1234,
        "is_system": false
      }
    ],
    "objSingleThreaded": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "cpuQuotient1": 12.3
      }
    ]
  },
  "status": "finished",
  "appName": "my app",
  "details": {
    "errors": [
      "this is an error"
    ],
    "warnings": [
      "this is a warning"
    ],
    "dedicated": false,
    "objectMetrics": {},
    "engineHasCache": false,
    "concurrentReload": false
  },
  "sheetId": "zyb2bQTeFmPVt9TXZOS0I5GZCFn",
  "started": "2022-02-09T06:58:40.575Z",
  "version": 1,
  "metadata": {
    "reloadmeta": {
      "cpuspent": "123983",
      "peakmemorybytes": 112
    },
    "amountofrows": 1423423234,
    "amountoffields": 12,
    "amountoftables": 7,
    "staticbytesize": 1444234,
    "hassectionaccess": false,
    "amountoffieldvalues": 144423433,
    "amountofcardinalfieldvalues": 14442
  },
  "tenantId": "zyb2bQTeFmPVt9TXZOS0I5GZCFn",
  "appItemId": "zyb2bQTeFmPVt9TXZOS0I5GZCFn",
  "timestamp": "2022-02-09T06:58:40.575Z",
  "sheetTitle": "my sheet"
}
Compare two evaluations
Replacement available

For new integrations, and when updating your existing integrations, use:

GET analytics/apps/evaluations/{baselineId}/compare/{comparisonId}

Accepts two evaluation ids and returns a comparison denoting the differences between the two.

Facts
	Rate limit	Tier 1 (1000 requests per minute)

	Replaced by	
GET analytics/apps/evaluations/{baselineId}/compare/{comparisonId}
Query Parameters
all
boolean

Get the full list of comparisons including non-significant diffs

format
string

Specify output format, currently supported are 'json' and 'xml'

Path Parameters
baseid
string
Required

Id of the baseline evaluation

comparisonid
string
Required

Id of the comparison evaluation

Responses
200

Comparison executed successfully.

application/json
object
Show application/json properties
404

Not Found.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
GET
/api/v1/apps/evaluations/{baseid}/actions/compare/{comparisonid}
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


await qlik.apps.getAppEvaluationComparison(
  'abcdefghijklmnopq',
  'abcdefghijklmnopq',
  {},
)
Example Response
{
  "objHeavy": {
    "list": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "cpuSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuQuotient1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuQuotient2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "dataSourceStatus": "full"
      }
    ],
    "absoluteDiffAsc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "cpuSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuQuotient1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuQuotient2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "dataSourceStatus": "full"
      }
    ],
    "relativeDiffAsc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "cpuSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuQuotient1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuQuotient2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "dataSourceStatus": "full"
      }
    ],
    "absoluteDiffDesc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "cpuSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuQuotient1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuQuotient2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "dataSourceStatus": "full"
      }
    ],
    "dataSourceStatus": "full",
    "relativeDiffDesc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "cpuSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuQuotient1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuQuotient2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "dataSourceStatus": "full"
      }
    ]
  },
  "rowCount": {
    "diff": 0.5,
    "trend": "up",
    "absoluteDiff": 2.5,
    "baseline": 1,
    "comparison": 2
  },
  "objNoCache": {
    "list": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "absoluteDiffAsc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "relativeDiffAsc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "absoluteDiffDesc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "dataSourceStatus": "full",
    "relativeDiffDesc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ]
  },
  "sheetCount": {
    "diff": 0.5,
    "trend": "up",
    "absoluteDiff": 2.5,
    "baseline": 1,
    "comparison": 2
  },
  "fileSizeMib": {
    "diff": 0.5,
    "trend": "up",
    "absoluteDiff": 2.5,
    "baseline": 1.1,
    "comparison": 2.2
  },
  "objectCount": {
    "diff": 0.5,
    "trend": "up",
    "absoluteDiff": 2.5,
    "baseline": 1,
    "comparison": 2
  },
  "maxMemoryMib": {
    "diff": 0.5,
    "trend": "up",
    "absoluteDiff": 2.5,
    "baseline": 1.1,
    "comparison": 2.2
  },
  "sheetsCached": {
    "list": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "absoluteDiffAsc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "relativeDiffAsc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "absoluteDiffDesc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "dataSourceStatus": "full",
    "relativeDiffDesc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ]
  },
  "objSlowCached": {
    "list": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "absoluteDiffAsc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "relativeDiffAsc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "absoluteDiffDesc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "dataSourceStatus": "full",
    "relativeDiffDesc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ]
  },
  "objMemoryLimit": [
    {
      "id": "fjETFn",
      "title": "my chart",
      "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
      "objectType": "table",
      "dataSourceStatus": "full",
      "baselineMemoryLimitStatusCode": "OUT-OF-MEMORY",
      "comparisonMemoryLimitStatusCode": "OUT-OF-MEMORY"
    }
  ],
  "sheetsUncached": {
    "list": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "absoluteDiffAsc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "relativeDiffAsc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "absoluteDiffDesc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "dataSourceStatus": "full",
    "relativeDiffDesc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ]
  },
  "documentSizeMib": {
    "diff": 0.5,
    "trend": "up",
    "absoluteDiff": 2.5,
    "baseline": 1.1,
    "comparison": 2.2
  },
  "objSlowUncached": {
    "list": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "absoluteDiffAsc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "relativeDiffAsc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "absoluteDiffDesc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "dataSourceStatus": "full",
    "relativeDiffDesc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ]
  },
  "dataModelSizeMib": {
    "diff": 0.5,
    "trend": "up",
    "absoluteDiff": 2.5,
    "baseline": 1.1,
    "comparison": 2.2
  },
  "hasSectionAccess": {
    "diff": 0.5,
    "trend": "up",
    "absoluteDiff": 2.5,
    "baseline": false,
    "comparison": true
  },
  "topFieldsByBytes": {
    "list": [
      {
        "name": "a",
        "byte_size": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "is_system": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": false,
          "comparison": true
        },
        "cardinal": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "total_count": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "dataSourceStatus": "full"
      }
    ],
    "absoluteDiffAsc": [
      {
        "name": "a",
        "byte_size": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "is_system": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": false,
          "comparison": true
        },
        "cardinal": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "total_count": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "dataSourceStatus": "full"
      }
    ],
    "relativeDiffAsc": [
      {
        "name": "a",
        "byte_size": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "is_system": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": false,
          "comparison": true
        },
        "cardinal": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "total_count": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "dataSourceStatus": "full"
      }
    ],
    "absoluteDiffDesc": [
      {
        "name": "a",
        "byte_size": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "is_system": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": false,
          "comparison": true
        },
        "cardinal": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "total_count": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "dataSourceStatus": "full"
      }
    ],
    "dataSourceStatus": "full",
    "relativeDiffDesc": [
      {
        "name": "a",
        "byte_size": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "is_system": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": false,
          "comparison": true
        },
        "cardinal": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "total_count": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "dataSourceStatus": "full"
      }
    ]
  },
  "topTablesByBytes": {
    "list": [
      {
        "name": "a",
        "byte_size": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "is_system": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": false,
          "comparison": true
        },
        "no_of_rows": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "dataSourceStatus": "full"
      }
    ],
    "absoluteDiffAsc": [
      {
        "name": "a",
        "byte_size": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "is_system": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": false,
          "comparison": true
        },
        "no_of_rows": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "dataSourceStatus": "full"
      }
    ],
    "relativeDiffAsc": [
      {
        "name": "a",
        "byte_size": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "is_system": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": false,
          "comparison": true
        },
        "no_of_rows": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "dataSourceStatus": "full"
      }
    ],
    "absoluteDiffDesc": [
      {
        "name": "a",
        "byte_size": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "is_system": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": false,
          "comparison": true
        },
        "no_of_rows": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "dataSourceStatus": "full"
      }
    ],
    "dataSourceStatus": "full",
    "relativeDiffDesc": [
      {
        "name": "a",
        "byte_size": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "is_system": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": false,
          "comparison": true
        },
        "no_of_rows": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "dataSourceStatus": "full"
      }
    ]
  },
  "objSingleThreaded": {
    "list": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "absoluteDiffAsc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "relativeDiffAsc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "absoluteDiffDesc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "dataSourceStatus": "full",
    "relativeDiffDesc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ]
  },
  "appOpenTimeSeconds": {
    "diff": 0.5,
    "trend": "up",
    "absoluteDiff": 2.5,
    "baseline": 1.1,
    "comparison": 2.2
  }
}
Download a comparison log of two evaluations
Replacement available

For new integrations, and when updating your existing integrations, use:

GET analytics/apps/evaluations/{baselineId}/compare/{comparisonId}/actions/download

Accepts two evaluation ids and downloads a log, in XML format, denoting the differences between the two.

Facts
	Rate limit	Tier 1 (1000 requests per minute)

	Replaced by	
GET analytics/apps/evaluations/{baselineId}/compare/{comparisonId}/actions/download
Path Parameters
baseid
string
Required

Id of the baseline evaluation

comparisonid
string
Required

Id of the comparison evaluation

Responses
200

Comparison executed successfully.

application/json
object
Show application/json properties
404

Not Found.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
GET
/api/v1/apps/evaluations/{baseid}/actions/compare/{comparisonid}/actions/download
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


await qlik.apps.getAppEvaluationComparisonXml(
  'abcdefghijklmnopq',
  'abcdefghijklmnopq',
)
Example Response
{
  "objHeavy": {
    "list": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "cpuSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuQuotient1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuQuotient2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "dataSourceStatus": "full"
      }
    ],
    "absoluteDiffAsc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "cpuSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuQuotient1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuQuotient2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "dataSourceStatus": "full"
      }
    ],
    "relativeDiffAsc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "cpuSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuQuotient1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuQuotient2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "dataSourceStatus": "full"
      }
    ],
    "absoluteDiffDesc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "cpuSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuQuotient1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuQuotient2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "dataSourceStatus": "full"
      }
    ],
    "dataSourceStatus": "full",
    "relativeDiffDesc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "cpuSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuQuotient1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "cpuQuotient2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2
        },
        "dataSourceStatus": "full"
      }
    ]
  },
  "rowCount": {
    "diff": 0.5,
    "trend": "up",
    "absoluteDiff": 2.5,
    "baseline": 1,
    "comparison": 2
  },
  "objNoCache": {
    "list": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "absoluteDiffAsc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "relativeDiffAsc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "absoluteDiffDesc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "dataSourceStatus": "full",
    "relativeDiffDesc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ]
  },
  "sheetCount": {
    "diff": 0.5,
    "trend": "up",
    "absoluteDiff": 2.5,
    "baseline": 1,
    "comparison": 2
  },
  "fileSizeMib": {
    "diff": 0.5,
    "trend": "up",
    "absoluteDiff": 2.5,
    "baseline": 1.1,
    "comparison": 2.2
  },
  "objectCount": {
    "diff": 0.5,
    "trend": "up",
    "absoluteDiff": 2.5,
    "baseline": 1,
    "comparison": 2
  },
  "maxMemoryMib": {
    "diff": 0.5,
    "trend": "up",
    "absoluteDiff": 2.5,
    "baseline": 1.1,
    "comparison": 2.2
  },
  "sheetsCached": {
    "list": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "absoluteDiffAsc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "relativeDiffAsc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "absoluteDiffDesc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "dataSourceStatus": "full",
    "relativeDiffDesc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ]
  },
  "objSlowCached": {
    "list": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "absoluteDiffAsc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "relativeDiffAsc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "absoluteDiffDesc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "dataSourceStatus": "full",
    "relativeDiffDesc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ]
  },
  "objMemoryLimit": [
    {
      "id": "fjETFn",
      "title": "my chart",
      "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
      "objectType": "table",
      "dataSourceStatus": "full",
      "baselineMemoryLimitStatusCode": "OUT-OF-MEMORY",
      "comparisonMemoryLimitStatusCode": "OUT-OF-MEMORY"
    }
  ],
  "sheetsUncached": {
    "list": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "absoluteDiffAsc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "relativeDiffAsc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "absoluteDiffDesc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "dataSourceStatus": "full",
    "relativeDiffDesc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ]
  },
  "documentSizeMib": {
    "diff": 0.5,
    "trend": "up",
    "absoluteDiff": 2.5,
    "baseline": 1.1,
    "comparison": 2.2
  },
  "objSlowUncached": {
    "list": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "absoluteDiffAsc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "relativeDiffAsc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "absoluteDiffDesc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "dataSourceStatus": "full",
    "relativeDiffDesc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ]
  },
  "dataModelSizeMib": {
    "diff": 0.5,
    "trend": "up",
    "absoluteDiff": 2.5,
    "baseline": 1.1,
    "comparison": 2.2
  },
  "hasSectionAccess": {
    "diff": 0.5,
    "trend": "up",
    "absoluteDiff": 2.5,
    "baseline": false,
    "comparison": true
  },
  "topFieldsByBytes": {
    "list": [
      {
        "name": "a",
        "byte_size": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "is_system": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": false,
          "comparison": true
        },
        "cardinal": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "total_count": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "dataSourceStatus": "full"
      }
    ],
    "absoluteDiffAsc": [
      {
        "name": "a",
        "byte_size": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "is_system": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": false,
          "comparison": true
        },
        "cardinal": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "total_count": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "dataSourceStatus": "full"
      }
    ],
    "relativeDiffAsc": [
      {
        "name": "a",
        "byte_size": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "is_system": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": false,
          "comparison": true
        },
        "cardinal": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "total_count": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "dataSourceStatus": "full"
      }
    ],
    "absoluteDiffDesc": [
      {
        "name": "a",
        "byte_size": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "is_system": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": false,
          "comparison": true
        },
        "cardinal": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "total_count": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "dataSourceStatus": "full"
      }
    ],
    "dataSourceStatus": "full",
    "relativeDiffDesc": [
      {
        "name": "a",
        "byte_size": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "is_system": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": false,
          "comparison": true
        },
        "cardinal": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "total_count": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "dataSourceStatus": "full"
      }
    ]
  },
  "topTablesByBytes": {
    "list": [
      {
        "name": "a",
        "byte_size": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "is_system": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": false,
          "comparison": true
        },
        "no_of_rows": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "dataSourceStatus": "full"
      }
    ],
    "absoluteDiffAsc": [
      {
        "name": "a",
        "byte_size": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "is_system": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": false,
          "comparison": true
        },
        "no_of_rows": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "dataSourceStatus": "full"
      }
    ],
    "relativeDiffAsc": [
      {
        "name": "a",
        "byte_size": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "is_system": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": false,
          "comparison": true
        },
        "no_of_rows": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "dataSourceStatus": "full"
      }
    ],
    "absoluteDiffDesc": [
      {
        "name": "a",
        "byte_size": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "is_system": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": false,
          "comparison": true
        },
        "no_of_rows": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "dataSourceStatus": "full"
      }
    ],
    "dataSourceStatus": "full",
    "relativeDiffDesc": [
      {
        "name": "a",
        "byte_size": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "is_system": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": false,
          "comparison": true
        },
        "no_of_rows": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "dataSourceStatus": "full"
      }
    ]
  },
  "objSingleThreaded": {
    "list": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "absoluteDiffAsc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "relativeDiffAsc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "absoluteDiffDesc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ],
    "dataSourceStatus": "full",
    "relativeDiffDesc": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "dataSourceStatus": "full",
        "responseTimeSeconds1": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        },
        "responseTimeSeconds2": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1.1,
          "comparison": 2.2,
          "baselineTimeoutStatusCode": "CALC-TIMEOUT",
          "comparisonTimeoutStatusCode": "CALC-TIMEOUT"
        }
      }
    ]
  },
  "appOpenTimeSeconds": {
    "diff": 0.5,
    "trend": "up",
    "absoluteDiff": 2.5,
    "baseline": 1.1,
    "comparison": 2.2
  }
}
Retrieve a specific evaluation
Replacement available

For new integrations, and when updating your existing integrations, use:

GET analytics/apps/evaluations/{id}

Find an evaluation by a specific id.

Facts
	Rate limit	Tier 1 (1000 requests per minute)

	Replaced by	
GET analytics/apps/evaluations/{id}
Query Parameters
all
boolean

Get the full data of the evaluation

format
string

Specify output format, currently supported are 'json' and 'xml'

Path Parameters
id
string
Required

Id of the desired evaluation.

Responses
200

Evaluation(s) retrieved successfully.

application/json
object
Show application/json properties
404

Not Found.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
GET
/api/v1/apps/evaluations/{id}
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


await qlik.apps.getAppEvaluation(
  'abcdefghijklmnopq',
  {},
)
Example Response
{
  "id": "5ecb5e65028d1f0001a98071",
  "appId": "7c2ce11d-4d10-4414-a9b0-620e57298038",
  "ended": "2022-02-09T06:58:40.575Z",
  "events": [
    {
      "details": "An object failed",
      "sheetId": "gregFG",
      "objectId": "adfRFr",
      "severity": "warning",
      "errorCode": "ERR-GOPHERCISER",
      "objectType": "linechart",
      "sheetTitle": "mysheet",
      "objectTitle": "profit",
      "objectVisualization": "linechart"
    }
  ],
  "result": {
    "sheets": [
      {
        "sheet": {
          "id": "fjETFn",
          "title": "my chart",
          "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
          "objectType": "table",
          "timeoutStatusCode": "CALC-TIMEOUT",
          "responseTimeSeconds": 12.3
        },
        "objectCount": 1,
        "sheetObjects": [
          {
            "id": "fjETFn",
            "title": "my chart",
            "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
            "objectType": "table",
            "timeoutStatusCode": "CALC-TIMEOUT",
            "responseTimeSeconds": 12.3
          }
        ]
      }
    ],
    "rowCount": 20000,
    "objNoCache": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "timeoutStatusCode": "CALC-TIMEOUT",
        "responseTimeSeconds": 12.3
      }
    ],
    "sheetCount": 5,
    "objectCount": 33,
    "objSlowCached": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "timeoutStatusCode": "CALC-TIMEOUT",
        "responseTimeSeconds": 12.3
      }
    ],
    "objMemoryLimit": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "memoryLimitStatusCode": "OUT-OF-MEMORY"
      }
    ],
    "documentSizeMiB": 12.3,
    "objSlowUncached": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "timeoutStatusCode": "CALC-TIMEOUT",
        "responseTimeSeconds": 12.3
      }
    ],
    "hasSectionAccess": false,
    "topFieldsByBytes": [
      {
        "name": "a",
        "byte_size": 1234,
        "is_system": false
      }
    ],
    "topTablesByBytes": [
      {
        "name": "a",
        "byte_size": 1234,
        "is_system": false
      }
    ],
    "objSingleThreaded": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "cpuQuotient1": 12.3
      }
    ]
  },
  "status": "finished",
  "appName": "my app",
  "details": {
    "errors": [
      "this is an error"
    ],
    "warnings": [
      "this is a warning"
    ],
    "dedicated": false,
    "objectMetrics": {},
    "engineHasCache": false,
    "concurrentReload": false
  },
  "sheetId": "zyb2bQTeFmPVt9TXZOS0I5GZCFn",
  "started": "2022-02-09T06:58:40.575Z",
  "version": 1,
  "metadata": {
    "reloadmeta": {
      "cpuspent": "123983",
      "peakmemorybytes": 112
    },
    "amountofrows": 1423423234,
    "amountoffields": 12,
    "amountoftables": 7,
    "staticbytesize": 1444234,
    "hassectionaccess": false,
    "amountoffieldvalues": 144423433,
    "amountofcardinalfieldvalues": 14442
  },
  "tenantId": "zyb2bQTeFmPVt9TXZOS0I5GZCFn",
  "appItemId": "zyb2bQTeFmPVt9TXZOS0I5GZCFn",
  "timestamp": "2022-02-09T06:58:40.575Z",
  "sheetTitle": "my sheet"
}
Download a detailed XML log of a specific evaluation
Replacement available

For new integrations, and when updating your existing integrations, use:

GET analytics/apps/evaluations/{id}/actions/download

Find and download an evaluation log by a specific evaluation id.

Facts
	Rate limit	Tier 1 (1000 requests per minute)

	Replaced by	
GET analytics/apps/evaluations/{id}/actions/download
Path Parameters
id
string
Required

Id of the desired evaluation.

Responses
200

Evaluation(s) retrieved successfully.

application/json
object
Show application/json properties
404

Not Found.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
GET
/api/v1/apps/evaluations/{id}/actions/download
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


await qlik.apps.getAppEvaluationXml(
  'abcdefghijklmnopq',
)
Example Response
{
  "id": "5ecb5e65028d1f0001a98071",
  "appId": "7c2ce11d-4d10-4414-a9b0-620e57298038",
  "ended": "2022-02-09T06:58:40.575Z",
  "events": [
    {
      "details": "An object failed",
      "sheetId": "gregFG",
      "objectId": "adfRFr",
      "severity": "warning",
      "errorCode": "ERR-GOPHERCISER",
      "objectType": "linechart",
      "sheetTitle": "mysheet",
      "objectTitle": "profit",
      "objectVisualization": "linechart"
    }
  ],
  "result": {
    "sheets": [
      {
        "sheet": {
          "id": "fjETFn",
          "title": "my chart",
          "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
          "objectType": "table",
          "timeoutStatusCode": "CALC-TIMEOUT",
          "responseTimeSeconds": 12.3
        },
        "objectCount": 1,
        "sheetObjects": [
          {
            "id": "fjETFn",
            "title": "my chart",
            "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
            "objectType": "table",
            "timeoutStatusCode": "CALC-TIMEOUT",
            "responseTimeSeconds": 12.3
          }
        ]
      }
    ],
    "rowCount": 20000,
    "objNoCache": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "timeoutStatusCode": "CALC-TIMEOUT",
        "responseTimeSeconds": 12.3
      }
    ],
    "sheetCount": 5,
    "objectCount": 33,
    "objSlowCached": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "timeoutStatusCode": "CALC-TIMEOUT",
        "responseTimeSeconds": 12.3
      }
    ],
    "objMemoryLimit": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "memoryLimitStatusCode": "OUT-OF-MEMORY"
      }
    ],
    "documentSizeMiB": 12.3,
    "objSlowUncached": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "timeoutStatusCode": "CALC-TIMEOUT",
        "responseTimeSeconds": 12.3
      }
    ],
    "hasSectionAccess": false,
    "topFieldsByBytes": [
      {
        "name": "a",
        "byte_size": 1234,
        "is_system": false
      }
    ],
    "topTablesByBytes": [
      {
        "name": "a",
        "byte_size": 1234,
        "is_system": false
      }
    ],
    "objSingleThreaded": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "cpuQuotient1": 12.3
      }
    ]
  },
  "status": "finished",
  "appName": "my app",
  "details": {
    "errors": [
      "this is an error"
    ],
    "warnings": [
      "this is a warning"
    ],
    "dedicated": false,
    "objectMetrics": {},
    "engineHasCache": false,
    "concurrentReload": false
  },
  "sheetId": "zyb2bQTeFmPVt9TXZOS0I5GZCFn",
  "started": "2022-02-09T06:58:40.575Z",
  "version": 1,
  "metadata": {
    "reloadmeta": {
      "cpuspent": "123983",
      "peakmemorybytes": 112
    },
    "amountofrows": 1423423234,
    "amountoffields": 12,
    "amountoftables": 7,
    "staticbytesize": 1444234,
    "hassectionaccess": false,
    "amountoffieldvalues": 144423433,
    "amountofcardinalfieldvalues": 14442
  },
  "tenantId": "zyb2bQTeFmPVt9TXZOS0I5GZCFn",
  "appItemId": "zyb2bQTeFmPVt9TXZOS0I5GZCFn",
  "timestamp": "2022-02-09T06:58:40.575Z",
  "sheetTitle": "my sheet"
}
Imports an app into the system.

Imports an app into the system.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Query Parameters
appId
string

The app ID of the target app when source is qvw file.

fallbackName
string

The name of the target app when source does not have a specified name, applicable if source is qvw file.

fileId
string

The file ID to be downloaded from Temporary Content Service (TCS) and used during import.

mode
string

The import mode. In new mode (default), the source app will be imported as a new app.

The autoreplace mode is an internal mode only and is not permitted for external use.

One of:

NEW
AUTOREPLACE
name
string

The name of the target app.

NoData
boolean

If NoData is true, the data of the existing app will be kept as is, otherwise it will be replaced by the new incoming data.

spaceId
string

The space ID of the target app.

Request Body

Path of the source app.

application/octet-stream
string

format = "binary"

Responses
200

OK

application/json
object

Application attributes and user privileges.

Show application/json properties
404

Not Found

POST
/api/v1/apps/import
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


await qlik.apps.importApp(
  {},
  new Uint8Array(readFileSync('<file-path>')),
)
Example Response
{
  "create": [
    {
      "resource": "string",
      "canCreate": true
    }
  ],
  "attributes": {
    "id": "string",
    "name": "string",
    "owner": "string",
    "custom": {},
    "ownerId": "string",
    "encrypted": true,
    "published": true,
    "thumbnail": "string",
    "createdDate": "2018-10-30T07:06:22Z",
    "description": "string",
    "originAppId": "string",
    "publishTime": "2018-10-30T07:06:22Z",
    "dynamicColor": "string",
    "modifiedDate": "2018-10-30T07:06:22Z",
    "lastReloadTime": "2018-10-30T07:06:22Z",
    "hasSectionAccess": true,
    "isDirectQueryMode": true
  },
  "privileges": [
    "string"
  ]
}
Gets the app privileges for the current user, such as create app and import app. Empty means that the current user has no app privileges.

Gets the app privileges for the current user, such as create app and import app. Empty means that the current user has no app privileges.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Responses
200

OK

application/json
array of strings

Values may be any of: "can_create_app""can_import_app""can_create_session_app"

GET
/api/v1/apps/privileges
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


await qlik.apps.getAppsPrivileges()
Example Response
[]
Validates the script.

Validates the script.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
Required

Script to validate.

*/*
object
Show */* properties
Responses
200

OK

application/json
object
Show application/json properties
403

Forbidden

POST
/api/v1/apps/validatescript
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/v1/apps/validatescript` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/v1/apps/validatescript',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "Errors": [
    {
      "Msg": "string",
      "Tab": 42,
      "Info": "string",
      "Line": 42,
      "Column": 42
    }
  ],
  "Warnings": [
    {
      "Msg": "string",
      "Tab": 42,
      "Info": "string",
      "Line": 42,
      "Column": 42
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