---
title: "Machine Learning REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/ml/"
local_path: "docs/endpoints/ml.md"
---

Title: Machine Learning REST | Qlik Developer Portal


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
Machine Learning

The Machine Learning API allows you to generate profile insights to analyze datasets, create and manage machine learning experiments, deploy models, and run predictions.

Download OpenAPI spec
Endpoints
GET
/api/v1/ml/deployments
POST
/api/v1/ml/deployments
GET
/api/v1/ml/deployments/{deploymentId}
PATCH
/api/v1/ml/deployments/{deploymentId}
DELETE
/api/v1/ml/deployments/{deploymentId}
POST
/api/v1/ml/deployments/{deploymentId}/actions/activate-models
POST
/api/v1/ml/deployments/{deploymentId}/actions/deactivate-models
GET
/api/v1/ml/deployments/{deploymentId}/aliases
POST
/api/v1/ml/deployments/{deploymentId}/aliases
GET
/api/v1/ml/deployments/{deploymentId}/aliases/{aliasId}
PATCH
/api/v1/ml/deployments/{deploymentId}/aliases/{aliasId}
DELETE
/api/v1/ml/deployments/{deploymentId}/aliases/{aliasId}
POST
/api/v1/ml/deployments/{deploymentId}/aliases/{aliasName}/realtime-predictions/actions/run
GET
/api/v1/ml/deployments/{deploymentId}/batch-predictions
POST
/api/v1/ml/deployments/{deploymentId}/batch-predictions
GET
/api/v1/ml/deployments/{deploymentId}/batch-predictions/{batchPredictionId}
PATCH
/api/v1/ml/deployments/{deploymentId}/batch-predictions/{batchPredictionId}
DELETE
/api/v1/ml/deployments/{deploymentId}/batch-predictions/{batchPredictionId}
POST
/api/v1/ml/deployments/{deploymentId}/batch-predictions/{batchPredictionId}/actions/predict
GET
/api/v1/ml/deployments/{deploymentId}/batch-predictions/{batchPredictionId}/schedule
PATCH
/api/v1/ml/deployments/{deploymentId}/batch-predictions/{batchPredictionId}/schedule
PUT
/api/v1/ml/deployments/{deploymentId}/batch-predictions/{batchPredictionId}/schedule
DELETE
/api/v1/ml/deployments/{deploymentId}/batch-predictions/{batchPredictionId}/schedule
POST
/api/v1/ml/deployments/{deploymentId}/models/actions/add
POST
/api/v1/ml/deployments/{deploymentId}/models/actions/remove
POST
/api/v1/ml/deployments/{deploymentId}/realtime-predictions/actions/run
GET
/api/v1/ml/experiments
POST
/api/v1/ml/experiments
GET
/api/v1/ml/experiments/{experimentId}
PATCH
/api/v1/ml/experiments/{experimentId}
DELETE
/api/v1/ml/experiments/{experimentId}
POST
/api/v1/ml/experiments/{experimentId}/actions/recommend-models
GET
/api/v1/ml/experiments/{experimentId}/models
GET
/api/v1/ml/experiments/{experimentId}/models/{modelId}
GET
/api/v1/ml/experiments/{experimentId}/versions
POST
/api/v1/ml/experiments/{experimentId}/versions
GET
/api/v1/ml/experiments/{experimentId}/versions/{experimentVersionId}
PATCH
/api/v1/ml/experiments/{experimentId}/versions/{experimentVersionId}
DELETE
/api/v1/ml/experiments/{experimentId}/versions/{experimentVersionId}
POST
/api/v1/ml/jobs/{corrType}/{corrId}/actions/cancel
POST
/api/v1/ml/profile-insights
GET
/api/v1/ml/profile-insights/{dataSetId}
List deployments
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
filter
string

Deployment fields by which you can filter responses.



spaceId ID string (or empty string for personal space) - ID of space in which deployment(s) exist
modelId UUID string - By model ID
createdBy ID string
ownerId ID string
experimentId UUID string - ID of experiment in which model(s) exist
experimentVersionId UUID string - ID of experiment version in which model(s) exist
predictionId UUID string - ID of prediction which exists on deployment
predictionEnabled boolean - Are predictions enabled
exactName string - Deployments with exact name. Names may not be unique.
nameContains string - Deployments where name includes this. Names may not be unique
experimentType string - Deployments that have models of the experiment type
sort
string

Field(s) by which to sort response

Can be one of: "createdAt""+createdAt""-createdAt""name""+name""-name""updatedAt""+updatedAt""-updatedAt"

limit
integer

Number of results per page. Default is 32.

maximum = 100, default = 32, default = 32

offset
integer

Number of rows to skip before getting page[size]

Responses
200

OK

application/json
object
Show application/json properties
400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
GET
/api/v1/ml/deployments
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


await qlik.ml.getMlDeployments({})
Example Response
{
  "data": [
    {
      "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "type": "deployment",
      "attributes": {
        "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
        "name": "string",
        "errors": "[{\"code\":\"AML-145\",\"title\":\"datasync dependent service error, service profile\",\"errorId\":\"c1546687-ad5d-4002-87f6-8c9711298db1\",\"meta\":{\"errorId\":\"c1546687-ad5d-4002-87f6-8c9711298db1\"}}]\n",
        "modelId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
        "ownerId": "string",
        "spaceId": "string",
        "createdAt": "string",
        "createdBy": "string",
        "updatedAt": "string",
        "deprecated": true,
        "description": "string",
        "errorMessage": "string",
        "deployedModelIds": [
          "c35f4b70-3ce4-4a30-b62b-2aef16943bc4"
        ],
        "enablePredictions": true
      }
    }
  ],
  "meta": {
    "count": 42
  },
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
  }
}
Create a deployment
Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
application/json
object

Input for creating a new deployment

Show application/json properties
Responses
201

Created

application/json
object
Show application/json properties
400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
POST
/api/v1/ml/deployments
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


await qlik.ml.createMlDeployment({
  data: {
    attributes: {
      deprecated: true,
      description: 'string',
      enablePredictions: true,
      modelId:
        'c35f4b70-3ce4-4a30-b62b-2aef16943bc4',
      name: 'string',
      spaceId: 'string',
    },
    type: 'deployment',
  },
})
Example Response
{
  "data": {
    "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
    "type": "deployment",
    "attributes": {
      "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "name": "string",
      "errors": "[{\"code\":\"AML-145\",\"title\":\"datasync dependent service error, service profile\",\"errorId\":\"c1546687-ad5d-4002-87f6-8c9711298db1\",\"meta\":{\"errorId\":\"c1546687-ad5d-4002-87f6-8c9711298db1\"}}]\n",
      "modelId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "ownerId": "string",
      "spaceId": "string",
      "createdAt": "string",
      "createdBy": "string",
      "updatedAt": "string",
      "deprecated": true,
      "description": "string",
      "errorMessage": "string",
      "deployedModelIds": [
        "c35f4b70-3ce4-4a30-b62b-2aef16943bc4"
      ],
      "enablePredictions": true
    }
  }
}
Get a deployment
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
deploymentId
string
Required

ID of the deployment

Responses
200

OK

application/json
object
Show application/json properties
400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
GET
/api/v1/ml/deployments/{deploymentId}
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


await qlik.ml.getMlDeployment('string')
Example Response
{
  "data": {
    "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
    "type": "deployment",
    "attributes": {
      "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "name": "string",
      "errors": "[{\"code\":\"AML-145\",\"title\":\"datasync dependent service error, service profile\",\"errorId\":\"c1546687-ad5d-4002-87f6-8c9711298db1\",\"meta\":{\"errorId\":\"c1546687-ad5d-4002-87f6-8c9711298db1\"}}]\n",
      "modelId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "ownerId": "string",
      "spaceId": "string",
      "createdAt": "string",
      "createdBy": "string",
      "updatedAt": "string",
      "deprecated": true,
      "description": "string",
      "errorMessage": "string",
      "deployedModelIds": [
        "c35f4b70-3ce4-4a30-b62b-2aef16943bc4"
      ],
      "enablePredictions": true
    }
  }
}
Update a deployment
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
deploymentId
string
Required

ID of the deployment

Request Body
application/json
array of objects

Values that can be patched.

Show application/json properties
Responses
204

