---
source: https://qlik.dev/authenticate/oauth/create/create-region-oauth-client/
last_updated: 2025-07-08T16:09:30Z
---

# Create a region level M2M OAuth2 client

> **Note:** Region level OAuth clients are available to subscriptions with an entitlement for more
> than one tenant.

## Introduction

In this tutorial, you are going to learn how to create a region level machine-to-machine
OAuth2 client via My Qlik.

To simplify user and credential management when you're managing more than one
tenant, Qlik provides the ability for the
[Service Account Owner](https://help.qlik.com/en-US/cloud-services/Subsystems/Hub/Content/Sense_Hub/Introduction/qlik-sense-admin-roles.htm)
(SAO) of a subscription to set up region level OAuth clients in the
[My Qlik](https://help.qlik.com/en-US/cloud-services/Subsystems/Hub/Content/Sense_Hub/Introduction/my-qlik-portal-overview.htm)
portal, which will be referred to as a *region level OAuth client*.

![Example of a 15 tenant deployment across three Qlik Cloud regions, with each region accessible via a region-level OAuth client](https://qlik.dev/_astro/regional_oauth_clients.CgnI3u7k.png)

Each region level OAuth client provides access to all Qlik Cloud tenants
deployed to that region, without requiring additional credentials or OAuth clients.
To achieve the same thing with tenant level OAuth clients, you would need to
first create a new machine-to-machine client on each tenant, and handle
dynamically switching between these credentials in your orchestration code or tooling.

Region level clients do not appear in the OAuth client listing within a tenant, and
do not support customization of scopes. All region level OAuth clients are granted:

- admin\_classic
- tenants:create
- tenants:deactivate
- tenants:reactivate

Tenant scopes are only available to regional OAuth clients. Refer to the [OAuth scopes list](https://qlik.dev/authenticate/oauth/scopes/#available-scopes)
for more information on scopes available to tenant level OAuth clients.

If you're not sure which type of OAuth client you need for your application, review
the [OAuth2 Overview](https://qlik.dev/authenticate/oauth/) to learn more.

## Requirements

- Access to My Qlik as the Service Account Owner of your subscription
- A subscription with an entitlement for more than one tenant

## Create an OAuth2 client application in Qlik Cloud

Generate OAuth clients by selecting the
subscription in My Qlik with the multiple tenants entitlement.

### 1 Sign in to My Qlik

Sign in to [My Qlik](https://account.myqlik.qlik.com/account) and identify the
subscription with the multiple tenants entitlement added to it.

### 2 Manage OAuth clients

Click the ellipsis (`...`) on the right side of the subscription entry and select
**Manage OAuth clients**.

![Screenshot of a subscription with multiple tenant entitlement](https://qlik.dev/_astro/manage_multitenant_sub.DYTXIVAY.png)

### 3 Select the region

Select the region that the OAuth credential is going to support. The system
returns a *client ID* and *client secret*.

![Screenshot of the interface to manage active OAuth clients](https://qlik.dev/_astro/manage_OAuth_clients.Dh5Fx4yX.png)

Client IDs and corresponding
secrets are unique to the region and can't be used in
different regions. Record the client id and the client secret and keep them
safe and secure because the client secret is not visible after generation.

A regional OAuth client will not appear in the OAuth clients list for a tenant.

### Recreating region level OAuth clients

The `My Qlik` portal provides the ability to create up to one OAuth client per Qlik
Cloud region, and allows you to refresh the client secret for existing OAuth clients
if required.

If you decide to delete an OAuth client via the portal, the associated
`bot user` account will not be deleted from tenants automatically. Subsequently
creating a new OAuth client in that region will result in a new, additional
`bot user` being created when this new OAuth client is used on a tenant.

You will need to ensure that any content owned by an inactive `bot user` is
deleted or reassigned to the active `bot user` account using
APIs or the tenant management console.
