---
title: "Auth settings REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/core/auth-settings/"
local_path: "docs/endpoints/core-auth-settings.md"
---

Title: Auth settings REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/core/auth-settings/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Auth settings

*   [Get authentication settings](https://qlik.dev/apis/rest/core/auth-settings/#get-api-core-auth-settings "Get authentication settings")
*   [Update authentication settings](https://qlik.dev/apis/rest/core/auth-settings/#patch-api-core-auth-settings "Update authentication settings")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)
6.    / 
7.    core 

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/core/auth-settings.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Auth settings

[Download OpenAPI spec](https://qlik.dev/specs/rest/core/auth-settings.json)

The Auth Settings API allows you to configure and manage authentication settings for your tenant, including identity provider configurations and security policies.

## Endpoints

*   [GET /api/core/auth-settings](https://qlik.dev/apis/rest/core/auth-settings/#get-api-core-auth-settings)
*   [PATCH /api/core/auth-settings](https://qlik.dev/apis/rest/core/auth-settings/#patch-api-core-auth-settings)

## [](https://qlik.dev/apis/rest/core/auth-settings/#get-api-core-auth-settings)Get authentication settings

Returns the authentication settings for the tenant, including the session inactivity timeout and maximum session lifespan. If no custom values have been saved, the response reflects tenant-wide defaults with `isDefault` set to `true`. The user must be assigned the `TenantAdmin` role.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Responses

#### 200

Authentication settings retrieved successfully.

*   application/json object   The authentication settings for a tenant, controlling user session duration and inactivity behavior. 

Show application/json properties 

    *   id string   The unique identifier for the authentication settings. 
format = "uid"

    *   tenantId string Required   The tenant unique identifier associated with the authentication settings. 
format = "uid"

    *   isDefault boolean   `true` if the authentication settings are using tenant-wide defaults. No custom values have been saved for this tenant. 
    *   maxUserSessionLifespanMinutes integer Required   Maximum total lifespan for a user session, in minutes. Sessions are invalidated after this duration regardless of activity. 
format = int64

    *   dcrAllowedAuthenticationMethods array of strings   The allowed authentication methods for dynamic client registration. Only present when dynamic client registration is enabled. 
Values may be any of: "none""client_secret"

    *   dynamicClientRegistrationEnabled boolean   Indicates whether dynamic client registration is enabled for this tenant. 
    *   userSessionInactivityTimeoutMinutes integer Required   Maximum inactivity period for a user session, in minutes. Sessions that have been idle for longer than this value are invalidated. 
format = int64

#### 401

Not authorized.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

#### 403

The authenticated user does not have the `TenantAdmin` role required to read authentication settings.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

#### 404

Authentication settings not found.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

#### 429

Request has been rate limited.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

#### 500

Internal server error.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

 GET /api/core/auth-settings

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `GET /api/core/auth-settings` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/core/auth-settings',  {    method: 'GET',    headers: {      'Content-Type': 'application/json',    },  },)
```

`qlik core auth-settings ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/core/auth-settings" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "id": "507f191e810c19729de860ea",  "tenantId": "644fd58b846d649c82eba436",  "isDefault": false,  "maxUserSessionLifespanMinutes": 1440,  "dcrAllowedAuthenticationMethods": [    "client_secret"  ],  "dynamicClientRegistrationEnabled": false,  "userSessionInactivityTimeoutMinutes": 60}`

## [](https://qlik.dev/apis/rest/core/auth-settings/#patch-api-core-auth-settings)Update authentication settings

Updates one or more authentication settings for the tenant using JSON Patch (RFC 6902). Supports `replace` operations on `/userSessionInactivityTimeoutMinutes`, `/maxUserSessionLifespanMinutes`, and `/dynamicClientRegistrationEnabled`. The value for `maxUserSessionLifespanMinutes` must be a whole number of hours (divisible by 60). The user must be assigned the `TenantAdmin` role.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

An array of JSON Patch operations to apply to the authentication settings.

*   application/json array of objects   An array of JSON Patch documents for authentication settings. 

Show application/json properties 

    *   op string Required   The operation to be performed. 
Can be one of: "replace"

    *   path string Required   A JSON Pointer to the authentication settings field. Use `/dynamicClientRegistrationEnabled` only with a boolean `value`. Field `/dcrAllowedAuthenticationMethods` is only available when dynamic client registration is enabled. 
Can be one of: "/userSessionInactivityTimeoutMinutes""/maxUserSessionLifespanMinutes""/dynamicClientRegistrationEnabled""/dcrAllowedAuthenticationMethods"

    *   value integer|boolean|string|array Required   Value to set for the targeted authentication settings field. Timeout fields accept only integer values, `/dynamicClientRegistrationEnabled` accepts only boolean values, and `/dcrAllowedAuthenticationMethods` accepts an array of strings. 

One of:
        *   integer   
format = int64

        *   boolean   
        *   string   
        *   array of strings   

### Responses

#### 200

Authentication settings updated successfully.

*   application/json object   The authentication settings for a tenant, controlling user session duration and inactivity behavior. 

Show application/json properties 

    *   id string   The unique identifier for the authentication settings. 
format = "uid"

    *   tenantId string Required   The tenant unique identifier associated with the authentication settings. 
format = "uid"

    *   isDefault boolean   `true` if the authentication settings are using tenant-wide defaults. No custom values have been saved for this tenant. 
    *   maxUserSessionLifespanMinutes integer Required   Maximum total lifespan for a user session, in minutes. Sessions are invalidated after this duration regardless of activity. 
format = int64

    *   dcrAllowedAuthenticationMethods array of strings   The allowed authentication methods for dynamic client registration. Only present when dynamic client registration is enabled. 
Values may be any of: "none""client_secret"

    *   dynamicClientRegistrationEnabled boolean   Indicates whether dynamic client registration is enabled for this tenant. 
    *   userSessionInactivityTimeoutMinutes integer Required   Maximum inactivity period for a user session, in minutes. Sessions that have been idle for longer than this value are invalidated. 
format = int64

#### 400

Invalid request body.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

#### 401

Not authorized.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

#### 403

The authenticated user does not have the `TenantAdmin` role required to update authentication settings.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

#### 404

Authentication settings not found.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

#### 429

Request has been rate limited.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

#### 500

Internal server error.

*   application/json object   The error response object describing the error from the handling of an HTTP request. 

Show application/json properties 

    *   errors array of objects   An array of errors related to the operation. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   traceId string   A unique identifier for tracing the error. 

 PATCH /api/core/auth-settings

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `PATCH /api/core/auth-settings` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/core/auth-settings',  {    method: 'PATCH',    headers: {      'Content-Type': 'application/json',    },    body: JSON.stringify([      {        op: 'replace',        path: '/userSessionInactivityTimeoutMinutes',        value: 60,      },      {        op: 'replace',        path: '/maxUserSessionLifespanMinutes',        value: 1440,      },      {        op: 'replace',        path: '/dynamicClientRegistrationEnabled',        value: true,      },      {        op: 'replace',        path: '/dcrAllowedAuthenticationMethods',        value: ['client_secret'],      },    ]),  },)
```

`qlik core auth-settings patch \  --op 'replace' \  --path '/userSessionInactivityTimeoutMinutes' \  --value 60`

`curl "https://{tenant}.{region}.qlikcloud.com/api/core/auth-settings" \-X PATCH \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '[{"op":"replace","path":"/userSessionInactivityTimeoutMinutes","value":60},{"op":"replace","path":"/maxUserSessionLifespanMinutes","value":1440},{"op":"replace","path":"/dynamicClientRegistrationEnabled","value":true},{"op":"replace","path":"/dcrAllowedAuthenticationMethods","value":["client_secret"]}]'`

### Example Response

`{  "id": "507f191e810c19729de860ea",  "tenantId": "644fd58b846d649c82eba436",  "isDefault": false,  "maxUserSessionLifespanMinutes": 1440,  "dcrAllowedAuthenticationMethods": [    "client_secret"  ],  "dynamicClientRegistrationEnabled": false,  "userSessionInactivityTimeoutMinutes": 60}`

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