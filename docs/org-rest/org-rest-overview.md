---
title: "Organization REST APIs | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/org-rest/"
local_path: "docs/org-rest/org-rest-overview.md"
---

Title: Organization REST APIs | Qlik Developer Portal


Qlik Cloud APIs operate at two distinct scopes: **tenant-level** and **organization-level**. Understanding the difference between these scopes is important when building integrations that need to list and query tenants across multiple Qlik Cloud regions and subscriptions.

## [](https://qlik.dev/apis/org-rest/#what-is-an-organization) What is an organization?

An **organization** is a top-level grouping that represents a customer account. Each organization owns one or more subscriptions, and each subscription contains one or more tenants across multiple regions.

**Subscriptions** are the key organizational unit that define:

*   What features and capabilities each tenant is entitled to
*   How consumption is measured and reported across tenants in that subscription

`Organization (Customer) ├── Subscription 1  (License #: sub-111) │    ├── Tenant A  (regionCode: us-east-1) │    └── Tenant B  (regionCode: eu-west-1) └── Subscription 2  (License #: sub-222)      └── Tenant C  (regionCode: us-east-1)`

Each tenant has a `subscriptionId` field that links it to its parent subscription. This relationship enables subscriptions to define entitlements and track consumption for their tenants, while organization-level operations can span all subscriptions and their tenants.

## [](https://qlik.dev/apis/org-rest/#tenant-apis-vs-organization-apis) Tenant APIs vs. organization APIs

Most Qlik Cloud APIs are tenant APIs. They operate within the context of a single tenant and use a tenant hostname as the base URL.

Organization APIs expose organization-level resources through the Cloud Console. They are scoped to organization resources, such as listing tenants, and do not provide access to individual tenant resources. They target the Cloud Console host at `console.qlikcloud.com`:

`https://console.qlikcloud.com/api/<namespace>/<resource>`

The following table summarizes the key differences:

| Aspect | Tenant APIs | Organization APIs |
| --- | --- | --- |
| **Scope** | A single tenant | Organization-level resources scoped to the tenant’s associated organization |
| **Host** | `<tenant>.<region>.qlikcloud.com` | `console.qlikcloud.com` |
| **Auth** | Tenant OAuth client or API key, Organization OAuth client, or Regional OAuth client | Organization OAuth client |
| **Use case** | Manage resources within one tenant | List tenants across regions and subscriptions |

Organization APIs are cross-regional

Organization APIs let you list and query tenants across all regions linked to your organization, grouped by their subscriptions. This gives you visibility into your Qlik Cloud deployment, including subscription-level consumption and entitlements.

Organization REST APIs are most useful if your Qlik Cloud subscription includes multiple tenants. Service account owners can use them with single-tenant subscriptions if needed, though the value is limited.

## [](https://qlik.dev/apis/org-rest/#authentication) Authentication

Organization APIs require OAuth client credentials for authentication. To authenticate requests to organization APIs, you’ll need to:

1.   Create an OAuth client in the Cloud Console
2.   Exchange your client credentials for an access token
3.   Include the token in the `Authorization` header of your API requests

For step-by-step instructions, see [Get started with organization APIs](https://qlik.dev/apis/org-rest/get-started/).

Organization APIs enforce strict data boundaries. All query results are automatically scoped to the tenants linked to the caller’s organization via its subscriptions. This means:

*   You can only retrieve tenants whose `subscriptionId` matches one of your organization’s subscriptions.
*   Attempting to filter for a `subscriptionId` that does not belong to your organization results in a `403 Forbidden` response.

This ensures that organization API access is secure and contained to your own subscriptions and tenants, even in shared infrastructure environments.

## [](https://qlik.dev/apis/org-rest/#api-reference-documentation) API reference documentation

## [](https://qlik.dev/apis/org-rest/#next-steps) Next steps

*   Explore the [Tenants API reference documentation](https://qlik.dev/apis/rest/tenants/).
*   Learn about [API namespaces](https://qlik.dev/apis/namespaces/).
*   Check the [changelog](https://qlik.dev/changelog/tag/api/) for the latest updates to organization APIs.