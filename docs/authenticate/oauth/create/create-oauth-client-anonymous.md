---
source: https://qlik.dev/authenticate/oauth/create/create-oauth-client-anonymous/
last_updated: 2026-03-03T13:42:07Z
---

# Create an anonymous OAuth2 client

## Introduction

In this tutorial, you will learn how to create an OAuth2 client to embed
Qlik Cloud into public websites and web applications without user authentication.
You will use the administration activity center to complete this task.

> **Limitations:**
>
> - Qlik Anonymous Access is available in the Europe (Stockholm) region (`se`) . It is not available in other regions, or in
>   Qlik Cloud Government.
> - [Visualization extensions](https://qlik.dev/embed/foundational-knowledge/visualizations/) are not supported when accessed via an
>   anonymous access link for an app, due to security and API restrictions for anonymous sessions.

If you're not deploying in the Europe (Stockholm) region, or your solution doesn't require
anonymous access, learn about other [OAuth patterns supported in Qlik Cloud](https://qlik.dev/authenticate/oauth/).

## Requirements

- A Qlik Cloud tenant
- Tenant Admin role assigned to the user account creating OAuth2 clients

## Create the OAuth2 client

1. Access the administration activity center and select **OAuth**.

![The oauth menu item](https://qlik.dev/_astro/1-oauthmenu.-ghrR3A2.png)

2. Click **Create new** to open the OAuth client configuration panel.
3. From the **Client type** list, select **Anonymous embed**.

![The configuration options for an OAuth2 client](https://qlik.dev/_astro/2-createclient.t5IfiO9P.png)

4. Enter a name and a description for the OAuth2 client in the related fields.

![The name and description input fields for an OAuth2 client configuration](https://qlik.dev/_astro/3-setnamedesc.eEPQhiG6.png)

5. Enter the URI for your web application into the **Add allowed origin** field.
   Web origins permit the OAuth client to accept access token requests from your
   application. All other requests from other origins will be rejected.

6. Click **Add**.

The URI you entered will appear in the text box.

![The web origins section of an OAuth2 client configuration](https://qlik.dev/_astro/3a-setorigin.BcGYRVwF.png)

7. Click **Create**. A window appears containing the *Client ID* for the new
   OAuth client.

![The OAuth 2 client id and client secret](https://qlik.dev/_astro/4-getclientid.DgiH6srL.png)

To use the new OAuth client, add the
*Client ID* into your Anonymous Access web application.
Here is an example `<script>` element containing the setup for `qlik-embed` web
components and referencing the OAuth2 client ID in the `data-client-id` attribute.

```html
<script 
  crossorigin="anonymous"
  type="application/javascript"
  src="https://cdn.jsdelivr.net/npm/@qlik/embed-web-components@1/dist/index.min.js"
  data-host="https://my-anonymous-tenant.se.qlikcloud.com"
  data-client-id="86d4f834fd445b142ce45b1e38df4572"
  data-access-code="<EMBED_ACCESS_CODE>"
  data-auth-type="anonymous"
></script>
```

## Next steps

Learn how to:

- [Embed analytics for anonymous users](https://qlik.dev/embed/qlik-embed/quickstart/qlik-embed-anonymous-tutorial/)
- [Enable users to create public links](https://help.qlik.com/en-US/cloud-services/csh/client/AnonymousAccess_AssignPermissions)
- [Share an analytics app with anonymous users](https://help.qlik.com/en-US/cloud-services/csh/client/AnonymousAccess_ShareApp)
