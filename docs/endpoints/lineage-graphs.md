---
title: "Lineage graphs REST | Qlik Developer Portal"
source_url: "https://qlik.dev/apis/rest/lineage-graphs/"
local_path: "docs/endpoints/lineage-graphs.md"
---

Title: Lineage graphs REST | Qlik Developer Portal


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
Lineage graphs

Lineage-graphs represents the lineage information for a specific Qlik item.

Download OpenAPI spec
Endpoints
GET
/api/v1/lineage-graphs/impact/{id}/actions/expand
GET
/api/v1/lineage-graphs/impact/{id}/actions/search
GET
/api/v1/lineage-graphs/impact/{id}/overview
GET
/api/v1/lineage-graphs/impact/{id}/source
GET
/api/v1/lineage-graphs/nodes/{id}
GET
/api/v1/lineage-graphs/nodes/{id}/actions/expand
GET
/api/v1/lineage-graphs/nodes/{id}/actions/search
POST
/api/v1/lineage-graphs/nodes/{id}/overview
Get next-level nodes

Returns next-level nodes inside a specified node on an impact analysis graph retrieved using a base node.

Facts
	Rate limit	Special (20 requests per minute)
Query Parameters
level
string
Required

The level to get the nodes on.

Can be one of: "field""table"

default = "table"

node
string
Required

The node in the downstream graph to get next-level nodes for. For instance, to get the TABLE level nodes inside a RESOURCE level node, use the RESOURCE level QRI for the node. Similarly, use the TABLE level QRI to get the FIELD level nodes. If a TABLE level QRI is used with level parameter being TABLE, only the RESOURCE level of the node will be taken into consideration.

down
integer

The number of downstream resource levels nodes to retrieve. (5 if not provided, -1 means unlimited and 1 means direct lineage)

default = 5, default = 5

Path Parameters
id
string
Required

The QRI for base node.

Responses
200

Successful Operation.

application/json
object
Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
403

User does not have access to the node.

application/json
object
Show application/json properties
404

The record is not found.

application/json
object
Show application/json properties
429

Too many requests

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
503

Service unavailable

application/json
object
Show application/json properties
GET
/api/v1/lineage-graphs/impact/{id}/actions/expand
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


await qlik.lineageGraphs.expandLineageGraphImpact(
  'qri:app:sense://e5c651d5-1198-45a2-be5d-f016cee0baf5',
  { level: 'field', node: 'string' },
)
Example Response
{
  "graph": {
    "type": "RESOURCE",
    "edges": [
      {
        "id": "1",
        "source": "qri:app:sense://e5c651d5-1198-45a2-be5d-f016cee0baf5",
        "target": "qri:app:sense://e5c651d5-1198-45a2-be5d-f016cee0baf5",
        "metadata": {
          "type": "string"
        },
        "relation": [
          "LOAD",
          "STORE",
          "READ",
          "FROM"
        ]
      }
    ],
    "label": "Sales Data",
    "nodes": "{\"qri:app:sense://3634fc0d-273d-429e-8d0b-1b4b1b66a1f2\":{\"label\":\"a\",\"metadata\":{\"id\":\"qri:app:sense://3634fc0d-273d-429e-8d0b-1b4b1b66a1f2\",\"subtype\":\"PROCESSOR\",\"type\":\"DA_APP\",\"filePath\":\"example.qvd\"}}}",
    "directed": true,
    "metadata": {
      "total": 1,
      "createdAt": "2023-10-05T14:48:00.000Z",
      "producerId": "qri:db:oracle://LfxVj_3du3GYdWdNaa721lOWvbhENXEArBpl58h96YE#ZfH0lkXnTTGu7QGnIvKZpIxFNagQivBtnbC_cAoCPOs",
      "specVersion": 1,
      "producerType": [
        "QDA",
        "EXTERNAL"
      ]
    }
  }
}
Search all labels

Searchs all labels within a impact graph on all available levels. Returns result per level.

Facts
	Rate limit	Special (20 requests per minute)
Query Parameters
filter
string
Required

The expression that matches the SCIM filter format. The filter has to be encoded. The currently supported attribute is "label", attribute operator "co" (contains), and grouping operator "or". Example: 'label co "label1" or label co "label2"'. The search queries are case insensetive.

down
integer

The number of downstream resource levels nodes to search. (5 if not provided, -1 means unlimited) and 1 means direct lineage.

default = 5, default = 5

Path Parameters
id
string
Required

The qri for root node.

Responses
200

Successful Operation.

application/json
object
Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
403

User does not have access to the node.

application/json
object
Show application/json properties
404

