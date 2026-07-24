---
title: "Notifications REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/notifications/"
local_path: "docs/endpoints/notifications.md"
---

Title: Notifications REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/notifications/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Notifications

*   [List all supported notifications](https://qlik.dev/apis/rest/notifications/#get-api-v1-notifications "List all supported notifications")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/notifications.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Notifications

Notifications is the resource representing the various notifications that notification-prep can render

[Download OpenAPI spec](https://qlik.dev/specs/rest/notifications.json)

## Endpoints

*   [GET /api/v1/notifications](https://qlik.dev/apis/rest/notifications/#get-api-v1-notifications)

## [](https://qlik.dev/apis/rest/notifications/#get-api-v1-notifications)List all supported notifications

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Query Parameters

*   locale string   If present, idenfies the language of the returned 'friendlyName' property. 
default = "en"

*   manageableInHub string   If present, represents the 'manageableInHub' value to filter by. 
Can be one of: true

default = "if missing, no filtering is done"

*   subscribable string   If present, represents the 'subscribable' value to filter by. 
Can be one of: true

default = "if missing, no filtering is done"

### Responses

#### 200

Request completed successfully. See Results for ResultDetail on each notification.

*   application/json object   Object containing array representing list of supported notifications 

Show application/json properties 

    *   notifications array of objects Required   list of notifications 

Show notifications properties 

        *   transports array of strings Required   Type of Transport e.g. Email, Notification, Slack message etc... 
        *   isSubscribable boolean Required   Indicates if the notification can be subscribed to by users. If true, the object will also contain 'subscriptionInfo' object 
        *   presentationInfo object   Object containing information pertaining to the presentaion of a notification in the UI 

Show presentationInfo properties 

            *   scopes array of strings   Information about the scopes to which this notification applies. Helps determine the placement of the notification in the UI 
            *   friendlyName string   Localized, human-readable string representing the name of the notification suitable to use in a UI 
            *   scopeFriendlyNames object   Friendly name to be displayed for each scope. 

Show additional optional properties 

                *   string string   Localized, human-readable string representing the name of the notification suitable to use in a UI. 

        *   subscriptionInfo object   Object indicating what properties to use to subscribe to this notification via the 'Subscriptions' service. For info about its properties, refer to the Subscription sevice's API doc. 

Show subscriptionInfo properties 

            *   action string Required   
            *   target string   
            *   resourceId string   
            *   resourceType string Required   
            *   resourceSubType string   

        *   isManageableInHub boolean   Indicates if the notification can be managed in the hub. If true, the object will also contain 'subscriptionInfo' object and a 'presentationInfo' object with a non-empty scopes array. 
        *   notificationNamePattern string Required   Notification name pattern that will trigger this notification e.g resource.action 

#### default

Request error. See Errors.

*   application/json object   An error object. 

Show application/json properties 

    *   code string Required   The error code. 
    *   title string Required   Summary of the problem. 
    *   detail string   A human-readable explanation specific to this occurrence of the problem. 

 GET /api/v1/notifications

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.notifications.getNotifications({})
```

`qlik notification ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/notifications" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "notifications": [    {      "transports": [        "string"      ],      "isSubscribable": true,      "presentationInfo": {        "scopes": [          "string"        ],        "friendlyName": "string",        "scopeFriendlyNames": {}      },      "subscriptionInfo": {        "action": "string",        "target": "string",        "resourceId": "string",        "resourceType": "string",        "resourceSubType": "string"      },      "isManageableInHub": true,      "notificationNamePattern": "string"    }  ]}`

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