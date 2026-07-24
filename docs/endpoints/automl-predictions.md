---
title: "AutoML dataset predictions REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/automl-predictions/"
local_path: "docs/endpoints/automl-predictions.md"
---

Title: AutoML dataset predictions REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/automl-predictions/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## AutoML dataset predictions

*   [Get shapley values in coordinate form](https://qlik.dev/apis/rest/automl-predictions/#get-api-v1-automl-predictions-predictionId-coordinate-shap "Get shapley values in coordinate form") D 
*   [Retrieve jobs associated with a prediction](https://qlik.dev/apis/rest/automl-predictions/#post-api-v1-automl-predictions-predictionId-jobs "Retrieve jobs associated with a prediction") D 
*   [Get any rows where a prediction was not produced](https://qlik.dev/apis/rest/automl-predictions/#get-api-v1-automl-predictions-predictionId-not-predicted-reasons "Get any rows where a prediction was not produced") D 
*   [Get a file containing predicted values](https://qlik.dev/apis/rest/automl-predictions/#get-api-v1-automl-predictions-predictionId-predictions "Get a file containing predicted values") D 
*   [Return a file containing shapley values](https://qlik.dev/apis/rest/automl-predictions/#get-api-v1-automl-predictions-predictionId-shap "Return a file containing shapley values") D 
*   [Return a file containing source values](https://qlik.dev/apis/rest/automl-predictions/#get-api-v1-automl-predictions-predictionId-source "Return a file containing source values") D 

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/automl-predictions.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# AutoML dataset predictions

[Download OpenAPI spec](https://qlik.dev/specs/rest/automl-predictions.json)

Use your ML deployment to generate batch data in file format to predict future outcomes on new data.

Deprecation notice

This API is deprecated and will be removed on or after February 3, 2026. The complete end-to-end machine learning capability is now available in the [Machine Learning API](https://qlik.dev/apis/rest/ml/).

## Endpoints

*   [GET /api/v1/automl-predictions/{predictionId}/coordinate-shap](https://qlik.dev/apis/rest/automl-predictions/#get-api-v1-automl-predictions-predictionId-coordinate-shap)
*   [POST /api/v1/automl-predictions/{predictionId}/jobs](https://qlik.dev/apis/rest/automl-predictions/#post-api-v1-automl-predictions-predictionId-jobs)
*   [GET /api/v1/automl-predictions/{predictionId}/not-predicted-reasons](https://qlik.dev/apis/rest/automl-predictions/#get-api-v1-automl-predictions-predictionId-not-predicted-reasons)
*   [GET /api/v1/automl-predictions/{predictionId}/predictions](https://qlik.dev/apis/rest/automl-predictions/#get-api-v1-automl-predictions-predictionId-predictions)
*   [GET /api/v1/automl-predictions/{predictionId}/shap](https://qlik.dev/apis/rest/automl-predictions/#get-api-v1-automl-predictions-predictionId-shap)
*   [GET /api/v1/automl-predictions/{predictionId}/source](https://qlik.dev/apis/rest/automl-predictions/#get-api-v1-automl-predictions-predictionId-source)

## [](https://qlik.dev/apis/rest/automl-predictions/#get-api-v1-automl-predictions-predictionId-coordinate-shap)Get shapley values in coordinate form

Deprecated

Returns a file containing the shapley values in coordinate form that are associated with a prediction ID.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)
Deprecated This endpoint is deprecated and will eventually be removed. Read our API policy [here](https://qlik.dev/apis/api-policy/).
Deprecated sunset 2026-02

### Query Parameters

*   refId string   

### Path Parameters

*   predictionId string Required   The ID of the prediction configuration object that provides parameters to be applied when the prediction is produced. 
format = "uuid"

### Responses

#### 200

Stream of coordinate shap values returned successfully.

*   text/csv any   

#### 400

Received a bad argument

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 403

Access forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 404

Resource not found.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 409

Resource conflict

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 503

Resource unavailable

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

 GET /api/v1/automl-predictions/{predictionId}/coordinate-shap

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.automlPredictions.getAutomlPredictionCoordinateShap(  'c35f4b70-3ce4-4a30-b62b-2aef16943bc4',  {},)
```

`# qlik-cli has not implemented support for GET /api/v1/automl-predictions/{predictionId}/coordinate-shap yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/automl-predictions/{predictionId}/coordinate-shap" \-H "Authorization: Bearer <access_token>"`

## [](https://qlik.dev/apis/rest/automl-predictions/#post-api-v1-automl-predictions-predictionId-jobs)Retrieve jobs associated with a prediction

Deprecated

Retrieve jobs that are associated with a prediction. Job with correlation type `prediction`.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)
Deprecated This endpoint is deprecated and will eventually be removed. Read our API policy [here](https://qlik.dev/apis/api-policy/).
Deprecated sunset 2026-02

### Path Parameters

*   predictionId string Required   The ID of the prediction configuration object that provides parameters to be applied when the prediction is produced. 
format = "uuid"

### Responses

#### 200

OK Response

#### 400

Received a bad argument

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 403

Access forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 404

Resource not found.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 409

Resource conflict

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 503

Resource unavailable

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

 POST /api/v1/automl-predictions/{predictionId}/jobs

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.automlPredictions.createAutomlPredictionJob(  'c35f4b70-3ce4-4a30-b62b-2aef16943bc4',)
```

`# qlik-cli has not implemented support for POST /api/v1/automl-predictions/{predictionId}/jobs yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/automl-predictions/{predictionId}/jobs" \-X POST \-H "Authorization: Bearer <access_token>"`

## [](https://qlik.dev/apis/rest/automl-predictions/#get-api-v1-automl-predictions-predictionId-not-predicted-reasons)Get any rows where a prediction was not produced

Deprecated

Returns a file containing any rows in a prediction operation where a prediction was unable to be produced.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)
Deprecated This endpoint is deprecated and will eventually be removed. Read our API policy [here](https://qlik.dev/apis/api-policy/).
Deprecated sunset 2026-02

### Query Parameters

*   refId string   

### Path Parameters

*   predictionId string Required   The ID of the prediction configuration object that provides parameters to be applied when the prediction is produced. 
format = "uuid"

### Responses

#### 200

Stream of not predicted reasons returned successfully.

*   text/csv any   

#### 400

Received a bad argument

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 403

Access forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 404

Resource not found.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 409

Resource conflict

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 503

Resource unavailable

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

 GET /api/v1/automl-predictions/{predictionId}/not-predicted-reasons

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.automlPredictions.getAutomlPredictionNotPredictedReasons(  'c35f4b70-3ce4-4a30-b62b-2aef16943bc4',  {},)
```

`# qlik-cli has not implemented support for GET /api/v1/automl-predictions/{predictionId}/not-predicted-reasons yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/automl-predictions/{predictionId}/not-predicted-reasons" \-H "Authorization: Bearer <access_token>"`

## [](https://qlik.dev/apis/rest/automl-predictions/#get-api-v1-automl-predictions-predictionId-predictions)Get a file containing predicted values

Deprecated

Returns a file containing the predicted values that are associated with a prediction ID.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)
Deprecated This endpoint is deprecated and will eventually be removed. Read our API policy [here](https://qlik.dev/apis/api-policy/).
Deprecated sunset 2026-02

### Query Parameters

*   refId string   

### Path Parameters

*   predictionId string Required   The ID of the prediction configuration object that provides parameters to be applied when the prediction is produced. 
format = "uuid"

### Responses

#### 200

Prediction stream returned succesfully.

#### 400

Received a bad argument

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 403

Access forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 404

Resource not found.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 409

Resource conflict

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 503

Resource unavailable

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

 GET /api/v1/automl-predictions/{predictionId}/predictions

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.automlPredictions.getAutomlPredictionPredictions(  'c35f4b70-3ce4-4a30-b62b-2aef16943bc4',  {},)
```

`# qlik-cli has not implemented support for GET /api/v1/automl-predictions/{predictionId}/predictions yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/automl-predictions/{predictionId}/predictions" \-H "Authorization: Bearer <access_token>"`

## [](https://qlik.dev/apis/rest/automl-predictions/#get-api-v1-automl-predictions-predictionId-shap)Return a file containing shapley values

Deprecated

Returns a file containing the shapley values that are associated with a prediction ID.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)
Deprecated This endpoint is deprecated and will eventually be removed. Read our API policy [here](https://qlik.dev/apis/api-policy/).
Deprecated sunset 2026-02

### Query Parameters

*   refId string   

### Path Parameters

*   predictionId string Required   The ID of the prediction configuration object that provides parameters to be applied when the prediction is produced. 
format = "uuid"

### Responses

#### 200

Stream of shap values returned successfully.

#### 400

Received a bad argument

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 403

Access forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 404

Resource not found.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 409

Resource conflict

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 503

Resource unavailable

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

 GET /api/v1/automl-predictions/{predictionId}/shap

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.automlPredictions.getAutomlPredictionShap(  'c35f4b70-3ce4-4a30-b62b-2aef16943bc4',  {},)
```

`# qlik-cli has not implemented support for GET /api/v1/automl-predictions/{predictionId}/shap yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/automl-predictions/{predictionId}/shap" \-H "Authorization: Bearer <access_token>"`

## [](https://qlik.dev/apis/rest/automl-predictions/#get-api-v1-automl-predictions-predictionId-source)Return a file containing source values

Deprecated

Returns a file containing the source values and an index field that are associated with a prediction ID.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)
Deprecated This endpoint is deprecated and will eventually be removed. Read our API policy [here](https://qlik.dev/apis/api-policy/).
Deprecated sunset 2026-02

### Query Parameters

*   refId string   

### Path Parameters

*   predictionId string Required   The ID of the prediction configuration object that provides parameters to be applied when the prediction is produced. 
format = "uuid"

### Responses

#### 200

Stream of source values and index field returned successfully.

*   text/csv any   

#### 400

Received a bad argument

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 403

Access forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 404

Resource not found.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 409

Resource conflict

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

#### 503

Resource unavailable

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   meta object   

Show meta properties 

            *   details string   Extra details for what may have caused the error 
            *   errorId string   The unique id of the error instance 
            *   argument string   The argument 
            *   resource string   The resource type that the error occurred on 
            *   resourceId string   The resource id that the error occurred on 

        *   issue string   The issue code 
        *   title string   A summary of what went wrong 
        *   errorId string   The unique id of the error instance 
        *   argument string   The argument 
        *   resource string   The resource type that the error occurred on 
        *   resourceId string   The resource id that the error occurred on 

 GET /api/v1/automl-predictions/{predictionId}/source

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.automlPredictions.getAutomlPredictionSource(  'c35f4b70-3ce4-4a30-b62b-2aef16943bc4',  {},)
```

`# qlik-cli has not implemented support for GET /api/v1/automl-predictions/{predictionId}/source yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/automl-predictions/{predictionId}/source" \-H "Authorization: Bearer <access_token>"`

Was this page helpful?
*   yes 
*   no 

![Image 2: Qlik logo](https://qlik.dev/logo-footer.svg)

[Qlik Community](https://community.qlik.com/)

[](https://join.slack.com/t/qlikdeveloper/shared_invite/zt-3wrdlkhog-Dcq9LuCbjNQVN2XaPlgGqQ)[](https://www.facebook.com/qlik)[](https://www.linkedin.com/company/qlik)[](https://x.com/qlikdeveloper)

[Legal Agreements](https://www.qlik.com/us/legal/legal-agreements) / [Legal Policies](https://www.qlik.com/us/legal/legal-policies) / [Privacy & Cookie Notice](https://www.qlik.com/us/legal/privacy-and-cookie-notice) / [Terms of Use](https://qlik.dev/qlik-developer-portal-terms-of-use.pdf) / Do Not Share My Info

 Copyright © 1993-2026 QlikTech International AB. All rights reserved. 

We use cookies to improve your experience with our websites and to deliver content tailored to your interests. By clicking ‘Ok’, you accept the use of additional cookies which may involve data transmission to third parties. Refer to our Privacy & Cookie Notice or click ‘More Information’ for details on cookie usage on our sites.[Privacy & Cookie Notice](https://www.qlik.com/us/legal/cookies-and-privacy-policy)

Ok

More Information

![Image 3: Company Logo](https://cdn.cookielaw.org/logos/0fff665c-78ed-4cdf-8357-4cb648f38616/018f1b3a-c29f-79e8-84cb-8f0f597a1714/bdc0e6d8-2ecf-48dc-808d-33588709b9b4/qliklogo_2024.png)

## Privacy Preference Center

When you visit any website, it may store or retrieve information on your browser, mostly in the form of cookies which may include third party cookies. As a Californian resident or citizen, it is your right under the CPRA to opt out of cross-context behavioral advertising. Cross-context behavioral ads use data from one site or app to advertise to you on a different company's site or app to show ads or products that you may be interested in. 

[More information](https://www.qlik.com/us/legal/privacy-and-cookie-notice)

Allow All
### Manage Consent Preferences

#### Strictly Necessary Cookies

Always Active

These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms. You can set your browser to block or alert you about these cookies, but some parts of the site will not then work.

Cookies Details‎

#### Functional Cookies

- [x] Functional Cookies 

These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages. If you do not allow these cookies, then some or all of these services may not function properly. These cookies do not typically store personal information enabling us to identify you, but are based on uniquely identifying your browser and internet device.

Cookies Details‎

#### Performance Cookies

- [x] Performance Cookies 

These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site and make it easier to navigate. For example, they help us to know which pages are the most and least popular and see how visitors move around the site. When analyzing this data it is typically done on an aggregated (anonymous) basis.

Cookies Details‎

#### Advertising Cookies

- [x] Advertising Cookies 

These cookies may be set through our site by our advertising partners to build a profile of your interests and show you relevant advertisements on other sites. They do not typically store personal information enabling us to identify you, but are based on uniquely identifying your browser and internet device. If you do not allow these cookies, you will experience less relevant advertising.

Cookies Details‎

### Cookie List

Clear

*   - [x] checkbox label label 

Apply Cancel

Consent Leg.Interest

- [x] checkbox label label

- [x] checkbox label label

- [x] checkbox label label

Confirm My Choices

[![Image 4: Powered by Onetrust](https://cdn.cookielaw.org/logos/static/powered_by_logo.svg)](https://www.onetrust.com/products/cookie-consent/)