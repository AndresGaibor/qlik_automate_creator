---
title: "Data products REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/data-governance/data-products/"
local_path: "docs/endpoints/data-governance-data-products.md"
---

Title: Data products REST | Qlik Developer Portal


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
data-governance
Copy page
Data products
Download OpenAPI spec

Data products are packages that group related datasets within a single, curated offering. They enable organizations to organize and govern data by business domain, making it easier for business users to discover and consume trusted, well-documented datasets.

These products can represent subject areas, business functions, or data domains, and are created within spaces.

Overview

The Data products API allows you to automate the complete data product lifecycle:

Creation: Define and create new data products within spaces.
Management: Add datasets, configure product metadata, move products between spaces, and manage ownership.
Activation: Publish data products to make them discoverable and consumable by other services and users.
Governance: Track changes through changelogs, export documentation, and monitor product activation status.

For a step-by-step guide to using the Data products API, see the Create and activate a data product.

Workflows and key use cases

The API supports three phases of data product management:

Phase 1: Create an empty data product

Initialize a new data product as a container for datasets:

Create a data product:
POST /data-governance/data-products

This endpoint creates an empty data product in the specified space. The data product serves as a package to group and organize related datasets.

Note

An empty data product is created as a starting point. You must add datasets to it in the next phase.
Product details like name, description, and tags can be specified at creation time.

Phase 2: Manage datasets and data product metadata

Configure the data product and organize its contents:

Get a data product:
GET /data-governance/data-products/{dataProductId}

Retrieve full data product details, including associated datasets, metadata, and activation status.

Update a data product:
PATCH /data-governance/data-products/{dataProductId}

Modify data product metadata such as name, description, tags, and key contacts. Use this endpoint to add datasets to your data product.

Move a data product:
POST /data-governance/data-products/{dataProductId}/actions/move

Reorganize data products by moving them between spaces.

Phase 3: Activate and publish the data product

Make the data product available for consumption:

Activate a data product:
POST /data-governance/data-products/{dataProductId}/actions/activate

Publish the data product, making it discoverable and consumable by other services and users.

Deactivate a data product:
POST /data-governance/data-products/{dataProductId}/actions/deactivate

Remove a data product from being consumable, stopping it from appearing in marketplace searches.

Note

Activation is required for data product consumers to discover your data product. Users must have the “Consume data products” permission and at least a “Can view” role in the managed space containing the data product to see it listed. Using the data product requires additional permissions in the associated spaces.
For more details on permissions and roles, see Data products roles and permissions on Qlik Help.

Common patterns and best practices

Organizing by domain: Group related datasets by business domain (Sales, Finance, Operations) to make data discovery intuitive for business users.

Metadata completeness: Include detailed descriptions and documentation for all data products. Use changelogs to track governance updates and maintain data lineage transparency.

Lifecycle management: Test data products in development spaces before activating them in production. Use deactivation to archive outdated products rather than deleting them.

Access control: Assign key contacts to each product to clarify ownership and support responsibilities for business users.

Endpoints
POST
/api/data-governance/data-products
GET
/api/data-governance/data-products/{dataProductId}
PATCH
/api/data-governance/data-products/{dataProductId}
DELETE
/api/data-governance/data-products/{dataProductId}
POST
/api/data-governance/data-products/{dataProductId}/actions/activate
POST
/api/data-governance/data-products/{dataProductId}/actions/compute-datasets-data-quality
POST
/api/data-governance/data-products/{dataProductId}/actions/deactivate
GET
/api/data-governance/data-products/{dataProductId}/actions/export-documentation
POST
/api/data-governance/data-products/{dataProductId}/actions/move
GET
/api/data-governance/data-products/{dataProductId}/changelogs
POST
/api/data-governance/data-products/actions/generate-provider-url
Create a data product

Creates a new data product with specified metadata, datasets, and governance information. Use this endpoint to package related datasets into a governed, discoverable asset. Requires create permissions in the target space.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
Required
application/json
object

