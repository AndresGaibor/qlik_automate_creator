---
source: https://qlik.dev/authenticate/oauth/oauth-clients-api/
last_updated: 2026-06-30T11:59:06+02:00
---

# Manage OAuth clients via API

Qlik Cloud supports the use of [OAuth clients](https://qlik.dev/authenticate/oauth/)
for a multitude of use cases, including automation, orchestration, embedded
analytics, and more.

To enable the programmatic creation and management of OAuth clients, the `oauth-clients`
API has been published. This API supports list, retrieve, create, update, and deletion
actions for OAuth clients on a tenant.

> **Note:** If your application supports RFC 7591, you can use
> [OAuth dynamic client registration](https://qlik.dev/authenticate/oauth/oauth-dynamic-client-registration/) to
> register an OAuth client automatically via the unauthenticated `POST /oauth/register` endpoint,
> without a tenant administrator creating it manually. The registered client must still be approved
> by a tenant administrator before it can be used. The `oauth-clients` API described in this article
> requires an access token and is intended for tenant administrators and platform operators.

A common use case involves OEMs embedding Qlik Cloud, where each new OEM
customer lands in their own Qlik Cloud tenant. OAuth M2M impersonation
authenticates users from the OEM web app to Qlik Cloud. In this scenario, as
part of tenant provisioning, a new OAuth client for machine-to-machine
impersonation must be configured.

To deploy a new OAuth machine-to-machine impersonation client:

```bash
curl -L "https://<TENANT>/api/v1/oauth-clients" ^
-H "Authorization: Bearer <ACCESS_TOKEN>" ^
-H "Content-Type: application/json" ^
-H "Accept: application/json" ^
-d "{
    \"appType\": \"web\",
    \"clientName\": \"my-embedded-portal\",
    \"description\": \"This is an OAuth client created using API calls.\",
    \"allowedScopes\": [
        \"user_default\"
    ],
    \"redirectUris\": [
        \"https://my-web-app.com/callback\"
    ],
    \"allowedGrantTypes\": [
        \"client_credentials\",
        \"urn:qlik:oauth:user-impersonation\"
    ]
}"
```

This operation returns the definition of the new OAuth client with a `201` status code:

```json
{
    "allowedGrantTypes": [
        "client_credentials",
        "urn:qlik:oauth:user-impersonation"
    ],
    "allowedScopes": [
        "user_default"
    ],
    "appType": "web",
    "clientId": "<CLIENT_ID>",
    "clientName": "my-embedded-portal",
    "clientSecret": "<CLIENT_SECRET>",
    "clientSecretHint": "e6815",
    "clientUri": "",
    "createdAt": "2024-03-18T17:26:30.342260287Z",
    "description": "This is an OAuth client created using API calls.",
    "logoUri": "",
    "ownerId": "BL4tTJ4S7xrHTcq0zQxQrJ5qB1_Q6cSo",
    "redirectUris": [
        "https://my-web-app.com/callback"
    ]
}
```

To change the consent method to `trusted`, pass the ID of the new OAuth client into
the path as `<CLIENT_ID>`:

```bash
curl -L -X PATCH "https://<TENANT>/api/v1/oauth-clients/<CLIENT_ID>/connection-configs/me" ^
-H "Authorization: Bearer <ACCESS_TOKEN>" ^
-H "Content-Type: application/json" ^
-H "Accept: application/json" ^
-d "[
  {
    \"op\": \"replace\",
    \"path\": \"/consentMethod\",
    \"value\": \"trusted\"
  }
]"
```

If successful, this returns an empty body and a `204` status code. Once created, your web
application's back-end can request a new token for each user session with a call
to the existing [OAuth API](https://qlik.dev/apis/rest/oauth/) using the credentials
for the OAuth client you just created:

```bash
curl -L "https://<TENANT>/oauth/token" ^
-H "Content-Type: application/json" ^
-H "Accept: application/json" ^
-d "{
    \"client_id\": \"<CLIENT_ID>\",
    \"client_secret\": \"<CLIENT_SECRET>\",
    \"grant_type\": \"urn:qlik:oauth:user-impersonation\",
    \"scope\": \"user_default\",
    \"user_lookup\": 
        {
            \"field\": \"userId\",
            \"value\": \"6422bad8022070c06d2417bc\"
        }
    
}"
```

If successful, this returns a `200` status code along with a token. The token
can be used by a client of the OEM embedded application to impersonate
the specified user:

```json
{
    "access_token": "eyJhbGci...",
    "scope": "user_default",
    "token_type": "bearer",
    "expires_at": "2024-03-18T00:21:41.000Z",
    "expires_in": 21600
}
```

**Learn more about OAuth clients**

To discover more about OAuth clients:

- Learn about support and use cases for [OAuth clients](https://qlik.dev/authenticate/oauth/)
  in Qlik Cloud.
- Visit the [oauth-client API reference](https://qlik.dev/apis/rest/oauth-clients/)
  to learn about the API.