The record is not found.

application/json
object
Show application/json properties
429

Too many requests

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
503

Service unavailable

application/json
object
Show application/json properties
GET
/api/v1/lineage-graphs/impact/{id}/actions/search
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


await qlik.lineageGraphs.searchLineageGraphImpact(
  'qri:app:sense://e5c651d5-1198-45a2-be5d-f016cee0baf5',
  {
    filter:
      'label co "label1" or label co "label2"',
  },
)
Example Response
{
  "graphs": {
    "graphs": [
      {
        "type": "RESOURCE",
        "edges": [
          {
            "id": "1",
            "source": "qri:app:sense://e5c651d5-1198-45a2-be5d-f016cee0baf5",
            "target": "qri:app:sense://e5c651d5-1198-45a2-be5d-f016cee0baf5",
            "metadata": {
              "type": "string"
            },
            "relation": [
              "LOAD",
              "STORE",
              "READ",
              "FROM"
            ]
          }
        ],
        "label": "Sales Data",
        "nodes": "{\"qri:app:sense://3634fc0d-273d-429e-8d0b-1b4b1b66a1f2\":{\"label\":\"a\",\"metadata\":{\"id\":\"qri:app:sense://3634fc0d-273d-429e-8d0b-1b4b1b66a1f2\",\"subtype\":\"PROCESSOR\",\"type\":\"DA_APP\",\"filePath\":\"example.qvd\"}}}",
        "directed": true,
        "metadata": {
          "total": 1,
          "createdAt": "2023-10-05T14:48:00.000Z",
          "producerId": "qri:db:oracle://LfxVj_3du3GYdWdNaa721lOWvbhENXEArBpl58h96YE#ZfH0lkXnTTGu7QGnIvKZpIxFNagQivBtnbC_cAoCPOs",
          "specVersion": 1,
          "producerType": [
            "QDA",
            "EXTERNAL"
          ]
        }
      }
    ]
  }
}
Get all RESOURCE level nodes

Returns all RESOURCE level nodes that are impacted by a change in the source node. The number of tables and fields that are impacted for each resource are included as metadata. The id (QRI) can be on any level (FIELD, TABLE or RESOURCE) and the impact will be collected based on the starting QRI.

Facts
	Rate limit	Special (20 requests per minute)
Query Parameters
down
integer

The number of downstream resource levels nodes to retrieve. (5 if not provided, -1 means unlimited and 1 means direct lineage)

default = 5, default = 5

Path Parameters
id
string
Required

The qri for root node.

Responses
200

Successful Operation.

application/json
object
Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
403

User does not have access to the node.

application/json
object
Show application/json properties
404

The record is not found.

application/json
object
Show application/json properties
429

Too many requests

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
503

Service unavailable

application/json
object
Show application/json properties
GET
/api/v1/lineage-graphs/impact/{id}/overview
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


await qlik.lineageGraphs.getLineageGraphImpactOverview(
  'qri:app:sense://e5c651d5-1198-45a2-be5d-f016cee0baf5',
  {},
)
Example Response
{
  "graph": {
    "type": "RESOURCE",
    "edges": [
      {
        "id": "1",
        "source": "qri:app:sense://e5c651d5-1198-45a2-be5d-f016cee0baf5",
        "target": "qri:app:sense://e5c651d5-1198-45a2-be5d-f016cee0baf5",
        "metadata": {
          "type": "string"
        },
        "relation": [
          "LOAD",
          "STORE",
          "READ",
          "FROM"
        ]
      }
    ],
    "label": "Sales Data",
    "nodes": "{\"qri:app:sense://3634fc0d-273d-429e-8d0b-1b4b1b66a1f2\":{\"label\":\"a\",\"metadata\":{\"id\":\"qri:app:sense://3634fc0d-273d-429e-8d0b-1b4b1b66a1f2\",\"subtype\":\"PROCESSOR\",\"type\":\"DA_APP\",\"filePath\":\"example.qvd\"}}}",
    "directed": true,
    "metadata": {
      "total": 1,
      "createdAt": "2023-10-05T14:48:00.000Z",
      "producerId": "qri:db:oracle://LfxVj_3du3GYdWdNaa721lOWvbhENXEArBpl58h96YE#ZfH0lkXnTTGu7QGnIvKZpIxFNagQivBtnbC_cAoCPOs",
      "specVersion": 1,
      "producerType": [
        "QDA",
        "EXTERNAL"
      ]
    }
  }
}
Get impact sources

Returns all levels of the requested root node. Only node information will be returned.

Facts
	Rate limit	Special (20 requests per minute)
