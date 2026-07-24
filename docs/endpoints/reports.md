---
title: "Reports REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/reports/"
local_path: "docs/endpoints/reports.md"
---

Title: Reports REST | Qlik Developer Portal


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
Reports

Reports are downloadable assets generated from data in analytics applications.

Download OpenAPI spec
Endpoints
POST
/api/v1/reports
GET
/api/v1/reports/{id}/outputs
GET
/api/v1/reports/{id}/status
Queue a new report request generation.
Facts
	Rate limit	Special (10 requests per minute)
Request Body
Required

Definition of the report request. Please note that sense-powerpoint-template-1.0, sense-word-template-1.0, sense-story-x.0 and qv-data-x.0 types are only for internal use.

Each report request type requires a specific template to be provided:

composition-1.0 requires compositionTemplates to be set
sense-excel-template-1.0 requires senseExcelTemplate to be set
sense-image-1.0 requires senseImageTemplate to be set
sense-sheet-1.0 requires senseSheetTemplate to be set
sense-data-1.0 requires senseDataTemplate to be set
sense-pixel-perfect-template-1.0 requires sensePixelPerfectTemplate to be set
sense-html-template-1.0 requires senseHtmlTemplate to be set
sense-powerpoint-template-1.0 requires sensePowerPointTemplate to be set
sense-word-template-1.0 requires senseWordTemplate to be set

Each template type supports specific output types:

composition-1.0 supports only pdfcomposition and pptxcomposition output types
sense-excel-template-1.0 supports excel and pdf output type
sense-image-1.0 supports pdf, pptx and image output types
sense-sheet-1.0 supports pdf and pptx output type
sense-data-1.0 supports xlsx output type
sense-pixel-perfect-template-1.0 supports pdf output types
sense-html-template-1.0 supports html output types
sense-powerpoint-template-1.0 supports powerpoint and pdf output types
sense-word-template-1.0 supports word and pdf output types

Each output type requires a specific output to be provided:

pdfcomposition requires pdfCompositionOutput to be set
pptxcomposition requires pptxCompositionOutput to be set
pdf requires pdfOutput to be set
pptx requires pptxOutput to be set
image requires imageOutput to be set
xlsx requires xlsxOutput to be set
application/json
object
Show application/json properties
Responses
202

Report request accepted.

application/json
object
Show application/json properties
400

Bad request, malformed syntax, errors in params or the report request is not valid.

application/json
object
Show application/json properties
401

Unauthorized, JWT invalid or not provided.

application/json
object
Show application/json properties
403

Forbidden, the user does not have access rights.

application/json
object
Show application/json properties
404

Not found.

application/json
object
Show application/json properties
409

Conflicted request. Report aborted.

application/json
object
Show application/json properties
429

Too many request. Indicates the user has sent too many requests in a given amount of time, aka "rate limiting".

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
POST
/api/v1/reports
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


await qlik.reports.createReport({
  compositionTemplates: [
    {
      senseSheetTemplate: {
        appId:
          '2451e58e-a1b9-4047-abf6-315e91d8a610',
        selectionsByStateDef: 'sel1',
        sheet: {
          id: '5ffe3801-1b6d-439d-a849-84d0748358f1',
        },
      },
      type: 'sense-sheet-1.0',
    },


    {
      senseSheetTemplate: {
        appId:
          '2451e58e-a1b9-4047-abf6-315e91d8a610',
        selectionsByStateDef: 'sel1',
        sheet: { id: 'ffrxJyA' },
      },
      type: 'sense-sheet-1.0',
    },
  ],
  definitions: {
    selectionsByState: {
      sel1: {
        $: [
          {
            fieldName: 'Region',
            values: [{ text: 'Arizona' }],
          },
        ],
      },
    },
  },
  output: {
    outputId: 'composition1',
    pdfCompositionOutput: {
      pdfOutputs: [
        {
          align: {
            horizontal: 'center',
            vertical: 'middle',
          },
          orientation: 'A',
          resizeType: 'autofit',
          size: 'A4',
        },


        {
          align: {
            horizontal: 'center',
            vertical: 'middle',
          },
          orientation: 'A',
          resizeType: 'autofit',
          size: 'A4',
        },
      ],
    },
    type: 'pdfcomposition',
  },
  type: 'composition-1.0',
})
Example Response
{
  "message": "Report request has been accepted and is being processed.",
  "requestId": "c61841ac-7b35-4434-aa74-4421f10fc68e",
  "outputsUrl": "https://t.eu.qlikcloud.com:443/api/v1/reports/c61841ac-7b35-4434-aa74-4421f10fc68e/outputs"
}
Get report request outputs.

