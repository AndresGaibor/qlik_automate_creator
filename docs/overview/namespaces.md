---
title: "API namespaces | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/namespaces/"
local_path: "docs/overview/namespaces.md"
---

Title: API namespaces | Qlik Developer Portal


Namespaces for REST and Events APIs are being introduced in Qlik Cloud to support the growing number of APIs and services in the platform, and to unlock versioning support in the future. This change makes it easier for you to find, understand, and use Qlik APIs by grouping related resources by context, as well as standardizing the interface for the APIs.

Subscribe to the [changelog](https://qlik.dev/changelog/) for updates. As each API is namespaced, a deprecation notice will be published, providing a minimum 12-month notice period for migration, and migration guides will be provided.

## [](https://qlik.dev/apis/namespaces/#what-to-expect-implication-on-existing-apis) What to expect: Implication on existing APIs

*   The new namespaced APIs will be introduced in parallel with the existing APIs.
*   The existing APIs will be deprecated and removed after a **minimum** 12-month deprecation period from the notice of deprecation on the [changelog](https://qlik.dev/changelog/). The API reference will clearly indicate the deprecated API, and the new namespaced API.

## [](https://qlik.dev/apis/namespaces/#key-changes) Key changes

### [](https://qlik.dev/apis/namespaces/#rest) REST

1.   **Removal of `v1` from the path**: `v1` will be removed from the path to prepare for versioning support in the future.
2.   **Grouping resources by context**: Related APIs will be grouped together under a namespace which indicates in which context the resources are applicable. For example: 
    *   The `analytics` namespace will contain APIs which are context specific to Analytics, such as APIs for managing apps, notes, ODAGs, and other Analytics-specific resources which require the context of an analytics application to be used.
    *   The `core` namespace will contain APIs which are applicable to the entire platform, irrespective of the context. For example, APIs for managing users, groups, ip-policies, and roles.
    *   The `ai` namespace will contain APIs which are context specific to AI, such as APIs for managing AI assistants, knowledgebases, and other AI-specific resources.
    *   The `data-governance` namespace will contain APIs which are context specific to data governance, such as APIs for managing data products, data lineage, and other data governance-specific resources.
    *   The `machine-learning` namespace will contain APIs which are context specific to machine learning, such as APIs for managing machine learning models, machine learning deployments, and other machine learning-specific resources.
    *   The `telemetry` namespace will contain APIs which are context specific to telemetry, such as APIs for managing audit logs, consumption metrics, and other telemetry-specific resources.

3.   **Standardization of interfaces**: The payloads for the new namespaced APIs will be standardized to be compliant with Qlik’s API design principles, meaning improved consistency of payloads, query parameters, and response formats between different APIs, irrespective of the context.

For example, after applying the namespace changes, the following REST API paths would be renamed:

`/v1/apps/analytics/apps/v1/ip-policies/core/ip-policies/v1/users/core/users`

The benefit of resource context is that it reduces conflicts and confusion between different parts of the Qlik Cloud product offering while unblocking the path to versioning support in the future.

### [](https://qlik.dev/apis/namespaces/#events) Events

Events will adhere to the same namespace rule to avoid conflict of resource names and to match the REST resources.

This changes the pattern from:

`com.qlik.v<version>.<eventContext>.<action>com.qlik.<namespace>.<eventContext>.<action>`

For example, after applying the namespace changes, the following events would be renamed:

`com.qlik.v1.app.createdcom.qlik.analytics.app.created`

### [](https://qlik.dev/apis/namespaces/#namespace-information) Namespace information

Each namespace groups related APIs by product area or platform capability. The following namespaces are currently available:

| Namespace | Description |
| --- | --- |
| `ai` | APIs for integrating AI capabilities and tool execution into task-oriented applications. |
| `analytics` | APIs for building analytics experiences using dynamic generation and discovery workflows. |
| `core` | APIs for administering security, identity, access controls, and operational resources. |
| `data-governance` | APIs for governing trusted data products and quality controls across the organization. |
| `workflows` | APIs for automating business processes and connecting external systems into unified workflows. |