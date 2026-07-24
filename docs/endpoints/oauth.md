---
title: "OAuth REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/oauth/"
local_path: "docs/endpoints/oauth.md"
---

Title: OAuth REST | Qlik Developer Portal


[Skip to content](https://qlik.dev/apis/rest/oauth/#start-of-content)[![Image 1: Qlik logo](https://qlik.dev/logo.svg)](https://qlik.dev/)

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

## OAuth

*   [Authorize a client application](https://qlik.dev/apis/rest/oauth/#get-oauth-authorize "Authorize a client application")
*   [Revoke OAuth token provided by client](https://qlik.dev/apis/rest/oauth/#post-oauth-revoke "Revoke OAuth token provided by client")
*   [Retrieve OAuth token](https://qlik.dev/apis/rest/oauth/#post-oauth-token "Retrieve OAuth token")

1.   [Home](https://qlik.dev/)
2.    / 
3.   [APIs](https://qlik.dev/apis/)
4.    / 
5.   [REST](https://qlik.dev/apis/rest/)

Copy page Copied!

[View as Markdown](https://qlik.dev/apis/rest/oauth.md)

* * *

 Open in Claude  Open in ChatGPT  Open in Perplexity  Open in VS Code Copilot 

# OAuth

Authorize OAuth client flows, and create and revoke OAuth tokens.

[Download OpenAPI spec](https://qlik.dev/specs/rest/oauth.json)

## Endpoints

*   [GET /oauth/authorize](https://qlik.dev/apis/rest/oauth/#get-oauth-authorize)
*   [POST /oauth/revoke](https://qlik.dev/apis/rest/oauth/#post-oauth-revoke)
*   [POST /oauth/token](https://qlik.dev/apis/rest/oauth/#post-oauth-token)

## [](https://qlik.dev/apis/rest/oauth/#get-oauth-authorize)Authorize a client application

Allows a client application to use an OAuth flow to request user authorization.

### Facts

Rate limit[Tier 1](https://qlik.dev/apis/rest/rate-limiting/)(1000 requests per minute)

### Query Parameters

*   client_id string Required   The client identifier. 
*   code_challenge_method string Required   The algorithm that client used for generating code_challenge, only S256 is supported for now. 
Can be one of: "S256"

*   redirect_uri string Required   Relative or full URL to redirect to after successful login. 
*   response_type string Required   Describes the grant flow to use. 
*   scope array Required   The scope of access that is being requested. 
*   state string Required   State parameter to roundtrip to client in final redirect. 
*   code_challenge string   The code challenge created by the client. 
*   login_hint string   Hint to the Authorization Server about the login identifier the End-User might use to log in. 
*   max_age number   Specifies the allowable elapsed time in seconds since the last time the End-User was actively authenticated by the OpenID Provider. If time is greater than max_age, force user to re-authorize. 
*   prompt string   Specifies whether the Authorization Server prompts the End-User for re-authentication or requires a non-interactive authentication. 
Can be one of: "none""login""consent"

### Responses

#### 302

Redirect to the identity provider or back to the redirect_uri if an error occurs. On error the redirect will follow the OAuth2 RFC section 4.1.2.1 ([https://tools.ietf.org/html/rfc6749#section-4.1.2.1](https://tools.ietf.org/html/rfc6749#section-4.1.2.1)) with an additional error_code parameter with the internal error code. When a detail is known for the error it will be included as error_detail.

*   text/html string   

#### 400

Invalid client_id or redirect_uri.

*   application/json object   A representation of the errors encountered from the HTTP request. 

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Non-standard information about the error. 
        *   title string Required   The error title. 
        *   detail string   The detailed error message. 
        *   status string   The http status code. 

 GET /oauth/authorize

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `GET /oauth/authorize` yet.// In the meantime, you can use fetch like this:
const response = await fetch('/oauth/authorize', {  method: 'GET',  headers: { 'Content-Type': 'application/json' },})
```

`# qlik-cli has not implemented support for GET /oauth/authorize yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/oauth/authorize"`

## [](https://qlik.dev/apis/rest/oauth/#post-oauth-revoke)Revoke OAuth token provided by client

Allows a client to revoke their token.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

Required

Properties of the token that the client wants to revoke.

*   application/json object   

Show application/json properties 

    *   token string Required   The token to revoke. 
    *   token_type_hint string   Type of the provided token. 
Can be one of: "access_token""refresh_token"

Properties of the token that the client wants to revoke.

*   application/x-www-form-urlencoded object   

Show application/x-www-form-urlencoded properties 

    *   token string Required   The token to revoke. 
    *   token_type_hint string   Type of the provided token. 
Can be one of: "access_token""refresh_token"

### Responses

#### 200

Token was revoked.

#### 400

Invalid request.

*   application/json object   A representation of the errors encountered from the HTTP request. 

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Non-standard information about the error. 
        *   title string Required   The error title. 
        *   detail string   The detailed error message. 
        *   status string   The http status code. 

 POST /oauth/revoke

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `POST /oauth/revoke` yet.// In the meantime, you can use fetch like this:
const response = await fetch('/oauth/revoke', {  method: 'POST',  headers: { 'Content-Type': 'application/json' },  body: JSON.stringify({    token: 'string',    token_type_hint: 'access_token',  }),})
```

`# qlik-cli has not implemented support for POST /oauth/revoke yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/oauth/revoke" \-X POST \-H "Content-type: application/json" \-d '{"token":"string","token_type_hint":"access_token"}'`

## [](https://qlik.dev/apis/rest/oauth/#post-oauth-token)Retrieve OAuth token

Allows a client to perform an OAuth flow to obtain a token set.

### Facts

Rate limit[Tier 2](https://qlik.dev/apis/rest/rate-limiting/)(100 requests per minute)

### Request Body

*   application/json any   

One of:
    *   oauth-client-credentials-request object   

Show oauth-client-credentials-request properties 

        *   scope string   The scope of access that is being requested. The scope should already be assigned to the OAuth client. For a list of available scopes, visit: [https://qlik.dev/authenticate/oauth/scopes/#available-scopes](https://qlik.dev/authenticate/oauth/scopes/#available-scopes) 
        *   client_id string Required   The client identifier. 
        *   grant_type string Required   The grant type used to obtain an access token outside of the context of a user. 
Can be one of: "client_credentials"

        *   client_secret string Required   The client secret. 
        *   client_assertion string   JWT used for client authentication instead of client_secret. 
        *   client_assertion_type string   Assertion type for JWT client assertion. 

    *   oauth-refresh-request object   

Show oauth-refresh-request properties 

        *   grant_type string Required   The grant type used to exchange a refresh token for an access token. 
Can be one of: "refresh_token"

        *   client_secret string   The client secret. 
        *   refresh_token string Required   The refresh token to use. 
        *   client_assertion string   JWT used for client authentication instead of client_secret. 
        *   client_assertion_type string   Assertion type for JWT client assertion. 

    *   oauth-authorization-code-request object   

Show oauth-authorization-code-request properties 

        *   code string Required   The authorization code created by the server. 
        *   client_id string Required   The client identifier. 
        *   deviceType string   The type of the user device the authorization token is generated for (Tablet, Phone etc.). 
        *   grant_type string Required   The grant type used to exchange an authorization code for an access token. 
Can be one of: "authorization_code"

        *   description string   A user-friendly description to distinguish between multiple tokens. 
        *   redirect_uri string Required   The original redirect URI provided during authorization. For verification purposes only. 
        *   client_secret string   The client secret. 
        *   code_verifier string Required   Required when grant_type is "authorization_code". The code verifier to verify original code challenge created by the client. It must be between 43 and 128 characters long and consists of [A-Z] / [a-z] / [0-9] / "-" / "." / "_" / "~" 
minLength = 43,  maxLength = 128

        *   client_assertion string   JWT used for client authentication instead of client_secret. 
        *   client_assertion_type string   Assertion type for JWT client assertion. 

    *   oauth-token-exchange object   Exchanges one token for another. Implementation is based on this spec: [https://datatracker.ietf.org/doc/html/rfc8693](https://datatracker.ietf.org/doc/html/rfc8693). 

Show oauth-token-exchange properties 

        *   purpose string Required   The intended use for the requested token. 
Can be one of: "websocket""webresource"

        *   client_id string Required   The client identifier. 
        *   grant_type string Required   Specifies the method in which the token will be granted. 
Can be one of: "urn:ietf:params:oauth:grant-type:token-exchange"

        *   subject_token string Required   The token that represents the identity of the party on behalf of whom the request is being made. 
        *   subject_token_type string Required   The type of the subject token. 
Can be one of: "urn:ietf:params:oauth:token-type:access_token"

    *   oauth-user-impersonation-request object   

Show oauth-user-impersonation-request properties 

        *   scope string   The scope of access that is being requested. The scope should already be assigned to the OAuth client. For a list of available scopes, visit: [https://qlik.dev/authenticate/oauth/scopes/#available-scopes](https://qlik.dev/authenticate/oauth/scopes/#available-scopes) 
        *   client_id string Required   The client identifier. 
        *   grant_type string Required   The grant type used to obtain an access token on behalf of an existing user. 
Can be one of: "urn:qlik:oauth:user-impersonation"

        *   user_lookup object Required   

Show user_lookup properties 

            *   field string Required   The identifier to impersonate the user by. 
Can be one of: "subject""userId"

            *   value string Required   The value of the identifier to impersonate the user by. 

        *   client_secret string Required   The client secret. 
        *   client_assertion string   JWT used for client authentication instead of client_secret. 
        *   client_assertion_type string   Assertion type for JWT client assertion. 

*   application/x-www-form-urlencoded any   

One of:
    *   oauth-client-credentials-request object   

Show oauth-client-credentials-request properties 

        *   scope string   The scope of access that is being requested. The scope should already be assigned to the OAuth client. For a list of available scopes, visit: [https://qlik.dev/authenticate/oauth/scopes/#available-scopes](https://qlik.dev/authenticate/oauth/scopes/#available-scopes) 
        *   client_id string Required   The client identifier. 
        *   grant_type string Required   The grant type used to obtain an access token outside of the context of a user. 
Can be one of: "client_credentials"

        *   client_secret string Required   The client secret. 
        *   client_assertion string   JWT used for client authentication instead of client_secret. 
        *   client_assertion_type string   Assertion type for JWT client assertion. 

    *   oauth-refresh-request object   

Show oauth-refresh-request properties 

        *   grant_type string Required   The grant type used to exchange a refresh token for an access token. 
Can be one of: "refresh_token"

        *   client_secret string   The client secret. 
        *   refresh_token string Required   The refresh token to use. 
        *   client_assertion string   JWT used for client authentication instead of client_secret. 
        *   client_assertion_type string   Assertion type for JWT client assertion. 

    *   oauth-authorization-code-request object   

Show oauth-authorization-code-request properties 

        *   code string Required   The authorization code created by the server. 
        *   client_id string Required   The client identifier. 
        *   deviceType string   The type of the user device the authorization token is generated for (Tablet, Phone etc.). 
        *   grant_type string Required   The grant type used to exchange an authorization code for an access token. 
Can be one of: "authorization_code"

        *   description string   A user-friendly description to distinguish between multiple tokens. 
        *   redirect_uri string Required   The original redirect URI provided during authorization. For verification purposes only. 
        *   client_secret string   The client secret. 
        *   code_verifier string Required   Required when grant_type is "authorization_code". The code verifier to verify original code challenge created by the client. It must be between 43 and 128 characters long and consists of [A-Z] / [a-z] / [0-9] / "-" / "." / "_" / "~" 
minLength = 43,  maxLength = 128

        *   client_assertion string   JWT used for client authentication instead of client_secret. 
        *   client_assertion_type string   Assertion type for JWT client assertion. 

    *   oauth-token-exchange object   Exchanges one token for another. Implementation is based on this spec: [https://datatracker.ietf.org/doc/html/rfc8693](https://datatracker.ietf.org/doc/html/rfc8693). 

Show oauth-token-exchange properties 

        *   purpose string Required   The intended use for the requested token. 
Can be one of: "websocket""webresource"

        *   client_id string Required   The client identifier. 
        *   grant_type string Required   Specifies the method in which the token will be granted. 
Can be one of: "urn:ietf:params:oauth:grant-type:token-exchange"

        *   subject_token string Required   The token that represents the identity of the party on behalf of whom the request is being made. 
        *   subject_token_type string Required   The type of the subject token. 
Can be one of: "urn:ietf:params:oauth:token-type:access_token"

    *   oauth-user-impersonation-request object   

Show oauth-user-impersonation-request properties 

        *   scope string   The scope of access that is being requested. The scope should already be assigned to the OAuth client. For a list of available scopes, visit: [https://qlik.dev/authenticate/oauth/scopes/#available-scopes](https://qlik.dev/authenticate/oauth/scopes/#available-scopes) 
        *   client_id string Required   The client identifier. 
        *   grant_type string Required   The grant type used to obtain an access token on behalf of an existing user. 
Can be one of: "urn:qlik:oauth:user-impersonation"

        *   user_lookup object Required   

Show user_lookup properties 

            *   field string Required   The identifier to impersonate the user by. 
Can be one of: "subject""userId"

            *   value string Required   The value of the identifier to impersonate the user by. 

        *   client_secret string Required   The client secret. 
        *   client_assertion string   JWT used for client authentication instead of client_secret. 
        *   client_assertion_type string   Assertion type for JWT client assertion. 

### Responses

#### 200

Token set created.

*   application/json object   

Show application/json properties 

    *   scope string   The scope of access that is being granted, delimited by space. 
    *   auth_time number   Unix time of when the last authentication occurred. 
    *   expires_at string   The date and time in ISO format for when the access token will expire. 
format = "date-time"

    *   token_type string Required   The type of the token issued. 
Can be one of: "bearer"

    *   access_token string Required   The access token granted. 
    *   refresh_token string   Refresh token to be used to obtain a new access token without user intervention. 
    *   issued_token_type string   The type of the token issued for a token exchange. See [https://datatracker.ietf.org/doc/html/rfc8693#section-2.2.1](https://datatracker.ietf.org/doc/html/rfc8693#section-2.2.1) for more details. 
Can be one of: "urn:ietf:params:oauth:token-type:access_token"

#### 400

Invalid request parameters.

*   application/json object   A representation of the errors encountered from the HTTP request. 

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Non-standard information about the error. 
        *   title string Required   The error title. 
        *   detail string   The detailed error message. 
        *   status string   The http status code. 

#### 401

Invalid login or tokens, indicates that code or token used can be deleted by the client. Also could be invalid client credentials provided in Authorization header.

*   application/json object   A representation of the errors encountered from the HTTP request. 

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Non-standard information about the error. 
        *   title string Required   The error title. 
        *   detail string   The detailed error message. 
        *   status string   The http status code. 

#### 403

Forbidden because user is disabled or has reached the maximum number of tokens.

*   application/json object   A representation of the errors encountered from the HTTP request. 

Show application/json properties 

    *   errors array of objects   List of errors and their properties. 

Show errors properties 

        *   code string Required   The error code. 
        *   meta object   Non-standard information about the error. 
        *   title string Required   The error title. 
        *   detail string   The detailed error message. 
        *   status string   The http status code. 

 POST /oauth/token

 JavaScript  Qlik CLI  cURL 

```
// qlik-api has not implemented support for `POST /oauth/token` yet.// In the meantime, you can use fetch like this:
const response = await fetch('/oauth/token', {  method: 'POST',  headers: { 'Content-Type': 'application/json' },  body: JSON.stringify({    scope: 'user_default offline_access',    client_id: 'string',    grant_type: 'client_credentials',    client_secret: 'string',    client_assertion:      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJteS1jbGllbnQtaWQiLCJzdWIiOiJteS1jbGllbnQtaWQiLCJhdWQiOiJodHRwczovL215LXRlbmFudC51cy5xbGlrY2xvdWQuY29tL29hdXRoL3Rva2VuIiwiZXhwIjoxNzM3MTIwMDAwLCJpYXQiOjE3MzcxMTk0MDAsImp0aSI6ImU1Zjg0ZGE3LWI0YzMtNGE5Yi04ZjFlLTNhMmIxYzRkNWU2ZiJ9.kR7Y5tz9Xm3KpwF8jH2vQ4nL9sA6bC1dE8fG0hI3jK5mN7oP9qR2sT4uV6wX8yZ0aB2cD4eF6gH8iJ0kL2mN4oP6qR8sT0uV2wX4yZ6aB8cD0eF2gH4iJ6kL8mN0oP2qR4sT6uV8wX0yZ2aB4cD6eF8gH0iJ2kL4mN6oP8qR0sT2uV4wX6yZ8aB0cD2eF4gH6iJ8kL0mN2oP4qR6sT8uV0wX2yZ4aB6cD8eF0gH2iJ4kL6mN8oP0qR2sT4uV6wX8yZ0aB2cD4eF6gH8iJ0kL2mN4oP6qR8',    client_assertion_type:      'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',  }),})
```

`# qlik-cli has not implemented support for POST /oauth/token yet.`

`curl "https://{tenant}.{region}.qlikcloud.com/oauth/token" \-X POST \-H "Content-type: application/json" \-d '{"scope":"user_default offline_access","client_id":"string","grant_type":"client_credentials","client_secret":"string","client_assertion":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJteS1jbGllbnQtaWQiLCJzdWIiOiJteS1jbGllbnQtaWQiLCJhdWQiOiJodHRwczovL215LXRlbmFudC51cy5xbGlrY2xvdWQuY29tL29hdXRoL3Rva2VuIiwiZXhwIjoxNzM3MTIwMDAwLCJpYXQiOjE3MzcxMTk0MDAsImp0aSI6ImU1Zjg0ZGE3LWI0YzMtNGE5Yi04ZjFlLTNhMmIxYzRkNWU2ZiJ9.kR7Y5tz9Xm3KpwF8jH2vQ4nL9sA6bC1dE8fG0hI3jK5mN7oP9qR2sT4uV6wX8yZ0aB2cD4eF6gH8iJ0kL2mN4oP6qR8sT0uV2wX4yZ6aB8cD0eF2gH4iJ6kL8mN0oP2qR4sT6uV8wX0yZ2aB4cD6eF8gH0iJ2kL4mN6oP8qR0sT2uV4wX6yZ8aB0cD2eF4gH6iJ8kL0mN2oP4qR6sT8uV0wX2yZ4aB6cD8eF0gH2iJ4kL6mN8oP0qR2sT4uV6wX8yZ0aB2cD4eF6gH8iJ0kL2mN4oP6qR8","client_assertion_type":"urn:ietf:params:oauth:client-assertion-type:jwt-bearer"}'`

### Example Response

`{  "scope": "offline_access user_default",  "auth_time": 1628524367,  "expires_at": "1970-01-18T13:17:10.931Z",  "token_type": "bearer",  "access_token": "string",  "refresh_token": "string",  "issued_token_type": "urn:ietf:params:oauth:token-type:access_token"}`

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