Path Parameters
id
string
Required

The id (QRI) for root node.

Responses
200

Successful Operation.

application/json
object
Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
403

User does not have access to the node.

application/json
object
Show application/json properties
404

The record is not found.

application/json
object
Show application/json properties
429

Too many requests

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
503

Service unavailable

application/json
object
Show application/json properties
GET
/api/v1/lineage-graphs/impact/{id}/source
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


await qlik.lineageGraphs.getLineageGraphImpactSource(
  'qri:app:sense://e5c651d5-1198-45a2-be5d-f016cee0baf5',
)
Example Response
{
  "graphs": {
    "graphs": [
      {
        "type": "RESOURCE",
        "edges": [
          {
            "id": "1",
            "source": "qri:app:sense://e5c651d5-1198-45a2-be5d-f016cee0baf5",
            "target": "qri:app:sense://e5c651d5-1198-45a2-be5d-f016cee0baf5",
            "metadata": {
              "type": "string"
            },
            "relation": [
              "LOAD",
              "STORE",
              "READ",
              "FROM"
            ]
          }
        ],
        "label": "Sales Data",
        "nodes": "{\"qri:app:sense://3634fc0d-273d-429e-8d0b-1b4b1b66a1f2\":{\"label\":\"a\",\"metadata\":{\"id\":\"qri:app:sense://3634fc0d-273d-429e-8d0b-1b4b1b66a1f2\",\"subtype\":\"PROCESSOR\",\"type\":\"DA_APP\",\"filePath\":\"example.qvd\"}}}",
        "directed": true,
        "metadata": {
          "total": 1,
          "createdAt": "2023-10-05T14:48:00.000Z",
          "producerId": "qri:db:oracle://LfxVj_3du3GYdWdNaa721lOWvbhENXEArBpl58h96YE#ZfH0lkXnTTGu7QGnIvKZpIxFNagQivBtnbC_cAoCPOs",
          "specVersion": 1,
          "producerType": [
            "QDA",
            "EXTERNAL"
          ]
        }
      }
    ]
  }
}
Get lineage graphs

Returns lineage graphs of a source node. The id (QRI) can point to an item on the field, table and resource level.

Facts
	Rate limit	Special (20 requests per minute)
Query Parameters
collapse
boolean

To collapse internal nodes, set to true, false otherwise.

default = true

level
string

The graph level to retrieve.

Can be one of: "field""table""resource""all"

default = "resource"

up
integer

The number of upstream levels of nodes to retrieve. (5 if not provided, -1 means unlimited)

default = 5, default = 5

Path Parameters
id
string
Required

The id (QRI) for the source node.

Responses
200

Successful Operation.

application/json
object

Populating graph property on single level request and graphs property on multi level requests.

Show application/json properties
400

The request is in incorrect format

application/json
object
Show application/json properties
403

User does not have access to the node.

application/json
object
Show application/json properties
404

The record is not found.

application/json
object
Show application/json properties
429

Too many requests

application/json
object
Show application/json properties
500

Internal server error

application/json
object
Show application/json properties
503

Service unavailable

application/json
object
Show application/json properties
GET
/api/v1/lineage-graphs/nodes/{id}
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