No Content

400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
PATCH
/api/v1/ml/deployments/{deploymentId}
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


await qlik.ml.patchMlDeployment('string', [
  {
    op: 'replace',
    path: '/name',
    value: 'New Name',
  },
])
Delete a deployment
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
deploymentId
string
Required

ID of the deployment

Responses
204

No Content

400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
DELETE
/api/v1/ml/deployments/{deploymentId}
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


await qlik.ml.deleteMlDeployment('string')
Activate the model for this deployment
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
deploymentId
string
Required

ID of the deployment

Responses
204

No Content

400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
POST
/api/v1/ml/deployments/{deploymentId}/actions/activate-models
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


await qlik.ml.activateModelsMlDeployment('string')
Deactivate the model for this deployment
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
deploymentId
string
Required

ID of the deployment

Responses
204

No Content

400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
POST
/api/v1/ml/deployments/{deploymentId}/actions/deactivate-models
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


await qlik.ml.deactivateModelsMlDeployment(
  'string',
)
List aliases

Retrieves a list of aliases based on filter parameters for a deployment.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
filter
string

Alias fields by which you can filter responses

name string - Aliases with exact name
modelId UUID string - By model ID
mode enum string - Mode by which alias is set to
sort
string

Field(s) by which to sort response

Can be one of: "name""+name""-name"

limit
integer

Number of results per page. Default is 32.

maximum = 100, default = 32, default = 32

offset
integer

Number of rows to skip before getting page[size]

Path Parameters
deploymentId
string
Required

ID of the deployment

Responses
200

OK

application/json
object
Show application/json properties
400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
GET
/api/v1/ml/deployments/{deploymentId}/aliases
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


await qlik.ml.getMlDeploymentAliases('string', {})
Example Response
{
  "data": [
    {
      "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "type": "alias",
      "attributes": {
        "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
        "mode": "default",
        "name": "string",
        "models": [
          {
            "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4"
          }
        ],
        "createdAt": "string",
        "createdBy": "string",
        "updatedAt": "string",
        "deploymentId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4"
      }
    }
  ],
  "meta": {
    "count": 42
  },
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
  }
}
Create an alias

Creates an alias for a deployment.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
deploymentId
string
Required

ID of the deployment

Request Body
application/json
object

Input for creating a new alias

Show application/json properties
Responses
201

Created

application/json
object
Show application/json properties
400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
POST
/api/v1/ml/deployments/{deploymentId}/aliases
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


await qlik.ml.createMlDeploymentAliase('string', {
  data: {
    attributes: {
      models: [
        {
          id: 'c35f4b70-3ce4-4a30-b62b-2aef16943bc4',
        },
      ],
      name: 'string',
    },
    type: 'alias',
  },
})
Example Response
{
  "data": {
    "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
    "type": "alias",
    "attributes": {
      "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "mode": "default",
      "name": "string",
      "models": [
        {
          "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4"
        }
      ],
      "createdAt": "string",
      "createdBy": "string",
      "updatedAt": "string",
      "deploymentId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4"
    }
  }
}
Get an alias

Retrieves an alias that exists on the deployment.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
deploymentId
string
Required

ID of the deployment

aliasId
string
Required

ID of the alias

Responses
200

OK

application/json
object
Show application/json properties
400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
GET
/api/v1/ml/deployments/{deploymentId}/aliases/{aliasId}
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


await qlik.ml.getMlDeploymentAliase(
  'string',
  'string',
)
Example Response
{
  "data": {
    "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
    "type": "alias",
    "attributes": {
      "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "mode": "default",
      "name": "string",
      "models": [
        {
          "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4"
        }
      ],
      "createdAt": "string",
      "createdBy": "string",
      "updatedAt": "string",
      "deploymentId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4"
    }
  }
}
Update an alias

Updates an alias for a deployment.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
deploymentId
string
Required

ID of the deployment

aliasId
string
Required

ID of the alias

Request Body
application/json
array of objects

Alias values that can be patched.

Show application/json properties
Responses
204

No Content

400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
PATCH
/api/v1/ml/deployments/{deploymentId}/aliases/{aliasId}
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


await qlik.ml.patchMlDeploymentAliase(
  'string',
  'string',
  [
    {
      op: 'replace',
      path: '/name',
      value: 'New Name',
    },


    {
      op: 'replace',
      path: '/models',
      value: 'modelId',
    },
  ],
)
Delete an alias

Delete an alias from a deployment.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
deploymentId
string
Required

ID of the deployment

aliasId
string
Required

ID of the alias

Responses
204

No Content

400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
DELETE
/api/v1/ml/deployments/{deploymentId}/aliases/{aliasId}
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


await qlik.ml.deleteMlDeploymentAliase(
  'string',
  'string',
)
Generate predictions in a synchronous request/response
Facts
	Rate limit	Tier 2 (100 requests per minute)
Query Parameters
includeNotPredictedReason
boolean

If true, reason why a prediction was not produced included response

includeShap
boolean

If true, shap values included in response

includeSource
boolean

If true, source data included in response

index
string

The name of the feature in the source data to use as an index in the response data. The column will be included with its original name and values. This is intended to allow the caller to join results with source data.

Path Parameters
deploymentId
string
Required

ID of the deployment

aliasName
string
Required

The name of the ML Deployment Alias that will be used to determine which model should be used to produce predictions

Request Body

Request payload containing the dataset for predictions. Date features must be in ISO 8601 format.

application/json
object

Input values for creating realtime predictions

Show application/json properties
Responses
200

Stream of combined prediction output returned successfully.

application/json
object

Input values for creating realtime predictions

Show application/json properties
400

Bad Request

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
409

Conflict

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
POST
/api/v1/ml/deployments/{deploymentId}/aliases/{aliasName}/realtime-predictions/actions/run
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


await qlik.ml.runMlDeploymentAliaseRealtimePredictions(
  'string',
  'string',
  {},
  {
    rows: [['string']],
    schema: [{ name: 'string' }],
  },
)
Example Response
{
  "data": {
    "type": "realtime-prediction",
    "attributes": {
      "rows": [
        [
          "string"
        ]
      ],
      "schema": [
        {
          "name": "string"
        }
      ]
    }
  }
}
List batch prediction configurations
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
filter
string

Batch prediction fields by which you can filter responses.



aliasId UUID string - ID of an alias within the batch prediction
createdBy ID string
deploymentId UUID string - ID of a deployment of a model associated with the experiment
experimentId UUID string - ID of experiment in which model(s) exist
experimentVersionId UUID string - ID of experiment version in which model(s) exist
modelId UUID string - By model ID
ownerId ID string of batch prediction owner
sort
string

Field(s) by which to sort response

Can be one of: "createdAt""+createdAt""-createdAt""description""+description""-description""name""+name""-name""updatedAt""+updatedAt""-updatedAt"

limit
integer

Number of results per page. Default is 32.

maximum = 100, default = 32, default = 32

offset
integer

Number of rows to skip before getting page[size]

Path Parameters
deploymentId
string
Required

ID of the deployment

Responses
200

OK

application/json
object
Show application/json properties
400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
GET
/api/v1/ml/deployments/{deploymentId}/batch-predictions
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


await qlik.ml.getMlDeploymentBatchPredictions(
  'string',
  {},
)
Example Response
{
  "data": [
    {
      "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "type": "batch-prediction",
      "attributes": {
        "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
        "name": "string",
        "errors": "[{\"code\":\"AML-145\",\"title\":\"datasync dependent service error, service profile\",\"errorId\":\"c1546687-ad5d-4002-87f6-8c9711298db1\",\"meta\":{\"errorId\":\"c1546687-ad5d-4002-87f6-8c9711298db1\"}}]\n",
        "status": "modified",
        "aliasId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
        "ownerId": "string",
        "schedule": {
          "status": "pending",
          "timezone": "America/Toronto",
          "recurrence": [
            [
              "Daily at 11:10:00 AM [\"RRULE:FREQ=DAILY;BYHOUR=11;BYMINUTE=10;BYSECOND=0\"]",
              "Weekly on Mondays at 11:10:00 AM [\"RRULE:FREQ=WEEKLY;INTERVAL:1;BYDAY=MO;BYHOUR=11;BYMINUTE=10;BYSECOND=0\"]"
            ]
          ],
          "endDateTime": "string",
          "chronosJobId": "string",
          "startDateTime": "string",
          "failureAttempts": 42,
          "applyDatasetChangeOnly": true,
          "lastSuccessfulDateTime": "string"
        },
        "createdAt": "string",
        "createdBy": "string",
        "dataSetId": "672e55cfcadfb8a18281523e",
        "datasetId": "string",
        "updatedAt": "string",
        "writeback": {
          "format": "parquet",
          "dstName": "string",
          "spaceId": "string",
          "dstShapName": "string",
          "dstSourceName": "string",
          "dstCoordShapName": "string",
          "dstNotPredictedName": "string"
        },
        "indexColumn": "string",
        "deploymentId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
        "errorMessage": "string",
        "outputDataset": "string"
      }
    }
  ],
  "meta": {
    "count": 42
  },
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
  }
}
Create a prediction configuration
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
deploymentId
string
Required

