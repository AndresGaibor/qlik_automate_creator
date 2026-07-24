---
title: "Items REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/items/"
local_path: "docs/endpoints/items.md"
---

Title: Items REST | Qlik Developer Portal


Skip to content
Authenticate
Embed
Extend
Manage
APIs
Toolkits
Changelog
Light
Dark
System
Home
/
APIs
/
REST
Copy page
Items

Items provides a list of core resources in the Qlik platform, including resources such as apps, automations, and data sets that a user has access to.

Download OpenAPI spec
Endpoints
GET
/api/v1/items
GET
/api/v1/items/{itemId}
PUT
/api/v1/items/{itemId}
DELETE
/api/v1/items/{itemId}
GET
/api/v1/items/{itemId}/collections
GET
/api/v1/items/{itemId}/publisheditems
GET
/api/v1/items/settings
PATCH
/api/v1/items/settings
List items

Lists items that the user has access to.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
collectionId
string

The collection's unique identifier. Used to filter for items with a specific tag (collection type public), or collection.

createdByUserId
string

User's unique identifier.

id
string

The item's unique identifier.

limit
integer

The maximum number of resources to return for a request. The limit must be an integer between 1 and 100 (inclusive).

minimum = 1, maximum = 100, default = 10, default = 10

name
string

The case-insensitive string used to search for a resource by name.

next
string

The cursor to the next page of resources. Provide either the next or prev cursor, but not both.

notCreatedByUserId
string

User's unique identifier.

notOwnerId
string

Owner identifier.

ownerId
string

Owner identifier.

prev
string

The cursor to the previous page of resources. Provide either the next or prev cursor, but not both.

query
string

The case-insensitive string used to search for a resource by name or description.

resourceId
string

The case-sensitive string used to search for an item by resourceId. If resourceId is provided, then resourceType must be provided. Provide either the resourceId or resourceLink, but not both.

resourceIds
string

The case-sensitive strings used to search for an item by resourceIds. The maximum number of resourceIds it supports is 100. If resourceIds is provided, then resourceType must be provided. For example '?resourceIds=appId1,appId2'

resourceLink
string

The case-sensitive string used to search for an item by resourceLink. If resourceLink is provided, then resourceType must be provided. Provide either the resourceId or resourceLink, but not both.

format = "uri"

resourceSubType
string

the case-sensitive string used to filter items by resourceSubType(s). For example '?resourceSubType=chart-monitoring,qix-df,qvd'. Will return a 400 error if used in conjuction with the square bracket syntax for resourceSubType filtering in the 'resourceType' query parameter.

resourceType
string

The case-sensitive string used to filter items by resourceType(s). For example '?resourceType=app,qvapp'. Additionally, a optional resourceSubType filter can be added to each resourceType. For example '?resourceType=app[qvd,chart-monitoring],qvapp'. An trailing comma can be used to include the empty resourceSubType, e.g. '?resourceType=app[qvd,chart-monitoring,]', or, to include only empty resourceSubTypes, '?resourceType=app[]' This syntax replaces the 'resourceSubType' query param, and using both in the same query will result in a 400 error.

Can be one of: "app""qlikview""qvapp""genericlink""sharingservicetask""note""dataasset""dataset""automation""automl-experiment""automl-deployment""assistant""dataproduct""dataqualityrule""glossary""knowledgebase""script""semantictype""page"

sort
string

The property of a resource to sort on (default sort is +createdAt). The supported properties are createdAt, updatedAt, recentlyUsed and name. A property must be prefixed by + or - to indicate ascending or descending sort order respectively.

Can be one of: "+createdAt""-createdAt""+name""-name""+updatedAt""-updatedAt""+recentlyUsed""-recentlyUsed"

spaceId
string

The space's unique identifier (supports 'personal' as spaceId).

spaceType
string

The case-sensitive string used to filter items on space type(s). For example '?spaceType=shared,personal'.

Can be one of: "shared""managed""personal""data"

shared
boolean
Deprecated

Whether or not to return items in a shared space.

noActions
boolean

If set to true, the user's available actions for each item will not be evaluated meaning the actions-array will be omitted from the response (reduces response time).

default = false

Responses
200

OK response.

application/json
object

ListItemsResponseBody result type

Show application/json properties
400

Bad Request response.

application/json
object
Show application/json properties
401

Unauthorized response.

application/json
object
Show application/json properties
404

Not Found response.

application/json
object
Show application/json properties
500

Internal Server Error response.

