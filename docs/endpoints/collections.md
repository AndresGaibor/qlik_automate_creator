---
title: "Collections REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/collections/"
local_path: "docs/endpoints/collections.md"
---

Title: Collections REST | Qlik Developer Portal


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
Collections

Collections provide the framework to catalog various content a user has access to using tags, public and private collections, and favorites.

Download OpenAPI spec
Endpoints
GET
/api/v1/collections
POST
/api/v1/collections
GET
/api/v1/collections/{collectionId}
PATCH
/api/v1/collections/{collectionId}
PUT
/api/v1/collections/{collectionId}
DELETE
/api/v1/collections/{collectionId}
GET
/api/v1/collections/{collectionId}/items
POST
/api/v1/collections/{collectionId}/items
GET
/api/v1/collections/{collectionId}/items/{itemId}
DELETE
/api/v1/collections/{collectionId}/items/{itemId}
GET
/api/v1/collections/favorites
List collections

Retrieves the collections that the user has access to. This endpoint does not return the user's favorites collection, which can be retrieved with /v1/collections/favorites.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
creatorId
string

The case-sensitive string used to search for a resource by creatorId.

id
string

The collection's unique identifier.

includeItems
string

Includes the list of items belonging to the collections. Supported parameters are 'limit', 'sort' and 'resourceType'. Supported formats are json formatted string or deep object style using square brackets.

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

The case-sensitive string used to filter for a collection by type. Retrieve private collections with private, public collections with publicgoverned, and tags with public.

Can be one of: "private""public""publicgoverned"

types
array of strings

A comma-separated case-sensitive string used to filter by multiple types.

Values may be any of: "private""public""publicgoverned"

Responses
200

OK response.

application/json
object

ListCollectionsResponseBody result type

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
/api/v1/collections
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


await qlik.collections.getCollections({})
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
Create a new collection.

Creates and returns a new collection. Collections of type public (shown as tags in the user interface) must have unique names. Other collection types can reuse names.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Request Body
Required
application/json
object
Show application/json properties
Responses
201

Created response.

application/json
object

A collection.

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
POST
/api/v1/collections
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


await qlik.collections.createCollection({
  description: 'string',
  name: 'string',
  type: 'private',
})
Example Response
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
Get a collection

Finds and returns a collection.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
collectionId
string
Required

The collection's unique identifier.

Responses
200

OK response.

application/json
object

A collection.

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
/api/v1/collections/{collectionId}
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


await qlik.collections.getCollection('string')
Example Response
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
Update collection

Updates the name, description, or type fields provided in the patch body. Can be used to publish a private collection as a publicgoverned collection by patching /type with publicgoverned once the collection contains at least 1 item. Can also be used to return a publicgoverned collection to private. Cannot be used to change between public (tag) and private / publicgoverned (collection).

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
collectionId
string
Required

The collection's unique identifier.

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

A collection.

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
PATCH
/api/v1/collections/{collectionId}
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


await qlik.collections.patchCollection('string', [
  {
    op: 'replace',
    path: '/name',
    value: 'string',
  },
])
Example Response
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
Update a collection's name and description

Updates a collection's name and description and returns the updated collection. Omitted and unsupported fields are ignored. To unset a field, provide the field's zero value.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
collectionId
string
Required

The collection's unique identifier.

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

A collection.

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
/api/v1/collections/{collectionId}
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


await qlik.collections.updateCollection(
  'string',
  { description: 'string', name: 'string' },
)
Example Response
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
Delete a collection

Deletes a collection and removes all items from the collection.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
collectionId
string
Required

The collection's unique identifier.

Responses
204

No Content response.

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
DELETE
/api/v1/collections/{collectionId}
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


await qlik.collections.deleteCollection('string')
List items in a collection

Retrieves items from a collection that the user has access to.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Query Parameters
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

prev
string

The cursor to the previous page of resources. Provide either the next or prev cursor, but not both.

query
string

The case-insensitive string used to search for a resource by name or description.

resourceId
string

The case-sensitive string used to search for an item by resourceId. If resourceId is provided, then resourceType must be provided. Provide either the resourceId or resourceLink, but not both.

resourceLink
string

The case-sensitive string used to search for an item by resourceLink. If resourceLink is provided, then resourceType must be provided. Provide either the resourceId or resourceLink, but not both.

format = "uri"

resourceType
string

The case-sensitive string used to search for an item by resourceType.

Can be one of: "app""qlikview""qvapp""genericlink""sharingservicetask""note""dataasset""dataset""automation""automl-experiment""automl-deployment""assistant""dataproduct""dataqualityrule""glossary""knowledgebase""script""semantictype""page"

sort
string

The property of a resource to sort on (default sort is +createdAt). The supported properties are createdAt, updatedAt, and name. A property must be prefixed by + or - to indicate ascending or descending sort order respectively.

Can be one of: "+createdAt""-createdAt""+name""-name""+updatedAt""-updatedAt"

spaceId
string

The space's unique identifier (supports 'personal' as spaceId).

shared
boolean
Deprecated

Whether or not to return items in a shared space.

noActions
boolean

If set to true, the user's available actions for each item will not be evaluated meaning the actions-array will be omitted from the response (reduces response time).

default = false

Path Parameters
collectionId
string
Required

The collection's unique identifier. (This query also supports 'favorites' as the collectionID).

Responses
200

OK response.

application/json
object

ListCollectionItemsResponseBody result type

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
/api/v1/collections/{collectionId}/items
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


await qlik.collections.getCollectionItems(
  'string',
  {},
)
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
  ]
}
Add an item to a collection

Adds an item to a collection and returns the item.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
collectionId
string
Required

The collection's unique identifier.

Request Body
Required
application/json
object
Show application/json properties
Responses
201

Created response.

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
POST
/api/v1/collections/{collectionId}/items
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


await qlik.collections.addCollectionItem(
  'string',
  { id: 'string' },
)
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
Get an item

Finds and returns an item in a specific collection. See GET /items/{id}.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Path Parameters
collectionId
string
Required

The collection's unique identifier.

itemId
string
Required

The item's unique identifier.

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
/api/v1/collections/{collectionId}/items/{itemId}
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


await qlik.collections.getCollectionItem(
  'string',
  'string',
)
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
Remove an item

Removes an item from a collection.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Path Parameters
collectionId
string
Required

The collection's unique identifier.

itemId
string
Required

The item's unique identifier.

Responses
204

No Content response.

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
DELETE
/api/v1/collections/{collectionId}/items/{itemId}
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


await qlik.collections.deleteCollectionItem(
  'string',
  'string',
)
Get user's favorites collection

Lists the user's favorites collection.

Facts
	Rate limit	Tier 1 (1000 requests per minute)
Responses
302

Found response.

application/json
object
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
/api/v1/collections/favorites
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


await qlik.collections.getFavoritesCollection()
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
We use cookies to improve your experience with our websites and to deliver content tailored to your interests. By clicking ‘Ok’, you accept the use of additional cookies which may involve data transmission to third parties. Refer to our Privacy & Cookie Notice or click ‘More Information’ for details on cookie usage on our sites.Privacy & Cookie Notice
Ok
More Information