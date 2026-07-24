---
source: https://qlik.dev/authenticate/oauth/create/create-organization-level-oauth-client/
last_updated: 2026-04-10T12:26:08+01:00
---

# Create an organization-level OAuth2 client

In this tutorial, you learn how to create an organization-level OAuth2 client.
Organization-level OAuth clients enable you to access tenant information
and perform operations across all tenants in your subscriptions without needing
separate credentials for each region or tenant.

An organization-level OAuth client is useful when you need to:

- List tenants across multiple subscriptions and regions

Only the [Service Account Owner](https://help.qlik.com/en-US/cloud-services/Subsystems/Hub/Content/Sense_Hub/Introduction/qlik-sense-admin-roles.htm)
(SAO) of a subscription can create and manage organization-level OAuth clients.

## Comparison with other OAuth client types

Qlik Cloud supports three different OAuth client types at different tiers:

| Client Type            | Scope                                                  | Use Case                                           | Managed By           |
| ---------------------- | ------------------------------------------------------ | -------------------------------------------------- | -------------------- |
| **Organization-level** | All tenants across all subscriptions and regions       | Access tenant information across your organization | SAO                  |
| **Region-level**       | All tenants in a specific region (single subscription) | Multi-tenant management within a region            | SAO                  |
| **Tenant-level**       | Single tenant                                          | Tenant-specific applications and operations        | Tenant administrator |

## Prerequisites

- Service Account Owner (SAO) role for your subscription
- At least one existing subscription

## Create an organization-level OAuth2 client

1. In a web browser, go to [https://console.qlikcloud.com/admin/oauth](https://console.qlikcloud.com/admin/oauth).
   You'll be prompted to sign in with your service account owner (SAO) credentials

2. Click **Create**.

3. Enter a name for the OAuth client. Use a descriptive name that identifies
   the purpose of this client.

4. (Optional) Add a description to document what this client is used for.

5. Click **Create**.

6. The system generates and displays a client ID and client secret. You will use these
   credentials to authenticate your applications:

   - Click to copy the client ID. You can retrieve this ID later from the context menu for
     the OAuth client.
   - Click Copy secret to copy the client secret.

> **Warning:** The client secret is displayed only once during creation. You will not be able
> to access it again after closing this dialog. Treat it like a password and do
> not expose it in source code, repositories, or logs.

7. Click **Close**.

## Using your organization-level OAuth client

After creating your OAuth client, you can use the client ID and secret to request an access token
and authenticate to the [Organization REST APIs](https://qlik.dev/apis/org-rest/), which allow you to:

- List and query tenants across all subscriptions and regions in your organization
- Access organization-level tenant metadata and subscription IDs

Organization-level APIs use a different endpoint than tenant APIs. They target the organization endpoint
at `https://console.qlikcloud.com` instead of a specific tenant hostname.

For step-by-step instructions on making your first API call with your new OAuth client,
see [Get started with organization APIs](https://qlik.dev/apis/org-rest/get-started/).

To learn more about organization APIs and their capabilities, see the
[Organization REST APIs overview](https://qlik.dev/apis/org-rest/).
