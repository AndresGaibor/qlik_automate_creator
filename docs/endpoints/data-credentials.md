---
title: "Data credentials REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/data-credentials/"
local_path: "docs/endpoints/data-credentials.md"
---

Title: Data credentials REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/data-credentials/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Data credentials

*   [Gets a credential by ID (or by name when bycredentialname=true is set in query)](https://qlik.dev/apis/rest/data-credentials/#get-api-v1-data-credentials-qID "Gets a credential by ID (or by name when bycredentialname=true is set in query)")
*   [Patches a credential specified by ID (or by name when bycredentialname=true is set in query)](https://qlik.dev/apis/rest/data-credentials/#patch-api-v1-data-credentials-qID "Patches a credential specified by ID (or by name when bycredentialname=true is set in query)")
*   [Updates a credential specified by ID (or by name when bycredentialname=true is set in query)](https://qlik.dev/apis/rest/data-credentials/#put-api-v1-data-credentials-qID "Updates a credential specified by ID (or by name when bycredentialname=true is set in query)")
*   [Deletes the specified credential by ID (or by name when type=credentialname is set in query)](https://qlik.dev/apis/rest/data-credentials/#delete-api-v1-data-credentials-qID "Deletes the specified credential by ID (or by name when type=credentialname is set in query)")
*   [Gets list of orphan data credentials (i.e. credentials that are not associated to any data connection) filtering on properties defined in request body](https://qlik.dev/apis/rest/data-credentials/#post-api-v1-data-credentials-actions-filter-orphan "Gets list of orphan data credentials (i.e. credentials that are not associated to any data connection) filtering on properties defined in request body")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/data-credentials.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Data credentials

Data credentials are the stored credentials leveraged by the data-connections service to connect to external data sources.

[Download OpenAPI spec](https://qlik.dev/specs/rest/data-credentials.json)

## Endpoints

*   [GET /api/v1/data-credentials/{qID}](https://qlik.dev/apis/rest/data-credentials/#get-api-v1-data-credentials-qID)
*   [PATCH /api/v1/data-credentials/{qID}](https://qlik.dev/apis/rest/data-credentials/#patch-api-v1-data-credentials-qID)
*   [PUT /api/v1/data-credentials/{qID}](https://qlik.dev/apis/rest/data-credentials/#put-api-v1-data-credentials-qID)
*   [DELETE /api/v1/data-credentials/{qID}](https://qlik.dev/apis/rest/data-credentials/#delete-api-v1-data-credentials-qID)
*   [POST /api/v1/data-credentials/actions/filter-orphan](https://qlik.dev/apis/rest/data-credentials/#post-api-v1-data-credentials-actions-filter-orphan)

## [](https://qlik.dev/apis/rest/data-credentials/#get-api-v1-data-credentials-qID)Gets a credential by ID (or by name when bycredentialname=true is set in query)

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Query Parameters

*   byCredentialName boolean   If set to true, credentialId in the query will be interpreted as credential's name 

### Path Parameters

*   qID string Required   Credential ID 

### Responses

#### 200

Credential retrieved

*   application/json object   

Show application/json properties 

    *   qID string Required   UUID of the credential 
    *   links object   

Show links properties 

        *   self object Required   Link to current query 

Show self properties 

            *   href string Required   URL pointing to the resource 

    *   qName string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   Name of the credential 
    *   qType string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   Type of credential 
    *   created string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   Datetime when the credential was created 
    *   updated string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   Datetime when the credential was last updated 
    *   qConnCount integer Required   Number of linked connections 
    *   datasourceID string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   ID datasource that the credential is created for 
    *   qReferenceKey string   Reference key of credential in redis 

#### 400

Empty value not permitted for dataName

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

#### 404

Credential not found

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

 GET /api/v1/data-credentials/{qID}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.dataCredentials.getDataCredential(  '027d2703-e745-43ec-8876-a2e6ac341700',  {},)
```

`qlik data-credential get '027d2703-e745-43ec-8876-a2e6ac341700'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/data-credentials/{qID}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "qID": "065f977e-6eca-408c-b78b-ecded823712c",  "links": {    "self": {      "href": "https://mytenant.us.qlikcloud.com/..."    }  },  "qName": "MyCredential for REST datasource",  "qType": "QvWebStorageProviderConnectorPackage.exe",  "created": "2022-04-08T10:00:28.287Z",  "updated": "2022-04-09T10:00:28.287Z",  "qConnCount": 1,  "datasourceID": "rest",  "qReferenceKey": "credential:key"}`

## [](https://qlik.dev/apis/rest/data-credentials/#patch-api-v1-data-credentials-qID)Patches a credential specified by ID (or by name when bycredentialname=true is set in query)

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Query Parameters

*   byCredentialName boolean   If set to true, credentialId in the query will be interpreted as credential's name 

### Path Parameters

*   qID string Required   Credential ID 

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

Credential updated successfully

#### 400

Connection ID changed

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

#### 404

Credential not found

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

#### 409

Credential already exists (when updated name conflicts with existing record)

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

 PATCH /api/v1/data-credentials/{qID}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.dataCredentials.patchDataCredential(  '027d2703-e745-43ec-8876-a2e6ac341700',  {},  [    {      op: 'add',      path: '/qName',      value: 'New value',    },  ],)
```

`qlik data-credential patch '027d2703-e745-43ec-8876-a2e6ac341700' \  --op 'add' \  --path '/qName'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/data-credentials/{qID}" \-X PATCH \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '[{"op":"add","path":"/qName","value":"New value"}]'`

## [](https://qlik.dev/apis/rest/data-credentials/#put-api-v1-data-credentials-qID)Updates a credential specified by ID (or by name when bycredentialname=true is set in query)

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Query Parameters

*   byCredentialName boolean   If set to true, credentialId in the query will be interpreted as credential's name 

### Path Parameters

*   qID string Required   Credential ID 

### Request Body

Required

*   application/json object   Credential 

Show application/json properties 

    *   qID string   UUID of the credential 
    *   qName string Required   Name of the credential 
    *   qType string Required   Type of credential (i.e. connector provider of the corresponding connection) 
    *   qPassword string Required   Password 
    *   qUsername string Required   User name 
    *   connectionId string   ID of connection that will be associated with the credential 
    *   datasourceID string   ID datasource that the credential is created for 

### Responses

#### 204

Credential updated successfully

#### 400

Connection ID changed

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

#### 404

Credential not found

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

#### 409

Credential already exists (when updated name conflicts with existing record)

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

 PUT /api/v1/data-credentials/{qID}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.dataCredentials.updateDataCredential(  '027d2703-e745-43ec-8876-a2e6ac341700',  {},  {    connectionId:      '2eb98dea-5e3b-4f50-9967-841cec04b72f',    datasourceID: 'rest',    qID: 'c2dd20e3-1842-42d0-81fe-1ecf08e6abde',    qName: 'MyCredential for REST datasource',    qPassword: 'MyPassword',    qType:      'QvWebStorageProviderConnectorPackage.exe',    qUsername: 'MyUsername',  },)
```

`qlik data-credential update '027d2703-e745-43ec-8876-a2e6ac341700' \  --qName 'MyCredential for REST datasource' \  --qPassword 'MyPassword' \  --qType 'QvWebStorageProviderConnectorPackage.exe' \  --qUsername 'MyUsername'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/data-credentials/{qID}" \-X PUT \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"qID":"c2dd20e3-1842-42d0-81fe-1ecf08e6abde","qName":"MyCredential for REST datasource","qType":"QvWebStorageProviderConnectorPackage.exe","qPassword":"MyPassword","qUsername":"MyUsername","connectionId":"2eb98dea-5e3b-4f50-9967-841cec04b72f","datasourceID":"rest"}'`

## [](https://qlik.dev/apis/rest/data-credentials/#delete-api-v1-data-credentials-qID)Deletes the specified credential by ID (or by name when type=credentialname is set in query)

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Query Parameters

*   byCredentialName boolean   If set to true, credentialId in the query will be interpreted as credential's name 

### Path Parameters

*   qID string Required   Credential ID 

### Responses

#### 204

Credential deleted successfully

#### 404

Credential not found

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

 DELETE /api/v1/data-credentials/{qID}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.dataCredentials.deleteDataCredential(  '027d2703-e745-43ec-8876-a2e6ac341700',  {},)
```

`qlik data-credential rm '027d2703-e745-43ec-8876-a2e6ac341700'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/data-credentials/{qID}" \-X DELETE \-H "Authorization: Bearer <access_token>"`

## [](https://qlik.dev/apis/rest/data-credentials/#post-api-v1-data-credentials-actions-filter-orphan)Gets list of orphan data credentials (i.e. credentials that are not associated to any data connection) filtering on properties defined in request body

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

*   application/json object   

Show application/json properties 

    *   qType string   Filtering on type of credentials 
    *   qSeparated integer   Filtering on separate status of credentials: * 0 - embedded credential * 1 - separated credential 
Can be one of: 0 1

    *   datasourceID string   Filtering on datasource ID of credentials 

### Responses

#### 200

Orphan credentials returned

*   application/json object   

Show application/json properties 

    *   data array of objects Required   Orphan credential 

Show data properties 

        *   qID string Required   UUID of the credential 
        *   user string   User ID of the credential's owner 
        *   qName string Required   Name of the credential 
        *   qType string Required   Type of credential (i.e. connector provider of the corresponding connection) 
        *   tenant string   Tenant ID of the credential's owner 
        *   created string Required   Datetime when the credential was created 
        *   updated string Required   Datetime when the credential was last updated 
        *   datasourceID string   ID datasource that the credential is created for 

    *   count integer Required   Number of orphan credentials found 

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

User has no access to credentials

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Unique internal error code 
        *   title string   A summary in english explaining what went wrong 
        *   detail string   More concrete details 
        *   status integer   HTTP status code 

 POST /api/v1/data-credentials/actions/filter-orphan

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.dataCredentials.filterOrphanedDataCredentials(  {    datasourceID: 'snowflake',    qSeparated: 0,    qType: 'QvOdbcConnectorPackage.exe',  },)
```

`qlik data-credential filter-orphan`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/data-credentials/actions/filter-orphan" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"qType":"QvOdbcConnectorPackage.exe","qSeparated":0,"datasourceID":"snowflake"}'`

### Example Response

`{  "data": [    {      "qID": "c2dd20e3-1842-42d0-81fe-1ecf08e6abde",      "user": "rFdHeUOiVYgPX5iTbvL0x0Cs6F62QI",      "qName": "MyCredential for REST datasource",      "qType": "QvWebStorageProviderConnectorPackage.exe",      "tenant": "xqFQ0k34vSR0d9G7J-vZtHZQkiYrCqc8",      "created": "2022-04-08T10:00:28.287Z",      "updated": "2022-04-09T10:00:28.287Z",      "datasourceID": "rest"    }  ],  "count": 1}`

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