---
title: "Email configuration REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/transports/"
local_path: "docs/endpoints/transports.md"
---

Title: Email configuration REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/transports/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## Email configuration

*   [Get email configuration](https://qlik.dev/apis/rest/transports/#get-api-v1-transports-email-config "Get email configuration")
*   [Patch email configuration](https://qlik.dev/apis/rest/transports/#patch-api-v1-transports-email-config "Patch email configuration") D 
*   [Update email configuration](https://qlik.dev/apis/rest/transports/#put-api-v1-transports-email-config "Update email configuration")
*   [Delete email configuration](https://qlik.dev/apis/rest/transports/#delete-api-v1-transports-email-config "Delete email configuration")
*   [Send test email](https://qlik.dev/apis/rest/transports/#post-api-v1-transports-email-config-actions-send-test-email "Send test email")
*   [Get configuration status](https://qlik.dev/apis/rest/transports/#post-api-v1-transports-email-config-actions-validate "Get configuration status")
*   [Verify configuration](https://qlik.dev/apis/rest/transports/#post-api-v1-transports-email-config-actions-verify-connection "Verify configuration")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/transports.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# Email configuration

Transports supports configuration of the tenant-level SMTP service. For the SMTP service in Qlik Automate, review the automation-connections API.

[Download OpenAPI spec](https://qlik.dev/specs/rest/transports.json)

## Endpoints

*   [GET /api/v1/transports/email-config](https://qlik.dev/apis/rest/transports/#get-api-v1-transports-email-config)
*   [PATCH /api/v1/transports/email-config](https://qlik.dev/apis/rest/transports/#patch-api-v1-transports-email-config)
*   [PUT /api/v1/transports/email-config](https://qlik.dev/apis/rest/transports/#put-api-v1-transports-email-config)
*   [DELETE /api/v1/transports/email-config](https://qlik.dev/apis/rest/transports/#delete-api-v1-transports-email-config)
*   [POST /api/v1/transports/email-config/actions/send-test-email](https://qlik.dev/apis/rest/transports/#post-api-v1-transports-email-config-actions-send-test-email)
*   [POST /api/v1/transports/email-config/actions/validate](https://qlik.dev/apis/rest/transports/#post-api-v1-transports-email-config-actions-validate)
*   [POST /api/v1/transports/email-config/actions/verify-connection](https://qlik.dev/apis/rest/transports/#post-api-v1-transports-email-config-actions-verify-connection)

## [](https://qlik.dev/apis/rest/transports/#get-api-v1-transports-email-config)Get email configuration

Returns the current email configuration and configuration status for the tenant.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Responses

#### 200

Email configuration. If configuration does not exist in database then { isValid false, passwordExists false} is returned.

*   application/json object   

Show application/json properties 

    *   status object   Contains statusCode and statusReason 

Show status properties 

        *   statusCode number   Status code 
        *   statusReason string   Status reason 

    *   isValid boolean   Is the configuration valid 
    *   tenantId string   The tenant Id 
    *   username string   user name 
    *   errorCode string   Indicates error with this email configuration. OK means that no error is indicated. Possible values are OK, CONFIG_NOT_SET, INCOMPLETE_CONFIG, INVALID_CREDENTIALS, PROVIDER_ERROR 
    *   serverPort number   smtp server listening port 
minimum = 1

    *   lastUpdated string   
    *   authFailures number   Number of authentication failures 
    *   emailAddress string   used for SMTP authentication 
    *   securityType string   one of none, StartTLS or SSL/TLS 
    *   serverAddress string   domain name or IP address of SMTP server 
    *   passwordExists boolean   Indicates if password is defined for this smtp config. The password itself is not returned! 
    *   providerConfig object   

One of:
        *   getMicrosoft365Config object   

Show getMicrosoft365Config properties 

            *   clientId string   Microsoft365 client identifier 
            *   emailAddress string   The email address that should appear in From field when sending emails with this account 
            *   providerTenantId string   Microsoft365 tenant identifier 

        *   getBasicAuthConfig object   

Show getBasicAuthConfig properties 

            *   username string   user name used for SMTP login 
            *   senderName string   The name that should appear in From field when sending emails with this account 
            *   serverPort number   smtp server port 
minimum = 1

            *   emailAddress string   The email address that should appear in From field when sending emails with this account 
            *   securityType string   The selected SMTP security mechanism. Could be either 'none', 'StartTLS' or 'SSL/TLS' 
            *   serverAddress string   domain name or IP address of SMTP server 

    *   serviceProvider string   Name of the service provider for authentication 
Can be one of: "Microsoft365""BasicAuth"

    *   modificationTime string   Last modification time. Formatted as a ISO 8601 string. 

#### 403

Must be a tenant admin.

*   application/json object   

Show application/json properties 

    *   errors array of objects   An error object 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem 

#### default

Unexpected error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 

 GET /api/v1/transports/email-config

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.transports.getEmailConfig()
```

`qlik transport email-config ls`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/transports/email-config" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "status": {    "statusCode": 0,    "statusReason": "OK"  },  "isValid": true,  "tenantId": "mcdd-mkw_Ebo0fR2vLl8_YsQYFsYrTdP",  "username": "john.smith@company.com",  "errorCode": "INVALID_CREDENTIALS",  "serverPort": 587,  "lastUpdated": "string",  "authFailures": 0,  "emailAddress": "john.smith@company.com",  "securityType": "StartTLS",  "serverAddress": "smtp.company.com",  "passwordExists": true,  "providerConfig": {    "clientId": "12345678-1234-1234-1234-123456789012",    "emailAddress": "abc@example.com",    "providerTenantId": "12345678-1234-1234-1234-123456789012"  },  "serviceProvider": "Microsoft365",  "modificationTime": "2022-06-30T09:57:40.954Z"}`

## [](https://qlik.dev/apis/rest/transports/#patch-api-v1-transports-email-config)Patch email configuration

Deprecated

Patches the email configuration for the tenant. This endpoint is deprecated, use `PUT /transports/email-config` to replace the entire configuration instead.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)
Deprecated This endpoint is deprecated and will eventually be removed. Read our API policy [here](https://qlik.dev/apis/api-policy/).
Deprecated sunset 2026-11
Deprecated description Migrating to PUT /email-config

### Request Body

Required

*   application/json array of objects   A JSON Patch document as defined in [https://datatracker.ietf.org/doc/html/rfc6902](https://datatracker.ietf.org/doc/html/rfc6902). 

Show application/json properties 

    *   op string Required   The operation to be performed. 
Can be one of: "replace, remove, add"

    *   path string Required   The path for the given resource field to patch. 
Can be one of: "/username""/serverAddress""/serverPort""/securityType""/emailAddress""/emailPassword"

    *   value string Required   The value to be used for this operation. 

### Responses

#### 204

Success.

#### 400

Bad request.

*   application/json object   

Show application/json properties 

    *   errors array of objects   An error object 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem 

#### 403

Must be a tenant admin.

*   application/json object   

Show application/json properties 

    *   errors array of objects   An error object 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem 

#### default

Unexpected error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 

 PATCH /api/v1/transports/email-config

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.transports.patchEmailConfig([  {    op: 'replace',    path: '/username',    value: 'New name',  },])
```

`# qlik-cli has not implemented support for PATCH /api/v1/transports/email-config yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/transports/email-config" \-X PATCH \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '[{"op":"replace","path":"/username","value":"New name"}]'`

## [](https://qlik.dev/apis/rest/transports/#put-api-v1-transports-email-config)Update email configuration

Creates or replaces the email configuration for the tenant. Validation of the configuration is done as part of the request.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

*   application/json object   

Show application/json properties 

    *   providerConfig object   

One of:
        *   putMicrosoft365Config object   Microsoft 365 authentication configuration. Provides OAuth credentials and tenant information for Microsoft 365 email delivery. 

Show putMicrosoft365Config properties 

            *   clientId string   Microsoft365 client identifier 
            *   clientSecret string   secret to authenticate the Microsoft365 account 
            *   emailAddress string   The email address that should appear in From field when sending emails with this account 
            *   providerTenantId string   Microsoft365 tenant identifier 

        *   putBasicAuthConfig object   SMTP basic authentication configuration. Provides server address, credentials, and sender information for standard SMTP email delivery. 

Show putBasicAuthConfig properties 

            *   username string   user name used for SMTP login 
            *   senderName string   The name that should appear in From field when sending emails with this account 
            *   serverPort number   smtp server port 
minimum = 1

            *   emailAddress string   The email address that should appear in From field when sending emails with this account 
            *   securityType string   SMTP security mechanism to use. Could be either 'none', 'StartTLS' or 'SSL/TLS' 
            *   emailPassword string   password for SMTP basic authentication 
            *   serverAddress string   domain name or IP address of SMTP server 

    *   serviceProvider string   Name of the service provider for authentication 
Can be one of: "Microsoft365""BasicAuth"

### Responses

#### 204

Email configuration validated and saved successfully.

*   For "BasicAuth": Connection to the email server verified with provided credentials.
*   For "Microsoft365": Authentication token successfully retrieved with provided credentials.

#### 400

Bad request.

*   application/json object   

Show application/json properties 

    *   errors array of objects   An error object 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem 

#### 403

Must be a tenant admin.

*   application/json object   

Show application/json properties 

    *   errors array of objects   An error object 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem 

#### default

Unexpected error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 

 PUT /api/v1/transports/email-config

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `PUT /api/v1/transports/email-config` yet.// In the meantime, you can use fetch like this:
const response = await fetch(  '/api/v1/transports/email-config',  {    method: 'PUT',    headers: {      'Content-Type': 'application/json',    },    body: JSON.stringify({      providerConfig: {        clientId:          '12345678-1234-1234-1234-123456789012',        clientSecret:          '-123a5678_1234/1234*1234-123b567b12',        emailAddress: 'abc@example.com',        providerTenantId:          '12345678-1234-1234-1234-123456789012',      },      serviceProvider: 'Microsoft365',    }),  },)
```

`qlik transport email-config update`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/transports/email-config" \-X PUT \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>" \-d '{"providerConfig":{"clientId":"12345678-1234-1234-1234-123456789012","clientSecret":"-123a5678_1234/1234*1234-123b567b12","emailAddress":"abc@example.com","providerTenantId":"12345678-1234-1234-1234-123456789012"},"serviceProvider":"Microsoft365"}'`

## [](https://qlik.dev/apis/rest/transports/#delete-api-v1-transports-email-config)Delete email configuration

Deletes the email configuration for the tenant.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Responses

#### 204

Success.

#### 403

Must be a tenant admin.

*   application/json object   

Show application/json properties 

    *   errors array of objects   An error object 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem 

#### 404

Not found.

*   application/json object   

Show application/json properties 

    *   errors array of objects   An error object 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem 

#### default

Unexpected error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 

 DELETE /api/v1/transports/email-config

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.transports.deleteEmailConfig()
```

`qlik transport email-config rm`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/transports/email-config" \-X DELETE \-H "Authorization: Bearer <access_token>"`

## [](https://qlik.dev/apis/rest/transports/#post-api-v1-transports-email-config-actions-send-test-email)Send test email

Attempts to sends a test email using the active configuration, with the supplied email info (subject, body, recipient).

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

*   application/json object   

Show application/json properties 

    *   body string   email body 
    *   subject string   email subject 
    *   recipient string   email recipient (email address) 

### Responses

#### 200

Attempted send request. Response body indicates success/failure

*   application/json object   

Show application/json properties 

    *   message string   error message from SMTP middleware .. a bit technical but could be useful to administrator 
    *   success boolean   was SMTP operation successful or not. Other fields herein provide more detail 
    *   connectionFailed boolean   could not resolve domain name, connection refused, connection timed out, SSL mismatch 
    *   smtpResponseCode integer   smtp result code string from the SMTP server. eg. "250 2.6.0" 

#### 403

Must be a tenant admin.

*   application/json object   

Show application/json properties 

    *   errors array of objects   An error object 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem 

#### 404

No email config exists for tenant.

*   application/json object   

Show application/json properties 

    *   errors array of objects   An error object 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem 

#### default

Unexpected error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 

 POST /api/v1/transports/email-config/actions/send-test-email

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.transports.sendTestEmail({})
```

`qlik transport email-config send-test-email`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/transports/email-config/actions/send-test-email" \-X POST \-H "Content-type: application/json" \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "message": "string",  "success": true,  "connectionFailed": true,  "smtpResponseCode": 42}`

## [](https://qlik.dev/apis/rest/transports/#post-api-v1-transports-email-config-actions-validate)Get configuration status

Returns the current isValid value for the email configuration for the tenant. Does not attempt to connect to a server to verify the connection or send a test email. Will return false if no email configuration exists.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Responses

#### 200

Returns boolean isValid for the email config.

*   application/json object   

Show application/json properties 

    *   isValid boolean   true if smtp config is correct and complete. Will return false if smtp-config does not exist at all 
    *   errorCode string   Indicates error with this email configuration. OK means that no error is indicated. Possible values are OK, CONFIG_NOT_SET, INCOMPLETE_CONFIG, INVALID_CREDENTIALS, PROVIDER_ERROR 

#### default

Unexpected error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 

 POST /api/v1/transports/email-config/actions/validate

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.transports.validateEmailConfig()
```

`qlik transport email-config validate`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/transports/email-config/actions/validate" \-X POST \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "isValid": true,  "errorCode": "INVALID_CREDENTIALS"}`

## [](https://qlik.dev/apis/rest/transports/#post-api-v1-transports-email-config-actions-verify-connection)Verify configuration

Attempts to verify connection to email server using a low-level protocol handshake to confirm the server is reachable and the credentials are valid, without sending a test email.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Responses

#### 200

Performed email connection. Response body indicates success/failure

*   application/json object   

Show application/json properties 

    *   message string   error message from SMTP middleware .. a bit technical but could be useful to administrator 
    *   success boolean   was SMTP operation successful or not. Other fields herein provide more detail 
    *   connectionFailed boolean   could not resolve domain name, connection refused, connection timed out, SSL mismatch 
    *   smtpResponseCode integer   smtp result code string from the SMTP server. eg. "250 2.6.0" 

#### 404

No email config exists for tenant.

*   application/json object   

Show application/json properties 

    *   errors array of objects   An error object 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem 

#### default

Unexpected error.

*   application/json object   

Show application/json properties 

    *   errors array of objects   An error object. 

Show errors properties 

        *   code string Required   The error code. 
        *   title string Required   Summary of the problem. 

 POST /api/v1/transports/email-config/actions/verify-connection

 JavaScript  Qlik CLI  cURL 

```
import { createQlikApi } from '@qlik/api'
const qlik = createQlikApi({  hostConfig: {    host: 'https://{tenant}.{region}.qlikcloud.com',    apiKey: '<access-token>',  },})
await qlik.transports.verifyEmailConfigConnection()
```

`qlik transport email-config verify-connection`

`curl "https://{tenant}.{region}.qlikcloud.com/api/v1/transports/email-config/actions/verify-connection" \-X POST \-H "Authorization: Bearer <access_token>"`

### Example Response

`{  "message": "string",  "success": true,  "connectionFailed": true,  "smtpResponseCode": 42}`

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