ID of the deployment

Request Body
application/json
object

Input values for creating a batch prediction configuration

Show application/json properties
Responses
201

Created

application/json
object
Show application/json properties
400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
POST
/api/v1/ml/deployments/{deploymentId}/batch-predictions
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


await qlik.ml.createMlDeploymentBatchPrediction(
  'string',
  {
    data: {
      attributes: {
        aliasId:
          'c35f4b70-3ce4-4a30-b62b-2aef16943bc4',
        dataSetId: '672e55cfcadfb8a18281523e',
        deploymentId:
          'c35f4b70-3ce4-4a30-b62b-2aef16943bc4',
        description: 'string',
        indexColumn: 'string',
        name: 'string',
        schedule: {
          applyDatasetChangeOnly: true,
          endDateTime: '2035-12-31T23:59:00',
          recurrence: [
            'RRULE:FREQ=DAILY;INTERVAL=1;BYHOUR=16;BYMINUTE=30;BYSECOND=0',
          ],
          startDateTime: '2035-12-25T00:00:00',
          timezone: 'America/Toronto',
        },
        writeback: {
          dstCoordShapName: 'string',
          dstName: 'string',
          dstNotPredictedName: 'string',
          dstShapName: 'string',
          dstSourceName: 'string',
          format: 'parquet',
          spaceId: 'string',
        },
      },
      type: 'batch-prediction',
    },
  },
)
Example Response
{
  "data": {
    "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
    "type": "batch-prediction",
    "attributes": {
      "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "name": "string",
      "errors": "[{\"code\":\"AML-145\",\"title\":\"datasync dependent service error, service profile\",\"errorId\":\"c1546687-ad5d-4002-87f6-8c9711298db1\",\"meta\":{\"errorId\":\"c1546687-ad5d-4002-87f6-8c9711298db1\"}}]\n",
      "status": "modified",
      "aliasId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "ownerId": "string",
      "schedule": {
        "status": "pending",
        "timezone": "America/Toronto",
        "recurrence": [
          [
            "Daily at 11:10:00 AM [\"RRULE:FREQ=DAILY;BYHOUR=11;BYMINUTE=10;BYSECOND=0\"]",
            "Weekly on Mondays at 11:10:00 AM [\"RRULE:FREQ=WEEKLY;INTERVAL:1;BYDAY=MO;BYHOUR=11;BYMINUTE=10;BYSECOND=0\"]"
          ]
        ],
        "endDateTime": "string",
        "chronosJobId": "string",
        "startDateTime": "string",
        "failureAttempts": 42,
        "applyDatasetChangeOnly": true,
        "lastSuccessfulDateTime": "string"
      },
      "createdAt": "string",
      "createdBy": "string",
      "dataSetId": "672e55cfcadfb8a18281523e",
      "datasetId": "string",
      "updatedAt": "string",
      "writeback": {
        "format": "parquet",
        "dstName": "string",
        "spaceId": "string",
        "dstShapName": "string",
        "dstSourceName": "string",
        "dstCoordShapName": "string",
        "dstNotPredictedName": "string"
      },
      "indexColumn": "string",
      "deploymentId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "errorMessage": "string",
      "outputDataset": "string"
    }
  }
}
Retrieve a batch prediction
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
deploymentId
string
Required

ID of the deployment

batchPredictionId
string
Required

ID of the batch prediction

Responses
200

OK

application/json
object
Show application/json properties
400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
GET
/api/v1/ml/deployments/{deploymentId}/batch-predictions/{batchPredictionId}
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


await qlik.ml.getMlDeploymentBatchPrediction(
  'string',
  'string',
)
Example Response
{
  "data": {
    "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
    "type": "batch-prediction",
    "attributes": {
      "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "name": "string",
      "errors": "[{\"code\":\"AML-145\",\"title\":\"datasync dependent service error, service profile\",\"errorId\":\"c1546687-ad5d-4002-87f6-8c9711298db1\",\"meta\":{\"errorId\":\"c1546687-ad5d-4002-87f6-8c9711298db1\"}}]\n",
      "status": "modified",
      "aliasId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "ownerId": "string",
      "schedule": {
        "status": "pending",
        "timezone": "America/Toronto",
        "recurrence": [
          [
            "Daily at 11:10:00 AM [\"RRULE:FREQ=DAILY;BYHOUR=11;BYMINUTE=10;BYSECOND=0\"]",
            "Weekly on Mondays at 11:10:00 AM [\"RRULE:FREQ=WEEKLY;INTERVAL:1;BYDAY=MO;BYHOUR=11;BYMINUTE=10;BYSECOND=0\"]"
          ]
        ],
        "endDateTime": "string",
        "chronosJobId": "string",
        "startDateTime": "string",
        "failureAttempts": 42,
        "applyDatasetChangeOnly": true,
        "lastSuccessfulDateTime": "string"
      },
      "createdAt": "string",
      "createdBy": "string",
      "dataSetId": "672e55cfcadfb8a18281523e",
      "datasetId": "string",
      "updatedAt": "string",
      "writeback": {
        "format": "parquet",
        "dstName": "string",
        "spaceId": "string",
        "dstShapName": "string",
        "dstSourceName": "string",
        "dstCoordShapName": "string",
        "dstNotPredictedName": "string"
      },
      "indexColumn": "string",
      "deploymentId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "errorMessage": "string",
      "outputDataset": "string"
    }
  }
}
Updates a batch prediction
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
deploymentId
string
Required

ID of the deployment

batchPredictionId
string
Required

ID of the batch prediction

Request Body
application/json
array of objects

Values that can be patched.

name: Name of this entity
description: Description of this entity
dataSetId
outputDataset
indexColumn: Column name upon which to create an index (empty string or undefined will default to automl-generated index)
applyDatasetChangeOnly
ownerId: ID of batch owner/user
writeback: Where to write prediction results
Show application/json properties
Responses
204

No Content

400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
PATCH
/api/v1/ml/deployments/{deploymentId}/batch-predictions/{batchPredictionId}
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


await qlik.ml.patchMlDeploymentBatchPrediction(
  'string',
  'string',
  [
    {
      op: 'replace',
      path: '/name',
      value: 'New Name',
    },
  ],
)
Delete a batch prediction
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
deploymentId
string
Required

ID of the deployment

batchPredictionId
string
Required

ID of the batch prediction

Responses
204

No Content

400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
DELETE
/api/v1/ml/deployments/{deploymentId}/batch-predictions/{batchPredictionId}
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


await qlik.ml.deleteMlDeploymentBatchPrediction(
  'string',
  'string',
)
Run a batch prediction
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
deploymentId
string
Required

ID of the deployment

batchPredictionId
string
Required

ID of the batch prediction

Responses
202

Accepted

application/json
object

Response for batch prediction predict action that indicates job and status

Show application/json properties
400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
POST
/api/v1/ml/deployments/{deploymentId}/batch-predictions/{batchPredictionId}/actions/predict
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