application/json
object
Show application/json properties
GET
/api/v1/items
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.items.getItems({})
Example Response
{
  "data": [
    {
      "id": "string",
      "meta": {
        "tags": [
          {
            "id": "string",
            "name": "string"
          }
        ],
        "actions": [
          "string"
        ],
        "collections": [
          {
            "id": "string",
            "name": "string"
          }
        ],
        "isFavorited": true
      },
      "name": "string",
      "links": {
        "open": {
          "href": "string"
        },
        "self": {
          "href": "string"
        },
        "qvPlugin": {
          "href": "string"
        },
        "thumbnail": {
          "href": "string"
        },
        "collections": {
          "href": "string"
        }
      },
      "actions": [
        "string"
      ],
      "ownerId": "string",
      "spaceId": "string",
      "tenantId": "string",
      "createdAt": "2018-10-30T07:06:22Z",
      "creatorId": "string",
      "itemViews": {
        "week": [
          {
            "start": "2018-10-30T07:06:22Z",
            "total": 42,
            "unique": 42
          }
        ],
        "total": 42,
        "trend": -4.2,
        "unique": 42,
        "usedBy": 42
      },
      "updatedAt": "2018-10-30T07:06:22Z",
      "updaterId": "string",
      "resourceId": "string",
      "description": "string",
      "isFavorited": true,
      "thumbnailId": "string",
      "resourceLink": "string",
      "resourceSize": {
        "appFile": 42,
        "appMemory": 42
      },
      "resourceType": "app",
      "collectionIds": [
        "string"
      ],
      "resourceSubType": "string",
      "resourceCreatedAt": "2018-10-30T07:06:22Z",
      "resourceUpdatedAt": "2018-10-30T07:06:22Z",
      "resourceAttributes": {},
      "resourceReloadStatus": "string",
      "resourceReloadEndTime": "2018-10-30T07:06:22Z",
      "resourceCustomAttributes": {}
    }
  ],
  "links": {
    "next": {
      "href": "string"
    },
    "prev": {
      "href": "string"
    },
    "self": {
      "href": "string"
    },
    "collection": {
      "href": "string"
    }
  }
}
Get an item

Finds and returns an item.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
itemId
string
Required

The item's unique identifier

Responses
200

OK response.

application/json
object

An item.

Show application/json properties
400

Bad Request response.

application/json
object
Show application/json properties
401

Unauthorized response.

application/json
object
Show application/json properties
404

Not Found response.

application/json
object
Show application/json properties
500

Internal Server Error response.

application/json
object
Show application/json properties
GET
/api/v1/items/{itemId}
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.items.getItem('string')
Example Response
{
  "id": "string",
  "meta": {
    "tags": [
      {
        "id": "string",
        "name": "string"
      }
    ],
    "actions": [
      "string"
    ],
    "collections": [
      {
        "id": "string",
        "name": "string"
      }
    ],
    "isFavorited": true
  },
  "name": "string",
  "links": {
    "open": {
      "href": "string"
    },
    "self": {
      "href": "string"
    },
    "qvPlugin": {
      "href": "string"
    },
    "thumbnail": {
      "href": "string"
    },
    "collections": {
      "href": "string"
    }
  },
  "actions": [
    "string"
  ],
  "ownerId": "string",
  "spaceId": "string",
  "tenantId": "string",
  "createdAt": "2018-10-30T07:06:22Z",
  "creatorId": "string",
  "itemViews": {
    "week": [
      {
        "start": "2018-10-30T07:06:22Z",
        "total": 42,
        "unique": 42
      }
    ],
    "total": 42,
    "trend": -4.2,
    "unique": 42,
    "usedBy": 42
  },
  "updatedAt": "2018-10-30T07:06:22Z",
  "updaterId": "string",
  "resourceId": "string",
  "description": "string",
  "isFavorited": true,
  "thumbnailId": "string",
  "resourceLink": "string",
  "resourceSize": {
    "appFile": 42,
    "appMemory": 42
  },
  "resourceType": "app",
  "collectionIds": [
    "string"
  ],
  "resourceSubType": "string",
  "resourceCreatedAt": "2018-10-30T07:06:22Z",
  "resourceUpdatedAt": "2018-10-30T07:06:22Z",
  "resourceAttributes": {},
  "resourceReloadStatus": "string",
  "resourceReloadEndTime": "2018-10-30T07:06:22Z",
  "resourceCustomAttributes": {}
}
Update an item

Updates an item. Omitted and unsupported fields are ignored. To unset a field, provide the field's zero value.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
itemId
string
Required

The item's unique identifier.

Request Body
Required
application/json
object
Show application/json properties
Responses
200

OK response.