Request payload for creating a data product.

Show application/json properties
Responses
201

Data product created successfully.

application/json
object
Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
401

User does not have valid authentication credentials.

application/json
object
Show application/json properties
403

User does not have access to the resource.

application/json
object
Show application/json properties
404

Resource does not exist.

application/json
object
Show application/json properties
409

The input request conflicts with the current state of the resource.

application/json
object
Show application/json properties
422

The data product limit has been exceeded for this tenant.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
503

Service temporarily unavailable. Retry the request.

application/json
object
Show application/json properties
POST
/api/data-governance/data-products
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/data-governance/data-products` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/data-governance/data-products',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'ExampleDataProductName',
      tags: ['exampleTag1', 'exampleTag2'],
      readMe:
        'This is an example readme for the Data Product.',
      spaceId: 'ExampleSpaceId',
      datasetIds: ['string'],
      description:
        'This is an example Data Product.',
      glossaryIds: ['string'],
      keyContacts: [
        {
          role: 'Data Steward',
          userId: 'exampleUserId',
        },
      ],
      apiConsumableDatasetIds: ['string'],
    }),
  },
)
qlik data-governance data-product create \
  --keyContacts-userId '' \
  --name 'ExampleDataProductName'
curl "https://{tenant}.{region}.qlikcloud.com/api/data-governance/data-products" \
-X POST \
-H "Content-type: application/json" \
-H "Authorization: Bearer <access_token>" \
-d '{"name":"ExampleDataProductName","tags":["exampleTag1","exampleTag2"],"readMe":"This is an example readme for the Data Product.","spaceId":"ExampleSpaceId","datasetIds":["string"],"description":"This is an example Data Product.","glossaryIds":["string"],"keyContacts":[{"role":"Data Steward","userId":"exampleUserId"}],"apiConsumableDatasetIds":["string"]}'
Example Response
{
  "id": "string",
  "qri": "string",
  "name": "string",
  "tags": [
    "string"
  ],
  "mainId": "string",
  "readMe": "string",
  "ownerId": "string",
  "quality": {
    "validity": 42,
    "completeness": 42
  },
  "spaceId": "string",
  "tenantId": "string",
  "activated": true,
  "createdAt": "2018-03-20T09:12:28Z",
  "createdBy": "string",
  "updatedAt": "2018-03-20T09:12:28Z",
  "updatedBy": "string",
  "datasetIds": [
    "string"
  ],
  "trustScore": {
    "score": 42,
    "dimensions": [
      {
        "id": "string",
        "score": 42,
        "previousScore": 42,
        "applicableDatasets": 42
      }
    ],
    "previousScore": 42,
    "applicableDatasets": 42
  },
  "activatedAt": "2018-03-20T09:12:28Z",
  "activatedOn": [
    "string"
  ],
  "description": "string",
  "glossaryIds": [
    "string"
  ],
  "keyContacts": [
    {
      "role": "Data Steward",
      "userId": "exampleUserId"
    }
  ],
  "pendingChangesCount": 42,
  "apiConsumableDatasetIds": [
    "string"
  ]
}
Get a data product

Retrieves the details of the specified data product, including name, description, associated datasets, key contacts, and activation status. Requires read access to the Data Product.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
dataProductId
string
Required

Unique identifier of the data product. Must be a valid GUID assigned when the data product was created.

Responses
200

Data product details retrieved successfully.

application/json
object
Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
401

User does not have valid authentication credentials.

application/json
object
Show application/json properties
403

User does not have access to the resource.

application/json
object
Show application/json properties
404

Resource does not exist.

application/json
object
Show application/json properties
409

The input request conflicts with the current state of the resource.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
503

Service temporarily unavailable. Retry the request.

application/json
object
Show application/json properties
GET
/api/data-governance/data-products/{dataProductId}
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/data-governance/data-products/{dataProductId}` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/data-governance/data-products/{dataProductId}',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
qlik data-governance data-product get 'string'
curl "https://{tenant}.{region}.qlikcloud.com/api/data-governance/data-products/{dataProductId}" \
-H "Authorization: Bearer <access_token>"
Example Response
{
  "id": "string",
  "qri": "string",
  "name": "string",
  "tags": [
    "string"
  ],
  "mainId": "string",
  "readMe": "string",
  "ownerId": "string",
  "quality": {
    "validity": 42,
    "completeness": 42
  },
  "spaceId": "string",
  "tenantId": "string",
  "activated": true,
  "createdAt": "2018-03-20T09:12:28Z",
  "createdBy": "string",
  "updatedAt": "2018-03-20T09:12:28Z",
  "updatedBy": "string",
  "datasetIds": [
    "string"
  ],
  "trustScore": {
    "score": 42,
    "dimensions": [
      {
        "id": "string",
        "score": 42,
        "previousScore": 42,
        "applicableDatasets": 42
      }
    ],
    "previousScore": 42,
    "applicableDatasets": 42
  },
  "activatedAt": "2018-03-20T09:12:28Z",
  "activatedOn": [
    "string"
  ],
  "description": "string",
  "glossaryIds": [
    "string"
  ],
  "keyContacts": [
    {
      "role": "Data Steward",
      "userId": "exampleUserId"
    }
  ],
  "pendingChangesCount": 42,
  "apiConsumableDatasetIds": [
    "string"
  ]
}
Update a data product