await qlik.ml.predictMlDeploymentBatchPrediction(
  'string',
  'string',
)
Example Response
{
  "data": {
    "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
    "type": "job",
    "attributes": {
      "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "name": "string",
      "corrId": "string",
      "status": "pending",
      "details": {
        "isScheduled": true,
        "outputFiles": [
          {
            "key": "string",
            "path": "string",
            "spaceId": "string",
            "fileName": "string",
            "fileType": "qvd, parquet, csv"
          }
        ],
        "lineageSchemaUpdated": true
      },
      "jobType": "prediction",
      "modelId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "success": true,
      "trigger": "string",
      "corrType": "batch-prediction",
      "tenantId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "createdAt": "string",
      "createdBy": "string",
      "deletedAt": "string",
      "updatedAt": "string",
      "parentName": "string",
      "parentJobId": "string",
      "deploymentId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "rowsPredicted": 42,
      "experimentVersionNumber": "string"
    }
  }
}
Get a batch prediction schedule

Retrieves the schedule for a batch prediction.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
deploymentId
string
Required

ID of the deployment

batchPredictionId
string
Required

ID of the batch prediction

Responses
200

OK

application/json
object
Show application/json properties
400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
GET
/api/v1/ml/deployments/{deploymentId}/batch-predictions/{batchPredictionId}/schedule
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


await qlik.ml.getMlDeploymentBatchPredictionSchedule(
  'string',
  'string',
)
Example Response
{
  "data": {
    "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
    "type": "batch-prediction-schedule",
    "attributes": {
      "status": "pending",
      "timezone": "America/Toronto",
      "recurrence": [
        [
          "Daily at 11:10:00 AM [\"RRULE:FREQ=DAILY;BYHOUR=11;BYMINUTE=10;BYSECOND=0\"]",
          "Weekly on Mondays at 11:10:00 AM [\"RRULE:FREQ=WEEKLY;INTERVAL:1;BYDAY=MO;BYHOUR=11;BYMINUTE=10;BYSECOND=0\"]"
        ]
      ],
      "endDateTime": "string",
      "chronosJobId": "string",
      "startDateTime": "string",
      "failureAttempts": 42,
      "applyDatasetChangeOnly": true,
      "lastSuccessfulDateTime": "string"
    }
  }
}
Update a batch prediction schedule

Updates the schedule for a batch prediction.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
deploymentId
string
Required

ID of the deployment

batchPredictionId
string
Required

ID of the batch prediction

Request Body
application/json
array of objects

Values that can be patched.

startDateTime: When the batch starts, if scheduled
endDateTime: When batch ends, if scheduled
timezone: Timezone used for scheduling
recurrence: Array of strings to indicate when this batch recurs
applyDatasetChangeOnly: Only run prediction if dataset has changed?
Show application/json properties
Responses
204

No Content

400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
PATCH
/api/v1/ml/deployments/{deploymentId}/batch-predictions/{batchPredictionId}/schedule
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


await qlik.ml.updateMlDeploymentBatchPredictionSchedule(
  'string',
  'string',
  [
    {
      op: 'replace',
      path: '/startDateTime',
      value: '2022-09-14T12:00:00',
    },
  ],
)
Add a batch prediction schedule

Adds a schedule to a batch prediction.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
deploymentId
string
Required

ID of the deployment

batchPredictionId
string
Required

ID of the batch prediction

Request Body
application/json
object

Input values for a batch prediction schedule

Show application/json properties
Responses
201

Created

application/json
object
Show application/json properties
400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
PUT
/api/v1/ml/deployments/{deploymentId}/batch-predictions/{batchPredictionId}/schedule
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


await qlik.ml.setMlDeploymentBatchPredictionSchedule(
  'string',
  'string',
  {
    data: {
      attributes: {
        applyDatasetChangeOnly: true,
        endDateTime: '2035-12-31T23:59:00',
        recurrence: [
          'RRULE:FREQ=DAILY;INTERVAL=1;BYHOUR=16;BYMINUTE=30;BYSECOND=0',
        ],
        startDateTime: '2035-12-25T00:00:00',
        timezone: 'America/Toronto',
      },
      type: 'batch-prediction-schedule',
    },
  },
)
Example Response
{
  "data": {
    "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
    "type": "batch-prediction-schedule",
    "attributes": {
      "status": "pending",
      "timezone": "America/Toronto",
      "recurrence": [
        [
          "Daily at 11:10:00 AM [\"RRULE:FREQ=DAILY;BYHOUR=11;BYMINUTE=10;BYSECOND=0\"]",
          "Weekly on Mondays at 11:10:00 AM [\"RRULE:FREQ=WEEKLY;INTERVAL:1;BYDAY=MO;BYHOUR=11;BYMINUTE=10;BYSECOND=0\"]"
        ]
      ],
      "endDateTime": "string",
      "chronosJobId": "string",
      "startDateTime": "string",
      "failureAttempts": 42,
      "applyDatasetChangeOnly": true,
      "lastSuccessfulDateTime": "string"
    }
  }
}
Delete a batch prediction schedule

Deletes the schedule from a batch prediction.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
deploymentId
string
Required

ID of the deployment

batchPredictionId
string
Required

ID of the batch prediction

Responses
204

No Content

400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
DELETE
/api/v1/ml/deployments/{deploymentId}/batch-predictions/{batchPredictionId}/schedule
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


await qlik.ml.deleteMlDeploymentBatchPredictionSchedule(
  'string',
  'string',
)
Add deployed models for this deployment
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
deploymentId
string
Required

ID of the deployment

Request Body
application/json
object

Input values for adding deployed models to a deployment

Show application/json properties
Responses
204

No Content

400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
POST
/api/v1/ml/deployments/{deploymentId}/models/actions/add
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


await qlik.ml.addMlDeploymentModels('string', {
  data: {
    attributes: {
      deployedModelIds: [
        'c35f4b70-3ce4-4a30-b62b-2aef16943bc4',
      ],
    },
    type: 'deployed-models',
  },
})
Remove deployed models from this deployment
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
deploymentId
string
Required

ID of the deployment

Request Body
application/json
object

Input values for adding deployed models to a deployment

Show application/json properties
Responses
204

No Content

400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
POST
/api/v1/ml/deployments/{deploymentId}/models/actions/remove
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


await qlik.ml.removeMlDeploymentModels('string', {
  data: {
    attributes: {
      deployedModelIds: [
        'c35f4b70-3ce4-4a30-b62b-2aef16943bc4',
      ],
    },
    type: 'deployed-models',
  },
})
Generate predictions in a synchronous request/response
Facts
	Rate limit	Tier 2 (100 requests per minute)
Query Parameters
includeNotPredictedReason
boolean

If true, reason why a prediction was not produced included response

includeShap
boolean

If true, shapley values included in response

includeSource
boolean

If true, source data included in response

index
string

The name of the feature in the source data to use as an index in the response data. The column will be included with its original name and values. This is intended to allow the caller to join results with source data.

Path Parameters
deploymentId
string
Required

ID of the deployment

Request Body
application/json
object

Input values for creating realtime predictions

Show application/json properties
Responses
200

Stream of combined prediction output returned successfully.

application/json
object

Input values for creating realtime predictions

Show application/json properties
400

Bad Request

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
409

Conflict

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
POST
/api/v1/ml/deployments/{deploymentId}/realtime-predictions/actions/run
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


await qlik.ml.runMlDeploymentRealtimePredictions(
  'string',
  {},
  {
    rows: [['string']],
    schema: [{ name: 'string' }],
  },
)
Example Response
{
  "data": {
    "type": "realtime-prediction",
    "attributes": {
      "rows": [
        [
          "string"
        ]
      ],
      "schema": [
        {
          "name": "string"
        }
      ]
    }
  }
}
List experiments

Retrieves a list of experiments based on provided filter and sort parameters.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
filter
string

Experiment fields by which you can filter responses within this tenant

ownerId ID string - ID of the owner/user that created the experiment
spaceId ID string (or empty string for personal space) - ID of the space where the experiment is saved.
experimentVersionId UUID string - ID of an experiment version in the experiment
modelId UUID string - ID of a model associated with the experiment
deploymentId UUID string - ID of a deployment of a model associated with the experiment
sort
string

Field(s) by which to sort response

Can be one of: "createdAt""+createdAt""-createdAt""description""+description""-description""name""+name""-name""updatedAt""+updatedAt""-updatedAt"

limit
integer

Number of results per page. Default is 32.

maximum = 100, default = 32, default = 32

offset
integer

Number of rows to skip before getting page[size]

Responses
200

OK

application/json
object
Show application/json properties
400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
GET
/api/v1/ml/experiments
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