application/json
object

An item.

Show application/json properties
400

Bad Request response.

application/json
object
Show application/json properties
401

Unauthorized response.

application/json
object
Show application/json properties
403

Forbidden response.

application/json
object
Show application/json properties
404

Not Found response.

application/json
object
Show application/json properties
409

Conflict response.

application/json
object
Show application/json properties
500

Internal Server Error response.

application/json
object
Show application/json properties
PUT
/api/v1/items/{itemId}
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.items.updateItem('string', {
  description: 'string',
  name: 'string',
  resourceAttributes: {},
  resourceCustomAttributes: {},
  resourceId: 'string',
  resourceLink: 'string',
  resourceSubType: 'string',
  resourceType: 'app',
  resourceUpdatedAt: '2018-10-30T07:06:22Z',
  spaceId: 'string',
  thumbnailId: 'string',
})
Example Response
{
  "id": "string",
  "meta": {
    "tags": [
      {
        "id": "string",
        "name": "string"
      }
    ],
    "actions": [
      "string"
    ],
    "collections": [
      {
        "id": "string",
        "name": "string"
      }
    ],
    "isFavorited": true
  },
  "name": "string",
  "links": {
    "open": {
      "href": "string"
    },
    "self": {
      "href": "string"
    },
    "qvPlugin": {
      "href": "string"
    },
    "thumbnail": {
      "href": "string"
    },
    "collections": {
      "href": "string"
    }
  },
  "actions": [
    "string"
  ],
  "ownerId": "string",
  "spaceId": "string",
  "tenantId": "string",
  "createdAt": "2018-10-30T07:06:22Z",
  "creatorId": "string",
  "itemViews": {
    "week": [
      {
        "start": "2018-10-30T07:06:22Z",
        "total": 42,
        "unique": 42
      }
    ],
    "total": 42,
    "trend": -4.2,
    "unique": 42,
    "usedBy": 42
  },
  "updatedAt": "2018-10-30T07:06:22Z",
  "updaterId": "string",
  "resourceId": "string",
  "description": "string",
  "isFavorited": true,
  "thumbnailId": "string",
  "resourceLink": "string",
  "resourceSize": {
    "appFile": 42,
    "appMemory": 42
  },
  "resourceType": "app",
  "collectionIds": [
    "string"
  ],
  "resourceSubType": "string",
  "resourceCreatedAt": "2018-10-30T07:06:22Z",
  "resourceUpdatedAt": "2018-10-30T07:06:22Z",
  "resourceAttributes": {},
  "resourceReloadStatus": "string",
  "resourceReloadEndTime": "2018-10-30T07:06:22Z",
  "resourceCustomAttributes": {}
}
Delete an item

Deletes an item and removes the item from all collections.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
itemId
string
Required

The item's unique identifier.

Responses
204

No Content response.

401

Unauthorized response.

application/json
object
Show application/json properties
403

Forbidden response.

application/json
object
Show application/json properties
404

Not Found response.

application/json
object
Show application/json properties
500

Internal Server Error response.

application/json
object
Show application/json properties
DELETE
/api/v1/items/{itemId}
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.items.deleteItem('string')
List collections of an item

Finds and returns the collections (and tags) of an item. This endpoint does not return the user's favorites collection.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
limit
integer

The maximum number of resources to return for a request. The limit must be an integer between 1 and 100 (inclusive).

minimum = 1, maximum = 100, default = 10, default = 10

name
string

The case-sensitive string used to search for a collection by name.

next
string

The cursor to the next page of resources. Provide either the next or prev cursor, but not both.

prev
string

The cursor to the previous page of resources. Provide either the next or prev cursor, but not both.

query
string

The case-insensitive string used to search for a resource by name or description.

sort
string

The property of a resource to sort on (default sort is +createdAt). The supported properties are createdAt, updatedAt, and name. A property must be prefixed by + or - to indicate ascending or descending sort order respectively.

Can be one of: "+createdAt""-createdAt""+name""-name""+updatedAt""-updatedAt"

type
string

The case-sensitive string used to search for a collection by type.

Can be one of: "private""public""publicgoverned"

Path Parameters
itemId
string
Required

The item's unique identifier.

Responses
200

OK response.

application/json
object

ListItemCollectionsResponseBody result type

Show application/json properties
400

Bad Request response.

application/json
object
Show application/json properties
401

Unauthorized response.

application/json
object
Show application/json properties
404

Not found response

application/json
object
Show application/json properties
500

Internal Server Error response.

