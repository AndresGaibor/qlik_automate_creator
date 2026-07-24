---
title: "Notes REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/notes/"
local_path: "docs/endpoints/notes.md"
---

Title: Notes REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/notes/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Notes

*   [Get the enablement status of the notes feature set for this tenant and user.](https://qlik.dev/apis/rest/notes/#get-api-v1-notes-settings "Get the enablement status of the notes feature set for this tenant and user.") D 
*   [update the settings](https://qlik.dev/apis/rest/notes/#put-api-v1-notes-settings "update the settings") D 

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/notes.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Notes

Notes provide a collaborative experience to support analytics consumption in your tenant. This API enables or disables notes.

[Download OpenAPI spec](https://qlik.dev/specs/rest/notes.json)

## Endpoints

*   [GET /api/v1/notes/settings](https://qlik.dev/apis/rest/notes/#get-api-v1-notes-settings)
*   [PUT /api/v1/notes/settings](https://qlik.dev/apis/rest/notes/#put-api-v1-notes-settings)

## [](https://qlik.dev/apis/rest/notes/#get-api-v1-notes-settings)Get the enablement status of the notes feature set for this tenant and user.

Deprecated

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)
Deprecated This endpoint is deprecated and will eventually be removed. Read our API policy [here](https://qlik.dev/apis/api-policy/).

### Responses

#### 200

Notes enablement status.

*   application/json object   

Show application/json properties 

    *   reason string   The possible states for the status of notes configuration GET or POST operation 
Can be one of: "deployment""toggle""license"

    *   available boolean Required   'true' if the note feature is enabled for this tenant and user otherwise 'false'. 
    *   lastFetch string   The timestamp for the last time this users notes settings were fetched from downstream services. 

#### 500

Internal server error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Error code specific to notes broker service. 
        *   title string   Error title. 
        *   detail string   Error cause. 

    *   traceId string   An optional traceId 

#### default

Error response.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Error code specific to notes broker service. 
        *   title string   Error title. 
        *   detail string   Error cause. 

    *   traceId string   An optional traceId 

 GET /api/v1/notes/settings

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.notes.getNotesSettings()
```

`# qlik-cli has not implemented support for GET /api/v1/notes/settings yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/notes/settings" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "reason": "deployment",  "available": true,  "lastFetch": "string"}`

## [](https://qlik.dev/apis/rest/notes/#put-api-v1-notes-settings)update the settings

Deprecated

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)
Deprecated This endpoint is deprecated and will eventually be removed. Read our API policy [here](https://qlik.dev/apis/api-policy/).

### Request Body

Required

A JSON payload containing note settings to put.

*   application/json object   

Show application/json properties 

    *   toggledOn boolean   pass 'true' to enable the note toggle for the tenant, 'false' to disable the toggle (other values are ignore). 

### Responses

#### 200

The newly applied note settings for the tenant.

*   application/json object   

Show application/json properties 

    *   toggleOn boolean   'true' if the note feature is enabled for this tenant and user otherwise 'false'. 

#### 400

Request content error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Error code specific to notes broker service. 
        *   title string   Error title. 
        *   detail string   Error cause. 

    *   traceId string   An optional traceId 

#### 403

Unauthorized user.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Error code specific to notes broker service. 
        *   title string   Error title. 
        *   detail string   Error cause. 

    *   traceId string   An optional traceId 

#### 500

Internal server error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Error code specific to notes broker service. 
        *   title string   Error title. 
        *   detail string   Error cause. 

    *   traceId string   An optional traceId 

#### default

Error response.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Error code specific to notes broker service. 
        *   title string   Error title. 
        *   detail string   Error cause. 

    *   traceId string   An optional traceId 

 PUT /api/v1/notes/settings

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.notes.setNotesSettings({  toggledOn: true,})
```

`# qlik-cli has not implemented support for PUT /api/v1/notes/settings yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/notes/settings" \-X PUT \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"toggledOn":true}'`

### Example Response

`{  "toggleOn": true}`

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