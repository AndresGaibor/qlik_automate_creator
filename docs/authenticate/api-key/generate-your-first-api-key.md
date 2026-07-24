---
source: https://qlik.dev/authenticate/api-key/generate-your-first-api-key/
last_updated: 2026-04-20T13:34:03+01:00
---

# Generate your first API key

## Overview

API keys allow users to authenticate with Qlik Cloud APIs directly, which is useful for scripting, automation, and tools
like Postman or [qlik-cli](https://qlik.dev/toolkits/qlik-cli).

In this tutorial, you will learn how to:

- Grant users permission to generate API keys.
- Generate an API key for your account in a Qlik Cloud tenant.
- Test the API key using Postman.

> **Note:** An API key represents a token which provides access to Qlik Cloud
> with the same permissions as the user who created it. It is not possible to apply
> scopes to an API key. If you require finer control, consider using [OAuth2](https://qlik.dev/authenticate/oauth) instead.

> **Prefer OAuth SPA for apps and interactive use:** For apps and interactive use, we recommend [OAuth SPA](https://qlik.dev/authenticate/oauth/create/create-oauth-client-spa). It avoids long-lived API keys and supports scoped access. API keys cannot have scopes applied and grant full access to everything in that user's account. This tutorial is intended for quick testing and scripting.

## Prerequisites

- Access to a Qlik Cloud tenant.
- Tenant Admin role (for configuring permissions).
- A user account to generate the API key.

## Grant the Manage API Keys permission

> **Note:** You must have the `Tenant Admin` role to perform this section of the tutorial.

To generate API keys, users must have the Manage API keys permission.
You can grant this permission in two ways. Choose one of the following methods:

- Enable the permission for all users in the tenant, using the User Default settings.
- Enable the permission for specific users or groups of users, using a custom role.

> **Warning:** For security, only grant the Manage API keys permission to users or groups who require it.

### Enable the permission for all users in the tenant

To enable the Manage API Keys permission for all users in the tenant, you can use the User Default settings:

1. In the Administration activity center, go to **Manage users > Permissions**.
2. Click **User Default**.
3. Enable the **Manage API Keys** permission.
4. Save the changes.

![a screenshot of enabling the API key scope
in the user default role](https://qlik.dev/_astro/api-key-scope-user-default.BAdTyr8p.png)

### Enable the permission for specific users or groups of users

You can also create a custom role with the Manage API keys permission and assign it to specific users or groups.

To create a custom role with the relevant permission, follow these steps:

1. In the Administration activity center, go to **Manage users**.
2. On the Permissions tab, click **Create new**.
3. In the Create new role dialog, enter a name and description for the role.
4. Use the search to find specific permissions.
5. The User Default setting is shown for each permission. Choose the desired access level for the permissions you want
   to add.
6. Click **Create**.

![a screenshot of creating a custom role with the API key permission](https://qlik.dev/_astro/api-key-custom-role.BSui4l7Z.png)

You can now assign your custom role to users or groups in the tenant:

1. In the Administration activity center, go to **Manage users**.
2. Click the user or group you want to assign the role to.
3. Click the **Roles** tab.
4. Click the **Assign roles** button.
5. In the Assign roles dialog, search for your custom role.
6. Select the role and click **Assign**.

The custom role is now assigned to the selected users or groups.

## Generate an API key

To generate new API keys, you must have a custom role with the Manage API keys permission, or the permission must be
enabled in the User Default settings.

Do the following to generate an API key for your account:

1. Click your user profile icon and select **Profile settings**.
2. Go to the **API keys** section and click **Generate new key**.
3. Provide a description and set an expiration time for the API key.

![a screenshot of the generate new key configuration screen.](https://qlik.dev/_astro/api-key-config.DflyuR0d.png)

4. Click **Generate** to create the key.
5. Copy the generated API key and store it securely.

> **Note:** The API key is only displayed once, when you create it.
> If you don't copy it, you won't be able to see this specific API key again and
> will need to generate a new API key.

![a screenshot of the generated key in the generate new key configuration screen.](https://qlik.dev/_astro/api-key-copy.CjTSG7dN.png)

## Test the API key in Postman

Use the copied API key in [Postman](https://www.postman.com/downloads) by setting an Authorization header to use a
Bearer token.

1. In Postman, select the **Authorization** tab.
2. From the **Auth Type** list, choose **Bearer Token**.
3. Paste your API key in the **Token** field.
4. Add a URL for a REST endpoint on the tenant, for example: add `https://<tenant hostname>/api/v1/users/me`.
5. Click **Send** to make the request to the API endpoint. If you entered the information into Postman correctly, the
   API returns a `200 OK` response with your [user information](apis/rest/users/#get-v1-users-me).

> **Tip:** If you receive an authentication error, verify that your API key is correct and has not expired or been revoked.

## Next steps

Now that you have an API key, you can:

- Explore the [REST API reference documentation](https://qlik.dev/apis/rest) and try out the APIs in Postman.
- Install [qlik-cli](https://qlik.dev/toolkits/qlik-cli) and add your API key to harness the power of Qlik from the command line.
- Follow step-by-step tutorials in [Manage](https://qlik.dev/manage) to create data files, data connections, or manage tenants.