application/json
object
Show application/json properties
GET
/api/v1/items/{itemId}/collections
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.items.getItemCollections('string', {})
Example Response
{
  "data": [
    {
      "id": "string",
      "full": true,
      "meta": {
        "items": {
          "data": [
            {
              "id": "string",
              "meta": {
                "tags": [
                  {
                    "id": "string",
                    "name": "string"
                  }
                ],
                "actions": [
                  "string"
                ],
                "collections": [
                  {
                    "id": "string",
                    "name": "string"
                  }
                ],
                "isFavorited": true
              },
              "name": "string",
              "links": {
                "open": {
                  "href": "string"
                },
                "self": {
                  "href": "string"
                },
                "qvPlugin": {
                  "href": "string"
                },
                "thumbnail": {
                  "href": "string"
                },
                "collections": {
                  "href": "string"
                }
              },
              "actions": [
                "string"
              ],
              "ownerId": "string",
              "spaceId": "string",
              "tenantId": "string",
              "createdAt": "2018-10-30T07:06:22Z",
              "creatorId": "string",
              "itemViews": {
                "week": [
                  {
                    "start": "2018-10-30T07:06:22Z",
                    "total": 42,
                    "unique": 42
                  }
                ],
                "total": 42,
                "trend": -4.2,
                "unique": 42,
                "usedBy": 42
              },
              "updatedAt": "2018-10-30T07:06:22Z",
              "updaterId": "string",
              "resourceId": "string",
              "description": "string",
              "isFavorited": true,
              "thumbnailId": "string",
              "resourceLink": "string",
              "resourceSize": {
                "appFile": 42,
                "appMemory": 42
              },
              "resourceType": "app",
              "collectionIds": [
                "string"
              ],
              "resourceSubType": "string",
              "resourceCreatedAt": "2018-10-30T07:06:22Z",
              "resourceUpdatedAt": "2018-10-30T07:06:22Z",
              "resourceAttributes": {},
              "resourceReloadStatus": "string",
              "resourceReloadEndTime": "2018-10-30T07:06:22Z",
              "resourceCustomAttributes": {}
            }
          ],
          "links": {
            "next": {
              "href": "string"
            },
            "prev": {
              "href": "string"
            },
            "self": {
              "href": "string"
            },
            "collection": {
              "href": "string"
            }
          }
        }
      },
      "name": "string",
      "type": "private",
      "links": {
        "self": {
          "href": "string"
        },
        "items": {
          "href": "string"
        }
      },
      "tenantId": "string",
      "createdAt": "2018-10-30T07:06:22Z",
      "creatorId": "string",
      "itemCount": 42,
      "updatedAt": "2018-10-30T07:06:22Z",
      "updaterId": "string",
      "description": "string"
    }
  ],
  "links": {
    "item": {
      "href": "string"
    },
    "next": {
      "href": "string"
    },
    "prev": {
      "href": "string"
    },
    "self": {
      "href": "string"
    }
  }
}
List published items

Finds and returns the published items for a given item. This endpoint is particularly useful for finding the published copies of an app or a qvapp when you want to replace the content of a published copy with new information from the source item.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
limit
integer

The maximum number of resources to return for a request. The limit must be an integer between 1 and 100 (inclusive).

minimum = 1, maximum = 100, default = 10, default = 10

next
string

The cursor to the next page of resources. Provide either the next or prev cursor, but not both.

prev
string

The cursor to the previous page of resources. Provide either the next or prev cursor, but not both.

resourceType
string

The case-sensitive string used to search for an item by resourceType.

Can be one of: "app""qlikview""qvapp""genericlink""sharingservicetask""note""dataasset""dataset""automation""automl-experiment""automl-deployment""assistant""dataproduct""dataqualityrule""glossary""knowledgebase""script""semantictype""page"

sort
string

The property of a resource to sort on (default sort is +createdAt). The supported properties are createdAt, updatedAt, and name. A property must be prefixed by + or - to indicate ascending or descending sort order respectively.

Can be one of: "+createdAt""-createdAt""+name""-name""+updatedAt""-updatedAt"

Path Parameters
itemId
string
Required

The item's unique identifier

Responses
200

OK response.

application/json
object

ListItemCollectionsResponseBody result type

Show application/json properties
400

Bad Request response.

application/json
object
Show application/json properties
401

Unauthorized response.

application/json
object
Show application/json properties
404

Not Found response.

application/json
object
Show application/json properties
500

Internal Server Error response.

