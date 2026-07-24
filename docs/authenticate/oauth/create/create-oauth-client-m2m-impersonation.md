---
source: https://qlik.dev/authenticate/oauth/create/create-oauth-client-m2m-impersonation/
last_updated: 2026-04-09T12:49:26Z
---

# Create a M2M impersonation OAuth2 client

## Introduction

In this tutorial, you are going to learn how to create a machine-to-machine impersonation
OAuth2 client on your Qlik Cloud tenant through the management console user
interface.

If you're not sure which type of OAuth client you need for your application, review
the [OAuth2 Overview](https://qlik.dev/authenticate/oauth/) to learn more.

## Prerequisites

- A Qlik Cloud tenant
- Tenant Admin role assigned to the user account creating OAuth2 clients

## Create an OAuth2 client

1. In the Administration activity center, select **OAuth**.

   ![OAuth settings panel in the Administration activity center](https://qlik.dev/_astro/1.BMN_f8rs.png)

2. Click **Create new**, then select **Web** from the **Client type** dropdown.

   ![Configuration options for a Web OAuth2 client](https://qlik.dev/_astro/2.C0S2e0AS.png)

3. Enter a name for the OAuth2 client.

   ![Name input field for a Web OAuth2 client configuration](data:image/png;base64,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)

4. Select the scopes to grant to the client. For more information, see [OAuth Scopes](https://qlik.dev/authenticate/oauth/scopes/).

   ![Scopes selection panel](https://qlik.dev/_astro/4.BKXL9skK.png)

5. If you plan to use the access token from a browser application, add it to the
   **Allowed Origins** list. In this example, `https://custom-app.com` is using impersonation
   tokens to make requests to a Qlik Cloud tenant.

   ![Allowed Origins configuration for browser apps](https://qlik.dev/_astro/5.D9n952Tz.png)

6. Select the **Machine-to-machine impersonation** checkbox to enable M2M impersonation
   for this OAuth client.

   ![Machine-to-machine impersonation checkbox for a Web OAuth2 client configuration](https://qlik.dev/_astro/6.D7n3hHOG.png)

7. Under **Authentication method**, select one or both options:

   - **Client secret** (default): Qlik Cloud generates a shared secret. Use this if your
     application stores credentials securely.
   - **Private key JWT**: Authenticate using a public/private key pair for enhanced
     security. Paste your application's public key in JSON Web Key (JWK) format. For more
     information, see [Authenticate with Private Key JWT](https://qlik.dev/authenticate/oauth/oauth-private-key-jwt/).

8. Click **Create**. A dialog displays your **Client ID** and (if selected) **Client secret**.
   Copy these values to a secure location.

   ![OAuth 2 client id and client secret display](https://qlik.dev/_astro/7.Bxx5UJPr.png)

9. Click the action menu (three dots) next to your new OAuth client and select **Change
   consent method**.

   ![OAuth 2 extended properties menu](https://qlik.dev/_astro/7.0kAhg7Q9.png)

10. Select **Trusted** and click **Change consent method**.

    ![Consent configuration screen](https://qlik.dev/_astro/8.Dgf0coL_.png)

Your OAuth2 client is ready to use. Use your **Client ID** and **Client secret** in your
application to authenticate with Qlik Cloud.
