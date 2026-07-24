---
title: "ODAG links REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/analytics/odag-links/"
local_path: "docs/endpoints/analytics-odag-links.md"
---

Title: ODAG links REST | Qlik Developer Portal


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
analytics
Copy page
ODAG links
Download OpenAPI spec

ODAG links connect selection applications (where users make selections) to template applications (the source for generation). An ODAG link enables users to submit requests that automatically generate new analytics applications. Use this API to create and manage links, and track which selection applications use specific links.

Note

Link creation requires canCreate permission. Only the link creator or request owner can delete or modify a link.

Endpoints
GET
/api/analytics/odag-links
POST
/api/analytics/odag-links
GET
/api/analytics/odag-links/{linkId}
PUT
/api/analytics/odag-links/{linkId}
GET
/api/analytics/odag-links/{linkId}/requests
POST
/api/analytics/odag-links/{linkId}/requests
GET
/api/analytics/odag-links/cancreate
POST
/api/analytics/odag-links/selection-app-link-usages
List ODAG links

A Link object defines an on-demand data navigation path between a selection Analytics Application and a template Analytics Application including the set of properties that control how that data access occurs and under what conditions access is permitted. The set of links returned by this method have properties that match the combination of conditions defined by any supplied query parameters.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
includeCharts
boolean

Determines whether master charts of the template Analytics Application are included in the response.

selectionAppID
string

Filter the list by the selection Analytics Application ID.

type
string

The type of the links to query. Defaults to link.

Can be one of: "link""view""all"

default = "link"

optOwner
string

Use optOwner to filter results by link owner user ID. If supplied, only links owned by that user are returned. If not supplied, returns all links the current user can access.

Responses
200

ODAG links retrieved successfully.

application/json
array of objects

The full state of a Link.

Show application/json properties
403

Forbidden.

application/json
object

A standard error response containing a list of one or more errors.

Show application/json properties
404

ODAG not enabled or access denied.

application/json
object

A standard error response containing a list of one or more errors.

