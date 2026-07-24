---
title: "OAuth tokens REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/oauth-tokens/"
local_path: "docs/endpoints/oauth-tokens.md"
---

Title: OAuth tokens REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/oauth-tokens/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## OAuth tokens

*   [List OAuth tokens](https://qlik.dev/apis/rest/oauth-tokens/#get-api-v1-oauth-tokens "List OAuth tokens")
*   [Revoke an OAuth token by ID](https://qlik.dev/apis/rest/oauth-tokens/#delete-api-v1-oauth-tokens-tokenId "Revoke an OAuth token by ID")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/oauth-tokens.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# OAuth tokens

List and revoke active OAuth tokens issued for your tenant.

[Download OpenAPI spec](https://qlik.dev/specs/rest/oauth-tokens.json)

## Endpoints

*   [GET /api/v1/oauth-tokens](https://qlik.dev/apis/rest/oauth-tokens/#get-api-v1-oauth-tokens)
*   [DELETE /api/v1/oauth-tokens/{tokenId}](https://qlik.dev/apis/rest/oauth-tokens/#delete-api-v1-oauth-tokens-tokenId)

## [](https://qlik.dev/apis/rest/oauth-tokens/#get-api-v1-oauth-tokens)List OAuth tokens

Retrieve list of OAuth tokens that the user has access to. Users assigned with a `TenantAdmin` role can list OAuth tokens generated for all users in the tenant.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Query Parameters

*   limit number   The maximum number of tokens to return. 
minimum = 1,  maximum = 100

*   page string   The target page. 
*   sort string   The field to sort by. 
Can be one of: "userId"

default = "userId"

*   userId string   The ID of the user to limit results to. 

### Responses

#### 200

The page result.

*   application/json object   

Show application/json properties 

    *   data array of objects Required   

Show data properties 

        *   id string Required   The token ID. 
        *   userId string Required   The ID of the owning user. 
        *   lastUsed string   The last time the token was used. 
format = "date-time"

        *   tenantId string Required   The ID of the owning tenant. 
        *   deviceType string   The type of the user device the authorization token is generated for (Tablet, Phone etc.). 
        *   description string   The description of the token. 

    *   links object Required   

Show links properties 

        *   next object   

Show next properties 

            *   href string Required   The URL for the link. 
format = "uri"

        *   prev object   

Show prev properties 

            *   href string Required   The URL for the link. 
format = "uri"

        *   self object Required   

Show self properties 

            *   href string Required   The URL for the link. 
format = "uri"

#### 400

Invalid request parameter for querying tokens.

*   application/json object   A representation of the errors encountered from the HTTP request. 

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Non-standard information about the error. 
        *   title string Required   The error title. 
        *   detail string   The detailed error message. 
        *   status string   The http status code. 

#### 401

Authentication failed.

*   application/json object   A representation of the errors encountered from the HTTP request. 

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Non-standard information about the error. 
        *   title string Required   The error title. 
        *   detail string   The detailed error message. 
        *   status string   The http status code. 

 GET /api/v1/oauth-tokens

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.oauthTokens.getOauthTokens({})
```

`qlik oauth-token ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/oauth-tokens" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "data": [    {      "id": "string",      "userId": "string",      "lastUsed": "2018-10-30T07:06:22Z",      "tenantId": "string",      "deviceType": "string",      "description": "string"    }  ],  "links": {    "next": {      "href": "string"    },    "prev": {      "href": "string"    },    "self": {      "href": "string"    }  }}`

## [](https://qlik.dev/apis/rest/oauth-tokens/#delete-api-v1-oauth-tokens-tokenId)Revoke an OAuth token by ID

Revokes a specific OAuth token by ID. Requesting user must have `TenantAdmin` role assigned to delete tokens owned by other users.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   tokenId string Required   The ID of the token to revoke. 
format = "uid"

### Responses

#### 204

Token deleted successfully.

#### 401

Authentication failed.

*   application/json object   A representation of the errors encountered from the HTTP request. 

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Non-standard information about the error. 
        *   title string Required   The error title. 
        *   detail string   The detailed error message. 
        *   status string   The http status code. 

#### default

Unexpected error.

*   application/json object   A representation of the errors encountered from the HTTP request. 

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Non-standard information about the error. 
        *   title string Required   The error title. 
        *   detail string   The detailed error message. 
        *   status string   The http status code. 

 DELETE /api/v1/oauth-tokens/{tokenId}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.oauthTokens.deleteOauthToken(  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',)
```

`qlik oauth-token rm 'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/oauth-tokens/{tokenId}" \-X DELETE \-H "Authorization: Bearer <access_token>"`

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