Get the list of the outputs produced so far for the given report request. The outputs are generated asynchronously and are complete only when the status of the report request is 'done' or 'failed' or 'aborted'.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
filter
string

The advanced filtering to use for the query. Refer to RFC 7644 for the syntax. Cannot be combined with any of the fields marked as deprecated. All conditional statements within this query parameter are case insensitive. The following fields support the eq (equals) operator: outputId Example: outputId eq "123" or outputId eq "321"

limit
integer

Limit the returned result set

minimum = 1, maximum = 100, default = 20, default = 20

page
string

If present, the cursor that starts the page of data that is returned.

sort
array of strings

Sorting parameters

Values may be any of: "+outputId""-outputId""+sizeBytes""-sizeBytes"

Path Parameters
id
string
Required

Identifier of the request.

Responses
200

The outputs have been successfully returned.

application/json
object
Show application/json properties
400

Bad request. Malformed syntax, errors in params.

application/json
object
Show application/json properties
401

Unauthorized, JWT invalid or not provided.

application/json
object
Show application/json properties
403

Forbidden, user did not authenticate.

application/json
object
Show application/json properties
404

Not found.

application/json
object
Show application/json properties
409

Conflicted request. Report aborted.

application/json
object
Show application/json properties
429

Too many request. Indicates the user has sent too many requests in a given amount of time, aka "rate limiting".

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
GET
/api/v1/reports/{id}/outputs
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


await qlik.reports.getReportOutputs(
  '01562a37-23e3-4b43-865d-84c26122276c',
  {},
)
Example Response
{
  "data": [
    {
      "status": "processing",
      "traceId": "1234",
      "location": "https://t.eu.qlikcloud.com:443/api/v1/temp-contents/619b77be498fea00018de0e1?inline=1",
      "outputId": "c61841ac-7b35-4434-aa74-4421f10fc68e",
      "sizeBytes": 42,
      "exportErrors": [
        {
          "code": "string",
          "meta": {
            "appErrors": [
              {
                "appId": "11ecf638-0be4-4b94-a9e6-91218f34e175",
                "method": "GetObject",
                "parameters": {}
              }
            ],
            "selectionErrors": [
              {
                "detail": "string",
                "errorType": "fieldMissing",
                "fieldName": "Year",
                "stateName": "string",
                "missingValues": [
                  {
                    "text": "2021",
                    "number": 42,
                    "isNumeric": true
                  }
                ],
                "isFieldNameMissing": false
              }
            ]
          },
          "title": "string",
          "detail": "string"
        }
      ],
      "cycleSelections": [
        {
          "values": [
            {
              "text": "2021",
              "number": 42,
              "isNumeric": true
            }
          ],
          "fieldName": "Year",
          "defaultIsNumeric": true
        }
      ]
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
Get report request processing status.
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
id
string
Required

Identifier of the request.

Responses
200

Returns the request processing status.

application/json
object
Show application/json properties
400

Bad request. Malformed syntax, errors in params.

application/json
object
Show application/json properties
401

Unauthorized, JWT invalid or not provided.

application/json
object
Show application/json properties
403

Forbidden, user did not authenticate.

application/json
object
Show application/json properties
404

Not found.

application/json
object
Show application/json properties
409

Conflicted request. Report aborted.

application/json
object
Show application/json properties
429

Too many request. Indicates the user has sent too many requests in a given amount of time, aka "rate limiting".

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
GET
/api/v1/reports/{id}/status
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


await qlik.reports.getReportStatus(
  '01562a37-23e3-4b43-865d-84c26122276c',
)
Example Response
{
  "status": "done",
  "results": [
    {
      "location": "https://qlikcloud.com:443/api/v1/temp-contents/619baab68023910001efcb86?inline=1",
      "outputId": "output1"
    }
  ],
  "statusLocation": "/reports/01562a37-23e3-4b43-865d-84c26122276c/status",
  "resolutionAttempts": 1
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