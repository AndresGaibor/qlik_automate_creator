---
title: "Web notifications REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/web-notifications/"
local_path: "docs/endpoints/web-notifications.md"
---

Title: Web notifications REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/web-notifications/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Web notifications

*   [Retrieve notifications matching the query.](https://qlik.dev/apis/rest/web-notifications/#get-api-v1-web-notifications "Retrieve notifications matching the query.")
*   [Retrieve a single notification by Id.](https://qlik.dev/apis/rest/web-notifications/#get-api-v1-web-notifications-notificationId "Retrieve a single notification by Id.")
*   [Patch a notification.](https://qlik.dev/apis/rest/web-notifications/#patch-api-v1-web-notifications-notificationId "Patch a notification.")
*   [Delete a notification.](https://qlik.dev/apis/rest/web-notifications/#delete-api-v1-web-notifications-notificationId "Delete a notification.")
*   [Patch all notifications.](https://qlik.dev/apis/rest/web-notifications/#patch-api-v1-web-notifications-all "Patch all notifications.")
*   [Delete all notifications.](https://qlik.dev/apis/rest/web-notifications/#delete-api-v1-web-notifications-all "Delete all notifications.")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/web-notifications.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Web notifications

Web notifications is the resource representing a user's notification

[Download OpenAPI spec](https://qlik.dev/specs/rest/web-notifications.json)

## Endpoints

*   [GET /api/v1/web-notifications](https://qlik.dev/apis/rest/web-notifications/#get-api-v1-web-notifications)
*   [GET /api/v1/web-notifications/{notificationId}](https://qlik.dev/apis/rest/web-notifications/#get-api-v1-web-notifications-notificationId)
*   [PATCH /api/v1/web-notifications/{notificationId}](https://qlik.dev/apis/rest/web-notifications/#patch-api-v1-web-notifications-notificationId)
*   [DELETE /api/v1/web-notifications/{notificationId}](https://qlik.dev/apis/rest/web-notifications/#delete-api-v1-web-notifications-notificationId)
*   [PATCH /api/v1/web-notifications/all](https://qlik.dev/apis/rest/web-notifications/#patch-api-v1-web-notifications-all)
*   [DELETE /api/v1/web-notifications/all](https://qlik.dev/apis/rest/web-notifications/#delete-api-v1-web-notifications-all)

## [](https://qlik.dev/apis/rest/web-notifications/#get-api-v1-web-notifications)Retrieve notifications matching the query.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Query Parameters

*   limit number   The number of notification entries to retrieved. 
minimum = 0,  maximum = 100,  default = 10,  default = 10

*   page number   Page number 
default = 1,  default = 1

*   read boolean   Read status of the notification 
*   resourceType string   Filter by resource types. If passing more than 1 resource type, use comma seperated string. 
*   sort string   The field to sort by, with +/- prefix indicating sort order 
Can be one of: "+createdAt""-createdAt""+updatedAt""-updatedAt"

default = "-createdAt"

### Responses

#### 200

An array of notification objects

*   application/json object   

Show application/json properties 

    *   data array of objects   

Show data properties 

        *   id string Required   
format = "uid"

        *   body string Required   
        *   meta object Required   
        *   read boolean Required   
        *   action string   
format = "string"

        *   userId string Required   
format = "uid"

        *   spaceId string   
format = "uid"

        *   tenantId string   
format = "uid"

        *   createdAt string Required   
format = "date"

        *   spaceType string   
        *   updatedAt string Required   
format = "date"

        *   resourceId string   
format = "string"

        *   resourceType string   
format = "string"

        *   subResourceType string   
format = "string"

    *   meta object   Notifications meta data 

Show meta properties 

        *   unreadCount number   The total number of unread notification. 
minimum = 0,  maximum = 500

    *   links object   Notifications links 

Show links properties 

        *   next object   

Show next properties 

            *   href string   

        *   prev object   

Show prev properties 

            *   href string   

        *   self object   

Show self properties 

            *   href string   

#### 400

Invalid request parameters for querying users.

*   application/json object   A representation of the errors encountered from the HTTP request. 

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 
        *   status integer   The HTTP status code. 
        *   message string   A human-readable explanation specific to this occurrence of the problem. 

#### 401

Unauthorized request.

*   application/json object   A representation of the errors encountered from the HTTP request. 

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 
        *   status integer   The HTTP status code. 
        *   message string   A human-readable explanation specific to this occurrence of the problem. 

#### 500

Internal server error

*   application/json object   A representation of the errors encountered from the HTTP request. 

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 
        *   status integer   The HTTP status code. 
        *   message string   A human-readable explanation specific to this occurrence of the problem. 

 GET /api/v1/web-notifications

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.webNotifications.getNotifications({})
```

`qlik web-notification ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/web-notifications" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "data": [    {      "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",      "body": "string",      "meta": {},      "read": true,      "action": "string",      "userId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",      "spaceId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",      "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",      "createdAt": "string",      "spaceType": "string",      "updatedAt": "string",      "resourceId": "string",      "resourceType": "string",      "subResourceType": "string"    }  ],  "meta": {    "unreadCount": 0  },  "links": {    "next": {      "href": "string"    },    "prev": {      "href": "string"    },    "self": {      "href": "string"    }  }}`

## [](https://qlik.dev/apis/rest/web-notifications/#get-api-v1-web-notifications-notificationId)Retrieve a single notification by Id.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Path Parameters

*   notificationId string Required   The id of the notification to retrieve. 
format = "uid"

### Responses

#### 200

Successfully got notification.

*   application/json object   

Show application/json properties 

    *   id string Required   
format = "uid"

    *   body string Required   
    *   meta object Required   
    *   read boolean Required   
    *   action string   
format = "string"

    *   userId string Required   
format = "uid"

    *   spaceId string   
format = "uid"

    *   tenantId string   
format = "uid"

    *   createdAt string Required   
format = "date"

    *   spaceType string   
    *   updatedAt string Required   
format = "date"

    *   resourceId string   
format = "string"

    *   resourceType string   
format = "string"

    *   subResourceType string   
format = "string"

#### 401

Unauthorized request.

*   application/json object   A representation of the errors encountered from the HTTP request. 

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 
        *   status integer   The HTTP status code. 
        *   message string   A human-readable explanation specific to this occurrence of the problem. 

#### 404

Not found when user tries to get notification they do not own.

*   application/json object   A representation of the errors encountered from the HTTP request. 

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 
        *   status integer   The HTTP status code. 
        *   message string   A human-readable explanation specific to this occurrence of the problem. 

#### 500

Internal server error

*   application/json object   A representation of the errors encountered from the HTTP request. 

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 
        *   status integer   The HTTP status code. 
        *   message string   A human-readable explanation specific to this occurrence of the problem. 

 GET /api/v1/web-notifications/{notificationId}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.webNotifications.getNotification(  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',)
```

`qlik web-notification get 'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/web-notifications/{notificationId}" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "body": "string",  "meta": {},  "read": true,  "action": "string",  "userId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "spaceId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "tenantId": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",  "createdAt": "string",  "spaceType": "string",  "updatedAt": "string",  "resourceId": "string",  "resourceType": "string",  "subResourceType": "string"}`

## [](https://qlik.dev/apis/rest/web-notifications/#patch-api-v1-web-notifications-notificationId)Patch a notification.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   notificationId string Required   The id of the notification to update. 
format = "uid"

### Request Body

Required

*   application/json array of objects   An array of JSON Patch documents 

Show application/json properties 

    *   op string Required   The operation to be performed. 
Can be one of: "replace"

    *   path string Required   The path for the given resource field to patch. 
Can be one of: "/read"

    *   value string Required   The value to be used for this operation. 

### Responses

#### 204

Successfully patched marked notification.

*   application/json object   Notifications meta data 

Show application/json properties 

    *   unreadCount number   The total number of unread notification. 
minimum = 0,  maximum = 500

#### 400

Unsupported patch request.

*   application/json object   A representation of the errors encountered from the HTTP request. 

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 
        *   status integer   The HTTP status code. 
        *   message string   A human-readable explanation specific to this occurrence of the problem. 

#### 401

Unauthorized request.

*   application/json object   A representation of the errors encountered from the HTTP request. 

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 
        *   status integer   The HTTP status code. 
        *   message string   A human-readable explanation specific to this occurrence of the problem. 

#### 404

Notification not found.

*   application/json object   A representation of the errors encountered from the HTTP request. 

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 
        *   status integer   The HTTP status code. 
        *   message string   A human-readable explanation specific to this occurrence of the problem. 

#### 500

Internal server error

*   application/json object   A representation of the errors encountered from the HTTP request. 

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 
        *   status integer   The HTTP status code. 
        *   message string   A human-readable explanation specific to this occurrence of the problem. 

 PATCH /api/v1/web-notifications/{notificationId}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.webNotifications.patchNotification(  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',  [    {      op: 'replace',      path: '/read',      value: 'true',    },  ],)
```

`qlik web-notification patch 'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69' \  --op 'replace' \  --path '/read' \  --value 'true'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/web-notifications/{notificationId}" \-X PATCH \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '[{"op":"replace","path":"/read","value":true}]'`

### Example Response

`{  "unreadCount": 0}`

## [](https://qlik.dev/apis/rest/web-notifications/#delete-api-v1-web-notifications-notificationId)Delete a notification.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Path Parameters

*   notificationId string Required   The id of the notification to delete. 
format = "uid"

### Responses

#### 204

Successfully deleted notification.

*   application/json object   Notifications meta data 

Show application/json properties 

    *   unreadCount number   The total number of unread notification. 
minimum = 0,  maximum = 500

#### 401

Unauthorized request.

*   application/json object   A representation of the errors encountered from the HTTP request. 

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 
        *   status integer   The HTTP status code. 
        *   message string   A human-readable explanation specific to this occurrence of the problem. 

#### 404

Notification not found.

*   application/json object   A representation of the errors encountered from the HTTP request. 

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 
        *   status integer   The HTTP status code. 
        *   message string   A human-readable explanation specific to this occurrence of the problem. 

#### 500

Internal server error

*   application/json object   A representation of the errors encountered from the HTTP request. 

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 
        *   status integer   The HTTP status code. 
        *   message string   A human-readable explanation specific to this occurrence of the problem. 

 DELETE /api/v1/web-notifications/{notificationId}

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.webNotifications.deleteNotification(  'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69',)
```

`qlik web-notification rm 'TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/web-notifications/{notificationId}" \-X DELETE \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "unreadCount": 0}`

## [](https://qlik.dev/apis/rest/web-notifications/#patch-api-v1-web-notifications-all)Patch all notifications.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

*   application/json array of objects   An array of JSON Patch documents 

Show application/json properties 

    *   op string Required   The operation to be performed. 
Can be one of: "replace"

    *   path string Required   The path for the given resource field to patch. 
Can be one of: "/read"

    *   value string Required   The value to be used for this operation. 

### Responses

#### 204

Successfully marked all notification.

*   application/json object   Notifications meta data 

Show application/json properties 

    *   unreadCount number   The total number of unread notification. 
minimum = 0,  maximum = 500

#### 400

Unsupported patch request.

*   application/json object   A representation of the errors encountered from the HTTP request. 

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 
        *   status integer   The HTTP status code. 
        *   message string   A human-readable explanation specific to this occurrence of the problem. 

#### 401

Unauthorized request.

*   application/json object   A representation of the errors encountered from the HTTP request. 

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 
        *   status integer   The HTTP status code. 
        *   message string   A human-readable explanation specific to this occurrence of the problem. 

#### 500

Internal server error

*   application/json object   A representation of the errors encountered from the HTTP request. 

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 
        *   status integer   The HTTP status code. 
        *   message string   A human-readable explanation specific to this occurrence of the problem. 

 PATCH /api/v1/web-notifications/all

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.webNotifications.patchNotifications([  { op: 'replace', path: '/read', value: 'true' },])
```

`qlik web-notification patch-all \  --op 'replace' \  --path '/read' \  --value 'true'`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/web-notifications/all" \-X PATCH \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '[{"op":"replace","path":"/read","value":true}]'`

### Example Response

`{  "unreadCount": 0}`

## [](https://qlik.dev/apis/rest/web-notifications/#delete-api-v1-web-notifications-all)Delete all notifications.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Responses

#### 204

Successfully deleted notification.

*   application/json object   Notifications meta data 

Show application/json properties 

    *   unreadCount number   The total number of unread notification. 
minimum = 0,  maximum = 500

#### 401

Unauthorized request.

*   application/json object   A representation of the errors encountered from the HTTP request. 

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 
        *   status integer   The HTTP status code. 
        *   message string   A human-readable explanation specific to this occurrence of the problem. 

#### 500

Internal server error

*   application/json object   A representation of the errors encountered from the HTTP request. 

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 
        *   status integer   The HTTP status code. 
        *   message string   A human-readable explanation specific to this occurrence of the problem. 

 DELETE /api/v1/web-notifications/all

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.webNotifications.deleteNotifications()
```

`qlik web-notification delete-all`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/web-notifications/all" \-X DELETE \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "unreadCount": 0}`

Was this page helpful?
*   yes 
*   no 

![Image 2: Qlik logo](https://qlik.dev/logo-footer.svg)

[Qlik Community](https://community.qlik.com/)

[](https://join.slack.com/t/qlikdeveloper/shared_invite/zt-3wrdlkhog-Dcq9LuCbjNQVN2XaPlgGqQ)[](https://www.facebook.com/qlik)[](https://www.linkedin.com/company/qlik)[](https://x.com/qlikdeveloper)

[Legal Agreements](https://www.qlik.com/us/legal/legal-agreements) / [Legal Policies](https://www.qlik.com/us/legal/legal-policies) / [Privacy & Cookie Notice](https://www.qlik.com/us/legal/privacy-and-cookie-notice) / [Terms of Use](https://qlik.dev/qlik-developer-portal-terms-of-use.pdf) / Do Not Share My Info

 Copyright © 1993-2026 QlikTech International AB. All rights reserved.