---
title: "Change stores REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/analytics/change-stores/"
local_path: "docs/endpoints/analytics-change-stores.md"
---

Title: Change stores REST | Qlik Developer Portal


The Change Stores API enables you to access changes that users make to editable columns in write table visualizations. Changes are temporarily stored (up to 90 days) and can be retrieved, exported to external systems, or integrated into automated workflows.

Returns a list of change-stores, accessible to the user.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Header Parameters

*   Authorization string

Required  
The JWT used for authentication. Send the JWT in the AuthRequest header using the Bearer schema.

### Query Parameters

*   page string 
Used for cursor-based pagination.

*   limit integer 
Defines the size of each paged result (maximum 100).

maximum = 100

*   filter string 

A SCIM filter expression used to filter the result. The filter parameter allows complex logical expressions using comparison operators and grouping.

    *   **Supported attributes:**`storeName`, `storeId`, `referenceId`, `usedBy.appId`, `primaryKey`, `isUsedByEmpty`
    *   **Supported operators:**`eq`, `ne`, `co`, `sw`, `ew`, `pr`, `gt`, `ge`, `lt`, `le`
    *   **Logical operators:**`and`, `or`, `not`

*   sort string 
Sort results by a field, with optional + (asc) or - (desc) prefix

pattern = "^[+-]?(storeName)$"

*   spaceId string

Required  
The space ID to filter change stores by. This parameter is required. For personal spaces, use "personal". For shared spaces, use the actual space ID, e.g. "690b584c5a8011de9079828e".

### Responses

GET /api/analytics/change-stores

`// qlik-api has not implemented support for `GET /api/analytics/change-stores` yet.// In the meantime, you can use fetch like this:const response = await fetch(  '/api/analytics/change-stores',  {    method: 'GET',    headers: {      'Content-Type': 'application/json',    },  },)`

### Example Response

`{  "data": [    {      "usedBy": [        {          "appId": "af604296-14f6-48c2-8bac-12ce49ba83cc",          "chartId": "chartId"        }      ],      "spaceId": "456",      "storeId": "123",      "tenantId": "tenant789",      "storeName": "My Change Store",      "primaryKey": [        "product",        "region"      ],      "publishRefId": "6835b0135cf7147c01979e5d"    },    {      "usedBy": [        {          "appId": "af604296-14f6-48c2-8bac-12ce49ba83cc",          "chartId": "chartId2"        }      ],      "spaceId": "457",      "storeId": "124",      "tenantId": "tenant790",      "storeName": "Another Change Store",      "primaryKey": [        "category",        "region"      ],      "publishRefId": "6835b0135cf7147c01979e5d"    }  ],  "links": {    "next": {      "href": "https://example.org/api/analytics/change-stores?page=2"    },    "prev": {      "href": "https://example.org/api/analytics/change-stores?page=1"    },    "self": {      "href": "https://example.org/api/analytics/change-stores?page=1"    }  },  "totalCount": 10,  "currentPageCount": 2}`

Returns detailed information about a specific change store, such as its configuration and associated charts.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Header Parameters

*   Authorization string

Required  
The JWT used for authentication. Send the JWT in the AuthRequest header using the Bearer schema.

### Path Parameters

*   storeId string

Required  
The id of the change store.

### Responses

GET /api/analytics/change-stores/{storeId}

`// qlik-api has not implemented support for `GET /api/analytics/change-stores/{storeId}` yet.// In the meantime, you can use fetch like this:const response = await fetch(  '/api/analytics/change-stores/{storeId}',  {    method: 'GET',    headers: {      'Content-Type': 'application/json',    },  },)`

### Example Response

`{  "data": {    "usedBy": [      {        "appId": "af604296-14f6-48c2-8bac-12ce49ba83cc",        "chartId": "chartId"      }    ],    "spaceId": "456",    "storeId": "123",    "tenantId": "tenant789",    "storeName": "My Change Store",    "primaryKey": [      "product",      "region"    ],    "publishRefId": "6835b0135cf7147c01979e5d"  }}`

Returns a list of changes within the specified change-store.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Header Parameters

*   Authorization string

Required  
The JWT used for authentication. Send the JWT in the AuthRequest header using the Bearer schema.

### Query Parameters

*   page string 
Used for cursor-based pagination.

*   limit integer 
Defines the size of each paged result (maximum 100).

maximum = 100

*   filter string 

A SCIM filter expression used to filter the result. The filter parameter allows complex logical expressions using comparison operators and grouping.

    *   **Supported attributes:**`committed`, `cellKey.columnId`, `columnId`, `createdBy`, `createdAt`, `updatedAt`
    *   **Supported operators:**`eq`, `ne`, `co`, `sw`, `ew`, `pr`, `gt`, `ge`, `lt`, `le`
    *   **Logical operators:**`and`, `or`, `not`

*   sort string 
Sort results by a field, with optional + (asc) or - (desc) prefix

pattern = "^[+-]?(createdAt|updatedAt|cellKey)$"

### Path Parameters

*   storeId string

Required  
The id of the change store.

### Responses

GET /api/analytics/change-stores/{storeId}/changes

`// qlik-api has not implemented support for `GET /api/analytics/change-stores/{storeId}/changes` yet.// In the meantime, you can use fetch like this:const response = await fetch(  '/api/analytics/change-stores/{storeId}/changes',  {    method: 'GET',    headers: {      'Content-Type': 'application/json',    },  },)`

### Example Response

