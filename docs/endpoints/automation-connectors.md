---
title: "Automation connectors REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/automation-connectors/"
local_path: "docs/endpoints/automation-connectors.md"
---

Title: Automation connectors REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/automation-connectors/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Automation connectors

*   [List automation connectors](https://qlik.dev/apis/rest/automation-connectors/#get-api-v1-automation-connectors "List automation connectors")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/automation-connectors.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Automation connectors

[Download OpenAPI spec](https://qlik.dev/specs/rest/automation-connectors.json)

Automation connectors let you integrate third-party services and applications into your data analytics workflows. Use this API to discover available connectors and understand billing characteristics.

Use the namespaced API

Use the [Automation Connectors API in the Workflows namespace](https://qlik.dev/apis/rest/workflows/automation-connectors/) for all new implementations.

This API remains available and fully supported, but consider using the namespaced API for new implementations.

## Endpoints

*   [GET /api/v1/automation-connectors](https://qlik.dev/apis/rest/automation-connectors/#get-api-v1-automation-connectors)

## [](https://qlik.dev/apis/rest/automation-connectors/#get-api-v1-automation-connectors)List automation connectors

Replacement available

For new integrations, and when updating your existing integrations, use:

*   `GET workflows/automation-connectors`

Retrieves a list of automation connectors.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)
Replaced by*   [GET workflows/automation-connectors](https://qlik.dev/apis/rest/workflows/automation-connectors/#get-api-workflows-automation-connectors)

### Query Parameters

*   cursor string   Pagination cursor returned from a previous request. 
*   filter string   Filters the result based on the specified criteria: name. 
*   limit integer   The number of automation connectors to retrieve. 
minimum = 1,  maximum = 200,  default = 100,  default = 100

*   sort string   The field to sort by, with +- prefix indicating sort order. (`?sort=-name` => sort on the `name` field using descending order). 
Can be one of: "id""-id""+id""name""+name""-name"

default = "id"

### Responses

#### 200

OK Response

*   application/json object   

Show application/json properties 

    *   data array of objects   

Show data properties 

        *   id string   
format = "uuid"

        *   name string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The name of an automation connector. 
        *   billable boolean   Indicates if the connector is billable. 
        *   logoLarge string   The URL to the large logo of the connector. 
        *   logoSmall string   The URL to the small logo of the connector. 
        *   logoMedium string   The URL to the medium logo of the connector. 
        *   description string   The description of the automation connector. 
        *   hasWebhooks boolean   Indicates if the connector supports webhooks. 

    *   links object   

Show links properties 

        *   next object   

Show next properties 

            *   href string   The URL to a resource request 

        *   prev object   

Show prev properties 

            *   href string   The URL to a resource request 

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

#### 503

Service Unavailable

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error 
        *   title string Required   A summary of what went wrong 
        *   detail string   May be used to provide additional details 

    *   traceId string   A way to trace the source of the error. 

 GET /api/v1/automation-connectors

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `GET /api/v1/automation-connectors` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/v1/automation-connectors',  {    method: 'GET',    headers: {      'Content-Type': 'application/json',    },  },)
```

`qlik automation-connector ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/automation-connectors" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "data": [    {      "id": "0d87347d-27c0-11ea-921c-022e6b5ea1e2",      "name": "Airtable",      "billable": "true",      "logoLarge": "https://cdn.qlikcloud.com/automations/logos/a2649cabda63b339ebc68a0c8d028f08.png",      "logoSmall": "https://cdn.qlikcloud.com/automations/logos/a14638b5bf73f6d360f3c2732cf94bd9.png",      "logoMedium": "https://cdn.qlikcloud.com/automations/logos/db2e3454fd01a6c3a53c09609a0b504f.png",      "description": "Airtable is a cloud collaboration service.",      "hasWebhooks": "true"    }  ],  "links": {    "next": {      "href": "string"    },    "prev": {      "href": "string"    }  }}`

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