await qlik.ml.getMlExperiments({})
Example Response
{
  "data": [
    {
      "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "type": "experiment",
      "attributes": {
        "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
        "name": "string",
        "ownerId": "string",
        "spaceId": "string",
        "tenantId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
        "createdAt": "string",
        "updatedAt": "string",
        "description": "string"
      }
    }
  ],
  "meta": {
    "count": 42
  },
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
  }
}
Create an experiment
Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
application/json
object

Input for creating this entity

Show application/json properties
Responses
201

Created

application/json
object
Show application/json properties
400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
POST
/api/v1/ml/experiments
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


await qlik.ml.createMlExperiment({
  data: {
    attributes: {
      description: 'string',
      name: 'string',
      spaceId: 'string',
    },
    type: 'experiment',
  },
})
Example Response
{
  "data": {
    "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
    "type": "experiment",
    "attributes": {
      "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "name": "string",
      "ownerId": "string",
      "spaceId": "string",
      "tenantId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "createdAt": "string",
      "updatedAt": "string",
      "description": "string"
    }
  }
}
Get an experiment
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
experimentId
string
Required

ID of the experiment

Responses
200

OK

application/json
object
Show application/json properties
400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
GET
/api/v1/ml/experiments/{experimentId}
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


await qlik.ml.getMlExperiment('string')
Example Response
{
  "data": {
    "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
    "type": "experiment",
    "attributes": {
      "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "name": "string",
      "ownerId": "string",
      "spaceId": "string",
      "tenantId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "createdAt": "string",
      "updatedAt": "string",
      "description": "string"
    }
  }
}
Update an experiment
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
experimentId
string
Required

ID of the experiment

Request Body
application/json
array of objects

Experiment fields that can be patched. The following paths all require value to be a string: /name, /spaceId, and /description

Show application/json properties
Responses
204

No Content

400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
PATCH
/api/v1/ml/experiments/{experimentId}
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


await qlik.ml.patchMlExperiment('string', [
  {
    op: 'replace',
    path: '/name',
    value: 'New name',
  },


  {
    op: 'replace',
    path: '/description',
    value: 'New description',
  },


  {
    op: 'replace',
    path: '/spaceId',
    value: 'NEW_SPACE_ID',
  },
])
Delete an experiment
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
experimentId
string
Required

ID of the experiment

Responses
204

No Content

400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
DELETE
/api/v1/ml/experiments/{experimentId}
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


await qlik.ml.deleteMlExperiment('string')
Request model recommendations for an experiment.

Returns model recommendations for a specified experiment, including the best-performing, fastest, and most accurate models based on evaluation metrics.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
experimentId
string
Required

ID of the experiment

Request Body
application/json
object

Criteria to determine which pool of models to provide recommendations from

Show application/json properties
Responses
200

OK

application/json
object
Show application/json properties
400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
POST
/api/v1/ml/experiments/{experimentId}/actions/recommend-models
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


await qlik.ml.recommendModelsMlExperiment(
  'string',
  {
    algorithms: ['catboost_classifier'],
    deployed: true,
    fullSampling: true,
    versionNumbers: [1],
  },
)
Example Response
{
  "data": {
    "type": "model-recommendation",
    "attributes": {
      "bestModel": {
        "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
        "name": "string",
        "errors": "[{\"code\":\"AML-145\",\"title\":\"datasync dependent service error, service profile\",\"errorId\":\"c1546687-ad5d-4002-87f6-8c9711298db1\",\"meta\":{\"errorId\":\"c1546687-ad5d-4002-87f6-8c9711298db1\"}}]\n",
        "hpoNum": 42,
        "seqNum": 42,
        "status": "pending",
        "columns": [
          "string"
        ],
        "metrics": {
          "predictionSpeed": 42
        },
        "batchNum": 42,
        "algoAbbrv": "CATBC",
        "algorithm": "string",
        "createdAt": "string",
        "updatedAt": "string",
        "modelState": "pending",
        "description": "string",
        "anomalyRatio": 42,
        "errorMessage": "string",
        "samplingRatio": 42,
        "binningFeatures": [
          "string"
        ],
        "droppedFeatures": [
          {
            "name": "string",
            "reason": "highly_correlated"
          }
        ],
        "experimentVersionId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
        "powerTransformFeatures": [
          "string"
        ],
        "binaryImbalanceSampling": {
          "sampleClass": "string",
          "sampleRatio": 42,
          "sampleDirection": "up"
        }
      },
      "fastestModel": {
        "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
        "name": "string",
        "errors": "[{\"code\":\"AML-145\",\"title\":\"datasync dependent service error, service profile\",\"errorId\":\"c1546687-ad5d-4002-87f6-8c9711298db1\",\"meta\":{\"errorId\":\"c1546687-ad5d-4002-87f6-8c9711298db1\"}}]\n",
        "hpoNum": 42,
        "seqNum": 42,
        "status": "pending",
        "columns": [
          "string"
        ],
        "metrics": {
          "predictionSpeed": 42
        },
        "batchNum": 42,
        "algoAbbrv": "CATBC",
        "algorithm": "string",
        "createdAt": "string",
        "updatedAt": "string",
        "modelState": "pending",
        "description": "string",
        "anomalyRatio": 42,
        "errorMessage": "string",
        "samplingRatio": 42,
        "binningFeatures": [
          "string"
        ],
        "droppedFeatures": [
          {
            "name": "string",
            "reason": "highly_correlated"
          }
        ],
        "experimentVersionId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
        "powerTransformFeatures": [
          "string"
        ],
        "binaryImbalanceSampling": {
          "sampleClass": "string",
          "sampleRatio": 42,
          "sampleDirection": "up"
        }
      },
      "mostAccurateModel": {
        "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
        "name": "string",
        "errors": "[{\"code\":\"AML-145\",\"title\":\"datasync dependent service error, service profile\",\"errorId\":\"c1546687-ad5d-4002-87f6-8c9711298db1\",\"meta\":{\"errorId\":\"c1546687-ad5d-4002-87f6-8c9711298db1\"}}]\n",
        "hpoNum": 42,
        "seqNum": 42,
        "status": "pending",
        "columns": [
          "string"
        ],
        "metrics": {
          "predictionSpeed": 42
        },
        "batchNum": 42,
        "algoAbbrv": "CATBC",
        "algorithm": "string",
        "createdAt": "string",
        "updatedAt": "string",
        "modelState": "pending",
        "description": "string",
        "anomalyRatio": 42,
        "errorMessage": "string",
        "samplingRatio": 42,
        "binningFeatures": [
          "string"
        ],
        "droppedFeatures": [
          {
            "name": "string",
            "reason": "highly_correlated"
          }
        ],
        "experimentVersionId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
        "powerTransformFeatures": [
          "string"
        ],
        "binaryImbalanceSampling": {
          "sampleClass": "string",
          "sampleRatio": 42,
          "sampleDirection": "up"
        }
      }
    }
  }
}
List models
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
filter
string

Model fields you can filter by:



experimentVersionId UUID string - Find by experiment version ID

batchNum UUID string - Search by batch number

isHpo boolean - Is hyperparameter optimization used?

isMetrics boolean - Are metrics for regression, binary, or multiclass are used?

id UUID string - Find by model ID

algorithm enum string - Find by algorithm



Valid algorithms: catboost_classifier, catboost_regression, elasticnet_regression, gaussian_nb, kneighbors_classifier, lasso_regression, lasso, lgbm_classifier, lgbm_regression, linear_regression, logistic_regression, random_forest_classifier, random_forest_regression, sgd_regression, xgb_classifier, xgb_regression



status enum string - find by status



Valid statuses: pending, training_requested, training_done, ready, error



hasDeployment boolean - Models that are part of a deployment

nameContains string - Models with name includes this case-insensitive string

exactName string - Models with exact name. Model names may not be unique

samplingRatio number - Find models by sampling ratio

modelState enum string - State by which to find models



Valid states: pending, enabled, disabled, inactive
sort
string

Field(s) by which to sort response

Can be one of: "createdAt""+createdAt""-createdAt""description""+description""-description""name""+name""-name""updatedAt""+updatedAt""-updatedAt"

limit
integer

Number of results per page. Default is 32.

maximum = 100, default = 32, default = 32