application/json
object
Show application/json properties
GET
/api/v1/items/{itemId}/publisheditems
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.items.getPublishedItems('string', {})
Example Response
{
  "data": [
    {
      "id": "string",
      "full": true,
      "meta": {
        "items": {
          "data": [
            {
              "id": "string",
              "meta": {
                "tags": [
                  {
                    "id": "string",
                    "name": "string"
                  }
                ],
                "actions": [
                  "string"
                ],
                "collections": [
                  {
                    "id": "string",
                    "name": "string"
                  }
                ],
                "isFavorited": true
              },
              "name": "string",
              "links": {
                "open": {
                  "href": "string"
                },
                "self": {
                  "href": "string"
                },
                "qvPlugin": {
                  "href": "string"
                },
                "thumbnail": {
                  "href": "string"
                },
                "collections": {
                  "href": "string"
                }
              },
              "actions": [
                "string"
              ],
              "ownerId": "string",
              "spaceId": "string",
              "tenantId": "string",
              "createdAt": "2018-10-30T07:06:22Z",
              "creatorId": "string",
              "itemViews": {
                "week": [
                  {
                    "start": "2018-10-30T07:06:22Z",
                    "total": 42,
                    "unique": 42
                  }
                ],
                "total": 42,
                "trend": -4.2,
                "unique": 42,
                "usedBy": 42
              },
              "updatedAt": "2018-10-30T07:06:22Z",
              "updaterId": "string",
              "resourceId": "string",
              "description": "string",
              "isFavorited": true,
              "thumbnailId": "string",
              "resourceLink": "string",
              "resourceSize": {
                "appFile": 42,
                "appMemory": 42
              },
              "resourceType": "app",
              "collectionIds": [
                "string"
              ],
              "resourceSubType": "string",
              "resourceCreatedAt": "2018-10-30T07:06:22Z",
              "resourceUpdatedAt": "2018-10-30T07:06:22Z",
              "resourceAttributes": {},
              "resourceReloadStatus": "string",
              "resourceReloadEndTime": "2018-10-30T07:06:22Z",
              "resourceCustomAttributes": {}
            }
          ],
          "links": {
            "next": {
              "href": "string"
            },
            "prev": {
              "href": "string"
            },
            "self": {
              "href": "string"
            },
            "collection": {
              "href": "string"
            }
          }
        }
      },
      "name": "string",
      "type": "private",
      "links": {
        "self": {
          "href": "string"
        },
        "items": {
          "href": "string"
        }
      },
      "tenantId": "string",
      "createdAt": "2018-10-30T07:06:22Z",
      "creatorId": "string",
      "itemCount": 42,
      "updatedAt": "2018-10-30T07:06:22Z",
      "updaterId": "string",
      "description": "string"
    }
  ],
  "links": {
    "item": {
      "href": "string"
    },
    "next": {
      "href": "string"
    },
    "prev": {
      "href": "string"
    },
    "self": {
      "href": "string"
    }
  }
}
Get items settings

Finds and returns the items service settings for the current tenant. Currently used to enable or disable usage metrics in the tenant.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Responses
200

OK response.

application/json
object
Show application/json properties
400

Bad Request response.

application/json
object
Show application/json properties
401

Unauthorized response.

application/json
object
Show application/json properties
500

Internal Server Error response.

application/json
object
Show application/json properties
GET
/api/v1/items/settings
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.items.getItemsSettings()
Example Response
{
  "usageMetricsEnabled": true
}
Update items settings

Updates the settings provided in the patch body. Currently used to enable or disable usage metrics in the tenant.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
Required
application/json
array of objects

A JSONPatch document as defined by RFC 6902.

Show application/json properties
Responses
200

OK response.

application/json
object
Show application/json properties
400

Bad Request response.

application/json
object
Show application/json properties
401

Unauthorized response.

application/json
object
Show application/json properties
403

Forbidden response.

application/json
object
Show application/json properties
500

Internal Server Error response.

application/json
object
Show application/json properties
PATCH
/api/v1/items/settings
JavaScript
Qlik CLI
cURL
import { createQlikApi } from '@qlik/api'


const qlik = createQlikApi({
  hostConfig: {
    host: 'https://{tenant}.{region}.qlikcloud.com',
    apiKey: '<access-token>',
  },
})


await qlik.items.patchItemsSettings([
  {
    op: 'replace',
    path: '/usageMetricsEnabled',
    value: true,
  },
])
Example Response
{
  "usageMetricsEnabled": true
}
Was this page helpful?
yesno
Qlik Community
Legal Agreements
/
Legal Policies
/
Privacy & Cookie Notice
/
Terms of Use
/
Do Not Share My Info
Copyright © 1993-2026 QlikTech International AB. All rights reserved.