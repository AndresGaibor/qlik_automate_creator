---
title: "ODAG apps REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/analytics/odag-apps/"
local_path: "docs/endpoints/analytics-odag-apps.md"
---

Title: ODAG apps REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/analytics/odag-apps/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## ODAG apps

*   [List ODAG Analytics Applications by type](https://qlik.dev/apis/rest/analytics/odag-apps/#get-api-analytics-odag-apps "List ODAG Analytics Applications by type")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)
6.    / 
7.    analytics 

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/analytics/odag-apps.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# ODAG apps

[Download OpenAPI spec](https://qlik.dev/specs/rest/analytics/odag-apps.json)

ODAG applications are accessible through a read-only API. Discover and list applications filtered by type: selection (entry points), template (source applications for generation), or generated (on-demand applications created from ODAG requests).

Note

This API is read-only. All mutations on generated applications are performed through the [ODAG Requests API](https://qlik.dev/apis/rest/analytics/odag-requests/).

## Endpoints

*   [GET /api/analytics/odag-apps](https://qlik.dev/apis/rest/analytics/odag-apps/#get-api-analytics-odag-apps)

## [](https://qlik.dev/apis/rest/analytics/odag-apps/#get-api-analytics-odag-apps)List ODAG Analytics Applications by type

Retrieves ODAG Analytics Applications filtered by type: `selection` (used as entry points), `template` (source Analytics Application for generation), or `generated` (Analytics Applications created via ODAG requests).

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Query Parameters

*   appType string Required   The type of ODAG Analytics Application. 
Can be one of: "selection""template""generated"

### Responses

#### 200

Successful response.

*   application/json object   The response body for ODAG Analytics Applications. 

Show application/json properties 

    *   data array of objects   Condensed state of an Analytics Application returned in `state` for Link, LinkUsage, Request, and ODAG Apps GET calls. 

Show data properties 

        *   id string Required   The system-assigned ID for an Analytics Application. 
minLength = 1

        *   name string Required   The name of an Analytics Application. 
minLength = 1

#### 403

Forbidden.

*   application/json object   A standard error response containing a list of one or more errors. 

Show application/json properties 

    *   errors array of objects   A single error entry within an error response. 

Show errors properties 

        *   code string   A unique code used to identify the template form of the message in i18n tables (language independent). 
        *   meta object   Additional metadata associated with an error. 

Show meta properties 

            *   statusCode integer   The HTTP status code for the error. Generally speaking, the following codes have these meanings: `200` - Success, `201` - Success (object created), `400` - Error with user input, `403` - Authorization error (user lacks permission), `404` - Object not found, `409` - Attempt to change an object using an obsolete last ModifiedDate. 
format = int32

        *   title string   
        *   detail string   The message describing the error. 

    *   traceId string   A unique ID of the trace which the error occurred in. Makes it possible to locate involved services and find log messages from the time of the error. 

 GET /api/analytics/odag-apps

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `GET /api/analytics/odag-apps` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/analytics/odag-apps',  {    method: 'GET',    headers: {      'Content-Type': 'application/json',    },  },)
```

`# qlik-cli has not implemented support for GET /api/analytics/odag-apps yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/analytics/odag-apps" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "data": [    {      "id": "string",      "name": "appname"    }  ]}`

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