offset
integer

Number of rows to skip before getting page[size]

Path Parameters
experimentId
string
Required

ID of the experiment

Responses
200

OK

application/json
object
Show application/json properties
400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
GET
/api/v1/ml/experiments/{experimentId}/models
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


await qlik.ml.getMlExperimentModels('string', {})
Example Response
{
  "data": [
    {
      "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "type": "model",
      "attributes": {
        "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
        "name": "string",
        "errors": "[{\"code\":\"AML-145\",\"title\":\"datasync dependent service error, service profile\",\"errorId\":\"c1546687-ad5d-4002-87f6-8c9711298db1\",\"meta\":{\"errorId\":\"c1546687-ad5d-4002-87f6-8c9711298db1\"}}]\n",
        "hpoNum": 42,
        "seqNum": 42,
        "status": "pending",
        "columns": [
          "string"
        ],
        "metrics": {
          "binary": {
            "f1": 42,
            "auc": 42,
            "mcc": 42,
            "npv": 42,
            "f1Test": 42,
            "recall": 42,
            "aucTest": 42,
            "fallout": 42,
            "logLoss": 42,
            "mccTest": 42,
            "npvTest": 42,
            "accuracy": 42,
            "missRate": 42,
            "precision": 42,
            "threshold": 42,
            "recallTest": 42,
            "falloutTest": 42,
            "logLossTest": 42,
            "specificity": 42,
            "accuracyTest": 42,
            "missRateTest": 42,
            "trueNegative": 42,
            "truePositive": 42,
            "falseNegative": 42,
            "falsePositive": 42,
            "precisionTest": 42,
            "thresholdTest": 42,
            "specificityTest": 42,
            "trueNegativeTest": 42,
            "truePositiveTest": 42,
            "falseNegativeTest": 42,
            "falsePositiveTest": 42
          },
          "multiclass": {
            "f1Macro": 42,
            "f1Micro": 42,
            "accuracy": 42,
            "f1Weighted": 42,
            "f1MacroTest": 42,
            "f1MicroTest": 42,
            "accuracyTest": 42,
            "f1WeightedTest": 42,
            "confusionMatrix": "string",
            "confusionMatrixTest": "string"
          },
          "regression": {
            "r2": 42,
            "mae": 42,
            "mse": 42,
            "rmse": 42,
            "r2Test": 42,
            "maeTest": 42,
            "mseTest": 42,
            "rmseTest": 42
          },
          "timeseries": {
            "mae": 42,
            "mape": 42,
            "mase": 42,
            "rmse": 42,
            "mdape": 42,
            "smape": 42,
            "wmape": 42,
            "mnrmse": 42,
            "maeTest": 42,
            "mdnrmse": 42,
            "mapeTest": 42,
            "maseTest": 42,
            "rmseTest": 42,
            "mdapeTest": 42,
            "smapeTest": 42,
            "wmapeTest": 42,
            "mnrmseTest": 42,
            "mdnrmseTest": 42
          }
        },
        "batchNum": 42,
        "algoAbbrv": "CATBC",
        "algorithm": "string",
        "createdAt": "string",
        "updatedAt": "string",
        "modelState": "pending",
        "description": "string",
        "anomalyRatio": 42,
        "errorMessage": "string",
        "samplingRatio": 42,
        "binningFeatures": [
          "string"
        ],
        "droppedFeatures": [
          {
            "name": "string",
            "reason": "highly_correlated"
          }
        ],
        "experimentVersionId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
        "powerTransformFeatures": [
          "string"
        ],
        "binaryImbalanceSampling": {
          "sampleClass": "string",
          "sampleRatio": 42,
          "sampleDirection": "up"
        }
      }
    }
  ],
  "meta": {
    "count": 42
  },
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
  }
}
Get a model
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
experimentId
string
Required

ID of the experiment

modelId
string
Required

ID of the model

Responses
200

OK

application/json
object
Show application/json properties
400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
GET
/api/v1/ml/experiments/{experimentId}/models/{modelId}
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


await qlik.ml.getMlExperimentModel(
  'string',
  'string',
)
Example Response
{
  "data": {
    "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
    "type": "model",
    "attributes": {
      "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "name": "string",
      "errors": "[{\"code\":\"AML-145\",\"title\":\"datasync dependent service error, service profile\",\"errorId\":\"c1546687-ad5d-4002-87f6-8c9711298db1\",\"meta\":{\"errorId\":\"c1546687-ad5d-4002-87f6-8c9711298db1\"}}]\n",
      "hpoNum": 42,
      "seqNum": 42,
      "status": "pending",
      "columns": [
        "string"
      ],
      "metrics": {
        "binary": {
          "f1": 42,
          "auc": 42,
          "mcc": 42,
          "npv": 42,
          "f1Test": 42,
          "recall": 42,
          "aucTest": 42,
          "fallout": 42,
          "logLoss": 42,
          "mccTest": 42,
          "npvTest": 42,
          "accuracy": 42,
          "missRate": 42,
          "precision": 42,
          "threshold": 42,
          "recallTest": 42,
          "falloutTest": 42,
          "logLossTest": 42,
          "specificity": 42,
          "accuracyTest": 42,
          "missRateTest": 42,
          "trueNegative": 42,
          "truePositive": 42,
          "falseNegative": 42,
          "falsePositive": 42,
          "precisionTest": 42,
          "thresholdTest": 42,
          "specificityTest": 42,
          "trueNegativeTest": 42,
          "truePositiveTest": 42,
          "falseNegativeTest": 42,
          "falsePositiveTest": 42
        },
        "multiclass": {
          "f1Macro": 42,
          "f1Micro": 42,
          "accuracy": 42,
          "f1Weighted": 42,
          "f1MacroTest": 42,
          "f1MicroTest": 42,
          "accuracyTest": 42,
          "f1WeightedTest": 42,
          "confusionMatrix": "string",
          "confusionMatrixTest": "string"
        },
        "regression": {
          "r2": 42,
          "mae": 42,
          "mse": 42,
          "rmse": 42,
          "r2Test": 42,
          "maeTest": 42,
          "mseTest": 42,
          "rmseTest": 42
        },
        "timeseries": {
          "mae": 42,
          "mape": 42,
          "mase": 42,
          "rmse": 42,
          "mdape": 42,
          "smape": 42,
          "wmape": 42,
          "mnrmse": 42,
          "maeTest": 42,
          "mdnrmse": 42,
          "mapeTest": 42,
          "maseTest": 42,
          "rmseTest": 42,
          "mdapeTest": 42,
          "smapeTest": 42,
          "wmapeTest": 42,
          "mnrmseTest": 42,
          "mdnrmseTest": 42
        }
      },
      "batchNum": 42,
      "algoAbbrv": "CATBC",
      "algorithm": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "modelState": "pending",
      "description": "string",
      "anomalyRatio": 42,
      "errorMessage": "string",
      "samplingRatio": 42,
      "binningFeatures": [
        "string"
      ],
      "droppedFeatures": [
        {
          "name": "string",
          "reason": "highly_correlated"
        }
      ],
      "experimentVersionId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "powerTransformFeatures": [
        "string"
      ],
      "binaryImbalanceSampling": {
        "sampleClass": "string",
        "sampleRatio": 42,
        "sampleDirection": "up"
      }
    }
  }
}
List experiment versions
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
filter
string

Experiment version filter options

isRunning boolean - Is the experiment version running (training models)?
isSettled boolean - Is the experiment version settled?
status enum string - Status to filter by. Omit to get models of any status.
Valid statuses: pending, ready, error, cancelled
modelId UUID string - ID of a model associated with the experiment
sort
string

Field(s) by which to sort response

Can be one of: "createdAt""+createdAt""-createdAt""description""+description""-description""experimentMode""+experimentMode""-experimentMode""experimentType""+experimentType""-experimentType""name""+name""-name""status""+status""-status""updatedAt""+updatedAt""-updatedAt""versionNumber""+versionNumber""-versionNumber"

limit
integer

Number of results per page. Default is 32.

maximum = 100, default = 32, default = 32

offset
integer

Number of rows to skip before getting page[size]

Path Parameters
experimentId
string
Required

ID of the experiment

Responses
200

OK

application/json
object
Show application/json properties
400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
GET
/api/v1/ml/experiments/{experimentId}/versions
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


