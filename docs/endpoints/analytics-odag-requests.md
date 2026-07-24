---
title: "ODAG requests REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/analytics/odag-requests/"
local_path: "docs/endpoints/analytics-odag-requests.md"
---

Title: ODAG requests REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/analytics/odag-requests/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## ODAG requests

*   [Get ODAG request status](https://qlik.dev/apis/rest/analytics/odag-requests/#get-api-analytics-odag-requests-requestId "Get ODAG request status")
*   [Perform action on ODAG request](https://qlik.dev/apis/rest/analytics/odag-requests/#put-api-analytics-odag-requests-requestId "Perform action on ODAG request")
*   [Delete a generated Analytics Application](https://qlik.dev/apis/rest/analytics/odag-requests/#delete-api-analytics-odag-requests-requestId-app "Delete a generated Analytics Application")
*   [Reload a generated Analytics Application](https://qlik.dev/apis/rest/analytics/odag-requests/#post-api-analytics-odag-requests-requestId-reload-app "Reload a generated Analytics Application")
*   [Rename a generated Analytics Application](https://qlik.dev/apis/rest/analytics/odag-requests/#post-api-analytics-odag-requests-requestId-rename-app "Rename a generated Analytics Application")
*   [Get request selections](https://qlik.dev/apis/rest/analytics/odag-requests/#get-api-analytics-odag-requests-requestId-selections "Get request selections")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)
6.    / 
7.    analytics 

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/analytics/odag-requests.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# ODAG requests

[Download OpenAPI spec](https://qlik.dev/specs/rest/analytics/odag-requests.json)

ODAG requests represent user submissions through an ODAG link, triggering automatic generation of new analytics applications. Use this API to track request status, manage the lifecycle of generated applications (reload, rename, delete), and retrieve request details. Generated applications have a configurable retention period and are automatically purged after that period expires.

## Endpoints

*   [GET /api/analytics/odag-requests/{requestId}](https://qlik.dev/apis/rest/analytics/odag-requests/#get-api-analytics-odag-requests-requestId)
*   [PUT /api/analytics/odag-requests/{requestId}](https://qlik.dev/apis/rest/analytics/odag-requests/#put-api-analytics-odag-requests-requestId)
*   [DELETE /api/analytics/odag-requests/{requestId}/app](https://qlik.dev/apis/rest/analytics/odag-requests/#delete-api-analytics-odag-requests-requestId-app)
*   [POST /api/analytics/odag-requests/{requestId}/reload-app](https://qlik.dev/apis/rest/analytics/odag-requests/#post-api-analytics-odag-requests-requestId-reload-app)
*   [POST /api/analytics/odag-requests/{requestId}/rename-app](https://qlik.dev/apis/rest/analytics/odag-requests/#post-api-analytics-odag-requests-requestId-rename-app)
*   [GET /api/analytics/odag-requests/{requestId}/selections](https://qlik.dev/apis/rest/analytics/odag-requests/#get-api-analytics-odag-requests-requestId-selections)

## [](https://qlik.dev/apis/rest/analytics/odag-requests/#get-api-analytics-odag-requests-requestId)Get ODAG request status

Retrieves the current status and details of an ODAG request, including its state (`queued`, `loading`, `succeeded`, `failed`), generated Analytics Application ID, and error information. For multi-application generation requests, includes nested status for each sub-request.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Path Parameters

*   requestId string Required   The ID of the ODAG request whose status is to be returned. 
pattern = "^[a-fA-F0-9]{24}$"

### Responses

#### 200

Successful response - see request status in response.

*   application/json object   The detailed content of an ODAG request object. If this is a summarization of a request initiated from a navigation point that has a single link, its `link` property refers to that link. Otherwise, a sub-request is created for each link in the navigation point and the `link` of each sub-request refers to its respective link. If this is a `single` or `singlesub` Analytics Application generation request and the request has reached at least the `queued` stage, the `generatedApp` property contains the ID of the generated Analytics Application (note that the generated Analytics Application might not yet be populated with data or published if the request is not completed). If this is a `single` or `singlesub` request and the data load operation failed, the `generatedApp` property still contains the ID of the failed Analytics Application to allow viewing of the ODAG-bound script for diagnostic purposes. Generated Analytics Applications for failed requests are purged regularly, so the Analytics Application might no longer be available. If this is a `single` or `singlesub` request that was canceled before reaching the `loading` phase, the `generatedApp` property is missing because generated Analytics Applications for pre-load phase requests are deleted. If this is a `multiple` request, the `generatedApp` property is also missing. 

Show application/json properties 

    *   id string Required   The system-assigned ID for an ODAG request. 
pattern = "^[a-fA-F0-9]{24}$"

    *   kind string Required   For links that do not use any partitioning fields, a `single` Analytics Application generation request is created. However, for selection Analytics Applications that designate a set of partitioning fields and the user selects multiple values for any of those partitioning fields, ODAG uses a separate `singlesub` request to generate a separate Analytics Application for each combination of selected partition field values, and tracks the queuing and data load phase of each of those sub-requests separately. Note that `singlesub` requests share the same link ID as their spawning `multiple` parent request. 
Can be one of: "single""multiple""singlesub"

    *   link string Required   The system-assigned ID for a link. 
pattern = "^[a-fA-F0-9]{24}$"

    *   owner object Required   Condensed state of a user returned in state of ownable ODAG entities (for example, a link or request). 

Show owner properties 

        *   id string Required   The system-assigned ID for a user 
        *   name string Required   
        *   subject string Required   Identity subject used for identity mapping. 
        *   tenantid string Required   Tenant identifier. 

    *   state string Required   The current state of an ODAG request. 
Can be one of: "validating""queued""invalid""hold""loading""canceled""failed""succeeded""canceling""canceledAck""failedAck"

    *   loadState object   An object that describes the state of a generated Analytics Application's data load operation. In request objects that include this object as an optional property, the property will be missing for `multiple` generation requests (see their sub-requests for their data load information) or for `single` and `singlesub` requests that have not yet reached their `loading` phase. 

Show loadState properties 

        *   status string   The completion status of a completed Request. 
Can be one of: "pending""success""warnings""failed"

        *   loadHost string Required   The engine host name used to perform the data load operation for this request. This property will be missing in `multiple` generation requests (see the `loadHost` field of their sub-requests) and will be an empty string on a `single` or `singlesub` request that has not yet reached the `loading` phase. 
        *   startedAt string Required   
format = "date-time"

        *   finishedAt string   
format = "date-time"

    *   sheetname string   
    *   purgeAfter string   
format = "date-time"

    *   timeToLive integer   The value of the Link's `appRetentionTime` property at the time the Analytics Application was generated (`0` means no auto-purge). 
    *   validation array of strings   A list of validation errors or warnings. 
    *   createdDate string Required   
format = "date-time"

    *   targetSheet string   The ID of the target sheet, taken from the link properties, to navigate to when opening the generated Analytics Application (empty for Analytics Application overview). 
    *   templateApp string Required   The system-assigned ID for an Analytics Application. 
minLength = 1

    *   actualRowEst integer   The evaluated value of the Link's `rowEstExpr` measure expression at the time this request was initiated. 
    *   errorMessage string   Detailed message if the request failed. 
    *   generatedApp object   Condensed state of an Analytics Application returned in `state` for Link, LinkUsage, Request, and ODAG Apps GET calls. 

Show generatedApp properties 

        *   id string Required   The system-assigned ID for an Analytics Application. 
minLength = 1

        *   name string Required   The name of an Analytics Application. 
minLength = 1

    *   modifiedDate string Required   
format = "date-time"

    *   selectionApp string   The system-assigned ID for an Analytics Application. 
minLength = 1

    *   curRowEstExpr string   The Link's `rowEstExpr` property setting at the time this request was initiated. 
    *   retentionTime integer   The remaining time in minutes this request will be retained (0 means kept forever). 
    *   parentRequestId string   The system-assigned ID for an ODAG request. 
pattern = "^[a-fA-F0-9]{24}$"

    *   templateAppName string   The name of an Analytics Application. 
minLength = 1

    *   bindingStateHash integer   A 64-bit hash of the bound field state at the time the request was made. 
format = int64

    *   generatedAppName string   The name of an Analytics Application. 
minLength = 1

    *   selectionAppName string   The name of an Analytics Application. 
minLength = 1

    *   curRowEstLowBound integer   The Link's `rowEstRange.lowBound` value for the user at the time this request was initiated. 
    *   curRowEstHighBound integer   The Link's `rowEstRange.highBound` value for the user at the time this request was initiated. 
    *   selectionStateHash integer   A 64-bit hash of the selected field values at the time the request was made. 
format = int64

#### 403

Forbidden.

*   application/json object   A standard error response containing a list of one or more errors. 

Show application/json properties 

    *   errors array of objects   A single error entry within an error response. 

Show errors properties 

        *   code string   A unique code used to identify the template form of the message in i18n tables (language independent). 
        *   meta object   Additional metadata associated with an error. 

Show meta properties 

            *   statusCode integer   The HTTP status code for the error. Generally speaking, the following codes have these meanings: `200` - Success, `201` - Success (object created), `400` - Error with user input, `403` - Authorization error (user lacks permission), `404` - Object not found, `409` - Attempt to change an object using an obsolete last ModifiedDate. 
format = int32

        *   title string   
        *   detail string   The message describing the error. 

    *   traceId string   A unique ID of the trace which the error occurred in. Makes it possible to locate involved services and find log messages from the time of the error. 

#### 404

Invalid request ID.

*   application/json object   A standard error response containing a list of one or more errors. 

Show application/json properties 

    *   errors array of objects   A single error entry within an error response. 

Show errors properties 

        *   code string   A unique code used to identify the template form of the message in i18n tables (language independent). 
        *   meta object   Additional metadata associated with an error. 

Show meta properties 

            *   statusCode integer   The HTTP status code for the error. Generally speaking, the following codes have these meanings: `200` - Success, `201` - Success (object created), `400` - Error with user input, `403` - Authorization error (user lacks permission), `404` - Object not found, `409` - Attempt to change an object using an obsolete last ModifiedDate. 
format = int32

        *   title string   
        *   detail string   The message describing the error. 

    *   traceId string   A unique ID of the trace which the error occurred in. Makes it possible to locate involved services and find log messages from the time of the error. 

 GET /api/analytics/odag-requests/{requestId}

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `GET /api/analytics/odag-requests/{requestId}` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/analytics/odag-requests/{requestId}',  {    method: 'GET',    headers: {      'Content-Type': 'application/json',    },  },)
```

`# qlik-cli has not implemented support for GET /api/analytics/odag-requests/{requestId} yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/analytics/odag-requests/{requestId}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "id": "string",  "kind": "single",  "link": "string",  "owner": {    "id": "wcgIs6wGcDdyzep9QmyopWvNH1FJTOhh",    "name": "string",    "subject": "string",    "tenantid": "string"  },  "state": "validating",  "loadState": {    "status": "pending",    "loadHost": "string",    "startedAt": "2025-11-11T13:45:30Z",    "finishedAt": "2025-11-11T13:45:30Z"  },  "sheetname": "string",  "purgeAfter": "2025-11-11T13:45:30Z",  "timeToLive": 42,  "validation": [    "string"  ],  "createdDate": "2025-11-11T13:45:30Z",  "targetSheet": "string",  "templateApp": "string",  "actualRowEst": 42,  "errorMessage": "string",  "generatedApp": {    "id": "string",    "name": "appname"  },  "modifiedDate": "2025-11-11T13:45:30Z",  "selectionApp": "string",  "curRowEstExpr": "string",  "retentionTime": 42,  "parentRequestId": "string",  "templateAppName": "appname",  "bindingStateHash": 42,  "generatedAppName": "appname",  "selectionAppName": "appname",  "curRowEstLowBound": 42,  "curRowEstHighBound": 42,  "selectionStateHash": 42}`

## [](https://qlik.dev/apis/rest/analytics/odag-requests/#put-api-analytics-odag-requests-requestId)Perform action on ODAG request

Performs actions on ODAG requests such as pausing, resuming, or canceling them. Cancel actions are effective only before the data loading phase. For multi-application generation requests, actions apply only to sub-requests that have not yet started loading. Automatic acknowledgment option simplifies state transitions.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Query Parameters

*   action string Required   The action to perform on the request. One of: (1) `cancel` a pending or in-flight request; (2) `pause` a request that has not started (still in the `queued` state); (3) `resume` a paused request; (4) acknowledge a prior cancellation; or (5) acknowledge a prior failure. 
Can be one of: "cancel""pause""resume""ackcancel""ackfailure"

*   autoAck boolean   Optional flag used with the `cancel` action. When `autoAck` is `true`, a canceled request automatically transitions to the `canceledAck` state after cancellation completes. When `autoAck` is `false`, the request transitions to `canceled`, and you must call this endpoint again with `action=ackcancel` to acknowledge the cancellation. 
*   delGenApp boolean   Optional flag that deletes the generated Analytics Application after an `action` of `cancel` (with `autoAck=true`), `ackcancel`, or `ackfailure`. 
*   ignoreSucceeded boolean   Optional flag used with the `cancel` action. When `true`, the API does not return an error if the request reaches the `succeeded` state while the cancellation request is in progress. 

### Path Parameters

*   requestId string Required   The ID of the request whose status is to be returned. 
pattern = "^[a-fA-F0-9]{24}$"

### Responses

#### 200

Successful response - see request status in response.

*   application/json object   The detailed content of an ODAG request object. If this is a summarization of a request initiated from a navigation point that has a single link, its `link` property refers to that link. Otherwise, a sub-request is created for each link in the navigation point and the `link` of each sub-request refers to its respective link. If this is a `single` or `singlesub` Analytics Application generation request and the request has reached at least the `queued` stage, the `generatedApp` property contains the ID of the generated Analytics Application (note that the generated Analytics Application might not yet be populated with data or published if the request is not completed). If this is a `single` or `singlesub` request and the data load operation failed, the `generatedApp` property still contains the ID of the failed Analytics Application to allow viewing of the ODAG-bound script for diagnostic purposes. Generated Analytics Applications for failed requests are purged regularly, so the Analytics Application might no longer be available. If this is a `single` or `singlesub` request that was canceled before reaching the `loading` phase, the `generatedApp` property is missing because generated Analytics Applications for pre-load phase requests are deleted. If this is a `multiple` request, the `generatedApp` property is also missing. 

Show application/json properties 

    *   id string Required   The system-assigned ID for an ODAG request. 
pattern = "^[a-fA-F0-9]{24}$"

    *   kind string Required   For links that do not use any partitioning fields, a `single` Analytics Application generation request is created. However, for selection Analytics Applications that designate a set of partitioning fields and the user selects multiple values for any of those partitioning fields, ODAG uses a separate `singlesub` request to generate a separate Analytics Application for each combination of selected partition field values, and tracks the queuing and data load phase of each of those sub-requests separately. Note that `singlesub` requests share the same link ID as their spawning `multiple` parent request. 
Can be one of: "single""multiple""singlesub"

    *   link string Required   The system-assigned ID for a link. 
pattern = "^[a-fA-F0-9]{24}$"

    *   owner object Required   Condensed state of a user returned in state of ownable ODAG entities (for example, a link or request). 

Show owner properties 

        *   id string Required   The system-assigned ID for a user 
        *   name string Required   
        *   subject string Required   Identity subject used for identity mapping. 
        *   tenantid string Required   Tenant identifier. 

    *   state string Required   The current state of an ODAG request. 
Can be one of: "validating""queued""invalid""hold""loading""canceled""failed""succeeded""canceling""canceledAck""failedAck"

    *   loadState object   An object that describes the state of a generated Analytics Application's data load operation. In request objects that include this object as an optional property, the property will be missing for `multiple` generation requests (see their sub-requests for their data load information) or for `single` and `singlesub` requests that have not yet reached their `loading` phase. 

Show loadState properties 

        *   status string   The completion status of a completed Request. 
Can be one of: "pending""success""warnings""failed"

        *   loadHost string Required   The engine host name used to perform the data load operation for this request. This property will be missing in `multiple` generation requests (see the `loadHost` field of their sub-requests) and will be an empty string on a `single` or `singlesub` request that has not yet reached the `loading` phase. 
        *   startedAt string Required   
format = "date-time"

        *   finishedAt string   
format = "date-time"

    *   sheetname string   
    *   purgeAfter string   
format = "date-time"

    *   timeToLive integer   The value of the Link's `appRetentionTime` property at the time the Analytics Application was generated (`0` means no auto-purge). 
    *   validation array of strings   A list of validation errors or warnings. 
    *   createdDate string Required   
format = "date-time"

    *   targetSheet string   The ID of the target sheet, taken from the link properties, to navigate to when opening the generated Analytics Application (empty for Analytics Application overview). 
    *   templateApp string Required   The system-assigned ID for an Analytics Application. 
minLength = 1

    *   actualRowEst integer   The evaluated value of the Link's `rowEstExpr` measure expression at the time this request was initiated. 
    *   errorMessage string   Detailed message if the request failed. 
    *   generatedApp object   Condensed state of an Analytics Application returned in `state` for Link, LinkUsage, Request, and ODAG Apps GET calls. 

Show generatedApp properties 

        *   id string Required   The system-assigned ID for an Analytics Application. 
minLength = 1

        *   name string Required   The name of an Analytics Application. 
minLength = 1

    *   modifiedDate string Required   
format = "date-time"

    *   selectionApp string   The system-assigned ID for an Analytics Application. 
minLength = 1

    *   curRowEstExpr string   The Link's `rowEstExpr` property setting at the time this request was initiated. 
    *   retentionTime integer   The remaining time in minutes this request will be retained (0 means kept forever). 
    *   parentRequestId string   The system-assigned ID for an ODAG request. 
pattern = "^[a-fA-F0-9]{24}$"

    *   templateAppName string   The name of an Analytics Application. 
minLength = 1

    *   bindingStateHash integer   A 64-bit hash of the bound field state at the time the request was made. 
format = int64

    *   generatedAppName string   The name of an Analytics Application. 
minLength = 1

    *   selectionAppName string   The name of an Analytics Application. 
minLength = 1

    *   curRowEstLowBound integer   The Link's `rowEstRange.lowBound` value for the user at the time this request was initiated. 
    *   curRowEstHighBound integer   The Link's `rowEstRange.highBound` value for the user at the time this request was initiated. 
    *   selectionStateHash integer   A 64-bit hash of the selected field values at the time the request was made. 
format = int64

#### 403

Forbidden.

*   application/json object   A standard error response containing a list of one or more errors. 

Show application/json properties 

    *   errors array of objects   A single error entry within an error response. 

Show errors properties 

        *   code string   A unique code used to identify the template form of the message in i18n tables (language independent). 
        *   meta object   Additional metadata associated with an error. 

Show meta properties 

            *   statusCode integer   The HTTP status code for the error. Generally speaking, the following codes have these meanings: `200` - Success, `201` - Success (object created), `400` - Error with user input, `403` - Authorization error (user lacks permission), `404` - Object not found, `409` - Attempt to change an object using an obsolete last ModifiedDate. 
format = int32

        *   title string   
        *   detail string   The message describing the error. 

    *   traceId string   A unique ID of the trace which the error occurred in. Makes it possible to locate involved services and find log messages from the time of the error. 

#### 404

Invalid request ID.

*   application/json object   A standard error response containing a list of one or more errors. 

Show application/json properties 

    *   errors array of objects   A single error entry within an error response. 

Show errors properties 

        *   code string   A unique code used to identify the template form of the message in i18n tables (language independent). 
        *   meta object   Additional metadata associated with an error. 

Show meta properties 

            *   statusCode integer   The HTTP status code for the error. Generally speaking, the following codes have these meanings: `200` - Success, `201` - Success (object created), `400` - Error with user input, `403` - Authorization error (user lacks permission), `404` - Object not found, `409` - Attempt to change an object using an obsolete last ModifiedDate. 
format = int32

        *   title string   
        *   detail string   The message describing the error. 

    *   traceId string   A unique ID of the trace which the error occurred in. Makes it possible to locate involved services and find log messages from the time of the error. 

 PUT /api/analytics/odag-requests/{requestId}

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `PUT /api/analytics/odag-requests/{requestId}` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/analytics/odag-requests/{requestId}',  {    method: 'PUT',    headers: {      'Content-Type': 'application/json',    },  },)
```

`# qlik-cli has not implemented support for PUT /api/analytics/odag-requests/{requestId} yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/analytics/odag-requests/{requestId}" \-X PUT \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "id": "string",  "kind": "single",  "link": "string",  "owner": {    "id": "wcgIs6wGcDdyzep9QmyopWvNH1FJTOhh",    "name": "string",    "subject": "string",    "tenantid": "string"  },  "state": "validating",  "loadState": {    "status": "pending",    "loadHost": "string",    "startedAt": "2025-11-11T13:45:30Z",    "finishedAt": "2025-11-11T13:45:30Z"  },  "sheetname": "string",  "purgeAfter": "2025-11-11T13:45:30Z",  "timeToLive": 42,  "validation": [    "string"  ],  "createdDate": "2025-11-11T13:45:30Z",  "targetSheet": "string",  "templateApp": "string",  "actualRowEst": 42,  "errorMessage": "string",  "generatedApp": {    "id": "string",    "name": "appname"  },  "modifiedDate": "2025-11-11T13:45:30Z",  "selectionApp": "string",  "curRowEstExpr": "string",  "retentionTime": 42,  "parentRequestId": "string",  "templateAppName": "appname",  "bindingStateHash": 42,  "generatedAppName": "appname",  "selectionAppName": "appname",  "curRowEstLowBound": 42,  "curRowEstHighBound": 42,  "selectionStateHash": 42}`

## [](https://qlik.dev/apis/rest/analytics/odag-requests/#delete-api-analytics-odag-requests-requestId-app)Delete a generated Analytics Application

Deletes the generated Analytics Application associated with a completed request. Only the request owner or ODAG link creator can delete generated Analytics Applications.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   requestId string Required   The ID of the request. 
pattern = "^[a-fA-F0-9]{24}$"

### Responses

#### 204

Successful response - No Content.

#### 403

Insufficient privilege to delete the generated Analytics Application. User must be either owner of the request or the ODAG link.

*   application/json object   A standard error response containing a list of one or more errors. 

Show application/json properties 

    *   errors array of objects   A single error entry within an error response. 

Show errors properties 

        *   code string   A unique code used to identify the template form of the message in i18n tables (language independent). 
        *   meta object   Additional metadata associated with an error. 

Show meta properties 

            *   statusCode integer   The HTTP status code for the error. Generally speaking, the following codes have these meanings: `200` - Success, `201` - Success (object created), `400` - Error with user input, `403` - Authorization error (user lacks permission), `404` - Object not found, `409` - Attempt to change an object using an obsolete last ModifiedDate. 
format = int32

        *   title string   
        *   detail string   The message describing the error. 

    *   traceId string   A unique ID of the trace which the error occurred in. Makes it possible to locate involved services and find log messages from the time of the error. 

#### 404

Invalid request ID or generated Analytics Application not found.

*   application/json object   A standard error response containing a list of one or more errors. 

Show application/json properties 

    *   errors array of objects   A single error entry within an error response. 

Show errors properties 

        *   code string   A unique code used to identify the template form of the message in i18n tables (language independent). 
        *   meta object   Additional metadata associated with an error. 

Show meta properties 

            *   statusCode integer   The HTTP status code for the error. Generally speaking, the following codes have these meanings: `200` - Success, `201` - Success (object created), `400` - Error with user input, `403` - Authorization error (user lacks permission), `404` - Object not found, `409` - Attempt to change an object using an obsolete last ModifiedDate. 
format = int32

        *   title string   
        *   detail string   The message describing the error. 

    *   traceId string   A unique ID of the trace which the error occurred in. Makes it possible to locate involved services and find log messages from the time of the error. 

 DELETE /api/analytics/odag-requests/{requestId}/app

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `DELETE /api/analytics/odag-requests/{requestId}/app` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/analytics/odag-requests/{requestId}/app',  {    method: 'DELETE',    headers: {      'Content-Type': 'application/json',    },  },)
```

`# qlik-cli has not implemented support for DELETE /api/analytics/odag-requests/{requestId}/app yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/analytics/odag-requests/{requestId}/app" \-X DELETE \-H "Authorization: Bearer <access_token>"`

## [](https://qlik.dev/apis/rest/analytics/odag-requests/#post-api-analytics-odag-requests-requestId-reload-app)Reload a generated Analytics Application

Reloads data in a generated Analytics Application from the underlying data sources. Only the request owner or ODAG link creator can reload generated Analytics Applications.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   requestId string Required   The ID of the request. 
pattern = "^[a-fA-F0-9]{24}$"

### Request Body

Required

*   application/json object   Payload to send when reloading an Analytics Application generated by an ODAG request. 

Show application/json properties 

    *   copyRequest boolean   Determines whether the request should be copied along with the generated Analytics Application. 
    *   actualRowEst integer   The current row estimate value calculated by the link's `rowEstExpr` property in the context of the selection Analytics Application. 
    *   selectionState array of objects   A collection of FieldSelectionStateV2 objects. 

Show selectionState properties 

        *   values array of objects Required   The list of values in the selection state for this field. 

Show values properties 

            *   numValue string   
            *   strValue string Required   
            *   selStatus string Required   The valid set of selection states that a specific field value can be in. One of: `S` (selected), `O` (optional), or `X` (excluded). 
Can be one of: "S""O""X"

        *   selectedSize integer   The actual number of selected values. Not used for `bindSelectionState`. 
        *   selectionAppParamName string Required   The name of a variable or field that corresponds to one or more bindings having a matching `selectAppParamName` used to generate Analytics Applications. 
        *   selectionAppParamType string Required   The different kinds of selection Analytics Application parameters whose values can be bound to the script of template Analytics Applications when generating new Analytics Applications. Note that `Exclude` is used to specifically prevent fields defined as optional bind parameters in the template Analytics Application script from being bound (these must either not have the optional quantity constraint specifiers or have a minimum quantity of 0). 
Can be one of: "Field""Variable""Property""Exclude""BDI"

    *   bindSelectionState array of objects   A collection of FieldSelectionStateV2 objects. 

Show bindSelectionState properties 

        *   values array of objects Required   The list of values in the selection state for this field. 

Show values properties 

            *   numValue string   
            *   strValue string Required   
            *   selStatus string Required   The valid set of selection states that a specific field value can be in. One of: `S` (selected), `O` (optional), or `X` (excluded). 
Can be one of: "S""O""X"

        *   selectedSize integer   The actual number of selected values. Not used for `bindSelectionState`. 
        *   selectionAppParamName string Required   The name of a variable or field that corresponds to one or more bindings having a matching `selectAppParamName` used to generate Analytics Applications. 
        *   selectionAppParamType string Required   The different kinds of selection Analytics Application parameters whose values can be bound to the script of template Analytics Applications when generating new Analytics Applications. Note that `Exclude` is used to specifically prevent fields defined as optional bind parameters in the template Analytics Application script from being bound (these must either not have the optional quantity constraint specifiers or have a minimum quantity of 0). 
Can be one of: "Field""Variable""Property""Exclude""BDI"

### Responses

#### 200

Successful response. Returns the updated request state.

*   application/json object   The detailed content of an ODAG request object. If this is a summarization of a request initiated from a navigation point that has a single link, its `link` property refers to that link. Otherwise, a sub-request is created for each link in the navigation point and the `link` of each sub-request refers to its respective link. If this is a `single` or `singlesub` Analytics Application generation request and the request has reached at least the `queued` stage, the `generatedApp` property contains the ID of the generated Analytics Application (note that the generated Analytics Application might not yet be populated with data or published if the request is not completed). If this is a `single` or `singlesub` request and the data load operation failed, the `generatedApp` property still contains the ID of the failed Analytics Application to allow viewing of the ODAG-bound script for diagnostic purposes. Generated Analytics Applications for failed requests are purged regularly, so the Analytics Application might no longer be available. If this is a `single` or `singlesub` request that was canceled before reaching the `loading` phase, the `generatedApp` property is missing because generated Analytics Applications for pre-load phase requests are deleted. If this is a `multiple` request, the `generatedApp` property is also missing. 

Show application/json properties 

    *   id string Required   The system-assigned ID for an ODAG request. 
pattern = "^[a-fA-F0-9]{24}$"

    *   kind string Required   For links that do not use any partitioning fields, a `single` Analytics Application generation request is created. However, for selection Analytics Applications that designate a set of partitioning fields and the user selects multiple values for any of those partitioning fields, ODAG uses a separate `singlesub` request to generate a separate Analytics Application for each combination of selected partition field values, and tracks the queuing and data load phase of each of those sub-requests separately. Note that `singlesub` requests share the same link ID as their spawning `multiple` parent request. 
Can be one of: "single""multiple""singlesub"

    *   link string Required   The system-assigned ID for a link. 
pattern = "^[a-fA-F0-9]{24}$"

    *   owner object Required   Condensed state of a user returned in state of ownable ODAG entities (for example, a link or request). 

Show owner properties 

        *   id string Required   The system-assigned ID for a user 
        *   name string Required   
        *   subject string Required   Identity subject used for identity mapping. 
        *   tenantid string Required   Tenant identifier. 

    *   state string Required   The current state of an ODAG request. 
Can be one of: "validating""queued""invalid""hold""loading""canceled""failed""succeeded""canceling""canceledAck""failedAck"

    *   loadState object   An object that describes the state of a generated Analytics Application's data load operation. In request objects that include this object as an optional property, the property will be missing for `multiple` generation requests (see their sub-requests for their data load information) or for `single` and `singlesub` requests that have not yet reached their `loading` phase. 

Show loadState properties 

        *   status string   The completion status of a completed Request. 
Can be one of: "pending""success""warnings""failed"

        *   loadHost string Required   The engine host name used to perform the data load operation for this request. This property will be missing in `multiple` generation requests (see the `loadHost` field of their sub-requests) and will be an empty string on a `single` or `singlesub` request that has not yet reached the `loading` phase. 
        *   startedAt string Required   
format = "date-time"

        *   finishedAt string   
format = "date-time"

    *   sheetname string   
    *   purgeAfter string   
format = "date-time"

    *   timeToLive integer   The value of the Link's `appRetentionTime` property at the time the Analytics Application was generated (`0` means no auto-purge). 
    *   validation array of strings   A list of validation errors or warnings. 
    *   createdDate string Required   
format = "date-time"

    *   targetSheet string   The ID of the target sheet, taken from the link properties, to navigate to when opening the generated Analytics Application (empty for Analytics Application overview). 
    *   templateApp string Required   The system-assigned ID for an Analytics Application. 
minLength = 1

    *   actualRowEst integer   The evaluated value of the Link's `rowEstExpr` measure expression at the time this request was initiated. 
    *   errorMessage string   Detailed message if the request failed. 
    *   generatedApp object   Condensed state of an Analytics Application returned in `state` for Link, LinkUsage, Request, and ODAG Apps GET calls. 

Show generatedApp properties 

        *   id string Required   The system-assigned ID for an Analytics Application. 
minLength = 1

        *   name string Required   The name of an Analytics Application. 
minLength = 1

    *   modifiedDate string Required   
format = "date-time"

    *   selectionApp string   The system-assigned ID for an Analytics Application. 
minLength = 1

    *   curRowEstExpr string   The Link's `rowEstExpr` property setting at the time this request was initiated. 
    *   retentionTime integer   The remaining time in minutes this request will be retained (0 means kept forever). 
    *   parentRequestId string   The system-assigned ID for an ODAG request. 
pattern = "^[a-fA-F0-9]{24}$"

    *   templateAppName string   The name of an Analytics Application. 
minLength = 1

    *   bindingStateHash integer   A 64-bit hash of the bound field state at the time the request was made. 
format = int64

    *   generatedAppName string   The name of an Analytics Application. 
minLength = 1

    *   selectionAppName string   The name of an Analytics Application. 
minLength = 1

    *   curRowEstLowBound integer   The Link's `rowEstRange.lowBound` value for the user at the time this request was initiated. 
    *   curRowEstHighBound integer   The Link's `rowEstRange.highBound` value for the user at the time this request was initiated. 
    *   selectionStateHash integer   A 64-bit hash of the selected field values at the time the request was made. 
format = int64

#### 403

Insufficient privilege to reload the generated Analytics Application. User must be either owner of the request or the ODAG link.

*   application/json object   A standard error response containing a list of one or more errors. 

Show application/json properties 

    *   errors array of objects   A single error entry within an error response. 

Show errors properties 

        *   code string   A unique code used to identify the template form of the message in i18n tables (language independent). 
        *   meta object   Additional metadata associated with an error. 

Show meta properties 

            *   statusCode integer   The HTTP status code for the error. Generally speaking, the following codes have these meanings: `200` - Success, `201` - Success (object created), `400` - Error with user input, `403` - Authorization error (user lacks permission), `404` - Object not found, `409` - Attempt to change an object using an obsolete last ModifiedDate. 
format = int32

        *   title string   
        *   detail string   The message describing the error. 

    *   traceId string   A unique ID of the trace which the error occurred in. Makes it possible to locate involved services and find log messages from the time of the error. 

#### 404

Invalid request ID or generated Analytics Application not found.

*   application/json object   A standard error response containing a list of one or more errors. 

Show application/json properties 

    *   errors array of objects   A single error entry within an error response. 

Show errors properties 

        *   code string   A unique code used to identify the template form of the message in i18n tables (language independent). 
        *   meta object   Additional metadata associated with an error. 

Show meta properties 

            *   statusCode integer   The HTTP status code for the error. Generally speaking, the following codes have these meanings: `200` - Success, `201` - Success (object created), `400` - Error with user input, `403` - Authorization error (user lacks permission), `404` - Object not found, `409` - Attempt to change an object using an obsolete last ModifiedDate. 
format = int32

        *   title string   
        *   detail string   The message describing the error. 

    *   traceId string   A unique ID of the trace which the error occurred in. Makes it possible to locate involved services and find log messages from the time of the error. 

 POST /api/analytics/odag-requests/{requestId}/reload-app

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `POST /api/analytics/odag-requests/{requestId}/reload-app` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/analytics/odag-requests/{requestId}/reload-app',  {    method: 'POST',    headers: {      'Content-Type': 'application/json',    },    body: JSON.stringify({      copyRequest: true,      actualRowEst: 42,      selectionState: [        {          values: [            {              numValue: 'string',              strValue: 'string',              selStatus: 'S',            },          ],          selectedSize: 42,          selectionAppParamName: 'string',          selectionAppParamType: 'Field',        },      ],      bindSelectionState: [        {          values: [            {              numValue: 'string',              strValue: 'string',              selStatus: 'S',            },          ],          selectedSize: 42,          selectionAppParamName: 'string',          selectionAppParamType: 'Field',        },      ],    }),  },)
```

`# qlik-cli has not implemented support for POST /api/analytics/odag-requests/{requestId}/reload-app yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/analytics/odag-requests/{requestId}/reload-app" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"copyRequest":true,"actualRowEst":42,"selectionState":[{"values":[{"numValue":"string","strValue":"string","selStatus":"S"}],"selectedSize":42,"selectionAppParamName":"string","selectionAppParamType":"Field"}],"bindSelectionState":[{"values":[{"numValue":"string","strValue":"string","selStatus":"S"}],"selectedSize":42,"selectionAppParamName":"string","selectionAppParamType":"Field"}]}'`

### Example Response

`{  "id": "string",  "kind": "single",  "link": "string",  "owner": {    "id": "wcgIs6wGcDdyzep9QmyopWvNH1FJTOhh",    "name": "string",    "subject": "string",    "tenantid": "string"  },  "state": "validating",  "loadState": {    "status": "pending",    "loadHost": "string",    "startedAt": "2025-11-11T13:45:30Z",    "finishedAt": "2025-11-11T13:45:30Z"  },  "sheetname": "string",  "purgeAfter": "2025-11-11T13:45:30Z",  "timeToLive": 42,  "validation": [    "string"  ],  "createdDate": "2025-11-11T13:45:30Z",  "targetSheet": "string",  "templateApp": "string",  "actualRowEst": 42,  "errorMessage": "string",  "generatedApp": {    "id": "string",    "name": "appname"  },  "modifiedDate": "2025-11-11T13:45:30Z",  "selectionApp": "string",  "curRowEstExpr": "string",  "retentionTime": 42,  "parentRequestId": "string",  "templateAppName": "appname",  "bindingStateHash": 42,  "generatedAppName": "appname",  "selectionAppName": "appname",  "curRowEstLowBound": 42,  "curRowEstHighBound": 42,  "selectionStateHash": 42}`

## [](https://qlik.dev/apis/rest/analytics/odag-requests/#post-api-analytics-odag-requests-requestId-rename-app)Rename a generated Analytics Application

Renames a generated Analytics Application. Only the request owner or ODAG link creator can rename generated Analytics Applications.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   requestId string Required   The ID of the request. 
pattern = "^[a-fA-F0-9]{24}$"

### Request Body

Required

*   application/json object   Payload to send when renaming an Analytics Application generated by an ODAG request. 

Show application/json properties 

    *   appName string Required   The new name of the generated Analytics Application. 

### Responses

#### 200

Successful response. Returns the updated request state.

*   application/json object   The detailed content of an ODAG request object. If this is a summarization of a request initiated from a navigation point that has a single link, its `link` property refers to that link. Otherwise, a sub-request is created for each link in the navigation point and the `link` of each sub-request refers to its respective link. If this is a `single` or `singlesub` Analytics Application generation request and the request has reached at least the `queued` stage, the `generatedApp` property contains the ID of the generated Analytics Application (note that the generated Analytics Application might not yet be populated with data or published if the request is not completed). If this is a `single` or `singlesub` request and the data load operation failed, the `generatedApp` property still contains the ID of the failed Analytics Application to allow viewing of the ODAG-bound script for diagnostic purposes. Generated Analytics Applications for failed requests are purged regularly, so the Analytics Application might no longer be available. If this is a `single` or `singlesub` request that was canceled before reaching the `loading` phase, the `generatedApp` property is missing because generated Analytics Applications for pre-load phase requests are deleted. If this is a `multiple` request, the `generatedApp` property is also missing. 

Show application/json properties 

    *   id string Required   The system-assigned ID for an ODAG request. 
pattern = "^[a-fA-F0-9]{24}$"

    *   kind string Required   For links that do not use any partitioning fields, a `single` Analytics Application generation request is created. However, for selection Analytics Applications that designate a set of partitioning fields and the user selects multiple values for any of those partitioning fields, ODAG uses a separate `singlesub` request to generate a separate Analytics Application for each combination of selected partition field values, and tracks the queuing and data load phase of each of those sub-requests separately. Note that `singlesub` requests share the same link ID as their spawning `multiple` parent request. 
Can be one of: "single""multiple""singlesub"

    *   link string Required   The system-assigned ID for a link. 
pattern = "^[a-fA-F0-9]{24}$"

    *   owner object Required   Condensed state of a user returned in state of ownable ODAG entities (for example, a link or request). 

Show owner properties 

        *   id string Required   The system-assigned ID for a user 
        *   name string Required   
        *   subject string Required   Identity subject used for identity mapping. 
        *   tenantid string Required   Tenant identifier. 

    *   state string Required   The current state of an ODAG request. 
Can be one of: "validating""queued""invalid""hold""loading""canceled""failed""succeeded""canceling""canceledAck""failedAck"

    *   loadState object   An object that describes the state of a generated Analytics Application's data load operation. In request objects that include this object as an optional property, the property will be missing for `multiple` generation requests (see their sub-requests for their data load information) or for `single` and `singlesub` requests that have not yet reached their `loading` phase. 

Show loadState properties 

        *   status string   The completion status of a completed Request. 
Can be one of: "pending""success""warnings""failed"

        *   loadHost string Required   The engine host name used to perform the data load operation for this request. This property will be missing in `multiple` generation requests (see the `loadHost` field of their sub-requests) and will be an empty string on a `single` or `singlesub` request that has not yet reached the `loading` phase. 
        *   startedAt string Required   
format = "date-time"

        *   finishedAt string   
format = "date-time"

    *   sheetname string   
    *   purgeAfter string   
format = "date-time"

    *   timeToLive integer   The value of the Link's `appRetentionTime` property at the time the Analytics Application was generated (`0` means no auto-purge). 
    *   validation array of strings   A list of validation errors or warnings. 
    *   createdDate string Required   
format = "date-time"

    *   targetSheet string   The ID of the target sheet, taken from the link properties, to navigate to when opening the generated Analytics Application (empty for Analytics Application overview). 
    *   templateApp string Required   The system-assigned ID for an Analytics Application. 
minLength = 1

    *   actualRowEst integer   The evaluated value of the Link's `rowEstExpr` measure expression at the time this request was initiated. 
    *   errorMessage string   Detailed message if the request failed. 
    *   generatedApp object   Condensed state of an Analytics Application returned in `state` for Link, LinkUsage, Request, and ODAG Apps GET calls. 

Show generatedApp properties 

        *   id string Required   The system-assigned ID for an Analytics Application. 
minLength = 1

        *   name string Required   The name of an Analytics Application. 
minLength = 1

    *   modifiedDate string Required   
format = "date-time"

    *   selectionApp string   The system-assigned ID for an Analytics Application. 
minLength = 1

    *   curRowEstExpr string   The Link's `rowEstExpr` property setting at the time this request was initiated. 
    *   retentionTime integer   The remaining time in minutes this request will be retained (0 means kept forever). 
    *   parentRequestId string   The system-assigned ID for an ODAG request. 
pattern = "^[a-fA-F0-9]{24}$"

    *   templateAppName string   The name of an Analytics Application. 
minLength = 1

    *   bindingStateHash integer   A 64-bit hash of the bound field state at the time the request was made. 
format = int64

    *   generatedAppName string   The name of an Analytics Application. 
minLength = 1

    *   selectionAppName string   The name of an Analytics Application. 
minLength = 1

    *   curRowEstLowBound integer   The Link's `rowEstRange.lowBound` value for the user at the time this request was initiated. 
    *   curRowEstHighBound integer   The Link's `rowEstRange.highBound` value for the user at the time this request was initiated. 
    *   selectionStateHash integer   A 64-bit hash of the selected field values at the time the request was made. 
format = int64

#### 403

Insufficient privilege to rename the generated Analytics Application. User must be either owner of the request or the ODAG link.

*   application/json object   A standard error response containing a list of one or more errors. 

Show application/json properties 

    *   errors array of objects   A single error entry within an error response. 

Show errors properties 

        *   code string   A unique code used to identify the template form of the message in i18n tables (language independent). 
        *   meta object   Additional metadata associated with an error. 

Show meta properties 

            *   statusCode integer   The HTTP status code for the error. Generally speaking, the following codes have these meanings: `200` - Success, `201` - Success (object created), `400` - Error with user input, `403` - Authorization error (user lacks permission), `404` - Object not found, `409` - Attempt to change an object using an obsolete last ModifiedDate. 
format = int32

        *   title string   
        *   detail string   The message describing the error. 

    *   traceId string   A unique ID of the trace which the error occurred in. Makes it possible to locate involved services and find log messages from the time of the error. 

#### 404

Invalid request ID or generated Analytics Application not found.

*   application/json object   A standard error response containing a list of one or more errors. 

Show application/json properties 

    *   errors array of objects   A single error entry within an error response. 

Show errors properties 

        *   code string   A unique code used to identify the template form of the message in i18n tables (language independent). 
        *   meta object   Additional metadata associated with an error. 

Show meta properties 

            *   statusCode integer   The HTTP status code for the error. Generally speaking, the following codes have these meanings: `200` - Success, `201` - Success (object created), `400` - Error with user input, `403` - Authorization error (user lacks permission), `404` - Object not found, `409` - Attempt to change an object using an obsolete last ModifiedDate. 
format = int32

        *   title string   
        *   detail string   The message describing the error. 

    *   traceId string   A unique ID of the trace which the error occurred in. Makes it possible to locate involved services and find log messages from the time of the error. 

 POST /api/analytics/odag-requests/{requestId}/rename-app

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `POST /api/analytics/odag-requests/{requestId}/rename-app` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/analytics/odag-requests/{requestId}/rename-app',  {    method: 'POST',    headers: {      'Content-Type': 'application/json',    },    body: JSON.stringify({ appName: 'string' }),  },)
```

`# qlik-cli has not implemented support for POST /api/analytics/odag-requests/{requestId}/rename-app yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/analytics/odag-requests/{requestId}/rename-app" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"appName":"string"}'`

### Example Response

`{  "id": "string",  "kind": "single",  "link": "string",  "owner": {    "id": "wcgIs6wGcDdyzep9QmyopWvNH1FJTOhh",    "name": "string",    "subject": "string",    "tenantid": "string"  },  "state": "validating",  "loadState": {    "status": "pending",    "loadHost": "string",    "startedAt": "2025-11-11T13:45:30Z",    "finishedAt": "2025-11-11T13:45:30Z"  },  "sheetname": "string",  "purgeAfter": "2025-11-11T13:45:30Z",  "timeToLive": 42,  "validation": [    "string"  ],  "createdDate": "2025-11-11T13:45:30Z",  "targetSheet": "string",  "templateApp": "string",  "actualRowEst": 42,  "errorMessage": "string",  "generatedApp": {    "id": "string",    "name": "appname"  },  "modifiedDate": "2025-11-11T13:45:30Z",  "selectionApp": "string",  "curRowEstExpr": "string",  "retentionTime": 42,  "parentRequestId": "string",  "templateAppName": "appname",  "bindingStateHash": 42,  "generatedAppName": "appname",  "selectionAppName": "appname",  "curRowEstLowBound": 42,  "curRowEstHighBound": 42,  "selectionStateHash": 42}`

## [](https://qlik.dev/apis/rest/analytics/odag-requests/#get-api-analytics-odag-requests-requestId-selections)Get request selections

Retrieves the selection state (selected and optional field values) that was active when the Analytics Application generation request was submitted.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Path Parameters

*   requestId string Required   The ID of the request. 
pattern = "^[a-fA-F0-9]{24}$"

### Responses

#### 200

Successful response.

*   application/json array of objects   A collection of FieldSelectionStateV2 objects. 

Show application/json properties 

    *   values array of objects Required   The list of values in the selection state for this field. 

Show values properties 

        *   numValue string   
        *   strValue string Required   
        *   selStatus string Required   The valid set of selection states that a specific field value can be in. One of: `S` (selected), `O` (optional), or `X` (excluded). 
Can be one of: "S""O""X"

    *   selectedSize integer   The actual number of selected values. Not used for `bindSelectionState`. 
    *   selectionAppParamName string Required   The name of a variable or field that corresponds to one or more bindings having a matching `selectAppParamName` used to generate Analytics Applications. 
    *   selectionAppParamType string Required   The different kinds of selection Analytics Application parameters whose values can be bound to the script of template Analytics Applications when generating new Analytics Applications. Note that `Exclude` is used to specifically prevent fields defined as optional bind parameters in the template Analytics Application script from being bound (these must either not have the optional quantity constraint specifiers or have a minimum quantity of 0). 
Can be one of: "Field""Variable""Property""Exclude""BDI"

#### 403

Forbidden.

*   application/json object   A standard error response containing a list of one or more errors. 

Show application/json properties 

    *   errors array of objects   A single error entry within an error response. 

Show errors properties 

        *   code string   A unique code used to identify the template form of the message in i18n tables (language independent). 
        *   meta object   Additional metadata associated with an error. 

Show meta properties 

            *   statusCode integer   The HTTP status code for the error. Generally speaking, the following codes have these meanings: `200` - Success, `201` - Success (object created), `400` - Error with user input, `403` - Authorization error (user lacks permission), `404` - Object not found, `409` - Attempt to change an object using an obsolete last ModifiedDate. 
format = int32

        *   title string   
        *   detail string   The message describing the error. 

    *   traceId string   A unique ID of the trace which the error occurred in. Makes it possible to locate involved services and find log messages from the time of the error. 

#### 404

Invalid request ID.

*   application/json object   A standard error response containing a list of one or more errors. 

Show application/json properties 

    *   errors array of objects   A single error entry within an error response. 

Show errors properties 

        *   code string   A unique code used to identify the template form of the message in i18n tables (language independent). 
        *   meta object   Additional metadata associated with an error. 

Show meta properties 

            *   statusCode integer   The HTTP status code for the error. Generally speaking, the following codes have these meanings: `200` - Success, `201` - Success (object created), `400` - Error with user input, `403` - Authorization error (user lacks permission), `404` - Object not found, `409` - Attempt to change an object using an obsolete last ModifiedDate. 
format = int32

        *   title string   
        *   detail string   The message describing the error. 

    *   traceId string   A unique ID of the trace which the error occurred in. Makes it possible to locate involved services and find log messages from the time of the error. 

 GET /api/analytics/odag-requests/{requestId}/selections

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `GET /api/analytics/odag-requests/{requestId}/selections` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/analytics/odag-requests/{requestId}/selections',  {    method: 'GET',    headers: {      'Content-Type': 'application/json',    },  },)
```

`# qlik-cli has not implemented support for GET /api/analytics/odag-requests/{requestId}/selections yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/analytics/odag-requests/{requestId}/selections" \-H "Authorization: Bearer <access_token>"`

### Example Response

`[  {    "values": [      {        "numValue": "string",        "strValue": "string",        "selStatus": "S"      }    ],    "selectedSize": 42,    "selectionAppParamName": "string",    "selectionAppParamType": "Field"  }]`

Was this page helpful?
*   yes 
*   no 

![Image 2: Qlik logo](https://qlik.dev/logo-footer.svg)

[Qlik Community](https://community.qlik.com/)

[](https://join.slack.com/t/qlikdeveloper/shared_invite/zt-3wrdlkhog-Dcq9LuCbjNQVN2XaPlgGqQ)[](https://www.facebook.com/qlik)[](https://www.linkedin.com/company/qlik)[](https://x.com/qlikdeveloper)

[Legal Agreements](https://www.qlik.com/us/legal/legal-agreements) / [Legal Policies](https://www.qlik.com/us/legal/legal-policies) / [Privacy & Cookie Notice](https://www.qlik.com/us/legal/privacy-and-cookie-notice) / [Terms of Use](https://qlik.dev/qlik-developer-portal-terms-of-use.pdf) / Do Not Share My Info

 Copyright © 1993-2026 QlikTech International AB. All rights reserved.