await qlik.lineageGraphs.getLineageGraphNode(
  'qri:app:sense://e5c651d5-1198-45a2-be5d-f016cee0baf5',
  {},
)
Example Response
{
  "graph": {
    "type": "RESOURCE",
    "edges": [
      {
        "id": "1",
        "source": "qri:app:sense://e5c651d5-1198-45a2-be5d-f016cee0baf5",
        "target": "qri:app:sense://e5c651d5-1198-45a2-be5d-f016cee0baf5",
        "metadata": {
          "type": "string"
        },
        "relation": [
          "LOAD",
          "STORE",
          "READ",
          "FROM"
        ]
      }
    ],
    "label": "Sales Data",
    "nodes": "{\"qri:app:sense://3634fc0d-273d-429e-8d0b-1b4b1b66a1f2\":{\"label\":\"a\",\"metadata\":{\"id\":\"qri:app:sense://3634fc0d-273d-429e-8d0b-1b4b1b66a1f2\",\"subtype\":\"PROCESSOR\",\"type\":\"DA_APP\",\"filePath\":\"example.qvd\"}}}",
    "directed": true,
    "metadata": {
      "total": 1,
      "createdAt": "2023-10-05T14:48:00.000Z",
      "producerId": "qri:db:oracle://LfxVj_3du3GYdWdNaa721lOWvbhENXEArBpl58h96YE#ZfH0lkXnTTGu7QGnIvKZpIxFNagQivBtnbC_cAoCPOs",
      "specVersion": 1,
      "producerType": [
        "QDA",
        "EXTERNAL"
      ]
    }
  },
  "graphs": {
    "graphs": [
      {
        "type": "RESOURCE",
        "edges": [
          {
            "id": "1",
            "source": "qri:app:sense://e5c651d5-1198-45a2-be5d-f016cee0baf5",
            "target": "qri:app:sense://e5c651d5-1198-45a2-be5d-f016cee0baf5",
            "metadata": {
              "type": "string"
            },
            "relation": [
              "LOAD",
              "STORE",
              "READ",
              "FROM"
            ]
          }
        ],
        "label": "Sales Data",
        "nodes": "{\"qri:app:sense://3634fc0d-273d-429e-8d0b-1b4b1b66a1f2\":{\"label\":\"a\",\"metadata\":{\"id\":\"qri:app:sense://3634fc0d-273d-429e-8d0b-1b4b1b66a1f2\",\"subtype\":\"PROCESSOR\",\"type\":\"DA_APP\",\"filePath\":\"example.qvd\"}}}",
        "directed": true,
        "metadata": {
          "total": 1,
          "createdAt": "2023-10-05T14:48:00.000Z",
          "producerId": "qri:db:oracle://LfxVj_3du3GYdWdNaa721lOWvbhENXEArBpl58h96YE#ZfH0lkXnTTGu7QGnIvKZpIxFNagQivBtnbC_cAoCPOs",
          "specVersion": 1,
          "producerType": [
            "QDA",
            "EXTERNAL"
          ]
        }
      }
    ]
  }
}
Get expanded node and its edges

Returns the expanded node and its edges. Up and downstream nodes are not part of the response, edges are. The id is the root node that lineage is requested for. The QRI of the node to expand is sent as the query parameter "node" for expansion.

Facts
	Rate limit	Special (20 requests per minute)
Query Parameters
level
string
Required

The level to expand to.

Can be one of: "field""table"

default = "table"

node
string
Required

The QRI of the node in the upstream graph for expansion.

collapse
boolean

To collapse internal nodes, set to true, false otherwise.

default = true

up
integer

The number of upstream levels of nodes retrieved to expand. (5 if not provided, -1 means unlimited)

default = 5, default = 5

Path Parameters
id
string
Required

The id (QRI) for the source node.

Responses
200

Successful Operation.

application/json
object
Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
403

User does not have access to the node.

application/json
object
Show application/json properties
404

The record is not found.

application/json
object
Show application/json properties
429

Too many requests

application/json
object
Show application/json properties
500

Internal server error

application/json
object
Show application/json properties
503

Service unavailable

application/json
object
Show application/json properties
GET
/api/v1/lineage-graphs/nodes/{id}/actions/expand
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


await qlik.lineageGraphs.expandLineageGraphNode(
  'qri:app:sense://e5c651d5-1198-45a2-be5d-f016cee0baf5',
  { level: 'field', node: 'string' },
)
Example Response
{
  "graph": {
    "type": "RESOURCE",
    "edges": [
      {
        "id": "1",
        "source": "qri:app:sense://e5c651d5-1198-45a2-be5d-f016cee0baf5",
        "target": "qri:app:sense://e5c651d5-1198-45a2-be5d-f016cee0baf5",
        "metadata": {
          "type": "string"
        },
        "relation": [
          "LOAD",
          "STORE",
          "READ",
          "FROM"
        ]
      }
    ],
    "label": "Sales Data",
    "nodes": "{\"qri:app:sense://3634fc0d-273d-429e-8d0b-1b4b1b66a1f2\":{\"label\":\"a\",\"metadata\":{\"id\":\"qri:app:sense://3634fc0d-273d-429e-8d0b-1b4b1b66a1f2\",\"subtype\":\"PROCESSOR\",\"type\":\"DA_APP\",\"filePath\":\"example.qvd\"}}}",
    "directed": true,
    "metadata": {
      "total": 1,
      "createdAt": "2023-10-05T14:48:00.000Z",
      "producerId": "qri:db:oracle://LfxVj_3du3GYdWdNaa721lOWvbhENXEArBpl58h96YE#ZfH0lkXnTTGu7QGnIvKZpIxFNagQivBtnbC_cAoCPOs",
      "specVersion": 1,
      "producerType": [
        "QDA",
        "EXTERNAL"
      ]
    }
  }
}
Search all labels

Returns result per level by searching all labels within a lineage graph on all available levels.

