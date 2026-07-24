---
title: "REST APIs | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/"
local_path: "docs/overview/rest-overview.md"
---

Title: REST APIs | Qlik Developer Portal


Qlik offers a set of REST APIs to observe and manage a Qlik Cloud tenant. Most of these APIs are service-oriented and provide a way of configuring most capabilities in a tenant, enabling programmatic deployments, CI/CD, monitoring, and more.

For access to data in Qlik Sense apps, refer to the [QIX API](https://qlik.dev/apis/json-rpc/).

Namespaced APIs

Namespaced APIs are being introduced to support the growing number of APIs and services in the platform, and to unlock versioning support in the future.

This change makes it easier for you to find, understand, and use Qlik APIs by grouping related resources by context and standardizing interfaces.

For more information, see [API namespaces](https://qlik.dev/apis/namespaces/) and the [changelog](https://qlik.dev/changelog/).

## [](https://qlik.dev/apis/rest/#what-are-rest-apis) What are REST APIs?

REST (Representational State Transfer) is an architectural style for designing networked applications. Qlik REST APIs use a request-response model where a client sends a request to a service, and the service responds with the requested resource.

## [](https://qlik.dev/apis/rest/#direct-rest-or-framework-interface) Direct REST or framework interface?

Direct REST calls and Qlik frameworks access the same underlying platform capabilities.

*   Use **direct REST** when you want low-level HTTP control.
*   Use `@qlik/api` when you want typed calls and built-in conveniences such as auth helpers, automatic CSRF handling, and cache-aware request behavior. See [qlik-api overview](https://qlik.dev/toolkits/qlik-api/), [authentication](https://qlik.dev/toolkits/qlik-api/authentication/), and [features](https://qlik.dev/toolkits/qlik-api/features/).
*   Use `qlik-cli` for shell-native scripting and operational automation. See [qlik-cli](https://qlik.dev/toolkits/qlik-cli/).
*   Use **Qlik Automate** for no-code orchestration with platform connectors. See [No-code overview](https://qlik.dev/toolkits/no-code/).
*   For assistant-driven workflows, **Qlik MCP access** can be used. See [Qlik MCP server](https://help.qlik.com/en-US/cloud-services/Subsystems/Hub/Content/Sense_Hub/QlikMCP/Qlik-MCP-server.htm).

## [](https://qlik.dev/apis/rest/#tenant-apis-vs-organization-apis) Tenant APIs vs. organization APIs

Most Qlik Cloud APIs are tenant APIs. They operate within the context of a single tenant and use a tenant hostname as the base URL:

`https://your-tenant.us.qlikcloud.com/api/<namespace>/<resource>`

If you need to list tenants across regions and subscriptions in your organization, see [Organization REST APIs](https://qlik.dev/apis/org-rest/).

The following table summarizes the key differences:

| Aspect | Tenant APIs | Organization APIs |
| --- | --- | --- |
| **Scope** | A single tenant | All tenants in an organization |
| **Host** | `<tenant>.region.qlikcloud.com` | `console.qlikcloud.com` |
| **Auth** | Tenant OAuth client or API key, Organization OAuth client, or Regional OAuth client | Organization OAuth client |
| **Use case** | Manage resources within one tenant | List tenants across regions and subscriptions |

## [](https://qlik.dev/apis/rest/#authentication) Authentication

### [](https://qlik.dev/apis/rest/#supported-authentication-methods) Supported authentication methods

Tenant REST APIs support different authentication methods:

*   OAuth 2.0: the recommended method for most use cases.
*   JSON Web Tokens (JWT): used for legacy embedding solutions where a proxy is in use, or third-party cookie blocking isn’t a concern.
*   API keys: a simple way of providing access to APIs with the same permissions of the creating user.

For more information about how to authenticate your requests, see the [Authentication Guide](https://qlik.dev/authenticate/).

Organization APIs authentication

Organization APIs use OAuth client credentials. You create an OAuth client in the Cloud Console, then exchange its credentials for an access token. For details, see [Organization REST APIs](https://qlik.dev/apis/org-rest/).

### [](https://qlik.dev/apis/rest/#csrf-token) CSRF token

When calling Qlik REST APIs in a browser context, you must send a CSRF token with your request. If the CSRF token is missing or invalid, the API will reject the request.

The CSRF token is used to prevent cross-site request forgery (CSRF) attacks. These attacks happen when a malicious website tricks your browser into performing actions, like sending a request, on another website where you’re authenticated, without your consent.

To send the CSRF token, include it in your request using the `qlik-csrf-token` header. For example:

`GET /api/v1/<RESOURCE> HTTP/1.1Host: <TENANT>.<REGION>.qlikcloud.comAuthorization: Bearer <ACCESS_TOKEN>qlik-csrf-token: <CSRF_TOKEN>`

You can retrieve the CSRF token using the [CSRF token API](https://qlik.dev/apis/rest/csrf-token/#get-v1-csrf-token). The response headers will include the CSRF token.

## [](https://qlik.dev/apis/rest/#resources-and-requests) Resources and requests

Each resource is exposed by a uniform resource identifier (URI). You can send an HTTP request to the relevant URI to access a resource.

Each request is made up of the following:

*   HTTP method
*   URI
*   Headers
*   Request body

### [](https://qlik.dev/apis/rest/#uri-structure) URI structure

The URI is the path to a resource. The URI is different for each resource, but the structure remains the same for all tenant-level resources:

`https://your-tenant.region.qlikcloud.com/api/v1/resource`

*   `your-tenant` is the hostname of your tenant, generated during tenant creation (and cannot be changed), or a custom alias name that you can define.
*   `region` is the region where your tenant is deployed, for example `eu` or `us`.
*   `resource` is the resource you want to access, which could include query or path parameters.

For example, the URI to retrieve the current user info looks like this:

`https://mytenant.us.qlikcloud.com/api/v1/users/me`

### [](https://qlik.dev/apis/rest/#http-methods) HTTP methods

Qlik REST APIs use the following HTTP methods:

*   `GET`: retrieve a resource.
*   `POST`: create a new resource.
*   `PUT`: update an existing resource.
*   `DELETE`: remove a resource.

Commonly used headers are:

*   `Authorization`: specifies the token used to authorize the request. Example: `Authorization: Bearer <token>`
*   `Content-type`: specifies the format of the request body. Example: `Content-Type: application/json`

## [](https://qlik.dev/apis/rest/#rate-limiting) Rate limiting

To ensure fair usage, Qlik implements rate limiting on API requests. Be sure to handle rate limit errors (`HTTP 429`) in your applications.

For more information, see [Rate limiting](https://qlik.dev/apis/rest/rate-limiting/).

Qlik uses cursor-based pagination to split results into subsets called pages. After retrieving the first subset of results, you can use the returned `links.next` URL in the response to retrieve the results from the next page.

For more information, see [Pagination](https://qlik.dev/apis/rest/pagination-sorting-filtering/).

## [](https://qlik.dev/apis/rest/#api-reference-documentation) API reference documentation

### [Adaptive cards](https://qlik.dev/apis/rest/analytics/discovery-agent/adaptive-cards/)### [Apps](https://qlik.dev/apis/rest/analytics/apps/)### [Change stores Retrieve user-entered changes from write tables for export or further processing.](https://qlik.dev/apis/rest/analytics/change-stores/)### [ODAG apps Retrieve and filter on-demand generated analytics applications by type.](https://qlik.dev/apis/rest/analytics/odag-apps/)### [ODAG links Create, manage, and retrieve on-demand analytics generation links between selection and template applications.](https://qlik.dev/apis/rest/analytics/odag-links/)### [ODAG requests Submit, track, and manage on-demand analytics generation requests and their generated applications.](https://qlik.dev/apis/rest/analytics/odag-requests/)### [ODAG settings Read and configure tenant-level on-demand analytics generation settings.](https://qlik.dev/apis/rest/analytics/odag-settings/)### [Auth settings Configure and retrieve authentication settings for your Qlik Cloud tenant.](https://qlik.dev/apis/rest/core/auth-settings/)### [IP Policies IP policies let you control which IP addresses can access your Qlik Cloud tenant. Use this API to manage allowlisting rules by creating, listing, updating, and deleting IP policies. When allowlisting is enabled, only users connecting from allowed IPv4 addresses or ranges can access the tenant.](https://qlik.dev/apis/rest/core/ip-policies/)### [Data products Data products are packages that group related datasets within a single, curated offering. Use the Data products API to create, manage, and activate data products for consumption by business users.](https://qlik.dev/apis/rest/data-governance/data-products/)### [Data qualities The Data qualities API enables you to assess the quality of your datasets through asynchronous computations.](https://qlik.dev/apis/rest/data-governance/data-qualities/)### [Trust scores The Trust Scores API retrieves the Qlik Trust Score™ for datasets in bulk, including overall score and per-axis and per-metric breakdowns.](https://qlik.dev/apis/rest/data-governance/trust-scores/)### [Tasks](https://qlik.dev/apis/rest/scheduling/tasks/)### [Automation connections Automation Connections are used by Qlik Automate connectors during automation execution.](https://qlik.dev/apis/rest/workflows/automation-connections/)### [Automation connectors Automation connectors let you integrate third-party services and applications into your data analytics workflows. Use this API to discover available connectors and understand billing characteristics.](https://qlik.dev/apis/rest/workflows/automation-connectors/)### [Automations Automations in Qlik Automate are no-code workflows which connect applications together.](https://qlik.dev/apis/rest/workflows/automations/)### [API keys API keys can be used by developers to gain programmatic access to the Qlik platform, acting as their own user.](https://qlik.dev/apis/rest/api-keys/)### [Apps Create, manage, and retrieve analytics applications in Qlik Cloud.](https://qlik.dev/apis/rest/apps/)### [Assistants Assistants provide a chat interface for asking questions and getting personalized, relevant answers for Qlik Answers.](https://qlik.dev/apis/rest/assistants/)### [Audits Audits provides access to events emitted upon each action taken in your tenant, providing detailed access to what's happening in your tenant.](https://qlik.dev/apis/rest/audits/)### [Automation connections Automation Connections are used by Qlik Automate connectors during automation execution.](https://qlik.dev/apis/rest/automation-connections/)### [Automation connectors Automation connectors let you integrate third-party services and applications into your data analytics workflows. Use this API to discover available connectors and understand billing characteristics.](https://qlik.dev/apis/rest/automation-connectors/)### [Automations Automations in Qlik Automate are no-code workflows which connect applications together.](https://qlik.dev/apis/rest/automations/)### [AutoML dataset predictions Use your ML deployment to generate batch data in file format to predict future outcomes on new data.](https://qlik.dev/apis/rest/automl-predictions/)### [AutoML real-time predictions Use your ML deployment to generate real-time results returned as JSON in a synchronous manner to predict future outcomes on new data.](https://qlik.dev/apis/rest/automl-deployments/)### [Banners Banners display short messages at the top of the client interface to share tenant-wide information, warnings, or issues. When embedding content, banners aren't shown inside qlik-embed UIs. The only embedding method that displays banners is an iFrame generated using the App Integration API.](https://qlik.dev/apis/rest/banners/)### [Brands Brands allow you to apply tenant level branding across most user interfaces.](https://qlik.dev/apis/rest/brands/)### [Collections Collections provide the framework to catalog various content a user has access to using tags, public and private collections, and favorites.](https://qlik.dev/apis/rest/collections/)### [Conditions Conditions are used by features such as data alerting and subscriptions to determine when action should be taken, based on data in a Qlik app.](https://qlik.dev/apis/rest/conditions/)### [CSP origins CSP origins allow you to configure domains, or origins, that Qlik Sense client visualizations/extensions are allowed to communicate with.](https://qlik.dev/apis/rest/csp-origins/)### [CSRF token A CSRF token is a secure random token (e.g., synchronizer token or challenge token) that is used to prevent CSRF attacks. This API retrieves the token for the current user session.](https://qlik.dev/apis/rest/csrf-token/)### [Data alerts Supports chart sharing, chart monitoring and alerting features. The legacy sharing APIs refer to chart sharing and chart monitoring, which is a feature that allows the user to send an e-mail with an embedded chart either manually (chart sharing) or in a recurring manner (chart monitoring). It also stores the history related to these actions. The alerting/ data-alerts APIs support the alerting feature, where a user is able to create alerts that trigger notifications in case a condition in the dataset of an app is fulfilled.](https://qlik.dev/apis/rest/data-alerts/)### [Data assets Data assets are part of the catalog in Qlik Cloud. A data asset is a member of a data store, and may contain multiple data sets.](https://qlik.dev/apis/rest/data-assets/)### [Data connections Data connections are used by Qlik Cloud Analytics apps and Data Integration projects to connect to external data sources. Credentials are stored in data-credentials.](https://qlik.dev/apis/rest/data-connections/)### [Data credentials Data credentials are the stored credentials leveraged by the data-connections service to connect to external data sources.](https://qlik.dev/apis/rest/data-credentials/)### [Data files Data files represent the flat file storage associated with spaces in your Qlik Cloud tenant. Each space will have a corresponding data files connection, which you can list with data-connections.](https://qlik.dev/apis/rest/data-files/)### [Data integration projects Data integration projects are used to group and organize data tasks that move, transform, or prepare data for consumption.](https://qlik.dev/apis/rest/di-projects/)### [Data qualities API for triggering data quality computations and retrieving global results to assess the quality of your datasets.](https://qlik.dev/apis/rest/data-qualities/)### [Data sets Data sets are part of the catalog in Qlik Cloud. A data set is a member of a data asset.](https://qlik.dev/apis/rest/data-sets/)### [Data sources Lists data sources available on the tenant for the creation of data connections.](https://qlik.dev/apis/rest/data-sources/)### [Data stores Data stores are part of the catalog in Qlik Cloud. A data store may contain one or more data stores, which in turn may contain multiple data sets.](https://qlik.dev/apis/rest/data-stores/)### [Direct Access Agents API for remotely managing configuration settings of Direct Access Gateway agents.](https://qlik.dev/apis/rest/direct-access-agents/)### [Email configuration Transports supports configuration of the tenant-level SMTP service. For the SMTP service in Qlik Automate, review the automation-connections API.](https://qlik.dev/apis/rest/transports/)### [Encryption Tenants in Qlik Cloud can be encrypted with a key you provide via a supported KMS. This API allows you to configure and manage encryption keys.](https://qlik.dev/apis/rest/encryption/)### [Entitlement consumption Tracks usage of entitled features in a tenant, used for the consumption metrics in the admin console in a tenant.](https://qlik.dev/apis/rest/consumption/)### [Extensions Visualization extensions is a capability in Qlik Sense which allows third-party visualizations and other presentation objects to be used in the Qlik Sense client.](https://qlik.dev/apis/rest/extensions/)### [Glossaries A glossary is a collection of common and agreed upon (business) terms, typically focused on defining the meaning of data and described in terms that everyone understands.](https://qlik.dev/apis/rest/glossaries/)### [Groups Groups is the resource representing a group in the system, to which space and tenant roles can be assigned to simplify access control management.](https://qlik.dev/apis/rest/groups/)### [Identity providers Identity providers define how your users authenticate to your tenant when attempting to access content.](https://qlik.dev/apis/rest/identity-providers/)### [Items Items provides a list of core resources in the Qlik platform, including resources such as apps, automations, and data sets that a user has access to.](https://qlik.dev/apis/rest/items/)### [Knowledgebases Knowledgebases are collections of individual data sources, that are indexed for use in generating responses to user questions via Assistants for Qlik Answers.](https://qlik.dev/apis/rest/knowledgebases/)### [Licenses Licenses define tenant and user entitlements, and can be used in conjunction with the consumption API to get a picture of entitlement usage.](https://qlik.dev/apis/rest/licenses/)### [Lineage graphs Lineage-graphs represents the lineage information for a specific Qlik item.](https://qlik.dev/apis/rest/lineage-graphs/)### [Login This API is used to initiate interactive logins, or to process JWT login requests.](https://qlik.dev/apis/rest/login/)### [Machine Learning The Machine Learning API allows you to generate profile insights to analyze datasets, create and manage machine learning experiments, deploy models, and run predictions.](https://qlik.dev/apis/rest/ml/)### [Natural language Ask natural languages questions and context aware partial questions against applications enabled for conversational analytics or a specific app to receive Insight Advisor generated responses and suggestions](https://qlik.dev/apis/rest/questions/)### [Notes Notes provide a collaborative experience to support analytics consumption in your tenant. This API enables or disables notes.](https://qlik.dev/apis/rest/notes/)### [Notifications Notifications is the resource representing the various notifications that notification-prep can render](https://qlik.dev/apis/rest/notifications/)### [OAuth Authorize OAuth client flows, and create and revoke OAuth tokens.](https://qlik.dev/apis/rest/oauth/)### [OAuth clients Create and manage the configuration of OAuth clients in your tenant.](https://qlik.dev/apis/rest/oauth-clients/)### [OAuth tokens List and revoke active OAuth tokens issued for your tenant.](https://qlik.dev/apis/rest/oauth-tokens/)### [OAuth well-known configuration Returns OAuth 2.0 metadata related to your tenant. Clients can use this information to programmatically configure their interactions with Qlik Cloud.](https://qlik.dev/apis/rest/.well-known/)### [Pinned links Pinned links are administrator-defined URLs which appear for all users under the More button in the global navigation menu.](https://qlik.dev/apis/rest/ui-config/)### [Quotas Quotas returns entitled attributes based on your license.](https://qlik.dev/apis/rest/quotas/)### [Reload tasks Reloads tasks allow you to schedule reloads of analytics applications in your tenant.](https://qlik.dev/apis/rest/reload-tasks/)### [Reloads Reloads allows for triggering reloads of apps to refresh its data. Traditionally this has only been possible through the JSON-RPC WebSocket API, but can now also be done by using this REST API.](https://qlik.dev/apis/rest/reloads/)### [Report templates Create and manage report templates for consistent report generation and distribution.](https://qlik.dev/apis/rest/report-templates/)### [Reports Reports are downloadable assets generated from data in analytics applications.](https://qlik.dev/apis/rest/reports/)### [Roles Tenant roles are assigned to users or groups in the tenant, and define what permissions they have.](https://qlik.dev/apis/rest/roles/)### [Sharing tasks For scheduled capabilities such as reports, data alerts, subscriptions, and more, sharing tasks defines when these tasks execute, and tie together the resource definition with any conditions on execution.](https://qlik.dev/apis/rest/sharing-tasks/)### [Spaces Spaces are logical containers within your tenant and control access for users and groups through space roles to what content users can access.](https://qlik.dev/apis/rest/spaces/)### [Tasks API for managing tasks and task chains in Qlik Cloud. The requesting user needs the "reload" permission on the target resource to use this set of endpoints. A tenant admin can use GET /v1/tasks and DELETE /v1/tasks/{id} to perform administrative actions, even without the "reload" permission.](https://qlik.dev/apis/rest/tasks/)### [Temporary contents Services such as app and data-files which may import or export larger files can opt to leverage the temporary contents service to handle these requests. Acts as a temporary file store.](https://qlik.dev/apis/rest/temp-contents/)### [Tenant settings Configure tenant-wide settings for security, appearance, and operational preferences.](https://qlik.dev/apis/rest/tenant-settings/)### [Tenants Tenants are the highest level of logical container, with this API supporting configuration of several key tenant settings.](https://qlik.dev/apis/rest/tenants/)### [Themes Themes enable you to customize/style the Qlik Sense client experience.](https://qlik.dev/apis/rest/themes/)### [Users Users represent clients accessing the Qlik Cloud tenant.](https://qlik.dev/apis/rest/users/)### [Web integrations A web integration is a resource representing a list of whitelisted origins that can make requests to a specified tenant. It is the implementation of the CORS mechanism within Qlik Cloud.](https://qlik.dev/apis/rest/web-integrations/)### [Web notifications Web notifications is the resource representing a user's notification](https://qlik.dev/apis/rest/web-notifications/)### [Webhooks Webhooks are a way for Qlik Cloud to provide other applications with real-time information.](https://qlik.dev/apis/rest/webhooks/)

## [](https://qlik.dev/apis/rest/#next-steps) Next steps

*   Follow step-by-step tutorials to manage data files, data connections, tenants, and more: [Manage Qlik Cloud](https://qlik.dev/manage/).
*   Get credentials and choose an auth method: see the [Authentication Guide](https://qlik.dev/authenticate/) and [Authentication: when to use which method](https://qlik.dev/manage/key-concepts/#authentication-when-to-use-which-method).
*   Explore the [API reference documentation](https://qlik.dev/apis/rest/#api-reference-documentation).
*   Learn about [Organization REST APIs](https://qlik.dev/apis/org-rest/) to list tenants across regions and subscriptions.
*   Check the [changelog](https://qlik.dev/changelog/tag/api/) for the latest updates.
*   Join the [Qlik Community](https://community.qlik.com/) for support and discussions.