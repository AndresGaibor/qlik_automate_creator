---
title: "Banners REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/banners/"
local_path: "docs/endpoints/banners.md"
---

Title: Banners REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/banners/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Banners

*   [Get banner](https://qlik.dev/apis/rest/banners/#get-api-v1-banners "Get banner")
*   [Set banner](https://qlik.dev/apis/rest/banners/#post-api-v1-banners-actions-upsert "Set banner")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/banners.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Banners

Banners display short messages at the top of the client interface to share tenant-wide information, warnings, or issues. When embedding content, banners aren't shown inside qlik-embed UIs. The only embedding method that displays banners is an iFrame generated using the App Integration API.

[Download OpenAPI spec](https://qlik.dev/specs/rest/banners.json)

## Endpoints

*   [GET /api/v1/banners](https://qlik.dev/apis/rest/banners/#get-api-v1-banners)
*   [POST /api/v1/banners/actions/upsert](https://qlik.dev/apis/rest/banners/#post-api-v1-banners-actions-upsert)

## [](https://qlik.dev/apis/rest/banners/#get-api-v1-banners)Get banner

Retrieves announcement banner configuration for the tenant, including content, scheduling, and link information for display at the top of the client interface.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Responses

#### 200

Banner retrieval was successful.

*   application/json object   

Show application/json properties 

    *   id string Required   
format = "uid"

    *   type string Required   
Can be one of: "info""warning""error""resolved"

    *   enabled boolean Required   
    *   endTime string Required   date-time in UTC. 
format = "date-time"

    *   linkUrl string   
format = "uri"

    *   message string Required   
    *   tenantId string Required   
format = "uid"

    *   createdAt string Required   
format = "date-time"

    *   createdBy string Required   userId of the user who created the banner 
    *   linkLabel string   
    *   startTime string Required   date-time in UTC. 
format = "date-time"

    *   updatedAt string Required   
format = "date-time"

    *   updatedBy string Required   userId of the user who last modified the banner 
    *   linkEnabled boolean Required   

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status integer   

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
        *   status integer   

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
        *   status integer   

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
        *   status integer   

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
        *   status integer   

    *   traceId string   

 GET /api/v1/banners

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `GET /api/v1/banners` yet.// In the meantime, you can use fetch like this:
const response = await fetch('/api/v1/banners', {  method: 'GET',  headers: { 'Content-Type': 'application/json' },})
```

`qlik banner ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/banners" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "type": "info",  "enabled": true,  "endTime": "2024-01-01T00:00:00.000Z",  "linkUrl": "string",  "message": "string",  "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "createdAt": "2024-01-01T00:00:00.000Z",  "createdBy": "string",  "linkLabel": "string",  "startTime": "2024-01-01T00:00:00.000Z",  "updatedAt": "2024-01-01T00:00:00.000Z",  "updatedBy": "string",  "linkEnabled": true}`

## [](https://qlik.dev/apis/rest/banners/#post-api-v1-banners-actions-upsert)Set banner

Sets content, scheduling, and optional action links for the tenant-wide announcement banner. Requires `TenantAdmin` role.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

*   application/json object   

Show application/json properties 

    *   type string Required   
Can be one of: "info""warning""error""resolved"

    *   enabled boolean Required   
    *   endTime string Required   date-time in UTC. 
format = "date-time"

    *   linkUrl string   
format = "uri"

    *   message string Required   
    *   linkLabel string   
    *   startTime string Required   date-time in UTC. 
format = "date-time"

    *   linkEnabled boolean Required   

### Responses

#### 201

The banner has been successfully upserted.

*   application/json object   

Show application/json properties 

    *   id string Required   
format = "uid"

    *   type string Required   
Can be one of: "info""warning""error""resolved"

    *   enabled boolean Required   
    *   endTime string Required   date-time in UTC. 
format = "date-time"

    *   linkUrl string   
format = "uri"

    *   message string Required   
    *   tenantId string Required   
format = "uid"

    *   createdAt string Required   
format = "date-time"

    *   createdBy string Required   userId of the user who created the banner 
    *   linkLabel string   
    *   startTime string Required   date-time in UTC. 
format = "date-time"

    *   updatedAt string Required   
format = "date-time"

    *   updatedBy string Required   userId of the user who last modified the banner 
    *   linkEnabled boolean Required   

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status integer   

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
        *   status integer   

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
        *   status integer   

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
        *   status integer   

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
        *   status integer   

    *   traceId string   

 POST /api/v1/banners/actions/upsert

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `POST /api/v1/banners/actions/upsert` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/v1/banners/actions/upsert',  {    method: 'POST',    headers: {      'Content-Type': 'application/json',    },    body: JSON.stringify({      type: 'info',      enabled: true,      endTime: '2024-01-01T00:00:00.000Z',      linkUrl: 'string',      message: 'string',      linkLabel: 'string',      startTime: '2024-01-01T00:00:00.000Z',      linkEnabled: true,    }),  },)
```

`qlik banner upsert \  --enabled true \  --endTime '2024-01-01T00:00:00.000Z' \  --linkEnabled true \  --message 'string' \  --startTime '2024-01-01T00:00:00.000Z' \  --type 'info'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/banners/actions/upsert" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"type":"info","enabled":true,"endTime":"2024-01-01T00:00:00.000Z","linkUrl":"string","message":"string","linkLabel":"string","startTime":"2024-01-01T00:00:00.000Z","linkEnabled":true}'`

### Example Response

`{  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "type": "info",  "enabled": true,  "endTime": "2024-01-01T00:00:00.000Z",  "linkUrl": "string",  "message": "string",  "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "createdAt": "2024-01-01T00:00:00.000Z",  "createdBy": "string",  "linkLabel": "string",  "startTime": "2024-01-01T00:00:00.000Z",  "updatedAt": "2024-01-01T00:00:00.000Z",  "updatedBy": "string",  "linkEnabled": true}`

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