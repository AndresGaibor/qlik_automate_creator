---
title: "Pagination, sorting, filtering | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/pagination-sorting-filtering/"
local_path: "docs/overview/pagination-sorting-filtering.md"
---

Title: Pagination, sorting, filtering | Qlik Developer Portal


Most APIs accessible in the Qlik platform applies pagination, sorting, and filtering. For example, this means that you need to navigate resources by making multiple requests to retrieve additional entries, but you also have the possibility to both define sort order and filter entries at the same time. Each concept is described in detail in the following sections.

The Qlik platform uses a concept called [cursor-based pagination](https://jsonapi.org/profiles/ethanresnick/cursor-pagination/). This concept revolves around unique values generated for each page in the dataset instead of using plain numeric pages. This ensures consistency when fetching multiple pages in a concurrency system, where plain page numbers might skip or add entities in-between pages if there are changes during the pagination process. Another, perhaps even more important aspect, is that it ensures good performance both for you as an end-user and for the APIs handling the request because there is no need to interact more than necessary with the underlying database.

The cursors are arbitrary unique string values and can’t be calculated client-side, in other words you must use the pagination links sent to you by the API.

An example of such a request and response:

`> GET /api/v1/items?limit=3 HTTP/1.1> host: your-tenant.eu.qlikcloud.com> authorization: bearer xyz> accept: application/json`

This requests the first page of `items`, with a limit of three items per page.

The response looks something like this:

`< HTTP/1.1 200< content-type: application/json< content-length: 123{  "data": ["list", "of", "items"],  "links": {    "prev": { "href": null },    "next": { "href": "https://example.org/api/v1/items?page=<next-cursor>" },  }}`

To fetch the next page, use the `links.next` value in your request.

Note on qlik-cli pagination

Unlike direct API calls where pagination must be handled manually using `links.next`, `qlik-cli` automatically paginates in the background when fetching resources if needed. For more information, see [How pagination works in qlik-cli](https://qlik.dev/toolkits/qlik-cli/qlik-cli-pagination/).

## [](https://qlik.dev/apis/rest/pagination-sorting-filtering/#sorting) Sorting

When fetching lists of resources it often makes sense to sort on fields of interest to you. While each resource may vary in terms of which fields can be sorted, the following guidelines should help you understand the concept. To see which sort options you have for a specific resource, consult the [API reference page](https://qlik.dev/apis/).

Sorting is defined in query parameters, specifically the `?sort=` query parameter. Each sort criteria may use `+` and `-` signs as a prefix to apply ascending or descending order. You may also supply multiple criteria by comma-separating the fields. Here’s an example that sort `title` by ascending order, and `description` by descending order:

`> GET /api/v1/items?sort=+title,-description HTTP/1.1> host: your-tenant.eu.qlikcloud.com> authorization: bearer xyz> accept: application/json`

## [](https://qlik.dev/apis/rest/pagination-sorting-filtering/#filtering) Filtering

Filtering is a concept that allows you to narrow down the results of your API queries. If the dataset that’s returned by an API call is relatively small, filtering may not even be required. But if the dataset is large, say several hundred resource entities or more, filtering helps to reduce the size of the dataset, returning only the data that’s of most interest to you.

Filtering can be implemented in different ways. One way, which is currently used by most Qlik APIs, is to use a key and value pair as a query parameter in the endpoint path. However, this only works for exact matches.

Here’s an example that filters audit events from the archive for a given date:

`> GET /api/v1/audits/archive?date=2020-11-16> host: your-tenant.eu.qlikcloud.com> authorization: bearer xyz> accept: application/json`

Another way to filter resources is to use the `?filter=` query parameter in the endpoint path.

Here’s an example:

`> GET /api/v1/foos?filter=name eq 'abc'`

The response looks something like this:

`> HTTP/1.1 200> content-type: application/json[  {    "id": "1234",    "name": "abc"  }]`

The `filter` query parameter offers a flexible way to specify filter criteria with the ability to add attributes and logical operators to the query. Refer to [filtering](https://tools.ietf.org/html/rfc7644#section-3.4.2.2) for a detailed description of the `filter` query parameter.

To see which operations and fields are supported for a specific API call, review the description of the `filter` query parameter for that API.

As Qlik APIs evolve, you can expect the `filter` query parameter to gain widespread use and become the preferred method of filtering resources.