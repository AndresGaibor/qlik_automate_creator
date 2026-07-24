---
title: "Apps REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/analytics/apps/"
local_path: "docs/endpoints/analytics-apps.md"
---

# Apps REST API

Download OpenAPI spec
Endpoints
POST
/api/analytics/apps/{appId}/actions/restore
GET
/api/analytics/apps/{guid}/evaluations
POST
/api/analytics/apps/{guid}/evaluations
GET
/api/analytics/apps/evaluations/{baselineId}/compare/{comparisonId}
GET
/api/analytics/apps/evaluations/{baselineId}/compare/{comparisonId}/actions/download
GET
/api/analytics/apps/evaluations/{id}
GET
/api/analytics/apps/evaluations/{id}/actions/download
Restore an application

Restores a soft-deleted Qlik Cloud Analytics application to the same space with the same app ID, retaining the properties it had at the time of deletion. This operation is available to the app owner and Tenant Admins. The app owner can restore the app only if the original space still exists and they still have delete permission in the space; otherwise, a 403 Forbidden error is returned. Associated resources such as data alerts, subscriptions, collections, notes, and tags are deleted when the app is deleted and cannot be restored.

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
400

Bad request

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

Not Found

application/json
object
Show application/json properties
POST
/api/analytics/apps/{appId}/actions/restore
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/analytics/apps/{appId}/actions/restore` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/analytics/apps/{appId}/actions/restore',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
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
    "state": "string",
    "usage": "string",
    "ownerId": "string",
    "spaceId": "string",
    "createdAt": "2019-01-01T00:00:00.000Z",
    "updatedAt": "2019-01-01T00:00:00.000Z",
    "promotedAt": "2019-01-01T00:00:00.000Z",
    "reloadedAt": "2019-01-01T00:00:00.000Z",
    "description": "string",
    "originAppId": "string",
    "resourceType": "string",
    "hasSectionAccess": true
  },
  "privileges": [
    "string"
  ]
}
List app evaluations

Returns a paginated list of historical evaluations for the specified app. Use the next and prev cursor values from the response links to navigate through pages of results.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
	Replaces	
GET v1/apps/{guid}/evaluations
Query Parameters
all
boolean

When true, includes full evaluation details in each result. When false, detail fields are omitted.

fileMode
boolean

When true, adds file download headers to the response.

format
string

The output format for the response. Accepts json or xml.

limit
integer

Maximum number of results to return per page.

minimum = 1, maximum = 100, default = 20, format = int32, default = 20

next
string

A cursor token for fetching the next page of results.

prev
string

A cursor token for fetching the previous page of results.

sort
string

The field to sort results by. Prefix with - for descending order or + for ascending.

Can be one of: "started""+started""-started"

Path Parameters
guid
string
Required

The unique identifier of the app.

Responses
200

App evaluations retrieved successfully.

application/json
object
Show application/json properties
400

Bad request. The request contains invalid or missing parameters.

application/json
object
Show application/json properties
403

Access denied. You lack the required permissions to list evaluations for this app.

application/json
object
Show application/json properties
404

The specified app was not found.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
GET
/api/analytics/apps/{guid}/evaluations
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/analytics/apps/{guid}/evaluations` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/analytics/apps/{guid}/evaluations',
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
      "id": "5ecb5e65028d1f0001a98071",
      "appId": "7c2ce11d-4d10-4414-a9b0-620e57298038",
      "ended": "2022-02-09T06:58:40.575Z",
      "engine": {
        "shortName": "OAPE-40"
      },
      "events": [
        {
          "message": "An object failed",
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
        "openApp": {
          "steps": [
            {
              "name": "loadingFields",
              "durationMilliseconds": 1234
            }
          ],
          "totalDurationMilliseconds": 12345
        },
        "rowCount": 20000,
        "objNoCache": [
          {
            "id": "fjETFn",
            "title": "my chart",
            "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
            "objectType": "table",
            "sheetTitle": "my sheet",
            "timeoutStatusCode": "CALC-TIMEOUT",
            "responseTimeSeconds": 12.3
          }
        ],
        "sheetCount": 5,
        "objectCount": 33,
        "sheetsCached": [
          {
            "sheet": {
              "id": "fjETFn",
              "title": "my chart",
              "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
              "objectType": "table",
              "sheetTitle": "my sheet",
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
                "sheetTitle": "my sheet",
                "timeoutStatusCode": "CALC-TIMEOUT",
                "responseTimeSeconds": 12.3
              }
            ]
          }
        ],
        "objSlowCached": [
          {
            "id": "fjETFn",
            "title": "my chart",
            "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
            "objectType": "table",
            "sheetTitle": "my sheet",
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
            "sheetTitle": "my sheet",
            "memoryLimitStatusCode": "OUT-OF-MEMORY"
          }
        ],
        "sheetsUncached": [
          {
            "sheet": {
              "id": "fjETFn",
              "title": "my chart",
              "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
              "objectType": "table",
              "sheetTitle": "my sheet",
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
                "sheetTitle": "my sheet",
                "timeoutStatusCode": "CALC-TIMEOUT",
                "responseTimeSeconds": 12.3
              }
            ]
          }
        ],
        "documentSizeMiB": 12.3,
        "objSlowUncached": [
          {
            "id": "fjETFn",
            "title": "my chart",
            "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
            "objectType": "table",
            "sheetTitle": "my sheet",
            "timeoutStatusCode": "CALC-TIMEOUT",
            "responseTimeSeconds": 12.3
          }
        ],
        "hasSectionAccess": false,
        "topFieldsByBytes": [
          {
            "name": "some field/table",
            "byteSize": 12873,
            "isSystem": false
          }
        ],
        "topTablesByBytes": [
          {
            "name": "some field/table",
            "byteSize": 12873,
            "isSystem": false
          }
        ],
        "objSingleThreaded": [
          {
            "id": "fjETFn",
            "title": "my chart",
            "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
            "objectType": "table",
            "sheetTitle": "my sheet",
            "cpuQuotients": [
              12.3
            ],
            "responseTimeSeconds": 12.3
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
        "objectMetrics": {},
        "engineHasCache": false,
        "concurrentReload": false
      },
      "started": "2022-02-09T06:58:40.575Z",
      "version": 1,
      "tenantId": "zyb2bQTeFmPVt9TXZOS0I5GZCFn",
      "appItemId": "zyb2bQTeFmPVt9TXZOS0I5GZCFn",
      "timestamp": "2022-02-09T06:58:40.575Z",
      "openAppProgress": {
        "messages": [
          {
            "message": "TODO",
            "timeSinceStartMilliseconds": "TODO"
          }
        ]
      },
      "reloadInformation": {
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
      }
    }
  ],
  "links": {
    "next": {
      "href": "/analytics/apps/evaluations/appId=a84c22cf-31e5-41fe-9e8f-544b85513484&prev=5f5201908b3fc5fc132dbd35"
    },
    "prev": {
      "href": "/analytics/apps/evaluations/appId=a84c22cf-31e5-41fe-9e8f-544b85513484&prev=5f5201908b3fc5fc132dbd35"
    }
  }
}
Queue an app evaluation

