---
title: "Entitlement consumption REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/consumption/"
local_path: "docs/endpoints/consumption.md"
---

Title: Entitlement consumption REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/consumption/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Entitlement consumption

*   [Retrieves the list of executions on an specific tenant](https://qlik.dev/apis/rest/consumption/#get-api-v1-consumption-executions "Retrieves the list of executions on an specific tenant")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/consumption.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Entitlement consumption

Tracks usage of entitled features in a tenant, used for the consumption metrics in the admin console in a tenant.

[Download OpenAPI spec](https://qlik.dev/specs/rest/consumption.json)

## Endpoints

*   [GET /api/v1/consumption/executions](https://qlik.dev/apis/rest/consumption/#get-api-v1-consumption-executions)

## [](https://qlik.dev/apis/rest/consumption/#get-api-v1-consumption-executions)Retrieves the list of executions on an specific tenant

Lists of execution records by tenant.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Query Parameters

*   actionToBlock string   
*   filter string   The advanced filtering to use for the query. Refer to [RFC 7644](https://datatracker.ietf.org/doc/rfc7644/) for the syntax.

example `taskName eq "automation_run_ended" or taskName eq "report_triggered" or or taskName eq "dataVolumeAggregated"`

The following fields are supported: `scope`, `resourcetype`, `resourceaction`, `resourceid`, `capacitylimit`, `localusage`, `globalusage`, `overage`, `blocked`, `periodstart`, `periodend`, `consumptionreportid`, `blockedeventtime`, `overageeventtime`, `taskname`, `taskdescription`, `userid`, `tenantid`, `customerfacing`, `actiontoblock` 
*   limit integer   Limit the returned result set 
minimum = 1,  maximum = 200,  default = 20,  default = 20

*   offset integer   Offset for pagination - how many elements to skip 
minimum = 0,  default = 0,  default = 0

*   page string   The cursor to the page of data. 
*   periodsToInclude array of strings   Specifies which periods to include regardless of the period type, start and end specified 
Values may be any of: "current""previous"

*   sort array of strings   
Values may be any of: "periodstart""-periodstart""+periodstart""periodend""-periodend""+periodend"

### Responses

#### 200

The executions list has been successfully returned

*   application/json object   properties that should be added to every list response 

Show application/json properties 

    *   totalCount integer Required   total count of entries in the collection as a whole 
    *   currentPageCount integer Required   count of entries on the currently shown page 
    *   data array of objects   

Show data properties 

        *   unit string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   Unit of measurement for the resource consumption 
        *   scope array of strings [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   
Values may be any of: "user""tenant""resourceId""resourceType""resourceAction"

        *   userId string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The user id. 
        *   blocked boolean [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   
default = false

        *   overage boolean [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   
default = false

        *   segments array of objects   

Show additional optional properties 

            *   object object   

        *   taskName string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The resource task name. 
        *   tenantId string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The tenant id. 
        *   periodEnd string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The end of the associated period. 
        *   localUsage number [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The local usage. 
format = number

        *   periodType string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   
Can be one of: "day""month""year""""fixed""minute"

        *   resourceId string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The resource id. 
        *   updateTime string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The RFC3339 timestamp when the resource was updated. 
        *   enforcement array of objects [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   Contains a list of resources that are blocked when quota for this is reached. 

Show enforcement properties 

            *   resourceType string   Resource type to be blocked 
            *   actionToBlock string   Resource action type to be blocked 

        *   globalUsage number [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The global usage. 
format = number

        *   periodStart string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The start of the associated period. 
        *   resourceType string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The resource type. 
Can be one of: "app""automations""space""data.volume.consumption"

        *   scopeMapping string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The map to the resource scope. 
        *   capacityLimit number [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The capacity limit. 
        *   closeToOverage boolean [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   
default = false

        *   customerFacing boolean [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The field to determine if a resource should be visible on the client. 
        *   guardrailLimit number [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The guardrail limit. 
        *   resourceAction string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The resource action. 
Can be one of: "report.generated""reload""scheduledReload""executed""aggregation""import""updated""deployed""3rd_party_executed""standard_executed"

        *   taskDescription string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The resource task description. 
        *   blockedEventTime string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   RFC3339 timestamp when a block event was last emitted for this execution. 
        *   overageEventTime string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   RFC3339 timestamp when a overage event was last emitted for this execution. 
        *   consumptionReportId string [Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   The id of the consumption report 
format = "uid"

    *   links object   

Show links properties 

        *   next object   

Show next properties 

            *   href string   URL to particular set of elements 
            *   type string   Page type, can be next or prev 
Can be one of: "prev""next"

            *   token string   Page unique token 

        *   prev object   

Show prev properties 

            *   href string   URL to particular set of elements 
            *   type string   Page type, can be next or prev 
Can be one of: "prev""next"

            *   token string   Page unique token 

        *   self object   Object with Href to a particular element or set of elements 

Show self properties 

            *   href string   

    *   overage boolean   
    *   closeToOverage boolean   
    *   globalUsageAvailable boolean   

#### 404

Resource does not exist.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Error code specific to usage-tracker. 
        *   meta object   meta properties for an error. 
        *   title string   Error title. 
        *   detail string   Error cause. 

    *   traceId string   

#### 500

Internal server error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Error code specific to usage-tracker. 
        *   meta object   meta properties for an error. 
        *   title string   Error title. 
        *   detail string   Error cause. 

    *   traceId string   

#### default

Error response.

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string   Error code specific to usage-tracker. 
        *   meta object   meta properties for an error. 
        *   title string   Error title. 
        *   detail string   Error cause. 

    *   traceId string   

 GET /api/v1/consumption/executions

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.consumption.getConsumptionExecutions(  {},)
```

`qlik consumption executions`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/consumption/executions" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "totalCount": 1,  "currentPageCount": 1,  "data": [    {      "unit": "string",      "scope": [        "tenant",        "resourceType"      ],      "userId": "string",      "blocked": false,      "overage": false,      "segments": [        {          "QDI": 10        },        {          "APP": 10        }      ],      "taskName": "task_name",      "tenantId": "string",      "periodEnd": "2022-01-31",      "localUsage": 20,      "periodType": "month",      "resourceId": "228ac375-086e-4652-b9c0-fa8689bac75f",      "updateTime": "string",      "enforcement": [        {          "resourceType": "string",          "actionToBlock": "string"        }      ],      "globalUsage": 29,      "periodStart": "2022-01-01",      "resourceType": "app",      "scopeMapping": "string",      "capacityLimit": 50,      "closeToOverage": false,      "customerFacing": true,      "guardrailLimit": 20,      "resourceAction": "reload",      "taskDescription": "some description",      "blockedEventTime": "string",      "overageEventTime": "string",      "consumptionReportId": "01xQ1chLoHkOikyzUGcHJquteNrAfketW"    }  ],  "links": {    "next": {      "href": "http://localhost:8787/v1/items?limit=12",      "type": "next",      "token": "JwAAAAJfaWQAGQAAADVjZjUwM2NjMjVkYzlhMTM1MzYwZTVjZAAA"    },    "prev": {      "href": "http://localhost:8787/v1/items?limit=12",      "type": "next",      "token": "JwAAAAJfaWQAGQAAADVjZjUwM2NjMjVkYzlhMTM1MzYwZTVjZAAA"    },    "self": {      "href": "http://localhost:8787/v1/items/5da5825325dc9a0dd0260af9"    }  },  "overage": false,  "closeToOverage": false,  "globalUsageAvailable": true}`

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