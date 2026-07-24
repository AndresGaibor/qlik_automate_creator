---
title: "Trust scores REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/data-governance/trust-scores/"
local_path: "docs/endpoints/data-governance-trust-scores.md"
---

Title: Trust scores REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/data-governance/trust-scores/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Trust scores

*   [Retrieve Trust Scores in bulk](https://qlik.dev/apis/rest/data-governance/trust-scores/#post-api-data-governance-trust-scores-results-data-sets-actions-filter "Retrieve Trust Scores in bulk")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)
6.    / 
7.    data-governance 

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/data-governance/trust-scores.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Trust scores

[Download OpenAPI spec](https://qlik.dev/specs/rest/data-governance/trust-scores.json)

The Qlik Trust Score™ helps you answer the question “How trustable is my dataset?”. This global quality indicator aggregates several metrics into a single and easy-to-understand score, providing visibility on the health of individual datasets through an overall score and a per-axis and per-metric breakdown.

## Endpoints

*   [POST /api/data-governance/trust-scores/results/data-sets/actions/filter](https://qlik.dev/apis/rest/data-governance/trust-scores/#post-api-data-governance-trust-scores-results-data-sets-actions-filter)

## [](https://qlik.dev/apis/rest/data-governance/trust-scores/#post-api-data-governance-trust-scores-results-data-sets-actions-filter)Retrieve Trust Scores in bulk

Returns the current Trust Score for up to 100 datasets in a single request. Each result includes the overall score, per-axis breakdown (`weight`, `score`, `enabled` state), and per-metric details. Datasets with no computed Trust Score are omitted from the response. Requires `dataset:read` and `dataquality:read` permissions.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

List of dataset IDs to retrieve Trust Scores for. Maximum 100 IDs per request.

*   application/json object   Request body for batch-filtering Trust Score results by dataset IDs. 

Show application/json properties 

    *   datasetIds array of strings Required   List of dataset IDs to retrieve Trust Scores for. Maximum 100 IDs per request. 
minItems = 1,  maxItems = 100

### Responses

#### 200

Trust Score results for the requested datasets. Datasets with no computed Trust Score are omitted.

*   application/json object   Trust Score results for the requested datasets. Datasets with no computed Trust Score are omitted. 

Show application/json properties 

    *   data array of objects Required   List of Trust Score results, one entry per dataset found. 

Show data properties 

        *   axes array of objects Required   Per-axis breakdown of the Trust Score. 

Show axes properties 

            *   id string Required   Defines the axis of the Trust Score. 
Can be one of: "VALIDITY""COMPLETENESS""USAGE""DISCOVERABILITY""ACCURACY""DIVERSITY""TIMELINESS"

            *   score number   Computed score for this axis [0, 100]. Omitted when axis is not applicable. 
            *   weight integer Required   Defines the weight of the axis or metric in the Trust Score. 
minimum = 0,  maximum = 100,  format = int32

            *   enabled boolean   Whether this axis is enabled in the tenant configuration. Disabled axes have a `weight` of `0` and do not affect the overall score. 
            *   metrics array of objects Required   Per-metric breakdown contributing to this axis score. 

Show metrics properties 

                *   id string Required   Defines the metric of the axis in the Trust Score. 
Can be one of: "VALIDITY_QUALITY""COMPLETENESS_QUALITY""USAGE_APPS""USAGE_APP_VIEWS""DISCOVERABILITY_DESCRIPTION""DISCOVERABILITY_TAGS""DISCOVERABILITY_ACTIVATED""DISCOVERABILITY_FIELD_DESCRIPTION""DISCOVERABILITY_FIELD_TAGS""ACCURACY_QUALITY""DIVERSITY_SOURCE""DIVERSITY_VOLUME""DIVERSITY_EVENNESS""TIMELINESS_FRESHNESS"

                *   score number   Computed score for this metric [0, 100]. Omitted when metric is not applicable. 
                *   weight integer Required   Defines the weight of the axis or metric in the Trust Score. 
minimum = 0,  maximum = 100,  format = int32

            *   applicable boolean   Whether this axis is applicable for the dataset. An axis may be enabled but not applicable (for example, `TIMELINESS` when no freshness threshold is set). 
            *   previousScore number   Axis score from the previous computation, for change tracking. 

        *   score number Required   Overall weighted Trust Score across all enabled axes [0, 100]. 
        *   datasetId string Required   Unique identifier of the dataset this score belongs to. 
        *   updatedAt string Required   Timestamp of the last Trust Score computation for this dataset. 
format = "date-time"

        *   previousScore number   Overall Trust Score from the previous computation, for change tracking. 

#### 400

The request is in incorrect format.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 401

User does not have valid authentication credentials.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 403

User does not have access to the resource.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 500

Internal Server Error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

#### 503

Requested service is not available.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   
        *   status string   

    *   traceId string   

 POST /api/data-governance/trust-scores/results/data-sets/actions/filter

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `POST /api/data-governance/trust-scores/results/data-sets/actions/filter` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/data-governance/trust-scores/results/data-sets/actions/filter',  {    method: 'POST',    headers: {      'Content-Type': 'application/json',    },    body: JSON.stringify({      datasetIds: [        'Jjk5NNHiUObQe8xTyeLgP5nQjKTpEr8R',      ],    }),  },)
```

`# qlik-cli has not implemented support for POST /api/data-governance/trust-scores/results/data-sets/actions/filter yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/data-governance/trust-scores/results/data-sets/actions/filter" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"datasetIds":["Jjk5NNHiUObQe8xTyeLgP5nQjKTpEr8R"]}'`

### Example Response

`{  "data": [    {      "axes": [        {          "id": "TIMELINESS",          "score": 42,          "weight": 50,          "enabled": true,          "metrics": [            {              "id": "TIMELINESS_FRESHNESS",              "score": 42,              "weight": 50            }          ],          "applicable": true,          "previousScore": 42        }      ],      "score": 42,      "datasetId": "Jjk5NNHiUObQe8xTyeLgP5nQjKTpEr8R",      "updatedAt": "2018-03-20T09:12:28Z",      "previousScore": 42    }  ]}`

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