Facts
	Rate limit	Special (20 requests per minute)
Query Parameters
filter
string
Required

The expression that matches the SCIM filter format. The filter has to be encoded. The currently supported attribute is "label", attribute operator "co" (contains), and grouping operator "or". Example: 'label co "label1" or label co "label2"'. The search queries are case insensitive.

collapse
boolean

To collapse internal nodes, set to true, false otherwise.

default = true

up
integer

The number of upstream levels of nodes retrieved to search. (5 if not provided, -1 means unlimited)

default = 5, default = 5

Path Parameters
id
string
Required

The qri for root node.

Responses
200

Successful Operation.

application/json
object
Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
403

User does not have access to the node.

application/json
object
Show application/json properties
404

The record is not found.

application/json
object
Show application/json properties
429

Too many requests

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
503

Service unavailable

application/json
object
Show application/json properties
GET
/api/v1/lineage-graphs/nodes/{id}/actions/search
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


await qlik.lineageGraphs.searchLineageGraphNode(
  'qri:app:sense://e5c651d5-1198-45a2-be5d-f016cee0baf5',
  {
    filter:
      'label co "label1" or label co "label2"',
  },
)
Example Response
{
  "graphs": {
    "graphs": [
      {
        "type": "RESOURCE",
        "edges": [
          {
            "id": "1",
            "source": "qri:app:sense://e5c651d5-1198-45a2-be5d-f016cee0baf5",
            "target": "qri:app:sense://e5c651d5-1198-45a2-be5d-f016cee0baf5",
            "metadata": {
              "type": "string"
            },
            "relation": [
              "LOAD",
              "STORE",
              "READ",
              "FROM"
            ]
          }
        ],
        "label": "Sales Data",
        "nodes": "{\"qri:app:sense://3634fc0d-273d-429e-8d0b-1b4b1b66a1f2\":{\"label\":\"a\",\"metadata\":{\"id\":\"qri:app:sense://3634fc0d-273d-429e-8d0b-1b4b1b66a1f2\",\"subtype\":\"PROCESSOR\",\"type\":\"DA_APP\",\"filePath\":\"example.qvd\"}}}",
        "directed": true,
        "metadata": {
          "total": 1,
          "createdAt": "2023-10-05T14:48:00.000Z",
          "producerId": "qri:db:oracle://LfxVj_3du3GYdWdNaa721lOWvbhENXEArBpl58h96YE#ZfH0lkXnTTGu7QGnIvKZpIxFNagQivBtnbC_cAoCPOs",
          "specVersion": 1,
          "producerType": [
            "QDA",
            "EXTERNAL"
          ]
        }
      }
    ]
  }
}
Get lineage overview

Returns the first generation upstream direct lineage. For each field QRI, will find any direct linege dataset or application.

Facts
	Rate limit	Tier 2 (100 requests per minute)
Query Parameters
collapse
boolean

To collapse internal nodes, set to true, false otherwise.

default = true

up
integer

The number of upstream levels of nodes retrieved to get overview from. (5 if not provided, -1 means unlimited)

default = 5, default = 5

Path Parameters
id
string
Required

The qri for root node.

Request Body
application/json
array of strings

List of qri to find direct lineage for.

Responses
200

Successful Operation.

application/json
object
Show application/json properties
201

Successfully created new resource.

application/json
object
207

Request partially succeeded.

application/json
object
Show application/json properties
400

The request is in incorrect format.

application/json
object
Show application/json properties
403

User does not have access to the node.

application/json
object
Show application/json properties
404

The record is not found.

application/json
object
Show application/json properties
500

Internal server error.

application/json
object
Show application/json properties
503

Service unavailable

application/json
object
Show application/json properties
POST
/api/v1/lineage-graphs/nodes/{id}/overview
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


await qlik.lineageGraphs.createLineageGraphNodeOverview(
  'qri:app:sense://e5c651d5-1198-45a2-be5d-f016cee0baf5',
  {},
  [
    'qri:app:sense://e5c651d5-1198-45a2-be5d-f016cee0baf5',
  ],
)
Example Response
{
  "resources": [
    {
      "qri": "qri:app:sense://e5c651d5-1198-45a2-be5d-f016cee0baf5",
      "lineage": [
        {
          "tableQRI": "qri:app:sense://e5c651d5-1198-45a2-be5d-f016cee0baf5",
          "tableLabel": "Sales Table",
          "resourceQRI": "qri:app:sense://e5c651d5-1198-45a2-be5d-f016cee0baf5",
          "resourceLabel": "Sales Data"
        }
      ]
    }
  ]
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