await qlik.ml.getMlExperimentVersions(
  'string',
  {},
)
Example Response
{
  "data": [
    {
      "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "type": "experiment-version",
      "attributes": {
        "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
        "name": "string",
        "errors": "[{\"code\":\"AML-145\",\"title\":\"datasync dependent service error, service profile\",\"errorId\":\"c1546687-ad5d-4002-87f6-8c9711298db1\",\"meta\":{\"errorId\":\"c1546687-ad5d-4002-87f6-8c9711298db1\"}}]\n",
        "status": "pending",
        "target": "TargetColumn",
        "pipeline": {
          "transforms": [
            {
              "column": {
                "name": "string",
                "changeType": "string"
              }
            }
          ]
        },
        "createdAt": "string",
        "dataSetId": "672e55cfcadfb8a18281523e",
        "profileId": "string",
        "updatedAt": "string",
        "algorithms": [
          "catboost_classifier"
        ],
        "topModelId": "string",
        "dateIndexes": [
          "string"
        ],
        "errorMessage": "string",
        "experimentId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
        "featuresList": [
          {
            "name": "ColumnA",
            "include": true,
            "dataType": "STRING",
            "changeType": null,
            "featureType": "categorical",
            "parentFeature": null
          }
        ],
        "lastBatchNum": 42,
        "datasetOrigin": "new",
        "versionNumber": 42,
        "experimentMode": "intelligent",
        "experimentType": "binary",
        "createdByUserId": "string",
        "trainingDuration": 900,
        "preprocessedInsights": [
          {
            "name": "string",
            "insights": [],
            "willBeDropped": true
          }
        ]
      }
    }
  ],
  "meta": {
    "count": 42
  },
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
  }
}
Create an experiment version

Creates an experiment version. Poll this version and check its status field to determine when models are finished training.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
experimentId
string
Required

ID of the experiment

Request Body
application/json
object

Input for creating a new experiment version. Defaults provided in the ProfileInsights response.

Show application/json properties
Responses
201

Accepted

application/json
object
Show application/json properties
400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
POST
/api/v1/ml/experiments/{experimentId}/versions
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


await qlik.ml.createMlExperimentVersion(
  'string',
  {
    data: {
      attributes: {
        algorithms: ['catboost_classifier'],
        dataSetId: '672e55cfcadfb8a18281523e',
        datasetOrigin: 'new',
        dateIndexes: ['string'],
        experimentMode: 'intelligent',
        experimentType: 'binary',
        featuresList: [
          {
            dataType: 'STRING',
            featureType: 'categorical',
            include: true,
            name: 'ColumnA',
          },
        ],
        name: 'Experiment version name. Defaults to current date.',
        pipeline: {
          transforms: [
            {
              column: {
                changeType: 'string',
                name: 'string',
              },
            },
          ],
        },
        target: 'TargetColumn',
        trainingDuration: 900,
      },
      type: 'experiment-version',
    },
  },
)
Example Response
{
  "data": {
    "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
    "type": "experiment-version",
    "attributes": {
      "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "name": "string",
      "errors": "[{\"code\":\"AML-145\",\"title\":\"datasync dependent service error, service profile\",\"errorId\":\"c1546687-ad5d-4002-87f6-8c9711298db1\",\"meta\":{\"errorId\":\"c1546687-ad5d-4002-87f6-8c9711298db1\"}}]\n",
      "status": "pending",
      "target": "TargetColumn",
      "pipeline": {
        "transforms": [
          {
            "column": {
              "name": "string",
              "changeType": "string"
            }
          }
        ]
      },
      "createdAt": "string",
      "dataSetId": "672e55cfcadfb8a18281523e",
      "profileId": "string",
      "updatedAt": "string",
      "algorithms": [
        "catboost_classifier"
      ],
      "topModelId": "string",
      "dateIndexes": [
        "string"
      ],
      "errorMessage": "string",
      "experimentId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "featuresList": [
        {
          "name": "ColumnA",
          "include": true,
          "dataType": "STRING",
          "changeType": null,
          "featureType": "categorical",
          "parentFeature": null
        }
      ],
      "lastBatchNum": 42,
      "datasetOrigin": "new",
      "versionNumber": 42,
      "experimentMode": "intelligent",
      "experimentType": "binary",
      "createdByUserId": "string",
      "trainingDuration": 900,
      "preprocessedInsights": [
        {
          "name": "string",
          "insights": [],
          "willBeDropped": true
        }
      ]
    }
  }
}
Get an experiment version
Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
experimentId
string
Required

ID of the experiment

experimentVersionId
string
Required

ID of the experiment version

Responses
200

OK

application/json
object
Show application/json properties
400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
GET
/api/v1/ml/experiments/{experimentId}/versions/{experimentVersionId}
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


await qlik.ml.getMlExperimentVersion(
  'string',
  'string',
)
Example Response
{
  "data": {
    "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
    "type": "experiment-version",
    "attributes": {
      "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "name": "string",
      "errors": "[{\"code\":\"AML-145\",\"title\":\"datasync dependent service error, service profile\",\"errorId\":\"c1546687-ad5d-4002-87f6-8c9711298db1\",\"meta\":{\"errorId\":\"c1546687-ad5d-4002-87f6-8c9711298db1\"}}]\n",
      "status": "pending",
      "target": "TargetColumn",
      "pipeline": {
        "transforms": [
          {
            "column": {
              "name": "string",
              "changeType": "string"
            }
          }
        ]
      },
      "createdAt": "string",
      "dataSetId": "672e55cfcadfb8a18281523e",
      "profileId": "string",
      "updatedAt": "string",
      "algorithms": [
        "catboost_classifier"
      ],
      "topModelId": "string",
      "dateIndexes": [
        "string"
      ],
      "errorMessage": "string",
      "experimentId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "featuresList": [
        {
          "name": "ColumnA",
          "include": true,
          "dataType": "STRING",
          "changeType": null,
          "featureType": "categorical",
          "parentFeature": null
        }
      ],
      "lastBatchNum": 42,
      "datasetOrigin": "new",
      "versionNumber": 42,
      "experimentMode": "intelligent",
      "experimentType": "binary",
      "createdByUserId": "string",
      "trainingDuration": 900,
      "preprocessedInsights": [
        {
          "name": "string",
          "insights": [],
          "willBeDropped": true
        }
      ]
    }
  }
}
Update an experiment version
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
experimentId
string
Required

ID of the experiment

experimentVersionId
string
Required

ID of the experiment version

Request Body
application/json
array of objects

Values that can be patched.

Show application/json properties
Responses
204

No Content

400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
PATCH
/api/v1/ml/experiments/{experimentId}/versions/{experimentVersionId}
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


await qlik.ml.patchMlExperimentVersion(
  'string',
  'string',
  [
    {
      op: 'replace',
      path: '/name',
      value: 'New name',
    },
  ],
)
Delete an experiment version
Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
experimentId
string
Required

ID of the experiment

experimentVersionId
string
Required

ID of the experiment version

Responses
204

No Content

400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
DELETE
/api/v1/ml/experiments/{experimentId}/versions/{experimentVersionId}
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


await qlik.ml.deleteMlExperimentVersion(
  'string',
  'string',
)
Cancel jobs

Cancels jobs for an experiment version or batch prediction.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
corrType
string
Required

The type of a resource paired with a corrId

Can be one of: "batch-prediction""experiment-version"

corrId
string
Required

The ID of a correlated resource of corrType

Responses
204

No Content

400

Bad Request

application/json
object
Show application/json properties
403

Forbidden

application/json
object
Show application/json properties
405

Method Not Allowed

application/json
object
Show application/json properties
500

Internal Error

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
POST
/api/v1/ml/jobs/{corrType}/{corrId}/actions/cancel
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


await qlik.ml.cancelMlJob(
  'batch-prediction',
  'string',
)
Start profile insights creation

Starts creating profile insights for an experiment dataset. This is an asynchronous operation. A 202 Accepted response indicates that the process has started successfully. Use the link in the response to check the status.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
application/json
object

Input to get dataset and feature metadata needed to create experiment versions

Show application/json properties
Responses
200

OK

application/json
object
Show application/json properties
202

Accepted

