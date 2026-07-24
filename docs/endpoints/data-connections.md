---
title: "Data connections REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/data-connections/"
local_path: "docs/endpoints/data-connections.md"
---

Title: Data connections REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/data-connections/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Data connections

*   [Gets a list of connections](https://qlik.dev/apis/rest/data-connections/#get-api-v1-data-connections "Gets a list of connections")
*   [Creates a new connection. Depending on the fields defined in the request body, credentials embedded (or associated) in the connection can be updated or created.](https://qlik.dev/apis/rest/data-connections/#post-api-v1-data-connections "Creates a new connection. Depending on the fields defined in the request body, credentials embedded (or associated) in the connection can be updated or created.")
*   [Retrieves a connection by connection ID, or by name when the query parameter "type" is set to "connectionname."](https://qlik.dev/apis/rest/data-connections/#get-api-v1-data-connections-qID "Retrieves a connection by connection ID, or by name when the query parameter \"type\" is set to \"connectionname.\"")
*   [Patches a connection specified by connection ID (or by name when type=connectionname is set in query).](https://qlik.dev/apis/rest/data-connections/#patch-api-v1-data-connections-qID "Patches a connection specified by connection ID (or by name when type=connectionname is set in query).")
*   [Updates a connection specified by connection ID (or by name when type=connectionname is set in query). Depends on the fields defined in the request body, credentials embedded (or associated) in the connection can be updated or created.](https://qlik.dev/apis/rest/data-connections/#put-api-v1-data-connections-qID "Updates a connection specified by connection ID (or by name when type=connectionname is set in query). Depends on the fields defined in the request body, credentials embedded (or associated) in the connection can be updated or created.")
*   [Deletes the specified data connection by ID (or by name when type=connectionname is set in query)](https://qlik.dev/apis/rest/data-connections/#delete-api-v1-data-connections-qID "Deletes the specified data connection by ID (or by name when type=connectionname is set in query)")
*   [Delete multiple connections, only available to Admin](https://qlik.dev/apis/rest/data-connections/#post-api-v1-data-connections-actions-delete "Delete multiple connections, only available to Admin")
*   [Duplicate a connection](https://qlik.dev/apis/rest/data-connections/#post-api-v1-data-connections-actions-duplicate "Duplicate a connection")
*   [Update multiple connections, only available to Admin. When update is to change ownership of a connection, the credentials associated with the connection will NOT be transferred to the new owner, and new owner is expected to provide their own credentials for the connection.](https://qlik.dev/apis/rest/data-connections/#post-api-v1-data-connections-actions-update "Update multiple connections, only available to Admin. When update is to change ownership of a connection, the credentials associated with the connection will NOT be transferred to the new owner, and new owner is expected to provide their own credentials for the connection.")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/data-connections.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Data connections

[Download OpenAPI spec](https://qlik.dev/specs/rest/data-connections.json)

Data connections let Qlik Cloud Analytics apps and Data Integration projects connect to external data sources. The [data-credentials](https://qlik.dev/apis/rest/data-credentials/) API manages credentials for connections.

For a guided introduction, see [Data connections](https://qlik.dev/manage/data-connections/).

## [](https://qlik.dev/apis/rest/data-connections/#connection-update-restrictions) Connection update restrictions

The `PATCH /api/v1/data-connections/{qID}` endpoint enforces the following validation rules. Requests that violate any rule return HTTP 400.

| Rule | Details |
| --- | --- |
| Field exclusivity | A request body cannot include both `qConnectStatement` and `connectionProperties` fields. |
| Credentials required on connection-string change | A request that patches `qConnectStatement` must include credentials (`/qPassword` or the datasource password property in `connectionProperties`). |
| Credentials required on host change | A request that patches `connectionProperties/host`, `connectionProperties/server`, or `connectionProperties/url` to a new value must include credentials. |
| Single credential form | A request cannot supply credentials in both `/qPassword` and `connectionProperties/{password-field}` simultaneously. |

Also, when a successful PATCH changes the host of a connection that uses separate credentials, the API automatically deassociates any previously associated credentials.

For request examples and further guidance, see [Update data connections](https://qlik.dev/manage/data-connections/update-data-connections/).

## Endpoints

*   [GET /api/v1/data-connections](https://qlik.dev/apis/rest/data-connections/#get-api-v1-data-connections)
*   [POST /api/v1/data-connections](https://qlik.dev/apis/rest/data-connections/#post-api-v1-data-connections)
*   [GET /api/v1/data-connections/{qID}](https://qlik.dev/apis/rest/data-connections/#get-api-v1-data-connections-qID)
*   [PATCH /api/v1/data-connections/{qID}](https://qlik.dev/apis/rest/data-connections/#patch-api-v1-data-connections-qID)
*   [PUT /api/v1/data-connections/{qID}](https://qlik.dev/apis/rest/data-connections/#put-api-v1-data-connections-qID)
*   [DELETE /api/v1/data-connections/{qID}](https://qlik.dev/apis/rest/data-connections/#delete-api-v1-data-connections-qID)
*   [POST /api/v1/data-connections/actions/delete](https://qlik.dev/apis/rest/data-connections/#post-api-v1-data-connections-actions-delete)
*   [POST /api/v1/data-connections/actions/duplicate](https://qlik.dev/apis/rest/data-connections/#post-api-v1-data-connections-actions-duplicate)
*   [POST /api/v1/data-connections/actions/update](https://qlik.dev/apis/rest/data-connections/#post-api-v1-data-connections-actions-update)

## [](https://qlik.dev/apis/rest/data-connections/#get-api-v1-data-connections)Gets a list of connections

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Query Parameters

*   dataName string   Provides an alternate name to be used for data[] element in GET response. 
*   extended boolean   Returns extended list of properties (e.g. encrypted credential string) when set to true. 
*   spaceId string   Filtering on connections by space ID 
*   personal boolean   Filtering on personal connections, ignored if spaceId is defined in same request 
*   owner string   Filtering on datafile connections by owner (i.e. app) ID. 
*   ownedByMe boolean   Filtering on connections, return connections owned by the caller if set to true (doesn't apply to datafiles connections) 
*   limit integer   Number of resources to be returned (between 1 and 100) 
minimum = 1,  maximum = 100,  default = All resources will be returned if limit is not defined,  format = int32,  default = All resources will be returned if limit is not defined

*   sort string   Name of field sort on for pagination, with prefix with + or - indicating ascending or descending order. When used for data-connections, sort field only applies to non-datafiles connections. Whatever sorting order is, datafiles connections will be returned after all regular connections being returned. 
*   page string   Pagination cursor string, which is generated automatically in previous pagination query. 
*   noDatafiles boolean   Datafiles connections will not be returned if set to true 
*   userId string   Filtering on userId. Requires admin role if specified userId doesn't match that is defined in JWT. 
*   caseinsensitive boolean   Sort results will be returned in case insensitive order if set to true (Only used along with sort query) 
*   locale string   ICU locale ID, used only when caseinsensitive is set to true, default to 'en' if undefined 
*   includeQris boolean   Base Qri (encrypted) will be returned when the query is set to true, default is false 
*   filter string   Filtering resources by properties (filterable properties only) using SCIM filter string. Note the filter string only applies to connections managed by data-connections service, i.e. filtering doesn't apply to DataFile connections. When filtering on datetime property (e.g. created, updated), datetime should be in RFC3339 format. 
*   includeDisabled boolean   Includes connections that uses disabled datasources 

### Responses

#### 200

List connections with optional filter queries. Connections will be filtered internally based on the space access rules applicable to the caller. When some of connections are not returned due to errors, errors array in the response will be set.

*   application/json object   

Show application/json properties 

    *   data array of objects   Essential fields of a connection 

Show data properties 

        *   qID string Required   Unique identifier (UUID) for the data connection, must be same as qEngineObjectID 
        *   qri string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   Encrypted base Qri string (filterable using SCIM filter, e.g. filter='qri co "snowflake"') 
        *   tags array of strings   List of tags attached to the connection 
        *   user string   User ID of the connection's creator 
        *   links object Required   

Show links properties 

            *   self object Required   Link to current query 

Show self properties 

                *   href string Required   URL pointing to the resource 

        *   qName string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   Descriptive name of the data connection 
        *   qType string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   Type of connection, i.e. provider type of underlying connector 
        *   space string   ID of the space to which the connection belongs 
        *   qLogOn integer Required   Indicates the type of user associated with the data connection 
Can be one of: 0 1

        *   tenant string Required   Tenant ID of the connection's creator 
        *   created string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   Datetime when the connection was created 
        *   updated string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   Datetime when the connection was last updated 
        *   privileges array of strings Required   Array of string (i.e. update, delete, read) indicating the user's privileges on the associated connection 
Values may be any of: "list""update""delete""read""change_owner""change_space"

        *   datasourceID string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   Data source ID 
        *   qArchitecture integer Required   

            1.   or 1 value indicating whether the data connector is 64-bit (0) or 32-bit (1). Defaults to 0 if not specified.

Can be one of: 0 1

        *   qCredentialsID string   ID of the credential associated with the connection 
        *   qEngineObjectID string Required   Unique identifier (UUID) for the data connection, must be same as qID 
        *   qConnectStatement string Required   Connection string for the data connection 
        *   qConnectionSecret string   String that contains connection specific secret (or password). This field will not be included in response of GET /data-connections, will only be included in the response of GET /data-connections/{qID} 
        *   connectionProperties object   List of connection parsed from connection string (only available when query parseConnection=true is set) 
        *   qSeparateCredentials boolean   Indicates whether or not this is a credential-less connection 

    *   meta object   

Show meta properties 

        *   count integer   Total count of resources being requested. 

    *   links object   

Show links properties 

        *   next object   URL link to next page of requested resources (available to paged request only) 

Show next properties 

            *   href string Required   URL pointing to the next page of resources 

        *   prev object   URL link to previous page of requested resources (available to paged request only) 

Show prev properties 

            *   href string Required   URL pointing to the previous page of resources 

        *   self object Required   Link to current query 

Show self properties 

            *   href string Required   URL pointing to the resource 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

#### 400

Bad request, typically when dataName is empty

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

#### 500

Internal error, this happens when the service fails to make requests to dependency services

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

#### 502

Bad gateway, this happens when requests to required (dependent) services time out

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

 GET /api/v1/data-connections

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.dataConnections.getDataConnections({})
```

`qlik data-connection ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/data-connections" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "data": [    {      "qID": "a7eb530e-475a-4864-bc12-dacf4b081e72",      "qri": "qri:db:snowflake://BQ1-3F_BvWfxxCDDiz9vQepqHLAcHWqacoqwLq4wxWM",      "tags": "[\"tag1, \"tag2\"]",      "user": "rFdHeUOiVYgPX5iTbvL0x0Cs6F62QI",      "links": {        "self": {          "href": "https://mytenant.us.qlikcloud.com/..."        }      },      "qName": "MyConnection",      "qType": "QvOdbcConnectorPackage.exe",      "space": "6226583d53a69876774d4f96",      "qLogOn": 1,      "tenant": "xqFQ0k34vSR0d9G7J-vZtHZQkiYrCqc8",      "created": "2022-04-08T10:00:28.287Z",      "updated": "2022-04-09T10:00:28.287Z",      "privileges": "[update, delete, read]",      "datasourceID": "sfdc",      "qArchitecture": 0,      "qCredentialsID": "a4e00184-8743-4a44-a1a8-07bba573afea",      "qEngineObjectID": "a7eb530e-475a-4864-bc12-dacf4b081e72",      "qConnectStatement": "CUSTOM CONNECT TO \\\"provider=QvOdbcConnectorPackage.exe;driver=snowflake;server=...\\\"",      "qConnectionSecret": "Connection_Specific_Secret",      "connectionProperties": "{\"property1\": \"value\", \"property2\": \"value\"}",      "qSeparateCredentials": true    }  ],  "meta": {    "count": 12  },  "links": {    "next": {      "href": "https://mytenant.us.qlikcloud.com/..."    },    "prev": {      "href": "https://mytenant.us.qlikcloud.com/..."    },    "self": {      "href": "https://mytenant.us.qlikcloud.com/.../0e445014-a564-496a-9a8d-28baadcc3ef9"    }  },  "errors": [    {      "code": "DCERROR-0010",      "title": "Bad or invalid request",      "detail": "Field xxx is missing in the request",      "status": 400    }  ]}`

## [](https://qlik.dev/apis/rest/data-connections/#post-api-v1-data-connections)Creates a new connection. Depending on the fields defined in the request body, credentials embedded (or associated) in the connection can be updated or created.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

*   application/json object   

One of:
    *   ConnectionCreate object   Schema used to create a connection with given connection string (i.e. qConnectStatement) along with other metadata 

Show ConnectionCreate properties 

        *   qID string   Unique identifier (UUID) for the data connection. A UUID will be generated automatically if qID is not specified or empty 
        *   tags array of strings   List of tags attached to the connection (allow max 32 tags) 
        *   owner string   App ID 
        *   qName string Required   Descriptive name of the data connection 
        *   qType string Required   Type of connection - indicates connection provider type 
        *   space string   ID of the space to which the connection belongs 
        *   qLogOn string   Indicates the type of user associated with the data connection. 
Can be one of: "0""1""LOG_ON_SERVICE_USER""LOG_ON_CURRENT_USER"

        *   qPassword string   Any logon password associated with the data connection (connector encoded) 
        *   qUsername string   Any logon username associated with the data connection 
        *   datasourceID string Required   ID of the datasource associated with this connection 
        *   qriInRequest string   QRI string of the connection. The string will be persisted to mongo when the request is originated from trusted client (i.e. dcaas) to avoid invalid QRi string. 
        *   qArchitecture integer   

            1.   or 1 value indicating whether the data connector is 64-bit (0) or 32-bit (1). Defaults to 0 if not specified.

Can be one of: 0 1

        *   qCredentialsID string   ID of the credential associated with the connection 
        *   qEngineObjectID string   Unique identifier (UUID) for the data connection as specified by the Sense engine. A UUID will be generated automatically if this field is not specified or empty 
        *   qCredentialsName string   Name of the credential associated with the connection 
        *   qConnectStatement string Required   Connection string for the data connection 
        *   qConnectionSecret string   String that contains connection specific secret (or password) that requires encryption before persist to database. This field is connection level secret 
        *   qSeparateCredentials boolean   Indicates whether or not to create a credential-less connection 
default = false

    *   DcaasConnectionCreate object   Schema used to create a connection using a list of connection properties for given datasource 

Show DcaasConnectionCreate properties 

        *   tags array of strings   List of tags attached to the connection (allow max 31 tags) 
        *   qName string Required   Descriptive name of the data connection 
        *   space string   ID of the space in which the connection shall be created. Connection will be created in user's personal space if undefined 
        *   authUrlOnly boolean   When set to true, only authentication URL will be returned (i.e. no connection will be created) if datasource supports OAuth, and other properties set in the request will ignored. This property will be ignored if the request is not OAuth or datasource doesn't support OAuth 
        *   datasourceID string Required   ID of the datasource of the connection 
        *   connectionProperties object Required   Connection properties required to create dataconnection for the given datasource, which is defined by the response of 'GET /v1/data-sources/:{datasourceId}/api-specs' 

### Responses

#### 201

Data connection created

*   application/json object   

One of:
    *   ConnectionCreateResponse object   Essential fields of a connection 

Show ConnectionCreateResponse properties 

        *   qID string Required   Unique identifier (UUID) for the data connection, must be same as qEngineObjectID 
        *   user string   User ID of the connection's creator 
        *   links object   

Show links properties 

            *   self object Required   Link to current query 

Show self properties 

                *   href string Required   URL pointing to the resource 

        *   qName string Required   Descriptive name of the data connection 
        *   qType string Required   Type of connection - indicates connection provider type 
        *   space string   ID of the space to which the connection belongs 
        *   qLogOn string Required   Indicates the type of user associated with the data connection. 
Can be one of: "0""1""LOG_ON_SERVICE_USER""LOG_ON_CURRENT_USER"

        *   created string   Datetime when the connection was created 
        *   updated string   Datetime when the connection was last updated 
        *   privileges array of strings Required   Array of string (i.e. update, delete, read) indicating the user's privileges on the associated connection 
Values may be any of: "list""update""delete""read""change_owner""change_space"

        *   qArchitecture integer Required   

            1.   or 1 value indicating whether the data connector is 64-bit (0) or 32-bit (1). Defaults to 0 if not specified.

Can be one of: 0 1

        *   qReferenceKey string   Reference key of credential in redis 
        *   qCredentialsID string   ID of the credential associated with the connection 
        *   qEngineObjectID string Required   Unique identifier (UUID) for the data connection, must be same as qID 
        *   qCredentialsName string   Name of the credential associated with the connection 
        *   qConnectStatement string Required   Connection string for the data connection 
        *   qSeparateCredentials boolean Required   Indicates whether or not this is a credential-less connection 

    *   DcaasConnectionCreateAuthResponse object   Authentication URL response for OAuth datasources (when authUrlOnly is set to true in request) 

Show DcaasConnectionCreateAuthResponse properties 

        *   authUrl string Required   Authentication URL used to generate authentication code for datasources supporting OAuth 

#### 400

Invalid data connection specified

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

#### 403

User has no access to the connection or space

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

#### 404

Credentials referenced by qCredentialsID in the request body could not be found

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

#### 409

Data connection already exists

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

 POST /api/v1/data-connections

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.dataConnections.createDataConnection({  qID: 'b4a949cb-3aaf-4cd5-a140-dd3ea34f0d28',  tags: '["tag1, "tag2"]',  owner: '928e2a66-01ba-4678-aa32-e74c213896fa',  qName: 'MyConnection',  qType: 'QvOdbcConnectorPackage.exe',  space: '611bcebaeec1203d88211ac4',  qLogOn: '1',  qPassword: 'Connector encoded password',  qUsername: 'MyUsername',  datasourceID: 'snowflake',  qriInRequest:    'qri:db:snowflake://BQ1-3F_BvWfxxCDDiz9vQepqHLAcHWqacoqwLq4wxWM',  qArchitecture: 0,  qCredentialsID:    '935ec250-65bc-47c0-965b-53554f3f87d8',  qEngineObjectID:    'b4a949cb-3aaf-4cd5-a140-dd3ea34f0d28',  qCredentialsName: 'MyCredential',  qConnectStatement:    'CUSTOM CONNECT TO \\"provider=QvOdbcConnectorPackage.exe;driver=snowflake;server=...\\"',  qConnectionSecret:    'Any connection specific secret string',  qSeparateCredentials: false,})
```

`qlik data-connection create \  --qConnectStatement 'CUSTOM CONNECT TO \"provider=QvOdbcConnectorPackage.exe;driver=snowflake;server=...\"' \  --qType 'QvOdbcConnectorPackage.exe' \  --connectionProperties`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/data-connections" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"qID":"b4a949cb-3aaf-4cd5-a140-dd3ea34f0d28","tags":"[\"tag1, \"tag2\"]","owner":"928e2a66-01ba-4678-aa32-e74c213896fa","qName":"MyConnection","qType":"QvOdbcConnectorPackage.exe","space":"611bcebaeec1203d88211ac4","qLogOn":"1","qPassword":"Connector encoded password","qUsername":"MyUsername","datasourceID":"snowflake","qriInRequest":"qri:db:snowflake://BQ1-3F_BvWfxxCDDiz9vQepqHLAcHWqacoqwLq4wxWM","qArchitecture":0,"qCredentialsID":"935ec250-65bc-47c0-965b-53554f3f87d8","qEngineObjectID":"b4a949cb-3aaf-4cd5-a140-dd3ea34f0d28","qCredentialsName":"MyCredential","qConnectStatement":"CUSTOM CONNECT TO \\\"provider=QvOdbcConnectorPackage.exe;driver=snowflake;server=...\\\"","qConnectionSecret":"Any connection specific secret string","qSeparateCredentials":false}'`

### Example Response

`{  "qID": "b4a949cb-3aaf-4cd5-a140-dd3ea34f0d28",  "user": "rFdHeUOiVYgPX5iTbvL0x0Cs6F62QI",  "links": {    "self": {      "href": "https://mytenant.us.qlikcloud.com/..."    }  },  "qName": "MyConnection",  "qType": "QvOdbcConnectorPackage.exe",  "space": "611bcebaeec1203d88211ac4",  "qLogOn": "1",  "created": "2022-04-09T10:00:28.287Z",  "updated": "2022-04-09T10:00:28.287Z",  "privileges": "[update, delete, read]",  "qArchitecture": 0,  "qReferenceKey": "credential:key",  "qCredentialsID": "7b475581-2f68-4c81-ac52-25705b8229fb",  "qEngineObjectID": "b4a949cb-3aaf-4cd5-a140-dd3ea34f0d28",  "qCredentialsName": "MyCredential",  "qConnectStatement": "CUSTOM CONNECT TO \\\"provider=QvOdbcConnectorPackage.exe;driver=snowflake;server=...\\\"",  "qSeparateCredentials": true}`

## [](https://qlik.dev/apis/rest/data-connections/#get-api-v1-data-connections-qID)Retrieves a connection by connection ID, or by name when the query parameter "type" is set to "connectionname."

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Query Parameters

*   extended boolean   Returns extended list of properties (e.g. encrypted credential string) when set to true. 
*   type string   The connection ID in the path becomes a connection name when this query parameter is set. 
Can be one of: "connectionname"

*   credentialId string   Credential ID 
*   byCredentialName boolean   If set to true, credentialId in the query will be interpreted as credential's name 
*   spaceId string   Filtering on connections by space ID 
*   noCache boolean   datafiles connections will be returned from cache by default (if data-connections is configured to use cache), this query parameter is used disable this default behavior, e.g. return an update-to-date datafiles connection if the query is set to true 
*   parseConnection boolean   List of connection properties shall be returned when the query is set to true, default is false 

### Path Parameters

*   qID string Required   Connection ID 

### Responses

#### 200

Data connection retrieved

*   application/json object   Essential fields of a connection 

Show application/json properties 

    *   qID string Required   Unique identifier (UUID) for the data connection, must be same as qEngineObjectID 
    *   qri string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   Encrypted base Qri string (filterable using SCIM filter, e.g. filter='qri co "snowflake"') 
    *   tags array of strings   List of tags attached to the connection 
    *   user string   User ID of the connection's creator 
    *   links object Required   

Show links properties 

        *   self object Required   Link to current query 

Show self properties 

            *   href string Required   URL pointing to the resource 

    *   qName string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   Descriptive name of the data connection 
    *   qType string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   Type of connection, i.e. provider type of underlying connector 
    *   space string   ID of the space to which the connection belongs 
    *   qLogOn integer Required   Indicates the type of user associated with the data connection 
Can be one of: 0 1

    *   tenant string Required   Tenant ID of the connection's creator 
    *   created string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   Datetime when the connection was created 
    *   updated string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   Datetime when the connection was last updated 
    *   privileges array of strings Required   Array of string (i.e. update, delete, read) indicating the user's privileges on the associated connection 
Values may be any of: "list""update""delete""read""change_owner""change_space"

    *   datasourceID string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   Data source ID 
    *   qArchitecture integer Required   

        1.   or 1 value indicating whether the data connector is 64-bit (0) or 32-bit (1). Defaults to 0 if not specified.

Can be one of: 0 1

    *   qCredentialsID string   ID of the credential associated with the connection 
    *   qEngineObjectID string Required   Unique identifier (UUID) for the data connection, must be same as qID 
    *   qConnectStatement string Required   Connection string for the data connection 
    *   qConnectionSecret string   String that contains connection specific secret (or password). This field will not be included in response of GET /data-connections, will only be included in the response of GET /data-connections/{qID} 
    *   connectionProperties object   List of connection parsed from connection string (only available when query parseConnection=true is set) 
    *   qSeparateCredentials boolean   Indicates whether or not this is a credential-less connection 

#### 400

The qID is not a valid UUID

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

#### 403

User has no access to the connection or space

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

#### 404

Data connection not found

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

#### 500

Credential decryption failed, likely due to invalid credentials

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

 GET /api/v1/data-connections/{qID}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.dataConnections.getDataConnection(  '82ee7b44-0c4d-491b-bd38-82640c0430a5',  {},)
```

`qlik data-connection get '82ee7b44-0c4d-491b-bd38-82640c0430a5'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/data-connections/{qID}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "qID": "a7eb530e-475a-4864-bc12-dacf4b081e72",  "qri": "qri:db:snowflake://BQ1-3F_BvWfxxCDDiz9vQepqHLAcHWqacoqwLq4wxWM",  "tags": "[\"tag1, \"tag2\"]",  "user": "rFdHeUOiVYgPX5iTbvL0x0Cs6F62QI",  "links": {    "self": {      "href": "https://mytenant.us.qlikcloud.com/..."    }  },  "qName": "MyConnection",  "qType": "QvOdbcConnectorPackage.exe",  "space": "6226583d53a69876774d4f96",  "qLogOn": 1,  "tenant": "xqFQ0k34vSR0d9G7J-vZtHZQkiYrCqc8",  "created": "2022-04-08T10:00:28.287Z",  "updated": "2022-04-09T10:00:28.287Z",  "privileges": "[update, delete, read]",  "datasourceID": "sfdc",  "qArchitecture": 0,  "qCredentialsID": "a4e00184-8743-4a44-a1a8-07bba573afea",  "qEngineObjectID": "a7eb530e-475a-4864-bc12-dacf4b081e72",  "qConnectStatement": "CUSTOM CONNECT TO \\\"provider=QvOdbcConnectorPackage.exe;driver=snowflake;server=...\\\"",  "qConnectionSecret": "Connection_Specific_Secret",  "connectionProperties": "{\"property1\": \"value\", \"property2\": \"value\"}",  "qSeparateCredentials": true}`

## [](https://qlik.dev/apis/rest/data-connections/#patch-api-v1-data-connections-qID)Patches a connection specified by connection ID (or by name when type=connectionname is set in query).

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Header Parameters

*   qlik-auth-code string   OAuth authentication code. This header is required by certain datasources when patching a data connection. 

### Query Parameters

*   type string   The connection ID in the path becomes a connection name when this query parameter is set. 
Can be one of: "connectionname"

### Path Parameters

*   qID string Required   Connection ID 

### Request Body

Required

*   application/json array of objects   

Show application/json properties 

    *   op string Required   Operation type 
Can be one of: "add""replace""remove"

    *   path string Required   Path to the target field to be patched 
    *   value string|boolean|integer|array   Value used for the patch. Required only for `add` or `replace` operations. The value type should match the type of the target field. 

One of:
        *   string   
        *   boolean   
        *   integer   
        *   array   

### Responses

#### 204

Data connection updated successfully

#### 400

Bad request due to invalid data in body

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

#### 403

User has no access to the connection or space

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

#### 404

Data connection not found

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

#### 409

Data connection already exists (when updated name conflicts with existing record)

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

 PATCH /api/v1/data-connections/{qID}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.dataConnections.patchDataConnection(  '82ee7b44-0c4d-491b-bd38-82640c0430a5',  {},  [    {      op: 'add',      path: '/qName',      value: 'New value',    },  ],)
```

`qlik data-connection patch '82ee7b44-0c4d-491b-bd38-82640c0430a5' \  --op 'add' \  --path '/qName'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/data-connections/{qID}" \-X PATCH \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '[{"op":"add","path":"/qName","value":"New value"}]'`

## [](https://qlik.dev/apis/rest/data-connections/#put-api-v1-data-connections-qID)Updates a connection specified by connection ID (or by name when type=connectionname is set in query). Depends on the fields defined in the request body, credentials embedded (or associated) in the connection can be updated or created.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Query Parameters

*   type string   The connection ID in the path becomes a connection name when this query parameter is set. 
Can be one of: "connectionname"

*   spaceId string   Filtering on connections by space ID 

### Path Parameters

*   qID string Required   Connection ID 

### Request Body

Required

*   application/json object   

Show application/json properties 

    *   qID string Required   Unique identifier for the data connection 
    *   qName string Required   Descriptive name of the data connection 
    *   qType string Required   Type of connection - indicates connection provider type 
    *   space string   ID of the space to which the connection belongs 
    *   qLogOn string   Indicates the type of user associated with the data connection. 
Can be one of: "0""1""LOG_ON_SERVICE_USER""LOG_ON_CURRENT_USER"

    *   qPassword string   Any logon password associated with the data connection 
    *   qUsername string   Any logon username associated with the data connection 
    *   datasourceID string   ID of the datasource associated with this connection 
    *   qArchitecture integer   

        1.   or 1 value indicating whether the data connector is 64-bit (0) or 32-bit (1). Defaults to 0 if not specified.

Can be one of: 0 1

    *   qCredentialsID string   ID of the credential associated with the connection 
    *   qEngineObjectID string Required   Unique identifier for the data connection as specified by the Sense engine 
    *   qCredentialsName string   Name of the credential associated with the connection 
    *   qConnectStatement string Required   Connection string for the data connection 
    *   qConnectionSecret string   String that contains connection level secret (or password). If this field presents in request, then existing connection secret will be updated to its value. If is an empty string, then existing connection secret will be cleared. If this field is missing, existing secret will not be updated. 
    *   qSeparateCredentials boolean   Indicates whether or not this is a credential-less connection 

### Responses

#### 204

Data connection updated successfully

#### 400

Bad request due to invalid data in body

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

#### 403

User has no access to the connection or space

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

#### 404

Data connection not found

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

#### 409

Data connection already exists (when updated name conflicts with existing record)

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

 PUT /api/v1/data-connections/{qID}

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `PUT /api/v1/data-connections/{qID}` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/v1/data-connections/{qID}',  {    method: 'PUT',    headers: {      'Content-Type': 'application/json',    },    body: JSON.stringify({      qID: '55e13286-fbd8-4a59-a10d-807937a97443',      qName: 'MyConnection',      qType: 'snowflake',      space: '611bcebaeec1203d88211ac4',      qLogOn: '1',      qPassword: 'password',      qUsername: 'MyUsername',      datasourceID: 'snowflake',      qArchitecture: 1,      qCredentialsID:        'cea94172-fa83-47c8-8171-b6f151918ad0',      qEngineObjectID:        '55e13286-fbd8-4a59-a10d-807937a97443',      qCredentialsName: 'CredentialName',      qConnectStatement:        'CUSTOM CONNECT TO \\"provider=QvOdbcConnectorPackage.exe;driver=snowflake;server=...\\"',      qConnectionSecret:        'connection specific secret string',      qSeparateCredentials: true,    }),  },)
```

`# qlik-cli has not implemented support for PUT /api/v1/data-connections/{qID} yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/data-connections/{qID}" \-X PUT \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"qID":"55e13286-fbd8-4a59-a10d-807937a97443","qName":"MyConnection","qType":"snowflake","space":"611bcebaeec1203d88211ac4","qLogOn":"1","qPassword":"password","qUsername":"MyUsername","datasourceID":"snowflake","qArchitecture":1,"qCredentialsID":"cea94172-fa83-47c8-8171-b6f151918ad0","qEngineObjectID":"55e13286-fbd8-4a59-a10d-807937a97443","qCredentialsName":"CredentialName","qConnectStatement":"CUSTOM CONNECT TO \\\"provider=QvOdbcConnectorPackage.exe;driver=snowflake;server=...\\\"","qConnectionSecret":"connection specific secret string","qSeparateCredentials":true}'`

## [](https://qlik.dev/apis/rest/data-connections/#delete-api-v1-data-connections-qID)Deletes the specified data connection by ID (or by name when type=connectionname is set in query)

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Query Parameters

*   type string   The connection ID in the path becomes a connection name when this query parameter is set. 
Can be one of: "connectionname"

*   spaceId string   Filtering on connections by space ID 

### Path Parameters

*   qID string Required   Connection ID 

### Responses

#### 204

Data connection deleted successfully

#### 403

User has no access to the connection or space

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

#### 404

Data connection not found

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

 DELETE /api/v1/data-connections/{qID}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.dataConnections.deleteDataConnection(  '82ee7b44-0c4d-491b-bd38-82640c0430a5',  {},)
```

`qlik data-connection rm '82ee7b44-0c4d-491b-bd38-82640c0430a5'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/data-connections/{qID}" \-X DELETE \-H "Authorization: Bearer <access_token>"`

## [](https://qlik.dev/apis/rest/data-connections/#post-api-v1-data-connections-actions-delete)Delete multiple connections, only available to Admin

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

*   application/json object   

Show application/json properties 

    *   connections array of objects Required   

Show connections properties 

        *   id string Required   ID of connection 
        *   name string   Connection name 

### Responses

#### 207

Bulk delete completed

*   application/json object   

Show application/json properties 

    *   data array of objects   

Show data properties 

        *   id string Required   ID of the resource 
        *   error object   

Show error properties 

            *   code string   Unique internal error code 
            *   title string   A summary in english explaining what went wrong 
            *   detail string   More concrete details 
            *   status integer   HTTP status code 

        *   status integer Required   Status code of operation on resource identified by ID 

#### 400

Bad request (Missing required field in request body)

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

#### 403

User has no access to the endpoint. The endpoint requires Admin role

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

 POST /api/v1/data-connections/actions/delete

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.dataConnections.deleteDataConnections({  connections: [    {      id: 'b2c1ab1f-392c-4cd1-87bd-4c3cd256f5fd',      name: 'MyConnection',    },  ],})
```

`qlik data-connection delete \  --connections-id '' \  --connections-name ''`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/data-connections/actions/delete" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"connections":[{"id":"b2c1ab1f-392c-4cd1-87bd-4c3cd256f5fd","name":"MyConnection"}]}'`

### Example Response

`{  "data": [    {      "id": "b2c1ab1f-392c-4cd1-87bd-4c3cd256f5fd",      "error": {        "code": "DCERROR-0010",        "title": "Bad or invalid request",        "detail": "Field xxx is missing in the request",        "status": 400      },      "status": 204    }  ]}`

## [](https://qlik.dev/apis/rest/data-connections/#post-api-v1-data-connections-actions-duplicate)Duplicate a connection

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

*   application/json object   

Show application/json properties 

    *   id string Required   ID of the source connection being duplicated 
    *   name string   Optional name for the duplicated connection, must be unique in the target scope. If not specified, a name will be automatically generated 
    *   spaceId string   Optional target space ID for the duplicated connection. If not specified, the duplicated connection will be in the same space as the source connection 
    *   qPassword string   Optional credential password, specify to override credential embedded (or associated) with the source connection 
    *   qUsername string   Optional credential username, specify to override credential embedded (or associated) with the source connection 

### Responses

#### 201

Duplicate completed

*   application/json object   Essential fields of a connection 

Show application/json properties 

    *   qID string Required   Unique identifier (UUID) for the data connection, must be same as qEngineObjectID 
    *   user string   User ID of the connection's creator 
    *   links object   

Show links properties 

        *   self object Required   Link to current query 

Show self properties 

            *   href string Required   URL pointing to the resource 

    *   qName string Required   Descriptive name of the data connection 
    *   qType string Required   Type of connection - indicates connection provider type 
    *   space string   ID of the space to which the connection belongs 
    *   qLogOn string Required   Indicates the type of user associated with the data connection. 
Can be one of: "0""1""LOG_ON_SERVICE_USER""LOG_ON_CURRENT_USER"

    *   created string   Datetime when the connection was created 
    *   updated string   Datetime when the connection was last updated 
    *   privileges array of strings Required   Array of string (i.e. update, delete, read) indicating the user's privileges on the associated connection 
Values may be any of: "list""update""delete""read""change_owner""change_space"

    *   qArchitecture integer Required   

        1.   or 1 value indicating whether the data connector is 64-bit (0) or 32-bit (1). Defaults to 0 if not specified.

Can be one of: 0 1

    *   qReferenceKey string   Reference key of credential in redis 
    *   qCredentialsID string   ID of the credential associated with the connection 
    *   qEngineObjectID string Required   Unique identifier (UUID) for the data connection, must be same as qID 
    *   qCredentialsName string   Name of the credential associated with the connection 
    *   qConnectStatement string Required   Connection string for the data connection 
    *   qSeparateCredentials boolean Required   Indicates whether or not this is a credential-less connection 

#### 400

Bad request (Missing required field in request body, or duplicate from / to a reserved connection)

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

#### 403

User has no access to the source connection or no access to target space

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

#### 404

Connection defined by id not found

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

#### 409

Duplicated connection would result in a name conflict with the connections in the scope

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

 POST /api/v1/data-connections/actions/duplicate

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.dataConnections.duplicateDataAConnection(  {    id: 'b2c1ab1f-392c-4cd1-87bd-4c3cd256f5fd',    name: 'ResourceName',    qPassword: 'Password',    qUsername: 'UserName',    spaceId: '611bcebaeec1203d88211ac4',  },)
```

`qlik data-connection duplicate \  --id 'b2c1ab1f-392c-4cd1-87bd-4c3cd256f5fd'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/data-connections/actions/duplicate" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"id":"b2c1ab1f-392c-4cd1-87bd-4c3cd256f5fd","name":"ResourceName","spaceId":"611bcebaeec1203d88211ac4","qPassword":"Password","qUsername":"UserName"}'`

### Example Response

`{  "qID": "b4a949cb-3aaf-4cd5-a140-dd3ea34f0d28",  "user": "rFdHeUOiVYgPX5iTbvL0x0Cs6F62QI",  "links": {    "self": {      "href": "https://mytenant.us.qlikcloud.com/..."    }  },  "qName": "MyConnection",  "qType": "QvOdbcConnectorPackage.exe",  "space": "611bcebaeec1203d88211ac4",  "qLogOn": "1",  "created": "2022-04-09T10:00:28.287Z",  "updated": "2022-04-09T10:00:28.287Z",  "privileges": "[update, delete, read]",  "qArchitecture": 0,  "qReferenceKey": "credential:key",  "qCredentialsID": "7b475581-2f68-4c81-ac52-25705b8229fb",  "qEngineObjectID": "b4a949cb-3aaf-4cd5-a140-dd3ea34f0d28",  "qCredentialsName": "MyCredential",  "qConnectStatement": "CUSTOM CONNECT TO \\\"provider=QvOdbcConnectorPackage.exe;driver=snowflake;server=...\\\"",  "qSeparateCredentials": true}`

## [](https://qlik.dev/apis/rest/data-connections/#post-api-v1-data-connections-actions-update)Update multiple connections, only available to Admin. When update is to change ownership of a connection, the credentials associated with the connection will NOT be transferred to the new owner, and new owner is expected to provide their own credentials for the connection.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

*   application/json object   

Show application/json properties 

    *   connections array of objects Required   

Show connections properties 

        *   id string Required   Connection ID 
        *   name string   Connection name 
        *   ownerId string   User ID to which the connection will be updated. If not present, the connection's owner wont be changed 
        *   spaceId string   Space ID to which the connection will be updated. If not present, the connection's space wont be changed. If it is empty string, then the connection will be moved to the personal space of the user identified by ownerId (If ownerId is undefined, then the connection will be in oroginal owner's personal space) 
        *   spaceType string   Space type. Required when spaceId is specified 
Can be one of: "personal""shared""managed""data"

### Responses

#### 207

Bulk update completed

*   application/json object   

Show application/json properties 

    *   data array of objects   

Show data properties 

        *   id string Required   ID of the resource 
        *   error object   

Show error properties 

            *   code string   Unique internal error code 
            *   title string   A summary in english explaining what went wrong 
            *   detail string   More concrete details 
            *   status integer   HTTP status code 

        *   status integer Required   Status code of operation on resource identified by ID 

#### 400

Bad request (Missing required field in request body)

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

#### 403

User has no access to the endpoint. The endpoint requires Admin role

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

 POST /api/v1/data-connections/actions/update

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.dataConnections.updateDataConnections({  connections: [    {      id: 'b2c1ab1f-392c-4cd1-87bd-4c3cd256f5fd',      name: 'MyConnection',      ownerId: '6K9xjsItDexffSlu5vg1oWYkY8x7f-06',      spaceId: '611bcebaeec1203d88211ac4',      spaceType: 'personal',    },  ],})
```

`qlik data-connection update \  --connections-id '' \  --connections-name '' \  --connections-ownerId '' \  --connections-spaceId '' \  --connections-spaceType ''`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/data-connections/actions/update" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"connections":[{"id":"b2c1ab1f-392c-4cd1-87bd-4c3cd256f5fd","name":"MyConnection","ownerId":"6K9xjsItDexffSlu5vg1oWYkY8x7f-06","spaceId":"611bcebaeec1203d88211ac4","spaceType":"personal"}]}'`

### Example Response

`{  "data": [    {      "id": "b2c1ab1f-392c-4cd1-87bd-4c3cd256f5fd",      "error": {        "code": "DCERROR-0010",        "title": "Bad or invalid request",        "detail": "Field xxx is missing in the request",        "status": 400      },      "status": 204    }  ]}`

Was this page helpful?
*   yes 
*   no 

![Image 2: Qlik logo](https://qlik.dev/logo-footer.svg)

[Qlik Community](https://community.qlik.com/)

[](https://join.slack.com/t/qlikdeveloper/shared_invite/zt-3wrdlkhog-Dcq9LuCbjNQVN2XaPlgGqQ)[](https://www.facebook.com/qlik)[](https://www.linkedin.com/company/qlik)[](https://x.com/qlikdeveloper)

[Legal Agreements](https://www.qlik.com/us/legal/legal-agreements) / [Legal Policies](https://www.qlik.com/us/legal/legal-policies) / [Privacy & Cookie Notice](https://www.qlik.com/us/legal/privacy-and-cookie-notice) / [Terms of Use](https://qlik.dev/qlik-developer-portal-terms-of-use.pdf) / Do Not Share My Info

 Copyright © 1993-2026 QlikTech International AB. All rights reserved.