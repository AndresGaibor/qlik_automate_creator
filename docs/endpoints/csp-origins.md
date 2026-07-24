---
title: "CSP origins REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/csp-origins/"
local_path: "docs/endpoints/csp-origins.md"
---

Title: CSP origins REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/csp-origins/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## CSP origins

*   [List CSPs](https://qlik.dev/apis/rest/csp-origins/#get-api-v1-csp-origins "List CSPs")
*   [Create a new CSP](https://qlik.dev/apis/rest/csp-origins/#post-api-v1-csp-origins "Create a new CSP")
*   [Get a CSP](https://qlik.dev/apis/rest/csp-origins/#get-api-v1-csp-origins-id "Get a CSP")
*   [Update a CSP](https://qlik.dev/apis/rest/csp-origins/#put-api-v1-csp-origins-id "Update a CSP")
*   [Delete a CSP](https://qlik.dev/apis/rest/csp-origins/#delete-api-v1-csp-origins-id "Delete a CSP")
*   [Retrieve CSP header](https://qlik.dev/apis/rest/csp-origins/#get-api-v1-csp-origins-actions-generate-header "Retrieve CSP header")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/csp-origins.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# CSP origins

CSP origins allow you to configure domains, or origins, that Qlik Sense client visualizations/extensions are allowed to communicate with.

[Download OpenAPI spec](https://qlik.dev/specs/rest/csp-origins.json)

## Endpoints

*   [GET /api/v1/csp-origins](https://qlik.dev/apis/rest/csp-origins/#get-api-v1-csp-origins)
*   [POST /api/v1/csp-origins](https://qlik.dev/apis/rest/csp-origins/#post-api-v1-csp-origins)
*   [GET /api/v1/csp-origins/{id}](https://qlik.dev/apis/rest/csp-origins/#get-api-v1-csp-origins-id)
*   [PUT /api/v1/csp-origins/{id}](https://qlik.dev/apis/rest/csp-origins/#put-api-v1-csp-origins-id)
*   [DELETE /api/v1/csp-origins/{id}](https://qlik.dev/apis/rest/csp-origins/#delete-api-v1-csp-origins-id)
*   [GET /api/v1/csp-origins/actions/generate-header](https://qlik.dev/apis/rest/csp-origins/#get-api-v1-csp-origins-actions-generate-header)

## [](https://qlik.dev/apis/rest/csp-origins/#get-api-v1-csp-origins)List CSPs

Retrieves all content security policies for a tenant.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Query Parameters

*   childSrc boolean   Filter resources by directive 'childSrc', true/false. 
*   connectSrc boolean   Filter resources by directive 'connectSrc', true/false. 
*   connectSrcWSS boolean   Filter resources by directive 'connectSrcWSS', true/false. 
*   fontSrc boolean   Filter resources by directive 'fontSrc', true/false. 
*   formAction boolean   Filter resources by directive 'formAction', true/false. 
*   frameAncestors boolean   Filter resources by directive 'frameAncestors', true/false. 
*   frameSrc boolean   Filter resources by directive 'frameSrc', true/false. 
*   imgSrc boolean   Filter resources by directive 'imgSrc', true/false. 
*   limit number   Maximum number of CSP-Origins to retrieve. 
minimum = 1,  maximum = 100,  default = 20,  default = 20

*   mediaSrc boolean   Filter resources by directive 'mediaSrc', true/false. 
*   name string   Filter resources by name (wildcard and case insensitive). 
*   next string   Cursor to the next page. 
*   objectSrc boolean   Filter resources by directive 'objectSrc', true/false. 
*   origin string   Filter resources by origin (wildcard and case insensitive). 
*   prev string   Cursor to previous next page. 
*   scriptSrc boolean   Filter resources by directive 'scriptSrc', true/false. 
*   sort string   Field to sort by, prefix with -/+ to indicate order. 
Can be one of: "name""-name""origin""-origin""createdDate""-createdDate""modifiedDate""-modifiedDate"

*   styleSrc boolean   Filter resources by directive 'styleSrc', true/false. 
*   workerSrc boolean   Filter resources by directive 'workerSrc', true/false. 

### Responses

#### 200

OK Response

*   application/json object   

Show application/json properties 

    *   data array of objects   

Show data properties 

        *   id string   The CSP entry's unique identifier. 
        *   name string   The name for this entry. 
maxLength = 512

        *   imgSrc boolean   Specifies valid sources of images and favicons. 
        *   origin string Required   The origin that the CSP directives should be applied to. 
maxLength = 256

        *   fontSrc boolean   Specifies valid sources for loading fonts. 
        *   childSrc boolean   Defines the valid sources for loading web workers and nested browsing contexts using elements such as frame and iFrame. 
        *   frameSrc boolean   Specifies valid sources for loading nested browsing contexts using elements such as frame and iFrame. 
        *   mediaSrc boolean   Specifies valid sources for loading media using the audio and video elements. 
        *   styleSrc boolean   Specifies valid sources for stylesheets. 
        *   objectSrc boolean   Specifies valid sources for the object, embed, and applet elements. 
        *   scriptSrc boolean   Specifies valid sources for JavaScript. 
        *   workerSrc boolean   Specifies valid sources for Worker, SharedWorker, or ServiceWorker scripts. 
        *   connectSrc boolean   Restricts the URLs that can be loaded using script interfaces. 
        *   formAction boolean   Allow forms to be submitted to the origin. 
        *   createdDate string   The UTC timestamp when the CSP entry was created. 
format = "date-time"

        *   description string   The reason for adding this origin to the Content Security Policy. 
maxLength = 1024

        *   modifiedDate string   The UTC timestamp when the CSP entry was last modified. 
format = "date-time"

        *   connectSrcWSS boolean   Restricts the URLs that can be connected to websockets (all sources will be prefixed with 'wss://'). 
        *   frameAncestors boolean   Specifies valid sources for embedding the resource using frame, iFrame, object, embed and applet. 

    *   links object   

Show links properties 

        *   next object   

Show next properties 

            *   href string Required   URL to a resource request. 

        *   prev object   

Show prev properties 

            *   href string Required   URL to a resource request. 

        *   self object   

Show self properties 

            *   href string Required   URL to a resource request. 

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

#### 503

Service Unavailable

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

 GET /api/v1/csp-origins

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.cspOrigins.getCSPEntries({})
```

`qlik csp-origin ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/csp-origins" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "data": [    {      "name": "string",      "imgSrc": true,      "origin": "string",      "fontSrc": true,      "childSrc": true,      "frameSrc": true,      "mediaSrc": true,      "styleSrc": true,      "objectSrc": true,      "scriptSrc": true,      "workerSrc": true,      "connectSrc": true,      "formAction": true,      "createdDate": "2018-10-30T07:06:22Z",      "description": "string",      "modifiedDate": "2018-10-30T07:06:22Z",      "connectSrcWSS": true,      "frameAncestors": true,      "id": "string"    }  ],  "links": {    "next": {      "href": "string"    },    "prev": {      "href": "string"    },    "self": {      "href": "string"    }  }}`

## [](https://qlik.dev/apis/rest/csp-origins/#post-api-v1-csp-origins)Create a new CSP

Creates a new content security policy for an origin.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

*   application/json object   

Show application/json properties 

    *   name string   The name for this entry. 
maxLength = 512

    *   imgSrc boolean   Specifies valid sources of images and favicons. 
    *   origin string Required   The origin that the CSP directives should be applied to. 
maxLength = 256

    *   fontSrc boolean   Specifies valid sources for loading fonts. 
    *   childSrc boolean   Defines the valid sources for loading web workers and nested browsing contexts using elements such as frame and iFrame. 
    *   frameSrc boolean   Specifies valid sources for loading nested browsing contexts using elements such as frame and iFrame. 
    *   mediaSrc boolean   Specifies valid sources for loading media using the audio and video elements. 
    *   styleSrc boolean   Specifies valid sources for stylesheets. 
    *   objectSrc boolean   Specifies valid sources for the object, embed, and applet elements. 
    *   scriptSrc boolean   Specifies valid sources for JavaScript. 
    *   workerSrc boolean   Specifies valid sources for Worker, SharedWorker, or ServiceWorker scripts. 
    *   connectSrc boolean   Restricts the URLs that can be loaded using script interfaces. 
    *   formAction boolean   Allow forms to be submitted to the origin. 
    *   description string   The reason for adding this origin to the Content Security Policy. 
maxLength = 1024

    *   connectSrcWSS boolean   Restricts the URLs that can be connected to websockets (all sources will be prefixed with 'wss://'). 
    *   frameAncestors boolean   Specifies valid sources for embedding the resource using frame, iFrame, object, embed and applet. 

### Responses

#### 201

OK Response

*   application/json object   

Show application/json properties 

    *   id string   The CSP entry's unique identifier. 
    *   name string   The name for this entry. 
maxLength = 512

    *   imgSrc boolean   Specifies valid sources of images and favicons. 
    *   origin string Required   The origin that the CSP directives should be applied to. 
maxLength = 256

    *   fontSrc boolean   Specifies valid sources for loading fonts. 
    *   childSrc boolean   Defines the valid sources for loading web workers and nested browsing contexts using elements such as frame and iFrame. 
    *   frameSrc boolean   Specifies valid sources for loading nested browsing contexts using elements such as frame and iFrame. 
    *   mediaSrc boolean   Specifies valid sources for loading media using the audio and video elements. 
    *   styleSrc boolean   Specifies valid sources for stylesheets. 
    *   objectSrc boolean   Specifies valid sources for the object, embed, and applet elements. 
    *   scriptSrc boolean   Specifies valid sources for JavaScript. 
    *   workerSrc boolean   Specifies valid sources for Worker, SharedWorker, or ServiceWorker scripts. 
    *   connectSrc boolean   Restricts the URLs that can be loaded using script interfaces. 
    *   formAction boolean   Allow forms to be submitted to the origin. 
    *   createdDate string   The UTC timestamp when the CSP entry was created. 
format = "date-time"

    *   description string   The reason for adding this origin to the Content Security Policy. 
maxLength = 1024

    *   modifiedDate string   The UTC timestamp when the CSP entry was last modified. 
format = "date-time"

    *   connectSrcWSS boolean   Restricts the URLs that can be connected to websockets (all sources will be prefixed with 'wss://'). 
    *   frameAncestors boolean   Specifies valid sources for embedding the resource using frame, iFrame, object, embed and applet. 

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

#### 503

Service Unavailable

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

 POST /api/v1/csp-origins

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.cspOrigins.createCSPEntry({  childSrc: true,  connectSrc: true,  connectSrcWSS: true,  description: 'string',  fontSrc: true,  formAction: true,  frameAncestors: true,  frameSrc: true,  imgSrc: true,  mediaSrc: true,  name: 'string',  objectSrc: true,  origin: 'string',  scriptSrc: true,  styleSrc: true,  workerSrc: true,})
```

`qlik csp-origin create \  --origin 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/csp-origins" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"name":"string","imgSrc":true,"origin":"string","fontSrc":true,"childSrc":true,"frameSrc":true,"mediaSrc":true,"styleSrc":true,"objectSrc":true,"scriptSrc":true,"workerSrc":true,"connectSrc":true,"formAction":true,"description":"string","connectSrcWSS":true,"frameAncestors":true}'`

### Example Response

`{  "name": "string",  "imgSrc": true,  "origin": "string",  "fontSrc": true,  "childSrc": true,  "frameSrc": true,  "mediaSrc": true,  "styleSrc": true,  "objectSrc": true,  "scriptSrc": true,  "workerSrc": true,  "connectSrc": true,  "formAction": true,  "createdDate": "2018-10-30T07:06:22Z",  "description": "string",  "modifiedDate": "2018-10-30T07:06:22Z",  "connectSrcWSS": true,  "frameAncestors": true,  "id": "string"}`

## [](https://qlik.dev/apis/rest/csp-origins/#get-api-v1-csp-origins-id)Get a CSP

Returns details for a specific content security policy.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Path Parameters

*   id string Required   The CSP entry's unique identifier. 

### Responses

#### 200

OK Response

*   application/json object   

Show application/json properties 

    *   id string   The CSP entry's unique identifier. 
    *   name string   The name for this entry. 
maxLength = 512

    *   imgSrc boolean   Specifies valid sources of images and favicons. 
    *   origin string Required   The origin that the CSP directives should be applied to. 
maxLength = 256

    *   fontSrc boolean   Specifies valid sources for loading fonts. 
    *   childSrc boolean   Defines the valid sources for loading web workers and nested browsing contexts using elements such as frame and iFrame. 
    *   frameSrc boolean   Specifies valid sources for loading nested browsing contexts using elements such as frame and iFrame. 
    *   mediaSrc boolean   Specifies valid sources for loading media using the audio and video elements. 
    *   styleSrc boolean   Specifies valid sources for stylesheets. 
    *   objectSrc boolean   Specifies valid sources for the object, embed, and applet elements. 
    *   scriptSrc boolean   Specifies valid sources for JavaScript. 
    *   workerSrc boolean   Specifies valid sources for Worker, SharedWorker, or ServiceWorker scripts. 
    *   connectSrc boolean   Restricts the URLs that can be loaded using script interfaces. 
    *   formAction boolean   Allow forms to be submitted to the origin. 
    *   createdDate string   The UTC timestamp when the CSP entry was created. 
format = "date-time"

    *   description string   The reason for adding this origin to the Content Security Policy. 
maxLength = 1024

    *   modifiedDate string   The UTC timestamp when the CSP entry was last modified. 
format = "date-time"

    *   connectSrcWSS boolean   Restricts the URLs that can be connected to websockets (all sources will be prefixed with 'wss://'). 
    *   frameAncestors boolean   Specifies valid sources for embedding the resource using frame, iFrame, object, embed and applet. 

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

#### 404

Not found

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

#### 503

Service Unavailable

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

 GET /api/v1/csp-origins/{id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.cspOrigins.getCSPEntry('string')
```

`qlik csp-origin get 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/csp-origins/{id}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "name": "string",  "imgSrc": true,  "origin": "string",  "fontSrc": true,  "childSrc": true,  "frameSrc": true,  "mediaSrc": true,  "styleSrc": true,  "objectSrc": true,  "scriptSrc": true,  "workerSrc": true,  "connectSrc": true,  "formAction": true,  "createdDate": "2018-10-30T07:06:22Z",  "description": "string",  "modifiedDate": "2018-10-30T07:06:22Z",  "connectSrcWSS": true,  "frameAncestors": true,  "id": "string"}`

## [](https://qlik.dev/apis/rest/csp-origins/#put-api-v1-csp-origins-id)Update a CSP

Updates a content security policy.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   id string Required   The CSP entry's unique identifier. 

### Request Body

Required

*   application/json object   

Show application/json properties 

    *   name string   The name for this entry. 
maxLength = 512

    *   imgSrc boolean   Specifies valid sources of images and favicons. 
    *   origin string Required   The origin that the CSP directives should be applied to. 
maxLength = 256

    *   fontSrc boolean   Specifies valid sources for loading fonts. 
    *   childSrc boolean   Defines the valid sources for loading web workers and nested browsing contexts using elements such as frame and iFrame. 
    *   frameSrc boolean   Specifies valid sources for loading nested browsing contexts using elements such as frame and iFrame. 
    *   mediaSrc boolean   Specifies valid sources for loading media using the audio and video elements. 
    *   styleSrc boolean   Specifies valid sources for stylesheets. 
    *   objectSrc boolean   Specifies valid sources for the object, embed, and applet elements. 
    *   scriptSrc boolean   Specifies valid sources for JavaScript. 
    *   workerSrc boolean   Specifies valid sources for Worker, SharedWorker, or ServiceWorker scripts. 
    *   connectSrc boolean   Restricts the URLs that can be loaded using script interfaces. 
    *   formAction boolean   Allow forms to be submitted to the origin. 
    *   description string   The reason for adding this origin to the Content Security Policy. 
maxLength = 1024

    *   connectSrcWSS boolean   Restricts the URLs that can be connected to websockets (all sources will be prefixed with 'wss://'). 
    *   frameAncestors boolean   Specifies valid sources for embedding the resource using frame, iFrame, object, embed and applet. 

### Responses

#### 200

OK Response

*   application/json object   

Show application/json properties 

    *   id string   The CSP entry's unique identifier. 
    *   name string   The name for this entry. 
maxLength = 512

    *   imgSrc boolean   Specifies valid sources of images and favicons. 
    *   origin string Required   The origin that the CSP directives should be applied to. 
maxLength = 256

    *   fontSrc boolean   Specifies valid sources for loading fonts. 
    *   childSrc boolean   Defines the valid sources for loading web workers and nested browsing contexts using elements such as frame and iFrame. 
    *   frameSrc boolean   Specifies valid sources for loading nested browsing contexts using elements such as frame and iFrame. 
    *   mediaSrc boolean   Specifies valid sources for loading media using the audio and video elements. 
    *   styleSrc boolean   Specifies valid sources for stylesheets. 
    *   objectSrc boolean   Specifies valid sources for the object, embed, and applet elements. 
    *   scriptSrc boolean   Specifies valid sources for JavaScript. 
    *   workerSrc boolean   Specifies valid sources for Worker, SharedWorker, or ServiceWorker scripts. 
    *   connectSrc boolean   Restricts the URLs that can be loaded using script interfaces. 
    *   formAction boolean   Allow forms to be submitted to the origin. 
    *   createdDate string   The UTC timestamp when the CSP entry was created. 
format = "date-time"

    *   description string   The reason for adding this origin to the Content Security Policy. 
maxLength = 1024

    *   modifiedDate string   The UTC timestamp when the CSP entry was last modified. 
format = "date-time"

    *   connectSrcWSS boolean   Restricts the URLs that can be connected to websockets (all sources will be prefixed with 'wss://'). 
    *   frameAncestors boolean   Specifies valid sources for embedding the resource using frame, iFrame, object, embed and applet. 

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

#### 404

Not found

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

#### 503

Service Unavailable

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

 PUT /api/v1/csp-origins/{id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.cspOrigins.updateCSPEntry('string', {  childSrc: true,  connectSrc: true,  connectSrcWSS: true,  description: 'string',  fontSrc: true,  formAction: true,  frameAncestors: true,  frameSrc: true,  imgSrc: true,  mediaSrc: true,  name: 'string',  objectSrc: true,  origin: 'string',  scriptSrc: true,  styleSrc: true,  workerSrc: true,})
```

`qlik csp-origin update 'string' \  --origin 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/csp-origins/{id}" \-X PUT \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"name":"string","imgSrc":true,"origin":"string","fontSrc":true,"childSrc":true,"frameSrc":true,"mediaSrc":true,"styleSrc":true,"objectSrc":true,"scriptSrc":true,"workerSrc":true,"connectSrc":true,"formAction":true,"description":"string","connectSrcWSS":true,"frameAncestors":true}'`

### Example Response

`{  "name": "string",  "imgSrc": true,  "origin": "string",  "fontSrc": true,  "childSrc": true,  "frameSrc": true,  "mediaSrc": true,  "styleSrc": true,  "objectSrc": true,  "scriptSrc": true,  "workerSrc": true,  "connectSrc": true,  "formAction": true,  "createdDate": "2018-10-30T07:06:22Z",  "description": "string",  "modifiedDate": "2018-10-30T07:06:22Z",  "connectSrcWSS": true,  "frameAncestors": true,  "id": "string"}`

## [](https://qlik.dev/apis/rest/csp-origins/#delete-api-v1-csp-origins-id)Delete a CSP

Deletes a specific content security policy.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   id string Required   The CSP entry's unique identifier. 

### Responses

#### 204

No Content response.

#### 400

Bad Request

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

#### 403

Forbidden

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

#### 404

Not found

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

#### 503

Service Unavailable

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

 DELETE /api/v1/csp-origins/{id}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.cspOrigins.deleteCSPEntry('string')
```

`qlik csp-origin rm 'string'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/csp-origins/{id}" \-X DELETE \-H "Authorization: Bearer <access_token>"`

## [](https://qlik.dev/apis/rest/csp-origins/#get-api-v1-csp-origins-actions-generate-header)Retrieve CSP header

Retrieves the full content security policy header (including all configured policies and origins) for the tenant.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Header Parameters

*   Accept string   The Accept request HTTP header indicates which content types, expressed as MIME types, the client is able to understand 
Can be one of: "application/json""text/plain"

default = "application/json"

### Responses

#### 200

OK Response

*   text/plain string   

#### 200

OK Response

*   application/json object   

Show application/json properties 

    *   Content-Security-Policy string   The compiled CSP header. 

#### 401

Unauthorized

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

#### 406

Not Acceptable

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

#### 500

Internal Server Error

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

#### 503

Service Unavailable

*   application/json object   

Show application/json properties 

    *   errors array of objects   

Show errors properties 

        *   code string Required   The unique code for the error. 
        *   title string Required   A summary of what went wrong. 
        *   detail string   May be used to provide additional details. 

 GET /api/v1/csp-origins/actions/generate-header

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.cspOrigins.getCSPHeader()
```

`qlik csp-origin generate-header`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/csp-origins/actions/generate-header" \-H "Authorization: Bearer <access_token>"`

### Example Response

`string`

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