application/json
object
Show application/json properties
400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
POST
/api/v1/ml/profile-insights
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


await qlik.ml.createMlProfileInsight({
  data: {
    attributes: {
      dataSetId: '672e55cfcadfb8a18281523e',
      experimentType: 'binary',
      target: 'string',
    },
    type: 'profile-insights',
  },
})
Example Response
{
  "data": {
    "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
    "type": "profile-insights",
    "attributes": {
      "status": "pending",
      "ownerId": "string",
      "insights": [
        {
          "name": "string",
          "insights": [
            "constant"
          ],
          "willBeDropped": true,
          "cannotBeTarget": true,
          "experimentTypes": [
            "binary"
          ],
          "defaultFeatureType": "categorical",
          "engineeredFeatures": "[\n  `${featureName}.YEAR`,\n  `${featureName}.MONTH`\n]\n",
          "estimatedMaxForecastHorizon": 42
        }
      ],
      "tenantId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "algorithms": [
        "catboost_classifier"
      ],
      "isLargeCsv": true,
      "sizeInBytes": 42,
      "numberOfRows": 42,
      "dataSetProfile": {
        "meta": {
          "status": "FINISHED",
          "messages": [
            "string"
          ],
          "dataSetId": "672e55cfcadfb8a18281523e",
          "resultType": "NORMAL",
          "connectionId": "string",
          "lastLoadTime": "string",
          "maxSizeBytes": 42,
          "computationEndTime": "string",
          "computationStartTime": "string"
        },
        "samples": [
          {
            "name": "string",
            "records": [
              {
                "values": [
                  "string"
                ]
              }
            ],
            "fieldNames": [
              "string"
            ]
          }
        ],
        "profiles": [
          {
            "name": "string",
            "sizeInBytes": 42,
            "numberOfRows": 42,
            "fieldProfiles": [
              {
                "name": "string",
                "tags": [
                  "string"
                ],
                "index": 42,
                "median": 42,
                "average": 42,
                "dataType": "string",
                "kurtosis": 42,
                "skewness": 42,
                "fractiles": [
                  42
                ],
                "sampleValues": [
                  "string"
                ],
                "technicalName": "string",
                "classification": {
                  "pii": true,
                  "tags": [
                    {
                      "tag": "string",
                      "score": 42
                    }
                  ],
                  "sensitive": true,
                  "obfuscation": "string"
                },
                "nullValueCount": 42,
                "textValueCount": 42,
                "zeroValueCount": 42,
                "maxNumericValue": 42,
                "maxStringLength": 42,
                "minNumericValue": 42,
                "minStringLength": 42,
                "sumStringLength": 42,
                "emptyStringCount": 42,
                "sumNumericValues": 42,
                "numericValueCount": 42,
                "standardDeviation": 42,
                "distinctValueCount": 42,
                "mostFrequentValues": [
                  {
                    "value": "string",
                    "frequency": 42
                  }
                ],
                "negativeValueCount": 42,
                "positiveValueCount": 42,
                "averageStringLength": 42,
                "frequencyDistribution": [
                  {
                    "binEdge": 42,
                    "frequency": 42
                  }
                ],
                "lastSortedStringValue": "string",
                "firstSortedStringValue": "string",
                "sumSquaredNumericValues": 42
              }
            ]
          }
        ]
      },
      "experimentVersionId": "string",
      "defaultVersionConfig": {
        "name": "Experiment version name. Defaults to current date/time.",
        "dataSetId": "672e55cfcadfb8a18281523e",
        "featuresList": [
          {
            "name": "ColumnA",
            "include": true,
            "dataType": "STRING",
            "changeType": null,
            "featureType": "categorical",
            "parentFeature": null
          }
        ],
        "datasetOrigin": "new",
        "experimentMode": "intelligent"
      }
    }
  }
}
Get profile insights

Retrieves profile insights for the specified dataset. If you received a 202 Accepted response from POST /ml/profile-insights, poll this endpoint until a 200 OK response with ready status is returned.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
experimentVersionId
string

The optional experimentVersionId query parameter for profile-insights GET requests. When provided after a version has been trained, it gets the profile insights snapshot used in previous versions rather than new results.

target
string

The optional target feature for profile-insights GET requests after this is known.

experimentType
string

The optional experiment type for profile-insights GET requests after this is known.

Can be one of: "binary""multiclass""regression"

Path Parameters
dataSetId
string
Required

The Qlik catalog dataset ID

Responses
200

OK

application/json
object
Show application/json properties
400

Bad Request

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
500

Internal Error

application/json
object
Show application/json properties
502

Bad Gateway

application/json
object
Show application/json properties
503

Service Unavailable

application/json
object
Show application/json properties
default

Unexpected Error

application/json
object
Show application/json properties
GET
/api/v1/ml/profile-insights/{dataSetId}
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


await qlik.ml.getMlProfileInsight(
  '672e55cfcadfb8a18281523e',
)
Example Response
{
  "data": {
    "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
    "type": "profile-insights",
    "attributes": {
      "status": "pending",
      "ownerId": "string",
      "insights": [
        {
          "name": "string",
          "insights": [
            "constant"
          ],
          "willBeDropped": true,
          "cannotBeTarget": true,
          "experimentTypes": [
            "binary"
          ],
          "defaultFeatureType": "categorical",
          "engineeredFeatures": "[\n  `${featureName}.YEAR`,\n  `${featureName}.MONTH`\n]\n",
          "estimatedMaxForecastHorizon": 42
        }
      ],
      "tenantId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",
      "algorithms": [
        "catboost_classifier"
      ],
      "isLargeCsv": true,
      "sizeInBytes": 42,
      "numberOfRows": 42,
      "dataSetProfile": {
        "meta": {
          "status": "FINISHED",
          "messages": [
            "string"
          ],
          "dataSetId": "672e55cfcadfb8a18281523e",
          "resultType": "NORMAL",
          "connectionId": "string",
          "lastLoadTime": "string",
          "maxSizeBytes": 42,
          "computationEndTime": "string",
          "computationStartTime": "string"
        },
        "samples": [
          {
            "name": "string",
            "records": [
              {
                "values": [
                  "string"
                ]
              }
            ],
            "fieldNames": [
              "string"
            ]
          }
        ],
        "profiles": [
          {
            "name": "string",
            "sizeInBytes": 42,
            "numberOfRows": 42,
            "fieldProfiles": [
              {
                "name": "string",
                "tags": [
                  "string"
                ],
                "index": 42,
                "median": 42,
                "average": 42,
                "dataType": "string",
                "kurtosis": 42,
                "skewness": 42,
                "fractiles": [
                  42
                ],
                "sampleValues": [
                  "string"
                ],
                "technicalName": "string",
                "classification": {
                  "pii": true,
                  "tags": [
                    {
                      "tag": "string",
                      "score": 42
                    }
                  ],
                  "sensitive": true,
                  "obfuscation": "string"
                },
                "nullValueCount": 42,
                "textValueCount": 42,
                "zeroValueCount": 42,
                "maxNumericValue": 42,
                "maxStringLength": 42,
                "minNumericValue": 42,
                "minStringLength": 42,
                "sumStringLength": 42,
                "emptyStringCount": 42,
                "sumNumericValues": 42,
                "numericValueCount": 42,
                "standardDeviation": 42,
                "distinctValueCount": 42,
                "mostFrequentValues": [
                  {
                    "value": "string",
                    "frequency": 42
                  }
                ],
                "negativeValueCount": 42,
                "positiveValueCount": 42,
                "averageStringLength": 42,
                "frequencyDistribution": [
                  {
                    "binEdge": 42,
                    "frequency": 42
                  }
                ],
                "lastSortedStringValue": "string",
                "firstSortedStringValue": "string",
                "sumSquaredNumericValues": 42
              }
            ]
          }
        ]
      },
      "experimentVersionId": "string",
      "defaultVersionConfig": {
        "name": "Experiment version name. Defaults to current date/time.",
        "dataSetId": "672e55cfcadfb8a18281523e",
        "featuresList": [
          {
            "name": "ColumnA",
            "include": true,
            "dataType": "STRING",
            "changeType": null,
            "featureType": "categorical",
            "parentFeature": null
          }
        ],
        "datasetOrigin": "new",
        "experimentMode": "intelligent"
      }
    }
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