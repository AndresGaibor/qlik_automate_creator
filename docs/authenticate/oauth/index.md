---
source: https://qlik.dev/authenticate/oauth/
last_updated: 2026-06-30T11:59:06+02:00
---

# OAuth Overview

## Introduction

OAuth2 is an authorization standard used by cloud applications to allow
them to access resources on other web applications on behalf of a user,
without sharing the user's credentials.

Qlik Cloud supports multiple OAuth2 client types and tiers to suit a variety of use cases.

## OAuth2 terms

- **Resource owner**: The Qlik Cloud user or tenant who owns the content or
  information to be shared.
- **Client**: The client is the web application or software requesting access to
  resources in Qlik Cloud on a user's behalf.
- **Access tokens**: Access tokens are encrypted strings clients use to access
  resources from Qlik Cloud.
- **Authorization server**: The Qlik Cloud tenant that provides access tokens to
  registered clients upon a successful authentication and consent flow by the
  owner of the resources to be accessed.
- **Resource server**: In Qlik Cloud, this is another component on the tenant that
  validates the access token sent by the client and authorizes the client to
  access the resources.
- **Scopes**: OAuth2 scopes are strings provided to APIs, so that they know whether
  to grant access to the type of data and operation requested.

## What can you do with OAuth2 on Qlik Cloud?

Qlik Cloud implements OAuth2 to authorize external applications to access
content and metadata. Use cases include:

- Embed visualizations and data from Qlik Sense applications in web
  applications.
- Embed AI and machine learning models from Qlik Cloud into external applications.
- Access management and administration capabilities of Qlik Cloud to
  integrate with DevOps processes.
- Integrate Qlik Cloud directly into cloud application onboarding flows so
  that partners can provision, configure, and hydrate analytics alongside their
  host applications.
- Support authorization within other Qlik applications like the mobile app and
  qlik-cli.

## What types of OAuth2 clients does Qlik Cloud support?