Partially updates an existing data product using JSON Patch operations. Use this endpoint to modify properties such as name, description, datasets, tags, or key contacts. Changes are tracked in the data product changelog.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
dataProductId
string
Required

Unique identifier of the data product. Must be a valid GUID assigned when the data product was created.

Request Body
Required
application/json
array of objects

maxItems = 8

Show application/json properties
Responses
204

Data product updated successfully.

400

The request is in incorrect format.

application/json
object
Show application/json properties
401

User does not have valid authentication credentials.

application/json
object
Show application/json properties
403

User does not have access to the resource.

application/json
object
Show application/json properties
404

Resource does not exist.

application/json
object
Show application/json properties
409

The input request conflicts with the current state of the resource.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
503

Service temporarily unavailable. Retry the request.

application/json
object
Show application/json properties
PATCH
/api/data-governance/data-products/{dataProductId}
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `PATCH /api/data-governance/data-products/{dataProductId}` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/data-governance/data-products/{dataProductId}',
  {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      {
        op: 'replace',
        path: '/name',
        value: 'string',
      },
    ]),
  },
)
qlik data-governance data-product patch 'string' \
  --op 'replace' \
  --path '/name'
curl "https://{tenant}.{region}.qlikcloud.com/api/data-governance/data-products/{dataProductId}" \
-X PATCH \
-H "Content-type: application/json" \
-H "Authorization: Bearer <access_token>" \
-d '[{"op":"replace","path":"/name","value":"string"}]'
Delete a data product

Permanently removes a data product from the tenant. This action cannot be undone and does not affect the underlying datasets. Requires delete permissions for the data product.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
dataProductId
string
Required

Unique identifier of the data product. Must be a valid GUID assigned when the data product was created.

Responses
204

Data product deleted successfully.

400

The request is in incorrect format.

application/json
object
Show application/json properties
401

User does not have valid authentication credentials.

application/json
object
Show application/json properties
403

User does not have access to the resource.

application/json
object
Show application/json properties
404

Resource does not exist.

application/json
object
Show application/json properties
409

The input request conflicts with the current state of the resource.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
503

Service temporarily unavailable. Retry the request.