`{  "totalCount": 10,  "currentPageCount": 2,  "links": {    "next": {      "href": "https://example.org/api/analytics/change-stores?page=<next-cursor>"    },    "prev": {      "href": "https://example.org/api/analytics/change-stores?page=<previous-cursor>"    },    "self": {      "href": "https://example.org/api/analytics/change-stores?page=<self-cursor>"    }  },  "data": [    {      "cellKey": {        "rowKey": {          "product": "table"        },        "columnId": "690b5975fddd52c0fba8dd10"      },      "changes": [        {          "meta": {            "tenantId": "tenant123",            "createdAt": "2023-01-01T12:00:00Z",            "createdBy": "user123"          },          "committed": true,          "columnValue": "100"        }      ],      "columnName": "price"    }  ]}`

Returns changes in tabular format, showing modified rows with optional expansion to include all columns.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Header Parameters

*   Authorization string

Required  
The JWT used for authentication. Send the JWT in the AuthRequest header using the Bearer schema.

### Query Parameters

*   expandRow boolean 
When set to true, the records returned by this endpoint will include the latest change (if available) for each editable column in the record. This parameter should be used in combination with a filter on updatedAt for use cases that require all editable columns to be included in each response.

*   page string 
Used for cursor-based pagination.

*   limit integer 
Defines the size of each paged result (maximum 100).

maximum = 100

*   filter string 

A SCIM filter expression used to filter the result. The filter parameter allows complex logical expressions using comparison operators and grouping.

    *   **Supported attributes:**`committed`, `cellKey.columnId`, `columnId`, `createdBy`, `createdAt`, `updatedAt`
    *   **Supported operators:**`eq`, `ne`, `co`, `sw`, `ew`, `pr`, `gt`, `ge`, `lt`, `le`
    *   **Logical operators:**`and`, `or`, `not`

### Path Parameters

*   storeId string

Required  
The id of the change store.

### Responses

GET /api/analytics/change-stores/{storeId}/changes/tabular-views

`// qlik-api has not implemented support for `GET /api/analytics/change-stores/{storeId}/changes/tabular-views` yet.// In the meantime, you can use fetch like this:const response = await fetch(  '/api/analytics/change-stores/{storeId}/changes/tabular-views',  {    method: 'GET',    headers: {      'Content-Type': 'application/json',    },  },)`

### Example Response

`{  "totalCount": 10,  "currentPageCount": 2,  "links": {    "next": {      "href": "https://example.org/api/analytics/change-stores?page=<next-cursor>"    },    "prev": {      "href": "https://example.org/api/analytics/change-stores?page=<previous-cursor>"    },    "self": {      "href": "https://example.org/api/analytics/change-stores?page=<self-cursor>"    }  },  "data": [    {      "Color": "red",      "Price": "200",      "Product": "table",      "updatedAt": "2023-10-01T12:00:00Z",      "updatedBy": "abc123"    },    {      "Color": "green",      "Price": "100",      "Product": "chair",      "updatedAt": "2023-10-01T13:00:00Z"    }  ]}`

Returns a paginated list of editable-columns that belong to the specified change store, supporting optional filtering and sorting.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Header Parameters

*   Authorization string

Required  
The JWT used for authentication. Send the JWT in the AuthRequest header using the Bearer schema.

### Query Parameters

*   page string 
Used for cursor-based pagination.

*   limit integer 
Defines the size of each paged result (maximum 100).

maximum = 100

*   filter string 

A SCIM filter expression used to filter the result. The filter parameter allows complex logical expressions using comparison operators and grouping.

    *   **Supported attributes:**`referenceId`, `spaceId`, `createdBy`, `type`, `columnName`, `usedBy.appId`, `usedBy.chartId`
    *   **Supported operators:**`eq`, `ne`, `co`, `sw`, `ew`, `pr`, `gt`, `ge`, `lt`, `le`
    *   **Logical operators:**`and`, `or`, `not`

*   sort string 
Sort results by a field, with optional + (asc) or - (desc) prefix

pattern = "^[+-]?(createdAt|updatedAt|columnName)$"

### Path Parameters

*   storeId string

Required  
The id of the change store.

### Responses

GET /api/analytics/change-stores/{storeId}/editable-columns

`// qlik-api has not implemented support for `GET /api/analytics/change-stores/{storeId}/editable-columns` yet.// In the meantime, you can use fetch like this:const response = await fetch(  '/api/analytics/change-stores/{storeId}/editable-columns',  {    method: 'GET',    headers: {      'Content-Type': 'application/json',    },  },)`

### Example Response

`{  "totalCount": 10,  "currentPageCount": 2,  "links": {    "next": {      "href": "https://example.org/api/analytics/change-stores?page=<next-cursor>"    },    "prev": {      "href": "https://example.org/api/analytics/change-stores?page=<previous-cursor>"    },    "self": {      "href": "https://example.org/api/analytics/change-stores?page=<self-cursor>"    }  },  "data": [    {      "id": "6835b0135cf7147c01979e5d",      "type": "editable-text",      "config": {        "maxDate": "2025-12-31",        "minDate": "2025-01-01",        "selectorType": "fixed",        "selectorValues": [          {            "label": "label1",            "value": "value1"          }        ],        "selectorExpression": "BEL~Belgium|DNK~Denmark|SWE~Sweden"      },      "usedBy": [        {          "appId": "af604296-14f6-48c2-8bac-12ce49ba83cc",          "chartId": "chartId"        }      ],      "spaceId": "6835b0135cf7147c01979e5d",      "storeId": "507f1f77bcf86cd799439011",      "tenantId": "tenantID",      "createdAt": "2025-05-27T12:29:07.178Z",      "createdBy": "testUser",      "updatedAt": "0001-01-01T00:00:00Z",      "columnName": "Price4",      "referenceId": "6835b0135cf7147c01979e5d",      "publishRefId": "6835b0135cf7147c01979e5d",      "selectorValues": [        {          "label": "label1",          "value": "value1"        }      ]    }  ]}`