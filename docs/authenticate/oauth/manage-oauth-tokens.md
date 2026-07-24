---
source: https://qlik.dev/authenticate/oauth/manage-oauth-tokens/
last_updated: 2025-07-08T16:09:30Z
---

# Manage OAuth tokens via API

## Introduction

In this tutorial, you are going to learn how to audit and manage the OAuth tokens
created in your tenant.

OAuth tokens are created as part of the authorization process when a user or application
leverages one of the OAuth clients in your tenant for an embedded, backend, or other
process. Unlike API keys, OAuth tokens have a fixed expiry, and can be revoked by
an administrator at any time.

A common use case for revoking tokens is when Qlik Cloud is embedded into your web app.
OAuth tokens are generated when a user in your web app accesses content on Qlik Cloud.
When a user logs out of your web app, or their session expires, you may wish to also
expire their access to content on Qlik Cloud by revoking their tokens.

## Requirements

- A Qlik Cloud tenant
- A machine-to-machine (M2M) OAuth2 client registration on your tenant assigned
  the admin\_classic scope. You can
  create an OAuth2 client in the [management console](https://qlik.dev/authenticate/oauth/create/create-oauth-client)
- `Client ID` and `Client Secret` values from the (M2M) registration

## Send a request to generate an OAuth access token

With your OAuth M2M client credentials, you can request an access token which will
provide access to Qlik Cloud resources.

To request an access token, send:

```bash
curl -L "https://tenant.region.qlikcloud.com/oauth/token" ^
-H "Accept: application/json" ^
-H "Content-Type: application/json" ^
-d "{
    \"client_id\": \"k3r48pbga2va492emvhrbnpmpnuar4ok\",
    \"client_secret\": \"kpgsacd8drvqptrwykc6jqxe2bfvwwtncf5939apiwwz4d3jbp9bfz5vkss8u5i2\",
    \"grant_type\": \"client_credentials\",
    \"scope\": \"admin_classic\"
}"
```

This will return an access token for the current user in `access_token`:

```json
{
    "access_token": "eyJhbGciOiJFUzM4NCIsInR5cCI6Ikp...",
    "scope": "admin_classic",
    "token_type": "bearer",
    "expires_at": "2024-07-31T13:43:51.000Z",
    "expires_in": 21600
}
```

Save the access token as `<ACCESS_TOKEN>`.

## Find the client's user ID

You can use this access token to find the user ID for the current user with this call:

```bash
curl -L "https://tenant.region.qlikcloud.com/api/v1/users/me" ^
-H "Authorization: Bearer <ACCESS_TOKEN>" ^
-H "Content-Type: application/json" ^
-H "Accept: application/json"
```

This will return the user information, most crucially, the user ID in `id`:

```json
{
    "id": "646e2faf41d790506de740d0",
    "tenantId": "BL4tTJ4S7xrHTcq0zQxQrJ5qB1_Q6cSo",
    "clientId": "k3r48pbga2va492emvhrbnpmpnuar4ok",
    "status": "active",
    "subject": "qlikbot\\k3r48pbga2va492emvhrbnpmpnuar4ok",
    "name": "OAuth client name specified in admin console"
    ...
}
```

Save the user ID as `<USER_ID>`.

For OAuth bots (created when a M2M OAuth client is used), you can identify them
through the presence of a `clientId` in the response. Their subject will equal
`qlikbot\{clientId}` and their name will match the name of the corresponding OAuth client.

## List active tokens

List active tokens for the user in the tenant:

```bash
curl -L "https://mytenant.region.qlikcloud.com/api/v1/oauth-tokens?userId=<USER_ID>" ^
-H "Authorization: Bearer <ACCESS_TOKEN>" ^
-H "Content-Type: application/json" ^
-H "Accept: application/json"
```

This request returns a list of active tokens, with each token's ID in `id`:

```json
{
    "links": {
        "self": {
            "href": "https://mytenant.region.qlikcloud.com/api/v1/oauth-tokens?userId=<USER_ID>"
        }
    },
    "data": [
        {
            "id": "66a9eafe249304d27e7f7000",
            "tenantId": "BL4tTJ4S7xrHTcq0zQxQrJ5qB1_Q6cSo",
            "clientId": "k3r48pbga2va492emvhrbnpmpnuar4ok",
            "userId": "646e2faf41d790506de740d0",
            "description": null,
            "deviceType": null,
            "lastUsed": "2024-07-31T07:42:54.407Z"
        }
    ]
}
```

Save the token ID as `<TOKEN_ID>`.

## Revoke the token

To revoke a specific token, send the following request:

```bash
curl -L -X DELETE "https://mytenant.region.qlikcloud.com/api/v1/oauth-tokens/<TOKEN_ID>" ^
-H "Authorization: Bearer <ACCESS_TOKEN>" ^
-H "Content-Type: application/json" ^
-H "Accept: application/json"
```

An `HTTP 204` status response indicates the token has been revoked. Future requests
made with that token will now fail.
