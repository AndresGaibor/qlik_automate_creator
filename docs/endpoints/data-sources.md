---
title: "Data sources REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/data-sources/"
local_path: "docs/endpoints/data-sources.md"
---

Title: Data sources REST | Qlik Developer Portal


Gets the list of data sources available on the node.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Query Parameters

*   dataSourceId string 
Filtering on datasourceID, when multiple dataSourceId are set in query, last dataSourceId will be used

*   detail boolean 
Determines if provider detail is returned

*   includeDisabled boolean 
When true, disabled datasources are also included in the response

*   includeui boolean 
Determines if UI info is returned

### Responses

GET /api/v1/data-sources

`import { createQlikApi } from '@qlik/api'const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})await qlik.dataSources.getDataSources({})`

`qlik data-source ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/data-sources" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "dataSources": [    {      "name": "Qlik® REST Connector",      "uiInfo": {        "iframe": true,        "selectUrl": "/customdata/64/QvRestConnector/web/standalone/select-dialog.html",        "connectUrl": "/customdata/64/QvRestConnector/web/standalone/connect-dialog.html",        "iconRectUrl": "/customdata/64/QvRestConnector/web/Icons/rest.png",        "iconSquareUrl": "/customdata/64/QvRestConnector/web/Icons/rest-square.png",        "credentialsUrl": "/customdata/64/QvRestConnector/web/standalone/credentials-dialog.html",        "connectorMainUrl": "/customdata/64/QvRestConnector/web/connector-main-iframe.js",        "loadModelSupport": "false"      },      "disabled": true,      "provider": "QvRestConnector.exe",      "capabilities": [        "datasource-specific-capabity"      ],      "dataSourceId": "rest",      "providerName": "Qlik® REST Connector",      "qriDefinition": {        "itemPart": {          "prefix": "#",          "template": "{schema}.{table}",          "properties": [            "schema"          ]        },        "pathPart": {          "prefix": "#",          "template": "{schema}.{table}",          "properties": [            "schema"          ]        },        "qriPrefix": "qri:db:sap-sql://",        "connectionPart": {          "template": "{schema}.{table}",          "properties": [            "schema"          ]        }      },      "dataSourceType": "connector",      "dataLoadUrlOverride": "ml-endpoints:50055",      "dataSourcePropertyName": "sourceType"    }  ],  "lastUpdated": "2023-11-03T15:45:14.195Z",  "connectorNodes": [    {      "url": "localhost:50060",      "state": "READY",      "contractType": 2,      "providerName": "Qlik® REST Connector",      "cachedDataSources": [        "rest"      ],      "dataSourcesUpdated": "true"    }  ]}`

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Path Parameters

*   dataSourceId string

Required  
Datasource ID

### Responses

GET /api/v1/data-sources/{dataSourceId}/api-specs

`import { createQlikApi } from '@qlik/api'const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})await qlik.dataSources.getDataSourceApiSpecs(  'rest',)`

`qlik data-source connection-properties 'rest'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/data-sources/{dataSourceId}/api-specs" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "connectorVersion": "1.180.0",  "connectorProvider": "QvRestConnector.exe",  "connectionProperties": "{\"property1\": \"value\", \"property2\": \"value2\"}"}`

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Query Parameters

*   forceRefresh boolean 
Force to get a refreshed list from backend. Cached list will be returned if not set or set to false.

### Path Parameters

*   dataSourceId string

Required  
Datasource ID

### Responses

GET /api/v1/data-sources/{dataSourceId}/gateways

`import { createQlikApi } from '@qlik/api'const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})await qlik.dataSources.getDataSourceGateways(  'rest',  {},)`

`qlik data-source list-gateways 'rest'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/data-sources/{dataSourceId}/gateways" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "gateways": [    {      "id": "051YTx0OGDlfQ_66H3NyXwK24HEEyyJI::a6CxFtkInvsJnrNXCOVWR8pQOwaphpU0",      "name": "MyGateway",      "default": true    }  ],  "refreshedAt": "2024-01-18T02:25:59.521Z"}`

Retrieves the settings for a data source.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Path Parameters

*   dataSourceId string

Required  
Datasource ID

### Responses

GET /api/v1/data-sources/{dataSourceId}/settings

`// qlik-api has not implemented support for `GET /api/v1/data-sources/{dataSourceId}/settings` yet.// In the meantime, you can use fetch like this:const response = await fetch(  '/api/v1/data-sources/{dataSourceId}/settings',  {    method: 'GET',    headers: {      'Content-Type': 'application/json',    },  },)`

`qlik data-source settings get 'rest'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/data-sources/{dataSourceId}/settings" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "disabled": false}`

Updates the settings for a data source.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   dataSourceId string

Required  
Datasource ID

### Request Body

Required

### Responses

PUT /api/v1/data-sources/{dataSourceId}/settings

`// qlik-api has not implemented support for `PUT /api/v1/data-sources/{dataSourceId}/settings` yet.// In the meantime, you can use fetch like this:const response = await fetch(  '/api/v1/data-sources/{dataSourceId}/settings',  {    method: 'PUT',    headers: {      'Content-Type': 'application/json',    },    body: JSON.stringify({ disabled: false }),  },)`

`qlik data-source settings update 'rest' \  --disabled false`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/data-sources/{dataSourceId}/settings" \-X PUT \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"disabled":false}'`

### Example Response

`{  "disabled": false}`