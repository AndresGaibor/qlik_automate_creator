---
title: "Data qualities REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/data-governance/data-qualities/"
local_path: "docs/endpoints/data-governance-data-qualities.md"
---

Title: Data qualities REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/data-governance/data-qualities/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

*   [Authenticate](https://qlik.dev/authenticate/)
*   [Embed](https://qlik.dev/embed/)
*   [Extend](https://qlik.dev/extend/)
*   [Manage](https://qlik.dev/manage/)

*   [APIs](https://qlik.dev/apis/)
*   [Toolkits](https://qlik.dev/toolkits/)
*   [Changelog](https://qlik.dev/changelog/)

*   [Authenticate](https://qlik.dev/authenticate/)
*   [Embed](https://qlik.dev/embed/)
*   [Extend](https://qlik.dev/extend/)
*   [Manage](https://qlik.dev/manage/)

* * *

*   [APIs](https://qlik.dev/apis/)
*   [Toolkits](https://qlik.dev/toolkits/)
*   [Changelog](https://qlik.dev/changelog/)

## Data qualities

*   [Get batch computation status](https://qlik.dev/apis/rest/data-governance/data-qualities/#get-api-data-governance-data-qualities-batch-computations-batchComputationId "Get batch computation status")
*   [Trigger data quality computation](https://qlik.dev/apis/rest/data-governance/data-qualities/#post-api-data-governance-data-qualities-computations "Trigger data quality computation")
*   [Get data quality computation status](https://qlik.dev/apis/rest/data-governance/data-qualities/#get-api-data-governance-data-qualities-computations-computationId "Get data quality computation status")
*   [Retrieve field qualities for multiple datasets](https://qlik.dev/apis/rest/data-governance/data-qualities/#post-api-data-governance-data-qualities-field-qualities-actions-filter "Retrieve field qualities for multiple datasets")
*   [Get global data quality](https://qlik.dev/apis/rest/data-governance/data-qualities/#get-api-data-governance-data-qualities-global-results "Get global data quality")
*   [Get datasets data quality global results](https://qlik.dev/apis/rest/data-governance/data-qualities/#post-api-data-governance-data-qualities-global-results-actions-filter "Get datasets data quality global results")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)
6.    / 
7.    data-governance 

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/data-governance/data-qualities.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Data qualities

[Download OpenAPI spec](https://qlik.dev/specs/rest/data-governance/data-qualities.json)

The Data qualities API enables you to assess the quality of your datasets through asynchronous computations. Computations run in two phases: profiling (analyzing column statistics) and assessment (evaluating quality rules) to produce aggregated quality metrics.

## Endpoints

*   [GET /api/data-governance/data-qualities/batch-computations/{batchComputationId}](https://qlik.dev/apis/rest/data-governance/data-qualities/#get-api-data-governance-data-qualities-batch-computations-batchComputationId)
*   [POST /api/data-governance/data-qualities/computations](https://qlik.dev/apis/rest/data-governance/data-qualities/#post-api-data-governance-data-qualities-computations)
*   [GET /api/data-governance/data-qualities/computations/{computationId}](https://qlik.dev/apis/rest/data-governance/data-qualities/#get-api-data-governance-data-qualities-computations-computationId)
*   [POST /api/data-governance/data-qualities/field-qualities/actions/filter](https://qlik.dev/apis/rest/data-governance/data-qualities/#post-api-data-governance-data-qualities-field-qualities-actions-filter)
*   [GET /api/data-governance/data-qualities/global-results](https://qlik.dev/apis/rest/data-governance/data-qualities/#get-api-data-governance-data-qualities-global-results)
*   [POST /api/data-governance/data-qualities/global-results/actions/filter](https://qlik.dev/apis/rest/data-governance/data-qualities/#post-api-data-governance-data-qualities-global-results-actions-filter)

## [](https://qlik.dev/apis/rest/data-governance/data-qualities/#get-api-data-governance-data-qualities-batch-computations-batchComputationId)Get batch computation status

Retrieves the status of a batch computation, including per-dataset statuses.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Path Parameters

*   batchComputationId string Required   Batch computation ID for tracking progress of the overall data quality computations. 
pattern = "^[a-zA-Z0-9-]{1,36}$"

### Responses

#### 200

Batch computation status retrieved successfully.

*   application/json object   Status of a batch computation, including per-dataset breakdown. 

Show application/json properties 

    *   status string Required   Overall status aggregated across all datasets in the batch. 
Can be one of: "IN_PROGRESS""FINISHED"

    *   batchComputationId string Required   The unique identifier of the batch computation. 
    *   computationStatuses array of objects Required   Status of each individual dataset computation within the batch. 

Show computationStatuses properties 

        *   status string Required   Status of a data quality computation. 
Can be one of: "PROFILE_REQUESTED""PROFILE_FAILED""REQUESTED""SUBMITTED""SUCCEEDED""FAILED"

        *   datasetId string Required   The ID of the dataset 
pattern = "^[0-9a-zA-Z-]{1,36}$"

        *   errorCode string   Error code indicating the reason for failure. 
Can be one of: "DQ-100""DQ-110""DQ-120""DQ-121""DQ-130""DQ-140""DQ-150""DQ-200""DQ-300""DQ-310""DQ-320""DQ-400""DQ-500""DQ-160"

        *   computationId string Required   The unique identifier of the individual computation for this dataset. 

#### 400

The request is in incorrect format.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

#### 401

User does not have valid authentication credentials.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

#### 403

User does not have access to the resource.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

#### 404

Batch computation not found.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

#### 500

Internal Server Error.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

#### 503

Requested service is not available.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

 GET /api/data-governance/data-qualities/batch-computations/{batchComputationId}

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `GET /api/data-governance/data-qualities/batch-computations/{batchComputationId}` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/data-governance/data-qualities/batch-computations/{batchComputationId}',  {    method: 'GET',    headers: {      'Content-Type': 'application/json',    },  },)
```

`# qlik-cli has not implemented support for GET /api/data-governance/data-qualities/batch-computations/{batchComputationId} yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/data-governance/data-qualities/batch-computations/{batchComputationId}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "status": "IN_PROGRESS",  "batchComputationId": "string",  "computationStatuses": [    {      "status": "SUCCEEDED",      "datasetId": "669144f5aa2d642638ef1dd0",      "errorCode": "DQ-100",      "computationId": "string"    }  ]}`

## [](https://qlik.dev/apis/rest/data-governance/data-qualities/#post-api-data-governance-data-qualities-computations)Trigger data quality computation

Triggers a full data quality computation for a dataset, running profile calculation followed by data quality assessment. Returns a `computationId` that can be used to track progress via the computation status endpoint (`GET /data-governance/data-qualities/computations/{computationId}`). The computation runs asynchronously. Poll the status endpoint until `status` is `SUCCEEDED` or `FAILED`.

### Facts

Rate limit[Special](https://qlik.dev/apis/rest/rate-limiting/)(10 requests per minute)
Replaces*   [POST v1/data-qualities/computations](https://qlik.dev/apis/rest/data-qualities/#post-api-v1-data-qualities-computations)

### Request Body

Required

*   application/json object   

Request payload for triggering a data quality computation. The `connectionId` is optional for file-based datasets. If none of the sampling parameters are provided, the following defaults apply:

    *   `executionMode: PULLUP`
    *   `sampleMode: ABSOLUTE`
    *   `sampleSize: 1000`

Show application/json properties 

    *   datasetId string Required   The ID of the dataset 
pattern = "^[0-9a-zA-Z-]{1,36}$"

    *   connectionId string   The ID of the connection 
pattern = "^[0-9a-zA-Z-]{1,36}$"

    *   sampleMode string   Specifies how the dataset is sampled. `ABSOLUTE` represents a fixed number of rows, while `RELATIVE` refers to a percentage of the total dataset rows. 
Can be one of: "ABSOLUTE""RELATIVE"

    *   sampleSize integer   The actual value of the selected sampling method size (either a fixed number for `ABSOLUTE` mode or a percentage for `RELATIVE` mode). Maximum allowed value for `ABSOLUTE` mode is `100000`. 
minimum = 1,  maximum = 100000,  format = int64

    *   executionMode string   Specifies where the data quality computation takes place. In `PUSHDOWN` mode, it runs within the Cloud Data Warehouse (e.g., Snowflake, Databricks), whereas in `PULLUP` mode, it runs in Qlik Cloud. 
Can be one of: "PUSHDOWN""PULLUP"

### Responses

#### 202

Computation triggered. The response body contains the `computationId` for tracking progress.

*   application/json object   Response returned when a data quality computation is successfully triggered. 

Show application/json properties 

    *   computationId string Required   The unique identifier of the triggered computation. Use this value to poll for status. 

#### 400

The request is in incorrect format.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

#### 401

User does not have valid authentication credentials.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

#### 403

User does not have access to the resource.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

#### 500

Internal Server Error.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

#### 503

Requested service is not available.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

 POST /api/data-governance/data-qualities/computations

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `POST /api/data-governance/data-qualities/computations` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/data-governance/data-qualities/computations',  {    method: 'POST',    headers: {      'Content-Type': 'application/json',    },    body: JSON.stringify({      datasetId: '669144f5aa2d642638ef1dd0',      sampleMode: 'ABSOLUTE',      sampleSize: 10000,      connectionId:        '2b855c3d-426c-4aac-90cf-0edf9fc294d3',      executionMode: 'PULLUP',    }),  },)
```

`qlik data-governance data-quality computation create`

`curl "https://{tenant}.{region}.qlikcloud.com/api/data-governance/data-qualities/computations" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"datasetId":"669144f5aa2d642638ef1dd0","sampleMode":"ABSOLUTE","sampleSize":10000,"connectionId":"2b855c3d-426c-4aac-90cf-0edf9fc294d3","executionMode":"PULLUP"}'`

### Example Response

`{  "computationId": "string"}`

## [](https://qlik.dev/apis/rest/data-governance/data-qualities/#get-api-data-governance-data-qualities-computations-computationId)Get data quality computation status

Retrieves the current execution status of a data quality computation. Poll this endpoint after triggering a computation to determine when results are available. The `status` field returns one of `REQUESTED`, `SUBMITTED`, `PROFILE_REQUESTED`, `SUCCEEDED`, `FAILED`, or `PROFILE_FAILED`.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)
Replaces*   [GET v1/data-qualities/computations/{computationId}](https://qlik.dev/apis/rest/data-qualities/#get-api-v1-data-qualities-computations-computationId)

### Path Parameters

*   computationId string Required   The unique identifier of the computation, as returned by `POST /data-governance/data-qualities/computations`. 
pattern = "^[a-zA-Z0-9-]{1,36}$"

### Responses

#### 200

Current execution status of the computation.

*   application/json object   

Show application/json properties 

    *   status string Required   Status of a data quality computation. 
Can be one of: "PROFILE_REQUESTED""PROFILE_FAILED""REQUESTED""SUBMITTED""SUCCEEDED""FAILED"

#### 400

The request is in incorrect format.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

#### 401

User does not have valid authentication credentials.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

#### 403

User does not have access to the resource.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

#### 404

No computation found with the specified `computationId`.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

#### 500

Internal Server Error.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

#### 503

Requested service is not available.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

 GET /api/data-governance/data-qualities/computations/{computationId}

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `GET /api/data-governance/data-qualities/computations/{computationId}` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/data-governance/data-qualities/computations/{computationId}',  {    method: 'GET',    headers: {      'Content-Type': 'application/json',    },  },)
```

`qlik data-governance data-quality computation get '4db06daa-3117-412e-8fb4-b29c937f9a0e'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/data-governance/data-qualities/computations/{computationId}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "status": "SUCCEEDED"}`

## [](https://qlik.dev/apis/rest/data-governance/data-qualities/#post-api-data-governance-data-qualities-field-qualities-actions-filter)Retrieve field qualities for multiple datasets

Retrieves the latest computed field quality metrics for a list of datasets. The maximum number of datasets is 100. When a dataset has been analyzed through multiple connections, the response returns the result from the most recently computed connection.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

*   application/json object   

Show application/json properties 

    *   datasets array of objects Required   List of datasets to retrieve field qualities for. 
minItems = 1,  maxItems = 100

Show datasets properties 

        *   datasetId string Required   The ID of the dataset 
pattern = "^[0-9a-zA-Z-]{1,36}$"

### Responses

#### 200

Field qualities retrieved successfully.

*   application/json object   Response containing field quality results for the requested datasets. 

Show application/json properties 

    *   fieldQualities array of objects Required   List of field quality results per dataset. 

Show fieldQualities properties 

        *   fields array of objects Required   List of fields and their quality metrics. 

Show fields properties 

            *   name string Required   The name of the field. 
            *   type object Required   Information about the type of the field. 

Show type properties 

                *   kind string Required   The kind of the field type. 
Can be one of: "STANDARD""SEMANTIC"

                *   name string   The name of the standard type (if applicable). 
                *   precision string   The precision of the type (e.g., for date/time fields). 
Can be one of: "timestamp-millis""timestamp-micros""time-millis""time-micros""date"

                *   semanticTypeId string   The ID of the semantic type (if applicable). 

            *   quality object Required   Quality metrics for the field. 

Show quality properties 

                *   type object Required   Quality metrics based on type validation. 

Show type properties 

                    *   empty integer Required   Number of empty sample cells. 
format = int64

                    *   total integer Required   Total number of cells in the sample. 
format = int64

                    *   valid integer Required   Number of valid sample cells. 
format = int64

                    *   invalid integer Required   Number of invalid sample cells. 
format = int64

                *   rules array of objects Required   Quality results per rule applied to this field. 

Show rules properties 

                    *   ruleId string   The unique identifier of the rule. 
                    *   quality object   Detailed quality counts for a single rule. 

Show quality properties 

                        *   total integer Required   Total number of cells evaluated by the rule. 
format = int64

                        *   valid integer Required   Number of cells that passed the rule. 
format = int64

                        *   errors array of strings   List of error identifiers encountered during rule execution. 
                        *   invalid integer Required   Number of cells that failed the rule. 
format = int64

                        *   notApplicable integer Required   Number of cells where the rule does not apply. 
format = int64

                        *   notExecutable integer Required   Number of cells where the rule could not be executed. 
format = int64

                    *   ruleMappingId string   The unique identifier of the rule mapping. 

                *   aggregated object Required   Aggregated metrics for the field. 

Show aggregated properties 

                    *   empty integer Required   Number of empty entries. 
format = int64

                    *   total integer Required   Total number of entries. 
format = int64

                    *   valid integer Required   Number of valid entries. 
format = int64

                    *   invalid integer Required   Number of invalid entries. 
format = int64

        *   computed object Required   Metadata about the computation. 

Show computed properties 

            *   at string Required   When the computation occurred. 
format = "date-time"

            *   by object Required   Details about the user who computed the quality. 

Show by properties 

                *   id string Required   Identifier of the user. 

        *   datasetId string Required   The ID of the dataset 
pattern = "^[0-9a-zA-Z-]{1,36}$"

#### 400

The request is in incorrect format.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

#### 401

User does not have valid authentication credentials.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

#### 403

User does not have access to the resource.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

#### 500

Internal Server Error.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

#### 503

Requested service is not available.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

 POST /api/data-governance/data-qualities/field-qualities/actions/filter

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `POST /api/data-governance/data-qualities/field-qualities/actions/filter` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/data-governance/data-qualities/field-qualities/actions/filter',  {    method: 'POST',    headers: {      'Content-Type': 'application/json',    },    body: JSON.stringify({      datasets: [        { datasetId: '669144f5aa2d642638ef1dd0' },      ],    }),  },)
```

`# qlik-cli has not implemented support for POST /api/data-governance/data-qualities/field-qualities/actions/filter yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/data-governance/data-qualities/field-qualities/actions/filter" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"datasets":[{"datasetId":"669144f5aa2d642638ef1dd0"}]}'`

### Example Response

`{  "fieldQualities": [    {      "fields": [        {          "name": "string",          "type": {            "kind": "STANDARD",            "name": "customer_id",            "precision": "timestamp-millis",            "semanticTypeId": "9996fbb942b02a6987534999"          },          "quality": {            "type": {              "empty": 42,              "total": 42,              "valid": 42,              "invalid": 42            },            "rules": [              {                "ruleId": "string",                "quality": {                  "total": 42,                  "valid": 42,                  "errors": [                    "DISABLED_SEMANTIC_TYPE"                  ],                  "invalid": 42,                  "notApplicable": 42,                  "notExecutable": 42                },                "ruleMappingId": "string"              }            ],            "aggregated": {              "empty": 42,              "total": 42,              "valid": 42,              "invalid": 42            }          }        }      ],      "computed": {        "at": "2023-10-01T12:00:00Z",        "by": {          "id": "string"        }      },      "datasetId": "669144f5aa2d642638ef1dd0"    }  ]}`

## [](https://qlik.dev/apis/rest/data-governance/data-qualities/#get-api-data-governance-data-qualities-global-results)Get global data quality

Retrieves the global quality results for a dataset, showing counts of valid, invalid, empty, and total sample cells.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)
Replaces*   [GET v1/data-qualities/global-results](https://qlik.dev/apis/rest/data-qualities/#get-api-v1-data-qualities-global-results)

### Query Parameters

*   datasetId string Required   The unique identifier of the dataset. 
pattern = "^[0-9a-zA-Z-]{1,36}$"

*   connectionId string   The unique identifier of the connection. 
pattern = "^[0-9a-zA-Z-]{1,36}$"

### Responses

#### 200

Global quality results for the dataset, including counts of valid, invalid, empty, and total sample cells per connection.

*   application/json object   

Show application/json properties 

    *   datasetId string Required   The unique identifier of the dataset. 
    *   qualities array of objects Required   

Show qualities properties 

        *   quality object Required   

Show quality properties 

            *   empty integer Required   Number of empty sample cells. 
format = int64

            *   total integer Required   Total number of cells in the sample. 
format = int64

            *   valid integer Required   Number of valid sample cells. 
format = int64

            *   invalid integer Required   Number of invalid sample cells. 
format = int64

            *   updatedAt string Required   Timestamp of the most recent data quality computation for this dataset and connection. 
format = "date-time"

        *   connectionId string Required   The unique identifier of the connection. 

#### 400

The request is in incorrect format.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

#### 401

User does not have valid authentication credentials.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

#### 403

User does not have access to the resource.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

#### 404

No quality results found for the specified dataset.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

#### 500

Internal Server Error.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

#### 503

Requested service is not available.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

 GET /api/data-governance/data-qualities/global-results

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `GET /api/data-governance/data-qualities/global-results` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/data-governance/data-qualities/global-results',  {    method: 'GET',    headers: {      'Content-Type': 'application/json',    },  },)
```

`qlik data-governance data-quality global-result ls \  --datasetId '669144f5aa2d642638ef1dd0'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/data-governance/data-qualities/global-results" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "datasetId": "string",  "qualities": [    {      "quality": {        "empty": 42,        "total": 42,        "valid": 42,        "invalid": 42,        "updatedAt": "2023-10-01T12:00:00Z"      },      "connectionId": "string"    }  ]}`

## [](https://qlik.dev/apis/rest/data-governance/data-qualities/#post-api-data-governance-data-qualities-global-results-actions-filter)Get datasets data quality global results

Retrieves the latest computed global quality metrics for a list of datasets. The maximum number of datasets is 100. When a dataset has been analyzed through multiple connections, the response returns the result from the most recently computed connection.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

*   application/json object   Request containing a list of dataset IDs to filter on. 

Show application/json properties 

    *   datasetIds array of strings Required   List of dataset IDs to retrieve results for. 

### Responses

#### 200

Data quality global results for the requested datasets.

*   application/json object   Response containing data quality global results grouped by dataset. 

Show application/json properties 

    *   dataQualities array of objects Required   List of data quality results, one per dataset and connection pair. 

Show dataQualities properties 

        *   error object   Details of an execution failure. 

Show error properties 

            *   reason string   A human-readable explanation of the failure. 
            *   errorCode string Required   The error code identifying the failure reason. 
            *   executedAt string   Timestamp when the execution failed. 
format = "date-time"

        *   status string Required   Status of a data quality computation. 
Can be one of: "PROFILE_REQUESTED""PROFILE_FAILED""REQUESTED""SUBMITTED""SUCCEEDED""FAILED"

        *   quality object   

Show quality properties 

            *   empty integer Required   Number of empty sample cells. 
format = int64

            *   total integer Required   Total number of cells in the sample. 
format = int64

            *   valid integer Required   Number of valid sample cells. 
format = int64

            *   invalid integer Required   Number of invalid sample cells. 
format = int64

            *   updatedAt string Required   Timestamp of the most recent data quality computation for this dataset and connection. 
format = "date-time"

        *   datasetId string Required   The ID of the dataset 
        *   connectionId string Required   The ID of the connection 

#### 400

The request is in incorrect format.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

#### 401

User does not have valid authentication credentials.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

#### 403

User does not have access to the resource.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

#### 500

Internal Server Error.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

#### 503

Requested service is not available.

*   application/json object   Standard error response wrapper. 

Show application/json properties 

    *   errors array of objects Required   List of errors that occurred. 

Show errors properties 

        *   code string Required   The error code identifying the type of error. 
        *   title string Required   A short summary of the error. 
        *   detail string   A human-readable explanation of the error. 

    *   traceId string   Trace identifier for debugging purposes. 

 POST /api/data-governance/data-qualities/global-results/actions/filter

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `POST /api/data-governance/data-qualities/global-results/actions/filter` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/data-governance/data-qualities/global-results/actions/filter',  {    method: 'POST',    headers: {      'Content-Type': 'application/json',    },    body: JSON.stringify({      datasetIds: ['669144f5aa2d642638ef1dd0'],    }),  },)
```

`# qlik-cli has not implemented support for POST /api/data-governance/data-qualities/global-results/actions/filter yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/data-governance/data-qualities/global-results/actions/filter" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"datasetIds":["669144f5aa2d642638ef1dd0"]}'`

### Example Response

`{  "dataQualities": [    {      "error": {        "reason": "string",        "errorCode": "string",        "executedAt": "2023-10-01T12:00:00Z"      },      "status": "SUCCEEDED",      "quality": {        "empty": 42,        "total": 42,        "valid": 42,        "invalid": 42,        "updatedAt": "2023-10-01T12:00:00Z"      },      "datasetId": "string",      "connectionId": "string"    }  ]}`

Was this page helpful?
*   yes 
*   no 

![Image 2: Qlik logo](https://qlik.dev/logo-footer.svg)

[Qlik Community](https://community.qlik.com/)

[](https://join.slack.com/t/qlikdeveloper/shared_invite/zt-3wrdlkhog-Dcq9LuCbjNQVN2XaPlgGqQ)[](https://www.facebook.com/qlik)[](https://www.linkedin.com/company/qlik)[](https://x.com/qlikdeveloper)

[Legal Agreements](https://www.qlik.com/us/legal/legal-agreements) / [Legal Policies](https://www.qlik.com/us/legal/legal-policies) / [Privacy & Cookie Notice](https://www.qlik.com/us/legal/privacy-and-cookie-notice) / [Terms of Use](https://qlik.dev/qlik-developer-portal-terms-of-use.pdf) / Do Not Share My Info

 Copyright © 1993-2026 QlikTech International AB. All rights reserved.