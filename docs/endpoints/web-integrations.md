---
title: "Web integrations REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/web-integrations/"
local_path: "docs/endpoints/web-integrations.md"
---

Title: Web integrations REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/web-integrations/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Web integrations

*   [List web integrations](https://qlik.dev/apis/rest/web-integrations/#get-api-v1-web-integrations "List web integrations")
*   [Create web integration](https://qlik.dev/apis/rest/web-integrations/#post-api-v1-web-integrations "Create web integration")
*   [Get web integration by ID](https://qlik.dev/apis/rest/web-integrations/#get-api-v1-web-integrations-id "Get web integration by ID")
*   [Update web integration by ID](https://qlik.dev/apis/rest/web-integrations/#patch-api-v1-web-integrations-id "Update web integration by ID")
*   [Delete web integration by ID](https://qlik.dev/apis/rest/web-integrations/#delete-api-v1-web-integrations-id "Delete web integration by ID")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/web-integrations.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Web integrations

A web integration is a resource representing a list of whitelisted origins that can make requests to a specified tenant. It is the implementation of the CORS mechanism within Qlik Cloud.

[Download OpenAPI spec](https://qlik.dev/specs/rest/web-integrations.json)

## Endpoints

*   [GET /api/v1/web-integrations](https://qlik.dev/apis/rest/web-integrations/#get-api-v1-web-integrations)
*   [POST /api/v1/web-integrations](https://qlik.dev/apis/rest/web-integrations/#post-api-v1-web-integrations)
*   [GET /api/v1/web-integrations/{id}](https://qlik.dev/apis/rest/web-integrations/#get-api-v1-web-integrations-id)
*   [PATCH /api/v1/web-integrations/{id}](https://qlik.dev/apis/rest/web-integrations/#patch-api-v1-web-integrations-id)
*   [DELETE /api/v1/web-integrations/{id}](https://qlik.dev/apis/rest/web-integrations/#delete-api-v1-web-integrations-id)

## [](https://qlik.dev/apis/rest/web-integrations/#get-api-v1-web-integrations)List web integrations

Retrieves web integrations matching the query.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Query Parameters

*   endingBefore string   The target web integration ID to start looking before for web integrations. Cannot be used in conjunction with startingAfter. 
*   limit number   The number of web integration entries to retrieve. 
minimum = 0,  maximum = 100,  default = 10,  default = 10

*   sort string   The field to sort by. Prefix with +/- to indicate ascending/descending order. 
Can be one of: "name""+name""-name"

default = "+name"

*   startingAfter string   The target web integration ID to start looking after for web integrations. Cannot be used in conjunction with endingBefore. 
*   tenantId string   The tenant ID to filter by. 

### Responses

#### 200

An array of web integration objects.

*   application/json object   An array of web integration objects. 

Show application/json properties 

    *   data array of objects   Properties of web integrations in a given tenant. 

Show data properties 

        *   id string   The unique web integration identifier. 
format = "uid"

        *   name string   The name of the web integration. 
        *   created string   The time the web integration was created. 
format = "date-time"

        *   tenantId string   The tenant that the web integration belongs to. 
format = "uid"

        *   createdBy string   The user that created the web integration. 
format = "uid"

        *   lastUpdated string   The time the web integration was last updated. 
format = "date-time"

        *   validOrigins array of strings   The origins that are allowed to make requests to the tenant. 

    *   links object   Pagination links 

Show links properties 

        *   next object   Link information for next page. 

Show next properties 

            *   href string Required   URL to the next page of records. 

        *   prev object   Link information for previous page. 

Show prev properties 

            *   href string Required   URL to the previous page of records. 

        *   self object Required   Link information for current page. 

Show self properties 

            *   href string Required   URL to the current page of records. 

#### default

Unexpected error.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the error. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status string Required   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

 GET /api/v1/web-integrations

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.webIntegrations.getWebIntegrations({})
```

`qlik web-integration ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/web-integrations" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "data": [    {      "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",      "name": "string",      "created": "2018-10-30T07:06:22Z",      "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",      "createdBy": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",      "lastUpdated": "2018-10-30T07:06:22Z",      "validOrigins": [        "string"      ]    }  ],  "links": {    "next": {      "href": "string"    },    "prev": {      "href": "string"    },    "self": {      "href": "string"    }  }}`

## [](https://qlik.dev/apis/rest/web-integrations/#post-api-v1-web-integrations)Create web integration

Creates a web integration.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

Properties that the user wants to set for the web integration.

*   application/json object   

Show application/json properties 

    *   name string Required   The name of the web integration to create. 
    *   validOrigins array of strings   The origins that are allowed to make requests to the tenant. 

### Responses

#### 201

Web integration created successfully.

*   application/json object   The creation of a web integration response. 

Show application/json properties 

    *   id string   The unique web integration identifier. 
format = "uid"

    *   name string   The name of the newly created web integration. 
    *   links object   Pagination links 

Show links properties 

        *   self object Required   Link information for current page. 

Show self properties 

            *   href string Required   URL to the current page of records. 

    *   created string   The time the web integration was created. 
format = "date-time"

    *   tenantId string   The tenant that the web integration belongs to. 
format = "uid"

    *   createdBy string   The user that created the web integration. 
format = "uid"

    *   lastUpdated string   The time the web integration was last updated. 
format = "date-time"

    *   validOrigins array of strings   The origins that are allowed to make requests to the tenant. 

#### 400

Invalid request was made.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the error. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status string Required   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### 403

Requestor not allowed to create a web integration.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the error. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status string Required   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

 POST /api/v1/web-integrations

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.webIntegrations.createWebIntegration({  name: 'My Web Integration',  validOrigins: ['https://thirdPartyApp.com'],})
```

`qlik web-integration create \  --name 'My Web Integration'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/web-integrations" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"name":"My Web Integration","validOrigins":["https://thirdPartyApp.com"]}'`

### Example Response

`{  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "name": "My Web Integration",  "links": {    "self": {      "href": "http://mytenant.region.domain/api/v1/web-integrations/id"    }  },  "created": "2018-10-30T07:06:22Z",  "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "createdBy": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "lastUpdated": "2018-10-30T07:06:22Z",  "validOrigins": [    "https://thirdPartyApp.com"  ]}`

## [](https://qlik.dev/apis/rest/web-integrations/#get-api-v1-web-integrations-id)Get web integration by ID

Retrieves a single web integration by ID.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Path Parameters

*   id string Required   The ID of the web integration to retrieve. 
format = "uid"

### Responses

#### 200

Web integration found.

*   application/json object   A web integration object. 

Show application/json properties 

    *   id string   The unique web integration identifier. 
format = "uid"

    *   name string   The name of the web integration. 
    *   created string   The time the web integration was created. 
format = "date-time"

    *   tenantId string   The tenant that the web integration belongs to. 
format = "uid"

    *   createdBy string   The user that created the web integration. 
format = "uid"

    *   lastUpdated string   The time the web integration was last updated. 
format = "date-time"

    *   validOrigins array of strings   The origins that are allowed to make requests to the tenant. 

#### 404

Web integration not found.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the error. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status string Required   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

 GET /api/v1/web-integrations/{id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.webIntegrations.getWebIntegration(  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',)
```

`qlik web-integration get 'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/web-integrations/{id}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "name": "string",  "created": "2018-10-30T07:06:22Z",  "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "createdBy": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "lastUpdated": "2018-10-30T07:06:22Z",  "validOrigins": [    "string"  ]}`

## [](https://qlik.dev/apis/rest/web-integrations/#patch-api-v1-web-integrations-id)Update web integration by ID

Updates a single web integration by ID.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   id string Required   The ID of the web integration to update. 
format = "uid"

### Request Body

Required

Properties that the user wants to update for the web integration.

*   application/json array of objects   A JSON Patch document as defined in [http://tools.ietf.org/html/rfc6902](http://tools.ietf.org/html/rfc6902). 

Show application/json properties 

    *   op string Required   The operation to be performed. 
Can be one of: "replace"

    *   path string Required   A JSON Pointer. 
Can be one of: "/name""/validOrigins"

    *   value string Required   New value to be used for this operation. 

### Responses

#### 204

Web integration updated successfully.

#### 400

Invalid request was made.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the error. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status string Required   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

#### 404

Web integration not found.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the error. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status string Required   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

 PATCH /api/v1/web-integrations/{id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.webIntegrations.patchWebIntegration(  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',  [    {      op: 'replace',      path: '/name',      value: 'New name',    },  ],)
```

`qlik web-integration patch 'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69' \  --op 'replace' \  --path '/name' \  --value 'New name'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/web-integrations/{id}" \-X PATCH \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '[{"op":"replace","path":"/name","value":"New name"}]'`

## [](https://qlik.dev/apis/rest/web-integrations/#delete-api-v1-web-integrations-id)Delete web integration by ID

Deletes a single web integration by ID.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   id string Required   The ID of the web integration to delete. 
format = "uid"

### Responses

#### 204

Web integration deleted successfully.

#### 404

Web integration not found.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the error. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

        *   status string Required   The HTTP status code. 

    *   traceId string   A unique identifier for tracing the error. 

 DELETE /api/v1/web-integrations/{id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.webIntegrations.deleteWebIntegration(  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',)
```

`qlik web-integration rm 'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/web-integrations/{id}" \-X DELETE \-H "Authorization: Bearer <access_token>"`

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