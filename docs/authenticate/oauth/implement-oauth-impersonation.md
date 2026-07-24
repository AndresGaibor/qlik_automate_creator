---
source: https://qlik.dev/authenticate/oauth/implement-oauth-impersonation/
last_updated: 2026-01-19T14:21:00Z
---

# Retrieve and use OAuth impersonation tokens

## What are OAuth impersonation tokens?

OAuth impersonation tokens are access tokens your backend requests on behalf of end users so your web app can access
Qlik Cloud when the app and tenant use different identity providers.

For security best practices when implementing impersonation tokens,
see [Guiding principles for OAuth impersonation](https://qlik.dev/authenticate/oauth/guiding-principles-oauth-impersonation).

## When to use impersonation tokens

Use OAuth impersonation tokens when you want to:

- Embed Qlik analytics without redirecting users to Qlik Cloud for login
- Keep client secrets on the backend and avoid exposing them in the browser
- Limit access by controlling token scope and permissions for embedded content

## Prerequisites

Before implementing OAuth impersonation tokens, you need:

- An [OAuth client configured with impersonation enabled](https://qlik.dev/authenticate/oauth/create/create-oauth-client-m2m-impersonation)
- A backend service capable of handling HTTP requests and storing secrets securely
- Knowledge of OAuth 2.0 concepts and the client credentials flow
- Understanding of your identity provider integration and user context passing
- [@qlik/api](https://qlik.dev/toolkits/qlik-api/) or a way to make HTTP requests from your backend

## Architecture overview

The impersonation flow uses the frontend (user-facing app where Qlik content is embedded), the backend
(stores OAuth client credentials), and the Qlik Cloud authorization server (issues tokens based on the impersonation
request).

The flow is as follows:

1. User signs in to your app.
2. Frontend asks the backend for a token.
3. Backend requests an impersonation token from Qlik Cloud and returns it to the frontend.
4. Frontend uses the token to render embedded content.

## Implementation

In this Node.js example, a `POST` request endpoint is added to the web application backend to handle requests from the
frontend for access tokens.
The frontend contacts this endpoint and receives an access token, which is then used to render embedded Qlik content.

### Backend using @qlik/api

`embed:./snippets/oauth/oauth-impersonation.js#L2-33`

### Backend using fetch

`embed:./snippets/oauth/oauth-impersonation.js#L36-68`

### Frontend using qlik-embed

In this example, the `data-get-access-token` attribute in the qlik-embed configuration script points to the
`getAccessToken` function.
This function calls the backend route to obtain the access token for the user from Qlik Cloud.
The returned access token is stored in browser memory and used for all subsequent requests to Qlik Cloud.

`embed:./snippets/oauth/oauth-impersonation.html`

## Troubleshooting

Here are some common issues and solutions when implementing OAuth impersonation tokens.

### Invalid or expired client credentials

If you receive an error indicating invalid or expired client credentials when requesting a token, check the following:

- The OAuth client ID and secret are correct
- The OAuth client has the impersonation grant type enabled

### Token request fails with "unauthorized"

If the backend returns an "unauthorized" error when requesting a token, check the following:

- The OAuth client has the `user_default` scope or other required scopes configured
- The user being impersonated exists in the tenant
- Tour backend has the correct tenant URL

### Embedded content fails to load after token retrieval

If the embedded Qlik content fails to load after obtaining the token, check the following:

- The token is passed correctly to the Qlik embed component
- The token has not expired (tokens are valid for 6 hours by default)
- The token scopes include access to the specific app or sheet being embedded

For more detailed information on OAuth security and best practices,
see [Guiding principles for OAuth impersonation](https://qlik.dev/authenticate/oauth/guiding-principles-oauth-impersonation).
