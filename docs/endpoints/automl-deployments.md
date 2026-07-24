---
title: "AutoML real-time predictions REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/automl-deployments/"
local_path: "docs/endpoints/automl-deployments.md"
---

Title: AutoML real-time predictions REST | Qlik Developer Portal


Use your ML deployment to generate real-time results returned as JSON in a synchronous manner to predict future outcomes on new data.

Deprecation notice

This API is deprecated and will be removed on or after February 3, 2026. The complete end-to-end machine learning capability is now available in the [Machine Learning API](https://qlik.dev/apis/rest/ml/).

## [](https://qlik.dev/apis/rest/automl-deployments/#migrate-from-the-automl-real-time-predictions-api-to-the-machine-learning-api) Migrate from the AutoML real-time predictions API to the Machine Learning API

This step-by-step guide helps you migrate your application from the deprecated AutoML real-time predictions to the new real-time prediction endpoint in the Machine Learning API.

Using the [Machine Learning API](https://qlik.dev/apis/rest/ml/), you can now add multiple models to a deployment. A system of aliases is used in deployments to allow for dynamic swapping of models for use in predictions. For more information, see [Using multiple models in your ML deployment](https://help.qlik.com/en-US/cloud-services/Subsystems/Hub/Content/Sense_Hub/AutoML/ml-deployment-available-models.htm) on Qlik Help.

### [](https://qlik.dev/apis/rest/automl-deployments/#understand-the-endpoint-changes) Understand the endpoint changes

The new real-time prediction endpoint in the Machine Learning API replaces the deprecated AutoML real-time predictions endpoint.

The main change is the response format: responses are now wrapped under `data.attributes`. The request body format is unchanged.

Here’s how your requests will change:

|  | Deprecated endpoint | New endpoint |
| --- | --- | --- |
| **URL** | `/api/v1/automl-deployments/{deploymentId}/realtime-predictions` | `/api/v1/ml/deployments/{deploymentId}/realtime-predictions/actions/run` |
| **Response body** | `schema` and `rows` at the root level | `schema` and `rows` wrapped under `data.attributes` |

Note

Aliases are a Machine Learning API feature and do not require migration.

**Example response from the deprecated endpoint:**

`{  "schema": [    { "name": "feature_1", "type": "numeric" },    { "name": "feature_4_predicted", "type": "categorical" },    { "name": "feature_4_no", "type": "numeric" },    { "name": "feature_4_yes", "type": "numeric" },    { "name": "not_predicted_reason", "type": "categorical" }  ],  "rows": [    [0, "yes", 0.50, 0.49, null],    [1, "no", 0.76, 0.23, null]  ]}`

**Example response from the new endpoint:**

`{  "data": {    "type": "realtime-prediction",    "attributes": {      "schema": [        { "name": "feature_1", "type": "numeric" },        { "name": "feature_4_predicted", "type": "categorical" },        { "name": "feature_4_no", "type": "numeric" },        { "name": "feature_4_yes", "type": "numeric" },        { "name": "not_predicted_reason", "type": "categorical" }      ],      "rows": [        [0, "yes", 0.50, 0.49, null],        [1, "no", 0.76, 0.23, null]      ]    }  }}`

## [](https://qlik.dev/apis/rest/automl-deployments/#prerequisites) Prerequisites

Before you begin, make sure you have:

*   API credentials with permission to access the Machine Learning API endpoints. For more information, see [Authentication](https://qlik.dev/authenticate/). Required permissions and scopes 
If you use an API key: The user or service account must be assigned the Automl Deployment Contributor role to call the real-time prediction endpoint.

 If you use OAuth: Your token must include the `automl-deployments:predict` scope, which enables the required permissions for the real-time prediction endpoint. 
*   A deployed and activated model for making predictions. 
    *   Your deployment must be created with `"enablePredictions": true` to allow real-time predictions.
    *   Your model must be activated on the deployment using `POST /ml/deployments/{deploymentId}/actions/activate-models`.

*   The `deploymentId`: The unique identifier for your deployment.

Input schema

If you’re only migrating and your application already sends requests with the correct `schema` and `rows`, you can skip this. The migration only changes the response format. Request bodies are unchanged.

 If you need to discover the input schema (for example, for a newly deployed model), retrieve the experiment version and use the returned `featuresList` as the canonical source for feature names, order, and types. For endpoints and examples that show how to fetch the `featuresList`, see the [Machine Learning API reference](https://qlik.dev/apis/rest/ml/).

## [](https://qlik.dev/apis/rest/automl-deployments/#make-a-real-time-prediction-request) Make a real-time prediction request

Once your model is activated, and you have the required input schema, you can make predictions using the new real-time prediction endpoint in the Machine Learning API.

Send a real-time prediction request with a request body that includes the `schema` and `rows` that match the features expected by your model.

**Example request**

`curl -X POST "https://<TENANT_URL>/api/v1/ml/deployments/{deploymentId}/realtime-predictions/actions/run" ^  -H "Authorization: Bearer {TOKEN}" ^  -H "Content-Type: application/json" ^  -d "{    \"schema\": [      {\"name\": \"feature_1\"},      {\"name\": \"feature_2\"},      {\"name\": \"feature_3\"},      {\"name\": \"feature_4\"}    ],    \"rows\": [      [0, \"France\", 5, \"yes\"],      [1, \"Germany\", 20, \"no\"]    ]  }"`

(Optional) Add query parameters:

*   `includeShap=true` to include SHAP values in the response (explainability).
*   `includeSource=true` to include source data in the response.
*   `includeNotPredictedReason=true` to include reasons for rows that could not be predicted.
*   `index` to specify the name of the feature in the source data to use as an index in the response data.

**Example request with SHAP values**

`curl -X POST "https://<TENANT_URL>/api/v1/ml/deployments/{deploymentId}/realtime-predictions/actions/run?includeShap=true" ^  -H "Authorization: Bearer {TOKEN}" ^  -H "Content-Type: application/json" ^  -d "{    \"schema\": [      {\"name\": \"feature_1\"},      {\"name\": \"feature_2\"},      {\"name\": \"feature_3\"},      {\"name\": \"feature_4\"}    ],    \"rows\": [      [0, \"France\", 5, \"yes\"],      [1, \"Germany\", 20, \"no\"]    ]  }"`

## [](https://qlik.dev/apis/rest/automl-deployments/#verify-the-response) Verify the response

If your request is successful, you’ll receive a JSON response like this:

`{  "data": {    "type": "realtime-prediction",    "attributes": {      "schema": [        { "name": "feature_1", "type": "numeric" },        { "name": "feature_4_predicted", "type": "categorical" },        { "name": "feature_4_no", "type": "numeric" },        { "name": "feature_4_yes", "type": "numeric" },        { "name": "not_predicted_reason", "type": "categorical" }      ],      "rows": [        [0, "yes", 0.50, 0.49, null],        [1, "no", 0.76, 0.23, null]      ]    }  }}`

The response format differs between the deprecated and new endpoints:

*   Deprecated endpoint: The response contains `schema` and `rows` at the root level.
*   New endpoint: The response contains `schema` and `rows` inside the `data.attributes` object.

Migration tip

If your code previously read `resp.schema` and `resp.rows`, update it to `resp.data.attributes.schema` and `resp.data.attributes.rows`.

## [](https://qlik.dev/apis/rest/automl-deployments/#troubleshooting) Troubleshooting

If you get an error, see the following common issues:

*   `401 Unauthorized`: Verify your API credentials and permissions.
*   `404 Not Found`: Make sure your `deploymentId` and `modelId` are correct, and your model is deployed and activated.
*   `400 Bad Request`: Verify your request body for correct schema and data types.

For more information, see the [Machine Learning API reference](https://qlik.dev/apis/rest/ml/).

Generates predictions in a synchronous request and response.

### Facts

Rate limit[Special](https://qlik.dev/apis/rest/rate-limiting/)(300 requests per minute)
Deprecated This endpoint is deprecated and will eventually be removed. Read our API policy [here](https://qlik.dev/apis/api-policy/).
Deprecated sunset 2026-02
Deprecated description This endpoint has been replaced by a new version

### Query Parameters

*   includeNotPredictedReason boolean 
If true, will include a column with the reason why a prediction was not produced.

*   includeShap boolean 
If true, the shapley values will be included in the response.

*   includeSource boolean 
If true, the source data will be included in the response

*   index string 
The name of the feature in the source data to use as an index in the response data. The column will be included with its original name and values. This is intended to allow the caller to join results with source data.

### Path Parameters

*   deploymentId string

Required  
The ID of the ML deployed model that will be employed to produce predictions.

format = "uuid"

### Request Body

### Responses

POST /api/v1/automl-deployments/{deploymentId}/realtime-predictions

`import { createQlikApi } from '@qlik/api'const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})await qlik.automlDeployments.createAutomlDeploymentRealtimePrediction(  'c35f4b70-3ce4-4a30-b62b-2aef16943bc4',  {},  {    rows: [['string']],    schema: [{ name: 'string' }],  },)`