application/json
object
Show application/json properties
DELETE
/api/data-governance/data-products/{dataProductId}
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `DELETE /api/data-governance/data-products/{dataProductId}` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/data-governance/data-products/{dataProductId}',
  {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
qlik data-governance data-product rm 'string'
curl "https://{tenant}.{region}.qlikcloud.com/api/data-governance/data-products/{dataProductId}" \
-X DELETE \
-H "Authorization: Bearer <access_token>"
Activate a data product

Activates a data product for publishing and consumption. Once activated, the data product becomes discoverable and accessible to authorized users. Requires publish permissions and valid data product configuration.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
dataProductId
string
Required

Unique identifier of the data product. Must be a valid GUID assigned when the data product was created.

Request Body
Required
application/json
object
Show application/json properties
Responses
201

Created

application/json
object
Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
401

User does not have valid authentication credentials.

application/json
object
Show application/json properties
403

User does not have access to the resource.

application/json
object
Show application/json properties
404

Resource does not exist.

application/json
object
Show application/json properties
409

The input request conflicts with the current state of the resource.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
503

Service temporarily unavailable. Retry the request.

application/json
object
Show application/json properties
POST
/api/data-governance/data-products/{dataProductId}/actions/activate
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/data-governance/data-products/{dataProductId}/actions/activate` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/data-governance/data-products/{dataProductId}/actions/activate',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'ExampleDataProductName',
      tags: ['example'],
      spaceId: 'ExampleSpaceId',
      description:
        'This is an example data product.',
    }),
  },
)
qlik data-governance data-product activate 'string' \
  --name 'ExampleDataProductName'
curl "https://{tenant}.{region}.qlikcloud.com/api/data-governance/data-products/{dataProductId}/actions/activate" \
-X POST \
-H "Content-type: application/json" \
-H "Authorization: Bearer <access_token>" \
-d '{"name":"ExampleDataProductName","tags":["example"],"spaceId":"ExampleSpaceId","description":"This is an example data product."}'
Example Response
{
  "id": "string",
  "qri": "string",
  "name": "string",
  "tags": [
    "string"
  ],
  "mainId": "string",
  "readMe": "string",
  "ownerId": "string",
  "quality": {
    "validity": 42,
    "completeness": 42
  },
  "spaceId": "string",
  "tenantId": "string",
  "activated": true,
  "createdAt": "2018-03-20T09:12:28Z",
  "createdBy": "string",
  "updatedAt": "2018-03-20T09:12:28Z",
  "updatedBy": "string",
  "datasetIds": [
    "string"
  ],
  "trustScore": {
    "score": 42,
    "dimensions": [
      {
        "id": "string",
        "score": 42,
        "previousScore": 42,
        "applicableDatasets": 42
      }
    ],
    "previousScore": 42,
    "applicableDatasets": 42
  },
  "activatedAt": "2018-03-20T09:12:28Z",
  "activatedOn": [
    "string"
  ],
  "description": "string",
  "glossaryIds": [
    "string"
  ],
  "keyContacts": [
    {
      "role": "Data Steward",
      "userId": "exampleUserId"
    }
  ],
  "pendingChangesCount": 42,
  "apiConsumableDatasetIds": [
    "string"
  ]
}
Trigger data quality computation for the data-product's datasets

Triggers a full data quality computation for all datasets in the data product, running profile calculation followed by data quality assessment. Returns a batchComputationId that can be used to track overall progress via the batch computation status endpoint (GET /api/data-governance/data-qualities/batch-computations/{batchComputationId}). The computation runs asynchronously. Poll the status endpoint until status is FINISHED.

Facts
	Rate limit	Special (10 requests per minute)
Path Parameters
dataProductId
string
Required

Unique identifier of the data product. Must be a valid GUID assigned when the data product was created.

Responses
202

Data quality computation triggered successfully.

application/json
object

Response containing the batch computation identifier and per-dataset quality computation results.

Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
401

User does not have valid authentication credentials.

application/json
object
Show application/json properties
403

User does not have access to the resource.

application/json
object
Show application/json properties
404

Resource does not exist.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
503

Service temporarily unavailable. Retry the request.

application/json
object
Show application/json properties
POST
/api/data-governance/data-products/{dataProductId}/actions/compute-datasets-data-quality
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/data-governance/data-products/{dataProductId}/actions/compute-datasets-data-quality` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/data-governance/data-products/{dataProductId}/actions/compute-datasets-data-quality',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
# qlik-cli has not implemented support for POST /api/data-governance/data-products/{dataProductId}/actions/compute-datasets-data-quality yet.
curl "https://{tenant}.{region}.qlikcloud.com/api/data-governance/data-products/{dataProductId}/actions/compute-datasets-data-quality" \
-X POST \
-H "Authorization: Bearer <access_token>"
Example Response
{
  "datasetResponses": [
    {
      "error": "string",
      "status": "REQUESTED",
      "datasetId": "669144f5aa2d642638ef1dd0",
      "computationId": "string"
    }
  ],
  "batchComputationId": "string"
}
Deactivate a data product

Deactivates a data product, preventing it from being consumed by other services or users.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
dataProductId
string
Required

Unique identifier of the data product. Must be a valid GUID assigned when the data product was created.

Responses
204

No content

400

The request is in incorrect format.

application/json
object
Show application/json properties
401

User does not have valid authentication credentials.

application/json
object
Show application/json properties
403

User does not have access to the resource.

application/json
object
Show application/json properties
404

Resource does not exist.

application/json
object
Show application/json properties
409

The input request conflicts with the current state of the resource.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
503

Service temporarily unavailable. Retry the request.

application/json
object
Show application/json properties
POST
/api/data-governance/data-products/{dataProductId}/actions/deactivate
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/data-governance/data-products/{dataProductId}/actions/deactivate` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/data-governance/data-products/{dataProductId}/actions/deactivate',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
qlik data-governance data-product deactivate 'string'
curl "https://{tenant}.{region}.qlikcloud.com/api/data-governance/data-products/{dataProductId}/actions/deactivate" \
-X POST \
-H "Authorization: Bearer <access_token>"
Export data product documentation

Exports data product documentation in Markdown format. Use this endpoint to generate documentation for sharing or archiving. Requires read access to the data product.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
dataProductId
string
Required

Unique identifier of the data product. Must be a valid GUID assigned when the data product was created.

Responses
200

Documentation exported successfully in Markdown format.

text/markdown
string
400

The request is in incorrect format.

application/json
object
Show application/json properties
401

User does not have valid authentication credentials.

application/json
object
Show application/json properties
403

User does not have access to the resource.

application/json
object
Show application/json properties
404

Resource does not exist.

application/json
object
Show application/json properties
406

MIME type isn't supported.

application/json
object
Show application/json properties
415

Unsupported output format requested.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
503

Service temporarily unavailable. Retry the request.

application/json
object
Show application/json properties
GET
/api/data-governance/data-products/{dataProductId}/actions/export-documentation
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/data-governance/data-products/{dataProductId}/actions/export-documentation` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/data-governance/data-products/{dataProductId}/actions/export-documentation',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
qlik data-governance data-product export-documentation 'string'
curl "https://{tenant}.{region}.qlikcloud.com/api/data-governance/data-products/{dataProductId}/actions/export-documentation" \
-H "Authorization: Bearer <access_token>"
Example Response
"string"
Move a data product

Moves a data product from its current space to a different space. Use this endpoint to reorganize data products across workspaces or governance domains. Requires delete permissions in the source space and create permissions in the target space.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
dataProductId
string
Required

Unique identifier of the data product. Must be a valid GUID assigned when the data product was created.

Request Body
Required
application/json
object
Show application/json properties
Responses
204

No content

400

The request is in incorrect format.

application/json
object
Show application/json properties
401

User does not have valid authentication credentials.

application/json
object
Show application/json properties
403

User does not have access to the resource.

application/json
object
Show application/json properties
404

Resource does not exist.

application/json
object
Show application/json properties
409

The input request conflicts with the current state of the resource.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
503

Service temporarily unavailable. Retry the request.

application/json
object
Show application/json properties
POST
/api/data-governance/data-products/{dataProductId}/actions/move
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/data-governance/data-products/{dataProductId}/actions/move` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/data-governance/data-products/{dataProductId}/actions/move',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      spaceId: 'exampleSpaceId',
    }),
  },
)
qlik data-governance data-product move 'string' \
  --spaceId 'exampleSpaceId'
curl "https://{tenant}.{region}.qlikcloud.com/api/data-governance/data-products/{dataProductId}/actions/move" \
-X POST \
-H "Content-type: application/json" \
-H "Authorization: Bearer <access_token>" \
-d '{"spaceId":"exampleSpaceId"}'
Get data product changelogs

Retrieves a paginated history of all notable changes made to a data product. Each changelog entry captures the operation type, affected property, and timestamp. Use this endpoint to track the history of changes or data product evolution over time.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
page
integer

Page number.

minimum = 1, default = 1, format = int32, default = 1

limit
integer

Maximum number of items to return per page.

minimum = 1, maximum = 100, default = 10, format = int32, default = 10

sort
string

Sort order for changelog entries. Use +createdAt for oldest first or -createdAt for newest first. Prefix with + for ascending or - for descending order. Default: -createdAt.

Can be one of: "+createdAt""-createdAt"

default = "-createdAt"

Path Parameters
dataProductId
string
Required

Unique identifier of the data product. Must be a valid GUID assigned when the data product was created.

Responses
200

OK response

application/json
object
Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
401

User does not have valid authentication credentials.

application/json
object
Show application/json properties
403

User does not have access to the resource.

application/json
object
Show application/json properties
404

Resource does not exist.

application/json
object
Show application/json properties
409

The input request conflicts with the current state of the resource.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
503

Service temporarily unavailable. Retry the request.

application/json
object
Show application/json properties
GET
/api/data-governance/data-products/{dataProductId}/changelogs
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `GET /api/data-governance/data-products/{dataProductId}/changelogs` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/data-governance/data-products/{dataProductId}/changelogs',
  {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
qlik data-governance data-product changelog ls 'string'
curl "https://{tenant}.{region}.qlikcloud.com/api/data-governance/data-products/{dataProductId}/changelogs" \
-H "Authorization: Bearer <access_token>"
Example Response
{
  "data": [
    {
      "id": "string",
      "changes": [
        {
          "path": "/name",
          "value": "string",
          "operator": "replace"
        }
      ],
      "createdAt": "2018-03-20T09:12:28Z",
      "createdBy": "string"
    }
  ],
  "page": 42,
  "limit": 42,
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
  },
  "pages": 42,
  "total": 42
}
Generate provider URL

Generates a URL to access a third-party provider's user interface. Use this endpoint to integrate external services with your data product.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Query Parameters
dataSetId
string
Required

Unique identifier of the dataset.

minLength = 1

Responses
200

OK response

application/json
object
Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
401

User does not have valid authentication credentials.

application/json
object
Show application/json properties
403

User does not have access to the resource.

application/json
object
Show application/json properties
404

Resource does not exist.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
503

Service temporarily unavailable. Retry the request.

application/json
object
Show application/json properties
POST
/api/data-governance/data-products/actions/generate-provider-url
JavaScript
Qlik CLI
cURL
// qlik-api has not implemented support for `POST /api/data-governance/data-products/actions/generate-provider-url` yet.
// In the meantime, you can use fetch like this:


const response = await fetch(
  '/api/data-governance/data-products/actions/generate-provider-url',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  },
)
qlik data-governance data-product generate-provider-url \
  --dataSetId 'string'
curl "https://{tenant}.{region}.qlikcloud.com/api/data-governance/data-products/actions/generate-provider-url" \
-X POST \
-H "Authorization: Bearer <access_token>"
Example Response
{
  "url": "string"
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