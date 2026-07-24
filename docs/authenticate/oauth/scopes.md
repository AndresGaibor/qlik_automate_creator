---
source: https://qlik.dev/authenticate/oauth/scopes/
last_updated: 2025-09-23T15:01:34+01:00
---

# OAuth Scopes

> **Note:** To learn about access control in Qlik Cloud, read the [access control overview](https://qlik.dev/manage/access-control/).

## Overview

OAuth scopes allow you to specify the level of access your application needs to a user's account.
When initiating an authorization request using an interactive OAuth flow, users
will be prompted to consent to the requested scopes.
By restricting your application's scopes, you provide transparency to the user and protect their
account from misuse.

Scopes are also available for use in the [Roles API](https://qlik.dev/manage/roles/scopes) to
provide granular control over what users can do in Qlik Cloud.

> **Note:** Scopes can only limit access for OAuth tokens; they cannot be used to grant any
> additional access to the user than they have assigned via their roles.

## How it works

As an integration developer, you specify your desired scopes in the initial OAuth
authorization request.

```text
GET /oauth/authorize?scope=automations apps:read spaces:read identity.name:read
```

The requested scopes are presented to users for their approval.
Any previously approved scopes are not presented again to the user but are still available
for the application to use, but applications should always examine what scopes are
available on tokens because users can remove previously approved
scopes between authorizations.

The authorization server will attempt to grant all the scopes in the client's allow
list even when the scope param is empty, but only scopes in the allow list that are
approved by the user will be granted. To request scopes for approval from the user,
they must be explicitly included on the authorization request using the
scope query param. The offline\_access scope is an exception, it won't be granted
implicitly, and it must be requested
to get a refresh token.

![a screenshot of the consent dialog showing the requested scopes](https://qlik.dev/_astro/consent-scopes.CLXuZLBe.png)

## Scope list

Scopes are grouped into administrator scopes, which provide broad access to resources that the
accessing user may not have named access to in the user interface, and user scopes,
which provide access to resources that the user has direct access to.

Examples:

- A user with the `TenantAdmin` role assigned, accessing via an OAuth client with the
  `automations` scope will be able to read and manage only automations they own, or
  automations in spaces where they have the relevant roles.
- A user with the `TenantAdmin` role assigned, accessing via an OAuth client with the
  `admin.automations` scope will be able to read and manage all automations in the
  tenant, irrespective of ownership or space access of the requesting user.

For the list of platform scopes, including scopes available to OAuth clients,
review [Manage scopes](https://qlik.dev/manage/access-control/scopes/).
