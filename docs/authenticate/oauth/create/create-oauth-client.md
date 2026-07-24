---
source: https://qlik.dev/authenticate/oauth/create/create-oauth-client/
last_updated: 2026-07-24T08:27:55-02:30
---

# Create a M2M OAuth2 client

## Introduction

In this tutorial, you are going to learn how to create a machine-to-machine
OAuth2 client on your Qlik Cloud tenant through the management console user
interface.

If you're not sure which type of OAuth client you need for your application, review
the [OAuth2 Overview](https://qlik.dev/authenticate/oauth/) to learn more.

## Prerequisites

- A Qlik Cloud tenant
- Tenant Admin role assigned to the user account creating OAuth2 clients

> **Note:** If you're not sure which type of OAuth client you need for your application,
> review the [OAuth2 Overview](https://qlik.dev/authenticate/oauth/) to learn more.

## Create an OAuth2 client

1. In the Administration activity center, select **OAuth**.

   ![OAuth settings panel in the Administration activity center](https://qlik.dev/_astro/1.BMN_f8rs.png)

2. Click **Create new**, then select **Web** from the **Client type** dropdown.

   ![Configuration options for a Web OAuth2 client](https://qlik.dev/_astro/2.C0S2e0AS.png)

3. Enter a name for the OAuth2 client.

   ![Name input field for a Web OAuth2 client configuration](https://qlik.dev/_astro/4.DpoYUp1d.png)

4. Select the scopes to grant to the client. For more information, see [OAuth Scopes](https://qlik.dev/authenticate/oauth/scopes/).

   ![Scopes selection panel](https://qlik.dev/_astro/15.CmA2q9gH.png)

5. Under **Authentication method**, select one or both options:

   - **Client secret** (default): Qlik Cloud generates a shared secret. Use this if your
     application stores credentials securely.
   - **Private key JWT**: authenticate using a public/private key pair for enhanced security.
     Paste your application's public key in JSON Web Key (JWK) format.
     For more information, see [Authenticate with Private Key JWT](https://qlik.dev/authenticate/oauth/oauth-private-key-jwt/).

6. Select the **Machine-to-machine** checkbox to enable M2M authentication.

   ![Machine-to-machine checkbox for a Web OAuth 2 client configuration](https://qlik.dev/_astro/5.D1z9F705.png)

7. Click **Create**. A dialog displays your **Client ID** and (if selected) **Client secret**.
   Copy these values to a secure location.

   ![OAuth 2 client id and client secret display](https://qlik.dev/_astro/6.ByLwbYIb.png)

8. Click the action menu (three dots) next to your new OAuth client and select **Change
   consent method**.

   ![OAuth 2 extended properties menu](https://qlik.dev/_astro/7.0kAhg7Q9.png)

9. Select **Trusted** and click **Change consent method**.

   ![Consent configuration screen](https://qlik.dev/_astro/8.Dgf0coL_.png)

> **Tip:** For example, a trusted M2M OAuth client with the `admin.automations` scope lets
> its bot user manage automations regardless of owner or space, without transferring ownership.
> For more information, see
> [Deploy an automation to a tenant](https://qlik.dev/manage/platform-operations/deploy-automation-to-a-tenant).

Your OAuth2 client is ready to use. Use your **Client ID** and **Client secret** in your
application to authenticate with Qlik Cloud.

![Example qlik-cli usage with M2M OAuth2 client](https://qlik.dev/_astro/14.BLMzJIu_.png)
