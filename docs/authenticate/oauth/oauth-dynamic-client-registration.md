---
source: https://qlik.dev/authenticate/oauth/oauth-dynamic-client-registration/
last_updated: 2026-06-30T11:59:06+02:00
---

# OAuth dynamic client registration

OAuth Dynamic Client Registration (DCR) lets applications register OAuth clients in Qlik Cloud through a
tenant-scoped, unauthenticated endpoint defined in [RFC 7591](https://www.rfc-editor.org/rfc/rfc7591).

DCR is primarily used by Model Context Protocol (MCP) clients and AI-platform integrations that cannot rely on manual
provisioning, but it works for any application that supports RFC 7591-based registration.

> **Warning:** Enabling DCR exposes a public, unauthenticated endpoint on your tenant. Any application that knows your tenant hostname
> can submit a registration request. Every registered client starts in an unapproved state and remains unusable until a
> tenant administrator completes the approval flow. Review your approval process before enabling DCR.

## Prerequisites

Before using DCR:

- A tenant administrator must enable DCR on the tenant. For instructions, see
  [Configuring OAuth dynamic client registration](https://help.qlik.com/en-US/cloud-services/Subsystems/Hub/Content/Sense_Hub/Admin/oauth-dynamic-client-registration.htm)
  on Qlik Help.
- The application must support RFC 7591-based dynamic registration.
- A valid redirect URI must be available.

## How DCR works

### Registration flow

DCR follows this registration flow:

1. The application sends a registration request to the endpoint.
2. Qlik Cloud stores the client immediately in an unapproved state. Unapproved clients do not appear on the
   **OAuth** page in the Administration activity center.
3. Qlik Cloud returns the client credentials in the response.
4. The client remains unusable until a tenant administrator completes the first connection and approves the consent
   request in the OAuth client application. Unapproved clients are automatically deleted after 60 minutes.

### Approval and consent

Registration alone does not make a DCR client usable. To approve the client, a tenant administrator completes the
first connection from the OAuth client application, authenticates with Qlik Cloud, and approves the consent request.
This single flow approves the client and establishes tenant-level trust between the tenant and the application.

After approval:

- The client appears on the **OAuth** page in the Administration activity center.
- Other users can connect through the same OAuth application, and will be prompted for their own
  consent the first time they connect (or when the configuration of the OAuth client changes).
- A tenant administrator can edit the client to change its consent method, scopes, or other settings.

Every DCR client is initially configured with the **Required** consent method. After approval, a tenant administrator
can change the client to **Trusted** if that matches the tenant's security policy.

> **Note:** Publishing and consent are separate controls. Publishing constrains whether an OAuth client can be used by other
> tenants in the same region. The consent method (**Required** or **Trusted**) controls authorization consent behavior.
> Both settings are configurable per client after approval.

## Register a client

Send a `POST` request to the registration endpoint. No access token is required.

```bash
curl -X POST "https://<tenant-id>.<region>.qlikcloud.com/oauth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "client_name": "My Application",
    "client_uri": "https://myapp.example.com",
    "redirect_uris": [
      "https://myapp.example.com/callback"
    ],
    "grant_types": ["authorization_code", "refresh_token"],
    "token_endpoint_auth_method": "client_secret_basic"
  }'
```

The request must include a client name, a client URI, and at least one redirect URI.
All other fields are optional and follow RFC 7591 defaults unless overridden by Qlik Cloud.

### Authentication methods

The `token_endpoint_auth_method` field defines whether the client is confidential or public:

- `client_secret_basic` or `client_secret_post`: The client is confidential.
  Qlik Cloud issues a client secret that your backend system must store securely and use during token exchange.
  Both values are accepted; both require the tenant administrator to have enabled the **Client secret** authentication
  method in DCR settings.
- `none`: The client is public.
  No client secret is issued. The application must use Authorization Code Flow with Proof Key for Code Exchange
  (PKCE). This value requires the tenant administrator to have enabled the **None** authentication method in DCR
  settings.

If the tenant's DCR settings do not permit the requested authentication method, Qlik Cloud rejects the registration
request with a `400` error. Check the allowed methods with your tenant administrator before implementing.

All DCR clients use Authorization Code Flow. This setting only determines whether a client secret is issued.

### Example response

A successful registration returns `HTTP 201 Created` and a client definition.

Example response body:

```json
{
    "client_id": "019f04b29f39e79c87e828eca7084462",
    "client_secret": "071d751a2cbee5a5caa11b4168e15d29c925d9b9478e13771d48967dc9e69906",
    "client_secret_expires_at": 0,
    "client_id_issued_at": 1782490242,
    "logo_uri": "https://www.qlik.com/us/-/media/images/qlik/global/qlik-logo-2x.png",
    "redirect_uris": [
        "https://spa.example.com/callback"
    ],
    "scope": "user_default mcp:execute offline_access"
}
```

The client secret is returned only once and cannot be retrieved again. Public clients do not receive a client secret.

### Default OAuth scopes

You can optionally send scopes in the registration request payload. Qlik Cloud only accepts the following three scopes:
`user_default`, `mcp:execute`, and `offline_access`.
If you do not send scopes, Qlik Cloud defaults to all three scopes.
When `token_endpoint_auth_method` is set to `none` (public client), the `offline_access` scope is excluded from the
default assignment and is not assigned even if explicitly requested.

After approval, a tenant administrator can change the client scopes on the **OAuth** page in the Administration
activity center or through the [OAuth clients API](https://qlik.dev/apis/rest/oauth-clients/). For MCP integrations, the AI provider
application requests the scopes assigned at registration and cannot request different scopes. Scope changes do not
affect active MCP connections.

## Connect OAuth client applications

### Connection URLs

When configuring a compatible OAuth client application, use the connection URL for your use case:

| Use case                        | Connection URL                                                |
| ------------------------------- | ------------------------------------------------------------- |
| MCP or GenAI clients            | `https://<tenant-hostname>.<region>.qlikcloud.com/api/ai/mcp` |
| Other OAuth client applications | `https://<tenant-hostname>.<region>.qlikcloud.com`            |

For MCP configuration details, see
[Connecting to the Qlik MCP server](https://help.qlik.com/en-US/cloud-services/Subsystems/Hub/Content/Sense_Hub/QlikMCP/Connecting-Qlik-MCP-server.htm)
on Qlik Help.

### ChatGPT

ChatGPT supports separate DCR workflows for organization administrators and non-admin users in ChatGPT Enterprise
organizations.

When a ChatGPT organization administrator who is also a Qlik Cloud tenant administrator creates the app in their own
ChatGPT account, they complete the Qlik Cloud authentication and approval flow immediately.
The app can then be published to the organization without risk of expiration.

When a user creates and publishes the app through workplace settings, the app registration is created, but the
authentication and approval flow is only completed when a Qlik Cloud tenant administrator makes the first connection.
This first connection must occur within 60 minutes of registration.
Otherwise, Qlik Cloud deletes the unapproved client and the app must be created again.

To avoid this issue, a tenant administrator can register and publish the app directly through their own workplace
settings, ensuring the authentication and approval flow is completed immediately.

For the role-specific procedures, see:
[Connecting to ChatGPT](https://help.qlik.com/en-US/cloud-services/Subsystems/Hub/Content/Sense_Hub/QlikMCP/Connecting-Qlik-MCP-server.htm#Connecti)
on Qlik Help.

## Manage DCR clients

### Identify DCR clients

To distinguish DCR-registered clients from other client types, use the `createdByType` field when querying the
[OAuth clients API](https://qlik.dev/apis/rest/oauth-clients/).

- `dcr`: registered through Dynamic Client Registration
- `user`: created manually by a tenant administrator
- `service`: created by a service or internal process

To filter the list for DCR clients:

```bash
curl -X GET 'https://<tenant-id>.<region>.qlikcloud.com/api/v1/oauth-clients?filter=createdByType eq "dcr"' \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

For details on filtering and listing clients, see the
[OAuth clients API reference](https://qlik.dev/apis/rest/oauth-clients/).

### Manage multiple registrations from the same vendor

Some integrations register a new OAuth client for every connection instead of sharing one approved client. Because
each new client requires tenant-administrator approval, only Qlik Cloud tenant administrators can complete a DCR
connection for these integrations. Non-admin users can connect only through a method that reuses an approved client,
such as a shared connector or static OAuth configuration when available.

This behavior has been observed with:

- **Anthropic Claude**: Please follow the static OAuth configuration described in
  [Connecting to Claude](https://help.qlik.com/en-US/cloud-services/Subsystems/Hub/Content/Sense_Hub/QlikMCP/Connecting-Qlik-MCP-server.htm#Connecti2)
  on Qlik Help.
- **Antigravity**: Please use a manually configured client.

## Related resources

- [OAuth overview](https://qlik.dev/authenticate/oauth/): OAuth 2.0 client types and registration methods
- [OAuth clients API](https://qlik.dev/apis/rest/oauth-clients/): List and manage OAuth clients
- [OAuth scopes](https://qlik.dev/authenticate/oauth/scopes/): Full list of available scopes
- [Configuring OAuth dynamic client registration](https://help.qlik.com/en-US/cloud-services/Subsystems/Hub/Content/Sense_Hub/Admin/oauth-dynamic-client-registration.htm):
  Admin guide on the Qlik Cloud Help site
- [Administering Qlik MCP](https://help.qlik.com/en-US/cloud-services/Subsystems/Hub/Content/Sense_Hub/QlikMCP/Administering-Qlik-MCP.htm):
  Configure the Qlik MCP server and manage MCP client connections
