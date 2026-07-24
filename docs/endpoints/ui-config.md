---
title: "Pinned links REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/ui-config/"
local_path: "docs/endpoints/ui-config.md"
---

Title: Pinned links REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/ui-config/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Pinned links

*   [List pinned links](https://qlik.dev/apis/rest/ui-config/#get-api-v1-ui-config-pinned-links "List pinned links")
*   [Create pinned link](https://qlik.dev/apis/rest/ui-config/#post-api-v1-ui-config-pinned-links "Create pinned link")
*   [Get pinned link](https://qlik.dev/apis/rest/ui-config/#get-api-v1-ui-config-pinned-links-id "Get pinned link")
*   [Update pinned link](https://qlik.dev/apis/rest/ui-config/#patch-api-v1-ui-config-pinned-links-id "Update pinned link")
*   [Delete pinned link](https://qlik.dev/apis/rest/ui-config/#delete-api-v1-ui-config-pinned-links-id "Delete pinned link")
*   [Create multiple pinned links](https://qlik.dev/apis/rest/ui-config/#post-api-v1-ui-config-pinned-links-actions-bulk-create-pinned-links "Create multiple pinned links")
*   [Delete all pinned links](https://qlik.dev/apis/rest/ui-config/#post-api-v1-ui-config-pinned-links-actions-delete-all-pinned-links "Delete all pinned links")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/ui-config.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Pinned links

Pinned links are administrator-defined URLs which appear for all users under the More button in the global navigation menu.

[Download OpenAPI spec](https://qlik.dev/specs/rest/ui-config.json)

## Endpoints

*   [GET /api/v1/ui-config/pinned-links](https://qlik.dev/apis/rest/ui-config/#get-api-v1-ui-config-pinned-links)
*   [POST /api/v1/ui-config/pinned-links](https://qlik.dev/apis/rest/ui-config/#post-api-v1-ui-config-pinned-links)
*   [GET /api/v1/ui-config/pinned-links/{id}](https://qlik.dev/apis/rest/ui-config/#get-api-v1-ui-config-pinned-links-id)
*   [PATCH /api/v1/ui-config/pinned-links/{id}](https://qlik.dev/apis/rest/ui-config/#patch-api-v1-ui-config-pinned-links-id)
*   [DELETE /api/v1/ui-config/pinned-links/{id}](https://qlik.dev/apis/rest/ui-config/#delete-api-v1-ui-config-pinned-links-id)
*   [POST /api/v1/ui-config/pinned-links/actions/bulk-create-pinned-links](https://qlik.dev/apis/rest/ui-config/#post-api-v1-ui-config-pinned-links-actions-bulk-create-pinned-links)
*   [POST /api/v1/ui-config/pinned-links/actions/delete-all-pinned-links](https://qlik.dev/apis/rest/ui-config/#post-api-v1-ui-config-pinned-links-actions-delete-all-pinned-links)

## [](https://qlik.dev/apis/rest/ui-config/#get-api-v1-ui-config-pinned-links)List pinned links

Retrieves a list of all pinned links. All users can list pinned links. This endpoint does not support pagination as a tenant can have a maximum of 50 pinned links at one time.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Responses

#### 200

Pinned links retrieval was successful.

*   application/json object   

Show application/json properties 

    *   data array of objects   

Show data properties 

        *   id string Required   
        *   link string Required   
        *   name string Required   
        *   type string Required   
Can be one of: "custom-link"

        *   scope string Required   
Can be one of: "user""tenant"

        *   tenantId string Required   
        *   createdAt string Required   Date string 
        *   createdBy string Required   
        *   updatedAt string   Date string 
        *   updatedBy string   

#### default

Error response.

*   application/json object   

Show application/json properties 

    *   code integer   Error code. 
    *   message string   Error cause. 

 GET /api/v1/ui-config/pinned-links

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.uiConfig.getUiConfigPinnedLinks()
```

`qlik ui-config pinned-link ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/ui-config/pinned-links" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "data": [    {      "id": "string",      "link": "string",      "name": "string",      "type": "custom-link",      "scope": "user",      "tenantId": "string",      "createdAt": "string",      "createdBy": "string",      "updatedAt": "string",      "updatedBy": "string"    }  ]}`

## [](https://qlik.dev/apis/rest/ui-config/#post-api-v1-ui-config-pinned-links)Create pinned link

Creates a pinned link, which will appear below any existing pinned links in the tenant. Requires calling user to be assigned the `TenantAdmin` role. A tenant can have a maximum of 50 pinned links.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

*   application/json object   

Show application/json properties 

    *   link string Required   The URL the user will be taken to when they click on the custom link. Must be https. 
    *   name string Required   The title of the link, which will be shown in the navigation bar. Max length 50 characters. 
    *   type string Required   Specifies the type of the link. Only supports `custom-link`. 
Can be one of: "custom-link"

    *   scope string Required   Specifies the scope of the link. Only supports `tenant`. 
Can be one of: "tenant"

### Responses

#### 201

Successfully created pinned link

*   application/json object   

Show application/json properties 

    *   id string Required   
    *   link string Required   
    *   name string Required   
    *   type string Required   
Can be one of: "custom-link"

    *   scope string Required   
Can be one of: "user""tenant"

    *   tenantId string Required   
    *   createdAt string Required   Date string 
    *   createdBy string Required   
    *   updatedAt string   Date string 
    *   updatedBy string   

#### 403

Forbidden error response.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### default

Error response.

*   application/json object   

Show application/json properties 

    *   code integer   Error code. 
    *   message string   Error cause. 

 POST /api/v1/ui-config/pinned-links

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.uiConfig.createUiConfigPinnedLink({  link: 'string',  name: 'string',  scope: 'tenant',  type: 'custom-link',})
```

`qlik ui-config pinned-link create \  --link 'string' \  --name 'string' \  --scope 'tenant' \  --type 'custom-link'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/ui-config/pinned-links" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"link":"string","name":"string","type":"custom-link","scope":"tenant"}'`

### Example Response

`{  "id": "string",  "link": "string",  "name": "string",  "type": "custom-link",  "scope": "user",  "tenantId": "string",  "createdAt": "string",  "createdBy": "string",  "updatedAt": "string",  "updatedBy": "string"}`

## [](https://qlik.dev/apis/rest/ui-config/#get-api-v1-ui-config-pinned-links-id)Get pinned link

Retrieves a specific pinned link.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Path Parameters

*   id string Required   The pinned link identifier. 
format = "uid"

### Responses

#### 200

Pinned link retrieval was successful.

*   application/json object   

Show application/json properties 

    *   id string Required   
    *   link string Required   
    *   name string Required   
    *   type string Required   
Can be one of: "custom-link"

    *   scope string Required   
Can be one of: "user""tenant"

    *   tenantId string Required   
    *   createdAt string Required   Date string 
    *   createdBy string Required   
    *   updatedAt string   Date string 
    *   updatedBy string   

#### 403

Forbidden error response.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### default

Error response.

*   application/json object   

Show application/json properties 

    *   code integer   Error code. 
    *   message string   Error cause. 

 GET /api/v1/ui-config/pinned-links/{id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.uiConfig.getUiConfigPinnedLink(  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',)
```

`qlik ui-config pinned-link get 'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/ui-config/pinned-links/{id}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "id": "string",  "link": "string",  "name": "string",  "type": "custom-link",  "scope": "user",  "tenantId": "string",  "createdAt": "string",  "createdBy": "string",  "updatedAt": "string",  "updatedBy": "string"}`

## [](https://qlik.dev/apis/rest/ui-config/#patch-api-v1-ui-config-pinned-links-id)Update pinned link

Updates a specific pinned link with an array of JSON patches. Requires calling user to be assigned the `TenantAdmin` role.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   id string Required   The pinned link identifier. 
format = "uid"

### Request Body

*   application/json array of objects   

Show application/json properties 

    *   op string Required   
Can be one of: "replace"

    *   path string Required   
Can be one of: "/name""/link"

    *   value string Required   The value to be used for this operation. 

### Responses

#### 200

Successfully updated pinned link

*   application/json object   

Show application/json properties 

    *   id string Required   
    *   link string Required   
    *   name string Required   
    *   type string Required   
Can be one of: "custom-link"

    *   scope string Required   
Can be one of: "user""tenant"

    *   tenantId string Required   
    *   createdAt string Required   Date string 
    *   createdBy string Required   
    *   updatedAt string   Date string 
    *   updatedBy string   

#### 403

Forbidden error response.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### default

Error response.

*   application/json object   

Show application/json properties 

    *   code integer   Error code. 
    *   message string   Error cause. 

 PATCH /api/v1/ui-config/pinned-links/{id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.uiConfig.patchUiConfigPinnedLink(  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',  [    {      op: 'replace',      path: '/name',      value: 'https://updatedlink.com',    },  ],)
```

`qlik ui-config pinned-link patch 'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69' \  --op 'replace' \  --path '/name' \  --value 'https://updatedlink.com'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/ui-config/pinned-links/{id}" \-X PATCH \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '[{"op":"replace","path":"/name","value":"https://updatedlink.com"}]'`

### Example Response

`{  "id": "string",  "link": "string",  "name": "string",  "type": "custom-link",  "scope": "user",  "tenantId": "string",  "createdAt": "string",  "createdBy": "string",  "updatedAt": "string",  "updatedBy": "string"}`

## [](https://qlik.dev/apis/rest/ui-config/#delete-api-v1-ui-config-pinned-links-id)Delete pinned link

Deletes a specific pinned link. Requires calling user to be assigned the `TenantAdmin` role.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   id string Required   The pinned link identifier. 
format = "uid"

### Responses

#### 204

Successfully deleted pinned links

#### 403

Forbidden error response.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### default

Error response.

*   application/json object   

Show application/json properties 

    *   code integer   Error code. 
    *   message string   Error cause. 

 DELETE /api/v1/ui-config/pinned-links/{id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.uiConfig.deleteUiConfigPinnedLink(  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',)
```

`qlik ui-config pinned-link rm 'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/ui-config/pinned-links/{id}" \-X DELETE \-H "Authorization: Bearer <access_token>"`

## [](https://qlik.dev/apis/rest/ui-config/#post-api-v1-ui-config-pinned-links-actions-bulk-create-pinned-links)Create multiple pinned links

Creates one or more pinned links for navigation, an alternative method to multiple calls to `/ui-config/pinned-links`. Links are displayed below any existing pinned links, and will be added in the order sent in the request. Requires calling user to be assigned the `TenantAdmin` role. A tenant can have a maximum of 50 pinned links.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

*   application/json object   

Show application/json properties 

    *   type string Required   Specifies the type of the link. Only supports `custom-link`. 
Can be one of: "custom-link"

    *   scope string Required   Specifies the scope of the link. Only supports `tenant`. 
Can be one of: "tenant"

    *   links array of objects Required   

Show links properties 

        *   link string Required   The URL the user will be taken to when they click on the custom link. Must be https. 
        *   name string Required   The title of the link, which will be shown in the navigation bar. Max length 50 characters. 

### Responses

#### 200

Successfully created pinned links

*   application/json object   

Show application/json properties 

    *   data array of objects   

Show data properties 

        *   id string Required   
        *   link string Required   
        *   name string Required   
        *   type string Required   
Can be one of: "custom-link"

        *   scope string Required   
Can be one of: "user""tenant"

        *   tenantId string Required   
        *   createdAt string Required   Date string 
        *   createdBy string Required   
        *   updatedAt string   Date string 
        *   updatedBy string   

#### 403

Forbidden error response.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### default

Error response.

*   application/json object   

Show application/json properties 

    *   code integer   Error code. 
    *   message string   Error cause. 

 POST /api/v1/ui-config/pinned-links/actions/bulk-create-pinned-links

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.uiConfig.createUiConfigPinnedLinks({  scope: 'tenant',  type: 'custom-link',  links: [{ link: 'string', name: 'string' }],})
```

`qlik ui-config pinned-link bulk-create-pinned-links \  --scope 'tenant' \  --type 'custom-link' \  --links-link '' \  --links-name ''`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/ui-config/pinned-links/actions/bulk-create-pinned-links" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"type":"custom-link","scope":"tenant","links":[{"link":"string","name":"string"}]}'`

### Example Response

`{  "data": [    {      "id": "string",      "link": "string",      "name": "string",      "type": "custom-link",      "scope": "user",      "tenantId": "string",      "createdAt": "string",      "createdBy": "string",      "updatedAt": "string",      "updatedBy": "string"    }  ]}`

## [](https://qlik.dev/apis/rest/ui-config/#post-api-v1-ui-config-pinned-links-actions-delete-all-pinned-links)Delete all pinned links

Deletes all pinned links in the tenant. Requires calling user to be assigned the `TenantAdmin` role.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Responses

#### 204

Successfully deleted all pinned links

#### 403

Forbidden error response.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

    *   traceId string   

#### default

Error response.

*   application/json object   

Show application/json properties 

    *   code integer   Error code. 
    *   message string   Error cause. 

 POST /api/v1/ui-config/pinned-links/actions/delete-all-pinned-links

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.uiConfig.deleteAllUiConfigPinnedLinks()
```

`qlik ui-config pinned-link delete-all-pinned-links`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/ui-config/pinned-links/actions/delete-all-pinned-links" \-X POST \-H "Authorization: Bearer <access_token>"`

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