Show application/json properties
GET
/api/analytics/odag-links
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/analytics/odag-links` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/analytics/odag-links',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
# qlik-cli has not implemented support for GET /api/analytics/odag-links yet.
curl "https://{tenant}.{region}.qlikcloud.com/api/analytics/odag-links" \
-H "Authorization: Bearer <access_token>"
Example Response
[
  {
    "id": "string",
    "name": "ODAG Link name",
    "owner": {
      "id": "wcgIs6wGcDdyzep9QmyopWvNH1FJTOhh",
      "name": "string",
      "subject": "string",
      "tenantid": "string"
    },
    "status": "active",
    "bindings": [
      {
        "range": {
          "lowerBound": 42,
          "upperBound": 42
        },
        "formatting": {
          "quote": "'",
          "delimiter": ","
        },
        "numericOnly": false,
        "selectionStates": "string",
        "selectAppParamName": "string",
        "selectAppParamType": "Field",
        "templateAppVarName": "string"
      }
    ],
    "privileges": [
      "string"
    ],
    "properties": {
      "disable": [
        {
          "context": "string",
          "disable": true
        }
      ],
      "menuLabel": [
        {
          "label": "string",
          "context": "string"
        }
      ],
      "genAppName": [
        {
          "params": [
            "templateAppName"
          ],
          "context": "string",
          "formatString": "string"
        }
      ],
      "genAppLimit": [
        {
          "limit": 42,
          "context": "string"
        }
      ],
      "limitPolicy": [
        {
          "context": "string",
          "limitPolicy": "Restrict"
        }
      ],
      "rowEstRange": [
        {
          "context": "string",
          "lowBound": 42,
          "highBound": 42
        }
      ],
      "targetSheet": [
        {
          "context": "string",
          "sheetId": "string",
          "sheetName": "string"
        }
      ],
      "appOpenMethod": [
        {
          "context": "string",
          "openMethod": "Tab"
        }
      ],
      "appRetentionTime": [
        {
          "context": "string",
          "retentionTime": "string"
        }
      ],
      "overrideGenAppLimit": [
        {
          "context": "string",
          "overrideGenAppLimit": false
        }
      ]
    },
    "rowEstExpr": "string",
    "createdDate": "2025-11-11T13:45:30Z",
    "dynamicView": true,
    "templateApp": {
      "id": "string",
      "name": "appname"
    },
    "modifiedDate": "2025-11-11T13:45:30Z",
    "sourceLinkId": "string",
    "includeScript": false,
    "modifiedByUser": {
      "id": "wcgIs6wGcDdyzep9QmyopWvNH1FJTOhh",
      "name": "string",
      "subject": "string",
      "tenantid": "string"
    },
    "genAppAccessible": true,
    "templateAppChartObjects": [
      {}
    ]
  }
]
Create an ODAG link

Creates a new link that enables ODAG navigation from a designated selection Analytics Application to a generated Analytics Application that is created by copying the designated template Analytics Application, injecting values for bind variables harvested from the selection Analytics Application and dynamically loaded with data using those bindings. The Bindings will be initialized by searching the load script of the template Analytics Application for patterns of the form $(od_FIELDNAME)[M-N] where FIELDNAME is the name of a field in the model of the selection Analytics Application and the optional pattern [M-N] identifies the lower bound M and the upper bound N for the number of values for that field which must be in the active selection state of the selection Analytics Application for binding to occur. The active selection state defaults to selected (i.e. green) unless the od prefix is immediately followed by some combination of the letters s, o, or x, in that order, specifically designating the selected, optional (i.e. white) and/or excluded (i.e. gray) groups of values to be harvested from the selection Analytics Application's selection state. The bindings in the bindings array in the request payload override the properties of the corresponding field bindings found in the script of the template Analytics Application.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Query Parameters
includeCharts
boolean

Determines whether master charts of the template Analytics Application are included in the response.

Request Body
Required

A JSON payload containing the content for a new ODAG link.

application/json
object

An object that defines the properties of a Link to be created.

Show application/json properties
Responses
201

ODAG link created successfully.

application/json
object

The full state of a Link.

Show application/json properties
400

Invalid link payload (see detailed error).

application/json
object

A standard error response containing a list of one or more errors.

Show application/json properties
403

Forbidden.

application/json
object

A standard error response containing a list of one or more errors.

Show application/json properties
404

Invalid referenced object ID (see detailed error message).

application/json
object

A standard error response containing a list of one or more errors.

Show application/json properties
POST
/api/analytics/odag-links
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/analytics/odag-links` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/analytics/odag-links',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'ODAG Link name',
      bindings: [
        {
          range: {
            lowerBound: 42,
            upperBound: 42,
          },
          formatting: {
            quote: "'",
            delimiter: ',',
          },
          numericOnly: false,
          selectionStates: 'string',
          selectAppParamName: 'string',
          selectAppParamType: 'Field',
          templateAppVarName: 'string',
        },
      ],
      properties: {
        disable: [
          { context: 'string', disable: true },
        ],
        menuLabel: [
          { label: 'string', context: 'string' },
        ],
        genAppName: [
          {
            params: ['templateAppName'],
            context: 'string',
            formatString: 'string',
          },
        ],
        genAppLimit: [
          { limit: 42, context: 'string' },
        ],
        limitPolicy: [
          {
            context: 'string',
            limitPolicy: 'Restrict',
          },
        ],
        rowEstRange: [
          {
            context: 'string',
            lowBound: 42,
            highBound: 42,
          },
        ],
        targetSheet: [
          {
            context: 'string',
            sheetId: 'string',
            sheetName: 'string',
          },
        ],
        appOpenMethod: [
          {
            context: 'string',
            openMethod: 'Tab',
          },
        ],
        appRetentionTime: [
          {
            context: 'string',
            retentionTime: 'string',
          },
        ],
        overrideGenAppLimit: [
          {
            context: 'string',
            overrideGenAppLimit: false,
          },
        ],
      },
      rowEstExpr: 'string',
      dynamicView: true,
      templateApp: 'string',
      selectionApp: 'string',
      includeScript: false,
      statusSetting: 'activate',
    }),
  },
)
# qlik-cli has not implemented support for POST /api/analytics/odag-links yet.
curl "https://{tenant}.{region}.qlikcloud.com/api/analytics/odag-links" \
-X POST \
-H "Content-type: application/json" \
-H "Authorization: Bearer <access_token>" \
-d '{"name":"ODAG Link name","bindings":[{"range":{"lowerBound":42,"upperBound":42},"formatting":{"quote":"'\''","delimiter":","},"numericOnly":false,"selectionStates":"string","selectAppParamName":"string","selectAppParamType":"Field","templateAppVarName":"string"}],"properties":{"disable":[{"context":"string","disable":true}],"menuLabel":[{"label":"string","context":"string"}],"genAppName":[{"params":["templateAppName"],"context":"string","formatString":"string"}],"genAppLimit":[{"limit":42,"context":"string"}],"limitPolicy":[{"context":"string","limitPolicy":"Restrict"}],"rowEstRange":[{"context":"string","lowBound":42,"highBound":42}],"targetSheet":[{"context":"string","sheetId":"string","sheetName":"string"}],"appOpenMethod":[{"context":"string","openMethod":"Tab"}],"appRetentionTime":[{"context":"string","retentionTime":"string"}],"overrideGenAppLimit":[{"context":"string","overrideGenAppLimit":false}]},"rowEstExpr":"string","dynamicView":true,"templateApp":"string","selectionApp":"string","includeScript":false,"statusSetting":"activate"}'
Example Response
{
  "id": "string",
  "name": "ODAG Link name",
  "owner": {
    "id": "wcgIs6wGcDdyzep9QmyopWvNH1FJTOhh",
    "name": "string",
    "subject": "string",
    "tenantid": "string"
  },
  "status": "active",
  "bindings": [
    {
      "range": {
        "lowerBound": 42,
        "upperBound": 42
      },
      "formatting": {
        "quote": "'",
        "delimiter": ","
      },
      "numericOnly": false,
      "selectionStates": "string",
      "selectAppParamName": "string",
      "selectAppParamType": "Field",
      "templateAppVarName": "string"
    }
  ],
  "privileges": [
    "string"
  ],
  "properties": {
    "disable": [
      {
        "context": "string",
        "disable": true
      }
    ],
    "menuLabel": [
      {
        "label": "string",
        "context": "string"
      }
    ],
    "genAppName": [
      {
        "params": [
          "templateAppName"
        ],
        "context": "string",
        "formatString": "string"
      }
    ],
    "genAppLimit": [
      {
        "limit": 42,
        "context": "string"
      }
    ],
    "limitPolicy": [
      {
        "context": "string",
        "limitPolicy": "Restrict"
      }
    ],
    "rowEstRange": [
      {
        "context": "string",
        "lowBound": 42,
        "highBound": 42
      }
    ],
    "targetSheet": [
      {
        "context": "string",
        "sheetId": "string",
        "sheetName": "string"
      }
    ],
    "appOpenMethod": [
      {
        "context": "string",
        "openMethod": "Tab"
      }
    ],
    "appRetentionTime": [
      {
        "context": "string",
        "retentionTime": "string"
      }
    ],
    "overrideGenAppLimit": [
      {
        "context": "string",
        "overrideGenAppLimit": false
      }
    ]
  },
  "rowEstExpr": "string",
  "createdDate": "2025-11-11T13:45:30Z",
  "dynamicView": true,
  "templateApp": {
    "id": "string",
    "name": "appname"
  },
  "modifiedDate": "2025-11-11T13:45:30Z",
  "sourceLinkId": "string",
  "includeScript": false,
  "modifiedByUser": {
    "id": "wcgIs6wGcDdyzep9QmyopWvNH1FJTOhh",
    "name": "string",
    "subject": "string",
    "tenantid": "string"
  },
  "genAppAccessible": true,
  "templateAppChartObjects": [
    {}
  ]
}
Get ODAG link details

