---
title: "Brands REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/brands/"
local_path: "docs/endpoints/brands.md"
---

Title: Brands REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/brands/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Brands

*   [List brands](https://qlik.dev/apis/rest/brands/#get-api-v1-brands "List brands")
*   [Create a new brand](https://qlik.dev/apis/rest/brands/#post-api-v1-brands "Create a new brand")
*   [Retrieve a brand](https://qlik.dev/apis/rest/brands/#get-api-v1-brands-brand-id "Retrieve a brand")
*   [Update a brand](https://qlik.dev/apis/rest/brands/#patch-api-v1-brands-brand-id "Update a brand")
*   [Delete a brand](https://qlik.dev/apis/rest/brands/#delete-api-v1-brands-brand-id "Delete a brand")
*   [Activate a brand](https://qlik.dev/apis/rest/brands/#post-api-v1-brands-brand-id-actions-activate "Activate a brand")
*   [Deactivate a brand](https://qlik.dev/apis/rest/brands/#post-api-v1-brands-brand-id-actions-deactivate "Deactivate a brand")
*   [Download brand file](https://qlik.dev/apis/rest/brands/#get-api-v1-brands-brand-id-files-brand-file-id "Download brand file")
*   [Creates a brand file](https://qlik.dev/apis/rest/brands/#post-api-v1-brands-brand-id-files-brand-file-id "Creates a brand file")
*   [Update a brand file](https://qlik.dev/apis/rest/brands/#put-api-v1-brands-brand-id-files-brand-file-id "Update a brand file")
*   [Delete a brand file](https://qlik.dev/apis/rest/brands/#delete-api-v1-brands-brand-id-files-brand-file-id "Delete a brand file")
*   [Retrieve active brand](https://qlik.dev/apis/rest/brands/#get-api-v1-brands-active "Retrieve active brand")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/brands.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Brands

Brands allow you to apply tenant level branding across most user interfaces.

[Download OpenAPI spec](https://qlik.dev/specs/rest/brands.json)

## Endpoints

*   [GET /api/v1/brands](https://qlik.dev/apis/rest/brands/#get-api-v1-brands)
*   [POST /api/v1/brands](https://qlik.dev/apis/rest/brands/#post-api-v1-brands)
*   [GET /api/v1/brands/{brand-id}](https://qlik.dev/apis/rest/brands/#get-api-v1-brands-brand-id)
*   [PATCH /api/v1/brands/{brand-id}](https://qlik.dev/apis/rest/brands/#patch-api-v1-brands-brand-id)
*   [DELETE /api/v1/brands/{brand-id}](https://qlik.dev/apis/rest/brands/#delete-api-v1-brands-brand-id)
*   [POST /api/v1/brands/{brand-id}/actions/activate](https://qlik.dev/apis/rest/brands/#post-api-v1-brands-brand-id-actions-activate)
*   [POST /api/v1/brands/{brand-id}/actions/deactivate](https://qlik.dev/apis/rest/brands/#post-api-v1-brands-brand-id-actions-deactivate)
*   [GET /api/v1/brands/{brand-id}/files/{brand-file-id}](https://qlik.dev/apis/rest/brands/#get-api-v1-brands-brand-id-files-brand-file-id)
*   [POST /api/v1/brands/{brand-id}/files/{brand-file-id}](https://qlik.dev/apis/rest/brands/#post-api-v1-brands-brand-id-files-brand-file-id)
*   [PUT /api/v1/brands/{brand-id}/files/{brand-file-id}](https://qlik.dev/apis/rest/brands/#put-api-v1-brands-brand-id-files-brand-file-id)
*   [DELETE /api/v1/brands/{brand-id}/files/{brand-file-id}](https://qlik.dev/apis/rest/brands/#delete-api-v1-brands-brand-id-files-brand-file-id)
*   [GET /api/v1/brands/active](https://qlik.dev/apis/rest/brands/#get-api-v1-brands-active)

## [](https://qlik.dev/apis/rest/brands/#get-api-v1-brands)List brands

Lists all brand entries for a tenant.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Query Parameters

*   endingBefore string   Cursor to previous. 
*   limit integer   Maximum number of brands to retrieve. 
minimum = 1,  maximum = 100,  default = 5,  default = 5

*   sort string   Field to sort by, prefixed with -/+ to indicate the order. 
Can be one of: "id""+id""-id""createdAt""+createdAt""-createdAt""updatedAt""+updatedAt""-updatedAt"

default = "-id"

*   startingAfter string   Cursor to the next page. 

### Responses

#### 200

OK Response

*   application/json object   A collection of brands. 

Show application/json properties 

    *   data array of objects   A brand is a collection of assets for applying custom branding. Only a single brand can be active in a tenant. 

Show data properties 

        *   id string Required   
        *   name string Required   
        *   files array of objects Required   Collection of resources that make up the brand. 

Show files properties 

            *   id string   
Can be one of: "logo""favIcon""styles"

            *   eTag string   
            *   path string   
            *   contentType string   

        *   active boolean   
        *   createdAt string   The UTC timestamp when the brand was created. 
format = "date-time"

        *   createdBy string   ID of a user that created the brand. 
        *   updatedAt string   The UTC timestamp when the brand was last updated. 
format = "date-time"

        *   updatedBy string   ID of a user that last updated the brand. 
        *   description string Required   

    *   links object   

Show links properties 

        *   next object   

Show next properties 

            *   href string Required   URL of a resource request. 

        *   prev object   

Show prev properties 

            *   href string Required   URL of a resource request. 

        *   self object   

Show self properties 

            *   href string Required   URL of a resource request. 

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

 GET /api/v1/brands

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.brands.getBrands({})
```

`qlik brand ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/brands" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "data": [    {      "id": "string",      "name": "string",      "files": [        {          "id": "logo",          "eTag": "string",          "path": "string",          "contentType": "string"        }      ],      "active": true,      "createdAt": "2024-01-01T00:00:00.000Z",      "createdBy": "string",      "updatedAt": "2024-01-01T00:00:00.000Z",      "updatedBy": "string",      "description": "string"    }  ],  "links": {    "next": {      "href": "string"    },    "prev": {      "href": "string"    },    "self": {      "href": "string"    }  }}`

## [](https://qlik.dev/apis/rest/brands/#post-api-v1-brands)Create a new brand

Creates a new brand.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

*   multipart/form-data object   

Show multipart/form-data properties 

    *   logo string   The path and name of a JPG or PNG file that will be adjusted to fit in a 'box' measuring 109px in width and 62 px in height while maintaining aspect ratio. Maximum size of 300 KB, but smaller is recommended. 
format = "binary"

    *   name string Required   Name of the brand. 
    *   styles string   The path and name of a JSON file to define brand style settings. Maximum size is 100 KB. This property is not currently operational. 
format = "binary"

    *   favIcon string   The path and name of a properly formatted ICO file. Maximum size is 100 KB. 
format = "binary"

    *   description string   Description of the brand. 

### Responses

#### 201

Created Response

*   application/json object   A brand is a collection of assets for applying custom branding. Only a single brand can be active in a tenant. 

Show application/json properties 

    *   id string Required   
    *   name string Required   
    *   files array of objects Required   Collection of resources that make up the brand. 

Show files properties 

        *   id string   
Can be one of: "logo""favIcon""styles"

        *   eTag string   
        *   path string   
        *   contentType string   

    *   active boolean   
    *   createdAt string   The UTC timestamp when the brand was created. 
format = "date-time"

    *   createdBy string   ID of a user that created the brand. 
    *   updatedAt string   The UTC timestamp when the brand was last updated. 
format = "date-time"

    *   updatedBy string   ID of a user that last updated the brand. 
    *   description string Required   

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

 POST /api/v1/brands

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'import { readFileSync } from 'node:fs'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.brands.createBrand({  description: 'string',  favIcon: new Uint8Array(    readFileSync('<file-path>'),  ),  logo: new Uint8Array(    readFileSync('<file-path>'),  ),  name: 'string',  styles: new Uint8Array(    readFileSync('<file-path>'),  ),})
```

`qlik brand create \  --name 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/brands" \-X POST \-H "Content-type: multipart/form-data" \-H "Authorization: Bearer <access_token>" \-F "logo=@/path/to/file" \-F "name=\"string\"" \-F "styles=@/path/to/file" \-F "favIcon=@/path/to/file" \-F "description=\"string\""`

### Example Response

`{  "id": "string",  "name": "string",  "files": [    {      "id": "logo",      "eTag": "string",      "path": "string",      "contentType": "string"    }  ],  "active": true,  "createdAt": "2024-01-01T00:00:00.000Z",  "createdBy": "string",  "updatedAt": "2024-01-01T00:00:00.000Z",  "updatedBy": "string",  "description": "string"}`

## [](https://qlik.dev/apis/rest/brands/#get-api-v1-brands-brand-id)Retrieve a brand

Returns a specific brand.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Path Parameters

*   brand-id string Required   The brand's unique identifier. 

### Responses

#### 200

OK Response

*   application/json object   A brand is a collection of assets for applying custom branding. Only a single brand can be active in a tenant. 

Show application/json properties 

    *   id string Required   
    *   name string Required   
    *   files array of objects Required   Collection of resources that make up the brand. 

Show files properties 

        *   id string   
Can be one of: "logo""favIcon""styles"

        *   eTag string   
        *   path string   
        *   contentType string   

    *   active boolean   
    *   createdAt string   The UTC timestamp when the brand was created. 
format = "date-time"

    *   createdBy string   ID of a user that created the brand. 
    *   updatedAt string   The UTC timestamp when the brand was last updated. 
format = "date-time"

    *   updatedBy string   ID of a user that last updated the brand. 
    *   description string Required   

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 404

Not found

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

 GET /api/v1/brands/{brand-id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.brands.getBrand('string')
```

`qlik brand get 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/brands/{brand-id}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "id": "string",  "name": "string",  "files": [    {      "id": "logo",      "eTag": "string",      "path": "string",      "contentType": "string"    }  ],  "active": true,  "createdAt": "2024-01-01T00:00:00.000Z",  "createdBy": "string",  "updatedAt": "2024-01-01T00:00:00.000Z",  "updatedBy": "string",  "description": "string"}`

## [](https://qlik.dev/apis/rest/brands/#patch-api-v1-brands-brand-id)Update a brand

Patches a brand.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   brand-id string Required   The brand's unique identifier. 

### Request Body

Required

*   application/json array of objects   A JSON Patch document as defined in [https://datatracker.ietf.org/doc/html/rfc6902](https://datatracker.ietf.org/doc/html/rfc6902). 

Show application/json properties 

    *   op string Required   The operation to be performed. 
Can be one of: "add""remove""replace"

    *   path string Required   The path for the given resource field to patch. 
Can be one of: "/name""/description"

    *   value string   The value to be used for this operation. 

### Responses

#### 204

No Content Response.

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 404

Not found

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

 PATCH /api/v1/brands/{brand-id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.brands.patchBrand('string', [  {    op: 'add',    path: '/description',    value: 'string',  },])
```

`qlik brand patch 'string' \  --op 'add' \  --path '/description'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/brands/{brand-id}" \-X PATCH \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '[{"op":"add","path":"/description","value":"string"}]'`

## [](https://qlik.dev/apis/rest/brands/#delete-api-v1-brands-brand-id)Delete a brand

Deletes a specific brand. If the active brand is deleted, the tenant will return to the Qlik default.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   brand-id string Required   The brand's unique identifier. 

### Responses

#### 204

No Content Response.

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 404

Not found

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

 DELETE /api/v1/brands/{brand-id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.brands.deleteBrand('string')
```

`qlik brand rm 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/brands/{brand-id}" \-X DELETE \-H "Authorization: Bearer <access_token>"`

## [](https://qlik.dev/apis/rest/brands/#post-api-v1-brands-brand-id-actions-activate)Activate a brand

Sets the brand active and de-activates any other active brand. If the brand is already active, no action is taken.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   brand-id string Required   The brand's unique identifier. 

### Request Body

### Responses

#### 200

Responds with the brand that was activated.

*   application/json object   A brand is a collection of assets for applying custom branding. Only a single brand can be active in a tenant. 

Show application/json properties 

    *   id string Required   
    *   name string Required   
    *   files array of objects Required   Collection of resources that make up the brand. 

Show files properties 

        *   id string   
Can be one of: "logo""favIcon""styles"

        *   eTag string   
        *   path string   
        *   contentType string   

    *   active boolean   
    *   createdAt string   The UTC timestamp when the brand was created. 
format = "date-time"

    *   createdBy string   ID of a user that created the brand. 
    *   updatedAt string   The UTC timestamp when the brand was last updated. 
format = "date-time"

    *   updatedBy string   ID of a user that last updated the brand. 
    *   description string Required   

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 404

Not found

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

 POST /api/v1/brands/{brand-id}/actions/activate

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.brands.activateBrand('string', {})
```

`qlik brand activate 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/brands/{brand-id}/actions/activate" \-X POST \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "id": "string",  "name": "string",  "files": [    {      "id": "logo",      "eTag": "string",      "path": "string",      "contentType": "string"    }  ],  "active": true,  "createdAt": "2024-01-01T00:00:00.000Z",  "createdBy": "string",  "updatedAt": "2024-01-01T00:00:00.000Z",  "updatedBy": "string",  "description": "string"}`

## [](https://qlik.dev/apis/rest/brands/#post-api-v1-brands-brand-id-actions-deactivate)Deactivate a brand

Sets the brand so it is no longer active, returning the tenant the Qlik default brand. If the brand is already inactive, no action is taken.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   brand-id string Required   The brand's unique identifier. 

### Request Body

### Responses

#### 200

Responds with the brand that was deactivated.

*   application/json object   A brand is a collection of assets for applying custom branding. Only a single brand can be active in a tenant. 

Show application/json properties 

    *   id string Required   
    *   name string Required   
    *   files array of objects Required   Collection of resources that make up the brand. 

Show files properties 

        *   id string   
Can be one of: "logo""favIcon""styles"

        *   eTag string   
        *   path string   
        *   contentType string   

    *   active boolean   
    *   createdAt string   The UTC timestamp when the brand was created. 
format = "date-time"

    *   createdBy string   ID of a user that created the brand. 
    *   updatedAt string   The UTC timestamp when the brand was last updated. 
format = "date-time"

    *   updatedBy string   ID of a user that last updated the brand. 
    *   description string Required   

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 404

Not found

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

 POST /api/v1/brands/{brand-id}/actions/deactivate

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.brands.deactivateBrand('string', {})
```

`qlik brand deactivate 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/brands/{brand-id}/actions/deactivate" \-X POST \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "id": "string",  "name": "string",  "files": [    {      "id": "logo",      "eTag": "string",      "path": "string",      "contentType": "string"    }  ],  "active": true,  "createdAt": "2024-01-01T00:00:00.000Z",  "createdBy": "string",  "updatedAt": "2024-01-01T00:00:00.000Z",  "updatedBy": "string",  "description": "string"}`

## [](https://qlik.dev/apis/rest/brands/#get-api-v1-brands-brand-id-files-brand-file-id)Download brand file

Downloads the specified brand file.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Path Parameters

*   brand-id string Required   The brand's unique identifier. 
*   brand-file-id string Required   The unique identifier of a file within a brand. 
Can be one of: "logo""favIcon""styles"

### Responses

#### 200

OK Response

*   */*string   
format = "binary"

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 404

Not found

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

 GET /api/v1/brands/{brand-id}/files/{brand-file-id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.brands.getBrandFile('string', 'logo')
```

`qlik brand file get 'logo' \  --brandId 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/brands/{brand-id}/files/{brand-file-id}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`"string"`

## [](https://qlik.dev/apis/rest/brands/#post-api-v1-brands-brand-id-files-brand-file-id)Creates a brand file

Creates a brand file for the specified identifier.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   brand-id string Required   The brand's unique identifier. 
*   brand-file-id string Required   The unique identifier of a file within a brand. 
Can be one of: "logo""favIcon""styles"

### Request Body

Required

*   multipart/form-data object   

Show multipart/form-data properties 

    *   file string   The path and name of a file to upload. 
format = "binary"

### Responses

#### 201

Created Response

*   application/json object   Represents one of the assets used as part of the brand. These include logos, favicons, and some styles. 

Show application/json properties 

    *   id string   
Can be one of: "logo""favIcon""styles"

    *   eTag string   
    *   path string   
    *   contentType string   

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 404

Not found

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

 POST /api/v1/brands/{brand-id}/files/{brand-file-id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'import { readFileSync } from 'node:fs'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.brands.createBrandFile(  'string',  'logo',  {    file: new Uint8Array(      readFileSync('<file-path>'),    ),  },)
```

`qlik brand file create 'logo' \  --brandId 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/brands/{brand-id}/files/{brand-file-id}" \-X POST \-H "Content-type: multipart/form-data" \-H "Authorization: Bearer <access_token>" \-F "file=@/path/to/file"`

### Example Response

`{  "id": "logo",  "eTag": "string",  "path": "string",  "contentType": "string"}`

## [](https://qlik.dev/apis/rest/brands/#put-api-v1-brands-brand-id-files-brand-file-id)Update a brand file

Updates the specified brand file.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   brand-id string Required   The brand's unique identifier. 
*   brand-file-id string Required   The unique identifier of a file within a brand. 
Can be one of: "logo""favIcon""styles"

### Request Body

Required

*   multipart/form-data object   

Show multipart/form-data properties 

    *   file string   A file to upload. 
format = "binary"

### Responses

#### 200

OK Response - file updated

*   application/json object   Represents one of the assets used as part of the brand. These include logos, favicons, and some styles. 

Show application/json properties 

    *   id string   
Can be one of: "logo""favIcon""styles"

    *   eTag string   
    *   path string   
    *   contentType string   

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 404

Not found

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

 PUT /api/v1/brands/{brand-id}/files/{brand-file-id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'import { readFileSync } from 'node:fs'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.brands.updateBrandFile(  'string',  'logo',  {    file: new Uint8Array(      readFileSync('<file-path>'),    ),  },)
```

`qlik brand file update 'logo' \  --brandId 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/brands/{brand-id}/files/{brand-file-id}" \-X PUT \-H "Content-type: multipart/form-data" \-H "Authorization: Bearer <access_token>" \-F "file=@/path/to/file"`

### Example Response

`{  "id": "logo",  "eTag": "string",  "path": "string",  "contentType": "string"}`

## [](https://qlik.dev/apis/rest/brands/#delete-api-v1-brands-brand-id-files-brand-file-id)Delete a brand file

Deletes the specified brand file.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   brand-id string Required   The brand's unique identifier. 
*   brand-file-id string Required   The unique identifier of a file within a brand. 
Can be one of: "logo""favIcon""styles"

### Responses

#### 204

No content response.

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 404

Not found

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

 DELETE /api/v1/brands/{brand-id}/files/{brand-file-id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.brands.deleteBrandFile(  'string',  'logo',)
```

`qlik brand file rm 'logo' \  --brandId 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/brands/{brand-id}/files/{brand-file-id}" \-X DELETE \-H "Authorization: Bearer <access_token>"`

## [](https://qlik.dev/apis/rest/brands/#get-api-v1-brands-active)Retrieve active brand

Returns the current active brand. If using the Qlik default brand, no value is returned.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Responses

#### 200

No active brand, returns an empty response.

*   application/json object   Empty object inferring lack of active branding. 

#### 301

Successful redirect.

 GET /api/v1/brands/active

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.brands.getActiveBrand()
```

`qlik brand active`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/brands/active" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{}`

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