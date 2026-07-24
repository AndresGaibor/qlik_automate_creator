---
title: "Natural language REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/questions/"
local_path: "docs/endpoints/questions.md"
---

Title: Natural language REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/questions/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Natural language

*   [Returns the generated response for parsed chat queries, if no app was specified nor present in conversation context, suggests matching apps.](https://qlik.dev/apis/rest/questions/#post-api-v1-questions-actions-ask "Returns the generated response for parsed chat queries, if no app was specified nor present in conversation context, suggests matching apps.")
*   [Returns NL metrics based on provided app IDs the user has access to.](https://qlik.dev/apis/rest/questions/#post-api-v1-questions-actions-filter "Returns NL metrics based on provided app IDs the user has access to.")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/questions.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Natural language

Ask natural languages questions and context aware partial questions against applications enabled for conversational analytics or a specific app to receive Insight Advisor generated responses and suggestions

[Download OpenAPI spec](https://qlik.dev/specs/rest/questions.json)

## Endpoints

*   [POST /api/v1/questions/actions/ask](https://qlik.dev/apis/rest/questions/#post-api-v1-questions-actions-ask)
*   [POST /api/v1/questions/actions/filter](https://qlik.dev/apis/rest/questions/#post-api-v1-questions-actions-filter)

## [](https://qlik.dev/apis/rest/questions/#post-api-v1-questions-actions-ask)Returns the generated response for parsed chat queries, if no app was specified nor present in conversation context, suggests matching apps.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Header Parameters

*   qlik-web-integration-id string   This header is only required for external clients or mashups for QCS, this value of this property should be the id of the web integration set up for the external client/mashup 

### Request Body

Required

*   application/json object   

Show application/json properties 

    *   app object   

Show app properties 

        *   id string   
        *   name string   

    *   lang string   The language to assume when parsing, specified as an ISO-639-1 code. Defaults to 'en' (English). 
    *   text string Required   The sentence that will be parsed. 
    *   disableFollowups boolean   The flag specifies whether to disable follow-up recommendations. 
default = false

    *   disableNarrative boolean   Flag that specifies whether the narratives should be generated for the user query or not. 
default = false

    *   recommendationId string   property that contains the Id of the recommendation for which the response should be generated. 
    *   clearEntityContext boolean   Flag that clears the entity context. 
default = false

    *   visualizationTypes array of strings   Specify visualizationTypes for only which visualization object should be provided if enableVisualizations is set to true. For eg. ['linechart', 'barchart'] 
    *   enableVisualizations boolean   Flag that specifies whether visualization object should be provided or not. 
default = false

    *   disableConversationContext boolean   Flag that specifies either to enable converastion context. 
default = false

### Responses

#### 200

The sentence is not created as an app was not specified, but matching apps are suggested

*   application/json object   

Show application/json properties 

    *   apps array of objects   

Show apps properties 

        *   id string   
        *   name string   

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

    *   nluInfo object   

Show nluInfo properties 

        *   elements array of objects   

Show elements properties 

            *   text string   
            *   type string   
            *   entity boolean   
            *   isFilter boolean   
            *   typeName string   
            *   errorText string   
            *   filterText string   
            *   typeTranslated string   
            *   filterFieldName string   

    *   conversationalResponse object   

Show conversationalResponse properties 

        *   apps array of objects   

Show apps properties 

            *   id string   
            *   name string   

        *   responses array of objects   

Show responses properties 

            *   type string   
            *   imageUrl string   
            *   infoType string   
            *   sentence object   

Show sentence properties 

                *   text string   

            *   narrative object   

Show narrative properties 

                *   text string   

            *   infoValues array of arrays   

One of:
                *   array of strings   
                *   array of objects   

Show  properties 

                    *   id string   
                    *   name string   

            *   errorMessage string   
            *   followupSentence string   
            *   renderVisualization object   

Show renderVisualization properties 

                *   data object   Data object should be used to render visualization 
                *   language string   

        *   contextInfo string   For contextual responses, this string contains a list of entities that are used to produce the response. 
        *   drillDownURI string   The URL with the query injected to insight advisor of the app to which the query belongs. 
        *   sentenceWithMatches string   

#### 201

The sentence created

*   application/json object   The attributes of sentences. 

Show application/json properties 

    *   apps array of objects   

Show apps properties 

        *   id string   
        *   name string   

    *   nluInfo object   

Show nluInfo properties 

        *   elements array of objects   

Show elements properties 

            *   text string   
            *   type string   
            *   entity boolean   
            *   isFilter boolean   
            *   typeName string   
            *   errorText string   
            *   filterText string   
            *   typeTranslated string   
            *   filterFieldName string   

    *   conversationalResponse array of objects   A list of conversational responses. 

Show conversationalResponse properties 

        *   apps array of objects   

Show apps properties 

            *   id string   
            *   name string   

        *   responses array of objects   

Show responses properties 

            *   type string   
            *   imageUrl string   
            *   infoType string   
            *   sentence object   

Show sentence properties 

                *   text string   

            *   narrative object   

Show narrative properties 

                *   text string   

            *   infoValues array of arrays   

One of:
                *   array of strings   
                *   array of objects   

Show  properties 

                    *   id string   
                    *   name string   

            *   errorMessage string   
            *   followupSentence string   
            *   renderVisualization object   

Show renderVisualization properties 

                *   data object   Data object should be used to render visualization 
                *   language string   

        *   contextInfo string   For contextual responses, this string contains a list of entities that are used to produce the response. 
        *   drillDownURI string   The URL with the query injected to insight advisor of the app to which the query belongs. 
        *   sentenceWithMatches string   

#### 400

Bad request. The payload is not formed correctly.

*   application/json object   

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

#### 401

User is not authorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

#### 422

Unprocessable entity. The payload contains fields that are invalid, such as too long of a query.

*   application/json object   

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

#### default

Unexpected error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

 POST /api/v1/questions/actions/ask

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.questions.askQuestions({  app: { id: 'string', name: 'string' },  lang: 'string',  recommendationId: 'string',  text: 'string',  visualizationTypes: ['string'],})
```

`qlik question ask \  --text 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/questions/actions/ask" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"app":{"id":"string","name":"string"},"lang":"string","text":"string","disableFollowups":false,"disableNarrative":false,"recommendationId":"string","clearEntityContext":false,"visualizationTypes":["string"],"enableVisualizations":false,"disableConversationContext":false}'`

### Example Response

`{  "apps": [    {      "id": "string",      "name": "string"    }  ],  "errors": [    {      "code": "string",      "meta": {},      "title": "string",      "detail": "string",      "source": {        "pointer": "string",        "parameter": "string"      }    }  ],  "nluInfo": {    "elements": [      {        "text": "string",        "type": "string",        "entity": true,        "isFilter": true,        "typeName": "string",        "errorText": "string",        "filterText": "string",        "typeTranslated": "string",        "filterFieldName": "string"      }    ]  },  "conversationalResponse": {    "apps": [      {        "id": "string",        "name": "string"      }    ],    "responses": [      {        "type": "string",        "imageUrl": "string",        "infoType": "string",        "sentence": {          "text": "string"        },        "narrative": {          "text": "string"        },        "infoValues": [          [            "string"          ]        ],        "errorMessage": "string",        "followupSentence": "string",        "renderVisualization": {          "data": {},          "language": "string"        }      }    ],    "contextInfo": "string",    "drillDownURI": "string",    "sentenceWithMatches": "string"  }}`

## [](https://qlik.dev/apis/rest/questions/#post-api-v1-questions-actions-filter)Returns NL metrics based on provided app IDs the user has access to.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Query Parameters

*   limit integer   The preferred number of entries returned 
minimum = 1,  maximum = 100,  default = 100,  format = int32,  default = 100

*   page string   A cursor pointing to the page of data to retrieve. 
*   sort string   A single field from the data model on which to sort the response. The '+' or '-' operator may be used to specify ascending or desending order. 
Can be one of: "createdAt""updatedAt""+createdAt""+updatedAt""-createdAt""-updatedAt"

default = "+createdAt"

### Request Body

Required

*   application/json object   

Show application/json properties 

    *   filter string Required   The advanced filtering to use for the query. Refer to [RFC 7644](https://www.rfc-editor.org/rfc/rfc7644#section-3.4.2.2) for the syntax.

Filter on createdAt and updatedAt fields are encouraged and support `eq`, `ne`, `gt`, `ge`, `lt`, `le` comparison operators along with `and` and `or` logical operators.

Filter on tenantId field is not supported.

`co`, `sw` and `ew` operators are not supported.

Examples:

```bash
appId eq 'appId1'
```

```bash
(appId eq 'appId1' or appId eq 'appId2')
```

```bash
(appId eq 'appId1' or appId eq 'appId2') and (createdAt gt '2022-08-03T00:00:00.000Z' and createdAt lt '2022-08-04T00:00:00.000Z')
```

```bash
(appId eq 'appId1') and (createdAt ge '2022-08-03T00:00:00.000Z')
```

```bash
(appId eq 'appId1') and (createdAt le '2022-08-23:59:59.000Z')
```

```bash
(appId eq 'appId1') and (questionId eq '12345')
``` 

### Responses

#### 200

If the user has access to any of the provided app id

*   application/json object   

Show application/json properties 

    *   data array of objects   

Show data properties 

        *   id string Required   Unique record id stored in database 
format = "uuid"

        *   apps array of objects   Metadata for app 

Show apps properties 

            *   id string   
            *   name string   
            *   space_id string   
            *   space_name string   
            *   space_type string   
            *   limited_access boolean   
            *   last_reload_date string   
format = "date-time"

        *   lang string   language selected for query from insight advisor or insight advisor chat or third party api 
        *   appId string Required   Qlik sense app id that is being used to answer the question 
format = "uuid"

        *   appName string   Qlik sense app name that is being used to answer the question 
        *   nluInfo array of objects   Contains break down of the asked question in the form of tokens with their classification. 

Show nluInfo properties 

            *   role string   Role of the token or phrase from query 
Can be one of: "dimension""measure""date"

            *   text string   Matching token or phrase from query 
            *   type string   Type of token from query 
Can be one of: "field""filter""master_dimension""master_measure""custom_analysis"

            *   fieldName string   Qlik sense application field selected for given token or phrase 
            *   fieldValue string   Filter value found from query 

        *   version string Required   Version of the metric model 
        *   feedback array of objects   Any feedback from the user about a given recommendation 

Show feedback properties 

            *   comment string   
            *   chartType string   
            *   analysisType string   
            *   recommendationLiked boolean Required   
            *   recommendationDisliked boolean Required   
            *   recommendationAddedToHub boolean Required   
            *   recommendationAddedToSheet boolean Required   

        *   tenantId string   Qlik sense tenant Id 
format = "uuid"

        *   channelId string   Source from which conversation is happening 
        *   chartType string   Chart type for given query. For insight advisor it would be 'native' and for insight advisor chat, it could be 'static' or 'responsive' 
        *   createdAt string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   Record created date 
format = "date-time"

        *   createdBy string   Qlik sense user id who is interacting with insight advisor or insight advisor chat or third party api 
        *   queryText string   Query asked by user in insight advisor or insight advisor or third party api 
        *   queryType string   Nature of query being asked during the conversation e.g. query, applist, measurelist, dimensionlist 
Can be one of: "appList""appSuggested""dimensionList""exploreThisFurther""followup""greetings""measureList""query""sampleQuestion"

        *   responses object   Provides info what was included in response for given query 

Show responses properties 

            *   hasChart boolean   Chart was provided 
            *   hasInsights boolean   Narrative was provided 
            *   hasSuggestions boolean   Suggestion questions was provided 
            *   hasMetadataApps boolean   App list was provided 
            *   hasSampleQueries boolean   Sample questions was provided 
            *   hasMetadataMeasures boolean   Measures list was provided 
            *   hasMetadataDimensions boolean   Dimensions list was provided 

        *   stopWords array of strings   Tokens from question parsed which are ignored 
        *   updatedAt string Required[Filterable](https://qlik.dev/apis/rest/pagination-sorting-filtering/)   Record modified date 
format = "date-time"

        *   queryError boolean   
default = false

        *   questionId string Required   Unique id assigned to user query 
        *   queryOrigin string   Refers to source from where narrative request is called 
Can be one of: "askQuestion""iaAnalysis""iaAssetsPanel"

default = "askQuestion"

        *   recommendations array of objects   Visualisation recommendation specs for the query 

Show recommendations properties 

            *   dims array of strings   Dimension(s) considered for recommendation 
            *   msrs array of strings   Measure(s) considered for recommendation 
            *   analysis string   
Can be one of: "breakdown""changePoint""comparison""contribution""correlation""fact""mutualInfo""rank""spike""trend""values"

            *   chartType string   Chart type given to current recommendation 
Can be one of: "barchart""combochart""distributionplot""kpi""linechart""map""scatterplot""table"

            *   relevance number   
            *   analysisGroup string   
Can be one of: "anomaly""brekadown""comparison""correl""fact""list""mutualInfo""rank"

        *   isContextualQuery boolean   Boolean value indicates whether given query is contextual or not. It would be false for insight advisor 
default = false

        *   unmatchedEntities array of strings   Tokens parsed as entities but not matched with app's field/dimension/measure 

    *   meta object   

Show meta properties 

        *   total integer Required   The total number of metrics matching the current filter. 

    *   links object   

Show links properties 

        *   next object   

Show next properties 

            *   href string   
format = "uri"

        *   prev object   

Show prev properties 

            *   href string   
format = "uri"

        *   self object   

Show self properties 

            *   href string   
format = "uri"

#### 400

Bad request. The payload is not formed correctly.

*   application/json object   

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

#### 401

User is not authorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

#### 422

Unprocessable entity. The payload contains fields that are invalid, such as too long of a query.

*   application/json object   

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

#### 500

Internal server error

*   application/json object   

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Additional properties relating to the error. 
        *   title string Required   Summary of the problem. 
        *   detail string   A human-readable explanation specific to this occurrence of the problem. 
        *   source object   References to the source of the error. 

Show source properties 

            *   pointer string   A JSON Pointer to the property that caused the error. 
            *   parameter string   The URI query parameter that caused the error. 

 POST /api/v1/questions/actions/filter

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.questions.filterQuestions(  {},  { filter: 'string' },)
```

`qlik question filter \  --filter 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/questions/actions/filter" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"filter":"string"}'`

### Example Response

`{  "data": [    {      "id": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",      "apps": [        {          "id": "string",          "name": "string",          "space_id": "string",          "space_name": "string",          "space_type": "string",          "limited_access": true,          "last_reload_date": "2018-10-30T07:06:22Z"        }      ],      "lang": "string",      "appId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",      "appName": "string",      "nluInfo": [        {          "role": "dimension",          "text": "string",          "type": "field",          "fieldName": "string",          "fieldValue": "string"        }      ],      "version": "string",      "feedback": [        {          "comment": "string",          "chartType": "string",          "analysisType": "string",          "recommendationLiked": true,          "recommendationDisliked": true,          "recommendationAddedToHub": true,          "recommendationAddedToSheet": true        }      ],      "tenantId": "c35f4b70-3ce4-4a30-b62b-2aef16943bc4",      "channelId": "string",      "chartType": "string",      "createdAt": "2018-10-30T07:06:22Z",      "createdBy": "string",      "queryText": "string",      "queryType": "appList",      "responses": {        "hasChart": true,        "hasInsights": true,        "hasSuggestions": true,        "hasMetadataApps": true,        "hasSampleQueries": true,        "hasMetadataMeasures": true,        "hasMetadataDimensions": true      },      "stopWords": [        "string"      ],      "updatedAt": "2018-10-30T07:06:22Z",      "queryError": false,      "questionId": "string",      "queryOrigin": "askQuestion",      "recommendations": [        {          "dims": [            "string"          ],          "msrs": [            "string"          ],          "analysis": "breakdown",          "chartType": "barchart",          "relevance": 42,          "analysisGroup": "anomaly"        }      ],      "isContextualQuery": false,      "unmatchedEntities": [        "string"      ]    }  ],  "meta": {    "total": 42  },  "links": {    "next": {      "href": "http://example.com"    },    "prev": {      "href": "http://example.com"    },    "self": {      "href": "http://example.com"    }  }}`

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