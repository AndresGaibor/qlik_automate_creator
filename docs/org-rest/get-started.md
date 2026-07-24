---
title: "Get started with organization APIs | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/org-rest/get-started/"
local_path: "docs/org-rest/get-started.md"
---

Title: Get started with organization APIs | Qlik Developer Portal


Organization REST APIs use OAuth client credentials for authentication. This guide walks you through requesting an access token and making your first API call to list tenants in your organization.

## [](https://qlik.dev/apis/org-rest/get-started/#prerequisites) Prerequisites

*   An organization-level OAuth client for organization API access. For detailed instructions, see the [organization-level OAuth client creation guide](https://qlik.dev/authenticate/oauth/create/create-organization-level-oauth-client/).

## [](https://qlik.dev/apis/org-rest/get-started/#step-1-request-an-access-token) Step 1: Request an access token

Exchange your OAuth client credentials for an access token by making a POST request to token endpoint:

`curl -L "https://console.qlikcloud.com/oauth/token" \  -H "Content-Type: application/json" \  -d "{\"client_id\": \"<CLIENT_ID>\", \"client_secret\": \"<CLIENT_SECRET>\", \"grant_type\": \"client_credentials\"}"`

Replace `<CLIENT_ID>` and `<CLIENT_SECRET>` with your OAuth client ID and secret from the Cloud Console.

Example response:

`{  "access_token": "<ACCESS_TOKEN>",  "token_type": "Bearer",  "scope": "cloud-console.tenants:read",  "expires_in": 21600,  "expires_at": "2026-04-08T15:45:03.000Z"}`

The `access_token` is valid for 21600 seconds (6 hours). Store it securely and request a new token when it expires.

If you receive an error when requesting the access token:

| Error | Cause | Solution |
| --- | --- | --- |
| `400 Bad Request` | Malformed request (invalid JSON, missing fields) | Verify the request body includes `client_id`, `client_secret`, and `grant_type`. Check JSON syntax. |
| `401 Unauthorized` | Invalid or expired credentials | Verify your `client_id` and `client_secret` are correct. |

## [](https://qlik.dev/apis/org-rest/get-started/#step-2-make-an-api-call-with-the-access-token) Step 2: Make an API call with the access token

Use the access token in the `Authorization` header for subsequent API calls. For example, to list all tenants linked to your organization:

`curl -L "https://console.qlikcloud.com/api/core/tenants" \  -H "Authorization: Bearer <ACCESS_TOKEN>"`

Replace `<ACCESS_TOKEN>` with the token obtained in the previous step.

Example response

`{  "links": {    "self": {      "href": "https://console.qlikcloud.com/api/core/tenants"    },    "next": {      "href": "https://console.qlikcloud.com/api/core/tenants?limit=20&offset=507f191e810c19729de860ea"    }  },  "data": [    {      "id": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69",      "name": "QlikTenant",      "hostnames": [        "tenant-hostname.us.qlikcloud.com",        "tenant-alias-hostname.us.qlikcloud.com"      ],      "regionCode": "us-east-1",      "countryCode": "US",      "status": "active",      "createdBy": "TiQ8GPVr8qI714Lp5ChAAFFaU24MJy7A",      "createdAt": "2026-01-15T10:30:00.000Z",      "updatedAt": "2026-06-20T14:45:00.000Z",      "licenseNumber": "1234567890123456",      "subscriptionId": "9876543210987654",      "licenseStartsAt": "2026-01-01T00:00:00.000Z",      "licenseEndsAt": "2026-12-31T23:59:59.999Z",      "deletionStartsAt": "2026-06-30T00:00:00.000Z",      "links": {        "self": {          "href": "https://console.qlikcloud.com/api/core/tenants/TiQ8GPVr8qI714Lp5ChAAFFaU24MJy69"        }      }    }  ]},...`

If you receive an error:

| Error | Cause | Solution |
| --- | --- | --- |
| `403 Forbidden` | OAuth client lacks permission for organization APIs | Verify the OAuth client was created using the Cloud Console. If the issue persists, recreate the OAuth client. |
| `401 Unauthorized` | Access token is invalid or expired | Request a new access token and retry the API call. |

Caution

Do not share your `client_secret` or access tokens. If you suspect they’ve been compromised, recreate your OAuth client or cycle your OAuth client secret immediately.

## [](https://qlik.dev/apis/org-rest/get-started/#token-lifecycle) Token lifecycle

Access tokens expire after 21600 seconds (6 hours). Your application should:

*   Cache the token and reuse it for multiple requests within the validity window
*   Request a new token when receiving a `401 Unauthorized` response
*   Avoid storing tokens in version control or configuration files

## [](https://qlik.dev/apis/org-rest/get-started/#next-steps) Next steps

*   Return to [Organization REST APIs overview](https://qlik.dev/apis/org-rest/)
*   Learn about [authorization and data scoping](https://qlik.dev/apis/org-rest/#authorization-and-data-scoping) for organization APIs
*   Check the [changelog](https://qlik.dev/changelog/tag/api/) for the latest updates