Retrieves details of a specific ODAG link, including bindings, properties, status, and template Analytics Application charts. Use this to review link configuration or verify permissions before generating Analytics Applications.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
includeCharts
boolean

Determines whether master charts of the template Analytics Application are included in the response.

Path Parameters
linkId
string
Required

The ID of the link.

pattern = "^[a-fA-F0-9]{24}$"

Responses
200

Successful response.

application/json
object

The full state of a Link.

Show application/json properties
403

Forbidden.

application/json
object

A standard error response containing a list of one or more errors.

Show application/json properties
404

Invalid link ID (see detailed error).

application/json
object

A standard error response containing a list of one or more errors.

Show application/json properties
GET
/api/analytics/odag-links/{linkId}
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/analytics/odag-links/{linkId}` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/analytics/odag-links/{linkId}',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
# qlik-cli has not implemented support for GET /api/analytics/odag-links/{linkId} yet.
curl "https://{tenant}.{region}.qlikcloud.com/api/analytics/odag-links/{linkId}" \
-H "Authorization: Bearer <access_token>"
Example Response
{
  "id": "string",
  "name": "ODAG Link name",
  "owner": {
    "id": "wcgIs6wGcDdyzep9QmyopWvNH1FJTOhh",
    "name": "string",
    "subject": "string",
    "tenantid": "string"
  },
  "status": "active",
  "bindings": [
    {
      "range": {
        "lowerBound": 42,
        "upperBound": 42
      },
      "formatting": {
        "quote": "'",
        "delimiter": ","
      },
      "numericOnly": false,
      "selectionStates": "string",
      "selectAppParamName": "string",
      "selectAppParamType": "Field",
      "templateAppVarName": "string"
    }
  ],
  "privileges": [
    "string"
  ],
  "properties": {
    "disable": [
      {
        "context": "string",
        "disable": true
      }
    ],
    "menuLabel": [
      {
        "label": "string",
        "context": "string"
      }
    ],
    "genAppName": [
      {
        "params": [
          "templateAppName"
        ],
        "context": "string",
        "formatString": "string"
      }
    ],
    "genAppLimit": [
      {
        "limit": 42,
        "context": "string"
      }
    ],
    "limitPolicy": [
      {
        "context": "string",
        "limitPolicy": "Restrict"
      }
    ],
    "rowEstRange": [
      {
        "context": "string",
        "lowBound": 42,
        "highBound": 42
      }
    ],
    "targetSheet": [
      {
        "context": "string",
        "sheetId": "string",
        "sheetName": "string"
      }
    ],
    "appOpenMethod": [
      {
        "context": "string",
        "openMethod": "Tab"
      }
    ],
    "appRetentionTime": [
      {
        "context": "string",
        "retentionTime": "string"
      }
    ],
    "overrideGenAppLimit": [
      {
        "context": "string",
        "overrideGenAppLimit": false
      }
    ]
  },
  "rowEstExpr": "string",
  "createdDate": "2025-11-11T13:45:30Z",
  "dynamicView": true,
  "templateApp": {
    "id": "string",
    "name": "appname"
  },
  "modifiedDate": "2025-11-11T13:45:30Z",
  "sourceLinkId": "string",
  "includeScript": false,
  "modifiedByUser": {
    "id": "wcgIs6wGcDdyzep9QmyopWvNH1FJTOhh",
    "name": "string",
    "subject": "string",
    "tenantid": "string"
  },
  "genAppAccessible": true,
  "templateAppChartObjects": [
    {}
  ]
}
Update an ODAG link

Modifies ODAG link configuration including bindings, properties, status, and template Analytics Application reference. You can re-scan the template Analytics Application script to auto-detect binding patterns or override specific settings. If statusSetting is provided, the request updates only the link status (other payload fields are not applied).

Facts
	Rate limit	Tier 2 (100 requests per minute)
Query Parameters
includeCharts
boolean

Determines whether master charts of the template Analytics Application are included in the response.

Path Parameters
linkId
string
Required

The ID of the link.

pattern = "^[a-fA-F0-9]{24}$"

Request Body
Required

A JSON payload containing the updated configuration for the ODAG link.

application/json
object

An object that defines the properties of a Link to be modified.

Show application/json properties
Responses
200

ODAG link updated successfully.

application/json
object

The full state of a Link.

Show application/json properties
403

Forbidden.

application/json
object

A standard error response containing a list of one or more errors.

Show application/json properties
404

Link not found, ODAG not enabled, or invalid referenced object.

application/json
object

A standard error response containing a list of one or more errors.

Show application/json properties
PUT
/api/analytics/odag-links/{linkId}
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `PUT /api/analytics/odag-links/{linkId}` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/analytics/odag-links/{linkId}',
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'ODAG Link name',
      ownerId: 'wcgIs6wGcDdyzep9QmyopWvNH1FJTOhh',
      bindings: [
        {
          range: {
            lowerBound: 42,
            upperBound: 42,
          },
          formatting: {
            quote: "'",
            delimiter: ',',
          },
          numericOnly: false,
          selectionStates: 'string',
          selectAppParamName: 'string',
          selectAppParamType: 'Field',
          templateAppVarName: 'string',
        },
      ],
      properties: {
        disable: [
          { context: 'string', disable: true },
        ],
        menuLabel: [
          { label: 'string', context: 'string' },
        ],
        genAppName: [
          {
            params: ['templateAppName'],
            context: 'string',
            formatString: 'string',
          },
        ],
        genAppLimit: [
          { limit: 42, context: 'string' },
        ],
        limitPolicy: [
          {
            context: 'string',
            limitPolicy: 'Restrict',
          },
        ],
        rowEstRange: [
          {
            context: 'string',
            lowBound: 42,
            highBound: 42,
          },
        ],
        targetSheet: [
          {
            context: 'string',
            sheetId: 'string',
            sheetName: 'string',
          },
        ],
        appOpenMethod: [
          {
            context: 'string',
            openMethod: 'Tab',
          },
        ],
        appRetentionTime: [
          {
            context: 'string',
            retentionTime: 'string',
          },
        ],
        overrideGenAppLimit: [
          {
            context: 'string',
            overrideGenAppLimit: false,
          },
        ],
      },
      rowEstExpr: 'string',
      dynamicView: true,
      templateApp: 'string',
      selectionApp: 'string',
      includeScript: false,
      statusSetting: 'activate',
    }),
  },
)
# qlik-cli has not implemented support for PUT /api/analytics/odag-links/{linkId} yet.
curl "https://{tenant}.{region}.qlikcloud.com/api/analytics/odag-links/{linkId}" \
-X PUT \
-H "Content-type: application/json" \
-H "Authorization: Bearer <access_token>" \
-d '{"name":"ODAG Link name","ownerId":"wcgIs6wGcDdyzep9QmyopWvNH1FJTOhh","bindings":[{"range":{"lowerBound":42,"upperBound":42},"formatting":{"quote":"'\''","delimiter":","},"numericOnly":false,"selectionStates":"string","selectAppParamName":"string","selectAppParamType":"Field","templateAppVarName":"string"}],"properties":{"disable":[{"context":"string","disable":true}],"menuLabel":[{"label":"string","context":"string"}],"genAppName":[{"params":["templateAppName"],"context":"string","formatString":"string"}],"genAppLimit":[{"limit":42,"context":"string"}],"limitPolicy":[{"context":"string","limitPolicy":"Restrict"}],"rowEstRange":[{"context":"string","lowBound":42,"highBound":42}],"targetSheet":[{"context":"string","sheetId":"string","sheetName":"string"}],"appOpenMethod":[{"context":"string","openMethod":"Tab"}],"appRetentionTime":[{"context":"string","retentionTime":"string"}],"overrideGenAppLimit":[{"context":"string","overrideGenAppLimit":false}]},"rowEstExpr":"string","dynamicView":true,"templateApp":"string","selectionApp":"string","includeScript":false,"statusSetting":"activate"}'
Example Response
{
  "id": "string",
  "name": "ODAG Link name",
  "owner": {
    "id": "wcgIs6wGcDdyzep9QmyopWvNH1FJTOhh",
    "name": "string",
    "subject": "string",
    "tenantid": "string"
  },
  "status": "active",
  "bindings": [
    {
      "range": {
        "lowerBound": 42,
        "upperBound": 42
      },
      "formatting": {
        "quote": "'",
        "delimiter": ","
      },
      "numericOnly": false,
      "selectionStates": "string",
      "selectAppParamName": "string",
      "selectAppParamType": "Field",
      "templateAppVarName": "string"
    }
  ],
  "privileges": [
    "string"
  ],
  "properties": {
    "disable": [
      {
        "context": "string",
        "disable": true
      }
    ],
    "menuLabel": [
      {
        "label": "string",
        "context": "string"
      }
    ],
    "genAppName": [
      {
        "params": [
          "templateAppName"
        ],
        "context": "string",
        "formatString": "string"
      }
    ],
    "genAppLimit": [
      {
        "limit": 42,
        "context": "string"
      }
    ],
    "limitPolicy": [
      {
        "context": "string",
        "limitPolicy": "Restrict"
      }
    ],
    "rowEstRange": [
      {
        "context": "string",
        "lowBound": 42,
        "highBound": 42
      }
    ],
    "targetSheet": [
      {
        "context": "string",
        "sheetId": "string",
        "sheetName": "string"
      }
    ],
    "appOpenMethod": [
      {
        "context": "string",
        "openMethod": "Tab"
      }
    ],
    "appRetentionTime": [
      {
        "context": "string",
        "retentionTime": "string"
      }
    ],
    "overrideGenAppLimit": [
      {
        "context": "string",
        "overrideGenAppLimit": false
      }
    ]
  },
  "rowEstExpr": "string",
  "createdDate": "2025-11-11T13:45:30Z",
  "dynamicView": true,
  "templateApp": {
    "id": "string",
    "name": "appname"
  },
  "modifiedDate": "2025-11-11T13:45:30Z",
  "sourceLinkId": "string",
  "includeScript": false,
  "modifiedByUser": {
    "id": "wcgIs6wGcDdyzep9QmyopWvNH1FJTOhh",
    "name": "string",
    "subject": "string",
    "tenantid": "string"
  },
  "genAppAccessible": true,
  "templateAppChartObjects": [
    {}
  ]
}
List requests for an ODAG link

Retrieves all Analytics Application generation requests for a specific ODAG link, with optional filtering by pending status (pending), selection Analytics Application (selectionAppId), sheet context (selectionAppSheet), or client context (clientContextHandle). Use this to track generation history or monitor in-flight requests.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
clientContextHandle
string

An opaque handle to a client-side object that contains the reference to the link being used.

pending
boolean

Pass true if only pending requests should be returned.

selectionAppId
string

The ID of the selection Analytics Application.

selectionAppSheet
string

The name (or ID) of the sheet to filter qualifying ODAG requests for a selection Analytics Application.

Path Parameters
linkId
string
Required

The ID of the link.

pattern = "^[a-fA-F0-9]{24}$"

Responses
200

Successful response - see array of requests in response.

application/json
array of objects

An array of Request Summary objects.

Show application/json properties
400

Link not found or ODAG service error (see detailed error).

application/json
object

A standard error response containing a list of one or more errors.

Show application/json properties
403

Forbidden.

application/json
object

A standard error response containing a list of one or more errors.

Show application/json properties
404

ODAG not enabled or access denied.

application/json
object

A standard error response containing a list of one or more errors.

Show application/json properties
GET
/api/analytics/odag-links/{linkId}/requests
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/analytics/odag-links/{linkId}/requests` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/analytics/odag-links/{linkId}/requests',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
# qlik-cli has not implemented support for GET /api/analytics/odag-links/{linkId}/requests yet.
curl "https://{tenant}.{region}.qlikcloud.com/api/analytics/odag-links/{linkId}/requests" \
-H "Authorization: Bearer <access_token>"
Example Response
[
  {
    "id": "string",
    "kind": "single",
    "link": "string",
    "owner": {
      "id": "wcgIs6wGcDdyzep9QmyopWvNH1FJTOhh",
      "name": "string",
      "subject": "string",
      "tenantid": "string"
    },
    "state": "validating",
    "loadState": {
      "status": "pending",
      "loadHost": "string",
      "startedAt": "2025-11-11T13:45:30Z",
      "finishedAt": "2025-11-11T13:45:30Z"
    },
    "sheetname": "string",
    "purgeAfter": "2025-11-11T13:45:30Z",
    "timeToLive": 42,
    "validation": [
      "string"
    ],
    "createdDate": "2025-11-11T13:45:30Z",
    "targetSheet": "string",
    "templateApp": "string",
    "actualRowEst": 42,
    "errorMessage": "string",
    "generatedApp": {
      "id": "string",
      "name": "appname"
    },
    "modifiedDate": "2025-11-11T13:45:30Z",
    "selectionApp": "string",
    "curRowEstExpr": "string",
    "retentionTime": 42,
    "parentRequestId": "string",
    "templateAppName": "appname",
    "bindingStateHash": 42,
    "generatedAppName": "appname",
    "selectionAppName": "appname",
    "curRowEstLowBound": 42,
    "curRowEstHighBound": 42,
    "selectionStateHash": 42
  }
]
Submit an ODAG request