Qlik Cloud supports [confidential and public clients](https://auth0.com/docs/get-started/applications/confidential-and-public-applications)
to suit a variety of use cases:

- Confidential applications require a trusted backend server to hold the OAuth client
  credentials; a Client ID and Client Secret.
- Public applications cannot store credentials in a secure way, therefore, only
  a Client ID is needed to authorize an application to work with Qlik Cloud.

## What OAuth2 application types does Qlik Cloud support?

- **Web Application**: Apps where the application logic of the client runs
  mostly on the server-side. Web application OAuth registrations are confidential
  clients, therefore, they require a backend server to store credentials.
- **Machine-to-Machine application**: Apps acting as bots or external service
  workers requiring access to Qlik Cloud tenants to perform management or
  administrative functions. M2M applications are confidential clients requiring
  secure access to the Client Id and Client Secret to function.
- **Machine-to-Machine impersonation application**: An extension to M2M, this
  application type involves apps acting as users during authentication to perform
  any function the user has permission to perform. It also operates as a confidential client,
  but with additional user information required to impersonate a Qlik Cloud tenant user.
- **Single page application**: Apps usually written in JavaScript where the
  user interface logic is executed in a web browser. SPAs are public clients and
  do not require a backend for authorization purposes.
- **Native application**: Apps that run natively on a device like a computer or
  mobile phone. Native apps are usually public clients requiring both the
  Client Id and Client Secret.

## What OAuth client tiers are available for registration?

Qlik Cloud offers multiple OAuth2 client tiers, which help organizations with
multiple tenants manage their applications and users:

- **Tenant-level OAuth2 clients**: These clients are registered in a specific tenant
  and support all client application types.
- **Region-level OAuth2 clients**: These clients are registered across a specific license
  in a region for a single subscription, and support only the Machine-to-Machine client application
  type. They provide access to all tenants linked to that license in the specified region
  on a specific subscription. Learn more about [region-level OAuth2 clients](https://qlik.dev/authenticate/oauth/create/create-region-oauth-client).
- **Organization-level OAuth2 clients**: These clients are registered at the
  organization level and apply to all tenants across all subscriptions and regions.
  They support the Machine-to-Machine client application type and are ideal for
  accessing tenant information across your organization. Learn more about
  [organization-level OAuth2 clients](https://qlik.dev/authenticate/oauth/create/create-organization-level-oauth-client).

Region level OAuth clients are only available to subscriptions entitled to more than
one tenant.

### When to use each type of OAuth client

**Tenant-level OAuth clients** are ideal when you need to:

- Work with a single subscription without multiple tenant entitlement
- Access all Qlik Sense content capabilities, such as user impersonation and the `admin.apps` scope.
  These capabilities are specific to tenant-level operations only.

**Region-level OAuth clients** provide a focused scope when you need to:

- Manage tenants within a single region on a specific subscription
- Maintain separation by region if you have multiple independent deployments

**Organization-level OAuth clients** are the recommended choice when you need to
query tenants across multiple subscriptions and regions

## How does OAuth2 work on Qlik Cloud?

### Web OAuth2 client applications

Web application OAuth2 clients handle token exchange on the backend server where
the application is hosted. They require the end user to authenticate
to the web application, and from there the web application communicates with
Qlik Cloud to authorize the web application to access content on behalf of the
user logged into the web application.

Web OAuth2 clients use the `Authorization Code` flow to authorize with Qlik
Cloud. Web OAuth2 clients request an authorization token from the `/oauth/authorize`
endpoint using the `Client ID` and `Client Secret` values to authenticate to Qlik
Cloud. The authorization token returned to the web application is used to make a
another request for the user's access token from the `/oauth/token` endpoint.

Web OAuth2 clients also support **Private Key JWT** as an alternative authentication method.
With Private Key JWT, the client signs a JWT assertion with its private key instead of sending
a client secret, which reduces the risk of credential exposure. For more information, see
[Authenticate with Private Key JWT](https://qlik.dev/authenticate/oauth/oauth-private-key-jwt/).

The sequence of requests and responses for Web applications and Qlik Cloud.

![Web app OAuth2 sequence diagram](https://qlik.dev/_astro/webappoauth2qlikcloud.CddfGLFH.png)

### Machine-to-Machine OAuth2 client applications

Machine-to-Machine (M2M) enabled OAuth2 clients are a powerful and secure way to manage
and automate operations on your Qlik Cloud tenant. They require no user interaction and
have the Tenant Admin role, which gives you complete control over your tenant.

M2M OAuth2 clients use `Client Credentials` flow to authorize with the Qlik Cloud
authorization server. M2M OAuth2 clients pass `Client ID` and `Client Secret` fields in the
request body to the `/oauth/token` endpoint. The authorization server validates the
credentials and responds back with an `Access Token`, which the application can use
in making API requests.

You can create M2M client registrations using the `Web` option in the OAuth2
client configuration.

![Machine-to-Machine OAuth2 sequence diagram](https://qlik.dev/_astro/m2mappoauth2qlikcloud.C-AaXeef.png)

#### OAuth bot users

The first time an OAuth client requests a token for a tenant, a corresponding
non-interactive `bot user` is automatically created on the tenant, which
acts with privileges equivalent to the
`TenantAdmin` role on a tenant (the highest level of access available). A
`bot user` can be assigned roles in the same way as any other user on a tenant to
provide additional capabilities.

Actions performed by the `bot user` will be captured in the audit logs for the
tenant. Any content deployed using the OAuth client will be owned by the `bot user`
that corresponds to that OAuth client.

For tenant level bot users, the username of the bot will match the `name` entered
for the OAuth client when it was set up.

In user-based subscriptions, the tenant setting to **Enable dynamic assignment of professional users** controls license
assignment.
When that setting is enabled, a bot user receives a professional license when it first performs an action that
requires a license, such as login.
The platform doesn't assign the license at the moment the bot user is created.\
In capacity-based subscriptions, license assignment is controlled by roles.
When a bot user is assigned a role that require a user license, the platform assigns the license on role assignment.

For region level bot users, the username of the bot will match `<region> OAuth client`
where `<region>` matches the Qlik Cloud domain for that region. For example,
`mytenant.us.qlikcloud.com` is in the `us` region, and will generate a bot user
with a name of `US OAuth client`.
The subject of the bot will be `qlikbot\<OAUTH_CLIENT_ID>` on all tenants in the region.

In user-based subscriptions, when **Enable dynamic assignment of professional users** enabled, a region-level bot
receives one professional license in that region when it first performs an action that requires a license.\
In capacity-based subscriptions, license assignment is controlled by roles.
When a region-level bot user is assigned a role that requires a user license, the platform assigns the license in the
region on role assignment.

### Machine-to-Machine OAuth2 Impersonation client applications

M2M Impersonation enhances automation and management within your Qlik Cloud tenant.
With user impersonation enabled, OAuth2 web clients
can seamlessly emulate user actions based on their existing roles. This allows for
authentication of users without requiring their interaction.

To authenticate, OAuth2 clients use
the `Impersonation` flow, which is similar to `Client Credentials` but with a
different `Grant Type`. Clients submit the `Client ID`, `Client Secret`,  and an
additional `User Lookup` parameter in the request body to the `/oauth/token`
endpoint. With the `User Lookup` parameter you can specify the user to
impersonate by either `userId` or `subject`. The authorization server validates
the credentials and responds back with an `Access Token`, which the application
can use to make API requests. This token can also be used from a web browser,
given that the origin used is allowlisted in the OAuth2 client.

Create M2M impersonation client registrations using the `Web` option in the
OAuth2 client configuration. Configure `Allowed Origins` if you plan on using
the access tokens from a browser.

![Machine-to-Machine OAuth2 Impersonation sequence diagram](https://qlik.dev/_astro/m2mimpersonationappoauth2qlikcloud.RhMDqt9X.png)

### Single-Page and Native OAuth2 client applications

Browser and device-based applications like single-page and native applications
use JavaScript APIs to update the user interface without needing to contact
a back-end. Qlik Cloud analytics content can be integrated into
single-page applications using the platform's embedding APIs with minimal setup.

Single-page applications and native applications (for example, mobile apps) use the
`Authorization Code` flow but with an additional component called
`Proof Key for Code Exchange`, or `PKCE`, because these applications cannot
store the `Client Secret` in a secure way on the front-end. With the `PKCE`
flow, a secret is exchanged between the application and the authorization
server called the `Code Verifier`. This code is transformed into a
`Code Challenge` and sent to the `/oauth/authorize` endpoint and receives an
authorization code in return. Without the code verifier, an attacker cannot
exchange the authorization code for an access token from the `/oauth/token`
endpoint.

Here is an example sequence diagram for a single-page application with embedded
content from Qlik Cloud.

![Single-page application OAuth2 sequence diagram](https://qlik.dev/_astro/spappoauth2qlikcloud.Cv-pUx3_.png)

### Anonymous embed OAuth2 client applications

Public-facing applications that don't authenticate users
can use the **anonymous embed** OAuth client type with the
Anonymous Access capability to provide access to Qlik Cloud content.

Anonymous embed applications use an `Authorization Code`-like flow, relying on an
access code generated when an app is shared for Anonymous Access.

> **Limitations:**
>
> - [Visualization extensions](https://qlik.dev/embed/foundational-knowledge/visualizations/) are not supported when accessed via an
>   anonymous access link for an app, due to security and API restrictions for anonymous sessions.

## Registering an OAuth client

Authorizing an external application to access resources on a tenant requires you to
register an OAuth2 client for your application.

When you register an OAuth2 client on your tenant, you receive a Client ID to embed into
your web application so it is recognized by your tenant when it requests access to resources.
If you register a confidential client, you also receive a Client Secret, which is required
to make authorized connections to your tenant.

### Registration methods

You can register OAuth clients in one of two ways:

- **Manual setup**: Create and maintain the client definition directly in your tenant through the
  Administration activity center or the [oauth-clients API](https://qlik.dev/authenticate/oauth/oauth-clients-api/).
  Use this method when you want full control over client settings at creation time, or when your
  use case requires M2M, impersonation, or organization-level clients.
- **Dynamic Client Registration (DCR)**: Let compatible applications register an OAuth client
  automatically via a public, unauthenticated endpoint. Use this method when your application
  connects to tenants it does not control and needs to onboard without per-tenant manual setup.
  This is an alternative approach for Model Context Protocol (MCP) clients and other RFC 7591-compatible integrations.
  For more information, see [OAuth dynamic client registration](https://qlik.dev/authenticate/oauth/oauth-dynamic-client-registration/).

### Manual setup: Tenant-level clients

You can register the following OAuth2 clients at the tenant level through the Administration activity center:

- [OAuth SPA](https://qlik.dev/authenticate/oauth/create/create-oauth-client-spa)
- [OAuth M2M](https://qlik.dev/authenticate/oauth/create/create-oauth-client)
- [OAuth M2M Impersonation](https://qlik.dev/authenticate/oauth/create/create-oauth-client-m2m-impersonation)
- [OAuth anonymous embed](https://qlik.dev/authenticate/oauth/create/create-oauth-client-anonymous)

Alternatively, you can [create OAuth clients via API](https://qlik.dev/authenticate/oauth/oauth-clients-api/).

You can register the following OAuth2 clients at the region level:

- [OAuth M2M](https://qlik.dev/authenticate/oauth/create/create-region-oauth-client)