Queues a performance and scalability evaluation for the specified app, scheduling it for execution by the evaluation engine. The evaluation measures object response times, CPU usage, document size, and data model metrics. Once queued, use the returned id with the retrieval operations to poll for results.

Facts
	Rate limit	Tier 2 (100 requests per minute)
	Replaces	
POST v1/apps/{guid}/evaluations
Path Parameters
guid
string
Required

The unique identifier of the app to evaluate.

Responses
201

App evaluation queued successfully.

application/json
object
Show application/json properties
400

Bad request. The app identifier is missing or invalid.

application/json
object
Show application/json properties
403

Access denied. You lack the required permissions to evaluate the app.

application/json
object
Show application/json properties
404

The specified app was not found.

application/json
object
Show application/json properties
429

The rate limit has been exceeded.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
POST
/api/analytics/apps/{guid}/evaluations
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/analytics/apps/{guid}/evaluations` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/analytics/apps/{guid}/evaluations',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "id": "5ecb5e65028d1f0001a98071",
  "appId": "7c2ce11d-4d10-4414-a9b0-620e57298038",
  "ended": "2022-02-09T06:58:40.575Z",
  "engine": {
    "shortName": "OAPE-40"
  },
  "events": [
    {
      "message": "An object failed",
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
    "openApp": {
      "steps": [
        {
          "name": "loadingFields",
          "durationMilliseconds": 1234
        }
      ],
      "totalDurationMilliseconds": 12345
    },
    "rowCount": 20000,
    "objNoCache": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "sheetTitle": "my sheet",
        "timeoutStatusCode": "CALC-TIMEOUT",
        "responseTimeSeconds": 12.3
      }
    ],
    "sheetCount": 5,
    "objectCount": 33,
    "sheetsCached": [
      {
        "sheet": {
          "id": "fjETFn",
          "title": "my chart",
          "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
          "objectType": "table",
          "sheetTitle": "my sheet",
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
            "sheetTitle": "my sheet",
            "timeoutStatusCode": "CALC-TIMEOUT",
            "responseTimeSeconds": 12.3
          }
        ]
      }
    ],
    "objSlowCached": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
        "memoryLimitStatusCode": "OUT-OF-MEMORY"
      }
    ],
    "sheetsUncached": [
      {
        "sheet": {
          "id": "fjETFn",
          "title": "my chart",
          "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
          "objectType": "table",
          "sheetTitle": "my sheet",
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
            "sheetTitle": "my sheet",
            "timeoutStatusCode": "CALC-TIMEOUT",
            "responseTimeSeconds": 12.3
          }
        ]
      }
    ],
    "documentSizeMiB": 12.3,
    "objSlowUncached": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "sheetTitle": "my sheet",
        "timeoutStatusCode": "CALC-TIMEOUT",
        "responseTimeSeconds": 12.3
      }
    ],
    "hasSectionAccess": false,
    "topFieldsByBytes": [
      {
        "name": "some field/table",
        "byteSize": 12873,
        "isSystem": false
      }
    ],
    "topTablesByBytes": [
      {
        "name": "some field/table",
        "byteSize": 12873,
        "isSystem": false
      }
    ],
    "objSingleThreaded": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "sheetTitle": "my sheet",
        "cpuQuotients": [
          12.3
        ],
        "responseTimeSeconds": 12.3
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
    "objectMetrics": {},
    "engineHasCache": false,
    "concurrentReload": false
  },
  "started": "2022-02-09T06:58:40.575Z",
  "version": 1,
  "tenantId": "zyb2bQTeFmPVt9TXZOS0I5GZCFn",
  "appItemId": "zyb2bQTeFmPVt9TXZOS0I5GZCFn",
  "timestamp": "2022-02-09T06:58:40.575Z",
  "openAppProgress": {
    "messages": [
      {
        "message": "TODO",
        "timeSinceStartMilliseconds": "TODO"
      }
    ]
  },
  "reloadInformation": {
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
  }
}
Compare two app evaluations

Compares exactly two app evaluations, a baseline and a comparison, returning a structured diff of performance metrics between them. Use this operation to detect regressions after app changes or engine upgrades. Both evaluations must belong to the same app.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
	Replaces	
GET v1/apps/evaluations/{baseid}/actions/compare/{comparisonid}
Query Parameters
all
boolean

When true, includes all comparison entries regardless of significance.

format
string

The output format for the response. Accepts json or xml.

Path Parameters
baselineId
string
Required

The unique identifier of the baseline app evaluation.

comparisonId
string
Required

The unique identifier of the comparison app evaluation.

Responses
200

Comparison completed successfully.

application/json
object
Show application/json properties
404

One or both of the specified app evaluations were not found.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
GET
/api/analytics/apps/evaluations/{baselineId}/compare/{comparisonId}
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/analytics/apps/evaluations/{baselineId}/compare/{comparisonId}` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/analytics/apps/evaluations/{baselineId}/compare/{comparisonId}',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "engine": {
    "changed": false,
    "baseline": {
      "shortName": "OAPE-40"
    },
    "comparison": {
      "shortName": "OAPE-40"
    }
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
  "objectCount": {
    "diff": 0.5,
    "trend": "up",
    "absoluteDiff": 2.5,
    "baseline": 1,
    "comparison": 2
  },
  "sheetsCached": {
    "list": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
      "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
  "documentSizeMiB": {
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "name": "a field name",
        "byteSize": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "cardinal": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "isSystem": false,
        "totalCount": {
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
        "name": "a field name",
        "byteSize": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "cardinal": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "isSystem": false,
        "totalCount": {
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
        "name": "a field name",
        "byteSize": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "cardinal": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "isSystem": false,
        "totalCount": {
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
        "name": "a field name",
        "byteSize": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "cardinal": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "isSystem": false,
        "totalCount": {
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
        "name": "a field name",
        "byteSize": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "cardinal": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "isSystem": false,
        "totalCount": {
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
        "name": "a table name",
        "byteSize": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "isSystem": false,
        "noOfRows": {
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
        "name": "a table name",
        "byteSize": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "isSystem": false,
        "noOfRows": {
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
        "name": "a table name",
        "byteSize": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "isSystem": false,
        "noOfRows": {
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
        "name": "a table name",
        "byteSize": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "isSystem": false,
        "noOfRows": {
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
        "name": "a table name",
        "byteSize": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "isSystem": false,
        "noOfRows": {
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
  }
}
Download a comparison log

Downloads a comparison log for the two specified app evaluations (baseline and comparison), defaulting to XML format. Use the Accept header to request JSON output instead. Both evaluations must belong to the same app.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
	Replaces	
GET v1/apps/evaluations/{baseid}/actions/compare/{comparisonid}/actions/download
Header Parameters
Accept
string

The desired response format. Accepts application/xml (default) or application/json.

Can be one of: "application/xml""application/json"

default = "application/xml"

Path Parameters
baselineId
string
Required

The unique identifier of the baseline app evaluation.

comparisonId
string
Required

The unique identifier of the comparison app evaluation.

Responses
200

Comparison log retrieved successfully.

application/json
object
Show application/json properties
404

One or both of the specified app evaluations were not found.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
GET
/api/analytics/apps/evaluations/{baselineId}/compare/{comparisonId}/actions/download
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/analytics/apps/evaluations/{baselineId}/compare/{comparisonId}/actions/download` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/analytics/apps/evaluations/{baselineId}/compare/{comparisonId}/actions/download',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "engine": {
    "changed": false,
    "baseline": {
      "shortName": "OAPE-40"
    },
    "comparison": {
      "shortName": "OAPE-40"
    }
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
  "objectCount": {
    "diff": 0.5,
    "trend": "up",
    "absoluteDiff": 2.5,
    "baseline": 1,
    "comparison": 2
  },
  "sheetsCached": {
    "list": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
      "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
  "documentSizeMiB": {
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "name": "a field name",
        "byteSize": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "cardinal": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "isSystem": false,
        "totalCount": {
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
        "name": "a field name",
        "byteSize": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "cardinal": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "isSystem": false,
        "totalCount": {
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
        "name": "a field name",
        "byteSize": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "cardinal": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "isSystem": false,
        "totalCount": {
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
        "name": "a field name",
        "byteSize": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "cardinal": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "isSystem": false,
        "totalCount": {
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
        "name": "a field name",
        "byteSize": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "cardinal": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "isSystem": false,
        "totalCount": {
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
        "name": "a table name",
        "byteSize": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "isSystem": false,
        "noOfRows": {
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
        "name": "a table name",
        "byteSize": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "isSystem": false,
        "noOfRows": {
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
        "name": "a table name",
        "byteSize": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "isSystem": false,
        "noOfRows": {
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
        "name": "a table name",
        "byteSize": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "isSystem": false,
        "noOfRows": {
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
        "name": "a table name",
        "byteSize": {
          "diff": 0.5,
          "trend": "up",
          "absoluteDiff": 2.5,
          "baseline": 1,
          "comparison": 2
        },
        "isSystem": false,
        "noOfRows": {
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
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
  }
}
Get an app evaluation

Retrieves a single app evaluation by its unique identifier. Use the all parameter to include full evaluation details in the response.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
	Replaces	
GET v1/apps/evaluations/{id}
Query Parameters
all
boolean

When true, includes full app evaluation details in the response.

format
string

The output format for the response. Accepts json or xml.

Path Parameters
id
string
Required

The unique identifier of the app evaluation to retrieve.

Responses
200

App evaluation retrieved successfully.

application/json
object
Show application/json properties
404

The specified app evaluation was not found.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
GET
/api/analytics/apps/evaluations/{id}
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/analytics/apps/evaluations/{id}` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/analytics/apps/evaluations/{id}',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "id": "5ecb5e65028d1f0001a98071",
  "appId": "7c2ce11d-4d10-4414-a9b0-620e57298038",
  "ended": "2022-02-09T06:58:40.575Z",
  "engine": {
    "shortName": "OAPE-40"
  },
  "events": [
    {
      "message": "An object failed",
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
    "openApp": {
      "steps": [
        {
          "name": "loadingFields",
          "durationMilliseconds": 1234
        }
      ],
      "totalDurationMilliseconds": 12345
    },
    "rowCount": 20000,
    "objNoCache": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "sheetTitle": "my sheet",
        "timeoutStatusCode": "CALC-TIMEOUT",
        "responseTimeSeconds": 12.3
      }
    ],
    "sheetCount": 5,
    "objectCount": 33,
    "sheetsCached": [
      {
        "sheet": {
          "id": "fjETFn",
          "title": "my chart",
          "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
          "objectType": "table",
          "sheetTitle": "my sheet",
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
            "sheetTitle": "my sheet",
            "timeoutStatusCode": "CALC-TIMEOUT",
            "responseTimeSeconds": 12.3
          }
        ]
      }
    ],
    "objSlowCached": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
        "memoryLimitStatusCode": "OUT-OF-MEMORY"
      }
    ],
    "sheetsUncached": [
      {
        "sheet": {
          "id": "fjETFn",
          "title": "my chart",
          "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
          "objectType": "table",
          "sheetTitle": "my sheet",
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
            "sheetTitle": "my sheet",
            "timeoutStatusCode": "CALC-TIMEOUT",
            "responseTimeSeconds": 12.3
          }
        ]
      }
    ],
    "documentSizeMiB": 12.3,
    "objSlowUncached": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "sheetTitle": "my sheet",
        "timeoutStatusCode": "CALC-TIMEOUT",
        "responseTimeSeconds": 12.3
      }
    ],
    "hasSectionAccess": false,
    "topFieldsByBytes": [
      {
        "name": "some field/table",
        "byteSize": 12873,
        "isSystem": false
      }
    ],
    "topTablesByBytes": [
      {
        "name": "some field/table",
        "byteSize": 12873,
        "isSystem": false
      }
    ],
    "objSingleThreaded": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "sheetTitle": "my sheet",
        "cpuQuotients": [
          12.3
        ],
        "responseTimeSeconds": 12.3
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
    "objectMetrics": {},
    "engineHasCache": false,
    "concurrentReload": false
  },
  "started": "2022-02-09T06:58:40.575Z",
  "version": 1,
  "tenantId": "zyb2bQTeFmPVt9TXZOS0I5GZCFn",
  "appItemId": "zyb2bQTeFmPVt9TXZOS0I5GZCFn",
  "timestamp": "2022-02-09T06:58:40.575Z",
  "openAppProgress": {
    "messages": [
      {
        "message": "TODO",
        "timeSinceStartMilliseconds": "TODO"
      }
    ]
  },
  "reloadInformation": {
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
  }
}
Download an app evaluation log

Downloads the evaluation log for the specified app evaluation, defaulting to XML format. Use the Accept header to request JSON output instead.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
	Replaces	
GET v1/apps/evaluations/{id}/actions/download
Header Parameters
Accept
string

The desired response format. Accepts application/xml (default) or application/json.

Can be one of: "application/xml""application/json"

default = "application/xml"

Path Parameters
id
string
Required

The unique identifier of the app evaluation to download.

Responses
200

App evaluation log retrieved successfully.

application/json
object
Show application/json properties
404

The specified app evaluation was not found.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
GET
/api/analytics/apps/evaluations/{id}/actions/download
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/analytics/apps/evaluations/{id}/actions/download` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/analytics/apps/evaluations/{id}/actions/download',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
Example Response
{
  "id": "5ecb5e65028d1f0001a98071",
  "appId": "7c2ce11d-4d10-4414-a9b0-620e57298038",
  "ended": "2022-02-09T06:58:40.575Z",
  "engine": {
    "shortName": "OAPE-40"
  },
  "events": [
    {
      "message": "An object failed",
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
    "openApp": {
      "steps": [
        {
          "name": "loadingFields",
          "durationMilliseconds": 1234
        }
      ],
      "totalDurationMilliseconds": 12345
    },
    "rowCount": 20000,
    "objNoCache": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "sheetTitle": "my sheet",
        "timeoutStatusCode": "CALC-TIMEOUT",
        "responseTimeSeconds": 12.3
      }
    ],
    "sheetCount": 5,
    "objectCount": 33,
    "sheetsCached": [
      {
        "sheet": {
          "id": "fjETFn",
          "title": "my chart",
          "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
          "objectType": "table",
          "sheetTitle": "my sheet",
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
            "sheetTitle": "my sheet",
            "timeoutStatusCode": "CALC-TIMEOUT",
            "responseTimeSeconds": 12.3
          }
        ]
      }
    ],
    "objSlowCached": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "sheetTitle": "my sheet",
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
        "sheetTitle": "my sheet",
        "memoryLimitStatusCode": "OUT-OF-MEMORY"
      }
    ],
    "sheetsUncached": [
      {
        "sheet": {
          "id": "fjETFn",
          "title": "my chart",
          "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
          "objectType": "table",
          "sheetTitle": "my sheet",
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
            "sheetTitle": "my sheet",
            "timeoutStatusCode": "CALC-TIMEOUT",
            "responseTimeSeconds": 12.3
          }
        ]
      }
    ],
    "documentSizeMiB": 12.3,
    "objSlowUncached": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "sheetTitle": "my sheet",
        "timeoutStatusCode": "CALC-TIMEOUT",
        "responseTimeSeconds": 12.3
      }
    ],
    "hasSectionAccess": false,
    "topFieldsByBytes": [
      {
        "name": "some field/table",
        "byteSize": 12873,
        "isSystem": false
      }
    ],
    "topTablesByBytes": [
      {
        "name": "some field/table",
        "byteSize": 12873,
        "isSystem": false
      }
    ],
    "objSingleThreaded": [
      {
        "id": "fjETFn",
        "title": "my chart",
        "sheetId": "41dbb01c-d1bd-4528-be05-910ee565988b",
        "objectType": "table",
        "sheetTitle": "my sheet",
        "cpuQuotients": [
          12.3
        ],
        "responseTimeSeconds": 12.3
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
    "objectMetrics": {},
    "engineHasCache": false,
    "concurrentReload": false
  },
  "started": "2022-02-09T06:58:40.575Z",
  "version": 1,
  "tenantId": "zyb2bQTeFmPVt9TXZOS0I5GZCFn",
  "appItemId": "zyb2bQTeFmPVt9TXZOS0I5GZCFn",
  "timestamp": "2022-02-09T06:58:40.575Z",
  "openAppProgress": {
    "messages": [
      {
        "message": "TODO",
        "timeSinceStartMilliseconds": "TODO"
      }
    ]
  },
  "reloadInformation": {
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
We use cookies to improve your experience with our websites and to deliver content tailored to your interests. By clicking ‘Ok’, you accept the use of additional cookies which may involve data transmission to third parties. Refer to our Privacy & Cookie Notice or click ‘More Information’ for details on cookie usage on our sites.Privacy & Cookie Notice
Ok
More Information