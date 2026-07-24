---
title: "Adaptive cards REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/analytics/discovery-agent/adaptive-cards/"
local_path: "docs/endpoints/analytics-discovery-agent-adaptive-cards.md"
---

Title: Adaptive cards REST | Qlik Developer Portal


Retrieves Adaptive Cards for in-app metrics. Supports fetching a single card by metric ID or multiple cards by a list of metric IDs. Supports filtering by app IDs, measures, dimensions, categories, breakdown dimensions, analysis types, and triggered time range. When filtering by measures, use the `appIds` parameter to scope results to specific apps, as the same measure expression can exist across multiple apps.

When called without any filter parameters, only the top-ranked result per metric is returned. When any filtering parameter is supplied (`metricIds`, `dimensions`, `measures`, `appIds`, `breakdowns`, `analysisTypes`, `comparisonPeriods`, `timeRangeStart`, `timeRangeEnd`), ranking is not applied and all matching results are returned.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Header Parameters

*   Authorization string

Required  
JWT containing tenant credentials.

### Query Parameters

*   analysisTypes array of strings 
Filter by analysis type. Repeat the parameter to include multiple types. When this parameter is present, all matching results are returned regardless of ranking.

Values may be any of: "recordHigh""recordLow""aboveModel""belowModel""spikesUp""spikesDown""newBaseLine""trendChanges"

*   appIds array of strings 

Filter by app ID(s). Use this to scope results to specific apps. When combined with measures, returns only cards matching BOTH criteria (AND logic). Repeat the parameter to supply multiple app IDs (OR logic within appIds).

**Recommendation:** Use consistent parameter order for better HTTP cache hit rates:

    1.   . appIds (if present)
    2.   . measures (if present)
    3.   . other filters
    4.   . pagination (limit, next, prev)

**Example - One app, multiple measures:**`?appIds=app-123&measures=Sum(Sales)&measures=Avg(Revenue)&measures=Count(Orders)`

**Example - Multiple apps, one measure:**`?appIds=app-retail&appIds=app-wholesale&measures=Sum(Sales)`

**Example - Multiple apps, multiple measures:**`?appIds=app-sales&appIds=app-hr&measures=Sum(Revenue)&measures=Avg(Salary)`

*   breakdowns array of strings 
Filter by one or more breakdown selections in the form `dimension:value` (example `Region:EMEA`). Values are selected from the UI dropdown — not free text — and should match available dimension/value pairs. Repeat the parameter to supply multiple breakdowns; results match any of the provided breakdown pairs.

*   categories array of strings 
Filter by category IDs from the business glossary. Category filtering is not currently applied to the result set.

*   comparisonPeriods array of strings 
Filter by comparison period. Example values: `D`, `W`, `M`, `Q`, `Y`. When this parameter is present, all matching results are returned regardless of ranking.

Values may be any of: "D""W""M""Q""Y"

*   dimensions array of strings 
Filter by dimension(s). Matching is case-sensitive; leading and trailing whitespace will be trimmed. Repeat the parameter to supply multiple dimensions.

*   limit integer 
The maximum number of resources to return for a request. The limit must be an integer between 1 and 100 (inclusive).

minimum = 1,  maximum = 100,  default = 10,  format = int32,  default = 10

*   measures array of strings 
Filter by measure(s). Matching is case-sensitive; leading and trailing whitespace will be trimmed. Repeat the parameter to supply multiple measures.

*   metricIds array of strings 
Filter by metric ID. Repeat the parameter to supply multiple IDs. When omitted, returns cards for all metrics visible to the caller.

*   next integer 
The numeric offset to the next page of resources. Provide either the next or prev parameter, but not both.

format = int32

*   prev integer 
The numeric offset to the previous page of resources. Provide either the next or prev parameter, but not both.

format = int32

*   sort string 
The field to sort by, with +/- prefix indicating sort order

Can be one of: "creationTime""+creationTime""-creationTime"

default = "+creationTime"

*   timeRangeEnd string 
Exclusive upper bound for filtering by analysis result end time. Use ISO 8601 format.

format = "date-time"

*   timeRangeStart string 
Inclusive lower bound for filtering by analysis result end time. Use ISO 8601 format.

format = "date-time"

*   type string 
Filter by Adaptive Card category. When omitted, cards from all categories are returned.

Can be one of: "measures""dimensions""breakdowns"

### Responses

GET /api/analytics/discovery-agent/adaptive-cards

`// qlik-api has not implemented support for `GET /api/analytics/discovery-agent/adaptive-cards` yet.// In the meantime, you can use fetch like this:const response = await fetch(  '/api/analytics/discovery-agent/adaptive-cards',  {    method: 'GET',    headers: {      'Content-Type': 'application/json',    },  },)`

### Example Response

`{  "data": [    {}  ],  "links": {    "next": {      "href": "http://example.com"    },    "prev": {      "href": "http://example.com"    },    "self": {      "href": "http://example.com"    }  },  "inAppMetrics": [    {      "id": "67cab2cf3d74cae279940b99",      "appId": "9b89de1e-9a1b-11ef-9974-563d08542bef",      "links": {        "self": {          "href": "http://example.com"        }      },      "status": 1,      "userId": "FyPG6xWp6prDU6BXQ3g7LY9gWR_YRkkx",      "tenantId": "efSCcpNYuayTysONkUcE3F80zYQ_LV9w",      "definition": {        "name": "Profit by region Europe",        "status": 1,        "measure": "Sum({<Region='Europe'>} Profit)",        "upwardIs": 1,        "dimension": "ShipDate",        "categories": [          {            "glossaryId": "fe7df4a8-abb4-42da-95e7-4ee8db22a7cb",            "categoryIds": [              "6db0fd8e-2115-4ac6-8d51-1729adbc4cfd"            ]          }        ],        "glossaryId": "5a7482f5-892a-4194-9f48-366ccb48a1e7",        "description": "This metric shows the profit by region in Europe.",        "analysisTypes": [          "recordHigh",          "aboveModel",          "spikesUp"        ],        "comparisonPeriods": [          "D",          "W",          "M",          "Q",          "Y"        ],        "breakDownDimensions": [          {            "filter": {              "type": "values",              "values": [                "Europe",                "Asia"              ]            },            "values": [              "Europe",              "Asia"            ],            "dimension": "Region"          }        ],        "nextExecutionOffset": 7      },      "updateTime": "2023-10-01T12:00:00Z",      "creationTime": "2023-10-01T12:00:00Z"    }  ]}`