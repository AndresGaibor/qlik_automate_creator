---
title: "Quotas REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/quotas/"
local_path: "docs/endpoints/quotas.md"
---

Title: Quotas REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/quotas/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Quotas

*   [Returns all quota items for the tenant (provided in JWT).](https://qlik.dev/apis/rest/quotas/#get-api-v1-quotas "Returns all quota items for the tenant (provided in JWT).")
*   [Returns a specific quota item for the tenant (provided in JWT).](https://qlik.dev/apis/rest/quotas/#get-api-v1-quotas-id "Returns a specific quota item for the tenant (provided in JWT).")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/quotas.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Quotas

Quotas returns entitled attributes based on your license.

[Download OpenAPI spec](https://qlik.dev/specs/rest/quotas.json)

## Endpoints

*   [GET /api/v1/quotas](https://qlik.dev/apis/rest/quotas/#get-api-v1-quotas)
*   [GET /api/v1/quotas/{id}](https://qlik.dev/apis/rest/quotas/#get-api-v1-quotas-id)

## [](https://qlik.dev/apis/rest/quotas/#get-api-v1-quotas)Returns all quota items for the tenant (provided in JWT).

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Query Parameters

*   reportUsage boolean   The Boolean flag indicating whether quota usage shall be part of the response. The default value is false (only limits returned). 

### Responses

#### 200

OK Response

*   application/json object   

Show application/json properties 

    *   data array of objects Required   Array of quota items. 

Show data properties 

        *   id string Required   The unique identifier of the quota item. For example, "app_mem_size", "app_upload_disk_size", or "shared_spaces". 
        *   type string Required   The resource type of the quota item. Always equal to "quotas". 
        *   attributes object Required   The attributes of the quota. 

Show attributes properties 

            *   unit string Required   The unit of the quota limit. For memory quotas, the unit is always "bytes". For other discrete units, the item counted is used as unit, for example "spaces". 
            *   quota number Required   The quota limit. If there is no quota limit, -1 is returned. 
format = double

            *   usage number   The current quota usage, if applicable. This attribute is only present if it is requested using the reportUsage query parameter. 
format = double

            *   warningThresholds array of numbers   The warning thresholds at which "close to quota" warnings can be issued when exceeded. If omitted, no warning threshold shall be used. Currently, the array will contain only one threshold value. In the future, this may be extended. The threshold is a number between 0 and 1, relating to the quota limit. For example, a value of 0.9 means that a warning should be issued when exceeding 90% of the quota limit. 

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   A specific error. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   A specific error. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 

 GET /api/v1/quotas

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.quotas.getQuotas({})
```

`qlik quota ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/quotas" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "data": [    {      "id": "string",      "type": "string",      "attributes": {        "unit": "string",        "quota": 42,        "usage": 42,        "warningThresholds": [          0.9        ]      }    }  ]}`

## [](https://qlik.dev/apis/rest/quotas/#get-api-v1-quotas-id)Returns a specific quota item for the tenant (provided in JWT).

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Query Parameters

*   reportUsage boolean   The Boolean flag indicating whether quota usage shall be part of the response. The default value is false (usage not included). 

### Path Parameters

*   id string Required   The unique identifier of the quota item. For example, "app_mem_size", "app_upload_disk_size", or "shared_spaces". 

### Responses

#### 200

OK Response

*   application/json object   

Show application/json properties 

    *   data array of objects Required   Quota item. 

Show data properties 

        *   id string Required   The unique identifier of the quota item. For example, "app_mem_size", "app_upload_disk_size", or "shared_spaces". 
        *   type string Required   The resource type of the quota item. Always equal to "quotas". 
        *   attributes object Required   The attributes of the quota. 

Show attributes properties 

            *   unit string Required   The unit of the quota limit. For memory quotas, the unit is always "bytes". For other discrete units, the item counted is used as unit, for example "spaces". 
            *   quota number Required   The quota limit. If there is no quota limit, -1 is returned. 
format = double

            *   usage number   The current quota usage, if applicable. This attribute is only present if it is requested using the reportUsage query parameter. 
format = double

            *   warningThresholds array of numbers   The warning thresholds at which "close to quota" warnings can be issued when exceeded. If omitted, no warning threshold shall be used. Currently, the array will contain only one threshold value. In the future, this may be extended. The threshold is a number between 0 and 1, relating to the quota limit. For example, a value of 0.9 means that a warning should be issued when exceeding 90% of the quota limit. 

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   A specific error. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 

#### 404

Not Found

*   application/json object   

Show application/json properties 

    *   errors array of objects   A specific error. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   A specific error. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 

 GET /api/v1/quotas/{id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.quotas.getQuota('string', {})
```

`qlik quota get 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/quotas/{id}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "data": [    {      "id": "string",      "type": "string",      "attributes": {        "unit": "string",        "quota": 42,        "usage": 42,        "warningThresholds": [          0.9        ]      }    }  ]}`

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