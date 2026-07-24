---
title: "ODAG settings REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/analytics/odag-settings/"
local_path: "docs/endpoints/analytics-odag-settings.md"
---

Title: ODAG settings REST | Qlik Developer Portal



[Skip to content](https://qlik.dev/apis/rest/analytics/odag-settings/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## ODAG settings

*   [Get ODAG settings](https://qlik.dev/apis/rest/analytics/odag-settings/#get-api-analytics-odag-settings "Get ODAG settings")
*   [Update ODAG settings](https://qlik.dev/apis/rest/analytics/odag-settings/#put-api-analytics-odag-settings "Update ODAG settings")
*   [Check update permission](https://qlik.dev/apis/rest/analytics/odag-settings/#get-api-analytics-odag-settings-canupdate "Check update permission")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)
6.    / 
7.    analytics 

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/analytics/odag-settings.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# ODAG settings

[Download OpenAPI spec](https://qlik.dev/specs/rest/analytics/odag-settings.json)

ODAG settings control tenant-level on-demand analytics generation configuration, including retention policies and resource limits. Settings are retrieved and updated as a singleton resource at the tenant level.

Note

ODAG settings can only be modified by users assigned the `TenantAdmin` role.

## Endpoints

*   [GET /api/analytics/odag-settings](https://qlik.dev/apis/rest/analytics/odag-settings/#get-api-analytics-odag-settings)
*   [PUT /api/analytics/odag-settings](https://qlik.dev/apis/rest/analytics/odag-settings/#put-api-analytics-odag-settings)
*   [GET /api/analytics/odag-settings/canupdate](https://qlik.dev/apis/rest/analytics/odag-settings/#get-api-analytics-odag-settings-canupdate)

## [](https://qlik.dev/apis/rest/analytics/odag-settings/#get-api-analytics-odag-settings)Get ODAG settings

Retrieves ODAG settings, including feature enablement status. Available only to administrators.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Responses

#### 200

ODAG settings retrieved successfully.

*   application/json object   The state of the ODAG settings available for users assigned the `TenantAdmin` role to view and configure. 

Show application/json properties 

    *   odagEnabled boolean   Whether the ODAG feature is enabled. 
    *   dynamicViewEnabled boolean   Whether the dynamic view feature is enabled. 

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

#### 500

Internal system error accessing ODAG settings.

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

 GET /api/analytics/odag-settings

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `GET /api/analytics/odag-settings` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/analytics/odag-settings',  {    method: 'GET',    headers: {      'Content-Type': 'application/json',    },  },)
```

`# qlik-cli has not implemented support for GET /api/analytics/odag-settings yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/analytics/odag-settings" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "odagEnabled": true,  "dynamicViewEnabled": true}`

## [](https://qlik.dev/apis/rest/analytics/odag-settings/#put-api-analytics-odag-settings)Update ODAG settings

Modifies ODAG settings such as feature enablement. Available only to administrators. Changes apply immediately to all ODAG operations.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

A JSON payload containing the content for the new settings.

*   application/json object   An object that defines the properties of ODAG settings to be modified. 

Show application/json properties 

    *   odagEnabled boolean   
    *   dynamicViewEnabled boolean   

### Responses

#### 200

ODAG settings updated successfully.

*   application/json object   The state of the ODAG settings available for users assigned the `TenantAdmin` role to view and configure. 

Show application/json properties 

    *   odagEnabled boolean   Whether the ODAG feature is enabled. 
    *   dynamicViewEnabled boolean   Whether the dynamic view feature is enabled. 

#### 403

Access denied. You lack permission to modify ODAG settings.

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

#### 500

Internal system error accessing ODAG settings.

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

 PUT /api/analytics/odag-settings

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `PUT /api/analytics/odag-settings` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/analytics/odag-settings',  {    method: 'PUT',    headers: {      'Content-Type': 'application/json',    },    body: JSON.stringify({      odagEnabled: true,      dynamicViewEnabled: true,    }),  },)
```

`# qlik-cli has not implemented support for PUT /api/analytics/odag-settings yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/analytics/odag-settings" \-X PUT \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"odagEnabled":true,"dynamicViewEnabled":true}'`

### Example Response

`{  "odagEnabled": true,  "dynamicViewEnabled": true}`

## [](https://qlik.dev/apis/rest/analytics/odag-settings/#get-api-analytics-odag-settings-canupdate)Check update permission

Checks whether the current user has permission to modify ODAG settings.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Responses

#### 200

Permission check completed successfully.

*   application/json object   An object used to inform the caller whether the current user has privilege to update ODAG settings. 

Show application/json properties 

    *   canUpdateSettings boolean   

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

 GET /api/analytics/odag-settings/canupdate

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `GET /api/analytics/odag-settings/canupdate` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/analytics/odag-settings/canupdate',  {    method: 'GET',    headers: {      'Content-Type': 'application/json',    },  },)
```

`# qlik-cli has not implemented support for GET /api/analytics/odag-settings/canupdate yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/analytics/odag-settings/canupdate" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "canUpdateSettings": true}`

Was this page helpful?
*   yes 
*   no 

![Image 2: Qlik logo](https://qlik.dev/logo-footer.svg)

[Qlik Community](https://community.qlik.com/)

[](https://join.slack.com/t/qlikdeveloper/shared_invite/zt-3wrdlkhog-Dcq9LuCbjNQVN2XaPlgGqQ)[](https://www.facebook.com/qlik)[](https://www.linkedin.com/company/qlik)[](https://x.com/qlikdeveloper)

[Legal Agreements](https://www.qlik.com/us/legal/legal-agreements) / [Legal Policies](https://www.qlik.com/us/legal/legal-policies) / [Privacy & Cookie Notice](https://www.qlik.com/us/legal/privacy-and-cookie-notice) / [Terms of Use](https://qlik.dev/qlik-developer-portal-terms-of-use.pdf) / Do Not Share My Info

 Copyright © 1993-2026 QlikTech International AB. All rights reserved.