Submits a new Analytics Application generation request with the current selection state from a selection Analytics Application. The request is validated against link properties before queuing. On success, returns a request object that you must monitor for completion using the status endpoint. Validation failures return detailed error information.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
linkId
string
Required

The ID of the link.

pattern = "^[a-fA-F0-9]{24}$"

Request Body
Required
application/json
object

Payload to send when creating an ODAG request. selectionApp is the ID of the selection Analytics Application from which the request is made. bindSelectionState is the selection state in the selection Analytics Application at the time the request is submitted (you can limit the fields to those used by the link's bindings to reduce payload size).

Show application/json properties
Responses
201

Successful response - the request has been queued.

application/json
object

The detailed content of an ODAG request object. If this is a summarization of a request initiated from a navigation point that has a single link, its link property refers to that link. Otherwise, a sub-request is created for each link in the navigation point and the link of each sub-request refers to its respective link. If this is a single or singlesub Analytics Application generation request and the request has reached at least the queued stage, the generatedApp property contains the ID of the generated Analytics Application (note that the generated Analytics Application might not yet be populated with data or published if the request is not completed). If this is a single or singlesub request and the data load operation failed, the generatedApp property still contains the ID of the failed Analytics Application to allow viewing of the ODAG-bound script for diagnostic purposes. Generated Analytics Applications for failed requests are purged regularly, so the Analytics Application might no longer be available. If this is a single or singlesub request that was canceled before reaching the loading phase, the generatedApp property is missing because generated Analytics Applications for pre-load phase requests are deleted. If this is a multiple request, the generatedApp property is also missing.

Show application/json properties
400

The selection Analytics Application was in an invalid state to proceed with this Analytics Application generation (see detailed error).

application/json
object

A standard error response containing a list of one or more errors.

Show application/json properties
403

Forbidden.

application/json
object

A standard error response containing a list of one or more errors.

Show application/json properties
404

Invalid link ID.

application/json
object

A standard error response containing a list of one or more errors.

Show application/json properties
POST
/api/analytics/odag-links/{linkId}/requests
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/analytics/odag-links/{linkId}/requests` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/analytics/odag-links/{linkId}/requests',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sheetname: 'string',
      actualRowEst: 42,
      selectionApp: 'string',
      selectionState: [
        {
          values: [
            {
              numValue: 'string',
              strValue: 'string',
              selStatus: 'S',
            },
          ],
          selectedSize: 42,
          selectionAppParamName: 'string',
          selectionAppParamType: 'Field',
        },
      ],
      bindSelectionState: [
        {
          values: [
            {
              numValue: 'string',
              strValue: 'string',
              selStatus: 'S',
            },
          ],
          selectedSize: 42,
          selectionAppParamName: 'string',
          selectionAppParamType: 'Field',
        },
      ],
      clientContextHandle: 'string',
    }),
  },
)
# qlik-cli has not implemented support for POST /api/analytics/odag-links/{linkId}/requests yet.
curl "https://{tenant}.{region}.qlikcloud.com/api/analytics/odag-links/{linkId}/requests" \
-X POST \
-H "Content-type: application/json" \
-H "Authorization: Bearer <access_token>" \
-d '{"sheetname":"string","actualRowEst":42,"selectionApp":"string","selectionState":[{"values":[{"numValue":"string","strValue":"string","selStatus":"S"}],"selectedSize":42,"selectionAppParamName":"string","selectionAppParamType":"Field"}],"bindSelectionState":[{"values":[{"numValue":"string","strValue":"string","selStatus":"S"}],"selectedSize":42,"selectionAppParamName":"string","selectionAppParamType":"Field"}],"clientContextHandle":"string"}'
Example Response
{
  "id": "string",
  "kind": "single",
  "link": "string",
  "owner": {
    "id": "wcgIs6wGcDdyzep9QmyopWvNH1FJTOhh",
    "name": "string",
    "subject": "string",
    "tenantid": "string"
  },
  "state": "validating",
  "loadState": {
    "status": "pending",
    "loadHost": "string",
    "startedAt": "2025-11-11T13:45:30Z",
    "finishedAt": "2025-11-11T13:45:30Z"
  },
  "sheetname": "string",
  "purgeAfter": "2025-11-11T13:45:30Z",
  "timeToLive": 42,
  "validation": [
    "string"
  ],
  "createdDate": "2025-11-11T13:45:30Z",
  "targetSheet": "string",
  "templateApp": "string",
  "actualRowEst": 42,
  "errorMessage": "string",
  "generatedApp": {
    "id": "string",
    "name": "appname"
  },
  "modifiedDate": "2025-11-11T13:45:30Z",
  "selectionApp": "string",
  "curRowEstExpr": "string",
  "retentionTime": 42,
  "parentRequestId": "string",
  "templateAppName": "appname",
  "bindingStateHash": 42,
  "generatedAppName": "appname",
  "selectionAppName": "appname",
  "curRowEstLowBound": 42,
  "curRowEstHighBound": 42,
  "selectionStateHash": 42
}
Check create link permission

Checks whether the current user has permission to create new ODAG links. Optionally verify permissions for a specific template Analytics Application or selection Analytics Application context. Returns a boolean indicating create permission status.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
optDenyIfSelAppNotUpdatable
boolean

When true, deny permission if the selection Analytics Application cannot be updated. This parameter is ignored unless optSelectAppId is also supplied.

optSelectAppId
string

An optional parameter for specifying the ID of a selection Analytics Application.

optTemplateAppId
string

An optional parameter for specifying the ID of a template Analytics Application.

Responses
200

Successful response.

application/json
object

An object used to inform the caller whether the current user has privilege to create new Links.

Show application/json properties
400

Invalid parameter values (see detailed error).

application/json
object

A standard error response containing a list of one or more errors.

Show application/json properties
403

Forbidden.

application/json
object

A standard error response containing a list of one or more errors.

Show application/json properties
404

ODAG not enabled.

application/json
object

A standard error response containing a list of one or more errors.

Show application/json properties
GET
/api/analytics/odag-links/cancreate
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/analytics/odag-links/cancreate` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/analytics/odag-links/cancreate',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
# qlik-cli has not implemented support for GET /api/analytics/odag-links/cancreate yet.
curl "https://{tenant}.{region}.qlikcloud.com/api/analytics/odag-links/cancreate" \
-H "Authorization: Bearer <access_token>"
Example Response
{
  "canCreateLinks": true
}
List ODAG links used by a selection Analytics Application

Registers the current set of ODAG links referenced by a selection Analytics Application and returns only those links the current user can access. Call this when a selection Analytics Application is opened or after modifying its ODAG link references. The response is an array of objects, where the id identifies the requested link and link contains the link state when accessible. Use GET /analytics/odag-links/{linkId} for full details.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Query Parameters
selAppId
string
Required

The ID of a selection Analytics Application.

includeCharts
boolean

When true, include master charts from the template Analytics Application in the response.

type
string

The type of the links to query. Defaults to link.

Can be one of: "link""view""all"

default = "link"

Request Body
Required
application/json
object

A JSON payload containing an array of LinkIds.

Show application/json properties
Responses
200

Successful response.

application/json
array of objects

Used to return a possibly empty link state when querying multiple links by ID where any one of those IDs may be invalid or obsolete. If the link field is missing, it means there was no accessible link for the corresponding id.

Show application/json properties
400

Invalid parameter values or link list (see detailed error).

application/json
object

A standard error response containing a list of one or more errors.

Show application/json properties
403

Forbidden.

application/json
object

A standard error response containing a list of one or more errors.

Show application/json properties
404

Invalid selection Analytics Application ID or link ID supplied (see detailed error message).

application/json
object

A standard error response containing a list of one or more errors.

Show application/json properties
POST
/api/analytics/odag-links/selection-app-link-usages
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/analytics/odag-links/selection-app-link-usages` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/analytics/odag-links/selection-app-link-usages',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      linkList: ['string'],
    }),
  },
)
# qlik-cli has not implemented support for POST /api/analytics/odag-links/selection-app-link-usages yet.
curl "https://{tenant}.{region}.qlikcloud.com/api/analytics/odag-links/selection-app-link-usages" \
-X POST \
-H "Content-type: application/json" \
-H "Authorization: Bearer <access_token>" \
-d '{"linkList":["string"]}'
Example Response
[
  {
    "id": "string",
    "link": {
      "id": "string",
      "name": "ODAG Link name",
      "owner": {
        "id": "wcgIs6wGcDdyzep9QmyopWvNH1FJTOhh",
        "name": "string",
        "subject": "string",
        "tenantid": "string"
      },
      "status": "active",
      "bindings": [
        {
          "range": {
            "lowerBound": 42,
            "upperBound": 42
          },
          "formatting": {
            "quote": "'",
            "delimiter": ","
          },
          "numericOnly": false,
          "selectionStates": "string",
          "selectAppParamName": "string",
          "selectAppParamType": "Field",
          "templateAppVarName": "string"
        }
      ],
      "privileges": [
        "string"
      ],
      "properties": {
        "disable": [
          {
            "context": "string",
            "disable": true
          }
        ],
        "menuLabel": [
          {
            "label": "string",
            "context": "string"
          }
        ],
        "genAppName": [
          {
            "params": [
              "templateAppName"
            ],
            "context": "string",
            "formatString": "string"
          }
        ],
        "genAppLimit": [
          {
            "limit": 42,
            "context": "string"
          }
        ],
        "limitPolicy": [
          {
            "context": "string",
            "limitPolicy": "Restrict"
          }
        ],
        "rowEstRange": [
          {
            "context": "string",
            "lowBound": 42,
            "highBound": 42
          }
        ],
        "targetSheet": [
          {
            "context": "string",
            "sheetId": "string",
            "sheetName": "string"
          }
        ],
        "appOpenMethod": [
          {
            "context": "string",
            "openMethod": "Tab"
          }
        ],
        "appRetentionTime": [
          {
            "context": "string",
            "retentionTime": "string"
          }
        ],
        "overrideGenAppLimit": [
          {
            "context": "string",
            "overrideGenAppLimit": false
          }
        ]
      },
      "rowEstExpr": "string",
      "createdDate": "2025-11-11T13:45:30Z",
      "dynamicView": true,
      "templateApp": {
        "id": "string",
        "name": "appname"
      },
      "modifiedDate": "2025-11-11T13:45:30Z",
      "sourceLinkId": "string",
      "includeScript": false,
      "modifiedByUser": {
        "id": "wcgIs6wGcDdyzep9QmyopWvNH1FJTOhh",
        "name": "string",
        "subject": "string",
        "tenantid": "string"
      },
      "genAppAccessible": true,
      "templateAppChartObjects": [
        {}
      ]
    }
  }
]
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