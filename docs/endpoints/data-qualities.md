---
title: "Data qualities REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/data-qualities/"
local_path: "docs/endpoints/data-qualities.md"
---

Title: Data qualities REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/data-qualities/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Data qualities

*   [Trigger data quality computation](https://qlik.dev/apis/rest/data-qualities/#post-api-v1-data-qualities-computations "Trigger data quality computation") D 
*   [Get data quality computation status](https://qlik.dev/apis/rest/data-qualities/#get-api-v1-data-qualities-computations-computationId "Get data quality computation status") D 
*   [Get global data quality](https://qlik.dev/apis/rest/data-qualities/#get-api-v1-data-qualities-global-results "Get global data quality") D 

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/data-qualities.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Data qualities

API for triggering data quality computations and retrieving global results to assess the quality of your datasets.

[Download OpenAPI spec](https://qlik.dev/specs/rest/data-qualities.json)

## Endpoints

*   [POST /api/v1/data-qualities/computations](https://qlik.dev/apis/rest/data-qualities/#post-api-v1-data-qualities-computations)
*   [GET /api/v1/data-qualities/computations/{computationId}](https://qlik.dev/apis/rest/data-qualities/#get-api-v1-data-qualities-computations-computationId)
*   [GET /api/v1/data-qualities/global-results](https://qlik.dev/apis/rest/data-qualities/#get-api-v1-data-qualities-global-results)

## [](https://qlik.dev/apis/rest/data-qualities/#post-api-v1-data-qualities-computations)Trigger data quality computation

Deprecated

Replacement available

For new integrations, and when updating your existing integrations, use:

*   `POST data-governance/data-qualities/computations`

Triggers a full data quality computation for a dataset, running profile calculation followed by data quality assessment. Returns a `computationId` that can be used to track progress via the computation status endpoint (`GET /data-qualities/computations/{computationId}`). The computation runs asynchronously. Poll the status endpoint until `status` is `SUCCEEDED` or `FAILED`.

### Facts

Rate limit[Special](https://qlik.dev/apis/rest/rate-limiting/)(10 requests per minute)
Deprecated This endpoint is deprecated and will eventually be removed. Read our API policy [here](https://qlik.dev/apis/api-policy/).
Replaced by*   [POST data-governance/data-qualities/computations](https://qlik.dev/apis/rest/data-governance/data-qualities/#post-api-data-governance-data-qualities-computations)

### Request Body

Required

*   application/json object   

Request payload for triggering a data quality computation. The `connectionId` is optional for file-based datasets. If none of the sampling parameters are provided, the following defaults apply:

    *   `executionMode: PULLUP`
    *   `sampleMode: ABSOLUTE`
    *   `sampleSize: 1000`

Show application/json properties 

    *   datasetId string Required   The ID of the dataset 
pattern = "^[0-9a-zA-Z-]{1,36}$"

    *   connectionId string   The ID of the connection 
pattern = "^[0-9a-zA-Z-]{1,36}$"

    *   sampleMode string   Specifies how the dataset is sampled. `ABSOLUTE` represents a fixed number of rows, while `RELATIVE` refers to a percentage of the total dataset rows. 
Can be one of: "ABSOLUTE""RELATIVE"

    *   sampleSize integer   The actual value of the selected sampling method size (either a fixed number for `ABSOLUTE` mode or a percentage for `RELATIVE` mode). Maximum allowed value for `ABSOLUTE` mode is `100000`. 
minimum = 1,  maximum = 100000,  format = int64

    *   executionMode string   Specifies where the data quality computation takes place. In `PUSHDOWN` mode, it runs within the Cloud Data Warehouse (e.g., Snowflake, Databricks), whereas in `PULLUP` mode, it runs in Qlik Cloud. 
Can be one of: "PUSHDOWN""PULLUP"

### Responses

#### 202

Computation triggered. The response body contains the `computationId` for tracking progress.

*   application/json object   Response returned when a data quality computation is successfully triggered. 

Show application/json properties 

    *   computationId string Required   The unique identifier of the triggered computation. Use this value to poll for status. 

#### 400

The request is in incorrect format.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

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

    *   traceId string   

 POST /api/v1/data-qualities/computations

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.dataQualities.triggerDataQualitiesComputation(  {    connectionId:      '2b855c3d-426c-4aac-90cf-0edf9fc294d3',    datasetId: '669144f5aa2d642638ef1dd0',    executionMode: 'PULLUP',    sampleMode: 'ABSOLUTE',    sampleSize: 10000,  },)
```

`# qlik-cli has not implemented support for POST /api/v1/data-qualities/computations yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/data-qualities/computations" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"datasetId":"669144f5aa2d642638ef1dd0","sampleMode":"ABSOLUTE","sampleSize":10000,"connectionId":"2b855c3d-426c-4aac-90cf-0edf9fc294d3","executionMode":"PULLUP"}'`

### Example Response

`{  "computationId": "string"}`

## [](https://qlik.dev/apis/rest/data-qualities/#get-api-v1-data-qualities-computations-computationId)Get data quality computation status

Deprecated

Replacement available

For new integrations, and when updating your existing integrations, use:

*   `GET data-governance/data-qualities/computations/{computationId}`

Retrieves the current execution status of a data quality computation. Poll this endpoint after triggering a computation to determine when results are available. The `status` field returns one of `REQUESTED`, `SUBMITTED`, `PROFILE_REQUESTED`, `SUCCEEDED`, `FAILED`, or `PROFILE_FAILED`.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)
Deprecated This endpoint is deprecated and will eventually be removed. Read our API policy [here](https://qlik.dev/apis/api-policy/).
Replaced by*   [GET data-governance/data-qualities/computations/{computationId}](https://qlik.dev/apis/rest/data-governance/data-qualities/#get-api-data-governance-data-qualities-computations-computationId)

### Path Parameters

*   computationId string Required   The unique identifier of the computation, as returned by `POST /data-governance/data-qualities/computations`. 
pattern = "^[a-zA-Z0-9-]{1,36}$"

### Responses

#### 200

Current execution status of the computation

*   application/json object   

Show application/json properties 

    *   status string Required   
Can be one of: "PROFILE_REQUESTED""PROFILE_FAILED""REQUESTED""SUBMITTED""SUCCEEDED""FAILED"

#### 400

The request is in incorrect format.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

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

    *   traceId string   

#### 404

No computation found with the specified `computationId`.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

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

    *   traceId string   

 GET /api/v1/data-qualities/computations/{computationId}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.dataQualities.getDataQualitiesComputation(  '4db06daa-3117-412e-8fb4-b29c937f9a0e',)
```

`# qlik-cli has not implemented support for GET /api/v1/data-qualities/computations/{computationId} yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/data-qualities/computations/{computationId}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "status": "PROFILE_REQUESTED"}`

## [](https://qlik.dev/apis/rest/data-qualities/#get-api-v1-data-qualities-global-results)Get global data quality

Deprecated

Replacement available

For new integrations, and when updating your existing integrations, use:

*   `GET data-governance/data-qualities/global-results`

Retrieves the global quality results for a dataset, showing counts of valid, invalid, empty, and total sample cells.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)
Deprecated This endpoint is deprecated and will eventually be removed. Read our API policy [here](https://qlik.dev/apis/api-policy/).
Replaced by*   [GET data-governance/data-qualities/global-results](https://qlik.dev/apis/rest/data-governance/data-qualities/#get-api-data-governance-data-qualities-global-results)

### Query Parameters

*   datasetId string Required   The unique identifier of the dataset. 
pattern = "^[0-9a-zA-Z-]{1,36}$"

*   connectionId string   The unique identifier of the connection. 
pattern = "^[0-9a-zA-Z-]{1,36}$"

### Responses

#### 200

Global quality results for the dataset, including counts of valid, invalid, empty, and total sample cells per connection.

*   application/json object   

Show application/json properties 

    *   datasetId string Required   The unique identifier of the dataset. 
    *   qualities array of objects Required   

Show qualities properties 

        *   quality object Required   

Show quality properties 

            *   empty integer Required   Number of empty sample cells. 
format = int64

            *   total integer Required   Total number of cells in the sample. 
format = int64

            *   valid integer Required   Number of valid sample cells. 
format = int64

            *   invalid integer Required   Number of invalid sample cells. 
format = int64

            *   updatedAt string Required   Timestamp of the most recent data quality computation for this dataset and connection. 
format = "date-time"

        *   connectionId string Required   The unique identifier of the connection. 

#### 400

The request is in incorrect format.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

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

    *   traceId string   

#### 404

No quality results found for the specified dataset.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   
        *   title string   
        *   detail string   

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

    *   traceId string   

 GET /api/v1/data-qualities/global-results

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.dataQualities.getDataQualitiesGlobalResults(  { datasetId: 'string' },)
```

`# qlik-cli has not implemented support for GET /api/v1/data-qualities/global-results yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/data-qualities/global-results" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "datasetId": "string",  "qualities": [    {      "quality": {        "empty": 42,        "total": 42,        "valid": 42,        "invalid": 42,        "updatedAt": "2018-10-30T07:06:22Z"      },      "connectionId": "string"    }  ]}`

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