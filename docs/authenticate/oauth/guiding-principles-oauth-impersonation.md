---
source: https://qlik.dev/authenticate/oauth/guiding-principles-oauth-impersonation/
last_updated: 2026-01-19T14:21:00Z
---

# Guiding principles for OAuth impersonation

## Introduction

In Qlik Cloud, OAuth impersonation tokens enable web applications to create
access tokens on behalf of users within the tenant where the OAuth client
is registered.

OAuth impersonation tokens are useful in web applications where you want to
access resources and content from a Qlik Cloud tenant, but the tenant uses a
different identity provider than your web application. In embedded
analytics use cases, impersonation tokens mitigate content blocking by replacing
third-party cookies in modern browsers with OAuth tokens to maintain state.

As you prepare to implement OAuth impersonation tokens with Qlik Cloud, it's
important to mind the following guiding principles to ensure a scalable and
secure solution.

## Guiding principles for OAuth impersonation

- [Do not expose machine-to-machine clients in the frontend.](#do-not-expose-machine-to-machine-client-secrets-in-the-frontend)
- [Use a backend web application for issuing impersonation tokens.](#use-a-backend-web-application-for-issuing-impersonation-tokens)
- [Set scopes on impersonation tokens explicitly.](#set-scopes-on-impersonation-tokens-explicitly)
- [Use multiple clients for separating management from issuing tokens.](#use-multiple-clients-for-separating-management-from-issuing-tokens)

### Do not expose machine-to-machine client secrets in the frontend

Machine-to-machine OAuth clients in Qlik Cloud require sending the client ID and
client secret in the request payload to get a response from a tenant. However,
sharing a client secret on the frontend of an application exposes it to anyone
with access to your web application. Once a user has acquired the client secret, your
tenant can become compromised because they can use it to access
information on the tenant that you may not wish to share from any HTTP client
interface.

*Keep client secret values safe, secure, and out of reach by storing
them in the backend of your web application where users may not access them.*

### Use a backend web application for issuing impersonation tokens

To issue impersonation tokens for embedded analytics to the frontend, it's
recommended to create an endpoint in your web application backend. Your
frontend can call this endpoint to receive the token and authorize content
rendering based on the user's access control.

Here's a code snippet using `qlik-api`:

`embed:./snippets/oauth/oauth-impersonation.js#L2-33`

> **Tip:** For a complete implementation guide with backend and frontend examples,
> see [Retrieve and use OAuth impersonation tokens](https://qlik.dev/authenticate/oauth/implement-oauth-impersonation).

### Set scopes on impersonation tokens explicitly

Scopes are the first layer of access control for OAuth client access tokens.
Impersonation access tokens will inherit the scopes set in the OAuth client
configuration for the machine-to-machine impersonation grant type. You can
reduce the scopes applied to the access token when making the request. Include
the `scopes` property in the request payload and set its values to the desires scopes
for the access token, separated by spaces. Here's an
example using `fetch`:

`embed:./snippets/oauth/oauth-impersonation.js#L36-60`

### Use multiple clients for separating management from issuing tokens

For an additional security layer to prevent impersonation tokens with more
scopes than desired, consider creating two OAuth clients. One client
dedicated to creating impersonation tokens with only the `user_default` scope.
A second client to perform administrative operations on the tenant like user
information lookups and other actions.

While this approach adds management overhead to each tenant you handle,
it offers benefits by separating the concerns to ensure access tokens are
scoped according to their intended use.
